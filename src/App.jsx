import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import UnitMap from './components/UnitMap'
import Quiz from './components/Quiz'
import ReviewQueue from './components/ReviewQueue'
import Leaderboard from './components/Leaderboard'
import LessonComplete from './components/LessonComplete'
import ThemeToggleFloat from './components/ThemeToggleFloat'
import AuthScreen from './components/AuthScreen'
import AdminPanel from './components/AdminPanel'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { loading, isAuthenticated, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<UnitMap />} />
          <Route path="/quiz/:unitId/:lessonId" element={<Quiz />} />
          <Route path="/lesson-complete/:unitId/:lessonId" element={<LessonComplete />} />
          <Route path="/review" element={<ReviewQueue />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" replace />} />
        </Routes>
      </main>
      <ThemeToggleFloat />
    </div>
  )
}
