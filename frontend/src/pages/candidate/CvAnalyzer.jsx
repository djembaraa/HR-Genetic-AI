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
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
            <Wand2 className="text-accent" /> ATS CV Analyzer
          </h1>
          <p className="text-text-secondary">
            Upload your existing CV (PDF) and let our AI evaluate it against modern tech industry and ATS standards.
          </p>
        </div>
        
        {/* Compact Upload button when result exists */}
        {result && (
           <label htmlFor="cv-upload-compact" className="cursor-pointer">
             <Button variant="outline" className="pointer-events-none flex items-center gap-2">
                <UploadCloud size={16} /> Upload Different CV
             </Button>
             <input type="file" accept=".pdf" className="hidden" id="cv-upload-compact" onChange={handleFileChange} />
           </label>
        )}
      </div>

      {!result && (
        <div className="max-w-2xl mx-auto mt-12">
          <Card className="h-fit">
            <h2 className="text-xl font-bold text-primary mb-4 text-center">Upload Your CV for Analysis</h2>
            <div 
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center transition-all ${
                isDragging ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-border hover:border-primary/40 hover:bg-background-secondary'
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
                <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                     <FileText size={40} className="text-accent" />
                  </div>
                  <p className="font-bold text-lg text-primary mb-1">{file.name}</p>
                  <p className="text-sm text-text-muted mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <div className="flex gap-4 w-full justify-center">
                    <Button variant="ghost" onClick={(e) => { e.preventDefault(); setFile(null); setResult(null); }}>
                      Cancel
                    </Button>
                    <Button onClick={(e) => { e.preventDefault(); handleAnalyze(); }} disabled={loading} className="flex items-center gap-2 bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20 px-8">
                      {loading ? (
                        <>
                          <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Wand2 size={18} /> Analyze Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <label htmlFor="cv-upload" className="cursor-pointer flex flex-col items-center w-full">
                  <div className="w-20 h-20 rounded-full bg-background-tertiary shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <UploadCloud size={36} className="text-accent" />
                  </div>
                  <p className="font-bold text-lg text-primary mb-2">Click to upload or drag & drop</p>
                  <p className="text-sm text-text-muted bg-background-tertiary px-4 py-1.5 rounded-full">PDF files only (max 5MB)</p>
                </label>
              )}
            </div>
            
            {loading && (
              <div className="mt-8 flex flex-col items-center text-center p-8 border border-accent/20 rounded-2xl bg-gradient-to-b from-accent/5 to-transparent animate-in fade-in">
                <div className="relative w-20 h-20 mb-6">
                  <div className="absolute inset-0 border-4 border-accent/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
                  <Wand2 className="absolute inset-0 m-auto text-accent animate-pulse" size={28} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">AI is Analyzing Your CV</h3>
                <p className="text-text-secondary max-w-sm">Scanning for ATS readability, keywords, grammar, and tech industry standards...</p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Results Section - Beautiful Grid Layout */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-8">
          
          {/* Top Info Banner */}
          <div className="bg-background-secondary border border-border rounded-xl px-6 py-4 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <FileText className="text-accent" size={20} />
                <span className="font-medium text-primary">{file?.name || "Analyzed CV"}</span>
             </div>
             <span className="text-sm text-text-muted">Analysis complete</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: ATS Score & Action */}
            <div className="space-y-6 lg:col-span-1">
              <Card className="bg-gradient-to-br from-background to-background-tertiary border-accent/20 flex flex-col items-center justify-center text-center p-10 h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full -z-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-tr-full -z-10"></div>
                
                <h2 className="text-lg font-bold text-text-secondary uppercase tracking-wider mb-6">ATS Match Score</h2>
                
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                   <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-background-secondary" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${result.score * 2.827} 282.7`} className={`${result.score >= 80 ? 'text-success' : result.score >= 60 ? 'text-warning' : 'text-error'} transition-all duration-1000 ease-out`} />
                   </svg>
                   <div className="flex flex-col items-center justify-center">
                      <span className={`text-6xl font-black ${result.score >= 80 ? 'text-success' : result.score >= 60 ? 'text-warning' : 'text-error'}`}>
                        {result.score}
                      </span>
                      <span className="text-text-muted font-medium mt-1">out of 100</span>
                   </div>
                </div>

                <div className="w-full space-y-4">
                  <Button onClick={handleExtract} disabled={extracting} className="w-full bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20 flex items-center justify-center gap-2 h-12 text-base">
                    <Sparkles size={20} /> {extracting ? 'Extracting Data...' : 'Auto-Fill My Profile'}
                  </Button>
                  <p className="text-xs text-text-muted">Let AI automatically fill your Resume Builder with data from this CV.</p>
                </div>
              </Card>
            </div>

            {/* Right Column: Summary, Strengths, Weaknesses */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8">
                <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-3 border-b border-border pb-4">
                  <FileText size={22} className="text-accent" /> Executive Summary
                </h3>
                <p className="text-text-secondary leading-relaxed text-lg">{result.summary}</p>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-success/20 bg-success/5 p-8">
                  <h3 className="text-lg font-bold text-success mb-6 flex items-center gap-2">
                    <CheckCircle size={22} /> Key Strengths
                  </h3>
                  <ul className="space-y-4">
                    {result.strengths?.length > 0 ? result.strengths.map((str, i) => (
                      <li key={i} className="flex gap-4 text-primary leading-relaxed">
                        <span className="w-2.5 h-2.5 rounded-full bg-success mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                        <span>{str}</span>
                      </li>
                    )) : (
                      <p className="text-text-muted italic">No distinct strengths identified.</p>
                    )}
                  </ul>
                </Card>

                <Card className="border-error/20 bg-error/5 p-8">
                  <h3 className="text-lg font-bold text-error mb-6 flex items-center gap-2">
                    <AlertTriangle size={22} /> Areas for Improvement
                  </h3>
                  <ul className="space-y-4">
                    {result.weaknesses?.length > 0 ? result.weaknesses.map((wk, i) => (
                      <li key={i} className="flex gap-4 text-primary leading-relaxed">
                        <span className="w-2.5 h-2.5 rounded-full bg-error mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                        <span>{wk}</span>
                      </li>
                    )) : (
                      <p className="text-text-muted italic">No areas for improvement identified!</p>
                    )}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
