'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function CVBuilder() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  if (isLoading) return <div className="p-20 text-center text-text-primary">Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center py-20 px-[5%] text-center min-h-[70vh]">
        <h2 className="text-3xl font-bold mb-4">Sign in to use the CV Generator</h2>
        <p className="text-text-secondary mb-8">You must be logged in to access this premium tool.</p>
        <button onClick={() => router.push('/login')} className="px-6 py-3 rounded-xl font-bold text-white bg-accent-primary">Log In</button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a valid PDF file.');
        setFile(null);
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selectedFile);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('cv_file', file);
      formData.append('user_id', user.id);

      const res = await fetch('/api/generate-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setResult(data.generated_content);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      <section className="w-full pt-12 pb-6 px-[5%] bg-background border-b border-white/10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Build Your AI CV</h1>
        <p className="text-text-secondary max-w-2xl mx-auto">Upload your existing PDF resume, and let our AI optimize it for ATS systems and top recruiters.</p>
      </section>

      <section className="section-light w-full py-12 px-[5%] flex-grow">
        <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
          
          {/* Upload Area */}
          {!result && (
            <div className="card-light p-8 md:p-12 text-center border-dashed border-2 border-accent-primary/40 bg-accent-primary/[0.02]">
              {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">{error}</div>}
              
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-accent-primary/10 flex items-center justify-center text-4xl mb-6">
                  📄
                </div>
                <h3 className="text-2xl font-bold text-text-dark mb-4">Upload your current Resume (PDF)</h3>
                
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="cv-upload"
                />
                
                <label 
                  htmlFor="cv-upload"
                  className="px-8 py-4 rounded-xl font-bold text-accent-primary bg-white border-2 border-accent-primary hover:bg-accent-primary hover:text-white transition-all cursor-pointer mb-6"
                >
                  {file ? file.name : 'Select PDF File'}
                </label>
                
                {file && (
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="px-10 py-4 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-accent-primary to-accent-secondary hover:-translate-y-1 shadow-[0_4px_15px_rgba(109,40,217,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isGenerating ? '✨ AI is parsing and optimizing...' : '✨ Generate Premium CV'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Result Area */}
          {result && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-dark">Your New CV</h2>
                <button 
                  onClick={() => navigator.clipboard.writeText(result)}
                  className="px-4 py-2 bg-text-dark text-white rounded-lg text-sm font-bold hover:bg-text-dark-secondary transition-colors"
                >
                  Copy Markdown
                </button>
              </div>
              <div className="card-light p-8 md:p-12 bg-white prose prose-lg prose-indigo max-w-none shadow-xl border border-border-light">
                {result.split('\n').map((line, i) => {
                  // Basic rendering since we don't have react-markdown installed in this context yet
                  // but we can just use whitespace-pre-wrap
                  return <p key={i} className="mb-2 whitespace-pre-wrap text-text-dark font-medium leading-relaxed">{line}</p>
                })}
              </div>
              <div className="text-center mt-4">
                <button 
                  onClick={() => { setResult(''); setFile(null); }}
                  className="text-accent-primary font-bold hover:underline"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
