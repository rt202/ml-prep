import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import UnitMap from './components/UnitMap'
import Quiz from './components/Quiz'
import ReviewQueue from './components/ReviewQueue'
import Leaderboard from './components/Leaderboard'
import LessonComplete from './components/LessonComplete'

export default function App() {
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
        </Routes>
      </main>
    </div>
  )
}
