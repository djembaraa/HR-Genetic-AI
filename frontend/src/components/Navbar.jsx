import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">HR Genetic AI</Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#features" className="text-text-secondary hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-text-secondary hover:text-primary transition-colors">How It Works</a>
            <Link to="/login" className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent-hover transition-colors font-medium">
              Login / Dashboard
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-secondary hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-primary hover:bg-background-secondary rounded-md">Features</a>
            <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-text-secondary hover:text-primary hover:bg-background-secondary rounded-md">How It Works</a>
            <Link to="/login" className="block px-3 py-2 text-base font-medium text-accent hover:bg-accent-light rounded-md">
              Login / Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
