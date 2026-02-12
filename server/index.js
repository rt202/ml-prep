import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { questions } from './data/questions.js';
import { units } from './data/units.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const PROGRESS_FILE = join(__dirname, 'data', 'progress.json');

app.use(cors());
app.use(express.json());

// Default progress structure (designed for easy Supabase migration)
const defaultProgress = {
  userId: 'local-user',
  displayName: 'You',
  xp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  heartsRemaining: 5,
  maxHearts: 5,
  completedLessons: [],
  lessonProgress: {},
  questionHistory: {},
  reviewQueue: [],
  dailyXp: {},
  achievements: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Load progress from JSON file
async function loadProgress() {
  try {
    const data = await fs.readFile(PROGRESS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    await saveProgress(defaultProgress);
    return defaultProgress;
  }
}

// Save progress to JSON file
async function saveProgress(progress) {
  progress.updatedAt = new Date().toISOString();
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// ====== API ROUTES ======

// Get all units with lesson info
app.get('/api/units', (req, res) => {
  res.json(units);
});

// Get questions for a specific lesson
app.get('/api/lessons/:unitId/:lessonId/questions', (req, res) => {
  const { unitId, lessonId } = req.params;
  const lessonQuestions = questions.filter(
    (q) => q.unitId === unitId && q.lessonId === lessonId
  );
  if (lessonQuestions.length === 0) {
    return res.status(404).json({ error: 'Lesson not found' });
  }
  // Sort by difficulty order within lesson
  const diffOrder = { easy: 0, medium: 1, hard: 2, very_hard: 3 };
  lessonQuestions.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
  res.json(lessonQuestions);
});

// Get all questions (for filtering)
app.get('/api/questions', (req, res) => {
  const { role, difficulty, category, companySize, unitId } = req.query;
  let filtered = [...questions];
  if (role) filtered = filtered.filter((q) => q.roles.includes(role));
  if (difficulty) filtered = filtered.filter((q) => q.difficulty === difficulty);
  if (category) filtered = filtered.filter((q) => q.category === category);
  if (companySize) filtered = filtered.filter((q) => q.companySizes.includes(companySize));
  if (unitId) filtered = filtered.filter((q) => q.unitId === unitId);
  res.json(filtered);
});

// Get user progress
app.get('/api/progress', async (req, res) => {
  const progress = await loadProgress();
  res.json(progress);
});

// Update user progress
app.put('/api/progress', async (req, res) => {
  const progress = await loadProgress();
  const updated = { ...progress, ...req.body, updatedAt: new Date().toISOString() };
  await saveProgress(updated);
  res.json(updated);
});

// Submit answer for a question
app.post('/api/answer', async (req, res) => {
  const { questionId, selectedAnswer, lessonId, unitId } = req.body;
  const question = questions.find((q) => q.id === questionId);
  if (!question) return res.status(404).json({ error: 'Question not found' });

  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = await loadProgress();

  // Update question history
  if (!progress.questionHistory[questionId]) {
    progress.questionHistory[questionId] = {
      attempts: 0,
      correct: 0,
      lastAttempted: null,
    };
  }
  progress.questionHistory[questionId].attempts += 1;
  if (isCorrect) progress.questionHistory[questionId].correct += 1;
  progress.questionHistory[questionId].lastAttempted = new Date().toISOString();

  // Update totals
  progress.totalQuestionsAnswered += 1;
  if (isCorrect) {
    progress.totalCorrect += 1;
    const xpGain = { easy: 5, medium: 10, hard: 20, very_hard: 35 }[question.difficulty] || 10;
    progress.xp += xpGain;
    // Level up every 100 XP
    progress.level = Math.floor(progress.xp / 100) + 1;
  }

  // Add to review queue if wrong
  if (!isCorrect && !progress.reviewQueue.includes(questionId)) {
    progress.reviewQueue.push(questionId);
  } else if (isCorrect && progress.reviewQueue.includes(questionId)) {
    // Remove from review queue if answered correctly
    const qHistory = progress.questionHistory[questionId];
    if (qHistory.correct >= 2) {
      progress.reviewQueue = progress.reviewQueue.filter((id) => id !== questionId);
    }
  }

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  if (progress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (progress.lastActiveDate === yesterday) {
      progress.currentStreak += 1;
    } else if (progress.lastActiveDate !== today) {
      progress.currentStreak = 1;
    }
    progress.lastActiveDate = today;
  }
  if (progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }

  // Track daily XP
  if (!progress.dailyXp[today]) progress.dailyXp[today] = 0;
  if (isCorrect) {
    const xpGain = { easy: 5, medium: 10, hard: 20, very_hard: 35 }[question.difficulty] || 10;
    progress.dailyXp[today] += xpGain;
  }

  await saveProgress(progress);

  res.json({
    correct: isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    xpGained: isCorrect ? ({ easy: 5, medium: 10, hard: 20, very_hard: 35 }[question.difficulty] || 10) : 0,
    progress,
  });
});

// Complete a lesson
app.post('/api/lessons/complete', async (req, res) => {
  const { unitId, lessonId, score, totalQuestions } = req.body;
  const progress = await loadProgress();
  const lessonKey = `${unitId}-${lessonId}`;

  if (!progress.lessonProgress[lessonKey]) {
    progress.lessonProgress[lessonKey] = {
      bestScore: 0,
      attempts: 0,
      completed: false,
    };
  }

  progress.lessonProgress[lessonKey].attempts += 1;
  if (score > progress.lessonProgress[lessonKey].bestScore) {
    progress.lessonProgress[lessonKey].bestScore = score;
  }

  // Lesson is completed if score is above threshold
  const threshold = Math.ceil(totalQuestions * 0.7);
  if (score >= threshold) {
    progress.lessonProgress[lessonKey].completed = true;
    if (!progress.completedLessons.includes(lessonKey)) {
      progress.completedLessons.push(lessonKey);
      // Bonus XP for completing lesson
      progress.xp += 25;
      progress.level = Math.floor(progress.xp / 100) + 1;
    }
  }

  await saveProgress(progress);
  res.json(progress);
});

// Get review queue questions
app.get('/api/review', async (req, res) => {
  const progress = await loadProgress();
  const reviewQuestions = questions.filter((q) =>
    progress.reviewQueue.includes(q.id)
  );
  res.json(reviewQuestions);
});

// Reset progress
app.post('/api/progress/reset', async (req, res) => {
  await saveProgress({ ...defaultProgress, createdAt: new Date().toISOString() });
  res.json(defaultProgress);
});

// Get leaderboard (local mock + user)
app.get('/api/leaderboard', async (req, res) => {
  const progress = await loadProgress();
  const leaderboard = [
    { name: progress.displayName || 'You', xp: progress.xp, streak: progress.currentStreak, level: progress.level, isUser: true },
    { name: 'Alex Chen', xp: 2450, streak: 15, level: 25, isUser: false },
    { name: 'Sarah Kim', xp: 1890, streak: 8, level: 19, isUser: false },
    { name: 'James Liu', xp: 1650, streak: 22, level: 17, isUser: false },
    { name: 'Priya Patel', xp: 1420, streak: 5, level: 15, isUser: false },
    { name: 'Mike Johnson', xp: 1100, streak: 3, level: 12, isUser: false },
    { name: 'Emma Wilson', xp: 890, streak: 11, level: 9, isUser: false },
    { name: 'David Park', xp: 720, streak: 2, level: 8, isUser: false },
    { name: 'Lisa Zhang', xp: 580, streak: 7, level: 6, isUser: false },
    { name: 'Tom Brown', xp: 340, streak: 1, level: 4, isUser: false },
  ];
  leaderboard.sort((a, b) => b.xp - a.xp);
  res.json(leaderboard);
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  const progress = await loadProgress();
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(progress.questionHistory).length;
  const accuracy = progress.totalQuestionsAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalQuestionsAnswered) * 100)
    : 0;

  res.json({
    totalQuestions,
    answeredQuestions,
    accuracy,
    xp: progress.xp,
    level: progress.level,
    streak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    completedLessons: progress.completedLessons.length,
    totalLessons: units.reduce((sum, u) => sum + u.lessons.length, 0),
    reviewQueueSize: progress.reviewQueue.length,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Interview Prep API running on http://localhost:${PORT}`);
});
