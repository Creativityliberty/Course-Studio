
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Leaf, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section Cinématique */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10"></div>
          <img src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20 scale-110 blur-sm" alt="Background" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto space-y-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.5em] text-primary shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="w-4 h-4" />
            Studio de Création Premium
          </div>
          <h1 className="editorial-title text-5xl md:text-8xl lg:text-[11rem] font-black text-slate-900 leading-[0.9] tracking-tighter">
            L'excellence est <span className="text-primary italic">pédagogique.</span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-slate-500 font-medium max-w-2xl mx-auto leading-tight italic opacity-60 px-4">
            Transformez votre expertise en une expérience sensorielle inoubliable pour vos élèves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
            <Link to="/builder" className="group bg-slate-900 text-white px-12 py-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4">
              Démarrer le Studio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/formations" className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-primary transition-colors flex items-center gap-3 border-b border-transparent hover:border-primary pb-2">
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {[
            { icon: <Sparkles />, title: "Design Couture", desc: "Une esthétique inspirée des grands magazines de mode pour sublimer votre savoir.", color: "primary" },
            { icon: <Leaf />, title: "Narration IA", desc: "Générez des guides vocaux apaisants et des structures de cours en quelques secondes.", color: "emerald-500" },
            { icon: <Users />, title: "Diffusion Pro", desc: "Des Landing Pages cinématiques prêtes à l'emploi pour accueillir vos élèves.", color: "indigo-500" }
          ].map((feat, i) => (
            <div key={i} className="space-y-8 p-12 bg-white rounded-[4rem] border border-slate-50 shadow-premium group hover:shadow-luxury transition-all">
              <div className={`w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-${feat.color} group-hover:scale-110 transition-transform`}>
                {React.cloneElement(feat.icon as React.ReactElement, { className: "w-10 h-10" })}
              </div>
              <h3 className="text-4xl font-black tracking-tighter">{feat.title}</h3>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
