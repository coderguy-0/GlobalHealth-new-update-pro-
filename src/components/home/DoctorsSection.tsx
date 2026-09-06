import React, { useMemo, useState } from 'react';
import { Stethoscope, MapPin, CalendarCheck, Languages, ArrowRight, ShieldCheck } from 'lucide-react';
import { NavigationTab } from '../../types';
import { DOCTORS } from '../../data/directorySeed';
import { DOCTOR_SPECIALTIES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface DoctorsSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

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
    <section className="gh-section bg-white" aria-labelledby="doctors-title">
      <div className="gh-container">
        <SectionHeading
          id="doctors-title"
          eyebrow="Medical Practitioner Directory"
          title="Find Verified Healthcare Professionals"
          description="Discover specialists by clinical specialty, hospital affiliation, location, and consultation availability."
          align="center"
        />

        {/* Filter Pills Centered */}
        <div
          className="mt-8 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filter doctors by specialty"
        >
          {['All', ...DOCTOR_SPECIALTIES].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpecialty(s)}
              className={`gh-chip text-xs py-1.5 px-3.5 ${specialty === s ? 'gh-chip-active' : ''}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Symmetrical 4-Card Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((doc, i) => (
            <Reveal key={doc.id} delay={i * 40}>
              <button
                type="button"
                onClick={() => onTabChange('doctors')}
                className="group flex h-full w-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-medical-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-medical-50 text-medical-700 transition group-hover:bg-medical-600 group-hover:text-white shadow-2xs">
                      <Stethoscope className="h-6 w-6" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/70">
                      <ShieldCheck className="h-3 w-3" />
                      Verified MD
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 group-hover:text-medical-800">
                    {doc.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-medical-700">{doc.specialty}</p>

                  <div className="mt-4 space-y-2 text-xs text-slate-500">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{doc.location}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarCheck className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                      <span className="truncate">{doc.availability}</span>
                    </p>
                    {doc.languages?.length ? (
                      <p className="flex items-center gap-2">
                        <Languages className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <span className="truncate">{doc.languages.slice(0, 3).join(', ')}</span>
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-medical-700 group-hover:underline">
                  <span>View Doctor Profile</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" onClick={() => onTabChange('doctors')}>
            <Stethoscope className="h-4.5 w-4.5" />
            Browse Full Healthcare Practitioner Directory
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
