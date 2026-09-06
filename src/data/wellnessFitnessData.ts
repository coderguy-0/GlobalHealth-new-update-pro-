import { 
  WellnessModule, 
  ExerciseItem, 
  WorkoutPlan, 
  YogaPose, 
  MuscleGroupInfo 
} from '../types';

// ============================================================================
// 1. WELLNESS MODULES DATA (9 TOPICS)
// ============================================================================
export const WELLNESS_MODULES: WellnessModule[] = [
  {
    id: 'well-mental',
    title: 'Mental Wellness & Cognitive Resilience',
    category: 'wellness',
    subCategory: 'Mental Wellness',
    icon: 'Brain',
    summary: 'Evidence-based cognitive hygiene, daily neurochemical balance (Dopamine, Serotonin, Oxytocin, Endorphins), and mental reframing.',
    keyBenefits: [
      'Reduces rumination and catastrophic cognitive loops',
      'Enhances working memory and executive prefrontal cortex control',
      'Builds neuroplasticity through daily reflection and gratitude',
      'Prevents occupational and emotional burnout syndrome'
    ],
    readTime: '6 min read',
    practicalSteps: [
      'Morning Sunlight: Expose retinas to natural morning light for 10-15 mins to set cortisol/melatonin timing.',
      'Daily Gratitude Triad: Write down 3 specific, non-repetitive things you are genuinely grateful for.',
      'Cognitive Reframing: Catch all-or-nothing thinking and write the objective, balanced alternative.',
      'Dopamine Reset: Take a 60-minute window daily without phone notifications, scrolling, or audio stimuli.'
    ],
    scientificBacking: 'Studies in the Journal of Neuroscience demonstrate that daily mindfulness and gratitude activate the medial prefrontal cortex, stimulating neurogenesis in the hippocampus while down-regulating the hyper-reactive amygdala.'
  },
  {
    id: 'well-stress',
    title: 'Stress Management & Vagus Nerve Regulation',
    category: 'wellness',
    subCategory: 'Stress Management',
    icon: 'ShieldAlert',
    summary: 'Activate your parasympathetic "rest and digest" nervous system with autonomic breath pacing and physiological stress relief.',
    keyBenefits: [
      'Rapidly lowers acute cortisol and adrenaline spikes in under 2 minutes',
      'Improves Heart Rate Variability (HRV) for cardiovascular health',
      'Relaxes physical muscle tension in the jaw, neck, and shoulders',
      'Restores clear decision-making during high-pressure situations'
    ],
    readTime: '5 min read',
    practicalSteps: [
      'The Physiological Sigh: Take two deep inhales through the nose, followed by one long, slow sigh through the mouth. Repeat 3-5 times.',
      'Box Breathing (4-4-4-4): Inhale 4s, hold 4s, exhale 4s, hold empty 4s. Used by tactical athletes and surgeons.',
      'Somatic Muscle Scan: Sequentially clench and release your toes, calves, abdomen, and shoulders to discharge adrenaline.',
      'Cold Facial Immersion: Splash cold water on your face to trigger the mammalian dive reflex and slow tachycardic pulse.'
    ],
    scientificBacking: 'Research from Stanford University School of Medicine (Cell Reports Medicine, 2023) showed that cyclic physiological sighing was superior to mindfulness meditation in rapidly improving mood and reducing autonomic arousal.'
  },
  {
    id: 'well-meditation',
    title: 'Meditation & Conscious Stillness',
    category: 'wellness',
    subCategory: 'Meditation',
    icon: 'Sparkles',
    summary: 'Cultivate inner stillness and meta-awareness through Vipassana, body scanning, and breath-centered presence.',
    keyBenefits: [
      'Decreases gray matter density in the fear-centric amygdala',
      'Increases cortical thickness in brain regions associated with attention and sensory processing',
      'Reduces systemic inflammatory biomarkers (IL-6 and CRP)',
      'Enhances emotional equanimity and impulse control'
    ],
    readTime: '7 min read',
    practicalSteps: [
      'Choose a Stable Posture: Sit with an upright spine, shoulders relaxed, hands resting on knees.',
      'Anchor on the Breath: Notice the sensation of air entering the nostrils or the gentle rise and fall of the belly.',
      'Non-Judgmental Return: When the mind wanders (which is completely normal), gently notice the distraction and return to the anchor.',
      'Start Small: Practice 3 to 5 minutes consistently every morning before opening email or messages.'
    ],
    scientificBacking: 'Meta-analyses published in JAMA Internal Medicine confirmed that structured meditation programs have moderate evidence in improving anxiety, depression, and pain management across all age groups.'
  },
  {
    id: 'well-sleep',
    title: 'Sleep Architecture & Circadian Biology',
    category: 'wellness',
    subCategory: 'Sleep',
    icon: 'Moon',
    summary: 'Master the 90-minute sleep cycle, optimize Deep Slow-Wave & REM sleep, and activate the brain’s glymphatic waste clearance.',
    keyBenefits: [
      'Flushes neurotoxic beta-amyloid proteins during deep N3 slow-wave sleep',
      'Consolidates procedural and emotional memory during REM cycles',
      'Regulates appetite hormones (Ghrelin & Leptin) to prevent metabolic dysfunction',
      'Maximizes human growth hormone (HGH) release for muscular repair'
    ],
    readTime: '8 min read',
    practicalSteps: [
      'Maintain Sleep-Wake Consistency: Go to bed and wake up within 30 minutes of the same time 7 days a week.',
      'Thermal Regulation: Keep your bedroom cool (65–68°F / 18–20°C); core body temperature must drop 1–2°F to initiate deep sleep.',
      'Caffeine Half-Life Cutoff: Stop all caffeine intake 8–10 hours before your targeted bedtime.',
      'Digital Sunset: Dim overhead lighting and eliminate blue screens 60 minutes before sleep to allow endogenous melatonin surge.'
    ],
    scientificBacking: 'Extensive research in Nature Reviews Neuroscience reveals that sleep deprivation impairs hippocampal synaptic plasticity and disrupts insulin sensitivity by up to 30% after just a single night of fragmented rest.'
  },
  {
    id: 'well-productivity',
    title: 'Productivity, Deep Work & Energy Cycles',
    category: 'wellness',
    subCategory: 'Productivity',
    icon: 'Flame',
    summary: 'Leverage 90-minute Ultradian work blocks, Pomodoro cycles, and the Eisenhower Priority Matrix to eliminate burnout and mental fatigue.',
    keyBenefits: [
      'Eliminates context-switching cognitive penalty (saving up to 40% of daily brain energy)',
      'Aligns demanding deep tasks with peak circadian alertness windows',
      'Transforms vague overwhelm into crisp, executable atomic action items',
      'Protects evening recharge time for deep sleep and social recovery'
    ],
    readTime: '6 min read',
    practicalSteps: [
      '90-Minute Ultradian Sprints: Work on ONE high-leverage task with zero tabs or notifications for 90 mins, followed by 15 mins of complete rest.',
      'Eisenhower Filter: Sort daily tasks into: Do First (Urgent & Important), Schedule (Important, Not Urgent), Delegate, and Delete.',
      'Eat the Frog: Tackle your highest-friction creative task within the first 2 hours of your workday.',
      'Shutdown Ritual: At the end of the workday, write tomorrow’s top 3 priorities and close all workstation tabs.'
    ],
    scientificBacking: 'Psychological research by Dr. Gloria Mark (UC Irvine) shows it takes an average of 23 minutes and 15 seconds to regain deep focus after a single digital interruption.'
  },
  {
    id: 'well-habits',
    title: 'Atomic Habits & Behavioral Architecture',
    category: 'wellness',
    subCategory: 'Healthy Habits',
    icon: 'CheckCircle2',
    summary: 'Design friction-free environments, engineer habit stacks, and leverage the 2-minute rule for long-term health compounding.',
    keyBenefits: [
      'Eliminates dependence on fickle willpower through environmental cues',
      'Creates automatic daily routines for hydration, exercise, and reading',
      'Prevents all-or-nothing relapse cycles with identity-based micro-wins',
      'Builds compounding health results over months and years'
    ],
    readTime: '5 min read',
    practicalSteps: [
      'Habit Stacking Formula: "After I [CURRENT HABIT], I will [NEW 2-MINUTE HABIT]." (e.g. After I pour my morning coffee, I will drink 500ml water).',
      'Make It Obvious: Place running shoes by the front door or place a book on your pillow.',
      'The 2-Minute Rule: When starting a new habit, scale it down so it takes less than 2 minutes to do (e.g., read 1 page, do 5 pushups).',
      'Never Miss Twice: If you miss a workout or routine one day, treat the next day as a non-negotiable priority to maintain momentum.'
    ],
    scientificBacking: 'Research published in the European Journal of Social Psychology demonstrates that establishing a new automatic health behavior requires an average of 66 days of contextual repetition.'
  },
  {
    id: 'well-mindfulness',
    title: 'Mindfulness & Somatic Sensory Grounding',
    category: 'wellness',
    subCategory: 'Mindfulness',
    icon: 'Eye',
    summary: 'Break out of anxiety-driven mental loops by reconnecting with the physical present through somatic sensory engagement.',
    keyBenefits: [
      'Instantly anchors a racing mind in the tangible physical environment',
      'Develops the capacity to observe emotions without reflexive reaction',
      'Fosters mindful eating habits and prevents mindless overconsumption',
      'Deepens sensory appreciation for everyday life experiences'
    ],
    readTime: '4 min read',
    practicalSteps: [
      '5-4-3-2-1 Sensory Reset: Acknowledge 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.',
      'Mindful Eating Practice: For the first 3 bites of any meal, chew slowly, notice the aroma, textures, and subtle flavor notes without screens.',
      'Doorway Anchors: Every time you walk through a doorway, pause for one conscious breath and release shoulder tension.',
      'Somatic Body Check: Check in with your body 3 times daily: Is your jaw unclenched? Are your shoulders relaxed? Is your breathing shallow?'
    ],
    scientificBacking: 'Neuroimaging studies show that sensory grounding activates the insula and somatosensory cortex, shifting blood flow away from the hyperactive default mode network (DMN) responsible for anxious rumination.'
  },
  {
    id: 'well-emotional',
    title: 'Emotional Health & Affective Regulation',
    category: 'wellness',
    subCategory: 'Emotional Health',
    icon: 'Heart',
    summary: 'Expand your emotional granularity, navigate difficult feelings with self-compassion, and express needs constructively.',
    keyBenefits: [
      'Increases emotional literacy and reduces somatic symptom expression',
      'Prevents destructive emotional suppression or explosive outbursts',
      'Strengthens interpersonal relationships and empathetic communication',
      'Fosters self-compassion during setbacks, failures, or loss'
    ],
    readTime: '7 min read',
    practicalSteps: [
      'Name It to Tame It: Replace generic "I feel bad" with precise emotional labels (e.g., "I feel unappreciated," "I feel overwhelmed").',
      'The 90-Second Emotion Rule: A chemical emotion surge in the bloodstream lasts only 90 seconds; breathe through the wave without acting impulsively.',
      'Self-Compassion Pause: When facing self-criticism, ask: "What would I say to a dear friend in this exact circumstance?"',
      'Expressive Journaling: Spend 10 minutes writing uncensored feelings on paper, then safely discard or archive it.'
    ],
    scientificBacking: 'Research by Dr. James Pennebaker and Dr. Lisa Feldman Barrett reveals that individuals with higher emotional granularity visit the doctor less frequently, use fewer medications, and recover from stressful events faster.'
  },
  {
    id: 'well-lifestyle',
    title: 'Lifestyle Medicine & Longevity Pillars',
    category: 'wellness',
    subCategory: 'Lifestyle Improvement',
    icon: 'Sun',
    summary: 'Incorporate the validated lifestyle habits of the world’s longest-living populations (Blue Zones) to extend healthspan and vitality.',
    keyBenefits: [
      'Promotes cellular autophagy and maintains telomere length integrity',
      'Lowers risk factors for chronic cardiovascular, metabolic, and neurodegenerative diseases',
      'Fosters deep social connection, purpose (Ikigai), and sense of belonging',
      'Optimizes daily environmental inputs for sustained physical vitality'
    ],
    readTime: '6 min read',
    practicalSteps: [
      'Move Naturally Every Hour: Stand up and walk 250 steps every 60 minutes during sedentary work.',
      'Hara Hachi Bu (80% Rule): Stop eating when you feel 80% full to prevent metabolic insulin surges and oxidative stress.',
      'Cultivate Your Ikigai: Identify what you love, what you are good at, and how it contributes to your community.',
      'Digital Sabbath: Dedicate at least one half-day per week entirely offline—in nature, with family, or engaged in manual crafts.'
    ],
    scientificBacking: 'The landmark Harvard Study of Adult Development (the longest longitudinal study on health) proved that warm, supportive relationships and purposeful lifestyle habits are the single strongest predictors of lifelong health and longevity.'
  }
];

