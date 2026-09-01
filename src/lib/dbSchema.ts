export const POSTGRES_DDL_SCHEMA = `
-- ==============================================================================
-- AllCollegeEvent.com AI-Driven Intelligence Platform
-- Complete Production PostgreSQL Relational Schema
-- ==============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- pgvector for Semantic Skill & Event Embeddings
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Trigram search for fuzzy title/skill querying

-- 2. Enumerated Data Types
CREATE TYPE user_role AS ENUM ('student', 'organizer', 'mentor', 'recruiter', 'admin');
CREATE TYPE event_category_enum AS ENUM (
    'AI & Machine Learning',
    'Full Stack & Web3',
    'Cloud & DevOps',
    'Cybersecurity',
    'Data Science & Analytics',
    'Robotics & IoT',
    'Mobile & App Dev',
    'Competitive Coding'
);
CREATE TYPE event_type_enum AS ENUM ('Hackathon', 'Workshop', 'Conference', 'Internship', 'Competition', 'Bootcamp');
CREATE TYPE event_mode_enum AS ENUM ('Offline', 'Virtual', 'Hybrid');
CREATE TYPE difficulty_enum AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Elite Championship');
CREATE TYPE interaction_type_enum AS ENUM ('view', 'bookmark', 'share', 'apply', 'register', 'attend', 'win');

-- 3. Users Table (Students & Organizers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student',
    avatar_url TEXT,
    college_name VARCHAR(255),
    department VARCHAR(255),
    year_of_study SMALLINT CHECK (year_of_study BETWEEN 1 AND 5),
    cgpa NUMERIC(3, 2),
    location_city VARCHAR(100),
    location_state VARCHAR(100),
    preferred_mode event_mode_enum DEFAULT 'Hybrid',
    career_goals TEXT[], -- Target roles (e.g. ['AI Engineer', 'Deep Learning Specialist'])
    target_companies TEXT[],
    embedding VECTOR(1536), -- Vectorized User Profile Embedding (Skills + Goals + Background)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Skills Taxonomy Table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    demand_index NUMERIC(3, 2) DEFAULT 1.0, -- Industry demand weight
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Student Skills Junction Table
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Expert')),
    proficiency_score SMALLINT CHECK (proficiency_score BETWEEN 0 AND 100),
    verified BOOLEAN DEFAULT false,
    verified_by_event_id UUID,
    UNIQUE(user_id, skill_id)
);

-- 6. Organizers Table
CREATE TABLE organizers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organization_name VARCHAR(255) NOT NULL,
    college_affiliation VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    trust_reputation_score NUMERIC(5, 2) DEFAULT 85.00,
    total_events_hosted INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Events Table (Core Opportunity Registry)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID REFERENCES organizers(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    type event_type_enum NOT NULL,
    category event_category_enum NOT NULL,
    mode event_mode_enum NOT NULL,
    location_venue TEXT,
    city VARCHAR(100),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL,
    short_summary TEXT NOT NULL,
    prize_pool_inr NUMERIC(12, 2) DEFAULT 0,
    prize_details JSONB,
    perks TEXT[],
    eligibility_criteria TEXT[],
    difficulty_level difficulty_enum NOT NULL,
    target_audience TEXT[],
    career_relevance TEXT[],
    trust_score NUMERIC(5, 2) CHECK (trust_score BETWEEN 0 AND 100),
    trust_breakdown JSONB, -- { "organizerReputation": 98, "curriculumDepth": 95, ... }
    is_featured BOOLEAN DEFAULT false,
    max_capacity INT,
    current_registrations INT DEFAULT 0,
    embedding VECTOR(1536), -- Vectorized Event Embedding (Title + Desc + Skills + Category)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Event Skills Junction Table (Pre-requisites & Gained)
CREATE TABLE event_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    skill_type VARCHAR(20) CHECK (skill_type IN ('prerequisite', 'gained')),
    importance_weight NUMERIC(3, 2) DEFAULT 1.0,
    UNIQUE(event_id, skill_id, skill_type)
);

-- 9. Student Interactions & Behavioral Logs (Implicit & Explicit Feedback)
CREATE TABLE user_event_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    interaction_type interaction_type_enum NOT NULL,
    dwell_time_seconds INT DEFAULT 0,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. AI Recommendation Cache & Explainability Table
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    match_score NUMERIC(5, 2) NOT NULL, -- 0 - 100%
    score_breakdown JSONB NOT NULL, -- { skillScore, careerGoalScore, deptAffinity, ... }
    matched_skills TEXT[],
    missing_skills_to_gain TEXT[],
    explanation_text TEXT NOT NULL,
    career_bridge_impact TEXT,
    tier VARCHAR(50) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- 11. High Performance Indexes
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_mode ON events(mode);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_trust_score ON events(trust_score DESC);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_interactions_user_event ON user_event_interactions(user_id, event_id);
CREATE INDEX idx_ai_recs_user_score ON ai_recommendations(user_id, match_score DESC);

-- 12. pgvector IVFFlat Approximate Nearest Neighbor Index for Sub-millisecond Semantic Search
CREATE INDEX idx_events_vector ON events USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
`;

export const ARCHITECTURE_EXPLANATION = {
  title: "AI-Driven Event Intelligence Platform Architecture",
  layers: [
    {
      name: "1. Data Ingestion & Auto-Intelligence Layer",
      tech: "Node.js Microservices + LLM NLP Parser + pgvector",
      description: "Extracts unstructured event text (PDF circulars, organizer drafts, URLs) and generates normalized taxonomy tags, difficulty rankings, skill vectors, and trust scores."
    },
    {
      name: "2. Multi-Factor Hybrid Recommendation Engine",
      tech: "Cosine Vector Similarity + Heuristic Gap-Bridge Weighting + Department Graph Synergy",
      description: "Combines 5 vector & heuristic dimensions (Skill match, Career goal bridge, Department synergy, Past behavior, Location) to produce personalized feeds with XAI explanations."
    },
    {
      name: "3. Trust & Quality Scoring Engine",
      tech: "Automated Verifier + Host Accreditation Weighting",
      description: "Scores events 0–100 based on organizer track record, syllabus completeness, mentor credentials, and prize pool transparency."
    },
    {
      name: "4. Student Experience & Discovery Frontend",
      tech: "Next.js 14 (App Router) + React + Tailwind CSS + Glassmorphism UI",
      description: "Ultra-responsive client interface with instant student persona switching, career roadmaps, interactive explainers, and real-time event booking."
    },
    {
      name: "5. Cross-Platform Mobile Layer (Flutter Roadmap)",
      tech: "Flutter 3.x + Riverpod + On-device MediaPipe / ML Kit",
      description: "Android/iOS app client with push notifications, geo-fenced campus event alerts, and offline schedule sync."
    }
  ]
};
