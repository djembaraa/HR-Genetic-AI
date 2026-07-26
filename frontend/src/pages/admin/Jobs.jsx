import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Plus, Trash2, Edit2, Briefcase, MapPin } from 'lucide-react';
import { Input } from '../../components/Input';

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

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

  const handleSaveJob = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const url = editingJob 
        ? `http://localhost:3000/api/jobs/${editingJob.id}`
        : 'http://localhost:3000/api/jobs';
      
      const res = await fetch(url, {
        method: editingJob ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        e.target.reset();
        setShowForm(false);
        setEditingJob(null);
        fetchJobs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchJobs();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setShowForm(true);
    // Give react time to render form before populating
    setTimeout(() => {
      const form = document.getElementById('job-form');
      if(form) {
        form.elements['title'].value = job.title;
        form.elements['department'].value = job.department;
        form.elements['location'].value = job.location || '';
        form.elements['type'].value = job.type;
        form.elements['status'].value = job.status;
        form.elements['description'].value = job.description;
      }
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Job Postings</h1>
          <p className="text-text-secondary">Manage open roles for your company.</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditingJob(null); }} className="flex items-center gap-2">
          <Plus size={18} /> {showForm ? 'Cancel' : 'Create Job'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 border-accent border-t-4">
          <h2 className="text-xl font-bold text-primary mb-6">{editingJob ? 'Update Job Posting' : 'Create New Job Posting'}</h2>
          <form id="job-form" onSubmit={handleSaveJob} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input required name="title" label="Job Title" type="text" placeholder="e.g. Senior Developer" />
              <Input required name="department" label="Department" type="text" placeholder="e.g. Engineering" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input name="location" label="Location" type="text" placeholder="e.g. Remote" />
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Type</label>
                <select name="type" className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200">
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1.5">Status</label>
                <select name="status" className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200">
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Description</label>
              <textarea required name="description" rows={5} className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary resize-none focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200" placeholder="Job responsibilities and requirements..."></textarea>
            </div>
            <div className="flex justify-end pt-4 gap-2">
               {editingJob && (
                <Button type="button" variant="outline" onClick={() => {setShowForm(false); setEditingJob(null);}}>Cancel</Button>
               )}
              <Button type="submit">{editingJob ? 'Update Job' : 'Publish Job'}</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2].map(i => (
            <Card key={`skel-job-${i}`} className="animate-pulse h-24 bg-border/20"></Card>
          ))}
        </div>
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
                  <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'OPEN' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {job.status}
                  </span>
                </h3>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1"><Briefcase size={14}/> {job.department}</span>
                  <span className="flex items-center gap-1"><MapPin size={14}/> {job.location || 'Not specified'}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => handleEditClick(job)}>
                  <Edit2 size={14}/> Edit
                </Button>
                <Button variant="outline" size="sm" className="text-error border-error hover:bg-error hover:text-white" onClick={() => handleDeleteJob(job.id)}>
                  <Trash2 size={14}/>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
