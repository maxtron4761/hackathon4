import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Browser Extension
          </div>

          <h1>
            Debug Reality.<br />
            <span className="gradient-text">Fight Misinformation.</span>
          </h1>

          <p className="hero-subtitle">
            A powerful browser extension that scans web pages in real-time,
            highlights suspicious claims, and shows you confidence scores
            backed by trusted fact-checking sources.
          </p>

          <div className="hero-buttons">
            <a href="#download" className="btn btn-primary">
              🚀 Add to Chrome — Free
            </a>
            <a href="#demo" className="btn btn-secondary">
              ▶ See Demo
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="hero-stat-value gradient-text">10K+</div>
              <div className="hero-stat-label">Active Users</div>
            </div>
            <div>
              <div className="hero-stat-value gradient-text">1M+</div>
              <div className="hero-stat-label">Claims Checked</div>
            </div>
            <div>
              <div className="hero-stat-value gradient-text">95%</div>
              <div className="hero-stat-label">Accuracy Rate</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="browser-mockup">
            <div className="browser-topbar">
              <div className="browser-dot red"></div>
              <div className="browser-dot yellow"></div>
              <div className="browser-dot green"></div>
              <div className="browser-url">🔒 news-article.example.com/health</div>
            </div>
            <div className="browser-body">
              <div className="browser-scan-line"></div>
              <div className="browser-body-line long"></div>
              <div className="browser-body-line medium"></div>
              <div className="browser-body-claim red-highlight">
                ⚠️ "This product is 100% guaranteed to cure..."
              </div>
              <div className="browser-body-line long"></div>
              <div className="browser-body-line short"></div>
              <div className="browser-body-claim green-highlight">
                ✓ "According to WHO research published in 2024..."
              </div>
              <div className="browser-body-line medium"></div>
              <div className="browser-body-line long"></div>

              <div className="browser-popup">
                <div className="browser-popup-title">Confidence Score</div>
                <div className="browser-popup-score" style={{ color: 'var(--accent-amber)' }}>35%</div>
                <div className="browser-popup-bar">
                  <div className="browser-popup-bar-fill"></div>
                </div>
                <div className="browser-popup-label">Low confidence — likely misleading</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
