import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Mail, Lock, User, UserPlus, ArrowLeft, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { fetchApi } from '../lib/api';
import toast from 'react-hot-toast';

export const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isEmployer, setIsEmployer] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isEmployer ? '/api/auth/signup/employer' : '/api/auth/signup';
      const body = { name, email, password };
      if (isEmployer) body.companyName = companyName;
      else body.role = 'CANDIDATE';

      const res = await fetchApi(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success('Account created! Please log in.');
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
    <div className="min-h-screen bg-white flex font-montserrat">
      <Helmet>
        <title>Create Account | NexHire</title>
        <meta name="description" content="Join NexHire to accelerate your career or manage HR." />
      </Helmet>
      
      {/* LEFT COLUMN - FORM */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 sm:p-12 lg:px-24 xl:px-32 relative overflow-y-auto">
        <div className="mb-8">
           <Link to="/" className="inline-flex items-center gap-2">
             <img src="/logo.jpg" alt="NexHire" className="h-8 rounded" />
             <span className="font-bold text-xl tracking-tight text-gray-900">NexHire</span>
           </Link>
        </div>
        
        <div className="w-full mx-auto flex-1 flex flex-col justify-center max-w-sm xl:max-w-md pb-8">
          <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
          >
             <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
             <p className="text-gray-500 mb-8">Join NexHire to manage HR efficiently</p>
             
             <div className="flex p-1 mb-6 bg-gray-100 rounded-xl border border-gray-200">
               <button
                 type="button"
                 onClick={() => setIsEmployer(false)}
                 className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isEmployer ? 'bg-brand text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
               >
                 Candidate
               </button>
               <button
                 type="button"
                 onClick={() => setIsEmployer(true)}
                 className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isEmployer ? 'bg-brand text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
               >
                 Employer / HR
               </button>
             </div>

             <form onSubmit={handleSignUp} className="space-y-4">
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
                  label="Email"
                  icon={Mail}
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <AnimatePresence>
                  {isEmployer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4">
                        <Input
                          label="Company Name"
                          icon={Building}
                          type="text"
                          required={isEmployer}
                          placeholder="Tech Corp Inc."
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
                
                <Button type="submit" className="w-full bg-brand hover:bg-brand-hover text-white rounded-lg py-2.5 font-semibold text-base mt-2" disabled={loading}>
                   {loading ? 'Creating Account...' : 'Sign up'}
                </Button>
                
             </form>
             
             <p className="text-center text-sm text-gray-500 mt-8">
               Already have an account? <Link to="/login" className="text-brand font-semibold hover:underline">Log in</Link>
             </p>
          </motion.div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-400">
          By creating an account, you agree to our <a href="#" className="underline hover:text-gray-600">Terms of Use</a>
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
