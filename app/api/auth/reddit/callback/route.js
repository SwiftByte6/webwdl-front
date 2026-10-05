import { NextResponse } from 'next/server';
import { getCurrentUser, updateUserHandles } from '@/lib/db.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const stateRaw = searchParams.get('state');

  let returnTo = '/risk-report';
  if (stateRaw) {
    try {
      const parsedState = JSON.parse(Buffer.from(stateRaw, 'base64').toString('utf8'));
      if (parsedState.returnTo) returnTo = parsedState.returnTo;
    } catch {}
  }

  if (error || !code) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error || 'access_denied')}`, request.url));
  }

  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const redirectUri = process.env.REDDIT_REDIRECT_URI || `${new URL(request.url).origin}/api/auth/reddit/callback`;

  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'WebLab-Privacy-Auditor/1.0'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      }).toString()
    });

    if (!tokenRes.ok) {
      throw new Error(`Token exchange failed: ${tokenRes.status}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const userRes = await fetch('https://oauth.reddit.com/api/v1/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'WebLab-Privacy-Auditor/1.0'
      }
    });

    if (!userRes.ok) {
      throw new Error(`Failed to fetch user profile: ${userRes.status}`);
    }

    const userData = await userRes.json();
    const redditUsername = userData.name;

    const currentUser = getCurrentUser();
    updateUserHandles(currentUser ? currentUser.id : 'usr_current', currentUser ? (currentUser.github_username || '') : '', redditUsername);

    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (err) {
    console.error('Reddit OAuth callback error:', err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message)}`, request.url));
  }
}
