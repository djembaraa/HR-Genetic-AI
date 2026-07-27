import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building, Globe, MapPin, Briefcase, ChevronLeft } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export const CompanyDetail = () => {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const res = await fetchApi(`/api/company/${slug}`);
        if (!res.ok) {
          throw new Error('Company not found');
        }
        const data = await res.json();
        setCompany(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadCompany();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-primary mb-4">Company Not Found</h2>
        <p className="text-text-secondary mb-8">The company you are looking for does not exist or has been removed.</p>
        <Link to="/candidate">
          <Button className="flex items-center gap-2 mx-auto"><ChevronLeft size={18} /> Back to Job Board</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link to="/candidate" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors font-medium">
        <ChevronLeft size={20} /> Back to Job Board
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Company Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.name} className="w-24 h-24 rounded-2xl object-cover bg-white shadow-sm border border-border" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                  <Building size={40} className="text-accent" />
                </div>
              )}
              
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl font-bold text-primary mb-2">{company.name}</h1>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start text-sm text-text-secondary">
                  {company.industry && (
                    <div className="flex items-center gap-1.5 bg-background border border-border px-3 py-1 rounded-full">
                      <Briefcase size={14} className="text-accent" />
                      {company.industry}
                    </div>
                  )}
                  {company.website && (
                    <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-background border border-border px-3 py-1 rounded-full hover:bg-accent/5 hover:text-accent hover:border-accent/30 transition-colors">
                      <Globe size={14} className="text-accent" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-xl font-bold text-primary mb-4 border-b border-border pb-2">About Us</h2>
              <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {company.description ? company.description : 'This company has not provided a description yet.'}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar: Open Jobs */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold text-primary mb-6 flex items-center justify-between">
              Open Roles
              <span className="text-xs font-semibold bg-accent/10 text-accent px-2.5 py-1 rounded-full">
                {company.jobs?.length || 0}
              </span>
            </h2>
            
            <div className="space-y-4">
              {company.jobs && company.jobs.length > 0 ? (
                company.jobs.map(job => (
                  <div key={job.id} className="p-4 rounded-xl border border-border bg-background hover:border-accent/30 hover:shadow-sm transition-all group">
                    <h3 className="font-bold text-primary group-hover:text-accent transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-2">
                      <MapPin size={12} /> {job.location || 'Location not specified'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                      <Briefcase size={12} /> {job.department || 'General'} • {job.type}
                    </div>
                    <Link to="/candidate" className="mt-4 block w-full">
                      <Button variant="outline" className="w-full text-xs py-1.5">View & Apply</Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-secondary italic text-center py-8">No open positions currently available.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
