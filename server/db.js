// server/db.js - Supabase-backed database layer
// Replaces the local SQLite implementation with Supabase REST API calls.
// All data functions are async. Legacy auth stubs are kept so server/index.js
// imports continue to work (Supabase Auth handles login/signup instead).

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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

function normalizeRole(displayName, requestedRole) {
  if (typeof displayName === 'string' && displayName.trim().toLowerCase() === 'ro') {
    return 'admin';
  }
  return requestedRole === 'admin' ? 'admin' : 'user';
}

// ─── Supabase REST helper ────────────────────────────────────────────────────
async function sb(method, path, body = null, extraHeaders = {}) {
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  // Only ask for the representation back on mutating calls
  if (['POST', 'PATCH'].includes(method) && !headers.Prefer) {
    headers.Prefer = 'return=representation';
  }
  const options = { method, headers };
  if (body !== null) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = (Array.isArray(data) ? null : data?.message) ||
      data?.error || `Supabase error ${res.status}: ${text.slice(0, 200)}`;
    throw new Error(msg);
  }
  return data;
}

// ─── Legacy auth stubs (Supabase handles auth now) ──────────────────────────
export function initDb() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Database calls will fail.');
  }
}

export function registerUser() {
  throw new Error('Use Supabase Auth for registration');
}

export function loginUser() {
  return null;
}

export function createSession() {
  return { sessionId: null, expiresAt: null };
}

export function getUserBySession() {
  return null;
}

export function deleteSession() {}

// ─── User / Profile ──────────────────────────────────────────────────────────

/**
 * Called by requireAuth after Supabase token validation.
 * Creates profile + progress rows on first login; returns existing user afterwards.
 */
export async function ensureUserFromExternalAuth({ id, email, displayName }) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedDisplayName = String(displayName || normalizedEmail.split('@')[0] || 'User').trim();

  // Check if profile already exists
  const existing = await sb('GET',
    `/profiles?user_id=eq.${id}&select=user_id,email,display_name,role,difficulty,company_size,avatar_seed`
  );
  if (existing && existing.length > 0) {
    const p = existing[0];
    return {
      id: p.user_id,
      email: p.email,
      displayName: p.display_name,
      role: p.role,
      difficulty: p.difficulty,
      companySize: p.company_size,
      avatarSeed: p.avatar_seed,
    };
  }

  // First login — create profile and progress rows
  const role = normalizeRole(normalizedDisplayName, 'user');
  const avatarSeed = id.slice(0, 8);
  const now = new Date().toISOString();

  await sb('POST', '/profiles', {
    user_id: id,
    email: normalizedEmail,
    display_name: normalizedDisplayName,
    role,
    difficulty: 'medium',
    company_size: 'large',
    avatar_seed: avatarSeed,
    created_at: now,
    updated_at: now,
  }, { Prefer: 'resolution=ignore-duplicates,return=representation' });

  await sb('POST', '/progress', {
    user_id: id,
    xp: DEFAULT_PROGRESS.xp,
    level: DEFAULT_PROGRESS.level,
    current_streak: DEFAULT_PROGRESS.currentStreak,
    longest_streak: DEFAULT_PROGRESS.longestStreak,
    last_active_date: DEFAULT_PROGRESS.lastActiveDate,
    total_questions_answered: DEFAULT_PROGRESS.totalQuestionsAnswered,
    total_correct: DEFAULT_PROGRESS.totalCorrect,
    hearts_remaining: DEFAULT_PROGRESS.heartsRemaining,
    max_hearts: DEFAULT_PROGRESS.maxHearts,
    created_at: now,
    updated_at: now,
  }, { Prefer: 'resolution=ignore-duplicates,return=representation' });

  return {
    id,
    email: normalizedEmail,
    displayName: normalizedDisplayName,
    role,
    difficulty: 'medium',
    companySize: 'large',
    avatarSeed,
  };
}

export async function getUserProfile(userId) {
  const rows = await sb('GET',
    `/profiles?user_id=eq.${userId}&select=user_id,email,display_name,role,difficulty,company_size,avatar_seed`
  );
  if (!rows || rows.length === 0) return null;
  const p = rows[0];
  return {
    userId: p.user_id,
    email: p.email,
    displayName: p.display_name,
    role: p.role,
    difficulty: p.difficulty,
    companySize: p.company_size,
    avatarSeed: p.avatar_seed,
  };
}

