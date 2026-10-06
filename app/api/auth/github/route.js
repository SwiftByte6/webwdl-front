import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const returnTo = new URL(request.url).searchParams.get('returnTo') || '/risk-report';
  if (!clientId) {
    return NextResponse.redirect(new URL('/login?error=github_oauth_not_configured', request.url));
  }

  const callback = process.env.GITHUB_REDIRECT_URI || `${new URL(request.url).origin}/api/auth/github/callback`;
  const state = Buffer.from(JSON.stringify({ returnTo, nonce: crypto.randomUUID() })).toString('base64url');
  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', callback);
  authUrl.searchParams.set('scope', 'read:user user:email');
  authUrl.searchParams.set('state', state);
  return NextResponse.redirect(authUrl);
}
