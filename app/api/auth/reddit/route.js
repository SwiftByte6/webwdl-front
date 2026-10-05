import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/risk-report';

  const clientId = process.env.REDDIT_CLIENT_ID;
  const redirectUri = process.env.REDDIT_REDIRECT_URI || `${new URL(request.url).origin}/api/auth/reddit/callback`;

  // If OAuth credentials are configured in .env, redirect to official Reddit OAuth
  if (clientId) {
    const state = Buffer.from(JSON.stringify({ returnTo, nonce: Math.random().toString(36).substring(7) })).toString('base64');
    const redditAuthUrl = new URL('https://www.reddit.com/api/v1/authorize');
    redditAuthUrl.searchParams.set('client_id', clientId);
    redditAuthUrl.searchParams.set('response_type', 'code');
    redditAuthUrl.searchParams.set('state', state);
    redditAuthUrl.searchParams.set('redirect_uri', redirectUri);
    redditAuthUrl.searchParams.set('duration', 'temporary');
    redditAuthUrl.searchParams.set('scope', 'identity');

    return NextResponse.redirect(redditAuthUrl.toString());
  }

  // If no clientId configured, fallback gracefully with a message or redirect to login
  return NextResponse.redirect(new URL('/login?error=reddit_oauth_not_configured', request.url));
}
