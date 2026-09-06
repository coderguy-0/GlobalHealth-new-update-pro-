import { 
  CommunityUserProfile, 
  CommunityPostItem, 
  CommunityGroup, 
  CommunityEvent, 
  Conversation, 
  CommunityNotificationItem, 
  ModerationReportItem 
} from './CommunityTypes';

export const CURRENT_USER: CommunityUserProfile = {
  id: 'user-current',
  username: 'md_rashid',
  displayName: 'MD Rashid Hussain',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
  role: 'member',
  roleLabel: 'Health & Medical Enthusiast',
  isVerified: true,
  bio: 'Passionate about evidence-based health science, clinical biochemistry, preventative nutrition, and fitness longevity. Always learning and sharing insights.',
  location: 'Global / Virtual Hub',
  joinedDate: 'January 2026',
  reputationPoints: 1480,
  followersCount: 342,
  followingCount: 189,
  postsCount: 28,
  badges: [
    { id: 'b1', name: 'Knowledge Sharer', icon: '🎓', description: 'Contributed 25+ evidence-grounded health insights' },
    { id: 'b2', name: 'Helpful Member', icon: '🏅', description: 'Received 100+ helpful answer votes from community' },
    { id: 'b3', name: 'Discussion Champion', icon: '🌟', description: 'Initiated top trending medical discussions' },
    { id: 'b4', name: 'Trusted Member', icon: '🛡️', description: 'Active verified profile with stellar conduct score' }
  ],
  interests: ['Cardiovascular Health', 'Preventive Medicine', 'Metabolic Health', 'Nutrition Science', 'NEET & Medical Prep', 'Exercise Physiology']
};

