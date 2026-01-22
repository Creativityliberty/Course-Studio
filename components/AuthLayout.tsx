
import React from 'react';
import { Leaf, Sparkles } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, image }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface animate-in fade-in duration-700">
      {/* Form Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-32 py-20">
        <div className="max-w-md w-full mx-auto lg:mx-0">
          <header className="mb-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tighter uppercase text-text-main">Studio</span>
            </div>
          </header>

          <div className="mb-12">
            <h1 className="editorial-title text-6xl md:text-8xl text-text-main mb-4 leading-none">{title}</h1>
            <p className="text-lg text-text-muted font-medium italic opacity-60">{subtitle}</p>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden md:block w-1/2 p-6">
        <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-luxury">
          <img src={image} className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[2000ms]" alt="Auth visual" />
          <div className="absolute inset-0 bg-gradient-to-t from-text-main/60 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-16 left-16 right-16">
             <div className="glass p-10 rounded-[2.5rem] border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">L'expérience Studio</span>
                </div>
                <p className="text-2xl text-white font-medium leading-tight">"Le design n'est pas ce que l'on voit, c'est ce que l'on ressent."</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
