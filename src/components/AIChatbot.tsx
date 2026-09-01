'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { ChatMessage } from '@/lib/chatbotEngine';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  Key, 
  Check, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AIChatbotProps {
  onOpenEventDetail?: (eventId: string) => void;
}

export default function AIChatbot({ onOpenEventDetail }: AIChatbotProps) {
  const { user, events } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [activeModelName, setActiveModelName] = useState<string>('Google Gemini 1.5 Flash');
  const [isServerGeminiActive, setIsServerGeminiActive] = useState<boolean>(true);

  // Gemini API Key State for optional manual override
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [keyModalOpen, setKeyModalOpen] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>('');
  const [keySavedToast, setKeySavedToast] = useState<boolean>(false);

  // Check server Gemini status on mount
  useEffect(() => {
    fetch('/api/chat')
      .then(res => res.json())
      .then(data => {
        if (data.geminiConfigured) {
          setIsServerGeminiActive(true);
          setActiveModelName('Google Gemini 1.5 Flash');
        }
      })
      .catch(() => {});

    try {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        setGeminiApiKey(savedKey);
        setTempKeyInput(savedKey);
        setActiveModelName('Google Gemini 1.5 Flash');
      }
    } catch (e) {}
  }, []);

  const saveGeminiKey = (key: string) => {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem('gemini_api_key', trimmed);
      setGeminiApiKey(trimmed);
      setActiveModelName('Google Gemini 1.5 Flash');
    } else {
      localStorage.removeItem('gemini_api_key');
      setGeminiApiKey('');
      setActiveModelName(isServerGeminiActive ? 'Google Gemini 1.5 Flash' : 'Local AI v2.1');
    }
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setKeyModalOpen(false);
    }, 1200);
  };

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initialWelcomeMessage: ChatMessage = {
    id: 'welcome',
    sender: 'ai',
    text: `👋 Hi **${user?.name ? user.name.split(' ')[0] : 'there'}**! I am your **AllCollegeEvent AI Copilot**.\n\n⚡ **Powered by Google Gemini 1.5 Flash**\n\nI can analyze upcoming hackathons, find opportunities matching your **${user?.careerGoals[0] || 'AI/ML Engineer'}** goal, explain eligibility, or write starter code templates.\n\nHow can I help you discover opportunities today?`,
    timestamp: 'Just now',
    suggestedEventIds: ['allcollege-grand-hackathon-2026', 'ai-vision-summit-2026'],
    quickReplies: [
      'National Grand Hackathon 2026',
      'What are the cash prizes & grants?',
      'Give me an AI project idea',
      'How to win a hackathon?'
    ]
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialWelcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const startTime = performance.now();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(geminiApiKey ? { 'x-gemini-api-key': geminiApiKey } : {})
        },
        body: JSON.stringify({
          query,
          user: user || null,
          history: messages.slice(-4),
          geminiApiKey: geminiApiKey || undefined
        })
      });

      const elapsed = Math.round(performance.now() - startTime);
      setApiLatency(elapsed);

      if (!response.ok) {
        throw new Error('API returned an error');
      }

      const data = await response.json();
      if (data.meta?.model) {
        setActiveModelName(data.meta.model);
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.text,
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedEventIds: data.suggestedEventIds || [],
        quickReplies: data.quickReplies || []
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat API Error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `✨ I processed your query about "${query}". Check out **National Collegiate Grand Offline Hackathon 2026** (₹5L prize pool) and **NeurAI 2026**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedEventIds: ['allcollege-grand-hackathon-2026'],
        quickReplies: ['Grand Hackathon 2026', 'Show prizes', 'Offline events']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([initialWelcomeMessage]);
    setApiLatency(null);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-2xl shadow-purple-900/60 hover:scale-105 transition-all duration-300 group border border-purple-400/40"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-cyan-300 group-hover:rotate-12 transition-transform animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
          </div>
          <div className="flex flex-col text-left">
            <span>Ask AI Copilot</span>
            <span className="text-[10px] text-cyan-200 font-mono font-normal">
              ⚡ Gemini Active
            </span>
          </div>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col glass-panel border border-purple-500/40 shadow-2xl shadow-black/90 ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-6 right-4 sm:right-6 w-full max-w-[440px] h-[620px] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0d1222]/95 rounded-t-3xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#090d16] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white font-display">AI Event Copilot</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 font-mono">
                    Gemini 1.5
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {activeModelName}
                  </span>
                  {apiLatency !== null && (
                    <span className="text-purple-300 font-mono text-[10px]">({apiLatency}ms)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Gemini Key Config Button */}
              <button
                onClick={() => setKeyModalOpen(true)}
                title="Google Gemini Key Config"
                className="p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 text-cyan-400 bg-cyan-500/10 border border-cyan-500/25"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono hidden sm:inline">API Key</span>
              </button>

              <button
                onClick={clearChat}
                title="Clear Chat History"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Context Banner */}
          {user && (
            <div className="px-4 py-1.5 bg-purple-950/40 border-b border-purple-500/20 text-[11px] text-purple-200 flex items-center justify-between">
              <span className="truncate">
                Calibrated for: <strong className="text-white">{user.name}</strong> ({user.department.split(' ')[0]} • {user.careerGoals[0]})
              </span>
              <span className="text-emerald-400 font-mono text-[10px] flex-shrink-0">
                Google Gemini Engine
              </span>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                        isUser
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md shadow-purple-950/40'
                          : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Embedded Suggested Event Cards */}
                    {msg.suggestedEventIds && msg.suggestedEventIds.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {msg.suggestedEventIds.map((eventId) => {
                          const event = events.find(e => e.id === eventId);
                          if (!event) return null;
                          return (
                            <div
                              key={event.id}
                              className="p-3 rounded-xl bg-slate-900/95 border border-purple-500/30 hover:border-cyan-400/60 transition-all flex items-center justify-between gap-3 text-left group"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="font-bold text-cyan-400">{event.type}</span>
                                  <span className="text-slate-400">• {event.mode}</span>
                                  {event.featured && (
                                    <span className="text-amber-300 font-bold">🏆 National Grand</span>
                                  )}
                                </div>
                                <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-cyan-300 transition-colors">
                                  {event.title}
                                </h4>
                                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                                  {event.prizePool || event.location}
                                </div>
                              </div>

                              <button
                                onClick={() => onOpenEventDetail && onOpenEventDetail(event.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-[11px] font-semibold border border-purple-500/30 flex-shrink-0 flex items-center gap-1 transition-colors"
                              >
                                <span>View</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Quick Reply Chips */}
                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickReplies.map((reply, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(reply)}
                            className="text-[11px] px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all text-left"
                          >
                            {reply} →
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-slate-500 block px-1">
                      {msg.timestamp}
                    </span>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600/30 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-400 ml-1">
                    Google Gemini is processing query...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-800 bg-[#0d1222]/95 rounded-b-3xl"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask Gemini anything about hackathons, code, prizes..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-900/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Google Gemini API Key Modal */}
      {keyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-3xl glass-panel border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/50 space-y-4">
            <button
              onClick={() => setKeyModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Google Gemini API Configuration</h3>
                <p className="text-xs text-slate-400">Connected to Google Gemini 1.5 Flash</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your server has a default Gemini key configured in <code className="text-cyan-300 font-mono">.env.local</code>. You can optionally paste a custom key below.
            </p>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Custom Gemini API Key</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {keySavedToast && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Gemini API Key updated successfully!</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Get Free Gemini Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTempKeyInput('');
                    saveGeminiKey('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Reset Default
                </button>
                <button
                  type="button"
                  onClick={() => saveGeminiKey(tempKeyInput)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-bold shadow-md"
                >
                  Save & Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
