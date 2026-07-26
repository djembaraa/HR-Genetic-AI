import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Building, Briefcase, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export const HrOnboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (!industry || description.length < 10) {
      toast.error('Industry and Description (min 10 chars) are required!');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = { industry, website, description };

      const res = await fetchApi('/api/hr/company/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast.success('Company profile updated successfully!');
        setStep(2); // Move to success / Aha! moment step
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to complete company profile');
      }
    } catch (err) {
      toast.error('Network error during onboarding');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = () => {
    // In our system, jobs are managed in /admin/jobs.
    navigate('/admin/jobs');
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10 translate-x-[30%] translate-y-[-20%]"></div>
      
      <div className="w-full max-w-2xl z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 shadow-sm border border-primary/20">
            <Building className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-primary mb-3 tracking-tight">Complete Company Profile</h1>
          <p className="text-text-secondary text-lg">Set up your employer brand to attract the best candidates.</p>
        </div>

        <Card padding="spacious" glass className="shadow-float border-border/50">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Company Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-1">Company Details</h2>
                  <p className="text-sm text-text-secondary mb-6">Tell candidates about your company's mission and industry.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Industry"
                    icon={Briefcase}
                    placeholder="e.g. Fintech, Healthcare"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                  />
                  <Input
                    label="Website (Optional)"
                    icon={Globe}
                    placeholder="https://company.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Company Description</label>
                  <textarea
                    rows={5}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none"
                    placeholder="What does your company do? Why should people work here?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4 mt-6 border-t border-border">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !industry || description.length < 10}
                    className="bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20"
                  >
                    {loading ? 'Saving...' : 'Save & Continue'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: The Aha! Moment */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center py-6"
              >
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle2 size={48} className="text-success drop-shadow-md" />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-bold text-primary mb-3">Profile Ready!</h2>
                  <p className="text-text-secondary text-lg max-w-md mx-auto">
                    Your company profile is set. Now, let our AI Agent find the perfect talent for your team.
                  </p>
                </div>

                <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl flex flex-col items-center">
                  <Sparkles size={32} className="text-accent mb-4" />
                  <h3 className="font-bold text-primary mb-2">Ready for your first hire?</h3>
                  <p className="text-sm text-text-secondary mb-6">Post a job now and AI will instantly match you with relevant candidates from our database.</p>
                  
                  <Button 
                    size="lg" 
                    onClick={handleCreateJob}
                    className="bg-accent hover:bg-accent-hover text-white shadow-xl shadow-accent/30 text-lg py-6 px-8 w-full sm:w-auto"
                  >
                    Create Your First Job Posting
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
