
import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CourseBuilder } from './components/CourseBuilder';
import { AIChatbot } from './components/AIChatbot';
import { BookOpen, Sparkles, ArrowRight, Play, Star, Users, Leaf } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col gap-24">
      {/* Hero Section */}
      <section className="container-main pt-12 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Sparkles className="w-4 h-4" />
          <span>La nouvelle ère du bien-être digital</span>
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-slate-900 mb-8 max-w-5xl mx-auto drop-shadow-sm">
          Créez des formations <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">exceptionnelles.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          Le studio tout-en-un pour les experts du bien-être. Élégant, simple, et magnifiquement intelligent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/builder" className="group bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-primary-dark transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 flex items-center gap-3">
            Démarrer le Studio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/formations" className="bg-white border-2 border-slate-100 px-10 py-5 rounded-2xl text-lg font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-3">
            Voir le Catalogue
          </Link>
        </div>

        {/* Floating preview element */}
        <div className="mt-20 relative max-w-5xl mx-auto rounded-[2.5rem] overflow-hidden shadow-luxury border-8 border-white/50 animate-in zoom-in-95 duration-1000">
          <img src="https://picsum.photos/1200/800?grayscale" alt="Studio Preview" className="w-full h-auto aspect-video object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent flex items-center justify-center">
             <div className="w-24 h-24 glass rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group">
                <Play className="w-8 h-8 text-primary fill-current group-hover:scale-110 transition-transform" />
             </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-slate-50 py-16">
        <div className="container-main">
          <p className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">Ils nous font confiance</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            <span className="text-3xl font-black italic">Mindful.ly</span>
            <span className="text-3xl font-black italic">ZenApp</span>
            <span className="text-3xl font-black italic">YogaStudio</span>
            <span className="text-3xl font-black italic">LumaFlow</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-main py-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">Tout ce qu'il vous faut.</h2>
          <p className="text-slate-500 font-medium max-w-xl mx-auto">Une suite d'outils pensée pour les créateurs qui ne veulent pas faire de compromis sur la qualité.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-10 rounded-[2.5rem] shadow-premium hover:shadow-luxury transition-all border border-white/50 group">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Builder Élégant</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Glissez-déposez vos contenus et organisez votre savoir en quelques clics dans une interface pure.</p>
          </div>
          <div className="glass p-10 rounded-[2.5rem] shadow-premium hover:shadow-luxury transition-all border border-white/50 group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Leaf className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">Expérience Zen</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Vos élèves apprennent dans un environnement sans distraction, propice à la pleine conscience.</p>
          </div>
          <div className="glass p-10 rounded-[2.5rem] shadow-premium hover:shadow-luxury transition-all border border-white/50 group">
            <div className="w-14 h-14 bg-cyan-50 text-cyan-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500 group-hover:text-white transition-all">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black mb-4 tracking-tight">IA Intelligente</h3>
            <p className="text-slate-500 leading-relaxed font-medium">Laissez notre IA vous aider à structurer vos modules et à peaufiner vos textes pour un impact maximum.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-main mb-24">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">Prêt à transformer <br/>votre expertise ?</h2>
            <Link to="/builder" className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl text-xl font-bold hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-2xl">
              Démarrer gratuitement
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const FormationsPage: React.FC = () => {
  const dummyCourses = [
    { id: 1, title: "L'Art de la Méditation", level: "Débutant", users: 120, rating: 4.9, img: "https://picsum.photos/600/400?1" },
    { id: 2, title: "Yoga Vinyasa Avancé", level: "Intermédiaire", users: 85, rating: 4.8, img: "https://picsum.photos/600/400?2" },
    { id: 3, title: "Nutrition Consciente", level: "Tous niveaux", users: 240, rating: 4.7, img: "https://picsum.photos/600/400?3" },
    { id: 4, title: "Sommeil & Sérénité", level: "Débutant", users: 310, rating: 5.0, img: "https://picsum.photos/600/400?4" },
  ];

  return (
    <div className="container-main">
      <header className="mb-16">
        <h1 className="text-5xl font-black tracking-tighter mb-4">Parcourir les Formations</h1>
        <p className="text-slate-500 text-xl font-medium">Découvrez les secrets du bien-être partagés par nos experts.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {dummyCourses.map((course) => (
          <div key={course.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-premium hover:shadow-luxury hover:-translate-y-2 transition-all duration-500">
            <div className="relative aspect-video overflow-hidden">
              <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4">
                 <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest text-primary shadow-sm">{course.level}</span>
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-primary transition-colors">{course.title}</h3>
              <div className="flex items-center justify-between text-slate-400 text-sm font-bold">
                 <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.users} élèves</span>
                 </div>
                 <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{course.rating}</span>
                 </div>
              </div>
              <button className="w-full mt-8 py-4 border-2 border-slate-50 rounded-2xl text-slate-700 font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">S'inscrire</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AssistantPage: React.FC = () => {
  return (
    <div className="container-main flex flex-col items-center">
       <header className="text-center mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-4">Votre Assistant IA</h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl">Besoin d'aide pour structurer votre cours ? Discutez avec notre assistant intelligent.</p>
      </header>
      <AIChatbot />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/formations" element={<FormationsPage />} />
          <Route path="/builder" element={<CourseBuilder />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="*" element={<div className="container-main text-center py-20 text-slate-400 font-black text-4xl">404 - Studio Introuvable</div>} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
