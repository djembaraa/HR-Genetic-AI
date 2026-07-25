import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Plus, Trash2, Edit2, Briefcase, MapPin } from 'lucide-react';

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchJobs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/jobs/company', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        e.target.reset();
        setShowForm(false);
        fetchJobs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Job Postings</h1>
          <p className="text-text-secondary">Manage open roles for your company.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2">
          <Plus size={18} /> {showForm ? 'Cancel' : 'Create Job'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-accent border-t-4">
          <h2 className="text-xl font-bold text-primary mb-6">Create New Job Posting</h2>
          <form onSubmit={handleCreateJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Job Title</label>
                <input required name="title" type="text" className="w-full px-4 py-2 border border-border rounded-lg bg-background text-primary" placeholder="e.g. Senior Developer" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Department</label>
                <input required name="department" type="text" className="w-full px-4 py-2 border border-border rounded-lg bg-background text-primary" placeholder="e.g. Engineering" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Location</label>
                <input name="location" type="text" className="w-full px-4 py-2 border border-border rounded-lg bg-background text-primary" placeholder="e.g. Remote" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Type</label>
                <select name="type" className="w-full px-4 py-2 border border-border rounded-lg bg-background text-primary">
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Description</label>
              <textarea required name="description" rows={5} className="w-full px-4 py-2 border border-border rounded-lg bg-background text-primary resize-none" placeholder="Job responsibilities and requirements..."></textarea>
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit">Publish Job</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="text-center p-8 text-text-secondary">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center p-12 border border-border rounded-lg bg-background-secondary text-text-secondary">
          No jobs found. Click "Create Job" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jobs.map(job => (
            <Card key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">
                  {job.title}
                  <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'OPEN' ? 'bg-success/10 text-success' : 'bg-text-muted text-background'}`}>
                    {job.status}
                  </span>
                </h3>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Briefcase size={14}/> {job.department}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {job.location || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2"><Edit2 size={14}/> Edit</Button>
                {/* Delete logic can be added later */}
                <Button variant="outline" size="sm" className="text-danger border-danger hover:bg-danger hover:text-white"><Trash2 size={14}/></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
