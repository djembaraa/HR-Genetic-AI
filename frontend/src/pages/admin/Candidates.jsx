import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { User, FileText, CheckCircle2, Clock, Search, UploadCloud, X, Briefcase, GraduationCap, Award } from 'lucide-react';
import { UploadForm } from '../../components/UploadForm';
import { fetchApi } from '../../lib/api';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const Candidates = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const queryClient = useQueryClient();

  const { data: profileDetail, isFetching: loadingProfile } = useQuery({
    queryKey: ['hr_candidate_profile', selectedCandidateId],
    queryFn: async () => {
      if (!selectedCandidateId) return null;
      const token = localStorage.getItem('token');
      const res = await fetchApi(`/api/hr/candidates/${selectedCandidateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    },
    enabled: !!selectedCandidateId
  });

  const { data: candidates = [], isLoading: loading } = useQuery({
    queryKey: ['hr_candidates'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await fetchApi('/api/hr/candidates', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch candidates');
      return res.json();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ applicationId, status }) => {
      const token = localStorage.getItem('token');
      const res = await fetchApi(`/api/hr/applications/${applicationId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => {
      toast.success('Status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['hr_candidates'] });
    },
    onError: () => {
      toast.error('Failed to update status');
    }
  });

  const handleDownloadPDF = async (candidateId, candidateName) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/hr/resume/pdf/${candidateId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to download PDF');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(candidateName || 'Candidate').replace(/\\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF');
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                <th className="p-4 font-bold text-primary">Applications & Status</th>
                <th className="p-4 font-bold text-primary">AI Status</th>
                <th className="p-4 font-bold text-primary">Resume</th>
                <th className="p-4 font-bold text-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(() => {
                const filteredCandidates = candidates.filter(candidate =>
                  (candidate.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (candidate.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (candidate.applications?.some(app => (app.job?.title || '').toLowerCase().includes(searchQuery.toLowerCase())))
                );

                if (loading) return (
                  <>
                    {[1, 2, 3].map(i => (
                      <tr key={`skel-${i}`} className="animate-pulse">
                        <td className="p-4"><div className="w-48 h-10 bg-border/20 rounded-md"></div></td>
                        <td className="p-4"><div className="w-32 h-6 bg-border/20 rounded-md"></div></td>
                        <td className="p-4"><div className="w-24 h-6 bg-border/20 rounded-md"></div></td>
                        <td className="p-4"><div className="w-20 h-8 bg-border/20 rounded-md"></div></td>
                        <td className="p-4 text-right"><div className="w-24 h-8 bg-border/20 rounded-md inline-block"></div></td>
                      </tr>
                    ))}
                  </>
                );
                if (filteredCandidates.length === 0) return <tr><td colSpan="5" className="p-8 text-center text-text-secondary">No candidates found for your company.</td></tr>;

                return filteredCandidates.map(candidate => (
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
                    <td className="p-4 text-text-secondary">
                      {candidate.applications?.length > 0 
                        ? candidate.applications.map(app => (
                            <div key={app.id} className="mb-3 last:mb-0 p-2 bg-background rounded border border-border">
                              <div className="font-medium text-primary mb-1">{app.job?.title}</div>
                              <select 
                                value={app.status}
                                onChange={(e) => updateStatusMutation.mutate({ applicationId: app.id, status: e.target.value })}
                                disabled={updateStatusMutation.isPending}
                                className="w-full text-xs p-1.5 bg-background-secondary border border-border rounded focus:outline-none focus:border-accent text-text-secondary"
                              >
                                <option value="APPLIED">Applied</option>
                                <option value="REVIEWING">Reviewing</option>
                                <option value="INTERVIEW">Interview</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="HIRED">Hired</option>
                              </select>
                            </div>
                          ))
                        : 'Open Application'
                      }
                    </td>
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
                        onClick={() => handleDownloadPDF(candidate.id, candidate.name)}
                      >
                        <FileText size={16} /> PDF
                      </Button>
                    </td>
                    <td className="p-4 text-right">
                      <Button variant="secondary" size="sm" onClick={() => setSelectedCandidateId(candidate.id)}>View Profile</Button>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Candidate Profile Modal */}
      {selectedCandidateId && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto border-accent border-t-4 shadow-2xl relative bg-gradient-to-br from-background to-background-tertiary">
            <button onClick={() => setSelectedCandidateId(null)} className="absolute top-4 right-4 text-text-muted hover:text-primary z-10">
              <X size={24} />
            </button>
            
            {loadingProfile ? (
              <div className="p-12 text-center text-text-secondary animate-pulse">Loading profile data...</div>
            ) : profileDetail ? (
              <div className="space-y-8">
                <div className="flex items-start gap-6 border-b border-border pb-6">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <User size={40} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary">{profileDetail.name}</h2>
                    <p className="text-text-secondary mt-1">{profileDetail.email} {profileDetail.phone ? `| ${profileDetail.phone}` : ''} {profileDetail.location ? `| ${profileDetail.location}` : ''}</p>
                    {profileDetail.summary && (
                      <p className="mt-4 text-text-secondary leading-relaxed bg-background-secondary p-4 rounded-lg border border-border">{profileDetail.summary}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2"><Briefcase className="text-accent" size={20}/> Experience</h3>
                      <div className="space-y-4">
                        {profileDetail.experiences?.length > 0 ? profileDetail.experiences.map(exp => (
                          <div key={exp.id} className="border-l-2 border-border pl-4">
                            <h4 className="font-bold text-primary">{exp.title}</h4>
                            <p className="text-sm text-text-secondary">{exp.company} • {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}</p>
                            <p className="mt-2 text-sm text-text-secondary whitespace-pre-wrap line-clamp-3 hover:line-clamp-none transition-all">{exp.description}</p>
                          </div>
                        )) : <p className="text-sm text-text-muted">No experience listed.</p>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2"><GraduationCap className="text-accent" size={20}/> Education</h3>
                      <div className="space-y-4">
                        {profileDetail.educations?.length > 0 ? profileDetail.educations.map(edu => (
                          <div key={edu.id} className="border-l-2 border-border pl-4">
                            <h4 className="font-bold text-primary">{edu.degree} in {edu.field}</h4>
                            <p className="text-sm text-text-secondary">{edu.institution} • {new Date(edu.startDate).getFullYear()} - {edu.endDate ? new Date(edu.endDate).getFullYear() : 'Present'}</p>
                          </div>
                        )) : <p className="text-sm text-text-muted">No education listed.</p>}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2"><Award className="text-accent" size={20}/> Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileDetail.skills?.length > 0 ? profileDetail.skills.map(skill => (
                          <span key={skill.id} className="px-3 py-1 bg-background-secondary border border-border rounded-full text-sm font-medium text-primary">
                            {skill.name} <span className="text-text-muted text-xs font-normal">({skill.proficiency.toLowerCase()})</span>
                          </span>
                        )) : <p className="text-sm text-text-muted">No skills listed.</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-error">Failed to load profile.</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
