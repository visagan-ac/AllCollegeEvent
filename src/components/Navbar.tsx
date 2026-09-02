'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import AuthModal from '@/components/AuthModal';
import { 
  Sparkles, 
  Compass, 
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
      <nav className="border-b border-slate-700/60 bg-[#141b2d]/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 p-[1px] shadow-sm transition-all duration-300">
                  <div className="w-full h-full bg-[#182238] rounded-[11px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-sky-400 group-hover:scale-105 transition-transform" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-display">
                      AllCollegeEvent<span className="text-sky-400">.ai</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/30 text-indigo-200">
                      v2.1
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 hidden sm:inline-block">Collegiate Opportunity Intelligence</span>
                </div>
              </Link>
            </div>

            {/* Navigation Center */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>Opportunity Feed</span>
              </Link>
            </div>

            {/* User Session / Sign Up Controls */}
            <div className="flex items-center gap-3">
              
              {/* Quick Stats */}
              <div className="flex items-center gap-2 text-xs">
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
                  <Bookmark className="w-3 h-3 text-indigo-400" />
                  <span>{bookmarkedEventIds.length} Saved</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-emerald-300 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{registeredEventIds.length} Passes</span>
                </div>
              </div>

              {/* If Authenticated: User Profile Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-left shadow-md group"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-600 group-hover:ring-sky-400 transition-all"
                    />
                    <div className="hidden sm:flex flex-col">
                      <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
                      <span className="text-[10px] text-sky-300 truncate max-w-[110px]">{user.careerGoals[0]}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-2 shadow-2xl border border-slate-700 z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-slate-700">
                        <div className="text-xs font-bold text-white truncate">{user.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                        <div className="text-[10px] text-indigo-300 mt-1">{user.college}</div>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            setAuthModalOpen(true);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-200 hover:bg-slate-700/80 rounded-xl transition-colors text-left font-medium"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                          <span>Edit Skills & Goals</span>
                        </button>

                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/15 rounded-xl transition-colors text-left font-medium"
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white font-bold text-xs transition-all shadow-md shadow-indigo-950/40"
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
