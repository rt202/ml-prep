import { DatabaseSync } from 'node:sqlite';
import { randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = join(__dirname, 'data', 'app.sqlite');

const db = new DatabaseSync(DB_FILE);

const DEFAULT_PROGRESS = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  heartsRemaining: 5,
  maxHearts: 5,
};

function nowIso() {
  return new Date().toISOString();
}

function jsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function hashPassword(password) {
  const salt = randomUUID().replace(/-/g, '').slice(0, 16);
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash || '').split(':');
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64).toString('hex');
  return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
}

function normalizeRole(displayName, requestedRole) {
  if (typeof displayName === 'string' && displayName.trim().toLowerCase() === 'ro') {
    return 'admin';
  }
  return requestedRole === 'admin' ? 'admin' : 'user';
}

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY,
      difficulty TEXT NOT NULL DEFAULT 'medium',
      company_size TEXT NOT NULL DEFAULT 'large',
      avatar_seed TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS progress (
      user_id TEXT PRIMARY KEY,
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_active_date TEXT,
      total_questions_answered INTEGER NOT NULL DEFAULT 0,
      total_correct INTEGER NOT NULL DEFAULT 0,
      hearts_remaining INTEGER NOT NULL DEFAULT 5,
      max_hearts INTEGER NOT NULL DEFAULT 5,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      user_id TEXT NOT NULL,
      lesson_key TEXT NOT NULL,
      best_score INTEGER NOT NULL DEFAULT 0,
      attempts INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, lesson_key),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS question_history (
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      attempts INTEGER NOT NULL DEFAULT 0,
      correct INTEGER NOT NULL DEFAULT 0,
      last_attempted TEXT,
      PRIMARY KEY (user_id, question_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS review_queue (
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      PRIMARY KEY (user_id, question_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS daily_xp (
      user_id TEXT NOT NULL,
      date_key TEXT NOT NULL,
      xp INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, date_key),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS custom_units (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS custom_lessons (
      id TEXT PRIMARY KEY,
      unit_id TEXT NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      question_count INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS custom_questions (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      options_json TEXT NOT NULL,
      correct_answer INTEGER NOT NULL,
      explanation TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      roles_json TEXT NOT NULL,
      category TEXT NOT NULL,
      company_sizes_json TEXT NOT NULL,
      unit_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      is_published INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      actor_user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);

  const adminEmail = 'ro@local.dev';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existing) {
    const passwordHash = hashPassword('ro123456');
    const userId = randomUUID();
    createUserWithDefaults({
      id: userId,
      email: adminEmail,
      passwordHash,
      displayName: 'ro',
      role: 'admin',
      difficulty: 'medium',
      companySize: 'large',
      avatarSeed: randomUUID().slice(0, 8),
    });
  }
}

function createUserWithDefaults({
  id,
  email,
  passwordHash,
  displayName,
  role,
  difficulty,
  companySize,
  avatarSeed,
}) {
  const createdAt = nowIso();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, display_name, role, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, email.toLowerCase(), passwordHash, displayName, normalizeRole(displayName, role), createdAt, createdAt);

  db.prepare(`
    INSERT INTO profiles (user_id, difficulty, company_size, avatar_seed)
    VALUES (?, ?, ?, ?)
  `).run(id, difficulty || 'medium', companySize || 'large', avatarSeed || randomUUID().slice(0, 8));

  db.prepare(`
    INSERT INTO progress (
      user_id, xp, level, current_streak, longest_streak, last_active_date,
      total_questions_answered, total_correct, hearts_remaining, max_hearts, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    DEFAULT_PROGRESS.xp,
    DEFAULT_PROGRESS.level,
    DEFAULT_PROGRESS.currentStreak,
    DEFAULT_PROGRESS.longestStreak,
    DEFAULT_PROGRESS.lastActiveDate,
    DEFAULT_PROGRESS.totalQuestionsAnswered,
    DEFAULT_PROGRESS.totalCorrect,
    DEFAULT_PROGRESS.heartsRemaining,
    DEFAULT_PROGRESS.maxHearts,
    createdAt,
    createdAt,
  );
}

export function registerUser({ email, password, displayName }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedDisplayName = String(displayName || '').trim();
  if (!normalizedEmail || !password || !normalizedDisplayName) {
    throw new Error('Missing required fields');
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) throw new Error('Email already in use');

  const userId = randomUUID();
  createUserWithDefaults({
    id: userId,
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    displayName: normalizedDisplayName,
    role: normalizeRole(normalizedDisplayName, 'user'),
    difficulty: 'medium',
    companySize: 'large',
    avatarSeed: randomUUID().slice(0, 8),
  });
  return getUserById(userId);
}

export function loginUser({ email, password }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return null;
  }
  return getUserById(user.id);
}

export function getUserByEmail(email) {
  if (!email) return null;
  const normalizedEmail = String(email).trim().toLowerCase();
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (!user) return null;
  return getUserById(user.id);
}

export function ensureUserFromExternalAuth({ email, displayName }) {
  const existing = getUserByEmail(email);
  if (existing) return existing;
  const fallbackPassword = randomUUID();
  return registerUser({
    email,
    password: fallbackPassword,
    displayName: displayName || String(email).split('@')[0] || 'User',
  });
}

function getProfileRow(userId) {
  return db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(userId);
}

function getProgressRow(userId) {
  return db.prepare('SELECT * FROM progress WHERE user_id = ?').get(userId);
}

export function getUserById(userId) {
  const user = db.prepare('SELECT id, email, display_name, role, created_at FROM users WHERE id = ?').get(userId);
  if (!user) return null;
  const profile = getProfileRow(userId);
  return {
    id: user.id,
    email: user.email,
    displayName: user.display_name,
    role: user.role,
    createdAt: user.created_at,
    difficulty: profile?.difficulty || 'medium',
    companySize: profile?.company_size || 'large',
    avatarSeed: profile?.avatar_seed,
  };
}

export function createSession(userId) {
  const sessionId = randomUUID();
  const createdAt = nowIso();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString();
  db.prepare('INSERT INTO sessions (id, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)').run(
    sessionId,
    userId,
    expiresAt,
    createdAt,
  );
  return { sessionId, expiresAt };
}

export function getUserBySession(sessionId) {
  if (!sessionId) return null;
  const row = db.prepare(`
    SELECT s.id as session_id, s.expires_at, u.id as user_id
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.id = ?
  `).get(sessionId);
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
    return null;
  }
  return getUserById(row.user_id);
}

export function deleteSession(sessionId) {
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

export function getUserProfile(userId) {
  const user = getUserById(userId);
  if (!user) return null;
  return {
    userId: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    difficulty: user.difficulty,
    companySize: user.companySize,
    avatarSeed: user.avatarSeed,
  };
}

export function updateUserProfile(userId, updates, actorRole = 'user') {
  const user = getUserById(userId);
  if (!user) return null;

  const nextDisplayName = updates.displayName ?? user.displayName;
  let nextRole = user.role;
  if (updates.role !== undefined && actorRole === 'admin') {
    nextRole = normalizeRole(nextDisplayName, updates.role);
  } else {
    nextRole = normalizeRole(nextDisplayName, user.role);
  }
  const nextDifficulty = updates.difficulty ?? user.difficulty;
  const nextCompanySize = updates.companySize ?? user.companySize;
  const nextAvatarSeed = updates.avatarSeed ?? user.avatarSeed ?? randomUUID().slice(0, 8);

  db.prepare(`
    UPDATE users
    SET display_name = ?, role = ?, updated_at = ?
    WHERE id = ?
  `).run(nextDisplayName, nextRole, nowIso(), userId);

  db.prepare(`
    UPDATE profiles
    SET difficulty = ?, company_size = ?, avatar_seed = ?
    WHERE user_id = ?
  `).run(nextDifficulty, nextCompanySize, nextAvatarSeed, userId);

  return getUserProfile(userId);
}

export function getProgress(userId) {
  const user = getUserById(userId);
  const progress = getProgressRow(userId);
  if (!user || !progress) return null;

  const lessonProgressRows = db.prepare('SELECT * FROM lesson_progress WHERE user_id = ?').all(userId);
  const questionHistoryRows = db.prepare('SELECT * FROM question_history WHERE user_id = ?').all(userId);
  const reviewQueueRows = db.prepare('SELECT question_id FROM review_queue WHERE user_id = ?').all(userId);
  const dailyXpRows = db.prepare('SELECT date_key, xp FROM daily_xp WHERE user_id = ?').all(userId);

  const lessonProgress = {};
  for (const row of lessonProgressRows) {
    lessonProgress[row.lesson_key] = {
      bestScore: row.best_score,
      attempts: row.attempts,
      completed: Boolean(row.completed),
    };
  }

  const questionHistory = {};
  for (const row of questionHistoryRows) {
    questionHistory[row.question_id] = {
      attempts: row.attempts,
      correct: row.correct,
      lastAttempted: row.last_attempted,
    };
  }

  const completedLessons = Object.entries(lessonProgress)
    .filter(([, value]) => value.completed)
    .map(([key]) => key);

  const dailyXp = {};
  for (const row of dailyXpRows) {
    dailyXp[row.date_key] = row.xp;
  }

  return {
    userId: user.id,
    displayName: user.displayName,
    role: user.role,
    difficulty: user.difficulty,
    companySize: user.companySize,
    xp: progress.xp,
    level: progress.level,
    currentStreak: progress.current_streak,
    longestStreak: progress.longest_streak,
    lastActiveDate: progress.last_active_date,
    totalQuestionsAnswered: progress.total_questions_answered,
    totalCorrect: progress.total_correct,
    heartsRemaining: progress.hearts_remaining,
    maxHearts: progress.max_hearts,
    completedLessons,
    lessonProgress,
    questionHistory,
    reviewQueue: reviewQueueRows.map((row) => row.question_id),
    dailyXp,
    achievements: [],
    createdAt: progress.created_at,
    updatedAt: progress.updated_at,
  };
}

export function updateProgress(userId, updates) {
  const current = getProgress(userId);
  if (!current) return null;

  const merged = { ...current, ...updates };
  db.prepare(`
    UPDATE progress
    SET xp = ?, level = ?, current_streak = ?, longest_streak = ?, last_active_date = ?,
        total_questions_answered = ?, total_correct = ?, hearts_remaining = ?, max_hearts = ?, updated_at = ?
    WHERE user_id = ?
  `).run(
    merged.xp,
    merged.level,
    merged.currentStreak,
    merged.longestStreak,
    merged.lastActiveDate,
    merged.totalQuestionsAnswered,
    merged.totalCorrect,
    merged.heartsRemaining,
    merged.maxHearts,
    nowIso(),
    userId,
  );
  return getProgress(userId);
}

export function upsertQuestionHistory(userId, questionId, updater) {
  const existing = db.prepare('SELECT * FROM question_history WHERE user_id = ? AND question_id = ?').get(userId, questionId);
  const base = existing || { attempts: 0, correct: 0, last_attempted: null };
  const next = updater({
    attempts: base.attempts,
    correct: base.correct,
    lastAttempted: base.last_attempted,
  });
  db.prepare(`
    INSERT INTO question_history (user_id, question_id, attempts, correct, last_attempted)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, question_id) DO UPDATE SET
      attempts = excluded.attempts,
      correct = excluded.correct,
      last_attempted = excluded.last_attempted
  `).run(userId, questionId, next.attempts, next.correct, next.lastAttempted);
}

export function upsertLessonProgress(userId, lessonKey, updater) {
  const existing = db.prepare('SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_key = ?').get(userId, lessonKey);
  const base = existing || { best_score: 0, attempts: 0, completed: 0 };
  const next = updater({
    bestScore: base.best_score,
    attempts: base.attempts,
    completed: Boolean(base.completed),
  });
  db.prepare(`
    INSERT INTO lesson_progress (user_id, lesson_key, best_score, attempts, completed)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, lesson_key) DO UPDATE SET
      best_score = excluded.best_score,
      attempts = excluded.attempts,
      completed = excluded.completed
  `).run(userId, lessonKey, next.bestScore, next.attempts, next.completed ? 1 : 0);
}

export function setReviewQueueItem(userId, questionId, shouldInclude) {
  if (shouldInclude) {
    db.prepare('INSERT OR IGNORE INTO review_queue (user_id, question_id) VALUES (?, ?)').run(userId, questionId);
  } else {
    db.prepare('DELETE FROM review_queue WHERE user_id = ? AND question_id = ?').run(userId, questionId);
  }
}

export function upsertDailyXp(userId, dateKey, xpDelta) {
  const existing = db.prepare('SELECT xp FROM daily_xp WHERE user_id = ? AND date_key = ?').get(userId, dateKey);
  const next = (existing?.xp || 0) + xpDelta;
  db.prepare(`
    INSERT INTO daily_xp (user_id, date_key, xp)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, date_key) DO UPDATE SET xp = excluded.xp
  `).run(userId, dateKey, next);
}

export function resetUserProgress(userId) {
  const createdAt = nowIso();
  db.prepare(`
    UPDATE progress
    SET xp = 0, level = 1, current_streak = 0, longest_streak = 0, last_active_date = NULL,
        total_questions_answered = 0, total_correct = 0, hearts_remaining = 5, max_hearts = 5,
        created_at = ?, updated_at = ?
    WHERE user_id = ?
  `).run(createdAt, createdAt, userId);

  db.prepare('DELETE FROM lesson_progress WHERE user_id = ?').run(userId);
  db.prepare('DELETE FROM question_history WHERE user_id = ?').run(userId);
  db.prepare('DELETE FROM review_queue WHERE user_id = ?').run(userId);
  db.prepare('DELETE FROM daily_xp WHERE user_id = ?').run(userId);
}

export function listUsers() {
  return db.prepare(`
    SELECT u.id, u.email, u.display_name, u.role, u.created_at,
           p.difficulty, p.company_size
    FROM users u
    JOIN profiles p ON p.user_id = u.id
    ORDER BY u.created_at ASC
  `).all().map((row) => ({
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    createdAt: row.created_at,
    difficulty: row.difficulty,
    companySize: row.company_size,
  }));
}

export function updateUserRole(targetUserId, role) {
  const target = db.prepare('SELECT id, display_name FROM users WHERE id = ?').get(targetUserId);
  if (!target) return null;
  const normalized = normalizeRole(target.display_name, role);
  db.prepare('UPDATE users SET role = ?, updated_at = ? WHERE id = ?').run(normalized, nowIso(), targetUserId);
  return getUserById(targetUserId);
}

export function createCustomUnit({ id, name, description, icon, orderIndex, isPublished, createdBy }) {
  const createdAt = nowIso();
  db.prepare(`
    INSERT INTO custom_units (id, name, description, icon, order_index, is_published, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, description, icon, orderIndex, isPublished ? 1 : 0, createdBy, createdAt, createdAt);
}

export function updateCustomUnit(id, updates) {
  const existing = db.prepare('SELECT * FROM custom_units WHERE id = ?').get(id);
  if (!existing) return null;
  db.prepare(`
    UPDATE custom_units
    SET name = ?, description = ?, icon = ?, order_index = ?, is_published = ?, updated_at = ?
    WHERE id = ?
  `).run(
    updates.name ?? existing.name,
    updates.description ?? existing.description,
    updates.icon ?? existing.icon,
    updates.orderIndex ?? existing.order_index,
    updates.isPublished !== undefined ? (updates.isPublished ? 1 : 0) : existing.is_published,
    nowIso(),
    id,
  );
  return db.prepare('SELECT * FROM custom_units WHERE id = ?').get(id);
}

export function createCustomLesson({ id, unitId, name, orderIndex, questionCount, isPublished, createdBy }) {
  const createdAt = nowIso();
  db.prepare(`
    INSERT INTO custom_lessons (id, unit_id, name, order_index, question_count, is_published, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, unitId, name, orderIndex, questionCount || 0, isPublished ? 1 : 0, createdBy, createdAt, createdAt);
}

export function updateCustomLesson(id, updates) {
  const existing = db.prepare('SELECT * FROM custom_lessons WHERE id = ?').get(id);
  if (!existing) return null;
  db.prepare(`
    UPDATE custom_lessons
    SET unit_id = ?, name = ?, order_index = ?, question_count = ?, is_published = ?, updated_at = ?
    WHERE id = ?
  `).run(
    updates.unitId ?? existing.unit_id,
    updates.name ?? existing.name,
    updates.orderIndex ?? existing.order_index,
    updates.questionCount ?? existing.question_count,
    updates.isPublished !== undefined ? (updates.isPublished ? 1 : 0) : existing.is_published,
    nowIso(),
    id,
  );
  return db.prepare('SELECT * FROM custom_lessons WHERE id = ?').get(id);
}

export function createCustomQuestion({
  id,
  text,
  options,
  correctAnswer,
  explanation,
  difficulty,
  roles,
  category,
  companySizes,
  unitId,
  lessonId,
  isPublished,
  createdBy,
}) {
  const createdAt = nowIso();
  db.prepare(`
    INSERT INTO custom_questions (
      id, text, options_json, correct_answer, explanation, difficulty, roles_json, category,
      company_sizes_json, unit_id, lesson_id, is_published, created_by, created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    text,
    JSON.stringify(options),
    correctAnswer,
    explanation,
    difficulty,
    JSON.stringify(roles),
    category,
    JSON.stringify(companySizes),
    unitId,
    lessonId,
    isPublished ? 1 : 0,
    createdBy,
    createdAt,
    createdAt,
  );
}

export function updateCustomQuestion(id, updates) {
  const existing = db.prepare('SELECT * FROM custom_questions WHERE id = ?').get(id);
  if (!existing) return null;
  db.prepare(`
    UPDATE custom_questions
    SET text = ?, options_json = ?, correct_answer = ?, explanation = ?, difficulty = ?,
        roles_json = ?, category = ?, company_sizes_json = ?, unit_id = ?, lesson_id = ?,
        is_published = ?, updated_at = ?
    WHERE id = ?
  `).run(
    updates.text ?? existing.text,
    JSON.stringify(updates.options ?? jsonParse(existing.options_json, [])),
    updates.correctAnswer ?? existing.correct_answer,
    updates.explanation ?? existing.explanation,
    updates.difficulty ?? existing.difficulty,
    JSON.stringify(updates.roles ?? jsonParse(existing.roles_json, [])),
    updates.category ?? existing.category,
    JSON.stringify(updates.companySizes ?? jsonParse(existing.company_sizes_json, [])),
    updates.unitId ?? existing.unit_id,
    updates.lessonId ?? existing.lesson_id,
    updates.isPublished !== undefined ? (updates.isPublished ? 1 : 0) : existing.is_published,
    nowIso(),
    id,
  );
  return db.prepare('SELECT * FROM custom_questions WHERE id = ?').get(id);
}

export function getPublishedCustomUnits() {
  return db.prepare('SELECT * FROM custom_units WHERE is_published = 1 ORDER BY order_index ASC').all();
}

export function getPublishedCustomLessons() {
  return db.prepare('SELECT * FROM custom_lessons WHERE is_published = 1 ORDER BY order_index ASC').all();
}

export function getPublishedCustomQuestions() {
  return db.prepare('SELECT * FROM custom_questions WHERE is_published = 1').all().map((row) => ({
    id: row.id,
    text: row.text,
    options: jsonParse(row.options_json, []),
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    difficulty: row.difficulty,
    roles: jsonParse(row.roles_json, []),
    category: row.category,
    companySizes: jsonParse(row.company_sizes_json, []),
    unitId: row.unit_id,
    lessonId: row.lesson_id,
  }));
}

export function getAdminContent() {
  return {
    units: db.prepare('SELECT * FROM custom_units ORDER BY order_index ASC').all(),
    lessons: db.prepare('SELECT * FROM custom_lessons ORDER BY unit_id, order_index ASC').all(),
    questions: db.prepare('SELECT * FROM custom_questions ORDER BY created_at DESC').all().map((row) => ({
      id: row.id,
      text: row.text,
      options: jsonParse(row.options_json, []),
      correctAnswer: row.correct_answer,
      explanation: row.explanation,
      difficulty: row.difficulty,
      roles: jsonParse(row.roles_json, []),
      category: row.category,
      companySizes: jsonParse(row.company_sizes_json, []),
      unitId: row.unit_id,
      lessonId: row.lesson_id,
      isPublished: Boolean(row.is_published),
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
  };
}

export function logAdminAction(actorUserId, action, target, details) {
  db.prepare(`
    INSERT INTO admin_audit_logs (actor_user_id, action, target, details, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(actorUserId, action, target, JSON.stringify(details || {}), nowIso());
}
