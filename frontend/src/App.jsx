import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            Solusi HR dalam <br/><span className="text-brand">Satu Platform.</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
            Platform HRIS terintegrasi untuk Mengotomatiskan Tugas Anda Demi Mendorong Pertumbuhan Bisnis Anda.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-sm font-medium text-brand">
            <CheckCircle2 size={16} className="text-brand" />
            HRIS SaaS Tersedia Secepatnya
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
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">Menawarkan</h2>
        <h2 className="text-3xl md:text-4xl font-bold text-primary">Fitur <span className="text-brand">Terbaik</span> Kami</h2>
      </div>
      
      <div className="flex flex-col gap-6">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="spacious" className="flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">Fitur Manajemen Kehadiran</h3>
              <h3 className="text-xl font-bold text-brand mb-4">Geotagging & Geofencing</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Pastikan akurasi data kehadiran karyawan dengan teknologi pelacakan lokasi (geotagging). Anda juga dapat membatasi area presensi (geofencing) untuk meningkatkan kedisiplinan dan mempermudah pemantauan secara real-time.
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
              <h3 className="text-2xl font-bold mb-4">Fitur <span className="text-blue-200">Penggajian Otomatis</span></h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-8">
                Sederhanakan proses penggajian yang kompleks. Sistem kami menghitung gaji, tunjangan, PPh 21, dan BPJS secara otomatis, mengurangi risiko kesalahan hitung dan memastikan pembayaran tepat waktu.
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
            <h3 className="text-lg font-bold text-primary mb-1">Manajemen <span className="text-brand">Cuti</span></h3>
            <p className="text-gray-500 text-sm leading-relaxed mt-2 mb-6">
              Kelola semua jenis pengajuan cuti karyawan dalam satu platform yang terintegrasi. Proses pengajuan dan persetujuan menjadi lebih cepat dan transparan.
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
            <h3 className="text-lg font-bold text-primary mb-1">Database <span className="text-brand">Karyawan</span></h3>
            <p className="text-gray-500 text-sm leading-relaxed mt-2 mb-6">
              Akses dan kelola seluruh informasi penting karyawan secara terpusat dan aman. Mulai dari data pribadi hingga riwayat pekerjaan.
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
            <h3 className="text-lg font-bold text-primary mb-1">Manajemen <span className="text-brand">Performa</span></h3>
            <p className="text-gray-500 text-sm leading-relaxed mt-2 mb-12">
              Pantau, evaluasi, dan tingkatkan kinerja karyawan dengan sistem manajemen performa yang objektif dan terukur.
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
          <h2 className="text-3xl md:text-4xl font-bold text-brand mb-6">Tentang Kami</h2>
          <p className="text-gray-500 leading-relaxed mb-8 text-lg">
            NexHire adalah software HRIS yang dirancang untuk memudahkan manajemen sumber daya manusia dalam perusahaan Anda. Dari absensi hingga penggajian, semua bisa dikelola dengan mudah dalam satu aplikasi.
          </p>
          <Button size="lg" className="px-8 bg-brand hover:bg-brand-hover text-white rounded-full">Hubungi Sales</Button>
        </div>
      </div>
    </section>

    {/* 4. CONTACT SECTION */}
    <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-20">
      <div className="bg-brand rounded-[2.5rem] p-8 md:p-12 lg:p-16 text-white grid grid-cols-1 md:grid-cols-2 gap-12 relative overflow-hidden">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Yuk Tanya Tanya</h2>
          <p className="text-blue-100 mb-12 max-w-sm text-sm">
            Optimalkan pengelolaan operasi HR Anda dengan bantuan solusi dari NexHire.
          </p>
          <div className="w-48 h-32 bg-blue-500/20 rounded-xl border border-blue-400/30 overflow-hidden relative">
             <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" alt="Contact Us" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
             <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-lg p-1 shadow-sm"><div className="w-full h-full bg-brand/20 rounded"></div></div>
             <div className="absolute bottom-4 -right-6 w-16 h-16 bg-white rounded-lg p-1 shadow-sm"><div className="w-full h-full bg-brand/20 rounded"></div></div>
          </div>
        </div>
        
        <div>
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <input type="text" placeholder="Nama Depan" className="w-full bg-transparent border-b border-blue-300/50 py-2 text-white placeholder:text-blue-200 focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <input type="text" placeholder="Nama Belakang" className="w-full bg-transparent border-b border-blue-300/50 py-2 text-white placeholder:text-blue-200 focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-blue-300/50 py-2 text-white placeholder:text-blue-200 focus:outline-none focus:border-white transition-colors" />
              </div>
              <div>
                <input type="tel" placeholder="Nomor HP" className="w-full bg-transparent border-b border-blue-300/50 py-2 text-white placeholder:text-blue-200 focus:outline-none focus:border-white transition-colors" />
              </div>
            </div>
            <div>
              <input type="text" placeholder="Pesan" className="w-full bg-transparent border-b border-blue-300/50 py-2 text-white placeholder:text-blue-200 focus:outline-none focus:border-white transition-colors" />
            </div>
            <div className="pt-4">
              <Button type="button" className="bg-white text-brand hover:bg-gray-50 rounded-full px-8 py-2.5 font-semibold">Kirim Pesan</Button>
            </div>
          </form>
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
