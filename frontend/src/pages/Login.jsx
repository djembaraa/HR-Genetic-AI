import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
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
    <div className="min-h-screen bg-white flex font-montserrat">
      <Helmet>
        <title>Login | NexHire</title>
        <meta name="description" content="Log in to your NexHire account." />
      </Helmet>
      
      {/* LEFT COLUMN - FORM */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 lg:px-24 xl:px-32 relative">
        <div className="mb-8">
           <Link to="/" className="inline-flex items-center gap-2">
             <img src="/logo.jpg" alt="NexHire" className="h-8 rounded" />
             <span className="font-bold text-xl tracking-tight text-gray-900">NexHire</span>
           </Link>
        </div>
        
        <div className="w-full mx-auto flex-1 flex flex-col justify-center max-w-sm xl:max-w-md">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
          >
             <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-2">Log in to your account</h1>
             <p className="text-gray-500 mb-8">Please enter your details</p>
             
             <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email"
                  icon={Mail}
                  type="email"
                  required
                  placeholder="Enter your email"
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
                
                <div className="flex items-center justify-between text-sm py-2">
                   <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300 text-brand focus:ring-brand w-4 h-4 cursor-pointer" />
                      Remember for 30 days
                   </label>
                   <a href="#" className="text-brand font-semibold hover:underline">Forgot password</a>
                </div>

                {error && <div className="text-error text-sm font-medium p-3 bg-error-light rounded-lg">{error}</div>}
                
                <Button type="submit" className="w-full bg-brand hover:bg-brand-hover text-white rounded-lg py-2.5 font-semibold text-base mt-2" disabled={loading}>
                   {loading ? 'Authenticating...' : 'Log in'}
                </Button>
                
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">OR</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>
                
                <Button type="button" variant="outline" className="w-full rounded-lg py-2.5 flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="text-gray-700 font-medium text-base">Log in with SmartCard</span>
                </Button>
             </form>
             
             <p className="text-center text-sm text-gray-500 mt-8">
               Don't have an account? <Link to="/signup" className="text-brand font-semibold hover:underline">Sign up</Link>
             </p>
          </motion.div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400">
          By logging in, you agree to our <a href="#" className="underline hover:text-gray-600">Terms of Use</a>
        </div>
      </div>
      
      {/* RIGHT COLUMN - VISUAL */}
      <div className="hidden lg:flex w-1/2 bg-brand p-12 relative overflow-hidden items-center justify-center rounded-l-[3rem] my-4 mr-4 shadow-2xl">
         
         <div className="relative z-10 w-full max-w-lg text-white">
            <h2 className="text-5xl font-bold mb-4 leading-tight">Empowering healthier<br/>communities</h2>
            <p className="text-blue-100 text-lg mb-12">Streamline your HR and operational workflows in one secure platform.</p>
            
            {/* The floating tablet mockup */}
            <div className="w-full h-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col relative rotate-[-4deg] transform hover:rotate-[-2deg] transition-transform duration-500 border-4 border-gray-800">
                  {/* Fake UI Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-gray-50">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-brand flex items-center justify-center">
                           <span className="text-white text-[10px] font-bold">N</span>
                        </div>
                        <div className="w-20 h-2.5 bg-gray-300 rounded-full"></div>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-24 h-6 bg-white border border-gray-200 rounded-full flex items-center px-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                          <div className="w-10 h-1.5 bg-gray-200 rounded-full"></div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                     </div>
                  </div>
                  {/* Fake UI Content */}
                  <div className="flex flex-1 overflow-hidden bg-white">
                     {/* Sidebar */}
                     <div className="w-1/4 flex flex-col gap-4 border-r border-gray-100 p-3">
                        <div className="text-[8px] font-bold text-gray-400 mb-1">GENERAL</div>
                        <div className="w-full h-6 bg-brand/10 rounded flex items-center px-2 gap-2">
                          <div className="w-3 h-3 bg-brand/50 rounded-sm"></div>
                          <div className="w-10 h-1.5 bg-brand/50 rounded-full"></div>
                        </div>
                        <div className="w-full flex items-center px-2 gap-2">
                          <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="w-full flex items-center px-2 gap-2">
                          <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                          <div className="w-14 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>
                        <div className="w-full flex items-center px-2 gap-2 mb-2">
                          <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
                          <div className="w-10 h-1.5 bg-gray-300 rounded-full"></div>
                        </div>

                        <div className="text-[8px] font-bold text-gray-400 mb-1">MODULES</div>
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-full flex items-center px-2 gap-2">
                            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                          </div>
                        ))}
                     </div>
                     {/* Main area */}
                     <div className="w-3/4 flex flex-col p-4 gap-4 bg-gray-50/50">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <div className="h-4 w-24 bg-gray-800 rounded mb-1"></div>
                            <div className="h-2 w-32 bg-gray-400 rounded"></div>
                          </div>
                          <div className="bg-white p-2 rounded shadow-sm border border-gray-100 flex flex-col items-end">
                            <div className="h-2 w-16 bg-gray-300 rounded mb-1"></div>
                            <div className="h-6 w-10 bg-brand rounded"></div>
                          </div>
                        </div>
                        
                        <div className="text-[10px] font-bold text-gray-600">Patient Records</div>
                        <div className="w-full flex-1 bg-white rounded-lg border border-gray-100 flex flex-col divide-y divide-gray-50">
                           {[1,2,3,4,5,6].map((i) => (
                             <div key={i} className="flex justify-between items-center p-3">
                                <div className="flex items-center gap-3">
                                   <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-bold text-brand">CW</div>
                                   <div className="w-16 h-2.5 bg-gray-600 rounded-full"></div>
                                </div>
                                <div className="flex gap-4">
                                  <div className="w-4 h-2 bg-gray-300 rounded-full"></div>
                                  <div className="w-6 h-2 bg-gray-300 rounded-full"></div>
                                  <div className="w-10 h-2 bg-gray-300 rounded-full"></div>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  {/* Faded bottom */}
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
            </div>
         </div>
         
         {/* Decorative circles */}
         <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full border-[40px] border-white/5 pointer-events-none"></div>
         <div className="absolute top-12 -left-12 w-48 h-48 rounded-full bg-white/10 backdrop-blur-3xl blur-2xl pointer-events-none"></div>
      </div>
    </div>
  );
};

