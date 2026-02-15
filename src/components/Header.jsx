import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { Brain, Home, BookOpen, Trophy, RotateCcw, Flame, Zap } from 'lucide-react'
import UserProfileDropdown from './UserProfileDropdown'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { isAdmin } = useAuth()
  const location = useLocation()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {})
  }, [location.pathname])

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/learn', icon: BookOpen, label: 'Learn' },
    { path: '/review', icon: RotateCcw, label: 'Review' },
    { path: '/leaderboard', icon: Trophy, label: 'Ranks' },
    ...(isAdmin ? [{ path: '/admin', icon: Trophy, label: 'Admin' }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              ML Prep
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right side: Stats + User Profile */}
          <div className="flex items-center gap-4">
            {stats && (
              <div className="flex items-center gap-4 text-sm">
                {stats.streak > 0 && (
                  <div className="flex items-center gap-1.5 text-accent-500">
                    <Flame className="w-4 h-4 streak-fire" />
                    <span className="font-bold">{stats.streak}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-highlight-500">
                  <Zap className="w-4 h-4" />
                  <span className="font-bold">{stats.xp}</span>
                </div>
              </div>
            )}
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}
