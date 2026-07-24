import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { ChatBox } from '../components/ChatBox';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({ candidates: 0, jobs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if(res.ok && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to load stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ fontSize: '1.875rem' }}>Dashboard Overview</h1>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Total Candidates</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{loading ? '-' : stats.candidates}</div>
        </Card>
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.875rem', textTransform: 'uppercase' }}>Active Jobs</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{loading ? '-' : stats.jobs}</div>
        </Card>
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.875rem', textTransform: 'uppercase' }}>AI Processed</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#10b981' }}>100%</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Data Table Placeholder */}
        <Card style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recent Candidates</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-light)' }}>
                <th style={{ padding: '1rem 0' }}>Name</th>
                <th style={{ padding: '1rem 0' }}>Email</th>
                <th style={{ padding: '1rem 0' }}>Date Applied</th>
                <th style={{ padding: '1rem 0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: '1rem 0', textAlign: 'center' }}>Loading...</td></tr>
              ) : stats.candidates === 0 ? (
                <tr><td colSpan="4" style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-light)' }}>No candidates found in database</td></tr>
              ) : (
                 <tr><td colSpan="4" style={{ padding: '1rem 0', textAlign: 'center', color: 'var(--text-light)' }}>Data will be mapped here</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* AI HR Assistant */}
        <Card style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>AI HR Assistant</h2>
          <div style={{ flexGrow: 1 }}>
            <ChatBox />
          </div>
        </Card>
      </div>
    </div>
  );
};