export const RECOMMENDED_USERS: CommunityUserProfile[] = [
  {
    id: 'user-dr-elena',
    username: 'dr_elena_cardio',
    displayName: 'Dr. Elena Rostova, MD',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    role: 'verified_doctor',
    roleLabel: 'Consultant Cardiologist & Clinical Researcher',
    isVerified: true,
    specialty: 'Cardiology & Lipidology',
    bio: 'Board-Certified Cardiologist. Dedicated to translational lipid research, ApoB optimization, endothelial biology, and evidence-informed longevity.',
    location: 'Boston, MA',
    joinedDate: 'November 2025',
    reputationPoints: 4890,
    followersCount: 14200,
    followingCount: 215,
    postsCount: 114,
    isFollowing: true,
    badges: [
      { id: 'b-doc', name: 'Verified Physician', icon: '🩺', description: 'Verified Medical Doctor license & credentials' },
      { id: 'b-top', name: 'Top Contributor', icon: '🏆', description: 'Top 1% rated medical answers globally' }
    ],
    interests: ['Lipidology', 'Hypertension', 'Endothelial Health', 'Zone 2 Cardio']
  },
  {
    id: 'user-dr-julian',
    username: 'dr_julian_endo',
    displayName: 'Dr. Julian Croft, MD, PhD',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
    coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
    role: 'verified_doctor',
    roleLabel: 'Endocrinologist & Metabolic Researcher',
    isVerified: true,
    specialty: 'Endocrinology & CGM Research',
    bio: 'Translational endocrinologist studying postprandial glucose dynamics, insulin sensitivity mechanisms, and GLP-1 pharmacology.',
    location: 'London, UK',
    joinedDate: 'December 2025',
    reputationPoints: 3950,
    followersCount: 9800,
    followingCount: 180,
    postsCount: 86,
    isFollowing: false,
    badges: [
      { id: 'b-doc', name: 'Verified Physician', icon: '🩺', description: 'Verified Medical Doctor license & credentials' },
      { id: 'b-sci', name: 'Science Pioneer', icon: '🔬', description: 'Published peer-reviewed metabolic trials' }
    ],
    interests: ['Type 2 Diabetes', 'Insulin Resistance', 'CGM Biofeedback', 'Thyroid']
  },
  {
    id: 'user-sarah-rd',
    username: 'sarah_rd_nutrition',
    displayName: 'Sarah Chen, MS, RD',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
    role: 'health_educator',
    roleLabel: 'Clinical Dietitian & Gut Health Specialist',
    isVerified: true,
    specialty: 'Clinical Nutrition & Microbiome',
    bio: 'Clinical Dietitian specializing in high-diversity gut microbiome protocols, Mediterranean-DASH synergy, and evidence-based meal timing.',
    location: 'San Francisco, CA',
    joinedDate: 'January 2026',
    reputationPoints: 3120,
    followersCount: 8400,
    followingCount: 290,
    postsCount: 92,
    isFollowing: false,
    badges: [
      { id: 'b-rd', name: 'Registered Dietitian', icon: '🥗', description: 'Certified Clinical Dietetic Specialist' },
      { id: 'b-help', name: 'Community Helper', icon: '💡', description: 'Created 40+ personalized meal frameworks' }
    ],
    interests: ['Microbiome Diversity', 'Polyphenols', 'Anti-Inflammatory Diets', 'Fiber Protocols']
  },
  {
    id: 'user-marcus-physio',
    username: 'marcus_vance_dpt',
    displayName: 'Dr. Marcus Vance, DPT, CSCS',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    role: 'health_educator',
    roleLabel: 'Physical Therapist & Performance Specialist',
    isVerified: true,
    specialty: 'Orthopedics & Kinetic Rehabilitation',
    bio: 'Doctor of Physical Therapy. Passionate about joint longevity, spine mechanics, zone-2 training protocols, and injury prevention for all ages.',
    location: 'Denver, CO',
    joinedDate: 'February 2026',
    reputationPoints: 2450,
    followersCount: 6200,
    followingCount: 140,
    postsCount: 64,
    isFollowing: true,
    badges: [
      { id: 'b-dpt', name: 'Rehab Specialist', icon: '🏃', description: 'Certified Physical Therapist & Strength Coach' }
    ],
    interests: ['Spine Mechanics', 'Zone 2 Cardio', 'Tendon Recovery', 'Mobility']
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPostItem[] = [
  {
    id: 'post-1',
    author: RECOMMENDED_USERS[0], // Dr. Elena Rostova
    postType: 'announcement',
    title: 'Clinical Research Breakthrough: Why ApoB Is the True Arbiter of Arterial Plaque Risk Over Standard LDL-C',
    content: `Cardiovascular disease prevention is experiencing a paradigm shift. For decades, routine checkups looked primarily at standard LDL-C (cholesterol weight). However, in patients with insulin resistance, elevated triglycerides, or metabolic syndrome, LDL particles tend to be smaller and denser.

Key Clinical Takeaway:
Every single atherogenic particle (VLDL, IDL, and LDL) carries exactly one molecule of Apolipoprotein B (ApoB-100). Therefore, measuring ApoB directly reflects the exact particle count penetrating the endothelial vascular wall.

Recommended Clinical Target:
• Moderate Risk: ApoB < 80 mg/dL
• High Risk / Established CAD: ApoB < 55–65 mg/dL

Have you discussed ordering an ApoB and Lp(a) panel with your primary physician? Let's discuss your experiences below!`,
    category: 'Cardiovascular Research',
    tags: ['ApoB', 'Cardiology', 'Lipidology', 'PreventiveHealth', 'Longevity'],
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
        title: 'Atherogenic Particle Penetration Diagram'
      }
    ],
    likesCount: 342,
    commentsCount: 48,
    sharesCount: 89,
    viewsCount: 4520,
    isLiked: true,
    isSaved: true,
    isPinned: true,
    visibility: 'everyone',
    timestamp: '2 hours ago',
    comments: [
      {
        id: 'c1-1',
        authorId: 'user-dr-julian',
        authorName: 'Dr. Julian Croft, MD',
        authorAvatar: RECOMMENDED_USERS[1].avatar,
        authorRole: 'verified_doctor',
        authorSpecialty: 'Endocrinology',
        isVerified: true,
        content: 'Completely agree, Elena! In diabetic dyslipidemia, LDL-C often appears deceptively normal (e.g. 95 mg/dL) while ApoB is sky-high at 125 mg/dL due to small dense LDL. Excellent summary.',
        timestamp: '1 hour ago',
        likes: 42,
        isLiked: true,
        isBestAnswer: true
      },
      {
        id: 'c1-2',
        authorId: 'user-current',
        authorName: 'MD Rashid Hussain',
        authorAvatar: CURRENT_USER.avatar,
        authorRole: 'member',
        isVerified: true,
        content: 'Thank you Dr. Elena! I recently requested an ApoB test alongside my fasting lipid profile and the clarity it gave my cardiologist was night and day compared to standard LDL-C alone.',
        timestamp: '35 min ago',
        likes: 18,
        isLiked: false
      }
    ]
  },
  {
    id: 'post-2',
    author: CURRENT_USER,
    postType: 'question',
    title: 'What are the best evidence-based morning routines for stabilizing fasting blood sugar spikes (Dawn Phenomenon)?',
    content: `I have been analyzing continuous glucose monitor (CGM) trends in our community and noticed morning fasting spikes (the classic Dawn Phenomenon driven by morning cortisol and growth hormone surges). 

For those managing pre-diabetes or type 2 diabetes:
1. What dietary breakfast sequencing (protein/fiber first) has worked best for you?
2. Has a 10-minute light walk immediately after waking helped blunt the hepatic glucose dump?

Looking forward to hearing peer and clinical experiences!`,
    category: 'Diabetes & Metabolism',
    tags: ['BloodSugar', 'DiabetesSupport', 'CGM', 'MorningRoutine', 'Metabolism'],
    likesCount: 184,
    commentsCount: 32,
    sharesCount: 24,
    viewsCount: 2980,
    isLiked: false,
    isSaved: false,
    visibility: 'everyone',
    timestamp: '4 hours ago',
    comments: [
      {
        id: 'c2-1',
        authorId: 'user-sarah-rd',
        authorName: 'Sarah Chen, MS, RD',
        authorAvatar: RECOMMENDED_USERS[2].avatar,
        authorRole: 'health_educator',
        authorSpecialty: 'Clinical Dietitian',
        isVerified: true,
        content: '🏆 Clinical Strategy: 1) Prioritize a savory protein & fiber breakfast (e.g., 2 pasture-raised eggs with sautéed spinach and avocado) instead of refined grains or fruit smoothies. 2) 1-2 tablespoons of unfiltered apple cider vinegar in 250ml warm water before breakfast can blunt postprandial glucose by up to 20-30% by delaying gastric emptying.',
        timestamp: '3 hours ago',
        likes: 64,
        isLiked: true,
        isBestAnswer: true
      },
      {
        id: 'c2-2',
        authorId: 'user-marcus-physio',
        authorName: 'Dr. Marcus Vance, DPT',
        authorAvatar: RECOMMENDED_USERS[3].avatar,
        authorRole: 'health_educator',
        authorSpecialty: 'Physical Therapy',
        isVerified: true,
        content: 'A light 10-15 minute walk or soleus pushups (seated calf raises) activates non-insulin-dependent GLUT4 translocation directly into working skeletal muscle, absorbing circulating glucose rapidly!',
        timestamp: '2 hours ago',
        likes: 38,
        isLiked: false
      }
    ]
  },
  {
    id: 'post-3',
    author: RECOMMENDED_USERS[2], // Sarah Chen, RD
    postType: 'poll',
    title: 'Community Poll: How many daily servings of diverse fermented probiotic foods do you consume?',
    content: `Recent Stanford microbiome trials published in Cell Host & Microbe demonstrated that consuming 4 to 6 servings of live-microbe fermented foods daily significantly reduced 19 systemic inflammatory markers (including IL-6 and TNF-α) while expanding gut species richness.

Where are you currently at with fermented foods (kefir, plain greek yogurt, kimchi, sauerkraut, tempeh, natto)?`,
    category: 'Nutrition & Gut Health',
    tags: ['GutHealth', 'Microbiome', 'FermentedFoods', 'Inflammation', 'NutritionPoll'],
    poll: {
      question: 'How many servings of fermented foods do you eat on average per day?',
      options: [
        { id: 'opt-1', text: '0 servings (None or rarely)', votes: 84 },
        { id: 'opt-2', text: '1–2 servings (Yogurt or occasional kefir)', votes: 142 },
        { id: 'opt-3', text: '3–4 servings (Daily kefir, kimchi or sauerkraut)', votes: 96 },
        { id: 'opt-4', text: '5+ servings (Targeting maximum microbiome diversity)', votes: 38 }
      ],
      totalVotes: 360,
      userVotedOptionId: 'opt-2',
      endsIn: '3 days remaining'
    },
    likesCount: 215,
    commentsCount: 42,
    sharesCount: 31,
    viewsCount: 3800,
    isLiked: true,
    isSaved: false,
    visibility: 'everyone',
    timestamp: '7 hours ago',
    comments: [
      {
        id: 'c3-1',
        authorId: 'user-current',
        authorName: 'MD Rashid Hussain',
        authorAvatar: CURRENT_USER.avatar,
        authorRole: 'member',
        isVerified: true,
        content: 'Added homemade water kefir and kimchi to my lunch everyday. My digestion and resting HRV scores have noticeably improved over the past month!',
        timestamp: '5 hours ago',
        likes: 19,
        isLiked: false
      }
    ]
  },
  {
    id: 'post-4',
    author: RECOMMENDED_USERS[3], // Dr. Marcus Vance
    postType: 'achievement',
    title: 'Community Milestone: 100 Consecutive Days of 8,000+ Steps & Zone 2 Cardiovascular Conditioning',
    content: `Proud to share a practical training milestone! Over 100 members in our "Daily Movement & Longevity Circle" just completed their 100-day 8,000 daily steps challenge combined with 150 minutes of Zone 2 nasal-breathing cardio per week.

Key Aggregate Biometric Results:
• Average resting heart rate decreased by 4.2 BPM
• Fasting systolic blood pressure lowered by an average of 6 mmHg
• Improved sleep efficiency and daytime cognitive endurance

Remember: Consistency trumps intensity every single time. Who is joining our next 30-day cohort?`,
    category: 'Fitness & Physical Therapy',
    tags: ['Zone2Cardio', 'Longevity', 'DailyMovement', 'HealthMilestone', 'Habits'],
    achievementDetails: {
      badgeName: 'Centurion Pacer',
      icon: '🏃‍♂️',
      milestone: '100-Day Consistent Mobility & Cardio Base'
    },
    attachments: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
        title: 'Zone 2 Aerobic Heart Rate Spectrum'
      }
    ],
    likesCount: 498,
    commentsCount: 67,
    sharesCount: 52,
    viewsCount: 6200,
    isLiked: true,
    isSaved: true,
    visibility: 'everyone',
    timestamp: '1 day ago',
    comments: []
  },
  {
    id: 'post-5',
    author: RECOMMENDED_USERS[1], // Dr. Julian Croft
    postType: 'document',
    title: 'Clinical Guide: Comprehensive Drug Interaction & Food Safety Matrix for Common Prescriptions',
    content: `I have compiled a comprehensive PDF reference sheet outlining dangerous nutrient-drug antagonisms (e.g. Grapefruit with Statins/Calcium Channel Blockers, Vitamin K with Warfarin, Dairy/Calcium with Levothyroxine and Tetracyclines, Tyramine with MAOIs).

Download the evidence sheet below and share it with your family and caregivers!`,
    category: 'Medicines & Pharmacology',
    tags: ['DrugInteractions', 'Pharmacology', 'MedicationSafety', 'ClinicalGuide'],
    attachments: [
      {
        type: 'document',
        url: '#',
        title: '2026_Clinical_Pharmacological_Interaction_Matrix.pdf',
        fileSize: '2.4 MB • Peer-Reviewed Medical Matrix'
      }
    ],
    likesCount: 512,
    commentsCount: 59,
    sharesCount: 140,
    viewsCount: 7800,
    isLiked: true,
    isSaved: true,
    visibility: 'everyone',
    timestamp: '2 days ago',
    comments: []
  }
];

