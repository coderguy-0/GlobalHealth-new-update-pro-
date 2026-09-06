import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Monitor, MessageSquare, FolderHeart, ClipboardList, FlaskConical, ArrowLeftRight, Wifi } from 'lucide-react';
import { useDoctorPortal, WorkspaceView } from './doctorPortalData';
import { useClinicalWorkspace } from './doctorClinicalData';

interface Props { onNavigate: (v: WorkspaceView) => void }

export const DoctorTelemedicine: React.FC<Props> = ({ onNavigate }) => {
  const { telemedicineSessions, updateTelemedicineSession, addAuditEvent, doctor } = useDoctorPortal();
  const { patients, selectPatient, startEncounter } = useClinicalWorkspace();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [cam, setCam] = useState(true);
  const [mic, setMic] = useState(true);
  const [chat, setChat] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const live = telemedicineSessions.filter((s) => s.status === 'live');
  const waiting = telemedicineSessions.filter((s) => s.status === 'waiting');
  const upcoming = telemedicineSessions.filter((s) => s.status === 'upcoming');
  const completed = telemedicineSessions.filter((s) => s.status === 'completed');
  const missed = telemedicineSessions.filter((s) => s.status === 'missed');
  const session = telemedicineSessions.find((s) => s.id === activeId) || null;
  const patient = session ? patients.find((p) => p.id === session.patientId) : null;

  const join = (id: string) => {
    const s = telemedicineSessions.find((x) => x.id === id);
    if (!s) return;
    updateTelemedicineSession(id, { status: 'live', connectionStatus: 'connected' });
    selectPatient(s.patientId);
    startEncounter(s.patientId, s.appointmentId);
    setActiveId(id);
    addAuditEvent({ actorId: doctor.id, actorRole: 'DOCTOR', action: 'TELEMEDICINE_JOINED', resourceId: id, patientId: s.patientId, detail: s.patientIdentifier });
  };

  const end = () => {
    if (!session) return;
    updateTelemedicineSession(session.id, { status: 'completed', connectionStatus: 'ended', durationMin: 12 });
    addAuditEvent({ actorId: doctor.id, actorRole: 'DOCTOR', action: 'TELEMEDICINE_ENDED', resourceId: session.id, patientId: session.patientId });
    setActiveId(null);
  };

  if (session && session.status === 'live') {
    return (
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-[#E3E8EF] bg-[#0B1F3A] text-white xl:col-span-2">
          <div className="relative flex min-h-[360px] flex-col items-center justify-center p-8">
            <div className="grid h-28 w-28 place-items-center rounded-full bg-white/10 text-3xl font-extrabold">
              {session.patientName.split(' ').map((x) => x[0]).slice(0, 2).join('')}
            </div>
            <p className="mt-3 text-lg font-extrabold">{session.patientName}</p>
            <p className="text-xs text-white/70">{session.patientIdentifier} · {cam ? 'Camera on' : 'Camera off'} · {mic ? 'Mic on' : 'Muted'}</p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE</span>
            <div className="absolute right-4 top-4 rounded-xl bg-black/40 px-3 py-2 text-[10px]">
              <p className="font-bold">You</p>
              <p className="text-white/70">{doctor.displayName}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-white/10 bg-black/20 px-4 py-3">
            <Ctrl onClick={() => setMic(!mic)} active={mic} label={mic ? 'Mute' : 'Unmute'}>{mic ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}</Ctrl>
            <Ctrl onClick={() => setCam(!cam)} active={cam} label={cam ? 'Camera' : 'Camera off'}>{cam ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}</Ctrl>
            <Ctrl onClick={() => setLog((l) => [...l, 'Screen share started (simulated)'])} active label="Share"><Monitor className="h-4 w-4" /></Ctrl>
            <button type="button" onClick={end} className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"><PhoneOff className="h-4 w-4" /> End call</button>
            <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-emerald-200"><Wifi className="h-3.5 w-3.5" /> {session.connectionStatus}</span>
          </div>
        </section>
        <div className="space-y-3">
          <section className="rounded-2xl border border-[#E3E8EF] bg-white p-4 shadow-soft">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Patient information</p>
            <p className="mt-1 text-sm font-extrabold text-[#162235]">{session.patientName}</p>
            <p className="text-xs text-[#607086]">{patient ? `${patient.age}y · ${patient.sex} · ${patient.bloodGroup}` : session.patientIdentifier}</p>
            <p className="mt-2 text-[11px] text-[#607086]">Consent: {session.consentStatus} · Appointment {session.startTime}</p>
            {patient?.allergies.length ? <p className="mt-2 rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700">Allergies: {patient.allergies.join(', ')}</p> : null}
          </section>
          <section className="rounded-2xl border border-[#E3E8EF] bg-white p-4 shadow-soft">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Clinical tools</p>
            <div className="grid grid-cols-2 gap-2">
              <Tool onClick={() => onNavigate('ehr')} icon={<FolderHeart className="h-3.5 w-3.5" />} label="EHR" />
              <Tool onClick={() => onNavigate('consultations')} icon={<MessageSquare className="h-3.5 w-3.5" />} label="Notes" />
              <Tool onClick={() => onNavigate('prescriptions')} icon={<ClipboardList className="h-3.5 w-3.5" />} label="Prescription" />
              <Tool onClick={() => onNavigate('labs')} icon={<FlaskConical className="h-3.5 w-3.5" />} label="Lab order" />
              <Tool onClick={() => onNavigate('referrals')} icon={<ArrowLeftRight className="h-3.5 w-3.5" />} label="Referral" />
              <Tool onClick={() => onNavigate('vitals')} icon={<Video className="h-3.5 w-3.5" />} label="Vitals" />
            </div>
          </section>
          <section className="rounded-2xl border border-[#E3E8EF] bg-white p-4 shadow-soft">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">Session chat</p>
            <div className="mb-2 max-h-24 space-y-1 overflow-y-auto text-[11px] text-[#607086]">
              {log.length === 0 ? <p>No messages yet.</p> : log.map((m, i) => <p key={i}>{m}</p>)}
            </div>
            <div className="flex gap-2">
              <input value={chat} onChange={(e) => setChat(e.target.value)} placeholder="Message…" className="flex-1 rounded-xl border border-[#E3E8EF] px-2.5 py-1.5 text-xs" />
              <button type="button" onClick={() => { if (chat.trim()) { setLog((l) => [...l, `You: ${chat.trim()}`]); setChat(''); } }} className="rounded-xl bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white">Send</button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Telemedicine Suite</h2>
        <p className="text-xs text-[#607086]">Digital consultation room — EHR, notes, prescription, labs and referrals stay inside the encounter.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Upcoming Calls" value={upcoming.length} />
        <Stat label="Live Now" value={live.length + waiting.length} accent />
        <Stat label="Completed Sessions" value={completed.length} />
        <Stat label="Missed Sessions" value={missed.length} />
      </div>

      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <h3 className="mb-3 text-sm font-extrabold text-[#162235]">Waiting room</h3>
        {waiting.length === 0 ? <p className="text-xs text-slate-400">No patients are waiting.</p> : waiting.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div>
              <p className="text-sm font-extrabold text-amber-950">Patient is waiting · {s.patientName}</p>
              <p className="text-[11px] text-amber-800">{s.patientIdentifier} · since {s.waitingSince || s.startTime} · consent {s.consentStatus}</p>
            </div>
            <button type="button" onClick={() => join(s.id)} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">Join Consultation</button>
          </div>
        ))}
      </section>

      <List title="Upcoming" items={upcoming} empty="No upcoming video visits." action="Prepare" onAction={(id) => { const s = telemedicineSessions.find((x: { id: string }) => x.id === id); if (s) { selectPatient(s.patientId); onNavigate('ehr'); } }} />
      <List title="Completed" items={completed} empty="No completed sessions." />
      <List title="Missed" items={missed} empty="No missed sessions." />
    </div>
  );
};

