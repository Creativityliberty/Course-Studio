
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
      const structureResult = await generateCourseWithSearch(topic);
      
      if (!structureResult.course || !structureResult.course.title) {
        throw new Error("Impossible de générer la structure.");
      }

      setStatusMessage("Phase 2 : Création de l'identité visuelle...");
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
          
          // Respect des limites de l'API (pacing)
          await new Promise(r => setTimeout(r, 2000));

          try {
            const details = await generateDetailedLessonContent(less.title, structureResult.course.title);
            
            // On génère aussi un visuel spécifique pour cette leçon
            const lessonImage = await generateAIImage(less.title);

            enrichedLessons.push({
              id: `l-${Date.now()}-${lessonsProcessed}`,
              title: less.title,
              blocks: [
                { 
                  id: `b-img-${Date.now()}`, 
                  type: ContentBlockType.IMAGE, 
                  title: "Visuel d'Expertise", 
                  content: "",
                  payload: { imageUrl: lessonImage }
                },
                { 
                  id: `b-txt-${Date.now()}`, 
                  type: ContentBlockType.TEXT, 
                  title: "L'Essentiel du Savoir", 
                  content: details.textContent || "Contenu stratégique..." 
                },
                { 
                  id: `b-vid-${Date.now()}`, 
                  type: ContentBlockType.VIDEO, 
                  title: "Ressource Vidéo", 
                  content: "", 
                  payload: { url: details.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ" } 
                }
              ]
            });
          } catch (lessonError) {
            enrichedLessons.push({
              id: `l-${Date.now()}-${lessonsProcessed}`,
              title: less.title,
              blocks: [
                { 
                  id: `b-txt-${Date.now()}`, 
                  type: ContentBlockType.TEXT, 
                  title: "Note de l'Agent Studio", 
                  content: "Une erreur est survenue lors de l'enrichissement de cette unité." 
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

      onCourseGenerated({
        ...structureResult.course,
        modules: fullModules
      });

    } catch (error) {
      console.error(error);
      alert(`Erreur: ${error?.message || "La génération a échoué."}`);
    } finally {
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12">
      <div className="glass p-16 rounded-[4rem] shadow-luxury border border-white/50 text-center relative overflow-hidden bg-white/40">
        <div className="w-24 h-24 bg-[#4f46e5]/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 text-[#4f46e5]">
          <Sparkles className="w-12 h-12" />
        </div>
        <h2 className="editorial-title text-6xl text-slate-900 mb-6 tracking-tighter">Chef de Studio IA</h2>
        <p className="text-2xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto italic leading-relaxed">
          Incarnez votre vision pédagogique. Notre agent génère structure, rédaction et visuels haute couture.
        </p>

        <div className="relative max-w-3xl mx-auto flex flex-col gap-6">
          <div className="relative">
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: L'art du Minimalisme Digital..."
              className="w-full pl-10 pr-20 py-8 bg-white border border-slate-100 rounded-[2.5rem] focus:outline-none focus:border-[#4f46e5]/30 transition-all text-xl font-medium shadow-inner"
            />
            <Layers className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 w-8 h-8" />
          </div>

          <button 
            onClick={handleDeepGeneration}
            disabled={isGenerating || !topic.trim()}
            className="w-full py-8 bg-[#4f46e5] text-white rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all disabled:opacity-50 shadow-2xl shadow-[#4f46e5]/20 active:scale-95"
          >
            {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Lancer la génération Masterclass</>}
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8 animate-in fade-in duration-700">
          <div className="w-full max-w-md h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
             <div className="h-full bg-[#4f46e5] transition-all duration-500 shadow-lg" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#4f46e5] animate-pulse">{statusMessage}</p>
        </div>
      )}
    </div>
  );
};