export async function updateUserProfile(userId, updates, actorRole = 'user') {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const nextDisplayName = updates.displayName ?? profile.displayName;
  let nextRole = profile.role;
  if (updates.role !== undefined && actorRole === 'admin') {
    nextRole = normalizeRole(nextDisplayName, updates.role);
  } else {
    nextRole = normalizeRole(nextDisplayName, profile.role);
  }

  await sb('PATCH', `/profiles?user_id=eq.${userId}`, {
    display_name: nextDisplayName,
    role: nextRole,
    difficulty: updates.difficulty ?? profile.difficulty,
    company_size: updates.companySize ?? profile.companySize,
    avatar_seed: updates.avatarSeed ?? profile.avatarSeed,
    updated_at: new Date().toISOString(),
  });

  return getUserProfile(userId);
}

// ─── Progress ────────────────────────────────────────────────────────────────

export async function getProgress(userId) {
  const [profileRows, progressRows, lessonRows, historyRows, reviewRows, dailyRows] = await Promise.all([
    sb('GET', `/profiles?user_id=eq.${userId}&select=display_name,role,difficulty,company_size`),
    sb('GET', `/progress?user_id=eq.${userId}&select=*`),
    sb('GET', `/lesson_progress?user_id=eq.${userId}&select=*`),
    sb('GET', `/question_history?user_id=eq.${userId}&select=*`),
    sb('GET', `/review_queue?user_id=eq.${userId}&select=question_id`),
    sb('GET', `/daily_xp?user_id=eq.${userId}&select=date_key,xp`),
  ]);

  if (!profileRows?.length) return null;

  const profile = profileRows[0];

  // Guard: progress row may not exist yet (race condition on first login)
  const progress = progressRows?.[0] || {
    xp: 0, level: 1, current_streak: 0, longest_streak: 0,
    last_active_date: null, total_questions_answered: 0, total_correct: 0,
    hearts_remaining: 5, max_hearts: 5, created_at: null, updated_at: null,
  };

  const lessonProgress = {};
  for (const row of (lessonRows || [])) {
    lessonProgress[row.lesson_key] = {
      bestScore: row.best_score,
      attempts: row.attempts,
      completed: Boolean(row.completed),
    };
  }

  const questionHistory = {};
  for (const row of (historyRows || [])) {
    questionHistory[row.question_id] = {
      attempts: row.attempts,
      correct: row.correct,
      lastAttempted: row.last_attempted,
    };
  }

  const completedLessons = Object.entries(lessonProgress)
    .filter(([, v]) => v.completed)
    .map(([k]) => k);

  const dailyXp = {};
  for (const row of (dailyRows || [])) {
    dailyXp[row.date_key] = row.xp;
  }

  return {
    userId,
    displayName: profile.display_name,
    role: profile.role,
    difficulty: profile.difficulty,
    companySize: profile.company_size,
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
    reviewQueue: (reviewRows || []).map((r) => r.question_id),
    dailyXp,
    achievements: [],
    createdAt: progress.created_at,
    updatedAt: progress.updated_at,
  };
}

export async function updateProgress(userId, updates) {
  const patch = { updated_at: new Date().toISOString() };
  if (updates.xp !== undefined) patch.xp = updates.xp;
  if (updates.level !== undefined) patch.level = updates.level;
  if (updates.currentStreak !== undefined) patch.current_streak = updates.currentStreak;
  if (updates.longestStreak !== undefined) patch.longest_streak = updates.longestStreak;
  if (updates.lastActiveDate !== undefined) patch.last_active_date = updates.lastActiveDate;
  if (updates.totalQuestionsAnswered !== undefined) patch.total_questions_answered = updates.totalQuestionsAnswered;
  if (updates.totalCorrect !== undefined) patch.total_correct = updates.totalCorrect;
  if (updates.heartsRemaining !== undefined) patch.hearts_remaining = updates.heartsRemaining;
  if (updates.maxHearts !== undefined) patch.max_hearts = updates.maxHearts;

  await sb('PATCH', `/progress?user_id=eq.${userId}`, patch);
  return getProgress(userId);
}

export async function upsertQuestionHistory(userId, questionId, updater) {
  const existing = await sb('GET',
    `/question_history?user_id=eq.${userId}&question_id=eq.${encodeURIComponent(questionId)}&select=*`
  );
  const base = existing?.[0] || { attempts: 0, correct: 0, last_attempted: null };
  const next = updater({
    attempts: base.attempts,
    correct: base.correct,
    lastAttempted: base.last_attempted,
  });
  await sb('POST', '/question_history', {
    user_id: userId,
    question_id: questionId,
    attempts: next.attempts,
    correct: next.correct,
    last_attempted: next.lastAttempted,
  }, { Prefer: 'resolution=merge-duplicates,return=representation' });
}

