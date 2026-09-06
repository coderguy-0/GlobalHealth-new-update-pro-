import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Plus } from 'lucide-react';
import { useDoctorPortal, WorkspaceView, Referral, ReferralLoopStatus, FACILITIES } from './doctorPortalData';
import { useClinicalWorkspace } from './doctorClinicalData';

interface Props { onNavigate?: (v: WorkspaceView) => void }

const TABS: ReferralLoopStatus[] = ['draft', 'sent', 'accepted', 'scheduled', 'in_progress', 'completed', 'declined', 'cancelled'];
const TONE: Record<ReferralLoopStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-amber-50 text-amber-800',
  accepted: 'bg-sky-50 text-sky-800',
  scheduled: 'bg-indigo-50 text-indigo-800',
  in_progress: 'bg-violet-50 text-violet-800',
  completed: 'bg-emerald-50 text-emerald-800',
  declined: 'bg-rose-50 text-rose-700',
  cancelled: 'bg-slate-100 text-slate-500',
};

export const DoctorReferralsLoop: React.FC<Props> = () => {
  const { doctor, referrals, addReferral, updateReferral, activeFacilityId, addAuditEvent } = useDoctorPortal();
  const { patients, selectedPatientId, selectPatient } = useClinicalWorkspace();
  const [tab, setTab] = useState<ReferralLoopStatus | 'all'>('all');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patientId: selectedPatientId || patients[0]?.id || '',
    specialty: '',
    provider: '',
    facility: '',
    reason: '',
    summary: '',
    urgency: 'routine' as 'routine' | 'urgent' | 'stat',
    service: '',
  });
  const [err, setErr] = useState('');

  useEffect(() => {
    if (selectedPatientId) setForm((f) => ({ ...f, patientId: selectedPatientId }));
  }, [selectedPatientId]);

  const list = useMemo(
    () => referrals.filter((r) => tab === 'all' || r.status === tab).sort((a, b) => b.date.localeCompare(a.date)),
    [referrals, tab],
  );

  const create = (asDraft: boolean) => {
    const p = patients.find((x) => x.id === form.patientId);
    if (!p || !form.specialty.trim()) { setErr('Patient and specialty are required.'); return; }
    const r: Omit<Referral, 'id'> = {
      doctorId: doctor.id,
      facilityId: activeFacilityId,
      patientIdentifier: p.identifier,
      patientId: p.id,
      patientName: p.name,
      specialty: form.specialty.trim(),
      reason: form.reason.trim() || 'Specialist opinion requested.',
      status: asDraft ? 'draft' : 'sent',
      date: new Date().toISOString().slice(0, 10),
      receivingProvider: form.provider.trim() || undefined,
      receivingFacility: form.facility.trim() || undefined,
      urgency: form.urgency,
      requestedService: form.service.trim() || undefined,
      clinicalSummary: form.summary.trim() || `Known: ${(p.conditions || []).join(', ') || 'see EHR'}. Allergies: ${p.allergies.join(', ') || 'NKDA'}.`,
      attachments: p.labs.slice(0, 2).map((l) => l.test),
    };
    addReferral(r);
    addAuditEvent({ actorId: doctor.id, actorRole: 'DOCTOR', action: 'REFERRAL_CREATED', resourceId: p.id, patientId: p.id, detail: form.specialty });
    setOpen(false);
    setErr('');
    setForm((f) => ({ ...f, specialty: '', provider: '', facility: '', reason: '', summary: '', service: '' }));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Referrals</h2>
          <p className="text-xs text-[#607086]">Closed-loop tracking — not just a letter generator. {FACILITIES.find((f) => f.id === activeFacilityId)?.name}</p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
          <Plus className="h-3.5 w-3.5" /> Create referral
        </button>
      </div>

      {open && (
        <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-soft">
          {err && <p className="mb-3 rounded-xl bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">{err}</p>}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Patient
              <select value={form.patientId} onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))} className="mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold normal-case">
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name} · {p.identifier}</option>)}
              </select>
            </label>
            <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Specialty
              <input value={form.specialty} onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))} className="mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold normal-case" placeholder="e.g. Endocrinology" />
            </label>
            <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Receiving provider
              <input value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))} className="mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold normal-case" />
            </label>
            <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Facility
              <input value={form.facility} onChange={(e) => setForm((f) => ({ ...f, facility: e.target.value }))} className="mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold normal-case" />
            </label>
            <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Urgency
              <select value={form.urgency} onChange={(e) => setForm((f) => ({ ...f, urgency: e.target.value as typeof form.urgency }))} className="mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold normal-case">
                <option value="routine">Routine</option><option value="urgent">Urgent</option><option value="stat">STAT</option>
              </select>
            </label>
            <label className="block text-[10px] font-bold uppercase text-[#8A97A8]">Requested service
              <input value={form.service} onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} className="mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold normal-case" />
            </label>
            <label className="block text-[10px] font-bold uppercase text-[#8A97A8] sm:col-span-2">Reason
              <textarea value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold normal-case" />
            </label>
            <label className="block text-[10px] font-bold uppercase text-[#8A97A8] sm:col-span-2">Clinical summary
              <textarea value={form.summary} onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))} rows={2} className="mt-1 w-full rounded-xl border px-3 py-2 text-xs font-semibold normal-case" placeholder="Pulled from authorized EHR when left blank" />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => create(true)} className="rounded-xl border px-4 py-2 text-xs font-bold">Save draft</button>
            <button type="button" onClick={() => create(false)} className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">Send referral</button>
          </div>
        </section>
      )}

      <div className="flex gap-1.5 overflow-x-auto">
        <Chip active={tab === 'all'} onClick={() => setTab('all')} label={`All ${referrals.length}`} />
        {TABS.map((t) => (
          <Chip key={t} active={tab === t} onClick={() => setTab(t)} label={`${t.replace('_', ' ')} ${referrals.filter((r) => r.status === t).length}`} />
        ))}
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#E3E8EF] bg-white p-10 text-center text-xs text-slate-400">No referrals in this state.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((r) => (
            <li key={r.id} className="rounded-2xl border border-[#E3E8EF] bg-white p-4 shadow-soft">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#162235]">
                    {r.patientName || r.patientIdentifier} → {r.specialty}
                    {r.urgency === 'stat' && <span className="ml-2 rounded-full bg-rose-600 px-1.5 py-0.5 text-[9px] font-bold text-white">STAT</span>}
                    {r.urgency === 'urgent' && <span className="ml-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white">URGENT</span>}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#607086]">{r.reason}</p>
                  <p className="mt-1 text-[10px] text-[#8A97A8]">
                    {r.receivingProvider || 'Unassigned'} · {r.receivingFacility || '—'} · {r.date}
                    {r.appointmentDate ? ` · appt ${r.appointmentDate}` : ''}
                  </p>
                  {r.clinicalSummary && <p className="mt-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] text-[#162235]">{r.clinicalSummary}</p>}
                  {r.specialistResponse && <p className="mt-1 text-[11px] font-semibold text-emerald-800">Specialist: {r.specialistResponse}</p>}
                  {r.attachments && r.attachments.length > 0 && <p className="mt-1 text-[10px] text-[#8A97A8]">Attached: {r.attachments.join(', ')}</p>}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${TONE[r.status]}`}>{r.status.replace('_', ' ')}</span>
                  {r.status === 'sent' && <Mini onClick={() => updateReferral(r.id, { status: 'accepted', specialistResponse: 'Accepted by receiving provider.' })}>Mark accepted</Mini>}
                  {r.status === 'accepted' && <Mini onClick={() => updateReferral(r.id, { status: 'scheduled', appointmentDate: new Date().toISOString().slice(0, 10) })}>Mark scheduled</Mini>}
                  {r.status === 'scheduled' && <Mini onClick={() => updateReferral(r.id, { status: 'in_progress' })}>In progress</Mini>}
                  {r.status === 'in_progress' && <Mini onClick={() => updateReferral(r.id, { status: 'completed', specialistResponse: (r.specialistResponse || '') + ' Notes returned.' })}>Complete</Mini>}
                  {['sent', 'accepted', 'scheduled'].includes(r.status) && <Mini onClick={() => updateReferral(r.id, { status: 'declined' })} danger>Decline</Mini>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Chip: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button type="button" onClick={onClick} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold capitalize ${active ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-white text-[#607086] ring-1 ring-[#E3E8EF]'}`}>{label}</button>
);
const Mini: React.FC<{ onClick: () => void; children: React.ReactNode; danger?: boolean }> = ({ onClick, children, danger }) => (
  <button type="button" onClick={onClick} className={`rounded-lg px-2.5 py-1 text-[10px] font-bold ${danger ? 'text-rose-600 hover:bg-rose-50' : 'bg-[#0B1F3A] text-white'}`}>{children}</button>
);

export const ReferralsHint: React.FC = () => (
  <p className="flex items-center gap-1.5 text-[11px] text-[#8A97A8]"><ArrowLeftRight className="h-3.5 w-3.5" /> Referring doctor always sees acceptance, appointment and returned notes.</p>
);
