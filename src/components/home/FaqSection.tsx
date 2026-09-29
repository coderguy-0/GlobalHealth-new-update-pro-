import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircleQuestion } from 'lucide-react';
import { NavigationTab } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';

interface FaqSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

interface Faq {
  q: string;
  a: string;
  category: string;
}

const FAQS: Faq[] = [
  {
    category: 'Trust & Accuracy',
    q: 'How does GlobalHealth keep its medical information accurate?',
    a: 'Every monograph, disease guide, and lab-test reference in GlobalHealth is written against peer-reviewed sources (WHO, NIH, NICE, Cochrane reviews) and reviewed on a scheduled editorial cycle. Content carries a "last reviewed" date, cites its primary sources in the References panel, and is flagged for re-review whenever a regulator issues an update.',
  },
  {
    category: 'AI Assistant',
    q: 'Can the AI assistant diagnose me or prescribe medicine?',
    a: 'No. The GlobalHealth AI Assistant is a research and navigation companion. It summarises verified content, explains terminology, and helps you find the right specialist or lab test — but it never diagnoses, never prescribes, and never replaces a licensed clinician. Every response is grounded in our indexed medical corpus and shows its sources.',
  },
  {
    category: 'Privacy',
    q: 'Who can see my health records and personal data?',
    a: 'Only you. Records are encrypted at rest and in transit, and no clinician or institution can view them without an explicit, time-limited consent token that you issue and can revoke instantly from your Privacy dashboard. Every access attempt — granted or denied — is written to an immutable audit log you can read at any time.',
  },
  {
    category: 'Privacy',
    q: 'Is GlobalHealth compliant with health-data regulations?',
    a: 'The platform is architected to HIPAA and GDPR principles: data minimisation, purpose limitation, right-to-erasure, and patient-controlled consent. Our health-record layer aligns with the HL7 FHIR R4 interoperability standard so your data can move with you between certified providers.',
  },
  {
    category: 'Providers',
    q: 'How are doctors and hospitals verified?',
    a: 'Practitioners are checked against state and national medical boards for an active licence, specialty board certification, and any public disciplinary record. Facilities are validated for accreditation status, licence currency, and reported service capability — including ICU bed and blood-bank availability where that data is published.',
  },
  {
    category: 'Cost',
    q: 'Does GlobalHealth cost anything to use?',
    a: 'Browsing the disease library, medicine directory, lab-test references, hospital and doctor discovery, the medical map, and the community are free. Creating an account to store your personal health records, appointments, and consent tokens is also free.',
  },
  {
    category: 'Emergency',
    q: 'Should I use GlobalHealth in a medical emergency?',
    a: 'No. GlobalHealth is an information platform, not an emergency service. If you or someone near you is experiencing chest pain, difficulty breathing, stroke symptoms, severe bleeding, or loss of consciousness, call your local emergency number immediately. Our Emergency panel lists regional numbers and can locate the nearest emergency department.',
  },
  {
    category: 'Platform',
    q: 'Can I use GlobalHealth on my phone or offline?',
    a: 'Yes. The interface is fully responsive and installable as a progressive web app on iOS and Android. Recently viewed medicine monographs and disease guides are cached so they remain readable when you lose signal — useful for travel, fieldwork, and low-connectivity regions.',
  },
];

/**
 * Frequently-asked-questions section with an accessible accordion and
 * FAQPage structured data for search-engine rich results.
 */
export const FaqSection: React.FC<FaqSectionProps> = ({ onTabChange }) => {
  const [open, setOpen] = useState<number | null>(0);
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(FAQS.map((f) => f.category)))];
  const visible = filter === 'All' ? FAQS : FAQS.filter((f) => f.category === filter);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="gh-section relative overflow-hidden bg-slate-50/70 dark:bg-slate-900/40" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full bg-medical-100/30 blur-3xl" aria-hidden="true" />

      <div className="gh-container relative">
        <SectionHeading
          id="faq-title"
          eyebrow="Answers & Transparency"
          title="Frequently Asked Questions"
          description="How GlobalHealth verifies clinical content, protects your records, and stays accountable."
          align="center"
        />

        {/* Category filters */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setFilter(c);
                setOpen(0);
              }}
              aria-pressed={filter === c}
              className={`gh-chip ${filter === c ? 'gh-chip-active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {visible.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.q} delay={i * 30}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-200 dark:bg-slate-900/80 ${
                    isOpen
                      ? 'border-medical-300 shadow-card dark:border-medical-700'
                      : 'border-slate-200/90 shadow-soft hover:border-medical-200 dark:border-slate-700/70'
                  }`}
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left"
                    >
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition ${
                          isOpen ? 'bg-medical-600 text-white' : 'bg-medical-50 text-medical-600 dark:bg-medical-900/40 dark:text-medical-300'
                        }`}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </span>
                      <span className="flex-1 text-sm font-bold text-slate-800 sm:text-[15px] dark:text-slate-100">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`h-4.5 w-4.5 shrink-0 text-slate-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-medical-600' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    hidden={!isOpen}
                    className="px-5 pb-5 pl-16"
                  >
                    <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">{faq.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-medical-200/80 bg-gradient-to-r from-medical-50 to-emerald-50/60 p-6 sm:flex-row dark:border-medical-800/60 dark:from-medical-950/40 dark:to-emerald-950/20">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white text-medical-600 shadow-sm dark:bg-slate-900 dark:text-medical-300">
                <MessageCircleQuestion className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Still have a question?</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Ask the clinical AI assistant — grounded answers with citations.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onTabChange('ai-assistant')}
              className="w-full shrink-0 rounded-xl bg-medical-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-medical-700 sm:w-auto"
            >
              Ask the assistant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
