import React, { useState } from 'react';
import {
  ShieldCheck, KeyRound, Smartphone, Monitor, History, Users, ScrollText, AlertTriangle,
  CheckCircle2, Lock, Trash2, Laptop, Globe2
} from 'lucide-react';
import { useDoctorPortal, Session, DelegatedAccess } from './doctorPortalData';

const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

export const DoctorSecurity: React.FC<{ section: 'security' | 'sessions' | 'delegated' | 'audit' }> = ({ section }) => {
  if (section === 'sessions') return <SessionsView />;
  if (section === 'delegated') return <DelegatedView />;
  if (section === 'audit') return <AuditView />;
  return <SecurityCenter />;
};

const SecurityCenter: React.FC = () => {
  const { doctor, security, setMfaEnabled, sessions } = useDoctorPortal();
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

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Security Center</h2>
        <p className="text-xs text-slate-500">Passwords are never stored in plaintext. Every sensitive action is audited.</p>
      </div>

      {pwOk && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {pwOk}</p>}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* MFA */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sec-mfa">
          <h3 id="sec-mfa" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Smartphone className="h-4 w-4 text-medical-600" /> Two-factor authentication</h3>
          <p className="mt-2 text-xs text-slate-500">
            MFA is strongly supported and recommended for all doctors. Status:{' '}
            <span className={`font-bold ${security.mfaEnabled ? 'text-emerald-700' : 'text-amber-700'}`}>
              {security.mfaEnabled ? 'Enabled' : 'Not enabled'}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setMfaEnabled(!security.mfaEnabled)}
            className={`mt-3 cursor-pointer rounded-xl px-4 py-2 text-xs font-bold transition ${
              security.mfaEnabled ? 'border border-slate-300 bg-white text-slate-600 hover:bg-slate-50' : 'bg-medical-600 text-white hover:bg-medical-700'
            }`}
          >
            {security.mfaEnabled ? 'Disable MFA (simulated)' : 'Enable MFA (simulated)'}
          </button>
        </section>

        {/* Password */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sec-pw">
          <h3 id="sec-pw" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><KeyRound className="h-4 w-4 text-medical-600" /> Password</h3>
          {pwErr && <p role="alert" className="mt-2 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800"><AlertTriangle className="h-4 w-4" /> {pwErr}</p>}
          <div className="mt-3 space-y-3">
            <div>
              <label className={labelCls} htmlFor="pw1">New password</label>
              <input id="pw1" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pw2">Confirm new password</label>
              <input id="pw2" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className={inputCls} />
            </div>
            <button type="button" onClick={changePassword} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Update password</button>
            <p className="text-[10px] text-slate-400">Other sessions are revoked when you change your password.</p>
          </div>
        </section>

        {/* Active sessions summary */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sec-sess">
          <h3 id="sec-sess" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Monitor className="h-4 w-4 text-medical-600" /> Active sessions</h3>
          <p className="mt-2 text-xs text-slate-500">{sessions.length} active session{sessions.length === 1 ? '' : 's'} · {otherSessions} on other device{otherSessions === 1 ? '' : 's'}</p>
          <button type="button" onClick={() => { /* deep link handled by parent navigation */ }} className="mt-3 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Manage sessions</button>
        </section>

        {/* Recent logins */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sec-logins">
          <h3 id="sec-logins" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><History className="h-4 w-4 text-medical-600" /> Recent logins</h3>
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
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sec-devices">
        <h3 id="sec-devices" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Laptop className="h-4 w-4 text-medical-600" /> Connected devices</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {security.connectedDevices.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div>
                <p className="text-xs font-bold text-slate-800">{d.deviceName}</p>
                <p className="text-[10px] text-slate-400">Last seen {d.lastSeen} · {d.location}</p>
              </div>
              <button type="button" className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Revoke ${d.deviceName}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Alerts */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="sec-alerts">
        <h3 id="sec-alerts" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><AlertTriangle className="h-4 w-4 text-medical-600" /> Security alerts</h3>
        {security.alerts.length === 0 ? (
          <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> No active security alerts for {doctor.displayName}.</p>
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

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><Lock className="h-3.5 w-3.5 text-medical-500" /> Lock screens and notifications never reveal patient details.</p>
    </div>
  );
};

const SessionsView: React.FC = () => {
  const { sessions, revokeSession } = useDoctorPortal();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Active Sessions</h2>
        <p className="text-xs text-slate-500">All sign-ins to your doctor portal, with the ability to revoke anything you don't recognize.</p>
      </div>
      <ul className="space-y-3">
        {sessions.map((s) => (
          <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
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
              <button type="button" onClick={() => revokeSession(s.id)} className="cursor-pointer rounded-xl border border-rose-200 bg-white px-3 py-2 text-[11px] font-bold text-rose-600 transition hover:bg-rose-50">
                Revoke
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DelegatedView: React.FC = () => {
  const { delegated, addDelegatedAccess, revokeDelegatedAccess } = useDoctorPortal();
  const [email, setEmail] = useState('');
  const [scope, setScope] = useState('schedule');
  const [err, setErr] = useState('');

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr('Enter a valid email.'); return; }
    addDelegatedAccess({ email, scope });
    setEmail(''); setErr('');
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Delegated Access</h2>
        <p className="text-xs text-slate-500">Grant a limited, audited view of your portal to a trusted colleague or practice manager. Patient data is never included.</p>
      </div>

      {err && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">{err}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="del-add">
        <h3 id="del-add" className="mb-3 text-sm font-extrabold text-slate-900">Invite delegate</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="del-email">Email</label>
            <input id="del-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="practice.manager@example.com" />
          </div>
          <div>
            <label className={labelCls} htmlFor="del-scope">Scope</label>
            <select id="del-scope" value={scope} onChange={(e) => setScope(e.target.value)} className={inputCls}>
              <option value="schedule">Schedule only</option>
              <option value="messages">Messages only</option>
              <option value="documents">Documents (private)</option>
            </select>
          </div>
        </div>
        <button type="button" onClick={submit} className="mt-3 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Send invite</button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="del-list">
        <h3 id="del-list" className="mb-3 text-sm font-extrabold text-slate-900">Delegates ({delegated.length})</h3>
        {delegated.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No delegated access granted.</p>
        ) : (
          <ul className="space-y-2">
            {delegated.map((d: DelegatedAccess) => (
              <li key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div>
                  <p className="text-xs font-bold text-slate-800">{d.email}</p>
                  <p className="text-[10px] capitalize text-slate-400">{d.scope} access · invited {d.createdAt} · {d.status}</p>
                </div>
                <button type="button" onClick={() => revokeDelegatedAccess(d.id)} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-500 hover:border-rose-200 hover:text-rose-600">
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const AuditView: React.FC = () => {
  const { auditEvents } = useDoctorPortal();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Audit Log</h2>
        <p className="text-xs text-slate-500">Append-only record of who did what, when, from where, and the outcome. Entries cannot be edited or deleted.</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th scope="col" className="px-4 py-3">When</th>
                <th scope="col" className="px-4 py-3">Who</th>
                <th scope="col" className="px-4 py-3">Action</th>
                <th scope="col" className="px-4 py-3">Resource</th>
                <th scope="col" className="px-4 py-3">Where</th>
                <th scope="col" className="px-4 py-3">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditEvents.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60">
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{e.date} {e.time}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-slate-700">{e.actor}</td>
                  <td className="px-4 py-2.5 text-slate-600">{e.action}</td>
                  <td className="px-4 py-2.5 text-slate-600">{e.resource}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{e.ip} · {e.location}</td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      e.outcome === 'success' ? 'bg-emerald-50 text-emerald-700' : e.outcome === 'denied' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                    }`}>{e.outcome}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><ScrollText className="h-3.5 w-3.5 text-medical-500" /> Audit events are written server-side and cannot be altered from the UI.</p>
    </div>
  );
};
