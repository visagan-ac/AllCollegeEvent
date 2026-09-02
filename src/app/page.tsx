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
  ArrowRight, 
  Bot, 
  ChevronDown
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Section - Calm Soft-Slate Panel */}
      <div className="relative rounded-3xl p-8 sm:p-10 glass-panel border border-slate-600/30 overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-gradient-to-br from-indigo-500/10 via-sky-400/08 to-teal-400/06 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-600/50 text-xs font-semibold text-sky-200">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Collegiate Opportunity Intelligence • 2,000+ Verified Events</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display leading-[1.15]">
              AI-Powered <span className="gradient-text-calm">Opportunity Discovery</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              Explore 2,000+ curated hackathons, workshops, and student summits across 22 major cities — tailored autonomously to your branch, skills, and target career.
            </p>

            {/* Quick Hero CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#discovery-feed"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-950/40 flex items-center gap-2"
              >
                <span>Explore 2,000+ Opportunities</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-300">
                <Bot className="w-4 h-4 text-sky-400" />
                <span>AI Chatbot Active</span>
              </div>
            </div>
          </div>

          {/* Platform Metrics Card */}
          <div className="grid grid-cols-2 gap-3 lg:w-80 flex-shrink-0">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-display">2,000+</div>
              <div className="text-xs text-sky-200 mt-1 font-medium">Verified Events</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-display">22+</div>
              <div className="text-xs text-indigo-200 mt-1 font-medium">Tech Cities</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-display">12</div>
              <div className="text-xs text-teal-200 mt-1 font-medium">Domains</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-display">98.4%</div>
              <div className="text-xs text-emerald-200 mt-1 font-medium">Match Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Profile Status / Quick Sign Up Banner */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {user ? (
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-600 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-display">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  Profile Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {user.department} • {user.college} • Target: <strong className="text-sky-300">{user.careerGoals[0]}</strong>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-sm font-bold text-white font-display">Guest Mode</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Sign in with Google or Email to unlock 1-click passes, bookmarks, and customized skill rankings.
            </p>
          </div>
        )}

        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>{user ? 'Edit Profile & Goals' : 'Sign Up with Google / Email'}</span>
        </button>
      </div>

      {/* Discovery Filters & Search */}
      <div id="discovery-feed" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
              <span>Personalized Opportunity Feed</span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700 font-mono-acc font-semibold">
                {filteredRecommendations.length} Opportunities
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked in real-time by the AI matching engine for {user ? <strong className="text-slate-200">{user.name}</strong> : 'you'}.
            </p>
          </div>

          {/* Search Bar & Sort Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search city, skill, hackathon..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(24);
                }}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Sort opportunities by"
              className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-sky-400 transition-colors font-medium"
            >
              <option value="match">Sort by AI Match</option>
              <option value="trust">Sort by Trust Score</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Stylish Mild Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setVisibleCount(24);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-md border border-indigo-300/40'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Format:</span>
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setSelectedMode(mode);
                setVisibleCount(24);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedMode === mode
                  ? 'bg-sky-500/20 text-sky-200 border border-sky-400/40 font-semibold'
                  : 'hover:text-slate-200 bg-slate-800/70 border border-slate-700/70 text-slate-400'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        <div className="text-center pt-2 pb-6">
          <button
            onClick={() => setVisibleCount(prev => prev + 24)}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-xs transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Load More Opportunities ({filteredRecommendations.length - visibleCount} remaining)</span>
            <ChevronDown className="w-3.5 h-3.5 text-sky-400" />
          </button>
        </div>
      )}

      {filteredRecommendations.length === 0 && (
        <div className="p-12 rounded-2xl glass-panel border border-slate-700 text-center space-y-3">
          <Sparkles className="w-7 h-7 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-white font-display">No matching events found</h3>
          <p className="text-xs text-slate-300">Try resetting category, city, or search keywords to discover more opportunities.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedMode('All');
              setSearchQuery('');
              setVisibleCount(24);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
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
