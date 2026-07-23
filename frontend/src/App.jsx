import { useState } from 'react';
import './index.css';

function App() {
  const [view, setView] = useState('home'); // home, dashboard
  const [file, setFile] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hello! I am your AI HR Assistant. How can I help you with candidates today?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a CV file first!');
    
    setUploadStatus('Uploading & Processing with AI...');
    
    const formData = new FormData();
    formData.append('cv', file);
    formData.append('name', candidateName);
    formData.append('email', candidateEmail);
    formData.append('applied_job_id', '1');

    try {
      const res = await fetch('http://localhost:3000/api/candidates/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus(`Success! CV for ${data.candidate.name} has been processed by AI.`);
        setFile(null);
        setCandidateName('');
        setCandidateEmail('');
      } else {
        setUploadStatus('Upload failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus('Network error occurred.');
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userQuery = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userQuery }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/hr/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, the system is currently offline.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar animate-fade-in">
        <h2 style={{ fontWeight: 700, color: 'var(--text-dark)' }}>HR-Genetic-AI</h2>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => {e.preventDefault(); setView('home')}}>Home</a></li>
          <li><a href="#" onClick={(e) => {e.preventDefault(); setView('dashboard')}}>HR Dashboard</a></li>
        </ul>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary">Log In</button>
          <button className="btn-primary" onClick={() => setView('dashboard')}>HR Access</button>
        </div>
      </nav>

      {view === 'home' && (
        <main className="main-content animate-fade-in">
          <div className="text-section">
            <h1>Recruit Top Talent with <span>AI Power</span>.</h1>
            <p className="subtitle">
              A modern ATS platform that automatically screens, summarizes, and finds ideal candidates based on their CVs using Generative AI (RAG).
            </p>
            
            <form onSubmit={handleUpload} className="glass-container" style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Upload Candidate CV (Demo)</h3>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="Full Name" className="input-modern" required value={candidateName} onChange={e => setCandidateName(e.target.value)} />
                <input type="email" placeholder="Email" className="input-modern" required value={candidateEmail} onChange={e => setCandidateEmail(e.target.value)} />
              </div>
              
              <label className="upload-box" style={{ display: 'block', marginBottom: '1rem' }}>
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                  {file ? file.name : '+ Click to Upload PDF CV'}
                </p>
              </label>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit & Process CV</button>
              {uploadStatus && <p style={{ marginTop: '1rem', color: 'var(--primary-color)', textAlign: 'center' }}>{uploadStatus}</p>}
            </form>
          </div>
          
          <div className="image-section" style={{ position: 'relative' }}>
            <div style={{
              background: 'var(--primary-color)',
              width: '400px', height: '400px', borderRadius: '50%',
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)', opacity: 0.1, filter: 'blur(40px)'
            }}></div>
            <div className="glass-container" style={{ position: 'relative', zIndex: 1, height: '450px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{color: 'var(--primary-color)'}}>AI CV Screening Ready</h2>
                <p style={{textAlign: 'center', marginTop: '1rem', color: 'var(--text-light)'}}>The system will read the PDF and extract context into ChromaDB.</p>
            </div>
          </div>
        </main>
      )}

      {view === 'dashboard' && (
        <main className="animate-fade-in" style={{ padding: '2rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div className="glass-container">
            <h2 style={{ marginBottom: '1.5rem' }}>Candidate Management</h2>
            <p className="subtitle">Candidate data entering Express.js will appear here (Mock view).</p>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
              <h4>Mock Candidate Data</h4>
              <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>After a CV is uploaded on the home page, the AI agent can read its context.</p>
            </div>
          </div>

          <div className="glass-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>AI HR Assistant</h2>
            <div className="chat-box" style={{ flexGrow: 1 }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  {msg.text}
                </div>
              ))}
              {isChatLoading && <div className="message bot">Thinking...</div>}
            </div>
            <form onSubmit={handleChat} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <input 
                type="text" 
                className="input-modern" 
                placeholder="Ask: 'Who is good at React?'" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                disabled={isChatLoading}
              />
              <button type="submit" className="btn-primary" disabled={isChatLoading}>Send</button>
            </form>
          </div>

        </main>
      )}
    </>
  );
}

export default App;
