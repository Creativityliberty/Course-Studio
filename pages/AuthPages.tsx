
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, "Utilisateur Studio");
      navigate('/builder');
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Connectez-vous." 
      subtitle="Reprenez le fil de vos créations inspirantes."
      image="https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&q=80&w=1200"
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-[0.25em] text-text-muted/80 block ml-1">Adresse e-mail</label>
          <div className="relative group">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-8 py-6 bg-slate-50/50 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium text-lg shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-[0.25em] text-text-muted/80 block ml-1">Mot de passe</label>
          <div className="relative group">
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-8 py-6 bg-slate-50/50 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium text-lg shadow-inner"
            />
          </div>
          <div className="flex justify-end">
            {/* Fix: removed unsupported 'size' prop from Link component */}
            <Link to="/forgot-password" className="text-[11px] font-black uppercase tracking-widest text-text-muted/60 hover:text-primary transition-colors">Mot de passe oublié ?</Link>
          </div>
        </div>

        <div className="flex flex-col items-center pt-6">
          <button 
            disabled={isLoading}
            className="w-full max-w-sm py-7 bg-[#0f172a] text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-[#1e293b] hover:scale-[1.02] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Se connecter <ArrowRight className="w-5 h-5" /></>}
          </button>

          <p className="mt-10 text-xs font-bold text-text-muted/50 uppercase tracking-widest">
            Nouveau sur le Studio ? <Link to="/signup" className="text-primary font-black ml-1 hover:underline">Créer un compte</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export const SignupPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login("nouvel@utilisateur.com", "Créateur");
      navigate('/builder');
    }, 1500);
  };

  return (
    <AuthLayout 
      title="Créez votre écrin." 
      subtitle="Rejoignez la plus prestigieuse communauté de créateurs."
      image="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1200"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted block ml-1">Nom complet</label>
          <input type="text" required placeholder="John Doe" className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium text-lg" />
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted block ml-1">Adresse e-mail</label>
          <input type="email" required placeholder="john@doe.com" className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium text-lg" />
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-text-muted block ml-1">Mot de passe</label>
          <input type="password" required placeholder="••••••••" className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium text-lg" />
        </div>

        <div className="flex flex-col items-center pt-6">
          <button 
            disabled={isLoading}
            className="w-full max-w-sm py-7 bg-[#0f172a] text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-[#1e293b] hover:scale-[1.02] transition-all shadow-2xl active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Créer mon compte <ArrowRight className="w-5 h-5" /></>}
          </button>

          <p className="mt-10 text-xs font-bold text-text-muted/50 uppercase tracking-widest">
            Déjà un compte ? <Link to="/login" className="text-primary font-black ml-1 hover:underline">Connectez-vous</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Un instant de paix." 
      subtitle="Entrez votre email pour réinitialiser votre accès."
      image="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200"
    >
      <form className="space-y-8">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-[0.25em] text-text-muted/80 block ml-1">Votre adresse e-mail</label>
          <input type="email" required placeholder="john@doe.com" className="w-full px-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium text-lg shadow-inner" />
        </div>

        <div className="flex flex-col items-center pt-6">
          <button className="w-full max-w-sm py-7 bg-[#0f172a] text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-[#1e293b] hover:scale-[1.02] transition-all shadow-2xl active:scale-95">
            Envoyer les instructions
          </button>

          <Link to="/login" className="mt-10 text-[11px] font-black uppercase tracking-[0.3em] text-text-muted/60 hover:text-primary transition-colors">Retour à la connexion</Link>
        </div>
      </form>
    </AuthLayout>
  );
};
