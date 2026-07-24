import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">HR Genetic AI</h3>
            <p className="text-text-secondary leading-relaxed text-sm">
              Revolutionizing the hiring process with generative AI. We help HR professionals screen, analyze, and find top talent faster and smarter.
            </p>
          </div>
          <div>
            <h4 className="text-primary font-semibold mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><a href="#home" className="text-text-secondary hover:text-primary transition-colors">Home</a></li>
              <li><a href="#features" className="text-text-secondary hover:text-primary transition-colors">Features</a></li>
              <li><a href="#about" className="text-text-secondary hover:text-primary transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-primary font-semibold mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-text-secondary">
              <p>Email: hello@hrgenetic.ai</p>
              <p>Phone: +62 812 3456 7890</p>
              <p>Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
        
        <div className="text-center pt-8 border-t border-border text-text-tertiary text-sm">
          &copy; {new Date().getFullYear()} HR Genetic AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
