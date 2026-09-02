'use client';

import React from 'react';
import { RecommendationScore, StudentProfile } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Trophy, 
  ShieldCheck, 
  Bookmark, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  CheckCircle,
  Zap
} from 'lucide-react';

interface EventCardProps {
  recommendation: RecommendationScore;
  student: StudentProfile;
  onOpenDetail: () => void;
  onOpenExplainer: () => void;
}

export default function EventCard({ recommendation, student, onOpenDetail, onOpenExplainer }: EventCardProps) {
  const { event, matchScore, matchedSkills, careerBridgeImpact, matchTier } = recommendation;
  const { user, isAuthenticated, setAuthModalOpen, bookmarkedEventIds, registeredEventIds, toggleBookmark } = useApp();
  
  const isBookmarked = bookmarkedEventIds.includes(event.id);
  const isRegistered = registeredEventIds.includes(event.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated || !user) {
      setAuthModalOpen(true);
      return;
    }
    toggleBookmark(event.id);
  };

  // Luminous match score color schemes
  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        border: 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 shadow-emerald-900/30',
        ring: 'text-emerald-400'
      };
    }
    if (score >= 80) {
      return {
        border: 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-cyan-900/30',
        ring: 'text-cyan-400'
      };
    }
    if (score >= 70) {
      return {
        border: 'border-purple-500/50 bg-purple-950/40 text-purple-300 shadow-purple-900/30',
        ring: 'text-purple-400'
      };
    }
    return {
      border: 'border-amber-500/50 bg-amber-950/40 text-amber-300 shadow-amber-900/30',
      ring: 'text-amber-400'
    };
  };

  const scoreBadge = getScoreBadge(matchScore);

  return (
    <div className="relative group rounded-3xl glass-panel glass-panel-hover p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl">
      
      {/* Featured Ribbon / National badge */}
      {event.featured && (
        <div className="absolute -top-3 left-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-[11px] font-black tracking-wider text-black uppercase shadow-lg shadow-amber-500/30 flex items-center gap-1 z-10">
          <Trophy className="w-3.5 h-3.5 text-black" />
          <span>National Spotlight</span>
        </div>
      )}

      <div>
        {/* Top Header Row: Category, Mode, and AI Match Score Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200">
              {event.category}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
              {event.type}
            </span>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
              event.mode === 'Offline' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
              event.mode === 'Virtual' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' :
              'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
            }`}>
              {event.mode}
            </span>
          </div>

          {/* Luminous AI Match Circle Badge */}
          <button
            onClick={onOpenExplainer}
            title="Click to view AI Match Explanation"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border ${scoreBadge.border} shadow-lg hover:scale-105 transition-all flex-shrink-0 cursor-pointer group/score`}
          >
            <span className={`text-xs font-black font-mono-acc leading-none ${scoreBadge.ring}`}>{matchScore}%</span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold mt-0.5 opacity-90">Match</span>
          </button>
        </div>

        {/* Event Title & Organizer */}
        <div className="mt-3.5">
          <h3 
            onClick={onOpenDetail}
            className="text-lg font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 font-display leading-snug"
          >
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
            <span className="text-slate-200 font-semibold">{event?.organizer?.name || 'College Partner'}</span>
            {event?.organizer?.verified && (
              <span title="Verified Organizer" className="inline-flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              </span>
            )}
            <span className="text-slate-400">• {(event?.organizer?.college || 'Campus').split(' ')[0]}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-300/90 mt-2.5 line-clamp-2 leading-relaxed font-sans">
          {event?.shortSummary || event?.description || ''}
        </p>

        {/* AI Career Bridge Trajectory Insight Tag */}
        <div className="mt-3.5 p-2.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-slate-900/60 border border-purple-500/25 flex items-start gap-2">
          <Zap className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0 animate-pulse" />
          <p className="text-[11px] text-purple-200 font-medium line-clamp-2 font-sans">
            {careerBridgeImpact}
          </p>
        </div>

        {/* Meta Info (Dates, Prize, Location) */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate">{event?.startDate || '2026'} ({(event?.duration || '36 Hours').split(' ')[0]})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span className="truncate">{(event?.location || (event as any)?.locationVenue || 'Hybrid / Online').split(',')[0]}</span>
          </div>
        </div>

        {/* Matched Skill Tags */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-semibold text-slate-300">Key Technologies:</span>
            <span className="text-cyan-400 font-mono-acc font-bold">{(matchedSkills || []).length} match</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(event.requiredSkills || []).slice(0, 3).map((skill, idx) => {
              const studentSkills = student?.skills || [];
              const hasSkill = studentSkills.some(s => (s?.name || '').toLowerCase() === (skill || '').toLowerCase());
              return (
                <span 
                  key={idx} 
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                    hasSkill 
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  {hasSkill && '✓ '} {skill}
                </span>
              );
            })}
            {(event.requiredSkills || []).length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-mono-acc">
                +{(event.requiredSkills || []).length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleBookmark}
            title={isBookmarked ? "Remove Bookmark" : "Save Event"}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-purple-600/30 border-purple-500/60 text-purple-300 shadow-md shadow-purple-950/40'
                : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
          </button>

          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-semibold border border-purple-500/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>AI Match</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isRegistered && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <CheckCircle className="w-3 h-3" /> Registered
            </span>
          )}

          <button
            onClick={onOpenDetail}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold transition-all shadow-lg shadow-purple-950/50 hover:scale-[1.03]"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
