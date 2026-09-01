import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  'AI & Machine Learning',
  'Full Stack & Web3',
  'Cloud & DevOps',
  'Cybersecurity',
  'Data Science & Analytics',
  'Robotics & IoT',
  'Mobile & App Dev',
  'Competitive Coding',
  'AR/VR & Game Dev',
  'FinTech & Algorithmic Trading',
  'BioTech & Computational Health',
  'CleanTech & Sustainable Smart Grid'
];

const CITIES = [
  { city: 'Bengaluru', state: 'Karnataka, India', venue: 'Silicon Valley Tech Arena / Koramangala Hub' },
  { city: 'Hyderabad', state: 'Telangana, India', venue: 'HITEC City Innovation Arena / T-Hub' },
  { city: 'Chennai', state: 'Tamil Nadu, India', venue: 'OMR Tech Corridor / IITM Research Park' },
  { city: 'Mumbai', state: 'Maharashtra, India', venue: 'BKC Convention Center / Powai Campus' },
  { city: 'Pune', state: 'Maharashtra, India', venue: 'Hinjawadi Tech Park / Shivaji Nagar Campus' },
  { city: 'Delhi NCR', state: 'Delhi, India', venue: 'Pragati Maidan / Cyber City Gurugram' },
  { city: 'Kolkata', state: 'West Bengal, India', venue: 'Salt Lake Sector V / Newtown Convention Centre' },
  { city: 'Ahmedabad', state: 'Gujarat, India', venue: 'GIFT City FinTech Tower / Science City' },
  { city: 'Kochi', state: 'Kerala, India', venue: 'Infopark Tech District / SmartCity Arena' },
  { city: 'Coimbatore', state: 'Tamil Nadu, India', venue: 'TIDEL Park Arena / Avinashi Road Campus' },
  { city: 'Jaipur', state: 'Rajasthan, India', venue: 'Sitapura Industrial Tech Arena / Malviya Campus' },
  { city: 'Chandigarh', state: 'Punjab, India', venue: 'IT Park Hub / Mohali Tech Nexus' },
  { city: 'Indore', state: 'Madhya Pradesh, India', venue: 'Super Corridor Innovation Center' },
  { city: 'Bhubaneswar', state: 'Odisha, India', venue: 'Infocity Tech Pavilion / Chandaka Hub' },
  { city: 'Visakhapatnam', state: 'Andhra Pradesh, India', venue: 'Rushikonda IT Hills Tech Arena' },
  { city: 'Mysuru', state: 'Karnataka, India', venue: 'Hebbal Electronics City Campus' },
  { city: 'Goa', state: 'Goa, India', venue: 'Panaji Innovation Hub / BITS Zuarinagar' },
  { city: 'Singapore', state: 'Singapore', venue: 'Marina Bay Sands Expo & One-North Hub' },
  { city: 'San Francisco', state: 'California, USA', venue: 'Moscone Center / Silicon Valley Nexus' },
  { city: 'London', state: 'United Kingdom', venue: 'ExCeL London / Tech City Shoreditch' },
  { city: 'Dubai', state: 'United Arab Emirates', venue: 'Dubai World Trade Centre & DIFC Hub' },
  { city: 'Tokyo', state: 'Japan', venue: 'Tokyo Big Sight / Shibuya Innovation Nexus' }
];

const MODES = ['Offline', 'Virtual', 'Hybrid'] as const;

const EVENT_TYPES = [
  'Hackathon',
  'Workshop',
  'Conference',
  'Bootcamp',
  'Competition',
  'Internship Challenge'
];

const DIFFICULTY_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'EliteChampionship'
] as const;

