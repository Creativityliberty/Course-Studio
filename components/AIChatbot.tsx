
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Bot, User, Sparkles, ArrowLeft } from 'lucide-react';
import { sendMessage, startConversation } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Bonjour ! Je suis votre assistant Mindfulness Studio. Comment puis-je vous aider dans la création de votre cours aujourd\'hui ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initChat = async () => {
      const session = await startConversation(
        "Tu es l'assistant de Mindfulness Studio, un expert en création de cours en ligne et en bien-être. Ton ton est calme, professionnel, élégant et encourageant. Aide l'utilisateur à structurer ses cours ou à trouver de l'inspiration pour son contenu."
      );
      setChatSession(session);
    };
    initChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chatSession) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await sendMessage(chatSession, input);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[700px] w-full max-w-3xl mx-auto pt-32 pb-10 px-6 animate-in fade-in duration-700">
      <button 
        onClick={() => navigate('/builder')} 
        className="mb-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Retour au Studio
      </button>

      <div className="flex flex-col flex-grow glass rounded-[3rem] overflow-hidden shadow-luxury border border-white/50">
        <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 flex items-center gap-4 text-white">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-xl leading-none">Assistant AI Studio</h3>
            <p className="text-xs text-white/50 font-medium mt-1 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" /> Intelligence Pédagogique Active
            </p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto flex flex-col gap-6 scroll-smooth no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white text-slate-600 border border-slate-100'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={`p-6 rounded-[2rem] text-sm md:text-base leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-50 text-slate-800 rounded-tl-none font-medium'}`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-100/50 p-6 rounded-[2rem] rounded-tl-none animate-pulse text-slate-400 text-xs font-black uppercase tracking-widest">
                L'assistant compose une réponse...
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-slate-50">
          <div className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Décrivez votre vision pédagogique..."
              className="w-full pl-6 pr-16 py-5 bg-slate-50 border-none rounded-2xl text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 p-4 bg-slate-900 text-white rounded-xl hover:bg-primary disabled:opacity-50 transition-all active:scale-95 shadow-xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
