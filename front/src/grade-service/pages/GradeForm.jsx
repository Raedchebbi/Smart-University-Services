import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createGrade, getGradeById, updateGrade } from '../gradeApi'
import './GradeForm.css'

const EXAM_TYPES = ['Midterm', 'Final', 'Quiz', 'Project', 'Lab']
const SEMESTERS  = ['Fall 2024', 'Spring 2025', 'Fall 2025', 'Spring 2026']

const emptyForm = {
  studentName: '',
  subject: '',
  examType: 'Midterm',
  semester: 'Fall 2025',
  score: '',
}

export default function GradeForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (isEdit) {
      setIsLoading(true)
      getGradeById(id)
        .then((res) => { setForm(res.data); setIsLoading(false) })
        .catch(() => { setSubmitError('Grade not found.'); setIsLoading(false) })
    }
  }, [id, isEdit])

  const validate = () => {
    const errs = {}
    if (!form.studentName.trim()) errs.studentName = 'Student name is required.'
    if (!form.subject.trim())     errs.subject     = 'Subject is required.'
    if (!form.examType)           errs.examType    = 'Exam type is required.'
    if (!form.semester)           errs.semester    = 'Semester is required.'
    if (form.score === '')        errs.score       = 'Score is required.'
    else if (Number(form.score) < 0 || Number(form.score) > 20)
      errs.score = 'Score must be between 0 and 20.'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const payload = { ...form, score: Number(form.score) }
    const request = isEdit ? updateGrade(id, payload) : createGrade(payload)

    request
      .then(() => {
        alert(isEdit ? '✅ Grade updated!' : '✅ Grade added!')
        navigate('/')
      })
      .catch(() => setSubmitError('An error occurred. Please try again.'))
  }

  if (isLoading) return <div className="form-loading">⏳ Loading grade...</div>

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">
          {isEdit ? '✏️ Update Grade' : '➕ Add New Grade'}
        </h2>

        {submitError && <div className="form-alert">{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label>👤 Student Name</label>
            <input
              type="text"
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              placeholder="e.g. Ahmed Ben Ali"
              className={errors.studentName ? 'input-error' : ''}
            />
            {errors.studentName && <span className="error-msg">{errors.studentName}</span>}
          </div>

          <div className="form-group">
            <label>📚 Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. Mathematics"
              className={errors.subject ? 'input-error' : ''}
            />
            {errors.subject && <span className="error-msg">{errors.subject}</span>}
          </div>

          <div className="form-group">
            <label>📝 Exam Type</label>
            <select name="examType" value={form.examType} onChange={handleChange}>
              {EXAM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>📅 Semester</label>
            <select name="semester" value={form.semester} onChange={handleChange}>
              {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>🎯 Score (0 – 20)</label>
            <input
              type="number"
              name="score"
              value={form.score}
              onChange={handleChange}
              min="0"
              max="20"
              step="0.25"
              placeholder="e.g. 14.5"
              className={errors.score ? 'input-error' : ''}
            />
            {errors.score && <span className="error-msg">{errors.score}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
              ✖ Cancel
            </button>
            <button type="submit" className="btn-submit">
              {isEdit ? '💾 Update' : '✅ Add Grade'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}