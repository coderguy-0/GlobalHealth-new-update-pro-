import React from 'react';
import {
  Stethoscope,
  Building2,
  MapPin,
  Pill,
  FlaskConical,
  Activity,
  Newspaper,
  Bot,
  BookOpen,
  ShieldCheck,
  Lock,
  Users,
  BrainCircuit,
  Salad,
  Dumbbell,
  HeartPulse,
  Baby,
  Accessibility,
  Heart,
  Ambulance,
  Microscope,
  Droplets,
  ClipboardList,
  Boxes,
  Landmark,
} from 'lucide-react';
import { NavigationTab } from '../../types';

/* ------------------------------------------------------------------ *
 * Homepage content model.
 *
 * Every section below consumes typed, data-driven items so the homepage
 * can later be wired to an API / database without rewriting components.
 * ------------------------------------------------------------------ */

export interface HomeActionItem {
  id: string;
  tab: NavigationTab;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const HOME_ACTIONS: HomeActionItem[] = [
  {
    id: 'act-doctors',
    tab: 'doctors',
    title: 'Find a Doctor',
    description: 'Find healthcare professionals by specialty.',
    icon: <Stethoscope className="h-5 w-5" />,
  },
  {
    id: 'act-hospitals',
    tab: 'hospitals',
    title: 'Find a Hospital',
    description: 'Discover hospitals and medical facilities.',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: 'act-map',
    tab: 'medical-map',
    title: 'Medical Map',
    description: 'Explore healthcare locations geographically.',
    icon: <MapPin className="h-5 w-5" />,
  },
  {
    id: 'act-medicines',
    tab: 'medicines',
    title: 'Explore Medicines',
    description: 'Understand medicine information and availability.',
    icon: <Pill className="h-5 w-5" />,
  },
  {
    id: 'act-tests',
    tab: 'medical-tests',
    title: 'Check Lab Tests',
    description: 'Learn about laboratory tests and their purposes.',
    icon: <FlaskConical className="h-5 w-5" />,
  },
  {
    id: 'act-diseases',
    tab: 'diseases',
    title: 'Explore Diseases',
    description: 'Understand conditions, symptoms and prevention.',
    icon: <Activity className="h-5 w-5" />,
  },
  {
    id: 'act-news',
    tab: 'news',
    title: 'Health News',
    description: 'Discover relevant healthcare updates.',
    icon: <Newspaper className="h-5 w-5" />,
  },
  {
    id: 'act-ai',
    tab: 'ai-assistant',
    title: 'Ask AI Assistant',
    description: 'Get conversational guidance and navigation support.',
    icon: <Bot className="h-5 w-5" />,
  },
];

export interface EcosystemModule {
  id: string;
  tab: NavigationTab;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const ECOSYSTEM_MODULES: EcosystemModule[] = [
  {
    id: 'eco-info',
    tab: 'diseases',
    title: 'Health Information',
    description: 'Diseases, symptoms, prevention and wellness.',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 'eco-medicines',
    tab: 'medicines',
    title: 'Medicines',
    description: 'Medicine information, categories, precautions and verified pharmacy pathways.',
    icon: <Pill className="h-5 w-5" />,
  },
  {
    id: 'eco-doctors',
    tab: 'doctors',
    title: 'Healthcare Professionals',
    description: 'Find doctors and specialists.',
    icon: <Stethoscope className="h-5 w-5" />,
  },
  {
    id: 'eco-facilities',
    tab: 'medical-map',
    title: 'Medical Facilities',
    description: 'Hospitals, clinics, nursing homes and specialized facilities.',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    id: 'eco-tests',
    tab: 'medical-tests',
    title: 'Laboratory Tests',
    description: 'Explore tests, preparation, interpretation context and related information.',
    icon: <Microscope className="h-5 w-5" />,
  },
  {
    id: 'eco-community',
    tab: 'community',
    title: 'Community',
    description: 'Connect with healthcare-focused discussions and educational content.',
    icon: <Users className="h-5 w-5" />,
  },
];

export interface TrustPrinciple {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const TRUST_PRINCIPLES: TrustPrinciple[] = [
  {
    id: 'trust-evidence',
    title: 'Evidence-Informed',
    description: 'Present information using credible sources and transparent references where applicable.',
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: 'trust-privacy',
    title: 'Privacy-Conscious',
    description: 'Protect user information and never expose private health information unnecessarily.',
    icon: <Lock className="h-5 w-5" />,
  },
  {
    id: 'trust-human',
    title: 'Human-Centered',
    description: 'Design information so normal users can understand it without requiring medical expertise.',
    icon: <Heart className="h-5 w-5" />,
  },
  {
    id: 'trust-ai',
    title: 'Responsible AI',
    description: 'AI assists navigation, education and understanding while clearly communicating its limitations.',
    icon: <BrainCircuit className="h-5 w-5" />,
  },
];

export const AI_EXAMPLE_PROMPTS: string[] = [
  'Explain this lab test',
  'What does this medicine information mean?',
  'Find a cardiologist',
  'Help me explore diabetes information',
  'Where can I find nearby hospitals?',
];

export interface HealthTopicCard {
  id: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  tab: NavigationTab;
  icon: React.ReactNode;
}

export const HEALTH_TOPIC_CARDS: HealthTopicCard[] = [
  {
    id: 'topic-diseases',
    category: 'Diseases',
    title: 'Understand conditions and symptoms',
    description: 'Clear guides on common conditions, warning signs and when to seek care.',
    readTime: '4 min read',
    tab: 'diseases',
    icon: <Activity className="h-4.5 w-4.5" />,
  },
  {
    id: 'topic-nutrition',
    category: 'Nutrition',
    title: 'Eat well with evidence-based guidance',
    description: 'Nutrient science, balanced recipes and practical meal guidance.',
    readTime: '3 min read',
    tab: 'nutrition',
    icon: <Salad className="h-4.5 w-4.5" />,
  },
  {
    id: 'topic-fitness',
    category: 'Fitness',
    title: 'Move more, safely',
    description: 'Workouts, mobility and everyday activity guidance for all levels.',
    readTime: '5 min read',
    tab: 'wellness',
    icon: <Dumbbell className="h-4.5 w-4.5" />,
  },
  {
    id: 'topic-wellbeing',
    category: 'Mental Wellbeing',
    title: 'Support your mental wellbeing',
    description: 'Practical approaches to stress, sleep and emotional balance.',
    readTime: '4 min read',
    tab: 'wellness',
    icon: <HeartPulse className="h-4.5 w-4.5" />,
  },
  {
    id: 'topic-women',
    category: "Women's Health",
    title: 'Health across every stage of life',
    description: 'Guides on reproductive, hormonal and preventive health for women.',
    readTime: '4 min read',
    tab: 'diseases',
    icon: <Accessibility className="h-4.5 w-4.5" />,
  },
  {
    id: 'topic-children',
    category: "Children's Health",
    title: 'Help children grow healthy',
    description: 'Development, nutrition and common childhood conditions explained.',
    readTime: '3 min read',
    tab: 'diseases',
    icon: <Baby className="h-4.5 w-4.5" />,
  },
  {
    id: 'topic-senior',
    category: 'Senior Health',
    title: 'Age with confidence',
    description: 'Prevention, medication safety and quality-of-life guidance for older adults.',
    readTime: '4 min read',
    tab: 'wellness',
    icon: <Landmark className="h-4.5 w-4.5" />,
  },
  {
    id: 'topic-prevention',
    category: 'Prevention',
    title: 'Stop problems before they start',
    description: 'Screenings, vaccinations and everyday prevention basics.',
    readTime: '3 min read',
    tab: 'medical-tests',
    icon: <ShieldCheck className="h-4.5 w-4.5" />,
  },
];

export const LAB_CATEGORIES: string[] = [
  'Blood',
  'Urine',
  'Hormones',
  'Liver',
  'Kidney',
  'Heart',
  'Vitamins',
  'Imaging',
  'Microbiology',
];

export const DOCTOR_SPECIALTIES: string[] = [
  'Cardiologist',
  'Neurologist',
  'Dermatologist',
  'Gastroenterologist',
  'Pediatrician',
  'Orthopedist',
  'Endocrinologist',
  'Pulmonologist',
];

export const MAP_FACILITY_TYPES: { id: string; label: string }[] = [
  { id: 'all', label: 'All facilities' },
  { id: 'hospital', label: 'Hospitals' },
  { id: 'clinic', label: 'Clinics' },
  { id: 'emergency', label: 'Emergency care' },
];

export const MEDICINE_CATEGORIES: string[] = [
  'Cardiology',
  'Primary Care',
  'Neurology',
  'Pulmonology',
  'Gastroenterology',
  'Nephrology',
  'Orthopedics',
  'Specialist Care',
];

export const COMMUNITY_DISTINCTIONS: { label: string; description: string; icon: React.ReactNode }[] = [
  {
    label: 'Public educational content',
    description: 'Written for everyone to read without an account.',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    label: 'Authenticated user content',
    description: 'Shared by registered members and clearly attributed.',
    icon: <Users className="h-4 w-4" />,
  },
  {
    label: 'Private personal health information',
    description: 'Never published — kept in your private health records.',
    icon: <Lock className="h-4 w-4" />,
  },
];

export const EMERGENCY_RESOURCES = {
  usCanada: '911',
  euUk: '112 / 999',
  india: '112 / 102',
  crisisLine: '988',
};

export const AMBULANCE_ICON = <Ambulance className="h-4 w-4" />;
export const DROPLETS_ICON = <Droplets className="h-4 w-4" />;
export const CLIPBOARD_ICON = <ClipboardList className="h-4 w-4" />;
export const BOXES_ICON = <Boxes className="h-4 w-4" />;
