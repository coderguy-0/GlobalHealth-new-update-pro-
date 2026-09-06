import React, { useEffect, useState } from 'react';
import {
  Building2, Eye, Save, CheckCircle2, AlertCircle, MapPin, Clock3, ImageIcon, Award,
  CreditCard, Trash2, Plus, Upload, ExternalLink, Info, ShieldAlert, LocateFixed, FileText,
} from 'lucide-react';
import {
  useHospitalPortal, HOSPITAL_TYPES, OWNERSHIP_TYPES, PUBLIC_STATUS_LABEL,
  WeeklyHours, EmergencyService, Accessibility, HospitalPhoto, Accreditation, DAY_KEYS, DAY_LABEL,
} from './hospitalPortalData';

interface HospitalProfileProps {
  section?: 'hours' | 'location' | 'photos' | 'accreditations';
}

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';
const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';

export const HospitalProfile: React.FC<HospitalProfileProps> = ({ section }) => {
  if (section === 'hours') return <HoursSection standalone />;
  if (section === 'location') return <LocationSection standalone />;
  if (section === 'photos') return <PhotosSection standalone />;
  if (section === 'accreditations') return <AccreditationsSection standalone />;
  return <ProfileMain />;
};

/* ------------------------------------------------------------------ */

const ProfileMain: React.FC = () => {
  const { organization, updateOrganization, submitProfileForReview, publishProfile } = useHospitalPortal();
  const [form, setForm] = useState({
    displayName: organization.displayName,
    legalName: organization.legalName,
    facilityType: organization.facilityType,
    ownershipType: organization.ownershipType,
    description: organization.description,
    website: organization.website,
    publicPhone: organization.publicPhone,
    publicEmail: organization.publicEmail,
    privateAdminEmail: 'admin@ghmc.example.com',
    privateVerificationContact: '+91 98100 55500',
  });
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  // Unsaved-changes guard (§79).
  useEffect(() => {
    const onBefore = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', onBefore);
    return () => window.removeEventListener('beforeunload', onBefore);
  }, [dirty]);

  const set = (k: keyof typeof form, v: string) => { setForm((f) => ({ ...f, [k]: v })); setDirty(true); setSaved(false); };

  const save = () => {
    if (!form.displayName.trim() || !form.legalName.trim()) { setError('Hospital name and legal name are required.'); return; }
    if (!form.publicPhone.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.publicEmail)) { setError('Enter a valid public phone and public email.'); return; }
    setError('');
    updateOrganization({
      displayName: form.displayName.trim(),
      legalName: form.legalName.trim(),
      facilityType: form.facilityType,
      ownershipType: form.ownershipType,
      description: form.description.trim(),
      website: form.website.trim(),
      publicPhone: form.publicPhone.trim(),
      publicEmail: form.publicEmail.trim(),
    });
    setDirty(false); setSaved(true);
    window.setTimeout(() => setSaved(false), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Hospital Profile</h2>
          <p className="text-xs text-slate-500">Public profile management — private operations are never published.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
            organization.publicStatus === 'published' ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : organization.publicStatus === 'pending_review' ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-slate-200 bg-white text-slate-500'
          }`}>{PUBLIC_STATUS_LABEL[organization.publicStatus]}</span>
          <button type="button" onClick={() => setPreviewOpen(true)} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-medical-200 bg-white px-3 py-2 text-xs font-bold text-medical-700 hover:bg-medical-50">
            <Eye className="h-3.5 w-3.5" /> Preview Public Profile
          </button>
        </div>
      </div>

      {previewOpen && <PublicPreview onClose={() => setPreviewOpen(false)} />}
      {dirty && (
        <p role="status" className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
          <span>You have unsaved changes.</span>
          <span className="flex gap-2">
            <button type="button" onClick={() => { setForm({ displayName: organization.displayName, legalName: organization.legalName, facilityType: organization.facilityType, ownershipType: organization.ownershipType, description: organization.description, website: organization.website, publicPhone: organization.publicPhone, publicEmail: organization.publicEmail, privateAdminEmail: 'admin@ghmc.example.com', privateVerificationContact: '+91 98100 55500' }); setDirty(false); }} className="cursor-pointer rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-50">Leave without saving</button>
            <button type="button" onClick={save} className="cursor-pointer rounded-lg bg-medical-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-medical-700">Save now</button>
          </span>
        </p>
      )}
      {saved && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> Hospital profile updated</p>}
      {error && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800"><AlertCircle className="h-4 w-4" /> {error}</p>}

      {/* Basic information */}
      <section className={cardCls} aria-labelledby="pf-basic">
        <h3 id="pf-basic" className="mb-4 text-sm font-extrabold text-slate-900">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="pf-name">Hospital name <span className="text-rose-500">*</span></label>
            <input id="pf-name" value={form.displayName} onChange={(e) => set('displayName', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="pf-legal">Legal name <span className="text-rose-500">*</span></label>
            <input id="pf-legal" value={form.legalName} onChange={(e) => set('legalName', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="pf-type">Facility type</label>
            <select id="pf-type" value={form.facilityType} onChange={(e) => set('facilityType', e.target.value)} className={inputCls}>
              {HOSPITAL_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="pf-own">Ownership</label>
            <select id="pf-own" value={form.ownershipType} onChange={(e) => set('ownershipType', e.target.value)} className={inputCls}>
              {OWNERSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="pf-desc">Description</label>
            <textarea id="pf-desc" rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="pf-web">Website</label>
            <input id="pf-web" type="url" value={form.website} onChange={(e) => set('website', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={save} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-medical-700">
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
          {dirty && <span className="text-[11px] font-bold text-amber-700">Unsaved changes</span>}
        </div>
      </section>

      {/* Public / private contact (§50) */}
      <section className={cardCls} aria-labelledby="pf-contact">
        <h3 id="pf-contact" className="mb-1 text-sm font-extrabold text-slate-900">Contact Information</h3>
        <p className="mb-4 text-[11px] text-slate-400">Public contact is shown on GlobalHealth. Private portal contact is never published.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Public</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls} htmlFor="pf-phone">Main phone</label>
                <input id="pf-phone" value={form.publicPhone} onChange={(e) => set('publicPhone', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="pf-email">Public email</label>
                <input id="pf-email" type="email" value={form.publicEmail} onChange={(e) => set('publicEmail', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700">Private — portal only</p>
            <div className="space-y-3">
              <div>
                <label className={labelCls} htmlFor="pf-priv-email">Administrator email</label>
                <input id="pf-priv-email" value={form.privateAdminEmail} onChange={(e) => set('privateAdminEmail', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="pf-priv-contact">Verification contact</label>
                <input id="pf-priv-contact" value={form.privateVerificationContact} onChange={(e) => set('privateVerificationContact', e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400"><ShieldAlert className="h-3.5 w-3.5 text-amber-600" /> Internal staff contacts are never sent to the public profile.</p>
      </section>

      {/* Emergency (§38) */}
      <EmergencySection />
      {/* Accessibility (§45) */}
      <AccessibilitySection />
      {/* Insurance (§52) */}
      <InsuranceSection />

      {/* Publishing (§62) */}
      <section className={cardCls} aria-labelledby="pf-publish">
        <h3 id="pf-publish" className="mb-3 text-sm font-extrabold text-slate-900">Profile publishing</h3>
        <p className="mb-3 text-xs text-slate-500">Sensitive changes (accreditation, emergency claims, ownership, official contacts) require review before reaching the public profile.</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { updateOrganization({ publicStatus: 'draft' }); setSaved(true); window.setTimeout(() => setSaved(false), 3000); }} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Save Draft</button>
          <button type="button" onClick={() => { submitProfileForReview(); setSaved(true); window.setTimeout(() => setSaved(false), 3000); }} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Submit for Review</button>
          {organization.publicStatus !== 'published' && (
            <button type="button" onClick={() => { publishProfile(); setSaved(true); window.setTimeout(() => setSaved(false), 3000); }} className="cursor-pointer rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100">Publish</button>
          )}
        </div>
        {organization.publicStatus === 'pending_review' && (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">Your changes are Pending Review — submitted changes are visible only to reviewers, never on the public profile.</p>
        )}
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const PublicPreview: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { organization, departments, doctors, services } = useHospitalPortal();
  const publicServices = services.filter((s) => s.hospitalId === organization.id && s.publicVisibility && s.status === 'active');
  const publicDoctors = doctors.filter((d) => d.hospitalId === organization.id && d.affiliationStatus === 'active' && d.verified);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/40 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Public profile preview">
      <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Eye className="h-4 w-4 text-medical-600" /> How users see your hospital</h3>
          <button type="button" onClick={onClose} className="cursor-pointer rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="Close preview">✕</button>
        </div>

        <div className="rounded-2xl border border-medical-100 bg-gradient-to-b from-medical-50/60 to-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-extrabold text-slate-900">{organization.displayName || '—'}</p>
              <p className="text-xs font-semibold text-medical-700">{organization.facilityType} · {organization.ownershipType}</p>
              {organization.verificationStatus === 'verified' ? (
                <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800"><CheckCircle2 className="h-3 w-3" /> Verified Hospital</p>
              ) : (
                <p className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Verification pending</p>
              )}
            </div>
            <MapPin className="h-5 w-5 text-medical-400" />
          </div>
          <dl className="mt-4 space-y-2 border-t border-medical-100/80 pt-3 text-xs">
            <PreviewRow k="Address" v={`${organization.address}, ${organization.city}, ${organization.state} ${organization.postalCode}`} />
            <PreviewRow k="Phone" v={organization.publicPhone || '—'} />
            <PreviewRow k="Website" v={organization.website || '—'} />
            <PreviewRow k="Hours" v={organization.hours.length ? `${organization.hours[0].day}–${organization.hours[6].day} · ${organization.hours[0].open}–${organization.hours[0].close}` : 'Not published'} />
            <PreviewRow k="Emergency" v={organization.emergency.available ? `Available — ${organization.emergency.hours}` : 'Not published'} />
          </dl>
          {organization.photos.some((p) => p.approvalStatus === 'approved' && p.visibility === 'public') ? (
            <p className="mt-3 border-t border-medical-100/80 pt-3 text-[10px] text-slate-400"><ImageIcon className="mr-1 inline h-3 w-3" /> Approved photos are shown here.</p>
          ) : (
            <p className="mt-3 border-t border-medical-100/80 pt-3 text-[10px] text-slate-400"><ImageIcon className="mr-1 inline h-3 w-3" /> No approved photos yet.</p>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Public services ({publicServices.length})</p>
            <ul className="space-y-1">
              {publicServices.slice(0, 6).map((s) => <li key={s.id} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">{s.name}</li>)}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Verified doctors ({publicDoctors.length})</p>
            <ul className="space-y-1">
              {publicDoctors.map((d) => <li key={d.id} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">{d.name}</li>)}
              {publicDoctors.length === 0 && <li className="text-[11px] text-slate-400">None yet — only verified affiliations are published.</li>}
            </ul>
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-[10px] text-amber-900">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Draft and pending-review changes are <strong>not</strong> shown here. Only published information is displayed.
        </p>
      </div>
    </div>
  );
};

const PreviewRow: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div className="flex items-start justify-between gap-3">
    <dt className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</dt>
    <dd className="text-right font-medium text-slate-700">{v}</dd>
  </div>
);

/* ------------------------------------------------------------------ */
/* Hours (§37)                                                         */
/* ------------------------------------------------------------------ */

const HoursSection: React.FC<{ standalone?: boolean }> = ({ standalone }) => {
  const { organization, updateOrganization, departments } = useHospitalPortal();
  const [hours, setHours] = useState<WeeklyHours[]>(organization.hours);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const setDay = (id: string, patch: Partial<WeeklyHours>) => {
    setHours((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
    setDirty(true);
  };

  const save = () => {
    updateOrganization({ hours });
    setDirty(false); setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5">
      {standalone && <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Opening Hours</h2>}
      <section className={cardCls} aria-labelledby="hr-general">
        <h3 id="hr-general" className="mb-1 text-sm font-extrabold text-slate-900">General hospital hours</h3>
        <p className="mb-4 text-[11px] text-slate-400">Department hours are set per department and are not derived from these general hours.</p>
        {hours.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No hours configured yet.</p>
        ) : (
          <ul className="space-y-2">
            {hours.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <span className="w-24 shrink-0 text-xs font-extrabold text-slate-800">{h.day}</span>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <input type="checkbox" checked={h.closed} onChange={(e) => setDay(h.id, { closed: e.target.checked })} className="h-4 w-4 rounded accent-medical-600" />
                  Closed
                </label>
                <div className="flex items-center gap-2">
                  <input type="time" value={h.open} disabled={h.closed} onChange={(e) => setDay(h.id, { open: e.target.value })} className={`${inputCls} !w-28 !py-1.5 disabled:opacity-40`} aria-label={`${h.day} opening time`} />
                  <span className="text-xs text-slate-400">–</span>
                  <input type="time" value={h.close} disabled={h.closed} onChange={(e) => setDay(h.id, { close: e.target.value })} className={`${inputCls} !w-28 !py-1.5 disabled:opacity-40`} aria-label={`${h.day} closing time`} />
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={save} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-medical-700">
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
          {saved && <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Saved</span>}
          {dirty && <span className="text-[11px] font-bold text-amber-700">Unsaved changes</span>}
        </div>
      </section>

      <section className={cardCls} aria-labelledby="hr-depts">
        <h3 id="hr-depts" className="mb-3 text-sm font-extrabold text-slate-900">Department hours</h3>
        {departments.filter((d) => d.hospitalId === organization.id && d.status === 'active').length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No active departments.</p>
        ) : (
          <ul className="space-y-2">
            {departments.filter((d) => d.hospitalId === organization.id && d.status === 'active').map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <span className="text-xs font-bold text-slate-800">{d.name}</span>
                <span className="text-[11px] text-slate-500">
                  {d.hours?.length ? `${d.hours.length} configured day${d.hours.length > 1 ? 's' : ''}` : 'Not configured'}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-[11px] text-slate-400">Department hours are managed from the Departments module.</p>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Location (§48–49)                                                   */
/* ------------------------------------------------------------------ */

const LocationSection: React.FC<{ standalone?: boolean }> = ({ standalone }) => {
  const { organization, updateOrganization } = useHospitalPortal();
  const [form, setForm] = useState({ address: organization.address, city: organization.city, state: organization.state, country: organization.country, postalCode: organization.postalCode, latitude: String(organization.latitude), longitude: String(organization.longitude) });
  const [saved, setSaved] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    updateOrganization({
      address: form.address, city: form.city, state: form.state, country: form.country, postalCode: form.postalCode,
      latitude: Number(form.latitude) || 0, longitude: Number(form.longitude) || 0,
      locationVerified: false,
      locationAccuracy: 'approximate',
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-5">
      {standalone && <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Location</h2>}
      <section className={cardCls} aria-labelledby="loc-main">
        <h3 id="loc-main" className="mb-4 text-sm font-extrabold text-slate-900">Hospital location</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="loc-addr">Address</label>
            <input id="loc-addr" value={form.address} onChange={(e) => set('address', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="loc-city">City</label>
            <input id="loc-city" value={form.city} onChange={(e) => set('city', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="loc-state">State / Region</label>
            <input id="loc-state" value={form.state} onChange={(e) => set('state', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="loc-country">Country</label>
            <input id="loc-country" value={form.country} onChange={(e) => set('country', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="loc-postal">Postal code</label>
            <input id="loc-postal" value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} className={inputCls} />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800">
                <MapPin className="h-4 w-4 text-medical-600" /> {form.latitude}, {form.longitude}
              </p>
              <p className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                organization.locationVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
              }`}>
                <LocateFixed className="h-3 w-3" />
                {organization.locationVerified ? 'Location Verified' : 'Location may be approximate'}
              </p>
            </div>
            <button type="button" onClick={() => setSaved(true)} className="cursor-pointer rounded-xl border border-medical-200 bg-white px-4 py-2 text-xs font-bold text-medical-700 hover:bg-medical-50">
              Adjust Location
            </button>
          </div>
          <p className="mt-3 text-[10px] text-slate-400">Coordinate changes invalidate prior verification — the marker is treated as approximate until re-verified.</p>
        </div>

        <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
          <button type="button" onClick={save} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-medical-700">
            <Save className="h-3.5 w-3.5" /> Save Changes
          </button>
          {saved && <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Saved</span>}
        </div>
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Emergency (§38)                                                     */
/* ------------------------------------------------------------------ */

