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
      color: 'from-indigo-600 to-sky-600',
      description: `Evaluates your proficiency against ${event.requiredSkills.length} required prerequisite technologies.`
    },
    {
      label: 'Career Trajectory Bridge (25% wt)',
      score: breakdown.careerGoalScore,
      icon: TrendingUp,
      color: 'from-sky-600 to-teal-600',
      description: `Matches event outcomes to your goal: "${student?.careerGoals?.[0] || 'Software Engineer'}".`
    },
    {
      label: 'Department & Academic Affinity (15% wt)',
      score: breakdown.departmentAffinity,
      icon: GraduationCap,
      color: 'from-emerald-600 to-teal-600',
      description: `Synergy between ${student?.department || 'Engineering'} and ${event.category}.`
    },
    {
      label: 'User Interest & Past Profile (18% wt)',
      score: Math.round((breakdown.interestAlignment + breakdown.historyBoost) / 2),
      icon: Layers,
      color: 'from-amber-600 to-orange-600',
      description: 'Aligns with your documented technical tags and past hackathons.'
    },
    {
      label: 'Format & Location Affinity (7% wt)',
      score: breakdown.locationBonus,
      icon: MapPin,
      color: 'from-rose-600 to-pink-600',
      description: `${event.mode} mode matching your current preference.`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl shadow-slate-900/20 text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 p-[1px] flex-shrink-0 shadow-md shadow-indigo-100">
            <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-widest text-indigo-600">Explainable AI Breakdown</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold">
                {matchTier}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-display leading-snug">
              Why was <span className="text-indigo-600">{event.title}</span> recommended to you?
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Personalized for <strong className="text-slate-800">{student?.name || 'Student Innovator'}</strong> ({student?.department || 'Engineering'} • Year {student?.yearOfStudy || 1})
            </p>
          </div>
        </div>

        {/* Big Match Score Highlight Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Overall Relevance Score</div>
            <div className="text-3xl font-black text-slate-900 font-display mt-0.5">{matchScore}% Synergy</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Algorithmic Confidence</div>
            <div className="text-sm font-bold text-emerald-600 mt-1">High (Multi-Vector Validated)</div>
          </div>
        </div>

        {/* 5-Factor Scoring Breakdown */}
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">5-Factor Scoring Matrix</h3>
          
          {scoreFactors.map((factor, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <factor.icon className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">{factor.label}</span>
                </div>
                <span className="text-xs font-bold font-mono text-indigo-600">{factor.score}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${factor.color} rounded-full transition-all duration-500`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-500 mt-1.5 leading-normal">
                {factor.description}
              </p>
            </div>
          ))}
        </div>

        {/* Skills Matched & Skills to Gain */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Skills You Already Have ({matchedSkills.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.length > 0 ? (
                matchedSkills.map((s, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-semibold shadow-sm">
                    ✓ {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">None specified yet</span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
            <div className="flex items-center gap-2 text-indigo-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Skills You Will Acquire ({missingSkillsToGain.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missingSkillsToGain.length > 0 ? (
                missingSkillsToGain.map((s, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-800 font-semibold shadow-sm">
                    + {s}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">Industry domain exposure</span>
              )}
            </div>
          </div>
        </div>

        {/* Career Bridge Statement */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-800">Career Trajectory Bridge Impact</div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {careerBridgeImpact}
            </p>
          </div>
        </div>

        {/* Close Footer Button */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
          >
            Close Explanation
          </button>
        </div>

      </div>
    </div>
  );
}
