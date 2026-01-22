
import React, { useState, useRef } from 'react';
import { Sparkles, Search, Globe, ChevronRight, Loader2, BookOpen, Mic, Square, Volume2, ImageIcon } from 'lucide-react';
import { generateCourseWithSearch, transcribeAudio, generateAIImage } from '../services/geminiService';

interface AIStudioAgentProps {
  onCourseGenerated: (courseData: any) => void;
}

export const AIStudioAgent: React.FC<AIStudioAgentProps> = ({ onCourseGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [generatedPreview, setGeneratedPreview] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsTranscribing(true);
          try {
            const transcription = await transcribeAudio(base64Audio, 'audio/webm');
            setTopic(transcription);
          } catch (error) {
            console.error("Transcription error:", error);
          } finally {
            setIsTranscribing(false);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Impossible d'accéder au microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleGenerate = async (overrideTopic?: string) => {
    const finalTopic = overrideTopic || topic;
    if (!finalTopic.trim()) return;
    setIsGenerating(true);
    setGeneratedPreview(null);
    setStatusMessage("L'IA explore le web pour structurer votre savoir...");
    
    try {
      const prompt = `Crée un cours complet sur : ${finalTopic}. Fais des recherches sur les meilleures pratiques actuelles, les experts du domaine et structure le cours en au moins 3 modules logiques.`;
      const result = await generateCourseWithSearch(prompt);
      
      // Nouvelle étape : Génération de l'image de couverture
      setStatusMessage("Création de l'univers visuel de votre masterclass...");
      try {
        const aiImage = await generateAIImage(result.course.title);
        result.course.coverImage = aiImage;
      } catch (imgError) {
        console.warn("Échec de la génération d'image IA, utilisation d'une image par défaut.", imgError);
        result.course.coverImage = "https://images.unsplash.com/photo-1499209974431-9dac3adaf471?auto=format&fit=crop&q=80&w=2000";
      }

      setGeneratedPreview(result.course);
      setSources(result.sources);
    } catch (error) {
      alert("Une erreur est survenue pendant la recherche agentique.");
    } finally {
      setIsGenerating(false);
      setStatusMessage("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="glass p-10 rounded-[3rem] shadow-luxury border border-white/50 text-center relative overflow-hidden">
        {isRecording && (
          <div className="absolute inset-0 bg-primary/5 animate-pulse pointer-events-none"></div>
        )}
        
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-4xl font-black tracking-tighter mb-4">Chef de Studio IA</h2>
        <p className="text-slate-500 font-medium mb-10 max-w-xl mx-auto">
          Décrivez votre sujet. Je construirai votre structure pédagogique et votre <strong>identité visuelle</strong>.
        </p>

        <div className="relative max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow group">
            <input 
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              placeholder={isTranscribing ? "Transcription en cours..." : "Ex: Masterclass sur le design durable..."}
              className="w-full pl-14 pr-14 py-6 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-primary/30 transition-all text-lg font-medium shadow-sm"
              disabled={isTranscribing}
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
            
            <button 
              onClick={isRecording ? stopRecording : startRecording}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5'}`}
              title={isRecording ? "Arrêter l'enregistrement" : "Parler au Studio Agent"}
            >
              {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          <button 
            onClick={() => handleGenerate()}
            disabled={isGenerating || isTranscribing || !topic.trim()}
            className="sm:px-10 py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Générer</>}
          </button>
        </div>

        {isTranscribing && (
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
            L'agent analyse votre voix...
          </p>
        )}
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse text-center">
          <div className="relative">
            <Globe className="w-12 h-12 text-primary animate-spin mb-4" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-bounce" />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs max-w-xs">{statusMessage}</p>
        </div>
      )}

      {generatedPreview && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="glass rounded-[3rem] shadow-luxury border border-white/50 mb-8 overflow-hidden">
            {/* Visual Preview of the AI Generated Cover */}
            <div className="h-64 relative group overflow-hidden">
               <img src={generatedPreview.coverImage} className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" alt="Generated Cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
               <div className="absolute bottom-8 left-10 flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-xl rounded-lg text-white">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Identité visuelle générée par IA</span>
               </div>
            </div>

            <div className="p-10">
              <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary mb-2 block">Architecture Studio</span>
                  <h3 className="text-3xl font-black tracking-tight mb-2">{generatedPreview.title}</h3>
                  <p className="text-slate-500 font-medium italic">"{generatedPreview.subtitle}"</p>
                </div>
                <button 
                  onClick={() => onCourseGenerated(generatedPreview)}
                  className="w-full md:w-auto bg-primary text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-primary-dark shadow-xl shadow-primary/20 transition-all active:scale-95"
                >
                  Déployer le Projet <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {generatedPreview.modules.map((mod: any, i: number) => (
                  <div key={i} className="bg-white/50 border border-slate-100 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
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
                    <Globe className="w-3 h-3" /> Sources consultées par l'agent
                  </h5>
                  <div className="flex flex-wrap gap-4">
                    {sources.map((src: any, idx: number) => (
                      <a 
                        key={idx} 
                        href={src.web?.uri || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
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
        </div>
      )}
    </div>
  );
};
