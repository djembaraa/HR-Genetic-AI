import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, FileText, CheckCircle2, Clock, Search, UploadCloud } from 'lucide-react';
import { UploadForm } from '../../components/UploadForm';

export const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/hr/candidates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCandidates(data);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Candidates</h1>
          <p className="text-text-secondary">Review applicants and their AI vectorization status.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates..." 
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-primary focus:outline-none focus:border-accent"
            />
          </div>
          <Button onClick={() => setShowUpload(!showUpload)} className="flex items-center gap-2 whitespace-nowrap">
            <UploadCloud size={18} /> {showUpload ? 'Cancel' : 'Upload CV'}
          </Button>
        </div>
      </div>

      {showUpload && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <UploadForm />
        </div>
      )}

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-background-secondary border-b border-border">
              <tr>
                <th className="p-4 font-bold text-primary">Candidate</th>
                <th className="p-4 font-bold text-primary">Applied Role</th>
                <th className="p-4 font-bold text-primary">Status</th>
                <th className="p-4 font-bold text-primary">Resume</th>
                <th className="p-4 font-bold text-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-text-secondary">Loading candidates...</td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-text-secondary">No candidates found for your company.</td></tr>
              ) : candidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-background-secondary/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center text-accent">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-primary">{candidate.name || candidate.email.split('@')[0]}</div>
                        <div className="text-sm text-text-secondary">{candidate.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary">{candidate.appliedJob?.title || 'Open Application'}</td>
                  <td className="p-4">
                    {candidate.vectorizationStatus === 'COMPLETED' ? (
                      <span className="flex items-center gap-1 text-success text-sm font-medium">
                        <CheckCircle2 size={16} /> Vectorized
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-warning text-sm font-medium">
                        <Clock size={16} /> Pending
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 text-text-secondary"
                      onClick={() => window.open(`http://localhost:3000/api/candidate/resume/pdf?token=${localStorage.getItem('token')}`, '_blank')}
                    >
                      <FileText size={16} /> PDF
                    </Button>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="secondary" size="sm">View Profile</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
