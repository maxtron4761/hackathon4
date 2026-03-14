import { useState, useRef } from 'react'
import './InteractiveDemo.css'

const claims = [
  {
    id: 1,
    text: '"100% guaranteed to eliminate all toxins from your body"',
    type: 'danger',
    score: 12,
    verdict: '⚠️ Likely False — No scientific evidence supports this claim',
    sources: ['Snopes — Detox Myth Debunked', 'WHO — Toxin Removal Facts', 'PubMed — Systematic Review 2024'],
  },
  {
    id: 2,
    text: '"Studies show 9 out of 10 doctors recommend..."',
    type: 'warning',
    score: 38,
    verdict: '⚡ Misleading — Statistic taken out of context',
    sources: ['PolitiFact — Doctor Survey Analysis', 'FactCheck.org — Survey Methodology'],
  },
  {
    id: 3,
    text: '"Published in the peer-reviewed Journal of Medicine, 2024"',
    type: 'safe',
    score: 89,
    verdict: '✓ Verified — Source confirmed as legitimate peer-reviewed publication',
    sources: ['Journal of Medicine — Verified Publication', 'CrossRef DOI Lookup'],
  },
]

export default function InteractiveDemo() {
  const [activeClaim, setActiveClaim] = useState(null)

  // ── Live analysis state ──────────────────────────────
  const [activeTab, setActiveTab] = useState('text')
  const [inputText, setInputText] = useState('')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [imageResult, setImageResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const selectedClaim = claims.find((c) => c.id === activeClaim)

  // ── API calls ────────────────────────────────────────

  async function analyzeText() {
    if (!inputText.trim() || inputText.trim().length < 10) return
    setLoading(true)
    setError(null)
    setAnalysisResult(null)
    try {
      const res = await fetch('/api/analyze/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setAnalysisResult(data.result)
    } catch (err) {
      setError(err.message || 'Analysis failed — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  async function analyzeImage(file) {
    if (!file) return
    setLoading(true)
    setError(null)
    setImageResult(null)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/analyze/image', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setImageResult(data.result)
    } catch (err) {
      setError(err.message || 'Analysis failed — is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  function handleFileSelect(file) {
    if (!file || !file.type.startsWith('image/')) return
    setSelectedFile(file)
    setImageResult(null)
    setError(null)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFileSelect(file)
  }

  return (
    <section className="interactive-demo section" id="demo">
      <div className="container">
        <div className="section-title">
          <h2>
            See It <span className="gradient-text">In Action</span>
          </h2>
          <p>Click on the highlighted claims below to see how Reality Debugger analyzes suspicious content.</p>
        </div>

        {/* ── Existing hardcoded demo ─────────────────── */}
        <div className="demo-container">
          <div className="demo-article">
            <div className="demo-article-header">
              <div className="demo-article-source">
                <div className="demo-article-source-dot"></div>
                health-news-daily.example.com
              </div>
              <div className="demo-scanning-badge">
                <span className="demo-scanning-pulse"></span>
                Scanning
              </div>
            </div>

            <div className="demo-article-body">
              <h3 className="demo-article-title">
                Revolutionary New Supplement Claims to Transform Your Health Overnight
              </h3>
              <p className="demo-article-text">
                A new dietary supplement has taken the market by storm with bold promises.
                The manufacturer states that their product is{' '}
                <span
                  className={`demo-claim danger ${activeClaim === 1 ? 'active' : ''}`}
                  onClick={() => setActiveClaim(activeClaim === 1 ? null : 1)}
                >
                  {claims[0].text}
                </span>{' '}
                within just 24 hours of use.
                <br /><br />
                Marketing materials prominently feature the claim that{' '}
                <span
                  className={`demo-claim warning ${activeClaim === 2 ? 'active' : ''}`}
                  onClick={() => setActiveClaim(activeClaim === 2 ? null : 2)}
                >
                  {claims[1].text}
                </span>{' '}
                this type of supplement for daily use, though the original
                study's context paints a different picture.
                <br /><br />
                The key ingredient, a plant-based extract, was the subject of a
                clinical trial.{' '}
                <span
                  className={`demo-claim safe ${activeClaim === 3 ? 'active' : ''}`}
                  onClick={() => setActiveClaim(activeClaim === 3 ? null : 3)}
                >
                  {claims[2].text}
                </span>{' '}
                researchers noted modest benefits in a controlled
                environment, though the results should not be overgeneralized.
              </p>
            </div>
          </div>

          <div className="demo-sidebar">
            <div className={`demo-panel ${selectedClaim ? 'active' : ''}`}>
              <div className="demo-panel-header">
                <div className="demo-panel-icon">🛡️</div>
                <div>
                  <div className="demo-panel-title">Claim Analysis</div>
                  <div className="demo-panel-subtitle">Reality Debugger AI</div>
                </div>
              </div>

              {!selectedClaim ? (
                <div className="demo-panel-empty">
                  <span className="demo-panel-empty-icon">👆</span>
                  Click a highlighted claim to see the analysis
                </div>
              ) : (
                <div className="demo-analysis" key={selectedClaim.id}>
                  <div className={`demo-analysis-claim ${selectedClaim.type}`}>
                    {selectedClaim.text}
                  </div>

                  <div className="demo-score-section">
                    <div className="demo-score-header">
                      <span className="demo-score-label">Confidence Score</span>
                    </div>
                    <div className={`demo-score-value ${selectedClaim.type}`}>
                      {selectedClaim.score}%
                    </div>
                    <div className="demo-score-bar">
                      <div
                        className={`demo-score-bar-fill ${selectedClaim.type}`}
                        style={{ width: `${selectedClaim.score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className={`demo-verdict ${selectedClaim.type}`}>
                    {selectedClaim.verdict}
                  </div>

                  <div className="demo-sources-title">Sources</div>
                  <ul className="demo-sources-list">
                    {selectedClaim.sources.map((source, i) => (
                      <li key={i}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <p className="demo-hint">
              ← Click highlighted text to analyze
            </p>
          </div>
        </div>

        {/* ── Live AI Analysis Section ───────────────── */}
        <div className="live-analysis-section">
          <div className="section-title">
            <h2>
              Try It <span className="gradient-text">Yourself</span>
            </h2>
            <p>Paste suspicious text or upload an image to analyze it with our AI models in real-time.</p>
          </div>

          <div className="live-tabs">
            <button
              className={`live-tab ${activeTab === 'text' ? 'active' : ''}`}
              onClick={() => { setActiveTab('text'); setError(null) }}
            >
              📝 Text Analysis
            </button>
            <button
              className={`live-tab ${activeTab === 'image' ? 'active' : ''}`}
              onClick={() => { setActiveTab('image'); setError(null) }}
            >
              🖼️ Deepfake Detection
            </button>
          </div>

          <div className="live-content">
            {/* ── Text Tab ──────────────────── */}
            {activeTab === 'text' && (
              <div className="live-text-panel">
                <textarea
                  className="live-textarea"
                  placeholder="Paste a suspicious claim, news article, or any text you want to fact-check…"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={5}
                />
                <button
                  className="btn btn-primary live-btn"
                  onClick={analyzeText}
                  disabled={loading || inputText.trim().length < 10}
                >
                  {loading ? (
                    <>
                      <span className="live-spinner"></span>
                      Analyzing…
                    </>
                  ) : (
                    '🔍 Analyze Text'
                  )}
                </button>

                {error && (
                  <div className="live-error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                {analysisResult && (
                  <div className="live-results">
                    <div className="live-results-header">
                      <span className="live-results-icon">🛡️</span>
                      <span>AI Analysis Results</span>
                    </div>

                    {/* Overall result */}
                    <div className={`live-overall ${analysisResult.overall.threat_level}`}>
                      <div className="live-overall-label">Overall Assessment</div>
                      <div className="live-overall-verdict">{analysisResult.overall.verdict}</div>
                      <div className="live-score-row">
                        <span>Confidence</span>
                        <span className={`live-pct ${analysisResult.overall.threat_level}`}>
                          {analysisResult.overall.confidence_pct}%
                        </span>
                      </div>
                      <div className="demo-score-bar">
                        <div
                          className={`demo-score-bar-fill ${analysisResult.overall.threat_level}`}
                          style={{ width: `${analysisResult.overall.confidence_pct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Per-claim breakdown */}
                    {analysisResult.claims && analysisResult.claims.length > 1 && (
                      <div className="live-claims">
                        <div className="live-claims-title">Claim-by-Claim Breakdown</div>
                        {analysisResult.claims.map((claim, i) => (
                          <div className={`live-claim-card ${claim.analysis.threat_level}`} key={i}>
                            <div className="live-claim-text">"{claim.text}"</div>
                            <div className="live-claim-verdict">{claim.analysis.verdict}</div>
                            <div className="live-score-row">
                              <span>Score</span>
                              <span className={`live-pct ${claim.analysis.threat_level}`}>
                                {claim.analysis.confidence_pct}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Image Tab ─────────────────── */}
            {activeTab === 'image' && (
              <div className="live-image-panel">
                <div
                  className={`live-dropzone ${dragOver ? 'drag-over' : ''} ${imagePreview ? 'has-image' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                  />
                  {imagePreview ? (
                    <div className="live-preview-wrap">
                      <img src={imagePreview} alt="Preview" className="live-preview-img" />
                      <div className="live-preview-overlay">Click or drop to replace</div>
                    </div>
                  ) : (
                    <div className="live-dropzone-content">
                      <span className="live-dropzone-icon">🖼️</span>
                      <span className="live-dropzone-text">Drag & drop an image here</span>
                      <span className="live-dropzone-sub">or click to browse — JPEG, PNG, WebP</span>
                    </div>
                  )}
                </div>

                {selectedFile && (
                  <button
                    className="btn btn-primary live-btn"
                    onClick={() => analyzeImage(selectedFile)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="live-spinner"></span>
                        Analyzing…
                      </>
                    ) : (
                      '🔬 Detect Deepfake'
                    )}
                  </button>
                )}

                {error && (
                  <div className="live-error">
                    <span>⚠️</span> {error}
                  </div>
                )}

                {imageResult && (
                  <div className="live-results">
                    <div className="live-results-header">
                      <span className="live-results-icon">🛡️</span>
                      <span>Deepfake Detection Results</span>
                    </div>
                    <div className={`live-overall ${imageResult.label === 'Fake' ? 'danger' : 'safe'}`}>
                      <div className="live-image-verdict-row">
                        <span className={`live-image-badge ${imageResult.label === 'Fake' ? 'danger' : 'safe'}`}>
                          {imageResult.label === 'Fake' ? '⚠️ FAKE' : '✓ REAL'}
                        </span>
                        <span className={`live-pct ${imageResult.label === 'Fake' ? 'danger' : 'safe'}`}>
                          {Math.round(imageResult.confidence * 100)}% confidence
                        </span>
                      </div>
                      <div className="demo-score-bar" style={{ marginTop: '12px' }}>
                        <div
                          className={`demo-score-bar-fill ${imageResult.label === 'Fake' ? 'danger' : 'safe'}`}
                          style={{ width: `${Math.round(imageResult.confidence * 100)}%` }}
                        ></div>
                      </div>
                      {imageResult.all_scores && (
                        <div className="live-all-scores">
                          {Object.entries(imageResult.all_scores).map(([label, score]) => (
                            <div key={label} className="live-score-item">
                              <span>{label}</span>
                              <span>{Math.round(score * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
