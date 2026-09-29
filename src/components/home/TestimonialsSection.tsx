import React, { useEffect, useState } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, BadgeCheck } from 'lucide-react';
import { NavigationTab } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface TestimonialsSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

interface Story {
  name: string;
  role: string;
  location: string;
  initials: string;
  accent: string;
  rating: number;
  quote: string;
  context: string;
}

const STORIES: Story[] = [
  {
    name: 'Dr. Amara Okonkwo',
    role: 'Consultant Cardiologist',
    location: 'Lagos, Nigeria',
    initials: 'AO',
    accent: 'from-rose-500 to-rose-700',
    rating: 5,
    quote:
      'I use the medicine interaction checker before every polypharmacy review. It surfaces the contraindications that matter in seconds, and the citations let me verify the source rather than trusting a black box.',
    context: 'Uses GlobalHealth for drug-interaction screening',
  },
  {
    name: 'Priya Raghunathan',
    role: 'Patient · Type 2 Diabetes',
    location: 'Chennai, India',
    initials: 'PR',
    accent: 'from-medical-500 to-medical-700',
    rating: 5,
    quote:
      'When I was first diagnosed I understood nothing. The disease guide explained HbA1c in language I could actually follow, and the lab-test pages told me exactly what to expect before every blood draw.',
    context: 'Tracks 4 years of lab results in her health record',
  },
  {
    name: 'Marcus Lindqvist',
    role: 'Emergency Nurse',
    location: 'Stockholm, Sweden',
    initials: 'ML',
    accent: 'from-emerald-500 to-emerald-700',
    rating: 5,
    quote:
      'The facility map is the part I rely on. Being able to see which hospitals report available ICU capacity and blood-bank stock changes how we route patients during a surge.',
    context: 'Coordinates bed availability across a 6-hospital network',
  },
  {
    name: 'Sofia Herrera',
    role: 'Caregiver',
    location: 'Bogotá, Colombia',
    initials: 'SH',
    accent: 'from-violet-500 to-violet-700',
    rating: 5,
    quote:
      'I manage my father’s medications, appointments, and doctor access. Issuing a time-limited consent token when a new specialist needs his records — and revoking it the next day — is genuinely reassuring.',
    context: 'Manages consent for an elderly parent’s records',
  },
  {
    name: 'Dr. Kenji Nakamura',
    role: 'General Practitioner',
    location: 'Osaka, Japan',
    initials: 'KN',
    accent: 'from-sky-500 to-sky-700',
    rating: 5,
    quote:
      'The lab-test reference set is the most complete free resource I have found. I send patients the preparation instructions so they arrive properly fasted — it has cut repeat draws noticeably.',
    context: 'Recommends lab prep guides to patients',
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Public Health Researcher',
    location: 'Amman, Jordan',
    initials: 'FA',
    accent: 'from-amber-500 to-amber-700',
    rating: 5,
    quote:
      'Having disease prevalence, ICD-10 codes, and clinical references in one structured place saves me hours of cross-referencing. The multilingual interface means my whole field team can use it.',
    context: 'Uses the disease knowledge base in 3 languages',
  },
];

/**
 * Patient and clinician stories — animated carousel with dots + arrows.
 * Auto-advances while paused on hover/focus for accessibility.
 */
export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onTabChange }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % STORIES.length), 6000);
    return () => window.clearInterval(t);
  }, [paused]);

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + STORIES.length) % STORIES.length);
  const story = STORIES[index];

  return (
    <section
      className="gh-section bg-white dark:bg-slate-950"
      aria-labelledby="stories-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="gh-container">
        <SectionHeading
          id="stories-title"
          eyebrow="Voices From the Network"
          title="Trusted by Clinicians and Patients Worldwide"
          description="Real experiences from the people who use GlobalHealth every day — in hospitals, clinics, laboratories, and living rooms."
          align="center"
        />

        <Reveal>
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/60 to-medical-50/40 p-8 shadow-card sm:p-10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-900">
              <Quote
                className="pointer-events-none absolute -right-4 -top-4 h-32 w-32 text-medical-100/50 dark:text-slate-800/60"
                aria-hidden="true"
              />

              <div className="relative" aria-live="polite">
                <div className="flex items-center gap-1" aria-label={`${story.rating} out of 5 stars`}>
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>

                <blockquote className="mt-5">
                  <p className="text-lg font-medium leading-relaxed text-slate-800 sm:text-xl dark:text-slate-100">
                    “{story.quote}”
                  </p>
                </blockquote>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${story.accent} text-sm font-extrabold text-white shadow-md`}
                    aria-hidden="true"
                  >
                    {story.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
                      {story.name}
                      <BadgeCheck className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {story.role} · {story.location}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-medical-700 dark:text-medical-400">{story.context}</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-5 dark:border-slate-800">
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose a story">
                  {STORIES.map((s, i) => (
                    <button
                      key={s.name}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Story from ${s.name}`}
                      onClick={() => setIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === index ? 'w-7 bg-medical-600' : 'w-2 bg-slate-300 hover:bg-medical-300 dark:bg-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous story"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-medical-300 hover:text-medical-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <ChevronLeft className="h-4.5 w-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next story"
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-medical-300 hover:text-medical-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <ChevronRight className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Trust strip */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { value: '1.4M+', label: 'Monthly visitors' },
                { value: '190+', label: 'Countries served' },
                { value: '4.9/5', label: 'Average rating' },
                { value: '100%', label: 'Patient-controlled data' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="gh-sym-stat rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/70"
                >
                  <p className="text-xl font-extrabold text-medical-700 dark:text-medical-400">{s.value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
