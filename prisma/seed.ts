import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SKILLS_DATA = [
  { name: 'Python', category: 'Programming', demandIndex: 1.2 },
  { name: 'Machine Learning', category: 'AI', demandIndex: 1.3 },
  { name: 'Deep Learning', category: 'AI', demandIndex: 1.4 },
  { name: 'PyTorch', category: 'AI Frameworks', demandIndex: 1.35 },
  { name: 'TypeScript', category: 'Web Development', demandIndex: 1.2 },
  { name: 'React', category: 'Frontend', demandIndex: 1.15 },
  { name: 'Next.js', category: 'Full Stack', demandIndex: 1.25 },
  { name: 'Node.js', category: 'Backend', demandIndex: 1.1 },
  { name: 'PostgreSQL', category: 'Databases', demandIndex: 1.2 },
  { name: 'Docker', category: 'DevOps', demandIndex: 1.15 },
  { name: 'Kubernetes', category: 'DevOps', demandIndex: 1.3 },
  { name: 'Solidity', category: 'Web3', demandIndex: 1.1 },
  { name: 'Cybersecurity', category: 'Security', demandIndex: 1.25 },
  { name: 'Computer Vision', category: 'AI', demandIndex: 1.3 },
  { name: 'Natural Language Processing', category: 'AI', demandIndex: 1.35 },
];

const MOCK_EVENTS_DATA = [
  {
    slug: 'allcollege-grand-hackathon-2026',
    title: 'National Collegiate Grand Offline Hackathon 2026',
    type: 'Hackathon',
    category: 'AI & Machine Learning',
    mode: 'Offline' as const,
    locationVenue: 'Hyderabad, India (Flagship Campus Arena)',
    city: 'Hyderabad',
    startDate: new Date('2026-10-15T09:00:00Z'),
    endDate: new Date('2026-10-17T18:00:00Z'),
    duration: '36 Hours Non-Stop',
    registrationDeadline: new Date('2026-10-01T23:59:59Z'),
    description: 'The flagship annual 36-hour offline collegiate hackathon bringing together 1,500+ top student innovators across the country. Tracks include Generative AI & Autonomous Agents, Healthcare Intelligence, Smart Mobility & IoT, and Web3 Decentralized Systems.',
    shortSummary: 'National flagship 36-hour offline hackathon focusing on AI, autonomous agents, and next-gen tech with ₹5,00,000+ prize pool.',
    prizePool: '₹5,00,000 + VC Funding & Cloud Credits',
    perks: ['Direct Fast-track Interviews', '₹5 Lakh Cash Prize', 'Google & AWS Cloud Credits', 'Accommodation & Food Included'],
    eligibilityCriteria: ['B.Tech / B.E / M.Tech / MCA (All Years)', 'Teams of 2 to 4 members', 'Valid College ID Required'],
    difficultyLevel: 'EliteChampionship' as const,
    targetAudience: ['Pre-final & Final Year CS/IT/AI/ECE Students', 'Hackathon Enthusiasts', 'Aspiring Founders'],
    careerRelevance: ['AI/ML Engineer', 'Founding Engineer', 'Fullstack AI Developer', 'Product Architect'],
    trustScore: 99.0,
    trustBreakdown: {
      organizerReputation: 98,
      curriculumDepth: 100,
      prizeVerification: 100,
      mentorshipQuality: 98,
    },
    isFeatured: true,
    maxCapacity: 1500,
    currentRegistrations: 1240,
    organizerName: 'AllCollegeEvent.com & Premier Tech Campus',
    collegeAffiliation: 'National Institute of Technology & Tech Campus',
  },
  {
    slug: 'ai-vision-summit-2026',
    title: 'NeurAI 2026: Deep Learning & Computer Vision Research Summit',
    type: 'Conference',
    category: 'AI & Machine Learning',
    mode: 'Hybrid' as const,
    locationVenue: 'Chennai, India & Virtual Stream',
    city: 'Chennai',
    startDate: new Date('2026-11-05T10:00:00Z'),
    endDate: new Date('2026-11-07T17:00:00Z'),
    duration: '3 Days',
    registrationDeadline: new Date('2026-10-20T23:59:59Z'),
    description: 'Premier research conference presenting cutting-edge breakthroughs in Multimodal LLMs, Vision-Language-Action (VLA) models, Diffusion Architectures, and Neuromorphic Computing.',
    shortSummary: 'Premier research symposium on multimodal deep learning with IEEE publication tracks and international keynote speakers.',
    prizePool: '₹2,00,000 Research Grant & IEEE Publication',
    perks: ['IEEE Paper Indexing', 'Research Mentorship', 'Travel Subsidy for Presenters', 'Access to NVIDIA DGX Compute'],
    eligibilityCriteria: ['Undergrad / Postgrad Students & Researchers', 'Interest in Computer Vision & Transformers'],
    difficultyLevel: 'Advanced' as const,
    targetAudience: ['CSE / Data Science Students', 'Prospective Masters/PhD Applicants', 'AI Researchers'],
    careerRelevance: ['AI Research Scientist', 'Computer Vision Specialist', 'Deep Learning Engineer'],
    trustScore: 97.0,
    trustBreakdown: {
      organizerReputation: 99,
      curriculumDepth: 98,
      prizeVerification: 95,
      mentorshipQuality: 96,
    },
    isFeatured: true,
    maxCapacity: 800,
    currentRegistrations: 680,
    organizerName: 'IEEE Computational Intelligence Society',
    collegeAffiliation: 'IIT Madras Research Park',
  },
  {
    slug: 'cloud-native-devops-bootcamp',
    title: 'Zero to Production: Kubernetes, Terraform & Cloud Architecture Bootcamp',
    type: 'Bootcamp',
    category: 'Cloud & DevOps',
    mode: 'Virtual' as const,
    locationVenue: 'Live Interactive Virtual Labs + Discord Cohort',
    city: 'Virtual',
    startDate: new Date('2026-10-25T14:00:00Z'),
    endDate: new Date('2026-11-15T18:00:00Z'),
    duration: '4 Weekends Intensive',
    registrationDeadline: new Date('2026-10-18T23:59:59Z'),
    description: 'Master enterprise-scale cloud infrastructure with hands-on labs covering Kubernetes cluster orchestration, GitOps CI/CD with ArgoCD, Infrastructure as Code with Terraform, and Prometheus monitoring.',
    shortSummary: '4-week intensive hands-on cloud native engineering bootcamp with CKA-aligned certification curriculum.',
    prizePool: 'Free CNCF Certification Vouchers ($395 Value each)',
    perks: ['CKA Exam Voucher for Top 15', 'Production Cloud Sandbox', 'Resume Review by AWS Engineers'],
    eligibilityCriteria: ['2nd to 4th Year Engineering Students', 'Basic Linux & Docker familiarity'],
    difficultyLevel: 'Intermediate' as const,
    targetAudience: ['Cloud Aspirants', 'Backend & DevOps Engineers', 'Infrastructure Enthusiasts'],
    careerRelevance: ['Cloud DevOps Engineer', 'Site Reliability Engineer (SRE)', 'Platform Engineer'],
    trustScore: 95.0,
    trustBreakdown: {
      organizerReputation: 96,
      curriculumDepth: 97,
      prizeVerification: 94,
      mentorshipQuality: 93,
    },
    isFeatured: false,
    maxCapacity: 500,
    currentRegistrations: 412,
    organizerName: 'Cloud Native Computing Community',
    collegeAffiliation: 'BITS Pilani',
  }
];

