import React, { useState } from 'react';
import { CircleHelp, LifeBuoy, Search, MessageSquarePlus, Send, CheckCircle2, BookOpen } from 'lucide-react';
import { useDoctorPortal } from './doctorPortalData';

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

export const DoctorHelp: React.FC<{ section: 'help' | 'support' }> = ({ section }) => {
  if (section === 'support') return <SupportView />;
  return <HelpCenterView />;
};

const FAQS = [
  ['How do I complete verification?', 'Open Credentials, submit your registration documents, and the credential team reviews them. “Verified” appears only after review completes.'],
  ['How does facility switching work?', 'Use the facility switcher at the top of the workspace. All data shown is scoped to the selected organization.'],
  ['Why can\'t I see Patients / Clinical Workspace?', 'Clinical modules are only shown when your role at the selected organization is authorized for them.'],
  ['What happens when a credential expires?', 'You receive an alert with “Credential expires in X days”. After expiry the credential shows “Credential expired” and must be renewed through the same verification workflow.'],
  ['Can patients see my private details?', 'No. Only your public profile fields (name, specialty, qualifications, languages, bio, active affiliations) are ever shown.'],
  ['How are referrals counted?', 'Referrals exist in Draft, Sent, Accepted, Declined and Completed states — no state is skipped or auto-completed.'],
];

const HelpCenterView: React.FC = () => {
  const [q, setQ] = useState('');
  const list = FAQS.filter(([title]) => title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Help Center</h2>
        <p className="text-xs text-slate-500">Answers for the doctor workspace. For anything else, open a ticket from Contact Support.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <label className="relative block">
          <span className="sr-only">Search help articles</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles…" className={`${inputCls} pl-10`} />
        </label>

        <ul className="mt-4 space-y-2">
          {list.map(([title, body]) => (
            <li key={title} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <p className="text-xs font-extrabold text-slate-800">{title}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{body}</p>
            </li>
          ))}
          {list.length === 0 && <p className="py-4 text-center text-xs text-slate-400">No articles match “{q}”.</p>}
        </ul>
      </section>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <BookOpen className="h-3.5 w-3.5 text-medical-500" /> The help center is for portal usage — it never provides medical guidance.
      </p>
    </div>
  );
};

const TICKET_STATUS: Record<string, string> = {
  open: 'bg-medical-50 text-medical-800',
  answered: 'bg-emerald-50 text-emerald-800',
  closed: 'bg-slate-100 text-slate-500',
};

const SupportView: React.FC = () => {
  const { tickets, addTicket } = useDoctorPortal();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    if (!subject.trim() || !body.trim()) return;
    addTicket({ subject: subject.trim(), body: body.trim() });
    setSubject(''); setBody('');
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Contact Support</h2>
        <p className="text-xs text-slate-500">Our support team replies within one working day. Ticket subjects never include patient information.</p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="new-ticket">
        <h3 id="new-ticket" className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-900"><MessageSquarePlus className="h-4 w-4 text-medical-600" /> Open a ticket</h3>
        {sent && <p role="status" className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Ticket submitted. You'll be notified in the portal.</p>}
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="tk-subject">Subject</label>
            <input id="tk-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} placeholder="Short description of the issue" />
          </div>
          <div>
            <label className={labelCls} htmlFor="tk-body">Details</label>
            <textarea id="tk-body" value={body} onChange={(e) => setBody(e.target.value)} rows={5} className={inputCls} placeholder="Describe what happened, what you expected, and when." />
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!subject.trim() || !body.trim()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-medical-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" /> Submit ticket
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="ticket-list">
        <h3 id="ticket-list" className="mb-3 text-sm font-extrabold text-slate-900">My tickets ({tickets.length})</h3>
        {tickets.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No support tickets yet.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold text-slate-800">{t.subject}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${TICKET_STATUS[t.status] || TICKET_STATUS.open}`}>{t.status}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{t.body}</p>
                <p className="mt-1 text-[10px] text-slate-400">Opened {t.createdAt} · Ref {t.id}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><LifeBuoy className="h-3.5 w-3.5 text-medical-500" /> For emergencies, contact your facility's on-call support line — not this portal.</p>
    </div>
  );
};
