
import React, { useState } from 'react';
import { 
  X, Save, Video, FileText, Mic, Trash2, Sparkles, 
  Loader2, Image as ImageIcon, Book, Palette, Volume2,
  Plus, Layout, Link as LinkIcon, HelpCircle
} from 'lucide-react';
import { Lesson, ContentBlock, ContentBlockType, QuizQuestion } from '../types';
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
  const [isImageGenerating, setIsImageGenerating] = useState<string | null>(null);

  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').trim();

  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `${type}-${Date.now()}`,
      type,
      title: type === ContentBlockType.TEXT ? "Nouveau texte" : 
             type === ContentBlockType.VIDEO ? "Vidéo YouTube/Vimeo" :
             type === ContentBlockType.QUIZ ? "Quiz d'évaluation" : "Ressource",
      content: "",
      payload: type === ContentBlockType.QUIZ ? { questions: [] } : {}
    };
    setEditedLesson({ ...editedLesson, blocks: [...editedLesson.blocks, newBlock] });
  };

  const removeBlock = (id: string) => {
    setEditedLesson({ ...editedLesson, blocks: editedLesson.blocks.filter(b => b.id !== id) });
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setEditedLesson({
      ...editedLesson,
      blocks: editedLesson.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    });
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

  const handleGenerateImage = async (blockId: string, prompt: string) => {
    setIsImageGenerating(blockId);
    try {
      const url = await generateAIImage(prompt);
      updateBlock(blockId, { payload: { ...editedLesson.blocks.find(b => b.id === blockId)?.payload, imageUrl: url } });
    } catch (e) {
      alert("Erreur Image IA");
    } finally {
      setIsImageGenerating(null);
    }
  };

  const handleMagicGeneration = async () => {
    setIsGenerating(true);
    try {
      const data = await generateDetailedLessonContent(editedLesson.title, courseTitle);
      const newBlocks: ContentBlock[] = [
        { 
          id: `t-${Date.now()}`, 
          type: ContentBlockType.TEXT, 
          title: "Introduction", 
          content: cleanText(data.textContent), 
          payload: { glossary: data.glossary } 
        }
      ];
      if (data.videoUrl) {
        newBlocks.push({
          id: `v-${Date.now()}`,
          type: ContentBlockType.VIDEO,
          title: "Vidéo suggérée",
          content: "",
          payload: { url: data.videoUrl }
        });
      }
      setEditedLesson({ ...editedLesson, blocks: [...editedLesson.blocks, ...newBlocks] });
    } finally { setIsGenerating(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="w-full max-w-5xl h-full bg-surface flex flex-col shadow-luxury">
        
        {/* Header Premium */}
        <div className="px-12 py-8 flex items-center justify-between border-b border-text-muted/10">
          <div className="flex items-center gap-4">
             <div className="w-2 h-10 bg-primary rounded-full"></div>
             <h2 className="text-xl font-black uppercase tracking-[0.3em] text-primary">Studio Haute Couture</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-text-muted">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-12 py-16 space-y-20 no-scrollbar pb-60">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Titre de l'unité</span>
            <input 
              value={editedLesson.title} 
              onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})} 
              className="editorial-title text-4xl md:text-6xl bg-transparent border-none focus:outline-none w-full text-text-main leading-tight tracking-tighter"
              placeholder="Nommez votre leçon..."
            />
          </div>

          <div className="flex gap-4">
            <button onClick={handleMagicGeneration} disabled={isGenerating} className="px-10 py-5 bg-text-main text-surface rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:bg-primary transition-all">
               {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
               Génération Agentique IA
            </button>
          </div>

          <div className="space-y-12">
            {editedLesson.blocks.map((block) => (
              <div key={block.id} className="relative bg-white border border-slate-100 rounded-[3rem] p-12 shadow-premium group hover:shadow-luxury transition-all">
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="absolute -top-4 -right-4 w-12 h-12 bg-white text-red-400 rounded-full shadow-lg border border-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                        {block.type === ContentBlockType.TEXT && <FileText className="w-6 h-6" />}
                        {block.type === ContentBlockType.VIDEO && <Video className="w-6 h-6" />}
                        {block.type === ContentBlockType.IMAGE && <ImageIcon className="w-6 h-6" />}
                        {block.type === ContentBlockType.QUIZ && <HelpCircle className="w-6 h-6" />}
                     </div>
                     <input 
                       className="text-2xl md:text-3xl font-black text-text-main tracking-tighter bg-transparent border-none focus:ring-0 p-0" 
                       value={block.title}
                       onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                     />
                  </div>
                  
                  <div className="flex gap-2">
                    {block.type === ContentBlockType.TEXT && (
                      <button 
                        onClick={() => handleGenerateVoice(block.id, block.content)}
                        className={`p-4 rounded-2xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all ${block.payload?.audioUrl ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5'}`}
                      >
                        {isAudioGenerating === block.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                        {block.payload?.audioUrl ? 'Audio Prêt' : 'Voix IA'}
                      </button>
                    )}
                    {block.type === ContentBlockType.IMAGE && (
                      <button 
                        onClick={() => handleGenerateImage(block.id, block.title)}
                        className={`p-4 rounded-2xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest transition-all bg-primary/10 text-primary hover:bg-primary hover:text-white`}
                      >
                        {isImageGenerating === block.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Générer Image IA
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Block Content Editors */}
                {block.type === ContentBlockType.TEXT && (
                  <textarea 
                    value={block.content} 
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="w-full min-h-[250px] text-xl font-medium text-text-muted leading-relaxed bg-slate-50/50 rounded-2xl p-6 focus:ring-2 focus:ring-primary/10 border-none transition-all resize-none"
                    placeholder="Écrivez le contenu de votre leçon..."
                  />
                )}

                {block.type === ContentBlockType.VIDEO && (
                  <div className="space-y-4">
                    <div className="relative">
                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <input 
                         type="text"
                         value={block.payload?.url || ""}
                         onChange={(e) => updateBlock(block.id, { payload: { ...block.payload, url: e.target.value } })}
                         placeholder="URL YouTube ou Vimeo"
                         className="w-full pl-12 pr-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/10 font-medium"
                       />
                    </div>
                    {block.payload?.url && (
                      <div className="aspect-video bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-[10px]">
                         Aperçu de la vidéo configuré
                      </div>
                    )}
                  </div>
                )}

                {block.type === ContentBlockType.IMAGE && (
                  <div className="space-y-6">
                    <input 
                      type="text"
                      value={block.payload?.imageUrl || ""}
                      onChange={(e) => updateBlock(block.id, { payload: { ...block.payload, imageUrl: e.target.value } })}
                      placeholder="URL de l'image ou générez avec l'IA ci-dessus"
                      className="w-full px-6 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/10 font-medium"
                    />
                    {block.payload?.imageUrl && (
                      <div className="rounded-[3rem] overflow-hidden shadow-luxury ring-1 ring-slate-100">
                         <img src={block.payload.imageUrl} className="w-full h-auto" alt="Block Preview" />
                      </div>
                    )}
                  </div>
                )}

                {block.type === ContentBlockType.QUIZ && (
                  <div className="space-y-6">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-300">Questions du Quiz</p>
                    <button 
                      onClick={() => {
                        const newQ: QuizQuestion = { question: "Nouvelle question ?", options: ["Option A", "Option B"], correctIndex: 0 };
                        updateBlock(block.id, { payload: { ...block.payload, questions: [...(block.payload?.questions || []), newQ] } });
                      }}
                      className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary/20 transition-all"
                    >
                      + Ajouter une question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar Flottante de Création */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 glass rounded-full shadow-luxury border border-white/50 animate-in slide-in-from-bottom-4 duration-1000">
           <div className="flex items-center gap-1 pr-4 mr-4 border-r border-slate-200">
              <button onClick={() => addBlock(ContentBlockType.TEXT)} className="p-4 hover:bg-slate-50 text-slate-400 hover:text-primary rounded-full transition-all" title="Texte"><FileText className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.VIDEO)} className="p-4 hover:bg-slate-50 text-slate-400 hover:text-primary rounded-full transition-all" title="Vidéo"><Video className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.IMAGE)} className="p-4 hover:bg-slate-50 text-slate-400 hover:text-primary rounded-full transition-all" title="Image"><ImageIcon className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.QUIZ)} className="p-4 hover:bg-slate-50 text-slate-400 hover:text-primary rounded-full transition-all" title="Quiz"><HelpCircle className="w-6 h-6" /></button>
           </div>
           <button onClick={() => { onSave(editedLesson); onClose(); }} className="px-10 py-5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all">
              <Save className="w-5 h-5" /> Enregistrer l'Unité
           </button>
        </div>
      </div>
    </div>
  );
};
