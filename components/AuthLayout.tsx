
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
      <div className="w-full md:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20">
        <div className="max-w-md w-full mx-auto">
          <header className="mb-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#4f46e5] rounded-xl shadow-lg shadow-primary/20">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tighter uppercase text-text-main">Studio</span>
            </div>
          </header>

          <div className="mb-16">
            <h1 className="editorial-title text-7xl md:text-8xl text-text-main mb-6 leading-[0.9]">{title}</h1>
            <p className="text-xl text-text-muted font-medium italic opacity-60 leading-relaxed">{subtitle}</p>
          </div>

          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </div>

      {/* Visual Side - Matching the soft green aesthetic from screenshot */}
      <div className="hidden md:block w-[55%] p-6">
        <div className="relative w-full h-full rounded-[4rem] overflow-hidden shadow-2xl bg-[#a3b1a2]">
          <img 
            src={image} 
            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80" 
            alt="Auth visual" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-16 left-12 right-12">
             <div className="glass p-12 rounded-[3rem] border border-white/40 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-text-main/60">L'expérience Studio</span>
                </div>
                <p className="text-3xl text-text-main font-bold leading-tight tracking-tight italic">
                  "Le design n'est pas ce que l'on voit, c'est ce que l'on ressent."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
