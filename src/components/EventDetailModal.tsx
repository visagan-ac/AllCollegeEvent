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
  Layers
} from 'lucide-react';

interface EventDetailModalProps {
  event: EventItem;
  student: StudentProfile;
  matchScore?: number;
  onClose: () => void;
  onOpenExplainer: () => void;
}

export default function EventDetailModal({ event, student, matchScore, onClose, onOpenExplainer }: EventDetailModalProps) {
  const { bookmarkedEventIds, registeredEventIds, toggleBookmark, registerEvent } = useApp();
  const isBookmarked = bookmarkedEventIds.includes(event.id);
  const isRegistered = registeredEventIds.includes(event.id);

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string>('');

  const handleRegister = () => {
    registerEvent(event.id);
    const generatedTicket = `ACE-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(generatedTicket);
    setRegistrationSuccess(true);
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
            <span className="text-slate-500">• {event.organizer.college}</span>
          </div>
        </div>

        {/* AI Match & Trust Score Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/40 border border-purple-500/25">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-600/30 border border-purple-400/40 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-purple-300 tracking-wider">AI Persona Match</span>
                <div className="text-lg font-black text-white">{matchScore || 92}% Fit</div>
              </div>
            </div>
            <button
              onClick={onOpenExplainer}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-200 transition-all font-semibold"
            >
              Why this score? →
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold text-emerald-300 tracking-wider">Event Trust Index</span>
                <div className="text-lg font-black text-white">{event.trustScore}/100</div>
              </div>
            </div>
            <span className="text-[11px] text-slate-300 bg-slate-800 px-2 py-1 rounded">
              Verified Host & Rewards
            </span>
          </div>
        </div>

        {/* Quick Details Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Event Dates</span>
            </div>
            <div className="font-semibold text-white">{event.startDate} to {event.endDate}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Duration</span>
            </div>
            <div className="font-semibold text-white">{event.duration}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Location</span>
            </div>
            <div className="font-semibold text-white truncate">{event.location}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registrations</span>
            </div>
            <div className="font-semibold text-white">{event.registrationCount} / {event.maxCapacity || 'Unlimited'}</div>
          </div>
        </div>

        {/* Description & Perks */}
        <div className="mt-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">About Opportunity</h3>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {event.prizePool && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Trophy className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Prize Pool & Grants</span>
                <p className="text-sm font-semibold text-white mt-0.5">{event.prizePool}</p>
              </div>
            </div>
          )}

          {/* Perks */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Perks & Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {event.perks.map((perk, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200">
                  <Award className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus or Modules */}
          {event.syllabus && event.syllabus.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Event Track & Roadmap</h3>
              <div className="space-y-2 mt-2">
                {event.syllabus.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <span className="font-bold text-cyan-300">{item.module}</span>
                    <p className="text-slate-300 mt-1">{item.details}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mentors */}
          {event.mentors && event.mentors.length > 0 && (
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Featured Mentors & Jury</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                {event.mentors.map((mentor, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs">
                    <div className="font-bold text-white">{mentor.name}</div>
                    <div className="text-purple-300 text-[11px]">{mentor.role}</div>
                    <div className="text-slate-400 text-[10px]">{mentor.company}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Registration Success Banner */}
        {registrationSuccess && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-white">Registration Confirmed for {student?.name || 'Student Innovator'}!</h4>
                <p className="text-xs text-emerald-300 mt-0.5">
                  Your entry pass ID: <strong className="font-mono text-white">{ticketId}</strong>. Synchronized with your active student dashboard profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => toggleBookmark(event.id)}
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
