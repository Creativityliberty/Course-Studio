
import React, { useState } from 'react';
import { Plus, GripVertical, Play, Type, HelpCircle, Save, CheckCircle, Sparkles, Wand2, Layers, MoreVertical, Pencil } from 'lucide-react';
import { ContentBlockType, Module, Lesson } from '../types';
import { AIStudioAgent } from './AIStudioAgent';
import { LessonEditor } from './LessonEditor';

export const CourseBuilder: React.FC = () => {
  const [showAgent, setShowAgent] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [courseMeta, setCourseMeta] = useState({ title: 'Nouvelle Formation', subtitle: '' });
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

  const handleAICourseImport = (aiData: any) => {
    setCourseMeta({ title: aiData.title, subtitle: aiData.subtitle });
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
    const newModule: Module = {
      id: `m${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      order: modules.length + 1,
      lessons: []
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [...m.lessons, { id: `l${Date.now()}`, title: 'Nouvelle Leçon', blocks: [] }]
        };
      }
      return m;
    }));
  };

  if (showAgent) {
    return (
      <div className="container-main py-12 animate-in fade-in duration-500">
        <button 
          onClick={() => setShowAgent(false)}
          className="mb-8 text-sm font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Retour au Builder manuel
        </button>
        <AIStudioAgent onCourseGenerated={handleAICourseImport} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div className="flex-grow max-w-2xl">
          <div className="flex items-center gap-4 mb-3">
             <div className="p-3 bg-primary/10 text-primary rounded-2xl">
               <Pencil className="w-5 h-5" />
             </div>
             <input
                className="text-4xl font-black tracking-tighter text-slate-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full placeholder:text-slate-200"
                value={courseMeta.title}
                onChange={(e) => setCourseMeta({...courseMeta, title: e.target.value})}
                placeholder="Titre de la formation"
              />
          </div>
          <textarea
            className="text-slate-500 font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full resize-none leading-relaxed"
            value={courseMeta.subtitle}
            onChange={(e) => setCourseMeta({...courseMeta, subtitle: e.target.value})}
            placeholder="Ajoutez une description courte pour vos élèves..."
            rows={2}
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-7 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Save className="w-4 h-4" /> Brouillon
          </button>
          <button className="flex items-center gap-2 px-7 py-4 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95">
            <CheckCircle className="w-4 h-4" /> Publier
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 flex flex-col gap-10">
          {modules.map((module) => (
            <div key={module.id} className="bg-white rounded-[3rem] p-10 shadow-premium border border-slate-50 group transition-all hover:shadow-luxury relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4 flex-grow">
                  <div className="cursor-grab text-slate-200 hover:text-primary transition-colors">
                    <GripVertical className="w-6 h-6" />
                  </div>
                  <input
                    className="text-2xl font-black bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full text-slate-800"
                    defaultValue={module.title}
                  />
                </div>
                <button 
                  onClick={() => addLesson(module.id)}
                  className="w-10 h-10 flex items-center justify-center bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm group/btn"
                >
                  <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="space-y-4">
                {module.lessons.map((lesson) => (
                  <div key={lesson.id} className="group/lesson bg-slate-50/40 border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between hover:border-primary/30 hover:bg-white transition-all shadow-sm cursor-pointer" onClick={() => setEditingLesson(lesson)}>
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 flex items-center justify-center bg-white text-slate-300 rounded-2xl shadow-sm group-hover/lesson:bg-primary/10 group-hover/lesson:text-primary transition-all">
                        <Play className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-700 group-hover/lesson:text-slate-900 transition-colors">{lesson.title}</h5>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1 block">LEÇON VIDÉO</span>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover/lesson:opacity-100 transition-all flex items-center gap-2">
                       <div className="p-2 text-slate-300 hover:text-primary transition-colors">
                          <MoreVertical className="w-5 h-5" />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={addModule}
            className="w-full py-12 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400 font-bold hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 group"
          >
            <Plus className="w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="uppercase tracking-[0.2em] text-[10px] font-black">Nouveau Module Manuel</span>
          </button>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 flex flex-col gap-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-slate-50 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
                  <Sparkles className="w-24 h-24 text-primary" />
               </div>
               <h3 className="text-xl font-black mb-2 text-primary tracking-tight">Agent Studio Chef</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  L'IA va maintenant chercher des vidéos réelles et rédiger tout votre contenu pédagogique automatiquement.
               </p>
               <button 
                  onClick={() => setShowAgent(true)}
                  className="w-full py-4 bg-primary text-white rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98]"
               >
                  Planifier avec l'IA
               </button>
            </div>
          </div>
        </div>
      </div>

      {editingLesson && (
        <LessonEditor 
          lesson={editingLesson}
          courseTitle={courseMeta.title}
          onSave={handleSaveLesson}
          onClose={() => setEditingLesson(null)}
        />
      )}
    </div>
  );
};
