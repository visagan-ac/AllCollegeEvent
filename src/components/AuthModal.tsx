'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GoogleLogin } from '@react-oauth/google';
import { 
  X, 
  Sparkles, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  GraduationCap, 
  Target, 
  ShieldCheck, 
  User, 
  Plus, 
  Trash2, 
  Loader2 
} from 'lucide-react';

export default function AuthModal() {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    loginWithGoogle, 
    completeOnboarding 
  } = useApp();

  const [authMethod, setAuthMethod] = useState<'options' | 'email_otp' | 'onboarding'>('options');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [serverOtp, setServerOtp] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('');

  // Onboarding profile state
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [yearOfStudy, setYearOfStudy] = useState(3);
  const [careerGoal, setCareerGoal] = useState('AI/ML Engineer');
  const [skills, setSkills] = useState<{ name: string; level: 'Beginner' | 'Intermediate' | 'Expert'; score: number }[]>([
    { name: 'Python', level: 'Expert', score: 90 },
    { name: 'Machine Learning', level: 'Intermediate', score: 75 },
    { name: 'React / Next.js', level: 'Intermediate', score: 80 }
  ]);
  const [newSkillName, setNewSkillName] = useState('');

  if (!authModalOpen) return null;

  // Real Google OAuth Success Handler
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setErrorMsg('');
    try {
      if (credentialResponse.credential) {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });
        const data = await res.json();

        if (data.success) {
          if (!data.isNewUser && data.user) {
            // Existing student — log in directly
            loginWithGoogle({
              name: data.user.name,
              email: data.user.email,
              avatar: data.user.avatar,
            });
            return;
          }

          // New student signup — show Profile Creation Onboarding!
          setName(data.name || '');
          setEmail(data.email || '');
          setAvatar(data.avatar || '');
          setAuthMethod('onboarding');
          return;
        }
      }
      // Fallback
      setAuthMethod('onboarding');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error signing in with Google.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Instant Demo Login (Takes to onboarding or direct login)
  const handleSimulatedGoogleSignIn = () => {
    setName('Visagan A C');
    setEmail('visagan.ac@college.edu');
    setAvatar('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');
    setAuthMethod('onboarding');
  };

  // Send Real Email OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid college or personal email address.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Failed to send verification code.');
        setLoading(false);
        return;
      }

      if (data.devOtp) {
        setServerOtp(data.devOtp);
      }

      setAuthMethod('email_otp');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error connecting to OTP server.');
    } finally {
      setLoading(false);
    }
  };

  // Verify Real Email OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setErrorMsg('Please enter the 6-digit code.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otp.trim() }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Invalid or expired code.');
        setLoading(false);
        return;
      }

      // If user already had a completed profile in Neon PostgreSQL
      if (!data.isNewUser && data.user) {
        loginWithGoogle({
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.avatar,
        });
        return;
      }

      // If new student, show Profile Creation wizard
      setName(email.split('@')[0].replace(/[^a-zA-Z]/g, ' '));
      setAuthMethod('onboarding');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error verifying OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    setSkills(prev => [...prev, { name: newSkillName.trim(), level: 'Intermediate', score: 75 }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleFinishOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      name: name.trim() || 'Collegiate Innovator',
      email,
      avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${name || 'student'}`,
      college: college.trim() || 'National Institute of Technology',
      department,
      yearOfStudy,
      careerGoals: [careerGoal],
      skills,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel border border-purple-500/30 p-6 sm:p-8 shadow-2xl shadow-purple-950/60 max-h-[92vh] overflow-y-auto">
        
        {/* Close button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* View 1: Auth Options (Google & Email) */}
        {authMethod === 'options' && (
          <div className="space-y-6">
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] mx-auto shadow-lg shadow-purple-500/30">
                <div className="w-full h-full bg-[#0d1222] rounded-[15px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-3 font-display">
                Sign In to AllCollegeEvent<span className="text-cyan-400">.ai</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Personalized AI opportunity feeds & live Neon PostgreSQL profile sync
              </p>
            </div>

            {/* Google OAuth Component */}
            <div className="space-y-3">
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    handleSimulatedGoogleSignIn();
                  }}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="continue_with"
                />
              </div>

              {/* 1-Click Instant Sign-In Button */}
              <button
                onClick={handleSimulatedGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <span>⚡ Instant 1-Click Demo Sign Up</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[11px] uppercase font-bold text-slate-500 tracking-wider">or email OTP</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Email Verification Form */}
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">College or Personal Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="text-center pt-2 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400">
                Data is securely stored in your connected Neon PostgreSQL database.
              </p>
            </div>
          </div>
        )}

        {/* View 2: Email OTP Verification */}
        {authMethod === 'email_otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-[1px] mx-auto shadow-lg shadow-sky-950/40">
                <div className="w-full h-full bg-[#131b2e] rounded-[15px] flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-sky-400" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-3 font-display">
                Enter Verification Code
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                We sent a 6-digit verification code to <strong className="text-sky-300">{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 6-Box PIN Inputs */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-2 text-center">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center items-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <input
                      key={idx}
                      id={`otp-box-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[idx] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const otpArr = (otp || '').padEnd(6, ' ').split('');
                        otpArr[idx] = val;
                        const newOtp = otpArr.join('').trim();
                        setOtp(newOtp);

                        if (val && idx < 5) {
                          const nextInput = document.getElementById(`otp-box-${idx + 1}`);
                          nextInput?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                          const prevInput = document.getElementById(`otp-box-${idx - 1}`);
                          prevInput?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                        if (pasted) {
                          setOtp(pasted);
                          const targetIdx = Math.min(pasted.length, 5);
                          document.getElementById(`otp-box-${targetIdx}`)?.focus();
                        }
                      }}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono text-white bg-slate-900/90 border border-slate-700 rounded-xl focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all shadow-inner"
                    />
                  ))}
                </div>

                {/* Instant Dev Helper */}
                <div className="flex flex-col items-center gap-2 mt-3">
                  {serverOtp && (
                    <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-950/60 border border-sky-500/30 text-xs text-sky-200 w-full">
                      <span>Generated Code: <strong className="font-mono text-sky-300 text-sm tracking-wider">{serverOtp}</strong></span>
                      <button
                        type="button"
                        onClick={() => setOtp(serverOtp)}
                        className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-semibold text-[11px] transition-colors"
                      >
                        Fill Code
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setOtp('123456')}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono-acc transition-colors"
                  >
                    ⚡ Or use Universal Master Code (123456)
                  </button>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.replace(/\s/g, '').length < 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-sky-950/40 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify Code & Continue</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setAuthMethod('options');
                  }}
                  className="hover:text-white"
                >
                  ← Change Email
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-sky-400 hover:underline"
                >
                  Resend Code
                </button>
              </div>
            </form>
          </div>
        )}

        {/* View 3: Complete Student Profile Onboarding */}
        {authMethod === 'onboarding' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[1px] mx-auto">
                <div className="w-full h-full bg-[#0d1222] rounded-[15px] flex items-center justify-center text-emerald-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-3 font-display">
                Create Your Student Profile
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Tell us about your college & skills so AI can tailor your opportunities
              </p>
            </div>

            <form onSubmit={handleFinishOnboarding} className="space-y-4 text-left">
              {/* Full Name */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Visagan A C"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* College & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">College Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NIT / IIT / Anna Univ"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>Postgraduate / Masters</option>
                  </select>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Department / Branch</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science, AI & Data Science, ECE"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Target Career Goal */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Target Career Role / Goal</label>
                <div className="relative">
                  <Target className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI/ML Engineer, Full Stack Architect"
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Skills Tags Manager */}
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Your Technical Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a skill (e.g. Python, PyTorch, Next.js)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-950/60 rounded-xl border border-slate-800">
                  {skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-300"
                    >
                      <span>{s.name} ({s.level})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 mt-2"
              >
                <span>Save Profile & Launch Feed</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
