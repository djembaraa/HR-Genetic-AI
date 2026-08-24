import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

export const Contact = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending message
    setTimeout(() => {
      setLoading(false);
      toast.success('Your message has been sent! We will contact you shortly.');
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
      <Helmet>
        <title>Contact Us | NexHire</title>
        <meta name="description" content="Contact the NexHire team for help or to discuss your needs." />
      </Helmet>
      
      <Navbar />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact <span className="text-brand">Us</span></h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Our team is ready to help! Please send your questions or demo requests via the form below.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <Card padding="spacious" className="shadow-sm border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-brand rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-500">hello@nexhire.com</p>
                      <p className="text-gray-500">support@nexhire.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-brand rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                      <p className="text-gray-500">+62 811 1234 5678</p>
                      <p className="text-gray-500 text-sm mt-1">Monday - Friday (09:00 - 17:00)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-brand rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Headquarters</h4>
                      <p className="text-gray-500 leading-relaxed">
                        NexHire Tower, Floor 15<br />
                        Jl. Jend. Sudirman No. 123<br />
                        Jakarta Selatan, Indonesia 12190
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <Card padding="spacious" className="shadow-lg border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="First Name"
                    type="text"
                    required
                    placeholder="John"
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    required
                    placeholder="Doe"
                  />
                </div>
                
                <Input
                  label="Email"
                  icon={Mail}
                  type="email"
                  required
                  placeholder="john@company.com"
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message / Inquiry</label>
                  <textarea
                    rows={4}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors resize-none"
                    placeholder="Tell us about your company's HR needs..."
                  ></textarea>
                </div>

                <Button type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? 'Sending...' : (
                    <span className="flex items-center gap-2 justify-center">
                      Send Message <Send size={18} />
                    </span>
                  )}
                </Button>
              </form>
            </Card>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
