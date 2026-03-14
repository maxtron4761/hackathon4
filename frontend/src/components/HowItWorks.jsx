import { useEffect, useRef } from 'react'
import './HowItWorks.css'

const steps = [
  {
    number: '1',
    icon: '📥',
    title: 'Install Extension',
    description: 'Add Reality Debugger to Chrome in one click. No sign-up required, no configuration needed. It just works.',
  },
  {
    number: '2',
    icon: '🌐',
    title: 'Browse Normally',
    description: 'Visit any website as you normally would. Reality Debugger runs silently in the background, scanning content in real-time.',
  },
  {
    number: '3',
    icon: '💡',
    title: 'Get Insights',
    description: 'Suspicious claims are highlighted instantly. Click any highlight to see confidence scores and fact-checking sources.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.step-card')
            cards.forEach((card, i) => {
              card.style.animationDelay = `${i * 0.15}s`
              card.classList.add('animate-in')
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="how-it-works section" id="how-it-works" ref={sectionRef}>
      <div className="container">
        <div className="section-title">
          <h2>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p>Three simple steps to start browsing smarter.</p>
        </div>

        <div className="steps-container">
          {steps.map((step, i) => (
            <div className="step-card glass-card" key={i}>
              <div className="step-number">{step.number}</div>
              <span className="step-icon">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
