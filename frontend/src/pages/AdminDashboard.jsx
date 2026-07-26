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
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-text-light text-sm uppercase font-semibold">Total Candidates</h3>
          <div className="text-4xl font-bold mt-2">{loading ? '-' : stats.candidates}</div>
        </Card>
        <Card className="p-6">
          <h3 className="text-text-light text-sm uppercase font-semibold">Active Jobs</h3>
          <div className="text-4xl font-bold mt-2">{loading ? '-' : stats.jobs}</div>
        </Card>
        <Card className="p-6">
          <h3 className="text-text-light text-sm uppercase font-semibold">AI Processed</h3>
          <div className="text-4xl font-bold mt-2 text-success">100%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Table Placeholder */}
        <Card className="p-6 lg:col-span-2 overflow-x-auto">
          <h2 className="text-xl font-bold mb-4 text-primary">Recent Candidates</h2>
          <table className="w-full border-collapse text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-border text-left text-text-light">
                <th className="py-4">Name</th>
                <th className="py-4">Email</th>
                <th className="py-4">Date Applied</th>
                <th className="py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="py-4 text-center">Loading...</td></tr>
              ) : stats.candidates === 0 ? (
                <tr><td colSpan="4" className="py-4 text-center text-text-light">No candidates found in database</td></tr>
              ) : (
                 <tr><td colSpan="4" className="py-4 text-center text-text-light">Data will be mapped here</td></tr>
              )}
            </tbody>
          </table>
        </Card>

        {/* AI HR Assistant */}
        <Card className="flex flex-col p-6 h-[600px] lg:h-auto">
          <h2 className="text-xl font-bold mb-4 text-primary">AI HR Assistant</h2>
          <div className="flex-grow overflow-hidden">
            <ChatBox />
          </div>
        </Card>
      </div>
    </div>
  );
};