const ORGANIZERS = [
  { name: 'Google Developer Student Clubs (GDSC)', college: 'National Chapters Alliance' },
  { name: 'Microsoft Learn Student Ambassadors', college: 'Global Innovation Network' },
  { name: 'AWS Cloud Student Clubs', college: 'Amazon Web Services Academic Guild' },
  { name: 'ACM Student Chapter', college: 'Association for Computing Machinery' },
  { name: 'IEEE Computer Society', college: 'Institute of Electrical and Electronics Engineers' },
  { name: 'IIT Bombay Techfest & E-Cell', college: 'Indian Institute of Technology Bombay' },
  { name: 'IIT Madras Shaastra & CFI', college: 'Indian Institute of Technology Madras' },
  { name: 'IIT Delhi Tryst & Robotix', college: 'Indian Institute of Technology Delhi' },
  { name: 'IISc Bangalore AI & Computational Labs', college: 'Indian Institute of Science' },
  { name: 'NIT Trichy Festember & Pragyan', college: 'National Institute of Technology Tiruchirappalli' },
  { name: 'BITS Pilani APOGEE & Quark', college: 'Birla Institute of Technology and Science' },
  { name: 'Anna University Kurukshetra & CEG Tech', college: 'Anna University Chennai' },
  { name: 'IIIT Hyderabad Felicity & Kohli Center', college: 'International Institute of Information Technology' },
  { name: 'OpenAI Campus Student Developers', college: 'Autonomous AI Guild' },
  { name: 'GitHub Campus Experts', college: 'GitHub Education Alliance' },
  { name: 'NVIDIA Deep Learning Institute Campus Hub', college: 'NVIDIA Accelerated Computing Guild' },
  { name: 'Solana University Alliance', college: 'Decentralized Blockchain Guild' },
  { name: 'Kubernetes & CNCF Student Chapter', college: 'Cloud Native Computing Foundation' }
];

