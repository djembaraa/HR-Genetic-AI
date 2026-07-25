import React, { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MapPin, Building, Search, Briefcase } from 'lucide-react';

export const CandidateDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Typically candidates see all open jobs across the platform.
      const res = await fetch('http://localhost:3000/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Failed to fetch jobs', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Job Board</h1>
          <p className="text-text-secondary">Discover your next career opportunity.</p>
        </div>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse h-48 bg-border/20"></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length === 0 ? (
            <div className="col-span-full py-12 text-center text-text-secondary">
              <Briefcase size={48} className="mx-auto mb-4 text-border" />
              <p>No open jobs available at the moment.</p>
            </div>
          ) : (
            jobs.map(job => (
              <Card key={job.id} hoverable className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-primary mb-1">{job.title}</h3>
                  <div className="flex items-center gap-2 text-text-secondary text-sm mb-4">
                    <Building size={14} />
                    <span>{job.company?.name || 'NexHire AI'}</span>
                    <span className="text-border">•</span>
                    <span className="text-accent font-medium">{job.department}</span>
                  </div>
                  
                  <p className="text-text-secondary text-sm line-clamp-3 mb-6">
                    {job.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <div className="flex items-center gap-1 text-text-secondary text-sm">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                  <Button size="sm">Apply Now</Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
