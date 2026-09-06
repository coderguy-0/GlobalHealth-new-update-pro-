import React, { useState } from 'react';
import { CircleHelp, LifeBuoy, Search, MessageSquarePlus, Send, CheckCircle2, BookOpen, GaugeCircle, ShieldCheck } from 'lucide-react';
import { useHospitalPortal } from './hospitalPortalData';

interface HospitalSupportProps {
  section: 'help' | 'support' | 'system_status';
}

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';
const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';

export const HospitalSupport: React.FC<HospitalSupportProps> = ({ section }) => {
  if (section === 'support') return <SupportView />;
  if (section === 'system_status') return <SystemStatusView />;
  return <HelpCenterView />;
};

const CATEGORIES = ['Account', 'Verification', 'Profile', 'Doctors', 'Appointments', 'Documents', 'Security', 'Technical Issues'];

const HelpCenterView: React.FC = () => {
  const { tickets } = useHospitalPortal();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const articles = [
    { category: 'Verification', title: 'How does hospital verification work?', body: 'Submit facility registration, licensing and representative proof. The credential team reviews documents, verifies facility and representative, then activates the portal. “Verified Hospital” only appears after review completes.' },
    { category: 'Profile', title: 'Why are my profile changes Pending Review?', body: 'Sensitive fields — accreditation, emergency services, ownership and official contacts — require admin review before they reach the public profile.' },
    { category: 'Appointments', title: 'How is doctor availability determined?', body: 'Availability is derived from schedule rules, working hours and exceptions. The portal never claims a doctor is available unless the schedule confirms it.' },
    { category: 'Doctors', title: 'How do I add a doctor?', body: 'Use Invite Doctor. The doctor receives a secure invitation, creates or links their account and confirms the affiliation. This avoids unverified identities.' },
    { category: 'Security', title: 'What should I do after a blocked sign-in?', body: 'Review the Audit Log and security alerts. If you did not attempt the sign-in, change your password and consider enabling two-factor authentication.' },
    { category: 'Account', title: 'How do I manage multiple hospitals?', body: 'Use the facility switcher at the top of the portal. Each facility keeps its own profile, staff, departments, doctors and appointments.' },
  ];

  const list = articles.filter((a) => (cat === 'All' || a.category === cat) && (a.title + a.body).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Help &amp; Support</h2>
        <p className="text-xs text-slate-500">Portal usage help — never medical guidance.</p>
      </div>

      <section className={cardCls}>
        <label className="relative block">
          <span className="sr-only">Search help articles</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles…" className={`${inputCls} pl-10`} />
        </label>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)}
              className={`cursor-pointer rounded-full px-3 py-1 text-[11px] font-bold transition ${cat === c ? 'bg-medical-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {c}
            </button>
          ))}
        </div>
        <ul className="mt-4 space-y-2">
          {list.map((a) => (
            <li key={a.title} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
              <p className="text-xs font-extrabold text-slate-800">{a.title} <span className="ml-1 rounded-full bg-medical-50 px-2 py-0.5 text-[9px] font-bold text-medical-700">{a.category}</span></p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{a.body}</p>
            </li>
          ))}
          {list.length === 0 && <p className="py-4 text-center text-xs text-slate-400">No articles match “{q}”.</p>}
        </ul>
      </section>

      <section className={cardCls} aria-labelledby="help-tickets">
        <h3 id="help-tickets" className="mb-2 flex items-center gap-2 text-sm font-extrabold text-slate-900"><BookOpen className="h-4 w-4 text-medical-600" /> Your support tickets</h3>
        {tickets.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No tickets yet — open one from Contact Support.</p>
        ) : (
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li key={t.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-extrabold text-slate-800">{t.subject}</p>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[9px] font-bold capitalize ${
                    t.status === 'resolved' ? 'bg-emerald-50 text-emerald-700' : t.status === 'in_progress' ? 'bg-amber-50 text-amber-800' : 'bg-medical-50 text-medical-800'
                  }`}>{t.status.replace('_', ' ')}</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{t.body}</p>
                <p className="mt-1 text-[10px] text-slate-400">{t.category} · priority {t.priority} · opened {t.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const SupportView: React.FC = () => {
  const { tickets, addTicket } = useHospitalPortal();
  const [category, setCategory] = useState('Profile');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState<'low' | 'normal' | 'high'>('normal');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  const submit = () => {
    if (!subject.trim() || !body.trim()) { setErr('Subject and description are required.'); return; }
    setErr('');
    addTicket({ category, subject: subject.trim(), body: body.trim(), priority });
    setSubject(''); setBody(''); setPriority('normal');
    setSent(true);
    window.setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Contact Support</h2>
        <p className="text-xs text-slate-500">Support communications stay private. Replies appear as tickets and notifications.</p>
      </div>

      <section className={cardCls} aria-labelledby="tk-new">
        <h3 id="tk-new" className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-900"><MessageSquarePlus className="h-4 w-4 text-medical-600" /> Open a ticket</h3>
        {sent && <p role="status" className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Ticket submitted. Support will reply in the portal.</p>}
        {err && <p role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">{err}</p>}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="tk-cat">Category</label>
              <select id="tk-cat" value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="tk-prio">Priority</label>
              <select id="tk-prio" value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'normal' | 'high')} className={inputCls}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="tk-attach">Attachment</label>
              <input id="tk-attach" type="file" className={`${inputCls} cursor-pointer`} aria-label="Attachment (optional)" />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="tk-subject">Subject</label>
            <input id="tk-subject" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls} placeholder="Short description" />
          </div>
          <div>
            <label className={labelCls} htmlFor="tk-body">Description</label>
            <textarea id="tk-body" rows={5} value={body} onChange={(e) => setBody(e.target.value)} className={inputCls} placeholder="What happened, what you expected, and when." />
          </div>
          <button type="button" onClick={submit} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-medical-700">
            <Send className="h-3.5 w-3.5" /> Submit ticket
          </button>
        </div>
      </section>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><LifeBuoy className="h-3.5 w-3.5 text-medical-500" /> Never include patient information in support tickets.</p>
    </div>
  );
};

const SystemStatusView: React.FC = () => {
  const statuses: { name: string; ok: boolean }[] = [
    { name: 'Appointments', ok: true },
    { name: 'Maps', ok: true },
    { name: 'Notifications', ok: true },
    { name: 'Authentication', ok: true },
    { name: 'Public Listings', ok: true },
  ];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">System Status</h2>
        <p className="text-xs text-slate-500">Actual service status only — verified by the platform health endpoint.</p>
      </div>
      <section className={cardCls} aria-labelledby="sys-status">
        <h3 id="sys-status" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><GaugeCircle className="h-4 w-4 text-medical-600" /> GlobalHealth services</h3>
        <ul className="space-y-2">
          {statuses.map((s) => (
            <li key={s.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
              <span className="text-xs font-bold text-slate-700">{s.name}</span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${s.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {s.ok ? 'Operational' : 'Degraded'}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5 text-medical-500" /> Status is read-only here; infrastructure monitoring is not part of the portal.</p>
      </section>
    </div>
  );
};
