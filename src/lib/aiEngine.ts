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
  // 1. Skill Matching
  const studentSkillMap = new Map<string, number>();
  student.skills.forEach(s => studentSkillMap.set(s.name.toLowerCase(), s.score));

  const matchedSkills: string[] = [];
  let skillMatchAccumulator = 0;

  event.requiredSkills.forEach(reqSkill => {
    const key = reqSkill.toLowerCase();
    if (studentSkillMap.has(key)) {
      matchedSkills.push(reqSkill);
      const score = studentSkillMap.get(key) || 50;
      skillMatchAccumulator += (score / 100);
    } else {
      // Partial keyword match check (e.g. "Python" in "Python Scripting")
      let partialMatched = false;
      student.skills.forEach(s => {
        if (reqSkill.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(reqSkill.toLowerCase())) {
          matchedSkills.push(`${reqSkill} (via ${s.name})`);
          skillMatchAccumulator += (s.score / 100) * 0.75;
          partialMatched = true;
        }
      });
    }
  });

  const skillMatchScore = event.requiredSkills.length > 0 
    ? Math.min(100, Math.round((skillMatchAccumulator / event.requiredSkills.length) * 100))
    : 70;

  // Missing skills to gain
  const missingSkillsToGain = event.skillsGained.filter(sg => 
    !student.skills.some(s => s.name.toLowerCase() === sg.toLowerCase())
  );

  // 2. Career Goal Alignment & Trajectory Bridge
  let careerGoalScore = 40;
  let careerBridgeImpact = 'General skill broadening opportunity';

  const careerMatches = student.careerGoals.filter(goal => 
    event.careerRelevance.some(cr => cr.toLowerCase().includes(goal.toLowerCase()) || goal.toLowerCase().includes(cr.toLowerCase()))
  );

  if (careerMatches.length > 0) {
    careerGoalScore = 95;
    careerBridgeImpact = `Directly accelerates target role as ${careerMatches[0]} by teaching ${missingSkillsToGain.slice(0, 2).join(' & ')}`;
  } else {
    // Check secondary category relevance
    const goalCategory = student.careerGoals.join(' ').toLowerCase();
    if (goalCategory.includes('ai') && event.category === 'AI & Machine Learning') {
      careerGoalScore = 88;
      careerBridgeImpact = 'Builds portfolio artifacts aligned with AI/ML recruitment standards';
    } else if (goalCategory.includes('cloud') && event.category === 'Cloud & DevOps') {
      careerGoalScore = 88;
      careerBridgeImpact = 'Strengthens cloud infrastructure skills needed for SRE positions';
    } else if (goalCategory.includes('robot') && event.category === 'Robotics & IoT') {
      careerGoalScore = 88;
      careerBridgeImpact = 'Deepens physical computing and ROS2 capabilities for hardware roles';
    }
  }

  // 3. Department Affinity
  let departmentAffinity = 50;
  const deptLower = student.department.toLowerCase();
  if (deptLower.includes('computer') || deptLower.includes('cse') || deptLower.includes('information') || deptLower.includes('it') || deptLower.includes('ai')) {
    if (['AI & Machine Learning', 'Full Stack & Web3', 'Cloud & DevOps', 'Cybersecurity', 'Data Science & Analytics', 'Mobile & App Dev'].includes(event.category)) {
      departmentAffinity = 95;
    }
  } else if (deptLower.includes('electronics') || deptLower.includes('ece') || deptLower.includes('eee')) {
    if (['Robotics & IoT', 'AI & Machine Learning', 'Mobile & App Dev'].includes(event.category)) {
      departmentAffinity = 95;
    }
  } else if (deptLower.includes('math') || deptLower.includes('data')) {
    if (['Data Science & Analytics', 'AI & Machine Learning'].includes(event.category)) {
      departmentAffinity = 98;
    }
  }

  // 4. User Interest & Past History Alignment
  let interestAlignment = 50;
  const interestMatches = student.interests.filter(int => 
    event.description.toLowerCase().includes(int.toLowerCase()) || 
    event.category.toLowerCase().includes(int.toLowerCase())
  );
  if (interestMatches.length > 0) {
    interestAlignment = Math.min(100, 60 + interestMatches.length * 15);
  }

  // History boost if user attended same category before
  let historyBoost = 60;
  const pastCategoryCount = student.previousEvents.filter(pe => pe.category === event.category).length;
  if (pastCategoryCount > 0) {
    historyBoost = Math.min(100, 75 + pastCategoryCount * 12);
  }

  // 5. Location & Mode Preference
  let locationBonus = 80;
  if (student.preferredMode === 'All' || student.preferredMode === event.mode) {
    locationBonus = 95;
  }
  if (event.mode === 'Offline' && event.location.toLowerCase().includes(student.location.split(',')[0].toLowerCase())) {
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

  const finalMatchScore = Math.min(99, Math.max(35, Math.round(weightedScore)));

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
    reasons.push(`Leverages your verified skills in **${matchedSkills.slice(0, 3).join(', ')}**.`);
  }
  if (missingSkillsToGain.length > 0) {
    reasons.push(`Gains vital high-demand competencies in **${missingSkillsToGain.slice(0, 2).join(' and ')}**.`);
  }
  if (event.trustScore >= 95) {
    reasons.push(`High institutional trust score (**${event.trustScore}%**) with verified industry jury and hiring pipelines.`);
  }
  if (event.mode === 'Offline' && event.location.toLowerCase().includes(student.location.split(',')[0].toLowerCase())) {
    reasons.push(`Convenient in-person access in your home region (**${student.location.split(',')[0]}**).`);
  }

  const explanation = reasons.join(' ');

  return {
    event,
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
    explanation,
    matchTier,
  };
}

