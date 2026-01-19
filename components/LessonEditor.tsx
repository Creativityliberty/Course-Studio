
import React, { useState } from 'react';
import { X, Save, Video, FileText, HelpCircle, Plus, Trash2, GripVertical, Sparkles, Loader2, ExternalLink } from 'lucide-react';
import { Lesson, ContentBlock, ContentBlockType, QuizQuestion } from '../types';
import { generateDetailedLessonContent } from '../services/geminiService';

interface LessonEditorProps {
  lesson: Lesson;
  courseTitle: string;
  onSave: (updatedLesson: Lesson) => void;
  onClose: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, courseTitle, onSave, onClose }) => {
  const [editedLesson, setEditedLesson] = useState<Lesson>({ ...lesson });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMagicGeneration = async () => {
    setIsGenerating(true);
    try {
      const data = await generateDetailedLessonContent(editedLesson.title, courseTitle);
      
      const newBlocks: ContentBlock[] = [
        {
          id: `v-${Date.now()}`,
          type: ContentBlockType.VIDEO,
          title: "Vidéo d'apprentissage",
          content: "Vidéo recommandée par l'IA",
          payload: { url: data.videoUrl }
        },
        {
          id: `t-${Date.now()}`,
          type: ContentBlockType.TEXT,
          title: "Contenu du cours",
          content: data.textContent
        },
        {
          id: `q-${Date.now()}`,
          type: ContentBlockType.QUIZ,
          title: "Quiz de validation",
          content: "Vérifiez vos connaissances",
          payload: { questions: data.quiz }
        }
      ];

      setEditedLesson({ ...editedLesson, blocks: newBlocks });
    } catch (error) {
      alert("Erreur lors de la génération magique.");
    } finally {
      setIsGenerating(false);
    }
  };

  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `b-${Date.now()}`,
      type,
      title: type === ContentBlockType.VIDEO ? 'Nouvelle Vidéo' : type === ContentBlockType.TEXT ? 'Nouveau Texte' : 'Nouveau Quiz',
      content: '',
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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl h-full bg-white shadow-luxury flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[3rem] border-l border-white/50 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex-grow">
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
              <Video className="w-3 h-3" /> Édition Professionnelle
            </div>
            <input 
              value={editedLesson.title}
              onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})}
              className="text-2xl font-black bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleMagicGeneration}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? "Création..." : "Magie IA"}
            </button>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 space-y-8 scroll-smooth no-scrollbar">
          {editedLesson.blocks.map((block, index) => (
            <div key={block.id} className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-300 cursor-grab">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">BLOC {index + 1} • {block.type}</span>
                </div>
                <button onClick={() => removeBlock(block.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <input 
                value={block.title}
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                className="w-full font-black text-slate-800 text-lg mb-4 focus:outline-none"
              />

              {block.type === ContentBlockType.TEXT && (
                <textarea 
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  className="w-full min-h-[200px] p-6 bg-slate-50/50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-primary/10 text-sm leading-relaxed text-slate-600 resize-none font-medium"
                  placeholder="Rédigez le contenu ici..."
                />
              )}

              {block.type === ContentBlockType.VIDEO && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      value={block.payload?.url || ''}
                      onChange={(e) => updateBlock(block.id, { payload: { ...block.payload, url: e.target.value } })}
                      className="flex-grow p-4 bg-slate-50 rounded-xl text-xs font-medium border border-slate-100 focus:outline-none focus:border-primary/30"
                      placeholder="URL de la vidéo (YouTube, Vimeo...)"
                    />
                    {block.payload?.url && (
                      <a href={block.payload.url} target="_blank" className="p-4 bg-primary/5 text-primary rounded-xl hover:bg-primary hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {block.payload?.url && (
                    <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center text-white/20 font-black uppercase tracking-widest text-xs">
                       Aperçu Vidéo Actif
                    </div>
                  )}
                </div>
              )}

              {block.type === ContentBlockType.QUIZ && (
                <div className="space-y-4">
                  {block.payload?.questions?.map((q: QuizQuestion, qIdx: number) => (
                    <div key={qIdx} className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Question {qIdx + 1}</p>
                      <p className="text-sm font-bold text-slate-700 mb-4">{q.question}</p>
                      <div className="grid gap-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={`p-3 rounded-xl text-xs font-medium border ${q.correctIndex === oIdx ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-500'}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-primary/40 hover:text-primary transition-all">
                    Ajouter une question
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="p-8 border-t border-slate-100 glass space-y-4">
          <div className="flex gap-3">
            <button onClick={() => addBlock(ContentBlockType.VIDEO)} className="flex-1 flex flex-col items-center gap-2 py-4 bg-indigo-50/50 text-indigo-600 rounded-[1.5rem] hover:bg-indigo-600 hover:text-white transition-all group">
              <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">+ Vidéo</span>
            </button>
            <button onClick={() => addBlock(ContentBlockType.TEXT)} className="flex-1 flex flex-col items-center gap-2 py-4 bg-emerald-50/50 text-emerald-600 rounded-[1.5rem] hover:bg-emerald-600 hover:text-white transition-all group">
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">+ Texte</span>
            </button>
            <button onClick={() => addBlock(ContentBlockType.QUIZ)} className="flex-1 flex flex-col items-center gap-2 py-4 bg-amber-50/50 text-amber-600 rounded-[1.5rem] hover:bg-amber-600 hover:text-white transition-all group">
              <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">+ Quiz</span>
            </button>
          </div>
          <button 
            onClick={() => { onSave(editedLesson); onClose(); }}
            className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-3"
          >
            <Save className="w-5 h-5" /> Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  );
};
