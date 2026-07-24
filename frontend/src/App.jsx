import { useState } from 'react';
import './index.css';
import { Navbar } from './components/Navbar';
import { UploadForm } from './components/UploadForm';
import { ChatBox } from './components/ChatBox';
import { Card } from './components/Card';

function App() {
  const [view, setView] = useState('home'); // home, dashboard

  return (
    <>
      <Navbar setView={setView} />

      {view === 'home' && (
        <main className="main-content animate-fade-in" role="main">
          <div className="text-section">
            <h1>Recruit Top Talent with <span>AI Power</span>.</h1>
            <p className="subtitle">
              A modern ATS platform that automatically screens, summarizes, and finds ideal candidates based on their CVs using Generative AI (RAG).
            </p>
            
            <UploadForm />
          </div>
          
          <div className="image-section" style={{ position: 'relative' }}>
            <div style={{
              background: 'var(--primary-color)',
              width: '400px', height: '400px', borderRadius: '50%',
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', opacity: 0.1, filter: 'blur(40px)'
            }}></div>
            <Card style={{ position: 'relative', zIndex: 1, height: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{color: 'var(--primary-color)'}}>AI CV Screening Ready</h2>
                <p style={{textAlign: 'center', marginTop: '1rem', color: 'var(--text-light)'}}>The system will read the PDF and extract context into ChromaDB.</p>
            </Card>
          </div>
        </main>
      )}

      {view === 'dashboard' && (
        <main className="animate-fade-in" style={{ padding: '2rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} role="main">
          
          <Card>
            <h2 style={{ marginBottom: '1.5rem' }}>Candidate Management</h2>
            <p className="subtitle">Candidate data entering Express.js will appear here (Mock view).</p>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
              <h4>Mock Candidate Data</h4>
              <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>After a CV is uploaded on the home page, the AI agent can read its context.</p>
            </div>
          </Card>

          <Card style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>AI HR Assistant</h2>
            <ChatBox />
          </Card>

        </main>
      )}
    </>
  );
}

export default App;
