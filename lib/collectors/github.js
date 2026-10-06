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
    const [userRes, reposRes, eventsRes, orgsRes, readmeRes] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}`, { headers }),
      fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}/repos?per_page=30&sort=updated`, { headers }),
      fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}/events/public?per_page=100`, { headers }),
      fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(cleanUsername)}/orgs?per_page=30`, { headers }),
      fetch(`${GITHUB_API_BASE}/repos/${encodeURIComponent(cleanUsername)}/${encodeURIComponent(cleanUsername)}/readme`, { headers })
    ]);

    if (!userRes.ok) {
      console.warn(`GitHub API user fetch status: ${userRes.status}`);
      return null;
    }

    const userData = await userRes.json();
    const reposData = reposRes.ok ? await reposRes.json() : [];
    const eventsData = eventsRes.ok ? await eventsRes.json() : [];
    const orgsData = orgsRes.ok ? await orgsRes.json() : [];
    const readmeData = readmeRes.ok ? await readmeRes.json() : null;

    const repos = Array.isArray(reposData) ? reposData.map((r) => ({
      name: r.name,
      language: r.language || 'Unknown',
      description: r.description || '',
      html_url: r.html_url,
      stargazers_count: r.stargazers_count
    })) : [];

    const commitEmails = new Set();
    const commitAuthors = new Set();
    const commitDates = [];
    const events = [];

    if (Array.isArray(eventsData)) {
      eventsData.forEach((evt) => {
        if (evt.type === 'PushEvent' && evt.payload?.commits) {
          evt.payload.commits.forEach((c) => {
            if (c.author?.name) commitAuthors.add(c.author.name);
            if (c.author?.email && !c.author.email.includes('noreply.github.com')) {
              commitEmails.add(c.author.email);
            }
            if (evt.created_at) commitDates.push(evt.created_at);
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
      commitEmails: Array.from(commitEmails),
      commitAuthors: Array.from(commitAuthors),
      commitDates,
      organizations: Array.isArray(orgsData) ? orgsData.map((org) => org.login).filter(Boolean) : [],
      profileReadme: readmeData?.content ? Buffer.from(readmeData.content, 'base64').toString('utf8') : '',
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
