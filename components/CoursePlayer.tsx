
import React, { useState } from 'react';
/* Added HelpCircle to the imports from lucide-react to fix the "Cannot find name 'HelpCircle'" error */
import { ChevronLeft, PlayCircle, FileText, CheckCircle2, ChevronRight, X, User, Trophy, HelpCircle } from 'lucide-react';
import { Module, Lesson, ContentBlockType } from '../types';

interface CoursePlayerProps {
  course: { title: string; modules: Module[] };
  onClose: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onClose }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(course.modules[0]?.lessons[0] || null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1]?.split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const toggleComplete = (id: string) => {
    const next = new Set(completedLessons);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompletedLessons(next);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex animate-in fade-in duration-500 font-sans">
      {/* Sidebar Navigation */}
      <div className="w-80 h-full bg-white border-r border-slate-100 flex flex-col shadow-xl">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="text-right">
             <p className="text-[10px] font-black text-primary uppercase tracking-widest">Aperçu Étudiant</p>
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-tighter truncate w-32">{course.title}</h4>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-8 no-scrollbar">
          {course.modules.map((mod, mIdx) => (
            <div key={mod.id}>
              <h5 className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Module {mIdx + 1}</h5>
              <div className="space-y-2">
                {mod.lessons.map((less) => (
                  <button 
                    key={less.id}
                    onClick={() => setActiveLesson(less)}
                    className={`w-full p-4 rounded-2xl flex items-start gap-4 transition-all text-left ${activeLesson?.id === less.id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`mt-0.5 ${completedLessons.has(less.id) ? 'text-emerald-500' : activeLesson?.id === less.id ? 'text-primary' : 'text-slate-200'}`}>
                      {completedLessons.has(less.id) ? <CheckCircle2 className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold leading-tight ${activeLesson?.id === less.id ? 'text-primary' : 'text-slate-600'}`}>{less.title}</p>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1 block">5 min</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300">
                 <Trophy className="w-5 h-5" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progression</p>
                 <p className="text-sm font-black text-slate-700">{completedLessons.size} / {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)}</p>
              </div>
           </div>
           <div className="h-1.5 w-full bg-white rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(completedLessons.size / course.modules.reduce((acc, m) => acc + m.lessons.length, 0)) * 100}%` }}></div>
           </div>
        </div>
      </div>

      {/* Main Content View */}
      <div className="flex-grow h-full overflow-y-auto bg-white flex flex-col scroll-smooth no-scrollbar">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full px-12 py-20">
            <header className="mb-16">
               <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Leçon Active</span>
               <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 leading-[1.1]">{activeLesson.title}</h1>
               <p className="text-slate-400 text-lg font-medium">Découvrez les concepts clés de cette unité pédagogique.</p>
            </header>

            <div className="space-y-16">
              {activeLesson.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {block.type === ContentBlockType.VIDEO && block.payload?.url && (
                    <div className="aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-luxury">
                       <iframe 
                        src={getEmbedUrl(block.payload.url)!} 
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                       />
                    </div>
                  )}

                  {block.type === ContentBlockType.TEXT && (
                    <div className="prose prose-slate prose-lg max-w-none">
                       <h3 className="text-2xl font-black text-slate-800 mb-6 tracking-tight">{block.title}</h3>
                       <div className="text-slate-600 leading-[1.8] whitespace-pre-wrap font-medium">
                          {block.content}
                       </div>
                    </div>
                  )}

                  {block.type === ContentBlockType.QUIZ && block.payload?.questions && (
                    <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-100 shadow-sm">
                       <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                             <HelpCircle className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="text-xl font-black tracking-tight">{block.title}</h4>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Testez vos connaissances</p>
                          </div>
                       </div>
                       <div className="space-y-10">
                          {block.payload.questions.map((q, idx) => (
                            <div key={idx}>
                               <p className="text-lg font-black text-slate-800 mb-6 leading-tight">{idx + 1}. {q.question}</p>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {q.options.map((opt, oIdx) => (
                                    <button key={oIdx} className="p-6 bg-white border border-slate-100 rounded-3xl text-left font-bold text-slate-600 hover:border-primary/40 hover:bg-primary/5 transition-all active:scale-95 shadow-sm">
                                       {opt}
                                    </button>
                                  ))}
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-24 pt-12 border-t border-slate-100 flex items-center justify-between">
               <button onClick={() => toggleComplete(activeLesson.id)} className={`px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 ${completedLessons.has(activeLesson.id) ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-primary'}`}>
                  {completedLessons.has(activeLesson.id) ? <CheckCircle2 className="w-5 h-5" /> : null}
                  {completedLessons.has(activeLesson.id) ? 'Leçon Complétée' : 'Marquer comme terminée'}
               </button>
               <button className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-primary transition-colors group">
                  Leçon Suivante <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-20">
             <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8">
                <FileText className="w-10 h-10 text-slate-200" />
             </div>
             <h2 className="text-3xl font-black text-slate-300 tracking-tighter">Sélectionnez une leçon pour commencer</h2>
          </div>
        )}
      </div>
    </div>
  );
};
