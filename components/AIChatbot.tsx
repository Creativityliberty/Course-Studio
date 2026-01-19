
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
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
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto glass rounded-3xl overflow-hidden shadow-luxury border border-white/50">
      <div className="p-6 bg-gradient-to-r from-primary to-accent flex items-center gap-3 text-white">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg leading-none">Assistant AI Studio</h3>
          <p className="text-xs text-white/80 font-medium mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Propulsé par Gemini Intelligence
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 scroll-smooth no-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none animate-pulse text-slate-400 text-sm font-medium">
              L'assistant réfléchit...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white/50 border-t border-slate-100 backdrop-blur-md">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Écrivez votre message..."
            className="w-full pl-5 pr-12 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-primary/30 transition-all shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-primary/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
