import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import { Navbar } from './components/Navbar';
import { Card } from './components/Card';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { Bot, Zap, ShieldCheck, Gauge, ArrowRight, User, FileText, CheckCircle2, Building, MapPin, CalendarDays, Users, BarChart3, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import { ErrorBoundary } from './components/ErrorBoundary';

// Pages & Layouts
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { ProtectedRoute } from './components/ProtectedRoute';

// Admin Pages
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { Jobs } from './pages/admin/Jobs';
import { Candidates } from './pages/admin/Candidates';
import { Settings } from './pages/admin/Settings';
import { HrOnboarding } from './pages/admin/HrOnboarding';
import { CompanyProfile } from './pages/admin/CompanyProfile';

// Candidate Pages
import { CandidateLayout } from './layouts/CandidateLayout';
import { CandidateDashboard } from './pages/candidate/CandidateDashboard';
import { ResumeBuilder } from './pages/candidate/ResumeBuilder';
import { Profile } from './pages/candidate/Profile';
import { MyApplications } from './pages/candidate/MyApplications';
import { Onboarding } from './pages/candidate/Onboarding';
import { CvAnalyzer } from './pages/candidate/CvAnalyzer';
import { CompanyDetail } from './pages/candidate/CompanyDetail';

const LandingPage = () => (
  <div className="flex flex-col min-h-screen bg-white">
    <Navbar />
    
    {/* 1. HERO SECTION */}
    <section id="home" className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#09090B] leading-[1.15] tracking-tight mb-6">
            HR Solutions in <br/><span className="text-brand">One Platform.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
            Integrated HRIS platform to automate your tasks and drive business growth.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-sm font-medium text-brand">
            <CheckCircle2 size={16} className="text-brand" />
            HRIS SaaS Ready to Use
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Main Image Placeholder */}
          <div className="w-full aspect-[4/3] bg-gray-200 rounded-[2rem] overflow-hidden relative border-8 border-white shadow-xl flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Team working" className="w-full h-full object-cover" />
          </div>
          
          {/* Floating Cards */}
          <div className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-float flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white">
              <Zap size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">Super Reliable</p>
              <p className="text-xs text-gray-500">24/7 Always Active</p>
            </div>
          </div>

          <div className="absolute top-12 -right-6 w-14 h-14 bg-brand rounded-full flex items-center justify-center text-white shadow-float border-4 border-white">
             <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center"><div className="w-full h-[2px] bg-white"></div></div>
          </div>

          <div className="absolute -bottom-6 right-6 bg-white p-4 rounded-2xl shadow-float text-center min-w-[120px]">
            <div className="w-10 h-10 rounded-xl bg-brand/10 mx-auto flex items-center justify-center mb-2">
              <Gauge size={20} className="text-brand" />
            </div>
            <p className="font-bold text-xl text-primary">+490%</p>
            <p className="text-xs text-gray-500">Engagement</p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* 2. FEATURES SECTION */}
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Offering Our</h2>
        <h2 className="text-3xl md:text-4xl font-bold text-primary"><span className="text-brand">Best</span> Features</h2>
      </div>
      
      <div className="flex flex-col gap-6">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="spacious" className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">Attendance Management</h3>
              <h3 className="text-xl font-bold text-brand mb-4">Geotagging & Geofencing</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Ensure employee attendance data accuracy with location tracking (geotagging) technology. You can also restrict attendance areas (geofencing) to improve discipline and facilitate real-time monitoring.
              </p>
            </div>
            <div className="w-full h-48 bg-gray-50 rounded-t-3xl border-t border-x border-gray-200 mt-auto flex justify-center pt-6 overflow-hidden relative">
              <div className="w-48 h-full bg-white rounded-t-2xl shadow-lg border border-gray-100 p-3 flex flex-col gap-3 relative">
                 <div className="w-full h-24 bg-blue-50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* Simulated map background lines */}
                    <div className="absolute inset-0 opacity-10 grid grid-cols-4 grid-rows-4 gap-1 p-1">
                      {Array.from({length: 16}).map((_, i) => <div key={i} className="border border-blue-500 rounded-sm"></div>)}
                    </div>
                    <div className="relative flex flex-col items-center">
                       <MapPin className="text-brand fill-brand/20 w-8 h-8 drop-shadow-md" />
                       <div className="w-4 h-1 bg-brand/30 rounded-full mt-1 blur-[1px]"></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-gray-200 rounded-full"></div>
                    <div className="h-2 w-1/2 bg-gray-100 rounded-full"></div>
                 </div>
                 <div className="absolute bottom-4 right-3 bg-brand/10 text-brand text-[10px] font-bold px-2 py-1 rounded-full">In Area</div>
              </div>
            </div>
          </Card>
          
          <Card padding="spacious" className="bg-brand border-brand flex flex-col justify-between text-white">
            <div>
              <h3 className="text-2xl font-bold mb-4"><span className="text-blue-200">Automated Payroll</span> Feature</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Simplify complex payroll processes. Our system calculates salaries, allowances, and taxes automatically, reducing the risk of miscalculation and ensuring timely payments.
              </p>
            </div>
            <div className="w-full h-48 flex justify-end items-end relative overflow-hidden">
               <div className="w-48 h-44 bg-white rounded-t-2xl shadow-2xl p-4 relative translate-x-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2 mb-1">
                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center"><Banknote size={14} className="text-brand" /></div>
                     <div>
                        <div className="h-2 w-16 bg-gray-200 rounded-full mb-1"></div>
                        <div className="h-2 w-10 bg-gray-100 rounded-full"></div>
                     </div>
                  </div>
                  <div className="w-full h-10 bg-blue-50 rounded-lg flex items-center px-3 border border-blue-100">
                     <div className="h-3 w-1/2 bg-brand/40 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                     <div className="h-2 w-12 bg-gray-200 rounded-full"></div>
                     <div className="h-2 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center px-1">
                     <div className="h-2 w-14 bg-gray-200 rounded-full"></div>
                     <div className="h-2 w-12 bg-gray-200 rounded-full"></div>
                  </div>
               </div>
            </div>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:-translate-y-1 transition-transform relative overflow-hidden flex flex-col">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand mb-4">
              <CalendarDays size={24} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-1">Leave <span className="text-brand">Management</span></h3>
            <p className="text-gray-500 text-sm leading-relaxed mt-2 mb-6">
              Manage all types of employee leave requests in one integrated platform. Faster and more transparent application and approval processes.
            </p>
            <div className="mt-auto flex gap-2">
               <div className="w-full h-8 bg-gray-50 rounded-lg flex items-center px-2 gap-2 border border-gray-100">
                  <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle2 size={10} className="text-green-500" /></div>
                  <div className="h-2 w-1/2 bg-gray-200 rounded-full"></div>
               </div>
            </div>
          </Card>
          <Card className="hover:-translate-y-1 transition-transform relative overflow-hidden flex flex-col">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-1">Employee <span className="text-brand">Database</span></h3>
            <p className="text-gray-500 text-sm leading-relaxed mt-2 mb-6">
              Access and manage all essential employee information centrally and securely, from personal data to employment history.
            </p>
            <div className="mt-auto flex flex-col gap-2">
               {[1,2].map(i => (
                 <div key={i} className="w-full bg-gray-50 rounded-lg p-2 flex items-center gap-2 border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    <div>
                       <div className="h-1.5 w-16 bg-gray-300 rounded-full mb-1"></div>
                       <div className="h-1.5 w-10 bg-gray-200 rounded-full"></div>
                    </div>
                 </div>
               ))}
            </div>
          </Card>
          <Card className="hover:-translate-y-1 transition-transform relative overflow-hidden flex flex-col">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-brand mb-4">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-lg font-bold text-primary mb-1">Performance <span className="text-brand">Management</span></h3>
            <p className="text-gray-500 text-sm leading-relaxed mt-2 mb-12">
              Monitor, evaluate, and improve employee performance with an objective and measurable performance management system.
            </p>
            <div className="absolute bottom-4 right-6 flex items-end gap-2">
               <div className="w-4 h-6 bg-gray-100 rounded-t-sm"></div>
               <div className="w-4 h-10 bg-gray-200 rounded-t-sm"></div>
               <div className="w-4 h-16 bg-blue-200 rounded-t-sm"></div>
               <div className="w-4 h-24 bg-brand rounded-t-sm relative">
                 <div className="absolute -top-3 -right-2 w-6 h-4 bg-green-100 rounded text-[8px] font-bold text-green-600 flex items-center justify-center">98%</div>
               </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    {/* 3. ABOUT US SECTION */}
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="w-full aspect-square md:aspect-[4/5] bg-gray-200 rounded-[2rem] overflow-hidden flex items-center justify-center relative">
             <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" alt="HR Professional" className="w-full h-full object-cover" />
          </div>
          
          <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-float">
             <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-1">
                   <User size={16} />
                </div>
                <p className="font-bold text-sm">5/5 Growth</p>
                <div className="flex text-yellow-400 text-xs">★★★★★</div>
             </div>
          </div>

          <div className="absolute -bottom-4 right-8 bg-white p-4 rounded-xl shadow-float flex items-center gap-4">
             <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center text-gray-500">
                &lt;/&gt;
             </div>
             <div>
                <p className="font-bold text-sm">Customer</p>
                <p className="font-bold text-sm">Service</p>
                <p className="text-xs text-gray-500">24 Hours</p>
             </div>
          </div>
          
          <div className="absolute -top-6 -right-6 w-12 h-12 bg-brand rounded-full flex items-center justify-center text-white shadow-md">
             {/* Crown icon placeholder */}
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
          </div>
        </div>

        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-brand mb-6">About Us</h2>
          <p className="text-gray-500 leading-relaxed mb-8 text-lg">
            NexHire is an HRIS software designed to facilitate human resource management in your company. From attendance to payroll, everything can be easily managed in one application.
          </p>
          <Link to="/contact">
             <Button size="lg" className="px-8 bg-brand hover:bg-brand-hover text-white rounded-full">Contact Sales</Button>
          </Link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN', 'HR_MANAGER', 'RECRUITER']} />}>
              <Route path="onboarding" element={<HrOnboarding />} />
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="candidates" element={<Candidates />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="company" element={<CompanyProfile />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Protected Candidate Routes */}
            <Route path="/candidate" element={<ProtectedRoute allowedRoles={['CANDIDATE']} />}>
              <Route path="onboarding" element={<Onboarding />} />
              <Route element={<CandidateLayout />}>
                <Route index element={<CandidateDashboard />} />
                <Route path="company/:slug" element={<CompanyDetail />} />
                <Route path="applications" element={<MyApplications />} />
                <Route path="resume-builder" element={<ResumeBuilder />} />
                <Route path="cv-analyzer" element={<CvAnalyzer />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
