import React from 'react';

export const Hero: React.FC = () => {
  return (
    <header className="hero" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Build AI Applications Faster</h1>
          <p className="hero-subtitle">Deploy intelligent products with modern technology.</p>
          <div className="hero-buttons">
            <a href="#start" className="btn btn-primary">
              Start Free
            </a>
            <a href="#demo" className="btn btn-outline">
              View Demo
            </a>
          </div>
        </div>
        <div className="hero-illustration">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4F46E5', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="150" fill="url(#grad1)" opacity="0.8" />
            <circle cx="150" cy="150" r="80" fill="rgba(255,255,255,0.1)" />
            <circle cx="250" cy="250" r="60" fill="rgba(255,255,255,0.1)" />
            <path
              d="M 120 200 L 280 200 M 200 120 L 200 280"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};
