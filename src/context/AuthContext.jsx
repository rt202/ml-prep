import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'
import { supabaseAuth } from '../utils/supabaseAuth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = async () => {
    try {
      if (supabaseAuth.isConfigured()) {
        const supabaseUser = await supabaseAuth.getUser()
        if (supabaseUser?.email) {
          const profile = await api.getProfile().catch(() => null)
          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email,
            displayName:
              profile?.displayName ||
              supabaseUser.user_metadata?.display_name ||
              supabaseUser.email.split('@')[0],
            role: profile?.role || 'user',
          })
        } else {
          setUser(null)
        }
      } else {
        const data = await api.me()
        setUser(data.user)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshSession()
  }, [])

  const login = async (email, password) => {
    if (supabaseAuth.isConfigured()) {
      await supabaseAuth.login({ email, password })
      await refreshSession()
      return true
    }
    const data = await api.login({ email, password })
    setUser(data.user)
    return data.user
  }

  const signup = async (email, password, displayName) => {
    if (supabaseAuth.isConfigured()) {
      await supabaseAuth.signup({ email, password, displayName })
      await refreshSession()
      return true
    }
    const data = await api.signup({ email, password, displayName })
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    if (supabaseAuth.isConfigured()) await supabaseAuth.logout()
    else await api.logout()
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    refreshSession,
  }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
