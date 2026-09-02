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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl shadow-slate-900/20 text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 pr-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
            {event.category}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-700">
            {event.type}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            event.mode === 'Offline' ? 'bg-amber-50 border-amber-200 text-amber-700' :
            event.mode === 'Virtual' ? 'bg-sky-50 border-sky-200 text-sky-700' :
            'bg-emerald-50 border-emerald-200 text-emerald-700'
          }`}>
            {event.mode} Mode
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200 text-slate-600">
            Difficulty: {event.difficulty}
          </span>
        </div>

        {/* Title & Organizer */}
        <div className="mt-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight">
            {event.title}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-600">
            <span className="text-lg">{event.organizer.logoUrl || '🏛️'}</span>
            <span className="font-bold text-slate-800">{event.organizer.name}</span>
            {event.organizer.verified && (
              <span className="flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 font-semibold">
                <ShieldCheck className="w-3 h-3 text-indigo-600" /> Verified Organizer
              </span>
            )}
            <span className="text-slate-400">• {event.organizer.college}</span>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <div className="p-2">
            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Start Date
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{event.startDate}</div>
          </div>
          <div className="p-2 border-l border-slate-200">
            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-600" /> Duration
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">{event.duration || '36 Hours'}</div>
          </div>
          <div className="p-2 border-l border-slate-200">
            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-semibold">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Prize Pool
            </div>
            <div className="text-xs sm:text-sm font-bold text-amber-700 mt-1 truncate">{event.prizePool || '₹5,00,000'}</div>
          </div>
          <div className="p-2 border-l border-slate-200">
            <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">{event.location}</div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">About this Opportunity</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Requirements & Skills Matrix */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-600" /> Prerequisites & Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(event.requiredSkills || []).map((skill, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Skills You Gain
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {(event.skillsGained || []).map((skill, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold shadow-sm">
                  + {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Perks & Benefits */}
        {event.perks && event.perks.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Participant Perks & Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {event.perks.map((perk, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Eligibility Criteria */}
        {event.eligibility && event.eligibility.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Eligibility Criteria</h3>
            <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
              {event.eligibility.map((el, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                  <span>{el}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mentors / Speakers */}
        {event.mentors && event.mentors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Industry Mentors & Judges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {event.mentors.map((mentor, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900">{mentor.name}</div>
                  <div className="text-indigo-600 font-semibold text-[11px]">{mentor.role}</div>
                  <div className="text-slate-500 text-[10px]">{mentor.company}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Success Banner */}
        {registrationSuccess && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-in zoom-in-95 duration-200 shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Registration Confirmed for {user?.name || student?.name || 'Student Innovator'}!</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Your entry pass ID: <strong className="font-mono text-slate-900">{ticketId}</strong>. Synchronized with your active student profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleBookmark}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                isBookmarked
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-indigo-600 text-indigo-600' : ''}`} />
              <span>{isBookmarked ? 'Saved to Profile' : 'Save Event'}</span>
            </button>

            <button
              onClick={onOpenExplainer}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Why Matched ({matchScore || 95}%)</span>
            </button>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            {isRegistered ? (
              <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Pass Claimed ({ticketId || 'Active'})</span>
              </div>
            ) : (
              <button
                onClick={handleRegister}
                className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
              >
                <span>Claim 1-Click Entry Pass</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
