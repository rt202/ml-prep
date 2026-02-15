const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const ACCESS_TOKEN_KEY = 'supabase_access_token'
const REFRESH_TOKEN_KEY = 'supabase_refresh_token'

function isConfigured() {
  const hasValues = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
  const unsafe = SUPABASE_ANON_KEY.startsWith('sb_secret_')
  if (unsafe && typeof window !== 'undefined') {
    // Guard against leaking a service key to the browser bundle.
    console.error('Unsafe Supabase key: VITE_SUPABASE_ANON_KEY appears to be a secret key.')
  }
  return hasValues && !unsafe
}

async function request(path, options = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.error || `Supabase auth failed (${response.status})`)
  }
  return data
}

export const supabaseAuth = {
  isConfigured,
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
  async signup({ email, password, displayName }) {
    const data = await request('/auth/v1/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        data: { display_name: displayName },
      }),
    })
    if (data.session?.access_token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, data.session.access_token)
      if (data.session.refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, data.session.refresh_token)
    }
    return data
  },
  async login({ email, password }) {
    const data = await request('/auth/v1/token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (data.access_token) localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
    if (data.refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
    return data
  },
  async getUser() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (!token) return null
    try {
      return await request('/auth/v1/user', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch {
      return null
    }
  },
  async logout() {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    try {
      if (token) {
        await request('/auth/v1/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      }
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  },
}
