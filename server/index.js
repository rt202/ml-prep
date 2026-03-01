import './loadEnv.js';
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import { questions as staticQuestions } from './data/questions.js';
import { units as staticUnits } from './data/units.js';
import { codingQuestions } from './data/coding-questions.js';
import {
  initDb,
  registerUser,
  loginUser,
  createSession,
  getUserBySession,
  deleteSession,
  getUserProfile,
  updateUserProfile,
  getProgress,
  updateProgress,
  upsertQuestionHistory,
  upsertLessonProgress,
  setReviewQueueItem,
  upsertDailyXp,
  resetUserProgress,
  listUsers,
  updateUserRole,
  createCustomUnit,
  updateCustomUnit,
  createCustomLesson,
  updateCustomLesson,
  createCustomQuestion,
  updateCustomQuestion,
  getPublishedCustomUnits,
  getPublishedCustomLessons,
  getPublishedCustomQuestions,
  getAdminContent,
  logAdminAction,
  ensureUserFromExternalAuth,
} from './db.js';
import { getSupabaseUserByAccessToken, isSupabaseConfigured } from './supabase.js';

const app = express();
const PORT = 3001;

initDb();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

function parseCookies(req) {
  const cookieHeader = req.headers.cookie || '';
  const items = cookieHeader.split(';').map((chunk) => chunk.trim()).filter(Boolean);
  const cookies = {};
  for (const item of items) {
    const idx = item.indexOf('=');
    if (idx === -1) continue;
    const key = item.slice(0, idx);
    const value = decodeURIComponent(item.slice(idx + 1));
    cookies[key] = value;
  }
  return cookies;
}

function setSessionCookie(res, sessionId) {
  res.setHeader(
    'Set-Cookie',
    `sid=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 14}`,
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'sid=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

async function getEffectiveUnits() {
  const [customUnits, customLessons] = await Promise.all([
    getPublishedCustomUnits(),
    getPublishedCustomLessons(),
  ]);
  const lessonsByUnit = new Map();
  for (const lesson of customLessons) {
    if (!lessonsByUnit.has(lesson.unit_id)) lessonsByUnit.set(lesson.unit_id, []);
    lessonsByUnit.get(lesson.unit_id).push({
      id: lesson.id,
      name: lesson.name,
      order: lesson.order_index,
      questionCount: lesson.question_count,
    });
  }

  const result = staticUnits.map((unit) => ({
    ...unit,
    lessons: [
      ...unit.lessons,
      ...(lessonsByUnit.get(unit.id) || []),
    ].sort((a, b) => a.order - b.order),
  }));

  for (const unit of customUnits) {
    result.push({
      id: unit.id,
      name: unit.name,
      description: unit.description,
      icon: unit.icon,
      order: unit.order_index,
      lessons: (lessonsByUnit.get(unit.id) || []).sort((a, b) => a.order - b.order),
    });
  }
  return result.sort((a, b) => a.order - b.order);
}

async function getEffectiveQuestions() {
  const custom = await getPublishedCustomQuestions();
  return [...staticQuestions, ...custom];
}

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    if (isSupabaseConfigured()) {
      const supabaseUser = await getSupabaseUserByAccessToken(token);
      if (supabaseUser?.id && supabaseUser?.email) {
        try {
          const localUser = await ensureUserFromExternalAuth({
            id: supabaseUser.id,
            email: supabaseUser.email,
            displayName:
              supabaseUser.user_metadata?.display_name ||
              supabaseUser.user_metadata?.name ||
              supabaseUser.email.split('@')[0],
          });
          req.user = localUser;
          return next();
        } catch (err) {
          console.error('ensureUserFromExternalAuth error:', err.message);
          return res.status(500).json({ error: 'Failed to initialize user profile' });
        }
      }
    }
  }

  const cookies = parseCookies(req);
  const user = getUserBySession(cookies.sid);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}

app.get('/', (_req, res) => {
  res.json({
    name: 'ML Interview Prep API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      units: '/api/units',
      questions: '/api/questions',
      progress: '/api/progress',
    },
    message: 'Backend API is running successfully!',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// ===== Auth =====
app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'email, password, displayName are required' });
    }
    const user = registerUser({ email, password, displayName });
    const session = createSession(user.id);
    setSessionCookie(res, session.sessionId);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to sign up' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = loginUser({ email, password });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const session = createSession(user.id);
  setSessionCookie(res, session.sessionId);
  res.json({ user });
});

