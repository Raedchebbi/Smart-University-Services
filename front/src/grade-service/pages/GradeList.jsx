import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllGrades, deleteGrade } from '../gradeApi'
import './GradeList.css'

export default function GradeList() {
  const [grades, setGrades] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchGrades() }, [])

  const fetchGrades = () => {
    setIsLoading(true)
    getAllGrades()
      .then((res) => { setGrades(res.data); setIsLoading(false) })
      .catch(() => { setError('Erreur lors du chargement des notes.'); setIsLoading(false) })
  }

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette note ?')) {
      deleteGrade(id)
        .then(() => setGrades(grades.filter((g) => g.id !== id)))
        .catch(() => setError('Erreur lors de la suppression.'))
    }
  }

  const getScoreBadge = (score) => {
    if (score >= 16) return 'badge-excellent'
    if (score >= 12) return 'badge-good'
    if (score >= 10) return 'badge-average'
    return 'badge-fail'
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>📋 Manage Grades</h2>
        <button className="btn-primary" onClick={() => navigate('/add')}>
          ➕ Add Grade
        </button>
      </div>

      {isLoading && <div className="alert alert-info">⏳ Loading grades...</div>}
      {error    && <div className="alert alert-error">{error}</div>}

      {!isLoading && grades.length === 0 && (
        <div className="alert alert-warning">⚠️ No grades found.</div>
      )}

      {!isLoading && grades.length > 0 && (
        <div className="card-grid">
          {grades.map((grade) => (
            <div key={grade.id} className="grade-card">
              <div className="card-top">
                <span className="grade-id">Grade #{grade.id}</span>
                <span className={`score-badge ${getScoreBadge(grade.score)}`}>
                  {grade.score} / 20
                </span>
              </div>
              <div className="card-body">
                <p><strong>👤 Student:</strong> {grade.studentName}</p>
                <p><strong>📚 Subject:</strong> {grade.subject}</p>
                <p><strong>📝 Exam Type:</strong> {grade.examType}</p>
                <p><strong>📅 Semester:</strong> {grade.semester}</p>
              </div>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => navigate(`/edit/${grade.id}`)}>
                  ✏️ Update
                </button>
                <button className="btn-delete" onClick={() => handleDelete(grade.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}