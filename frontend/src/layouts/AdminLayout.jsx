import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';

export const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', background: '#fafafa', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          height: '70px',
          background: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Admin User</span>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              A
            </div>
          </div>
        </header>
        <main style={{ padding: '2rem', flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
