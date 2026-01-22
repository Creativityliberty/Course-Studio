
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Smartphone } from 'lucide-react';
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
      image="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1200"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Adresse e-mail</label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full pl-14 pr-5 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Mot de passe</label>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-14 pr-5 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Link to="/forgot-password" size="sm" className="text-xs font-bold text-text-muted hover:text-primary transition-colors">Mot de passe oublié ?</Link>
        </div>

        <button 
          disabled={isLoading}
          className="w-full py-6 bg-text-main text-surface rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-luxury active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Se connecter <ArrowRight className="w-4 h-4" /></>}
        </button>

        <p className="text-center text-xs font-bold text-text-muted pt-4">
          Nouveau sur le Studio ? <Link to="/signup" className="text-primary hover:underline">Créez un compte</Link>
        </p>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Nom complet</label>
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input type="text" required placeholder="John Doe" className="w-full pl-14 pr-5 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Adresse e-mail</label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input type="email" required placeholder="john@doe.com" className="w-full pl-14 pr-5 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Mot de passe</label>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input type="password" required placeholder="••••••••" className="w-full pl-14 pr-5 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium" />
          </div>
        </div>

        <button 
          disabled={isLoading}
          className="w-full py-6 bg-text-main text-surface rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-luxury active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Créer mon compte <ArrowRight className="w-4 h-4" /></>}
        </button>

        <p className="text-center text-xs font-bold text-text-muted pt-4">
          Déjà un compte ? <Link to="/login" className="text-primary hover:underline">Connectez-vous</Link>
        </p>
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
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">Votre adresse e-mail</label>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <input type="email" required placeholder="john@doe.com" className="w-full pl-14 pr-5 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none font-medium" />
          </div>
        </div>

        <button className="w-full py-6 bg-text-main text-surface rounded-2xl font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-luxury">
          Envoyer les instructions
        </button>

        <Link to="/login" className="block text-center text-xs font-bold text-text-muted hover:text-primary transition-colors">Retour à la connexion</Link>
      </form>
    </AuthLayout>
  );
};
