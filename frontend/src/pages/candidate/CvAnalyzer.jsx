import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, AlertCircle, Wand2, X, Sparkles } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import toast from 'react-hot-toast';

export const CvAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        toast.error('Please upload a PDF file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast.error('Please upload a PDF file.');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetchApi('/api/ai/analyze-cv', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
        toast.success('CV analyzed successfully!');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to analyze CV.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async () => {
    if (!file) return;

    setExtracting(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetchApi('/api/candidate/extract-cv', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        toast.success('Profile auto-filled successfully! Redirecting...');
        setTimeout(() => window.location.href = '/candidate/resume-builder', 1500);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to extract CV data.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server.');
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
          <Wand2 className="text-accent" /> ATS CV Analyzer
        </h1>
        <p className="text-text-secondary">
          Upload your existing CV (PDF) and let our AI evaluate it against modern tech industry and ATS standards.
          If you don't have a CV yet, you can use our <a href="/candidate/resume-builder" className="text-accent hover:underline">Resume Builder</a> instead.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="h-fit">
          <h2 className="text-xl font-bold text-primary mb-4">Upload CV</h2>
          <div 
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
              isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-primary/30 hover:bg-background-secondary'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              id="cv-upload" 
              onChange={handleFileChange}
            />
            
            {file ? (
              <div className="flex flex-col items-center">
                <FileText size={48} className="text-accent mb-4" />
                <p className="font-medium text-primary mb-1">{file.name}</p>
                <p className="text-sm text-text-muted mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" onClick={() => { setFile(null); setResult(null); }}>
                    Remove
                  </Button>
                  <Button onClick={handleAnalyze} disabled={loading} className="flex items-center gap-2">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Wand2 size={16} /> Analyze Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center w-full">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <UploadCloud size={32} className="text-accent" />
                </div>
                <p className="font-medium text-primary mb-1">Click to upload or drag and drop</p>
                <p className="text-sm text-text-muted">PDF files only (max 5MB)</p>
              </label>
            )}
          </div>
          
          {loading && (
            <div className="mt-8 flex flex-col items-center text-center p-6 border border-accent/20 rounded-xl bg-accent/5 animate-in fade-in">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
                <Wand2 className="absolute inset-0 m-auto text-accent" size={24} />
              </div>
              <h3 className="font-bold text-primary">AI is Scanning Your CV</h3>
              <p className="text-sm text-text-secondary mt-1">Checking for ATS readability, keywords, and industry standards...</p>
            </div>
          )}
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="bg-gradient-to-br from-background to-background-tertiary border-accent/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary">ATS Score</h2>
                <div className={`text-4xl font-black ${result.score >= 80 ? 'text-success' : result.score >= 60 ? 'text-warning' : 'text-error'}`}>
                  {result.score}<span className="text-xl text-text-muted font-medium">/100</span>
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed">{result.summary}</p>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-success mb-4 flex items-center gap-2">
                <CheckCircle size={20} /> Strengths
              </h3>
              <ul className="space-y-3">
                {result.strengths?.map((str, i) => (
                  <li key={i} className="flex gap-3 text-sm text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0"></span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-error mb-4 flex items-center gap-2">
                <AlertTriangle size={20} /> Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {result.weaknesses?.map((wk, i) => (
                  <li key={i} className="flex gap-3 text-sm text-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 flex-shrink-0"></span>
                    <span>{wk}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="bg-accent/5 border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-primary flex items-center gap-2"><Sparkles className="text-accent" size={20} /> Auto-Fill Profile</h3>
                <p className="text-sm text-text-secondary">Save time! Let AI extract all your experiences, skills, and education to fill your Resume Builder profile automatically.</p>
              </div>
              <Button onClick={handleExtract} disabled={extracting} className="shrink-0 w-full sm:w-auto bg-accent hover:bg-accent-hover text-white">
                {extracting ? 'Extracting...' : 'Auto-Fill My Profile'}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
