
import React, { useState, useRef } from 'react';
import { Sparkles, Loader2, BookOpen, Layers, Play, ImageIcon } from 'lucide-react';
import { generateCourseWithSearch, generateAIImage, generateDetailedLessonContent } from '../services/geminiService';
import { ContentBlockType, Module } from '../types';

interface AIStudioAgentProps {
  onCourseGenerated: (courseData: any) => void;
}

export const AIStudioAgent: React.FC<AIStudioAgentProps> = ({ onCourseGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const handleDeepGeneration = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedPreview(null);
    setProgress(5);
    
    try {
      setStatusMessage("Phase 1 : Architecture stratégique...");
      const structureResult = await generateCourseWithSearch(`Crée un cours structuré sur : ${topic}. Modules et leçons uniquement.`);
      
      if (!structureResult.course || !structureResult.course.title) {
        throw new Error("Impossible de générer la structure.");
      }

      setStatusMessage("Création de l'identité visuelle...");
      const aiImage = await generateAIImage(structureResult.course.title);
      structureResult.course.coverImage = aiImage;
      setProgress(20);

      const fullModules: Module[] = [];
      const rawModules = structureResult.course.modules || [];
      const totalLessons = rawModules.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0);
      let lessonsProcessed = 0;

      for (const mod of rawModules) {
        const enrichedLessons = [];
        for (const less of (mod.lessons || [])) {
          setStatusMessage(`Rédaction profonde : ${less.title}...`);
          
          // Deliberate pacing to respect API rate limits (3 seconds between requests)
          await new Promise(r => setTimeout(r, 3000));

          try {
            const details = await generateDetailedLessonContent(less.title, structureResult.course.title);
            enrichedLessons.push({
              id: `l-${Date.now()}-${lessonsProcessed}`,
              title: less.title,
              blocks: [
                { 
                  id: `b-txt-${Date.now()}`, 
                  type: ContentBlockType.TEXT, 
                  title: "L'Essentiel du Savoir", 
                  content: details.textContent || "Contenu stratégique en cours de finalisation par l'IA..." 
                },
                { 
                  id: `b-vid-${Date.now()}`, 
                  type: ContentBlockType.VIDEO, 
                  title: "Ressource Vidéo Sélectionnée", 
                  content: "", 
                  payload: { url: details.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } 
                }
              ]
            });
          } catch (lessonError) {
            console.warn(`Final failure to enrich lesson: ${less.title}`, lessonError);
            // Fallback content so the process continues
            enrichedLessons.push({
              id: `l-${Date.now()}-${lessonsProcessed}`,
              title: less.title,
              blocks: [
                { 
                  id: `b-txt-${Date.now()}`, 
                  type: ContentBlockType.TEXT, 
                  title: "Note de l'Agent Studio", 
                  content: "Cette unité a été générée partiellement suite à une forte affluence sur les serveurs IA. Vous pouvez la compléter manuellement dans l'éditeur." 
                }
              ]
            });
          }
          
          lessonsProcessed++;
          setProgress(20 + (80 * (lessonsProcessed / totalLessons)));
        }
        
        fullModules.push({
          id: `m-${Date.now()}-${fullModules.length}`,
          title: mod.title,
          order: fullModules.length + 1,
          lessons: enrichedLessons
        });
      }

      const finalCourse = {
        ...structureResult.course,
        modules: fullModules
      };

      setGeneratedPreview(finalCourse);
    } catch (error) {
      console.error(error);
      const errorMessage = typeof error === 'string' ? error : (error?.message || "Erreur inconnue");
      alert(`La génération a été ralentie ou interrompue : ${errorMessage}. Veuillez réessayer avec un sujet plus spécifique ou patientez quelques minutes.`);
    } finally {
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12">
      <div className="glass p-16 rounded-[4rem] shadow-luxury border border-white/50 text-center relative overflow-hidden">
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-primary">
          <Sparkles className="w-12 h-12" />
        </div>
        <h2 className="editorial-title text-6xl text-slate-900 mb-6">Deep Studio IA</h2>
        <p className="text-2xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto italic opacity-60 leading-relaxed">
          Générez une masterclass complète en un clic : <br />structure, rédaction, vidéos et identité visuelle.
        </p>

        <div className="relative max-w-3xl mx-auto flex flex-col gap-6">
          <div className="relative">
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Maîtriser le prompt engineering pour le luxe..."
              className="w-full pl-10 pr-20 py-8 bg-white border-2 border-slate-100 rounded-[2.5rem] focus:outline-none focus:border-primary/30 transition-all text-xl font-medium shadow-inner"
            />
            <Layers className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 w-8 h-8" />
          </div>

          <button 
            onClick={handleDeepGeneration}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-8 bg-[#4f46e5] text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:bg-primary-dark transition-all disabled:opacity-50 shadow-2xl shadow-primary/20 active:scale-95"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Générer la Formation Complète</>}
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in duration-700">
          <div className="w-full max-w-md h-2 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">{statusMessage}</p>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
            Note: Nous cadençons les appels IA pour garantir la qualité et respecter les quotas de service.
          </p>
        </div>
      )}

      {generatedPreview && (
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
           <div className="glass rounded-[4rem] shadow-luxury border border-white/50 overflow-hidden">
              <div className="h-80 relative">
                 <img src={generatedPreview.coverImage} className="w-full h-full object-cover" alt="Preview" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                 <div className="absolute bottom-12 left-12">
                    <span className="px-4 py-2 bg-primary/20 backdrop-blur-xl rounded-full text-[9px] font-black uppercase tracking-widest text-white mb-4 inline-block">Projet Complet Prêt</span>
                    <h3 className="editorial-title text-6xl text-white">{generatedPreview.title}</h3>
                 </div>
              </div>
              
              <div className="p-16">
                 <button 
                   onClick={() => onCourseGenerated(generatedPreview)}
                   className="w-full py-8 bg-[#4f46e5] text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.4em] mb-16 shadow-2xl hover:scale-105 transition-all"
                 >
                   Déployer vers l'éditeur professionnel
                 </button>

                 <div className="grid gap-10">
                    {generatedPreview.modules?.map((m: any, idx: number) => (
                       <div key={idx} className="bg-slate-50/50 p-10 rounded-[3rem] border border-slate-100">
                          <h4 className="text-2xl font-black mb-6 tracking-tight flex items-center gap-4">
                             <span className="text-primary opacity-30 italic">0{idx + 1}</span> {m.title}
                          </h4>
                          <div className="space-y-4">
                             {m.lessons?.map((l: any, lidx: number) => (
                                <div key={lidx} className="flex items-center justify-between p-6 bg-white rounded-3xl border border-slate-100">
                                   <div className="flex items-center gap-4">
                                      <BookOpen className="w-5 h-5 text-slate-300" />
                                      <span className="font-bold text-slate-700">{l.title}</span>
                                   </div>
                                   <div className="flex gap-2">
                                      {l.blocks?.some((b: any) => b.type === 'video') && <Play className="w-4 h-4 text-primary" />}
                                      {l.blocks?.some((b: any) => b.type === 'text') && <BookOpen className="w-4 h-4 text-emerald-400" />}
                                   </div>
                                </div>
                             ))}
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
