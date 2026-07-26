import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'CANDIDATE' })
      });

      const data = await res.json();
      
      if (res.ok) {
        alert('Account created! Please log in.');
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
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
        <title>Create Account | NexHire AI</title>
        <meta name="description" content="Join NexHire AI to accelerate your career or find the best candidates." />
      </Helmet>
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-border/40 rounded-full blur-3xl -z-10 translate-x-[20%] translate-y-[-20%]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-border/40 rounded-full blur-3xl -z-10 translate-x-[-20%] translate-y-[20%]"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <Card padding="spacious" glass className="shadow-float">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary tracking-tight">Create Account</h1>
            <p className="text-text-secondary mt-2">Join NexHire AI to accelerate your career</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <Input
              label="Full Name"
              icon={User}
              type="text"
              required
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
              {loading ? 'Creating Account...' : (
                <span className="flex items-center gap-2 justify-center">
                  Sign Up <UserPlus size={18} />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Log in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