export const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: 'grp-diabetes',
    name: 'Diabetes & Metabolic Wellness Circle',
    handle: 'diabetes-metabolism',
    category: 'Endocrinology & Chronic Care',
    description: 'Support and clinical discussions for Type 1, Type 2, and Pre-diabetes. CGM trends, insulin sensitivity, low-glycemic cooking, and lifestyle medicine.',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    icon: '🩺',
    memberCount: 24800,
    postsCount: 1420,
    privacy: 'public',
    activityLevel: 'Very Active',
    isJoined: true,
    rules: [
      'Evidence-first discussions: Cite reliable sources when giving health context.',
      'No prescriptive medical directives: Always advise consulting personal physicians.',
      'Be encouraging, empathetic, and respectful to all journey stages.',
      'Strict zero tolerance for commercial supplements spam.'
    ],
    moderators: [
      { name: 'Dr. Julian Croft, MD', avatar: RECOMMENDED_USERS[1].avatar, role: 'Lead Endocrinologist' },
      { name: 'Sarah Chen, MS, RD', avatar: RECOMMENDED_USERS[2].avatar, role: 'Clinical Dietitian' }
    ],
    recentTopics: [
      'Managing the Dawn Phenomenon naturally',
      'Continuous Glucose Monitor calibration tips',
      'Fiber loading protocols before carbohydrate meals'
    ]
  },
  {
    id: 'grp-cardio',
    name: 'Cardiology, BP & Heart Longevity',
    handle: 'cardio-longevity',
    category: 'Cardiovascular Care',
    description: 'Dedicated to hypertension management, ApoB/lipidology optimization, arterial compliance, endothelial nitric oxide, and heart-healthy lifestyle habits.',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
    icon: '❤️',
    memberCount: 19400,
    postsCount: 980,
    privacy: 'public',
    activityLevel: 'Very Active',
    isJoined: true,
    rules: [
      'Prioritize AHA/ESC guideline-aligned information.',
      'Emergency symptoms (chest pain, shortness of breath) must immediately dial 911/112.',
      'Respect peer privacy and anonymize medical test uploads.'
    ],
    moderators: [
      { name: 'Dr. Elena Rostova, MD', avatar: RECOMMENDED_USERS[0].avatar, role: 'Cardiologist & Researcher' }
    ],
    recentTopics: [
      'ApoB vs LDL-C: Understanding your bloodwork',
      'Sodium-to-Potassium dietary ratios for stroke prevention',
      'Best home blood pressure cuff validation techniques'
    ]
  },
  {
    id: 'grp-nutrition',
    name: 'Clinical Nutrition & Gut Microbiome',
    handle: 'nutrition-gut-health',
    category: 'Dietary Science & Microbiome',
    description: 'Explore fermented foods, polyphenols, fiber diversity, Mediterranean-DASH meal plans, and evidence-backed nutritional biochemistry.',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=80',
    icon: '🥗',
    memberCount: 31200,
    postsCount: 2150,
    privacy: 'public',
    activityLevel: 'Very Active',
    isJoined: false,
    rules: [
      'Focus on whole foods and dietary patterns over restrictive fad diets.',
      'Disclose personal recipe modifications clearly.',
      'Maintain positive, science-driven discussions.'
    ],
    moderators: [
      { name: 'Sarah Chen, MS, RD', avatar: RECOMMENDED_USERS[2].avatar, role: 'Lead Dietitian' }
    ],
    recentTopics: [
      'Fermented foods challenge for IL-6 reduction',
      'High-polyphenol extra virgin olive oil criteria',
      'Prebiotic soluble vs insoluble fiber balancing'
    ]
  },
  {
    id: 'grp-neet',
    name: 'Medical Students & NEET/USMLE Prep',
    handle: 'med-students-neet-prep',
    category: 'Medical Education & Academic',
    description: 'High-yield clinical physiology, pharmacology mnemonics, anatomical dissections, clinical case reviews, and collaborative exam strategy discussions.',
    coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1000&q=80',
    icon: '📚',
    memberCount: 42100,
    postsCount: 3890,
    privacy: 'public',
    activityLevel: 'Very Active',
    isJoined: true,
    rules: [
      'Focus on high-yield clinical reasoning and concept clarity.',
      'No piracy of copyrighted test bank materials.',
      'Support fellow students with constructive feedback and encouragement.'
    ],
    moderators: [
      { name: 'MD Rashid Hussain', avatar: CURRENT_USER.avatar, role: 'Community Moderator' }
    ],
    recentTopics: [
      'Renal tubular electrolyte transport made simple',
      'Autonomic nervous system pharmacology cheat-sheet',
      'Anti-arrhythmic drugs Class I to IV mechanisms'
    ]
  },
  {
    id: 'grp-mobility',
    name: 'Mobility, Spine & Joint Longevity',
    handle: 'mobility-joint-health',
    category: 'Orthopedics & Physical Therapy',
    description: 'Evidence-based physical therapy, posture restoration, desk-worker spine resilience, and active injury rehabilitation techniques.',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    icon: '🏃',
    memberCount: 16500,
    postsCount: 740,
    privacy: 'public',
    activityLevel: 'Active',
    isJoined: false,
    rules: [
      'Demonstrations must prioritize safe biomechanics.',
      'Acute injuries require immediate in-person clinical assessment.'
    ],
    moderators: [
      { name: 'Dr. Marcus Vance, DPT', avatar: RECOMMENDED_USERS[3].avatar, role: 'Orthopedic PT' }
    ],
    recentTopics: [
      'Thoracic spine extension for desk workers',
      'Patellofemoral knee tracking exercises',
      'Rotator cuff strengthening without impingement'
    ]
  },
  {
    id: 'grp-mental',
    name: 'Mindful Wellbeing & Sleep Hygiene',
    handle: 'mental-wellbeing-sleep',
    category: 'Mental Health & Neuroscience',
    description: 'Circadian rhythm optimization, slow-wave sleep architecture, vagus nerve stimulation, and cognitive stress resilience strategies.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
    icon: '🧘',
    memberCount: 21000,
    postsCount: 1100,
    privacy: 'public',
    activityLevel: 'Active',
    isJoined: false,
    rules: [
      'Safe, compassionate, non-judgmental space.',
      'Emergency crisis resources are pinned at top of room.'
    ],
    moderators: [
      { name: 'Dr. Elena Rostova, MD', avatar: RECOMMENDED_USERS[0].avatar, role: 'Physician Liaison' }
    ],
    recentTopics: [
      'Morning sunlight exposure for melatonin timing',
      'Box breathing for acute autonomic downregulation',
      'Magnesium glycinate vs L-threonate for sleep quality'
    ]
  }
];