const Stat: React.FC<{ label: string; value: number; accent?: boolean }> = ({ label, value, accent }) => (
  <div className={`rounded-2xl border p-4 shadow-soft ${accent ? 'border-rose-200 bg-rose-50' : 'border-[#E3E8EF] bg-white'}`}>
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p>
    <p className="mt-1 text-2xl font-extrabold text-[#162235]">{value}</p>
  </div>
);
const Ctrl: React.FC<{ onClick: () => void; active: boolean; label: string; children: React.ReactNode }> = ({ onClick, active, label, children }) => (
  <button type="button" onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-bold ${active ? 'bg-white/15 text-white' : 'bg-white text-[#0B1F3A]'}`}>{children} {label}</button>
);
const Tool: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] px-2.5 py-2 text-[11px] font-bold text-[#162235] hover:bg-emerald-50">{icon} {label}</button>
);
const List: React.FC<{ title: string; items: { id: string; patientName: string; patientIdentifier: string; startTime: string; scheduledAt: string }[]; empty: string; action?: string; onAction?: (id: string) => void }> = ({ title, items, empty, action, onAction }) => (
  <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
    <h3 className="mb-3 text-sm font-extrabold text-[#162235]">{title}</h3>
    {items.length === 0 ? <p className="text-xs text-slate-400">{empty}</p> : (
      <ul className="space-y-2">
        {items.map((s) => (
          <li key={s.id} className="flex items-center justify-between rounded-xl border border-[#E3E8EF] px-3 py-2 text-xs">
            <span><span className="font-bold text-[#162235]">{s.patientName}</span> · {s.patientIdentifier} · {s.scheduledAt} {s.startTime}</span>
            {action && onAction && <button type="button" onClick={() => onAction(s.id)} className="rounded-lg bg-[#0B1F3A] px-2.5 py-1 text-[10px] font-bold text-white">{action}</button>}
          </li>
        ))}
      </ul>
    )}
  </section>
);
