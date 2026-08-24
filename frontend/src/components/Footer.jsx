import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#09090B] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand text-white rounded-md p-1 w-8 h-8 flex items-center justify-center font-bold text-lg">P</div>
              <span className="font-bold text-xl tracking-tight">PeopleC</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Solusi HR dalam satu platform
            </p>
            <div className="flex gap-4">
              {/* Placeholders for social icons */}
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary"><span className="text-xs">IG</span></div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary"><span className="text-xs">Web</span></div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary"><span className="text-xs">Tel</span></div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary"><span className="text-xs">Mail</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Products</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Powerful Reports</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blockchain</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Auto-Backup</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Science</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Auto-Scaling Up</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Support 24/7</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How-to Instructions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog & Tips</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy and Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms and Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Investor Relations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Join With Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Statistics</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center pt-8 text-gray-400 text-xs">
          All Rights Reserved - Copyright Reserve by People C {new Date().getFullYear()} in Balikpapan
        </div>
      </div>
    </footer>
  );
};
