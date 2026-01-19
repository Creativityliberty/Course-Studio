
import React, { useState } from 'react';
import { X, Save, Video, FileText, HelpCircle, Plus, Trash2, GripVertical, Sparkles, Loader2, ExternalLink, MonitorPlay, Image as ImageIcon, Link as LinkIcon, Book } from 'lucide-react';
import { Lesson, ContentBlock, ContentBlockType, QuizQuestion, ResourceLink, GlossaryTerm } from '../types';
import { generateDetailedLessonContent, generateAIImage } from '../services/geminiService';

interface LessonEditorProps {
  lesson: Lesson;
  courseTitle: string;
  onSave: (updatedLesson: Lesson) => void;
  onClose: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({ lesson, courseTitle, onSave, onClose }) => {
  const [editedLesson, setEditedLesson] = useState<Lesson>({ ...lesson });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageGenerating, setIsImageGenerating] = useState<string | null>(null);

  // Fonction pour nettoyer le texte des astérisques de l'IA
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1]?.split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('vimeo.com/')) videoId = url.split('vimeo.com/')[1];
    return videoId ? (url.includes('vimeo') ? `https://player.vimeo.com/video/${videoId}` : `https://www.youtube.com/embed/${videoId}`) : null;
  };

  const handleMagicGeneration = async () => {
    setIsGenerating(true);
    try {
      const data = await generateDetailedLessonContent(editedLesson.title, courseTitle);
      
      const newBlocks: ContentBlock[] = [
        { id: `i-${Date.now()}`, type: ContentBlockType.IMAGE, title: "Illustration du cours", content: "Générée par IA", payload: { imagePrompt: editedLesson.title } },
        { id: `v-${Date.now()}`, type: ContentBlockType.VIDEO, title: "Vidéo d'apprentissage", content: "", payload: { videoUrls: [data.videoUrl], primaryVideoIndex: 0 } },
        { id: `t-${Date.now()}`, type: ContentBlockType.TEXT, title: `${editedLesson.title} : L'Essence de la Clarté`, content: cleanText(data.textContent), payload: { glossary: data.glossary } },
        { id: `r-${Date.now()}`, type: ContentBlockType.RESOURCE, title: "Ressources & Liens", content: "", payload: { resources: data.resources } },
        { id: `q-${Date.now()}`, type: ContentBlockType.QUIZ, title: "Quiz de validation", content: "", payload: { questions: data.quiz } }
      ];

      setEditedLesson({ ...editedLesson, blocks: newBlocks });
    } catch (error) {
      alert("Erreur de génération magique.");
    } finally { setIsGenerating(false); }
  };

  const generateImageForBlock = async (blockId: string, prompt: string) => {
    setIsImageGenerating(blockId);
    try {
      const imageUrl = await generateAIImage(prompt);
      updateBlock(blockId, { payload: { imageUrl, imagePrompt: prompt } });
    } catch (error) {
      alert("Erreur génération image.");
    } finally { setIsImageGenerating(null); }
  };

  const addBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `b-${Date.now()}`,
      type,
      title: 'Nouveau Bloc',
      content: '',
      payload: type === ContentBlockType.QUIZ ? { questions: [] } : type === ContentBlockType.VIDEO ? { videoUrls: [''], primaryVideoIndex: 0 } : type === ContentBlockType.RESOURCE ? { resources: [] } : {}
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
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-white/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-4xl h-full bg-white flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
        {/* Editorial Header inspired by screenshot */}
        <div className="px-12 py-8 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-primary rounded-full"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Zone d'édition</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status:</span>
              <span className="px-5 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Finalisé</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-all">
              <X className="w-6 h-6 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Big Title Area */}
        <div className="px-12 pt-12 pb-8">
          <input 
            value={editedLesson.title} 
            onChange={(e) => setEditedLesson({...editedLesson, title: e.target.value})} 
            className="text-7xl font-black bg-transparent border-none focus:outline-none w-full tracking-tighter text-slate-900 mb-4 placeholder:text-slate-100" 
            placeholder="Titre de la leçon"
          />
          <p className="text-2xl text-slate-400 font-medium tracking-tight">Exploring the history of minimalism</p>
        </div>

        {/* Content Area with Card Styling */}
        <div className="flex-grow overflow-y-auto px-12 space-y-16 no-scrollbar pb-64">
          <div className="flex items-center gap-4">
             <button onClick={handleMagicGeneration} disabled={isGenerating} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all disabled:opacity-50 flex items-center gap-2 shadow-xl shadow-slate-200">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? "Action..." : "Tout Générer avec l'IA"}
            </button>
          </div>

          {editedLesson.blocks.map((block, index) => (
            <div key={block.id} className="relative bg-white border border-slate-100 rounded-[3rem] p-12 shadow-luxury group">
              {/* Floating Badge */}
              <div className="absolute -top-4 left-10 px-6 py-2 bg-white border border-slate-100 rounded-full shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Contenu {block.type}</span>
              </div>
              
              {/* Trash Icon */}
              <button onClick={() => removeBlock(block.id)} className="absolute top-8 right-8 w-12 h-12 bg-white border border-slate-50 rounded-full flex items-center justify-center text-slate-200 hover:text-red-500 hover:border-red-100 shadow-sm transition-all opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>

              {/* Block Title */}
              <input 
                value={block.title} 
                onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                className="text-3xl font-black text-slate-900 mb-8 w-full bg-transparent focus:outline-none tracking-tight"
                placeholder="Titre du bloc..."
              />

              {/* IMAGE BLOCK */}
              {block.type === ContentBlockType.IMAGE && (
                <div className="space-y-6">
                  {block.payload?.imageUrl ? (
                    <div className="relative group/img rounded-[2.5rem] overflow-hidden">
                      <img src={block.payload.imageUrl} className="w-full h-auto" />
                      <button onClick={() => generateImageForBlock(block.id, block.payload?.imagePrompt || editedLesson.title)} className="absolute bottom-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl text-primary opacity-0 group-hover/img:opacity-100 transition-all shadow-xl">
                        <Sparkles className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-video bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4">
                      <ImageIcon className="w-12 h-12 text-slate-100" />
                      <button onClick={() => generateImageForBlock(block.id, editedLesson.title)} className="px-6 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all">Générer Illustration IA</button>
                    </div>
                  )}
                </div>
              )}

              {/* TEXT BLOCK */}
              {block.type === ContentBlockType.TEXT && (
                <div className="space-y-6">
                  <textarea 
                    value={block.content} 
                    onChange={(e) => updateBlock(block.id, { content: e.target.value })} 
                    className="w-full min-h-[250px] text-lg font-medium text-slate-500 leading-relaxed border-none focus:outline-none focus:ring-0 p-0 resize-none" 
                    placeholder="Commencez à rédiger..."
                  />
                  {block.payload?.glossary && (
                    <div className="pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {block.payload.glossary.map((term, tIdx) => (
                        <div key={tIdx} className="p-4 bg-slate-50/50 rounded-2xl">
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{term.term}</p>
                          <p className="text-xs text-slate-400 font-medium">{term.definition}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* VIDEO BLOCK */}
              {block.type === ContentBlockType.VIDEO && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <input 
                      value={block.payload?.videoUrls?.[0] || ''} 
                      onChange={(e) => updateBlock(block.id, { payload: { ...block.payload, videoUrls: [e.target.value] } })}
                      className="flex-grow p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none" 
                      placeholder="Lien Vidéo (YouTube)..." 
                    />
                  </div>
                  {block.payload?.videoUrls?.[0] && getEmbedUrl(block.payload.videoUrls[0]) && (
                    <div className="aspect-video bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-luxury">
                      <iframe src={getEmbedUrl(block.payload.videoUrls[0])!} className="w-full h-full border-0" allowFullScreen />
                    </div>
                  )}
                </div>
              )}

              {/* RESOURCE BLOCK */}
              {block.type === ContentBlockType.RESOURCE && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {block.payload?.resources?.map((res, rIdx) => (
                    <div key={rIdx} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group/res">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-300"><Book className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-slate-700">{res.label}</span>
                      </div>
                    </div>
                  ))}
                  <button className="py-6 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-primary transition-all">Ajouter Lien</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Toolbar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 glass rounded-full shadow-luxury border border-white/50">
           <button onClick={() => addBlock(ContentBlockType.TEXT)} className="p-4 hover:bg-primary hover:text-white rounded-full transition-all text-slate-400"><FileText className="w-5 h-5" /></button>
           <button onClick={() => addBlock(ContentBlockType.VIDEO)} className="p-4 hover:bg-primary hover:text-white rounded-full transition-all text-slate-400"><Video className="w-5 h-5" /></button>
           <button onClick={() => addBlock(ContentBlockType.IMAGE)} className="p-4 hover:bg-primary hover:text-white rounded-full transition-all text-slate-400"><ImageIcon className="w-5 h-5" /></button>
           <button onClick={() => addBlock(ContentBlockType.RESOURCE)} className="p-4 hover:bg-primary hover:text-white rounded-full transition-all text-slate-400"><LinkIcon className="w-5 h-5" /></button>
           <div className="w-px h-6 bg-slate-100 mx-2"></div>
           <button onClick={() => { onSave(editedLesson); onClose(); }} className="px-8 py-4 bg-primary text-white rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <Save className="w-4 h-4" /> Enregistrer
           </button>
        </div>
      </div>
    </div>
  );
};
