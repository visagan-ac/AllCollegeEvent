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
      <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-500 p-[1px] shadow-sm transition-all duration-300">
                  <div className="w-full h-full bg-white rounded-[11px] flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-600 group-hover:scale-105 transition-transform" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-display">
                      AllCollegeEvent<span className="text-indigo-600">.ai</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700">
                      v2.1
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 hidden sm:inline-block">Collegiate Opportunity Intelligence</span>
                </div>
              </Link>
            </div>

            {/* Navigation Center */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200/80 transition-colors shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                <span>Opportunity Feed</span>
              </Link>
            </div>

            {/* User Session / Sign Up Controls */}
            <div className="flex items-center gap-3">
              
              {/* Quick Stats */}
              <div className="flex items-center gap-2 text-xs">
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                  <Bookmark className="w-3 h-3 text-indigo-600" />
                  <span>{bookmarkedEventIds.length} Saved</span>
                </div>
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{registeredEventIds.length} Passes</span>
                </div>
              </div>

              {/* If Authenticated: User Profile Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-left shadow-sm group"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 group-hover:ring-indigo-500 transition-all"
                    />
                    <div className="hidden sm:flex flex-col">
                      <span className="text-xs font-bold text-slate-900 leading-tight">{user.name}</span>
                      <span className="text-[10px] text-indigo-600 truncate max-w-[110px] font-medium">{user.careerGoals[0]}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-slate-100 mb-1 bg-slate-50 rounded-xl">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <p className="text-[10px] text-indigo-600 font-semibold mt-1">{user.college}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setAuthModalOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit Preferences</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* If Guest: Sign In Button */
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:scale-[1.02] transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Global Auth / Profile Modal */}
      <AuthModal />
    </>
  );
}
