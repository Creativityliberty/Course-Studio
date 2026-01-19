
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CourseBuilder } from './components/CourseBuilder';
import { AIChatbot } from './components/AIChatbot';
import { CourseLanding } from './components/CourseLanding';
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
        <h1 className="editorial-title text-5xl md:text-9xl font-black text-slate-900 mb-8 max-w-5xl mx-auto drop-shadow-sm">
          Créez des formations <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">magnétiques.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          Le studio tout-en-un pour les experts du bien-être. Éditorial, simple, et magnifiquement intelligent.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <a href="#/builder" className="group bg-primary text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-primary-dark transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 flex items-center gap-3">
            Démarrer le Studio
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#/formations" className="bg-white border-2 border-slate-100 px-10 py-5 rounded-2xl text-lg font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-3">
            Voir le Catalogue
          </a>
        </div>
      </section>

      {/* Features Simple */}
      <section className="container-main py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-10 rounded-[2.5rem] shadow-premium group">
            <Sparkles className="w-12 h-12 text-primary mb-6" />
            <h3 className="text-2xl font-black mb-4">Design Haute Couture</h3>
            <p className="text-slate-500 font-medium">Une interface pensée comme un magazine de luxe pour vos élèves.</p>
          </div>
          <div className="glass p-10 rounded-[2.5rem] shadow-premium group">
            <Leaf className="w-12 h-12 text-emerald-500 mb-6" />
            <h3 className="text-2xl font-black mb-4">Mindfulness Ready</h3>
            <p className="text-slate-500 font-medium">Génération de guides vocaux apaisants par IA en un clic.</p>
          </div>
          <div className="glass p-10 rounded-[2.5rem] shadow-premium group">
            <Users className="w-12 h-12 text-indigo-500 mb-6" />
            <h3 className="text-2xl font-black mb-4">Partage Immédiat</h3>
            <p className="text-slate-500 font-medium">Publiez et partagez votre savoir avec un lien élégant et professionnel.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const FormationsPage: React.FC = () => {
  // Récupération des cours publiés localement
  const savedCourses = JSON.parse(localStorage.getItem('published_courses') || '[]');
  
  return (
    <div className="container-main">
      <header className="mb-16">
        <h1 className="editorial-title text-7xl text-slate-900 mb-4">Bibliothèque</h1>
        <p className="text-slate-500 text-xl font-medium">Vos créations et les masterclass du studio.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {savedCourses.map((course: any) => (
          <a href={`#/share/${course.id}`} key={course.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-premium hover:shadow-luxury transition-all">
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
               <img src={course.coverImage || "https://picsum.photos/600/400?grayscale"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-black mb-2 tracking-tight">{course.title}</h3>
              <p className="text-slate-400 text-sm font-medium mb-6 line-clamp-2">{course.subtitle}</p>
              <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                Voir la formation <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </a>
        ))}
        {savedCourses.length === 0 && (
          <div className="col-span-full py-20 border-2 border-dashed border-slate-100 rounded-[3rem] text-center">
            <p className="text-slate-300 font-black uppercase tracking-widest text-xs">Aucune formation publiée pour le moment</p>
          </div>
        )}
      </div>
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
          <Route path="/assistant" element={<AIChatbot />} />
          <Route path="/share/:courseId" element={<CourseLanding />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
