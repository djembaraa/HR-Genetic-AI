import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Navbar } from './components/Navbar';
import { UploadForm } from './components/UploadForm';
import { Card } from './components/Card';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { Bot, Zap, ShieldCheck, Gauge, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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

// Candidate Pages
import { CandidateLayout } from './layouts/CandidateLayout';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { ResumeBuilder } from './pages/candidate/ResumeBuilder';
import { Profile } from './pages/candidate/Profile';

const FeatureIcon = ({ icon: Icon }) => (
  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-4">
    <Icon size={24} className="text-accent" strokeWidth={1.5} />
  </div>
);

// The Landing Page Component
const LandingPage = () => (
  <div className="flex flex-col min-h-screen relative overflow-hidden">
    {/* Subtle Background Elements */}
    <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-background-secondary to-background -z-20"></div>
    
    <Navbar />
    
    {/* 1. HERO SECTION */}
    <section id="home" className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-sm font-medium text-primary mb-8 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-success"></span>
            NexHire AI v2.0 is Live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-primary leading-[1.1] tracking-tight mb-6">
            Recruit top talent <br/><span className="text-text-muted">with AI power.</span>
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
            The intelligent Applicant Tracking System that screens, parses, and matches candidates instantly using Agentic RAG.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="group" onClick={() => document.getElementById('upload-section').scrollIntoView()}>
              Try AI Screening <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => window.location.href='/login'}>
              Admin Login
            </Button>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex-1 w-full max-w-lg relative"
        >
          {/* Decorative floating shapes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-border/30 rounded-full blur-3xl -z-10"></div>
          
          <Card padding="spacious" className="text-center shadow-float border-border/50 bg-white/80 backdrop-blur-xl">
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="mx-auto w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20 rotate-3"
            >
              <Bot size={40} className="text-white" strokeWidth={1.5} />
            </motion.div>
            <h2 className="text-2xl font-bold text-primary mb-3">AI Agent Ready</h2>
            <p className="text-text-secondary leading-relaxed font-medium">
              Upload a CV and let the Agentic LangGraph pipeline extract structured data into ChromaDB.
            </p>
          </Card>
        </motion.div>
      </div>
    </section>

    {/* 2. FEATURES SECTION */}
    <section id="features" className="bg-background-secondary border-y border-border py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Enterprise-Grade Features</h2>
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
            <p className="text-text-secondary leading-relaxed">MIME-type validation and 10MB payload caps ensure malicious files are blocked instantly.</p>
          </Card>
          <Card>
            <FeatureIcon icon={Gauge} />
            <h3 className="text-xl font-bold text-primary mb-3">Non-Blocking I/O</h3>
            <p className="text-text-secondary leading-relaxed">FastAPI Threadpool architecture handles concurrent uploads without freezing the gateway.</p>
          </Card>
        </div>
      </div>
    </section>

    {/* 3. ABOUT & UPLOAD SECTION */}
    <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div id="upload-section">
          <UploadForm />
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Why NexHire AI?</h2>
          <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
            <p>
              We believe that HR professionals spend too much time manually reading resumes. NexHire AI uses Google Gemini and LangGraph to automate the initial screening process.
            </p>
            <p>
              Our microservices architecture (React + Node.js + FastAPI) is built for scale, providing a seamless, secure, and highly responsive experience for both recruiters and candidates.
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <div className="flex items-center gap-2 font-medium text-primary">
              <ShieldCheck className="text-success" size={20} /> Enterprise Security
            </div>
            <div className="flex items-center gap-2 font-medium text-primary">
              <Zap className="text-warning" size={20} /> Lightning Fast
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Protected Candidate Routes */}
        <Route path="/candidate" element={<ProtectedRoute />}>
          <Route element={<CandidateLayout />}>
            <Route index element={<CandidateDashboard />} />
            <Route path="resume-builder" element={<ResumeBuilder />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
