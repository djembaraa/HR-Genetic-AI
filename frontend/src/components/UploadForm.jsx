import React, { useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import { Upload } from 'lucide-react';

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
    <Card className="mt-8">
      <form onSubmit={handleUpload} aria-label="Upload CV Form">
        <h3 className="text-xl font-bold text-primary mb-6">Upload Candidate CV (Demo)</h3>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
            required 
            aria-label="Full Name"
            value={candidateName} 
            onChange={e => setCandidateName(e.target.value)} 
          />
          <input 
            type="email" 
            placeholder="Email" 
            className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
            required 
            aria-label="Email Address"
            value={candidateEmail} 
            onChange={e => setCandidateEmail(e.target.value)} 
          />
        </div>
        
        <label className="block mb-6 cursor-pointer border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-background-secondary transition-colors" aria-label="File Upload Dropzone">
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            onChange={e => setFile(e.target.files[0])} 
            aria-label="Select PDF File"
          />
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-accent mb-2" />
            <p className="text-primary font-semibold">
              {file ? file.name : 'Click to Upload PDF CV'}
            </p>
            <p className="text-sm text-text-secondary">PDF files only (max 10MB)</p>
          </div>
        </label>

        <Button type="submit" className="w-full" loading={isLoading} aria-label="Submit CV">
          Submit & Process CV
        </Button>
        {uploadStatus && (
          <p className="mt-4 text-accent font-medium text-center" role="alert">
            {uploadStatus}
          </p>
        )}
      </form>
    </Card>
  );
};
