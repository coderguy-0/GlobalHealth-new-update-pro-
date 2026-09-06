import React, { useState } from 'react';
import { Check, AlertCircle, Eye, Globe2, UserRound, Save } from 'lucide-react';
import { useDoctorPortal, SPECIALTIES } from './doctorPortalData';

const PUBLIC_FIELDS = ['fullName', 'specialty', 'qualifications', 'languages', 'bio', 'areasOfPractice'] as const;

export const DoctorProfileView: React.FC = () => {
  const { doctor, updateProfile } = useDoctorPortal();
  const [form, setForm] = useState({
    displayName: doctor.displayName,
    professionalTitle: doctor.professionalTitle,
    specialty: doctor.specialty,
    subSpecialty: doctor.subSpecialties[0] || '',
    yearsOfPractice: String(doctor.yearsOfPractice || ''),
    qualifications: doctor.qualifications.join(', '),
    languages: doctor.languages.join(', '),
    bio: doctor.bio,
    phone: doctor.phone || '',
    preferredContact: doctor.preferredContact,
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  const save = () => {
    const errs: string[] = [];
    if (!form.displayName.trim()) errs.push('Full name is required.');
    if (!form.specialty.trim()) errs.push('Primary specialty is required.');
    if (!form.qualifications.trim()) errs.push('At least one qualification is required.');
    setErrors(errs);
    if (errs.length) return;
    updateProfile({
      displayName: form.displayName.trim(),
      professionalTitle: form.professionalTitle.trim() || 'Consultant',
      specialty: form.specialty,
      subSpecialties: form.subSpecialty ? [form.subSpecialty.trim()] : [],
      yearsOfPractice: Number(form.yearsOfPractice) || 0,
      qualifications: form.qualifications.split(',').map((q) => q.trim()).filter(Boolean),
      languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
      bio: form.bio.trim() || 'Professional biography pending.',
      phone: form.phone.trim(),
      preferredContact: form.preferredContact,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  };

  const inputCls = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
  const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Professional Profile</h2>
        <p className="text-xs text-slate-500">Honest completeness: {doctor.profileCompleteness}% — {doctor.missingProfileFields.length ? `missing ${doctor.missingProfileFields.slice(0, 3).join(' · ')}` : 'complete'}.</p>
      </div>

      {/* Completeness */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Profile completeness</span><span>{doctor.profileCompleteness}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={doctor.profileCompleteness} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completeness">
          <div className="h-full rounded-full bg-gradient-to-r from-medical-400 to-medical-700 transition-all" style={{ width: `${doctor.profileCompleteness}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-slate-400">Completeness reflects verified information only — it is never inflated.</p>
      </div>

      {errors.length > 0 && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {errors[0]}
        </p>
      )}
      {saved && (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
          <Check className="h-4 w-4" /> Profile saved. Changes go live on your public profile when published.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        {/* Edit form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-3" aria-labelledby="profile-edit">
          <h3 id="profile-edit" className="mb-4 text-sm font-extrabold text-slate-900">Edit profile</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="pf-name">Full professional name</label>
              <input id="pf-name" value={form.displayName} onChange={(e) => set('displayName', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-title">Professional title</label>
              <input id="pf-title" value={form.professionalTitle} onChange={(e) => set('professionalTitle', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-spec">Primary specialty</label>
              <select id="pf-spec" value={form.specialty} onChange={(e) => set('specialty', e.target.value)} className={inputCls}>
                {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <p className="mt-1 text-[10px] text-slate-400">Controlled taxonomy — custom specialties are not allowed.</p>
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-sub">Sub-specialty</label>
              <input id="pf-sub" value={form.subSpecialty} onChange={(e) => set('subSpecialty', e.target.value)} className={inputCls} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-years">Years of practice</label>
              <input id="pf-years" type="number" min={0} max={60} value={form.yearsOfPractice} onChange={(e) => set('yearsOfPractice', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-phone">Private contact phone</label>
              <input id="pf-phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} placeholder="Private — never published" />
              <p className="mt-1 text-[10px] text-slate-400">Stored privately; only your chosen public channels are shown.</p>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pf-quals">Qualifications</label>
              <input id="pf-quals" value={form.qualifications} onChange={(e) => set('qualifications', e.target.value)} className={inputCls} placeholder="MBBS, MD, DM" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pf-langs">Languages</label>
              <input id="pf-langs" value={form.languages} onChange={(e) => set('languages', e.target.value)} className={inputCls} placeholder="English, Hindi" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="pf-bio">Public biography</label>
              <textarea id="pf-bio" value={form.bio} onChange={(e) => set('bio', e.target.value)} rows={4} className={inputCls} />
            </div>
            <div>
              <label className={labelCls} htmlFor="pf-contact">Preferred contact</label>
              <select id="pf-contact" value={form.preferredContact} onChange={(e) => set('preferredContact', e.target.value)} className={inputCls}>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="portal">Portal messages</option>
              </select>
            </div>
          </div>
          <button type="button" onClick={save} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-medical-700">
            <Save className="h-4 w-4" /> Save changes
          </button>
        </section>

        {/* Public preview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2" aria-labelledby="public-preview">
          <h3 id="public-preview" className="mb-1 flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <Eye className="h-4 w-4 text-medical-600" /> Public preview
          </h3>
          <p className="mb-4 text-[11px] text-slate-400">How patients see you — public fields only. Private data is never rendered here.</p>

          <div className="rounded-2xl border border-medical-100 bg-gradient-to-b from-medical-50/60 to-white p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-medical-500 to-medical-800 text-lg font-extrabold text-white">
                {doctor.displayName.replace('Dr. ', '').charAt(0)}
              </span>
              <div>
                <p className="text-sm font-extrabold text-slate-900">{doctor.displayName}</p>
                <p className="text-[11px] font-semibold text-medical-700">{doctor.professionalTitle} · {doctor.specialty}</p>
                {doctor.verificationStatus === 'verified' ? (
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                    <Check className="h-3 w-3" /> Verified Professional
                  </p>
                ) : (
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800">
                    <AlertCircle className="h-3 w-3" /> Verification pending — not shown publicly
                  </p>
                )}
              </div>
            </div>

            <dl className="mt-4 space-y-2 border-t border-medical-100/80 pt-3 text-xs">
              {PUBLIC_FIELDS.map((f) => {
                const value = f === 'qualifications'
                  ? form.qualifications
                  : f === 'languages' ? form.languages
                  : f === 'areasOfPractice' ? form.specialty
                  : f === 'fullName' ? form.displayName
                  : f === 'bio' ? (form.bio || 'Not provided')
                  : form.specialty;
                return (
                  <div key={f} className="flex items-start justify-between gap-3">
                    <dt className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">{f === 'fullName' ? 'Name' : f.replace(/([A-Z])/g, ' $1').toLowerCase()}</dt>
                    <dd className="text-right font-medium text-slate-700">{value || '—'}</dd>
                  </div>
                );
              })}
            </dl>
            <div className="mt-3 flex items-center gap-1.5 border-t border-medical-100/80 pt-3 text-[10px] text-slate-400">
              <Globe2 className="h-3.5 w-3.5 text-medical-500" /> Published only after you activate it.
            </div>
          </div>
        </section>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400">
        <UserRound className="h-3.5 w-3.5 text-medical-500" /> Photo upload is not available in this preview build.
      </p>
    </div>
  );
};
