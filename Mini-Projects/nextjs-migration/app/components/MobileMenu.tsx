"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="nav-menu">
        <ul className="nav-links">
          <li><Link href="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link href="/#features" onClick={() => setIsMenuOpen(false)}>Features</Link></li>
          <li><Link href="/#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</Link></li>
          <li><Link href="/about" onClick={() => setIsMenuOpen(false)}>About</Link></li>
        </ul>
        <div className="nav-actions">
          <Link href="#login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
          <Link href="#get-started" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
            Get Started
          </Link>
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
    </>
  );
};
