import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Activity,
  Flame,
  Droplets,
  HeartPulse,
  ArrowRight,
  Scale,
  Sparkles,
  Zap,
} from 'lucide-react';
import { NavigationTab } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface InteractiveHealthToolsSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

export const InteractiveHealthToolsSection: React.FC<InteractiveHealthToolsSectionProps> = ({
  onTabChange,
}) => {
  const [height, setHeight] = useState<number>(170); // cm
  const [weight, setWeight] = useState<number>(68); // kg
  const [activity, setActivity] = useState<'sedentary' | 'moderate' | 'active'>('moderate');

  // Live BMI calculation
  const bmi = useMemo(() => {
    const hMeter = height / 100;
    if (hMeter <= 0 || weight <= 0) return 0;
    return Number((weight / (hMeter * hMeter)).toFixed(1));
  }, [height, weight]);

  const bmiCategory = useMemo(() => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    if (bmi < 24.9) return { label: 'Normal Weight (Optimal)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (bmi < 29.9) return { label: 'Overweight', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Obese Range', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }, [bmi]);

  // Daily Calorie Estimate (Mifflin-St Jeor approx)
  const calories = useMemo(() => {
    const baseBmr = 10 * weight + 6.25 * height - 5 * 30 + 5;
    const factor = activity === 'sedentary' ? 1.2 : activity === 'moderate' ? 1.55 : 1.75;
    return Math.round(baseBmr * factor);
  }, [height, weight, activity]);

  // Hydration Target
  const waterIntake = useMemo(() => {
    const baseLiters = (weight * 0.033).toFixed(1);
    return baseLiters;
  }, [weight]);

  const TOOL_CARDS = [
    {
      id: 'bmi',
      title: 'Body Mass Index (BMI)',
      desc: 'Evaluate body mass classification against WHO reference ranges.',
      icon: <Scale className="h-4.5 w-4.5 text-emerald-600" />,
    },
    {
      id: 'bmr',
      title: 'Basal Metabolic Rate',
      desc: 'Determine daily resting calorie expenditure and metabolic speed.',
      icon: <Flame className="h-4.5 w-4.5 text-amber-600" />,
    },
    {
      id: 'heart-rate',
      title: 'Target Heart Rate Zones',
      desc: 'Aerobic and cardiovascular intensity thresholds for exercise.',
      icon: <HeartPulse className="h-4.5 w-4.5 text-rose-600" />,
    },
    {
      id: 'macros',
      title: 'Macro & Nutrient Split',
      desc: 'Personalized protein, carb and healthy fat distribution.',
      icon: <Zap className="h-4.5 w-4.5 text-indigo-600" />,
    },
  ];

  return (
    <section className="gh-section bg-slate-50/70" aria-labelledby="tools-title">
      <div className="gh-container">
        <SectionHeading
          id="tools-title"
          eyebrow="Clinical &amp; Wellness Tools"
          title="Interactive Health Metrics &amp; Diagnostics"
          description="Instant evidence-based calculations to assess body composition, energy expenditure, and baseline metabolic metrics."
          align="center"
        />

        {/* Symmetrical 2-Column Grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Live Interactive Vitality Calculator (6 cols) */}
          <div className="lg:col-span-6 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-medical-50 text-medical-600">
                  <Calculator className="h-4.5 w-4.5" />
                </span>
                <span className="text-sm font-bold text-slate-900">Live Body Metric Simulator</span>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                ● Real-time
              </span>
            </div>

            {/* Slider Controls */}
            <div className="mt-6 space-y-5">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Height</span>
                  <span className="font-bold text-medical-700">{height} cm</span>
                </div>
                <input
                  type="range"
                  min="130"
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="mt-2 w-full accent-medical-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Weight</span>
                  <span className="font-bold text-medical-700">{weight} kg</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="160"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="mt-2 w-full accent-medical-600 h-2 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">Daily Activity Level</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sedentary', label: 'Light / Desk' },
                    { id: 'moderate', label: 'Moderate (3-4x)' },
                    { id: 'active', label: 'High Active' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setActivity(lvl.id as any)}
                      className={`rounded-xl py-2 text-[11px] font-bold transition border ${
                        activity === lvl.id
                          ? 'bg-medical-600 text-white border-medical-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Symmetrical Calculated Metrics Grid (3 stats) */}
            <div className="mt-7 grid grid-cols-3 gap-3 pt-6 border-t border-slate-100">
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-medical-50/60 border border-medical-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">BMI Index</span>
                <span className="mt-1 text-xl font-extrabold text-medical-900">{bmi}</span>
                <span className={`mt-1 rounded-md px-1.5 py-0.5 text-[9px] font-bold border ${bmiCategory.color}`}>
                  {bmiCategory.label.split(' ')[0]}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. TDEE</span>
                <span className="mt-1 text-xl font-extrabold text-amber-900">{calories}</span>
                <span className="mt-1 text-[9px] font-bold text-amber-700">kcal / day</span>
              </div>

              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-sky-50/60 border border-sky-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hydration</span>
                <span className="mt-1 text-xl font-extrabold text-sky-900">{waterIntake}L</span>
                <span className="mt-1 text-[9px] font-bold text-sky-700">water / day</span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              className="mt-6"
              onClick={() => onTabChange('calculators')}
            >
              Open Full Clinical Calculator Suite
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Column: Symmetrical Suite of Clinical Health Tools (6 cols) */}
          <div className="lg:col-span-6 grid gap-4 sm:grid-cols-2">
            {TOOL_CARDS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => onTabChange('calculators')}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-5 text-left shadow-soft transition duration-200 hover:-translate-y-1 hover:border-medical-200 hover:shadow-lift"
              >
                <div>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-50 border border-slate-100 transition group-hover:bg-medical-50">
                    {tool.icon}
                  </span>
                  <h4 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-medical-800">
                    {tool.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                </div>

                <div className="mt-5 flex items-center gap-1 text-xs font-bold text-medical-700 group-hover:underline">
                  Launch Tool <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
