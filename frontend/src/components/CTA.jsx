import './CTA.css'

export default function CTA() {
  return (
    <section className="cta section" id="download">
      <div className="container">
        <div className="cta-card">
          <div className="cta-content">
            <h2>
              Ready to <span className="gradient-text">Debug Reality</span>?
            </h2>
            <p className="cta-subtitle">
              Join thousands of critical thinkers who browse smarter. Free, private, and open-source.
            </p>

            <div className="cta-buttons">
              <a href="#" className="btn btn-primary cta-btn-chrome">
                🚀 Add to Chrome — It's Free
              </a>
              <a href="#" className="btn btn-secondary">
                🦊 Firefox Version
              </a>
            </div>

            <div className="cta-stats">
              <div className="cta-stat">
                <div className="cta-stat-value gradient-text">10K+</div>
                <div className="cta-stat-label">Active Users</div>
              </div>
              <div className="cta-stat">
                <div className="cta-stat-value gradient-text">1M+</div>
                <div className="cta-stat-label">Claims Analyzed</div>
              </div>
              <div className="cta-stat">
                <div className="cta-stat-value gradient-text">4.8</div>
                <div className="cta-stat-label">Chrome Store Rating</div>
                <div className="cta-rating">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
