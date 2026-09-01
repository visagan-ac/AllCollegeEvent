'use client';

import React from 'react';
import { RecommendationScore, StudentProfile } from '@/lib/types';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Layers, 
  MapPin, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';

interface AIExplainerModalProps {
  recommendation: RecommendationScore;
  student: StudentProfile;
  onClose: () => void;
}

export default function AIExplainerModal({ recommendation, student, onClose }: AIExplainerModalProps) {
  const { event, matchScore, breakdown, matchedSkills, missingSkillsToGain, careerBridgeImpact, matchTier } = recommendation;

  const scoreFactors = [
    {
      label: 'Skill Matrix & Synergy (35% wt)',
      score: breakdown.skillMatchScore,
      icon: Target,
      color: 'from-purple-500 to-indigo-500',
      description: `Evaluates your proficiency against ${event.requiredSkills.length} required prerequisite technologies.`
    },
    {
      label: 'Career Trajectory Bridge (25% wt)',
      score: breakdown.careerGoalScore,
      icon: TrendingUp,
      color: 'from-cyan-500 to-blue-500',
      description: `Matches event outcomes to your goal: "${student.careerGoals[0]}".`
    },
    {
      label: 'Department & Academic Affinity (15% wt)',
      score: breakdown.departmentAffinity,
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-500',
      description: `Synergy between ${student.department} and ${event.category}.`
    },
    {
      label: 'User Interest & Past Profile (18% wt)',
      score: Math.round((breakdown.interestAlignment + breakdown.historyBoost) / 2),
      icon: Layers,
      color: 'from-amber-500 to-orange-500',
      description: 'Aligns with your documented technical tags and past hackathons.'
    },
    {
      label: 'Format & Location Affinity (7% wt)',
      score: breakdown.locationBonus,
      icon: MapPin,
      color: 'from-rose-500 to-pink-500',
      description: `${event.mode} mode matching your current preference.`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-purple-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/50">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] flex-shrink-0">
            <div className="w-full h-full bg-[#0d1222] rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-purple-400">Explainable AI Breakdown</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold">
                {matchTier}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 font-display leading-snug">
              Why was <span className="text-cyan-300">{event.title}</span> recommended to you?
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Personalized for <strong className="text-slate-200">{student.name}</strong> ({student.department} • Year {student.yearOfStudy})
            </p>
          </div>
        </div>

        {/* Big Match Score Highlight Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
              <span className="text-2xl font-black text-white font-display">{matchScore}%</span>
            </div>
            <div>
              <div className="text-sm font-bold text-purple-200">Overall Match Probability</div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-sm">
                Computed using our 5-Dimensional Hybrid Intelligence vector model.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-900/80 px-3 py-2 rounded-xl border border-slate-700/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Event Trust Index: <strong className="text-emerald-300">{event.trustScore}/100</strong></span>
          </div>
        </div>

        {/* Career Bridge Highlight */}
        <div className="mt-5 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-300 font-semibold text-xs uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Career Bridge Trajectory</span>
          </div>
          <p className="text-sm text-slate-200 mt-1 font-medium">
            {careerBridgeImpact}
          </p>
        </div>

        {/* 5-Dimensional Breakdown Bars */}
        <div className="mt-6 space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Score Dimension Vectors</h3>
          {scoreFactors.map((factor, idx) => {
            const Icon = factor.icon;
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Icon className="w-3.5 h-3.5 text-purple-400" />
                    <span>{factor.label}</span>
                  </div>
                  <span className="font-mono text-cyan-300 font-bold">{factor.score}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 mt-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${factor.color} transition-all duration-700`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                
                <p className="text-[11px] text-slate-400 mt-1.5">{factor.description}</p>
              </div>
            );
          })}
        </div>

        {/* Skills Bridge Comparison */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Skills You Already Have ({matchedSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((sk, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    ✓ {sk}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No exact prerequisite overlap; ideal for foundational learning.</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Target Skills to Acquire ({missingSkillsToGain.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingSkillsToGain.map((sk, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  + {sk}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Insight
          </button>
        </div>

      </div>
    </div>
  );
}
