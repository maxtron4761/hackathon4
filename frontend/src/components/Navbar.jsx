import { useState, useEffect } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="#" className="navbar-logo">
          <div className="navbar-logo-icon">🛡️</div>
          <span>Reality<span className="gradient-text">Debugger</span></span>
        </a>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
          <li><a href="#demo" onClick={() => setMenuOpen(false)}>Demo</a></li>
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a></li>
          <li>
            <a href="#download" className="btn btn-primary navbar-cta" onClick={() => setMenuOpen(false)}>
              Add to Chrome
            </a>
          </li>
        </ul>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}
