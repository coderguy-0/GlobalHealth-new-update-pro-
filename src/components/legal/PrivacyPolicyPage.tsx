import React from 'react';
import { ArrowLeft, Heart, Home as HomeIcon, ChevronRight, ShieldCheck } from 'lucide-react';
import { NavigationTab } from '../../types';
import { PRIVACY_EFFECTIVE_DATE, LEGAL_PLACEHOLDERS } from '../../lib/policyVersions';

interface PrivacyPolicyPageProps {
  onNavigate: (tab: NavigationTab) => void;
}

const Section: React.FC<{ n: string; title: string; children: React.ReactNode }> = ({ n, title, children }) => (
  <section aria-labelledby={`pp-${n}`} className="border-b border-slate-200/70 py-6 last:border-b-0">
    <h2 id={`pp-${n}`} className="flex items-baseline gap-2 text-[16px] font-bold tracking-tight text-slate-900">
      <span className="text-medical-600">{n}.</span> {title}
    </h2>
    <div className="mt-2.5 space-y-2 text-[13px] leading-relaxed text-slate-600">{children}</div>
  </section>
);

/**
 * GlobalHealth Privacy Policy — a dedicated, plain-language notice.
 * Written to support clear, specific, informed consent (including the
 * Digital Personal Data Protection Act, 2023 and notified DPDP Rules, 2025
 * expectations for an India deployment: itemized purposes, plain language,
 * and a consent-withdrawal path that is as easy to use as giving consent).
 */
