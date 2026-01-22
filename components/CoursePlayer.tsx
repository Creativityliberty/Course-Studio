
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, PlayCircle, Pause, CheckCircle2, Volume2, Info, Book, ExternalLink, Menu, X, Play, Sparkles, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { Module, Lesson, ContentBlockType, QuizQuestion } from '../types';

interface CoursePlayerProps {
  course: { title: string; modules: Module[] };
  onClose: () => void;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const InteractiveQuiz: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'active' | 'results'>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    const correct = idx === questions[questionIndex].correctIndex;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setQuestionIndex(i => i + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setCurrentStep('results');
      }
    }, 1500);
  };

  if (currentStep === 'intro') {
    return (
      <div className="p-10 md:p-16 bg-white rounded-[3rem] md:rounded-[4rem] shadow-premium border border-slate-50 text-center space-y-8 md:space-y-12 animate-in zoom-in-95 duration-500">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/5 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto text-primary shadow-inner">
           <Book className="w-8 md:w-12 h-8 md:h-12" />
        </div>
        <div className="space-y-4">
           <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Évaluation Interactive</h3>
           <p className="text-lg md:text-xl text-slate-400 font-medium max-w-xl mx-auto italic leading-relaxed">Validez vos acquis à travers {questions.length} questions stratégiques.</p>
        </div>
        <button 
          onClick={() => setCurrentStep('active')}
          className="w-full md:w-auto px-12 md:px-20 py-6 md:py-8 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-luxury hover:scale-105 active:scale-95"
        >
          Démarrer le Quiz
        </button>
      </div>
    );
  }

  if (currentStep === 'results') {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="p-10 md:p-20 bg-text-main text-white rounded-[4rem] shadow-luxury text-center space-y-12 animate-in fade-in duration-700">
         <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <Award className="w-12 h-12 text-primary" />
         </div>
         <h3 className="editorial-title text-6xl md:text-8xl">Score : {percentage}%</h3>
         <p className="text-xl md:text-2xl font-light opacity-60 italic max-w-lg mx-auto">
           {percentage >= 80 ? "Félicitations ! Vous avez une maîtrise exceptionnelle de cette unité." : "Bel effort. Repassez l'unité pour perfectionner votre compréhension."}
         </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button 
              onClick={() => {
                setQuestionIndex(0); setScore(0); setSelectedAnswer(null); setIsCorrect(null); setCurrentStep('intro');
              }}
              className="px-10 py-6 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/5 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Recommencer
            </button>
         </div>
      </div>
    );
  }

  const currentQ = questions[questionIndex];

  return (
    <div className="p-10 md:p-16 bg-white rounded-[3rem] md:rounded-[4rem] shadow-premium border border-slate-50 space-y-12 animate-in slide-in-from-right-8 duration-500">
      <div className="flex justify-between items-center">
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Question {questionIndex + 1} / {questions.length}</span>
         <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}></div>
         </div>
      </div>
      
      <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">{currentQ.question}</h3>
      
      <div className="grid gap-4">
        {currentQ.options.map((opt, idx) => {
          let stateClass = "border-slate-100 hover:border-primary/30 hover:bg-slate-50";
          if (selectedAnswer === idx) {
            stateClass = isCorrect ? "bg-emerald-50 border-emerald-500 text-emerald-900 shadow-lg shadow-emerald-500/5" : "bg-red-50 border-red-500 text-red-900 shadow-lg shadow-red-500/5";
          } else if (selectedAnswer !== null && idx === currentQ.correctIndex) {
            stateClass = "bg-emerald-50 border-emerald-500 text-emerald-900";
          }

          return (
            <button 
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selectedAnswer !== null}
              className={`w-full p-8 text-left rounded-[2rem] border-2 font-bold text-lg transition-all flex items-center justify-between group ${stateClass}`}
            >
              <span>{opt}</span>
              {selectedAnswer === idx && (
                isCorrect ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <X className="w-6 h-6 text-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onClose }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(course.modules[0]?.lessons[0] || null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/\*\//g, '').replace(/#/g, '').trim();

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let id = '';
    if (url.includes('v=')) id = url.split('v=')[1].split('&')[0];
    else if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1];
    else if (url.includes('embed/')) id = url.split('embed/')[1];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  };

  const handlePlayAudio = async (base64: string, blockId: string) => {
    if (isPlayingAudio === blockId) {
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
      }
      setIsPlayingAudio(null);
    } else {
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
      }
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();
      try {
        const audioBuffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => { if (currentSourceRef.current === source) setIsPlayingAudio(null); };
        source.start();
        currentSourceRef.current = source;
        setIsPlayingAudio(blockId);
      } catch (error) {
        console.error("PCM Audio playback error:", error);
        setIsPlayingAudio(null);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (currentSourceRef.current) currentSourceRef.current.stop();
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex animate-in fade-in duration-700 font-sans text-text-main overflow-hidden">
      {/* Dynamic Sidebar */}
      <div className={`fixed lg:relative h-full bg-white border-r border-slate-100 flex flex-col transition-all duration-500 z-[110] ${isSidebarOpen ? 'translate-x-0 w-80 md:w-96 shadow-luxury' : '-translate-x-full w-0 lg:w-0'}`}>
        <div className="p-8 md:p-12 flex items-center justify-between border-b border-slate-50">
          <button onClick={onClose} className="p-2 md:p-3 hover:bg-primary/5 rounded-full transition-all group">
            <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-primary" />
          </button>
          <div className="text-right">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Masterclass</p>
             <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest truncate w-32 md:w-40">{course.title}</h4>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto px-4 md:px-6 py-8 space-y-10 no-scrollbar">
          {course.modules.map((mod, mIdx) => (
            <div key={mod.id} className="space-y-4">
              <h5 className="px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Module {mIdx + 1}</h5>
              <div className="space-y-2">
                {mod.lessons.map((less) => (
                  <button 
                    key={less.id} 
                    onClick={() => {
                      setActiveLesson(less);
                      if (isMobile) setIsSidebarOpen(false);
                    }} 
                    className={`w-full p-6 rounded-[2rem] flex items-center gap-6 transition-all text-left group ${activeLesson?.id === less.id ? 'bg-primary/5 shadow-sm' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${activeLesson?.id === less.id ? 'bg-white border-primary text-primary shadow-lg' : 'border-slate-100 text-slate-300'}`}>
                      <Play className="w-4 h-4 fill-current" />
                    </div>
                    <span className={`text-sm font-bold tracking-tight ${activeLesson?.id === less.id ? 'text-primary' : 'text-slate-500'}`}>{less.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow h-full overflow-y-auto bg-slate-50/20 flex flex-col scroll-smooth no-scrollbar relative">
        {/* Toggle Sidebar Button (Mobile) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-6 right-6 z-[120] w-14 h-14 bg-text-main text-surface rounded-full flex items-center justify-center shadow-2xl lg:hidden"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full px-8 md:px-20 py-20 md:py-32">
            <header className="mb-20 md:mb-32">
               <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-sm">
                 <Sparkles className="w-4 h-4" /> Unité Signature
               </div>
               <h1 className="editorial-title text-4xl md:text-6xl lg:text-7xl text-text-main leading-tight tracking-tighter">{activeLesson.title}</h1>
            </header>

            <div className="space-y-24 md:space-y-40 pb-40">
              {activeLesson.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <h2 className="text-3xl md:text-5xl font-black text-text-main tracking-tighter leading-tight">{cleanText(block.title)}</h2>
                    {block.payload?.audioUrl && (
                      <button 
                        onClick={() => handlePlayAudio(block.payload!.audioUrl!, block.id)}
                        className={`w-full md:w-auto p-6 md:p-8 rounded-[2.5rem] flex items-center justify-center gap-4 transition-all shadow-luxury ${isPlayingAudio === block.id ? 'bg-primary text-white scale-105' : 'bg-text-main text-surface hover:scale-105'}`}
                      >
                        {isPlayingAudio === block.id ? <Pause className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Écouter le Guide</span>
                      </button>
                    )}
                  </div>

                  {block.type === ContentBlockType.TEXT && (
                    <div className="text-xl md:text-2xl font-medium text-slate-500 leading-relaxed tracking-tight whitespace-pre-wrap italic">
                      {cleanText(block.content)}
                    </div>
                  )}

                  {block.type === ContentBlockType.VIDEO && block.payload?.url && (
                    <div className="rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-luxury ring-1 ring-slate-100 bg-black aspect-video">
                      <iframe 
                        src={getYouTubeEmbedUrl(block.payload.url) || ""} 
                        className="w-full h-full" 
                        allowFullScreen 
                        title={block.title}
                      />
                    </div>
                  )}

                  {block.type === ContentBlockType.IMAGE && block.payload?.imageUrl && (
                    <div className="rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-luxury ring-8 ring-white">
                      <img src={block.payload.imageUrl} className="w-full h-auto" alt={block.title} />
                    </div>
                  )}

                  {block.type === ContentBlockType.QUIZ && block.payload?.questions && (
                    <InteractiveQuiz questions={block.payload.questions} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center p-12 text-center">
            <div className="space-y-6">
              <h2 className="editorial-title text-5xl md:text-8xl lg:text-[10rem] opacity-[0.03] text-text-main select-none">ARCHITECTURE</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">Sélectionnez une unité pour commencer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
