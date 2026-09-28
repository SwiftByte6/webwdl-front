/**
 * GitHub OSINT Collector
 * Fetches public profile information, repositories, events, and commit emails.
 */

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchGithubProfile(username, token = process.env.GITHUB_TOKEN) {
  const cleanUsername = username.replace(/^@/, '').trim();
  const headers = {
    'User-Agent': 'WebLab-Privacy-Auditor/1.0',
    'Accept': 'application/vnd.github.v3+json'
  };
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }

  try {
    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}`, { headers }),
      fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}/repos?per_page=30&sort=updated`, { headers }),
      fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}/events/public?per_page=30`, { headers })
    ]);

    if (!userRes.ok) {
      console.warn(`GitHub API user fetch status: ${userRes.status}`);
      return null;
    }

    const userData = await userRes.json();
    const reposData = reposRes.ok ? await reposRes.json() : [];
    const eventsData = eventsRes.ok ? await eventsRes.json() : [];

    const repos = Array.isArray(reposData) ? reposData.map((r) => ({
      name: r.name,
      language: r.language || 'Unknown',
      description: r.description || '',
      html_url: r.html_url,
      stargazers_count: r.stargazers_count
    })) : [];

    const commitEmails = new Set();
    const events = [];

    if (Array.isArray(eventsData)) {
      eventsData.forEach((evt) => {
        if (evt.type === 'PushEvent' && evt.payload?.commits) {
          evt.payload.commits.forEach((c) => {
            if (c.author?.email && !c.author.email.includes('noreply.github.com')) {
              commitEmails.add(c.author.email);
            }
          });
        }
        events.push({
          type: evt.type,
          repo: evt.repo?.name,
          created_at: evt.created_at,
          comment: evt.payload?.comment?.body || evt.payload?.issue?.title || ''
        });
      });
    }

    return {
      username: userData.login,
      name: userData.name || userData.login,
      bio: userData.bio || '',
      location: userData.location || '',
      company: userData.company || '',
      website: userData.blog || '',
      email: userData.email || Array.from(commitEmails)[0] || '',
      repos,
      events,
      profile_url: userData.html_url,
      avatar_url: userData.avatar_url
    };
  } catch (err) {
    console.warn(`GitHub collector error for ${username}:`, err.message);
    return null;
  }
}
