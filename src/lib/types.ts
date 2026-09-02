export type EventCategory = 
  | 'AI & Machine Learning'
  | 'Full Stack & Web3'
  | 'Cloud & DevOps'
  | 'Cybersecurity'
  | 'Data Science & Analytics'
  | 'Robotics & IoT'
  | 'Mobile & App Dev'
  | 'Competitive Coding';

export type EventType = 'Hackathon' | 'Workshop' | 'Conference' | 'Internship' | 'Competition' | 'Bootcamp';

export type EventMode = 'Offline' | 'Virtual' | 'Hybrid';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite Championship';

export interface EventItem {
  id: string;
  title: string;
  organizer: {
    name: string;
    college: string;
    verified: boolean;
    logoUrl?: string;
  };
  type: EventType;
  category: EventCategory;
  mode: EventMode;
  location: string;
  city?: string;
  startDate: string;
  endDate: string;
  duration: string;
  deadline: string;
  description: string;
  shortSummary: string;
  prizePool?: string;
  perks: string[];
  eligibility: string[];
  requiredSkills: string[];
  skillsGained: string[];
  difficulty: DifficultyLevel;
  targetAudience: string[];
  careerRelevance: string[];
  trustScore: number; // 0 - 100
  trustFactors: {
    organizerReputation: number;
    curriculumDepth: number;
    prizeVerification: number;
    mentorshipQuality: number;
  };
  featured?: boolean;
  registrationCount: number;
  maxCapacity?: number;
  syllabus?: { module: string; details: string }[];
  mentors?: { name: string; role: string; company: string }[];
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  college: string;
  department: string;
  yearOfStudy: number; // 1, 2, 3, 4
  cgpa: number;
  location: string;
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Expert'; score: number }[];
  interests: string[];
  careerGoals: string[];
  targetCompanies?: string[];
  preferredMode: EventMode | 'All';
  previousEvents: {
    eventId: string;
    eventTitle: string;
    category: EventCategory;
    role: string;
    outcome?: string;
  }[];
  bookmarkedEventIds: string[];
  registeredEventIds: string[];
}

export interface RecommendationScore {
  event: EventItem;
  matchScore: number; // 0 - 100%
  breakdown: {
    skillMatchScore: number;
    careerGoalScore: number;
    departmentAffinity: number;
    interestAlignment: number;
    historyBoost: number;
    locationBonus: number;
  };
  matchedSkills: string[];
  missingSkillsToGain: string[];
  careerBridgeImpact: string;
  explanation: string;
  matchTier: 'Perfect Match' | 'High Potential' | 'Skill Builder' | 'Exploratory';
}

export interface AIAnalysisDraftResult {
  smartTitle: string;
  category: EventCategory;
  type: EventType;
  difficulty: DifficultyLevel;
  extractedSkills: string[];
  skillsGained: string[];
  targetAudience: string[];
  careerRelevance: string[];
  trustScore: number;
  trustBreakdown: {
    organizerReputation: number;
    curriculumDepth: number;
    prizeVerification: number;
    mentorshipQuality: number;
  };
  predictedRegistrations: {
    min: number;
    max: number;
    topDepartments: { dept: string; percentage: number }[];
  };
  optimizationSuggestions: string[];
}

export interface CareerMilestone {
  id: string;
  title: string;
  targetRole: string;
  semester: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description: string;
  keySkills: string[];
  recommendedEventIds: string[];
}
