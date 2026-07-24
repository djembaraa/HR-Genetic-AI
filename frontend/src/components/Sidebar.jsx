import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Settings, LogOut, FileText } from 'lucide-react';
import { cn } from './Card'; // or any util file where cn is exported

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItemClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
      isActive 
        ? 'bg-accent/10 text-accent font-semibold border-l-4 border-accent' 
        : 'text-text-secondary hover:bg-background-secondary hover:text-primary'
    }`;

  return (
    <div className="w-[260px] h-screen bg-white border-r border-border fixed flex flex-col p-6 z-40">
      <div className="text-2xl font-bold text-primary mb-8 px-2">
        HR Genetic AI
      </div>

      <div className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-4 px-2">
        Main Menu
      </div>

      <nav className="flex flex-col gap-2 flex-grow">
        <NavLink to="/admin" end className={navItemClass}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/admin/candidates" className={navItemClass}>
          <Users size={20} /> Candidates
        </NavLink>
        <NavLink to="/admin/jobs" className={navItemClass}>
          <Briefcase size={20} /> Jobs
        </NavLink>
        <NavLink to="/admin/settings" className={navItemClass}>
          <Settings size={20} /> Settings
        </NavLink>
      </nav>

      <div className="pt-4 border-t border-border mt-auto">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error-light font-medium transition-colors"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};