/**
 * Ranks all events for a given student profile
 */
export function getRankedRecommendations(student: StudentProfile, events: EventItem[]): RecommendationScore[] {
  const scores = events.map(event => calculateEventMatch(student, event));
  // Sort descending by match score, with featured bonus
  return scores.sort((a, b) => {
    const scoreA = a.matchScore + (a.event.featured ? 2 : 0);
    const scoreB = b.matchScore + (b.event.featured ? 2 : 0);
    return scoreB - scoreA;
  });
}

/**
 * AI Event Understanding & Parser for Organizers (Live Copilot)
 * Automatically parses raw unstructured event drafts into structured intelligence.
 */
export function analyzeEventDraft(rawText: string, collegeName: string = 'Tech University'): AIAnalysisDraftResult {
  const text = rawText.toLowerCase();

  // Smart Category Detection
  let category: EventCategory = 'AI & Machine Learning';
  if (text.includes('robot') || text.includes('iot') || text.includes('drone') || text.includes('ros') || text.includes('hardware')) {
    category = 'Robotics & IoT';
  } else if (text.includes('cloud') || text.includes('kubernetes') || text.includes('devops') || text.includes('docker') || text.includes('terraform')) {
    category = 'Cloud & DevOps';
  } else if (text.includes('cyber') || text.includes('ctf') || text.includes('hack') && text.includes('security') || text.includes('penetration')) {
    category = 'Cybersecurity';
  } else if (text.includes('data') || text.includes('quant') || text.includes('analytics') || text.includes('trading') || text.includes('pandas')) {
    category = 'Data Science & Analytics';
  } else if (text.includes('web3') || text.includes('solidity') || text.includes('react') || text.includes('fullstack') || text.includes('dapp')) {
    category = 'Full Stack & Web3';
  } else if (text.includes('flutter') || text.includes('android') || text.includes('ios') || text.includes('mobile') || text.includes('app')) {
    category = 'Mobile & App Dev';
  }

  // Type Detection
  let type: EventType = 'Hackathon';
  if (text.includes('conference') || text.includes('summit') || text.includes('symposium') || text.includes('paper')) {
    type = 'Conference';
  } else if (text.includes('workshop') || text.includes('hands-on') || text.includes('clinic')) {
    type = 'Workshop';
  } else if (text.includes('bootcamp') || text.includes('training') || text.includes('intensive')) {
    type = 'Bootcamp';
  } else if (text.includes('competition') || text.includes('contest') || text.includes('challenge') || text.includes('ctf')) {
    type = 'Competition';
  }

  // Difficulty Level Detection
  let difficulty: DifficultyLevel = 'Intermediate';
  if (text.includes('championship') || text.includes('grand') || text.includes('national') || text.includes('flagship') || text.includes('elite')) {
    difficulty = 'Elite Championship';
  } else if (text.includes('advanced') || text.includes('research') || text.includes('paper') || text.includes('cuda')) {
    difficulty = 'Advanced';
  } else if (text.includes('beginner') || text.includes('zero to') || text.includes('intro') || text.includes('basics')) {
    difficulty = 'Beginner';
  }

  // Keyword-based Skill Extraction
  const knownSkills = [
    'Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'C++', 'Linux', 'Docker', 'Kubernetes',
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Solidity', 'Rust', 'ROS2', 'SLAM', 'Pandas & NumPy',
    'Statistics', 'Cloud Architecture', 'DevOps', 'FastAPI', 'Git', 'Embedded Systems', 'Cybersecurity'
  ];
  const extractedSkills = knownSkills.filter(skill => text.includes(skill.toLowerCase()) || text.includes(skill.split(' ')[0].toLowerCase())).slice(0, 5);
  if (extractedSkills.length === 0) extractedSkills.push('Python', 'Problem Solving', 'System Design');

  const skillsGained = [
    'System Architecture',
    'Team Collaboration',
    category === 'AI & Machine Learning' ? 'Autonomous AI Workflows' : 'Production Deployment',
    category === 'Cloud & DevOps' ? 'GitOps CI/CD Pipelines' : 'Applied Innovation'
  ];

  // Career relevance
  const careerRelevance = [
    category === 'AI & Machine Learning' ? 'AI/ML Engineer' : 'Full Stack Developer',
    category === 'Cloud & DevOps' ? 'Cloud Solutions Architect' : 'Software Development Engineer (SDE)',
    'Technical Product Lead'
  ];

  // Target audience
  const targetAudience = [
    'B.Tech / B.E Students (2nd to 4th Year)',
    `${category} Aspirants`,
    'Collegiate Innovators'
  ];

  // Calculate Trust & Quality Score
  const wordCount = rawText.trim().split(/\s+/).length;
  const hasPrize = text.includes('prize') || text.includes('cash') || text.includes('grant') || text.includes('₹') || text.includes('$');
  const hasMentors = text.includes('mentor') || text.includes('speaker') || text.includes('jury') || text.includes('industry');
  const hasTimeline = text.includes('round') || text.includes('phase') || text.includes('hour') || text.includes('day') || text.includes('schedule');

  const organizerReputation = collegeName.toLowerCase().includes('iit') || collegeName.toLowerCase().includes('nit') || collegeName.toLowerCase().includes('gnitc') ? 98 : 90;
  const curriculumDepth = Math.min(98, Math.max(60, Math.round(wordCount * 0.8)));
  const prizeVerification = hasPrize ? 95 : 75;
  const mentorshipQuality = hasMentors ? 96 : 80;

  const trustScore = Math.round(
    organizerReputation * 0.3 +
    curriculumDepth * 0.3 +
    prizeVerification * 0.2 +
    mentorshipQuality * 0.2
  );

  // Predictions
  const minReg = Math.max(200, Math.round(wordCount * 5));
  const maxReg = minReg + 450;

  const topDepartments = [
    { dept: 'Computer Science & AI', percentage: 55 },
    { dept: 'Information Technology', percentage: 25 },
    { dept: 'Electronics & Comm (ECE)', percentage: 15 },
    { dept: 'Other Engineering Branches', percentage: 5 }
  ];

  // Optimization Suggestions
  const suggestions: string[] = [];
  if (!hasPrize) suggestions.push('Add clear prize tiers or industry certificates to increase student registration rate by ~35%.');
  if (!hasMentors) suggestions.push('List notable industry mentors or alumni judges to boost Trust Index.');
  if (wordCount < 40) suggestions.push('Elaborate on prerequisites and round structures to attract higher-caliber student submissions.');
  if (!text.includes('offline') && !text.includes('virtual')) suggestions.push('Explicitly state event mode (Offline campus vs Virtual) for optimal location-based AI matching.');

  return {
    smartTitle: rawText.split('\n')[0].replace(/^[#\*\-]+\s*/, '').slice(0, 65) || 'Next-Gen Collegiate Innovation Challenge',
    category,
    type,
    difficulty,
    extractedSkills,
    skillsGained,
    targetAudience,
    careerRelevance,
    trustScore,
    trustBreakdown: {
      organizerReputation,
      curriculumDepth,
      prizeVerification,
      mentorshipQuality,
    },
    predictedRegistrations: {
      min: minReg,
      max: maxReg,
      topDepartments,
    },
    optimizationSuggestions: suggestions,
  };
}
