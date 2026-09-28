import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'data', 'weblab_db.json');

function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

function loadDatabase() {
  ensureDirectoryExistence(DB_FILE);
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: [],
      github_data: [],
      reddit_data: [],
      exposure_findings: [],
      identity_links: [],
      session: null
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(content);
    if (!parsed.session) parsed.session = null;
    return parsed;
  } catch (err) {
    console.error('Error reading database file, resetting:', err);
    return {
      users: [],
      github_data: [],
      reddit_data: [],
      exposure_findings: [],
      identity_links: [],
      session: null
    };
  }
}

function saveDatabase(db) {
  ensureDirectoryExistence(DB_FILE);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
}

export function getDatabase() {
  return loadDatabase();
}

export function seedDefaultUser() {
  const db = loadDatabase();
  let defaultUser = db.users.find((u) => u.id === 'usr_current' || u.github_username === 'aarav_dev');

  if (!defaultUser) {
    defaultUser = {
      id: 'usr_current',
      github_id: '12345678',
      github_username: 'aarav_dev',
      reddit_username: 'aarav_dev',
      name: 'Aarav Sharma',
      email: 'aarav.sharma.dev@gmail.com',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      created_at: new Date().toISOString()
    };
    db.users.push(defaultUser);
    db.session = { userId: defaultUser.id };
    saveDatabase(db);
  }

  return defaultUser;
}

export function getCurrentUser() {
  const db = loadDatabase();
  if (db.session && db.session.userId) {
    const user = db.users.find((u) => u.id === db.session.userId);
    if (user) return user;
  }
  return seedDefaultUser();
}

export function setCurrentSession(userId) {
  const db = loadDatabase();
  db.session = { userId };
  saveDatabase(db);
}

export function clearSession() {
  const db = loadDatabase();
  db.session = null;
  saveDatabase(db);
}

export function updateUserHandles(userId, githubUsername, redditUsername) {
  const db = loadDatabase();
  const cleanGh = githubUsername.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '').replace(/^@/, '').trim();
  const cleanRd = redditUsername.replace(/^(?:https?:\/\/)?(?:www\.)?reddit\.com\/(?:u|user)\//i, '').replace(/^(?:@|\/?u\/)/i, '').trim();

  let user = db.users.find((u) => u.id === userId);
  if (!user) {
    user = {
      id: userId || 'usr_current',
      github_id: String(Date.now()),
      github_username: cleanGh || 'aarav_dev',
      reddit_username: cleanRd || cleanGh || 'aarav_dev',
      name: cleanGh ? `@${cleanGh}` : 'Authenticated User',
      email: `${cleanGh || 'user'}@users.noreply.github.com`,
      avatar_url: `https://github.com/${cleanGh || 'octocat'}.png`,
      created_at: new Date().toISOString()
    };
    db.users.push(user);
  } else {
    user.github_username = cleanGh || user.github_username;
    user.reddit_username = cleanRd || user.reddit_username;
    user.name = cleanGh ? `@${cleanGh}` : user.name;
    user.avatar_url = `https://github.com/${cleanGh || 'octocat'}.png`;
  }

  db.session = { userId: user.id };
  saveDatabase(db);
  return user;
}

export function getUserById(userId) {
  const db = loadDatabase();
  return db.users.find((u) => u.id === userId) || null;
}

export function saveGithubData(userId, data) {
  const db = loadDatabase();
  db.github_data = db.github_data.filter((g) => g.user_id !== userId);
  const record = {
    user_id: userId,
    ...data,
    updated_at: new Date().toISOString()
  };
  db.github_data.push(record);
  saveDatabase(db);
  return record;
}

export function getGithubData(userId) {
  const db = loadDatabase();
  return db.github_data.find((g) => g.user_id === userId) || null;
}

export function saveRedditData(userId, items) {
  const db = loadDatabase();
  db.reddit_data = db.reddit_data.filter((r) => r.user_id !== userId);
  const records = items.map((it) => ({
    user_id: userId,
    post_comment_id: it.id,
    subreddit: it.context || 'general',
    title: it.title || '',
    content: it.body || '',
    url: it.permalink || '',
    timestamp: it.createdUtc,
    created_at: new Date().toISOString()
  }));
  db.reddit_data.push(...records);
  saveDatabase(db);
  return records;
}

export function getRedditData(userId) {
  const db = loadDatabase();
  return db.reddit_data.filter((r) => r.user_id === userId);
}

export function saveExposureFindings(userId, findings) {
  const db = loadDatabase();
  db.exposure_findings = db.exposure_findings.filter((f) => f.user_id !== userId);
  const records = findings.map((f, idx) => ({
    id: `finding_${userId}_${idx + 1}`,
    user_id: userId,
    type: f.type || f.category || 'Identity Exposure',
    value: f.value || f.evidenceSnippet || '',
    severity: f.severity || f.riskLevel || 'Moderate',
    source: f.source || 'Engine',
    evidence_url: f.evidence_url || f.permalink || '',
    confidence: f.confidence || f.confidenceScore || 75,
    description: f.description || '',
    remediation: f.remediation || ''
  }));
  db.exposure_findings.push(...records);
  saveDatabase(db);
  return records;
}

export function getExposureFindings(userId) {
  const db = loadDatabase();
  return db.exposure_findings.filter((f) => f.user_id === userId);
}

export function saveIdentityLinks(userId, links) {
  const db = loadDatabase();
  db.identity_links = db.identity_links.filter((l) => l.user_id !== userId);
  const records = links.map((l, idx) => ({
    id: `link_${userId}_${idx + 1}`,
    user_id: userId,
    source_a: l.source_a || 'GitHub',
    source_b: l.source_b || 'Reddit',
    signal: l.signal,
    confidence: l.confidence,
    evidence: l.evidence,
    evidence_url: l.evidence_url || '',
    supporting_signals: l.supporting_signals || []
  }));
  db.identity_links.push(...records);
  saveDatabase(db);
  return records;
}

export function getIdentityLinks(userId) {
  const db = loadDatabase();
  return db.identity_links.filter((l) => l.user_id === userId);
}
