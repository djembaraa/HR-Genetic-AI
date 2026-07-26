import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { Bot, Zap, ShieldCheck, Gauge, ArrowRight, User, FileText, CheckCircle2, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Pages & Layouts
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Jobs } from './pages/admin/Jobs';
import { Candidates } from './pages/admin/Candidates';
import { Settings } from './pages/admin/Settings';
import { HrOnboarding } from './pages/admin/HrOnboarding';

// Candidate Pages
import { CandidateLayout } from './layouts/CandidateLayout';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { ResumeBuilder } from './pages/candidate/ResumeBuilder';
import { Profile } from './pages/candidate/Profile';
import { MyApplications } from './pages/candidate/MyApplications';
import { Onboarding } from './pages/candidate/Onboarding';
import { CvAnalyzer } from './pages/candidate/CvAnalyzer';

const FeatureIcon = ({ icon: Icon }) => (
  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-4">
    <Icon size={24} className="text-accent" strokeWidth={1.5} />
  </div>
);

const LandingPage = () => (
  <div className="flex flex-col min-h-screen relative overflow-hidden">
    {/* Subtle Background Elements */}
    <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-background-secondary to-background -z-20"></div>
    
    <Navbar />
    
    {/* 1. HERO SECTION */}
    <section id="home" className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="flex flex-col text-center items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background-secondary border border-border text-sm font-medium text-primary mb-8 shadow-sm">
            NexHire AI v2.0 - The Dual-Sided Talent Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight mb-8">
            Where Top Talent meets <br/><span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent-light">Agentic AI.</span>
          </h1>
          <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            The intelligent Applicant Tracking System that empowers job seekers with AI resumes and equips HR teams with autonomous agentic screening.
          </p>
          
          {/* Dual Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-2xl mx-auto">
            <Button size="lg" className="w-full sm:w-auto text-lg py-6 px-8 group bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20" onClick={() => window.location.href='/signup'}>
              I'm a Job Seeker <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg py-6 px-8 group border-2" onClick={() => window.location.href='/login'}>
              I'm an Employer
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* 2. DUAL PORTAL SECTION */}
    <section id="portals" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card padding="spacious" hoverable className="h-full border-border/50 bg-white/60 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <User size={120} />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
              <FileText size={32} className="text-accent" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">For Candidates</h2>
            <ul className="space-y-4 mb-8 text-text-secondary">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-success" size={20} /> AI-Powered Resume Builder</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-success" size={20} /> ATS Optimization with Gemini</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-success" size={20} /> One-Click Job Applications</li>
            </ul>
            <Button variant="secondary" onClick={() => window.location.href='/signup'}>Build Resume Free</Button>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card padding="spacious" hoverable className="h-full border-border/50 bg-white/60 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Building size={120} />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Bot size={32} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4">For Employers</h2>
            <ul className="space-y-4 mb-8 text-text-secondary">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-success" size={20} /> LangGraph Agentic RAG</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-success" size={20} /> Automated CV Vectorization</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-success" size={20} /> AI Chat HR Assistant</li>
            </ul>
            <Button onClick={() => window.location.href='/login'}>Access ATS Dashboard</Button>
          </Card>
        </motion.div>
      </div>
    </section>

    {/* 3. FEATURES SECTION */}
    <section id="features" className="bg-background-secondary border-y border-border py-24 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Enterprise-Grade Infrastructure</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Designed for modern HR teams to streamline recruitment with high security and blazing fast AI performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <FeatureIcon icon={Zap} />
            <h3 className="text-xl font-bold text-primary mb-3">Agentic RAG Tool</h3>
            <p className="text-text-secondary leading-relaxed">AI agents reason autonomously and retrieve exact facts from CVs, eliminating hallucinations.</p>
          </Card>
          <Card>
            <FeatureIcon icon={ShieldCheck} />
            <h3 className="text-xl font-bold text-primary mb-3">Strict Security</h3>
            <p className="text-text-secondary leading-relaxed">Role-Based Access Control and strict data isolation ensures every tenant's data is heavily guarded.</p>
          </Card>
          <Card>
            <FeatureIcon icon={Gauge} />
            <h3 className="text-xl font-bold text-primary mb-3">High Availability</h3>
            <p className="text-text-secondary leading-relaxed">BullMQ job queues and Redis caching architecture handle huge traffic spikes effortlessly.</p>
          </Card>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN', 'HR_MANAGER', 'RECRUITER']} />}>
          <Route path="onboarding" element={<HrOnboarding />} />
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Protected Candidate Routes */}
        <Route path="/candidate" element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
          <Route path="onboarding" element={<Onboarding />} />
          <Route element={<CandidateLayout />}>
            <Route index element={<CandidateDashboard />} />
            <Route path="applications" element={<MyApplications />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="cv-analyzer" element={<CvAnalyzer />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
    </QueryClientProvider>
  );
}

export default App;
