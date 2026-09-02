'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RecommendationScore } from '@/lib/types';
import { MOCK_EVENTS } from '@/lib/mockData';
import EventCard from '@/components/EventCard';
import AIExplainerModal from '@/components/AIExplainerModal';
import EventDetailModal from '@/components/EventDetailModal';
import AIChatbot from '@/components/AIChatbot';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Bot, 
  ChevronDown,
  X,
  Filter,
  CornerDownLeft,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const { 
    user, 
    setAuthModalOpen, 
    rankedRecommendations,
    events
  } = useApp();

  const [searchInput, setSearchInput] = useState('');
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

  const quickSearchTags = [
    'Hackathon',
    'Bengaluru',
    'Hyderabad',
    'Chennai',
    'Mumbai',
    'Delhi NCR',
    'Python',
    'Generative AI',
    'Web3',
    'Cybersecurity',
    'IIT',
    'Workshop'
  ];

  // Execute search on Enter key or Search button click
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
    setVisibleCount(24);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedMode('All');
    setVisibleCount(24);
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchInput(tag);
    setSearchQuery(tag);
    setSelectedCategory('All');
    setVisibleCount(24);
  };

  // Universal Multi-Keyword Full-Text & Synonym Search Engine
  const activeQuery = (searchQuery || searchInput).toLowerCase().trim();
  const searchTokens = activeQuery.split(/\s+/).filter(Boolean);

  const filteredRecommendations = rankedRecommendations.filter(({ event }) => {
    // Compile a comprehensive searchable string of all event attributes
    const searchableCorpus = [
      event?.title || '',
      event?.description || '',
      event?.shortSummary || '',
      event?.category || '',
      event?.type || '',
      event?.mode || '',
      (event as any)?.city || '',
      event?.location || (event as any)?.locationVenue || '',
      event?.organizer?.name || '',
      event?.organizer?.college || '',
      event?.difficulty || '',
      event?.prizePool || '',
      ...(event?.requiredSkills || []),
      ...(event?.skillsGained || []),
      ...(event?.targetAudience || []),
      ...(event?.careerRelevance || []),
      ...(event?.perks || []),
      ...(event?.eligibility || []),
      ...((event?.mentors || []).map((m: any) => `${m?.name || ''} ${m?.role || ''} ${m?.company || ''}`)),
    ].join(' ').toLowerCase();

    // Every token must match somewhere in the corpus (with synonym expansion)
    const matchesSearch = searchTokens.length === 0 || searchTokens.every(token => {
      if (searchableCorpus.includes(token)) return true;
      if (token === 'ai' && (searchableCorpus.includes('artificial intelligence') || searchableCorpus.includes('machine learning') || searchableCorpus.includes('neural') || searchableCorpus.includes('deep learning'))) return true;
      if (token === 'ml' && (searchableCorpus.includes('machine learning') || searchableCorpus.includes('deep learning') || searchableCorpus.includes('data science'))) return true;
      if (token === 'web3' && (searchableCorpus.includes('blockchain') || searchableCorpus.includes('solidity') || searchableCorpus.includes('crypto') || searchableCorpus.includes('ethereum') || searchableCorpus.includes('defi'))) return true;
      if (token === 'crypto' && (searchableCorpus.includes('web3') || searchableCorpus.includes('blockchain') || searchableCorpus.includes('solidity'))) return true;
      if (token === 'bangalore' && (searchableCorpus.includes('bengaluru') || searchableCorpus.includes('karnataka'))) return true;
      if (token === 'bengaluru' && (searchableCorpus.includes('bangalore') || searchableCorpus.includes('karnataka'))) return true;
      if (token === 'chennai' && (searchableCorpus.includes('madras') || searchableCorpus.includes('tamil nadu'))) return true;
      if (token === 'mumbai' && (searchableCorpus.includes('bombay') || searchableCorpus.includes('maharashtra'))) return true;
      if (token === 'offline' && (event?.mode === 'Offline' || event?.mode === 'Hybrid')) return true;
      if (token === 'virtual' && (event?.mode === 'Virtual' || event?.mode === 'Hybrid')) return true;
      if (token === 'online' && (event?.mode === 'Virtual' || event?.mode === 'Hybrid')) return true;
      if (token === 'hack' && searchableCorpus.includes('hackathon')) return true;
      return false;
    });

    const matchesCategory = selectedCategory === 'All' || event?.category === selectedCategory;
    const matchesMode = selectedMode === 'All' || event?.mode === selectedMode;

    return matchesSearch && matchesCategory && matchesMode;
  }).sort((a, b) => {
    if (sortBy === 'trust') return (b.event?.trustScore || 0) - (a.event?.trustScore || 0);
    if (sortBy === 'date') return new Date(a.event?.startDate || 0).getTime() - new Date(b.event?.startDate || 0).getTime();
    return (b.matchScore || 0) - (a.matchScore || 0);
  });

  const handleOpenEventById = (eventId: string) => {
    const found = rankedRecommendations.find(r => r.event.id === eventId || (r.event as any).slug === eventId);
    if (found) {
      setDetailedRecommendation(found);
      return;
    }
    const evt = events.find(e => e.id === eventId || (e as any).slug === eventId) || MOCK_EVENTS.find(e => e.id === eventId || (e as any).slug === eventId);
    if (evt) {
      setDetailedRecommendation({
        event: evt,
        matchScore: 98,
        matchedSkills: evt.requiredSkills?.slice(0, 3) || ['Python'],
        missingSkillsToGain: evt.skillsGained?.slice(0, 2) || ['MLOps'],
        careerBridgeImpact: 'Direct portfolio accelerator',
        explanation: `Top matched opportunity for ${user?.department || 'Tech'} innovators.`,
        matchTier: 'Perfect Match',
        breakdown: {
          skillMatchScore: 95,
          careerGoalScore: 98,
          departmentAffinity: 95,
          interestAlignment: 90,
          historyBoost: 90,
          locationBonus: 95
        }
      });
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
              Search by skill, city, college, organizer, topic, or role across all 2,000+ opportunities.
            </p>
          </div>

          {/* Search Form with Enter Support & Search Button */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 sm:w-96">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search city, skill, college, hackathon, role..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSearchQuery(e.target.value);
                    setVisibleCount(24);
                  }}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all font-sans"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    title="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Explicit Search Button with Enter Support */}
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-bold text-xs transition-all shadow-md shadow-indigo-950/30 flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Search</span>
                <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
              </button>
            </form>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              aria-label="Sort opportunities by"
              className="px-3 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-sky-400 transition-colors font-medium"
            >
              <option value="match">Sort by AI Match</option>
              <option value="trust">Sort by Trust Score</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Active Search Filter Badge & Quick Search Suggestions Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] text-slate-400">
          <span className="font-semibold text-slate-400 flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3 h-3 text-sky-400" /> Popular:
          </span>
          {quickSearchTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              className={`px-2.5 py-0.5 rounded-full border transition-all flex-shrink-0 ${
                (searchQuery || searchInput).toLowerCase() === tag.toLowerCase()
                  ? 'bg-sky-500/20 text-sky-200 border-sky-400/50 font-bold'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
          {(searchQuery || searchInput) && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-rose-400 hover:underline font-semibold ml-1 flex-shrink-0"
            >
              Clear Search ({searchQuery || searchInput})
            </button>
          )}
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
          <h3 className="text-sm font-bold text-white font-display">No matching events found for &quot;{searchQuery || searchInput}&quot;</h3>
          <p className="text-xs text-slate-300">Try searching for keywords like &quot;Python&quot;, &quot;Bengaluru&quot;, &quot;Hackathon&quot;, or &quot;Web3&quot;.</p>
          <button
            onClick={handleClearSearch}
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
