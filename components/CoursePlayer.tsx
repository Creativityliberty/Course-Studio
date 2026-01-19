
import React, { useState } from 'react';
import { ChevronLeft, PlayCircle, FileText, CheckCircle2, ChevronRight, X, Trophy, HelpCircle, ExternalLink, Book, Image as ImageIcon, Info } from 'lucide-react';
import { Module, Lesson, ContentBlockType } from '../types';

interface CoursePlayerProps {
  course: { title: string; modules: Module[] };
  onClose: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onClose }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(course.modules[0]?.lessons[0] || null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  // Fonction pour nettoyer le texte des astérisques de l'IA
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1]?.split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('vimeo.com/')) videoId = url.split('vimeo.com/')[1];
    return videoId ? (url.includes('vimeo') ? `https://player.vimeo.com/video/${videoId}` : `https://www.youtube.com/embed/${videoId}`) : null;
  };

  const toggleComplete = (id: string) => {
    const next = new Set(completedLessons);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompletedLessons(next);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex animate-in fade-in duration-500 font-sans text-slate-900">
      {/* Sidebar Navigation inspired by screenshot 2 */}
      <div className="w-80 h-full bg-white border-r border-slate-50 flex flex-col">
        <div className="p-8 flex items-center justify-between">
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all">
            <ChevronLeft className="w-5 h-5 text-slate-300" />
          </button>
          <div className="text-right">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Étudiant</p>
             <h4 className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter truncate w-32">{course.title}</h4>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto px-4 py-8 space-y-10 no-scrollbar">
          {course.modules.map((mod, mIdx) => (
            <div key={mod.id}>
              <h5 className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4">Module {mIdx + 1}</h5>
              <div className="space-y-1">
                {mod.lessons.map((less) => (
                  <button 
                    key={less.id} 
                    onClick={() => setActiveLesson(less)} 
                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left group ${activeLesson?.id === less.id ? 'bg-primary/5' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${activeLesson?.id === less.id ? 'bg-white border-primary text-primary shadow-sm' : 'border-slate-100 text-slate-200 group-hover:border-primary group-hover:text-primary'}`}>
                      <PlayCircle className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-bold tracking-tight ${activeLesson?.id === less.id ? 'text-primary' : 'text-slate-500'}`}>{less.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content View with Huge Typography */}
      <div className="flex-grow h-full overflow-y-auto bg-white flex flex-col scroll-smooth no-scrollbar border-l border-slate-50">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full px-12 py-20">
            <header className="mb-20">
               <span className="px-6 py-2.5 bg-indigo-50 text-primary rounded-xl text-[10px] font-black uppercase tracking-[0.2em] mb-8 inline-block">Unité d'apprentissage</span>
               <h1 className="text-[5.5rem] font-black text-slate-900 tracking-tighter mb-4 leading-[0.9]">{activeLesson.title}</h1>
            </header>

            <div className="space-y-24">
              {activeLesson.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                  
                  {/* Block Title Cleanup */}
                  {block.type !== ContentBlockType.IMAGE && (
                    <h2 className="text-5xl font-black text-slate-900 mb-10 tracking-tight leading-tight">{cleanText(block.title)}</h2>
                  )}

                  {/* Image Block */}
                  {block.type === ContentBlockType.IMAGE && block.payload?.imageUrl && (
                    <div className="rounded-[3.5rem] overflow-hidden shadow-luxury">
                      <img src={block.payload.imageUrl} className="w-full h-auto" alt={block.payload.imagePrompt} />
                    </div>
                  )}

                  {/* Video Block */}
                  {block.type === ContentBlockType.VIDEO && (block.payload?.videoUrls?.[0] || block.payload?.url) && (
                    <div className="aspect-video bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-luxury">
                       <iframe src={getEmbedUrl(block.payload?.videoUrls?.[0] || block.payload?.url!)!} className="w-full h-full border-0" allowFullScreen />
                    </div>
                  )}

                  {/* Text Block Clean Rendering */}
                  {block.type === ContentBlockType.TEXT && (
                    <div className="space-y-12">
                       <div className="text-2xl font-medium text-slate-500 leading-[1.6] whitespace-pre-wrap tracking-tight">
                          {cleanText(block.content)}
                       </div>
                       {block.payload?.glossary && (
                         <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100">
                           <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8">Glossaire de la leçon</h4>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              {block.payload.glossary.map((g, i) => (
                                <div key={i}>
                                  <p className="font-black text-primary text-xs uppercase mb-3 tracking-widest">{g.term}</p>
                                  <p className="text-xs text-slate-400 leading-relaxed font-medium">{g.definition}</p>
                                </div>
                              ))}
                           </div>
                         </div>
                       )}
                    </div>
                  )}

                  {/* Resource Block */}
                  {block.type === ContentBlockType.RESOURCE && block.payload?.resources && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {block.payload.resources.map((res, i) => (
                        <a key={i} href={res.url} target="_blank" className="p-8 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-between hover:border-primary/20 transition-all shadow-sm group">
                            <div className="flex items-center gap-5">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all"><ExternalLink className="w-5 h-5" /></div>
                              <span className="font-black text-slate-900 tracking-tight">{res.label}</span>
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-200">{res.type}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-40 py-12 border-t border-slate-100 flex justify-center">
               <button onClick={() => toggleComplete(activeLesson.id)} className={`px-16 py-8 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all hover:scale-105 active:scale-95 ${completedLessons.has(activeLesson.id) ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-900 text-white hover:bg-primary shadow-slate-200'}`}>
                  {completedLessons.has(activeLesson.id) ? '✓ Leçon Terminée' : 'Finaliser la leçon'}
               </button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-100 p-20">
            <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-10">
              <FileText className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-slate-200">En attente de sélection</h2>
          </div>
        )}
      </div>
    </div>
  );
};
