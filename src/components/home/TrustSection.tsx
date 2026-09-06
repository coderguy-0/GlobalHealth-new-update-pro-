import React from 'react';
import { TRUST_PRINCIPLES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="gh-section bg-white" aria-labelledby="trust-title">
      <div className="gh-container">
        <SectionHeading
          id="trust-title"
          eyebrow="Integrity &amp; Security Architecture"
          title="Built on Medical Rigor, Privacy &amp; Trust"
          align="center"
          description="Healthcare technology requires uncompromising reliability. These core standards govern every clinical dataset, model, and interface we deploy."
        />

        {/* Symmetrical 4-Card Trust Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PRINCIPLES.map((p, i) => (
            <Reveal key={p.id} delay={i * 40}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft transition duration-200 hover:shadow-card hover:border-medical-200">
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-medical-50 text-medical-700 shadow-2xs">
                    {p.icon}
                  </span>
                  <h3 className="mt-5 text-base font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{p.description}</p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified Standard</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200/90 bg-slate-50/80 p-5 text-center shadow-2xs">
            <p className="text-xs leading-relaxed text-slate-600">
              <strong className="text-slate-900">Clinical Responsibility:</strong> GlobalHealth
              provides structured educational discovery, directory lookups, and secure patient data management.
              It does not replace a licensed medical practitioner for personalized diagnosis, prescriptions, or emergency intervention.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
