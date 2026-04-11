import { useEffect, useState } from 'react'
import { getAverage, getMax, getMin, getTotal } from '../gradeApi'
import './GradeStats.css'

export default function GradeStats() {
  const [stats, setStats] = useState({ average: null, max: null, min: null, total: null })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getAverage(), getMax(), getMin(), getTotal()])
      .then(([avg, max, min, total]) => {
        setStats({ average: avg.data, max: max.data, min: min.data, total: total.data })
        setIsLoading(false)
      })
      .catch(() => { setError('Erreur lors du chargement des statistiques.'); setIsLoading(false) })
  }, [])

  const cards = [
    { label: 'Total Grades',   value: stats.total,   icon: '📊', color: '#154170' },
    { label: 'Average Score',  value: stats.average !== null ? `${Number(stats.average).toFixed(2)} / 20` : null, icon: '📈', color: '#2563eb' },
    { label: 'Highest Score',  value: stats.max !== null ? `${stats.max} / 20` : null, icon: '🏆', color: '#16a34a' },
    { label: 'Lowest Score',   value: stats.min !== null ? `${stats.min} / 20` : null, icon: '⚠️', color: '#dc2626' },
  ]

  const getProgressColor = (avg) => {
    if (avg >= 16) return '#16a34a'
    if (avg >= 12) return '#2563eb'
    if (avg >= 10) return '#f59e0b'
    return '#dc2626'
  }

  return (
    <div className="stats-container">
      <h2 className="stats-title">📊 Grade Statistics</h2>
      <p className="stats-subtitle">Overview of all student grades</p>

      {isLoading && <div className="stats-loading">⏳ Loading statistics...</div>}
      {error     && <div className="stats-error">{error}</div>}

      {!isLoading && !error && (
        <>
          <div className="stats-grid">
            {cards.map((card) => (
              <div key={card.label} className="stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-value" style={{ color: card.color }}>
                  {card.value !== null ? card.value : '—'}
                </div>
                <div className="stat-label">{card.label}</div>
              </div>
            ))}
          </div>

          {stats.average !== null && (
            <div className="progress-section">
              <h3>Average Score Progress</h3>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(stats.average / 20) * 100}%`,
                    backgroundColor: getProgressColor(stats.average),
                  }}
                />
              </div>
              <p className="progress-label">
                {Number(stats.average).toFixed(2)} / 20 ({((stats.average / 20) * 100).toFixed(1)}%)
              </p>
              <div className="grade-legend">
                <span className="legend-item excellent">≥ 16 — Excellent</span>
                <span className="legend-item good">≥ 12 — Good</span>
                <span className="legend-item average">≥ 10 — Average</span>
                <span className="legend-item fail">&lt; 10 — Fail</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}