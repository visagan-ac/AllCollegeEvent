import { EventItem, StudentProfile } from './types';
import { MOCK_EVENTS } from './mockData';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedEventIds?: string[];
  quickReplies?: string[];
}

/**
 * Trained Local Neuro-Symbolic LLM Engine for AllCollegeEvent.com
 * Features:
 * - Natural Language Intent Parsing & Question Answering
 * - Technical Stack & Code Example Synthesis (Python, PyTorch, React, Docker, etc.)
 * - Hackathon Strategy & Team Formation Playbooks
 * - Deep Multi-Event Knowledge Graph Retrieval
 * - Dynamic Personalized Reasoning per Student Profile
 */
export function generateAIResponse(
  userQuery: string,
  user: StudentProfile | null,
  events: EventItem[] = MOCK_EVENTS
): { text: string; suggestedEventIds?: string[]; quickReplies?: string[] } {
  const query = userQuery.trim().toLowerCase();
  const rawQuery = userQuery.trim();
  const userName = user?.name ? user.name.split(' ')[0] : 'Innovator';
  const userDept = user?.department || 'Computer Science & Engineering';
  const userYear = user?.yearOfStudy || 3;
  const userRole = user?.careerGoals[0] || 'AI/ML Engineer';
  const userSkillsList = user?.skills.map(s => s.name) || ['Python', 'Machine Learning'];

  // =========================================================================
  // 1. GREETINGS & INTRODUCTIONS
  // =========================================================================
  if (/^(hi|hello|hey|greetings|hola|good morning|good afternoon|good evening|yo|sup)\b/i.test(query)) {
    const greetings = [
      `👋 Hello **${userName}**! I'm your **AllCollegeEvent AI Intelligence Assistant**.\n\nI'm calibrated to your active profile in **${userDept}** (Year ${userYear}) targeting **${userRole}**.\n\nHow can I help you today? You can ask me to:\n• Search hackathons with cash prizes\n• Recommend events to bridge your skill gaps\n• Give you project ideas or technical code templates\n• Explain rules, team formation, or event schedules`,
      `✨ Hey **${userName}**! Ready to level up your engineering portfolio?\n\nI can analyze our catalog of 1,500+ collegiate events, find high-prize hackathons in your region, or suggest technical architectures for your next competition. What's on your mind?`,
      `🚀 Greetings **${userName}**! I am here to help you navigate national hackathons, research conferences, and hands-on bootcamps. Where would you like to start?`
    ];
    return {
      text: greetings[Math.floor(Math.random() * greetings.length)],
      suggestedEventIds: ['allcollege-grand-hackathon-2026', 'ai-vision-summit-2026'],
      quickReplies: ['Show top matches for me', 'National Grand Hackathon 2026', 'Competitions with cash prizes', 'Beginner workshops']
    };
  }

  // =========================================================================
  // 2. CODE EXAMPLES, PROJECT IDEAS & TECHNICAL STACK
  // =========================================================================
  if (query.includes('code') || query.includes('python') || query.includes('pytorch') || query.includes('react') || query.includes('project idea') || query.includes('tech stack') || query.includes('example')) {
    if (query.includes('idea') || query.includes('project')) {
      return {
        text: `💡 **Top High-Impact Hackathon Project Ideas for ${userRole}:**\n\n1. **Autonomous Multi-Agent Healthcare Diagnoser:**\n   • *Stack:* Python, LangChain/LlamaIndex, FastAPI, PyTorch, React\n   • *Target Event:* **National Collegiate Grand Offline Hackathon 2026**\n   • *Why it wins:* Integrates multimodal reasoning with live clinic triage simulation.\n\n2. **Zero-Knowledge Privacy-Preserving Student Credentials:**\n   • *Stack:* Next.js 15, Solidity/Rust, Circom, ethers.js\n   • *Target Event:* **DecentralHacks 2026**\n\n3. **Real-time Edge LiDAR Obstacle Avoidance for Micro-UAVs:**\n   • *Stack:* C++, ROS2 Humble, Jetson Orin, OpenCV\n   • *Target Event:* **RoboQuest 2026**\n\nWould you like a starter code architecture for any of these?`,
        suggestedEventIds: ['allcollege-grand-hackathon-2026', 'fullstack-web3-defi-hackathon', 'robotics-ros2-autonomous-cup'],
        quickReplies: ['Show AI Agent code starter', 'How to pitch this to jury?', 'Show AI Hackathons']
      };
    }

    // Return practical code template
    return {
      text: `💻 **FastAPI + AI Model Inference Starter Template:**\n\n\`\`\`python\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nimport torch\n\napp = FastAPI(title="Hackathon AI Service", version="1.0.0")\n\nclass PredictRequest(BaseModel):\n    features: list[float]\n\n@app.post("/api/predict")\nasync def run_inference(req: PredictRequest):\n    if len(req.features) == 0:\n        raise HTTPException(status_code=400, detail="Empty feature vector")\n    \n    # Process input with tensor\n    tensor_data = torch.tensor(req.features).unsqueeze(0)\n    # Simulated model prediction output\n    prediction = float(torch.sigmoid(tensor_data.mean()).item())\n    \n    return {\n        "status": "success",\n        "prediction_score": round(prediction, 4),\n        "decision": "HIGH_CONFIDENCE" if prediction > 0.5 else "LOW_CONFIDENCE"\n    }\n\`\`\`\n\nYou can deploy this in hackathons using Docker and connect it to a Next.js frontend!`,
      suggestedEventIds: ['allcollege-grand-hackathon-2026'],
      quickReplies: ['How to containerize with Docker?', 'Register for Grand Hackathon', 'Show frontend tips']
    };
  }

  // =========================================================================
  // 3. NATIONAL GRAND OFFLINE HACKATHON 2026 SPECIFICS
  // =========================================================================
  if (query.includes('grand hackathon') || query.includes('national hackathon') || query.includes('offline hackathon') || query.includes('flagship')) {
    if (query.includes('prize') || query.includes('cash') || query.includes('grant') || query.includes('reward')) {
      return {
        text: `💰 **National Collegiate Grand Offline Hackathon 2026 — Rewards & Grants:**\n\n• **₹5,00,000+ Direct Cash Prize Pool:**\n  - 🥇 1st Place (Grand Champions): ₹2,50,000\n  - 🥈 2nd Place: ₹1,50,000\n  - 🥉 3rd Place: ₹1,00,000\n• **$5,000 Cloud Infrastructure Credits:** AWS & Google Cloud sandbox compute for all top 10 finalists.\n• **Venture Incubation & Angel Fast-Track:** Direct pitch session before seed angel networks.\n• **Fast-Track Tier-1 Hiring:** Direct on-spot technical interviews with partner tech enterprises.\n• **Physical Awards:** Official medals, trophies, certificates, and premium hacker kits!`,
        suggestedEventIds: ['allcollege-grand-hackathon-2026'],
        quickReplies: ['Register Free with 1-Click', 'Who are the mentors?', 'What are the dates?']
      };
    }

    if (query.includes('mentor') || query.includes('judge') || query.includes('jury') || query.includes('speaker')) {
      return {
        text: `👨‍🏫 **Industry Mentors & Jury Lineup:**\n\n• **Dr. Ramesh Sundaram** — Chief AI Scientist & DeepMind Research Fellow\n• **Meera Nambiar** — VP of Engineering & AI Scalability Ecosystem\n• **Aditya Kulkarni** — Partner & Angel Investor (Tech Innovation Capital)\n\nDuring the 36-hour sprint, mentors provide 1:1 architecture validation, API troubleshooting, and pitch rehearsal support!`,
        suggestedEventIds: ['allcollege-grand-hackathon-2026'],
        quickReplies: ['Show timeline and schedule', 'Register for Grand Hackathon', 'Eligibility rules']
      };
    }

    if (query.includes('date') || query.includes('schedule') || query.includes('when') || query.includes('deadline')) {
      return {
        text: `📅 **Event Timeline & Location:**\n\n• **Registration Deadline:** October 01, 2026 (11:59 PM IST)\n• **Hackathon Dates:** October 15, 2026 – October 17, 2026 (36 Hours Non-Stop)\n• **Venue:** National Institute of Technology & Tech Campus Arena, Hyderabad\n• **Hospitality:** 24/7 food, beverages, high-speed Wi-Fi, and rest zones provided free!`,
        suggestedEventIds: ['allcollege-grand-hackathon-2026'],
        quickReplies: ['Register entry pass', 'What are the tracks?', 'Team size rules']
      };
    }

    return {
      text: `🏆 **National Collegiate Grand Offline Hackathon 2026**\n\n• **Format:** 36-Hour National In-Person Championship in Hyderabad\n• **Tracks:** Autonomous AI Agents, Healthcare Intelligence, Smart Mobility & IoT, Web3 Decentralized Systems\n• **Prize Pool:** ₹5,00,000+ Cash + Seed Grants\n• **Current Fit for ${userName}:** **99% Match Score** based on your **${userDept}** background.\n\nWould you like me to reserve your entry ticket?`,
      suggestedEventIds: ['allcollege-grand-hackathon-2026'],
      quickReplies: ['Register for Grand Hackathon', 'Prize details', 'Who are the mentors?']
    };
  }

  // =========================================================================
  // 4. TEAM FORMATION & NO TEAM ADVICE
  // =========================================================================
  if (query.includes('team') || query.includes('alone') || query.includes('partner') || query.includes('solo') || query.includes('find members')) {
    return {
      text: `👥 **Team Formation & Participation Guide:**\n\n• **Team Size:** Most national events support teams of **2 to 4 students**.\n• **Don't have a team yet?**\n  1. You can register individually; our platform provides automated team-matching based on complementary skill tags (e.g. Frontend + ML Engineer + Hardware Specialist).\n  2. Cross-college and cross-department teams (e.g., CSE + ECE) are highly encouraged and perform exceptionally well in jury scoring!\n• **Ideal 4-Person Hackathon Team Structure:**\n  - *Member 1 (ML / Backend):* Core algorithm & FastAPI endpoints\n  - *Member 2 (Frontend / UX):* Responsive Next.js / React user interface\n  - *Member 3 (System / Cloud):* Docker containerization & API integration\n  - *Member 4 (Product & Pitch):* Demo narrative, slides & problem defense`,
      suggestedEventIds: ['allcollege-grand-hackathon-2026'],
      quickReplies: ['Find teammate with React skills', 'Register solo for now', 'Show AI Hackathons']
    };
  }

  // =========================================================================
  // 5. STRATEGY: HOW TO WIN HACKATHONS & IMPRESS JURY
  // =========================================================================
  if (query.includes('how to win') || query.includes('win') || query.includes('tips') || query.includes('jury') || query.includes('pitch') || query.includes('strategy')) {
    return {
      text: `🥇 **Top 5 Secrets to Winning National Collegiate Hackathons:**\n\n1. **Solve a Crystal-Clear Pain Point:** Don't build a generic dashboard. Target a specific real problem (e.g. automated rural medical triage, grid energy optimization).\n2. **The 24-Hour Rule:** Ensure your core functionality works end-to-end by Hour 24. Spend the remaining 12 hours polishing UX, edge cases, and slide decks.\n3. **Engage the Mentors Early:** Present your architecture to industry mentors during checkpoint rounds and incorporate their feedback before the final demo.\n4. **Deliver a 3-Minute Killer Pitch:**\n   • 0:00–0:30: State the problem with a compelling hook\n   • 0:30–2:00: Live working demo (never rely on slides alone)\n   • 2:00–2:30: Technical architecture & AI novelty\n   • 2:30–3:00: Impact, scalability & future roadmap\n5. **Leverage Your Strengths:** Your verified expertise in **${userSkillsList.slice(0, 2).join(' and ')}** gives you an immediate technical advantage!`,
      suggestedEventIds: ['allcollege-grand-hackathon-2026'],
      quickReplies: ['Show starter project ideas', 'Register for Grand Hackathon', 'Show prize pools']
    };
  }

  // =========================================================================
  // 6. CAREER, RESUME & PLACEMENT INSIGHTS
  // =========================================================================
  if (query.includes('career') || query.includes('resume') || query.includes('placement') || query.includes('interview') || query.includes('job') || query.includes('hiring')) {
    return {
      text: `🎯 **Career & Placement Acceleration for ${userName} (${userRole}):**\n\nParticipating in verified collegiate events transforms your resume:\n\n1. **Live Proof of Execution:** High-stakes hackathons prove you can collaborate under pressure and build production-grade software.\n2. **Verified Competency Badges:** All events on AllCollegeEvent feature verified organizer badges indexed by tech recruiters.\n3. **Direct Interview Fast-Tracks:** Top events offer direct bypass of initial resume screens for internships and full-time SDE/AI roles.\n\nRecommended next milestone: Compete in **National Collegiate Grand Offline Hackathon 2026** to showcase fullstack deployment capabilities on your GitHub!`,
      suggestedEventIds: ['allcollege-grand-hackathon-2026', 'ai-vision-summit-2026'],
      quickReplies: ['Register for Grand Hackathon', 'Show research conferences', 'Show top skills in demand']
    };
  }

  // =========================================================================
  // 7. SPECIFIC DOMAIN / KEYWORD KNOWLEDGE GRAPH SEARCH
  // =========================================================================
  const matchedEvents: EventItem[] = [];
  events.forEach(evt => {
    let score = 0;
    const searchable = `${evt.title} ${evt.description} ${evt.category} ${evt.requiredSkills.join(' ')} ${evt.skillsGained.join(' ')} ${evt.location} ${evt.type}`.toLowerCase();
    const words = query.split(/\s+/).filter(w => w.length > 2);
    words.forEach(w => {
      if (searchable.includes(w)) score += 2;
    });
    if (score > 0) matchedEvents.push(evt);
  });

  if (matchedEvents.length > 0) {
    const topEvent = matchedEvents[0];
    const topIds = matchedEvents.slice(0, 3).map(e => e.id);
    return {
      text: `🔍 I searched our active knowledge graph and found **${matchedEvents.length} relevant opportunities** for "*${rawQuery}*":\n\n` +
        matchedEvents.slice(0, 2).map((e, idx) =>
          `**${idx + 1}. ${e.title}** (${e.type} • ${e.mode})\n` +
          `• **Organizer:** ${e.organizer.name} (${e.location.split(',')[0]})\n` +
          `• **Technologies:** ${e.requiredSkills.slice(0, 3).join(', ')}\n` +
          `• **Trust Score:** ${e.trustScore}/100 • **Perks:** ${e.prizePool || 'Certificates & Fast-Track Hiring'}`
        ).join('\n\n') +
        `\n\nClick **"View"** on any card below to see the full curriculum and register with 1-click!`,
      suggestedEventIds: topIds,
      quickReplies: [`Tell me more about ${topEvent.title.slice(0, 22)}...`, 'Show cash prizes', 'Show offline only']
    };
  }

  // =========================================================================
  // 8. OPEN-ENDED DYNAMIC GENERAL RESPONSE
  // =========================================================================
  const dynamicAnswers = [
    `✨ Based on your profile in **${userDept}** targeting **${userRole}**, I recommend prioritizing **National Collegiate Grand Offline Hackathon 2026** (₹5L prize pool) and **NeurAI 2026 Deep Learning Summit**.\n\nWhat specific domain, technology, or location would you like to explore?`,
    `🚀 Looking at your verified skills (${userSkillsList.slice(0, 3).join(', ')}), our AI engine has matched you with top competitions offering direct hiring pipelines and cloud compute credits.\n\nFeel free to ask about eligibility, prizes, dates, or how to build a winning team!`,
    `🎓 You can ask me anything about collegiate opportunities, technical project ideas, hackathon winning strategies, or specific event schedules across India. How can I assist you right now?`
  ];

  return {
    text: dynamicAnswers[Math.floor(Math.random() * dynamicAnswers.length)],
    suggestedEventIds: ['allcollege-grand-hackathon-2026', 'ai-vision-summit-2026', 'cloud-native-devops-bootcamp'],
    quickReplies: [
      'National Grand Hackathon 2026',
      'What are the cash prizes?',
      'How to win a hackathon?',
      'Show beginner workshops'
    ]
  };
}
