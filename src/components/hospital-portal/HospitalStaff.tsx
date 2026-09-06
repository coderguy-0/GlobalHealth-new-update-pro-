import React, { useState } from 'react';
import { UserCog, Plus, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useHospitalPortal, STAFF_ROLE_LABEL, StaffRole, PERMISSIONS, Permission } from './hospitalPortalData';

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';
const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';

const STATUS_STYLE: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-800',
  invited: 'bg-amber-50 text-amber-800',
  suspended: 'bg-rose-50 text-rose-700',
  removed: 'bg-slate-100 text-slate-500',
};

const ROLES: StaffRole[] = ['owner', 'administrator', 'department_manager', 'receptionist', 'doctor', 'verification_manager', 'read_only'];

export const HospitalStaff: React.FC = () => {
  const { organization, staff, addStaff, setStaffStatus, changeStaffRole } = useHospitalPortal();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<StaffRole>('receptionist');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [confirmSuspend, setConfirmSuspend] = useState<string | null>(null);
  const [reviewId, setReviewId] = useState<string | null>(null);

  const scoped = staff.filter((s) => s.hospitalId === organization.id);

  const invite = () => {
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Name and a valid email are required.'); return; }
    if (scoped.some((s) => s.email.toLowerCase() === email.trim().toLowerCase())) { setErr('A staff member with this email already exists.'); return; }
    addStaff({ name: name.trim(), email: email.trim(), role });
    setOpen(false); setName(''); setEmail(''); setErr('');
    setOk(`Invitation sent to ${email.trim()} as ${STAFF_ROLE_LABEL[role]}.`);
    window.setTimeout(() => setOk(''), 5000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Staff &amp; Roles</h2>
          <p className="text-xs text-slate-500">Granular permissions — roles never grant access implicitly.</p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">
          <Plus className="h-3.5 w-3.5" /> Invite staff
        </button>
      </div>

      {err && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800"><AlertCircle className="h-4 w-4" /> {err}</p>}
      {ok && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {ok}</p>}

      {open && (
        <section className={cardCls} aria-labelledby="st-invite">
          <h3 id="st-invite" className="mb-4 text-sm font-extrabold text-slate-900">Invite staff member</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls} htmlFor="st-name">Name</label>
              <input id="st-name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="st-email">Work email</label>
              <input id="st-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="st-role">Role</label>
              <select id="st-role" value={role} onChange={(e) => setRole(e.target.value as StaffRole)} className={inputCls}>
                {ROLES.filter((r) => r !== 'owner').map((r) => <option key={r} value={r}>{STAFF_ROLE_LABEL[r]}</option>)}
              </select>
            </div>
          </div>
          <button type="button" onClick={invite} className="mt-4 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Send invitation</button>
        </section>
      )}

      {confirmSuspend && (
        <div role="dialog" aria-modal="true" className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-bold text-amber-900">Suspend this staff member's access?</p>
          <p className="mt-1 text-xs text-amber-800">The account keeps its history but can no longer sign in. Use Remove Access to end it permanently (records preserved).</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setConfirmSuspend(null)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Keep active</button>
            <button type="button" onClick={() => { setStaffStatus(confirmSuspend, 'suspended'); setConfirmSuspend(null); }} className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700">Suspend access</button>
          </div>
        </div>
      )}

      {reviewId && (
        <div role="dialog" aria-modal="true" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lift">
          <p className="text-sm font-extrabold text-slate-900">Review permissions</p>
          {scoped.filter((s) => s.id === reviewId).map((s) => (
            <div key={s.id} className="mt-3 space-y-3">
              <p className="text-xs text-slate-500">{s.name} · {STAFF_ROLE_LABEL[s.role]}</p>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                {PERMISSIONS.map((p) => {
                  const granted = s.permissions.includes(p as Permission);
                  return (
                    <span key={p} className={`rounded-lg px-2 py-1.5 text-[10px] font-bold ${granted ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                      {granted ? '✓ ' : '— '}{p.replace(/_/g, ' ')}
                    </span>
                  );
                })}
              </div>
              <div className="flex gap-2 border-t border-slate-100 pt-3">
                <button type="button" onClick={() => setReviewId(null)} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Close</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Access review (§84) */}
      <section className={cardCls} aria-labelledby="st-review">
        <h3 id="st-review" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><UserCog className="h-4 w-4 text-medical-600" /> Staff access review</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th scope="col" className="px-3 py-2.5">Staff member</th>
                <th scope="col" className="px-3 py-2.5">Role</th>
                <th scope="col" className="px-3 py-2.5">Permissions</th>
                <th scope="col" className="px-3 py-2.5">Last active</th>
                <th scope="col" className="px-3 py-2.5">Status</th>
                <th scope="col" className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scoped.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60">
                  <td className="px-3 py-3">
                    <p className="font-bold text-slate-800">{s.name}</p>
                    <p className="text-[10px] text-slate-400">{s.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    <select value={s.role} onChange={(e) => changeStaffRole(s.id, e.target.value as StaffRole)} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-semibold focus:outline-none" aria-label={`Role for ${s.name}`}>
                      {ROLES.map((r) => <option key={r} value={r}>{STAFF_ROLE_LABEL[r]}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <button type="button" onClick={() => setReviewId(s.id)} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:border-medical-200 hover:text-medical-800">
                      <ShieldCheck className="h-3 w-3" /> {s.permissions.length} granted
                    </button>
                  </td>
                  <td className="px-3 py-3 text-slate-500">{s.lastActiveAt || '—'}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold capitalize ${STATUS_STYLE[s.status]}`}>{s.status}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {s.status !== 'suspended' && s.status !== 'removed' && (
                      <button type="button" onClick={() => setConfirmSuspend(s.id)} className="cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-500 hover:border-amber-200 hover:text-amber-700">Suspend</button>
                    )}
                    {s.status !== 'removed' && s.status !== 'suspended' && (
                      <button type="button" onClick={() => { setStaffStatus(s.id, 'removed'); }} className="ml-1.5 cursor-pointer rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-bold text-slate-500 hover:border-rose-200 hover:text-rose-700">Remove access</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[10px] text-slate-400">Role changes and access removals are written to the audit log. Historical staff records are never deleted.</p>
      </section>
    </div>
  );
};
