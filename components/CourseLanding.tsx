
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, Sparkles, ShieldCheck, Play, 
  BookOpen, Clock, Award, Star, Check, Globe, 
  Volume2, Layout, Zap, ArrowDown, Info, MousePointer2, Menu, X,
  Target, User as UserIcon, HelpCircle, MessageSquare, Quote
} from 'lucide-react';
import { CoursePlayer } from './CoursePlayer';
import { Course, Testimonial } from '../types';

export const CourseLanding: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [email, setEmail] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Mocked testimonials if not present in the course data
  const defaultTestimonials: Testimonial[] = [
    { 
      name: "Eléonore V.", 
      role: "Digital Strategist", 
      content: "Une expérience sensorielle hors du commun. Le design m'a permis de rester concentrée pendant toute la masterclass. Indispensable.",
      avatar: "https://i.pravatar.cc/150?img=31"
    },
    { 
      name: "Thomas D.", 
      role: "Entrepreneur", 
      content: "La clarté pédagogique couplée à l'élégance du Studio en fait la meilleure formation que j'ai suivie en 2025.",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    { 
      name: "Sacha M.", 
      role: "Creative Director", 
      content: "Le Chef de Studio IA est une révolution. Le contenu généré est pertinent, précis et magnifiquement structuré.",
      avatar: "https://i.pravatar.cc/150?img=32"
    }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
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
        <h2 className="editorial-title text-5xl md:text-7xl mb-8 opacity-5">VIDE</h2>
        <p className="text-text-muted font-black uppercase tracking-[0.4em] text-[10px]">Formation introuvable</p>
        <Link to="/" className="mt-12 px-10 py-5 bg-primary text-white rounded-full font-black uppercase tracking-widest text-[10px] shadow-luxury hover:scale-105 transition-all">Retour au Studio</Link>
      </div>
    );
  }

  if (isRegistered) {
    return <CoursePlayer course={course} onClose={() => setIsRegistered(false)} />;
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const testimonials = course.testimonials || defaultTestimonials;

  return (
    <div className="min-h-screen bg-surface text-text-main selection:bg-primary/20 font-sans overflow-x-hidden">
      
      {/* Navigation Flottante */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 md:px-12 py-4 md:py-6 flex justify-between items-center ${isScrolled ? 'glass shadow-premium border-b border-slate-100' : 'bg-transparent'}`}>
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-text-main rounded-xl flex items-center justify-center text-surface shadow-lg">
               <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black uppercase tracking-[0.3em] text-[9px] md:text-[11px]">Studio Signature</span>
         </div>
         <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
              className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors"
            >
              Programme
            </button>
            <button 
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 md:px-10 py-3 md:py-4 bg-primary text-white rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all"
            >
              S'inscrire
            </button>
         </div>
      </nav>

      {/* Hero Dynamique - Adapté au Cours */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 z-0">
           <img 
             src={course.coverImage || "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=2000"} 
             className="w-full h-full object-cover scale-105 opacity-20 blur-[2px]" 
             alt="Background"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-surface via-transparent to-surface"></div>
        </div>

        <div className="container-main relative z-10 text-center space-y-10 md:space-y-16">
           <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
              <span className="inline-block px-4 py-2 bg-white/50 backdrop-blur-md border border-slate-100 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-8 shadow-sm">
                Publication Exclusive MMXXV
              </span>
              <h1 className="editorial-title text-4xl md:text-6xl lg:text-8xl leading-[1.1] tracking-tighter mb-8 max-w-5xl mx-auto">
                {course.title}
              </h1>
              <p className="text-lg md:text-2xl text-text-muted max-w-3xl mx-auto font-medium leading-relaxed italic opacity-70">
                {course.subtitle}
              </p>
           </div>

           <div className="flex flex-wrap justify-center gap-6 md:gap-12 animate-in fade-in duration-1000 delay-500">
              <div className="flex items-center gap-3">
                 <BookOpen className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{totalLessons} Leçons</span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                 <Clock className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Rythme Libre</span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex items-center gap-3">
                 <Award className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Certification</span>
              </div>
           </div>
        </div>
      </section>

      {/* Section : L'Essentiel (Bénéfices) */}
      <section className="py-24 md:py-40 bg-white border-y border-slate-50 px-6">
         <div className="container-main">
            <div className="text-center mb-24 space-y-6">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">La Promesse</span>
               <h2 className="editorial-title text-4xl md:text-6xl">L'Essentiel de l'Apprentissage.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {[
                 { title: "Maîtrise Totale", desc: "Acquérez des compétences pratiques immédiatement applicables dès la fin du premier module.", icon: <Zap /> },
                 { title: "Design Immersif", desc: "Profitez d'une interface épurée qui favorise la mémorisation et réduit la fatigue cognitive.", icon: <Layout /> },
                 { title: "Ressources IA", desc: "Accédez à des guides audio et des visuels générés sur mesure pour illustrer chaque concept.", icon: <Sparkles /> }
               ].map((item, i) => (
                 <div key={i} className="p-10 rounded-[3rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all group shadow-sm hover:shadow-luxury">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary mb-8 shadow-md group-hover:scale-110 transition-transform">
                       {item.icon}
                    </div>
                    <h4 className="text-2xl font-black tracking-tighter mb-4">{item.title}</h4>
                    <p className="text-slate-400 font-medium leading-relaxed italic">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Section : Témoignages Premium */}
      <section className="py-24 md:py-40 bg-slate-50 overflow-hidden px-6">
         <div className="container-main">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-32 gap-8">
               <div className="space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Expériences</span>
                  <h2 className="editorial-title text-5xl md:text-7xl">Signatures.</h2>
               </div>
               <p className="text-lg md:text-xl text-slate-400 font-medium max-w-sm italic">
                 Ce que nos membres disent de leur immersion dans le Studio.
               </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {testimonials.map((test, i) => (
                  <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-premium border border-slate-50 relative group hover:shadow-luxury transition-all">
                     <Quote className="absolute top-8 right-10 w-16 h-16 text-slate-100 group-hover:text-primary/10 transition-colors" />
                     <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                        <p className="text-xl text-slate-600 font-medium italic leading-relaxed">"{test.content}"</p>
                        <div className="flex items-center gap-4 pt-8 border-t border-slate-50">
                           <img src={test.avatar} className="w-14 h-14 rounded-full border-2 border-primary/20" alt={test.name} />
                           <div>
                              <p className="text-sm font-black uppercase tracking-widest text-slate-900">{test.name}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary">{test.role}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Curriculum - Sommaire */}
      <section id="curriculum" className="py-24 md:py-40 bg-slate-900 text-surface px-6">
         <div className="container-main">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 md:mb-32 gap-8">
               <div className="space-y-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Le Programme</span>
                  <h2 className="editorial-title text-5xl md:text-7xl">Architecture.</h2>
               </div>
               <p className="text-xl text-slate-400 font-light max-w-sm italic">
                  Une progression sensorielle à travers {course.modules.length} chapitres conçus pour l'excellence.
               </p>
            </div>

            <div className="space-y-6">
               {course.modules.map((mod, idx) => (
                  <div key={idx} className="group bg-white/5 border border-white/10 rounded-[3rem] p-10 hover:bg-white/10 transition-all">
                     <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
                        <div className="text-4xl font-black text-primary/40 italic min-w-[80px]">0{idx + 1}</div>
                        <div className="flex-grow">
                           <h3 className="text-3xl font-black tracking-tighter mb-4">{mod.title}</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {mod.lessons.map((lesson, lIdx) => (
                                 <div key={lIdx} className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                                    <div className="w-2 h-2 rounded-full bg-primary/40"></div>
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

      {/* Inscription Finale */}
      <section id="registration" className="py-24 md:py-60 container-main px-6">
         <div className="glass p-10 md:p-24 rounded-[4rem] md:rounded-[6rem] shadow-luxury border border-white/50 text-center space-y-12">
            <h2 className="editorial-title text-5xl md:text-8xl lg:text-9xl leading-none">Incarnez <br /><span className="text-primary italic">le Savoir.</span></h2>
            <p className="text-xl md:text-3xl text-slate-400 font-light max-w-2xl mx-auto italic">
              Rejoignez le cercle fermé des élèves du Studio. L'accès est immédiat et permanent.
            </p>
            <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
               <input 
                 type="email" 
                 placeholder="votre@email.com" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="flex-grow p-6 md:p-8 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:border-primary/40 transition-all text-xl font-medium shadow-inner"
               />
               <button 
                 onClick={() => { if(email.includes('@')) setIsRegistered(true); window.scrollTo(0,0); }}
                 className="px-12 py-6 md:py-0 bg-primary text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
               >
                 Réserver mon accès
               </button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 pt-8">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Paiement Sécurisé
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500" /> Garantie 30 Jours
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-50 px-6 text-center">
         <div className="flex flex-col items-center gap-8">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
               <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[1em] text-slate-200">STUDIO • MMXXV</p>
         </div>
      </footer>
    </div>
  );
};
