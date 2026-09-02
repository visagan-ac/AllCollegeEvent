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

  // High-contrast clean category tag styling
  const getCategoryChip = (cat: string) => {
    if (cat.includes('AI') || cat.includes('Machine')) return 'bg-indigo-50 border-indigo-200 text-indigo-700';
    if (cat.includes('Web3') || cat.includes('Full Stack')) return 'bg-sky-50 border-sky-200 text-sky-700';
    if (cat.includes('Cyber')) return 'bg-rose-50 border-rose-200 text-rose-700';
    if (cat.includes('Cloud')) return 'bg-blue-50 border-blue-200 text-blue-700';
    if (cat.includes('Data')) return 'bg-teal-50 border-teal-200 text-teal-700';
    if (cat.includes('Robotics')) return 'bg-amber-50 border-amber-200 text-amber-700';
    if (cat.includes('FinTech')) return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    return 'bg-purple-50 border-purple-200 text-purple-700';
  };

  // High-contrast match score badge colors
  const getScoreBadge = (score: number) => {
    if (score >= 90) {
      return {
        border: 'border-emerald-300 bg-emerald-50 text-emerald-700',
        ring: 'text-emerald-700'
      };
    }
    if (score >= 80) {
      return {
        border: 'border-sky-300 bg-sky-50 text-sky-700',
        ring: 'text-sky-700'
      };
    }
    if (score >= 70) {
      return {
        border: 'border-indigo-300 bg-indigo-50 text-indigo-700',
        ring: 'text-indigo-700'
      };
    }
    return {
      border: 'border-slate-300 bg-slate-100 text-slate-700',
      ring: 'text-slate-700'
    };
  };

  const scoreBadge = getScoreBadge(matchScore);

  return (
    <div className="relative group rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-400 p-5 flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-1">
      
      {/* Featured Ribbon / National badge */}
      {event.featured && (
        <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 z-10 shadow-sm">
          <Trophy className="w-3 h-3 text-white" />
          <span>Spotlight 2026</span>
        </div>
      )}

      <div>
        {/* Top Header Row: Category, Mode, and AI Match Score Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border ${getCategoryChip(event.category)}`}>
              {event.category}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              {event.type}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${
              event.mode === 'Offline' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              event.mode === 'Virtual' ? 'bg-sky-50 text-sky-700 border-sky-200' :
              'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {event.mode}
            </span>
          </div>

          {/* Match Score Circle Badge */}
          <button
            onClick={onOpenExplainer}
            title="Click to view AI Match Explanation"
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border ${scoreBadge.border} hover:scale-105 transition-all flex-shrink-0 cursor-pointer shadow-sm`}
          >
            <span className={`text-xs font-bold font-mono-acc leading-none ${scoreBadge.ring}`}>{matchScore}%</span>
            <span className="text-[8px] uppercase tracking-wider font-bold mt-0.5 opacity-90">Match</span>
          </button>
        </div>

        {/* Event Title & Organizer */}
        <div className="mt-3">
          <h3 
            onClick={onOpenDetail}
            className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 font-display leading-snug"
          >
            {event.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
            <span className="text-slate-800 font-semibold">{event?.organizer?.name || 'College Partner'}</span>
            {event?.organizer?.verified && (
              <span title="Verified Organizer" className="inline-flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
              </span>
            )}
            <span className="text-slate-400">• {(event?.organizer?.college || 'Campus').split(' ')[0]}</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {event?.shortSummary || event?.description || ''}
        </p>

        {/* AI Career Bridge Trajectory Insight Tag */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-700 font-medium line-clamp-2">
            {careerBridgeImpact}
          </p>
        </div>

        {/* Meta Info (Dates, Location) */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span className="truncate">{event?.startDate || '2026'} ({(event?.duration || '36 Hours').split(' ')[0]})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span className="truncate">{(event?.location || (event as any)?.locationVenue || 'Hybrid / Online').split(',')[0]}</span>
          </div>
        </div>

        {/* Matched Skill Tags */}
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="font-semibold text-slate-700">Skills Required:</span>
            <span className="text-indigo-600 font-mono-acc text-[10px] font-bold">{(matchedSkills || []).length} match</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {(event.requiredSkills || []).slice(0, 3).map((skill, idx) => {
              const studentSkills = student?.skills || [];
              const hasSkill = studentSkills.some(s => (s?.name || '').toLowerCase() === (skill || '').toLowerCase());
              return (
                <span 
                  key={idx} 
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                    hasSkill 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {hasSkill && '✓ '} {skill}
                </span>
              );
            })}
            {(event.requiredSkills || []).length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 font-mono-acc">
                +{(event.requiredSkills || []).length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleBookmark}
            title={isBookmarked ? "Remove Bookmark" : "Save Event"}
            className={`p-2 rounded-xl border transition-all ${
              isBookmarked
                ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
          </button>

          <button
            onClick={onOpenExplainer}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>AI Match</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isRegistered && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> Registered
            </span>
          )}

          <button
            onClick={onOpenDetail}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-100"
          >
            <span>Explore</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
  );
}
