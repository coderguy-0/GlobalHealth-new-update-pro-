import React, { useState } from 'react';
import { UserPlus, AlertCircle, CheckCircle2, UserRound, BadgeCheck, Mail } from 'lucide-react';
import { useHospitalPortal, AFFILIATION_LABEL, SPECIALTIES, DoctorAffiliationStatus } from './hospitalPortalData';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';
const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';

const STATUS_STYLE: Record<DoctorAffiliationStatus, string> = {
  invited: 'bg-slate-100 text-slate-600',
  pending: 'bg-amber-50 text-amber-800',
  active: 'bg-emerald-50 text-emerald-800',
  suspended: 'bg-rose-50 text-rose-700',
  removed: 'bg-slate-100 text-slate-500',
};

export const HospitalDoctors: React.FC = () => {
  const { organization, departments, doctors, inviteDoctor, setDoctorAffiliation } = useHospitalPortal();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [deptId, setDeptId] = useState('');
  const [quals, setQuals] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ id: string; status: 'suspended' | 'removed' } | null>(null);

  const scoped = departments.filter((d) => d.hospitalId === organization.id && d.status === 'active');
  const doctorsList = doctors.filter((d) => d.hospitalId === organization.id);

  const invite = () => {
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Doctor name and a valid email are required.'); return; }
    if (doctorsList.some((d) => d.email.toLowerCase() === email.trim().toLowerCase())) { setErr('A doctor with this email already exists.'); return; }
    inviteDoctor({
      name: name.trim(),
      email: email.trim(),
      specialtyId: specialty || undefined,
      departmentId: deptId || undefined,
      qualifications: quals.split(',').map((q) => q.trim()).filter(Boolean),
      bio: 'Bio pending doctor confirmation.',
      affiliationStatus: 'invited',
    });
    setOpen(false); setName(''); setEmail(''); setSpecialty(''); setDeptId(''); setQuals(''); setErr('');
    setOk(`Invitation sent to ${email.trim()} — the doctor must confirm their affiliation.`);
    window.setTimeout(() => setOk(''), 5000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Doctors &amp; Specialists</h2>
          <p className="text-xs text-slate-500">Secure invitation workflow — hospital staff never create unverified doctor identities.</p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">
          <UserPlus className="h-3.5 w-3.5" /> Invite Doctor
        </button>
      </div>

      {err && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800"><AlertCircle className="h-4 w-4" /> {err}</p>}
      {ok && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {ok}</p>}

      {open && (
        <section className={cardCls} aria-labelledby="doc-invite">
          <h3 id="doc-invite" className="mb-1 text-sm font-extrabold text-slate-900">Invite doctor</h3>
          <p className="mb-4 text-[11px] text-slate-500">Doctor → receives secure invitation → creates/links account → confirms affiliation → relationship established.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="doc-name">Full name <span className="text-rose-500">*</span></label>
              <input id="doc-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Dr. …" />
            </div>
            <div>
              <label className={labelCls} htmlFor="doc-email">Email <span className="text-rose-500">*</span></label>
              <input id="doc-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="doc-spec">Specialty</label>
              <select id="doc-spec" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className={inputCls}>
                <option value="">Select…</option>
                {SPECIALTIES.map((s) => <option key={s} value={s.toLowerCase().replace(/[^a-z]/g, '-')}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="doc-dept">Department</label>
              <select id="doc-dept" value={deptId} onChange={(e) => setDeptId(e.target.value)} className={inputCls}>
                <option value="">None</option>
                {scoped.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="doc-quals">Qualifications <span className="normal-case text-slate-400">(comma separated)</span></label>
              <input id="doc-quals" value={quals} onChange={(e) => setQuals(e.target.value)} className={inputCls} placeholder="MBBS, MD, DM" />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={invite} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Send invitation</button>
            <button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
          </div>
        </section>
      )}

      {confirmAction && (
        <div role="dialog" aria-modal="true" className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">{confirmAction.status === 'suspended' ? 'Suspend this doctor?' : 'Remove this doctor?'}</p>
          <p className="mt-1 text-xs text-amber-800">
            {confirmAction.status === 'suspended'
              ? 'The doctor keeps their affiliation record but cannot take new bookings.'
              : 'The affiliation is ended. Historical records are preserved — nothing is deleted.'}
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setConfirmAction(null)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Keep active</button>
            <button type="button" onClick={() => { setDoctorAffiliation(confirmAction.id, confirmAction.status); setConfirmAction(null); }} className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700">
              {confirmAction.status === 'suspended' ? 'Suspend doctor' : 'Remove doctor'}
            </button>
          </div>
        </div>
      )}

      {doctorsList.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">No doctors yet — invite your first specialist.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {doctorsList.map((d) => {
            const dept = departments.find((x) => x.id === d.departmentId);
            return (
              <article key={d.id} className={cardCls}>
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-800 text-sm font-extrabold text-white">
                    {d.name.replace('Dr. ', '').charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-slate-900">{d.name}</p>
                    <p className="truncate text-[11px] text-slate-500">{SPECIALTIES.find((s) => s.toLowerCase().replace(/[^a-z]/g, '-') === d.specialtyId) || 'General'} · {dept?.name || 'No department'}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 border-t border-slate-100 pt-3 text-[11px]">
                  <p className="flex items-center gap-1.5 truncate text-slate-500"><Mail className="h-3 w-3 shrink-0" /> {d.email}</p>
                  <p className="text-slate-500">{d.qualifications.join(', ') || 'Qualifications pending verification'}</p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold capitalize ${STATUS_STYLE[d.affiliationStatus]}`}>{AFFILIATION_LABEL[d.affiliationStatus]}</span>
                    {d.verified && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700"><BadgeCheck className="h-3 w-3" /> Verified</span>}
                  </div>
                  {d.affiliationStatus === 'active' && (
                    <div className="flex gap-1.5">
                      <button type="button" onClick={() => setConfirmAction({ id: d.id, status: 'suspended' })} className="cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-500 hover:border-amber-200 hover:text-amber-700">Suspend</button>
                      <button type="button" onClick={() => setConfirmAction({ id: d.id, status: 'removed' })} className="cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-500 hover:border-rose-200 hover:text-rose-700">Remove</button>
                    </div>
                  )}
                  {(d.affiliationStatus === 'invited' || d.affiliationStatus === 'pending') && (
                    <button type="button" onClick={() => setDoctorAffiliation(d.id, 'active')} className="cursor-pointer rounded-lg bg-medical-600 px-2.5 py-1 text-[9px] font-bold text-white hover:bg-medical-700">Confirm affiliation</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><UserRound className="h-3.5 w-3.5 text-medical-500" /> Only verified credentials are published on doctor profiles.</p>
    </div>
  );
};
