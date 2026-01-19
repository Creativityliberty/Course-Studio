
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, PlayCircle, Pause, CheckCircle2, Volume2, Info, Book, ExternalLink } from 'lucide-react';
import { Module, Lesson, ContentBlockType } from '../types';

interface CoursePlayerProps {
  course: { title: string; modules: Module[] };
  onClose: () => void;
}

// Added decode helper function to convert base64 to Uint8Array as per Gemini API guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Added decodeAudioData to handle raw PCM audio bytes from Gemini TTS
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
  
  // Audio references for raw PCM playback using AudioContext
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const cleanText = (text: string) => text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '').trim();

  // Updated handlePlayAudio to use AudioContext for raw PCM decoding as required by the Gemini API
  const handlePlayAudio = async (base64: string, blockId: string) => {
    if (isPlayingAudio === blockId) {
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
      }
      setIsPlayingAudio(null);
    } else {
      // Stop current playback if any
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
        currentSourceRef.current = null;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      try {
        const audioBuffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          if (currentSourceRef.current === source) {
            setIsPlayingAudio(null);
          }
        };
        source.start();
        currentSourceRef.current = source;
        setIsPlayingAudio(blockId);
      } catch (error) {
        console.error("PCM Audio playback error:", error);
        setIsPlayingAudio(null);
      }
    }
  };

  // Clean up audio resources on component unmount
  useEffect(() => {
    return () => {
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex animate-in fade-in duration-700 font-sans text-text-main">
      {/* Sidebar Minimaliste */}
      <div className="w-96 h-full bg-surface border-r border-text-muted/10 flex flex-col shadow-luxury">
        <div className="p-12 flex items-center justify-between">
          <button onClick={onClose} className="p-3 hover:bg-primary/5 rounded-full transition-all group">
            <ChevronLeft className="w-6 h-6 text-text-muted group-hover:text-text-main" />
          </button>
          <div className="text-right">
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Expérience</p>
             <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest truncate w-40">{course.title}</h4>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-12 no-scrollbar">
          {course.modules.map((mod, mIdx) => (
            <div key={mod.id} className="space-y-4">
              <h5 className="px-6 text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Module {mIdx + 1}</h5>
              <div className="space-y-2">
                {mod.lessons.map((less) => (
                  <button 
                    key={less.id} 
                    onClick={() => setActiveLesson(less)} 
                    className={`w-full p-6 rounded-3xl flex items-center gap-6 transition-all text-left ${activeLesson?.id === less.id ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-primary/5 opacity-50'}`}
                  >
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${activeLesson?.id === less.id ? 'bg-surface border-primary text-primary shadow-lg' : 'border-text-muted/20 text-text-muted'}`}>
                      <PlayCircle className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold tracking-tight">{less.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rendu Editorial Ultra-High-End */}
      <div className="flex-grow h-full overflow-y-auto bg-surface flex flex-col scroll-smooth no-scrollbar">
        {activeLesson ? (
          <div className="max-w-5xl mx-auto w-full px-20 py-32">
            <header className="mb-32">
               <span className="px-8 py-3 bg-primary text-surface rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] mb-12 inline-block shadow-xl">Formation Signature</span>
               <h1 className="editorial-title text-[8rem] text-text-main leading-[0.85] tracking-tighter">{activeLesson.title}</h1>
            </header>

            <div className="space-y-40">
              {activeLesson.blocks.map((block) => (
                <div key={block.id} className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="text-6xl font-black text-text-main tracking-tighter leading-tight">{cleanText(block.title)}</h2>
                    {/* Fixed audioUrl access using the updated ContentBlock type */}
                    {block.payload?.audioUrl && (
                      <button 
                        onClick={() => handlePlayAudio(block.payload!.audioUrl!, block.id)}
                        className="p-8 bg-text-main text-surface rounded-[2.5rem] flex items-center gap-4 hover:scale-105 transition-all shadow-luxury"
                      >
                        {isPlayingAudio === block.id ? <Pause className="w-6 h-6 fill-current" /> : <Volume2 className="w-6 h-6" />}
                        <span className="text-xs font-black uppercase tracking-widest">Écouter le Guide IA</span>
                      </button>
                    )}
                  </div>

                  {block.type === ContentBlockType.TEXT && (
                    <div className="text-3xl font-medium text-text-muted leading-[1.6] tracking-tight whitespace-pre-wrap">
                      {cleanText(block.content)}
                    </div>
                  )}

                  {block.type === ContentBlockType.IMAGE && block.payload?.imageUrl && (
                    <div className="rounded-[4rem] overflow-hidden shadow-luxury ring-1 ring-text-muted/10">
                      <img src={block.payload.imageUrl} className="w-full h-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <h2 className="editorial-title text-8xl opacity-5 text-text-main">SÉLECTIONNEZ UNE UNITÉ</h2>
          </div>
        )}
      </div>
    </div>
  );
};
