const ALGOLIA = 'https://hn.algolia.com/api/v1';
const FIREBASE = 'https://hacker-news.firebaseio.com/v0';

export async function fetchHackerNewsActivity(username, maxItems = 100) {
  const clean = String(username || '').replace(/^@/, '').trim();
  if (!clean) return [];
  try {
    const res = await fetch(`${ALGOLIA}/search_by_author?author=${encodeURIComponent(clean)}&hitsPerPage=${Math.min(maxItems, 100)}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Algolia ${res.status}`);
    const json = await res.json();
    const hits = (json.hits || []).map((hit) => ({ id: hit.objectID, type: hit._tags?.includes('comment') ? 'comment' : 'story', title: hit.title || '', body: hit.comment_text || hit.story_text || hit.title || '', createdAt: hit.created_at, score: hit.points || 0, url: `https://news.ycombinator.com/item?id=${hit.objectID}` })).filter((item) => item.body);
    if (hits.length) return hits;

    // Official API fallback: enumerate the user's public submissions.
    const userRes = await fetch(`${FIREBASE}/user/${encodeURIComponent(clean)}.json`, { cache: 'no-store' });
    if (!userRes.ok) return [];
    const user = await userRes.json();
    const ids = (user.submitted || []).slice(0, Math.min(maxItems, 100));
    const items = await Promise.all(ids.map(async (id) => {
      const itemRes = await fetch(`${FIREBASE}/item/${id}.json`, { cache: 'no-store' });
      if (!itemRes.ok) return null;
      const item = await itemRes.json();
      const body = item.text || item.title || '';
      return body ? { id: String(id), type: item.type, title: item.title || '', body, createdAt: item.time ? new Date(item.time * 1000).toISOString() : '', score: item.score || 0, url: `https://news.ycombinator.com/item?id=${id}` } : null;
    }));
    return items.filter(Boolean);
  } catch (error) {
    console.warn(`Hacker News collector warning for ${clean}:`, error.message);
    return [];
  }
}
