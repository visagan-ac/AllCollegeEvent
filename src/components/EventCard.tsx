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
  const { bookmarkedEventIds, registeredEventIds, toggleBookmark } = useApp();
  
  const isBookmarked = bookmarkedEventIds.includes(event.id);
  const isRegistered = registeredEventIds.includes(event.id);

  // Match score color classes
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/20';
    if (score >= 80) return 'text-cyan-400 border-cyan-500/50 bg-cyan-500/10 shadow-cyan-500/20';
    if (score >= 70) return 'text-purple-400 border-purple-500/50 bg-purple-500/10 shadow-purple-500/20';
    return 'text-amber-400 border-amber-500/50 bg-amber-500/10 shadow-amber-500/20';
  };

  return (
    <div className="relative group rounded-3xl glass-panel glass-panel-hover p-5 sm:p-6 flex flex-col justify-between transition-all duration-300">
      
      {/* Featured Ribbon / National badge */}
      {event.featured && (
        <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[11px] font-black tracking-wider text-black uppercase shadow-lg shadow-amber-500/30 flex items-center gap-1 z-10">
          <Trophy className="w-3 h-3 text-black" />
          <span>National Spotlight 2026</span>
        </div>
      )}

      <div>
        {/* Top Header Row: Category, Mode, and AI Match Score Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300">
              {event.category}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300">
              {event.type}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${
              event.mode === 'Offline' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
              event.mode === 'Virtual' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' :
              'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            }`}>
              {event.mode}
            </span>
          </div>

          {/* AI Match Circle Badge */}
          <button
            onClick={onOpenExplainer}
            title="Click to view AI Match Explanation"
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border ${getScoreColor(matchScore)} shadow-lg group/score hover:scale-105 transition-transform flex-shrink-0 cursor-pointer`}
          >
            <span className="text-xs font-bold leading-none">{matchScore}%</span>
            <span className="text-[9px] uppercase tracking-tighter font-extrabold mt-0.5 opacity-90">Match</span>
          </button>
        </div>

        {/* Event Title & Organizer */}
        <div className="mt-3">
          <h3 
            onClick={onOpenDetail}
            className="text-lg font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer line-clamp-2 font-display"
          >
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400">
            <span className="text-slate-300 font-medium">{event?.organizer?.name || 'College Partner'}</span>
            {event?.organizer?.verified && (
              <span title="Verified Organizer" className="inline-flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              </span>
            )}
            <span>• {(event?.organizer?.college || 'Campus').split(' ')[0]}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-300/90 mt-2.5 line-clamp-2 leading-relaxed">
          {event?.shortSummary || event?.description || ''}
        </p>

        {/* AI Career Bridge Trajectory Insight Tag */}
        <div className="mt-3 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 flex items-start gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-purple-200 font-medium line-clamp-2">
            {careerBridgeImpact}
          </p>
        </div>

        {/* Meta Info (Dates, Prize, Location) */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 text-[11px] text-slate-300">
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
        <div className="mt-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
            <span className="font-semibold">Key Technologies:</span>
            <span className="text-cyan-400 font-mono">{(matchedSkills || []).length} of your skills match</span>
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
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {hasSkill && '✓ '} {skill}
                </span>
              );
            })}
            {(event.requiredSkills || []).length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                +{(event.requiredSkills || []).length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleBookmark(event.id)}
            title={isBookmarked ? "Remove Bookmark" : "Save Event"}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
          </button>

          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-[11px] font-semibold border border-purple-500/25 transition-all"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>AI Match Info</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isRegistered && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
              <CheckCircle className="w-3 h-3" /> Registered
            </span>
          )}

          <button
            onClick={onOpenDetail}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-900/30"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
