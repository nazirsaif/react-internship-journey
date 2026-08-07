import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="navbar" id="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <Link href="/" className="logo">
          AIFlow
        </Link>

        <div className="nav-menu" id="nav-menu">
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/#features">Features</Link></li>
            <li><Link href="/#pricing">Pricing</Link></li>
            <li><Link href="/about">About</Link></li>
          </ul>
          <div className="nav-actions">
            <Link href="#login" className="btn btn-outline">
              Login
            </Link>
            <Link href="#get-started" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile menu to be added as a Client Component later */}
        <div
          className="hamburger"
          role="button"
          aria-expanded={false}
          aria-controls="nav-menu"
          aria-label="Toggle navigation menu"
          tabIndex={0}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};
