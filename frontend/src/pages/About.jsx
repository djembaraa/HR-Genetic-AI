import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { Users, Target, Shield, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const About = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-montserrat">
      <Helmet>
        <title>Tentang Kami | NexHire</title>
        <meta name="description" content="Pelajari lebih lanjut tentang misi NexHire." />
      </Helmet>
      
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Merevolusi Cara Anda <br className="hidden md:block" />
              <span className="text-brand">Mengelola SDM.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              NexHire hadir untuk menyederhanakan kompleksitas HR, mulai dari rekrutmen hingga penggajian, sehingga Anda bisa fokus pada pertumbuhan bisnis dan kebahagiaan karyawan.
            </p>
          </motion.div>
        </section>

        {/* Mission Image / Banner */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-24">
          <div className="w-full h-[400px] bg-gray-100 rounded-3xl overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80" 
              alt="NexHire Team" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand/20 mix-blend-multiply"></div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nilai-Nilai Kami</h2>
            <p className="text-gray-500">Prinsip yang membimbing kami dalam membangun platform terbaik untuk Anda.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'People First', desc: 'Kami percaya karyawan adalah aset terbesar setiap perusahaan.' },
              { icon: Target, title: 'Inovasi Berkelanjutan', desc: 'Selalu mengembangkan fitur baru untuk menjawab tantangan masa depan.' },
              { icon: Shield, title: 'Keamanan Data', desc: 'Privasi dan keamanan data Anda adalah prioritas utama kami.' },
              { icon: Zap, title: 'Kerja Cerdas', desc: 'Otomatisasi tugas rutin agar Anda bisa bekerja lebih strategis.' },
            ].map((value, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-blue-50 text-brand rounded-xl flex items-center justify-center mb-4">
                  <value.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