export async function upsertLessonProgress(userId, lessonKey, updater) {
  const existing = await sb('GET',
    `/lesson_progress?user_id=eq.${userId}&lesson_key=eq.${encodeURIComponent(lessonKey)}&select=*`
  );
  const base = existing?.[0] || { best_score: 0, attempts: 0, completed: false };
  const next = updater({
    bestScore: base.best_score,
    attempts: base.attempts,
    completed: Boolean(base.completed),
  });
  await sb('POST', '/lesson_progress', {
    user_id: userId,
    lesson_key: lessonKey,
    best_score: next.bestScore,
    attempts: next.attempts,
    completed: next.completed,
  }, { Prefer: 'resolution=merge-duplicates,return=representation' });
}

export async function setReviewQueueItem(userId, questionId, shouldInclude) {
  if (shouldInclude) {
    await sb('POST', '/review_queue', {
      user_id: userId,
      question_id: questionId,
    }, { Prefer: 'resolution=ignore-duplicates,return=representation' });
  } else {
    await sb('DELETE', `/review_queue?user_id=eq.${userId}&question_id=eq.${encodeURIComponent(questionId)}`);
  }
}

export async function upsertDailyXp(userId, dateKey, xpDelta) {
  const existing = await sb('GET',
    `/daily_xp?user_id=eq.${userId}&date_key=eq.${dateKey}&select=xp`
  );
  const currentXp = existing?.[0]?.xp || 0;
  await sb('POST', '/daily_xp', {
    user_id: userId,
    date_key: dateKey,
    xp: currentXp + xpDelta,
  }, { Prefer: 'resolution=merge-duplicates,return=representation' });
}

export async function resetUserProgress(userId) {
  const now = new Date().toISOString();
  await sb('PATCH', `/progress?user_id=eq.${userId}`, {
    xp: 0, level: 1, current_streak: 0, longest_streak: 0,
    last_active_date: null, total_questions_answered: 0, total_correct: 0,
    hearts_remaining: 5, max_hearts: 5, updated_at: now,
  });
  await Promise.all([
    sb('DELETE', `/lesson_progress?user_id=eq.${userId}`),
    sb('DELETE', `/question_history?user_id=eq.${userId}`),
    sb('DELETE', `/review_queue?user_id=eq.${userId}`),
    sb('DELETE', `/daily_xp?user_id=eq.${userId}`),
  ]);
}

// ─── Users (admin) ───────────────────────────────────────────────────────────

export async function listUsers() {
  const rows = await sb('GET',
    '/profiles?select=user_id,email,display_name,role,created_at,difficulty,company_size&order=created_at.asc'
  );
  return (rows || []).map((p) => ({
    id: p.user_id,
    email: p.email,
    displayName: p.display_name,
    role: p.role,
    createdAt: p.created_at,
    difficulty: p.difficulty,
    companySize: p.company_size,
  }));
}

export async function updateUserRole(userId, role) {
  const profile = await getUserProfile(userId);
  if (!profile) return null;
  const normalized = normalizeRole(profile.displayName, role);
  await sb('PATCH', `/profiles?user_id=eq.${userId}`, {
    role: normalized,
    updated_at: new Date().toISOString(),
  });
  return getUserProfile(userId);
}

// ─── Custom content ──────────────────────────────────────────────────────────

export async function createCustomUnit({ id, name, description, icon, orderIndex, isPublished, createdBy }) {
  const now = new Date().toISOString();
  await sb('POST', '/custom_units', {
    id, name, description, icon,
    order_index: orderIndex,
    is_published: isPublished,
    created_by: createdBy,
    created_at: now, updated_at: now,
  });
}

export async function updateCustomUnit(id, updates) {
  const existing = await sb('GET', `/custom_units?id=eq.${id}&select=*`);
  if (!existing || existing.length === 0) return null;
  const e = existing[0];
  const patched = await sb('PATCH', `/custom_units?id=eq.${id}`, {
    name: updates.name ?? e.name,
    description: updates.description ?? e.description,
    icon: updates.icon ?? e.icon,
    order_index: updates.orderIndex ?? e.order_index,
    is_published: updates.isPublished !== undefined ? updates.isPublished : e.is_published,
    updated_at: new Date().toISOString(),
  });
  return patched?.[0] || null;
}