const DOMAIN_DATA: Record<string, {
  titles: string[];
  skills: string[];
  skillsGained: string[];
  careers: string[];
}> = {
  'AI & Machine Learning': {
    titles: [
      'Generative AI & LLM Systems National Hackathon',
      'Deep Learning & Neural Vision Research Conference',
      'Agentic AI & Autonomous Multi-Agent Workshop',
      'Computer Vision & Edge AI National Championship',
      'Reinforcement Learning & Robotics AI Summit',
      'Diffusion Models & Multimodal AI Bootcamp',
      'AI for Healthcare & Diagnostic Imaging Challenge',
      'Production ML: MLOps with Kubeflow & MLflow Workshop'
    ],
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'CUDA', 'OpenCV', 'Scikit-Learn'],
    skillsGained: ['Prompt Architecture', 'Fine-Tuning LLaMA', 'RAG Pipelines', 'Quantization (LoRA)', 'Model Serving (vLLM)'],
    careers: ['AI/ML Engineer', 'LLM Architect', 'Research Scientist', 'Computer Vision Specialist', 'MLOps Engineer']
  },
  'Full Stack & Web3': {
    titles: [
      'Decentralized Web3 & DeFi Global Hackathon',
      'Next.js 15 & Server Actions Architecture Summit',
      'Zero-Knowledge Proofs & Ethereum Layer 2 Workshop',
      'Full Stack Cloud-Native Application Championship',
      'Solana High-Performance DApp Bootcamp',
      'Smart Contract Security & Auditing Challenge',
      'Enterprise Microfrontends & GraphQL Masterclass',
      'Web3 Cross-Chain Protocol Engineering Summit'
    ],
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Solidity', 'Rust', 'GraphQL', 'TailwindCSS'],
    skillsGained: ['DApp Architecture', 'Gas Optimization', 'Zk-SNARKs Integration', 'Server-Side Rendering', 'REST/gRPC APIs'],
    careers: ['Full Stack AI Engineer', 'Web3 / Smart Contract Developer', 'Frontend Architect', 'Protocol Engineer']
  },
  'Cloud & DevOps': {
    titles: [
      'Cloud-Native Kubernetes & Microservices Grand Slam',
      'AWS & GCP Multi-Cloud Infrastructure Hackathon',
      'DevOps, CI/CD & GitOps Automation Bootcamp',
      'Site Reliability Engineering (SRE) Masterclass',
      'Terraform & Infrastructure-as-Code Championship',
      'Serverless Architecture & Cloud Scaling Summit',
      'Observability with Prometheus & Grafana Workshop',
      'Zero-Trust Cloud Network Security Challenge'
    ],
    skills: ['Kubernetes', 'Docker', 'AWS', 'GCP', 'Terraform', 'CI/CD Pipelines', 'Linux', 'Prometheus'],
    skillsGained: ['Cluster Orchestration', 'Helm Charts', 'Chaos Engineering', 'Auto-scaling Policies', 'Cloud Cost Optimization'],
    careers: ['DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer', 'Platform Infrastructure Engineer']
  },
  'Cybersecurity': {
    titles: [
      'National Flagship Capture The Flag (CTF) Championship',
      'Offensive Red Teaming & Ethical Hacking Summit',
      'Zero-Day Vulnerability Research & Reverse Engineering Workshop',
      'Defensive Blue Team & Threat Hunting Challenge',
      'Application Security (AppSec) & DevSecOps Bootcamp',
      'Cloud Infrastructure Penetration Testing Summit',
      'Cryptography & Quantum-Safe Security Hackathon',
      'Malware Analysis & Digital Forensics Masterclass'
    ],
    skills: ['Ethical Hacking', 'Penetration Testing', 'Linux', 'Wireshark', 'Burp Suite', 'Reverse Engineering', 'Cryptography', 'Python'],
    skillsGained: ['Binary Exploitation', 'Web Vulnerability Scanners', 'Threat Modeling', 'Incident Response', 'SOC Operations'],
    careers: ['Cybersecurity Analyst', 'Penetration Tester', 'Security Operations Engineer', 'Information Security Architect']
  },
  'Data Science & Analytics': {
    titles: [
      'Big Data & Spark Streaming Analytics Hackathon',
      'Predictive Analytics & FinTech Quant Championship',
      'Snowflake & dbt Modern Data Stack Workshop',
      'Business Intelligence & Executive Analytics Summit',
      'Real-Time Event Stream Processing Challenge',
      'Spatial Data Science & Geospatial AI Bootcamp',
      'Data Engineering with Apache Kafka Masterclass',
      'Statistical Modeling & Causal Inference Conference'
    ],
    skills: ['Python', 'SQL', 'PostgreSQL', 'Pandas', 'Apache Spark', 'Kafka', 'Tableau', 'dbt'],
    skillsGained: ['ETL Pipeline Design', 'Data Lakehouse Arch', 'Statistical Hypothesis Testing', 'Real-time Dashboards'],
    careers: ['Data Scientist', 'Data Engineer', 'Quantitative Analyst', 'Business Intelligence Developer']
  },
  'Robotics & IoT': {
    titles: [
      'Autonomous Drone Racing & Computer Vision Championship',
      'ROS2 & Physical AI Humanoid Robotics Hackathon',
      'Smart City IoT & Edge Computing Summit',
      'Robotics Manipulation & Reinforcement Learning Bootcamp',
      'Embedded Systems & Microcontroller Hardware Challenge',
      'Autonomous Mobile Robots (AMR) Navigation Workshop',
      'Industrial IoT & Digital Twin Engineering Summit',
      'Underwater & Aerial Robotics Innovation Challenge'
    ],
    skills: ['C++', 'Python', 'ROS2', 'Arduino', 'Raspberry Pi', 'Embedded C', 'Gazebo Sim', 'OpenCV'],
    skillsGained: ['SLAM Algorithms', 'PID Control Systems', 'Sensor Fusion (IMU/LiDAR)', 'Edge TensorRT Deployment'],
    careers: ['Robotics Engineer', 'Embedded Systems Architect', 'IoT Solutions Engineer', 'Autonomous Systems Specialist']
  },
  'Mobile & App Dev': {
    titles: [
      'Flutter & Cross-Platform UI/UX Grand Hackathon',
      'Swift & iOS Spatial Computing Vision Pro Summit',
      'React Native & Expo Architecture Championship',
      'Android 15 Kotlin Jetpack Compose Masterclass',
      'Offline-First Mobile App Engineering Bootcamp',
      'On-Device AI & CoreML Mobile Experience Challenge',
      'Mobile Micro-Interactions & Animation Workshop',
      'Scalable Mobile Backend & SQLite Integration Summit'
    ],
    skills: ['Flutter', 'Dart', 'React Native', 'Kotlin', 'Swift', 'Jetpack Compose', 'Firebase', 'SQLite'],
    skillsGained: ['State Management (Riverpod/Zustand)', 'Native Platform Bridges', 'Offline SQLite Sync', 'App Store CI/CD'],
    careers: ['Mobile Application Developer', 'iOS Engineer', 'Android Architect', 'Cross-Platform Lead']
  },
  'Competitive Coding': {
    titles: [
      'National Algorithmic Coding Championship (CodeSprint)',
      'Advanced Graph Theory & Dynamic Programming Hackathon',
      'International Collegiate Programming Contest (ICPC) Warmup',
      'Fast I/O & Bitwise Algorithms Speed Challenge',
      'System Design & Distributed Data Structures Battle',
      'Math Olympiad & Combinatorics for Coders Summit',
      '24-Hour CodeMarathon & Competitive Arena 2026',
      'Google Kickstart & Codeforces Grandmaster Bootcamp'
    ],
    skills: ['C++', 'Algorithms', 'Data Structures', 'Dynamic Programming', 'Graph Theory', 'Number Theory', 'Java'],
    skillsGained: ['Time/Space Complexity Optimization', 'Segment Trees & Fenwick Trees', 'Disjoint Set Unions', 'DP with Bitmask'],
    careers: ['Software Development Engineer (SDE)', 'Quantitative Developer', 'Core Algorithm Engineer']
  },
  'AR/VR & Game Dev': {
    titles: [
      'Unreal Engine 5 & Next-Gen Game Dev Hackathon',
      'Unity XR & VisionOS Spatial Experience Championship',
      'Metaverse & WebXR Interactive Worlds Summit',
      'Shader Programming & Real-Time Ray Tracing Workshop',
      'Game Physics & Multiplayer Networking Challenge',
      '3D Procedural World Generation Bootcamp',
      'Haptic Feedback & VR Immersion Masterclass',
      'Indie Game Studio Pitch & Prototype Contest'
    ],
    skills: ['Unity', 'Unreal Engine 5', 'C#', 'C++', 'Blender', 'HLSL Shaders', 'WebXR', 'Spatial Audio'],
    skillsGained: ['Lumen & Nanite Workflows', 'XR Interaction Toolkits', 'Multiplayer Netcode', '3D Asset Rigging'],
    careers: ['Game Developer', 'XR/VR Engineer', 'Graphics Programmer', 'Technical Artist']
  },
  'FinTech & Algorithmic Trading': {
    titles: [
      'High-Frequency Algorithmic Trading Hackathon',
      'Quantitative Alpha Strategies & Backtesting Summit',
      'Core Banking Microservices & UPI 3.0 Challenge',
      'AI in Fraud Detection & Risk Modeling Workshop',
      'Crypto Market Maker & Liquidity Pool Championship',
      'FinTech Security & Open Banking API Bootcamp',
      'Credit Risk Analysis with Graph Neural Networks',
      'Derivatives Pricing & Monte Carlo Simulations Masterclass'
    ],
    skills: ['Python', 'C++', 'Time Series Analysis', 'PostgreSQL', 'NumPy', 'Financial Modeling', 'Kafka', 'Rust'],
    skillsGained: ['Order Book Dynamics', 'Backtesting Engines', 'Sharpe Ratio Optimization', 'Real-Time Market Feeds'],
    careers: ['Quant Developer', 'FinTech Engineer', 'Risk Analyst', 'Algorithmic Trader']
  },
  'BioTech & Computational Health': {
    titles: [
      'Genomics & AlphaFold Protein Structure Prediction Hackathon',
      'Computational Drug Discovery & Molecular Modeling Summit',
      'Wearable Health Sensors & Real-Time ECG AI Challenge',
      'Biomedical Signal Processing & Neural Interface Workshop',
      'Cancer Genomics & Biomarker Discovery Championship',
      'Clinical Trial Data Analytics Bootcamp',
      'Bioinformatics Pipelines with Nextflow Masterclass',
      'Synthetic Biology & DNA Computing Innovation Summit'
    ],
    skills: ['Python', 'BioPython', 'R', 'PyTorch', 'Nextflow', 'BLAST', 'Molecular Dynamics', 'Pandas'],
    skillsGained: ['Protein Folding Prediction', 'Genomic Sequence Alignment', 'Bioinformatics ETL', 'Medical Imaging AI'],
    careers: ['Bioinformatics Scientist', 'Computational Biologist', 'HealthTech AI Engineer']
  },
  'CleanTech & Sustainable Smart Grid': {
    titles: [
      'Smart Energy Grid & Renewable Storage Hackathon',
      'Electric Vehicle (EV) Battery Management Systems Summit',
      'Carbon Accounting & Green Cloud Computing Challenge',
      'Solar Forecasting with Spatio-Temporal AI Workshop',
      'Autonomous Microgrid & IoT Energy Optimization Bootcamp',
      'Sustainable Urban Architecture & Digital Twin Challenge',
      'Hydro & Wind Energy Predictive Maintenance Summit',
      'Circular Economy & Supply Chain Traceability Masterclass'
    ],
    skills: ['Python', 'IoT', 'Embedded Systems', 'Data Science', 'MATLAB', 'Simulink', 'Time Series', 'CAD'],
    skillsGained: ['BMS Thermal Modeling', 'Smart Meter Protocol Design', 'Carbon Footprint Telemetry', 'Microgrid Stability'],
    careers: ['CleanTech Engineer', 'Energy Systems Analyst', 'EV Systems Engineer', 'Smart Grid Architect']
  }
};

