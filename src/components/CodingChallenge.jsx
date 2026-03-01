import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../utils/api'
import { getPyodide, runPython, runTests, runSql, runSqlTests } from '../utils/pyodideRunner'
import {
  Heart,
  Play,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Eye,
  RotateCcw,
  ArrowLeft,
  Loader2,
  Code2,
  FlaskConical,
  Terminal,
  Database,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MAX_HEARTS = 5

/* ────────── Heart display (reused from Quiz) ────────── */
function HeartDisplay({ hearts, maxHearts }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }).map((_, i) => (
        <Heart
          key={i}
          className={`w-5 h-5 transition-all duration-300 ${
            i < hearts
              ? 'text-red-500 fill-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.4)]'
              : 'text-gray-300 dark:text-gray-600'
          }`}
        />
      ))}
    </div>
  )
}

/* ────────── Code Editor with line numbers ────────── */
function CodeEditor({ value, onChange, disabled }) {
  const textareaRef = useRef(null)
  const lineNumbersRef = useRef(null)
  const lines = value.split('\n')

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd } = e.target
      const before = value.slice(0, selectionStart)
      const after = value.slice(selectionEnd)
      const newValue = before + '    ' + after
      onChange(newValue)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 4
      })
    }
  }

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop
    }
  }

  return (
    <div className="relative rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-950">
      <div className="flex" style={{ maxHeight: '28rem' }}>
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 py-4 px-3 text-right select-none overflow-hidden bg-gray-900 border-r border-gray-800"
          style={{ minWidth: '3rem', lineHeight: '1.4rem', fontSize: '13px' }}
        >
          {lines.map((_, i) => (
            <div key={i} className="text-gray-500 font-mono">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="flex-1 py-4 px-4 bg-gray-950 text-green-300 font-mono resize-none outline-none overflow-auto"
          style={{
            lineHeight: '1.4rem',
            fontSize: '13px',
            tabSize: 4,
            caretColor: '#4ade80',
            minHeight: '12rem',
          }}
        />
      </div>
    </div>
  )
}

/* ────────── Test result row ────────── */
function TestResult({ test, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`flex items-start gap-3 p-3 rounded-lg ${
        test.passed
          ? 'bg-green-50 dark:bg-green-900/15'
          : 'bg-red-50 dark:bg-red-900/15'
      }`}
    >
      {test.passed ? (
        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
      ) : (
        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${test.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
          {test.name}
        </p>
        {!test.passed && (
          <div className="text-xs mt-1 space-y-0.5">
            {test.expected && (
              <p className="text-gray-500">Expected: <code className="text-red-600 dark:text-red-400">{test.expected}</code></p>
            )}
            {test.actual && (
              <p className="text-gray-500">Got: <code className="text-red-600 dark:text-red-400">{test.actual}</code></p>
            )}
            {test.error && (
              <p className="text-red-600 dark:text-red-400 font-mono">{test.error}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════════════════════
   Main CodingChallenge Component
   ════════════════════════════════════════════════════════ */
export default function CodingChallenge() {
  const { unitId, challengeId } = useParams()
  const navigate = useNavigate()

  // Data
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Editor
  const [code, setCode] = useState('')

  // Execution
  const [pyodideReady, setPyodideReady] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [grading, setGrading] = useState(false)
  const [output, setOutput] = useState('')
  const [testResults, setTestResults] = useState(null)
  const [activeTab, setActiveTab] = useState('output') // 'output' | 'tests'

  // Game state
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [passed, setPassed] = useState(false)
  const [showSchema, setShowSchema] = useState(true)

  const isSql = challenge?.language === 'sql'

  /* ─── Load challenge data ─── */
  useEffect(() => {
    async function load() {
      try {
        const challenges = await api.getCodingQuestions(unitId)
        const found = challenges.find((c) => c.id === challengeId)
        if (!found) {
          setError('Challenge not found')
          return
        }
        setChallenge(found)
        setCode(found.starterCode)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [unitId, challengeId])

  /* ─── Lazy-load Pyodide ─── */
  useEffect(() => {
    let cancelled = false
    setPyodideLoading(true)
    getPyodide()
      .then(() => {
        if (!cancelled) setPyodideReady(true)
      })
      .catch((err) => {
        if (!cancelled) setError('Failed to load Python engine: ' + err.message)
      })
      .finally(() => {
        if (!cancelled) setPyodideLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  /* ─── Run code (free, no heart cost) ─── */
  const handleRun = useCallback(async () => {
    if (!pyodideReady || running) return
    setRunning(true)
    setOutput('')
    setTestResults(null)
    setActiveTab('output')

    const result = isSql
      ? await runSql(code, challenge.setupCode)
      : await runPython(code)
    const { stdout, stderr, error: pyErr } = result

    let out = ''
    if (stdout) out += stdout
    if (stderr) out += (out ? '\n' : '') + stderr
    if (pyErr) out += (out ? '\n' : '') + '❌ ' + pyErr
    if (!out.trim()) out = '(no output)'

    setOutput(out)
    setRunning(false)
  }, [code, pyodideReady, running, isSql, challenge])

  /* ─── Grade (run tests, costs a heart if fails) ─── */
  const handleGrade = useCallback(async () => {
    if (!pyodideReady || grading || !challenge) return
    setGrading(true)
    setTestResults(null)
    setOutput('')
    setActiveTab('tests')

    const { results, stdout, error: pyErr } = isSql
      ? await runSqlTests(code, challenge.setupCode, challenge.testCode)
      : await runTests(code, challenge.testCode)

    if (stdout) setOutput(stdout)

    if (!results) {
      // Couldn't parse test results — likely a syntax/runtime error
      setOutput(pyErr || 'Error running tests. Check your code for syntax errors.')
      setActiveTab('output')
      setGrading(false)
      // Still costs a heart (code was broken)
      setHearts((h) => Math.max(0, h - 1))
      return
    }

    setTestResults(results)
    const allPassed = results.every((t) => t.passed)

    if (allPassed) {
      setPassed(true)
    } else {
      setHearts((h) => Math.max(0, h - 1))
    }

    setGrading(false)
  }, [code, pyodideReady, grading, challenge, isSql])

  /* ─── Hint ─── */
  const revealHint = () => {
    if (challenge && hintsRevealed < challenge.hints.length) {
      setHintsRevealed((h) => h + 1)
    }
  }

  /* ─── Reset ─── */
  const handleReset = () => {
    if (challenge) {
      setCode(challenge.starterCode)
      setOutput('')
      setTestResults(null)
      setHearts(MAX_HEARTS)
      setHintsRevealed(0)
      setShowSolution(false)
      setPassed(false)
    }
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }

  /* ─── Loading / Error states ─── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <XCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {error || 'Challenge not found'}
        </h2>
        <button onClick={() => navigate('/learn')} className="btn-primary">
          Back to Learning Path
        </button>
      </div>
    )
  }

  /* ─── Game over ─── */
  if (hearts <= 0 && !passed) {
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
          Don't worry — review the hints and solution, then try again!
        </p>
        <div className="flex gap-3">
          <button onClick={handleReset} className="btn-primary flex items-center gap-2">
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

  /* ─── Success screen ─── */
  if (passed) {
    const score = testResults ? testResults.filter((t) => t.passed).length : 0
    const total = testResults ? testResults.length : 0
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 gap-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Tests Passed! 🎉</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          You passed {score}/{total} tests for <span className="font-semibold text-gray-700 dark:text-gray-200">{challenge.title}</span>.
          Hearts remaining: {hearts}/{MAX_HEARTS}.
        </p>
        <div className="flex gap-3">
          <button onClick={() => navigate('/learn')} className="btn-primary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Path
          </button>
          <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </motion.div>
    )
  }

  /* ═════════ Main Challenge UI ═════════ */
  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/learn')}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary-500" />
            {challenge.title}
          </h1>
        </div>
        <HeartDisplay hearts={hearts} maxHearts={MAX_HEARTS} />
      </div>

      {/* Challenge info */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${difficultyColors[challenge.difficulty]}`}>
            {challenge.difficulty}
          </span>
          {isSql ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
              <Database className="w-3 h-3" /> SQL
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              Python
            </span>
          )}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Database schema panel (SQL challenges only) */}
      {isSql && challenge.setupCode && (
        <div className="card mb-4 overflow-hidden border-2 border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-900/10">
          <button
            onClick={() => setShowSchema((s) => !s)}
            className="w-full flex items-center gap-2 px-5 py-3 text-sm font-bold text-sky-700 dark:text-sky-300 hover:bg-sky-100/50 dark:hover:bg-sky-900/20 transition-colors"
          >
            <Database className="w-4 h-4" />
            <span>Pre-populated Sample Data</span>
            <span className="text-xs font-normal text-sky-500 dark:text-sky-400 ml-1">(schema + rows already loaded)</span>
            {showSchema ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
          <AnimatePresence>
            {showSchema && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <pre className="text-xs font-mono bg-gray-950 text-sky-300 px-5 py-4 overflow-x-auto leading-relaxed border-t border-sky-200 dark:border-sky-800">
                  {challenge.setupCode}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pyodide loading banner */}
      {pyodideLoading && (
        <div className="flex items-center gap-3 p-4 mb-4 rounded-xl bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-800">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Loading {isSql ? 'SQL' : 'Python'} engine (first load may take a few seconds)…
          </span>
        </div>
      )}

      {/* SQL quick-start instructions */}
      {isSql && (
        <div className="mb-4 rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-900/10 px-5 py-4 text-sm text-sky-800 dark:text-sky-200 space-y-2">
          <p className="font-bold text-sky-700 dark:text-sky-300 flex items-center gap-2">
            <Database className="w-4 h-4" /> How to use this SQL challenge
          </p>
          <ol className="list-decimal list-inside space-y-1 text-sky-700 dark:text-sky-300">
            <li><span className="font-semibold">Write your query</span> in the editor below — sample data is already loaded for you (see "Database Schema" above).</li>
            <li>Click <span className="font-semibold">Run</span> to execute your query and see the result table instantly.</li>
            <li>Click <span className="font-semibold">Grade</span> to check your answer against the test suite (costs a heart if it fails).</li>
          </ol>
          <p className="text-xs text-sky-600 dark:text-sky-400">
            The database is pre-populated with sample rows — no setup needed. You can modify the schema data in the "Database Schema" panel if you want to test edge cases.
          </p>
        </div>
      )}

      {/* Code Editor */}
      <div className="mb-4">
        <CodeEditor value={code} onChange={setCode} disabled={running || grading} />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={handleRun}
          disabled={!pyodideReady || running || grading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          Run
        </button>

        <button
          onClick={handleGrade}
          disabled={!pyodideReady || running || grading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-primary-500/20"
        >
          {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
          Grade ({hearts} ❤️ left)
        </button>

        <button
          onClick={revealHint}
          disabled={hintsRevealed >= challenge.hints.length}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Lightbulb className="w-4 h-4" />
          Hint ({hintsRevealed}/{challenge.hints.length})
        </button>

        <button
          onClick={() => setShowSolution(!showSolution)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Hints panel */}
      <AnimatePresence>
        {hintsRevealed > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="card p-5 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
              <h3 className="text-sm font-bold text-yellow-700 dark:text-yellow-300 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Hints
              </h3>
              <ul className="space-y-2">
                {challenge.hints.slice(0, hintsRevealed).map((hint, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2"
                  >
                    <span className="text-yellow-500 font-bold mt-0.5">{i + 1}.</span>
                    {hint}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Solution panel */}
      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="card p-5 border-2 border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
              <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" /> Solution
              </h3>
              <pre className="text-sm font-mono bg-gray-950 text-green-300 p-4 rounded-lg overflow-x-auto leading-relaxed">
                {challenge.solutionCode}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Output / Test Results panel */}
      <div className="card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'output'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Output
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === 'tests'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Test Results
            {testResults && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold ${
                  testResults.every((t) => t.passed)
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {testResults.filter((t) => t.passed).length}/{testResults.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab content */}
        <div className="p-5" style={{ minHeight: '8rem' }}>
          {activeTab === 'output' && (
            <div>
              {running && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running…
                </div>
              )}
              {!running && !output && (
                <p className="text-gray-400 text-sm italic">
                  {isSql
                    ? 'Click "Run" to execute your SQL query and see the result table, or "Grade" to run tests.'
                    : 'Click "Run" to execute your code, or "Grade" to run tests.'}
                </p>
              )}
              {output && (
                <pre className="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words leading-relaxed">
                  {output}
                </pre>
              )}
            </div>
          )}

          {activeTab === 'tests' && (
            <div>
              {grading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running tests…
                </div>
              )}
              {!grading && !testResults && (
                <p className="text-gray-400 text-sm italic">
                  Click "Grade" to run your code against the test suite. Each failed attempt costs one heart.
                </p>
              )}
              {testResults && (
                <div className="space-y-2">
                  {/* Summary */}
                  <div className={`text-sm font-semibold mb-3 ${
                    testResults.every((t) => t.passed) ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {testResults.every((t) => t.passed)
                      ? '✅ All tests passed!'
                      : `❌ ${testResults.filter((t) => !t.passed).length} of ${testResults.length} tests failed`}
                  </div>
                  {testResults.map((test, i) => (
                    <TestResult key={i} test={test} index={i} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
