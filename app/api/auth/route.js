import { getCurrentUser, updateUserHandles, clearSession } from '@/lib/db.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = getCurrentUser();
  return Response.json({
    authenticated: Boolean(user),
    user: user || null
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const action = body.action || 'login';

    if (action === 'logout') {
      clearSession();
      return Response.json({
        success: true,
        authenticated: false,
        user: null
      });
    }

    const githubUsername = (body.github_username || '').trim();
    const redditUsername = (body.reddit_username || '').trim();

    if (!githubUsername && !redditUsername) {
      return Response.json({
        success: false,
        error: 'Please enter a GitHub or Reddit handle.'
      }, { status: 400 });
    }

    const user = updateUserHandles('usr_current', githubUsername, redditUsername);

    return Response.json({
      success: true,
      authenticated: true,
      user
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
