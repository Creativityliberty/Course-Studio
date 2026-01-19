
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

  const navLinks = [
    { name: 'Formations', path: '/formations', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Studio Builder', path: '/builder', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Aide AI', path: '/assistant', icon: <MessageCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 glass shadow-premium' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              MINDFULNESS STUDIO
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-2 text-sm font-bold transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link to="/connexion" className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-dark transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
              Commencer
            </Link>
          </nav>

          <button className="md:hidden p-2 text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-slate-200 mt-3 p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 p-3 text-slate-700 font-bold hover:bg-primary/5 rounded-xl">
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link to="/connexion" className="bg-primary text-white p-4 rounded-2xl text-center font-bold">
              Se connecter
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow pt-24 pb-12">
        {children}
      </main>

      <footer className="border-t border-slate-200 py-12 glass">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm font-medium">© 2025 Mindfulness Studio — Conçu pour l'élégance et la sérénité.</p>
        </div>
      </footer>
    </div>
  );
};
