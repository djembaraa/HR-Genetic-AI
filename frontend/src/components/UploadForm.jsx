import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';

export const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a CV file first!');
    
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card style={{ marginTop: '2rem' }}>
      <form onSubmit={handleUpload} aria-label="Upload CV Form">
        <h3 style={{ marginBottom: '1.5rem' }}>Upload Candidate CV (Demo)</h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            placeholder="Full Name" 
            className="input-modern" 
            required 
            aria-label="Full Name"
            value={candidateName} 
            onChange={e => setCandidateName(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="input-modern" 
            required 
            aria-label="Email Address"
            value={candidateEmail} 
            onChange={e => setCandidateEmail(e.target.value)} 
          />
        </div>
        
        <label className="upload-box" style={{ display: 'block', marginBottom: '1rem' }} aria-label="File Upload Dropzone">
          <input 
            type="file" 
            accept=".pdf" 
            style={{ display: 'none' }} 
            onChange={e => setFile(e.target.files[0])} 
            aria-label="Select PDF File"
          />
          <p style={{ color: 'var(--primary-color)', fontWeight: 600 }}>
            {file ? file.name : '+ Click to Upload PDF CV'}
          </p>
        </label>

        <Button type="submit" style={{ width: '100%' }} disabled={isLoading} aria-label="Submit CV">
          {isLoading ? 'Processing...' : 'Submit & Process CV'}
        </Button>
        {uploadStatus && <p style={{ marginTop: '1rem', color: 'var(--primary-color)', textAlign: 'center' }} role="alert">{uploadStatus}</p>}
      </form>
    </Card>
  );
};
