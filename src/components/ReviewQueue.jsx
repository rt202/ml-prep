import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, CheckCircle2, XCircle, ArrowRight, Zap, Inbox, BookOpen } from 'lucide-react'

export default function ReviewQueue() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [explanation, setExplanation] = useState('')
  const [xpGained, setXpGained] = useState(0)
  const [reviewStats, setReviewStats] = useState({ correct: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [sessionComplete, setSessionComplete] = useState(false)

  useEffect(() => {
    api.getReviewQuestions()
      .then(qs => {
        // Shuffle the review queue
        const shuffled = [...qs].sort(() => Math.random() - 0.5)
        setQuestions(shuffled)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAnswer = useCallback(async (answerIndex) => {
    if (isAnswered) return
    setSelectedAnswer(answerIndex)
    setIsAnswered(true)

    try {
      const result = await api.submitAnswer({
        questionId: questions[currentIndex].id,
        selectedAnswer: answerIndex,
        unitId: questions[currentIndex].unitId,
        lessonId: questions[currentIndex].lessonId,
      })

      setIsCorrect(result.correct)
      setExplanation(result.explanation)
      setXpGained(result.xpGained)
      setReviewStats(prev => ({
        correct: prev.correct + (result.correct ? 1 : 0),
        total: prev.total + 1,
      }))
    } catch (err) {
      console.error('Error submitting answer:', err)
    }
  }, [isAnswered, questions, currentIndex])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setSessionComplete(true)
      return
    }
    setCurrentIndex(prev => prev + 1)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setIsCorrect(null)
    setExplanation('')
    setXpGained(0)
  }, [currentIndex, questions.length])

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  )

  // Empty review queue
  if (questions.length === 0) return (
    <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 gap-6 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
        <Inbox className="w-10 h-10 text-green-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Queue Empty!</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        You don't have any questions to review. Keep learning and any questions you get wrong will appear here for practice.
      </p>
      <button
        onClick={() => navigate('/learn')}
        className="btn-primary flex items-center gap-2"
      >
        <BookOpen className="w-4 h-4" />
        Continue Learning
      </button>
    </div>
  )

  // Session complete
  if (sessionComplete) {
    const accuracy = reviewStats.total > 0 ? Math.round((reviewStats.correct / reviewStats.total) * 100) : 0
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 gap-6"
      >
        <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
          <RotateCcw className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Review Complete!</h2>
        <div className="card p-6 w-full max-w-sm">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{reviewStats.correct}/{reviewStats.total}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">{accuracy}%</div>
              <div className="text-sm text-gray-500">Accuracy</div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm max-w-md">
          Questions answered correctly twice are removed from your review queue.
        </p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/learn')} className="btn-primary flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Continue Learning
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Dashboard
          </button>
        </div>
      </motion.div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex) / questions.length) * 100

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <RotateCcw className="w-6 h-6 text-accent-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Queue</h1>
          <span className="badge bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400">
            {questions.length} questions
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Practice questions you previously got wrong</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-sm font-medium text-primary-500">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill bg-gradient-to-r from-accent-500 to-highlight-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <div className="card p-8 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`badge-${currentQuestion.difficulty}`}>
                {currentQuestion.difficulty.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-400">
                {currentQuestion.unitId.replace(/-/g, ' ')} &rsaquo; {currentQuestion.lessonId.replace(/-/g, ' ')}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, idx) => {
              let style = 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:border-accent-400 dark:hover:border-accent-600 cursor-pointer'
              if (isAnswered) {
                if (idx === currentQuestion.correctAnswer) {
                  style = 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 ring-2 ring-green-400/30'
                } else if (idx === selectedAnswer && !isCorrect) {
                  style = 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600 ring-2 ring-red-400/30'
                } else {
                  style = 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 opacity-60'
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswered && handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-200 text-left ${style}`}
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
                      : 'text-gray-800 dark:text-gray-200'
                  }`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Explanation + Next */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className={`card p-6 mb-4 border-2 ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/10 border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/10 border-red-300 dark:border-red-700'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span className="font-bold text-green-700 dark:text-green-300">Correct!</span>
                    {xpGained > 0 && (
                      <span className="flex items-center gap-1 text-highlight-600 dark:text-highlight-400 font-bold text-sm">
                        <Zap className="w-4 h-4" /> +{xpGained} XP
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    <span className="font-bold text-red-700 dark:text-red-300">Not quite — keep practicing!</span>
                  </>
                )}
              </div>
              <p className={`text-sm leading-relaxed ${
                isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
              }`}>
                {explanation}
              </p>
            </div>

            <button
              onClick={handleNext}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
                isCorrect
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {currentIndex + 1 >= questions.length ? 'Finish Review' : 'Next Question'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
