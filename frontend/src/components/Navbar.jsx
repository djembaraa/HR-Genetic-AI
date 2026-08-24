import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { Menu, X, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed w-full z-50 font-montserrat transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.jpg" alt="NexHire Logo" className="h-8 rounded" />
          </Link>
          
            <div className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-sm font-medium text-text-secondary hover:text-brand transition-colors">About Us</Link>
              <a href="/#features" className="text-sm font-medium text-text-secondary hover:text-brand transition-colors">Features</a>
              <Link to="/contact" className="text-sm font-medium text-text-secondary hover:text-brand transition-colors">Contact Us</Link>
              <div className="flex items-center gap-3 ml-4">
                <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-brand transition-colors">Log In</Link>
                <Link to="/signup"><Button variant="outline" className="border-brand text-brand hover:bg-brand hover:text-white">Sign Up</Button></Link>
                <Link to="/contact"><Button>Contact Sales</Button></Link>
              </div>
            </div>
          
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-border mt-3 shadow-lg"
          >
            <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
              <a href="/#features" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-primary hover:bg-background-secondary rounded-lg">Features</a>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-primary hover:bg-background-secondary rounded-lg">About Us</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-primary hover:bg-background-secondary rounded-lg">Contact Us</Link>
              <div className="border-t border-border my-2 pt-4 flex flex-col gap-3">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="secondary" className="w-full">Log In</Button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
