
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, ShieldCheck, Play, 
  BookOpen, Clock, Award, Star, Check, Globe, 
  Volume2, Layout, Zap, ArrowDown, Info, MousePointer2
} from 'lucide-react';
import { CoursePlayer } from './CoursePlayer';
import { Course } from '../types';

export const CourseLanding: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    
    const published = JSON.parse(localStorage.getItem('published_courses') || '[]');
    const found = published.find((c: any) => c.id === courseId);
    if (found) setCourse(found);

    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center bg-surface">
        <h2 className="editorial-title text-9xl mb-8 opacity-5">EMPTY</h2>
        <p className="text-text-muted font-black uppercase tracking-[0.4em] text-[10px]">Formation introuvable</p>
        <Link to="/" className="mt-12 px-10 py-5 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-luxury hover:scale-105 transition-all">Retour au Studio</Link>
      </div>
    );
  }

  if (isRegistered) {
    return <CoursePlayer course={course} onClose={() => setIsRegistered(false)} />;
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

  return (
    <div className="min-h-screen bg-surface text-text-main selection:bg-primary/20 font-sans overflow-x-hidden">
      
      {/* Floating Header */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-12 py-8 flex justify-between items-center ${isScrolled ? 'glass py-4 shadow-luxury' : 'bg-transparent'}`}>
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-text-main rounded-2xl flex items-center justify-center text-surface shadow-xl">
               <Sparkles className="w-5 h-5" />
            </div>
            <div className="hidden md:block">
               <p className="font-black uppercase tracking-[0.3em] text-[10px] leading-none mb-1">Mindfulness Studio</p>
               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Série Signature</p>
            </div>
         </div>
         <div className="flex items-center gap-8">
            <button 
              onClick={() => window.scrollTo({ top: document.getElementById('curriculum')?.offsetTop, behavior: 'smooth' })}
              className="hidden lg:block text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors"
            >
              Programme
            </button>
            <button 
              onClick={() => window.scrollTo({ top: document.getElementById('registration')?.offsetTop, behavior: 'smooth' })}
              className="px-8 py-4 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
            >
              Réserver ma place
            </button>
         </div>
      </nav>

      {/* Cinematic Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
           <img 
             src={course.coverImage || "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=2000"} 
             className="w-full h-full object-cover scale-110 opacity-40 blur-[2px]" 
           />
           <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface"></div>
        </div>

        <div className="container-main relative z-10 text-center space-y-12">
           <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              <span className="px-6 py-2 border border-text-main/10 rounded-full text-[10px] font-black uppercase tracking-[0.5em] mb-8 inline-block">
                Masterclass Automne 2025
              </span>
              <h1 className="editorial-title text-7xl md:text-[14rem] leading-[0.8] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-text-main to-text-main/60">
                {course.title}
              </h1>
              <p className="text-xl md:text-3xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed italic opacity-80">
                "{course.subtitle || "Une immersion sensorielle au cœur de votre propre excellence."}"
              </p>
           </div>

           <div className="flex flex-wrap justify-center gap-12 pt-12 animate-in fade-in duration-1000 delay-500">
              <div className="text-center">
                 <p className="text-3xl font-black mb-1">{totalLessons}</p>
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest">Leçons</p>
              </div>
              <div className="w-px h-12 bg-text-main/10"></div>
              <div className="text-center">
                 <p className="text-3xl font-black mb-1">4.5h</p>
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest">Contenu</p>
              </div>
              <div className="w-px h-12 bg-text-main/10"></div>
              <div className="text-center">
                 <p className="text-3xl font-black mb-1">IA</p>
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest">Assisté</p>
              </div>
           </div>

           <div className="pt-20 animate-bounce duration-[2000ms]">
              <ArrowDown className="w-6 h-6 mx-auto text-text-muted opacity-30" />
           </div>
        </div>
      </section>

      {/* Manifeste / Expérience */}
      <section className="py-40 bg-text-main text-surface overflow-hidden relative">
         <div className="absolute top-0 right-0 p-40 opacity-5">
            <Sparkles className="w-96 h-96" />
         </div>
         <div className="container-main relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="space-y-12">
                  <h2 className="editorial-title text-8xl md:text-[10rem] leading-[0.9]">L'Éveil par le Design.</h2>
                  <p className="text-2xl md:text-4xl leading-snug font-light opacity-80">
                    Nous croyons que l'apprentissage est une forme d'art. Cette formation n'est pas qu'un transfert de données, c'est une <strong>métamorphose visuelle et mentale</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-12">
                     <div className="p-8 border border-surface/10 rounded-3xl hover:bg-surface hover:text-text-main transition-all group">
                        <Volume2 className="w-8 h-8 mb-6 text-primary group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-black mb-2 uppercase tracking-tighter">Guides Vocaux</h4>
                        <p className="text-xs opacity-60 font-bold uppercase tracking-widest">Immersion Audio IA</p>
                     </div>
                     <div className="p-8 border border-surface/10 rounded-3xl hover:bg-surface hover:text-text-main transition-all group">
                        <Layout className="w-8 h-8 mb-6 text-primary group-hover:scale-110 transition-transform" />
                        <h4 className="text-lg font-black mb-2 uppercase tracking-tighter">Visuels 4K</h4>
                        <p className="text-xs opacity-60 font-bold uppercase tracking-widest">Qualité Cinéma</p>
                     </div>
                  </div>
               </div>
               <div className="relative">
                  <div className="aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-1000">
                     <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
               </div>
            </div>
         </div>
      </section>

      {/* Curriculum Editorial */}
      <section id="curriculum" className="py-60 container-main">
         <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-12">
            <div className="max-w-2xl space-y-6">
               <span className="text-xs font-black uppercase tracking-[0.5em] text-primary">Le Sommaire</span>
               <h2 className="editorial-title text-8xl md:text-[11rem] leading-none">Architecture.</h2>
            </div>
            <p className="text-xl text-text-muted font-medium max-w-sm pb-4">
              Une progression logique découpée en {course.modules.length} chapitres fondamentaux.
            </p>
         </div>

         <div className="space-y-4">
            {course.modules.map((mod, idx) => (
               <div key={idx} className="group border-b border-text-main/5 py-16 hover:bg-primary/[0.02] transition-all px-8 rounded-3xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                     <div className="lg:col-span-1 text-5xl font-black text-text-main/10 group-hover:text-primary/20 transition-colors tracking-tighter italic">
                        0{idx + 1}
                     </div>
                     <div className="lg:col-span-5">
                        <h3 className="text-5xl font-black tracking-tighter mb-4 group-hover:translate-x-2 transition-transform">{mod.title}</h3>
                        <p className="text-sm text-text-muted font-bold uppercase tracking-widest opacity-60">{mod.lessons.length} Leçons d'Expertise</p>
                     </div>
                     <div className="lg:col-span-6 space-y-4 pt-2">
                        {mod.lessons.map((lesson, lIdx) => (
                           <div key={lIdx} className="flex items-center justify-between group/item p-4 rounded-2xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-text-main/5">
                              <div className="flex items-center gap-4">
                                 <Play className="w-4 h-4 text-primary" />
                                 <span className="text-lg font-bold text-text-muted group-hover/item:text-text-main transition-colors">{lesson.title}</span>
                              </div>
                              <span className="text-[10px] font-black text-text-main/20 uppercase tracking-widest">12:00</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>

      {/* Enrollment Section (The Gate) */}
      <section id="registration" className="py-60 bg-surface relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-5">
            <h2 className="editorial-title text-[40rem] text-center select-none">JOIN</h2>
         </div>
         
         <div className="container-main relative z-10">
            <div className="max-w-4xl mx-auto glass p-20 rounded-[5rem] shadow-luxury border border-white/50 text-center space-y-16">
               <div className="space-y-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-10 shadow-xl shadow-primary/10">
                     <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h2 className="editorial-title text-7xl md:text-9xl tracking-tighter">Prenez place dans le Studio.</h2>
                  <p className="text-xl text-text-muted font-medium max-w-xl mx-auto leading-relaxed">
                    L'inscription est immédiate. Pas de carte bancaire, juste votre curiosité.
                  </p>
               </div>

               <div className="space-y-6">
                  <div className="relative group">
                     <input 
                       type="email" 
                       placeholder="votre@email.com" 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full p-10 bg-surface border-2 border-text-main/5 rounded-[2.5rem] focus:outline-none focus:border-primary/30 transition-all text-2xl font-medium shadow-inner"
                     />
                     <button 
                       onClick={() => {
                          if(email.includes('@')) {
                             window.scrollTo({ top: 0, behavior: 'instant' });
                             setIsRegistered(true);
                          }
                       }}
                       className="absolute right-4 top-4 bottom-4 px-12 bg-text-main text-surface rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl active:scale-95"
                     >
                       Accéder à l'expérience
                     </button>
                  </div>
                  <p className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.4em]">Inscrivez-vous pour débloquer les {totalLessons} leçons</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-text-main/5">
                  <div className="flex items-center gap-4 justify-center">
                     <Check className="w-5 h-5 text-emerald-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Accès à vie</span>
                  </div>
                  <div className="flex items-center gap-4 justify-center">
                     <Check className="w-5 h-5 text-emerald-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Certificat Studio</span>
                  </div>
                  <div className="flex items-center gap-4 justify-center">
                     <Check className="w-5 h-5 text-emerald-500" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Guide Audio IA</span>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer Luxe */}
      <footer className="py-32 border-t border-text-main/5 container-main">
         <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-text-main rounded-xl"></div>
               <span className="text-xs font-black uppercase tracking-[0.4em]">Mindfulness Studio Premium</span>
            </div>
            <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-text-muted">
               <a href="#" className="hover:text-primary transition-colors">Mentions Légales</a>
               <a href="#" className="hover:text-primary transition-colors">Confidentialité</a>
               <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
         </div>
         <div className="mt-20 text-center">
            <p className="text-[10px] font-black text-text-muted/20 uppercase tracking-[1em]">DESIGNED IN THE STUDIO • 2025</p>
         </div>
      </footer>
    </div>
  );
};
