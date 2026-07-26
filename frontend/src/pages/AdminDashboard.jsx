import React, { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { ChatBox } from '../components/ChatBox';
import { fetchApi } from '../lib/api';


export const AdminDashboard = () => {
  const [stats, setStats] = useState({ candidates: 0, jobs: 0 });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetchApi('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if(res.ok && data.stats) {
          setStats(data.stats);
        }
        
        // Also fetch recent candidates
        const candidatesRes = await fetchApi('/api/hr/candidates', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (candidatesRes.ok) {
          const cData = await candidatesRes.json();
          // limit to top 5
          setRecentCandidates(cData.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
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
                <>
                  {[1, 2, 3].map(i => (
                    <tr key={`skel-admin-${i}`} className="animate-pulse border-b border-border/50">
                      <td className="py-4"><div className="w-32 h-5 bg-border/20 rounded-md"></div></td>
                      <td className="py-4"><div className="w-40 h-5 bg-border/20 rounded-md"></div></td>
                      <td className="py-4"><div className="w-24 h-5 bg-border/20 rounded-md"></div></td>
                      <td className="py-4"><div className="w-20 h-6 bg-border/20 rounded-full"></div></td>
                    </tr>
                  ))}
                </>
              ) : recentCandidates.length === 0 ? (
                <tr><td colSpan="4" className="py-4 text-center text-text-light">No candidates found in database</td></tr>
              ) : (
                recentCandidates.map(c => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-background-secondary transition-colors">
                    <td className="py-4 text-primary font-medium">{c.name}</td>
                    <td className="py-4 text-text-secondary">{c.email}</td>
                    <td className="py-4 text-text-secondary">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        c.vectorizationStatus === 'COMPLETED' ? 'bg-success/10 text-success' : 
                        c.vectorizationStatus === 'FAILED' ? 'bg-error/10 text-error' : 
                        'bg-accent/10 text-accent'
                      }`}>
                        {c.vectorizationStatus}
                      </span>
                    </td>
                  </tr>
                ))
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
