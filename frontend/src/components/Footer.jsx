import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8 font-montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="NexHire" className="h-8 rounded" />
              <span className="font-bold text-xl tracking-tight text-gray-900">NexHire</span>
            </Link>
            <p className="text-gray-500 mb-6 max-w-sm">
              Integrated HR solutions to automate your tasks and drive business growth.
            </p>
            <div className="flex items-center gap-4 text-gray-400">
              <a href="#" className="hover:text-brand transition-colors"><Mail size={20} /></a>
              <a href="#" className="hover:text-brand transition-colors"><MapPin size={20} /></a>
              <a href="#" className="hover:text-brand transition-colors"><Phone size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-500 hover:text-brand transition-colors">About Us</Link></li>
              <li><a href="/#features" className="text-gray-500 hover:text-brand transition-colors">Features</a></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-brand transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-brand transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-brand transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} NexHire. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Made with ❤️ for HR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
