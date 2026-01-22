
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, GripVertical, Play, Save, CheckCircle, Sparkles, Pencil, Eye, Share2, Copy, X, Check, Loader2, ArrowLeft } from 'lucide-react';
import { ContentBlockType, Module, Lesson, Course, CourseStatus } from '../types';
import { AIStudioAgent } from './AIStudioAgent';
import { LessonEditor } from './LessonEditor';
import { CoursePlayer } from './CoursePlayer';

export const CourseBuilder: React.FC = () => {
  const [showAgent, setShowAgent] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const [courseMeta, setCourseMeta] = useState({ 
    id: `c-${Date.now()}`,
    title: 'Nouvelle Formation', 
    subtitle: 'Description de votre masterclass...',
    coverImage: `https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=1200`
  });
  
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'm1',
      title: "Module 1 : Introduction",
      order: 1,
      lessons: [
        { id: 'l1', title: "Bienvenue dans le Studio", blocks: [] }
      ]
    }
  ]);

  useEffect(() => {
    const draft = { meta: courseMeta, modules };
    localStorage.setItem('studio_draft', JSON.stringify(draft));
  }, [courseMeta, modules]);

  const handlePublish = () => {
    setIsPublishing(true);
    
    const newCourse: Course = {
      id: courseMeta.id,
      title: courseMeta.title,
      subtitle: courseMeta.subtitle,
      coverImage: courseMeta.coverImage,
      status: CourseStatus.PUBLISHED,
      modules: modules
    };

    const existing = JSON.parse(localStorage.getItem('published_courses') || '[]');
    const updated = [newCourse, ...existing.filter((c: any) => c.id !== newCourse.id)];
    localStorage.setItem('published_courses', JSON.stringify(updated));

    const url = `${window.location.origin}${window.location.pathname}#/share/${newCourse.id}`;
    setPublishedUrl(url);

    setTimeout(() => {
      setIsPublishing(false);
      setShowShareModal(true);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAICourseImport = (aiData: any) => {
    // Importation du titre, sous-titre ET de l'image générée par l'IA
    setCourseMeta({ 
      ...courseMeta, 
      title: aiData.title, 
      subtitle: aiData.subtitle,
      coverImage: aiData.coverImage || courseMeta.coverImage
    });

    const formattedModules: Module[] = aiData.modules.map((m: any, idx: number) => ({
      id: `ai-m-${idx}`,
      title: m.title,
      order: idx + 1,
      lessons: m.lessons.map((l: any, lIdx: number) => ({
        id: `ai-l-${idx}-${lIdx}`,
        title: l.title,
        blocks: [{ id: `ai-b-${idx}-${lIdx}`, type: l.contentType as ContentBlockType, title: 'Introduction', content: l.description || '' }]
      }))
    }));
    setModules(formattedModules);
    setShowAgent(false);
  };

  const handleSaveLesson = (updatedLesson: Lesson) => {
    setModules(prev => prev.map(m => ({
      ...m,
      lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l)
    })));
  };

  const addModule = () => {
    const newModule: Module = { id: `m${Date.now()}`, title: `Module ${modules.length + 1}`, order: modules.length + 1, lessons: [] };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: [...m.lessons, { id: `l${Date.now()}`, title: 'Nouvelle Unité', blocks: [] }] };
      }
      return m;
    }));
  };

  if (showAgent) {
    return (
      <div className="container-main py-20 animate-in fade-in duration-500">
        <button onClick={() => setShowAgent(false)} className="mb-12 text-[10px] font-black text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group uppercase tracking-[0.3em]">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Retour au Builder manuel
        </button>
        <AIStudioAgent onCourseGenerated={handleAICourseImport} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 relative">
      <button 
        onClick={() => navigate('/')} 
        className="mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quitter le Studio
      </button>

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-32">
        <div className="flex-grow max-w-3xl space-y-6">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center flex-shrink-0 shadow-xl shadow-primary/10 overflow-hidden">
                <img src={courseMeta.coverImage} className="w-full h-full object-cover" alt="Cover thumbnail" />
             </div>
             <div className="flex-grow">
                <input 
                  className="editorial-title text-6xl md:text-8xl text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full tracking-tighter" 
                  value={courseMeta.title} 
                  onChange={(e) => setCourseMeta({...courseMeta, title: e.target.value})} 
                  placeholder="Titre de la formation" 
                />
             </div>
          </div>
          <textarea 
            className="text-2xl text-slate-400 font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full resize-none leading-relaxed italic" 
            value={courseMeta.subtitle} 
            onChange={(e) => setCourseMeta({...courseMeta, subtitle: e.target.value})} 
            placeholder="Écrivez le sous-titre de votre masterclass..." 
            rows={2} 
          />
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => setIsPreviewMode(true)} className="group flex items-center gap-3 px-10 py-6 bg-white border border-slate-100 rounded-[2rem] text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Eye className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" /> Aperçu Studio
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-3 px-10 py-6 bg-primary text-white rounded-[2rem] text-[10px] font-black hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 uppercase tracking-[0.3em]"
          >
            {isPublishing ? <><Loader2 className="w-5 h-5 animate-spin" /> Publication...</> : <><CheckCircle className="w-5 h-5" /> Publier</>}
          </button>
        </div>
      </header>

      {/* List of modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 flex flex-col gap-12">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-[4rem] p-16 shadow-premium border border-slate-50 group transition-all hover:shadow-luxury relative overflow-hidden">
              <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-6 flex-grow">
                  <div className="cursor-grab text-slate-200 hover:text-primary transition-colors p-2"><GripVertical className="w-8 h-8" /></div>
                  <input className="text-4xl font-black bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full text-slate-900 tracking-tighter" defaultValue={module.title} />
                </div>
                <button onClick={() => addLesson(module.id)} className="w-16 h-16 flex items-center justify-center bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-3xl transition-all shadow-sm group-hover:scale-110"><Plus className="w-8 h-8" /></button>
              </div>

              <div className="space-y-6">
                {module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className="group/lesson bg-slate-50/40 border border-slate-100 p-10 rounded-[3rem] flex items-center justify-between hover:border-primary/30 hover:bg-white transition-all shadow-sm cursor-pointer" 
                    onClick={() => setEditingLesson(lesson)}
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 flex items-center justify-center bg-white text-slate-300 rounded-[1.5rem] shadow-sm group-hover/lesson:bg-primary/10 group-hover/lesson:text-primary transition-all duration-500">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                      <div>
                        <h5 className="text-2xl font-black text-slate-800 group-hover/lesson:text-slate-900 transition-colors tracking-tight">{lesson.title}</h5>
                        <div className="flex items-center gap-4 mt-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Masterclass Unité</span>
                           <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                           <span className="text-[10px] font-black text-primary uppercase tracking-widest">{lesson.blocks.length} Blocs</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button onClick={addModule} className="w-full py-24 border-2 border-dashed border-slate-100 rounded-[4rem] text-slate-300 font-bold hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-6 group">
            <div className="w-20 h-20 rounded-full border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform"><Plus className="w-10 h-10" /></div>
            <span className="uppercase tracking-[0.5em] text-[10px] font-black">Ajouter un nouveau chapitre</span>
          </button>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 flex flex-col gap-12">
            <div className="bg-slate-900 text-white p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><Sparkles className="w-40 h-40" /></div>
               <div className="relative z-10 space-y-8">
                 <h3 className="text-4xl font-black leading-none tracking-tighter">Chef de Studio IA</h3>
                 <p className="text-xl text-slate-400 font-medium leading-relaxed italic">"Architecture et Identité visuelle générées pour vous."</p>
                 <button onClick={() => setShowAgent(true)} className="w-full py-6 bg-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-primary-dark transition-all hover:scale-105">Lancer la génération</button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="max-w-xl w-full bg-white rounded-[5rem] p-20 shadow-2xl relative animate-in zoom-in-95 duration-700 text-center">
              <button onClick={() => setShowShareModal(false)} className="absolute top-12 right-12 text-slate-200 hover:text-slate-900 transition-colors"><X className="w-10 h-10" /></button>
              <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-12 mx-auto shadow-xl shadow-emerald-500/5">
                 <Share2 className="w-12 h-12" />
              </div>
              <h3 className="editorial-title text-7xl text-slate-900 mb-6 leading-none">C'est public.</h3>
              <p className="text-xl text-slate-400 font-medium mb-16 leading-relaxed italic">Votre formation est maintenant prête avec son identité visuelle unique.</p>
              
              <div className="p-4 bg-slate-50 rounded-[2.5rem] flex items-center gap-4 border border-slate-100 mb-12 group">
                 <input readOnly value={publishedUrl} className="flex-grow bg-transparent border-none focus:outline-none px-6 text-xs font-bold text-slate-400 truncate" />
                 <button onClick={copyToClipboard} className="p-6 bg-white rounded-3xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                   {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6" />}
                 </button>
              </div>

              <div className="flex flex-col gap-4">
                 <Link to={`/share/${courseMeta.id}`} className="w-full py-8 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-2xl shadow-slate-200">Voir la Landing Page</Link>
              </div>
           </div>
        </div>
      )}

      {editingLesson && (
        <LessonEditor lesson={editingLesson} courseTitle={courseMeta.title} onSave={handleSaveLesson} onClose={() => setEditingLesson(null)} />
      )}

      {isPreviewMode && (
        <CoursePlayer course={{ title: courseMeta.title, modules: modules }} onClose={() => setIsPreviewMode(false)} />
      )}
    </div>
  );
};
