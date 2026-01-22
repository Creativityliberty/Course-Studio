
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CourseBuilder } from './components/CourseBuilder';
import { AIChatbot } from './components/AIChatbot';
import { CourseLanding } from './components/CourseLanding';
import { BookOpen, Sparkles, ArrowRight, Play, Star, Users, Leaf, Clock, ArrowUpRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section Cinématique - Responsive */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10"></div>
          <img src="https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover opacity-20 scale-110 blur-sm" />
        </div>

        <div className="relative z-20 max-w-6xl mx-auto space-y-8 md:space-y-12">
          <div className="inline-flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 bg-white border border-slate-100 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-primary shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Sparkles className="w-3 md:w-4 h-3 md:h-4" />
            Studio de Création Premium
          </div>
          <h1 className="editorial-title text-5xl md:text-8xl lg:text-[11rem] font-black text-slate-900 leading-[0.9] tracking-tighter">
            L'excellence est <span className="text-primary italic">pédagogique.</span>
          </h1>
          <p className="text-lg md:text-2xl lg:text-3xl text-slate-500 font-medium max-w-2xl mx-auto leading-tight italic opacity-60 px-4">
            Transformez votre expertise en une expérience sensorielle inoubliable pour vos élèves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 pt-6 md:pt-8">
            <Link to="/builder" className="w-full sm:w-auto group bg-slate-900 text-white px-8 md:px-12 py-4 md:py-6 rounded-2xl md:rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center gap-4">
              Démarrer le Studio
              <ArrowRight className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/formations" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-primary transition-colors flex items-center gap-3 border-b border-transparent hover:border-primary pb-2">
              Explorer le catalogue
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid - Stacks on Mobile */}
      <section className="py-20 md:py-40 container-main">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          {[
            { icon: <Sparkles />, title: "Design Couture", desc: "Une esthétique inspirée des grands magazines de mode pour sublimer votre savoir.", color: "primary" },
            { icon: <Leaf />, title: "Narration IA", desc: "Générez des guides vocaux apaisants et des structures de cours en quelques secondes.", color: "emerald-500" },
            { icon: <Users />, title: "Diffusion Pro", desc: "Des Landing Pages cinématiques prêtes à l'emploi pour accueillir vos élèves.", color: "indigo-500" }
          ].map((feat, i) => (
            <div key={i} className="space-y-6 md:space-y-8 p-8 md:p-12 bg-white rounded-[3rem] md:rounded-[4rem] border border-slate-50 shadow-premium group hover:shadow-luxury transition-all">
              <div className={`w-16 md:w-20 h-16 md:h-20 bg-slate-50 rounded-2xl md:rounded-3xl flex items-center justify-center text-${feat.color} group-hover:scale-110 transition-transform`}>
                {React.cloneElement(feat.icon as React.ReactElement, { className: "w-8 md:w-10 h-8 md:h-10" })}
              </div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tighter">{feat.title}</h3>
              <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const FormationsPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('published_courses') || '[]');
    setCourses(saved);
  }, []);
  
  return (
    <div className="container-main pt-32 pb-40 px-6">
      <header className="mb-20 md:mb-32 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Le catalogue</span>
           <h1 className="editorial-title text-6xl md:text-[10rem] text-slate-900 leading-none">Bibliothèque.</h1>
        </div>
        <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-sm italic">
          Découvrez les dernières masterclass créées par la communauté du studio.
        </p>
      </header>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16">
          {courses.map((course: any) => (
            <Link to={`/share/${course.id}`} key={course.id} className="group flex flex-col gap-6 md:gap-8">
              <div className="aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-luxury relative">
                <img 
                  src={course.coverImage || `https://picsum.photos/800/1000?random=${course.id}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 md:p-12">
                   <div className="w-12 md:w-16 h-12 md:h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <ArrowUpRight className="w-5 md:w-6 h-5 md:h-6 text-slate-900" />
                   </div>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Série Signature</span>
                   <div className="flex items-center gap-2 text-slate-300 text-[9px] font-black uppercase tracking-widest">
                      <Clock className="w-3 h-3" /> 4h 30m
                   </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-base md:text-lg text-slate-400 font-medium line-clamp-2 italic leading-snug">"{course.subtitle}"</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 md:py-40 border-2 border-dashed border-slate-100 rounded-[3rem] md:rounded-[5rem] text-center flex flex-col items-center gap-8 px-6">
          <div className="w-16 md:w-20 h-16 md:h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
             <BookOpen className="w-8 md:w-10 h-8 md:h-10" />
          </div>
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Votre bibliothèque est vide</p>
            <Link to="/builder" className="inline-block bg-primary text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/10 hover:scale-105 transition-all">
              Créer ma première masterclass
            </Link>
          </div>
        </div>
      )}
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