const PRIZE_POOLS = [
  '₹2,50,000 + Cloud Credits',
  '₹5,00,000 + Incubation Support',
  '₹10,00,000 + VC Seed Funding',
  '₹15,00,000 + Fast-Track Interviews',
  '₹25,00,000 Flagship Grand Prize',
  '₹1,50,000 + Hardware Kits',
  '₹3,50,000 + Mentorship & Grants',
  'Paid High-Stipend Internships (₹45k/mo)',
  'Direct SDE-1 Pre-Placement Offers (PPO)'
];

const PERKS_LIST = [
  ['Fast-track Interviews', 'Cash Prizes', 'Free Accommodation & Food', 'Cloud Credits ($2500)', 'Verified Certificate'],
  ['VC Funding Access', '1-on-1 Industry Mentorship', 'Direct Pre-Placement Offers (PPOs)', 'Exclusive Swag & Kits'],
  ['NVIDIA GPU Credits', 'Free Cohort Entry', 'Job Referrals at Top Tech', 'Official IEEE/ACM Accreditation'],
  ['Hardware Development Boards', 'Direct Incubation', 'Networking with Angel Investors', 'Global Hackathon Passes']
];

const ELIGIBILITY_OPTIONS = [
  ['B.Tech / B.E / M.Tech / MCA (All Years)', 'Teams of 1 to 4 members', 'Valid Student ID Required'],
  ['Open to all Undergraduate & Postgraduate Students', 'Inter-college teams allowed', 'No prior experience required'],
  ['Pre-final & Final Year Students', 'Individual or Duo Registration', 'Must submit resume on registration'],
  ['Open to All Collegiate Coders, Designers & Innovators', 'Teams of 2 to 5 members', 'Global online participation']
];

