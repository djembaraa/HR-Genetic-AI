import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { MapPin, Building, Search, Briefcase, CheckCircle2, Sparkles, X } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import toast from 'react-hot-toast';



export const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedJobIds, setRecommendedJobIds] = useState([]);
  const [isAiMatching, setIsAiMatching] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch open jobs
      const jobsRes = await fetchApi('/api/jobs');
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

      // Fetch candidate profile to know applied job
      const profileRes = await fetchApi('/api/candidate/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        
        if (!profileData.location) {
          navigate('/candidate/onboarding');
          return;
        }

        setCandidateProfile(profileData);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    setApplyingJobId(jobId);
    
    try {
      const res = await fetchApi(`/api/candidate/apply/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setCandidateProfile(data.candidate); // update profile to reflect new appliedJobId
        toast.success('Successfully applied to the job!');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to apply to job');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('An error occurred while applying.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleAutoMatch = async () => {
    setIsAiMatching(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetchApi('/api/candidate/recommendations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRecommendedJobIds(data.recommended_job_ids || []);
        if (data.recommended_job_ids?.length === 0) {
          toast.error('No specific AI matches found. Try adding more skills to your profile!');
        }
      } else {
        toast.error('Failed to get recommendations.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching recommendations.');
    } finally {
      setIsAiMatching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Job Board</h1>
          <p className="text-text-secondary">Discover your next career opportunity.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={handleAutoMatch} 
            disabled={isAiMatching || loading}
            className="w-full sm:w-auto border-accent/30 text-accent hover:bg-accent/10 whitespace-nowrap"
          >
            <Sparkles size={16} className={isAiMatching ? "animate-spin" : ""} />
            {isAiMatching ? 'Matching...' : 'AI Auto-Match'}
          </Button>
          
          <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          />
        </div>
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
          {(() => {
            let filteredJobs = jobs.filter(job => 
              job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (job.company?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
              job.department.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Sort so recommended jobs are at the top
            if (recommendedJobIds.length > 0) {
              filteredJobs = [...filteredJobs].sort((a, b) => {
                const aRec = recommendedJobIds.includes(a.id) ? 1 : 0;
                const bRec = recommendedJobIds.includes(b.id) ? 1 : 0;
                return bRec - aRec;
              });
            }

            if (filteredJobs.length === 0) {
              return (
                <div className="col-span-full py-12 text-center text-text-secondary">
                  <Briefcase size={48} className="mx-auto mb-4 text-border" />
                  <p>No open jobs match your search.</p>
                </div>
              );
            }

            return filteredJobs.map(job => {
              const isApplied = candidateProfile?.applications?.some(app => app.jobId === job.id);
              const isRecommended = recommendedJobIds.includes(job.id);
              
              return (
                <Card key={job.id} hoverable={!isApplied} className={`flex flex-col h-full relative ${isApplied ? 'border-accent/50 shadow-sm ring-1 ring-accent/20' : ''} ${isRecommended && !isApplied ? 'border-amber-400/50 shadow-sm ring-1 ring-amber-400/20' : ''}`}>
                  {isRecommended && !isApplied && (
                    <div className="absolute -top-3 -right-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles size={12} /> Top Match
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold text-primary pr-4">{job.title}</h3>
                      {isApplied && <CheckCircle2 size={20} className="text-accent shrink-0" />}
                    </div>
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
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedJob(job)}>Details</Button>
                      {isApplied ? (
                        <Button size="sm" variant="outline" disabled className="bg-accent/10 text-accent border-accent/20">
                          Applied
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleApply(job.id)}
                          disabled={applyingJobId === job.id}
                        >
                          {applyingJobId === job.id ? 'Applying...' : 'Apply Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            });
          })()}
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-border">
            <div className="p-6 border-b border-border flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">{selectedJob.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm">
                  <span className="flex items-center gap-1"><Building size={16} /> {selectedJob.company?.name || 'NexHire AI'}</span>
                  <span className="flex items-center gap-1"><MapPin size={16} /> {selectedJob.location}</span>
                  <span className="text-accent font-medium px-2 py-0.5 bg-accent/10 rounded-md">{selectedJob.department}</span>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 hover:bg-background-secondary rounded-full text-text-secondary hover:text-primary transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <h3 className="text-lg font-bold text-primary mb-3">Job Description</h3>
              <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {selectedJob.description}
              </div>
            </div>
            
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-background-secondary">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
              {candidateProfile?.applications?.some(app => app.jobId === selectedJob.id) ? (
                <Button disabled className="bg-accent/10 text-accent border-accent/20">Applied</Button>
              ) : (
                <Button 
                  onClick={() => {
                    handleApply(selectedJob.id);
                    setSelectedJob(null);
                  }}
                  disabled={applyingJobId === selectedJob.id}
                >
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
