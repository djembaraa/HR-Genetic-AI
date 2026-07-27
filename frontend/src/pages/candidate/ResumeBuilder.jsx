import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Plus, Trash2, Wand2, Briefcase, GraduationCap, Award, X, Check, Code, Medal, Globe, Star } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import toast from 'react-hot-toast';



export const ResumeBuilder = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // AI Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [currentExpId, setCurrentExpId] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi('/api/candidate/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const addExperience = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetchApi('/api/candidate/experience', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        e.target.reset();
        fetchProfile();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteExperience = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/candidate/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const addEducation = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const res = await fetchApi('/api/candidate/education', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        e.target.reset();
        fetchProfile();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEducation = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/candidate/education/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const addSkill = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (profile?.skills?.some(s => s.name.toLowerCase() === data.name.trim().toLowerCase())) {
      toast.error(`Skill '${data.name}' has already been added.`);
      return;
    }
    
    try {
      const res = await fetchApi('/api/candidate/skill', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        e.target.reset();
        fetchProfile();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSkill = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/candidate/skill/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const addProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await fetchApi('/api/candidate/project', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { e.target.reset(); fetchProfile(); }
    } catch (error) { console.error(error); }
  };
  const deleteProject = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/candidate/project/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchProfile();
    } catch (error) { console.error(error); }
  };
  
  const addCertification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await fetchApi('/api/candidate/certification', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { e.target.reset(); fetchProfile(); }
    } catch (error) { console.error(error); }
  };
  const deleteCertification = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/candidate/certification/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchProfile();
    } catch (error) { console.error(error); }
  };

  const addLanguage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await fetchApi('/api/candidate/language', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { e.target.reset(); fetchProfile(); }
    } catch (error) { console.error(error); }
  };
  const deleteLanguage = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/candidate/language/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchProfile();
    } catch (error) { console.error(error); }
  };

  const addAward = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    try {
      const res = await fetchApi('/api/candidate/award', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) { e.target.reset(); fetchProfile(); }
    } catch (error) { console.error(error); }
  };
  const deleteAward = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/candidate/award/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) fetchProfile();
    } catch (error) { console.error(error); }
  };

  const handleEnhanceWithAI = async (exp) => {
    setCurrentExpId(exp.id);
    setShowAiModal(true);
    setAiLoading(true);
    setAiSuggestion('');

    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi('/api/ai/enhance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: exp.description })
      });
      if (res.ok) {
        const data = await res.json();
        setAiSuggestion(data.enhanced_text);
      }
    } catch (error) {
      console.error(error);
      setAiSuggestion('Failed to connect to AI Service. Is the Python server running?');
    } finally {
      setAiLoading(false);
    }
  };

  const acceptAiSuggestion = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi(`/api/candidate/experience/${currentExpId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: aiSuggestion })
      });
      if (res.ok) {
        setShowAiModal(false);
        fetchProfile();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save AI suggestion');
    }
  };

  const handleGenerateDescription = async (e) => {
    e.preventDefault();
    const title = document.getElementById('input-title')?.value;
    const company = document.getElementById('input-company')?.value;
    
    if (!title) {
      toast.error('Please enter a Job Title first');
      return;
    }
    
    const toastId = toast.loading('AI is generating your description...');
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetchApi('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, company })
      });
      
      if (res.ok) {
        const data = await res.json();
        const descInput = document.getElementById('input-description');
        if (descInput) descInput.value = data.generated_text;
        toast.success('Description generated!', { id: toastId });
      } else {
        toast.error('Failed to generate description', { id: toastId });
      }
    } catch (error) {
      toast.error('Error connecting to AI service', { id: toastId });
    }
  };

  const handleGenerateSummary = async () => {
    if (!profile) return;
    
    const toastId = toast.loading('AI is generating your professional summary...');
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetchApi('/api/ai/generate-summary', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ profile_data: profile })
      });
      
      if (res.ok) {
        const data = await res.json();
        const summaryInput = document.getElementById('input-summary');
        if (summaryInput) summaryInput.value = data.generated_summary;
        toast.success('Summary generated!', { id: toastId });
      } else {
        toast.error('Failed to generate summary', { id: toastId });
      }
    } catch (error) {
      toast.error('Error connecting to AI service', { id: toastId });
    }
  };

  const handleSaveSummary = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const summary = document.getElementById('input-summary')?.value;
    
    try {
      const res = await fetchApi('/api/candidate/profile', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ summary })
      });
      if (res.ok) {
        toast.success('Summary saved');
        fetchProfile();
      }
    } catch (error) {
      toast.error('Failed to save summary');
    }
  };

  const handleVectorize = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetchApi('/api/candidate/vectorize', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      toast.success('Your profile has been queued for background AI processing!');
    } catch(err) {}
  };

  const handleDownloadPDF = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetchApi('/api/candidate/resume/pdf', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to download PDF');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile?.name?.replace(/\s+/g, '_') || 'Candidate'}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error('Failed to generate PDF');
    }
  };

  if (loading) return <div className="p-8 text-text-secondary">Loading your profile...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      
      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full border-accent border-t-4 shadow-2xl relative bg-gradient-to-br from-background to-background-tertiary">
            <button id="btn-close-ai-modal" onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-primary">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
              <Wand2 className="text-accent" /> AI Enhancement
            </h2>
            <p className="text-text-secondary mb-6">Review the AI's suggestion before applying it to your resume.</p>
            
            <div className="bg-background-secondary rounded-lg p-6 min-h-[150px] flex items-center justify-center mb-6 border border-border">
              {aiLoading ? (
                <div className="flex flex-col items-center gap-3 text-accent animate-pulse">
                  <Wand2 size={32} className="animate-spin" />
                  <span className="font-medium">AI is analyzing and rewriting your experience...</span>
                </div>
              ) : (
                <div className="w-full text-primary font-serif whitespace-pre-wrap">
                  {aiSuggestion}
                </div>
              )}
            </div>

            {!aiLoading && (
              <div className="flex justify-end gap-3">
                <Button id="btn-reject-ai" variant="outline" onClick={() => setShowAiModal(false)}>Reject</Button>
                <Button id="btn-accept-ai" onClick={acceptAiSuggestion} className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Check size={18} /> Accept Suggestion
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Editor Section */}
      <div className="flex-1 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Resume Builder</h1>
          <p className="text-text-secondary">Build an ATS-optimized resume directly on our platform.</p>
        </div>

        {/* Professional Summary Form */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Wand2 className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Professional Summary</h2>
          </div>
          
          <form onSubmit={handleSaveSummary} className="space-y-4 mb-4">
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-primary">Summary</label>
                <button type="button" onClick={handleGenerateSummary} className="text-xs flex items-center gap-1 text-accent hover:text-accent-hover font-medium bg-accent/10 px-2 py-1 rounded-md transition-colors">
                  <Wand2 size={12} /> Auto-Generate
                </button>
              </div>
              <textarea id="input-summary" required name="summary" rows="4" defaultValue={profile?.summary || ''} className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder:text-text-muted" placeholder="A brief professional summary..."></textarea>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Check size={16} /> Save Summary
              </Button>
            </div>
          </form>
        </Card>

        {/* Experience Form */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Briefcase className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Work Experience</h2>
          </div>
          
          <form onSubmit={addExperience} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="input-company" required name="company" type="text" label="Company Name" placeholder="e.g. Google" />
                <Input id="input-title" required name="title" type="text" label="Job Title" placeholder="e.g. Software Engineer" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input id="input-start-date" required name="startDate" type="date" label="Start Date" />
                <Input id="input-end-date" name="endDate" type="date" label="End Date" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-primary">Description</label>
                  <button type="button" onClick={handleGenerateDescription} className="text-xs flex items-center gap-1 text-accent hover:text-accent-hover font-medium bg-accent/10 px-2 py-1 rounded-md transition-colors">
                    <Wand2 size={12} /> Auto-Generate
                  </button>
                </div>
                <textarea id="input-description" required name="description" rows="4" className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder:text-text-muted" placeholder="Describe your responsibilities and achievements..."></textarea>
            </div>
            <div className="flex justify-end">
              <Button id="btn-add-experience" type="submit" className="flex items-center gap-2">
                <Plus size={16} /> Add Experience
              </Button>
            </div>
          </form>

          {/* List of Experiences */}
          <div className="space-y-4">
            {profile?.experiences?.map(exp => (
              <div key={exp.id} className="p-4 border border-border rounded-lg bg-background flex flex-col gap-2 relative group">
                <button onClick={() => deleteExperience(exp.id)} className="absolute top-4 right-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={18} />
                </button>
                <h3 className="font-bold text-primary">{exp.title} at {exp.company}</h3>
                <span className="text-sm text-text-secondary">
                  {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                </span>
                <p className="text-sm text-primary mt-2 whitespace-pre-wrap">{exp.description}</p>
                
                {/* AI Enhancement Button */}
                <div className="mt-4 pt-4 border-t border-border">
                  <Button id={`btn-enhance-${exp.id}`} variant="outline" size="sm" onClick={() => handleEnhanceWithAI(exp)} className="flex items-center gap-2 text-accent border-accent hover:bg-accent hover:text-white">
                    <Wand2 size={14} /> Enhance with AI
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Education Form */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <GraduationCap className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Education</h2>
          </div>
          
          <form onSubmit={addEducation} className="space-y-4 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input required name="institution" type="text" label="Institution" placeholder="e.g. MIT" />
                <Input required name="degree" type="text" label="Degree" placeholder="e.g. BSc" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input required name="field" type="text" label="Field of Study" placeholder="e.g. Computer Science" />
                <Input required name="startDate" type="date" label="Start Date" />
                <Input name="endDate" type="date" label="End Date" />
              </div>
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <Plus size={16} /> Add Education
              </Button>
            </div>
          </form>

          {/* List of Education */}
          <div className="space-y-4">
            {profile?.educations?.map(edu => (
              <div key={edu.id} className="p-4 border border-border rounded-lg bg-background flex flex-col gap-2 relative group">
                <button onClick={() => deleteEducation(edu.id)} className="absolute top-4 right-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={18} />
                </button>
                <h3 className="font-bold text-primary">{edu.degree} in {edu.field}</h3>
                <span className="text-sm text-text-secondary">{edu.institution}</span>
                <span className="text-xs text-text-muted">
                  {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Skills Form */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Award className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Skills</h2>
          </div>
          
          <form onSubmit={addSkill} className="flex gap-4 mb-8 items-end">
            <div className="flex-1">
              <Input required name="name" type="text" label="Skill Name" placeholder="e.g. React.js" />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-primary mb-1.5">Proficiency</label>
              <select name="proficiency" className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200">
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            <Button type="submit" className="flex items-center gap-2">
              <Plus size={16} /> Add
            </Button>
          </form>

          {/* List of Skills */}
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.map(skill => (
              <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full text-sm">
                <span className="font-medium text-primary">{skill.name}</span>
                <span className="text-xs text-text-muted">({skill.proficiency.toLowerCase()})</span>
                <button onClick={() => deleteSkill(skill.id)} className="text-text-muted hover:text-danger ml-1">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Projects Form */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Code className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Projects</h2>
          </div>
          <form onSubmit={addProject} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input required name="name" type="text" label="Project Name" placeholder="e.g. Resume ATS parser" />
              <Input name="link" type="url" label="Project Link" placeholder="https://github.com/..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="startDate" type="date" label="Start Date" />
              <Input name="endDate" type="date" label="End Date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Description</label>
              <textarea name="description" rows="3" className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder:text-text-muted" placeholder="What did you build?"></textarea>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2"><Plus size={16} /> Add Project</Button>
            </div>
          </form>
          <div className="space-y-4">
            {profile?.projects?.map(proj => (
              <div key={proj.id} className="p-4 border border-border rounded-lg bg-background flex flex-col gap-2 relative group">
                <button onClick={() => deleteProject(proj.id)} className="absolute top-4 right-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                <h3 className="font-bold text-primary">{proj.name}</h3>
                {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-accent text-sm hover:underline">{proj.link}</a>}
                <span className="text-xs text-text-muted">
                  {proj.startDate ? new Date(proj.startDate).toLocaleDateString() : ''} {proj.endDate ? `- ${new Date(proj.endDate).toLocaleDateString()}` : ''}
                </span>
                <p className="text-sm text-primary mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Certifications Form */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Medal className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Certifications</h2>
          </div>
          <form onSubmit={addCertification} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input required name="name" type="text" label="Certification Name" placeholder="e.g. AWS Certified Developer" />
              <Input required name="issuer" type="text" label="Issuer" placeholder="e.g. Amazon Web Services" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="issueDate" type="date" label="Issue Date" />
              <Input name="expirationDate" type="date" label="Expiration Date" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="credentialId" type="text" label="Credential ID" />
              <Input name="credentialUrl" type="url" label="Credential URL" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2"><Plus size={16} /> Add Certification</Button>
            </div>
          </form>
          <div className="space-y-4">
            {profile?.certifications?.map(cert => (
              <div key={cert.id} className="p-4 border border-border rounded-lg bg-background flex flex-col gap-2 relative group">
                <button onClick={() => deleteCertification(cert.id)} className="absolute top-4 right-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                <h3 className="font-bold text-primary">{cert.name}</h3>
                <span className="text-sm text-text-secondary">{cert.issuer}</span>
                <span className="text-xs text-text-muted">
                  Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'} {cert.expirationDate ? `| Expires: ${new Date(cert.expirationDate).toLocaleDateString()}` : ''}
                </span>
                {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-accent text-sm hover:underline">View Credential</a>}
              </div>
            ))}
          </div>
        </Card>

        {/* Awards Form */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Awards & Honors</h2>
          </div>
          <form onSubmit={addAward} className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input required name="title" type="text" label="Award Title" placeholder="e.g. Employee of the Year" />
              <Input name="issuer" type="text" label="Issuer" placeholder="e.g. Google" />
            </div>
            <Input name="date" type="date" label="Date Received" />
            <div>
              <label className="block text-sm font-medium text-primary mb-1.5">Description</label>
              <textarea name="description" rows="2" className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 placeholder:text-text-muted"></textarea>
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2"><Plus size={16} /> Add Award</Button>
            </div>
          </form>
          <div className="space-y-4">
            {profile?.awards?.map(award => (
              <div key={award.id} className="p-4 border border-border rounded-lg bg-background flex flex-col gap-2 relative group">
                <button onClick={() => deleteAward(award.id)} className="absolute top-4 right-4 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18} /></button>
                <h3 className="font-bold text-primary">{award.title}</h3>
                <span className="text-sm text-text-secondary">{award.issuer}</span>
                {award.date && <span className="text-xs text-text-muted">{new Date(award.date).toLocaleDateString()}</span>}
                <p className="text-sm text-primary mt-1">{award.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Languages Form */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Globe className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Languages</h2>
          </div>
          <form onSubmit={addLanguage} className="flex gap-4 mb-8 items-end">
            <div className="flex-1">
              <Input required name="name" type="text" label="Language" placeholder="e.g. Spanish" />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium text-primary mb-1.5">Proficiency</label>
              <select name="proficiency" className="w-full px-4 py-2 border border-border rounded-xl bg-background text-primary focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200">
                <option value="Basic">Basic</option>
                <option value="Conversational">Conversational</option>
                <option value="Fluent">Fluent</option>
                <option value="Native">Native/Bilingual</option>
              </select>
            </div>
            <Button type="submit" className="flex items-center gap-2"><Plus size={16} /> Add</Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {profile?.languages?.map(lang => (
              <div key={lang.id} className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full text-sm">
                <span className="font-medium text-primary">{lang.name}</span>
                <span className="text-xs text-text-muted">({lang.proficiency})</span>
                <button onClick={() => deleteLanguage(lang.id)} className="text-text-muted hover:text-danger ml-1"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Live Preview Section */}
      <div className="w-full lg:w-[400px] xl:w-[500px]">
        <div className="sticky top-24">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center justify-between">
            Live Preview
            <span className="text-xs font-normal text-text-secondary px-2 py-1 bg-background border border-border rounded-md">ATS Optimized</span>
          </h3>
          <div className="bg-white border border-border rounded-xl shadow-md p-8 min-h-[600px] font-serif text-black relative overflow-hidden break-words max-w-full mx-auto">
            <div className="text-center mb-8 border-b border-gray-300 pb-6">
              <div className="text-2xl font-bold mb-2">{profile?.name}</div>
              <p className="text-sm text-gray-600">
                {profile?.email} | {profile?.phone || 'Add Phone'} | {profile?.location || 'Add Location'}
                {profile?.linkedinUrl && ` | LinkedIn`}
                {profile?.githubUrl && ` | GitHub`}
                {profile?.websiteUrl && ` | Website`}
              </p>
            </div>
            
            {profile?.summary && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">Professional Summary</h2>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {profile.summary}
                </p>
              </div>
            )}
            
            {profile?.experiences?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Experience</h2>
                <div className="space-y-6">
                  {profile.experiences.map(exp => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-md">{exp.company}</h3>
                        <span className="text-sm text-gray-600">
                          {new Date(exp.startDate).toLocaleDateString(undefined, {month:'short', year:'numeric'})} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : 'Present'}
                        </span>
                      </div>
                      <div className="italic text-sm text-gray-800 mb-2">{exp.title}</div>
                      <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-1">
                        {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim()}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile?.educations?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Education</h2>
                <div className="space-y-4">
                  {profile.educations.map(edu => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-md">{edu.institution}</h3>
                        <span className="text-sm text-gray-600">
                          {new Date(edu.startDate).toLocaleDateString(undefined, {year:'numeric'})} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, {year:'numeric'}) : 'Present'}
                        </span>
                      </div>
                      <div className="italic text-sm text-gray-800 mb-2">{edu.degree} in {edu.field}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile?.skills?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Skills</h2>
                <div className="text-sm text-gray-800">
                  {profile.skills.map(skill => skill.name).join(', ')}
                </div>
              </div>
            )}
            
            {profile?.projects?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Projects</h2>
                <div className="space-y-4">
                  {profile.projects.map(proj => (
                    <div key={proj.id}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-md flex items-center gap-2">
                          {proj.name} 
                          {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 text-xs font-normal">Link</a>}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {proj.startDate ? new Date(proj.startDate).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : ''} {proj.endDate ? `- ${new Date(proj.endDate).toLocaleDateString(undefined, {month:'short', year:'numeric'})}` : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile?.certifications?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Certifications</h2>
                <ul className="list-disc list-outside ml-4 text-sm text-gray-800 space-y-1">
                  {profile.certifications.map(cert => (
                    <li key={cert.id}>
                      <span className="font-bold">{cert.name}</span>, {cert.issuer} 
                      {cert.issueDate ? ` (${new Date(cert.issueDate).toLocaleDateString(undefined, {year:'numeric'})})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile?.awards?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Honors & Awards</h2>
                <ul className="list-disc list-outside ml-4 text-sm text-gray-800 space-y-1">
                  {profile.awards.map(award => (
                    <li key={award.id}>
                      <span className="font-bold">{award.title}</span> {award.issuer ? `- ${award.issuer}` : ''} 
                      {award.date ? ` (${new Date(award.date).toLocaleDateString(undefined, {year:'numeric'})})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile?.languages?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Languages</h2>
                <div className="text-sm text-gray-800">
                  {profile.languages.map(lang => `${lang.name} (${lang.proficiency})`).join(', ')}
                </div>
              </div>
            )}
            
            <div className="mt-12 pt-6 border-t border-gray-300 flex flex-col gap-3">
              <Button id="btn-vectorize-profile" onClick={handleVectorize} className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-accent to-primary">
                <Wand2 size={18} /> Finalize & Publish Profile
              </Button>
              <Button id="btn-download-pdf" variant="outline" onClick={handleDownloadPDF} className="flex items-center gap-2 w-full justify-center text-text-secondary">
                <Check size={18} /> Download PDF Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