async function main() {
  console.log('🌱 Starting PostgreSQL database seed...');

  // 1. Seed Skills Taxonomy
  console.log('Upserting skills taxonomy...');
  for (const skill of SKILLS_DATA) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category, demandIndex: skill.demandIndex },
      create: skill,
    });
  }

  // 2. Seed Default Demo Student User
  console.log('Upserting demo student profile...');
  const student = await prisma.user.upsert({
    where: { email: 'visagan@college.edu' },
    update: {},
    create: {
      email: 'visagan@college.edu',
      fullName: 'Visagan A C',
      role: 'STUDENT',
      collegeName: 'National Institute of Technology',
      department: 'Computer Science & Engineering',
      yearOfStudy: 3,
      cgpa: 8.92,
      locationCity: 'Chennai',
      locationState: 'Tamil Nadu',
      preferredMode: 'Hybrid',
      careerGoals: ['AI Systems Engineer', 'Full Stack AI Architect', 'Deep Learning Specialist'],
      targetCompanies: ['Google DeepMind', 'Microsoft Research', 'OpenAI', 'NVIDIA'],
    },
  });

  // 3. Seed Events
  console.log('Upserting events...');
  for (const eventData of MOCK_EVENTS_DATA) {
    const { organizerName, collegeAffiliation, ...restEvent } = eventData;

    // Create organizer user & profile if needed
    const organizerUser = await prisma.user.upsert({
      where: { email: `contact@${eventData.slug}.org` },
      update: {},
      create: {
        email: `contact@${eventData.slug}.org`,
        fullName: organizerName,
        role: 'ORGANIZER',
        collegeName: collegeAffiliation,
      },
    });

    const organizer = await prisma.organizer.upsert({
      where: { userId: organizerUser.id },
      update: {},
      create: {
        userId: organizerUser.id,
        organizationName: organizerName,
        collegeAffiliation: collegeAffiliation,
        isVerified: true,
        trustReputationScore: eventData.trustScore,
        totalEventsHosted: 12,
      },
    });

    await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: {
        ...restEvent,
        organizerId: organizer.id,
      },
      create: {
        ...restEvent,
        organizerId: organizer.id,
      },
    });
  }

  console.log('✅ PostgreSQL database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding PostgreSQL database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
