import React, { useState } from 'react';
import {
  MessagesSquare, Bell, ArrowLeftRight, FolderLock, BarChart3, Send, CheckCheck, AlertTriangle,
  Download, Upload, CheckCircle2, UserRound, ShieldAlert
} from 'lucide-react';
import { useDoctorPortal, SecureMessage, NotificationItem, Referral, PortalDocument, FACILITIES } from './doctorPortalData';

export const DoctorCommunication: React.FC<{ section: 'messages' | 'notifications' | 'referrals' | 'documents' | 'insights' }> = ({ section }) => {
  if (section === 'notifications') return <NotificationsView />;
  if (section === 'referrals') return <ReferralsView />;
  if (section === 'documents') return <DocumentsView />;
  if (section === 'insights') return <InsightsView />;
  return <MessagesView />;
};

/* ---------------- Messages ---------------- */

const MessagesView: React.FC = () => {
  const { doctor, messages, markMessageRead, sendMessage, activeFacilityId } = useDoctorPortal();
  const [threadId, setThreadId] = useState<string | null>(messages[0]?.id ?? null);
  const [draft, setDraft] = useState('');
  const thread = messages.find((m) => m.id === threadId) || null;

  const clinicalCount = messages.filter((m) => m.scope === 'clinical').length;
  const communityCount = messages.filter((m) => m.scope === 'community').length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Secure Messages</h2>
        <p className="text-xs text-slate-500">Encrypted portal messaging with a strict boundary: community messages never carry clinical advice, and clinical messages are never sent through community channels.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-soft">
            <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Threads</span>
              <span>{clinicalCount} clinical · {communityCount} community</span>
            </div>
            <ul className="space-y-1">
              {messages.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => { setThreadId(m.id); markMessageRead(m.id); }}
                    className={`w-full cursor-pointer rounded-xl px-3 py-2.5 text-left transition ${
                      threadId === m.id ? 'bg-medical-50 ring-1 ring-medical-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-800">{m.senderName}</span>
                      <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-bold ${m.scope === 'clinical' ? 'bg-medical-100 text-medical-800' : 'bg-slate-100 text-slate-500'}`}>
                        {m.scope === 'clinical' ? 'CLINICAL' : 'COMMUNITY'}
                      </span>
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-500">{m.subject}</span>
                    <span className="mt-0.5 flex items-center justify-between text-[9px] text-slate-400">
                      <span>{m.date}</span>
                      {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-medical-600" aria-label="Unread" />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            {!thread ? (
              <p className="m-auto text-center text-xs text-slate-400">Select a thread to read messages.</p>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">{thread.senderName} <span className="ml-1 text-[10px] font-bold uppercase text-slate-400">{thread.scope} channel</span></p>
                    <p className="text-[11px] text-slate-500">{thread.subject} · {thread.date}</p>
                  </div>
                  {thread.scope === 'clinical' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-medical-50 px-2.5 py-1 text-[9px] font-bold text-medical-800 ring-1 ring-medical-200">
                      <ShieldAlert className="h-3 w-3" /> Encrypted clinical channel
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-3 py-4">
                  {thread.messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs ${msg.fromMe ? 'bg-medical-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        <p className={`mt-1 text-[9px] ${msg.fromMe ? 'text-medical-100' : 'text-slate-400'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
                  {thread.scope === 'community' && (
                    <p className="rounded-xl bg-amber-50 p-2.5 text-[10px] text-amber-800 ring-1 ring-amber-200">
                      Community channel — never share or request patient-specific clinical information here.
                    </p>
                  )}
                </div>
                <div className="flex gap-2 border-t border-slate-100 pt-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={thread.scope === 'clinical' ? 'Write a clinical message…' : 'Write a community message…'}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-xs focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20"
                    onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage(thread.id, draft); setDraft(''); } }}
                  />
                  <button
                    type="button"
                    onClick={() => { if (draft.trim()) { sendMessage(thread.id, draft); setDraft(''); } }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700"
                  >
                    <Send className="h-3.5 w-3.5" /> Send
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Notifications ---------------- */

const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, notificationPrefs, toggleNotificationPref } = useDoctorPortal();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Notifications</h2>
          <p className="text-xs text-slate-500">{unread} unread · notification content never includes patient identifiers.</p>
        </div>
        {unread > 0 && (
          <button type="button" onClick={markAllNotificationsRead} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">
            <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
          </button>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-soft" aria-labelledby="notif-list">
        <ul className="divide-y divide-slate-100">
          {notifications.map((n: NotificationItem) => (
            <li key={n.id} className="flex items-start gap-3 p-4">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-slate-200' : 'bg-medical-600'}`} aria-label={n.read ? 'Read' : 'Unread'} />
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-bold ${n.read ? 'text-slate-500' : 'text-slate-800'}`}>{n.title}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{n.message}</p>
                <p className="mt-1 text-[10px] text-slate-400">{n.date}</p>
              </div>
              {!n.read && (
                <button type="button" onClick={() => markNotificationRead(n.id)} className="cursor-pointer rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                  Mark read
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="notif-prefs">
        <h3 id="notif-prefs" className="mb-3 text-sm font-extrabold text-slate-900">Notification preferences</h3>
        <ul className="space-y-2">
          {(Object.keys(notificationPrefs) as (keyof typeof notificationPrefs)[]).map((k) => (
            <li key={k} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
              <span className="text-xs font-bold capitalize text-slate-700">{k.replace('_', ' ')}</span>
              <button
                type="button"
                role="switch"
                aria-checked={notificationPrefs[k]}
                onClick={() => toggleNotificationPref(k)}
                className={`relative h-5 w-9 cursor-pointer rounded-full transition ${notificationPrefs[k] ? 'bg-medical-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${notificationPrefs[k] ? 'left-4.5 translate-x-0.5' : 'left-0.5'}`} style={{ left: notificationPrefs[k] ? 18 : 2 }} />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

/* ---------------- Referrals ---------------- */

const REFERRAL_TABS = ['Draft', 'Sent', 'Accepted', 'Declined', 'Completed'] as const;

const ReferralsView: React.FC = () => {
  const { doctor, referrals, addReferral, activeFacilityId } = useDoctorPortal();
  const [tab, setTab] = useState<(typeof REFERRAL_TABS)[number]>('Sent');
  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [reason, setReason] = useState('');
  const [err, setErr] = useState('');

  const facility = FACILITIES.find((f) => f.id === activeFacilityId);
  const list = referrals.filter((r) => r.status === tab.toLowerCase()).sort((a, b) => b.date.localeCompare(a.date));

  const create = (asDraft: boolean) => {
    if (!patient.trim() || !specialty.trim()) { setErr('Patient identifier and specialty are required.'); return; }
    const r: Referral = {
      id: `ref-${Date.now()}`,
      doctorId: doctor.id,
      facilityId: activeFacilityId,
      patientIdentifier: patient.trim().toUpperCase(),
      specialty: specialty.trim(),
      reason: reason.trim() || 'Specialist opinion requested.',
      status: asDraft ? 'draft' : 'sent',
      date: new Date().toISOString().slice(0, 10),
    };
    addReferral(r);
    setOpen(false); setPatient(''); setSpecialty(''); setReason(''); setErr('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Referrals</h2>
          <p className="text-xs text-slate-500">Referred by you from {facility?.name} · patient identifiers are pseudonymized in lists.</p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">
          <ArrowLeftRight className="h-3.5 w-3.5" /> New referral
        </button>
      </div>

      {open && (
        <section className="rounded-2xl border border-medical-200 bg-white p-5 shadow-soft" aria-labelledby="new-ref">
          <h3 id="new-ref" className="mb-4 text-sm font-extrabold text-slate-900">Create referral</h3>
          {err && <p role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">{err}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="ref-patient">Patient identifier</label>
              <input id="ref-patient" value={patient} onChange={(e) => setPatient(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20" placeholder="e.g. PT-2041 (authorized patients only)" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="ref-spec">Specialty</label>
              <input id="ref-spec" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20" placeholder="e.g. Neurology" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700" htmlFor="ref-reason">Reason</label>
              <textarea id="ref-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => create(true)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Save as draft</button>
            <button type="button" onClick={() => create(false)} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Send referral</button>
          </div>
        </section>
      )}

      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Referral statuses">
        {REFERRAL_TABS.map((t) => {
          const count = referrals.filter((r) => r.status === t.toLowerCase()).length;
          return (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                tab === t ? 'bg-medical-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50'
              }`}>
              {t} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">No {tab.toLowerCase()} referrals.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="min-w-0">
                <p className="text-sm font-extrabold text-slate-800">{r.patientIdentifier} → <span className="text-medical-700">{r.specialty}</span></p>
                <p className="mt-0.5 text-[11px] text-slate-500">{r.reason}</p>
                <p className="text-[10px] text-slate-400">{r.date} · {FACILITIES.find((f) => f.id === r.facilityId)?.name}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${
                r.status === 'accepted' ? 'bg-emerald-50 text-emerald-700'
                : r.status === 'declined' ? 'bg-rose-50 text-rose-700'
                : r.status === 'completed' ? 'bg-medical-50 text-medical-800'
                : r.status === 'sent' ? 'bg-amber-50 text-amber-800'
                : 'bg-slate-100 text-slate-500'
              }`}>{r.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ---------------- Documents ---------------- */

const DocumentsView: React.FC = () => {
  const { doctor, documents, addDocument, activeFacilityId } = useDoctorPortal();
  const [name, setName] = useState('');
  const [kind, setKind] = useState<'private' | 'credential'>('private');
  const facility = FACILITIES.find((f) => f.id === activeFacilityId);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Document Vault</h2>
        <p className="text-xs text-slate-500">Private, encrypted storage. Documents are never exposed publicly or via the patient-facing site.</p>
      </div>

      <section className="rounded-2xl border-2 border-dashed border-medical-200 bg-medical-50/40 p-6 text-center" aria-labelledby="doc-upload">
        <h3 id="doc-upload" className="flex items-center justify-center gap-2 text-sm font-extrabold text-medical-800"><Upload className="h-4 w-4" /> Secure upload (simulated)</h3>
        <p className="mt-1 text-[11px] text-slate-500">PDF or images up to 10 MB. Files are encrypted at rest and versioned on update.</p>
        <div className="mx-auto mt-3 flex max-w-md flex-wrap items-center justify-center gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Document name, e.g. CME certificate" className="w-full max-w-[240px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 sm:flex-1" aria-label="Document name" />
          <select value={kind} onChange={(e) => setKind(e.target.value as 'private' | 'credential')} className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs focus:outline-none" aria-label="Document visibility">
            <option value="private">Private (only me)</option>
            <option value="credential">Credential document</option>
          </select>
          <button
            type="button"
            onClick={() => { if (name.trim()) { addDocument({ id: `doc-${Date.now()}`, doctorId: doctor.id, name: name.trim(), kind, sizeKB: Math.floor(Math.random() * 800) + 40, uploadedAt: new Date().toISOString().slice(0, 10), version: 1, private: true, facilityId: activeFacilityId }); setName(''); } }}
            className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700"
          >
            Upload
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="doc-list">
        <h3 id="doc-list" className="mb-3 text-sm font-extrabold text-slate-900">My documents ({documents.length}) · {facility?.name}</h3>
        {documents.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No documents yet. Private vault — only you can see these.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map((d: PortalDocument) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-medical-600 ring-1 ring-slate-200"><FolderLock className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-slate-800">{d.name}</p>
                    <p className="text-[10px] text-slate-400">{d.sizeKB} KB · v{d.version} · uploaded {d.uploadedAt} · {d.kind === 'private' ? 'Private' : 'Credential'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                    <Download className="h-3 w-3" /> Download
                  </button>
                  <button type="button" className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-500 hover:bg-slate-50">
                    New version
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

/* ---------------- Insights ---------------- */

const InsightsView: React.FC = () => {
  const { doctor, appointments, activeFacilityId } = useDoctorPortal();
  const facility = FACILITIES.find((f) => f.id === activeFacilityId);
  const scoped = appointments.filter((a) => a.facilityId === activeFacilityId);
  const completed = scoped.filter((a) => a.status === 'completed').length;
  const cancelled = scoped.filter((a) => a.status === 'cancelled').length;
  const noShow = scoped.filter((a) => a.status === 'no_show').length;
  const total = scoped.length;
  const consultModes = new Set(scoped.map((a) => a.type)).size;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Practice Insights</h2>
        <p className="text-xs text-slate-500">Private analytics — never published, never visible to patients. For {facility?.name}.</p>
      </div>

      {total === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">No appointment data at this facility yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Appointments</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{total}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</p>
              <p className="mt-1 text-2xl font-extrabold text-emerald-700">{completed}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cancelled</p>
              <p className="mt-1 text-2xl font-extrabold text-rose-600">{cancelled}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">No-show</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-500">{noShow}</p>
            </div>
          </div>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="insights-modes">
            <h3 id="insights-modes" className="mb-3 text-sm font-extrabold text-slate-900">Consultation modes used</h3>
            <p className="text-xs text-slate-600">{consultModes} mode{consultModes === 1 ? '' : 's'} across your scoped appointments.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from(new Set(scoped.map((a) => a.type))).map((t) => {
                const count = scoped.filter((a) => a.type === t).length;
                const pct = Math.round((count / total) * 100);
                return (
                  <span key={t} className="rounded-xl border border-medical-100 bg-medical-50 px-3 py-2 text-xs font-bold text-medical-800">
                    {t.replace('_', ' ')} · {count} ({pct}%)
                  </span>
                );
              })}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
              <BarChart3 className="h-3.5 w-3.5 text-medical-500" /> Insights are computed from your authorized appointment records only — no fabricated metrics.
            </p>
          </section>
        </>
      )}
    </div>
  );
};
