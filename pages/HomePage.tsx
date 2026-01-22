
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Leaf, Users, Zap, 
  ShieldCheck, Globe, MousePointer2, Star, 
  Play, BookOpen, Clock, ChevronRight 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col bg-surface overflow-hidden">
      
      {/* SECTION 1: HERO CINÉMATIQUE */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=2000" 
            className={`w-full h-full object-cover opacity-10 transition-transform duration-[5000ms] ${isVisible ? 'scale-100' : 'scale-125'}`} 
            alt="Zen Background" 
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto">
          <div className={`inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-primary shadow-xl mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Sparkles className="w-4 h-4 animate-pulse" />
            L'Art de Transmettre par l'IA
          </div>
          
          <h1 className={`editorial-title text-6xl md:text-9xl lg:text-[13rem] font-black text-slate-900 leading-[0.85] tracking-tighter mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            Excellence <br />
            <span className="text-primary italic">Pédagogique.</span>
          </h1>
          
          <p className={`text-xl md:text-3xl text-slate-500 font-medium max-w-3xl mx-auto leading-tight italic opacity-60 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Sublimez votre savoir. Notre Studio fusionne design haute couture et intelligence artificielle pour créer des cours qui respirent.
          </p>
          
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-8 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Link to="/builder" className="group bg-slate-900 text-white px-14 py-7 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all hover:scale-105 active:scale-95 shadow-luxury flex items-center gap-4">
              Ouvrir le Studio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/formations" className="group text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-primary transition-all flex items-center gap-3">
              Catalogue Signature
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
          <div className="w-px h-16 bg-slate-900"></div>
        </div>
      </section>

      {/* SECTION 2: STATS ÉLÉGANTES */}
      <section className="py-24 border-y border-slate-50 bg-slate-50/30">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Créateurs", value: "2.4k+" },
            { label: "Leçons IA", value: "45k" },
            { label: "Note Design", value: "4.9/5" },
            { label: "Temps Gagné", value: "-70%" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic">{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: L'EXPÉRIENCE STUDIO (GRID) */}
      <section className="py-40 container-main px-6">
        <div className="text-center mb-32 space-y-6">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">L'Atelier des Sens</span>
          <h2 className="editorial-title text-6xl md:text-9xl text-slate-900">Une Aura Digitale.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {[
            { 
              icon: <Sparkles />, 
              title: "Esthétique Pure", 
              desc: "Des interfaces épurées, inspirées des plus grands magazines, pour une concentration absolue.", 
              img: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800"
            },
            { 
              icon: <Zap />, 
              title: "Agent Pédagogue", 
              desc: "Un Chef de Studio IA qui structure vos idées, trouve vos sources et rédige vos leçons.", 
              img: "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=800"
            },
            { 
              icon: <Leaf />, 
              title: "Voix Apaisantes", 
              desc: "Transformez vos textes en guides audio méditatifs grâce à notre moteur de synthèse neuronale.", 
              img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800"
            }
          ].map((item, i) => (
            <div key={i} className="group relative flex flex-col gap-8 p-12 bg-white rounded-[4rem] border border-slate-50 shadow-premium hover:shadow-luxury transition-all duration-700">
              <div className="aspect-video rounded-[2.5rem] overflow-hidden mb-4 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                <img src={item.img} className="w-full h-full object-cover" alt={item.title} />
              </div>
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-primary mb-2">
                {/* Fix: cast icon to React.ReactElement<any> to satisfy TypeScript for cloneElement props */}
                {React.cloneElement(item.icon as React.ReactElement<any>, { className: "w-8 h-8" })}
              </div>
              <h3 className="text-3xl font-black tracking-tighter leading-none">{item.title}</h3>
              <p className="text-lg text-slate-400 font-medium leading-relaxed italic">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: MANIFESTE VISUEL */}
      <section className="py-40 bg-slate-900 text-surface relative overflow-hidden px-6">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
        </div>

        <div className="container-main relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Le Manifeste</span>
            <h2 className="editorial-title text-6xl md:text-[10rem] leading-[0.85] tracking-tighter">
              Le Savoir <br />
              est un <br />
              <span className="text-primary italic">Bijou.</span>
            </h2>
            <p className="text-xl md:text-3xl leading-snug font-light opacity-60 italic">
              "Nous ne construisons pas des plateformes de cours. Nous façonnons des sanctuaires de connaissance où chaque mot pèse son poids de lumière."
            </p>
            <div className="flex items-center gap-8 pt-8">
               <div className="flex -space-x-4">
                  {[1,2,3,4].map(n => (
                    <img key={n} src={`https://i.pravatar.cc/100?img=${n+10}`} className="w-14 h-14 rounded-full border-4 border-slate-900 shadow-xl" alt="Creator" />
                  ))}
               </div>
               <p className="text-xs font-black uppercase tracking-widest text-slate-400">Rejoint par 10k+ visionnaires</p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-[5rem] overflow-hidden shadow-luxury rotate-3 hover:rotate-0 transition-transform duration-1000 border-8 border-white/5">
              <img src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Luxury Interior" />
            </div>
            <div className="absolute -bottom-10 -left-10 glass p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-bounce duration-[3000ms]">
               <Star className="w-10 h-10 text-primary mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest leading-none">Certifié Studio Premium</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CALL TO ACTION FINAL */}
      <section className="py-60 container-main text-center px-6">
        <div className="max-w-5xl mx-auto space-y-20">
          <h2 className="editorial-title text-7xl md:text-[12rem] leading-none text-slate-900 animate-pulse">
            Incarnez votre <br />
            <span className="text-primary italic">Vision.</span>
          </h2>
          
          <div className="flex flex-col items-center gap-12">
            <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-2xl italic">
              Le Studio est prêt. Votre audience attend l'excellence. Commençons maintenant.
            </p>
            
            <Link 
              to="/signup" 
              className="group relative px-20 py-10 bg-primary text-white rounded-[3rem] text-[12px] font-black uppercase tracking-[0.5em] shadow-luxury hover:scale-105 transition-all overflow-hidden"
            >
              <span className="relative z-10">Réserver mon Accès Studio</span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </Link>
            
            <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-widest text-slate-300">
               <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Pas de carte requise</span>
               <span className="w-1 h-1 rounded-full bg-slate-200"></span>
               <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> Déploiement Mondial</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER LUXE REVISITÉ */}
      <footer className="py-20 border-t border-slate-50 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">Mindfulness Studio</span>
            </div>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] max-w-xs text-center md:text-left">
              L'architecture du savoir, redéfinie par l'intelligence artificielle et le design éditorial.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="flex flex-col gap-4">
              <span className="text-slate-900 mb-2">Studio</span>
              <Link to="/builder" className="hover:text-primary transition-colors">Builder</Link>
              <Link to="/assistant" className="hover:text-primary transition-colors">Assistant IA</Link>
              <Link to="/formations" className="hover:text-primary transition-colors">Catalogue</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-slate-900 mb-2">Compagnie</span>
              <a href="#" className="hover:text-primary transition-colors">Manifeste</a>
              <a href="#" className="hover:text-primary transition-colors">Membres</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
            <div className="flex flex-col gap-4 hidden md:flex">
              <span className="text-slate-900 mb-2">Légal</span>
              <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-primary transition-colors">Conditions</a>
            </div>
          </div>
        </div>
        <div className="mt-24 text-center border-t border-slate-50 pt-10">
          <p className="text-[9px] font-black text-slate-200 uppercase tracking-[1.5em]">ESTABLISHED IN THE STUDIO • MMXXV</p>
        </div>
      </footer>

    </div>
  );
};
