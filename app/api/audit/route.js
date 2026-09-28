import {
  getCurrentUser,
  updateUserHandles,
  saveGithubData,
  saveRedditData,
  getGithubData,
  getRedditData
} from '@/lib/db.js';
import { runSeed } from '@/lib/seed.js';
import { fetchGithubProfile } from '@/lib/collectors/github.js';
import { fetchRedditActivity } from '@/lib/collectors/reddit.js';
import { extractGithubAudit, extractRedditAudit } from '@/lib/engine/extractor.js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let queryHandle = searchParams.get('handle') || searchParams.get('username') || searchParams.get('github');
  let queryReddit = searchParams.get('reddit');

  let user = getCurrentUser();

  if (queryHandle) {
    user = updateUserHandles(user.id, queryHandle, queryReddit || queryHandle);
  }

  const ghUsername = user.github_username || 'aarav_dev';
  const rdUsername = user.reddit_username || ghUsername || 'aarav_dev';

  // 1. Fetch LIVE GitHub Profile & Repositories
  let liveGh = await fetchGithubProfile(ghUsername);
  if (!liveGh) {
    liveGh = getGithubData(user.id);
    if (!liveGh) {
      runSeed();
      liveGh = getGithubData(user.id);
    }
  } else {
    saveGithubData(user.id, liveGh);
  }

  // 2. Fetch LIVE Reddit Activity
  let liveRd = await fetchRedditActivity(rdUsername, 100);
  if (!liveRd || liveRd.length === 0) {
    liveRd = getRedditData(user.id);
    if (!liveRd || liveRd.length === 0) {
      runSeed();
      liveRd = getRedditData(user.id);
    }
  } else {
    saveRedditData(user.id, liveRd);
  }

  // 3. SEPARATE INDEPENDENT PLATFORM AUDITS (No Cross Engine Fusion)
  const githubAudit = extractGithubAudit(liveGh);
  const redditAudit = extractRedditAudit(liveRd, rdUsername);

  return Response.json({
    user: {
      id: user.id,
      name: liveGh.name || `@${ghUsername}`,
      github_username: ghUsername,
      reddit_username: rdUsername,
      avatar_url: liveGh.avatar_url || `https://github.com/${ghUsername}.png`,
      email: liveGh.email || user.email
    },
    connectionStatus: {
      github: { connected: true, username: ghUsername, url: `https://github.com/${ghUsername}` },
      reddit: { connected: true, username: rdUsername, url: `https://www.reddit.com/user/${rdUsername}` }
    },
    githubAudit,
    redditAudit,
    githubData: {
      profile: {
        name: liveGh.name,
        bio: liveGh.bio,
        location: liveGh.location,
        company: liveGh.company,
        website: liveGh.website,
        email: liveGh.email
      },
      repos: liveGh.repos || []
    },
    redditData: liveRd
  });
}
