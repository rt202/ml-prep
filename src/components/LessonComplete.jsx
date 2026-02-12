import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Star, Zap, ArrowRight, RotateCcw, Home, CheckCircle2, XCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

const CONFETTI_COLORS = ['#a855f7', '#f97316', '#facc15', '#22c55e', '#3b82f6', '#ec4899']

function Confetti() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: Math.random() * 8 + 4,
      opacity: 1,
    }))

    let animId
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let alive = false
      particles.forEach(p => {
        if (p.opacity <= 0) return
        alive = true
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.1
        p.rotation += p.rotationSpeed
        if (p.y > canvas.height) p.opacity -= 0.02

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2.5)
        ctx.restore()
      })
      if (alive) animId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
}

export default function LessonComplete() {
  const { unitId, lessonId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state || {}

  const {
    score = 0,
    totalQuestions = 0,
    xpGained = 0,
    unitName = '',
    lessonName = '',
    passed = false,
  } = state

  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const stars = percentage >= 100 ? 3 : percentage >= 85 ? 2 : percentage >= 70 ? 1 : 0

  // Redirect to learn if no state
  useEffect(() => {
    if (!location.state) {
      navigate('/learn')
    }
  }, [location.state, navigate])

  if (!location.state) return null

  return (
    <div className="max-w-2xl mx-auto py-8">
      {passed && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 }}
          className="mx-auto mb-6"
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
            passed
              ? 'bg-gradient-to-br from-primary-500 to-accent-500 shadow-xl shadow-primary-500/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {passed ? 'Lesson Complete!' : 'Almost There!'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500 dark:text-gray-400 mb-8"
        >
          {unitName} &rsaquo; {lessonName}
        </motion.p>

        {/* Stars */}
        {passed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.5 + i * 0.15 }}
              >
                <Star
                  className={`w-12 h-12 ${
                    i <= stars
                      ? 'text-highlight-400 fill-highlight-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card p-8 mb-8"
        >
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{score}/{totalQuestions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                {percentage}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Accuracy</div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <Zap className="w-6 h-6 text-highlight-500" />
                <span className="text-3xl font-bold text-highlight-600 dark:text-highlight-400">
                  {xpGained}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">XP Earned</div>
            </div>
          </div>

          {/* Progress bar visual */}
          <div className="mt-6">
            <div className="progress-bar">
              <motion.div
                className={`progress-fill ${
                  passed
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500'
                    : 'bg-red-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>0%</span>
              <span className="font-medium text-primary-500">70% to pass</span>
              <span>100%</span>
            </div>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          {passed ? (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">
                {percentage === 100 ? 'Perfect score! Amazing work!' :
                 percentage >= 85 ? 'Great job! Almost perfect!' :
                 'Lesson passed! Keep going!'}
              </span>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              You need at least 70% to pass. Review the material and try again!
            </p>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex items-center justify-center gap-3"
        >
          {passed ? (
            <>
              <Link to="/learn" className="btn-primary flex items-center gap-2">
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/" className="btn-secondary flex items-center gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(`/quiz/${unitId}/${lessonId}`)}
                className="btn-primary flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <Link to="/learn" className="btn-secondary flex items-center gap-2">
                Back to Path
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
