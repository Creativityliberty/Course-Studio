
import React, { useState } from 'react';
import { 
  X, Save, Video, FileText, Mic, Trash2, Sparkles, 
  Loader2, Image as ImageIcon, Book, Palette, Volume2,
  Plus, Layout, Link as LinkIcon, HelpCircle, CheckCircle2
} from 'lucide-react';
import { Lesson, ContentBlock, ContentBlockType, QuizQuestion } from '../types';
import { generateDetailedLessonContent, generateAIImage, generateVoiceGuide, generateQuizForLesson } from '../services/geminiService';

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
  const [isQuizGenerating, setIsQuizGenerating] = useState<string | null>(null);

  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').trim();

  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `${type}-${Date.now()}`,
      type,
      title: type === ContentBlockType.TEXT ? "Texte de l'unité" : 
             type === ContentBlockType.VIDEO ? "Contenu Vidéo" :
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

  const handleGenerateQuiz = async (blockId: string) => {
    setIsQuizGenerating(blockId);
    const lessonText = editedLesson.blocks.find(b => b.type === ContentBlockType.TEXT)?.content || "";
    try {
      const questions = await generateQuizForLesson(editedLesson.title, lessonText);
      updateBlock(blockId, { payload: { ...editedLesson.blocks.find(b => b.id === blockId)?.payload, questions } });
    } catch (e) {
      alert("Erreur Génération Quiz");
    } finally {
      setIsQuizGenerating(null);
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
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500 font-sans">
      <div className="w-full max-w-5xl h-full bg-surface flex flex-col shadow-luxury">
        
        {/* Header exact as screenshot */}
        <div className="px-12 py-8 flex items-center justify-between border-b border-slate-100 bg-white">
          <div className="flex items-center gap-4">
             <div className="w-[3px] h-10 bg-[#4f46e5] rounded-full"></div>
             <h2 className="text-xl font-black uppercase tracking-[0.4em] text-[#4f46e5]">Studio Haute Couture</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-12 py-16 space-y-16 no-scrollbar pb-80 bg-slate-50/10">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4f46e5] opacity-50">Titre de l'unité</span>
            <input 
              value={editedLesson.title} 
              onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})} 
              className="editorial-title text-5xl md:text-7xl bg-transparent border-none focus:outline-none w-full text-slate-900 leading-[0.9] tracking-tighter"
              placeholder="Nommez votre leçon..."
            />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleMagicGeneration} 
              disabled={isGenerating} 
              className="px-8 py-4 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl flex items-center gap-3 hover:bg-[#4f46e5] transition-all disabled:opacity-50"
            >
               {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
               Génération Agentique IA
            </button>
          </div>

          <div className="space-y-10">
            {editedLesson.blocks.map((block) => (
              <div key={block.id} className="relative bg-white border border-slate-100 rounded-[3rem] p-12 shadow-premium group hover:shadow-luxury transition-all">
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="absolute -top-4 -right-4 w-10 h-10 bg-white text-red-400 rounded-full shadow-lg border border-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-slate-50 rounded-2xl text-slate-300">
                        {block.type === ContentBlockType.TEXT && <FileText className="w-6 h-6" />}
                        {block.type === ContentBlockType.VIDEO && <Video className="w-6 h-6" />}
                        {block.type === ContentBlockType.IMAGE && <ImageIcon className="w-6 h-6" />}
                        {block.type === ContentBlockType.QUIZ && <HelpCircle className="w-6 h-6" />}
                     </div>
                     <input 
                       className="text-3xl font-black text-slate-900 tracking-tighter bg-transparent border-none focus:ring-0 p-0" 
                       value={block.title}
                       onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                     />
                  </div>
                  
                  <div className="flex gap-2">
                    {block.type === ContentBlockType.TEXT && (
                      <button 
                        onClick={() => handleGenerateVoice(block.id, block.content)}
                        className={`p-3 rounded-2xl flex items-center gap-2 text-[8px] font-black uppercase tracking-widest transition-all ${block.payload?.audioUrl ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 hover:text-[#4f46e5] hover:bg-slate-100'}`}
                      >
                        {isAudioGenerating === block.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                        {block.payload?.audioUrl ? 'Audio Prêt' : 'Synthèse Voix'}
                      </button>
                    )}
                    {block.type === ContentBlockType.QUIZ && (
                      <button 
                        onClick={() => handleGenerateQuiz(block.id)}
                        className="p-3 bg-slate-50 text-slate-400 rounded-2xl flex items-center gap-2 text-[8px] font-black uppercase tracking-widest hover:text-[#4f46e5] hover:bg-slate-100 transition-all"
                      >
                        {isQuizGenerating === block.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        Générer par IA
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Block Content Editors */}
                {block.type === ContentBlockType.TEXT && (
                  <textarea 
                    value={block.content} 
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="w-full min-h-[250px] text-xl font-medium text-slate-500 leading-relaxed bg-slate-50/30 rounded-3xl p-8 focus:ring-2 focus:ring-[#4f46e5]/10 border-none transition-all resize-none"
                    placeholder="Contenu éditorial de votre leçon..."
                  />
                )}

                {block.type === ContentBlockType.VIDEO && (
                  <div className="space-y-4">
                    <div className="relative">
                       <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                       <input 
                         type="text"
                         value={block.payload?.url || ""}
                         onChange={(e) => updateBlock(block.id, { payload: { ...block.payload, url: e.target.value } })}
                         placeholder="Lien YouTube ou Vimeo"
                         className="w-full pl-14 pr-8 py-6 bg-slate-50 border-none rounded-[2rem] focus:ring-2 focus:ring-[#4f46e5]/10 font-medium text-slate-600"
                       />
                    </div>
                  </div>
                )}

                {block.type === ContentBlockType.QUIZ && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Questions du Quiz</p>
                    <div className="space-y-4">
                      {block.payload?.questions?.map((q: any, qi: number) => (
                        <div key={qi} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                           <span className="font-bold text-slate-700 truncate max-w-md">{q.question}</span>
                           <div className="flex items-center gap-4">
                             <span className="text-[10px] font-black uppercase text-emerald-500">{q.options.length} Options</span>
                             <button onClick={() => {
                               const newQs = [...(block.payload?.questions || [])];
                               newQs.splice(qi, 1);
                               updateBlock(block.id, { payload: { ...block.payload, questions: newQs } });
                             }} className="text-red-300 hover:text-red-500 transition-colors">
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const newQ: QuizQuestion = { question: "Nouvelle question ?", options: ["Option A", "Option B", "Option C", "Option D"], correctIndex: 0 };
                        updateBlock(block.id, { payload: { ...block.payload, questions: [...(block.payload?.questions || []), newQ] } });
                      }}
                      className="w-full py-6 border-2 border-dashed border-slate-100 rounded-[2rem] text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-[#4f46e5] hover:border-[#4f46e5]/20 transition-all"
                    >
                      + Ajouter une question manuellement
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar exact from screenshot */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center bg-white rounded-full shadow-2xl border border-slate-100 p-2 z-[70] animate-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center px-4">
              <button onClick={() => addBlock(ContentBlockType.TEXT)} className="p-4 text-slate-400 hover:text-[#4f46e5] transition-all"><FileText className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.VIDEO)} className="p-4 text-slate-400 hover:text-[#4f46e5] transition-all"><Video className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.IMAGE)} className="p-4 text-slate-400 hover:text-[#4f46e5] transition-all"><ImageIcon className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.QUIZ)} className="p-4 text-slate-400 hover:text-[#4f46e5] transition-all"><HelpCircle className="w-6 h-6" /></button>
           </div>
           
           <div className="w-[1px] h-10 bg-slate-100 mx-2"></div>
           
           <button 
             onClick={() => { onSave(editedLesson); onClose(); }} 
             className="ml-2 px-10 py-5 bg-[#4f46e5] text-white rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-lg flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
           >
              <Save className="w-4 h-4" /> Enregistrer l'unité
           </button>
        </div>
      </div>
    </div>
  );
};
