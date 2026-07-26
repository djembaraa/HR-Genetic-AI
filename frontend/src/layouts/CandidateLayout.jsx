import React from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, FileText, User, LogOut, Hexagon, ListChecks } from 'lucide-react';
import { Button } from '../components/Button';

export const CandidateLayout = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const navigate = useNavigate();
  const location = useLocation();
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userStr);
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  // Double check role
  if (user.role !== 'CANDIDATE') {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { name: 'Job Board', path: '/candidate', icon: Briefcase },
    { name: 'My Applications', path: '/candidate/applications', icon: ListChecks },
    { name: 'My Resume', path: '/candidate/resume-builder', icon: FileText },
    { name: 'Profile', path: '/candidate/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-secondary">
      {/* Top Navbar */}
      <header className="bg-background border-b border-border h-16 flex items-center px-6 justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/candidate" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Hexagon className="text-accent" fill="currentColor" size={28} />
            NexHire AI
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/candidate');
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-light text-accent'
                      : 'text-text-secondary hover:bg-background-secondary hover:text-primary'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-text-secondary hidden sm:inline-block">
            {user.email}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex gap-2 items-center">
            <LogOut size={16} /> Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
