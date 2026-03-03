import { useState } from 'react'
import { Brain, LogIn, UserPlus, Mail, CheckCircle2, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function AuthScreen() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'confirm' | 'welcome', message: string }

  const isLogin = mode === 'login'

  const switchMode = (newMode) => {
    setMode(newMode)
    setError('')
    setStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus(null)
    setSubmitting(true)
    try {
      if (isLogin) {
        await login(email, password)
        // If login succeeded, AuthContext sets the user and the app redirects.
        // Show a brief welcome — it will unmount when redirect happens.
        setStatus({ type: 'welcome', message: `Welcome back${email ? ', ' + email.split('@')[0] : ''}! Signing you in…` })
      } else {
        const result = await signup(email, password, displayName)
        if (result?.needsConfirmation) {
          setStatus({
            type: 'confirm',
            message: `We sent a confirmation link to ${email}. Click it to activate your account, then come back and log in.`,
          })
        } else {
          setStatus({ type: 'welcome', message: `Welcome, ${displayName || email.split('@')[0]}! Setting up your account…` })
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 dark:text-white">Interview Prep</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your ML interview training hub</p>
            </div>
          </div>

          {/* Mode tabs */}
          <div className="flex items-center gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                isLogin
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isLogin
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Status banner */}
          <AnimatePresence mode="wait">
            {status && (
              <motion.div
                key={status.type}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                {status.type === 'confirm' ? (
                  <div className="flex gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
                    <Mail className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-0.5">Check your email</p>
                      <p className="text-sm text-sky-600 dark:text-sky-400">{status.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-green-700 dark:text-green-300">{status.message}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form — hide after email confirmation sent */}
          <AnimatePresence>
            {!(status?.type === 'confirm') && (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display Name
                    </label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="How should we call you?"
                      className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      value={password}
                      type={showPassword ? 'text' : 'password'}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isLogin ? 'Your password' : 'At least 6 characters'}
                      className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-primary-500/20"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {isLogin ? 'Signing in…' : 'Creating account…'}</>
                  ) : isLogin ? (
                    <><LogIn className="w-4 h-4" /> Log In</>
                  ) : (
                    <><UserPlus className="w-4 h-4" /> Create Account</>
                  )}
                </button>

                {!isLogin && (
                  <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                    You'll receive a confirmation email to activate your account.
                  </p>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* After confirmation: option to switch to login */}
          {status?.type === 'confirm' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Already confirmed your email?
              </p>
              <button
                onClick={() => { switchMode('login'); setEmail(email) }}
                className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              >
                Go to Log In →
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
