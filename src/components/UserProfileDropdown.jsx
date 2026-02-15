import { useState, useEffect, useRef } from 'react'
import { useUserProfile } from '../context/UserProfileContext'
import { api } from '../utils/api'
import { ChevronDown, Settings, Target, Flame, Building2, BarChart3, Pencil, RefreshCw, Check, Shield } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserProfileDropdown() {
  const { profile, updateProfile, getAvatarUrl, DIFFICULTY_LEVELS, COMPANY_SIZES } = useUserProfile()
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(profile.username)
  const [showSettings, setShowSettings] = useState(false)
  const dropdownRef = useRef(null)
  const nameInputRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    api.getStats().then(setStats).catch(() => {})
  }, [location.pathname])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
        setShowSettings(false)
        setEditingName(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus()
      nameInputRef.current.select()
    }
  }, [editingName])

  const saveName = () => {
    const trimmed = nameInput.trim()
    if (trimmed) {
      updateProfile({ username: trimmed })
    } else {
      setNameInput(profile.username)
    }
    setEditingName(false)
  }

  const regenerateAvatar = () => {
    updateProfile({ avatarSeed: Math.random().toString(36).substring(2, 10) })
  }

  const difficultyLabels = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    very_hard: 'Very Hard',
  }

  const difficultyColors = {
    easy: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    medium: 'text-highlight-600 dark:text-highlight-400 bg-highlight-100 dark:bg-highlight-900/30',
    hard: 'text-accent-600 dark:text-accent-400 bg-accent-100 dark:bg-accent-900/30',
    very_hard: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
  }

  const companySizeLabels = {
    startup: 'Startup',
    midsize: 'Mid-size',
    large: 'Large',
    faang: 'FAANG',
  }

  const companySizeIcons = {
    startup: '🚀',
    midsize: '🏢',
    large: '🏛️',
    faang: '⭐',
  }

  const roleLabel = profile.role === 'admin' ? 'Admin' : 'User'

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowSettings(false); setEditingName(false) }}
        className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
      >
        <img
          src={getAvatarUrl()}
          alt="Avatar"
          className="w-8 h-8 rounded-lg ring-2 ring-primary-200 dark:ring-primary-800 group-hover:ring-primary-400 dark:group-hover:ring-primary-600 transition-all"
        />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:inline max-w-[100px] truncate">
          {profile.username}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50 animate-fade-in">
          {!showSettings ? (
            <>
              {/* Profile Header */}
              <div className="p-5 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                <div className="relative flex items-center gap-4">
                  <div className="relative group">
                    <img
                      src={getAvatarUrl()}
                      alt="Avatar"
                      className="w-16 h-16 rounded-xl ring-2 ring-white/30 shadow-lg"
                    />
                    <button
                      onClick={regenerateAvatar}
                      className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="New avatar"
                    >
                      <RefreshCw className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    {editingName ? (
                      <div className="flex items-center gap-1">
                        <input
                          ref={nameInputRef}
                          value={nameInput}
                          onChange={(e) => setNameInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setEditingName(false); setNameInput(profile.username) } }}
                          className="bg-white/20 text-white placeholder-white/50 rounded-lg px-2 py-1 text-sm font-bold w-full outline-none focus:ring-2 focus:ring-white/40"
                          maxLength={20}
                          placeholder="Username"
                        />
                        <button onClick={saveName} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                          <Check className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg truncate">{profile.username}</h3>
                        <button
                          onClick={() => { setEditingName(true); setNameInput(profile.username) }}
                          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5 text-white/70" />
                        </button>
                      </div>
                    )}
                    <p className="text-primary-100 text-xs mt-0.5">
                      Level {stats?.level || 1} · {stats?.xp?.toLocaleString() || 0} XP
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-semibold uppercase tracking-wider">
                      <Shield className="w-3 h-3" />
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800">
                <div className="bg-white dark:bg-gray-900 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-accent-500 mb-1">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{stats?.streak || 0}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Streak</div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-primary-500 mb-1">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{stats?.accuracy || 0}%</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Accuracy</div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{stats?.completedLessons || 0}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Lessons</div>
                </div>
              </div>

              {/* Current Preferences */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Target className="w-4 h-4" />
                    Difficulty
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColors[profile.difficulty]}`}>
                    {difficultyLabels[profile.difficulty]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Building2 className="w-4 h-4" />
                    Target Company
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {companySizeIcons[profile.companySize]} {companySizeLabels[profile.companySize]}
                  </span>
                </div>
              </div>

              {/* Settings Button */}
              <div className="border-t border-gray-100 dark:border-gray-800 p-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Edit Preferences
                </button>
                <button
                  onClick={logout}
                  className="w-full mt-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Settings Panel */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-sm text-primary-500 hover:text-primary-600 font-medium mb-3 flex items-center gap-1"
                >
                  ← Back to Profile
                </button>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Preferences</h3>
                <p className="text-xs text-gray-400 mt-1">These affect your recommended questions</p>
              </div>

              <div className="p-4 space-y-5">
                {/* Difficulty Selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary-500" />
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DIFFICULTY_LEVELS.map(level => (
                      <button
                        key={level}
                        onClick={() => updateProfile({ difficulty: level })}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border-2 ${
                          profile.difficulty === level
                            ? `${difficultyColors[level]} border-current ring-2 ring-current/20`
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        {difficultyLabels[level]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Company Size Selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-500" />
                    Target Company Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {COMPANY_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => updateProfile({ companySize: size })}
                        className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border-2 flex items-center justify-center gap-1.5 ${
                          profile.companySize === size
                            ? 'border-primary-400 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 ring-2 ring-primary-400/20'
                            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span>{companySizeIcons[size]}</span>
                        {companySizeLabels[size]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[11px] text-gray-400 text-center">
                  Changes are saved automatically and affect recommended questions on your dashboard.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
