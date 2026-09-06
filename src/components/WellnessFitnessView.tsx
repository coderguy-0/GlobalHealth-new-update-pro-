import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Brain, 
  Moon, 
  Sparkles, 
  Activity, 
  Flame, 
  Dumbbell, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  ShieldAlert, 
  Calendar, 
  Bookmark, 
  Share2, 
  ChevronRight, 
  ChevronDown, 
  Compass, 
  UserCheck, 
  Zap, 
  Award, 
  Layers, 
  Check, 
  Plus, 
  Trash2, 
  Footprints, 
  Sun, 
  Smile, 
  Eye, 
  Target, 
  Info,
  Sliders,
  Scale
} from 'lucide-react';
import { 
  WELLNESS_MODULES, 
  EXERCISE_DATABASE, 
  WORKOUT_PLANS, 
  MUSCLE_GROUPS_DATA, 
  YOGA_POSES_DATA, 
  COUCH_TO_5K_PROGRAM, 
  DESK_MOBILITY_ROUTINE 
} from '../data/wellnessFitnessData';
import { ExerciseItem, WorkoutPlan, YogaPose, MuscleGroupInfo } from '../types';

interface WellnessFitnessViewProps {
  savedIds?: string[];
  onToggleSave?: (id: string) => void;
}

export const WellnessFitnessView: React.FC<WellnessFitnessViewProps> = ({
  savedIds = [],
  onToggleSave = () => {}
}) => {
  // Main Navigation Sections
  const [activeMainSection, setActiveMainSection] = useState<'wellness' | 'fitness'>('wellness');

  // Sub-tab states
  const [wellnessSubTab, setWellnessSubTab] = useState<
    'mental' | 'stress' | 'meditation' | 'sleep' | 'productivity' | 'habits' | 'mindfulness' | 'emotional' | 'lifestyle'
  >('stress');

  const [fitnessSubTab, setFitnessSubTab] = useState<
    'exercises' | 'workout-plans' | 'muscle-groups' | 'home-workouts' | 'gym-workouts' | 'yoga' | 'stretching' | 'running' | 'mobility'
  >('exercises');

  // ============================================================================
  // INTERACTIVE TOOLS STATES
  // ============================================================================

  // 1. Live Breathing Pacer
  const [breathTechnique, setBreathTechnique] = useState<'box' | '478' | 'sigh' | 'coherent'>('box');
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold Empty'>('Inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [breathTotalCycles, setBreathTotalCycles] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase according to technique
            if (breathTechnique === 'box') {
              if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 4; }
              if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 4; }
              if (breathPhase === 'Exhale') { setBreathPhase('Hold Empty'); return 4; }
              if (breathPhase === 'Hold Empty') { 
                setBreathPhase('Inhale'); 
                setBreathTotalCycles((c) => c + 1);
                return 4; 
              }
            } else if (breathTechnique === '478') {
              if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 7; }
              if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 8; }
              if (breathPhase === 'Exhale') { 
                setBreathPhase('Inhale'); 
                setBreathTotalCycles((c) => c + 1);
                return 4; 
              }
            } else if (breathTechnique === 'sigh') {
              if (breathPhase === 'Inhale') { setBreathPhase('Hold'); return 2; }
              if (breathPhase === 'Hold') { setBreathPhase('Exhale'); return 6; }
              if (breathPhase === 'Exhale') { 
                setBreathPhase('Inhale'); 
                setBreathTotalCycles((c) => c + 1);
                return 3; 
              }
            } else if (breathTechnique === 'coherent') {
              if (breathPhase === 'Inhale') { setBreathPhase('Exhale'); return 5; }
              if (breathPhase === 'Exhale') { 
                setBreathPhase('Inhale'); 
                setBreathTotalCycles((c) => c + 1);
                return 5; 
              }
            }
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, breathTechnique]);

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('Inhale');
    setBreathSecondsLeft(breathTechnique === '478' ? 4 : breathTechnique === 'sigh' ? 3 : breathTechnique === 'coherent' ? 5 : 4);
    setBreathTotalCycles(0);
  };

  // 2. Meditation Timer
  const [meditationDurationMin, setMeditationDurationMin] = useState<number>(5);
  const [meditationSecondsRemaining, setMeditationSecondsRemaining] = useState<number>(300);
  const [isMeditating, setIsMeditating] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'rain' | 'tibetan' | 'stream' | 'none'>('tibetan');

  useEffect(() => {
    let medTimer: NodeJS.Timeout;
    if (isMeditating && meditationSecondsRemaining > 0) {
      medTimer = setInterval(() => {
        setMeditationSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (meditationSecondsRemaining === 0 && isMeditating) {
      setIsMeditating(false);
    }
    return () => clearInterval(medTimer);
  }, [isMeditating, meditationSecondsRemaining]);

  const handleSetMeditationPreset = (minutes: number) => {
    setMeditationDurationMin(minutes);
    setMeditationSecondsRemaining(minutes * 60);
    setIsMeditating(false);
  };

  // 3. Sleep Calculator State
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [calculatedBedtimes, setCalculatedBedtimes] = useState<{ time: string; cycles: number; hours: string; quality: string }[]>([]);

  useEffect(() => {
    // 90 min = 1.5 hours per sleep cycle, + 15 min latency
    const [hoursStr, minsStr] = wakeTime.split(':');
    const wakeHours = parseInt(hoursStr, 10);
    const wakeMins = parseInt(minsStr, 10);
    const wakeDate = new Date();
    wakeDate.setHours(wakeHours, wakeMins, 0, 0);

    const bedtimes = [6, 5, 4, 3].map((cycles) => {
      const totalMinutes = cycles * 90 + 15; // 15 min to fall asleep
      const bedDate = new Date(wakeDate.getTime() - totalMinutes * 60 * 1000);
      const hours = bedDate.getHours().toString().padStart(2, '0');
      const mins = bedDate.getMinutes().toString().padStart(2, '0');
      return {
        time: `${hours}:${mins}`,
        cycles,
        hours: `${(cycles * 1.5).toFixed(1)} hrs`,
        quality: cycles === 5 ? 'Optimal (7.5 hrs)' : cycles === 6 ? 'Peak Recovery (9.0 hrs)' : cycles === 4 ? 'Adequate (6.0 hrs)' : 'Short (4.5 hrs)'
      };
    });
    setCalculatedBedtimes(bedtimes);
  }, [wakeTime]);

  // 4. Productivity Pomodoro Timer
  const [pomoMode, setPomoMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [pomoTimeLeft, setPomoTimeLeft] = useState<number>(25 * 60);
  const [isPomoRunning, setIsPomoRunning] = useState<boolean>(false);
  const [pomoCyclesCompleted, setPomoCyclesCompleted] = useState<number>(0);

  useEffect(() => {
    let pTimer: NodeJS.Timeout;
    if (isPomoRunning && pomoTimeLeft > 0) {
      pTimer = setInterval(() => {
        setPomoTimeLeft((t) => t - 1);
      }, 1000);
    } else if (pomoTimeLeft === 0 && isPomoRunning) {
      if (pomoMode === 'work') {
        setPomoCyclesCompleted((c) => c + 1);
        setPomoMode('shortBreak');
        setPomoTimeLeft(5 * 60);
      } else {
        setPomoMode('work');
        setPomoTimeLeft(25 * 60);
      }
      setIsPomoRunning(false);
    }
    return () => clearInterval(pTimer);
  }, [isPomoRunning, pomoTimeLeft, pomoMode]);

  // 5. Habits Tracker & Stacking
  const [customHabitAfter, setCustomHabitAfter] = useState('I finish pouring my morning coffee');
  const [customHabitWill, setCustomHabitWill] = useState('drink a full 500ml glass of water');
  const [savedHabitStacks, setSavedHabitStacks] = useState<string[]>([
    'After I pour my morning coffee, I will drink 500ml of water with electrolytes.',
    'After I shut down my laptop for the day, I will immediately change into my workout clothes.',
    'After I lie down in bed, I will write 3 things I am grateful for.'
  ]);
  const [checkedHabits, setCheckedHabits] = useState<{ [key: number]: boolean }>({ 0: true });

  const handleAddHabitStack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHabitAfter || !customHabitWill) return;
    const newStack = `After ${customHabitAfter.trim()}, I will ${customHabitWill.trim()}.`;
    setSavedHabitStacks([...savedHabitStacks, newStack]);
    setCustomHabitAfter('');
    setCustomHabitWill('');
  };

  // 6. 5-4-3-2-1 Sensory Grounding State
  const [groundingStep, setGroundingStep] = useState<number>(1);
  const groundingPrompts = [
    { step: 1, title: '5 Things You Can SEE', desc: 'Look around your room or space. Spot 5 distinct objects, patterns, or colors.', icon: '👁️', color: 'bg-amber-500' },
    { step: 2, title: '4 Things You Can TOUCH', desc: 'Feel the texture of your shirt, the firmness of the chair, the cool desk, or your feet on the floor.', icon: '✋', color: 'bg-emerald-500' },
    { step: 3, title: '3 Things You Can HEAR', desc: 'Listen beyond obvious sounds: birds outside, the hum of the AC, distant cars, or your breath.', icon: '👂', color: 'bg-sky-500' },
    { step: 4, title: '2 Things You Can SMELL', desc: 'Notice the scent of fresh air, coffee, your skin, or essential oils nearby.', icon: '👃', color: 'bg-purple-500' },
    { step: 5, title: '1 Thing You Can TASTE', desc: 'Notice the lingering taste of mint, tea, water, or simply the presence of your tongue resting.', icon: '👅', color: 'bg-rose-500' }
  ];

  // 7. Mental Wellness: Cognitive Reframing Tool
  const [unhelpfulThought, setUnhelpfulThought] = useState('');
  const [reframedThought, setReframedThought] = useState('');
  const [reframedHistory, setReframedHistory] = useState<{ thought: string; reframe: string }[]>([
    {
      thought: "I missed my workout yesterday; I ruined all my health progress.",
      reframe: "One missed workout does not undo weeks of consistency. Today is a fresh opportunity to move my body and feel energized."
    }
  ]);

  const handleAddReframe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unhelpfulThought || !reframedThought) return;
    setReframedHistory([{ thought: unhelpfulThought, reframe: reframedThought }, ...reframedHistory]);
    setUnhelpfulThought('');
    setReframedThought('');
  };

  // ============================================================================
  // FITNESS INTERACTIVE STATES
  // ============================================================================
  // Exercises filter
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState('All');
  const [selectedEquipmentFilter, setSelectedEquipmentFilter] = useState('All');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('All');

  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) || 
                          ex.primaryMuscle.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesMuscle = selectedMuscleFilter === 'All' || ex.category === selectedMuscleFilter;
    const matchesEquip = selectedEquipmentFilter === 'All' || ex.equipment === selectedEquipmentFilter;
    const matchesDiff = selectedDifficultyFilter === 'All' || ex.difficulty === selectedDifficultyFilter;
    return matchesSearch && matchesMuscle && matchesEquip && matchesDiff;
  });

  // Selected workout plan for logger
  const [activePlanId, setActivePlanId] = useState<string>('plan-functional-beginner');
  const activeWorkoutPlan = WORKOUT_PLANS.find((p) => p.id === activePlanId) || WORKOUT_PLANS[0];
  const [completedWorkoutSets, setCompletedWorkoutSets] = useState<{ [key: string]: boolean }>({});

  const toggleWorkoutSet = (key: string) => {
    setCompletedWorkoutSets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Selected Muscle Group in atlas
  const [selectedMuscleAtlasId, setSelectedMuscleAtlasId] = useState<string>('muscle-chest');
  const activeMuscleInfo = MUSCLE_GROUPS_DATA.find((m) => m.id === selectedMuscleAtlasId) || MUSCLE_GROUPS_DATA[0];

  // Selected Yoga Pose
  const [selectedYogaPoseId, setSelectedYogaPoseId] = useState<string>('yoga-downward-dog');
  const activeYogaPose = YOGA_POSES_DATA.find((y) => y.id === selectedYogaPoseId) || YOGA_POSES_DATA[0];

  // Running: Heart Rate Zone Calculator
  const [userAge, setUserAge] = useState<number>(30);
  const [userRestingHr, setUserRestingHr] = useState<number>(65);
  const maxHr = 220 - userAge;
  const hrReserve = maxHr - userRestingHr;

  const hrZones = [
    { zone: 'Zone 1 (Recovery)', range: `${Math.round(userRestingHr + hrReserve * 0.5)} - ${Math.round(userRestingHr + hrReserve * 0.6)} bpm`, desc: 'Active recovery, cellular repair, light walking' },
    { zone: 'Zone 2 (Fat Oxidation / Base)', range: `${Math.round(userRestingHr + hrReserve * 0.6)} - ${Math.round(userRestingHr + hrReserve * 0.7)} bpm`, desc: 'Mitochondrial biogenesis, optimal endurance foundation' },
    { zone: 'Zone 3 (Aerobic Tempo)', range: `${Math.round(userRestingHr + hrReserve * 0.7)} - ${Math.round(userRestingHr + hrReserve * 0.8)} bpm`, desc: 'Cardiovascular efficiency, steady-state running' },
    { zone: 'Zone 4 (Lactate Threshold)', range: `${Math.round(userRestingHr + hrReserve * 0.8)} - ${Math.round(userRestingHr + hrReserve * 0.9)} bpm`, desc: 'High-intensity intervals, builds fatigue tolerance' },
    { zone: 'Zone 5 (VO2 Max)', range: `${Math.round(userRestingHr + hrReserve * 0.9)} - ${maxHr} bpm`, desc: 'Maximum anaerobic sprint power, neuromuscular speed' }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-300">
      
      {/* ========================================================================= */}
      {/* 1. HERO HEADER: CLINICAL VITALITY & MOVEMENT */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 p-6 sm:p-10 text-white shadow-2xl mb-10">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 backdrop-blur-xs mb-4">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Evidence-Based Vitality & Movement</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Wellness, Vitality & Fitness Hub
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              Empower your mind, regulate autonomic stress, unlock restorative sleep, and sculpt functional strength with interactive clinical protocols, breathing pacers, and targeted workout guides.
            </p>

            {/* Main Category Selector Tabs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveMainSection('wellness')}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition shadow-sm ${
                  activeMainSection === 'wellness'
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-400'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <Brain className="h-4 w-4" />
                <span>🧘 Wellness & Mind Hub (9 Topics)</span>
              </button>

              <button
                onClick={() => setActiveMainSection('fitness')}
                className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold transition shadow-sm ${
                  activeMainSection === 'fitness'
                    ? 'bg-amber-500 text-white shadow-amber-500/30 ring-2 ring-amber-400'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                <Dumbbell className="h-4 w-4" />
                <span>🏋️ Fitness & Movement Hub (9 Topics)</span>
              </button>
            </div>
          </div>

          {/* Quick Vitality Pillars Stats */}
          <div className="w-full lg:w-80 rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/15 space-y-3 text-xs">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Clinical Longevity Pillars
            </div>
            <div className="space-y-2 text-slate-200">
              <div className="flex items-center justify-between">
                <span>🫁 Autonomic Vagus Tone</span>
                <span className="font-bold text-white">4 Pacing Modes</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🌙 Circadian Delta Sleep</span>
                <span className="font-bold text-white">90-min Cycles</span>
              </div>
              <div className="flex items-center justify-between">
                <span>⚡ Karvonen Zone 2</span>
                <span className="font-bold text-white">Mitochondrial Health</span>
              </div>
              <div className="flex items-center justify-between">
                <span>🦴 Daily Joint CARs</span>
                <span className="font-bold text-white">Synovial Mobility</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN SECTION: WELLNESS HUB (9 TOPICS) */}
      {/* ========================================================================= */}
      {activeMainSection === 'wellness' && (
        <div className="space-y-8">
          
          {/* Sub-Navigation for the 9 Wellness Topics */}
          <div className="border-b border-slate-200 pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'stress', label: 'Stress Management', icon: 'ShieldAlert', badge: 'Live Pacer' },
                { id: 'meditation', label: 'Meditation', icon: 'Sparkles', badge: 'Timer' },
                { id: 'mental', label: 'Mental Wellness', icon: 'Brain', badge: 'Reframing' },
                { id: 'sleep', label: 'Sleep & Circadian', icon: 'Moon', badge: 'Cycle Calc' },
                { id: 'productivity', label: 'Productivity', icon: 'Flame', badge: 'Pomodoro' },
                { id: 'habits', label: 'Healthy Habits', icon: 'CheckCircle2', badge: 'Stacker' },
                { id: 'mindfulness', label: 'Mindfulness', icon: 'Eye', badge: '5-4-3-2-1' },
                { id: 'emotional', label: 'Emotional Health', icon: 'Heart', badge: 'Granularity' },
                { id: 'lifestyle', label: 'Lifestyle & Longevity', icon: 'Sun', badge: 'Blue Zones' }
              ].map((tab) => {
                const isActive = wellnessSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setWellnessSubTab(tab.id as any)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 1: STRESS MANAGEMENT & LIVE BREATHING PACER */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'stress' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Interactive Breathing Orb */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-900 to-teal-950 p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="text-left">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Interactive Somatic Tool</div>
                    <h2 className="text-lg font-extrabold text-white">Autonomic Breathing Pacer</h2>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-300">Cycles: {breathTotalCycles}</span>
                  </div>
                </div>

                {/* Technique Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mb-6">
                  {[
                    { id: 'box', name: 'Box (4-4-4-4)', desc: 'Tactical Focus' },
                    { id: '478', name: '4-7-8 Deep', desc: 'Vagus Sleep' },
                    { id: 'sigh', name: 'Physio Sigh', desc: 'Instant Calm' },
                    { id: 'coherent', name: 'Coherent 5.5s', desc: 'HRV Harmony' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setBreathTechnique(t.id as any);
                        resetBreathing();
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold transition text-left ${
                        breathTechnique === t.id
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-white/10 text-slate-300 hover:bg-white/15'
                      }`}
                    >
                      <div>{t.name}</div>
                      <div className="text-[10px] font-normal opacity-80">{t.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Animated Breathing Circle */}
                <div className="relative my-8 flex items-center justify-center">
                  {/* Outer Glow Halo */}
                  <div className={`absolute h-64 w-64 rounded-full bg-emerald-500/20 blur-2xl transition-all duration-1000 ${
                    breathPhase === 'Inhale' ? 'scale-125 opacity-100' : 'scale-90 opacity-40'
                  }`} />

                  {/* Expanding Core Orb */}
                  <div className={`h-52 w-52 rounded-full border-4 border-emerald-400 flex flex-col items-center justify-center transition-all ease-in-out shadow-2xl ${
                    breathPhase === 'Inhale' 
                      ? 'scale-110 bg-emerald-500/30 border-emerald-300 duration-1000' 
                      : breathPhase === 'Exhale'
                      ? 'scale-85 bg-teal-800/40 border-teal-500 duration-1000'
                      : 'scale-100 bg-emerald-900/50 border-emerald-400'
                  }`}>
                    <div className="text-2xl font-black tracking-tight text-white mb-1">
                      {isBreathingActive ? breathPhase : 'Ready'}
                    </div>
                    <div className="text-4xl font-extrabold text-emerald-300">
                      {isBreathingActive ? `${breathSecondsLeft}s` : 'Start'}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      {breathPhase === 'Inhale' ? 'Breathe in slowly through nose' : breathPhase === 'Hold' ? 'Hold air gently' : breathPhase === 'Exhale' ? 'Release tension fully' : 'Pause in stillness'}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg hover:bg-emerald-600 transition"
                  >
                    {isBreathingActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isBreathingActive ? 'Pause Session' : 'Begin Breathing Pacer'}</span>
                  </button>

                  <button
                    onClick={resetBreathing}
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
                    title="Reset timer"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Clinical Stress Insights */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-700">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Vagus Nerve & Cortisol Reset</h3>
                      <div className="text-xs text-slate-500 font-medium">Physiological Mechanisms</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    The vagus nerve (Cranial Nerve X) directly innervates the sinoatrial node of the heart. Lengthening your exhale triggers acetylcholine release, immediately slowing cardiac pacing and shutting down excess cortisol.
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900 mb-0.5">1. The Physiological Sigh</div>
                      <div className="text-slate-600">Double nasal inhale inflates collapsed alveoli in lungs, followed by an extended sigh to dump excess carbon dioxide.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900 mb-0.5">2. Cold Facial Immersion</div>
                      <div className="text-slate-600">Submerging your face in cold water for 15 seconds activates the mammalian dive reflex to curb acute panic.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900 mb-0.5">3. Somatic Jaw & Shoulder Scan</div>
                      <div className="text-slate-600">Unclench your back molars and allow the tongue to rest gently on the roof of your mouth.</div>
                    </div>
                  </div>
                </div>

                {/* Clinical Guidance Card */}
                <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-5 border border-emerald-100 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl shrink-0">
                    🫁
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-900">Autonomic Regulation Principle</div>
                    <div className="text-[11px] text-emerald-700 italic">"When your breath is erratic, your sympathetic nervous system triggers cortisol. Controlled rhythmic breathing immediately activates acetylcholine release to lower heart rate."</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 2: MEDITATION & CONSCIOUS STILLNESS */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'meditation' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Meditation Bell & Timer */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm text-center">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="text-left">
                    <div className="text-xs font-bold text-emerald-600 uppercase">Mindfulness Practice</div>
                    <h2 className="text-lg font-extrabold text-slate-900">Guided Meditation Timer</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Sound:</span>
                    <select
                      value={ambientSound}
                      onChange={(e) => setAmbientSound(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700"
                    >
                      <option value="tibetan">Tibetan Singing Bowl</option>
                      <option value="rain">Gentle Rain Shower</option>
                      <option value="stream">Forest River Stream</option>
                      <option value="none">Silent Bell</option>
                    </select>
                  </div>
                </div>

                {/* Duration Presets */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {[3, 5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSetMeditationPreset(mins)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        meditationDurationMin === mins && !isMeditating
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {mins} Minutes
                    </button>
                  ))}
                </div>

                {/* Big Time Display */}
                <div className="my-6">
                  <div className="text-6xl sm:text-7xl font-black tracking-tight text-slate-900 font-mono">
                    {Math.floor(meditationSecondsRemaining / 60).toString().padStart(2, '0')}:
                    {(meditationSecondsRemaining % 60).toString().padStart(2, '0')}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {isMeditating ? 'Close your eyes, relax your shoulders, and rest on your breath.' : 'Press start when seated comfortably.'}
                  </p>
                </div>

                {/* Timer Controls */}
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => setIsMeditating(!isMeditating)}
                    className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition"
                  >
                    {isMeditating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isMeditating ? 'Pause Meditation' : 'Begin Meditation'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMeditating(false);
                      setMeditationSecondsRemaining(meditationDurationMin * 60);
                    }}
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Reset Meditation Timer"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Meditation Styles & Evidence */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-3">Core Meditation Methods</h3>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900">1. Vipassana (Breath Insight)</div>
                      <p className="text-slate-600 mt-0.5">Observe the physical sensation of breath entering the nostrils. Return without self-judgment whenever the mind wanders.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900">2. Somatic Body Scan</div>
                      <p className="text-slate-600 mt-0.5">Sequentially sweep attention from crown to toes, releasing unconscious muscular armor in the face, neck, and pelvic floor.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900">3. Metta (Loving-Kindness)</div>
                      <p className="text-slate-600 mt-0.5">Silently send wishes of peace, health, and freedom from suffering to yourself, loved ones, neutral persons, and all beings.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 3: MENTAL WELLNESS & COGNITIVE REFRAMING */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'mental' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cognitive Reframing Interactive Tool */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-emerald-600 uppercase">CBT Cognitive Hygiene</div>
                  <h2 className="text-lg font-extrabold text-slate-900">Interactive Thought Reframing Lab</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Transform catastrophic cognitive distortions and all-or-nothing thinking into balanced, objective perspectives.
                  </p>
                </div>

                <form onSubmit={handleAddReframe} className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      1. Unhelpful / Anxious Thought:
                    </label>
                    <textarea
                      rows={2}
                      value={unhelpfulThought}
                      onChange={(e) => setUnhelpfulThought(e.target.value)}
                      placeholder="e.g., If I make a single mistake on this presentation, everyone will think I am incompetent."
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-emerald-700 mb-1">
                      2. Objective, Evidence-Based Reframe:
                    </label>
                    <textarea
                      rows={2}
                      value={reframedThought}
                      onChange={(e) => setReframedThought(e.target.value)}
                      placeholder="e.g., Making a minor stumble is completely normal and human. I have prepared thoroughly and have valuable insights to share."
                      className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 p-3 text-xs focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Save Reframed Thought</span>
                  </button>
                </form>

                {/* History list */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase">Saved Thought Reframes ({reframedHistory.length}):</div>
                  {reframedHistory.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
                      <div className="flex items-start gap-2 text-rose-800">
                        <span className="font-bold shrink-0">Distortion:</span>
                        <span className="line-through opacity-80">{item.thought}</span>
                      </div>
                      <div className="flex items-start gap-2 text-emerald-900 bg-white p-2.5 rounded-xl border border-emerald-100 font-medium">
                        <span className="font-bold shrink-0 text-emerald-700">Reframe:</span>
                        <span>{item.reframe}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Primary Neurochemicals & Ways to Stimulate */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-3">Daily Neurochemical Balance</h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-950">
                      <div className="font-bold text-amber-900 flex items-center justify-between">
                        <span>⚡ Dopamine (Reward & Drive)</span>
                      </div>
                      <p className="mt-1 text-slate-600">Break large tasks into micro-wins, complete small items, and cold water exposure.</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                      <div className="font-bold text-emerald-900 flex items-center justify-between">
                        <span>🌱 Serotonin (Mood & Calm)</span>
                      </div>
                      <p className="mt-1 text-slate-600">Direct morning sunlight on skin/eyes, nature walks, and remembering past accomplishments.</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-950">
                      <div className="font-bold text-rose-900 flex items-center justify-between">
                        <span>❤️ Oxytocin (Love & Belonging)</span>
                      </div>
                      <p className="mt-1 text-slate-600">Meaningful conversations, giving compliments, petting an animal, and long hugs.</p>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100 text-sky-950">
                      <div className="font-bold text-sky-900 flex items-center justify-between">
                        <span>🏃 Endorphins (Pain Relief & Euphoria)</span>
                      </div>
                      <p className="mt-1 text-slate-600">Zone 2 cardio, resistance training, deep belly laughter, and sauna heat exposure.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 4: SLEEP ARCHITECTURE & 90-MIN CALCULATOR */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'sleep' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sleep Cycle Calculator */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-indigo-600 uppercase">Circadian Rhythm Alignment</div>
                  <h2 className="text-lg font-extrabold text-slate-900">90-Minute Sleep Cycle Calculator</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Waking up in the middle of a deep sleep stage causes grogginess (sleep inertia). Calculate optimal bedtime windows based on 90-minute sleep architecture.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    What time do you need to wake up?
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 px-4 py-2.5 text-base font-bold text-slate-900 focus:border-indigo-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700">Target Bedtimes (including 15m to fall asleep):</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {calculatedBedtimes.map((item, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border transition ${
                          item.cycles === 5
                            ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-400'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-black text-slate-900 font-mono">{item.time}</div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            item.cycles === 5 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {item.cycles} Cycles
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-slate-700 mt-1">{item.hours} total sleep</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{item.quality}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sleep Hygiene Protocol */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-100 text-indigo-700">
                      <Moon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">Circadian Sleep Rules</h3>
                      <div className="text-xs text-slate-500 font-medium">Glymphatic Brain Detox</div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <span className="font-bold text-indigo-600">10h:</span>
                      <span>No caffeine 10 hours before sleep (adenosine clearance).</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <span className="font-bold text-indigo-600">3h:</span>
                      <span>No heavy meals or alcohol 3 hours before sleep (preserves REM).</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <span className="font-bold text-indigo-600">1h:</span>
                      <span>Digital sunset: dim overhead lighting and silence notifications.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
                      <span className="font-bold text-indigo-600">67°F:</span>
                      <span>Keep the room cool (19°C) to allow core temperature drop.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 5: PRODUCTIVITY & POMODORO */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'productivity' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Pomodoro Timer */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm text-center">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="text-left">
                    <div className="text-xs font-bold text-amber-600 uppercase">Ultradian Focus Rhythms</div>
                    <h2 className="text-lg font-extrabold text-slate-900">Deep Work Pomodoro Engine</h2>
                  </div>
                  <div className="text-xs font-bold text-slate-600">
                    Sessions Done: <span className="text-amber-600 font-extrabold">{pomoCyclesCompleted}</span>
                  </div>
                </div>

                {/* Mode Selector */}
                <div className="flex justify-center gap-2 mb-6">
                  <button
                    onClick={() => {
                      setPomoMode('work');
                      setPomoTimeLeft(25 * 60);
                      setIsPomoRunning(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      pomoMode === 'work' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Focus (25m)
                  </button>
                  <button
                    onClick={() => {
                      setPomoMode('shortBreak');
                      setPomoTimeLeft(5 * 60);
                      setIsPomoRunning(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      pomoMode === 'shortBreak' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Short Break (5m)
                  </button>
                  <button
                    onClick={() => {
                      setPomoMode('longBreak');
                      setPomoTimeLeft(15 * 60);
                      setIsPomoRunning(false);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      pomoMode === 'longBreak' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Long Break (15m)
                  </button>
                </div>

                {/* Clock */}
                <div className="my-6">
                  <div className="text-7xl font-black tracking-tight text-slate-900 font-mono">
                    {Math.floor(pomoTimeLeft / 60).toString().padStart(2, '0')}:
                    {(pomoTimeLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-2">
                    {pomoMode === 'work' ? '🔥 Deep Focus Phase — Zero Context Switching' : '☕ Active Recovery Phase — Hydrate & Move'}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-3">
                  <button
                    onClick={() => setIsPomoRunning(!isPomoRunning)}
                    className="flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition"
                  >
                    {isPomoRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span>{isPomoRunning ? 'Pause Sprint' : 'Start Focus Sprint'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPomoRunning(false);
                      setPomoTimeLeft(pomoMode === 'work' ? 25 * 60 : pomoMode === 'shortBreak' ? 5 * 60 : 15 * 60);
                    }}
                    className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Eisenhower Matrix Guide */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-3">The Eisenhower Priority Matrix</h3>
                  <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-950">
                      <div className="font-bold text-red-700">1. DO FIRST</div>
                      <div className="text-slate-600">Urgent & Important (Crises, deadlines)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-950">
                      <div className="font-bold text-emerald-700">2. SCHEDULE</div>
                      <div className="text-slate-600">Important, Not Urgent (Exercise, deep work)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-950">
                      <div className="font-bold text-amber-700">3. DELEGATE</div>
                      <div className="text-slate-600">Urgent, Not Important (Interruptions)</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
                      <div className="font-bold text-slate-700">4. ELIMINATE</div>
                      <div className="text-slate-500">Not Urgent, Not Important (Doomscrolling)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 6: HEALTHY HABITS & STACK BUILDER */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'habits' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Habit Stacking Generator */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-emerald-600 uppercase">Behavioral Architecture</div>
                  <h2 className="text-lg font-extrabold text-slate-900">Interactive Habit Stack Builder</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Anchor a new 2-minute micro-habit to an already established neural groove (Current Habit).
                  </p>
                </div>

                <form onSubmit={handleAddHabitStack} className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Current Established Trigger:
                      </label>
                      <input
                        type="text"
                        value={customHabitAfter}
                        onChange={(e) => setCustomHabitAfter(e.target.value)}
                        placeholder="e.g. I finish brushing my teeth"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-emerald-700 mb-1">
                        New 2-Minute Health Micro-Habit:
                      </label>
                      <input
                        type="text"
                        value={customHabitWill}
                        onChange={(e) => setCustomHabitWill(e.target.value)}
                        placeholder="e.g. do 10 deep belly breaths"
                        className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5 text-xs focus:border-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Habit Stack</span>
                  </button>
                </form>

                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-500 uppercase">Active Habit Stacks ({savedHabitStacks.length}):</div>
                  {savedHabitStacks.map((stack, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCheckedHabits((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        checkedHabits[idx]
                          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-xs font-medium">
                        <div className={`grid h-5 w-5 place-items-center rounded-lg border ${
                          checkedHabits[idx] ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {checkedHabits[idx] && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <span>{stack}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">
                        {checkedHabits[idx] ? 'Done Today ✓' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 20 High-ROI Habits Library */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-3">High-ROI Daily Micro-Habits</h3>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <Sun className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>10-min outdoor morning sunlight within 1 hr of waking</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>500ml water + pinch of sea salt before morning coffee</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <Footprints className="h-4 w-4 text-sky-500 shrink-0" />
                      <span>10-minute post-meal brisk walk to blunt blood glucose spikes</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
                      <Moon className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span>No screens inside the bedroom after 9:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 7: MINDFULNESS & 5-4-3-2-1 SENSORY RESET */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'mindfulness' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Interactive 5-4-3-2-1 Tool */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-emerald-600 uppercase">Somatic Grounding</div>
                  <h2 className="text-lg font-extrabold text-slate-900">5-4-3-2-1 Sensory Grounding Tool</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Shift blood flow from the hyperactive default mode network (anxious rumination) into direct sensory awareness.
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-between gap-1.5 mb-8">
                  {groundingPrompts.map((p) => (
                    <button
                      key={p.step}
                      onClick={() => setGroundingStep(p.step)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                        groundingStep === p.step
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span className="hidden sm:inline">Step {p.step}</span>
                    </button>
                  ))}
                </div>

                {/* Active Prompt Card */}
                {(() => {
                  const currentPrompt = groundingPrompts[groundingStep - 1];
                  return (
                    <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center mb-6 animate-in fade-in">
                      <div className="text-4xl mb-2">{currentPrompt.icon}</div>
                      <h3 className="text-xl font-extrabold text-slate-900 mb-2">{currentPrompt.title}</h3>
                      <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                        {currentPrompt.desc}
                      </p>
                    </div>
                  );
                })()}

                <div className="flex justify-between items-center">
                  <button
                    disabled={groundingStep === 1}
                    onClick={() => setGroundingStep((s) => Math.max(1, s - 1))}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-40"
                  >
                    &larr; Previous Sense
                  </button>

                  <button
                    onClick={() => {
                      if (groundingStep < 5) setGroundingStep((s) => s + 1);
                      else setGroundingStep(1);
                    }}
                    className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    {groundingStep === 5 ? 'Restart Grounding Loop' : 'Next Sense &rarr;'}
                  </button>
                </div>
              </div>

              {/* Mindful Eating Protocol */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-3">Mindful Eating Principles</h3>
                  <div className="space-y-3 text-xs text-slate-700">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900">1. The 3-Breath Pause</div>
                      <p className="text-slate-600 mt-0.5">Take 3 conscious breaths before your first forkful to shift into parasympathetic digestive mode.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900">2. Put the Fork Down Between Bites</div>
                      <p className="text-slate-600 mt-0.5">Allow chew cycle to complete (20–30 chews) before loading the next bite to enhance satiety hormones (CCK & GLP-1).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 8: EMOTIONAL HEALTH */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'emotional' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-rose-600 uppercase">Affective Neuroscience</div>
                  <h2 className="text-lg font-extrabold text-slate-900">Emotional Granularity & Somatics</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Labeling specific emotions ("Name It to Tame It") reduces amygdala reactivity by recruiting the left ventrolateral prefrontal cortex.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { name: 'Overwhelmed', somatic: 'Tight chest, shallow breath', cure: 'Eisenhower matrix + single task' },
                    { name: 'Resentful', somatic: 'Clenched jaw, heated neck', cure: 'Clarify boundaries & unvoiced needs' },
                    { name: 'Restless', somatic: 'Tapping foot, fidgeting', cure: 'Brisk 15-min walk outdoors' },
                    { name: 'Grateful', somatic: 'Warmth in chest, relaxed face', cure: 'Savor feeling for 20 seconds' },
                    { name: 'Vulnerable', somatic: 'Knot in stomach', cure: 'Self-compassion hand on heart' },
                    { name: 'Exhausted', somatic: 'Heavy eyelids, brain fog', cure: 'Non-Sleep Deep Rest (NSDR)' }
                  ].map((emo, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="font-extrabold text-slate-900 text-sm mb-1">{emo.name}</div>
                      <div className="text-[11px] text-slate-500 mb-1.5"><span className="font-semibold">Body:</span> {emo.somatic}</div>
                      <div className="text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded-lg font-medium"><span className="font-bold">Remedy:</span> {emo.cure}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-3">Self-Compassion Pause</h3>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    When facing shame or self-criticism, follow Dr. Kristin Neff’s 3-step self-compassion triad:
                  </p>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-rose-700">1. Mindfulness:</span> "This is a moment of real suffering / difficulty."
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-rose-700">2. Common Humanity:</span> "Difficulty and imperfection are part of the shared human experience; I am not alone."
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-rose-700">3. Kindness:</span> "May I be gentle and patient with myself in this moment."
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* WELLNESS TOPIC 9: LIFESTYLE & LONGEVITY (BLUE ZONES) */}
          {/* ------------------------------------------------------------------- */}
          {wellnessSubTab === 'lifestyle' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-emerald-600 uppercase">Blue Zones Research</div>
                  <h2 className="text-lg font-extrabold text-slate-900">The 9 Power Principles of Centenarians</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Lessons from Okinawa (Japan), Ikaria (Greece), Sardinia (Italy), Nicoya (Costa Rica), and Loma Linda (California).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {[
                    { title: 'Move Naturally', desc: 'Incorporate walking, gardening, and stair-climbing into regular daily life.' },
                    { title: 'Hara Hachi Bu', desc: 'Stop eating when your stomach feels 80% full to prevent metabolic strain.' },
                    { title: 'Plant Slant', desc: 'Beans, greens, berries, whole grains, and nuts form the dietary cornerstone.' },
                    { title: 'Purpose (Ikigai)', desc: 'Know your reason for waking up in the morning; extends lifespan by ~7 years.' },
                    { title: 'Down Shift', desc: 'Daily rituals to shed stress: prayer, afternoon siesta, or meditation.' },
                    { title: 'Belonging', desc: 'Being part of a faith-based or purpose-driven community adds 4–14 years.' },
                    { title: 'Loved Ones First', desc: 'Keep aging parents nearby, commit to a life partner, invest in children.' },
                    { title: 'Right Tribe', desc: 'Surround yourself with people who naturally reinforce healthy lifestyle norms.' },
                    { title: 'Moderate Sips', desc: 'Enjoy polyphenol-rich herbal teas or moderate red wine with meals.' }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="font-extrabold text-slate-900 text-sm mb-1">{idx + 1}. {p.title}</div>
                      <p className="text-slate-600 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">Digital Detox Routine</h3>
                  <p className="text-xs text-slate-600 mb-4">
                    Protect cognitive bandwidth with strict boundary filters:
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Phone charges outside the bedroom</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Zero notifications for news & social apps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Weekly half-day offline Sabbath in nature</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MAIN SECTION: FITNESS HUB (9 TOPICS) */}
      {/* ========================================================================= */}
      {activeMainSection === 'fitness' && (
        <div className="space-y-8">
          
          {/* Sub-Navigation for the 9 Fitness Topics */}
          <div className="border-b border-slate-200 pb-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'exercises', label: 'Exercises Database', badge: 'Form & Cues' },
                { id: 'workout-plans', label: 'Workout Plans', badge: '4-8 Weeks' },
                { id: 'muscle-groups', label: 'Muscle Groups Atlas', badge: 'Interactive' },
                { id: 'home-workouts', label: 'Home Workouts', badge: 'No Gear' },
                { id: 'gym-workouts', label: 'Gym Barbell Splits', badge: 'PPL & RPE' },
                { id: 'yoga', label: 'Yoga & Asanas', badge: 'Sequences' },
                { id: 'stretching', label: 'Stretching & Posture', badge: '10-Min Desk' },
                { id: 'running', label: 'Running & HR Zones', badge: 'C25K' },
                { id: 'mobility', label: 'Joint Mobility & CARs', badge: 'Longevity' }
              ].map((tab) => {
                const isActive = fitnessSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFitnessSubTab(tab.id as any)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 1: EXERCISE REPOSITORY */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'exercises' && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Search Exercise:</label>
                    <input
                      type="text"
                      placeholder="e.g., Squat, Push-up, RDL..."
                      value={exerciseSearch}
                      onChange={(e) => setExerciseSearch(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Region:</label>
                    <select
                      value={selectedMuscleFilter}
                      onChange={(e) => setSelectedMuscleFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
                    >
                      <option value="All">All Regions</option>
                      <option value="Upper Body">Upper Body</option>
                      <option value="Lower Body">Lower Body</option>
                      <option value="Core">Core</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Equipment:</label>
                    <select
                      value={selectedEquipmentFilter}
                      onChange={(e) => setSelectedEquipmentFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
                    >
                      <option value="All">All Equipment</option>
                      <option value="Bodyweight">Bodyweight</option>
                      <option value="Dumbbells">Dumbbells</option>
                      <option value="Barbell">Barbell</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty:</label>
                    <select
                      value={selectedDifficultyFilter}
                      onChange={(e) => setSelectedDifficultyFilter(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-bold text-slate-800"
                    >
                      <option value="All">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Exercises Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((ex) => (
                  <div
                    key={ex.id}
                    className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {ex.imageUrl && (
                        <div className="h-44 w-full overflow-hidden relative">
                          <img
                            src={ex.imageUrl}
                            alt={ex.name}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            <span className="rounded-lg bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-extrabold text-white">
                              {ex.category}
                            </span>
                            <span className="rounded-lg bg-amber-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                              {ex.difficulty}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        <h3 className="text-base font-extrabold text-slate-900 mb-1">{ex.name}</h3>
                        <div className="text-xs font-bold text-amber-700 mb-3">
                          Primary: {ex.primaryMuscle}
                        </div>

                        {/* Form Cues */}
                        <div className="mb-3">
                          <div className="text-[11px] font-bold text-slate-500 uppercase mb-1">Key Form Cues:</div>
                          <ul className="space-y-1 text-xs text-slate-700">
                            {ex.formCues.slice(0, 3).map((cue, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{cue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Tempo & Prescription */}
                        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs">
                          <div>
                            <div className="text-[10px] text-slate-500 font-semibold">Tempo:</div>
                            <div className="font-mono font-bold text-slate-800">{ex.tempo}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-slate-500 font-semibold">Target Volume:</div>
                            <div className="font-bold text-slate-800">{ex.targetSetsReps}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 2: STRUCTURED WORKOUT PLANS */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'workout-plans' && (
            <div className="space-y-6">
              {/* Plan Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {WORKOUT_PLANS.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setActivePlanId(plan.id)}
                    className={`p-5 rounded-3xl border text-left transition ${
                      activePlanId === plan.id
                        ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-500'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                        {plan.level}
                      </span>
                      <span className="text-xs font-bold text-slate-500">{plan.durationWeeks} Weeks</span>
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm mb-1">{plan.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{plan.goal}</p>
                  </button>
                ))}
              </div>

              {/* Active Plan Detail & Interactive Workout Session Logger */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                  <div>
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                      {activeWorkoutPlan.frequency} • {activeWorkoutPlan.sessionDurationMin} Min Sessions
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 mt-1">{activeWorkoutPlan.title}</h2>
                    <p className="text-xs text-slate-600 mt-1">{activeWorkoutPlan.description}</p>
                  </div>
                </div>

                {/* Day-by-Day Schedule */}
                <div className="space-y-6">
                  {activeWorkoutPlan.schedule.map((daySchedule, dayIdx) => (
                    <div key={dayIdx} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-xs font-extrabold text-amber-700 uppercase">{daySchedule.day}</div>
                          <div className="font-extrabold text-slate-900 text-base">{daySchedule.focus}</div>
                        </div>
                      </div>

                      {/* Exercise Table with Check-off buttons */}
                      <div className="space-y-2">
                        {daySchedule.exercises.map((ex, exIdx) => {
                          const key = `${activeWorkoutPlan.id}-${dayIdx}-${exIdx}`;
                          const isDone = !!completedWorkoutSets[key];
                          return (
                            <div
                              key={exIdx}
                              onClick={() => toggleWorkoutSet(key)}
                              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer transition ${
                                isDone ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200 hover:bg-slate-100/80'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`grid h-6 w-6 place-items-center rounded-lg border ${
                                  isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isDone && <Check className="h-4 w-4" />}
                                </div>
                                <div>
                                  <div className={`font-bold text-xs ${isDone ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                                    {ex.exerciseName}
                                  </div>
                                  {ex.notes && <div className="text-[11px] text-slate-500">{ex.notes}</div>}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pl-9 sm:pl-0">
                                <span>{ex.sets} Sets × {ex.reps}</span>
                                <span className="text-slate-400 font-normal">Rest: {ex.restSec}s</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 3: MUSCLE GROUPS ATLAS */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'muscle-groups' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Muscle Selector List */}
              <div className="lg:col-span-4 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Select Muscle Anatomy:</div>
                {MUSCLE_GROUPS_DATA.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMuscleAtlasId(m.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                      selectedMuscleAtlasId === m.id
                        ? 'bg-amber-500 text-white shadow-md font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{m.name}</div>
                      <div className={`text-[10px] ${selectedMuscleAtlasId === m.id ? 'text-amber-100' : 'text-slate-500'}`}>
                        {m.region}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </button>
                ))}
              </div>

              {/* Detailed Muscle Information Card */}
              <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-amber-600 uppercase">{activeMuscleInfo.region}</div>
                  <h2 className="text-2xl font-extrabold text-slate-900">{activeMuscleInfo.name}</h2>
                </div>

                <div className="space-y-5 text-xs text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-1">Anatomical Biomechanics & Role:</h4>
                    <p className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 leading-relaxed">
                      {activeMuscleInfo.anatomicalFunction}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                      <h4 className="font-bold text-emerald-950 mb-2">Best Compound Builders:</h4>
                      <ul className="space-y-1">
                        {activeMuscleInfo.primaryExercises.map((e, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-emerald-900">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                      <h4 className="font-bold text-sky-950 mb-2">Targeted Isolation Exercises:</h4>
                      <ul className="space-y-1">
                        {activeMuscleInfo.isolationExercises.map((e, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-sky-900">
                            <Check className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <h4 className="font-bold text-amber-950 mb-1">🛡️ Injury Prevention & Joint Longevity:</h4>
                    <p className="text-amber-900 leading-relaxed">{activeMuscleInfo.injuryPreventionTip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 4: HOME WORKOUTS & ZERO GEAR */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'home-workouts' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-amber-600 uppercase">Zero-Equipment Calisthenics</div>
                  <h2 className="text-lg font-extrabold text-slate-900">15-Minute Apartment HIIT Fat Burner</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    No jumping (low-impact on joints and silent for neighbors). 40 seconds work, 20 seconds rest across 3 rounds.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: '1. Tempo Bodyweight Squats (3s down, 1s hold)', target: 'Quads & Glutes' },
                    { name: '2. Incline Push-Ups / Floor Push-Ups', target: 'Chest, Triceps & Core' },
                    { name: '3. Reverse Lunges with Knee Drive', target: 'Hamstrings & Balance' },
                    { name: '4. Prone Cobra Back Extensions', target: 'Upper Back & Posture' },
                    { name: '5. Plank Knee-to-Elbow Drives', target: 'Transverse Abdominis' }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        {item.target}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calisthenics Biomechanics Guidance */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
                      🏋️
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">Mechanical Leverage & Progressive Overload</h3>
                      <div className="text-xs text-teal-700 font-semibold">Bodyweight Resistance Biomechanics</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    By manipulating mechanical leverage, tempo pauses, and time under tension, bodyweight calisthenics delivers elite myofibrillar hypertrophy, tendon resilience, and neuromuscular control without heavy equipment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 5: GYM BARBELL MECHANICS & RPE */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'gym-workouts' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-amber-600 uppercase">Powerlifting & Hypertrophy Principles</div>
                  <h2 className="text-lg font-extrabold text-slate-900">RPE (Rate of Perceived Exertion) Scale</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Auto-regulate your training volume and prevent central nervous system overtraining using RPE & Reps in Reserve (RIR).
                  </p>
                </div>

                <div className="space-y-2.5 text-xs">
                  {[
                    { rpe: 'RPE 10', rir: '0 RIR', desc: 'Maximal effort. Could not complete another rep even with life on the line.' },
                    { rpe: 'RPE 9', rir: '1 RIR', desc: 'Extremely heavy. 1 clean rep left in the tank. Peak strength zone.' },
                    { rpe: 'RPE 8', rir: '2 RIR', desc: 'Heavy. 2 reps left in the tank. The sweet spot for hypertrophy & mass.' },
                    { rpe: 'RPE 7', rir: '3 RIR', desc: 'Moderate weight with explosive bar velocity. Power & warm-up zone.' },
                    { rpe: 'RPE 6', rir: '4+ RIR', desc: 'Light effort. Technique rehearsal and deload workouts.' }
                  ].map((r, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg text-xs">{r.rpe}</span>
                        <span className="font-semibold text-slate-900">{r.desc}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap">{r.rir}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-3">The Big 5 Barbell Lifts</h3>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="p-2.5 rounded-xl bg-slate-50">1. Barbell Back Squat (Quad & Core Foundation)</div>
                    <div className="p-2.5 rounded-xl bg-slate-50">2. Conventional Deadlift (Posterior Chain Power)</div>
                    <div className="p-2.5 rounded-xl bg-slate-50">3. Flat Barbell Bench Press (Pectoral Power)</div>
                    <div className="p-2.5 rounded-xl bg-slate-50">4. Standing Overhead Press (Shoulder Armor)</div>
                    <div className="p-2.5 rounded-xl bg-slate-50">5. Barbell Bent-Over Row (Upper Back Thickness)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 6: YOGA ASANAS & POSES */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'yoga' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Yoga Poses Selector */}
              <div className="lg:col-span-4 space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase mb-2">Select Yoga Pose (Asana):</div>
                {YOGA_POSES_DATA.map((pose) => (
                  <button
                    key={pose.id}
                    onClick={() => setSelectedYogaPoseId(pose.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                      selectedYogaPoseId === pose.id
                        ? 'bg-teal-600 text-white shadow-md font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{pose.englishName}</div>
                      <div className={`text-[10px] italic ${selectedYogaPoseId === pose.id ? 'text-teal-100' : 'text-slate-500'}`}>
                        {pose.sanskritName}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </button>
                ))}
              </div>

              {/* Active Yoga Pose Detail */}
              <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="h-56 w-full relative">
                  <img
                    src={activeYogaPose.imageUrl}
                    alt={activeYogaPose.englishName}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-500 text-white w-max mb-1">
                      {activeYogaPose.category} • {activeYogaPose.difficulty}
                    </span>
                    <h2 className="text-2xl font-black text-white">{activeYogaPose.englishName}</h2>
                    <div className="text-xs text-teal-300 italic">{activeYogaPose.sanskritName}</div>
                  </div>
                </div>

                <div className="p-6 space-y-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-[11px] mb-1">Step-by-Step Alignment Cues:</h4>
                    <ul className="space-y-1.5 text-slate-700">
                      {activeYogaPose.alignmentCues.map((cue, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100">
                    <h4 className="font-bold text-teal-950 mb-1">🌬️ Pranayama (Breathing Synchronization):</h4>
                    <p className="text-teal-900">{activeYogaPose.breathingTip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 7: STRETCHING & 10-MIN DESK POSTURE */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'stretching' && (
            <div className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-amber-600 uppercase">Ergonomics & Posture Alignment</div>
                  <h2 className="text-xl font-extrabold text-slate-900">10-Minute Desk Worker Posture Recovery</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Reverse upper cross syndrome, forward head posture, and shortened hip flexors from prolonged sitting.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DESK_MOBILITY_ROUTINE.map((m) => (
                    <div key={m.step} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg text-[10px]">
                            Step {m.step}
                          </span>
                          <span className="font-bold text-slate-500">{m.duration}</span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mb-1">{m.name}</h4>
                        <div className="text-[11px] font-semibold text-emerald-700 mb-2">Target: {m.target}</div>
                        <p className="text-slate-600 leading-relaxed">{m.cues}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 8: RUNNING & HEART RATE ZONES */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'running' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* HR Zone Calculator */}
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-sky-600 uppercase">Cardiovascular Aerobic Capacity</div>
                  <h2 className="text-lg font-extrabold text-slate-900">Karvonen Heart Rate Zone Calculator</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Calculate your exact Zone 2 fat-burning and mitochondrial threshold targets.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Age:</label>
                    <input
                      type="number"
                      value={userAge}
                      onChange={(e) => setUserAge(parseInt(e.target.value, 10) || 30)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Resting HR (bpm):</label>
                    <input
                      type="number"
                      value={userRestingHr}
                      onChange={(e) => setUserRestingHr(parseInt(e.target.value, 10) || 60)}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold focus:border-sky-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  {hrZones.map((z, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        idx === 1
                          ? 'bg-sky-50/90 border-sky-300 ring-2 ring-sky-400 text-sky-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-sm">{z.zone}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{z.desc}</div>
                      </div>
                      <div className="font-mono font-black text-sm text-sky-700">{z.range}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Couch to 5K Plan */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">Couch to 5K (C25K) Roadmap</h3>
                  <div className="space-y-2 text-xs">
                    {COUCH_TO_5K_PROGRAM.slice(0, 4).map((c) => (
                      <div key={c.week} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <div className="text-slate-600 mt-0.5">{c.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------------- */}
          {/* FITNESS TOPIC 9: JOINT MOBILITY & CARs */}
          {/* ------------------------------------------------------------------- */}
          {fitnessSubTab === 'mobility' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <div className="text-xs font-bold text-emerald-600 uppercase">Functional Range Conditioning (FRC)</div>
                  <h2 className="text-xl font-extrabold text-slate-900">Daily Morning CARs (Controlled Articular Rotations)</h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Send synovial fluid nutrients to cartilage, expand active joint range of motion, and prevent osteoarthritis.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">1. Neck / Cervical Spine CARs (3 reps each way)</h4>
                    <p className="text-slate-600">Flex chin to chest, glide along collarbone, tilt ear to shoulder, rotate fully without moving torso.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">2. Glenohumeral (Shoulder) CARs</h4>
                    <p className="text-slate-600">Lift arm across body, overhead, rotate thumb down, sweep back to hip without arching lower back.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">3. Hip 90/90 Rotations</h4>
                    <p className="text-slate-600">Sit on floor with knees at 90 degrees. Transition smoothly from right to left without lifting feet off the mat.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-1">4. Ankle Dorsiflexion Waves</h4>
                    <p className="text-slate-600">Trace large circles with big toe while holding shin bone still to ensure ankle isolated rotation.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">Why Mobility Matters</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Flexibility is passive range of motion. <strong>Mobility</strong> is active strength and neurological control over that range. Training mobility prevents soft tissue tears and guarantees lifelong independence.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
