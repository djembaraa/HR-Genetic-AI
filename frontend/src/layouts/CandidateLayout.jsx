import React from 'react';
import { Outlet, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, FileText, User, LogOut, Hexagon, ListChecks, Bell, Wand2, Menu, X } from 'lucide-react';
import { Button } from '../components/Button';
import { fetchApi } from '../lib/api';
import { AnimatePresence, motion } from 'framer-motion';

export const CandidateLayout = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const notifRef = React.useRef(null);
  
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await fetchApi('/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [token]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleRead = async (id, link) => {
    try {
      await fetchApi(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotifications();
      setShowNotifications(false);
      if (link) navigate(link);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { name: 'Job Board', path: '/candidate', icon: Briefcase },
    { name: 'My Applications', path: '/candidate/applications', icon: ListChecks },
    { name: 'My Resume', path: '/candidate/resume-builder', icon: FileText },
    { name: 'CV Analyzer', path: '/candidate/cv-analyzer', icon: Wand2 },
    { name: 'Profile', path: '/candidate/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background-secondary">
      {/* Top Navbar */}
      <header className="bg-background border-b border-border h-16 flex items-center px-6 justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/candidate" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="NexHire Logo" className="h-8 rounded" />
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
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-text-secondary hover:text-primary transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-background"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-float overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-border flex justify-between items-center bg-background-secondary">
                    <h3 className="font-bold text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-medium">{unreadCount} New</span>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-text-muted">No notifications yet.</div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => handleRead(n.id, n.link)}
                          className={`p-4 border-b border-border/50 cursor-pointer hover:bg-background-secondary transition-colors ${!n.isRead ? 'bg-primary/5' : ''}`}
                        >
                          <div className="flex gap-3">
                            <div className="mt-1">
                              {!n.isRead ? <div className="w-2 h-2 rounded-full bg-accent"></div> : <div className="w-2 h-2"></div>}
                            </div>
                            <div>
                              <p className={`text-sm ${!n.isRead ? 'font-bold text-primary' : 'font-medium text-text-secondary'}`}>{n.title}</p>
                              <p className="text-xs text-text-muted mt-1 leading-relaxed">{n.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-sm font-medium text-text-secondary hidden md:inline-block border-l border-border pl-4">
            {user.email}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout} className="hidden md:flex gap-2 items-center">
            <LogOut size={16} /> Logout
          </Button>
          
          <button 
             className="md:hidden p-2 text-text-secondary hover:bg-background-secondary rounded-lg transition-colors"
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
           >
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border z-40 overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/candidate');
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-secondary hover:bg-background-secondary hover:text-primary'
                    }`}
                  >
                    <Icon size={20} />
                    {item.name}
                  </Link>
                );
              })}
              <div className="border-t border-border mt-2 pt-4 flex flex-col gap-3">
                <div className="px-4 py-2 text-sm font-medium text-text-secondary">
                  {user.email}
                </div>
                <Button variant="outline" onClick={handleLogout} className="flex gap-2 items-center justify-center w-full">
                  <LogOut size={18} /> Logout
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
