import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { Navbar } from './components/Navbar';
import { UploadForm } from './components/UploadForm';
import { Card } from './components/Card';
import { Footer } from './components/Footer';

// Pages & Layouts
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

// The Landing Page Component
const LandingPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Navbar setView={() => {}} />
    
    {/* 1. HERO SECTION */}
    <section id="home" style={{ position: 'relative', overflow: 'hidden', marginTop: '60px' }}>
      <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
        <div className="text-section animate-fade-in">
          <h1>Recruit Top Talent<br/>with AI Power.</h1>
          <p className="subtitle">
            Wiratek AI Applicant Tracking System screens, summarizes, and finds ideal candidates instantly based on their CVs using Generative AI (RAG).
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <button className="btn-primary" onClick={() => document.getElementById('upload-section').scrollIntoView()}>Try AI Screening</button>
            <a href="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>Admin Login</a>
          </div>
        </div>
        
        <div className="image-section animate-fade-in" style={{ animationDelay: '0.2s', position: 'relative' }}>
          <Card style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <h2>AI Agent Ready</h2>
            <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>Upload a PDF CV and watch the AI extract context instantly into ChromaDB.</p>
          </Card>
        </div>
      </div>
    </section>

    {/* 2. FEATURES SECTION */}
    <section id="features" style={{ background: '#fafafa', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2>Enterprise-Grade Features</h2>
        <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto' }}>Designed for modern HR teams to streamline recruitment with high security and blazing fast AI performance.</p>
      </div>
      <div className="features-grid">
        <Card>
          <div className="feature-icon">⚡</div>
          <h3>Agentic RAG Tool</h3>
          <p style={{ color: 'var(--text-light)', marginTop: '0.8rem' }}>AI agents reason autonomously and retrieve exact facts from CVs, eliminating hallucinations.</p>
        </Card>
        <Card>
          <div className="feature-icon">🔒</div>
          <h3>Strict Security</h3>
          <p style={{ color: 'var(--text-light)', marginTop: '0.8rem' }}>MIME-type validation and 5MB payload caps ensure malicious files are blocked instantly.</p>
        </Card>
        <Card>
          <div className="feature-icon">🚀</div>
          <h3>Non-Blocking I/O</h3>
          <p style={{ color: 'var(--text-light)', marginTop: '0.8rem' }}>FastAPI Threadpool architecture handles hundreds of concurrent uploads without freezing.</p>
        </Card>
      </div>
    </section>

    {/* 3. ABOUT & UPLOAD SECTION */}
    <section id="about" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
      <div id="upload-section">
        <h2 style={{ marginBottom: '1.5rem' }}>Upload Candidate CV</h2>
        <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>Only PDF files are allowed (Max 5MB). The AI will process it automatically.</p>
        <UploadForm />
      </div>
      <div>
        <h2 style={{ marginBottom: '1.5rem' }}>Why Wiratek AI?</h2>
        <p style={{ color: 'var(--text-light)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          We believe that HR professionals spend too much time manually reading resumes. Wiratek AI uses Google Gemini and LangGraph to automate the initial screening process.
        </p>
        <p style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>
          Our microservices architecture (React + Node.js + FastAPI) is built for scale, providing a seamless and highly responsive experience.
        </p>
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
            <Route path="candidates" element={<div style={{padding: '2rem'}}><h2>Candidates Module</h2><p>Coming soon...</p></div>} />
            <Route path="jobs" element={<div style={{padding: '2rem'}}><h2>Jobs Module</h2><p>Coming soon...</p></div>} />
            <Route path="settings" element={<div style={{padding: '2rem'}}><h2>Settings Module</h2><p>Coming soon...</p></div>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
