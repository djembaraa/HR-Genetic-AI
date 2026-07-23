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
    { role: 'bot', text: 'Halo! Saya AI HR Assistant Anda. Ada yang bisa saya bantu terkait kandidat hari ini?' }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Pilih file CV dulu ya!');
    
    setUploadStatus('Mengunggah & Memproses AI...');
    
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
        setUploadStatus(`Sukses! CV ${data.candidate.name} telah diproses AI.`);
        setFile(null);
        setCandidateName('');
        setCandidateEmail('');
      } else {
        setUploadStatus('Gagal upload: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      setUploadStatus('Terjadi kesalahan jaringan.');
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
      setMessages(prev => [...prev, { role: 'bot', text: 'Maaf, sistem sedang offline.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      <nav className="navbar animate-fade-in">
        <h2 style={{ fontWeight: 700, color: 'var(--text-dark)' }}>HR-Genetic-AI</h2>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => {e.preventDefault(); setView('home')}}>Beranda</a></li>
          <li><a href="#" onClick={(e) => {e.preventDefault(); setView('dashboard')}}>HR Dashboard</a></li>
        </ul>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary">Log In</button>
          <button className="btn-primary" onClick={() => setView('dashboard')}>Akses HR</button>
        </div>
      </nav>

      {view === 'home' && (
        <main className="main-content animate-fade-in">
          <div className="text-section">
            <h1>Rekrut Talenta Terbaik dengan <span>Kekuatan AI</span>.</h1>
            <p className="subtitle">
              Platform ATS modern yang secara otomatis menyeleksi, merangkum, dan mencarikan kandidat ideal berdasarkan CV menggunakan Generative AI (RAG).
            </p>
            
            <form onSubmit={handleUpload} className="glass-container" style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Upload CV Kandidat (Uji Coba)</h3>
              
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="Nama Lengkap" className="input-modern" required value={candidateName} onChange={e => setCandidateName(e.target.value)} />
                <input type="email" placeholder="Email" className="input-modern" required value={candidateEmail} onChange={e => setCandidateEmail(e.target.value)} />
              </div>
              
              <label className="upload-box" style={{ display: 'block', marginBottom: '1rem' }}>
                <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
                  {file ? file.name : '+ Klik untuk Upload PDF CV'}
                </p>
              </label>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Kirim & Proses CV</button>
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
                <p style={{textAlign: 'center', marginTop: '1rem', color: 'var(--text-light)'}}>Sistem akan membaca PDF dan mengekstrak konteks ke dalam ChromaDB.</p>
            </div>
          </div>
        </main>
      )}

      {view === 'dashboard' && (
        <main className="animate-fade-in" style={{ padding: '2rem 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div className="glass-container">
            <h2 style={{ marginBottom: '1.5rem' }}>Manajemen Kandidat</h2>
            <p className="subtitle">Data kandidat yang masuk ke Express.js akan tampil di sini (Mock view).</p>
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', boxShadow: 'var(--shadow)' }}>
              <h4>Mock Candidate Data</h4>
              <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Setelah CV diupload di halaman depan, agent AI sudah bisa membaca konteksnya.</p>
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
              {isChatLoading && <div className="message bot">Berpikir...</div>}
            </div>
            <form onSubmit={handleChat} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <input 
                type="text" 
                className="input-modern" 
                placeholder="Tanya: 'Siapa yang jago React?'" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                disabled={isChatLoading}
              />
              <button type="submit" className="btn-primary" disabled={isChatLoading}>Kirim</button>
            </form>
          </div>

        </main>
      )}
    </>
  );
}

export default App;
