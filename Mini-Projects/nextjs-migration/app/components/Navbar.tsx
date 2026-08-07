import React from 'react';
import Link from 'next/link';
import { MobileMenu } from './MobileMenu';

export const Navbar = () => {
  return (
    <nav className="navbar" id="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <Link href="/" className="logo">
          AIFlow
        </Link>

        <MobileMenu />
      </div>
    </nav>
  );
};
