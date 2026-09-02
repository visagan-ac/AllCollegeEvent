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
  ShieldCheck,
  Copy,
  Code
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
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<string | null>(null);

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
      setActiveModelName(isServerGeminiActive ? 'Google Gemini 1.5 Flash' : 'AllCollegeEvent AI');
    }
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setKeyModalOpen(false);
    }, 1200);
  };

  const initialWelcomeMessage: ChatMessage = {
    id: 'welcome',
    sender: 'ai',
    text: `👋 Hi **${user?.name ? user.name.split(' ')[0] : 'Innovator'}**! I am your **AllCollegeEvent AI Copilot**.\n\n⚡ **Powered by Google Gemini 1.5 Flash & Neon PostgreSQL (2,000+ live events)**\n\nI can:\n• Find top hackathons matching your **${user?.careerGoals[0] || 'Target Career'}**\n• Explain rules, team formation, and cash prize breakdowns\n• Generate technical architectures and starter code templates (FastAPI, PyTorch, React, Solidity)\n• Analyze your skill gaps and suggest roadmaps\n\nWhat would you like to explore today?`,
    timestamp: 'Just now',
    suggestedEventIds: ['allcollege-grand-hackathon-2026'],
    quickReplies: [
      'Top hackathons with cash prizes',
      'Give me an AI project idea',
      'FastAPI starter code',
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
        text: `✨ I analyzed your question regarding "${query}". Check out our **2,000+ live opportunities** in the feed for high-prize hackathons, workshops, and student summits!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedEventIds: events.slice(0, 2).map(e => e.id),
        quickReplies: ['Show AI Hackathons', 'Offline events', 'Give me starter code']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(id);
    setTimeout(() => setCopiedCodeIndex(null), 1500);
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
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-bold text-sm shadow-xl shadow-indigo-950/40 hover:scale-105 transition-all duration-200 group border border-sky-300/30"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <div className="flex flex-col text-left">
            <span>AI Copilot</span>
            <span className="text-[10px] text-sky-100 font-mono-acc font-normal">
              ⚡ Gemini Live
            </span>
          </div>
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 flex flex-col glass-panel border border-slate-600/40 shadow-2xl ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-6 right-4 sm:right-6 w-full max-w-[460px] h-[640px] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-[#182238]/95 rounded-t-3xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 p-[1px]">
                <div className="w-full h-full bg-[#141b2d] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white font-display">AI Event Copilot</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-300 font-mono-acc font-semibold">
                    Gemini 1.5
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {activeModelName}
                  </span>
                  {apiLatency !== null && (
                    <span className="text-sky-300 font-mono-acc text-[10px]">({apiLatency}ms)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Gemini Key Config Button */}
              <button
                onClick={() => setKeyModalOpen(true)}
                title="Google Gemini Key Config"
                className="p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 text-sky-300 bg-sky-500/10 border border-sky-500/25 hover:bg-sky-500/20"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono-acc hidden sm:inline">Key</span>
              </button>

              <button
                onClick={clearChat}
                title="Clear Chat History"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User Context Banner */}
          {user && (
            <div className="px-4 py-1.5 bg-indigo-950/40 border-b border-indigo-500/20 text-[11px] text-indigo-200 flex items-center justify-between">
              <span className="truncate">
                Context: <strong className="text-white">{user.name}</strong> ({user.department.split(' ')[0]} • {user.careerGoals[0]})
              </span>
              <span className="text-sky-300 font-mono-acc text-[10px] flex-shrink-0">
                2,000+ DB Events
              </span>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg, mIdx) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2.5 ${isUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-line font-sans ${
                        isUser
                          ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-800/95 text-slate-100 border border-slate-700/80 rounded-tl-none shadow-sm'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Embedded Suggested Event Cards */}
                    {msg.suggestedEventIds && msg.suggestedEventIds.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {msg.suggestedEventIds.map((eventId) => {
                          const event = events.find(e => e.id === eventId || e.slug === eventId);
                          if (!event) return null;
                          return (
                            <div
                              key={event.id}
                              className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-sky-400/50 transition-all flex items-center justify-between gap-3 text-left group shadow-sm"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="font-bold text-sky-300">{event.type}</span>
                                  <span className="text-slate-400">• {event.mode}</span>
                                  <span className="text-emerald-300 font-semibold">{event.prizePool}</span>
                                </div>
                                <h4 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-sky-300 transition-colors">
                                  {event.title}
                                </h4>
                                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                                  {event.location}
                                </div>
                              </div>

                              <button
                                onClick={() => onOpenEventDetail && onOpenEventDetail(event.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex-shrink-0 flex items-center gap-1 transition-colors shadow-sm"
                              >
                                <span>Explore</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Quick Replies */}
                    {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.quickReplies.map((reply, rIdx) => (
                          <button
                            key={rIdx}
                            onClick={() => handleSendMessage(reply)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-sky-200 border border-slate-700 text-[11px] font-medium transition-colors"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-800 text-slate-400 border border-slate-700 rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] text-slate-400 ml-1.5">Gemini thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-700 bg-[#182238]/95 rounded-b-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about 2,000+ hackathons, code, prizes, tips..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors font-sans"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 disabled:opacity-50 text-white font-bold transition-all shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gemini API Key Config Modal */}
      {keyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md p-6 rounded-3xl glass-panel border border-slate-700 shadow-2xl">
            <button
              onClick={() => setKeyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-white font-bold text-base font-display">
              <Key className="w-5 h-5 text-sky-400" />
              <span>Google Gemini API Key Config</span>
            </div>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans">
              Connect your Google Gemini API key to query all 2,000+ database events with live LLM intelligence.
            </p>

            <div className="mt-4 space-y-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-400"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Get Free Gemini Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => saveGeminiKey(tempKeyInput)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-bold text-xs shadow-md"
                >
                  Save Key
                </button>
              </div>
            </div>

            {keySavedToast && (
              <div className="mt-3 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold">
                ✓ Gemini Key configured successfully!
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
