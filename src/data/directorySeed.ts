// Small curated seed arrays (sample recipes, hospitals and doctors).
//
// Kept out of healthData.ts so that lightweight, eagerly-loaded consumers
// (the hero search and the homepage doctors preview) can use them without
// importing healthData, which re-exports the multi-megabyte disease,
// medicine and lab-test catalogs.
import { Recipe, Hospital, Doctor } from '../types';

export const RECIPES: Recipe[] = [
  {
    id: 'rec-1',
    title: 'Mediterranean Quinoa & Wild Salmon Power Bowl',
    description: 'Nutrient-rich grilled wild salmon paired with fluffy quinoa, cucumber, cherry tomatoes, Kalamata olives, and lemon-tahini dressing.',
    prepTime: '15 mins',
    cookTime: '15 mins',
    calories: 480,
    protein: '36g',
    carbs: '42g',
    fats: '18g',
    dietTags: ['Heart-Healthy', 'Diabetic-Friendly', 'Gluten-Free', 'Low-Sodium'],
    ingredients: [
      '6 oz Wild Atlantic Salmon fillet',
      '1 cup cooked organic quinoa',
      '1 cup cherry tomatoes, halved',
      '1/2 English cucumber, diced',
      '2 tbsp Kalamata olives',
      '1 tbsp extra virgin olive oil',
      '1 tbsp lemon juice & fresh dill'
    ],
    instructions: [
      'Season salmon fillet with olive oil, sea salt, cracked black pepper, and lemon juice.',
      'Pan-sear salmon in a non-stick skillet over medium-high heat for 4-5 minutes per side until flaky.',
      'Fluff pre-cooked quinoa and place at the base of your bowl.',
      'Arrange sliced cucumber, halved tomatoes, olives, and grilled salmon on top.',
      'Drizzle with fresh lemon-tahini dressing and garnish with dill.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rec-2',
    title: 'Avocado & Spinach Anti-Inflammatory Green Smoothie',
    description: 'A creamy, high-fiber, low-sugar smoothie featuring frozen spinach, avocado, ginger root, green apple, and chia seeds.',
    prepTime: '5 mins',
    cookTime: '0 mins',
    calories: 260,
    protein: '8g',
    carbs: '28g',
    fats: '14g',
    dietTags: ['Heart-Healthy', 'Vegan', 'Gluten-Free', 'Diabetic-Friendly'],
    ingredients: [
      '2 cups fresh baby spinach leaves',
      '1/2 ripe avocado',
      '1/2 Granny Smith green apple, cored',
      '1/2 inch fresh ginger root',
      '1 tbsp organic chia seeds',
      '1.5 cups unsweetened almond milk'
    ],
    instructions: [
      'Place almond milk and spinach into high-speed blender first.',
      'Add avocado, green apple, fresh ginger root, and chia seeds.',
      'Blend on high speed for 60 seconds until smooth and silky.',
      'Pour into a tall chilled glass and enjoy immediately.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rec-3',
    title: 'Tuscan Roasted Chickpea & Kale Salad',
    description: 'Crispy oven-roasted garlic chickpeas tossed with lacinato kale, toasted pumpkin seeds, and a zesty garlic vinaigrette.',
    prepTime: '10 mins',
    cookTime: '20 mins',
    calories: 380,
    protein: '16g',
    carbs: '48g',
    fats: '14g',
    dietTags: ['Vegan', 'Heart-Healthy', 'Gluten-Free'],
    ingredients: [
      '1 can (15 oz) organic chickpeas, rinsed & dried',
      '1 bunch lacinato kale, stems removed & chopped',
      '2 tbsp raw pumpkin seeds (pepitas)',
      '1 tbsp extra virgin olive oil',
      '1 tsp smoked paprika & garlic powder',
      '2 tbsp fresh lemon juice'
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Toss dried chickpeas with olive oil, paprika, garlic powder, and salt.',
      'Roast chickpeas on parchment paper for 20 minutes until crunchy.',
      'Massage chopped kale with a teaspoon of olive oil and lemon juice for 2 minutes until tender.',
      'Toss kale with roasted chickpeas, pumpkin seeds, and garlic dressing.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'rec-4',
    title: 'Keto Herb-Crusted Grilled Chicken Breasts',
    description: 'Juicy, low-carb grilled chicken marinated in Rosemary, Thyme, Garlic, and Cold-Pressed Olive Oil.',
    prepTime: '10 mins',
    cookTime: '12 mins',
    calories: 340,
    protein: '42g',
    carbs: '2g',
    fats: '18g',
    dietTags: ['Keto', 'Diabetic-Friendly', 'Gluten-Free', 'Low-Sodium'],
    ingredients: [
      '2 organic boneless skinless chicken breasts',
      '2 tbsp extra virgin olive oil',
      '1 tbsp fresh rosemary & thyme, finely chopped',
      '2 cloves minced garlic',
      '1/2 tsp sea salt and crushed red pepper'
    ],
    instructions: [
      'Combine olive oil, herbs, garlic, salt, and pepper in a bowl.',
      'Coat chicken breasts thoroughly and let marinate for 15 minutes.',
      'Preheat grill pan over medium-high heat.',
      'Grill chicken for 6 minutes per side until internal temperature reaches 165°F (74°C).'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80'
  }
];

export const HOSPITALS: Hospital[] = [
  {
    id: 'hosp-1',
    globalHealthId: 'GH-HOSP-AE-AB-004001',
    name: 'Cleveland Clinic Abu Dhabi',
    country: 'United Arab Emirates',
    city: 'Abu Dhabi',
    location: 'Abu Dhabi, Abu Dhabi, United Arab Emirates',
    type: 'Multi-Specialty Hospital',
    traumaLevel: 'Level I',
    verified: true,
    rating: 4.9,
    totalBeds: 400,
    icuBeds: 72,
    surgeriesPerYear: '16,000',
    specialties: ['Cardiology', 'Neurology', 'Digestive Disease', 'Eye Institute', 'Respiratory', 'Surgical Subspecialties'],
    emergencyServices: true,
    contact: '+971 800 82223',
    address: 'Al Maryah Island, Abu Dhabi, United Arab Emirates',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    description: 'Cleveland Clinic Abu Dhabi is a unique, multi-specialty hospital on Al Maryah Island. A direct extension of US-based Cleveland Clinic, offering world-class care in heart, neurological, digestive, and critical care specialties.',
    officialLegalName: 'Cleveland Clinic Abu Dhabi LLC',
    yearEstablished: 2015,
    ownership: 'Public-Private Partnership',
    hospitalNetwork: 'Cleveland Clinic Global Network',
    coordinates: { lat: '24.5002° N', lng: '54.3892° E' },
    emergencyHotline: '999 / +971 800 82223',
    mainHotline: {
      phone: '+971 800 82223',
      email: 'info@clevelandclinicabudhabi.ae',
      hours: '24/7',
      languages: 'Arabic, English'
    },
    internationalCare: {
      phone: '+971 2 659 0200',
      email: 'internationalcare@clevelandclinicabudhabi.ae',
      hours: '24/7',
      languages: 'Arabic, English, Russian, French'
    },
    operatingHours: {
      hospitalEmergency: '24 Hours / 7 Days',
      clinics: '08:00 - 20:00 (Sun - Thu)',
      radiologyLabs: '24 Hours / 7 Days'
    },
    accreditations: [
      'Joint Commission International (JCI)',
      'Magnet® Recognized Nursing Excellence',
      'Department of Health - Abu Dhabi (DOH) Gold Standard',
      'ISO 15189 Molecular Pathology'
    ],
    insurancePartners: [
      'Daman Thiqa',
      'Daman Enhanced',
      'Bupa Global',
      'Cigna International',
      'Aetna Global',
      'Allianz Care'
    ]
  },
  {
    id: 'hosp-2',
    globalHealthId: 'GH-HOSP-SG-SG-005001',
    name: 'Singapore General Hospital (SGH)',
    country: 'Singapore',
    city: 'Singapore',
    location: 'Singapore, Central Region, Singapore',
    type: 'Teaching Hospital',
    traumaLevel: 'Level I',
    verified: true,
    rating: 4.9,
    totalBeds: 1780,
    icuBeds: 180,
    surgeriesPerYear: '32,000',
    specialties: ['Hematology', 'Plastic Surgery', 'Burns', 'Cardiology', 'Oncology', 'Organ Transplant'],
    emergencyServices: true,
    contact: '+65 6222 3322',
    address: 'Outram Road, Singapore 169608',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Singapore General Hospital is the flagship public hospital in Singapore and ranked among the best in the world. As part of SingHealth, it provides comprehensive tertiary medical and surgical care.',
    officialLegalName: 'Singapore General Hospital Private Limited',
    yearEstablished: 1821,
    ownership: 'Public State-Owned (SingHealth)',
    hospitalNetwork: 'SingHealth Academic Medical Centre',
    coordinates: { lat: '1.2789° N', lng: '103.8340° E' },
    emergencyHotline: '995 / +65 6321 4311',
    mainHotline: {
      phone: '+65 6222 3322',
      email: 'appointments@sgh.com.sg',
      hours: '24/7',
      languages: 'English, Mandarin, Malay, Tamil'
    },
    internationalCare: {
      phone: '+65 6326 5656',
      email: 'ims@sgh.com.sg',
      hours: '24/7',
      languages: 'English, Mandarin, Bahasa, Japanese'
    },
    operatingHours: {
      hospitalEmergency: '24 Hours / 7 Days',
      clinics: '08:00 - 17:30 (Mon - Fri)',
      radiologyLabs: '24 Hours / 7 Days'
    },
    accreditations: [
      'JCI Academic Medical Center',
      'Magnet Nursing Excellence',
      'Singapore Ministry of Health Apex'
    ],
    insurancePartners: [
      'Medishield Life',
      'AIA HealthShield',
      'Great Eastern',
      'Prudential',
      'Bupa Global'
    ]
  },
  {
    id: 'hosp-3',
    globalHealthId: 'GH-HOSP-IN-DL-000245',
    name: 'All India Institute of Medical Sciences (AIIMS)',
    country: 'India',
    city: 'New Delhi',
    location: 'New Delhi, Delhi NCR, India',
    type: 'Super-Specialty Hospital',
    traumaLevel: 'Level I',
    verified: true,
    rating: 4.8,
    totalBeds: 2478,
    icuBeds: 220,
    surgeriesPerYear: '45,000',
    specialties: ['Cardiothoracic Surgery', 'Neurosurgery', 'Oncology', 'Gastroenterology', 'Renal Transplant', 'Pediatric Surgery'],
    emergencyServices: true,
    contact: '+91 11 2658 8500',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi, Delhi 110029',
    imageUrl: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80',
    description: "AIIMS New Delhi is India's premier public medical institution and hospital network. Renowned globally for cutting-edge clinical research, advanced tertiary surgical procedures, and affordable specialty care.",
    officialLegalName: 'All India Institute of Medical Sciences New Delhi',
    yearEstablished: 1956,
    ownership: 'Autonomous Public Apex Institution',
    hospitalNetwork: 'AIIMS Apex National Network',
    coordinates: { lat: '28.5672° N', lng: '77.2100° E' },
    emergencyHotline: '102 / +91 11 2658 8700',
    mainHotline: {
      phone: '+91 11 2658 8500',
      email: 'director@aiims.edu',
      hours: '24/7',
      languages: 'Hindi, English'
    },
    internationalCare: {
      phone: '+91 11 2659 4800',
      email: 'internationalcell@aiims.edu',
      hours: '24/7',
      languages: 'English, Hindi, Arabic, Russian'
    },
    operatingHours: {
      hospitalEmergency: '24 Hours / 7 Days',
      clinics: '08:30 - 16:30 (Mon - Sat)',
      radiologyLabs: '24 Hours / 7 Days'
    },
    accreditations: [
      'NABH National Accreditation Board for Hospitals',
      'NABL Pathology Accreditation',
      'MoHFW Apex Center'
    ],
    insurancePartners: [
      'Ayushman Bharat PMJAY',
      'CGHS / ECHS National Scheme',
      'Star Health',
      'HDFC ERGO',
      'Bupa Global'
    ]
  },
  {
    id: 'hosp-4',
    globalHealthId: 'GH-HOSP-US-MN-001001',
    name: 'Mayo Clinic Rochester',
    country: 'United States',
    city: 'Rochester',
    location: 'Rochester, Minnesota, United States',
    type: 'Teaching Hospital',
    traumaLevel: 'Level I',
    verified: true,
    rating: 5.0,
    totalBeds: 1265,
    icuBeds: 160,
    surgeriesPerYear: '28,000',
    specialties: ['Oncology & Proton Therapy', 'Cardiology', 'Neurology & Stroke', 'Orthopedics', 'Genomic Medicine'],
    emergencyServices: true,
    contact: '+1 (507) 284-2511',
    address: '200 First St SW, Rochester, MN 55905',
    imageUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1200&q=80',
    description: 'Mayo Clinic in Rochester, Minnesota is consistently ranked the #1 hospital in the United States by U.S. News & World Report. It is world-renowned for integrated clinical practice, education, and research.',
    officialLegalName: 'Mayo Clinic Rochester Inc',
    yearEstablished: 1889,
    ownership: 'Private Non-Profit Healthcare System',
    hospitalNetwork: 'Mayo Clinic Care Network',
    coordinates: { lat: '44.0225° N', lng: '-92.4667° W' },
    emergencyHotline: '911 / +1 (507) 255-5123',
    mainHotline: {
      phone: '+1 (507) 284-2511',
      email: 'appointments@mayoclinic.org',
      hours: '24/7',
      languages: 'English, Spanish, Arabic'
    },
    internationalCare: {
      phone: '+1 (507) 284-8884',
      email: 'intl.office@mayo.edu',
      hours: '24/7',
      languages: 'English, Spanish, Arabic, Mandarin, Russian, French'
    },
    operatingHours: {
      hospitalEmergency: '24 Hours / 7 Days',
      clinics: '07:30 - 17:00 (Mon - Fri)',
      radiologyLabs: '24 Hours / 7 Days'
    },
    accreditations: [
      'Joint Commission (JCAHO)',
      'Magnet® Recognition',
      'NCI-Designated Comprehensive Cancer Center'
    ],
    insurancePartners: [
      'Medicare / Medicaid',
      'Blue Cross Blue Shield',
      'UnitedHealthcare',
      'Aetna',
      'Cigna',
      'Kaiser Permanente'
    ]
  },
  {
    id: 'hosp-5',
    globalHealthId: 'GH-HOSP-DE-BER-003001',
    name: 'Charité - Universitätsmedizin Berlin',
    country: 'Germany',
    city: 'Berlin',
    location: 'Berlin, Berlin State, Germany',
    type: 'University Hospital',
    traumaLevel: 'Level I',
    verified: true,
    rating: 4.8,
    totalBeds: 3001,
    icuBeds: 210,
    surgeriesPerYear: '38,000',
    specialties: ['Virology & Infectious Disease', 'Neurology', 'Cardiovascular Surgery', 'Immunology', 'Pediatric Oncology'],
    emergencyServices: true,
    contact: '+49 30 450 50',
    address: 'Charitéplatz 1, 10117 Berlin, Germany',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80',
    description: "Charité is one of Europe's largest university hospitals, affiliated with Humboldt University and Freie Universität Berlin. More than half of all German Nobel Prize winners in Medicine worked at Charité.",
    officialLegalName: 'Charité – Universitätsmedizin Berlin Corporate Body',
    yearEstablished: 1710,
    ownership: 'Public University Hospital (State of Berlin)',
    hospitalNetwork: 'European University Hospital Alliance (EUHA)',
    coordinates: { lat: '52.5253° N', lng: '13.3776° E' },
    emergencyHotline: '112 / +49 30 450 55300',
    mainHotline: {
      phone: '+49 30 450 50',
      email: 'kontakt@charite.de',
      hours: '24/7',
      languages: 'German, English'
    },
    internationalCare: {
      phone: '+49 30 450 578000',
      email: 'international-patients@charite.de',
      hours: '24/7',
      languages: 'German, English, Russian, Arabic'
    },
    operatingHours: {
      hospitalEmergency: '24 Hours / 7 Days',
      clinics: '08:00 - 16:30 (Mon - Fri)',
      radiologyLabs: '24 Hours / 7 Days'
    },
    accreditations: [
      'KTQ Germany Certified Hospital',
      'TÜV Rheinland Quality Standard',
      'European Cancer Center Excellence'
    ],
    insurancePartners: [
      'GKV Public Health Insurance (Techniker, AOK, Barmer)',
      'PKV Private Health Insurance',
      'Allianz Global',
      'Cigna'
    ]
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Elena Rostova, MD, FACC',
    specialty: 'Cardiologist & Vascular Specialist',
    hospital: 'Mayo Clinic Rochester',
    location: 'Rochester, MN, USA',
    rating: 4.9,
    experienceYears: 18,
    availability: 'Mon - Thu (Telehealth & In-Person)',
    consultationFee: '$150',
    bio: 'Board-certified cardiologist specializing in preventive cardiology, coronary artery disease, lipid optimization, and non-invasive cardiovascular imaging.',
    degree: 'MD, FACC (Harvard Medical School)',
    fellowships: ['Fellow, American College of Cardiology (FACC)', 'American Board of Internal Medicine (Cardiovascular Disease)'],
    licenseNumber: 'NPI-1849204819 / MN-54912',
    languages: ['English', 'Russian', 'French'],
    nextAvailableSlot: 'Today, 02:30 PM',
    availableSlots: ['09:00 AM', '11:15 AM', '02:30 PM', '04:00 PM'],
    telehealthAvailable: true,
    inPersonAvailable: true,
    totalPatientsTreated: '8,500+',
    satisfactionRate: 99
  },
  {
    id: 'doc-2',
    name: 'Dr. Marcus Vance, MD, PhD',
    specialty: 'Endocrinologist & Diabetes Specialist',
    hospital: 'AIIMS New Delhi',
    location: 'New Delhi, Delhi NCR, India',
    rating: 4.8,
    experienceYears: 15,
    availability: 'Mon - Fri (Telehealth & In-Person)',
    consultationFee: '$90',
    bio: 'Leading clinical researcher in beta-cell preservation, insulin pump protocols, metabolic syndrome, and autoimmune thyroid disorders.',
    degree: 'MBBS, MD, PhD (AIIMS New Delhi)',
    fellowships: ['Fellow, Endocrine Society', 'National Academy of Medical Sciences (NAMS)'],
    licenseNumber: 'NMC-DL-883921 / MCI-48201',
    languages: ['English', 'Hindi', 'Bengali'],
    nextAvailableSlot: 'Tomorrow, 10:00 AM',
    availableSlots: ['10:00 AM', '11:30 AM', '03:00 PM', '05:15 PM'],
    telehealthAvailable: true,
    inPersonAvailable: true,
    totalPatientsTreated: '12,000+',
    satisfactionRate: 98
  },
  {
    id: 'doc-3',
    name: 'Dr. Sarah Chen, MD, FRCP',
    specialty: 'Neurologist & Pain Management Specialist',
    hospital: 'Singapore General Hospital (SGH)',
    location: 'Outram Road, Singapore',
    rating: 4.9,
    experienceYears: 14,
    availability: 'Tue, Wed, Sat (In-Person & Telehealth)',
    consultationFee: '$140',
    bio: 'Renowned neurologist specializing in migraine protocols, neuro-rehabilitation, peripheral neuropathy, and cognitive health.',
    degree: 'MBBS, MMed, FRCP (National University of Singapore / Royal College UK)',
    fellowships: ['Fellow, Royal College of Physicians (FRCP)', 'Singapore Medical Council Specialist Register'],
    licenseNumber: 'SMC-M14920A',
    languages: ['English', 'Mandarin', 'Cantonese'],
    nextAvailableSlot: 'Today, 04:15 PM',
    availableSlots: ['09:30 AM', '01:00 PM', '04:15 PM', '06:00 PM'],
    telehealthAvailable: true,
    inPersonAvailable: true,
    totalPatientsTreated: '6,800+',
    satisfactionRate: 99
  },
  {
    id: 'doc-4',
    name: 'Dr. Tariq Al-Mansoor, MD, FASN',
    specialty: 'Nephrologist & Renal Care Specialist',
    hospital: 'Cleveland Clinic Abu Dhabi',
    location: 'Al Maryah Island, Abu Dhabi, UAE',
    rating: 4.9,
    experienceYears: 16,
    availability: 'Sun - Thu (Telehealth & In-Person)',
    consultationFee: '$130',
    bio: 'Fellow of the American Society of Nephrology, specializing in chronic kidney disease (CKD) staging, hypertension control, and renal transplant immunology.',
    degree: 'MD, FASN, FACP (Johns Hopkins / Cleveland Clinic)',
    fellowships: ['Fellow, American Society of Nephrology (FASN)', 'Department of Health Abu Dhabi Consultant (DOH-1082)'],
    licenseNumber: 'DOH-MD-40912 / US-NPI-192837461',
    languages: ['Arabic', 'English', 'German'],
    nextAvailableSlot: 'Tomorrow, 09:15 AM',
    availableSlots: ['09:15 AM', '11:00 AM', '02:00 PM', '04:30 PM'],
    telehealthAvailable: true,
    inPersonAvailable: true,
    totalPatientsTreated: '7,400+',
    satisfactionRate: 98
  },
  {
    id: 'doc-5',
    name: 'Prof. Dr. Hans Weber, MD, PhD',
    specialty: 'Oncologist & Surgical Subspecialties',
    hospital: 'Charité - Universitätsmedizin Berlin',
    location: 'Berlin, Germany',
    rating: 4.9,
    experienceYears: 22,
    availability: 'Mon, Wed, Fri (Comprehensive Consultation)',
    consultationFee: '€160',
    bio: 'Chief Oncologist and surgical subspecialist leading molecular targeted immunotherapy trials, robotic minimally invasive surgical oncology, and genomic tumor sequencing.',
    degree: 'MD, PhD, FACS (Charité Medical Faculty Berlin)',
    fellowships: ['European Society for Medical Oncology (ESMO)', 'Fellow, American College of Surgeons (FACS)'],
    licenseNumber: 'DE-ÄK-BER-773918',
    languages: ['German', 'English', 'Spanish'],
    nextAvailableSlot: 'Today, 03:00 PM',
    availableSlots: ['08:45 AM', '11:00 AM', '03:00 PM', '05:00 PM'],
    telehealthAvailable: true,
    inPersonAvailable: true,
    totalPatientsTreated: '14,200+',
    satisfactionRate: 99
  },
  {
    id: 'doc-6',
    name: 'Dr. Priya Sharma, MS, MCh (Ortho)',
    specialty: 'Orthopedics & Joint Reconstruction',
    hospital: 'AIIMS New Delhi',
    location: 'New Delhi, Delhi NCR, India',
    rating: 4.8,
    experienceYears: 13,
    availability: 'Mon - Sat (OPD & Surgery)',
    consultationFee: '$85',
    bio: 'Specialist in robotic total knee and hip replacement, sports arthroscopy, complex ligament reconstruction, and osteoporotic spine care.',
    degree: 'MBBS, MS (Ortho), MCh (Oxford University Hospital)',
    fellowships: ['Indian Orthopaedic Association (IOA)', 'British Orthopaedic Association (BOA Fellow)'],
    licenseNumber: 'NMC-DL-940182',
    languages: ['English', 'Hindi', 'Punjabi'],
    nextAvailableSlot: 'Today, 11:00 AM',
    availableSlots: ['09:00 AM', '11:00 AM', '02:15 PM', '04:45 PM'],
    telehealthAvailable: true,
    inPersonAvailable: true,
    totalPatientsTreated: '5,900+',
    satisfactionRate: 98
  }
];
