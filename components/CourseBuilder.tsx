
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plus, GripVertical, Play, Save, CheckCircle, 
  Sparkles, Eye, Share2, Copy, X, Check, 
  Loader2, ArrowLeft, MoreHorizontal 
} from 'lucide-react';
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
    title: 'Maîtrise de l\'IA', 
    subtitle: 'Devenez un expert en pilotage de LLMs, de la rédaction de prompts au déploiement agentique.',
    coverImage: `https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200`
  });
  
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'm1',
      title: "Module 1 : Fondamentaux et Architecture",
      order: 1,
      lessons: [
        { id: 'l1', title: "L'Anatomie d'un Prompt Parfait", blocks: [] }
      ]
    }
  ]);

  useEffect(() => {
    const draft = { meta: courseMeta, modules };
    localStorage.setItem('studio_draft', JSON.stringify(draft));
  }, [courseMeta, modules]);

  const copyToClipboard = () => {
    if (!publishedUrl) return;
    navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    
    setTimeout(() => {
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
      setIsPublishing(false);
      setShowShareModal(true);
    }, 2500);
  };

  const handleAICourseImport = (aiData: any) => {
    setCourseMeta({ 
      ...courseMeta, 
      title: aiData.title || courseMeta.title, 
      subtitle: aiData.subtitle || courseMeta.subtitle,
      coverImage: aiData.coverImage || courseMeta.coverImage
    });
    if (aiData.modules) setModules(aiData.modules);
    setShowAgent(false);
  };

  const handleSaveLesson = (updatedLesson: Lesson) => {
    setModules(prev => prev.map(m => ({
      ...m,
      lessons: m.lessons.map(l => l.id === updatedLesson.id ? updatedLesson : l)
    })));
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
    <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-20">
      <button 
        onClick={() => navigate('/')} 
        className="mb-20 flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quitter le Studio
      </button>

      <header className="flex flex-col xl:flex-row justify-between items-start gap-12 mb-40">
        <div className="flex-grow max-w-5xl space-y-10">
          <div className="flex items-center gap-8">
             <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl ring-4 ring-white flex-shrink-0">
                <img src={courseMeta.coverImage} className="w-full h-full object-cover" alt="Course Cover" />
             </div>
             <div className="flex-grow">
                <input 
                  className="editorial-title text-7xl md:text-8xl lg:text-[7.5rem] text-slate-900 bg-transparent border-none focus:outline-none p-0 w-full tracking-tighter leading-[0.8]" 
                  value={courseMeta.title} 
                  onChange={(e) => setCourseMeta({...courseMeta, title: e.target.value})} 
                />
             </div>
          </div>
          <textarea 
            className="text-2xl md:text-3xl text-slate-400 font-medium bg-transparent border-none focus:outline-none p-0 w-full resize-none leading-tight italic" 
            value={courseMeta.subtitle} 
            onChange={(e) => setCourseMeta({...courseMeta, subtitle: e.target.value})} 
            rows={2}
          />
        </div>
        
        <div className="flex items-center gap-6 pt-4">
          <button 
            onClick={() => setIsPreviewMode(true)} 
            className="px-10 py-8 bg-slate-100/60 text-slate-600 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.25em] hover:bg-slate-200 transition-all flex items-center gap-4"
          >
            <Eye className="w-5 h-5 opacity-40" /> Aperçu Studio
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-14 py-8 bg-[#4f46e5] text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-primary/30 hover:scale-105 transition-all flex items-center gap-4 disabled:opacity-80"
          >
            {isPublishing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Publication...</>
            ) : (
              <><Play className="w-4 h-4 fill-current" /> Publication...</>
            )}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-12">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-[4rem] p-16 shadow-premium border border-slate-50 group transition-all relative">
               <div className="flex items-center justify-between mb-16">
                <div className="flex items-center gap-8 flex-grow">
                  <div className="cursor-grab text-slate-200 hover:text-primary transition-colors p-2"><GripVertical className="w-8 h-8 opacity-40" /></div>
                  <input className="text-4xl font-black bg-transparent border-none focus:outline-none p-0 w-full text-slate-900 tracking-tighter" defaultValue={module.title} />
                </div>
                <button className="w-16 h-16 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-primary hover:text-white rounded-3xl transition-all"><Plus className="w-8 h-8" /></button>
              </div>

              <div className="space-y-6">
                {module.lessons.map((lesson) => (
                  <div 
                    key={lesson.id} 
                    className="bg-slate-50/40 border border-slate-100 p-10 rounded-[3rem] flex items-center justify-between hover:border-primary/30 hover:bg-white transition-all shadow-sm cursor-pointer" 
                    onClick={() => setEditingLesson(lesson)}
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 flex items-center justify-center bg-white text-slate-300 rounded-[1.5rem] shadow-sm group-hover:bg-primary/10 transition-all">
                        <Play className="w-6 h-6 fill-current" />
                      </div>
                      <h5 className="text-2xl font-black text-slate-800 tracking-tight">{lesson.title}</h5>
                    </div>
                    <MoreHorizontal className="w-6 h-6 text-slate-200" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
           <div className="sticky top-40">
              <div className="bg-[#0f172a] text-white p-16 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-10 scale-150 rotate-12 transition-transform duration-1000 group-hover:rotate-0">
                    <Sparkles className="w-40 h-40" />
                 </div>
                 <div className="relative z-10 space-y-10">
                    <h3 className="text-5xl font-black tracking-tighter leading-none">Chef de <br /> Studio IA</h3>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed italic">
                      "Architecture et Identité visuelle générées pour vous."
                    </p>
                    <button 
                      onClick={() => setShowAgent(true)}
                      className="w-full py-7 bg-primary text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all"
                    >
                      Lancer la génération
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="max-w-xl w-full bg-white rounded-[5rem] p-20 shadow-2xl relative animate-in zoom-in-95 duration-700 text-center border border-white/40">
              <button onClick={() => setShowShareModal(false)} className="absolute top-12 right-12 text-slate-200 hover:text-slate-900 transition-colors"><X className="w-10 h-10" /></button>
              <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-12 mx-auto shadow-xl">
                 <Share2 className="w-12 h-12" />
              </div>
              <h3 className="editorial-title text-7xl text-slate-900 mb-6">C'est public.</h3>
              <p className="text-xl text-slate-400 font-medium mb-16 italic leading-relaxed">Votre formation est maintenant accessible avec son identité visuelle unique.</p>
              
              <div className="p-5 bg-slate-50 rounded-[2.5rem] flex items-center gap-4 border border-slate-100 mb-12">
                 <input readOnly value={publishedUrl} className="flex-grow bg-transparent border-none focus:outline-none px-4 text-xs font-bold text-slate-400 truncate" />
                 <button onClick={copyToClipboard} className="p-5 bg-white rounded-3xl text-primary hover:bg-primary hover:text-white transition-all shadow-sm">
                   {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Copy className="w-6 h-6" />}
                 </button>
              </div>

              <Link to={`/share/${courseMeta.id}`} className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-primary transition-all shadow-2xl block">
                Voir la Landing Page
              </Link>
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