// ============================================================================
// 2. FITNESS EXERCISE REPOSITORY (ACROSS MUSCLES & GOALS)
// ============================================================================
export const EXERCISE_DATABASE: ExerciseItem[] = [
  {
    id: 'ex-barbell-squat',
    name: 'Barbell Back Squat',
    primaryMuscle: 'Quadriceps & Glutes',
    secondaryMuscles: ['Hamstrings', 'Adductors', 'Core', 'Erector Spinae'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Lower Body',
    instructions: [
      'Place the barbell across your upper traps (high bar) or rear deltoids (low bar).',
      'Set feet shoulder-width apart, toes angled out 15–30 degrees.',
      'Inhale deeply into the diaphragm and brace the core (Valsalva maneuver).',
      'Descend by breaking at the hips and knees simultaneously until hip crease is below the knee (parallel).',
      'Drive through the whole foot, keeping chest proud and knees tracking in line with toes.'
    ],
    formCues: ['Screw your feet into the floor', 'Chest proud', 'Knees track over pinky toes', 'Drive the floor away'],
    commonMistakes: ['Knees caving inward (valgus collapse)', 'Heels lifting off ground', 'Excessive forward torso fold (good morning squat)'],
    tempo: '3-1-1-0 (3s down, 1s pause, 1s explosive up)',
    targetSetsReps: '3–4 Sets of 6–10 Reps',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-pushup',
    name: 'Functional Chest Push-Up',
    primaryMuscle: 'Pectoralis Major',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii', 'Serratus Anterior', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    category: 'Upper Body',
    instructions: [
      'Start in a high plank position with hands slightly wider than shoulder-width, fingers spread.',
      'Squeeze your glutes, engage your abs, and pull your shoulder blades down and back.',
      'Lower your chest until it is about 1 inch from the floor, keeping elbows tucked at a 45-degree angle.',
      'Press firmly through your palms to return to full lockout, protracting the shoulder blades at the top.'
    ],
    formCues: ['Body forms a straight plank from heels to crown', 'Tuck elbows to 45°', 'No sagging hips'],
    commonMistakes: ['Flaring elbows out to 90° (impinges shoulders)', 'Sagging lower back', 'Leading with the chin'],
    tempo: '2-1-1-0',
    targetSetsReps: '3–4 Sets of 10–20 Reps',
    imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-romanian-deadlift',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    primaryMuscle: 'Hamstrings & Gluteus Maximus',
    secondaryMuscles: ['Lower Back (Erectors)', 'Traps', 'Forearms/Grip'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    category: 'Lower Body',
    instructions: [
      'Stand with feet hip-width apart holding a dumbbell in each hand in front of your thighs.',
      'Unlock the knees with a slight 15-degree bend and maintain this bend throughout the movement.',
      'Hinge at the hips, pushing your glutes straight backward towards the wall behind you.',
      'Lower the weights along your shins until you feel a deep stretch in your hamstrings (usually mid-shin).',
      'Squeeze the glutes and drive the hips forward to stand tall without hyperextending your lower back.'
    ],
    formCues: ['Push the hips back like closing a car door with your glutes', 'Keep weights shaving your shins', 'Flat neutral spine'],
    commonMistakes: ['Rounding the lumbar spine', 'Squatting the weight down instead of hip hinging', 'Looking up and hyperextending the neck'],
    tempo: '3-1-1-0',
    targetSetsReps: '3–4 Sets of 8–12 Reps',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-pullup',
    name: 'Strict Pull-Up / Chin-Up',
    primaryMuscle: 'Latissimus Dorsi',
    secondaryMuscles: ['Biceps Brachii', 'Rhomboids', 'Middle/Lower Traps', 'Forearms'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    category: 'Upper Body',
    instructions: [
      'Grip the bar slightly wider than shoulder-width with an overhand (pull-up) or underhand (chin-up) grip.',
      'Initiate from a dead hang by depressing and retracting your scapulae (packing the shoulders).',
      'Drive your elbows down and back toward your ribcage, pulling your chest towards the bar until chin clears the bar.',
      'Lower yourself down with full control back to a complete dead hang.'
    ],
    formCues: ['Lead with the collarbones', 'Pull elbows into your back pockets', 'Do not kick or swing (kipping)'],
    commonMistakes: ['Partial range of motion', 'Shoulders rolling forward at top', 'Kicking legs for momentum'],
    tempo: '2-1-1-1',
    targetSetsReps: '3–4 Sets of 6–12 Reps',
    imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-overhead-press',
    name: 'Standing Overhead Barbell Press (OHP)',
    primaryMuscle: 'Anterior & Lateral Deltoids',
    secondaryMuscles: ['Triceps Brachii', 'Upper Trapezius', 'Core', 'Serratus Anterior'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    category: 'Upper Body',
    instructions: [
      'Grip the bar just outside shoulder width, resting it on your clavicle and anterior deltoids.',
      'Squeeze your glutes, brace your core, and keep feet planted firmly under hips.',
      'Pull your chin back slightly to clear the bar’s path, then press vertically upward in a straight line.',
      'Once the bar passes your forehead, push your head through the "window" and lock out overhead with shoulders active.'
    ],
    formCues: ['Ribs down, glutes locked', 'Straight vertical bar path', 'Full lockout with head forward'],
    commonMistakes: ['Excessive backward arch in lumbar spine', 'Pressing bar too far in front of center of gravity', 'Bent wrists'],
    tempo: '2-1-1-0',
    targetSetsReps: '3–4 Sets of 6–8 Reps',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'ex-hollow-body-hold',
    name: 'Hollow Body Core Hold',
    primaryMuscle: 'Rectus Abdominis & Transverse Abdominis',
    secondaryMuscles: ['Hip Flexors', 'Obliques', 'Serratus Anterior'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    category: 'Core',
    instructions: [
      'Lie on your back on a mat with arms extended overhead and legs straight.',
      'Press your lower back firmly into the floor, eliminating any gap between the lumbar spine and the mat.',
      'Lift your shoulder blades and straight legs a few inches off the floor, creating a gentle banana shape.',
      'Breathe smoothly while maintaining intense isometric tension in your abdomen.'
    ],
    formCues: ['Lower back glued to the floor', 'Toes pointed, quads squeezed', 'Arms hugging ears'],
    commonMistakes: ['Lower back arching off the floor (compromises spine)', 'Holding your breath'],
    tempo: 'Isometric Hold (30–45 seconds)',
    targetSetsReps: '3–4 Sets of 30–45s Holds',
    imageUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&auto=format&fit=crop&q=80'
  }
];

// ============================================================================
// 4. STRUCTURED WORKOUT PLANS (BEGINNER TO ADVANCED)
// ============================================================================
export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-functional-beginner',
    title: '4-Week Foundation & Functional Longevity',
    level: 'Beginner',
    frequency: '3 Days / Week (Mon-Wed-Fri)',
    durationWeeks: 4,
    sessionDurationMin: 40,
    goal: 'Build baseline full-body strength, joint resilience, and cardiovascular conditioning with zero intimidation.',
    description: 'A balanced routine combining fundamental movement patterns (Squat, Hinge, Push, Pull, Carry) with core stability and mobility.',
    overview: [
      'Day 1: Full Body Strength A (Squat & Push focus)',
      'Day 2: Active Recovery / Zone 2 Cardio & Mobility',
      'Day 3: Full Body Strength B (Hinge & Pull focus)',
      'Day 4: Rest / Yoga Flow',
      'Day 5: Full Body Functional Conditioning & Core',
      'Days 6-7: Active Rest & Outdoor Walking'
    ],
    schedule: [
      {
        day: 'Monday (Day 1)',
        focus: 'Full Body Compound Strength (Push & Squat)',
        exercises: [
          { exerciseName: 'Goblet Squat (Dumbbell or Kettlebell)', sets: '3', reps: '10-12', restSec: 60, notes: 'Focus on full depth and knee tracking' },
          { exerciseName: 'Push-Ups (Incline or Floor)', sets: '3', reps: '8-12', restSec: 60, notes: 'Keep rigid plank alignment' },
          { exerciseName: 'Dumbbell Romanian Deadlift', sets: '3', reps: '10-12', restSec: 60, notes: 'Deep hamstring stretch with neutral spine' },
          { exerciseName: 'Dumbbell Single Arm Row', sets: '3', reps: '10 each', restSec: 45, notes: 'Pull elbow toward hip crease' },
          { exerciseName: 'Dead Bug Core Stability', sets: '3', reps: '10 each side', restSec: 30, notes: 'Keep lower back pinned to mat' }
        ]
      },
      {
        day: 'Wednesday (Day 3)',
        focus: 'Full Body Functional & Pull Balance',
        exercises: [
          { exerciseName: 'Reverse Lunges (Bodyweight or DB)', sets: '3', reps: '10 each leg', restSec: 60, notes: 'Front shin vertical' },
          { exerciseName: 'Lat Pulldown or Resistance Band Pulldown', sets: '3', reps: '12', restSec: 60, notes: 'Drive elbows down and back' },
          { exerciseName: 'Dumbbell Overhead Shoulder Press', sets: '3', reps: '10', restSec: 60, notes: 'Glutes squeezed, ribs down' },
          { exerciseName: 'Glute Bridge Hold', sets: '3', reps: '15 reps (3s hold)', restSec: 45, notes: 'Peak contraction at top' },
          { exerciseName: 'Plank Hold', sets: '3', reps: '30-45 sec', restSec: 45, notes: 'Full body isometric tension' }
        ]
      },
      {
        day: 'Friday (Day 5)',
        focus: 'Conditioning, Carries & Metabolic Endurance',
        exercises: [
          { exerciseName: 'Farmer’s Walk (Heavy Dumbbells)', sets: '4', reps: '40 meters', restSec: 60, notes: 'Walk tall, proud chest, unbreakable grip' },
          { exerciseName: 'Kettlebell Deadlift to High Pull', sets: '3', reps: '12', restSec: 45, notes: 'Explosive hip extension' },
          { exerciseName: 'Bodyweight Step-Ups onto Bench', sets: '3', reps: '12 each leg', restSec: 45, notes: 'Push through lead heel' },
          { exerciseName: 'Bird-Dog Core Crosses', sets: '3', reps: '10 each side', restSec: 30, notes: 'Slow and controlled' },
          { exerciseName: 'Incline Treadmill Zone 2 Walk', sets: '1', reps: '15 mins', restSec: 0, notes: 'Nasal breathing, conversational pace' }
        ]
      }
    ]
  },
  {
    id: 'plan-push-pull-legs',
    title: 'Hypertrophy & Power: Push-Pull-Legs (PPL)',
    level: 'Intermediate',
    frequency: '4–5 Days / Week',
    durationWeeks: 8,
    sessionDurationMin: 55,
    goal: 'Maximize lean muscle hypertrophy, aesthetic muscular balance, and barbell strength progression.',
    description: 'The gold-standard bodybuilding and athletic split allowing optimal recovery for each muscle group between sessions.',
    overview: [
      'Session 1: Push (Chest, Shoulders, Triceps)',
      'Session 2: Pull (Lats, Upper Back, Rear Delts, Biceps)',
      'Session 3: Legs & Calves (Quads, Hamstrings, Glutes)',
      'Session 4: Rest / Mobility & Core',
      'Session 5: Upper Body Hypertrophy Focus'
    ],
    schedule: [
      {
        day: 'Push Day',
        focus: 'Chest, Shoulders, Triceps',
        exercises: [
          { exerciseName: 'Flat Barbell Bench Press', sets: '4', reps: '6-8', restSec: 120, notes: 'Retract shoulder blades, slight arch' },
          { exerciseName: 'Incline Dumbbell Press', sets: '3', reps: '8-10', restSec: 90, notes: '30-degree bench angle' },
          { exerciseName: 'Standing Barbell Overhead Press', sets: '3', reps: '6-8', restSec: 90, notes: 'Full vertical lockout' },
          { exerciseName: 'Dumbbell Lateral Raises', sets: '4', reps: '12-15', restSec: 45, notes: 'Control the eccentric descent' },
          { exerciseName: 'Cable Triceps Rope Pushdowns', sets: '3', reps: '12-15', restSec: 45, notes: 'Flare rope apart at bottom lockout' }
        ]
      },
      {
        day: 'Pull Day',
        focus: 'Lats, Rhomboids, Traps, Biceps',
        exercises: [
          { exerciseName: 'Conventional Barbell Deadlift', sets: '3', reps: '5', restSec: 150, notes: 'Pack lats, wedge hips, push floor' },
          { exerciseName: 'Weighted or Bodyweight Pull-Ups', sets: '4', reps: '6-10', restSec: 90, notes: 'Full dead hang to chin over bar' },
          { exerciseName: 'Chest-Supported T-Bar Row', sets: '3', reps: '8-10', restSec: 90, notes: 'Drive elbows toward waist' },
          { exerciseName: 'Face Pulls with Rope', sets: '4', reps: '15', restSec: 45, notes: 'External rotation at end range' },
          { exerciseName: 'Incline Dumbbell Biceps Curls', sets: '3', reps: '10-12', restSec: 45, notes: 'Maximum stretch at bottom' }
        ]
      },
      {
        day: 'Legs Day',
        focus: 'Quadriceps, Hamstrings, Glutes, Calves',
        exercises: [
          { exerciseName: 'Barbell Back Squat', sets: '4', reps: '6-8', restSec: 120, notes: 'Depth below parallel' },
          { exerciseName: 'Dumbbell Romanian Deadlift (RDL)', sets: '3', reps: '8-10', restSec: 90, notes: 'Deep hamstring hinge' },
          { exerciseName: 'Bulgarian Split Squats', sets: '3', reps: '8-10 each leg', restSec: 60, notes: 'Rear foot elevated on bench' },
          { exerciseName: 'Seated or Lying Hamstring Curl', sets: '3', reps: '12-15', restSec: 45, notes: 'Slow 3-second negative' },
          { exerciseName: 'Standing Calf Raises', sets: '4', reps: '15-20', restSec: 45, notes: 'Full 2-second stretch at bottom' }
        ]
      }
    ]
  },
  {
    id: 'plan-hiit-metabolic',
    title: 'Metabolic Fat Burn & Athletic HIIT',
    level: 'All Levels',
    frequency: '3 Days / Week',
    durationWeeks: 4,
    sessionDurationMin: 30,
    goal: 'Torch body fat, boost VO2 max, and elevate EPOC (Excess Post-Exercise Oxygen Consumption).',
    description: 'High-energy interval conditioning combining bodyweight calisthenics, plyometrics, and core circuits.',
    overview: [
      'Work:Rest Ratio: 40 seconds high intensity, 20 seconds active rest',
      'Rounds: 4 rounds of 5 stations per session',
      'Total Time: 25 minutes + 5 minute cool-down',
      'Heart Rate: Target 80–90% Max HR during work intervals'
    ],
    schedule: [
      {
        day: 'HIIT Circuit A',
        focus: 'Full Body Explosive Conditioning',
        exercises: [
          { exerciseName: 'Kettlebell Swings / Dumbbell Swings', sets: '4 rounds', reps: '40s work', restSec: 20, notes: 'Explosive hip snap' },
          { exerciseName: 'Burpees or Sprawls', sets: '4 rounds', reps: '40s work', restSec: 20, notes: 'Chest to floor or fast step-back' },
          { exerciseName: 'Mountain Climbers', sets: '4 rounds', reps: '40s work', restSec: 20, notes: 'Knees driving under hips' },
          { exerciseName: 'Jump Squats / Air Squats', sets: '4 rounds', reps: '40s work', restSec: 20, notes: 'Soft, cushioned landing' },
          { exerciseName: 'Plank Shoulder Taps', sets: '4 rounds', reps: '40s work', restSec: 60, notes: 'Anti-rotational core stabilization' }
        ]
      }
    ]
  }
];

// ============================================================================
// 5. MUSCLE GROUPS INTERACTIVE ATLAS
// ============================================================================
export const MUSCLE_GROUPS_DATA: MuscleGroupInfo[] = [
  {
    id: 'muscle-chest',
    name: 'Chest (Pectoralis Major & Minor)',
    region: 'Upper Body',
    anatomicalFunction: 'Horizontal adduction, internal rotation, and flexion of the humerus at the shoulder joint.',
    primaryExercises: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Weighted Dips', 'Push-Ups'],
    isolationExercises: ['Cable Chest Flyes', 'Pec Deck Machine', 'Dumbbell Pullover'],
    stretchTechnique: 'Doorway Pec Stretch: Place forearm against doorframe at 90 degrees and gently lean forward.',
    injuryPreventionTip: 'Avoid excessive elbow flare beyond 75 degrees during pressing movements to safeguard the rotator cuff and anterior labrum.'
  },
  {
    id: 'muscle-back',
    name: 'Back (Latissimus Dorsi & Rhomboids)',
    region: 'Upper Body',
    anatomicalFunction: 'Shoulder extension, adduction, and horizontal abduction; scapular retraction and downward rotation.',
    primaryExercises: ['Deadlifts', 'Pull-Ups', 'Barbell Bent-Over Rows', 'Single-Arm Dumbbell Rows'],
    isolationExercises: ['Straight-Arm Cable Pulldowns', 'Lat Pulldowns', 'Face Pulls'],
    stretchTechnique: 'Child’s Pose with side reach: Sit back onto heels and walk fingertips diagonally across mat to stretch lats.',
    injuryPreventionTip: 'Maintain a locked, neutral lumbar spine during all rowing and deadlift movements to prevent spinal disc shear.'
  },
  {
    id: 'muscle-quads',
    name: 'Quadriceps (Vastus Lateralis, Medialis, Intermedius & Rectus Femoris)',
    region: 'Lower Body',
    anatomicalFunction: 'Knee extension and hip flexion (Rectus Femoris). Critical for walking, sprinting, and jumping.',
    primaryExercises: ['Barbell Back Squats', 'Front Squats', 'Bulgarian Split Squats', 'Leg Press'],
    isolationExercises: ['Leg Extensions', 'Sissy Squats', 'Reverse Nordics'],
    stretchTechnique: 'Standing Quad Stretch: Grasp top of ankle and draw heel to glute, keeping knees pinned together and hips tucked.',
    injuryPreventionTip: 'Ensure knees track consistently in the direction of the middle toes and strengthen the Vastus Medialis (VMO) to prevent patellofemoral tracking pain.'
  },
  {
    id: 'muscle-hamstrings',
    name: 'Hamstrings (Biceps Femoris, Semitendinosus & Semimembranosus)',
    region: 'Lower Body',
    anatomicalFunction: 'Knee flexion, hip extension, and decelerating the lower leg during high-speed running.',
    primaryExercises: ['Romanian Deadlifts (RDL)', 'Good Mornings', 'Nordic Hamstring Curls', 'Trap Bar Deadlifts'],
    isolationExercises: ['Seated Hamstring Curls', 'Lying Leg Curls', 'Swiss Ball Hamstring Curls'],
    stretchTechnique: 'Hurdler Hamstring Stretch: Sit with one leg extended and hinge at hip with flat back, reaching toward toes.',
    injuryPreventionTip: 'Train both hip-extension and knee-flexion hamstring functions. Eccentric overload (Nordic curls) reduces sprint strains by up to 60%.'
  },
  {
    id: 'muscle-glutes',
    name: 'Glutes (Gluteus Maximus, Medius & Minimus)',
    region: 'Lower Body',
    anatomicalFunction: 'Primary hip extension, hip abduction, external rotation, and pelvic stabilization.',
    primaryExercises: ['Barbell Hip Thrusts', 'Sumo Deadlifts', 'Walking Dumbbell Lunges', 'Step-Ups'],
    isolationExercises: ['Cable Glute Kickbacks', 'Banded Monster Walks', 'Side-Lying Clamshells'],
    stretchTechnique: 'Figure-4 / Pigeon Stretch: Cross ankle over opposite knee and gently pull thigh towards chest.',
    injuryPreventionTip: 'Weak gluteus medius causes knee valgus collapse and lower back compensation. Activate glutes before heavy squats with banded glute bridges.'
  },
  {
    id: 'muscle-deltoids',
    name: 'Shoulders (Anterior, Lateral & Posterior Deltoids)',
    region: 'Upper Body',
    anatomicalFunction: 'Arm abduction (lateral head), arm flexion (anterior head), and horizontal abduction (posterior head).',
    primaryExercises: ['Overhead Barbell Press', 'Seated Dumbbell Shoulder Press', 'Push Press'],
    isolationExercises: ['Dumbbell Lateral Raises', 'Rear Delt Reverse Flyes', 'Cable Face Pulls'],
    stretchTechnique: 'Cross-Body Shoulder Stretch: Draw arm straight across chest and gently compress with opposite forearm.',
    injuryPreventionTip: 'Rear deltoids and external rotators are often neglected compared to pressing muscles. Maintain a 1:1 ratio of pressing to pulling volume.'
  },
  {
    id: 'muscle-core',
    name: 'Core (Rectus Abdominis, Transverse Abdominis & Obliques)',
    region: 'Core',
    anatomicalFunction: 'Spinal flexion, anti-extension, anti-rotation, and transferring kinetic energy between upper and lower body.',
    primaryExercises: ['Hollow Body Holds', 'Ab Wheel Rollouts', 'Pallof Presses', 'Hanging Leg Raises'],
    isolationExercises: ['Bicycle Crunches', 'Russian Twists', 'Dead Bugs'],
    stretchTechnique: 'Cobra Pose / Upward Dog: Lie prone and press palms into floor, extending spine while relaxing abdominal wall.',
    injuryPreventionTip: 'Prioritize anti-movement exercises (planks, Pallof press, suitcase carries) that train the core to resist spinal buckling under heavy loads.'
  }
];

// ============================================================================
// 6. YOGA ASANAS & POSES DIRECTORY
// ============================================================================
export const YOGA_POSES_DATA: YogaPose[] = [
  {
    id: 'yoga-downward-dog',
    englishName: 'Downward-Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    difficulty: 'Beginner',
    category: 'Standing',
    benefits: [
      'Decompresses the entire spinal column',
      'Stretches hamstrings, calves, and Achilles tendons',
      'Strengthens shoulders, wrists, and core stabilizers',
      'Mild inversion that promotes blood flow to the brain'
    ],
    alignmentCues: [
      'Hands shoulder-width apart, index fingers pointing forward, fingers spread wide.',
      'Press through the base of the index finger and thumb to protect wrists.',
      'Send hips up and back like an inverted "V", pedaling heels toward the mat.',
      'Keep neck relaxed and ears in line with upper biceps.'
    ],
    breathingTip: 'Inhale to lengthen the spine from wrists to tailbone; exhale to settle heels closer to the earth.',
    contraindications: ['Carpal tunnel syndrome', 'Late-term pregnancy', 'Severe high blood pressure'],
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yoga-warrior-2',
    englishName: 'Warrior II',
    sanskritName: 'Virabhadrasana II',
    difficulty: 'Beginner',
    category: 'Standing',
    benefits: [
      'Strengthens quadriceps, glutes, and ankle stabilizers',
      'Opens hips, groin, and expands chest cavity',
      'Builds stamina, grounding concentration, and willpower'
    ],
    alignmentCues: [
      'Step feet 4 feet apart; front foot points straight ahead, back foot at a 90-degree angle.',
      'Bend front knee to 90 degrees directly stacked over front ankle.',
      'Extend arms parallel to floor, reaching actively through fingertips.',
      'Gaze softly over the middle finger of your front hand.'
    ],
    breathingTip: 'Inhale to feel the crown of your head lifting tall; exhale to sink into your front hip crease with grounded strength.',
    contraindications: ['Recent knee injury or surgery', 'Chronic neck issues (avoid turning head)'],
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yoga-cobra',
    englishName: 'Cobra Pose',
    sanskritName: 'Bhujangasana',
    difficulty: 'Beginner',
    category: 'Backbend',
    benefits: [
      'Strengthens erector spinae, glutes, and shoulders',
      'Counteracts desk-slouch and forward rounded posture',
      'Stimulates abdominal organs and deepens respiratory capacity'
    ],
    alignmentCues: [
      'Lie face down on the mat with tops of feet pressing firmly into the floor.',
      'Place hands beneath shoulders, elbows hugging close to your ribcage.',
      'Inhale to lift chest off floor using back muscles with minimal weight in hands.',
      'Keep shoulders drawn away from ears and gaze gently forward.'
    ],
    breathingTip: 'Inhale deeply into the chest to expand the heart center; exhale to soften shoulder blades down.',
    contraindications: ['Back injury / spinal stenosis', 'Pregnancy', 'Carpal tunnel'],
    imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500&auto=format&fit=crop&q=80'
  },
  {
    id: 'yoga-childs-pose',
    englishName: 'Child’s Pose',
    sanskritName: 'Balasana',
    difficulty: 'Beginner',
    category: 'Restorative',
    benefits: [
      'Gently stretches hips, thighs, and ankles',
      'Calms the central nervous system and relieves mental stress',
      'Provides a safe, grounding sanctuary during vigorous practice'
    ],
    alignmentCues: [
      'Kneel on the mat, big toes touching, knees separated to mat-width.',
      'Fold forward at hips and rest your torso between your thighs.',
      'Extend arms forward on mat or rest them alongside your calves.',
      'Rest forehead comfortably on the mat and release all spinal effort.'
    ],
    breathingTip: 'Direct breath into the back of your lungs, feeling your ribcage expand laterally with each inhale.',
    contraindications: ['Severe knee joint inflammation', 'Diarrhea'],
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80'
  }
];

// ============================================================================
// 7. COUCH TO 5K PROGRESSION SCHEDULE (RUNNING)
// ============================================================================
export const COUCH_TO_5K_PROGRAM = [
  {
    week: 1,
    title: 'Week 1: Awakening the Aerobic Engine',
    description: 'Brisk 5-min warmup walk, then alternate 60s jog and 90s walk for 20 mins total.',
    workoutsPerWeek: 3,
    targetHeartZone: 'Zone 2 (Conversational pace)'
  },
  {
    week: 2,
    title: 'Week 2: Building Cadence & Elasticity',
    description: 'Brisk 5-min walk, then alternate 90s jog with 2 mins walk for 20 mins total.',
    workoutsPerWeek: 3,
    targetHeartZone: 'Zone 2'
  },
  {
    week: 3,
    title: 'Week 3: Continuous Strides',
    description: 'Two repetitions of: 90s jog, 90s walk, 3 mins jog, 3 mins walk.',
    workoutsPerWeek: 3,
    targetHeartZone: 'Zone 2–3'
  },
  {
    week: 4,
    title: 'Week 4: The 5-Minute Continuous Milestone',
    description: 'Jog 3 mins / walk 90s, jog 5 mins / walk 2.5 mins, jog 3 mins / walk 90s, jog 5 mins.',
    workoutsPerWeek: 3,
    targetHeartZone: 'Zone 2–3'
  },
  {
    week: 5,
    title: 'Week 5: The 20-Minute Continuous Breakthrough',
    description: 'Day 1: 3x 5-min jogs. Day 2: 2x 8-min jogs. Day 3: One continuous 20-minute jog with no walking!',
    workoutsPerWeek: 3,
    targetHeartZone: 'Zone 2'
  },
  {
    week: 6,
    title: 'Week 6: Pacing & Aerobic Efficiency',
    description: 'Day 1: Jog 5m / walk 3m / jog 8m / walk 3m / jog 5m. Day 3: Continuous 25-minute steady jog.',
    workoutsPerWeek: 3,
    targetHeartZone: 'Zone 2'
  },
  {
    week: 7,
    title: 'Week 7: Building 5K Stamina',
    description: 'Three sessions of continuous 25-minute runs at conversational pace (160–175 steps/min cadence).',
    workoutsPerWeek: 3,
    targetHeartZone: 'Zone 2'
  },
  {
    week: 8,
    title: 'Week 8: Graduation to 5,000m (5K)',
    description: 'Run continuously for 30 minutes (or 5.0 Kilometers) without stopping. Welcome to the runner’s tribe!',
    workoutsPerWeek: 3,
    targetHeartZone: 'Zone 2–3'
  }
];

// ============================================================================
// 8. 10-MINUTE DESK WORKER POSTURE & MOBILITY ROUTINE
// ============================================================================
export const DESK_MOBILITY_ROUTINE = [
  {
    step: 1,
    name: 'Chin Tucks & Neck Retraction',
    duration: '60 seconds',
    target: 'Cervical spine & deep neck flexors',
    cues: 'Sit tall, look straight ahead, draw your chin straight back as if making a double chin. Hold 3s, release.'
  },
  {
    step: 2,
    name: 'Thoracic Extension over Chair Back',
    duration: '60 seconds',
    target: 'Thoracic spine (upper back)',
    cues: 'Interlace fingers behind neck, support skull, and gently arch upper back over the top of your chair. Exhale on extension.'
  },
  {
    step: 3,
    name: 'Seated Figure-4 Hip & Piriformis Stretch',
    duration: '90 seconds (45s per side)',
    target: 'Glutes, piriformis & external rotators',
    cues: 'Cross right ankle over left knee. Keep spine straight and gently hinge forward until feeling a deep glute stretch.'
  },
  {
    step: 4,
    name: 'Doorway Pec & Biceps Opening',
    duration: '90 seconds (45s per side)',
    target: 'Pectoralis minor & anterior deltoid',
    cues: 'Place elbow against doorway at 90°, step forward with inside leg, and rotate chest gently away.'
  },
  {
    step: 5,
    name: 'Standing Half-Kneeling Hip Flexor Stretch',
    duration: '90 seconds (45s per side)',
    target: 'Psoas major & rectus femoris',
    cues: 'Tuck pelvis under (posterior pelvic tilt), squeeze glute of rear leg, and shift hips forward 2 inches.'
  },
  {
    step: 6,
    name: 'Standing Glute Squeeze & Arm Reaches',
    duration: '60 seconds',
    target: 'Full body anterior chain decompression',
    cues: 'Stand with feet hip-width, reach arms overhead toward the ceiling, squeeze glutes, and take 5 deep belly breaths.'
  }
];
