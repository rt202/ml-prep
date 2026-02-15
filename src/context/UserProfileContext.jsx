import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../utils/api'
import { useAuth } from './AuthContext'

const UserProfileContext = createContext()

const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard', 'very_hard']
const COMPANY_SIZES = ['startup', 'midsize', 'large', 'faang']

const defaultProfile = {
  username: 'ro',
  avatarSeed: Math.random().toString(36).substring(2, 10),
  role: 'admin',
  difficulty: 'medium',
  companySize: 'large',
}

export function UserProfileProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userProfile')
      if (saved) {
        try {
          return { ...defaultProfile, ...JSON.parse(saved) }
        } catch {
          return defaultProfile
        }
      }
    }
    return defaultProfile
  })

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    if (!isAuthenticated) return
    let mounted = true
    api.getProfile()
      .then((remoteProfile) => {
        if (!mounted) return
        const normalized = {
          username: remoteProfile.displayName || defaultProfile.username,
          role: remoteProfile.role || (remoteProfile.displayName?.toLowerCase() === 'ro' ? 'admin' : 'user'),
          difficulty: remoteProfile.difficulty || defaultProfile.difficulty,
          companySize: remoteProfile.companySize || defaultProfile.companySize,
        }
        setProfile((prev) => ({ ...prev, ...normalized }))
      })
      .catch(() => {})
    return () => { mounted = false }
  }, [isAuthenticated, user?.id])

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates }
      const payload = {}
      if (updates.username !== undefined) payload.displayName = updates.username
      if (updates.difficulty !== undefined) payload.difficulty = updates.difficulty
      if (updates.companySize !== undefined) payload.companySize = updates.companySize
      if (updates.role !== undefined) payload.role = updates.role

      if (Object.keys(payload).length > 0) {
        api.updateProfile(payload)
          .then((saved) => {
            setProfile((current) => ({
              ...current,
              username: saved.displayName || current.username,
              role: saved.role || current.role,
              difficulty: saved.difficulty || current.difficulty,
              companySize: saved.companySize || current.companySize,
            }))
          })
          .catch(() => {})
      }
      return next
    })
  }

  const getAvatarUrl = (seed) => {
    const s = seed || profile.avatarSeed
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(s)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
  }

  return (
    <UserProfileContext.Provider value={{
      profile,
      updateProfile,
      getAvatarUrl,
      DIFFICULTY_LEVELS,
      COMPANY_SIZES,
    }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfile = () => useContext(UserProfileContext)
export { DIFFICULTY_LEVELS, COMPANY_SIZES }
