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
  Bot
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
    'Mobile & App Dev'
  ];

  const modes = ['All', 'Offline', 'Virtual', 'Hybrid'];

  // Filter recommendations
  const filteredRecommendations = rankedRecommendations.filter(({ event }) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesMode = selectedMode === 'All' || event.mode === selectedMode;

    return matchesSearch && matchesCategory && matchesMode;
  }).sort((a, b) => {
    if (sortBy === 'trust') return b.event.trustScore - a.event.trustScore;
    if (sortBy === 'date') return new Date(a.event.startDate).getTime() - new Date(b.event.startDate).getTime();
    return b.matchScore - a.matchScore;
  });

  const handleOpenEventById = (eventId: string) => {
    const found = rankedRecommendations.find(r => r.event.id === eventId);
    if (found) {
      setDetailedRecommendation(found);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl p-8 sm:p-12 glass-panel border border-purple-500/25 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 via-cyan-500/15 to-transparent rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-xs font-bold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>AI-Driven Opportunity Ecosystem • AllCollegeEvent 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display leading-[1.15]">
              AI-Powered Personalized <span className="gradient-text-brand">Event Discovery</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Connect to high-impact hackathons, conferences, workshops, and internships tailored specifically to your branch, verified skills, and career trajectory.
            </p>

            {/* Quick Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#discovery-feed"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-900/40 flex items-center gap-2"
              >
                <span>Explore Matched Events</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs font-semibold text-purple-300">
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>AI Copilot Chatbot Active in Bottom Corner</span>
              </div>
            </div>
          </div>

          {/* Platform Metrics Card */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:w-80 flex-shrink-0">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">1,500+</div>
              <div className="text-xs text-slate-400 mt-0.5">Verified Events</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-display">98.4%</div>
              <div className="text-xs text-slate-400 mt-0.5">Match Accuracy</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-display">85,000+</div>
              <div className="text-xs text-slate-400 mt-0.5">Students Matched</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">₹45L+</div>
              <div className="text-xs text-slate-400 mt-0.5">Grants & Prizes</div>
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
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-purple-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">{user.name}</h2>
                <span className="text-[11px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                  Year {user.yearOfStudy} • {user.department.split(' ')[0]}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                  Profile Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Role: <strong className="text-purple-300">{user.careerGoals[0]}</strong> • {user.skills.length} skills calibrated
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-bold text-white">Create Your Student AI Profile</h2>
            <p className="text-xs text-slate-400">Sign up with Google or verify your email to get personalized recommendations.</p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold transition-all flex items-center gap-2"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>{user ? 'Edit Skills & Career Goal' : 'Sign Up with Google / Email'}</span>
        </button>
      </div>

      {/* Discovery Filters & Search */}
      <div id="discovery-feed" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white font-display flex items-center gap-2">
              <span>Personalized Opportunity Feed</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono">
                {filteredRecommendations.length} Opportunities
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked in real-time by the AI matching engine for {user ? <strong className="text-slate-200">{user.name}</strong> : 'you'}.
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, hackathons, college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Sort opportunities by"
              className="px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
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
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold">Format:</span>
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedMode === mode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecommendations.map((rec) => (
          <EventCard
            key={rec.event.id}
            recommendation={rec}
            student={user || {
              id: 'guest',
              name: 'Guest Innovator',
              avatar: '',
              email: '',
              college: '',
              department: 'Computer Science',
              yearOfStudy: 3,
              cgpa: 8.5,
              location: 'India',
              skills: [],
              interests: [],
              careerGoals: ['AI/ML Engineer'],
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

      {filteredRecommendations.length === 0 && (
        <div className="p-12 rounded-3xl glass-panel border border-slate-800 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching events found</h3>
          <p className="text-xs text-slate-400">Try resetting category or search keywords to discover more opportunities.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedMode('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* AI Explainer Modal */}
      {explainingRecommendation && user && (
        <AIExplainerModal
          recommendation={explainingRecommendation}
          student={user}
          onClose={() => setExplainingRecommendation(null)}
        />
      )}

      {/* Event Detail Modal */}
      {detailedRecommendation && user && (
        <EventDetailModal
          event={detailedRecommendation.event}
          student={user}
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