const EmergencySection: React.FC = () => {
  const { organization, updateOrganization } = useHospitalPortal();
  const [confirmOff, setConfirmOff] = useState(false);
  const [form, setForm] = useState<EmergencyService>(organization.emergency);
  const [saved, setSaved] = useState(false);

  const set = (k: keyof EmergencyService, v: string | boolean) => { setForm((f) => ({ ...f, [k]: v })); };

  const save = (em: EmergencyService) => {
    updateOrganization({ emergency: em });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section className={cardCls} aria-labelledby="pf-emergency">
      <h3 id="pf-emergency" className="mb-1 text-sm font-extrabold text-slate-900">Emergency Services</h3>
      <p className="mb-4 text-[11px] text-slate-400">Emergency availability is a high-impact claim — changes are carefully controlled and reviewed.</p>

      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
          form.available ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'
        }`}>
          {form.available ? 'Available' : 'Not available'}
        </span>
        <button type="button" onClick={() => {
          if (form.available) { setConfirmOff(true); return; }
          const next = { ...form, available: true };
          setForm(next); save(next);
        }} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">
          {form.available ? 'Mark unavailable' : 'Mark available'}
        </button>
        {form.temporaryStatus && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800">{form.temporaryStatus}</span>}
      </div>

      {confirmOff && (
        <div role="dialog" aria-modal="true" className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-900">Turn off emergency services?</p>
          <p className="mt-1 text-xs text-rose-800">This changes a verified public claim and will be flagged for review. Continue?</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setConfirmOff(false)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Keep available</button>
            <button type="button" onClick={() => {
              const next = { ...form, available: false, temporaryStatus: 'Temporarily unavailable — pending review' };
              setForm(next); save(next); setConfirmOff(false);
            }} className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700">Confirm change</button>
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className={labelCls} htmlFor="em-hours">Hours</label>
          <input id="em-hours" value={form.hours} onChange={(e) => set('hours', e.target.value)} className={inputCls} placeholder="24×7" />
        </div>
        <div className="sm:col-span-1">
          <label className={labelCls} htmlFor="em-contact">Official contact</label>
          <input id="em-contact" value={form.contact} onChange={(e) => set('contact', e.target.value)} className={inputCls} />
        </div>
        <div className="sm:col-span-1">
          <label className={labelCls} htmlFor="em-desc">Department</label>
          <input id="em-desc" value={form.departmentId || ''} onChange={(e) => set('departmentId', e.target.value)} className={inputCls} placeholder="Emergency dept. ID" />
        </div>
        <div className="sm:col-span-3">
          <label className={labelCls} htmlFor="em-description">Service description</label>
          <textarea id="em-description" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
        <button type="button" onClick={() => save(form)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-medical-700">
          <Save className="h-3.5 w-3.5" /> Save Changes
        </button>
        {saved && <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Saved</span>}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Accessibility (§45)                                                 */
/* ------------------------------------------------------------------ */

const ACCESSIBILITY_FEATURES: { key: keyof Accessibility; label: string }[] = [
  { key: 'wheelchairEntrance', label: 'Wheelchair entrance' },
  { key: 'accessibleParking', label: 'Accessible parking' },
  { key: 'elevators', label: 'Elevators' },
  { key: 'accessibleRestrooms', label: 'Accessible restrooms' },
  { key: 'hearingAssistance', label: 'Hearing assistance' },
  { key: 'visualAssistance', label: 'Visual assistance' },
];

const AccessibilitySection: React.FC = () => {
  const { organization, setAccessibility } = useHospitalPortal();
  const [acc, setAcc] = useState<Accessibility>(organization.accessibility);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof Accessibility) => {
    const next = { ...acc, [key]: !acc[key] };
    setAcc(next);
    setAccessibility(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <section className={cardCls} aria-labelledby="pf-access">
      <h3 id="pf-access" className="mb-1 text-sm font-extrabold text-slate-900">Accessibility</h3>
      <p className="mb-4 text-[11px] text-slate-400">Features are never auto-marked as available — confirm each one explicitly.</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ACCESSIBILITY_FEATURES.map((f) => (
          <label key={f.key} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
            <span className="text-xs font-bold text-slate-700">{f.label}</span>
            <input type="checkbox" checked={acc[f.key]} onChange={() => toggle(f.key)} className="h-4 w-4 rounded accent-medical-600" />
          </label>
        ))}
      </div>
      {saved && <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Accessibility updated</p>}
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Photos (§46)                                                        */
/* ------------------------------------------------------------------ */

const PHOTO_CATEGORIES: HospitalPhoto['category'][] = ['exterior', 'entrance', 'reception', 'department', 'accessibility'];

const PhotosSection: React.FC<{ standalone?: boolean }> = ({ standalone }) => {
  const { organization, addPhoto, removePhoto } = useHospitalPortal();
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<HospitalPhoto['category']>('exterior');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const upload = () => {
    if (!caption.trim()) return;
    addPhoto({ category, caption: caption.trim(), visibility, fileName: `${category}-${Date.now()}.jpg` });
    setCaption('');
  };

  return (
    <div className="space-y-5">
      {standalone && <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Hospital Photos</h2>}
      <section className={cardCls} aria-labelledby="ph-upload">
        <h3 id="ph-upload" className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Upload className="h-4 w-4 text-medical-600" /> Add photo</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="ph-caption">Caption</label>
            <input id="ph-caption" value={caption} onChange={(e) => setCaption(e.target.value)} className={inputCls} placeholder="e.g. Main entrance" />
          </div>
          <div>
            <label className={labelCls} htmlFor="ph-cat">Category</label>
            <select id="ph-cat" value={category} onChange={(e) => setCategory(e.target.value as HospitalPhoto['category'])} className={inputCls}>
              {PHOTO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="ph-vis">Visibility</label>
            <select id="ph-vis" value={visibility} onChange={(e) => setVisibility(e.target.value as 'public' | 'private')} className={inputCls}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        <button type="button" onClick={upload} disabled={!caption.trim()} className="mt-3 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700 disabled:opacity-40">
          Upload (simulated secure upload)
        </button>
        <p className="mt-2 text-[10px] text-slate-400">JPEG/PNG · max 8 MB · compressed and optimized. Photos require approval before public display.</p>
      </section>

      <section className={cardCls} aria-labelledby="ph-list">
        <h3 id="ph-list" className="mb-3 text-sm font-extrabold text-slate-900">Photos ({organization.photos.length})</h3>
        {organization.photos.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No photos yet.</p>
        ) : (
          <ul className="space-y-2">
            {organization.photos.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-medical-600 ring-1 ring-slate-200"><ImageIcon className="h-5 w-5" /></span>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{p.caption}</p>
                    <p className="text-[10px] capitalize text-slate-400">{p.category} · {p.visibility} · {p.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${p.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                    {p.approvalStatus === 'approved' ? 'Approved' : 'Pending approval'}
                  </span>
                  <button type="button" onClick={() => setConfirmRemove(p.id)} className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600" aria-label={`Delete ${p.caption}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {confirmRemove && (
        <div role="dialog" aria-modal="true" className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-bold text-rose-900">Remove this photo?</p>
          <p className="mt-1 text-xs text-rose-800">The photo is removed from the portal and any pending public display.</p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => setConfirmRemove(null)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Keep</button>
            <button type="button" onClick={() => { removePhoto(confirmRemove); setConfirmRemove(null); }} className="cursor-pointer rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700">Remove</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Accreditations (§51)                                                */
/* ------------------------------------------------------------------ */

const AccreditationsSection: React.FC<{ standalone?: boolean }> = ({ standalone }) => {
  const { organization, addAccreditation } = useHospitalPortal();
  const [body, setBody] = useState('');
  const [cert, setCert] = useState('');
  const [issue, setIssue] = useState('');
  const [expiry, setExpiry] = useState('');
  const [err, setErr] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const submit = () => {
    if (!body.trim() || !cert.trim() || !issue) { setErr('Accreditation body, certification and issue date are required.'); return; }
    addAccreditation({ body: body.trim(), certification: cert.trim(), issueDate: issue, expiryDate: expiry || undefined, documentName: `${cert.trim()}.pdf` });
    setBody(''); setCert(''); setIssue(''); setExpiry(''); setErr('');
  };

  return (
    <div className="space-y-5">
      {standalone && <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Accreditations &amp; Certifications</h2>}
      <section className={cardCls} aria-labelledby="acc-add">
        <h3 id="acc-add" className="mb-4 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Award className="h-4 w-4 text-medical-600" /> Add accreditation</h3>
        {err && <p role="alert" className="mb-3 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-800">{err}</p>}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div>
            <label className={labelCls} htmlFor="acc-body">Accreditation body</label>
            <input id="acc-body" value={body} onChange={(e) => setBody(e.target.value)} className={inputCls} placeholder="e.g. NABH" />
          </div>
          <div>
            <label className={labelCls} htmlFor="acc-cert">Certification</label>
            <input id="acc-cert" value={cert} onChange={(e) => setCert(e.target.value)} className={inputCls} placeholder="e.g. Hospital Accreditation" />
          </div>
          <div>
            <label className={labelCls} htmlFor="acc-issue">Issue date</label>
            <input id="acc-issue" type="date" value={issue} onChange={(e) => setIssue(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls} htmlFor="acc-exp">Expiry <span className="normal-case text-slate-400">(if any)</span></label>
            <input id="acc-exp" type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)} className={inputCls} />
          </div>
        </div>
        <button type="button" onClick={submit} className="mt-3 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Add accreditation</button>
        <p className="mt-2 text-[10px] text-slate-400">Unverified accreditations are never displayed publicly. Documents remain private unless intentionally published.</p>
      </section>

      <section className={cardCls} aria-labelledby="acc-list">
        <h3 id="acc-list" className="mb-3 text-sm font-extrabold text-slate-900">Current accreditations</h3>
        {organization.accreditations.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No accreditations on file.</p>
        ) : (
          <ul className="space-y-2">
            {organization.accreditations.map((a: Accreditation) => {
              const daysLeft = a.expiryDate ? Math.ceil((new Date(a.expiryDate).getTime() - new Date(today).getTime()) / 86400000) : null;
              const expired = daysLeft !== null && daysLeft < 0;
              const expiring = !expired && daysLeft !== null && daysLeft <= 30;
              return (
                <li key={a.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-extrabold text-slate-800">{a.body} — {a.certification}</p>
                      <p className="text-[10px] text-slate-400">Issued {a.issueDate}{a.expiryDate && ` · Expires ${a.expiryDate}`}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold ${
                      a.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700'
                      : a.verificationStatus === 'expired' ? 'bg-rose-50 text-rose-700'
                      : a.verificationStatus === 'expiring_soon' ? 'bg-amber-50 text-amber-800'
                      : 'bg-slate-100 text-slate-500'
                    }`}>
                      {a.verificationStatus === 'verified' ? 'Verified' : a.verificationStatus === 'expired' ? 'Expired' : a.verificationStatus === 'expiring_soon' ? 'Expires soon' : 'Pending verification'}
                    </span>
                  </div>
                  {expired && <p className="mt-1.5 text-[11px] font-bold text-rose-700">Accreditation expired — renew to keep the public claim.</p>}
                  {expiring && <p className="mt-1.5 text-[11px] font-bold text-amber-700">Expires in {daysLeft} days</p>}
                  {a.documentName && <p className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-400"><FileText className="h-3 w-3" /> {a.documentName} (private)</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Insurance (§52)                                                     */
/* ------------------------------------------------------------------ */

const InsuranceSection: React.FC = () => {
  const { organization, updateOrganization } = useHospitalPortal();
  const [plans, setPlans] = useState(organization.insurance.acceptedPlans.join(', '));
  const [methods, setMethods] = useState(organization.insurance.paymentMethods.join(', '));
  const [desk, setDesk] = useState(organization.insurance.insuranceDesk);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateOrganization({
      insurance: {
        acceptedPlans: plans.split(',').map((p) => p.trim()).filter(Boolean),
        paymentMethods: methods.split(',').map((m) => m.trim()).filter(Boolean),
        insuranceDesk: desk.trim(),
        disclaimer: 'Coverage confirmation may be required before admission.',
      },
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <section className={cardCls} aria-labelledby="pf-insurance">
      <h3 id="pf-insurance" className="mb-1 flex items-center gap-2 text-sm font-extrabold text-slate-900"><CreditCard className="h-4 w-4 text-medical-600" /> Insurance &amp; Payments</h3>
      <p className="mb-4 text-[11px] text-slate-400">Coverage always states: <strong>confirmation may be required</strong>.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="ins-plans">Accepted plans</label>
          <input id="ins-plans" value={plans} onChange={(e) => setPlans(e.target.value)} className={inputCls} placeholder="Comma separated" />
        </div>
        <div>
          <label className={labelCls} htmlFor="ins-methods">Payment methods</label>
          <input id="ins-methods" value={methods} onChange={(e) => setMethods(e.target.value)} className={inputCls} placeholder="Comma separated" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls} htmlFor="ins-desk">Insurance desk</label>
          <input id="ins-desk" value={desk} onChange={(e) => setDesk(e.target.value)} className={inputCls} placeholder="Location and contact of the insurance desk" />
        </div>
      </div>
      <p className="mt-3 rounded-xl bg-slate-50 p-3 text-[10px] text-slate-500">Public disclaimer: “Coverage confirmation may be required before admission.”</p>
      <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
        <button type="button" onClick={save} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-medical-700">
          <Save className="h-3.5 w-3.5" /> Save Changes
        </button>
        {saved && <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Saved</span>}
      </div>
    </section>
  );
};
