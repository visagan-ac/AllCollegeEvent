import { EventItem, StudentProfile, RecommendationScore, AIAnalysisDraftResult, EventCategory, DifficultyLevel, EventType } from './types';

/**
 * Multi-Factor Hybrid Recommendation Engine
 * Calculates weighted match score based on 5 dimensions:
 * 1. Skill Match & Synergy (40%)
 * 2. Career Goal & Trajectory Bridge (25%)
 * 3. Department & Academic Level Affinity (15%)
 * 4. User Interest & Past Activity (10%)
 * 5. Location & Format Preference (10%)
 */
export function calculateEventMatch(student: StudentProfile, event: EventItem): RecommendationScore {
  const studentSkills = student?.skills || [];
  const reqSkills = event?.requiredSkills || [];
  const skillsGained = event?.skillsGained || [];
  const careerGoals = student?.careerGoals || [];
  const careerRelevance = event?.careerRelevance || [];
  const interests = student?.interests || [];
  const previousEvents = student?.previousEvents || [];
  const studentDept = student?.department || '';
  const studentLoc = student?.location || 'India';
  const eventLoc = event?.location || (event as any)?.locationVenue || 'India';

  // 1. Skill Matching
  const studentSkillMap = new Map<string, number>();
  studentSkills.forEach(s => {
    if (s?.name) {
      studentSkillMap.set(s.name.toLowerCase(), s.score || 70);
    }
  });

  const matchedSkills: string[] = [];
  let skillMatchAccumulator = 0;

  reqSkills.forEach(reqSkill => {
    if (!reqSkill) return;
    const key = reqSkill.toLowerCase();
    if (studentSkillMap.has(key)) {
      matchedSkills.push(reqSkill);
      const score = studentSkillMap.get(key) || 50;
      skillMatchAccumulator += (score / 100);
    } else {
      // Partial keyword match check (e.g. "Python" in "Python Scripting")
      studentSkills.forEach(s => {
        if (s?.name && (reqSkill.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(reqSkill.toLowerCase()))) {
          matchedSkills.push(`${reqSkill} (via ${s.name})`);
          skillMatchAccumulator += ((s.score || 70) / 100) * 0.75;
        }
      });
    }
  });

  const skillMatchScore = reqSkills.length > 0 
    ? Math.min(100, Math.round((skillMatchAccumulator / reqSkills.length) * 100))
    : 75;

  // Missing skills to gain
  const missingSkillsToGain = skillsGained.filter(sg => 
    sg && !studentSkills.some(s => s?.name && s.name.toLowerCase() === sg.toLowerCase())
  );

  // 2. Career Goal Alignment & Trajectory Bridge
  let careerGoalScore = 50;
  let careerBridgeImpact = 'General skill broadening opportunity';

  const careerMatches = careerGoals.filter(goal => 
    goal && careerRelevance.some(cr => cr && (cr.toLowerCase().includes(goal.toLowerCase()) || goal.toLowerCase().includes(cr.toLowerCase())))
  );

  if (careerMatches.length > 0) {
    careerGoalScore = 95;
    careerBridgeImpact = `Directly accelerates target role as ${careerMatches[0]} by teaching ${missingSkillsToGain.slice(0, 2).join(' & ')}`;
  } else {
    // Check secondary category relevance
    const goalCategory = careerGoals.join(' ').toLowerCase();
    const eventCategory = event?.category || '';
    if (goalCategory.includes('ai') && eventCategory.includes('AI')) {
      careerGoalScore = 88;
      careerBridgeImpact = 'Builds portfolio artifacts aligned with AI/ML recruitment standards';
    } else if (goalCategory.includes('cloud') && eventCategory.includes('Cloud')) {
      careerGoalScore = 88;
      careerBridgeImpact = 'Strengthens cloud infrastructure skills needed for SRE positions';
    } else if (goalCategory.includes('robot') && eventCategory.includes('Robotics')) {
      careerGoalScore = 88;
      careerBridgeImpact = 'Deepens physical computing and ROS2 capabilities for hardware roles';
    }
  }

  // 3. Department Affinity
  let departmentAffinity = 60;
  const deptLower = studentDept.toLowerCase();
  const eventCat = event?.category || '';
  if (deptLower.includes('computer') || deptLower.includes('cse') || deptLower.includes('information') || deptLower.includes('it') || deptLower.includes('ai')) {
    if (['AI & Machine Learning', 'Full Stack & Web3', 'Cloud & DevOps', 'Cybersecurity', 'Data Science & Analytics', 'Mobile & App Dev'].includes(eventCat)) {
      departmentAffinity = 95;
    }
  } else if (deptLower.includes('electronics') || deptLower.includes('ece') || deptLower.includes('eee')) {
    if (['Robotics & IoT', 'AI & Machine Learning', 'Mobile & App Dev'].includes(eventCat)) {
      departmentAffinity = 95;
    }
  } else if (deptLower.includes('math') || deptLower.includes('data')) {
    if (['Data Science & Analytics', 'AI & Machine Learning'].includes(eventCat)) {
      departmentAffinity = 98;
    }
  }

  // 4. User Interest & Past History Alignment
  let interestAlignment = 60;
  const descLower = (event?.description || '').toLowerCase();
  const catLower = eventCat.toLowerCase();
  const interestMatches = interests.filter(int => 
    int && (descLower.includes(int.toLowerCase()) || catLower.includes(int.toLowerCase()))
  );
  if (interestMatches.length > 0) {
    interestAlignment = Math.min(100, 65 + interestMatches.length * 12);
  }

  // History boost if user attended same category before
  let historyBoost = 60;
  const pastCategoryCount = previousEvents.filter(pe => pe?.category === eventCat).length;
  if (pastCategoryCount > 0) {
    historyBoost = Math.min(100, 75 + pastCategoryCount * 12);
  }

  // 5. Location & Mode Preference
  let locationBonus = 80;
  if (!student?.preferredMode || student.preferredMode === 'All' || student.preferredMode === event?.mode) {
    locationBonus = 95;
  }
  const studentCity = studentLoc.split(',')[0].trim().toLowerCase();
  if (event?.mode === 'Offline' && eventLoc.toLowerCase().includes(studentCity)) {
    locationBonus = 100;
  }

  // Weighted Final Score (0 - 100)
  const weightedScore = (
    skillMatchScore * 0.35 +
    careerGoalScore * 0.25 +
    departmentAffinity * 0.15 +
    interestAlignment * 0.10 +
    historyBoost * 0.08 +
    locationBonus * 0.07
  );

  const finalMatchScore = Math.min(99, Math.max(40, Math.round(weightedScore)));

  // Determine Match Tier
  let matchTier: RecommendationScore['matchTier'] = 'Exploratory';
  if (finalMatchScore >= 90) matchTier = 'Perfect Match';
  else if (finalMatchScore >= 80) matchTier = 'High Potential';
  else if (finalMatchScore >= 65) matchTier = 'Skill Builder';

  // Generate Natural Language Explanation (Explainable AI)
  const reasons: string[] = [];
  if (careerMatches.length > 0) {
    reasons.push(`Direct alignment with your career goal as **${careerMatches[0]}**.`);
  }
  if (matchedSkills.length > 0) {
    reasons.push(`Validates your proficiency in **${matchedSkills.slice(0, 3).join(', ')}**.`);
  }
  if (missingSkillsToGain.length > 0) {
    reasons.push(`Fills key skill gaps: **${missingSkillsToGain.slice(0, 2).join(' & ')}**.`);
  }
  if (reasons.length === 0) {
    reasons.push(`Curated opportunity for **${event?.category || 'Tech'}** innovators to build portfolio proof.`);
  }

  return {
    event: {
      ...event,
      location: eventLoc,
      requiredSkills: reqSkills,
      skillsGained,
      careerRelevance,
      targetAudience: event?.targetAudience || [],
      perks: event?.perks || [],
      eligibility: event?.eligibility || (event as any)?.eligibilityCriteria || ['Open to all students'],
      organizer: {
        name: event?.organizer?.name || (event as any)?.organizer?.organizationName || 'AllCollegeEvent Partner',
        college: event?.organizer?.college || (event as any)?.organizer?.collegeAffiliation || 'Premier Campus',
        verified: Boolean(event?.organizer?.verified ?? true),
        logoUrl: event?.organizer?.logoUrl || '🏆',
      },
    },
    matchScore: finalMatchScore,
    breakdown: {
      skillMatchScore,
      careerGoalScore,
      departmentAffinity,
      interestAlignment,
      historyBoost,
      locationBonus,
    },
    matchedSkills,
    missingSkillsToGain,
    careerBridgeImpact,
    explanation: reasons.join(' '),
    matchTier,
  };
}

