import { getCurrentUser, updateUserHandles } from '@/lib/db.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const pendingVerifications = new Map();

// GET /api/auth/verify?username=... -> generates a verification code
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get('username') || '').replace(/^(?:@|\/?u\/)/i, '').trim();

  if (!username) {
    return Response.json({ success: false, error: 'Username is required' }, { status: 400 });
  }

  const token = `deanon-verify-${Math.random().toString(36).substring(2, 8)}`;
  pendingVerifications.set(username.toLowerCase(), {
    token,
    createdAt: Date.now()
  });

  return Response.json({
    success: true,
    username,
    token,
    instructions: `Add the verification token "${token}" to your Reddit profile Bio or About section on reddit.com/settings/profile, then click "Verify Ownership".`
  });
}

// POST /api/auth/verify -> checks reddit.com/user/<username>/about.json for token
export async function POST(request) {
  try {
    const body = await request.json();
    const username = (body.username || '').replace(/^(?:@|\/?u\/)/i, '').trim();
    const githubUsername = (body.github_username || '').replace(/^@/, '').trim();

    if (!username) {
      return Response.json({ success: false, error: 'Reddit username is required' }, { status: 400 });
    }

    const pending = pendingVerifications.get(username.toLowerCase());
    const expectedToken = pending ? pending.token : body.token;

    if (!expectedToken) {
      return Response.json({
        success: false,
        error: 'No active verification token. Please generate a verification token first.'
      }, { status: 400 });
    }

    // Check Reddit public profile about.json
    const redditProfileUrl = `https://www.reddit.com/user/${encodeURIComponent(username)}/about.json`;
    const res = await fetch(redditProfileUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) WebLab-Verification/1.0'
      }
    });

    if (!res.ok) {
      if (res.status === 404) {
        return Response.json({ success: false, error: `Reddit user "u/${username}" not found.` }, { status: 404 });
      }
      return Response.json({ success: false, error: `Could not fetch Reddit profile (HTTP ${res.status}).` }, { status: 400 });
    }

    const data = await res.json();
    const profile = data.data || {};
    const bio = (profile.subreddit?.public_description || '') + ' ' + (profile.subreddit?.description || '') + ' ' + (profile.subreddit?.title || '');

    if (!bio.toLowerCase().includes(expectedToken.toLowerCase())) {
      return Response.json({
        success: false,
        verified: false,
        error: `Verification token "${expectedToken}" was not found in u/${username}'s profile bio. Make sure to save changes in your Reddit profile settings and try again.`
      }, { status: 400 });
    }

    // Token matched! Save session and link account
    pendingVerifications.delete(username.toLowerCase());
    const user = updateUserHandles('usr_current', githubUsername, username);

    return Response.json({
      success: true,
      verified: true,
      user
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
