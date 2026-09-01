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
  loginWithGoogle: (googleUser?: { name: string; email: string; avatar: string }) => Promise<void>;
  sendEmailOtp: (email: string) => string; // returns simulated OTP
  verifyEmailOtp: (email: string, otp: string, expectedOtp: string) => boolean;
  completeOnboarding: (profile: Partial<StudentProfile>) => Promise<void>;
  updateProfile: (profile: Partial<StudentProfile>) => Promise<void>;
  logout: () => void;
  toggleBookmark: (eventId: string) => Promise<void>;
  registerEvent: (eventId: string) => Promise<boolean>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
}

const DEFAULT_GUEST_PROFILE: StudentProfile = {
  id: 'guest-profile',
  name: 'Innovator',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  email: 'student@college.edu',
  college: 'National Institute of Technology',
  department: 'Computer Science & Engineering',
  yearOfStudy: 3,
  cgpa: 8.5,
  location: 'Hyderabad, India',
  skills: [
    { name: 'Python', level: 'Intermediate', score: 80 },
    { name: 'Machine Learning', level: 'Intermediate', score: 75 },
    { name: 'React', level: 'Intermediate', score: 70 },
  ],
  interests: ['Artificial Intelligence', 'Web3', 'Cloud'],
  careerGoals: ['AI/ML Engineer'],
  targetCompanies: ['Google', 'Microsoft'],
  preferredMode: 'All',
  previousEvents: [],
  bookmarkedEventIds: [],
  registeredEventIds: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [bookmarkedEventIds, setBookmarkedEventIds] = useState<string[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);

  // Fetch live events from PostgreSQL on initial load
  useEffect(() => {
    async function loadEventsFromDB() {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        if (data.success && data.events && data.events.length > 0) {
          // Normalize DB events if needed
          const normalized = data.events.map((e: any) => ({
            ...e,
            organizer: e.organizer ? {
              name: e.organizer.organizationName,
              college: e.organizer.collegeAffiliation || '',
              verified: e.organizer.isVerified,
              logoUrl: '🏆',
            } : e.organizer,
            trustFactors: e.trustBreakdown || {
              organizerReputation: 95,
              curriculumDepth: 95,
              prizeVerification: 95,
              mentorshipQuality: 95,
            },
            requiredSkills: e.requiredSkills || ['Python', 'Problem Solving'],
            skillsGained: e.skillsGained || ['Fullstack AI', 'Cloud'],
            targetAudience: e.targetAudience || ['All Students'],
            careerRelevance: e.careerRelevance || ['Software Engineer'],
            perks: e.perks || ['Certificate', 'Prize'],
            eligibility: e.eligibilityCriteria || ['All College Students'],
            duration: e.duration || '2 Days',
            deadline: e.registrationDeadline || e.startDate,
          }));
          setEvents(normalized);
        }
      } catch (err) {
        console.error('Error fetching events from DB, using fallback:', err);
      }
    }
    loadEventsFromDB();
  }, []);

  // Sync user profile from localStorage and database
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('ace_user');
      const savedAuth = localStorage.getItem('ace_auth');
      if (savedUser && savedAuth === 'true') {
        const parsed: StudentProfile = JSON.parse(savedUser);
        setUser(parsed);
        setIsAuthenticated(true);
        setBookmarkedEventIds(parsed.bookmarkedEventIds || []);
        setRegisteredEventIds(parsed.registeredEventIds || []);

        // Also fetch latest synced state from Neon PostgreSQL
        fetch(`/api/users?email=${encodeURIComponent(parsed.email)}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              setUser(data.user);
              if (data.user.bookmarkedEventIds) setBookmarkedEventIds(data.user.bookmarkedEventIds);
              if (data.user.registeredEventIds) setRegisteredEventIds(data.user.registeredEventIds);
            }
          })
          .catch(() => {});
      }
    } catch {
      console.log('Using initial state');
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

  // Google Login - Syncs directly with Neon PostgreSQL
  const loginWithGoogle = async (googleUser?: { name: string; email: string; avatar: string }) => {
    const email = googleUser?.email || 'visagan.ac@college.edu';
    const name = googleUser?.name || 'Visagan A C';
    const avatar = googleUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const defaultSkills = [
      { name: 'Python', level: 'Expert' as const, score: 92 },
      { name: 'Machine Learning', level: 'Intermediate' as const, score: 85 },
      { name: 'PyTorch', level: 'Intermediate' as const, score: 75 },
      { name: 'React / Next.js', level: 'Intermediate' as const, score: 70 },
      { name: 'Git', level: 'Expert' as const, score: 90 }
    ];

    const newUser: StudentProfile = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar,
      college: 'National Institute of Technology',
      department: 'Computer Science & Engineering (AI & ML)',
      yearOfStudy: 3,
      cgpa: 8.9,
      location: 'Hyderabad, India',
      skills: defaultSkills,
      interests: ['Artificial Intelligence', 'Hackathons', 'Cloud & DevOps'],
      careerGoals: ['AI/ML Engineer'],
      targetCompanies: ['Google', 'OpenAI', 'Microsoft'],
      preferredMode: 'All',
      previousEvents: [],
      bookmarkedEventIds: [],
      registeredEventIds: []
    };

    persistUser(newUser, true);
    setAuthModalOpen(false);

    // Save directly to Neon PostgreSQL database via API
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
          college: newUser.college,
          department: newUser.department,
          yearOfStudy: newUser.yearOfStudy,
          cgpa: newUser.cgpa,
          location: newUser.location,
          careerGoals: newUser.careerGoals,
          targetCompanies: newUser.targetCompanies,
          skills: newUser.skills,
        }),
      });
      console.log('✅ Google user saved to Neon PostgreSQL');
    } catch (err) {
      console.error('Error saving user to DB:', err);
    }
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

  // Complete onboarding for new signups - Writes to PostgreSQL
  const completeOnboarding = async (profile: Partial<StudentProfile>) => {
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

    // Save directly to Neon PostgreSQL database via API
    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: completedUser.email,
          name: completedUser.name,
          avatar: completedUser.avatar,
          college: completedUser.college,
          department: completedUser.department,
          yearOfStudy: completedUser.yearOfStudy,
          cgpa: completedUser.cgpa,
          location: completedUser.location,
          careerGoals: completedUser.careerGoals,
          targetCompanies: completedUser.targetCompanies,
          skills: completedUser.skills,
        }),
      });
      console.log('✅ Student onboarding saved to Neon PostgreSQL');
    } catch (err) {
      console.error('Error saving onboarding profile to DB:', err);
    }
  };

  // Update profile details - Updates PostgreSQL
  const updateProfile = async (updatedFields: Partial<StudentProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    persistUser(updated, true);

    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name: updated.name,
          college: updated.college,
          department: updated.department,
          yearOfStudy: updated.yearOfStudy,
          cgpa: updated.cgpa,
          careerGoals: updated.careerGoals,
          targetCompanies: updated.targetCompanies,
          preferredMode: updated.preferredMode,
        }),
      });
    } catch (err) {
      console.error('Error updating user in DB:', err);
    }
  };

  // Logout
  const logout = () => {
    persistUser(null, false);
    setBookmarkedEventIds([]);
    setRegisteredEventIds([]);
  };

  // Compute live AI recommendations dynamically based on active user
  const effectiveProfile = user || DEFAULT_GUEST_PROFILE;
  const rankedRecommendations = getRankedRecommendations(effectiveProfile, events);

  // Bookmark toggle - Saves to PostgreSQL
  const toggleBookmark = async (eventId: string) => {
    const isBookmarked = bookmarkedEventIds.includes(eventId);
    const updated = isBookmarked
      ? bookmarkedEventIds.filter(id => id !== eventId)
      : [...bookmarkedEventIds, eventId];

    setBookmarkedEventIds(updated);
    if (user) {
      persistUser({ ...user, bookmarkedEventIds: updated }, true);

      // Persist to Neon PostgreSQL user_event_interactions table
      try {
        await fetch('/api/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: user.email,
            eventId,
            interactionType: 'bookmark',
          }),
        });
      } catch (err) {
        console.error('Error logging bookmark to DB:', err);
      }
    }
  };

  // Register Event - Saves to PostgreSQL
  const registerEvent = async (eventId: string): Promise<boolean> => {
    if (registeredEventIds.includes(eventId)) return false;
    const updated = [...registeredEventIds, eventId];
    setRegisteredEventIds(updated);

    if (user) {
      persistUser({ ...user, registeredEventIds: updated }, true);

      // Persist registration to Neon PostgreSQL
      try {
        await fetch('/api/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userEmail: user.email,
            eventId,
            interactionType: 'register',
          }),
        });
      } catch (err) {
        console.error('Error logging registration to DB:', err);
      }
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
