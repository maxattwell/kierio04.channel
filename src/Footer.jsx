import { useState } from 'react'
import './Footer.css'

function Footer() {
  const [isExpanded, setIsExpanded] = useState(false)

  const socialLinks = [
    {
      name: 'YouTube',
      label: 'YouTube',
      url: 'https://youtube.com/@kierio04',
      className: 'youtube',
      priority: 'primary',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'MKWii TAS Competition Discord',
      label: 'Competition',
      url: 'https://discord.gg/SwqvuNm',
      className: 'discord-competition',
      priority: 'primary',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      )
    },
    {
      name: 'MKWii TAS Website',
      label: 'Website',
      url: 'https://mkwtas.com',
      className: 'mkwtas-site',
      priority: 'primary',
      icon: (
        <img src="/mkwtas_logo.png" alt="MKWii TAS" className="social-icon mkwtas-logo" />
      )
    },
    {
      name: 'MKWii TASing Discord',
      label: 'TASing',
      url: 'https://discordapp.com/invite/EPD9yCu',
      className: 'discord-tasing',
      priority: 'secondary',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="social-icon">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      )
    },
  ]

  const primaryLinks = socialLinks.filter(link => link.priority === 'primary')
  const secondaryLinks = socialLinks.filter(link => link.priority === 'secondary')

  return (
    <footer className="mario-footer">
      <div className={`social-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Primary links - always visible on mobile */}
        <div className="primary-links">
          {primaryLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-link icon-only ${link.className}`}
              aria-label={link.name}
              title={link.name}
            >
              {link.icon}
            </a>
          ))}
          
          {/* More button - only visible on mobile */}
          <button
            className="more-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Show less' : 'Show more'}
            aria-expanded={isExpanded}
          >
            <svg 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className={`more-icon ${isExpanded ? 'expanded' : ''}`}
            >
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
            <span className="more-label">{isExpanded ? 'Less' : 'More'}</span>
          </button>
        </div>

        {/* Expanded content */}
        <div className={`expanded-content ${isExpanded ? 'show' : ''}`}>
          <div className="all-links">
            <div className="info-text">
              <p>Mario Kart Wii TASes, competitions, and challenges. Check out the links below!</p>
            </div>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`social-link with-label ${link.className}`}
                aria-label={link.name}
                title={link.name}
              >
                <div className="link-content">
                  {link.icon}
                  <span className="link-label">{link.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Desktop view - all links with labels */}
        <div className="desktop-links">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`social-link ${link.className}`}
              aria-label={link.name}
              title={link.name}
            >
              <div className="link-content">
                {link.icon}
                <span className="link-label">{link.label}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
