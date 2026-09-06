import React, { useMemo, useState } from 'react';
import { Stethoscope, MapPin, CalendarCheck, Languages, ArrowRight } from 'lucide-react';
import { NavigationTab } from '../../types';
import { DOCTORS } from '../../data/directorySeed';
import { DOCTOR_SPECIALTIES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface DoctorsSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

/**
 * Section 13 — Doctor discovery preview.
 * Shows only real directory data (specialty, location, availability, language).
 * No fabricated ratings or credential claims on the homepage.
 */
export const DoctorsSection: React.FC<DoctorsSectionProps> = ({ onTabChange }) => {
  const [specialty, setSpecialty] = useState<string>('All');

  const filtered = useMemo(() => {
    const list =
      specialty === 'All'
        ? DOCTORS
        : DOCTORS.filter((d) => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
    return list.slice(0, 4);
  }, [specialty]);

  return (
    <section className="gh-section bg-slate-50/60" aria-labelledby="doctors-title">
      <div className="gh-container">
        <SectionHeading
          id="doctors-title"
          eyebrow="Doctors"
          title="Find the right healthcare professional."
          description="Discover specialists by specialty, condition, location, language and availability — then book an appointment where supported."
        />

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="group" aria-label="Filter doctors by specialty">
          {['All', ...DOCTOR_SPECIALTIES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpecialty(s)}
              className={`gh-chip ${specialty === s ? 'gh-chip-active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((doc, i) => (
            <Reveal key={doc.id} delay={i * 50}>
              <button
                type="button"
                onClick={() => onTabChange('doctors')}
                className="group flex h-full w-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-medical-50 text-medical-700 transition group-hover:bg-medical-600 group-hover:text-white">
                    <Stethoscope className="h-5 w-5" />
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-medical-600" />
                </div>
                <h3 className="mt-4 text-sm font-bold leading-snug text-slate-900">{doc.name}</h3>
                <p className="mt-0.5 text-xs font-semibold text-medical-700">{doc.specialty}</p>

                <div className="mt-3 flex-1 space-y-1.5 text-[11px] text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{doc.location}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{doc.availability}</span>
                  </p>
                  {doc.languages?.length ? (
                    <p className="flex items-center gap-1.5">
                      <Languages className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{doc.languages.slice(0, 3).join(', ')}</span>
                    </p>
                  ) : null}
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => onTabChange('doctors')}>
            Browse all healthcare professionals
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
