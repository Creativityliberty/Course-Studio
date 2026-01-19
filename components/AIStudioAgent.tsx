
import React, { useState } from 'react';
import { Sparkles, Search, Globe, ChevronRight, Loader2, BookOpen, Layers } from 'lucide-react';
import { generateCourseWithSearch } from '../services/geminiService';

interface AIStudioAgentProps {
  onCourseGenerated: (courseData: any) => void;
}

export const AIStudioAgent: React.FC<AIStudioAgentProps> = ({ onCourseGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setGeneratedPreview(null);
    
    try {
      const prompt = `Crée un cours complet sur : ${topic}. Fais des recherches sur les meilleures pratiques actuelles, les experts du domaine et structure le cours en au moins 3 modules logiques.`;
      const result = await generateCourseWithSearch(prompt);
      setGeneratedPreview(result.course);
      setSources(result.sources);
    } catch (error) {
      alert("Une erreur est survenue pendant la recherche agentique.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="glass p-10 rounded-[3rem] shadow-luxury border border-white/50 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-4">Chef de Studio IA</h2>
        <p className="text-slate-500 font-medium mb-10 max-w-xl mx-auto">
          Décrivez votre sujet, et notre agent parcourra le web pour construire la structure pédagogique idéale.
        </p>

        <div className="relative max-w-2xl mx-auto group">
          <input 
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Ex: Méditation de pleine conscience pour athlètes de haut niveau..."
            className="w-full pl-14 pr-32 py-6 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary/30 transition-all text-lg font-medium shadow-sm"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="absolute right-3 top-3 bottom-3 px-8 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Générer"}
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <Globe className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">L'IA parcourt le web pour vous...</p>
        </div>
      )}

      {generatedPreview && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="glass p-8 rounded-[2.5rem] shadow-luxury border border-white/50 mb-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">Curriculum Généré</span>
                <h3 className="text-3xl font-black tracking-tight">{generatedPreview.title}</h3>
                <p className="text-slate-500 font-medium">{generatedPreview.subtitle}</p>
              </div>
              <button 
                onClick={() => onCourseGenerated(generatedPreview)}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                Importer dans le Builder <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {generatedPreview.modules.map((mod: any, i: number) => (
                <div key={i} className="bg-white/50 border border-slate-100 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-sm">
                      {i + 1}
                    </div>
                    <h4 className="font-bold text-lg text-slate-800">{mod.title}</h4>
                  </div>
                  <div className="grid gap-3">
                    {mod.lessons.map((less: any, j: number) => (
                      <div key={j} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl text-sm font-medium text-slate-600">
                         <div className="flex items-center gap-3">
                            <BookOpen className="w-4 h-4 text-primary/40" />
                            {less.title}
                         </div>
                         <span className="px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black uppercase text-slate-400">{less.contentType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {sources.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Sources consultées
                </h5>
                <div className="flex flex-wrap gap-4">
                  {sources.map((src: any, idx: number) => (
                    <a 
                      key={idx} 
                      href={src.web?.uri || '#'} 
                      target="_blank" 
                      className="text-xs font-bold text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-full"
                    >
                      {src.web?.title || 'Lien externe'}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
