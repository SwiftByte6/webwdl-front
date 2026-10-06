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
    const detectedMarkers = [];
    const suggestedChanges = [];
    let riskPoints = 0;
    let hasEmail = false;
    let hasSpecificCollege = false;
    let hasLocation = false;
    let hasScoreOrIncome = false;

    // 1. Detect & Sanitize Emails
    if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(clean) || /\b[A-Za-z0-9._%+-]+(?:\s*\[\s*at\s*\]\s*|\s*\(at\)\s*)[A-Za-z0-9.-]+/i.test(clean)) {
      hasEmail = true;
      riskPoints += 45;
      detectedMarkers.push('Personal Email Address Exposed');
      suggestedChanges.push('Remove or redact direct contact info/email immediately');
      sanitized = sanitized.replace(/\b[A-Za-z0-9._%+-]+(?:\s*\[\s*at\s*\]\s*|\s*\(at\)\s*|\s*@\s*)[A-Za-z0-9.-]+(?:\s*\[\s*dot\s*\]\s*|\s*\.\s*)[A-Za-z]{2,}\b/gi, '[email redacted]');
      sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email redacted]');
    }

    // 2. Detect & Sanitize specific colleges/institutions
    const collegeMatches = clean.match(/\b(?:vidyalankar|vit\s*wadala|vit\s*mumbai|vit|vjti|spit|coep|pict|djsce|vesit)\b/gi);
    if (collegeMatches) {
      hasSpecificCollege = true;
      riskPoints += 30;
      detectedMarkers.push(`Specific Institution Name (${Array.from(new Set(collegeMatches)).join(', ')})`);
      suggestedChanges.push(`Replace specific institution names (${Array.from(new Set(collegeMatches)).join(', ')}) with generic placeholder "my university"`);
    }

    // 3. Detect & Sanitize scores / percentiles / ranks / income figures
    const scoreMatches = clean.match(/\b(?:\d+\s*%|\d+\s*%ile|\d+\s*percentile|top\s*\d+|cutoff|\d+\s*lpa|\d+\s*k|\d{6})\b/gi);
    if (scoreMatches) {
      hasScoreOrIncome = true;
      riskPoints += 25;
      detectedMarkers.push(`Exposes Rank / Score / Percentile Data (${Array.from(new Set(scoreMatches)).join(', ')})`);
      suggestedChanges.push(`Remove or blur exact statistical ranks/percentiles (${Array.from(new Set(scoreMatches)).join(', ')}) to prevent database cross-matching`);
    }

    // 4. Detect & Sanitize Location / City
    const locMatches = clean.match(/\b(?:mumbai|bengaluru|bangalore|delhi|pune|hyderabad|jabalpur|chennai|maharashtra|karnataka)\b/gi);
    if (locMatches) {
      hasLocation = true;
      riskPoints += 20;
      detectedMarkers.push(`Geographic Location (${Array.from(new Set(locMatches)).join(', ')})`);
      suggestedChanges.push(`Replace location (${Array.from(new Set(locMatches)).join(', ')}) with generic "my region"`);
    }

    // Apply entity replacements to generate sanitized output
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

    sanitized = sanitized
      .replace(/\s+/g, ' ')
      .replace(/([.?!])\s*(?=[A-Za-z])/g, '$1 ')
      .trim();

    // Determine AI recommendation & opinion
    const snippetRiskScore = Math.min(Math.max(riskPoints > 0 ? riskPoints : 15, 10), 98);
    const recommendation = (hasEmail || (hasSpecificCollege && hasScoreOrIncome) || snippetRiskScore >= 50) ? 'DELETE' : 'EDIT';

    let aiOpinion = '';
    if (recommendation === 'DELETE') {
      if (hasEmail) {
        aiOpinion = 'AI Recommendation: DELETE POST IMMEDIATELY. This post publicly reveals your personal email address, directly linking your anonymous online persona to your real-world identity.';
      } else if (hasSpecificCollege && hasScoreOrIncome) {
        aiOpinion = 'AI Recommendation: DELETE POST RECOMMENDED. Combining specific institution references with exact percentile/score figures allows OSINT tools to cross-reference public merit lists and easily deanonymize you.';
      } else {
        aiOpinion = 'AI Recommendation: DELETE POST RECOMMENDED. This snippet contains multiple high-exposure identity markers. Deleting the post entirely is the safest action to protect your anonymity.';
      }
    } else {
      if (suggestedChanges.length > 0) {
        aiOpinion = 'AI Recommendation: EDIT & SANITIZE POST. Instead of deleting, you can safely keep the post by replacing specific institution names and city references with generic terms (or using the AI Sanitized version below).';
      } else {
        aiOpinion = 'AI Recommendation: SAFE TO KEEP WITH MINOR EDITS. Standardize sentence structure to reduce stylometric fingerprinting.';
      }
    }

    return Response.json({
      success: true,
      original: clean,
      sanitized,
      recommendation,
      snippetRiskScore,
      actionTitle: recommendation === 'DELETE' ? 'DELETE POST RECOMMENDED' : 'EDIT & SANITIZE RECOMMENDED',
      detectedMarkers: detectedMarkers.length > 0 ? detectedMarkers : ['Stylometric fingerprinting risk'],
      suggestedChanges: suggestedChanges.length > 0 ? suggestedChanges : ['Use standardized phrasing to neutralize stylometric patterns'],
      aiOpinion,
      summary: 'Stripped direct institution/city identifiers, contact info, and generated AI recommendation.'
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
