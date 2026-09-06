import React, { useState } from 'react';
import { DoorOpen, Plus, AlertCircle, CheckCircle2, Archive, Users, ClipboardList, Clock3, CalendarClock } from 'lucide-react';
import { useHospitalPortal, Department, SPECIALTIES } from './hospitalPortalData';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';
const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';

export const HospitalDepartments: React.FC = () => {
  const { organization, departments, doctors, services, appointments, addDepartment, archiveDepartment } = useHospitalPortal();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [confirmArchive, setConfirmArchive] = useState<string | null>(null);

  const scoped = departments.filter((d) => d.hospitalId === organization.id);
  const active = scoped.filter((d) => d.status === 'active');

  const create = () => {
    if (!name.trim()) { setErr('Department name is required.'); return; }
    if (active.some((d) => d.name.toLowerCase() === name.trim().toLowerCase())) { setErr('A department with this name already exists.'); return; }
    addDepartment({
      name: name.trim(),
      specialtyId: specialtyId || undefined,
      description: description.trim() || 'Description pending.',
      services: [],
      doctorIds: [],
      status: 'active',
      appointmentSettings: { defaultDurationMin: 30, allowPublicBooking: true },
    });
    setOpen(false); setName(''); setSpecialtyId(''); setDescription(''); setErr('');
    setOk(`Department “${name.trim()}” created.`);
    window.setTimeout(() => setOk(''), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Departments</h2>
          <p className="text-xs text-slate-500">{active.length} active · {scoped.length - active.length} archived</p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">
          <Plus className="h-3.5 w-3.5" /> Create department
        </button>
      </div>

      {err && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800"><AlertCircle className="h-4 w-4" /> {err}</p>}
      {ok && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {ok}</p>}

      {open && (
        <section className={cardCls} aria-labelledby="dep-new">
          <h3 id="dep-new" className="mb-4 text-sm font-extrabold text-slate-900">New department</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="dep-name">Department name <span className="text-rose-500">*</span></label>
              <input id="dep-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Cardiology" />
            </div>
            <div>
              <label className={labelCls} htmlFor="dep-spec">Specialty</label>
              <select id="dep-spec" value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)} className={inputCls}>
                <option value="">None</option>
                {SPECIALTIES.map((s) => <option key={s} value={s.toLowerCase().replace(/[^a-z]/g, '-')}>{s}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="dep-desc">Description</label>
              <textarea id="dep-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={create} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Create department</button>
            <button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
          </div>
        </section>
      )}

      {confirmArchive && (
        <div role="dialog" aria-modal="true" className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">Archive this department?</p>
          <p className="mt-1 text-xs text-amber-800">Archiving preserves historical records (appointments, staff assignments) — the department is just removed from active operations.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setConfirmArchive(null)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Keep active</button>
            <button type="button" onClick={() => { archiveDepartment(confirmArchive); setConfirmArchive(null); }} className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700">Archive department</button>
          </div>
        </div>
      )}

      {active.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">No departments yet — create your first department.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {active.map((d) => {
            const deptDoctors = doctors.filter((doc) => d.doctorIds.includes(doc.id));
            const deptAppts = appointments.filter((a) => a.hospitalId === organization.id && a.departmentId === d.id);
            return (
              <article key={d.id} className={cardCls}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-medical-50 text-medical-700 ring-1 ring-medical-100"><DoorOpen className="h-5 w-5" /></span>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{d.name}</h3>
                      <p className="text-[11px] text-slate-500">{d.specialtyId ? SPECIALTIES.find((s) => s.toLowerCase().replace(/[^a-z]/g, '-') === d.specialtyId) || 'Specialty' : 'General'}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setConfirmArchive(d.id)} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-500 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700">
                    <Archive className="h-3 w-3" /> Archive
                  </button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{d.description}</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-[11px] sm:grid-cols-4">
                  <DeptStat icon={<Users className="h-3.5 w-3.5" />} label="Doctors" value={deptDoctors.length} />
                  <DeptStat icon={<ClipboardList className="h-3.5 w-3.5" />} label="Services" value={d.services.length} />
                  <DeptStat icon={<CalendarClock className="h-3.5 w-3.5" />} label="Appointments" value={deptAppts.length} />
                  <DeptStat icon={<Clock3 className="h-3.5 w-3.5" />} label="Hours" value={d.hours?.length ? `${d.hours.length}d` : '—'} />
                </dl>
              </article>
            );
          })}
        </div>
      )}

      {/* Archived */}
      {scoped.some((d) => d.status === 'archived') && (
        <section className={cardCls} aria-labelledby="dep-archived">
          <h3 id="dep-archived" className="mb-3 text-sm font-extrabold text-slate-900">Archived departments ({scoped.filter((d) => d.status === 'archived').length})</h3>
          <ul className="space-y-2">
            {scoped.filter((d) => d.status === 'archived').map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                <span className="text-xs font-bold text-slate-500">{d.name}</span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">Archived — history preserved</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

const DeptStat: React.FC<{ icon: React.ReactNode; label: string; value: number | string }> = ({ icon, label, value }) => (
  <div className="rounded-lg bg-slate-50 px-2 py-1.5">
    <dt className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">{icon} {label}</dt>
    <dd className="mt-0.5 text-sm font-extrabold text-slate-800">{value}</dd>
  </div>
);