export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => (
  <div className="bg-slate-50">
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
        <button type="button" onClick={() => onNavigate('home')} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 transition hover:bg-slate-100 hover:text-medical-700">
          <HomeIcon className="h-3.5 w-3.5" /> Home
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
        <span className="rounded-lg px-2 py-1 font-semibold text-slate-700" aria-current="page">Privacy Policy</span>
      </nav>

      <article className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lift">
        <header className="border-b border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-8 text-white sm:px-10">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 text-white">
              <Heart className="h-5 w-5 fill-white/20" />
            </span>
            <span className="text-lg font-bold tracking-tight">GlobalHealth</span>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Privacy Policy</h1>
          <p className="mt-2 text-xs text-slate-300">
            Effective Date: <strong className="text-white">{PRIVACY_EFFECTIVE_DATE}</strong> · Version:{' '}
            <strong className="text-white">GH-PP-2026-01</strong>
          </p>
        </header>

        <div className="px-6 py-6 sm:px-10 sm:py-8">
          <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950" role="note">
            <strong>Plain-language notice:</strong> This notice explains, in clear language, what personal data
            GlobalHealth collects, why it is collected, how it is used, which services require it, how long it is
            kept, how it is protected, and how you can access, correct, or withdraw consent. Consent for each purpose
            is sought separately and specifically; it is never a single blanket “I consent to everything” checkbox.
            For an India deployment, this notice is prepared in line with the Digital Personal Data Protection Act,
            2023 and the notified DPDP Rules, 2025 and must be reviewed against the actual GlobalHealth entity before
            launch.
          </div>

          <div className="space-y-1">
            <Section n="1" title="Who we are">
              <p>
                GlobalHealth (<strong>{LEGAL_PLACEHOLDERS.legalEntity}</strong>, registered at{' '}
                {LEGAL_PLACEHOLDERS.registeredAddress}) operates a healthcare information and digital healthcare
                platform. You can contact us at {LEGAL_PLACEHOLDERS.supportEmail}; privacy matters at{' '}
                {LEGAL_PLACEHOLDERS.privacyEmail}; grievance contact {LEGAL_PLACEHOLDERS.grievanceContact}.
              </p>
            </Section>

            <Section n="2" title="What data we collect, and why">
              <p>We collect only the data needed for the services you use. Each item below has a specific purpose:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li><strong>Full name, display name, email, mobile number</strong> — to create and secure your account, verify your identity, send verification codes, and communicate about your account.</li>
                <li><strong>Password (stored only as a salted, hashed digest)</strong> — to authenticate you. We never store plaintext passwords.</li>
                <li><strong>Date of birth / age information</strong> — only where legally or operationally necessary for eligibility of a specific service.</li>
                <li><strong>Country / region and preferred language</strong> — to provide region-appropriate information and display the platform in your language.</li>
                <li><strong>Health information you choose to store</strong> (labs, vitals, medications, appointments, records) — only to provide the personal health-record features you explicitly use. This data is never used to serve you ads or sold to anyone.</li>
                <li><strong>Device, session and security data</strong> (browser type, session token, login timestamps) — to keep your account secure, detect suspicious logins, and maintain audit logs.</li>
                <li><strong>AI Assistant conversations</strong> — stored only when you are signed in and the feature stores history; guest conversations are session-only and never saved. See the AI Assistant section.</li>
              </ul>
            </Section>

            <Section n="3" title="How we use your data">
              <p>
                We use personal data for the specific purpose it was collected: account operation and security,
                verification, delivering the service you requested (records, appointments, community, pharmacy,
                news), improving and securing the platform, and meeting legal obligations. We do not use health data
                for unrelated marketing. Optional communications (health education, product news) are sent only if
                you separately opt in, and you can opt out at any time with comparable ease.
              </p>
            </Section>

            <Section n="4" title="Which services require which data">
              <ul className="list-disc space-y-1 pl-5">
                <li><strong>Public browsing</strong> — no account and no personal data required. Public disease, medicine, lab-test, news and community content stays available to everyone.</li>
                <li><strong>Account + personal dashboard</strong> — name, email, mobile, password.</li>
                <li><strong>Personal health records, saved library, appointments</strong> — the account data above plus the health information you choose to enter.</li>
                <li><strong>Community participation</strong> — display name (you may use a pseudonym).</li>
                <li><strong>Pharmacy transactions</strong> — additional delivery/payment data governed by the pharmacy partner&apos;s terms.</li>
              </ul>
            </Section>

            <Section n="5" title="Consent and how to withdraw it">
              <p>
                Where we rely on consent, consent is <strong>free, specific, informed, unconditional and
                unambiguous</strong>, obtained through a clear affirmative action — never a pre-ticked box and never
                a blanket “I agree to everything” statement. Your accepted Terms and Privacy versions are recorded
                with a timestamp in your account.
              </p>
              <p>
                You can withdraw or manage consent at any time from <strong>Settings → Privacy &amp; Consent</strong>,
                with the same ease as giving it. Withdrawing consent for a processing purpose will not affect the
                lawfulness of processing before withdrawal, and may limit services that depend on that purpose (for
                example, personal health-record features require an account).
              </p>
            </Section>

            <Section n="6" title="Retention">
              <p>
                We keep personal data only as long as needed for the purpose it was collected, to operate your
                account, or as required by law (for example, statutory medical-record retention obligations for
                consultations). When you delete your account we delete or anonymize personal data we no longer have a
                legal reason to keep, and we explain any data that must be retained.
              </p>
            </Section>

            <Section n="7" title="Security">
              <p>
                We use encryption in transit, hashed credentials, server-side authorization on every protected
                request, session expiry, rate limiting and brute-force protection, audit logging of security events,
                and least-privilege access. No internet service can guarantee absolute security, but we apply
                reasonable, proportionate safeguards and review them regularly.
              </p>
            </Section>

            <Section n="8" title="Your rights">
              <p>
                Depending on your jurisdiction (including under the DPDP Act, 2023 for India), you may have rights to
                access your personal data, correct it, update it, request deletion, withdraw consent, and seek
                grievance redressal. You can exercise most of these directly in your account settings or by contacting
                us at {LEGAL_PLACEHOLDERS.privacyEmail}. We respond to legitimate requests without undue delay and
                never charge a disproportionate fee for routine requests.
              </p>
            </Section>

            <Section n="9" title="Third-party processing">
              <p>
                We share data only with the service providers needed to operate the platform (hosting, verification
                messaging, and — where you use them — doctors, hospitals, pharmacies and payment processors), under
                appropriate safeguards and only for the purposes described in this notice. Where a third party
                processes your data under its own terms (for example a pharmacy transaction), we point you to its
                notice. We do not sell personal health data.
              </p>
            </Section>

            <Section n="10" title="AI Assistant and health data">
              <p>
                The AI Assistant is an educational information assistant. Guest conversations are session-only and are
                never saved to an account. Signed-in conversations are saved only to your own account and only when
                the feature stores history. AI chat is never automatically treated as a medical record and is never
                transferred into your EHR or doctor&apos;s record unless you take a separate, explicit action. Do not
                enter another person&apos;s health information into the assistant.
              </p>
            </Section>

            <Section n="11" title="Children">
              <p>
                Services that require consent to process personal data are intended for people who can lawfully
                provide consent. Where a service is offered to minors, age-appropriate consent or guardian
                involvement is required as applicable law and the service design require.
              </p>
            </Section>

            <Section n="12" title="Changes to this policy">
              <p>
                If we change this Privacy Policy materially, we will notify you (for example by an in-account notice)
                and, where required, ask you to review and accept the updated version. Historic versions you accepted
                remain recorded.
              </p>
            </Section>

            <Section n="13" title="Grievance and contact">
              <p className="flex items-start gap-2 rounded-xl bg-medical-50 p-3.5 text-xs text-medical-900 ring-1 ring-medical-200">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Grievance Officer / contact: {LEGAL_PLACEHOLDERS.grievanceContact} · Privacy email:{' '}
                  {LEGAL_PLACEHOLDERS.privacyEmail} · Registered address: {LEGAL_PLACEHOLDERS.registeredAddress}.
                </span>
              </p>
            </Section>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-soft transition hover:border-medical-200 hover:bg-medical-50 hover:text-medical-800"
            >
              <ArrowLeft className="h-4 w-4" /> Back to GlobalHealth
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
);
