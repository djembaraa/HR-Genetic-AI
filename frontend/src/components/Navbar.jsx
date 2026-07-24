import React from 'react';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <nav className="navbar" style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem'
    }}>
      <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>
        Wiratek AI
      </div>
      <ul className="nav-links" style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
        <li><a href="#home" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Home</a></li>
        <li><a href="#features" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Features</a></li>
        <li><a href="#about" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>About Us</a></li>
        <li>
          <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600, textDecoration: 'none' }}>Dashboard ATS</Link>
        </li>
      </ul>
    </nav>
  );
};
