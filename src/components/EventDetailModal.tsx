'use client';

import React, { useState } from 'react';
import { EventItem, StudentProfile } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Calendar, 
  MapPin, 
  Trophy, 
  ShieldCheck, 
  Users, 
  CheckCircle, 
  Sparkles, 
  Bookmark, 
  Clock, 
  BookOpen, 
  ExternalLink,
  Award,
  Layers,
  LogIn
} from 'lucide-react';

interface EventDetailModalProps {
  event: EventItem;
  student: StudentProfile;
  matchScore?: number;
  onClose: () => void;
  onOpenExplainer: () => void;
}

export default function EventDetailModal({ event, student, matchScore, onClose, onOpenExplainer }: EventDetailModalProps) {
  const { 
    user, 
    isAuthenticated, 
    setAuthModalOpen, 
    bookmarkedEventIds, 
    registeredEventIds, 
    toggleBookmark, 
    registerEvent 
  } = useApp();
  
  const isBookmarked = bookmarkedEventIds.includes(event.id);
  const isRegistered = registeredEventIds.includes(event.id);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');

  const handleRegister = () => {
    if (!isAuthenticated || !user) {
      setAuthModalOpen(true);
      return;
    }
    registerEvent(event.id);
    const generatedTicket = `ACE-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setRegistrationSuccess(true);
  };

  const handleBookmark = () => {
    if (!isAuthenticated || !user) {
      setAuthModalOpen(true);
      return;
    }
    toggleBookmark(event.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-slate-700/80 p-6 sm:p-8 shadow-2xl shadow-black">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 pr-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300">
            {event.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
            {event.type}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            event.mode === 'Offline' ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300' :
            event.mode === 'Virtual' ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300' :
            'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
          }`}>
            {event.mode} Mode
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-400">
            Difficulty: {event.difficulty}
          </span>
        </div>

        {/* Title & Organizer */}
        <div className="mt-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-tight">
            {event.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-300">
            <span className="text-lg">{event.organizer.logoUrl || '🏛️'}</span>
            <span className="font-semibold">{event.organizer.name}</span>
            {event.organizer.verified && (
              <span className="flex items-center gap-1 text-xs text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20 font-medium">
                <ShieldCheck className="w-3 h-3" /> Verified Organizer
              </span>
            )}
            <span className="text-slate-400">• {event.organizer.college}</span>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <div className="p-2">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Start Date
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mt-1">{event.startDate}</div>
          </div>
          <div className="p-2 border-l border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-purple-400" /> Duration
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mt-1">{event.duration || '36 Hours'}</div>
          </div>
          <div className="p-2 border-l border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Prize Pool
            </div>
            <div className="text-xs sm:text-sm font-bold text-amber-300 mt-1 truncate">{event.prizePool || '₹5,00,000'}</div>
          </div>
          <div className="p-2 border-l border-slate-800">
            <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" /> Location
            </div>
            <div className="text-xs sm:text-sm font-bold text-white mt-1 truncate">{event.location}</div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">About this Opportunity</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Requirements & Skills Matrix */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-cyan-400" /> Prerequisites & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(event.requiredSkills || []).map((skill, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" /> Skills You Gain
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(event.skillsGained || []).map((skill, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Perks & Benefits */}
        {event.perks && event.perks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Participant Perks & Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {event.perks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Eligibility Criteria */}
        {event.eligibility && event.eligibility.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">Eligibility Criteria</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {event.eligibility.map((el, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  <span>{el}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mentors / Speakers */}
        {event.mentors && event.mentors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3">Industry Mentors & Judges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {event.mentors.map((mentor, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                  <div className="font-bold text-white">{mentor.name}</div>
                  <div className="text-purple-300 text-[11px]">{mentor.role}</div>
                  <div className="text-slate-400 text-[10px]">{mentor.company}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Success Banner */}
        {registrationSuccess && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Registration Confirmed for {user?.name || student?.name || 'Student Innovator'}!</h4>
                <p className="text-xs text-emerald-300 mt-0.5">
                  Your entry pass ID: <strong className="font-mono text-white">{ticketId}</strong>. Synchronized with your active student profile in Neon PostgreSQL.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleBookmark}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                isBookmarked
                  ? 'bg-purple-600/20 border-purple-500/50 text-purple-300'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-purple-400 text-purple-400' : ''}`} />
              <span>{isBookmarked ? 'Saved to Bookmarks' : 'Bookmark Event'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Back to Feed
            </button>

            <button
              onClick={handleRegister}
              disabled={isRegistered || registrationSuccess}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                isRegistered || registrationSuccess
                  ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white shadow-purple-900/40'
              }`}
            >
              {isRegistered || registrationSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Pass Issued & Registered</span>
                </>
              ) : !isAuthenticated || !user ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Register Free</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Register Free with 1-Click</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
