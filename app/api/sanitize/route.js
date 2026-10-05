export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { text, type } = await request.json();

    if (!text || typeof text !== 'string') {
      return Response.json({ success: false, error: 'Text is required' }, { status: 400 });
    }

    // Clean up snippet quotes or prefixes
    let clean = text.replace(/^(?:Comment text snippet: |Mention of location in comment: )/i, '').replace(/^"|"$/g, '').replace(/^\.\.\.|\.\.\.$/g, '').trim();

    let sanitized = clean;

    // 1. Sanitize Emails
    sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+(?:\s*\[\s*at\s*\]\s*|\s*\(at\)\s*|\s*@\s*)[A-Za-z0-9.-]+(?:\s*\[\s*dot\s*\]\s*|\s*\.\s*)[A-Za-z]{2,}\b/gi, '[email redacted]');
    sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email redacted]');

    // 2. Sanitize specific institution / city entities into generic equivalents
    const replacements = [
      { regex: /\b(?:vidyalankar|vit\s*wadala|vit\s*mumbai|vjti|spit|coep|pict|djsce|vesit)\b/gi, replacement: 'my university' },
      { regex: /\b(?:mumbai|bengaluru|bangalore|delhi|pune|hyderabad|jabalpur|chennai)\b/gi, replacement: 'my city' },
      { regex: /\b(?:maharashtra|karnataka|delhi\s*ncr)\b/gi, replacement: 'my region' },
      { regex: /\b(?:mht_cet|cet|jeeneetards|jee|icpc|gate)\b/gi, replacement: 'competitive exams' },
      { regex: /\b(?:cloudscale|tcs|infosys|wipro)\b/gi, replacement: 'a tech company' }
    ];

    replacements.forEach(({ regex, replacement }) => {
      sanitized = sanitized.replace(regex, replacement);
    });

    // 3. Stylometric normalization
    sanitized = sanitized
      .replace(/\s+/g, ' ')
      .replace(/([.?!])\s*(?=[A-Za-z])/g, '$1 ')
      .trim();

    return Response.json({
      success: true,
      original: clean,
      sanitized,
      summary: 'Stripped direct institution/city identifiers, contact info, and normalized stylometric markers.'
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
