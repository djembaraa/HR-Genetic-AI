import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Settings, LogOut } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div style={{
      width: '260px',
      height: '100vh',
      background: '#ffffff',
      borderRight: '1px solid var(--border-color)',
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, paddingLeft: '1rem', marginBottom: '2rem' }}>
        Wiratek AI
      </div>

      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '1rem', paddingLeft: '1rem', textTransform: 'uppercase' }}>
        Main Menu
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
        <NavLink to="/admin" end style={({isActive}) => ({
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
          borderRadius: '8px', textDecoration: 'none', color: isActive ? 'var(--primary-color)' : 'var(--text-light)',
          background: isActive ? '#f9f9f9' : 'transparent', fontWeight: isActive ? 600 : 500
        })}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/admin/candidates" style={({isActive}) => ({
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
          borderRadius: '8px', textDecoration: 'none', color: isActive ? 'var(--primary-color)' : 'var(--text-light)',
          background: isActive ? '#f9f9f9' : 'transparent', fontWeight: isActive ? 600 : 500
        })}>
          <Users size={20} /> Candidates
        </NavLink>
        <NavLink to="/admin/jobs" style={({isActive}) => ({
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
          borderRadius: '8px', textDecoration: 'none', color: isActive ? 'var(--primary-color)' : 'var(--text-light)',
          background: isActive ? '#f9f9f9' : 'transparent', fontWeight: isActive ? 600 : 500
        })}>
          <Briefcase size={20} /> Jobs
        </NavLink>
        <NavLink to="/admin/settings" style={({isActive}) => ({
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
          borderRadius: '8px', textDecoration: 'none', color: isActive ? 'var(--primary-color)' : 'var(--text-light)',
          background: isActive ? '#f9f9f9' : 'transparent', fontWeight: isActive ? 600 : 500
        })}>
          <Settings size={20} /> Settings
        </NavLink>
      </nav>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <a href="#" onClick={(e) => {
          e.preventDefault();
          localStorage.removeItem('token');
          window.location.href = '/login';
        }} style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
          borderRadius: '8px', textDecoration: 'none', color: '#ef4444', fontWeight: 500
        }}>
          <LogOut size={20} /> Logout
        </a>
      </div>
    </div>
  );
};
