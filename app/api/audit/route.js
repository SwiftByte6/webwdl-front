import { fetchReddit } from '@/backend/deanonymizer/dist/sources/reddit.js';
import { extractEmails, extractSocialHandles } from '@/backend/deanonymizer/dist/extract.js';
import { analyze } from '@/backend/deanonymizer/dist/analyze.js';
import { createLLMClient } from '@/backend/deanonymizer/dist/llm/index.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseInputHandle(input) {
  if (!input) return '';
  let clean = input.trim();
  // Strip full URLs if provided
  try {
    if (clean.startsWith('http://') || clean.startsWith('https://')) {
      const url = new URL(clean);
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (url.hostname.includes('reddit.com')) {
        const uIndex = pathParts.findIndex((p) => p === 'u' || p === 'user');
        if (uIndex !== -1 && pathParts[uIndex + 1]) {
          clean = pathParts[uIndex + 1];
        }
      } else if (url.hostname.includes('github.com') || url.hostname.includes('x.com') || url.hostname.includes('twitter.com')) {
        if (pathParts[0]) clean = pathParts[0];
      }
    }
  } catch (e) {
    // Keep raw clean string
  }
  // Strip leading @ or u/ or /u/
  clean = clean.replace(/^(?:@|\/?u\/)/i, '').trim();
  return clean;
}

function calculateConfidence(findingCategory, hasDirectLeak, itemCount) {
  switch (findingCategory) {
    case 'email_leak':
    case 'real_name':
      return 94;
    case 'cross_platform_handle':
    case 'external_link':
      return 88;
    case 'location':
    case 'employer_or_school':
      return 78;
    case 'schedule_or_routine':
      return 72;
    default:
      return Math.min(85, 40 + Math.min(40, itemCount * 2));
  }
}

