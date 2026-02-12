import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { Heart, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Zap, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MAX_HEARTS = 5

function HeartDisplay({ hearts, maxHearts, breakingHeart }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: maxHearts }).map((_, i) => {
        const isFilled = i < hearts
        const isBreaking = breakingHeart && i === hearts
        return (
          <motion.div
            key={i}
            animate={isBreaking ? {
              scale: [1, 1.4, 0.8, 1],
              rotate: [0, -10, 10, 0],
              filter: ['grayscale(0)', 'grayscale(0)', 'grayscale(100%)', 'grayscale(100%)'],
              opacity: [1, 1, 0.4, 0.3],
            } : {}}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <Heart
              className={`w-6 h-6 transition-all duration-300 ${
                isFilled
                  ? 'text-red-500 fill-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.4)]'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

export default function Quiz() {
  const { unitId, lessonId } = useParams()
  const navigate = useNavigate()

  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [explanation, setExplanation] = useState('')
  const [xpGained, setXpGained] = useState(0)
  const [totalXpGained, setTotalXpGained] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [breakingHeart, setBreakingHeart] = useState(false)
  const [shakeWrong, setShakeWrong] = useState(false)
  const [lessonName, setLessonName] = useState('')
  const [unitName, setUnitName] = useState('')
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const [qs, units] = await Promise.all([
          api.getLessonQuestions(unitId, lessonId),
          api.getUnits(),
        ])
        setQuestions(qs)
        const unit = units.find(u => u.id === unitId)
        if (unit) {
          setUnitName(unit.name)
          const lesson = unit.lessons.find(l => l.id === lessonId)
          if (lesson) setLessonName(lesson.name)
        }
      } catch (err) {
        console.error('Failed to load quiz:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [unitId, lessonId])

  // Calculate how many hearts lost means fail
  // Scale: for 10 questions allow losing up to 3 hearts (need 70%+)
  const maxWrong = Math.max(1, Math.floor(questions.length * 0.3))
  const heartsNeeded = MAX_HEARTS - maxWrong

  const handleAnswer = useCallback(async (answerIndex) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
    setIsAnswered(true)

    try {
      const result = await api.submitAnswer({
        questionId: questions[currentIndex].id,
        selectedAnswer: answerIndex,
        unitId,
        lessonId,
      })

      setIsCorrect(result.correct)
      setExplanation(result.explanation)
      setXpGained(result.xpGained)

      if (result.correct) {
        setScore(prev => prev + 1)
        setTotalXpGained(prev => prev + result.xpGained)
      } else {
        const newHearts = hearts - 1
        setHearts(newHearts)
        setBreakingHeart(true)
        setShakeWrong(true)
        setTimeout(() => {
          setBreakingHeart(false)
          setShakeWrong(false)
        }, 800)

        if (newHearts <= 0) {
          setTimeout(() => setGameOver(true), 1000)
        }
      }
    } catch (err) {
      console.error('Error submitting answer:', err)
    }
  }, [isAnswered, questions, currentIndex, unitId, lessonId, hearts])

  const handleNext = useCallback(async () => {
    if (currentIndex + 1 >= questions.length) {
      // Lesson complete - submit to server
      try {
        await api.completeLesson({
          unitId,
          lessonId,
          score,
          totalQuestions: questions.length,
        })
      } catch (err) {
        console.error('Error completing lesson:', err)
      }
      navigate(`/lesson-complete/${unitId}/${lessonId}`, {
        state: {
          score,
          totalQuestions: questions.length,
          xpGained: totalXpGained,
          unitName,
          lessonName,
          passed: score >= Math.ceil(questions.length * 0.7),
        },
      })
      return
    }

    setCurrentIndex(prev => prev + 1)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(null)
    setExplanation('')
    setXpGained(0)
  }, [currentIndex, questions.length, navigate, unitId, lessonId, score, totalXpGained, unitName, lessonName])

  const handleRestart = () => {
    setCurrentIndex(0)
    setHearts(MAX_HEARTS)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(null)
    setExplanation('')
    setXpGained(0)
    setTotalXpGained(0)
    setScore(0)
    setGameOver(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  )

  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <AlertTriangle className="w-12 h-12 text-accent-500" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">No questions found</h2>
      <p className="text-gray-500">This lesson doesn't have any questions yet.</p>
      <button onClick={() => navigate('/learn')} className="btn-primary">Back to Learning Path</button>
    </div>
  )

  // Game Over screen
  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 gap-6"
      >
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Out of Hearts!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          You got {score} out of {currentIndex + 1} questions right. You need at least 70% to pass this lesson. Practice makes perfect!
        </p>
        <div className="flex gap-3">
          <button onClick={handleRestart} className="btn-primary flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <button onClick={() => navigate('/learn')} className="btn-secondary">
            Back to Path
          </button>
        </div>
      </motion.div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100
  const difficultyColors = {
    easy: 'badge-easy',
    medium: 'badge-medium',
    hard: 'badge-hard',
    very_hard: 'badge-very_hard',
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Top Bar: Progress + Hearts */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/learn')}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <XCircle className="w-6 h-6" />
        </button>
        <div className="flex-1 progress-bar h-4">
          <motion.div
            className="progress-fill bg-gradient-to-r from-primary-500 to-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <HeartDisplay hearts={hearts} maxHearts={MAX_HEARTS} breakingHeart={breakingHeart} />
      </div>

      {/* Question Counter & Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className={difficultyColors[currentQuestion.difficulty]}>
            {currentQuestion.difficulty.replace('_', ' ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {currentQuestion.companySizes?.map(size => (
            <span key={size} className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
              {size}
            </span>
          ))}
        </div>
      </div>

      {/* Lesson Context */}
      <div className="text-xs text-gray-400 mb-2">
        {unitName} &rsaquo; {lessonName}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className={shakeWrong ? 'wrong-shake' : ''}
        >
          <div className="card p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
              {currentQuestion.text}
            </h2>
            {currentQuestion.roles && (
              <div className="flex items-center gap-2 mt-3">
                {currentQuestion.roles.slice(0, 3).map(role => (
                  <span key={role} className="text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {role.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              let optionStyle = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer'

              if (isAnswered) {
                if (idx === currentQuestion.correctAnswer) {
                  optionStyle = 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 ring-2 ring-green-400/30'
                } else if (idx === selectedAnswer && !isCorrect) {
                  optionStyle = 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 ring-2 ring-red-400/30'
                } else {
                  optionStyle = 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 opacity-60'
                }
              } else if (idx === selectedAnswer) {
                optionStyle = 'bg-primary-50 dark:bg-primary-900/20 border-primary-400 dark:border-primary-600 ring-2 ring-primary-400/30'
              }

              return (
                <motion.button
                  key={idx}
                  whileHover={!isAnswered ? { scale: 1.01 } : {}}
                  whileTap={!isAnswered ? { scale: 0.99 } : {}}
                  onClick={() => !isAnswered && handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left ${optionStyle}`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isAnswered && idx === currentQuestion.correctAnswer
                      ? 'bg-green-500 text-white'
                      : isAnswered && idx === selectedAnswer && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {isAnswered && idx === currentQuestion.correctAnswer ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isAnswered && idx === selectedAnswer && !isCorrect ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <span className={`text-base ${
                    isAnswered && idx === currentQuestion.correctAnswer
                      ? 'text-green-700 dark:text-green-300 font-semibold'
                      : isAnswered && idx === selectedAnswer && !isCorrect
                        ? 'text-red-700 dark:text-red-300'
                        : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {option}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Result Banner + Explanation */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Result Banner */}
            <div className={`card p-6 mb-4 border-2 ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-green-500" />
                    </motion.div>
                    <span className="text-lg font-bold text-green-700 dark:text-green-300">Correct!</span>
                    {xpGained > 0 && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1 text-highlight-600 dark:text-highlight-400 font-bold text-sm"
                      >
                        <Zap className="w-4 h-4" />
                        +{xpGained} XP
                      </motion.div>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle className="w-7 h-7 text-red-500" />
                    <span className="text-lg font-bold text-red-700 dark:text-red-300">Not quite</span>
                  </>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${
                isCorrect
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {explanation}
              </p>
            </div>

            {/* Next Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isCorrect
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
                  : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
              }`}
            >
              {currentIndex + 1 >= questions.length ? 'See Results' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
