import React from 'react';
import { TRUST_PRINCIPLES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

/** Section 9 — Trust principles. Calm, honest, no over-claiming. */
export const TrustSection: React.FC = () => {
  return (
    <section className="gh-section" aria-labelledby="trust-title">
      <div className="gh-container">
        <SectionHeading
          id="trust-title"
          eyebrow="Why GlobalHealth"
          title="Built around clarity, trust and responsible healthcare information."
          align="center"
          description="Healthcare information only helps when people can trust it. These principles guide everything we build."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_PRINCIPLES.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-medical-50 text-medical-700">
                  {p.icon}
                </span>
                <h3 className="mt-4 text-[15px] font-bold text-slate-900">{p.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{p.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8">
          <p className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4 text-center text-xs leading-relaxed text-slate-500">
            GlobalHealth provides educational information and care-coordination tools. It is not a
            medical certification body and does not replace a licensed clinician for diagnosis,
            treatment or emergency care.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
