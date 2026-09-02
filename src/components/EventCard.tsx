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
  CheckCircle
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

  // Mild, stylish match score badge colors
  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        border: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        ring: 'text-emerald-400'
      };
    }
    if (score >= 80) {
      return {
        border: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
        ring: 'text-indigo-400'
      };
    }
    if (score >= 70) {
      return {
        border: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
        ring: 'text-sky-400'
      };
    }
    return {
      border: 'border-slate-700 bg-slate-800 text-slate-300',
      ring: 'text-slate-300'
    };
  };

  const scoreBadge = getScoreBadge(matchScore);

  return (
    <div className="relative group rounded-2xl glass-panel glass-panel-hover p-5 flex flex-col justify-between transition-all duration-200">
      
      {/* Featured Ribbon / National badge */}
      {event.featured && (
        <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-[10px] font-semibold tracking-wide text-amber-300 uppercase flex items-center gap-1 z-10">
          <Trophy className="w-3 h-3 text-amber-400" />
          <span>Spotlight 2026</span>
        </div>
      )}

      <div>
        {/* Top Header Row: Category, Mode, and AI Match Score Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              {event.category}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-400">
              {event.type}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${
              event.mode === 'Offline' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
              event.mode === 'Virtual' ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20' :
              'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            }`}>
              {event.mode}
            </span>
          </div>

          {/* Mild Match Score Circle Badge */}
          <button
            onClick={onOpenExplainer}
            title="Click to view AI Match Explanation"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${scoreBadge.border} hover:scale-105 transition-all flex-shrink-0 cursor-pointer`}
          >
            <span className={`text-xs font-bold font-mono-acc leading-none ${scoreBadge.ring}`}>{matchScore}%</span>
            <span className="text-[8px] uppercase tracking-wider font-semibold mt-0.5 opacity-80">Match</span>
          </button>
        </div>

        {/* Event Title & Organizer */}
        <div className="mt-3">
          <h3 
            onClick={onOpenDetail}
            className="text-base font-bold text-white hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2 font-display leading-snug"
          >
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">{event?.organizer?.name || 'College Partner'}</span>
            {event?.organizer?.verified && (
              <span title="Verified Organizer" className="inline-flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
              </span>
            )}
            <span className="text-slate-400">• {(event?.organizer?.college || 'Campus').split(' ')[0]}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-300/80 mt-2 line-clamp-2 leading-relaxed">
          {event?.shortSummary || event?.description || ''}
        </p>

        {/* AI Career Bridge Trajectory Insight Tag */}
        <div className="mt-3 p-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-300 font-medium line-clamp-2">
            {careerBridgeImpact}
          </p>
        </div>

        {/* Meta Info (Dates, Location) */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{event?.startDate || '2026'} ({(event?.duration || '36 Hours').split(' ')[0]})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{(event?.location || (event as any)?.locationVenue || 'Hybrid / Online').split(',')[0]}</span>
          </div>
        </div>

        {/* Matched Skill Tags */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-medium text-slate-400">Skills Required:</span>
            <span className="text-indigo-300 font-mono-acc text-[10px]">{(matchedSkills || []).length} match</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(event.requiredSkills || []).slice(0, 3).map((skill, idx) => {
              const studentSkills = student?.skills || [];
              const hasSkill = studentSkills.some(s => (s?.name || '').toLowerCase() === (skill || '').toLowerCase());
              return (
                <span 
                  key={idx} 
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                    hasSkill 
                      ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-300' 
                      : 'bg-slate-800/80 border border-slate-700/80 text-slate-400'
                  }`}
                >
                  {hasSkill && '✓ '} {skill}
                </span>
              );
            })}
            {(event.requiredSkills || []).length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/80 text-slate-400 font-mono-acc">
                +{(event.requiredSkills || []).length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleBookmark}
            title={isBookmarked ? "Remove Bookmark" : "Save Event"}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-indigo-400 text-indigo-400' : ''}`} />
          </button>

          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>AI Match</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isRegistered && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/25">
              <CheckCircle className="w-3 h-3" /> Registered
            </span>
          )}

          <button
            onClick={onOpenDetail}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
