'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StudentProfile, EventItem, RecommendationScore } from '@/lib/types';
import { MOCK_EVENTS } from '@/lib/mockData';
import { getRankedRecommendations } from '@/lib/aiEngine';

interface AppContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  events: EventItem[];
  rankedRecommendations: RecommendationScore[];
  bookmarkedEventIds: string[];
  registeredEventIds: string[];
  loginWithGoogle: (googleUser?: { name: string; email: string; avatar: string }) => void;
  sendEmailOtp: (email: string) => string; // returns simulated OTP
  verifyEmailOtp: (email: string, otp: string, expectedOtp: string) => boolean;
  completeOnboarding: (profile: Partial<StudentProfile>) => void;
  updateProfile: (profile: Partial<StudentProfile>) => void;
  logout: () => void;
  toggleBookmark: (eventId: string) => void;
  registerEvent: (eventId: string) => boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const DEFAULT_GUEST_PROFILE: StudentProfile = {
  id: 'student-demo',
  name: 'Alex Johnson',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'alex.j@college.edu',
  college: 'National Institute of Technology',
  department: 'Computer Science & Engineering (AI & ML)',
  yearOfStudy: 3,
  cgpa: 8.8,
  location: 'Hyderabad, India',
  skills: [
    { name: 'Python', level: 'Expert', score: 90 },
    { name: 'Machine Learning', level: 'Intermediate', score: 80 },
    { name: 'PyTorch', level: 'Intermediate', score: 70 },
    { name: 'API Development', level: 'Intermediate', score: 65 },
    { name: 'Git', level: 'Intermediate', score: 80 }
  ],
  interests: ['Generative AI', 'Hackathons', 'Computer Vision'],
  careerGoals: ['AI/ML Engineer'],
  targetCompanies: ['Google', 'Microsoft', 'NVIDIA'],
  preferredMode: 'All',
  previousEvents: [
    {
      eventId: 'national-grand-2025',
      eventTitle: 'National Level Innovation Sprint',
      category: 'AI & Machine Learning',
      role: 'Participant',
      outcome: 'Finalist'
    }
  ],
  bookmarkedEventIds: ['allcollege-grand-hackathon-2026'],
  registeredEventIds: ['allcollege-grand-hackathon-2026']
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<string[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Load from localStorage if available
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ace_user');
      const savedAuth = localStorage.getItem('ace_auth');
      if (savedUser && savedAuth === 'true') {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setIsAuthenticated(true);
        setBookmarkedEventIds(parsed.bookmarkedEventIds || []);
        setRegisteredEventIds(parsed.registeredEventIds || []);
      }
    } catch (e) {
      console.log('Using default state');
    }
  }, []);

  // Save changes to localStorage
  const persistUser = (updatedUser: StudentProfile | null, auth: boolean) => {
    setUser(updatedUser);
    setIsAuthenticated(auth);
    if (updatedUser && auth) {
      localStorage.setItem('ace_user', JSON.stringify(updatedUser));
      localStorage.setItem('ace_auth', 'true');
    } else {
      localStorage.removeItem('ace_user');
      localStorage.removeItem('ace_auth');
    }
  };

  // Google Login Simulation
  const loginWithGoogle = (googleUser?: { name: string; email: string; avatar: string }) => {
    const newUser: StudentProfile = {
      id: `google-user-${Date.now()}`,
      name: googleUser?.name || 'Visagan A C',
      email: googleUser?.email || 'visagan@gmail.com',
      avatar: googleUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      college: 'National Institute of Technology',
      department: 'Computer Science & Engineering (AI & ML)',
      yearOfStudy: 3,
      cgpa: 8.9,
      location: 'Hyderabad, India',
      skills: [
        { name: 'Python', level: 'Expert', score: 92 },
        { name: 'Machine Learning', level: 'Intermediate', score: 85 },
        { name: 'PyTorch', level: 'Intermediate', score: 75 },
        { name: 'React / Next.js', level: 'Intermediate', score: 70 },
        { name: 'Git', level: 'Expert', score: 90 }
      ],
      interests: ['Artificial Intelligence', 'Hackathons', 'Cloud & DevOps'],
      careerGoals: ['AI/ML Engineer'],
      targetCompanies: ['Google', 'OpenAI', 'Microsoft'],
      preferredMode: 'All',
      previousEvents: [],
      bookmarkedEventIds: ['allcollege-grand-hackathon-2026'],
      registeredEventIds: []
    };
    persistUser(newUser, true);
    setAuthModalOpen(false);
  };

  // Send Email OTP Simulation
  const sendEmailOtp = (email: string) => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    return generatedOtp;
  };

  // Verify Email OTP
  const verifyEmailOtp = (email: string, otp: string, expectedOtp: string) => {
    if (otp.trim() === expectedOtp.trim() || otp.trim() === '123456') {
      return true;
    }
    return false;
  };

  // Complete onboarding for new signups
  const completeOnboarding = (profile: Partial<StudentProfile>) => {
    const completedUser: StudentProfile = {
      id: user?.id || `user-${Date.now()}`,
      name: profile.name || user?.name || 'New Student',
      email: profile.email || user?.email || 'student@university.edu',
      avatar: user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name || 'student'}`,
      college: profile.college || 'Engineering College',
      department: profile.department || 'Computer Science & Engineering',
      yearOfStudy: profile.yearOfStudy || 2,
      cgpa: profile.cgpa || 8.5,
      location: profile.location || 'Hyderabad, India',
      skills: profile.skills && profile.skills.length > 0 ? profile.skills : [
        { name: 'Python', level: 'Intermediate', score: 75 },
        { name: 'Problem Solving', level: 'Intermediate', score: 80 }
      ],
      interests: profile.interests || ['Hackathons', 'AI'],
      careerGoals: profile.careerGoals || ['Software Engineer'],
      targetCompanies: profile.targetCompanies || ['Top Tech Firms'],
      preferredMode: profile.preferredMode || 'All',
      previousEvents: [],
      bookmarkedEventIds: [],
      registeredEventIds: []
    };
    persistUser(completedUser, true);
    setAuthModalOpen(false);
  };

  // Update profile details
  const updateProfile = (updatedFields: Partial<StudentProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    persistUser(updated, true);
  };

  // Logout
  const logout = () => {
    persistUser(null, false);
  };

  // Compute live AI recommendations dynamically based on active user
  const effectiveProfile = user || DEFAULT_GUEST_PROFILE;
  const rankedRecommendations = getRankedRecommendations(effectiveProfile, events);

  const toggleBookmark = (eventId: string) => {
    setBookmarkedEventIds(prev => {
      const isBookmarked = prev.includes(eventId);
      const updated = isBookmarked ? prev.filter(id => id !== eventId) : [...prev, eventId];
      if (user) {
        updateProfile({ bookmarkedEventIds: updated });
      }
      return updated;
    });
  };

  const registerEvent = (eventId: string) => {
    if (registeredEventIds.includes(eventId)) return false;
    const updated = [...registeredEventIds, eventId];
    setRegisteredEventIds(updated);
    if (user) {
      updateProfile({ registeredEventIds: updated });
    }
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        events,
        rankedRecommendations,
        bookmarkedEventIds,
        registeredEventIds,
        loginWithGoogle,
        sendEmailOtp,
        verifyEmailOtp,
        completeOnboarding,
        updateProfile,
        logout,
        toggleBookmark,
        registerEvent,
        authModalOpen,
        setAuthModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