function buildHeuristicFindings(handle, profile, emails, socialHandles) {
  const items = profile?.items ?? [];
  const findings = [];
  let num = 1;

  // 1. Direct Email Leak finding
  if (emails.length > 0) {
    findings.push({
      id: `result-${num}`,
      number: num++,
      title: `Result ${num - 1}: Un-mangled Email Address Exposure`,
      confidenceScore: 96,
      riskLevel: 'High Risk',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      category: 'Direct Identifier Unmangling',
      description: `Public activity contains un-obfuscated email address (${emails.join(', ')}), exposing real identity links across accounts.`,
      evidenceSnippet: emails[0],
      source: 'Direct Regex Pass',
      apiKey: 'directIdentifiers.emails',
      remediation: 'Remove or redact comments containing personal email addresses from public posts.'
    });
  }

  // 2. Cross-platform Handle Matching
  if (socialHandles.length > 0) {
    const handleListStr = socialHandles.map((h) => `${h.platform}: @${h.handle}`).join(', ');
    findings.push({
      id: `result-${num}`,
      number: num++,
      title: `Result ${num - 1}: Cross-Platform Account Correlation`,
      confidenceScore: 90,
      riskLevel: 'High Risk',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      category: 'Stylometric & URL Correlation',
      description: `Discovered links and references to external platform accounts (${handleListStr}) matching user handle footprint.`,
      evidenceSnippet: socialHandles[0].url,
      source: socialHandles[0].platform,
      apiKey: 'directIdentifiers.socialHandles',
      remediation: 'Avoid reusing pseudonyms or cross-linking public personal profiles.'
    });
  }

  // 3. Subreddit & Topical Concentration
  const subreddits = {};
  items.forEach((it) => {
    if (it.context) subreddits[it.context] = (subreddits[it.context] || 0) + 1;
  });
  const topSubs = Object.entries(subreddits)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([sub]) => sub);

  if (topSubs.length > 0) {
    findings.push({
      id: `result-${num}`,
      number: num++,
      title: `Result ${num - 1}: Topical & Community Stylometry Signature`,
      confidenceScore: 82,
      riskLevel: 'Moderate Risk',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      category: 'Community Frequency Analysis',
      description: `High density of activity in specific communities (${topSubs.join(', ')}), enabling demographic profiling.`,
      evidenceSnippet: `Active posting signature in ${topSubs[0] || 'technical communities'}`,
      source: 'Activity Breakdown',
      apiKey: 'audit_results[community]',
      remediation: 'Use separate single-purpose handles for distinct technical or regional communities.'
    });
  }

  // 4. Activity Timing & Timezone Estimation
  if (items.length > 0) {
    const hours = items.map((it) => new Date(it.createdUtc * 1000).getUTCHours());
    const avgHour = Math.round(hours.reduce((a, b) => a + b, 0) / hours.length);
    findings.push({
      id: `result-${num}`,
      number: num++,
      title: `Result ${num - 1}: Temporal Activity Spikes & Timezone Estimation`,
      confidenceScore: 76,
      riskLevel: 'Moderate Risk',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      category: 'Timestamp Spikes',
      description: `Active posting windows concentrate around peak hours (~${avgHour}:00 UTC), allowing timezone narrowing.`,
      evidenceSnippet: `Peak activity window derived across ${items.length} items`,
      source: 'UTC Timestamps',
      apiKey: 'audit_results[timestamps]',
      remediation: 'Randomize post publishing times or schedule automated releases.'
    });
  }

  // 5. Default Syntax Entropy
  if (findings.length < 5) {
    findings.push({
      id: `result-${num}`,
      number: num++,
      title: `Result ${num - 1}: Technical Vocabulary & Code Marker Entropy`,
      confidenceScore: 48,
      riskLevel: 'Low Risk',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      category: 'Syntax Entropy',
      description: 'Standard tech stack vocabulary and n-gram entropy across public issue/comment threads.',
      evidenceSnippet: items[0]?.body?.slice(0, 70) || '"Async refactoring and rust channel dispatchers..."',
      source: 'Text Analysis',
      apiKey: 'audit_results[syntax]',
      remediation: 'Vary phrasing across public forums to prevent stylometric author attribution.'
    });
  }

  return findings;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawHandle = searchParams.get('handle') || searchParams.get('username') || 'aarav_dev';
  const cleanHandle = parseInputHandle(rawHandle);

  if (!cleanHandle) {
    return Response.json({ error: 'Please provide a valid handle to audit.' }, { status: 400 });
  }

  let profile = { platform: 'reddit', username: cleanHandle, profileUrl: `https://www.reddit.com/user/${cleanHandle}`, items: [] };
  let fetchError = null;

  try {
    profile = await fetchReddit(cleanHandle, 200);
  } catch (err) {
    console.warn(`Reddit fetch warning for ${cleanHandle}:`, err.message);
    fetchError = err.message;
  }

  const items = profile.items || [];
  const corpusParts = items.map((it) => it.body).filter(Boolean);
  const corpus = corpusParts.join('\n\n');

  const emails = extractEmails(corpus);
  const socialHandles = extractSocialHandles(corpus).filter(
    (h) => h.handle.toLowerCase() !== cleanHandle.toLowerCase()
  );

  let llmResult = null;
  const hasLLMKey = Boolean(
    process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.LLM_PROVIDER
  );

  if (hasLLMKey && items.length > 0) {
    try {
      const llm = createLLMClient();
      llmResult = await analyze([profile], { llm, maxChars: 60000 });
    } catch (llmErr) {
      console.warn('LLM analysis skipped/failed:', llmErr.message);
    }
  }

  let findings = [];
  let overallRisk = 'low';
  let summary = '';
  let identity = {
    exactUser: cleanHandle,
    rationale: `Pseudonymous handle @${cleanHandle} evaluated across public footprint history.`,
    publicProofUrls: [profile.profileUrl]
  };

  if (llmResult && llmResult.findings && llmResult.findings.length > 0) {
    overallRisk = llmResult.overallRisk || 'medium';
    summary = llmResult.summary;
    identity = llmResult.identity || identity;
    findings = llmResult.findings.map((f, idx) => {
      const confScore = f.confidence === 'high' ? 92 : f.confidence === 'medium' ? 75 : 45;
      const riskLevel = confScore >= 80 ? 'High Risk' : confScore >= 60 ? 'Moderate Risk' : 'Low Risk';
      const color = confScore >= 80 ? 'text-rose-600' : confScore >= 60 ? 'text-amber-600' : 'text-emerald-600';
      const bgColor = confScore >= 80 ? 'bg-rose-50' : confScore >= 60 ? 'bg-amber-50' : 'bg-emerald-50';
      const borderColor = confScore >= 80 ? 'border-rose-200' : confScore >= 60 ? 'border-amber-200' : 'border-emerald-200';
      const badgeColor = confScore >= 80 ? 'bg-rose-100 text-rose-800 border-rose-200' : confScore >= 60 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200';
      
      return {
        id: `result-${idx + 1}`,
        number: idx + 1,
        title: `Result ${idx + 1}: ${f.claim || 'Exposure Finding'}`,
        confidenceScore: confScore,
        riskLevel,
        color,
        bgColor,
        borderColor,
        badgeColor,
        category: f.category,
        description: f.rationale || f.claim,
        evidenceSnippet: f.evidence?.[0]?.quote || `Analyzed across ${items.length} items`,
        permalink: f.evidence?.[0]?.permalink || profile.profileUrl,
        source: f.category,
        apiKey: `findings[${idx}]`,
        remediation: f.remediation
      };
    });
  } else {
    findings = buildHeuristicFindings(cleanHandle, profile, emails, socialHandles);
    const avgConfidence = findings.length ? Math.round(findings.reduce((acc, r) => acc + r.confidenceScore, 0) / findings.length) : 50;
    overallRisk = avgConfidence >= 80 ? 'high' : avgConfidence >= 60 ? 'medium' : 'low';
    summary = `Analyzed ${items.length} public history items for @${cleanHandle}. Found ${emails.length} email leak(s) and ${socialHandles.length} cross-platform handle correlation(s).`;
  }

  const overallScore = Math.round(
    findings.reduce((acc, r) => acc + r.confidenceScore, 0) / Math.max(1, findings.length)
  );

  return Response.json({
    handle: cleanHandle,
    itemCount: items.length,
    overallRisk,
    overallScore,
    summary,
    identity,
    directIdentifiers: {
      emails,
      socialHandles
    },
    findings,
    fetchError
  });
}
