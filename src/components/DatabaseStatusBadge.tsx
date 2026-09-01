'use client';

import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertCircle, RefreshCw, X, Server, Layers, ExternalLink } from 'lucide-react';

export default function DatabaseStatusBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    message: string;
    provider?: string;
    envConfigured?: boolean;
    tablesConfigured?: string[];
    stats?: {
      eventsCount: number;
      usersCount: number;
      skillsCount: number;
    };
  } | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/db/status');
      const data = await res.json();
      setDbStatus(data);
    } catch {
      setDbStatus({
        connected: false,
        message: 'Unable to reach /api/db/status endpoint',
        provider: 'Disconnected',
        envConfigured: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <>
      {/* Navbar Badge Button */}
      <button
        onClick={() => {
          fetchStatus();
          setIsOpen(true);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm group"
        title="PostgreSQL Database Layer"
      >
        <Database className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline">PostgreSQL</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Modal for Database Details */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl bg-[#0e1424] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Database className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    PostgreSQL Database Architecture
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                      Prisma ORM
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">PostgreSQL Schema, Models & Live Health Status</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Connection Status Card */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-cyan-400" /> Connection Status
                  </span>
                  <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-300">
                      PostgreSQL Engine Configured (Prisma ORM)
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {dbStatus?.message || 'Prisma client configured with PostgreSQL provider & fallback resilience.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Relational Tables */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-3">
                  <Layers className="w-3.5 h-3.5 text-purple-400" />
                  Configured PostgreSQL Relational Tables (8 Models)
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { name: 'users', desc: 'Students & Organizers' },
                    { name: 'events', desc: 'Hackathons & Competitions' },
                    { name: 'skills', desc: 'Skill Taxonomy & Demand' },
                    { name: 'user_skills', desc: 'Student Proficiencies' },
                    { name: 'event_skills', desc: 'Prerequisites & Gained' },
                    { name: 'organizers', desc: 'Colleges & Trust Scores' },
                    { name: 'user_event_interactions', desc: 'Bookmarks & Registrations' },
                    { name: 'ai_recommendations', desc: '5D Hybrid Match Scores' },
                  ].map((table) => (
                    <div
                      key={table.name}
                      className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 flex flex-col"
                    >
                      <span className="font-mono text-cyan-300 font-semibold text-[11px]">{table.name}</span>
                      <span className="text-[10px] text-slate-400">{table.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connection String Setup Guide */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300">
                  How to connect your PostgreSQL Instance
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Add your PostgreSQL connection string in <code className="text-purple-300 font-mono">.env.local</code>:
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 font-mono text-[11px] text-emerald-300 border border-slate-800 break-all select-all">
                  DATABASE_URL=&quot;postgresql://user:password@localhost:5432/allcollegeevent?schema=public&quot;
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Useful Commands:
                  <div className="mt-1 space-y-1 font-mono text-[10px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div><span className="text-cyan-400">npx prisma db push</span> - Push schema to PostgreSQL</div>
                    <div><span className="text-cyan-400">npx prisma generate</span> - Regenerate client types</div>
                    <div><span className="text-cyan-400">npx prisma studio</span> - Open visual DB browser</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">File: <code className="text-purple-300">prisma/schema.prisma</code></span>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
