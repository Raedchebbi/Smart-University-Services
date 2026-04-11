import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const navLinks = [
  { path: '/home', label: 'Home' },
  { path: '/grades', label: 'Grades' },
  { path: '/grade-stats', label: 'Grade Stats' },
  { path: '/reclamations', label: 'Claims' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">🎓 SmartUniversity</h1>

        <nav className="nav-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}