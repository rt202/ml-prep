import { useEffect, useMemo, useState } from 'react'
import { api } from '../utils/api'

export default function AdminPanel() {
  const [users, setUsers] = useState([])
  const [content, setContent] = useState({ units: [], lessons: [], questions: [] })
  const [units, setUnits] = useState([])
  const [unitForm, setUnitForm] = useState({
    name: '',
    description: '',
    icon: '📚',
    orderIndex: 999,
    isPublished: true,
  })
  const [lessonForm, setLessonForm] = useState({
    unitId: '',
    name: '',
    orderIndex: 1,
    questionCount: 0,
    isPublished: true,
  })
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    difficulty: 'medium',
    category: 'industry_practice',
    unitId: '',
    lessonId: '',
    companySizes: ['startup', 'midsize', 'large', 'faang'],
    roles: ['data_scientist', 'ml_engineer', 'ai_engineer', 'mlops_engineer'],
    isPublished: true,
  })

  const refresh = async () => {
    const [u, c, learningUnits] = await Promise.all([api.getAdminUsers(), api.getAdminContent(), api.getUnits()])
    setUsers(u)
    setContent(c)
    setUnits(learningUnits)
  }

  useEffect(() => {
    refresh().catch(console.error)
  }, [])

  const allUnits = useMemo(() => units, [units])
  const allLessons = useMemo(() => units.flatMap((unit) => unit.lessons.map((lesson) => ({ ...lesson, unit_id: unit.id }))), [units])

  const updateRole = async (userId, role) => {
    await api.updateUserRole(userId, role)
    refresh()
  }

  const createQuestion = async (e) => {
    e.preventDefault()
    await api.createAdminQuestion(questionForm)
    setQuestionForm({
      ...questionForm,
      text: '',
      options: ['', '', '', ''],
      explanation: '',
    })
    refresh()
  }

  const createUnit = async (e) => {
    e.preventDefault()
    await api.createAdminUnit(unitForm)
    setUnitForm({ name: '', description: '', icon: '📚', orderIndex: 999, isPublished: true })
    refresh()
  }

  const createLesson = async (e) => {
    e.preventDefault()
    await api.createAdminLesson(lessonForm)
    setLessonForm({ unitId: '', name: '', orderIndex: 1, questionCount: 0, isPublished: true })
    refresh()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage users, roles, and published content.</p>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">User Roles</h2>
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{user.displayName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <select
                value={user.role}
                onChange={(e) => updateRole(user.id, e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Create Unit</h2>
        <form onSubmit={createUnit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            value={unitForm.name}
            onChange={(e) => setUnitForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Unit name"
            className="md:col-span-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            required
          />
          <input
            value={unitForm.description}
            onChange={(e) => setUnitForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description"
            className="md:col-span-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            required
          />
          <button type="submit" className="btn-primary">Create Unit</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Create Lesson</h2>
        <form onSubmit={createLesson} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            value={lessonForm.unitId}
            onChange={(e) => setLessonForm((p) => ({ ...p, unitId: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            required
          >
            <option value="">Select unit</option>
            {allUnits.map((unit) => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
          </select>
          <input
            value={lessonForm.name}
            onChange={(e) => setLessonForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Lesson name"
            className="md:col-span-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            required
          />
          <input
            value={lessonForm.orderIndex}
            onChange={(e) => setLessonForm((p) => ({ ...p, orderIndex: Number(e.target.value) }))}
            type="number"
            min="1"
            placeholder="Order"
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            required
          />
          <button type="submit" className="btn-primary">Create Lesson</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Create Question</h2>
        <form onSubmit={createQuestion} className="space-y-3">
          <input
            value={questionForm.text}
            onChange={(e) => setQuestionForm((p) => ({ ...p, text: e.target.value }))}
            placeholder="Question text"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            required
          />
          {questionForm.options.map((option, idx) => (
            <input
              key={idx}
              value={option}
              onChange={(e) => {
                const next = [...questionForm.options]
                next[idx] = e.target.value
                setQuestionForm((p) => ({ ...p, options: next }))
              }}
              placeholder={`Option ${idx + 1}`}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              required
            />
          ))}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={questionForm.correctAnswer}
              onChange={(e) => setQuestionForm((p) => ({ ...p, correctAnswer: Number(e.target.value) }))}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <option value={0}>Correct: Option 1</option>
              <option value={1}>Correct: Option 2</option>
              <option value={2}>Correct: Option 3</option>
              <option value={3}>Correct: Option 4</option>
            </select>
            <select
              value={questionForm.unitId}
              onChange={(e) => setQuestionForm((p) => ({ ...p, unitId: e.target.value, lessonId: '' }))}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              required
            >
              <option value="">Select unit</option>
              {allUnits.map((unit) => (
                <option key={unit.id} value={unit.id}>{unit.name}</option>
              ))}
            </select>
            <select
              value={questionForm.lessonId}
              onChange={(e) => setQuestionForm((p) => ({ ...p, lessonId: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              required
            >
              <option value="">Select lesson</option>
              {allLessons.filter((lesson) => lesson.unit_id === questionForm.unitId).map((lesson) => (
                <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
              ))}
            </select>
          </div>
          <textarea
            value={questionForm.explanation}
            onChange={(e) => setQuestionForm((p) => ({ ...p, explanation: e.target.value }))}
            placeholder="Explanation"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            required
          />
          <button type="submit" className="btn-primary">Create Question</button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Published Content Controls</h2>
        <div className="space-y-5">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Custom Units</p>
            <div className="space-y-2">
              {content.units.map((unit) => (
                <label key={unit.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{unit.name}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(unit.is_published)}
                    onChange={(e) => api.updateAdminUnit(unit.id, { isPublished: e.target.checked }).then(refresh)}
                  />
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Custom Lessons</p>
            <div className="space-y-2">
              {content.lessons.map((lesson) => (
                <label key={lesson.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{lesson.name}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(lesson.is_published)}
                    onChange={(e) => api.updateAdminLesson(lesson.id, { isPublished: e.target.checked }).then(refresh)}
                  />
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Custom Questions</p>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {content.questions.map((question) => (
                <label key={question.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40">
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{question.text}</span>
                  <input
                    type="checkbox"
                    checked={Boolean(question.isPublished)}
                    onChange={(e) => api.updateAdminQuestion(question.id, { isPublished: e.target.checked }).then(refresh)}
                  />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
