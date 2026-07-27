import React, { useState, useEffect } from 'react';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    if (!isDarkMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar" id="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <a href="#" className="logo">
          AIFlow
        </a>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="nav-menu">
          <ul className="nav-links">
            <li>
              <a
                href="#home"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#pricing"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#contact"
                onClick={() => {
                  setIsMenuOpen(false);
                }}
              >
                Contact
              </a>
            </li>
          </ul>
          <div className="nav-actions">
            <button
              onClick={toggleTheme}
              className="btn btn-outline"
              aria-label="Toggle dark mode"
              style={{
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
              }}
            >
              {isDarkMode ? (
                <svg
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ width: '20px', height: '20px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ width: '20px', height: '20px' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  ></path>
                </svg>
              )}
            </button>
            <a href="#login" className="btn btn-outline">
              Login
            </a>
            <a href="#get-started" className="btn btn-primary">
              Get Started
            </a>
          </div>
        </div>

        <div
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          role="button"
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
          aria-label="Toggle navigation menu"
          tabIndex={0}
          onClick={toggleMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleMenu();
            }
          }}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};
