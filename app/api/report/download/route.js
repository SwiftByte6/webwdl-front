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

    // Write input JSON to temporary file
    fs.writeFileSync(tempJsonPath, JSON.stringify(reportData, null, 2), 'utf-8');

    const scriptPath = path.join(process.cwd(), 'scripts', 'generate_report.py');

    // Run Python generator script
    await new Promise((resolve, reject) => {
      exec(`python "${scriptPath}" "${tempJsonPath}" "${tempHtmlPath}"`, (err, stdout, stderr) => {
        if (err) {
          console.error('Python report generation error:', stderr);
          return reject(err);
        }
        resolve(stdout);
      });
    });

    if (!fs.existsSync(tempHtmlPath)) {
      throw new Error('Generated report file not found.');
    }

    const htmlContent = fs.readFileSync(tempHtmlPath, 'utf-8');

    // Cleanup temp files
    try {
      fs.unlinkSync(tempJsonPath);
      fs.unlinkSync(tempHtmlPath);
    } catch (_) {}

    return new Response(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="privacy_audit_report_${reportData.user.reddit_username || reportData.user.github_username || 'user'}.html"`
      }
    });
  } catch (err) {
    console.error('Download report error:', err);
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
