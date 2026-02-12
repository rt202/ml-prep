import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import { Trophy, Flame, Zap, Medal, Crown, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const rankIcons = {
  0: <Crown className="w-6 h-6 text-highlight-500" />,
  1: <Medal className="w-6 h-6 text-gray-400" />,
  2: <Medal className="w-6 h-6 text-amber-600" />,
}

const rankBgs = {
  0: 'bg-gradient-to-r from-highlight-50 to-highlight-100/50 dark:from-highlight-900/20 dark:to-highlight-900/10 border-highlight-300 dark:border-highlight-700',
  1: 'bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-800/50 border-gray-300 dark:border-gray-700',
  2: 'bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-900/10 dark:to-amber-900/5 border-amber-300 dark:border-amber-700',
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getLeaderboard(), api.getStats()])
      .then(([lb, s]) => {
        setLeaderboard(lb)
        setStats(s)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-highlight-400 to-accent-500 mb-4 shadow-lg shadow-highlight-500/25">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h1>
        <p className="text-gray-500 dark:text-gray-400">See how you stack up against other learners</p>
      </div>

      {/* Your Stats Summary */}
      {stats && (
        <div className="card p-5 mb-8">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-4 h-4 text-highlight-500" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">{stats.xp.toLocaleString()}</span>
              </div>
              <span className="text-xs text-gray-400">Total XP</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-accent-500" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">{stats.streak}</span>
              </div>
              <span className="text-xs text-gray-400">Streak</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">{stats.level}</span>
              </div>
              <span className="text-xs text-gray-400">Level</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-xl font-bold text-gray-900 dark:text-white">{stats.accuracy}%</span>
              </div>
              <span className="text-xs text-gray-400">Accuracy</span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Rankings */}
      <div className="space-y-3">
        {leaderboard.map((entry, index) => {
          const isTopThree = index < 3
          const isUser = entry.isUser

          return (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                isUser
                  ? 'bg-primary-50 dark:bg-primary-900/15 border-primary-300 dark:border-primary-700 ring-2 ring-primary-400/20'
                  : isTopThree
                    ? rankBgs[index] || 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
              }`}
            >
              {/* Rank */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isTopThree
                  ? 'bg-transparent'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {isTopThree ? (
                  rankIcons[index]
                ) : (
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  isUser
                    ? 'bg-gradient-to-br from-primary-500 to-accent-500'
                    : 'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  {entry.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold truncate ${
                      isUser ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {entry.name}
                    </span>
                    {isUser && (
                      <span className="text-xs font-medium bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">Level {entry.level}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 flex-shrink-0">
                {entry.streak > 0 && (
                  <div className="flex items-center gap-1 text-accent-500">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-semibold">{entry.streak}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 text-highlight-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {entry.xp.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Motivational Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-8 p-6 card bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🏆 Complete more lessons and keep your streak going to climb the rankings!
        </p>
      </motion.div>
    </div>
  )
}
