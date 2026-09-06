import React from 'react';
import {
  ShieldCheck, UserRound, Eye, Lock, FilePlus2, Clock, History,
  Bell, Server, ShieldAlert, CheckCircle2, XCircle, ArrowRight,
  Stethoscope, FolderLock, KeyRound, Mail, ScrollText, BadgeCheck,
  Ban, FileSearch, TimerOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Patient-facing "Doctor Access & Consent" page — explains the
 * patient-controlled access, consent and audit system, and opens the
 * patient's Doctor Access & Consent area (gated to sign-in).
 */
export const DoctorAccessConsentPage: React.FC<{ onTabChange: (tab: any) => void }> = ({ onTabChange }) => {
  const { user } = useAuth();

  const openMyConsent = () => {
    // Routes through the app's tab controller: signed-in patients go
    // straight to their Doctor Access & Consent area; guests are shown
    // the secure sign-in gate and land there after authentication.
    onTabChange('privacy');
  };

  return (
    <div className="bg-slate-50">
      {/* HERO */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Patient Privacy & Control
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight">
            Doctor Access &amp; Consent
          </h1>
          <p className="mt-4 max-w-3xl text-base sm:text-lg text-emerald-50/90 leading-relaxed">
            You are always in control of who can access your health information and what changes can be made to your
            health records. Doctors and other authorized healthcare professionals can view your health information{' '}
            <strong className="text-white">only when they have the appropriate permission or consent</strong>. Access
            is limited to the information necessary for the healthcare purpose and follows your privacy settings and
            platform access rules.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={openMyConsent}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-emerald-800 shadow-lg transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {user ? 'Open Your' : 'Sign In & Open Your'} Doctor Access &amp; Consent
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#workflow"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              See How It Works
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 space-y-12">
        {/* PATIENT-CONTROLLED ACCESS */}
        <Section
          icon={<UserRound className="h-5 w-5" />}
          title="Patient-Controlled Access"
          lead="Patients control access to their personal health information and Electronic Health Record (EHR)."
        >
          <BulletList items={[
            <>Patients control access to their personal health information and Electronic Health Record (EHR).</>,
            <>A doctor <strong>cannot automatically access</strong> a patient's complete health profile simply because the doctor is registered on the platform.</>,
            <>Access is granted only through the platform's authorized permission and consent system.</>,
            <>You can review which doctors or healthcare professionals currently have access to your information.</>,
            <>You can revoke permitted access where supported by the applicable access rules.</>,
            <>Emergency or legally required access — if supported — follows a separate, clearly identified emergency/legal-access procedure and is recorded in the audit history.</>
          ]} />
        </Section>

        {/* DOCTOR VIEWING PERMISSIONS */}
        <Section
          icon={<Eye className="h-5 w-5" />}
          title="Doctor Viewing Permissions"
          lead="When access has been granted, a doctor may view only the information that their assigned role and permission level allows."
        >
          <div className="flex flex-wrap gap-2">
            {['Patient profile information', 'Relevant clinical records', 'Diagnoses & medical history',
              'Prescriptions & medication information', 'Laboratory reports', 'Imaging & diagnostic reports',
              'Allergies', 'Previous consultations', 'Relevant treatment information',
              'Other EHR information specifically permitted by the patient'
            ].map((c) => (
              <span key={c} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                {c}
              </span>
            ))}
          </div>
          <Callout tone="warn" icon={<Ban className="h-4 w-4" />}>
            The system must not expose unrelated private information merely because a doctor has access to one part
            of the patient's record.
          </Callout>
        </Section>

        {/* NO UNAUTHORIZED CHANGES */}
        <Section
          icon={<Lock className="h-5 w-5" />}
          title="No Unauthorized Changes"
          lead="Doctors must never silently add, edit, delete, overwrite, or remove patient health information."
        >
          <p className="text-sm text-slate-600 leading-relaxed">
            If a doctor needs to make a change to your EHR, the platform follows the configured consent and
            authorization workflow. Where patient approval is required, the doctor must first submit a{' '}
            <strong>change request</strong>. Examples include:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { icon: <FilePlus2 className="h-4 w-4" />, text: 'Adding a new clinical record' },
              { icon: <FileSearch className="h-4 w-4" />, text: 'Updating an existing record' },
              { icon: <ScrollText className="h-4 w-4" />, text: 'Correcting information' },
              { icon: <Stethoscope className="h-4 w-4" />, text: 'Adding a diagnosis or clinical note' },
              { icon: <FilePlus2 className="h-4 w-4" />, text: 'Adding a prescription' },
              { icon: <FileSearch className="h-4 w-4" />, text: 'Adding a laboratory or diagnostic result' },
              { icon: <Ban className="h-4 w-4" />, text: 'Requesting removal or correction of information' },
              { icon: <ScrollText className="h-4 w-4" />, text: 'Updating other patient-controlled health information' }
            ].map((it, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700">
                <span className="text-emerald-600">{it.icon}</span> {it.text}
              </div>
            ))}
          </div>
        </Section>

        {/* CONSENT REQUEST WORKFLOW */}
        <div id="workflow">
          <Section
            icon={<KeyRound className="h-5 w-5" />}
            title="Consent Request Workflow"
            lead="When a doctor wants to perform an action that requires your approval, this is exactly what happens."
          >
            <ol className="relative space-y-5 border-l-2 border-emerald-200 pl-6">
              {[
                'The doctor selects the relevant patient record.',
                'The doctor selects the requested action.',
                'The doctor provides a clear reason for the request.',
                'The system creates a formal consent request.',
                'You receive a notification through the platform and — where configured — an email notification.',
                <>You can review: the doctor's identity, healthcare organization, requested action, information affected, reason for the request, date and time of the request, and any relevant expiry period.</>,
                <>You choose <strong>Approve</strong> or <strong>Decline</strong>.</>,
                'The system records your decision.',
                <>Only after valid approval is recorded may the permitted action proceed.</>,
                <>The system records the completed action in your audit history.</>
              ].map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[37px] flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-black text-white ring-4 ring-slate-50">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </Section>
        </div>

        {/* APPROVAL / DECLINED */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-6">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="text-lg font-extrabold">Approval</h3>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
              {[
                'The approval is securely recorded.',
                <>It is linked to the specific <strong>doctor, patient, request, and requested action</strong>.</>,
                <>It never automatically authorizes unrelated actions — permission applies <strong>only to the scope defined in the request</strong>.</>,
                'Any configured expiration date or duration is enforced.',
                <>The completed change identifies the <strong>healthcare professional who performed it</strong>.</>,
                <>Previous and new values are retained <strong>where appropriate for auditability</strong>.</>
              ].map((li, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {li}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-rose-200 bg-rose-50/60 p-6">
            <div className="flex items-center gap-2 text-rose-800">
              <XCircle className="h-5 w-5" />
              <h3 className="text-lg font-extrabold">Declined Requests</h3>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
              {[
                <>The requested action <strong>must not be performed</strong>.</>,
                <>The doctor receives a notification that <strong>permission was not granted</strong>.</>,
                <>The request <strong>remains recorded</strong> in the audit history.</>,
                <>You can see that the request was declined in your access history.</>,
                <>No health information is changed as a result of a declined request.</>
              ].map((li, i) => (
                <li key={i} className="flex items-start gap-2">
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> {li}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* EXPIRATION */}
        <Section
          icon={<TimerOff className="h-5 w-5" />}
          title="Request Expiration"
          lead="Consent requests support an expiration mechanism, so nothing waits indefinitely."
        >
          <BulletList items={[
            <>If a request expires before you respond, <strong>the request becomes invalid</strong>.</>,
            <>The requested action <strong>cannot be performed</strong> using that request.</>,
            <>The doctor must submit a new request if authorization is still required.</>,
            <>The expiration event is recorded in the audit history.</>
          ]} />
        </Section>

        {/* AUDIT HISTORY */}
        <Section
          icon={<History className="h-5 w-5" />}
          title="Complete Audit History"
          lead="Every important access and consent event is securely recorded — tamper-resistant, never silently deleted or modified."
        >
          <div className="flex flex-wrap gap-2">
            {['Doctor access granted', 'Doctor access denied', 'Access revoked', 'Consent requested',
              'Consent approved', 'Consent declined', 'Consent expired', 'EHR viewed',
              'EHR information added', 'EHR information modified', 'EHR information corrected',
              'EHR information removed (where permitted)', 'Emergency / legal access'
            ].map((e) => (
              <span key={e} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
                {e}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            Your history shows the date and time of each event, the authorized healthcare professional, their
            healthcare organization, the requested or performed action, the consent/request reference, and the
            relevant system status.
          </p>
        </Section>

        {/* PATIENT PRIVACY DASHBOARD */}
        <Section
          icon={<FolderLock className="h-5 w-5" />}
          title="Your Privacy Dashboard"
          lead="A dedicated Doctor Access & Consent area inside your account."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <DashCard title="Current Access" icon={<Eye className="h-4 w-4" />} items={[
              'Doctors with active access', 'Healthcare organizations with active access',
              'Information categories accessible to each doctor', 'Permission status',
              'Access start date', 'Access expiry date, if applicable'
            ]} />
            <DashCard title="Pending Requests" icon={<Clock className="h-4 w-4" />} items={[
              'New consent requests', 'Requested action', 'Doctor identity',
              'Reason for request', 'Date & time', 'Approve / Decline controls'
            ]} />
            <DashCard title="Access History" icon={<History className="h-4 w-4" />} items={[
              'Previous access grants', 'Revoked permissions', 'Completed consent requests',
              'Declined requests', 'Expired requests', 'Relevant EHR activity'
            ]} />
          </div>
          <button
            onClick={openMyConsent}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-800"
          >
            {user ? 'Open' : 'Sign In & Open'} Doctor Access &amp; Consent <ArrowRight className="h-4 w-4" />
          </button>
        </Section>

        {/* SECURITY ENFORCEMENT */}
        <Section
          icon={<Server className="h-5 w-5" />}
          title="Security Enforcement"
          lead="The consent system is enforced at the backend, API and database authorization level — not only through the interface."
        >
          <p className="text-sm text-slate-600">
            Every request to your health information verifies the full authorization chain:
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {['Authenticated User', 'Doctor Identity', 'Patient Identity', 'Role', 'Permission', 'Consent Status', 'Requested Action', 'Authorization'].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white">{step}</span>
                {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-slate-400" />}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            If any required check fails, access or modification is <strong>denied</strong>. A doctor cannot bypass
            the consent system by changing URLs, manipulating API requests, calling unauthorized endpoints,
            altering frontend code, using another patient's identifier, accessing another patient's record through
            search, or directly querying unauthorized records.
          </p>
        </Section>

        {/* DATA ISOLATION + LEAST PRIVILEGE */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-slate-800">
              <ShieldAlert className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-extrabold">User Data Isolation</h3>
            </div>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              After login, each patient sees <strong>only their own</strong> personal health information, EHR,
              consent records, access history, and saved health information. You can never reach another
              patient's private health information by changing an identifier, URL, account parameter, or API
              request. Likewise, a doctor only reaches patients and information for which they hold valid
              authorization.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-2 text-slate-800">
              <KeyRound className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-extrabold">Principle of Least Privilege</h3>
            </div>
            <div className="mt-4 space-y-2">
              {[
              { perm: 'View-only', desc: 'View permitted information — no modification.' },
              { perm: 'Add', desc: 'Add specifically permitted information.' },
              { perm: 'Edit', desc: 'Modify only information covered by the approved permission.' },
              { perm: 'Remove', desc: 'Request removal where rules permit — never bypassing required patient approval.' }
              ].map((r) => (
                <div key={r.perm} className="rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm">
                  <span className="font-bold text-emerald-800">{r.perm}</span>
                  <span className="text-slate-600"> → {r.desc}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">
              Permissions never automatically expand beyond their approved scope.
            </p>
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <Section
          icon={<Bell className="h-5 w-5" />}
          title="Patient Notifications"
          lead="Clear notifications whenever important actions occur."
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              'A doctor requests access',
              'A doctor requests permission to change information',
              'A consent request is approved',
              'A consent request is declined',
              'A permitted change is completed',
              'Access is revoked',
              'A significant access event occurs'
            ].map((n) => (
              <div key={n} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700">
                <Bell className="h-4 w-4 shrink-0 text-emerald-600" /> {n}
              </div>
            ))}
          </div>
          <Callout tone="info" icon={<Mail className="h-4 w-4" />}>
            Where email notification is enabled, you may receive a secure email directing you back to the
            authenticated GlobalHealth platform. Sensitive health information is not unnecessarily exposed in
            email notifications.
          </Callout>
        </Section>

        {/* CORE PRIVACY RULE + CTA */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-800 to-slate-900 p-8 text-white sm:p-10">
          <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <BadgeCheck className="h-4 w-4" /> Core Privacy Rule
          </div>
          <blockquote className="mt-4 text-lg sm:text-xl font-bold leading-relaxed">
            "The patient controls access to their health information. Doctors can view and act only within the
            permissions granted to them. Any action requiring patient approval must be explicitly approved before
            it is performed, and every important access, consent, and modification event must be securely recorded
            in the patient's history."
          </blockquote>
          <button
            onClick={openMyConsent}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-extrabold text-emerald-800 shadow-lg transition hover:bg-emerald-50"
          >
            Open Doctor Access &amp; Consent <ArrowRight className="h-4 w-4" />
          </button>
          {!user && (
            <p className="mt-3 text-xs text-emerald-100/70">
              Signing in is required to view and manage your own access requests and history.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- helpers ---
const Section: React.FC<{ icon: React.ReactNode; title: string; lead?: string; children: React.ReactNode }> = ({ icon, title, lead, children }) => (
  <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
        {lead && <p className="text-sm text-slate-500">{lead}</p>}
      </div>
    </div>
    <div className="mt-5">{children}</div>
  </section>
);

const BulletList: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="space-y-2.5 text-sm text-slate-700">
    {items.map((li, i) => (
      <li key={i} className="flex items-start gap-2.5">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <span className="leading-relaxed">{li}</span>
      </li>
    ))}
  </ul>
);

const Callout: React.FC<{ tone: 'warn' | 'info'; icon: React.ReactNode; children: React.ReactNode }> = ({ tone, icon, children }) => (
  <div
    className={`mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm ${
      tone === 'warn' ? 'border border-amber-200 bg-amber-50 text-amber-900' : 'border border-sky-200 bg-sky-50 text-sky-900'
    }`}
  >
    <span className={`mt-0.5 shrink-0 ${tone === 'warn' ? 'text-amber-600' : 'text-sky-600'}`}>{icon}</span>
    <p className="leading-relaxed">{children}</p>
  </div>
);

const DashCard: React.FC<{ title: string; icon: React.ReactNode; items: string[] }> = ({ title, icon, items }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5">
    <div className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
      <span className="text-emerald-600">{icon}</span> {title}
    </div>
    <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-1.5">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" /> {it}
        </li>
      ))}
    </ul>
  </div>
);
