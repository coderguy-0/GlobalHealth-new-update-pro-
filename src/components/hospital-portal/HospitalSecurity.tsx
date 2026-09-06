import React, { useState } from 'react';
import {
  ShieldCheck, KeyRound, Smartphone, Monitor, Laptop, History, AlertTriangle, CheckCircle2,
  Trash2, Lock, ScrollText, UserCog,
} from 'lucide-react';
import { useHospitalPortal, PERMISSIONS, ROLE_PERMISSIONS, STAFF_ROLE_LABEL, StaffRole } from './hospitalPortalData';

interface HospitalSecurityProps {
  section: 'security' | 'sessions' | 'permissions';
}

const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';
const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

export const HospitalSecurity: React.FC<HospitalSecurityProps> = ({ section }) => {
  if (section === 'sessions') return <SessionsView />;
  if (section === 'permissions') return <PermissionsView />;
  return <SecurityCenter />;
};

const SecurityCenter: React.FC = () => {
  const { security, sessions, setMfaEnabled, signOutOtherSessions, staff, organization } = useHospitalPortal();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [pwOk, setPwOk] = useState('');

  const changePassword = () => {
    if (pw.length < 8) { setPwErr('Password must be at least 8 characters.'); return; }
    if (pw !== pw2) { setPwErr('Passwords do not match.'); return; }
    setPwErr(''); setPw(''); setPw2('');
    setPwOk('Password updated. All other sessions were signed out.');
    window.setTimeout(() => setPwOk(''), 5000);
  };

  const otherSessions = sessions.filter((s) => !s.current).length;
  const scopedStaff = staff.filter((s) => s.hospitalId === organization.id);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Security</h2>
        <p className="text-xs text-slate-500">Account security, sessions, role changes and audit are transparent here.</p>
      </div>

      {pwOk && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {pwOk}</p>}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className={cardCls} aria-labelledby="sec-mfa">
          <h3 id="sec-mfa" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Smartphone className="h-4 w-4 text-medical-600" /> Two-factor authentication</h3>
          <p className="mt-2 text-xs text-slate-500">
            Prefer stronger MFA for administrative accounts. Status:{' '}
            <span className={`font-bold ${security.mfaEnabled ? 'text-emerald-700' : 'text-amber-700'}`}>{security.mfaEnabled ? 'Enabled' : 'Not enabled'}</span>
          </p>
          <button type="button" onClick={() => setMfaEnabled(!security.mfaEnabled)}
            className={`mt-3 cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition ${
              security.mfaEnabled ? 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50' : 'bg-medical-600 text-white hover:bg-medical-700'
            }`}>
            {security.mfaEnabled ? 'Disable 2FA (simulated)' : 'Enable 2FA (simulated)'}
          </button>
        </section>

        <section className={cardCls} aria-labelledby="sec-pw">
          <h3 id="sec-pw" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><KeyRound className="h-4 w-4 text-medical-600" /> Password</h3>
          {pwErr && <p role="alert" className="mt-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">{pwErr}</p>}
          <div className="mt-3 space-y-3">
            <div>
              <label className={labelCls} htmlFor="hpw1">New password</label>
              <input id="hpw1" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="hpw2">Confirm new password</label>
              <input id="hpw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} />
            </div>
            <button type="button" onClick={changePassword} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Change Password</button>
          </div>
        </section>

        <section className={cardCls} aria-labelledby="sec-sess">
          <h3 id="sec-sess" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Monitor className="h-4 w-4 text-medical-600" /> Active sessions</h3>
          <p className="mt-2 text-xs text-slate-500">{sessions.length} active · {otherSessions} on other device{otherSessions === 1 ? '' : 's'}</p>
          <button type="button" onClick={signOutOtherSessions} className="mt-3 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Sign Out Other Sessions</button>
        </section>

        <section className={cardCls} aria-labelledby="sec-logins">
          <h3 id="sec-logins" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><History className="h-4 w-4 text-medical-600" /> Recent login activity</h3>
          <ul className="mt-3 space-y-2">
            {security.recentLogins.slice(0, 4).map((l, i) => (
              <li key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  {l.device.includes('Mobile') ? <Smartphone className="h-3.5 w-3.5 text-slate-400" /> : <Monitor className="h-3.5 w-3.5 text-slate-400" />}
                  {l.device}
                </span>
                <span className="text-[10px] text-slate-400">{l.date} {l.time} · {l.ip}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Connected devices */}
      <section className={cardCls} aria-labelledby="sec-devices">
        <h3 id="sec-devices" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Laptop className="h-4 w-4 text-medical-600" /> Connected devices</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {security.connectedDevices.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div>
                <p className="text-xs font-bold text-slate-800">{d.deviceName}</p>
                <p className="text-[10px] text-slate-400">Last seen {d.lastSeen} · {d.location}</p>
              </div>
              <button type="button" className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Revoke ${d.deviceName}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Alerts */}
      <section className={cardCls} aria-labelledby="sec-alerts">
        <h3 id="sec-alerts" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><AlertTriangle className="h-4 w-4 text-medical-600" /> Security alerts</h3>
        {security.alerts.length === 0 ? (
          <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> No active security alerts.</p>
        ) : (
          <ul className="space-y-2">
            {security.alerts.map((a) => (
              <li key={a.id} className={`flex items-start gap-2 rounded-xl p-3 text-xs ${a.severity === 'high' ? 'bg-rose-50 text-rose-800' : 'bg-amber-50 text-amber-800'}`}>
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> <span><strong>{a.title}.</strong> {a.message} ({a.date})</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Role/access changes summary */}
      <section className={cardCls} aria-labelledby="sec-roles">
        <h3 id="sec-roles" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><UserCog className="h-4 w-4 text-medical-600" /> Staff access at a glance</h3>
        <ul className="space-y-1.5 text-xs">
          {scopedStaff.slice(0, 6).map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="font-bold text-slate-700">{s.name}</span>
              <span className="text-slate-400">{STAFF_ROLE_LABEL[s.role]} · {s.permissions.length} permissions · <span className="capitalize">{s.status}</span></span>
            </li>
          ))}
        </ul>
      </section>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><Lock className="h-3.5 w-3.5 text-medical-500" /> Role changes are logged; the frontend never determines access by itself.</p>
    </div>
  );
};

const SessionsView: React.FC = () => {
  const { sessions, revokeSession } = useHospitalPortal();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Active Sessions</h2>
        <p className="text-xs text-slate-500">Sign in and revoke anything you don't recognize.</p>
      </div>
      <ul className="space-y-3">
        {sessions.map((s) => (
          <li key={s.id} className={`${cardCls} flex flex-wrap items-center justify-between gap-3`}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-medical-50 text-medical-700 ring-1 ring-medical-100">
                {s.device.includes('Mobile') ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  {s.device} {s.current && <span className="ml-1 rounded-full bg-medical-100 px-2 py-0.5 text-[9px] font-bold text-medical-800">This device</span>}
                </p>
                <p className="text-[11px] text-slate-500">{s.browser} · {s.location} · Signed in {s.signedInAt}</p>
                <p className="text-[10px] text-slate-400">IP {s.ip} · Last active {s.lastActive}</p>
              </div>
            </div>
            {!s.current && (
              <button type="button" onClick={() => revokeSession(s.id)} className="cursor-pointer rounded-xl border border-rose-200 bg-white px-3 py-2 text-[11px] font-bold text-rose-600 hover:bg-rose-50">Sign Out</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PermissionsView: React.FC = () => {
  const roles = Object.keys(ROLE_PERMISSIONS) as StaffRole[];
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Permission Matrix</h2>
        <p className="text-xs text-slate-500">Granular permissions — no permission is granted implicitly. Server-side authorization always re-checks these.</p>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th scope="col" className="px-4 py-3">Role</th>
                {PERMISSIONS.map((p) => <th key={p} scope="col" className="px-2 py-3 text-center">{p.replace(/_/g, ' ')}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {roles.map((r) => (
                <tr key={r} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-slate-800">{STAFF_ROLE_LABEL[r]}</td>
                  {PERMISSIONS.map((p) => {
                    const granted = ROLE_PERMISSIONS[r].includes(p);
                    return (
                      <td key={p} className="px-2 py-3 text-center">
                        <span className={`mx-auto block h-4 w-4 rounded-full ${granted ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-300'}`} style={{ display: 'grid', placeItems: 'center' }} aria-label={granted ? 'Granted' : 'Not granted'}>
                          {granted ? <span className="text-[9px] font-bold">✓</span> : <span className="text-[9px]">—</span>}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><ScrollText className="h-3.5 w-3.5 text-medical-500" /> Changing a role updates its permission set and writes an audit entry.</p>
    </div>
  );
};
