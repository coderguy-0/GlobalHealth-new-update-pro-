// Standalone community forum seed data.
//
// Extracted from healthData.ts so that lightweight consumers (e.g. the
// homepage CommunitySection) can import FORUM_POSTS without dragging in the
// full disease / medicine / lab-test catalogs that healthData re-exports.
import { ForumPost } from '../types';

export const FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    title: 'Managing Morning Fasting Blood Sugar Spikes in Type 2 Diabetes (Dawn Phenomenon)',
    author: 'SarahM_Wellness',
    authorRole: 'member',
    category: 'Diabetes Support',
    postType: 'question',
    tags: ['Diabetes', 'BloodSugar', 'Nutrition', 'DawnPhenomenon'],
    content: 'Has anyone found an effective bedtime routine or evening snack to curb early morning fasting blood sugar spikes? My fasting readings often hover around 135 mg/dL despite balanced dinners and moderate physical activity.',
    upvotes: 28,
    repliesCount: 3,
    viewsCount: 240,
    isSaved: false,
    isFollowed: false,
    isAnswered: true,
    timestamp: '2 hours ago',
    replies: [
      {
        id: 'rep-1',
        author: 'Dr. Marcus Vance, MD, PhD',
        authorRole: 'verified_professional',
        authorSpecialty: 'Endocrinologist & Diabetes Specialist',
        content: 'Educational Note: The Dawn Phenomenon is typically triggered by early morning surges in counter-regulatory hormones (cortisol, growth hormone). For many patients, a modest protein-fat evening snack (such as a tablespoon of almond butter or a hardboiled egg) slows nighttime hepatic gluconeogenesis without requiring insulin adjustments. Discuss this with your personal physician.',
        timestamp: '1 hour ago',
        upvotes: 14,
        isHelpful: true
      },
      {
        id: 'rep-2',
        author: 'David_Runner88',
        authorRole: 'member',
        content: 'Adding a 15-minute brisk walk immediately after dinner reduced my morning fasting readings by 20 points within a week!',
        timestamp: '45 mins ago',
        upvotes: 7,
        isHelpful: true
      },
      {
        id: 'rep-3',
        author: 'Elena_Caregiver',
        authorRole: 'caregiver',
        content: 'Pairing evening hydration with chamomile tea and avoiding late-night carbs helped my father stabilize his morning spikes significantly.',
        timestamp: '20 mins ago',
        upvotes: 3
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Best Low-Sodium Herb & Spice Combinations for Stage 1 Hypertension?',
    author: 'HealthyHeart2026',
    authorRole: 'member',
    category: 'Heart Health',
    postType: 'discussion',
    tags: ['HeartHealth', 'Hypertension', 'LowSodium', 'Cooking'],
    content: 'I recently received a diagnosis of Stage 1 hypertension and my doctor recommended keeping dietary sodium under 1,500mg daily. What are your favorite flavorful herb and spice blends for roasted vegetables and soups that do not taste bland?',
    upvotes: 22,
    repliesCount: 2,
    viewsCount: 195,
    isSaved: true,
    isFollowed: true,
    timestamp: '4 hours ago',
    replies: [
      {
        id: 'rep-4',
        author: 'ChefAna_Nutri',
        authorRole: 'member',
        content: 'Try toasted nutritional yeast combined with smoked paprika, dried rosemary, and freshly grated lemon zest! It provides a deep savory umami profile with zero added sodium.',
        timestamp: '3 hours ago',
        upvotes: 9,
        isHelpful: true
      },
      {
        id: 'rep-5',
        author: 'Dr. Elena Rostova, MD, FACC',
        authorRole: 'verified_professional',
        authorSpecialty: 'Cardiologist & Vascular Specialist',
        content: 'Educational Note: Garlic powder, sumac, coriander, and potassium-rich herbs (like parsley and cilantro) enhance flavor while supporting endothelial health. Avoid commercial "salt substitutes" without consulting your physician if you take ACE inhibitors or ARBs, as they may contain high potassium chloride.',
        timestamp: '2 hours ago',
        upvotes: 16,
        isHelpful: true
      }
    ]
  },
  {
    id: 'post-3',
    title: 'My Experience Building a Consistent 8,000-Step Daily Walking Habit After Knee Surgery',
    author: 'Robert_KneeRecovery',
    authorRole: 'member',
    category: 'Recovery',
    postType: 'experience',
    tags: ['Recovery', 'Walking', 'JointHealth', 'Consistency'],
    content: 'Sharing what helped me stay consistent over 6 months post-arthroscopy: Breaking steps into three 15-minute segments rather than one long walk, wearing supportive cushioned orthotics, and doing gentle quad stretches before heading out.',
    upvotes: 35,
    repliesCount: 4,
    viewsCount: 310,
    isSaved: false,
    isFollowed: false,
    timestamp: 'Yesterday',
    replies: [
      {
        id: 'rep-6',
        author: 'Dr. Priya Sharma, MS, MCh (Ortho)',
        authorRole: 'verified_professional',
        authorSpecialty: 'Orthopedics & Joint Reconstruction',
        content: 'Educational Insight: Dividing walking sessions distributes joint articular cartilage loads and reduces inflammatory synovial effusion during rehabilitation. Excellent self-pacing.',
        timestamp: '18 hours ago',
        upvotes: 18,
        isHelpful: true
      }
    ]
  },
  {
    id: 'post-4',
    title: 'Community Poll: What type of exercise routine helps you stay most consistent?',
    author: 'GlobalHealth_Team',
    authorRole: 'moderator',
    category: 'Fitness',
    postType: 'poll',
    tags: ['Fitness', 'Poll', 'Motivation', 'Habits'],
    content: 'Maintaining an active lifestyle is key for cardiovascular and metabolic vitality. Vote on which exercise format you have found most sustainable in your weekly routine.',
    upvotes: 46,
    repliesCount: 8,
    viewsCount: 520,
    isSaved: false,
    isFollowed: false,
    timestamp: '2 days ago',
    poll: {
      question: 'What helps you stay most consistent with exercise?',
      totalVotes: 142,
      hasVoted: false,
      options: [
        { id: 'opt-1', text: 'Brisk Outdoor Walking / Hiking', votes: 60 },
        { id: 'opt-2', text: 'Resistance & Strength Training (Gym/Weights)', votes: 40 },
        { id: 'opt-3', text: 'Home Workouts & Bodyweight Calisthenics', votes: 26 },
        { id: 'opt-4', text: 'Yoga, Pilates & Mobility Stretching', votes: 12 },
        { id: 'opt-5', text: 'Swimming & Low-Impact Aerobics', votes: 4 }
      ]
    },
    replies: [
      {
        id: 'rep-7',
        author: 'Maya_ZenWellness',
        authorRole: 'member',
        content: 'Combining morning yoga with evening brisk walks has given me sustained mental energy and zero burnout!',
        timestamp: '1 day ago',
        upvotes: 8
      }
    ]
  },
  {
    id: 'post-5',
    title: 'Managing Fatigue & Brain Fog During Thyroid Medication Dose Adjustments',
    author: 'Clara_ThyroidWarrior',
    authorRole: 'member',
    category: 'Medicines',
    postType: 'question',
    tags: ['Medicines', 'Thyroid', 'Fatigue', 'Levothyroxine'],
    content: 'My endocrinologist recently adjusted my Levothyroxine dosage from 75mcg to 88mcg. How long did it typically take for your energy levels to stabilize after a dosage adjustment?',
    upvotes: 19,
    repliesCount: 2,
    viewsCount: 160,
    isSaved: false,
    isFollowed: false,
    isAnswered: true,
    timestamp: '3 days ago',
    replies: [
      {
        id: 'rep-8',
        author: 'Dr. Marcus Vance, MD, PhD',
        authorRole: 'verified_professional',
        authorSpecialty: 'Endocrinologist & Diabetes Specialist',
        content: 'Educational Note: Levothyroxine has a plasma half-life of roughly 7 days, meaning steady-state serum T4 concentrations take 4 to 6 weeks to fully equilibrate. Patients often begin noticing improvements in lethargy around weeks 3 to 4. Always recheck TSH levels after 6 to 8 weeks.',
        timestamp: '2 days ago',
        upvotes: 12,
        isHelpful: true
      }
    ]
  }
];
