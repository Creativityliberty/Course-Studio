
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, PlayCircle, Pause, CheckCircle2, Volume2, Info, Book, ExternalLink, Menu, X } from 'lucide-react';
import { Module, Lesson, ContentBlockType } from '../types';

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
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').trim();

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
    <div className="fixed inset-0 z-[100] bg-surface flex animate-in fade-in duration-700 font-sans text-text-main">
      {/* Dynamic Sidebar */}
      <div className={`fixed lg:relative h-full bg-surface border-r border-text-muted/10 flex flex-col shadow-luxury transition-all duration-500 z-[110] ${isSidebarOpen ? 'translate-x-0 w-80 md:w-96' : '-translate-x-full w-0 lg:w-0'}`}>
        <div className="p-8 md:p-12 flex items-center justify-between">
          <button onClick={onClose} className="p-2 md:p-3 hover:bg-primary/5 rounded-full transition-all group">
            <ChevronLeft className="w-5 md:w-6 h-5 md:h-6 text-text-muted group-hover:text-text-main" />
          </button>
          <div className="text-right">
             <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.4em]">Masterclass</p>
             <h4 className="text-[8px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest truncate w-32 md:w-40">{course.title}</h4>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto px-4 md:px-6 py-4 space-y-10 md:space-y-12 no-scrollbar">
          {course.modules.map((mod, mIdx) => (
            <div key={mod.id} className="space-y-3 md:space-y-4">
              <h5 className="px-4 md:px-6 text-[8px] md:text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Module {mIdx + 1}</h5>
              <div className="space-y-2">
                {mod.lessons.map((less) => (
                  <button 
                    key={less.id} 
                    onClick={() => {
                      setActiveLesson(less);
                      if (isMobile) setIsSidebarOpen(false);
                    }} 
                    className={`w-full p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center gap-4 md:gap-6 transition-all text-left ${activeLesson?.id === less.id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-primary/5 opacity-50'}`}
                  >
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${activeLesson?.id === less.id ? 'bg-surface border-primary text-primary shadow-lg' : 'border-text-muted/20 text-text-muted'}`}>
                      <PlayCircle className="w-4 md:w-5 h-4 md:h-5" />
                    </div>
                    <span className="text-sm md:text-base font-bold tracking-tight">{less.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow h-full overflow-y-auto bg-surface flex flex-col scroll-smooth no-scrollbar relative">
        {/* Toggle Sidebar Button (Mobile) */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed bottom-6 right-6 z-[120] w-14 h-14 bg-text-main text-surface rounded-full flex items-center justify-center shadow-2xl lg:hidden"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </button>

        {activeLesson ? (
          <div className="max-w-4xl mx-auto w-full px-8 md:px-20 py-20 md:py-32">
            <header className="mb-16 md:mb-32">
               <span className="px-6 md:px-8 py-2 md:py-3 bg-primary text-surface rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-8 md:mb-12 inline-block shadow-xl">Formation Signature</span>
               <h1 className="editorial-title text-5xl md:text-8xl lg:text-[10rem] text-text-main leading-[0.9] tracking-tighter">{activeLesson.title}</h1>
            </header>

            <div className="space-y-24 md:space-y-40">
              {activeLesson.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6">
                    <h2 className="text-3xl md:text-6xl font-black text-text-main tracking-tighter leading-tight">{cleanText(block.title)}</h2>
                    {block.payload?.audioUrl && (
                      <button 
                        onClick={() => handlePlayAudio(block.payload!.audioUrl!, block.id)}
                        className="w-full md:w-auto p-6 md:p-8 bg-text-main text-surface rounded-2xl md:rounded-[2.5rem] flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-luxury"
                      >
                        {isPlayingAudio === block.id ? <Pause className="w-5 md:w-6 h-5 md:h-6 fill-current" /> : <Volume2 className="w-5 md:w-6 h-5 md:h-6" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">Écouter le Guide</span>
                      </button>
                    )}
                  </div>

                  {block.type === ContentBlockType.TEXT && (
                    <div className="text-lg md:text-2xl lg:text-3xl font-medium text-text-muted leading-[1.6] tracking-tight whitespace-pre-wrap">
                      {cleanText(block.content)}
                    </div>
                  )}

                  {block.type === ContentBlockType.IMAGE && block.payload?.imageUrl && (
                    <div className="rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-luxury ring-1 ring-text-muted/10">
                      <img src={block.payload.imageUrl} className="w-full h-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center p-12 text-center">
            <h2 className="editorial-title text-4xl md:text-8xl opacity-5 text-text-main">SÉLECTIONNEZ UNE UNITÉ</h2>
          </div>
        )}
      </div>
    </div>
  );
};
