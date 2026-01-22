
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Sparkles, BookOpen, User, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Bibliothèque', path: '/formations', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Studio Builder', path: '/builder', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Assistant AI', path: '/assistant', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-surface">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-4 glass border-b border-slate-100' : 'py-8 bg-transparent'}`}>
        <div className="max-w-[1600px] mx-auto px-8 md:px-12 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 bg-[#4f46e5] rounded-xl shadow-lg shadow-primary/20 transition-transform group-hover:rotate-6">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div className="w-20 h-6 bg-gradient-to-r from-slate-900 to-slate-700 rounded-sm"></div> {/* Logo Placeholder like in screenshot */}
          </Link>

          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all ${location.pathname === link.path ? 'text-primary' : 'text-slate-400 hover:text-slate-900'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center gap-6 pl-8 border-l border-slate-200">
                 <div className="text-right">
                   <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-900 leading-none mb-1">{user?.name || "Utilisateur Studio"}</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Compte Premium</p>
                 </div>
                 <button onClick={logout} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all text-slate-400">
                    <LogOut className="w-4 h-4" />
                 </button>
              </div>
            ) : (
              <Link to="/login" className="bg-slate-900 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 shadow-xl transition-all">
                Se connecter
              </Link>
            )}
          </nav>

          <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main className="flex-grow pt-24">
        {children}
      </main>
    </div>
  );
};
