import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Navbar } from './components/Navbar';
import { UploadForm } from './components/UploadForm';
import { Card } from './components/Card';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { Bot, Zap, ShieldCheck, Gauge } from 'lucide-react';

// Pages & Layouts
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

const FeatureIcon = ({ icon: Icon }) => (
  <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mb-4">
    <Icon size={24} className="text-accent" strokeWidth={1.5} />
  </div>
);

// The Landing Page Component
const LandingPage = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    
    {/* 1. HERO SECTION */}
    <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight tracking-tight mb-6">
            Recruit Top Talent<br/>with AI Power.
          </h1>
          <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            HR Genetic AI Applicant Tracking System screens, summarizes, and finds ideal candidates instantly based on their CVs using Generative AI (RAG).
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" onClick={() => document.getElementById('upload-section').scrollIntoView()}>
              Try AI Screening
            </Button>
            <Button size="lg" variant="secondary" onClick={() => window.location.href='/login'}>
              Admin Login
            </Button>
          </div>
        </div>
        
        <div className="flex-1 w-full max-w-lg">
          <Card padding="spacious" className="text-center relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent-light rounded-full -z-10 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-info-light rounded-full -z-10 blur-2xl"></div>
            
            <div className="mx-auto w-20 h-20 bg-background-secondary rounded-full flex items-center justify-center mb-6 border border-border">
              <Bot size={40} className="text-primary" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-3">AI Agent Ready</h2>
            <p className="text-text-secondary leading-relaxed">
              Upload a PDF CV and watch the AI extract context instantly into ChromaDB.
            </p>
          </Card>
        </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Why HR Genetic AI?</h2>
          <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
            <p>
              We believe that HR professionals spend too much time manually reading resumes. HR Genetic AI uses Google Gemini and LangGraph to automate the initial screening process.
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
            <Route path="candidates" element={<div className="p-8"><h2 className="text-2xl font-bold mb-4">Candidates Module</h2><p className="text-text-secondary">Coming soon...</p></div>} />
            <Route path="jobs" element={<div className="p-8"><h2 className="text-2xl font-bold mb-4">Jobs Module</h2><p className="text-text-secondary">Coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-8"><h2 className="text-2xl font-bold mb-4">Settings Module</h2><p className="text-text-secondary">Coming soon...</p></div>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
