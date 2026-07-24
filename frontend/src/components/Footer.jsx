import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 5% 2rem',
      marginTop: 'auto',
      background: '#fafafa'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-dark)', fontWeight: 600 }}>Wiratek AI</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: '1.6', fontSize: '0.875rem' }}>
            Revolutionizing the hiring process with generative AI. We help HR professionals screen, analyze, and find top talent faster and smarter.
          </p>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: 600 }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.875rem' }}>
            <li><a href="#home" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Home</a></li>
            <li><a href="#features" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>Features</a></li>
            <li><a href="#about" style={{ color: 'var(--text-light)', textDecoration: 'none' }}>About Us</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: 600 }}>Contact</h4>
          <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email: hello@wiratek.ai</p>
          <p style={{ color: 'var(--text-light)', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Phone: +62 812 3456 7890</p>
          <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>Jakarta, Indonesia</p>
        </div>
      </div>
      <div style={{
        textAlign: 'center',
        paddingTop: '2rem',
        borderTop: '1px solid var(--border-color)',
        color: '#a1a1aa',
        fontSize: '0.875rem'
      }}>
        &copy; {new Date().getFullYear()} Wiratek AI. All rights reserved.
      </div>
    </footer>
  );
};
