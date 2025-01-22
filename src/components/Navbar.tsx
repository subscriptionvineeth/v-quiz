import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/logo.svg' // Add your logo file to assets folder

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-left">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Summarizer
          </Link>
          <Link 
            to="/quiz" 
            className={`nav-link ${location.pathname === '/quiz' ? 'active' : ''}`}
          >
            Quiz
          </Link>
          <Link 
            to="/progress" 
            className={`nav-link ${location.pathname === '/progress' ? 'active' : ''}`}
          >
            Progress
          </Link>
        </div>
        <div className="nav-logo">
          <img src={logo} alt="StudyAI Logo" /> 
        </div>
      </div>
    </nav>
  )
}

export default Navbar 