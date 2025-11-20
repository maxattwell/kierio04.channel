import { useEffect, useState } from 'react'
import './Banner.css'

function Banner({ show }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      // Delay so Footer comes in first
      const timer = setTimeout(() => setIsVisible(true), 700)
      return () => clearTimeout(timer)
    }
  }, [show])

  return (
    <div className={`taskmaster-banner ${isVisible ? 'visible' : ''}`}>
      <div className="banner-content">
        <span className="banner-text">TelMaster 2025</span>
      </div>
    </div>
  )
}

export default Banner
