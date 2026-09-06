import React, { useState } from 'react';
import { useDoctorPortal, WorkspaceView } from './doctorPortalData';
import { DoctorSecurity } from './DoctorSecurity';
import { DoctorProfileView } from './DoctorProfile';
import { DoctorCredentials } from './DoctorCredentials';
import { DoctorAffiliations } from './DoctorAffiliations';

interface Props { onNavigate?: (v: WorkspaceView) => void }

type Tab = 'account' | 'security' | 'notifications' | 'clinical' | 'interface' | 'integrations' | 'credentials' | 'affiliations';

export const DoctorSettings: React.FC<Props> = () => {
  const { doctor, notificationPrefs, toggleNotificationPref, security } = useDoctorPortal();
  const [tab, setTab] = useState<Tab>('account');
  const [theme, setTheme] = useState('clinical');
  const [lang, setLang] = useState('en');
  const [density, setDensity] = useState('comfortable');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'account', label: 'Account' },
    { id: 'security', label: 'Security' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'clinical', label: 'Clinical preferences' },
    { id: 'interface', label: 'Interface' },
    { id: 'integrations', label: 'Connected services' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'affiliations', label: 'Practice locations' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Settings</h2>
        <p className="text-xs text-[#607086]">Logical groups — not one huge form. Critical clinical alerts cannot be casually disabled.</p>
      </div>
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white p-1.5">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold ${tab === t.id ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'text-[#607086] hover:bg-slate-50'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'account' && (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
            <Row k="Name" v={doctor.displayName} />
            <Row k="Email" v={doctor.workEmail} />
            <Row k="Phone" v={doctor.phone} />
            <Row k="Preferred contact" v={doctor.preferredContact} />
            <Row k="Authentication" v={security.mfaEnabled ? 'Password + MFA' : 'Password only'} />
          </dl>
          <p className="mt-4 text-[11px] text-[#8A97A8]">Use Security to change password, MFA and sessions. Professional identity is edited under Professional Profile.</p>
          <div className="mt-4"><DoctorProfileView /></div>
        </section>
      )}
      {tab === 'security' && <DoctorSecurity section="security" />}
      {tab === 'notifications' && (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
          <ul className="space-y-2">
            {(Object.keys(notificationPrefs) as string[]).map((k) => {
              const locked = k === 'security_alerts' || k === 'credential_alerts';
              return (
                <li key={k} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                  <span>
                    <span className="block text-xs font-bold capitalize text-[#162235]">{k.replace('_', ' ')}</span>
                    {locked && <span className="text-[10px] text-amber-700">Critical clinical/security alerts cannot be casually disabled.</span>}
                  </span>
                  <button type="button" disabled={locked} onClick={() => toggleNotificationPref(k)} className={`relative h-5 w-9 rounded-full ${notificationPrefs[k] ? 'bg-emerald-600' : 'bg-slate-200'} disabled:opacity-60`}>
                    <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow" style={{ left: notificationPrefs[k] ? 18 : 2 }} />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
      {tab === 'clinical' && (
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {['SOAP consultation template', 'Hypertension follow-up note', 'Favorite tests: CBC, HbA1c, Lipid, Troponin', 'Default prescription duration: 30 days'].map((t) => (
            <div key={t} className="rounded-2xl border border-[#E3E8EF] bg-white p-4 text-xs font-semibold text-[#162235] shadow-soft">{t}</div>
          ))}
        </section>
      )}
      {tab === 'interface' && (
        <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Select label="Theme" value={theme} onChange={setTheme} options={['clinical', 'high-contrast', 'compact']} />
            <Select label="Language" value={lang} onChange={setLang} options={['en', 'hi']} />
            <Select label="Density" value={density} onChange={setDensity} options={['comfortable', 'compact']} />
          </div>
        </section>
      )}
      {tab === 'integrations' && (
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { n: 'Hospital — GlobalHealth Medical Center', s: 'Connected' },
            { n: 'Laboratory network', s: 'Connected' },
            { n: 'Verified pharmacy workflow', s: 'Available' },
            { n: 'Telemedicine media', s: 'Connected' },
            { n: 'Scheduling', s: 'Connected' },
          ].map((i) => (
            <div key={i.n} className="flex items-center justify-between rounded-2xl border border-[#E3E8EF] bg-white p-4 shadow-soft">
              <p className="text-xs font-bold text-[#162235]">{i.n}</p>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">{i.s}</span>
            </div>
          ))}
        </section>
      )}
      {tab === 'credentials' && <DoctorCredentials />}
      {tab === 'affiliations' && <DoctorAffiliations />}
    </div>
  );
};

const Row: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="rounded-xl border border-[#E3E8EF] bg-slate-50/50 p-3">
    <dt className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{k}</dt>
    <dd className="mt-1 font-bold text-[#162235]">{v}</dd>
  </div>
);
const Select: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <label className="block text-xs">
    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-xl border border-[#E3E8EF] px-3 py-2 font-semibold">
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>
);
