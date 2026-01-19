
import React, { useState, useEffect } from 'react';
import { X, Save, Video, FileText, HelpCircle, Plus, Trash2, GripVertical, Sparkles, Loader2, ExternalLink, PlayCircle } from 'lucide-react';
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

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
  };

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
      console.error(error);
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
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl h-full bg-white shadow-luxury flex flex-col animate-in slide-in-from-right duration-500 rounded-l-[3.5rem] border-l border-white/50 overflow-hidden">
        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex-grow">
            <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-2">
              <PlayCircle className="w-3.5 h-3.5" /> Édition Professionnelle
            </div>
            <input 
              value={editedLesson.title}
              onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})}
              className="text-3xl font-black bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full tracking-tight text-slate-900"
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleMagicGeneration}
              disabled={isGenerating}
              className="group relative flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg shadow-primary/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? "Création..." : "Magie IA"}
            </button>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-10 space-y-10 scroll-smooth no-scrollbar pb-32">
          {editedLesson.blocks.map((block, index) => (
            <div key={block.id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300 cursor-grab hover:text-primary transition-colors">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50/80 px-3 py-1.5 rounded-full">BLOC {index + 1} • {block.type}</span>
                </div>
                <button onClick={() => removeBlock(block.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <input 
                value={block.title}
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                className="w-full font-black text-slate-800 text-xl mb-6 focus:outline-none tracking-tight"
                placeholder="Titre du bloc..."
              />

              {block.type === ContentBlockType.TEXT && (
                <textarea 
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  className="w-full min-h-[250px] p-8 bg-slate-50/30 rounded-[2rem] border border-slate-100 focus:ring-4 focus:ring-primary/5 text-base leading-relaxed text-slate-600 resize-none font-medium transition-all"
                  placeholder="Rédigez le contenu ici..."
                />
              )}

              {block.type === ContentBlockType.VIDEO && (
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                       <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                       <input 
                        value={block.payload?.url || ''}
                        onChange={(e) => updateBlock(block.id, { payload: { ...block.payload, url: e.target.value } })}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 rounded-2xl text-sm font-bold border border-slate-100 focus:outline-none focus:border-primary/30 transition-all"
                        placeholder="URL de la vidéo (YouTube, Vimeo...)"
                      />
                    </div>
                    {block.payload?.url && (
                      <a href={block.payload.url} target="_blank" className="p-4 bg-primary/5 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm">
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  
                  {block.payload?.url && getEmbedUrl(block.payload.url) ? (
                    <div className="aspect-video bg-slate-900 rounded-[2rem] overflow-hidden shadow-luxury relative group/player">
                       <iframe 
                        src={getEmbedUrl(block.payload.url)!} 
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                       />
                    </div>
                  ) : block.payload?.url ? (
                    <div className="aspect-video bg-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 gap-4 border-2 border-dashed border-slate-200">
                       <Video className="w-12 h-12 opacity-20" />
                       <p className="text-xs font-black uppercase tracking-widest">URL Non Reconnue pour l'aperçu</p>
                    </div>
                  ) : null}
                </div>
              )}

              {block.type === ContentBlockType.QUIZ && (
                <div className="space-y-6">
                  {block.payload?.questions?.map((q: QuizQuestion, qIdx: number) => (
                    <div key={qIdx} className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 group/q relative">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Question {qIdx + 1}</p>
                      <p className="text-lg font-black text-slate-800 mb-6 tracking-tight leading-tight">{q.question}</p>
                      <div className="grid gap-3">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className={`p-4 rounded-2xl text-sm font-bold border flex items-center justify-between transition-all ${q.correctIndex === oIdx ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-500 hover:border-primary/20'}`}>
                            {opt}
                            {q.correctIndex === oIdx && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all">
                    + Ajouter une question manuellement
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Action Bar */}
        <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-4">
           <div className="p-4 glass rounded-[2.5rem] shadow-luxury border border-white/50 flex gap-4">
              <button onClick={() => addBlock(ContentBlockType.VIDEO)} className="flex-1 flex flex-col items-center gap-2 py-4 bg-indigo-50/50 text-indigo-600 rounded-3xl hover:bg-indigo-600 hover:text-white transition-all group">
                <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">+ Vidéo</span>
              </button>
              <button onClick={() => addBlock(ContentBlockType.TEXT)} className="flex-1 flex flex-col items-center gap-2 py-4 bg-emerald-50/50 text-emerald-600 rounded-3xl hover:bg-emerald-600 hover:text-white transition-all group">
                <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">+ Texte</span>
              </button>
              <button onClick={() => addBlock(ContentBlockType.QUIZ)} className="flex-1 flex flex-col items-center gap-2 py-4 bg-amber-50/50 text-amber-600 rounded-3xl hover:bg-amber-600 hover:text-white transition-all group">
                <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">+ Quiz</span>
              </button>
           </div>
           <button 
              onClick={() => { onSave(editedLesson); onClose(); }}
              className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save className="w-5 h-5" /> Enregistrer les modifications
            </button>
        </div>
      </div>
    </div>
  );
};
