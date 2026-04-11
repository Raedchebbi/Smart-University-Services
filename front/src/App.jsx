import { Routes, Route } from 'react-router-dom'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import GradeList from './Grade-service/pages/GradeList'
import GradeForm from './Grade-service/pages/GradeForm'
import GradeStats from './Grade-service/pages/GradeStats'
import './App.css'

function App() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/"         element={<GradeList />} />
          <Route path="/add"      element={<GradeForm />} />
          <Route path="/edit/:id" element={<GradeForm />} />
          <Route path="/stats"    element={<GradeStats />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App