export async function createCustomLesson({ id, unitId, name, orderIndex, questionCount, isPublished, createdBy }) {
  const now = new Date().toISOString();
  await sb('POST', '/custom_lessons', {
    id, name,
    unit_id: unitId,
    order_index: orderIndex,
    question_count: questionCount,
    is_published: isPublished,
    created_by: createdBy,
    created_at: now, updated_at: now,
  });
}

export async function updateCustomLesson(id, updates) {
  const existing = await sb('GET', `/custom_lessons?id=eq.${id}&select=*`);
  if (!existing || existing.length === 0) return null;
  const e = existing[0];
  const patched = await sb('PATCH', `/custom_lessons?id=eq.${id}`, {
    unit_id: updates.unitId ?? e.unit_id,
    name: updates.name ?? e.name,
    order_index: updates.orderIndex ?? e.order_index,
    question_count: updates.questionCount ?? e.question_count,
    is_published: updates.isPublished !== undefined ? updates.isPublished : e.is_published,
    updated_at: new Date().toISOString(),
  });
  return patched?.[0] || null;
}

export async function createCustomQuestion({
  id, text, options, correctAnswer, explanation, difficulty,
  roles, category, companySizes, unitId, lessonId, isPublished, createdBy,
}) {
  const now = new Date().toISOString();
  await sb('POST', '/custom_questions', {
    id, text, explanation, difficulty, category,
    options_json: options,
    correct_answer: correctAnswer,
    roles_json: roles,
    company_sizes_json: companySizes,
    unit_id: unitId,
    lesson_id: lessonId,
    is_published: isPublished,
    created_by: createdBy,
    created_at: now, updated_at: now,
  });
}

export async function updateCustomQuestion(id, updates) {
  const existing = await sb('GET', `/custom_questions?id=eq.${id}&select=*`);
  if (!existing || existing.length === 0) return null;
  const e = existing[0];
  const patched = await sb('PATCH', `/custom_questions?id=eq.${id}`, {
    text: updates.text ?? e.text,
    options_json: updates.options ?? e.options_json,
    correct_answer: updates.correctAnswer ?? e.correct_answer,
    explanation: updates.explanation ?? e.explanation,
    difficulty: updates.difficulty ?? e.difficulty,
    roles_json: updates.roles ?? e.roles_json,
    category: updates.category ?? e.category,
    company_sizes_json: updates.companySizes ?? e.company_sizes_json,
    unit_id: updates.unitId ?? e.unit_id,
    lesson_id: updates.lessonId ?? e.lesson_id,
    is_published: updates.isPublished !== undefined ? updates.isPublished : e.is_published,
    updated_at: new Date().toISOString(),
  });
  return patched?.[0] || null;
}

export async function getPublishedCustomUnits() {
  const rows = await sb('GET', '/custom_units?is_published=eq.true&order=order_index.asc&select=*');
  return rows || [];
}

export async function getPublishedCustomLessons() {
  const rows = await sb('GET', '/custom_lessons?is_published=eq.true&order=order_index.asc&select=*');
  return rows || [];
}

export async function getPublishedCustomQuestions() {
  const rows = await sb('GET', '/custom_questions?is_published=eq.true&select=*');
  return (rows || []).map((row) => ({
    id: row.id,
    text: row.text,
    options: row.options_json,
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    difficulty: row.difficulty,
    roles: row.roles_json,
    category: row.category,
    companySizes: row.company_sizes_json,
    unitId: row.unit_id,
    lessonId: row.lesson_id,
  }));
}

export async function getAdminContent() {
  const [units, lessons, questions] = await Promise.all([
    sb('GET', '/custom_units?order=order_index.asc&select=*'),
    sb('GET', '/custom_lessons?order=unit_id.asc,order_index.asc&select=*'),
    sb('GET', '/custom_questions?order=created_at.desc&select=*'),
  ]);
  return {
    units: units || [],
    lessons: lessons || [],
    questions: (questions || []).map((row) => ({
      id: row.id,
      text: row.text,
      options: row.options_json,
      correctAnswer: row.correct_answer,
      explanation: row.explanation,
      difficulty: row.difficulty,
      roles: row.roles_json,
      category: row.category,
      companySizes: row.company_sizes_json,
      unitId: row.unit_id,
      lessonId: row.lesson_id,
      isPublished: row.is_published,
      createdBy: row.created_by,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
  };
}

export async function logAdminAction(actorUserId, action, target, details) {
  await sb('POST', '/admin_audit_logs', {
    actor_user_id: actorUserId,
    action,
    target,
    details: details || {},
    created_at: new Date().toISOString(),
  });
}
