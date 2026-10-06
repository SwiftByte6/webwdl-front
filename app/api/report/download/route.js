import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const reportData = await request.json();

    if (!reportData || !reportData.user) {
      return Response.json({ success: false, error: 'Invalid report data provided.' }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    const tempId = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const tempJsonPath = path.join(tempDir, `${tempId}.json`);
    const tempHtmlPath = path.join(tempDir, `${tempId}.html`);
    const tempPdfPath = path.join(tempDir, `${tempId}.pdf`);

    // Write input JSON to temporary file
    fs.writeFileSync(tempJsonPath, JSON.stringify(reportData, null, 2), 'utf-8');

    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_report.py');

    // Run Python generator script with PDF output path
    await new Promise((resolve, reject) => {
      exec(`python "${scriptPath}" "${tempJsonPath}" "${tempHtmlPath}" "${tempPdfPath}"`, (err, stdout, stderr) => {
        if (err) {
          console.error('Python report generation error:', stderr);
          return reject(err);
        }
        resolve(stdout);
      });
    });

    const username = reportData.user.reddit_username || reportData.user.github_username || 'user';
    const isPdfAvailable = fs.existsSync(tempPdfPath) && fs.statSync(tempPdfPath).size > 0;

    let responseBuffer;
    let contentType;
    let filename;

    if (isPdfAvailable) {
      responseBuffer = fs.readFileSync(tempPdfPath);
      contentType = 'application/pdf';
      filename = `privacy_audit_report_${username}.pdf`;
    } else {
      throw new Error('PDF generation is unavailable on this server. Install Chrome/Edge or reportlab, then try again.');
    }

    // Cleanup temp files
    try {
      if (fs.existsSync(tempJsonPath)) fs.unlinkSync(tempJsonPath);
      if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
      if (fs.existsSync(tempPdfPath)) fs.unlinkSync(tempPdfPath);
    } catch (_) {}

    return new Response(responseBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (err) {
    console.error('Download report error:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
