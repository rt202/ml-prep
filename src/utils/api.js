const API_BASE = '/api'

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

export const api = {
  // Units & Questions
  getUnits: () => fetchJSON('/units'),
  getLessonQuestions: (unitId, lessonId) => fetchJSON(`/lessons/${unitId}/${lessonId}/questions`),
  getQuestions: (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    return fetchJSON(`/questions?${params}`)
  },

  // Progress
  getProgress: () => fetchJSON('/progress'),
  updateProgress: (data) => fetchJSON('/progress', { method: 'PUT', body: JSON.stringify(data) }),
  resetProgress: () => fetchJSON('/progress/reset', { method: 'POST' }),

  // Answers
  submitAnswer: (data) => fetchJSON('/answer', { method: 'POST', body: JSON.stringify(data) }),

  // Lessons
  completeLesson: (data) => fetchJSON('/lessons/complete', { method: 'POST', body: JSON.stringify(data) }),

  // Review
  getReviewQuestions: () => fetchJSON('/review'),

  // Leaderboard
  getLeaderboard: () => fetchJSON('/leaderboard'),

  // Stats
  getStats: () => fetchJSON('/stats'),
}
