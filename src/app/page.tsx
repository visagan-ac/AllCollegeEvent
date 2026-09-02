'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RecommendationScore } from '@/lib/types';
import EventCard from '@/components/EventCard';
import AIExplainerModal from '@/components/AIExplainerModal';
import EventDetailModal from '@/components/EventDetailModal';
import AIChatbot from '@/components/AIChatbot';
import { 
  Sparkles, 
  Search, 
  Trophy, 
  ArrowRight, 
  MessageSquare, 
  SlidersHorizontal,
  Bot,
  MapPin,
  ChevronDown,
  Layers,
  Flame,
  Globe2
} from 'lucide-react';

export default function HomePage() {
  const { 
    user, 
    setAuthModalOpen, 
    rankedRecommendations,
    events
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'trust' | 'date'>('match');
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Modals state
  const [explainingRecommendation, setExplainingRecommendation] = useState<RecommendationScore | null>(null);
  const [detailedRecommendation, setDetailedRecommendation] = useState<RecommendationScore | null>(null);

  const categories = [
    'All',
    'AI & Machine Learning',
    'Full Stack & Web3',
    'Cloud & DevOps',
    'Cybersecurity',
    'Data Science & Analytics',
    'Robotics & IoT',
    'Mobile & App Dev',
    'Competitive Coding',
    'AR/VR & Game Dev',
    'FinTech & Algorithmic Trading',
    'BioTech & Computational Health',
    'CleanTech & Sustainable Smart Grid'
  ];

  const modes = ['All', 'Offline', 'Virtual', 'Hybrid'];

  // Filter recommendations
  const filteredRecommendations = rankedRecommendations.filter(({ event }) => {
    const q = (searchQuery || '').toLowerCase();
    const title = (event?.title || '').toLowerCase();
    const desc = (event?.description || '').toLowerCase();
    const orgName = (event?.organizer?.name || '').toLowerCase();
    const loc = (event?.location || (event as any)?.locationVenue || '').toLowerCase();
    const skills = event?.requiredSkills || [];

    const matchesSearch = 
      !q ||
      title.includes(q) ||
      desc.includes(q) ||
      orgName.includes(q) ||
      loc.includes(q) ||
      skills.some(s => (s || '').toLowerCase().includes(q));

    const matchesCategory = selectedCategory === 'All' || event?.category === selectedCategory;
    const matchesMode = selectedMode === 'All' || event?.mode === selectedMode;

    return matchesSearch && matchesCategory && matchesMode;
  }).sort((a, b) => {
    if (sortBy === 'trust') return (b.event?.trustScore || 0) - (a.event?.trustScore || 0);
    if (sortBy === 'date') return new Date(a.event?.startDate || 0).getTime() - new Date(b.event?.startDate || 0).getTime();
    return (b.matchScore || 0) - (a.matchScore || 0);
  });

  const handleOpenEventById = (eventId: string) => {
    const found = rankedRecommendations.find(r => r.event.id === eventId);
    if (found) {
      setDetailedRecommendation(found);
    }
  };

  const paginatedRecommendations = filteredRecommendations.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 glass-panel border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-950/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/25 via-cyan-500/20 to-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/25 via-cyan-500/20 to-emerald-500/20 border border-purple-400/40 text-xs font-bold text-purple-200 shadow-md shadow-purple-950/40">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
              <span>National Opportunity Intelligence Layer • 2,000+ Verified Live Events</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-display leading-[1.12]">
              AI-Powered <span className="gradient-text-brand">Collegiate Discovery</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Connect to 2,000+ high-impact hackathons, conferences, and workshops across 22 major cities in India & globally — matched autonomously to your branch, skills, and target career.
            </p>

            {/* Quick Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#discovery-feed"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-purple-950/60 flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>Explore 2,000+ Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-xs font-semibold text-purple-200">
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>AI Chatbot Active (Bottom Right)</span>
              </div>
            </div>
          </div>

          {/* Platform Metrics Card */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-84 flex-shrink-0">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 hover:border-purple-500/50 transition-all text-center group">
              <div className="text-2xl sm:text-3xl font-black text-white font-display group-hover:scale-105 transition-transform">2,000+</div>
              <div className="text-xs text-purple-300 font-medium mt-1">Verified Events</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/20 hover:border-cyan-500/50 transition-all text-center group">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-display group-hover:scale-105 transition-transform">22+</div>
              <div className="text-xs text-cyan-300 font-medium mt-1">Major Hubs & Cities</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-500/50 transition-all text-center group">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display group-hover:scale-105 transition-transform">12</div>
              <div className="text-xs text-emerald-300 font-medium mt-1">Tech Domains</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/50 transition-all text-center group">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display group-hover:scale-105 transition-transform">98.4%</div>
              <div className="text-xs text-amber-300 font-medium mt-1">Match Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Profile Status / Quick Sign Up Banner */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-md shadow-purple-950/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">{user.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  Profile Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                {user.department} • {user.college} • Target: <strong className="text-cyan-400">{user.careerGoals[0]}</strong>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-base font-bold text-white font-display">Browsing in Guest Mode</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Sign in with Google or Email to unlock 1-click event passes, skill matching, and bookmark sync.
            </p>
          </div>
        )}

        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/30 flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{user ? 'Edit Skills & Career Goal' : 'Sign Up with Google / Email'}</span>
        </button>
      </div>

      {/* Discovery Filters & Search */}
      <div id="discovery-feed" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white font-display flex items-center gap-2">
              <span>Personalized Opportunity Feed</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 font-mono-acc font-bold">
                {filteredRecommendations.length} Opportunities
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Ranked in real-time by the AI matching engine for {user ? <strong className="text-slate-200">{user.name}</strong> : 'you'}.
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city, skills, hackathon..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(24);
                }}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-sans"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Sort opportunities by"
              className="px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 transition-all font-sans font-medium"
            >
              <option value="match">Sort by AI Match</option>
              <option value="trust">Sort by Trust Score</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setVisibleCount(24);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-purple-950/60 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-bold text-slate-300">Format:</span>
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSelectedMode(mode);
                setVisibleCount(24);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                selectedMode === mode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950/40'
                  : 'hover:text-white bg-slate-900/60 border border-slate-800/80 text-slate-400'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedRecommendations.map((rec) => (
          <EventCard
            key={rec.event.id}
            recommendation={rec}
            student={user || {
              id: 'guest',
              name: 'Guest Innovator',
              avatar: '',
              email: '',
              college: 'Collegiate Campus',
              department: 'Computer Science',
              yearOfStudy: 3,
              cgpa: 8.5,
              location: 'India',
              skills: [],
              interests: [],
              careerGoals: ['Software Engineer'],
              preferredMode: 'All',
              previousEvents: [],
              bookmarkedEventIds: [],
              registeredEventIds: []
            }}
            onOpenDetail={() => setDetailedRecommendation(rec)}
            onOpenExplainer={() => setExplainingRecommendation(rec)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < filteredRecommendations.length && (
        <div className="text-center pt-4 pb-8">
          <button
            onClick={() => setVisibleCount(prev => prev + 24)}
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-purple-500/40 hover:border-cyan-400 text-white font-bold text-sm transition-all shadow-xl shadow-purple-950/40 inline-flex items-center gap-2 hover:scale-[1.02]"
          >
            <span>Load More Opportunities ({filteredRecommendations.length - visibleCount} remaining)</span>
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      )}

      {filteredRecommendations.length === 0 && (
        <div className="p-12 rounded-3xl glass-panel border border-slate-800 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white font-display">No matching events found</h3>
          <p className="text-xs text-slate-400">Try resetting category, city, or search keywords to discover more opportunities.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedMode('All');
              setSearchQuery('');
              setVisibleCount(24);
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* AI Explainer Modal */}
      {explainingRecommendation && (
        <AIExplainerModal
          recommendation={explainingRecommendation}
          student={user || {
            id: 'guest',
            name: 'Guest Innovator',
            avatar: '',
            email: '',
            college: 'Collegiate Campus',
            department: 'Computer Science & Engineering',
            yearOfStudy: 3,
            cgpa: 8.5,
            location: 'India',
            skills: [],
            interests: [],
            careerGoals: ['Software Engineer'],
            preferredMode: 'All',
            previousEvents: [],
            bookmarkedEventIds: [],
            registeredEventIds: []
          }}
          onClose={() => setExplainingRecommendation(null)}
        />
      )}

      {/* Event Detail Modal */}
      {detailedRecommendation && (
        <EventDetailModal
          event={detailedRecommendation.event}
          student={user || {
            id: 'guest',
            name: 'Collegiate Innovator',
            avatar: '',
            email: '',
            college: 'Collegiate Campus',
            department: 'Computer Science & Engineering',
            yearOfStudy: 3,
            cgpa: 8.5,
            location: 'India',
            skills: [],
            interests: [],
            careerGoals: ['Software Engineer'],
            preferredMode: 'All',
            previousEvents: [],
            bookmarkedEventIds: [],
            registeredEventIds: []
          }}
          matchScore={detailedRecommendation.matchScore}
          onClose={() => setDetailedRecommendation(null)}
          onOpenExplainer={() => {
            setExplainingRecommendation(detailedRecommendation);
            setDetailedRecommendation(null);
          }}
        />
      )}

      {/* Embedded AI Chatbot Assistant */}
      <AIChatbot onOpenEventDetail={handleOpenEventById} />

    </div>
  );
}
