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
    const clean = (otp || '').replace(/\s/g, '');
    if (clean.length < 6) {
      setErrorMsg('Please enter the 6-digit code sent to your email.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: clean }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Invalid or expired code.');
        setLoading(false);
        return;
      }

      // If user already had a completed profile in database
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl shadow-slate-900/20 max-h-[92vh] overflow-y-auto text-slate-900">
        
        {/* Close button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* View 1: Auth Options (Google & Email) */}
        {authMethod === 'options' && (
          <div className="space-y-6">
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 p-[1px] mx-auto shadow-md shadow-indigo-100">
                <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-3 font-display">
                Sign In to AllCollegeEvent<span className="text-indigo-600">.ai</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Personalized AI opportunity feeds & live profile sync
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
                  theme="outline"
                  shape="pill"
                  size="large"
                  text="continue_with"
                />
              </div>

              {/* 1-Click Instant Sign-In Button */}
              <button
                onClick={handleSimulatedGoogleSignIn}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>⚡ Instant 1-Click Demo Sign Up</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[11px] uppercase font-bold text-slate-400 tracking-wider">or email OTP</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              {/* Email Verification Form */}
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="text-xs text-slate-700 font-semibold block mb-1">College or Personal Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="student@university.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
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

            <div className="text-center pt-2 border-t border-slate-100">
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 p-[1px] mx-auto shadow-md shadow-indigo-100">
                <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-3 font-display">
                Enter Verification Code
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                We sent a 6-digit verification code to <strong className="text-indigo-600">{email}</strong>.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* 6-Box PIN Inputs */}
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-2 text-center">
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
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-inner"
                    />
                  ))}
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-medium text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading || otp.replace(/\s/g, '').length < 6}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
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

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setAuthMethod('options');
                  }}
                  className="hover:text-slate-900"
                >
                  ← Change Email
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-indigo-600 font-semibold hover:underline"
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
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-3 font-display">
                Complete Student Profile
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Calibrate AI opportunity matching engine for your target career & skills
              </p>
            </div>

            <form onSubmit={handleFinishOnboarding} className="space-y-4">
              
              {/* Full Name & College */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-semibold block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Visagan A C"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-semibold block mb-1">College / University</label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Tech"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-700 font-semibold block mb-1">Department / Branch</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 shadow-sm"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Business Administration / MBA">Business Administration / MBA</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-700 font-semibold block mb-1">Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 shadow-sm"
                  >
                    <option value={1}>1st Year (Freshman)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Pre-Final)</option>
                    <option value={4}>4th Year (Final Year / Graduating)</option>
                  </select>
                </div>
              </div>

              {/* Target Career Goal */}
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Target Dream Role / Career Goal</label>
                <div className="relative">
                  <Target className="w-4 h-4 text-indigo-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={careerGoal}
                    onChange={(e) => setCareerGoal(e.target.value)}
                    placeholder="e.g. AI/ML Research Engineer, Full Stack Architect"
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                </div>
              </div>

              {/* Skills Tags Manager */}
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">Your Technical Skills & Strengths</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((s, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                      <span>{s.name} ({s.level})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-400 hover:text-rose-600 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. PyTorch, Docker, Solidity)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 mt-4"
              >
                <span>Save Profile & Start Exploring</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
