import React from 'react';
import { Button } from './Button';

export const Navbar = ({ setView }) => {
  return (
    <nav className="navbar animate-fade-in" aria-label="Main Navigation">
      <h2 style={{ fontWeight: 700, color: 'var(--text-dark)' }}>HR-Genetic-AI</h2>
      <ul className="nav-links" role="menu">
        <li role="menuitem"><a href="#" aria-label="Go to Home" onClick={(e) => {e.preventDefault(); setView('home')}}>Home</a></li>
        <li role="menuitem"><a href="#" aria-label="Go to HR Dashboard" onClick={(e) => {e.preventDefault(); setView('dashboard')}}>HR Dashboard</a></li>
      </ul>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button variant="secondary" aria-label="Log In">Log In</Button>
        <Button variant="primary" aria-label="HR Access" onClick={() => setView('dashboard')}>HR Access</Button>
      </div>
    </nav>
  );
};
