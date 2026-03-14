import { useEffect, useRef } from 'react'
import './Features.css'

const features = [
  {
    icon: '🔍',
    title: 'Real-time Scanning',
    description: 'Automatically scans web pages as you browse, detecting suspicious claims and exaggerations in real-time without slowing you down.',
  },
  {
    icon: '📊',
    title: 'Confidence Scores',
    description: 'Every flagged claim gets a data-driven confidence score from 0-100%, helping you quickly assess how trustworthy a statement is.',
  },
  {
    icon: '✅',
    title: 'Source Verification',
    description: 'Cross-references claims against a curated database of trusted fact-checking organizations including Snopes, PolitiFact, and more.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description: 'All processing happens locally in your browser. We never collect, store, or transmit your browsing data to external servers.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description: 'Optimized AI models deliver results in milliseconds. Browse at full speed while staying protected from misinformation.',
  },
  {
    icon: '🌐',
    title: 'Open Fact Database',
    description: 'Powered by a community-maintained database of verified facts and debunked claims that grows stronger every day.',
  },
]

export default function Features() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.feature-card')
            cards.forEach((card, i) => {
              card.style.animationDelay = `${i * 0.1}s`
              card.classList.add('animate-in')
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="features section" id="features" ref={sectionRef}>
      <div className="container">
        <div className="section-title">
          <h2>
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p>Everything you need to navigate the modern internet with confidence and clarity.</p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div className="feature-card glass-card" key={i}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
