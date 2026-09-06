import React, { useState } from 'react';
import { Building2, Plus, AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import { useDoctorPortal, FACILITIES, AffiliationStatus } from './doctorPortalData';

const STATUS_STYLE: Record<AffiliationStatus, string> = {
  requested: 'bg-slate-100 text-slate-600',
  pending: 'bg-amber-50 text-amber-800',
  active: 'bg-emerald-50 text-emerald-800',
  suspended: 'bg-rose-50 text-rose-700',
  ended: 'bg-slate-100 text-slate-500',
  rejected: 'bg-rose-50 text-rose-700',
};

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

export const DoctorAffiliations: React.FC = () => {
  const { doctor, activeFacilityId, setActiveFacility, affiliations, requestAffiliation } = useDoctorPortal();
  const [facilityId, setFacilityId] = useState('');
  const [dept, setDept] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [confirmEnd, setConfirmEnd] = useState<string | null>(null);

  const submit = () => {
    if (!facilityId) { setErr('Select a facility.'); return; }
    if (affiliations.some((a) => a.facilityId === facilityId && ['requested', 'pending', 'active'].includes(a.status))) {
      setErr('An affiliation with this facility is already requested, pending or active.');
      return;
    }
    requestAffiliation(facilityId, dept.trim() || 'General');
    setOk(`Affiliation request sent to ${FACILITIES.find((f) => f.id === facilityId)?.name}. It must be approved before it shows as active.`);
    setFacilityId(''); setDept(''); setErr('');
    window.setTimeout(() => setOk(''), 6000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Practice Locations &amp; Affiliations</h2>
        <p className="text-xs text-slate-500">You are represented as working at a facility only after it approves your affiliation.</p>
      </div>

      {err && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800"><AlertCircle className="h-4 w-4 shrink-0" /> {err}</p>}
      {ok && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" /> {ok}</p>}
      {confirmEnd && (
        <div role="dialog" aria-modal="true" className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-900">End this affiliation?</p>
          <p className="mt-1 text-xs text-rose-800">Your representation at this facility will be removed from your public profile. Appointments remain in the audit trail.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => { setConfirmEnd(null); }} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Keep</button>
            <button type="button" onClick={() => { setConfirmEnd(null); }} className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700">End affiliation (simulated)</button>
          </div>
        </div>
      )}

      {/* Request new */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="req-af">
        <h3 id="req-af" className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Plus className="h-4 w-4 text-medical-600" /> Request a new affiliation</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="af-fac">Facility</label>
            <select id="af-fac" value={facilityId} onChange={(e) => setFacilityId(e.target.value)} className={inputCls}>
              <option value="">Select a facility…</option>
              {FACILITIES.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="af-dept">Department</label>
            <input id="af-dept" value={dept} onChange={(e) => setDept(e.target.value)} className={inputCls} placeholder="e.g. Cardiology" />
          </div>
        </div>
        <button type="button" onClick={submit} className="mt-4 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-medical-700">
          Send request
        </button>
      </section>

      {/* Current affiliations */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="af-list">
        <h3 id="af-list" className="mb-3 text-sm font-extrabold text-slate-900">Affiliations ({affiliations.length})</h3>
        <ul className="space-y-3">
          {affiliations.map((a) => {
            const f = FACILITIES.find((x) => x.id === a.facilityId);
            const isActiveFacility = a.facilityId === activeFacilityId;
            return (
              <li key={a.id} className={`rounded-xl border p-4 ${isActiveFacility ? 'border-medical-300 bg-medical-50/50' : 'border-slate-100 bg-slate-50/60'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-medical-700 ring-1 ring-slate-200">
                      <Building2 className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">{f?.name || 'Unknown facility'}</p>
                      <p className="flex items-center gap-1 text-[11px] text-slate-500"><MapPin className="h-3 w-3" /> {f?.address} · {a.department}</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">Since {a.startedAt || '—'}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${STATUS_STYLE[a.status]}`}>{a.status}</span>
                    {isActiveFacility && (
                      <button type="button" onClick={() => { /* already active */ }} className="cursor-pointer rounded-lg bg-medical-600 px-3 py-1 text-[10px] font-bold text-white">Active location</button>
                    )}
                    {a.status === 'active' && !isActiveFacility && (
                      <button type="button" onClick={() => setActiveFacility(a.facilityId)} className="cursor-pointer rounded-lg border border-medical-300 bg-white px-3 py-1 text-[10px] font-bold text-medical-700 transition hover:bg-medical-100">
                        Switch here
                      </button>
                    )}
                    {a.status === 'active' && (
                      <button type="button" onClick={() => setConfirmEnd(a.id)} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1 text-[10px] font-bold text-slate-500 transition hover:border-rose-200 hover:text-rose-600">
                        End
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-[11px] text-slate-400">
          The workspace currently shows data scoped to <span className="font-bold text-medical-700">{FACILITIES.find((f) => f.id === activeFacilityId)?.name}</span>.
        </p>
      </section>

      <p className="text-[11px] text-slate-400">{doctor.fullName} — affiliation changes are audited.</p>
    </div>
  );
};
