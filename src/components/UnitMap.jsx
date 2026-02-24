import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../utils/api'
import { useUserProfile } from '../context/UserProfileContext'
import { Lock, CheckCircle2, PlayCircle, ChevronDown, ChevronRight, Star, Code2 } from 'lucide-react'

export default function UnitMap() {
  const [units, setUnits] = useState([])
  const [progress, setProgress] = useState(null)
  const [codingByUnit, setCodingByUnit] = useState({})
  const [expandedUnit, setExpandedUnit] = useState(null)
  const [loading, setLoading] = useState(true)
  const { profile } = useUserProfile()
  const isAdmin = profile.role === 'admin'

  useEffect(() => {
    Promise.all([api.getUnits(), api.getProgress(), api.getAllCodingQuestions()])
      .then(([u, p, coding]) => {
        setUnits(u)
        setProgress(p)
        // Group coding challenges by unit
        const byUnit = {}
        for (const c of coding) {
          if (!byUnit[c.unitId]) byUnit[c.unitId] = []
          byUnit[c.unitId].push(c)
        }
        setCodingByUnit(byUnit)
        // Auto-expand the first incomplete unit
        const firstIncomplete = u.find(unit =>
          unit.lessons.some(l => !p.completedLessons.includes(`${unit.id}-${l.id}`))
        )
        if (firstIncomplete) setExpandedUnit(firstIncomplete.id)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  )

  const isUnitUnlocked = (unitIndex) => {
    if (isAdmin) return true
    if (unitIndex === 0) return true
    const prevUnit = units[unitIndex - 1]
    return prevUnit.lessons.every(l =>
      progress?.completedLessons.includes(`${prevUnit.id}-${l.id}`)
    )
  }

  const getUnitProgress = (unit) => {
    if (!progress) return 0
    const completed = unit.lessons.filter(l =>
      progress.completedLessons.includes(`${unit.id}-${l.id}`)
    ).length
    return Math.round((completed / unit.lessons.length) * 100)
  }

  const isLessonUnlocked = (unit, lessonIndex, unitIndex) => {
    if (isAdmin) return true
    if (!isUnitUnlocked(unitIndex)) return false
    if (lessonIndex === 0) return true
    const prevLesson = unit.lessons[lessonIndex - 1]
    return progress?.completedLessons.includes(`${unit.id}-${prevLesson.id}`)
  }

  const getLessonStatus = (unit, lesson) => {
    if (!progress) return 'locked'
    const key = `${unit.id}-${lesson.id}`
    if (progress.completedLessons.includes(key)) return 'completed'
    return 'available'
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Learning Path</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isAdmin
            ? 'Admin mode: all learning paths are visible and unlocked.'
            : 'Master each topic from fundamentals to expert level'}
        </p>
      </div>

      {units.map((unit, unitIndex) => {
        const unlocked = isUnitUnlocked(unitIndex)
        const unitProgress = getUnitProgress(unit)
        const isExpanded = expandedUnit === unit.id
        const allComplete = unitProgress === 100

        return (
          <div key={unit.id} className={`card overflow-hidden transition-all duration-300 ${!unlocked ? 'opacity-60' : ''}`}>
            {/* Unit Header */}
            <button
              onClick={() => unlocked && setExpandedUnit(isExpanded ? null : unit.id)}
              className={`w-full flex items-center gap-4 p-5 text-left transition-colors ${
                unlocked ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer' : 'cursor-not-allowed'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                allComplete
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : unlocked
                    ? 'bg-primary-100 dark:bg-primary-900/30'
                    : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {unlocked ? unit.icon : '🔒'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900 dark:text-white truncate">
                    Unit {unit.order}: {unit.name}
                  </h2>
                  {allComplete && <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{unit.description}</p>
                {unlocked && (
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-[200px]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          allComplete ? 'bg-green-500' : 'bg-gradient-to-r from-primary-500 to-accent-500'
                        }`}
                        style={{ width: `${unitProgress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-400">{unitProgress}%</span>
                  </div>
                )}
              </div>
              {unlocked && (
                <div className="text-gray-400">
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              )}
            </button>

            {/* Lessons + Coding Challenges */}
            {isExpanded && unlocked && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-2">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const isUnlocked = isLessonUnlocked(unit, lessonIndex, unitIndex)
                  const status = getLessonStatus(unit, lesson)
                  const lessonKey = `${unit.id}-${lesson.id}`
                  const bestScore = progress?.lessonProgress[lessonKey]?.bestScore
                  const attempts = progress?.lessonProgress[lessonKey]?.attempts || 0

                  return (
                    <div key={lesson.id}>
                      {isUnlocked ? (
                        <Link
                          to={`/quiz/${unit.id}/${lesson.id}`}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                            status === 'completed'
                              ? 'bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20'
                              : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            status === 'completed'
                              ? 'bg-green-500 text-white'
                              : 'bg-primary-500 text-white'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <PlayCircle className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{lesson.name}</h3>
                            <p className="text-xs text-gray-400">
                              {lesson.questionCount} questions
                              {attempts > 0 && ` · ${attempts} attempt${attempts > 1 ? 's' : ''}`}
                              {bestScore !== undefined && ` · Best: ${bestScore}/${lesson.questionCount}`}
                            </p>
                          </div>
                          {status === 'completed' && (
                            <div className="flex items-center gap-0.5">
                              {[1,2,3].map(i => (
                                <Star key={i} className={`w-4 h-4 ${
                                  bestScore >= lesson.questionCount * (i * 0.33)
                                    ? 'text-highlight-400 fill-highlight-400'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`} />
                              ))}
                            </div>
                          )}
                        </Link>
                      ) : (
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/30 opacity-50">
                          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <Lock className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-500 text-sm">{lesson.name}</h3>
                            <p className="text-xs text-gray-400">{lesson.questionCount} questions</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Coding Challenges */}
                {codingByUnit[unit.id]?.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 pt-3 pb-1 px-1">
                      <Code2 className="w-4 h-4 text-accent-500" />
                      <span className="text-xs font-bold text-accent-600 dark:text-accent-400 uppercase tracking-wider">
                        Coding Challenges
                      </span>
                    </div>
                    {codingByUnit[unit.id].map((challenge) => {
                      const diffColors = {
                        easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                        hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                      }
                      return (
                        <Link
                          key={challenge.id}
                          to={`/code/${unit.id}/${challenge.id}`}
                          className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-accent-50 to-primary-50 dark:from-accent-900/10 dark:to-primary-900/10 hover:from-accent-100 hover:to-primary-100 dark:hover:from-accent-900/20 dark:hover:to-primary-900/20 transition-all duration-200 border border-accent-200/50 dark:border-accent-800/30"
                        >
                          <div className="w-10 h-10 rounded-xl bg-accent-500 text-white flex items-center justify-center">
                            <Code2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{challenge.title}</h3>
                            <p className="text-xs text-gray-400">Python · Coding challenge</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${diffColors[challenge.difficulty]}`}>
                            {challenge.difficulty}
                          </span>
                        </Link>
                      )
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
