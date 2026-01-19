
import React, { useState } from 'react';
import { X, Save, Video, FileText, Mic, Trash2, Sparkles, Loader2, Image as ImageIcon, Book, Palette, Volume2 } from 'lucide-react';
import { Lesson, ContentBlock, ContentBlockType } from '../types';
import { generateDetailedLessonContent, generateAIImage, generateVoiceGuide } from '../services/geminiService';

interface LessonEditorProps {
  lesson: Lesson;
  courseTitle: string;
  onSave: (updatedLesson: Lesson) => void;
  onClose: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, courseTitle, onSave, onClose }) => {
  const [editedLesson, setEditedLesson] = useState<Lesson>({ ...lesson });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAudioGenerating, setIsAudioGenerating] = useState<string | null>(null);

  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').trim();

  const changeMood = (mood: string) => {
    document.body.setAttribute('data-mood', mood);
  };

  const handleGenerateVoice = async (blockId: string, text: string) => {
    setIsAudioGenerating(blockId);
    try {
      const base64 = await generateVoiceGuide(cleanText(text).substring(0, 1000));
      updateBlock(blockId, { payload: { ...editedLesson.blocks.find(b => b.id === blockId)?.payload, audioUrl: base64 } });
    } catch (e) {
      alert("Erreur Voix IA");
    } finally {
      setIsAudioGenerating(null);
    }
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setEditedLesson({
      ...editedLesson,
      blocks: editedLesson.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    });
  };

  const handleMagicGeneration = async () => {
    setIsGenerating(true);
    try {
      const data = await generateDetailedLessonContent(editedLesson.title, courseTitle);
      const newBlocks: ContentBlock[] = [
        { id: `t-${Date.now()}`, type: ContentBlockType.TEXT, title: "Méditation Guidée", content: cleanText(data.textContent), payload: { glossary: data.glossary } },
      ];
      setEditedLesson({ ...editedLesson, blocks: newBlocks });
    } finally { setIsGenerating(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-surface/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-5xl h-full bg-surface flex flex-col shadow-luxury">
        
        {/* Header Ultra-Premium */}
        <div className="px-12 py-8 flex items-center justify-between border-b border-text-muted/10">
          <div className="flex items-center gap-4">
             <div className="w-2 h-10 bg-primary rounded-full"></div>
             <h2 className="text-xl font-black uppercase tracking-[0.3em] text-primary">Studio Haute Couture</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-full">
              <button onClick={() => changeMood('')} className="w-8 h-8 rounded-full bg-white border border-slate-200" title="Dawn"></button>
              <button onClick={() => changeMood('dusk')} className="w-8 h-8 rounded-full bg-[#fdf8f6] ml-1" title="Dusk"></button>
              <button onClick={() => changeMood('midnight')} className="w-8 h-8 rounded-full bg-[#0f172a] ml-1" title="Midnight"></button>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-text-muted">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto px-12 py-16 space-y-20 no-scrollbar pb-80">
          <input 
            value={editedLesson.title} 
            onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})} 
            className="editorial-title text-[7rem] bg-transparent border-none focus:outline-none w-full text-text-main"
          />

          <button onClick={handleMagicGeneration} disabled={isGenerating} className="px-10 py-5 bg-text-main text-surface rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
             {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
             Conception Assistée par IA
          </button>

          {editedLesson.blocks.map((block) => (
            <div key={block.id} className="relative bg-surface border border-text-muted/10 rounded-premium p-16 shadow-premium group">
               <div className="flex items-center justify-between mb-12">
                 <h3 className="text-4xl font-black text-text-main tracking-tighter">{block.title}</h3>
                 <div className="flex gap-2">
                    {block.type === ContentBlockType.TEXT && (
                      <button 
                        onClick={() => handleGenerateVoice(block.id, block.content)}
                        className={`p-4 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${block.payload?.audioUrl ? 'bg-emerald-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}
                      >
                        {isAudioGenerating === block.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                        {block.payload?.audioUrl ? 'Voix Prête' : 'Générer Voix IA'}
                      </button>
                    )}
                 </div>
               </div>
               
               {block.type === ContentBlockType.TEXT && (
                 <textarea 
                   value={block.content} 
                   onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                   className="w-full min-h-[300px] text-2xl font-medium text-text-muted leading-relaxed bg-transparent border-none focus:ring-0 p-0 resize-none"
                 />
               )}
            </div>
          ))}
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 glass rounded-full shadow-luxury">
           <button onClick={() => { onSave(editedLesson); onClose(); }} className="px-12 py-6 bg-primary text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3">
              <Save className="w-5 h-5" /> Publier la Masterclass
           </button>
        </div>
      </div>
    </div>
  );
};
