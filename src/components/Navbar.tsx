'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import AuthModal from '@/components/AuthModal';
import { 
  Sparkles, 
  Compass, 
  Bot, 
  Trophy, 
  Bookmark, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';

export default function Navbar() {
  const { 
    user, 
    isAuthenticated, 
    logout, 
    setAuthModalOpen, 
    bookmarkedEventIds, 
    registeredEventIds 
  } = useApp();

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo & National Badge */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
                  <div className="w-full h-full bg-[#0d1222] rounded-[11px] flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-display">
                      AllCollegeEvent<span className="text-cyan-400">.ai</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      v2.1
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline-block">AI-Driven Opportunity Intelligence</span>
                </div>
              </Link>
            </div>

            {/* Navigation Center */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10"
              >
                <Compass className="w-4 h-4 text-purple-400" />
                <span>AI Opportunity Feed</span>
              </Link>
            </div>

            {/* User Session / Sign Up Controls */}
            <div className="flex items-center gap-3">
              
              {/* Quick Stats */}
              <div className="flex items-center gap-2 text-xs">
                <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
                  <Bookmark className="w-3 h-3 text-purple-400" />
                  <span>{bookmarkedEventIds.length} Saved</span>
                </div>
                <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{registeredEventIds.length} Registered</span>
                </div>
              </div>

              {/* If Authenticated: User Profile Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 transition-all text-left shadow-lg shadow-black/40 group"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-purple-400/50 group-hover:ring-cyan-400 transition-all"
                    />
                    <div className="hidden sm:flex flex-col">
                      <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
                      <span className="text-[10px] text-cyan-400 truncate max-w-[110px]">{user.careerGoals[0]}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-2 shadow-2xl shadow-black/90 border border-slate-700/80 z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-slate-800">
                        <div className="text-xs font-bold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                        <div className="text-[10px] text-purple-300 mt-1">{user.college}</div>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            setAuthModalOpen(true);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors text-left"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                          <span>Edit Skills & Career Goal</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-900/30 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Sign Up</span>
                </button>
              )}

            </div>

          </div>
        </div>
      </nav>

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
}
