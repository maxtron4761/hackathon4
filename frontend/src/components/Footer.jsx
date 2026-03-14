import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="#" className="footer-logo">
              <div className="footer-logo-icon">🛡️</div>
              Reality<span className="gradient-text">Debugger</span>
            </a>
            <p>
              Empowering users to think critically and navigate the internet
              with confidence. Open-source, privacy-first, always free.
            </p>
          </div>

          <div className="footer-col">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#demo">Demo</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#download">Download</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Documentation</a></li>
              <li><a href="#">API Reference</a></li>
              <li><a href="#">Fact Database</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Community</h4>
            <ul>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Discord</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Contribute</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            © 2026 Reality Debugger. Open Source under MIT License.
          </span>
          <div className="footer-socials">
            <a href="#" className="footer-social-link" aria-label="GitHub">⭐</a>
            <a href="#" className="footer-social-link" aria-label="Twitter">𝕏</a>
            <a href="#" className="footer-social-link" aria-label="Discord">💬</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
