import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Users, Target, Shield, Zap, TrendingUp, Globe, Award, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const About = () => {
  const stats = [
    { label: 'Companies globally', value: '10,000+' },
    { label: 'Employees managed', value: '2.5M+' },
    { label: 'System uptime', value: '99.99%' },
    { label: 'Support satisfaction', value: '98%' }
  ];

  const team = [
    { name: 'Sarah Jenkins', role: 'Chief Executive Officer', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
    { name: 'David Chen', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Elena Rodriguez', role: 'Head of Product', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
    { name: 'Michael Chang', role: 'VP of Customer Success', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-montserrat">
      <Helmet>
        <title>About Us | NexHire</title>
        <meta name="description" content="Learn about NexHire's mission to revolutionize HR management globally." />
      </Helmet>
      
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-semibold mb-6">
                <Globe size={16} /> Empowering Global Workforces
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8 tracking-tight">
                Building the future of <br className="hidden md:block" />
                <span className="text-brand">human resources.</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
                NexHire was founded on a simple premise: people are a company's greatest asset. We build intuitive tools that eliminate administrative burden so you can focus on what matters most—your team.
              </p>
            </motion.div>
          </div>
        </section>

        {/* HERO IMAGE & STATS */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-24">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mb-16">
            <div className="absolute inset-0 bg-brand/20 mix-blend-multiply z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80" 
              alt="NexHire modern office" 
              className="w-full h-[500px] object-cover"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100 border-y border-gray-100 py-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* OUR STORY */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    Back in 2018, our founders experienced firsthand the chaos of scaling a business with fragmented HR systems. Spreadsheets for payroll, endless email threads for leave approvals, and disjointed employee records were slowing down growth and frustrating the team.
                  </p>
                  <p>
                    They realized that existing enterprise HR software was overly complex and prohibitively expensive, while lightweight tools lacked the robustness required by growing companies. 
                  </p>
                  <p className="font-semibold text-gray-900">
                    That's why NexHire was born. We set out to create a unified, beautifully designed platform that HR professionals actually enjoy using, making enterprise-grade automation accessible to everyone.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-8">
                  <img src="https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=600&q=80" alt="Team meeting" className="w-full h-48 object-cover rounded-2xl shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" alt="Collaboration" className="w-full h-64 object-cover rounded-2xl shadow-sm" />
                </div>
                <div className="space-y-4">
                  <img src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=600&q=80" alt="Office culture" className="w-full h-64 object-cover rounded-2xl shadow-sm" />
                  <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80" alt="Whiteboard session" className="w-full h-48 object-cover rounded-2xl shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUR VALUES */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-500">We don't just build software; we build a culture. These principles guide every line of code we write and every customer interaction.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Users, title: 'Human-Centric Design', desc: 'Software should adapt to people, not the other way around. We prioritize intuitive interfaces and frictionless workflows.' },
              { icon: Shield, title: 'Uncompromising Security', desc: 'HR data is highly sensitive. We employ bank-level encryption and rigorous compliance standards to keep your data safe.' },
              { icon: TrendingUp, title: 'Empowerment Over Control', desc: 'We build tools that empower managers to lead and employees to grow, shifting HR from policing to developing talent.' },
              { icon: Award, title: 'Continuous Excellence', desc: 'We are never done improving. We actively listen to customer feedback to ship updates that actually solve real problems.' },
            ].map((value, idx) => (
              <Card key={idx} padding="spacious" hoverable className="group">
                <div className="w-14 h-14 bg-blue-50 text-brand rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <value.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed text-lg">{value.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* LEADERSHIP TEAM */}
        <section className="py-24 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Leadership</h2>
                <p className="text-gray-400 text-lg">A team of industry veterans dedicated to reshaping the landscape of human capital management.</p>
              </div>
              <Link to="/contact">
                <Button variant="ghost" className="text-brand hover:text-white border border-brand hover:bg-brand transition-colors">
                  Join our team <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity z-10"></div>
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-0"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-brand text-sm font-medium">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="bg-brand rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to transform your HR?</h2>
              <p className="text-xl text-blue-100 mb-10">
                Join over 10,000 forward-thinking companies that have chosen NexHire as their trusted HR partner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-brand hover:bg-gray-50 px-8 py-4">
                    Start for free
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
