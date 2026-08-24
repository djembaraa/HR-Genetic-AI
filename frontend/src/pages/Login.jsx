import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { fetchApi } from '../lib/api';


export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetchApi('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'ADMIN' || data.user.role === 'HR_MANAGER' || data.user.role === 'RECRUITER') {
          navigate('/admin');
        } else {
          navigate('/candidate');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-secondary flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Login | NexHire</title>
        <meta name="description" content="Log in to your NexHire account to manage your jobs or candidate profile." />
      </Helmet>
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-border/40 rounded-full blur-3xl -z-10 translate-x-[-20%] translate-y-[-20%]"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-border/40 rounded-full blur-3xl -z-10 translate-x-[20%] translate-y-[20%]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-brand mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <Card padding="spacious" glass className="shadow-float">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary tracking-tight">Welcome Back</h1>
            <p className="text-text-secondary mt-2">Log in to your NexHire account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label="Email Address"
              icon={Mail}
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <Input
              label="Password"
              icon={Lock}
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="text-error text-sm font-medium p-3 bg-error-light rounded-lg">{error}</div>}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Authenticating...' : (
                <span className="flex items-center gap-2 justify-center">
                  Sign In <LogIn size={18} />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
