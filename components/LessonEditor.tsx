
import React, { useState } from 'react';
import { 
  X, Save, Video, FileText, Trash2, Sparkles, 
  Loader2, Image as ImageIcon, HelpCircle, Folder, Plus
} from 'lucide-react';
import { Lesson, ContentBlock, ContentBlockType, QuizQuestion } from '../types';
import { generateDetailedLessonContent, generateQuizForLesson, generateAIImage } from '../services/geminiService';

interface LessonEditorProps {
  lesson: Lesson;
  courseTitle: string;
  onSave: (updatedLesson: Lesson) => void;
  onClose: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, courseTitle, onSave, onClose }) => {
  const [editedLesson, setEditedLesson] = useState<Lesson>({ ...lesson });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isQuizGenerating, setIsQuizGenerating] = useState<string | null>(null);

  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `${type}-${Date.now()}`,
      type,
      title: type === ContentBlockType.TEXT ? "Texte de l'unité" : 
             type === ContentBlockType.VIDEO ? "Contenu Vidéo" :
             type === ContentBlockType.QUIZ ? "Quiz d'évaluation" : "Illustration",
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

  const handleGenerateQuiz = async (blockId: string) => {
    setIsQuizGenerating(blockId);
    const textContent = editedLesson.blocks.find(b => b.type === ContentBlockType.TEXT)?.content || "";
    try {
      const questions = await generateQuizForLesson(editedLesson.title, textContent);
      updateBlock(blockId, { payload: { ...editedLesson.blocks.find(b => b.id === blockId)?.payload, questions } });
    } catch (e) {
      alert("Erreur Quiz IA");
    } finally {
      setIsQuizGenerating(null);
    }
  };

  const handleBlockImageGen = async (blockId: string, title: string) => {
    const url = await generateAIImage(title);
    updateBlock(blockId, { payload: { ...editedLesson.blocks.find(b => b.id === blockId)?.payload, imageUrl: url } });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-lg animate-in fade-in duration-500 font-sans">
      <div className="w-full max-w-6xl h-[92vh] bg-white flex flex-col shadow-2xl rounded-[3rem] overflow-hidden">
        
        {/* Header exact as per "Studio Haute Couture" screenshot */}
        <div className="px-12 py-10 flex items-center justify-between bg-white border-b border-slate-100">
          <div className="flex items-center gap-5">
             <div className="w-[3.5px] h-10 bg-[#4f46e5] rounded-full"></div>
             <h2 className="text-2xl font-black uppercase tracking-[0.45em] text-[#4f46e5]">Studio Haute Couture</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-300">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-16 py-12 space-y-16 no-scrollbar pb-60 bg-slate-50/5">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Titre de l'unité</span>
            <input 
              value={editedLesson.title} 
              onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})} 
              className="editorial-title text-5xl md:text-7xl bg-transparent border-none focus:outline-none w-full text-slate-900 tracking-tighter"
              placeholder="Unité Signature..."
            />
          </div>

          <div className="space-y-12">
            {editedLesson.blocks.map((block) => (
              <div 
                key={block.id} 
                className={`relative bg-white border ${block.type === ContentBlockType.QUIZ ? 'border-[#4f46e5] ring-2 ring-[#4f46e5]/5' : 'border-slate-100'} rounded-[3rem] p-12 group transition-all`}
              >
                <button 
                  onClick={() => removeBlock(block.id)}
                  className="absolute -top-4 -right-4 w-10 h-10 bg-white text-red-400 rounded-full shadow-lg border border-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-6 mb-10">
                   <div className="w-14 h-14 flex items-center justify-center bg-slate-50 rounded-2xl text-slate-300">
                      {block.type === ContentBlockType.TEXT && <FileText className="w-6 h-6" />}
                      {block.type === ContentBlockType.VIDEO && <Video className="w-6 h-6" />}
                      {block.type === ContentBlockType.IMAGE && <ImageIcon className="w-6 h-6" />}
                      {block.type === ContentBlockType.QUIZ && <HelpCircle className="w-6 h-6" />}
                   </div>
                   <div className="flex-grow">
                      <input 
                        className="text-3xl font-black text-slate-900 tracking-tighter bg-transparent border-none focus:ring-0 p-0 w-full" 
                        value={block.title}
                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                      />
                      {block.type === ContentBlockType.QUIZ && (
                        <p className="text-[10px] font-bold text-[#4f46e5]/60 uppercase tracking-widest mt-2">Questions du Quiz</p>
                      )}
                   </div>
                   
                   {block.type === ContentBlockType.QUIZ && (
                     <button 
                       onClick={() => handleGenerateQuiz(block.id)}
                       className="p-3 bg-slate-50 text-slate-400 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:text-[#4f46e5] transition-all"
                     >
                        {isQuizGenerating === block.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Générer par IA
                     </button>
                   )}
                   
                   {block.type === ContentBlockType.IMAGE && !block.payload?.imageUrl && (
                     <button 
                       onClick={() => handleBlockImageGen(block.id, block.title)}
                       className="p-3 bg-slate-50 text-slate-400 rounded-xl flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:text-[#4f46e5] transition-all"
                     >
                        <ImageIcon className="w-3 h-3" /> Créer Visuel IA
                     </button>
                   )}
                </div>
                
                {block.type === ContentBlockType.TEXT && (
                  <textarea 
                    value={block.content} 
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                    className="w-full min-h-[180px] text-xl font-medium text-slate-500 leading-relaxed bg-slate-50/10 rounded-2xl p-8 focus:ring-0 border-none transition-all resize-none italic"
                    placeholder="Contenu éditorial..."
                  />
                )}

                {block.type === ContentBlockType.IMAGE && block.payload?.imageUrl && (
                  <div className="rounded-[2rem] overflow-hidden shadow-luxury border border-slate-100">
                    <img src={block.payload.imageUrl} className="w-full h-auto" alt="AI Generated" />
                  </div>
                )}

                {block.type === ContentBlockType.QUIZ && (
                  <div className="space-y-6">
                    <div className="grid gap-4">
                      {block.payload?.questions?.map((q: any, qi: number) => (
                        <div key={qi} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between">
                           <span className="font-bold text-slate-700">{q.question}</span>
                           <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full">Validation IA</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        const newQ: QuizQuestion = { question: "Nouvelle question ?", options: ["Choix A", "Choix B"], correctIndex: 0 };
                        updateBlock(block.id, { payload: { ...block.payload, questions: [...(block.payload?.questions || []), newQ] } });
                      }}
                      className="w-full py-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 hover:text-[#4f46e5] hover:border-[#4f46e5]/20 transition-all flex items-center justify-center gap-4"
                    >
                      <Plus className="w-4 h-4" /> Ajouter une question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Toolbar exact from screenshot */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center bg-white rounded-full shadow-2xl border border-slate-100 p-2.5 z-50 animate-in slide-in-from-bottom-8">
           <div className="flex items-center px-6 gap-3">
              <button onClick={() => addBlock(ContentBlockType.TEXT)} className="p-4 text-slate-400 hover:text-[#4f46e5] transition-all"><FileText className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.VIDEO)} className="p-4 text-slate-400 hover:text-[#4f46e5] transition-all"><Video className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.IMAGE)} className="p-4 text-slate-400 hover:text-[#4f46e5] transition-all"><ImageIcon className="w-6 h-6" /></button>
              <button onClick={() => addBlock(ContentBlockType.QUIZ)} className="p-4 text-slate-400 hover:text-[#4f46e5] transition-all"><HelpCircle className="w-6 h-6" /></button>
           </div>
           
           <div className="w-[1.5px] h-10 bg-slate-100 mx-4"></div>
           
           <button 
             onClick={() => { onSave(editedLesson); onClose(); }} 
             className="px-12 py-5 bg-[#4f46e5] text-white rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all"
           >
              <Folder className="w-5 h-5 fill-current opacity-40" />
              Enregistrer l'unité
           </button>
        </div>
      </div>
    </div>
  );
};
