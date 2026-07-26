import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { MapPin, Briefcase, Sparkles, Building, Calendar, Code, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  
  const [experience, setExperience] = useState({
    company: '',
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [experiences, setExperiences] = useState([]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (sk) => {
    setSkills(skills.filter(s => s !== sk));
  };

  const addExperience = () => {
    if (experience.company && experience.title && experience.startDate) {
      setExperiences([...experiences, experience]);
      setExperience({ company: '', title: '', description: '', startDate: '', endDate: '' });
      toast.success('Experience added!');
    } else {
      toast.error('Please fill company, title, and start date');
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      toast.error('Location is required!');
      setStep(1);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        location,
        summary,
        skills,
        experience: experiences
      };

      const res = await fetchApi('/api/candidate/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Profile created successfully!');
        // Small delay so toast is visible
        setTimeout(() => {
          navigate('/candidate');
        }, 1500);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to complete onboarding');
      }
    } catch (err) {
      toast.error('Network error during onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col items-center py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl -z-10 translate-x-[30%] translate-y-[-20%]"></div>
      
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4 shadow-sm border border-accent/20">
            <Sparkles className="text-accent" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">Complete Your Profile</h1>
          <p className="text-text-secondary text-lg">Help AI match you with the perfect opportunities.</p>
        </div>

        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-8 px-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-border -z-10 -translate-y-1/2"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-accent transition-all duration-500 -z-10 -translate-y-1/2"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s ? 'bg-accent text-white shadow-md shadow-accent/30' : 'bg-background border border-border text-text-muted'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <Card padding="spacious" glass className="shadow-float border-border/50">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Basic Information</h2>
                  <p className="text-sm text-text-secondary mb-6">Where are you located and what are you looking for?</p>
                </div>
                
                <Input
                  label="Location (City, Country)"
                  icon={MapPin}
                  placeholder="e.g. Jakarta, Indonesia"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Professional Summary</label>
                  <textarea
                    rows={4}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                    placeholder="Briefly describe your career goals and what makes you unique..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} disabled={!location}>
                    Next Step <Sparkles size={16} className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Skills */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Tech Stack & Skills</h2>
                  <p className="text-sm text-text-secondary mb-6">Add your relevant skills so AI can match you to exact job requirements.</p>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      icon={Code}
                      placeholder="e.g. React, Python, Marketing, Figma"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    />
                  </div>
                  <Button variant="secondary" onClick={addSkill} className="shrink-0">Add</Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-background-primary rounded-xl border border-dashed border-border">
                  {skills.length === 0 ? (
                    <span className="text-sm text-text-muted flex items-center justify-center w-full">No skills added yet.</span>
                  ) : (
                    skills.map(sk => (
                      <span key={sk} className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium border border-primary/20">
                        {sk}
                        <button onClick={() => removeSkill(sk)} className="hover:text-error ml-1">&times;</button>
                      </span>
                    ))
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={() => setStep(3)}>Next Step</Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Experience */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Recent Experience</h2>
                  <p className="text-sm text-text-secondary mb-6">Add your most relevant work experience to boost your AI score.</p>
                </div>

                {experiences.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-border bg-background-primary flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                          <Building size={20} className="text-accent" />
                        </div>
                        <div>
                          <h4 className="font-bold text-primary">{exp.title}</h4>
                          <p className="text-sm text-text-secondary">{exp.company} • {exp.startDate}</p>
                        </div>
                        <CheckCircle2 size={20} className="text-success ml-auto mt-2" />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="p-5 rounded-xl border border-border bg-background space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Company Name"
                      icon={Building}
                      placeholder="e.g. Gojek"
                      value={experience.company}
                      onChange={(e) => setExperience({...experience, company: e.target.value})}
                    />
                    <Input
                      label="Job Title"
                      icon={Briefcase}
                      placeholder="e.g. Frontend Engineer"
                      value={experience.title}
                      onChange={(e) => setExperience({...experience, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Start Date"
                      type="month"
                      icon={Calendar}
                      value={experience.startDate}
                      onChange={(e) => setExperience({...experience, startDate: e.target.value})}
                    />
                    <Input
                      label="End Date (Optional)"
                      type="month"
                      icon={Calendar}
                      value={experience.endDate}
                      onChange={(e) => setExperience({...experience, endDate: e.target.value})}
                    />
                  </div>
                  <Button variant="secondary" onClick={addExperience} className="w-full">
                    Add Experience
                  </Button>
                </div>

                <div className="flex justify-between pt-4 mt-6 border-t border-border">
                  <Button variant="outline" onClick={() => setStep(2)} disabled={loading}>Back</Button>
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20"
                  >
                    {loading ? 'Processing...' : 'Complete Profile & Match Jobs!'}
                  </Button>
                </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
};
