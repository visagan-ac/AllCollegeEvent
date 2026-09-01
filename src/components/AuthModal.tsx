'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
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
  Trash2
} from 'lucide-react';

export default function AuthModal() {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    loginWithGoogle, 
    sendEmailOtp, 
    verifyEmailOtp, 
    completeOnboarding 
  } = useApp();

  const [authMethod, setAuthMethod] = useState<'options' | 'email_otp' | 'onboarding'>('options');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Onboarding profile state
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [yearOfStudy, setYearOfStudy] = useState(3);
  const [careerGoal, setCareerGoal] = useState('AI/ML Engineer');
  const [skills, setSkills] = useState<{ name: string; level: 'Beginner' | 'Intermediate' | 'Expert'; score: number }[]>([
    { name: 'Python', level: 'Expert', score: 90 },
    { name: 'Machine Learning', level: 'Intermediate', score: 75 }
  ]);
  const [newSkillName, setNewSkillName] = useState('');

  if (!authModalOpen) return null;

  const handleGoogleSignIn = () => {
    loginWithGoogle({
      name: 'Visagan A C',
      email: 'visagan.ac@college.edu',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid college or personal email address.');
      return;
    }
    setErrorMsg('');
    const code = sendEmailOtp(email);
    setSentOtp(code);
    setAuthMethod('email_otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sentOtp) return;
    const isValid = verifyEmailOtp(email, otp, sentOtp);
    if (isValid) {
      setErrorMsg('');
      setAuthMethod('onboarding');
    } else {
      setErrorMsg('Invalid verification code. Please check and try again.');
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
      college: college.trim() || 'Technical University',
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
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* View 1: Auth Options (Google / Email) */}
        {authMethod === 'options' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[1px] mx-auto shadow-lg shadow-purple-500/20">
                <div className="w-full h-full bg-[#0d1222] rounded-[15px] flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-white mt-3 font-display">
                Sign In to AllCollegeEvent<span className="text-cyan-400">.ai</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Unlock personalized AI event discovery, trust metrics, and career pathways.
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm transition-all shadow-md group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-4 text-[11px] uppercase font-bold text-slate-500 tracking-wider">or sign in with email</span>
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
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-900/30 flex items-center justify-center gap-2"
                >
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="text-center pt-2 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400">
                By continuing, you agree to AllCollegeEvent.com Student Guidelines & Privacy Terms.
              </p>
            </div>
          </div>
        )}

        {/* View 2: Email OTP Verification */}
        {authMethod === 'email_otp' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white mt-3 font-display">
                Enter Verification Code
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                We sent a 6-digit verification code to <strong className="text-cyan-300">{email}</strong>
              </p>
            </div>

            {/* Simulated OTP Notification Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center">
              <div className="text-xs text-emerald-300 font-medium">
                🔑 Simulated Email OTP Inbox:
              </div>
              <div className="text-2xl font-black font-mono tracking-widest text-white mt-1">
                {sentOtp}
              </div>
              <button
                onClick={() => setOtp(sentOtp || '')}
                className="text-[11px] text-cyan-400 hover:underline mt-1 inline-block"
              >
                Auto-fill Code
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">6-Digit Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 849201"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm transition-all shadow-md shadow-cyan-900/30 flex items-center justify-center gap-2"
              >
                <span>Verify & Continue</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => setAuthMethod('options')}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              ← Use a different email address
            </button>
          </div>
        )}

        {/* View 3: Student Onboarding Profile Setup */}
        {authMethod === 'onboarding' && (
          <form onSubmit={handleFinishOnboarding} className="space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  Step 2 of 2
                </span>
                <span className="text-xs text-slate-400">Setup AI Profile</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1 font-display">
                Personalize Your AI Match Vector
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Our AI uses this data to calibrate personalized match scores and career roadmaps.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">College / University</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guru Nanak Institutions / IIT Madras"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Computer Science & Engineering">CSE (General / Core)</option>
                    <option value="Computer Science & Engineering (AI & ML)">CSE (AI & Machine Learning)</option>
                    <option value="Information Technology">Information Technology (IT)</option>
                    <option value="Electronics & Communication Engineering">ECE (Electronics & Comm)</option>
                    <option value="Data Science & Mathematics">Data Science & Analytics</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Year of Study</label>
                  <select
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value={1}>1st Year</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year (Pre-final)</option>
                    <option value={4}>4th Year (Final Year)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Primary Career Goal</label>
                <select
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="AI/ML Engineer">AI/ML Engineer</option>
                  <option value="Full Stack Architect">Full Stack & Web3 Developer</option>
                  <option value="Site Reliability Engineer (SRE)">Cloud & DevOps Architect</option>
                  <option value="Autonomous Systems Engineer">Robotics & Edge AI Engineer</option>
                  <option value="Quantitative Analyst (Quant)">Data Scientist / Quant Analyst</option>
                  <option value="Cybersecurity Analyst">Cybersecurity & Ethical Hacker</option>
                </select>
              </div>

              {/* Skills Editor */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Your Skills</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((sk, idx) => (
                    <span key={idx} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-200">
                      <span>{sk.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-slate-400 hover:text-rose-400 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. PyTorch, React, C++)"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm transition-all shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate My Personalized AI Experience</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
