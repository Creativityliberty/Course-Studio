
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ArrowUpRight } from 'lucide-react';

export const FormationsPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('published_courses') || '[]');
    setCourses(saved);
  }, []);
  
  return (
    <div className="container-main pt-32 pb-40 px-6">
      <header className="mb-32 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Le catalogue</span>
           <h1 className="editorial-title text-6xl md:text-[10rem] text-slate-900 leading-none">Bibliothèque.</h1>
        </div>
        <p className="text-2xl text-slate-400 font-medium max-w-sm italic">
          Découvrez les dernières masterclass créées par la communauté du studio.
        </p>
      </header>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {courses.map((course: any) => (
            <Link to={`/share/${course.id}`} key={course.id} className="group flex flex-col gap-8">
              <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-luxury relative">
                <img 
                  src={course.coverImage || `https://picsum.photos/800/1000?random=${course.id}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={course.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <ArrowUpRight className="w-6 h-6 text-slate-900" />
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Série Signature</span>
                   <div className="flex items-center gap-2 text-slate-300 text-[9px] font-black uppercase tracking-widest">
                      <Clock className="w-3 h-3" /> 4h 30m
                   </div>
                </div>
                <h3 className="text-4xl font-black tracking-tighter leading-none group-hover:text-primary transition-colors">{course.title}</h3>
                <p className="text-lg text-slate-400 font-medium line-clamp-2 italic leading-snug">"{course.subtitle}"</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-40 border-2 border-dashed border-slate-100 rounded-[5rem] text-center flex flex-col items-center gap-8">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
             <BookOpen className="w-10 h-10" />
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
