
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Sparkles, BookOpen, Clock, Award, Loader2, X, Star, Quote, ChevronDown, HelpCircle, Book
} from 'lucide-react';
import { CoursePlayer } from './CoursePlayer';
import { Course } from '../types';

export const CourseLanding: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    
    try {
      const publishedData = localStorage.getItem('published_courses');
      const published = publishedData ? JSON.parse(publishedData) : [];
      const found = published.find((c: any) => c.id === courseId);
      if (found) setCourse(found);
    } catch (err) {
      console.error("Failed to load course data", err);
    } finally {
      setIsLoading(false);
    }

    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center bg-surface">
        <h2 className="editorial-title text-5xl md:text-7xl mb-8 opacity-5 uppercase">INTÉROGIT</h2>
        <p className="text-text-muted font-black uppercase tracking-[0.4em] text-[10px]">Formation introuvable</p>
        <Link to="/" className="mt-12 px-10 py-5 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-luxury hover:scale-105 transition-all">Retour au Studio</Link>
      </div>
    );
  }

  if (isRegistered) {
    return <CoursePlayer course={course} onClose={() => setIsRegistered(false)} />;
  }

  const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-surface text-text-main selection:bg-primary/20 font-sans overflow-x-hidden">
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-8 md:px-12 py-6 flex justify-between items-center ${isScrolled ? 'glass shadow-premium border-b border-slate-100' : 'bg-transparent'}`}>
         <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-xl text-white">
               <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-black uppercase tracking-[0.3em] text-[10px]">Studio Signature</span>
         </div>
         <div className="flex items-center gap-6">
            <button 
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-[#4f46e5] text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-xl hover:scale-105 transition-all"
            >
              S'inscrire
            </button>
         </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 z-0">
           <img 
             src={course.coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995"} 
             className="w-full h-full object-cover scale-105 opacity-20 blur-[2px]" 
             alt="Background"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface"></div>
        </div>

        <div className="container-main relative z-10 text-center space-y-16">
           <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <span className="inline-block px-4 py-2 bg-white border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 shadow-sm">
                Publication Signature MMXXV
              </span>
              <h1 className="editorial-title text-6xl md:text-8xl lg:text-[9.5rem] leading-[0.8] tracking-tighter mb-12 max-w-[1400px] mx-auto">
                {course.title}
              </h1>
              <p className="text-2xl md:text-3xl text-slate-400 max-w-4xl mx-auto font-medium leading-tight italic">
                {course.subtitle}
              </p>
           </div>

           <div className="flex flex-wrap justify-center gap-12 pt-8">
              <div className="flex items-center gap-4">
                 <BookOpen className="w-6 h-6 text-primary" />
                 <span className="text-[11px] font-black uppercase tracking-widest">{totalLessons} Unités</span>
              </div>
              <div className="flex items-center gap-4">
                 <Clock className="w-6 h-6 text-primary" />
                 <span className="text-[11px] font-black uppercase tracking-widest">Mastery Level</span>
              </div>
              <div className="flex items-center gap-4">
                 <Award className="w-6 h-6 text-primary" />
                 <span className="text-[11px] font-black uppercase tracking-widest">Certification</span>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION TÉMOIGNAGES */}
      {course.testimonials && course.testimonials.length > 0 && (
        <section className="py-40 bg-slate-50/50 border-y border-slate-100 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 space-y-6">
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Preuve Sociale</span>
              <h2 className="editorial-title text-6xl md:text-8xl">Recommandations.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {course.testimonials.map((t: any, i: number) => (
                <div key={i} className="bg-white p-12 rounded-[4rem] shadow-premium border border-slate-50 relative group transition-all hover:-translate-y-2">
                  <Quote className="absolute top-10 right-10 w-12 h-12 text-primary opacity-5" />
                  <div className="flex items-center gap-6 mb-10">
                    <img src={t.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt={t.name} />
                    <div>
                      <h4 className="font-black text-slate-900 leading-none mb-1">{t.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-xl text-slate-500 font-medium italic leading-relaxed">"{t.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="curriculum" className="py-40 bg-white px-6">
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-32 space-y-8">
               <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Architecture du savoir</span>
               <h2 className="editorial-title text-6xl md:text-8xl">Programme.</h2>
            </div>

            <div className="space-y-8">
               {course.modules?.map((mod: any, idx: number) => (
                  <div key={idx} className="group bg-slate-50/50 border border-slate-100 rounded-[3.5rem] p-12 hover:bg-white transition-all shadow-sm">
                     <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
                        <div className="text-5xl font-black text-primary/30 italic">0{idx + 1}</div>
                        <div className="flex-grow space-y-8">
                           <h3 className="text-4xl font-black tracking-tighter">{mod.title}</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {mod.lessons?.map((lesson: any, lIdx: number) => (
                                 <div key={lIdx} className="flex items-center gap-4 text-slate-500 text-lg font-medium italic">
                                    <div className="w-2 h-2 rounded-full bg-primary/30"></div>
                                    {lesson.title}
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* SECTION GLOSSAIRE & FAQ */}
      <section className="py-40 bg-slate-900 text-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* FAQ */}
          <div className="space-y-16">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Assistance</span>
              <h2 className="editorial-title text-5xl md:text-7xl">Questions.</h2>
            </div>
            <div className="space-y-4">
              {course.faq?.map((item: any, i: number) => (
                <div key={i} className="border-b border-white/10 pb-6">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left group py-4"
                  >
                    <span className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">{item.question}</span>
                    <ChevronDown className={`w-6 h-6 transition-transform ${openFaq === i ? 'rotate-180 text-primary' : 'text-white/20'}`} />
                  </button>
                  {openFaq === i && (
                    <p className="text-lg text-white/50 font-medium italic mt-4 animate-in fade-in duration-500">{item.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GLOSSAIRE */}
          <div className="space-y-16">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Lexique</span>
              <h2 className="editorial-title text-5xl md:text-7xl">Concepts.</h2>
            </div>
            <div className="grid gap-8">
              {course.glossary?.map((g: any, i: number) => (
                <div key={i} className="bg-white/5 p-10 rounded-[3rem] border border-white/5 hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <Book className="w-5 h-5 text-primary" />
                    <h4 className="text-2xl font-black tracking-tight">{g.term}</h4>
                  </div>
                  <p className="text-lg text-white/40 font-medium italic leading-relaxed">{g.definition}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section id="registration" className="py-60 container-main px-6">
         <div className="glass p-20 md:p-32 rounded-[5rem] shadow-luxury border border-white/50 text-center space-y-16">
            <h2 className="editorial-title text-7xl md:text-[9rem] leading-none">Incarnez <br /><span className="text-primary italic">le Savoir.</span></h2>
            <p className="text-2xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto italic leading-tight">
              Rejoignez le cercle fermé des élèves du Studio. L'accès est immédiat et permanent.
            </p>
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-6">
               <input 
                 type="email" 
                 placeholder="votre@email.com" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="flex-grow p-8 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:border-primary/40 transition-all text-2xl font-medium shadow-inner"
               />
               <button 
                 onClick={() => { if(email.includes('@')) setIsRegistered(true); window.scrollTo(0,0); }}
                 className="px-16 py-8 bg-[#4f46e5] text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
               >
                 Réserver l'accès
               </button>
            </div>
         </div>
      </section>

      <footer className="py-20 border-t border-slate-50 text-center opacity-30">
         <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-400">STUDIO • MMXXV</p>
      </footer>
    </div>
  );
};
