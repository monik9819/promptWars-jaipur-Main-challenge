import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, PenLine, BookHeart, MessageSquareHeart, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home className="w-4 h-4 mr-2" /> },
    { name: 'Check-In', path: '/checkin', icon: <PenLine className="w-4 h-4 mr-2" /> },
    { name: 'Journal', path: '/journal', icon: <BookHeart className="w-4 h-4 mr-2" /> },
    { name: 'AI Chat', path: '/chat', icon: <MessageSquareHeart className="w-4 h-4 mr-2" /> },
  ];

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600 tracking-tight">MindEase</Link>
            </div>
            <div className="hidden sm:-my-px sm:ml-8 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
              <button
                onClick={logout}
                className="p-2 ml-2 text-slate-400 hover:text-rose-500 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" aria-hidden="true" /> : <Menu className="block h-6 w-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-2 text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700'
                    : 'border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-rose-500"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