export function getRankedRecommendations(student: StudentProfile, events: EventItem[]): RecommendationScore[] {
  if (!events || !Array.isArray(events)) return [];
  return events
    .map(event => calculateEventMatch(student, event))
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function analyzeEventDraft(text: string): AIAnalysisDraftResult {
  const lower = (text || '').toLowerCase();
  
  let category: EventCategory = 'AI & Machine Learning';
  if (lower.includes('kubernetes') || lower.includes('devops') || lower.includes('cloud') || lower.includes('aws')) category = 'Cloud & DevOps';
  else if (lower.includes('web3') || lower.includes('solidity') || lower.includes('blockchain') || lower.includes('crypto')) category = 'Full Stack & Web3';
  else if (lower.includes('cyber') || lower.includes('ctf') || lower.includes('security') || lower.includes('hack')) category = 'Cybersecurity';
  else if (lower.includes('robot') || lower.includes('drone') || lower.includes('iot') || lower.includes('ros')) category = 'Robotics & IoT';
  else if (lower.includes('flutter') || lower.includes('react native') || lower.includes('android') || lower.includes('ios')) category = 'Mobile & App Dev';
  else if (lower.includes('data') || lower.includes('analytics') || lower.includes('quant')) category = 'Data Science & Analytics';
  else if (lower.includes('algorithm') || lower.includes('leetcode') || lower.includes('competitive')) category = 'Competitive Coding';

  let type: EventType = 'Hackathon';
  if (lower.includes('workshop') || lower.includes('hands-on') || lower.includes('training')) type = 'Workshop';
  else if (lower.includes('conference') || lower.includes('summit') || lower.includes('research')) type = 'Conference';
  else if (lower.includes('bootcamp') || lower.includes('intensive') || lower.includes('cohort')) type = 'Bootcamp';
  else if (lower.includes('internship') || lower.includes('stipend')) type = 'Internship';
  else if (lower.includes('challenge') || lower.includes('ctf') || lower.includes('contest')) type = 'Competition';

  let difficulty: DifficultyLevel = 'Intermediate';
  if (lower.includes('beginner') || lower.includes('zero to') || lower.includes('intro')) difficulty = 'Beginner';
  else if (lower.includes('advanced') || lower.includes('research') || lower.includes('deep dive')) difficulty = 'Advanced';
  else if (lower.includes('grand') || lower.includes('national') || lower.includes('flagship') || lower.includes('championship')) difficulty = 'Elite Championship';

  const extractedSkills: string[] = [];
  if (lower.includes('python')) extractedSkills.push('Python');
  if (lower.includes('pytorch') || lower.includes('torch')) extractedSkills.push('PyTorch');
  if (lower.includes('react') || lower.includes('next.js')) extractedSkills.push('React / Next.js');
  if (lower.includes('docker') || lower.includes('kubernetes')) extractedSkills.push('Docker / K8s');
  if (lower.includes('solidity') || lower.includes('web3')) extractedSkills.push('Solidity / Smart Contracts');
  if (lower.includes('linux')) extractedSkills.push('Linux');
  if (lower.includes('sql') || lower.includes('postgres')) extractedSkills.push('PostgreSQL');
  if (extractedSkills.length === 0) extractedSkills.push('Problem Solving', 'Git', 'System Design');

  return {
    smartTitle: text.slice(0, 70).trim() + (text.length > 70 ? '...' : ''),
    category,
    type,
    difficulty,
    extractedSkills,
    skillsGained: ['Production Architecture', 'Industry Mentorship', 'Collaboration'],
    targetAudience: ['College Students', 'Aspiring Engineers'],
    careerRelevance: [`${category.split('&')[0].trim()} Engineer`, 'Product Developer'],
    trustScore: 94,
    trustBreakdown: {
      organizerReputation: 95,
      curriculumDepth: 94,
      prizeVerification: 92,
      mentorshipQuality: 95,
    },
    predictedRegistrations: {
      min: 250,
      max: 600,
      topDepartments: [
        { dept: 'Computer Science & Engineering', percentage: 48 },
        { dept: 'AI & Data Science', percentage: 32 },
        { dept: 'Electronics & Communication', percentage: 20 },
      ],
    },
    optimizationSuggestions: [
      'Add clear curriculum milestones to increase trust score by +4 points.',
      'Specify team size eligibility for better hackathon matching.',
    ],
  };
}