async function generateAndSeed2000Events() {
  console.log('🚀 Starting generation of 2,000 diverse collegiate events...');

  // 1. Create or ensure Organizers exist in Neon PostgreSQL
  console.log('📦 Setting up organizer institutional accounts...');
  const organizerRecords: { id: string; name: string; college: string }[] = [];

  for (let i = 0; i < ORGANIZERS.length; i++) {
    const org = ORGANIZERS[i];
    const orgEmail = `organizer-${i + 1}@allcollegeevent.com`;

    const user = await prisma.user.upsert({
      where: { email: orgEmail },
      update: {},
      create: {
        email: orgEmail,
        fullName: org.name,
        role: 'ORGANIZER',
        collegeName: org.college,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${org.name.replace(/\s+/g, '')}`,
      },
    });

    const organizer = await prisma.organizer.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        organizationName: org.name,
        collegeAffiliation: org.college,
        isVerified: true,
        trustReputationScore: Math.floor(92 + Math.random() * 8),
        totalEventsHosted: Math.floor(15 + Math.random() * 45),
      },
    });

    organizerRecords.push({ id: organizer.id, name: org.name, college: org.college });
  }

  // 2. Generate 2,000 Rich, Realistic Events
  console.log('⚡ Generating 2,000 unique events across 12 domains and 22 major regions...');

  const eventsData: any[] = [];
  const totalToGenerate = 2000;

  for (let i = 1; i <= totalToGenerate; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const domainInfo = DOMAIN_DATA[category];
    const cityInfo = CITIES[i % CITIES.length];
    const mode = MODES[i % MODES.length];
    const eventType = EVENT_TYPES[i % EVENT_TYPES.length];
    const difficulty = DIFFICULTY_LEVELS[i % DIFFICULTY_LEVELS.length];
    const org = organizerRecords[i % organizerRecords.length];

    const baseTitle = domainInfo.titles[i % domainInfo.titles.length];
    const edition = 2026;
    const title = `${baseTitle} • Edition ${Math.floor(i / 10) + 1} (${cityInfo.city})`;

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}-${Date.now() % 100000}`;

    // Date distribution across 2026 (From Feb 2026 to Dec 2026)
    const dayOffset = (i * 3) % 320;
    const startDate = new Date(Date.UTC(2026, 1, 1 + dayOffset, 9, 0, 0));
    const durationHours = mode === 'Offline' ? (i % 2 === 0 ? 36 : 48) : 24;
    const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
    const registrationDeadline = new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const prizePool = PRIZE_POOLS[i % PRIZE_POOLS.length];
    const perks = PERKS_LIST[i % PERKS_LIST.length];
    const eligibility = ELIGIBILITY_OPTIONS[i % ELIGIBILITY_OPTIONS.length];

    // Pick 3-5 required skills
    const reqSkills = domainInfo.skills.slice(0, 3 + (i % 3));
    const skillsGained = domainInfo.skillsGained.slice(0, 3 + (i % 2));
    const careerRelevance = domainInfo.careers;

    const trustScore = Number((88.0 + (i % 12) * 0.95).toFixed(1));
    const maxCapacity = mode === 'Virtual' ? 5000 : (mode === 'Hybrid' ? 2500 : 800 + (i % 10) * 100);
    const currentRegistrations = Math.floor(maxCapacity * (0.35 + (i % 55) / 100));

    eventsData.push({
      organizerId: org.id,
      title,
      slug,
      type: eventType,
      category,
      mode,
      locationVenue: mode === 'Virtual' ? 'Online / Discord Arena' : `${cityInfo.venue}, ${cityInfo.city}`,
      city: cityInfo.city,
      startDate,
      endDate,
      duration: `${durationHours} Hours Interactive`,
      registrationDeadline,
      description: `Join us for the premier ${eventType} in ${category}, hosted by ${org.name} in ${cityInfo.city}. This competition brings together students, researchers, and aspiring founders to build production-grade solutions, compete for ${prizePool}, and showcase technical expertise to industry leaders.`,
      shortSummary: `Flagship ${mode} ${eventType} on ${category} hosted in ${cityInfo.city} with ${prizePool} and fast-track interviews.`,
      prizePool,
      perks,
      eligibilityCriteria: eligibility,
      difficultyLevel: difficulty,
      targetAudience: ['College Students', 'Aspiring Engineers', 'Hackathon Enthusiasts', 'Tech Innovators'],
      careerRelevance,
      trustScore,
      trustBreakdown: {
        organizerReputation: Math.min(100, Math.floor(trustScore + 1)),
        curriculumDepth: Math.min(100, Math.floor(trustScore)),
        prizeVerification: Math.min(100, Math.floor(trustScore - 1)),
        mentorshipQuality: Math.min(100, Math.floor(trustScore + 2)),
      },
      isFeatured: i <= 25,
      maxCapacity,
      currentRegistrations,
      syllabus: [
        { phase: 'Phase 1', title: 'Ideation & Architecture Pitch', duration: 'Day 1' },
        { phase: 'Phase 2', title: 'Prototype Development & Mentorship', duration: 'Day 2' },
        { phase: 'Phase 3', title: 'Grand Jury Demo & Award Ceremony', duration: 'Final Day' },
      ],
      mentors: [
        { name: 'Dr. Arvind Sharma', role: 'Staff AI Architect', company: 'Google Cloud' },
        { name: 'Priya Sundaram', role: 'Senior Engineering Manager', company: 'Microsoft' },
        { name: 'Karthik Raja', role: 'Founding Engineer', company: 'OpenAI Guild' },
      ],
    });
  }

  // 3. Batch Insert into Neon PostgreSQL in Chunks of 250
  console.log(`📥 Ingesting ${eventsData.length} events into Neon PostgreSQL in parallel batches...`);
  const chunkSize = 250;

  for (let c = 0; c < eventsData.length; c += chunkSize) {
    const chunk = eventsData.slice(c, c + chunkSize);
    await prisma.event.createMany({
      data: chunk,
      skipDuplicates: true,
    });
    console.log(`  ✅ Ingested events ${c + 1} to ${Math.min(c + chunkSize, eventsData.length)} of ${eventsData.length}`);
  }

  const finalCount = await prisma.event.count();
  console.log(`🎉 Ingestion Complete! Total Events currently in Neon PostgreSQL: ${finalCount}`);
}

generateAndSeed2000Events()
  .catch(err => {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
