
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, Sparkles, BookOpen, User, MessageCircle } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile lors d'un changement de route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Bibliothèque', path: '/formations', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Studio Builder', path: '/builder', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Assistant AI', path: '/assistant', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 glass shadow-premium' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-slate-900">
              MINDFULNESS STUDIO
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === link.path ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link to="/builder" className="bg-primary text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all">
              Nouveau Projet
            </Link>
          </nav>

          <button className="md:hidden p-2 text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-slate-200 mt-3 p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300 shadow-2xl">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-slate-600">
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link to="/builder" className="bg-primary text-white p-5 rounded-2xl text-center font-black uppercase tracking-widest text-[10px]">
              Démarrer le Builder
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="border-t border-slate-100 py-20 glass mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-200 rounded-md"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Mindfulness Studio 2025</span>
          </div>
          <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Couture Design System • Powered by AI Intelligence</p>
        </div>
      </footer>
    </div>
  );
};
