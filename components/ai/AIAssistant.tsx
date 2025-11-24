import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../../services/geminiService';
import { Bot, Send, User, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello Nurse Joy. I am your clinical assistant. I can help with protocol lookups, symptom checking suggestions, or documentation. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await GeminiService.askAssistant(userMsg.text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Bot size={24} />
        </div>
        <div>
            <h3 className="font-bold text-slate-800">AI Clinical Assistant</h3>
            <p className="text-xs text-slate-500 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span> Online
            </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} space-x-2`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
              </div>
              
              <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex items-center space-x-2">
               <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <Sparkles size={16} />
               </div>
               <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-slate-200 shadow-sm">
                 <div className="flex space-x-1">
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                   <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                 </div>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Ask about symptoms, protocols, or drug interactions..." 
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};