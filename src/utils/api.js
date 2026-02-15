const API_BASE = '/api'

async function fetchJSON(url, options = {}) {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('supabase_access_token') : null
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: 'include',
    ...options,
  })
  if (!res.ok) throw new Error(`API Error: ${res.status}`)
  return res.json()
}

export const api = {
  // Auth
  signup: (data) => fetchJSON('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => fetchJSON('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchJSON('/auth/logout', { method: 'POST' }),
  me: () => fetchJSON('/auth/me'),

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

  // Recommended questions
  getRecommended: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return fetchJSON(`/recommended?${query}`)
  },

  // Profile
  getProfile: () => fetchJSON('/profile'),
  updateProfile: (data) => fetchJSON('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Admin
  getAdminUsers: () => fetchJSON('/admin/users'),
  updateUserRole: (userId, role) => fetchJSON(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
  getAdminContent: () => fetchJSON('/admin/content'),
  createAdminUnit: (data) => fetchJSON('/admin/units', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminUnit: (id, data) => fetchJSON(`/admin/units/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createAdminLesson: (data) => fetchJSON('/admin/lessons', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminLesson: (id, data) => fetchJSON(`/admin/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createAdminQuestion: (data) => fetchJSON('/admin/questions', { method: 'POST', body: JSON.stringify(data) }),
  updateAdminQuestion: (id, data) => fetchJSON(`/admin/questions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}
