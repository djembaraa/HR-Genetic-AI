import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Plus, Trash2, Wand2, Briefcase, GraduationCap, Award, X, Check } from 'lucide-react';

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
      const res = await fetch('http://localhost:3000/api/candidate/profile', {
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
      const res = await fetch('http://localhost:3000/api/candidate/experience', {
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
      const res = await fetch(`http://localhost:3000/api/candidate/experience/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchProfile();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnhanceWithAI = async (exp) => {
    setCurrentExpId(exp.id);
    setShowAiModal(true);
    setAiLoading(true);
    setAiSuggestion('');

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/ai/enhance', {
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
    // Ideally we update the experience via PUT request, but for MVP we will just close the modal.
    // To implement fully: call PUT /api/candidate/experience/:id
    setShowAiModal(false);
    alert('AI Suggestion Accepted! (Backend PUT pending)');
  };

  const handleVectorize = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:3000/api/candidate/vectorize', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Your profile has been queued for background AI processing!');
    } catch(err) {}
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
                <label className="block text-sm font-medium text-primary mb-1.5">Description</label>
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

        {/* Placeholders for Education & Skills */}
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Education</h2>
          </div>
          <p className="text-text-secondary text-sm">Form logic follows the same pattern as Experience.</p>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-accent" size={24} />
            <h2 className="text-xl font-bold text-primary">Skills</h2>
          </div>
          <p className="text-text-secondary text-sm">Form logic follows the same pattern as Experience.</p>
        </Card>
      </div>

      {/* Live Preview Section */}
      <div className="w-full lg:w-[400px] xl:w-[500px]">
        <div className="sticky top-24">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center justify-between">
            Live Preview
            <span className="text-xs font-normal text-text-secondary px-2 py-1 bg-background border border-border rounded-md">ATS Optimized</span>
          </h3>
          <div className="bg-gradient-to-b from-white to-background-secondary border border-border rounded-lg shadow-sm p-8 min-h-[800px] font-serif text-black relative">
            <div className="text-center mb-8 border-b border-gray-300 pb-6">
              <div className="text-2xl font-bold mb-2">{profile?.name}</div>
              <p className="text-sm text-gray-600">{profile?.email} | {profile?.phone || 'Add Phone'} | {profile?.location || 'Add Location'}</p>
            </div>
            
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
            
            <div className="mt-12 pt-6 border-t border-gray-300 flex flex-col gap-3">
              <Button id="btn-vectorize-profile" onClick={handleVectorize} className="flex items-center gap-2 w-full justify-center bg-gradient-to-r from-accent to-primary">
                <Wand2 size={18} /> Finalize & Publish Profile
              </Button>
              <Button id="btn-download-pdf" variant="outline" onClick={() => window.open('http://localhost:3000/api/candidate/resume/pdf?token=' + localStorage.getItem('token'), '_blank')} className="flex items-center gap-2 w-full justify-center text-text-secondary">
                <Check size={18} /> Download PDF Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
