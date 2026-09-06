import React, { useMemo, useState } from 'react';
import { Pin, BellOff, Archive, Search, Send, ShieldAlert, FolderHeart, Stethoscope } from 'lucide-react';
import { useDoctorPortal, WorkspaceView, ConversationType, SecureMessage } from './doctorPortalData';
import { useClinicalWorkspace } from './doctorClinicalData';

interface Props { onNavigate: (v: WorkspaceView) => void }

const TYPE_LABEL: Record<ConversationType, string> = {
  patient: 'Patient', hospital: 'Hospital', staff: 'Staff', doctor: 'Doctor',
  laboratory: 'Laboratory', pharmacy: 'Pharmacy', care_team: 'Care team',
};

export const DoctorMessages: React.FC<Props> = ({ onNavigate }) => {
  const { messages, sendMessage, markMessageRead, patchMessage, addAuditEvent, doctor } = useDoctorPortal();
  const { patients, selectedPatientId, selectPatient } = useClinicalWorkspace();
  const [threadId, setThreadId] = useState<string | null>(messages.find((m) => !m.archived)?.id ?? null);
  const [draft, setDraft] = useState('');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | ConversationType | 'unread' | 'pinned'>('all');

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return messages
      .filter((m) => !m.archived)
      .filter((m) => {
        if (filter === 'unread') return !m.read;
        if (filter === 'pinned') return !!m.pinned;
        if (filter !== 'all') return m.conversationType === filter;
        return true;
      })
      .filter((m) => !query || m.senderName.toLowerCase().includes(query) || m.subject.toLowerCase().includes(query) || (m.patientIdentifier || '').toLowerCase().includes(query))
      .sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.date.localeCompare(a.date));
  }, [messages, q, filter]);

  const thread = messages.find((m) => m.id === threadId) || null;
  const linked = thread?.patientId ? patients.find((p) => p.id === thread.patientId) : null;
  const canMessagePatient = !thread || thread.conversationType !== 'patient' || linked?.consentStatus === 'granted' || thread.scope === 'clinical';

  const openThread = (m: SecureMessage) => {
    setThreadId(m.id);
    markMessageRead(m.id);
    if (m.patientId) selectPatient(m.patientId);
    addAuditEvent({ actorId: doctor.id, actorRole: 'DOCTOR', action: 'MESSAGE_SENT', resourceId: m.id, patientId: m.patientId || null, detail: 'Opened conversation' });
  };

  const send = () => {
    if (!thread || !draft.trim()) return;
    if (thread.conversationType === 'patient' && linked && linked.consentStatus === 'denied') return;
    sendMessage(thread.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Messages & Communication</h2>
        <p className="text-xs text-[#607086]">Secure channels. Messaging a patient requires a relationship, consent and appointment context — not a directory dump.</p>
      </div>

      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[#E3E8EF] bg-white shadow-soft lg:grid-cols-[280px_1fr_240px] lg:min-h-[560px]">
        <aside className="border-b border-[#E3E8EF] lg:border-b-0 lg:border-r">
          <div className="border-b border-[#E3E8EF] p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8A97A8]" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations…" className="w-full rounded-xl border border-[#E3E8EF] py-2 pl-8 pr-2 text-xs focus:border-emerald-500 focus:outline-none" />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {(['all', 'unread', 'pinned', 'patient', 'laboratory', 'pharmacy', 'doctor', 'hospital'] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${filter === f ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-slate-50 text-[#607086]'}`}>{f}</button>
              ))}
            </div>
          </div>
          <ul className="max-h-[420px] overflow-y-auto p-2">
            {list.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => openThread(m)} className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left ${threadId === m.id ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'hover:bg-slate-50'}`}>
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-extrabold text-[#162235]">{m.senderName}</span>
                    <span className="flex items-center gap-1">
                      {m.pinned && <Pin className="h-3 w-3 text-emerald-700" />}
                      {m.online && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                      {!m.read && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-[#607086]">{m.subject}</span>
                  <span className="mt-0.5 flex items-center justify-between text-[9px] text-[#8A97A8]">
                    <span>{m.conversationType ? TYPE_LABEL[m.conversationType] : m.scope} · {m.date}</span>
                    {m.priority === 'high' && <span className="font-bold text-rose-600">HIGH</span>}
                  </span>
                </button>
              </li>
            ))}
            {list.length === 0 && <p className="p-4 text-center text-[11px] text-slate-400">No conversations match.</p>}
          </ul>
        </aside>

        <section className="flex min-h-[360px] flex-col">
          {!thread ? (
            <p className="m-auto text-center text-xs text-slate-400">Select a conversation.</p>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-[#E3E8EF] px-4 py-3">
                <div>
                  <p className="text-sm font-extrabold text-[#162235]">{thread.senderName}</p>
                  <p className="text-[11px] text-[#607086]">{thread.subject} · {thread.conversationType ? TYPE_LABEL[thread.conversationType] : thread.scope}</p>
                </div>
                <div className="flex gap-1">
                  <IconBtn title="Pin" onClick={() => patchMessage(thread.id, { pinned: !thread.pinned })}><Pin className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn title="Mute" onClick={() => patchMessage(thread.id, { muted: !thread.muted })}><BellOff className="h-3.5 w-3.5" /></IconBtn>
                  <IconBtn title="Archive" onClick={() => { patchMessage(thread.id, { archived: true }); setThreadId(null); }}><Archive className="h-3.5 w-3.5" /></IconBtn>
                </div>
              </div>
              {thread.scope === 'community' && (
                <p className="mx-4 mt-3 rounded-xl bg-amber-50 px-3 py-2 text-[10px] text-amber-800 ring-1 ring-amber-200">Community channel — never share patient-specific clinical information here.</p>
              )}
              {thread.conversationType === 'patient' && linked && linked.consentStatus !== 'granted' && (
                <p className="mx-4 mt-3 flex items-start gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-[10px] text-rose-800 ring-1 ring-rose-200"><ShieldAlert className="mt-0.5 h-3.5 w-3.5" /> Patient messaging is limited until consent is granted. You may still exchange appointment logistics.</p>
              )}
              <div className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
                {thread.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs ${msg.fromMe ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                      <p className={`mt-1 text-[9px] ${msg.fromMe ? 'text-emerald-100' : 'text-slate-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 border-t border-[#E3E8EF] p-3">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
                  disabled={!canMessagePatient && linked?.consentStatus === 'denied'}
                  placeholder={thread.scope === 'clinical' ? 'Write a secure clinical message…' : 'Write a community message…'}
                  className="flex-1 rounded-xl border border-[#E3E8EF] px-3 py-2.5 text-xs focus:border-emerald-500 focus:outline-none disabled:opacity-50"
                />
                <button type="button" onClick={send} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"><Send className="h-3.5 w-3.5" /> Send</button>
              </div>
            </>
          )}
        </section>

        <aside className="hidden border-l border-[#E3E8EF] p-4 lg:block">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Context</p>
          {linked ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="text-sm font-extrabold text-[#162235]">{linked.name}</p>
                <p className="text-[11px] text-[#607086]">{linked.identifier} · {linked.age}y · {linked.sex}</p>
                <p className={`mt-1 text-[11px] font-bold ${linked.consentStatus === 'granted' ? 'text-emerald-700' : 'text-amber-700'}`}>Consent: {linked.consentStatus}</p>
                {linked.allergies.length > 0 && <p className="mt-1 text-[11px] font-bold text-rose-700">Allergies: {linked.allergies.join(', ')}</p>}
              </div>
              <button type="button" onClick={() => onNavigate('ehr')} className="flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs font-bold hover:bg-emerald-50"><FolderHeart className="h-3.5 w-3.5 text-emerald-700" /> Open EHR</button>
              <button type="button" onClick={() => onNavigate('consultations')} className="flex w-full items-center gap-2 rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs font-bold hover:bg-emerald-50"><Stethoscope className="h-3.5 w-3.5 text-emerald-700" /> Consultation</button>
            </div>
          ) : selectedPatientId ? (
            <p className="mt-3 text-xs text-[#607086]">A patient is selected in the workspace, but this thread is not patient-linked.</p>
          ) : (
            <p className="mt-3 text-xs text-[#8A97A8]">No patient attached to this conversation.</p>
          )}
        </aside>
      </div>
    </div>
  );
};

const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button type="button" title={title} onClick={onClick} className="rounded-lg border border-[#E3E8EF] p-1.5 text-[#607086] hover:bg-slate-50">{children}</button>
);
