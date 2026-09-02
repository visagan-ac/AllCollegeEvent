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

// 1. Common English Stopwords to filter conversational noise
const STOPWORDS = new Set([
  'i', 'want', 'an', 'a', 'the', 'in', 'on', 'at', 'with', 'and', 'or', 'for',
  'of', 'to', 'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being', 'have',
  'has', 'had', 'do', 'does', 'did', 'can', 'could', 'should', 'would', 'will',
  'show', 'me', 'find', 'get', 'give', 'tell', 'about', 'some', 'any', 'please',
  'need', 'looking', 'look', 'search', 'which', 'what', 'where', 'how', 'there',
  'like', 'also', 'related', 'available', 'events', 'event', 'opportunity', 'opportunities',
  'hi', 'hello', 'hey', 'suggest', 'recommend', 'check'
]);

// 2. Domain Synonym Mapping for Technical Terms & Cities
const SYNONYMS: Record<string, string[]> = {
  'ai': ['artificial intelligence', 'machine learning', 'deep learning', 'neural', 'llm', 'genai', 'agents'],
  'ml': ['machine learning', 'deep learning', 'data science', 'pytorch', 'tensorflow'],
  'web3': ['blockchain', 'solidity', 'crypto', 'ethereum', 'defi', 'smart contract', 'dapp'],
  'crypto': ['web3', 'blockchain', 'solidity', 'ethereum'],
  'cloud': ['devops', 'kubernetes', 'docker', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd'],
  'devops': ['cloud', 'docker', 'kubernetes', 'linux', 'ci/cd', 'gitops'],
  'cyber': ['cybersecurity', 'security', 'ctf', 'ethical hacking', 'reverse engineering'],
  'security': ['cybersecurity', 'cyber', 'ctf', 'penetration testing'],
  'robotics': ['robot', 'drone', 'ros2', 'iot', 'hardware', 'embedded'],
  'iot': ['robotics', 'arduino', 'esp32', 'embedded', 'sensors'],
  'fintech': ['trading', 'quantitative', 'quant', 'finance', 'algorithmic'],
  'trading': ['fintech', 'quantitative', 'quant', 'finance'],
  'bangalore': ['bengaluru', 'karnataka', 'koramangala', 'iisc'],
  'bengaluru': ['bangalore', 'karnataka', 'koramangala', 'iisc'],
  'chennai': ['madras', 'iit madras', 'shaastra', 'tamil nadu'],
  'mumbai': ['bombay', 'iit bombay', 'powai', 'maharashtra'],
  'hyderabad': ['telangana', 'hitec city'],
  'delhi': ['delhi ncr', 'dtu', 'iit delhi'],
  'pune': ['coep', 'maharashtra'],
  'offline': ['in-person', 'campus', 'physical'],
  'online': ['virtual', 'remote'],
  'hackathon': ['hack', 'sprint', 'championship', 'challenge'],
  'cash': ['prize', 'grant', 'reward', 'lakh', '₹', '$', 'money'],
  'prize': ['cash', 'grant', 'reward', 'lakh', '₹', '$'],
  'beginner': ['introductory', 'novice', 'starter', 'easy'],
  'internship': ['stipend', 'hiring', 'placement', 'job', 'fast-track']
};

/**
 * Extracts and stems meaningful keywords from conversational sentences
 */
export function extractKeywordsFromSentence(sentence: string): string[] {
  const cleaned = sentence.toLowerCase().replace(/[^\w\s₹$]/g, ' ');
  const rawWords = cleaned.split(/\s+/).filter(Boolean);
  
  const extracted = new Set<string>();

  rawWords.forEach(word => {
    if (word.length >= 2 && !STOPWORDS.has(word)) {
      extracted.add(word);
      if (SYNONYMS[word]) {
        SYNONYMS[word].forEach(syn => extracted.add(syn));
      }
    }
  });

  return Array.from(extracted);
}

/**
 * Maps extracted keywords against every event's rich attribute vector
 */
export function scoreEventByKeywords(event: EventItem, keywords: string[]): {
  score: number;
  matchedKeywords: string[];
} {
  const eventAttributes = {
    title: (event.title || '').toLowerCase(),
    description: (event.description || '').toLowerCase(),
    shortSummary: (event.shortSummary || '').toLowerCase(),
    category: (event.category || '').toLowerCase(),
    type: (event.type || '').toLowerCase(),
    mode: (event.mode || '').toLowerCase(),
    location: (event.location || (event as any).locationVenue || (event as any).city || '').toLowerCase(),
    requiredSkills: (event.requiredSkills || []).map(s => s.toLowerCase()),
    skillsGained: (event.skillsGained || []).map(s => s.toLowerCase()),
    perks: (event.perks || []).map(p => p.toLowerCase()),
    prizePool: (event.prizePool || '').toLowerCase(),
    targetAudience: (event.targetAudience || []).map(a => a.toLowerCase()),
    careerRelevance: (event.careerRelevance || []).map(c => c.toLowerCase()),
    organizer: `${event.organizer?.name || ''} ${event.organizer?.college || ''}`.toLowerCase(),
  };

  const matchedSet = new Set<string>();
  let totalScore = 0;

  const cityTokens = ['bengaluru', 'bangalore', 'chennai', 'mumbai', 'hyderabad', 'delhi', 'pune', 'kolkata', 'kochi', 'vellore'];

  keywords.forEach(keyword => {
    let kwMatched = false;

    // Weight 1: Exact City Match (Highest Priority)
    if (cityTokens.includes(keyword) && eventAttributes.location.includes(keyword)) {
      totalScore += 15;
      kwMatched = true;
    }

    // Weight 2: Title & Category
    if (eventAttributes.title.includes(keyword) || eventAttributes.category.includes(keyword)) {
      totalScore += 8;
      kwMatched = true;
    }

    // Weight 3: Required & Gained Skills
    if (eventAttributes.requiredSkills.some(s => s.includes(keyword)) || eventAttributes.skillsGained.some(s => s.includes(keyword))) {
      totalScore += 7;
      kwMatched = true;
    }

    // Weight 4: General Venue & Location
    if (!cityTokens.includes(keyword) && eventAttributes.location.includes(keyword)) {
      totalScore += 5;
      kwMatched = true;
    }

    // Weight 5: Event Type & Mode
    if (eventAttributes.type.includes(keyword) || eventAttributes.mode.includes(keyword)) {
      totalScore += 5;
      kwMatched = true;
    }

    // Weight 6: Prizes & Perks
    if (eventAttributes.prizePool.includes(keyword) || eventAttributes.perks.some(p => p.includes(keyword))) {
      totalScore += 4;
      kwMatched = true;
    }

    // Weight 7: Description & Career Relevance
    if (eventAttributes.description.includes(keyword) || eventAttributes.shortSummary.includes(keyword) || eventAttributes.careerRelevance.some(c => c.includes(keyword))) {
      totalScore += 3;
      kwMatched = true;
    }

    if (kwMatched) {
      matchedSet.add(keyword);
    }
  });

  return {
    score: totalScore,
    matchedKeywords: Array.from(matchedSet)
  };
}

/**
 * AllCollegeEvent Native Cognitive AI Engine v3.5
 * Minimal, Clean, and Ultra-Fast Responses
 */
export function generateAIResponse(
  userQuery: string,
  user: StudentProfile | null,
  events: EventItem[] = MOCK_EVENTS
): { text: string; suggestedEventIds?: string[]; quickReplies?: string[] } {
  const query = (userQuery || '').trim().toLowerCase();
  const rawQuery = (userQuery || '').trim();
  const userName = user?.name ? user.name.split(' ')[0] : 'Innovator';
  const userDept = user?.department || 'Computer Science & Engineering';
  const userYear = user?.yearOfStudy || 3;
  const userRole = user?.careerGoals?.[0] || 'AI/ML Engineer';

  // =========================================================================
  // 1. EXTRACT NLP KEYWORDS FROM SENTENCE
  // =========================================================================
  const extractedKeywords = extractKeywordsFromSentence(rawQuery);

  // =========================================================================
  // 2. CHECK FOR CODE GENERATION INTENTS
  // =========================================================================
  if (query.includes('fastapi') || (query.includes('code') && (query.includes('python') || query.includes('api') || query.includes('backend')))) {
    return {
      text: `💻 **FastAPI + PyTorch Inference Boilerplate:**\n\n\`\`\`python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import torch

app = FastAPI(title="Hackathon AI Microservice", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FeaturePayload(BaseModel):
    student_id: str = Field(..., example="ACE-2026-X89")
    features: list[float] = Field(..., min_items=1, example=[0.85, 0.92, 0.78])

@app.post("/api/predict")
async def run_inference(payload: FeaturePayload):
    tensor_data = torch.tensor(payload.features, dtype=torch.float32).unsqueeze(0)
    score = float(torch.sigmoid(torch.mean(tensor_data)).item()) * 100
    
    return {
        "status": "SUCCESS",
        "match_score": round(score, 2),
        "tier": "Perfect Match" if score >= 85 else "High Potential",
        "execution_time_ms": 1.15
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
\`\`\`\n\n📌 Run locally with \`uvicorn main:app --reload\`.`,
      suggestedEventIds: events.slice(0, 3).map(e => e.id),
      quickReplies: ['How to containerize with Docker?', 'Show Next.js UI code', 'Show AI Hackathons']
    };
  }

  if (query.includes('solidity') || query.includes('smart contract') || (query.includes('code') && query.includes('web3'))) {
    return {
      text: `💎 **Solidity ERC-721 Event Pass Smart Contract:**\n\n\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AllCollegeEventPass is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(address => bool) public hasClaimedFreePass;

    constructor() ERC721("AllCollegeEvent Pass", "ACEPASS") Ownable(msg.sender) {}

    function mintStudentPass(string memory eventSlug, string memory tokenURI) external returns (uint256) {
        require(!hasClaimedFreePass[msg.sender], "Pass already claimed");
        uint256 tokenId = ++_nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        hasClaimedFreePass[msg.sender] = true;
        return tokenId;
    }
}
\`\`\`\n\n📌 Deploy on Sepolia Testnet or Polygon zkEVM.`,
      suggestedEventIds: events.filter(e => e.category.includes('Web3')).slice(0, 3).map(e => e.id),
      quickReplies: ['How to deploy on Sepolia?', 'Show Web3 Hackathons', 'Pitching Web3 to jury']
    };
  }

  // =========================================================================
  // 3. CHECK FOR STRATEGY & PITCH DECK INTENTS
  // =========================================================================
  if (query.includes('how to win') || query.includes('pitch') || query.includes('jury') || query.includes('judg') || query.includes('strategy')) {
    return {
      text: `🥇 **Top 3 Hackathon Winning Rules:**\n\n1. **The 60-Second Hook:** State the real problem and cost before showing code.\n2. **The 3-Minute Demo:** 30s Problem ➔ 90s Live Working Demo ➔ 30s Architecture ➔ 30s Scalability.\n3. **The 24-Hour Rule:** Complete core features by Hour 24 and polish UI/pitch for the remaining 12 hours.`,
      suggestedEventIds: events.slice(0, 3).map(e => e.id),
      quickReplies: ['Show AI Project Ideas', 'FastAPI Starter Code', 'Top Hackathons with ₹5L Prize']
    };
  }

  // =========================================================================
  // 4. GENERAL GREETINGS
  // =========================================================================
  if (/^(hi|hello|hey|greetings|hola|good morning|good afternoon|good evening|yo|sup)\b/i.test(query) && extractedKeywords.length <= 1) {
    return {
      text: `👋 Hello **${userName}**! What opportunities are you looking for today?\n\n• Type any sentence with your requirements (*e.g., "offline AI hackathons in Bengaluru with cash prizes"*).\n• Or ask for code templates (*FastAPI, React, Solidity*).`,
      suggestedEventIds: events.slice(0, 3).map(e => e.id),
      quickReplies: ['Offline AI in Bengaluru', 'Web3 in Chennai', 'Cash Prizes ₹5L', 'FastAPI Starter Code']
    };
  }

  // =========================================================================
  // 5. NLP SENTENCE KEYWORD EXTRACTION & MINIMAL MATCHING OUTPUT
  // =========================================================================
  const scoredEvents = events.map(event => {
    const { score, matchedKeywords } = scoreEventByKeywords(event, extractedKeywords);
    return {
      event,
      score,
      matchedKeywords
    };
  }).filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scoredEvents.length > 0) {
    const topMatches = scoredEvents.slice(0, 3);
    const topSuggestedIds = topMatches.map(m => m.event.id);

    const matchDescriptions = topMatches.map((item, idx) => {
      const e = item.event;
      return (
        `**${idx + 1}. ${e.title}** (${e.mode} • ${e.location.split(',')[0]})\n` +
        `• 🏆 **Prize:** ${e.prizePool || 'Certificates & Mentorship'} • **Trust:** ${e.trustScore}/100\n` +
        `• ⚡ **Skills:** ${(e.requiredSkills || []).slice(0, 3).join(', ')}`
      );
    }).join('\n\n');

    return {
      text: `✨ **Top matches for your requirements:**\n\n${matchDescriptions}\n\n👉 Click **Explore** below on any card to claim your 1-click entry pass!`,
      suggestedEventIds: topSuggestedIds,
      quickReplies: [
        `Register for ${topMatches[0].event.title.slice(0, 20)}...`,
        'Show cash prizes',
        'FastAPI starter code',
        'How to win a hackathon?'
      ]
    };
  }

  // =========================================================================
  // 6. FALLBACK FOR GENERAL QUERIES
  // =========================================================================
  return {
    text: `✨ Here are the top recommended opportunities for you in **${userDept}** targeting **${userRole}**:\n\n` +
      events.slice(0, 3).map((e, idx) => 
        `**${idx + 1}. ${e.title}** (${e.mode} • ${e.location.split(',')[0]})\n` +
        `• 🏆 **Prize:** ${e.prizePool || 'Certificates & Incubation'}\n` +
        `• ⚡ **Skills:** ${(e.requiredSkills || []).slice(0, 3).join(', ')}`
      ).join('\n\n') +
      `\n\nClick **Explore** on any card below to view details!`,
    suggestedEventIds: events.slice(0, 3).map(e => e.id),
    quickReplies: ['Show cash prizes', 'FastAPI starter code', 'How to win hackathons?', 'Show offline events in Bengaluru']
  };
}
