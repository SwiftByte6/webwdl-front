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

    if (action === 'disconnect' || action === 'update_platform') {
      const current = getCurrentUser();
      if (!current) return Response.json({ success: false, error: 'No active session.' }, { status: 401 });
      const platform = body.platform;
      if (!['github', 'reddit', 'hackernews'].includes(platform)) return Response.json({ success: false, error: 'Unsupported platform.' }, { status: 400 });
      const value = action === 'disconnect' ? '' : String(body.username || '').trim();
      const handles = {
        github: current.github_username || '',
        reddit: current.reddit_username || '',
        hackernews: current.hackernews_username || ''
      };
      handles[platform] = value;
      const user = updateUserHandles(current.id, handles.github, handles.reddit, handles.hackernews);
      return Response.json({ success: true, authenticated: true, user });
    }

    const githubUsername = (body.github_username || '').trim();
    const redditUsername = (body.reddit_username || '').trim();
    const hackernewsUsername = (body.hackernews_username || '').trim();

    if (!githubUsername && !redditUsername && !hackernewsUsername) {
      return Response.json({
        success: false,
        error: 'Please enter a GitHub or Reddit handle.'
      }, { status: 400 });
    }

    const user = updateUserHandles('usr_current', githubUsername, redditUsername, hackernewsUsername);

    return Response.json({
      success: true,
      authenticated: true,
      user
    });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 });
  }
}