app.post('/api/auth/logout', (req, res) => {
  const cookies = parseCookies(req);
  if (cookies.sid) deleteSession(cookies.sid);
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ===== Protected App API =====
app.use('/api', requireAuth);

app.get('/api/units', async (_req, res) => {
  try {
    res.json(await getEffectiveUnits());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Coding Challenges =====
app.get('/api/coding-questions', (_req, res) => {
  res.json(codingQuestions);
});

app.get('/api/coding-questions/:unitId', (req, res) => {
  const { unitId } = req.params;
  const filtered = codingQuestions.filter((q) => q.unitId === unitId);
  res.json(filtered);
});

app.get('/api/lessons/:unitId/:lessonId/questions', async (req, res) => {
  try {
    const { unitId, lessonId } = req.params;
    const questions = await getEffectiveQuestions();
    const lessonQuestions = questions.filter((q) => q.unitId === unitId && q.lessonId === lessonId);
    if (lessonQuestions.length === 0) return res.status(404).json({ error: 'Lesson not found' });
    const diffOrder = { easy: 0, medium: 1, hard: 2, very_hard: 3 };
    lessonQuestions.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    res.json(lessonQuestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/questions', async (req, res) => {
  try {
    const { role, difficulty, category, companySize, unitId } = req.query;
    let filtered = await getEffectiveQuestions();
    if (role) filtered = filtered.filter((q) => q.roles.includes(role));
    if (difficulty) filtered = filtered.filter((q) => q.difficulty === difficulty);
    if (category) filtered = filtered.filter((q) => q.category === category);
    if (companySize) filtered = filtered.filter((q) => q.companySizes.includes(companySize));
    if (unitId) filtered = filtered.filter((q) => q.unitId === unitId);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/progress', async (req, res) => {
  try {
    res.json(await getProgress(req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/progress', async (req, res) => {
  try {
    const updated = await updateProgress(req.user.id, req.body || {});
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/answer', async (req, res) => {
  try {
    const { questionId, selectedAnswer } = req.body;
    const questions = await getEffectiveQuestions();
    const question = questions.find((q) => q.id === questionId);
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const progress = await getProgress(req.user.id);
    const isCorrect = selectedAnswer === question.correctAnswer;
    const xpGain = isCorrect ? ({ easy: 5, medium: 10, hard: 20, very_hard: 35 }[question.difficulty] || 10) : 0;
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    await upsertQuestionHistory(req.user.id, questionId, (row) => ({
      attempts: row.attempts + 1,
      correct: row.correct + (isCorrect ? 1 : 0),
      lastAttempted: now,
    }));

    if (!isCorrect) {
      await setReviewQueueItem(req.user.id, questionId, true);
    } else {
      const after = await getProgress(req.user.id);
      const history = after.questionHistory[questionId];
      if (history && history.correct >= 2) {
        await setReviewQueueItem(req.user.id, questionId, false);
      }
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let nextCurrentStreak = progress.currentStreak;
    if (progress.lastActiveDate !== today) {
      if (progress.lastActiveDate === yesterday) nextCurrentStreak += 1;
      else nextCurrentStreak = 1;
    }

    await updateProgress(req.user.id, {
      xp: progress.xp + xpGain,
      level: Math.floor((progress.xp + xpGain) / 100) + 1,
      totalQuestionsAnswered: progress.totalQuestionsAnswered + 1,
      totalCorrect: progress.totalCorrect + (isCorrect ? 1 : 0),
      currentStreak: nextCurrentStreak,
      longestStreak: Math.max(progress.longestStreak, nextCurrentStreak),
      lastActiveDate: today,
    });
    if (isCorrect) await upsertDailyXp(req.user.id, today, xpGain);

    res.json({
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      xpGained: xpGain,
      progress: await getProgress(req.user.id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/lessons/complete', async (req, res) => {
  try {
    const { unitId, lessonId, score, totalQuestions } = req.body;
    const lessonKey = `${unitId}-${lessonId}`;
    await upsertLessonProgress(req.user.id, lessonKey, (row) => {
      const attempts = row.attempts + 1;
      const bestScore = Math.max(row.bestScore, score);
      const completed = row.completed || score >= Math.ceil(totalQuestions * 0.7);
      return { attempts, bestScore, completed };
    });

    const progress = await getProgress(req.user.id);
    if (score >= Math.ceil(totalQuestions * 0.7) && !progress.completedLessons.includes(lessonKey)) {
      await updateProgress(req.user.id, {
        xp: progress.xp + 25,
        level: Math.floor((progress.xp + 25) / 100) + 1,
      });
    }
    res.json(await getProgress(req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/review', async (req, res) => {
  try {
    const progress = await getProgress(req.user.id);
    const reviewIds = new Set(progress.reviewQueue);
    const questions = await getEffectiveQuestions();
    res.json(questions.filter((q) => reviewIds.has(q.id)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/progress/reset', async (req, res) => {
  try {
    await resetUserProgress(req.user.id);
    res.json(await getProgress(req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const users = await listUsers();
    const leaderboard = (
      await Promise.all(
        users.map(async (user) => {
          const progress = await getProgress(user.id);
          return {
            name: user.displayName,
            xp: progress?.xp ?? 0,
            streak: progress?.currentStreak ?? 0,
            level: progress?.level ?? 1,
            isUser: user.id === req.user.id,
          };
        })
      )
    ).sort((a, b) => b.xp - a.xp);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/recommended', async (req, res) => {
  try {
    const { difficulty, companySize, limit = 10 } = req.query;
    const progress = await getProgress(req.user.id);
    let recommended = await getEffectiveQuestions();
    if (difficulty) recommended = recommended.filter((q) => q.difficulty === difficulty);
    if (companySize) recommended = recommended.filter((q) => q.companySizes.includes(companySize));

    recommended.sort((a, b) => {
      const aHistory = progress.questionHistory[a.id];
      const bHistory = progress.questionHistory[b.id];
      if (!aHistory && bHistory) return -1;
      if (aHistory && !bHistory) return 1;
      if (!aHistory && !bHistory) return 0;
      const aAcc = aHistory.correct / Math.max(aHistory.attempts, 1);
      const bAcc = bHistory.correct / Math.max(bHistory.attempts, 1);
      if (aAcc !== bAcc) return aAcc - bAcc;
      return new Date(aHistory.lastAttempted) - new Date(bHistory.lastAttempted);
    });
    recommended = recommended.slice(0, Math.min(parseInt(limit, 10) || 10, 20));
    res.json(recommended);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    res.json(await getUserProfile(req.user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', async (req, res) => {
  try {
    const actorRole = req.user.role;
    const updated = await updateUserProfile(req.user.id, req.body || {}, actorRole);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const [progress, allUnits, allQuestions] = await Promise.all([
      getProgress(req.user.id),
      getEffectiveUnits(),
      getEffectiveQuestions(),
    ]);
    const totalLessons = allUnits.reduce((sum, unit) => sum + unit.lessons.length, 0);
    const totalQuestions = allQuestions.length;
    const accuracy = progress.totalQuestionsAnswered > 0
      ? Math.round((progress.totalCorrect / progress.totalQuestionsAnswered) * 100)
      : 0;

    res.json({
      totalQuestions,
      answeredQuestions: Object.keys(progress.questionHistory).length,
      accuracy,
      xp: progress.xp,
      level: progress.level,
      streak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      completedLessons: progress.completedLessons.length,
      totalLessons,
      reviewQueueSize: progress.reviewQueue.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Admin =====
app.get('/api/admin/users', requireAdmin, async (_req, res) => {
  try {
    res.json(await listUsers());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const user = await updateUserRole(req.params.id, req.body.role);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await logAdminAction(req.user.id, 'update_user_role', `user:${req.params.id}`, { role: req.body.role });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/content', requireAdmin, async (_req, res) => {
  try {
    res.json(await getAdminContent());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/units', requireAdmin, async (req, res) => {
  try {
    const id = req.body.id || `custom-unit-${randomUUID().slice(0, 8)}`;
    await createCustomUnit({
      id,
      name: req.body.name,
      description: req.body.description || '',
      icon: req.body.icon || '📚',
      orderIndex: req.body.orderIndex ?? 999,
      isPublished: req.body.isPublished ?? true,
      createdBy: req.user.id,
    });
    await logAdminAction(req.user.id, 'create_unit', `unit:${id}`, req.body);
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/units/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await updateCustomUnit(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Unit not found' });
    await logAdminAction(req.user.id, 'update_unit', `unit:${req.params.id}`, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/lessons', requireAdmin, async (req, res) => {
  try {
    const id = req.body.id || `custom-lesson-${randomUUID().slice(0, 8)}`;
    await createCustomLesson({
      id,
      unitId: req.body.unitId,
      name: req.body.name,
      orderIndex: req.body.orderIndex ?? 1,
      questionCount: req.body.questionCount ?? 0,
      isPublished: req.body.isPublished ?? true,
      createdBy: req.user.id,
    });
    await logAdminAction(req.user.id, 'create_lesson', `lesson:${id}`, req.body);
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/lessons/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await updateCustomLesson(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Lesson not found' });
    await logAdminAction(req.user.id, 'update_lesson', `lesson:${req.params.id}`, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/questions', requireAdmin, async (req, res) => {
  try {
    const id = req.body.id || `custom-q-${randomUUID().slice(0, 8)}`;
    await createCustomQuestion({
      id,
      text: req.body.text,
      options: req.body.options || [],
      correctAnswer: req.body.correctAnswer ?? 0,
      explanation: req.body.explanation || '',
      difficulty: req.body.difficulty || 'medium',
      roles: req.body.roles || ['data_scientist', 'ml_engineer', 'ai_engineer', 'mlops_engineer'],
      category: req.body.category || 'industry_practice',
      companySizes: req.body.companySizes || ['startup', 'midsize', 'large', 'faang'],
      unitId: req.body.unitId,
      lessonId: req.body.lessonId,
      isPublished: req.body.isPublished ?? true,
      createdBy: req.user.id,
    });
    await logAdminAction(req.user.id, 'create_question', `question:${id}`, req.body);
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/questions/:id', requireAdmin, async (req, res) => {
  try {
    const updated = await updateCustomQuestion(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Question not found' });
    await logAdminAction(req.user.id, 'update_question', `question:${req.params.id}`, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export for Vercel serverless — do NOT use app.listen() in production
export default app;

// Local development only
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    const [allQuestions, allUnits] = await Promise.all([getEffectiveQuestions(), getEffectiveUnits()]);
    console.log(`📚 Loaded ${allQuestions.length} interview questions across ${allUnits.length} units`);
    console.log(`🚀 Interview Prep API running on http://localhost:${PORT}`);
  });
}
