import React from 'react';
import { Card } from '../../components/Card';
import { Briefcase, CheckCircle2, Clock, XCircle, Search } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { useQuery } from '@tanstack/react-query';

export const MyApplications = () => {
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['candidate_applications'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetchApi('/api/candidate/applications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch applications');
      return res.json();
    }
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'APPLIED': return <Clock className="text-info" size={18} />;
      case 'REVIEWING': return <Search className="text-warning" size={18} />;
      case 'INTERVIEW': return <Briefcase className="text-primary" size={18} />;
      case 'HIRED': return <CheckCircle2 className="text-success" size={18} />;
      case 'REJECTED': return <XCircle className="text-error" size={18} />;
      default: return <Clock className="text-text-secondary" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'APPLIED': return 'bg-info/10 text-info border-info/20';
      case 'REVIEWING': return 'bg-warning/10 text-warning border-warning/20';
      case 'INTERVIEW': return 'bg-primary/10 text-primary border-primary/20';
      case 'HIRED': return 'bg-success/10 text-success border-success/20';
      case 'REJECTED': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-background text-text-secondary border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2">My Applications</h1>
        <p className="text-text-secondary">Track the status of your job applications.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => (
              <Card key={i} padding="spacious" className="h-32 bg-border/10"></Card>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <Card padding="spacious" className="text-center text-text-secondary">
            <Briefcase className="mx-auto mb-4 text-border" size={48} />
            <p className="text-lg">You haven't applied to any jobs yet.</p>
          </Card>
        ) : (
          applications.map(app => (
            <Card key={app.id} padding="spacious" hoverable className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary">{app.job?.title}</h3>
                <p className="text-text-secondary mt-1">{app.job?.company?.name || 'Company'} • {app.job?.location}</p>
                <div className="text-sm text-text-muted mt-2">
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-medium ${getStatusColor(app.status)}`}>
                {getStatusIcon(app.status)}
                {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
