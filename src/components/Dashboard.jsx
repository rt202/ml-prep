import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useUserProfile } from '../context/UserProfileContext'
import { BookOpen, Target, Flame, Zap, Trophy, RotateCcw, TrendingUp, CheckCircle2, Brain, Sparkles, Building2, ArrowRight } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [progress, setProgress] = useState(null)
  const [recommended, setRecommended] = useState([])
  const [loading, setLoading] = useState(true)
  const { profile } = useUserProfile()

  useEffect(() => {
    Promise.all([api.getStats(), api.getProgress()])
      .then(([s, p]) => { setStats(s); setProgress(p) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  // Fetch recommended questions when profile preferences change
  useEffect(() => {
    api.getRecommended({
      difficulty: profile.difficulty,
      companySize: profile.companySize,
      limit: 6,
    }).then(setRecommended).catch(() => setRecommended([]))
  }, [profile.difficulty, profile.companySize])

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  )

  if (!stats || !progress) return null

  const overallProgress = stats.totalLessons > 0
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100) : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Hero */}
      <div className="card p-8 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white border-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8" />
            <h1 className="text-3xl font-bold">ML Interview Prep</h1>
          </div>
          <p className="text-primary-100 text-lg mb-6 max-w-2xl">
            Master your next Data Science, ML Engineering, AI Engineering, or MLOps interview with bite-sized practice.
          </p>
          <div className="flex gap-4">
            <Link to="/learn" className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold py-3 px-6 rounded-xl hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
              <BookOpen className="w-5 h-5" />
              Continue Learning
            </Link>
            {stats.reviewQueueSize > 0 && (
              <Link to="/review" className="inline-flex items-center gap-2 bg-white/20 text-white font-bold py-3 px-6 rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm">
                <RotateCcw className="w-5 h-5" />
                Review ({stats.reviewQueueSize})
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame className="w-6 h-6 text-accent-500" />}
          label="Day Streak"
          value={stats.streak}
          subtext={stats.longestStreak > 0 ? `Best: ${stats.longestStreak}` : 'Start today!'}
          color="accent"
        />
        <StatCard
          icon={<Zap className="w-6 h-6 text-highlight-500" />}
          label="Total XP"
          value={stats.xp.toLocaleString()}
          subtext={`Level ${stats.level}`}
          color="highlight"
        />
        <StatCard
          icon={<Target className="w-6 h-6 text-primary-500" />}
          label="Accuracy"
          value={`${stats.accuracy}%`}
          subtext={`${stats.answeredQuestions} answered`}
          color="primary"
        />
        <StatCard
          icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
          label="Lessons Done"
          value={stats.completedLessons}
          subtext={`of ${stats.totalLessons} total`}
          color="green"
        />
      </div>

      {/* Overall Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Overall Progress</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stats.totalQuestions} total questions across {stats.totalLessons} lessons</p>
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
            {overallProgress}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill bg-gradient-to-r from-primary-500 to-accent-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/learn" className="card-hover p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Learning Path</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">20 units, progressive difficulty</p>
            </div>
          </div>
        </Link>
        <Link to="/review" className="card-hover p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Review Queue</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stats.reviewQueueSize} questions to review</p>
            </div>
          </div>
        </Link>
        <Link to="/leaderboard" className="card-hover p-6 group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-highlight-100 dark:bg-highlight-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-highlight-600 dark:text-highlight-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Leaderboard</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">See your ranking</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recommended Questions */}
      {recommended.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              Recommended For You
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${
                { easy: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
                  medium: 'bg-highlight-100 dark:bg-highlight-900/30 text-highlight-700 dark:text-highlight-400',
                  hard: 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400',
                  very_hard: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' }[profile.difficulty]
              }`}>
                <Target className="w-3 h-3" />
                {profile.difficulty.replace('_', ' ')}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                <Building2 className="w-3 h-3" />
                {profile.companySize}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            {recommended.map((q, idx) => {
              const diffColors = {
                easy: 'bg-green-500',
                medium: 'bg-highlight-500',
                hard: 'bg-accent-500',
                very_hard: 'bg-red-500',
              }
              return (
                <Link
                  key={q.id}
                  to={`/quiz/${q.unitId}/${q.lessonId}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-200 group"
                >
                  <div className={`w-8 h-8 rounded-lg ${diffColors[q.difficulty]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {q.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {q.unitId.replace(/-/g, ' ')} · {q.roles?.slice(0, 2).map(r => r.replace(/_/g, ' ')).join(', ')}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {Object.keys(progress.dailyXp).length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Recent Activity
          </h2>
          <div className="flex items-end gap-2 h-32">
            {Object.entries(progress.dailyXp)
              .sort(([a], [b]) => a.localeCompare(b))
              .slice(-14)
              .map(([date, xp]) => {
                const maxXp = Math.max(...Object.values(progress.dailyXp), 1)
                const height = Math.max((xp / maxXp) * 100, 4)
                const isToday = date === new Date().toISOString().split('T')[0]
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isToday
                          ? 'bg-gradient-to-t from-primary-500 to-accent-500'
                          : 'bg-primary-200 dark:bg-primary-800'
                      }`}
                      style={{ height: `${height}%` }}
                      title={`${date}: ${xp} XP`}
                    />
                    <span className="text-[9px] text-gray-400">
                      {new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'narrow' })}
                    </span>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, subtext, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</div>
    </div>
  )
}