export const COMMUNITY_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'Live Masterclass: Decoding ApoB, Lp(a) & Advanced Cardiovascular Blood Panels',
    hostName: 'Dr. Elena Rostova, MD',
    hostAvatar: RECOMMENDED_USERS[0].avatar,
    hostSpecialty: 'Preventative Cardiology Specialist',
    category: 'Cardiology Webinar',
    date: 'August 24, 2026',
    time: '6:00 PM - 7:30 PM EST',
    duration: '90 Minutes',
    type: 'Online Webinar',
    description: 'Join Dr. Elena Rostova for an in-depth clinical breakdown of modern atherogenic lipid biomarkers, plaque regression trials, and actionable dietary strategies.',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
    attendeesCount: 1420,
    rsvpStatus: 'going',
    linkUrl: '#'
  },
  {
    id: 'evt-2',
    title: 'Live Interactive Q&A: Optimizing the Gut Microbiome for Immune Resilience',
    hostName: 'Sarah Chen, MS, RD',
    hostAvatar: RECOMMENDED_USERS[2].avatar,
    hostSpecialty: 'Clinical Dietitian & Microbiome Researcher',
    category: 'Nutrition & Gut Health',
    date: 'August 27, 2026',
    time: '5:00 PM - 6:00 PM EST',
    duration: '60 Minutes',
    type: 'Live Q&A',
    description: 'Bring your questions regarding probiotic fermented foods, SCFA production, eliminating bloating, and fiber diversity protocols.',
    coverImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1000&q=80',
    attendeesCount: 890,
    rsvpStatus: 'interested',
    linkUrl: '#'
  },
  {
    id: 'evt-3',
    title: 'Hands-On Workshop: Desk Ergonomics, Spine Mobility & Posture Mechanics',
    hostName: 'Dr. Marcus Vance, DPT',
    hostAvatar: RECOMMENDED_USERS[3].avatar,
    hostSpecialty: 'Doctor of Physical Therapy',
    category: 'Physical Therapy Workshop',
    date: 'August 30, 2026',
    time: '12:00 PM - 1:00 PM EST',
    duration: '60 Minutes',
    type: 'Workshop',
    description: 'Learn practical 5-minute movement snacks and ergonomic adjustments to alleviate chronic neck tension, lumbar stiffness, and hip tightness.',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    attendeesCount: 650,
    rsvpStatus: 'none',
    linkUrl: '#'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participant: RECOMMENDED_USERS[0], // Dr. Elena Rostova
    lastMessage: 'Great question on the ApoB ratio! Feel free to review the clinical trial summary I posted.',
    lastMessageTime: '25 min ago',
    unreadCount: 1,
    messages: [
      {
        id: 'm1-1',
        senderId: 'user-dr-elena',
        text: 'Hello Rashid! Thank you for your thoughtful contributions to the Cardiology discussion group.',
        timestamp: '10:15 AM',
        isRead: true
      },
      {
        id: 'm1-2',
        senderId: 'user-current',
        text: 'Thank you Dr. Elena! Your explanations on endothelial wall shear stress and LDL particle subfractions have been incredibly helpful.',
        timestamp: '10:20 AM',
        isRead: true
      },
      {
        id: 'm1-3',
        senderId: 'user-dr-elena',
        text: 'Great question on the ApoB ratio! Feel free to review the clinical trial summary I posted.',
        timestamp: '10:45 AM',
        isRead: false
      }
    ]
  },
  {
    id: 'conv-2',
    participant: RECOMMENDED_USERS[2], // Sarah Chen
    lastMessage: 'The homemade kefir fermentation guide is ready! I can send over the PDF matrix.',
    lastMessageTime: '2 hours ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm2-1',
        senderId: 'user-sarah-rd',
        text: 'Hi Rashid! Let me know if you would like me to review the prebiotic fiber balance in your meal outline.',
        timestamp: 'Yesterday',
        isRead: true
      },
      {
        id: 'm2-2',
        senderId: 'user-current',
        text: 'That would be wonderful Sarah! Appreciate your guidance.',
        timestamp: 'Yesterday',
        isRead: true
      },
      {
        id: 'm2-3',
        senderId: 'user-sarah-rd',
        text: 'The homemade kefir fermentation guide is ready! I can send over the PDF matrix.',
        timestamp: '2 hours ago',
        isRead: true
      }
    ]
  },
  {
    id: 'conv-3',
    participant: RECOMMENDED_USERS[1], // Dr. Julian Croft
    lastMessage: 'Let us connect on the upcoming CGM metabolic study discussion.',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm3-1',
        senderId: 'user-dr-julian',
        text: 'Let us connect on the upcoming CGM metabolic study discussion.',
        timestamp: '1 day ago',
        isRead: true
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: CommunityNotificationItem[] = [
  {
    id: 'notif-1',
    type: 'like',
    actorName: 'Dr. Elena Rostova, MD',
    actorAvatar: RECOMMENDED_USERS[0].avatar,
    title: 'Liked your comment',
    description: 'Dr. Elena Rostova liked your reply on "ApoB Clinical Plaque Risk Breakdown".',
    timestamp: '15 min ago',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'comment',
    actorName: 'Sarah Chen, MS, RD',
    actorAvatar: RECOMMENDED_USERS[2].avatar,
    title: 'Awarded Best Answer 🏆',
    description: 'Sarah Chen selected your response as the Best Answer on "Dawn Phenomenon Blood Sugar Stabilization".',
    timestamp: '1 hour ago',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'event',
    actorName: 'Cardiology Circle',
    actorAvatar: RECOMMENDED_USERS[0].avatar,
    title: 'Upcoming Event Reminder',
    description: 'Webinar "Decoding ApoB & Advanced Blood Panels" starts in 4 days.',
    timestamp: '3 hours ago',
    isRead: true
  },
  {
    id: 'notif-4',
    type: 'follow',
    actorName: 'Dr. Marcus Vance, DPT',
    actorAvatar: RECOMMENDED_USERS[3].avatar,
    title: 'New Follower',
    description: 'Dr. Marcus Vance started following your health insights.',
    timestamp: '1 day ago',
    isRead: true
  },
  {
    id: 'notif-5',
    type: 'system',
    actorName: 'Community Security',
    actorAvatar: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=256&q=80',
    title: 'Reputation Milestone Achieved',
    description: 'Congratulations! You reached 1,480 reputation points and unlocked the "Discussion Champion" badge.',
    timestamp: '2 days ago',
    isRead: true
  }
];

export const INITIAL_MODERATION_REPORTS: ModerationReportItem[] = [
  {
    id: 'rep-1',
    reportedUser: 'unverified_supplements_99',
    reporter: 'Dr. Elena Rostova',
    reason: 'Medical Misinformation / Unverified Cure Claims',
    details: 'Claimed a private herbal tonic reverses Stage 4 kidney disease without medical consultation.',
    timestamp: '45 min ago',
    status: 'pending',
    severity: 'high',
    contentSnippet: 'Take 3 drops of this root oil twice daily to cure chronic renal failure in 2 weeks...'
  },
  {
    id: 'rep-2',
    reportedUser: 'crypto_health_bot',
    reporter: 'MD Rashid Hussain',
    reason: 'Spam & External Promotional Links',
    details: 'Repeated promotional crypto bot links posted under 12 different discussion threads.',
    timestamp: '3 hours ago',
    status: 'pending',
    severity: 'critical',
    contentSnippet: 'Earn $500 daily by joining our secret health investment telegram link below...'
  },
  {
    id: 'rep-3',
    reportedUser: 'argumentative_user_4',
    reporter: 'Community Safety Automod',
    reason: 'Harassment & Hostile Language',
    details: 'Violated respectful discussion guidelines in the Diabetes Support room.',
    timestamp: '6 hours ago',
    status: 'resolved',
    severity: 'medium',
    contentSnippet: 'User issued standard 24-hour cooling warning after aggressive comment flags.'
  }
];

export const LEADERBOARD_USERS = [
  { rank: 1, name: 'Dr. Elena Rostova, MD', avatar: RECOMMENDED_USERS[0].avatar, points: 4890, answers: 114, specialty: 'Cardiology' },
  { rank: 2, name: 'Dr. Julian Croft, MD', avatar: RECOMMENDED_USERS[1].avatar, points: 3950, answers: 86, specialty: 'Endocrinology' },
  { rank: 3, name: 'Sarah Chen, MS, RD', avatar: RECOMMENDED_USERS[2].avatar, points: 3120, answers: 92, specialty: 'Dietetics' },
  { rank: 4, name: 'Dr. Marcus Vance, DPT', avatar: RECOMMENDED_USERS[3].avatar, points: 2450, answers: 64, specialty: 'Physical Therapy' },
  { rank: 5, name: 'MD Rashid Hussain', avatar: CURRENT_USER.avatar, points: 1480, answers: 28, specialty: 'Health Researcher' }
];
