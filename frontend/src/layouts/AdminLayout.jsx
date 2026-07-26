import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#fafafa] min-h-screen relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex-grow flex flex-col min-w-0 transition-all duration-300 w-full md:ml-[260px]">
        <header className="h-[70px] bg-white border-b border-border flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-md text-text-secondary hover:bg-background-secondary flex-shrink-0"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-medium hidden sm:block">Admin User</span>
            <div className="w-[35px] h-[35px] rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
              A
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8 flex-grow overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
