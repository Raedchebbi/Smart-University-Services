import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h3 className="footer-title">🎓 SmartUniversity</h3>
          <p>Your intelligent platform for academic management and services.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/grades">Grades</Link></li>
            <li><Link to="/grade-stats">Grade Stats</Link></li>
            <li><Link to="/reclamations">Claims</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>📍 Tunis, Tunisia</p>
          <p>📞 +216 71 000 000</p>
          <p>✉️ contact@smartuniversity.tn</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 SmartUniversity. All rights reserved.</p>
      </div>
    </footer>
  )
}