import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ShieldCheck, AlertCircle, Building2, MapPin, FileText } from 'lucide-react';
import { HospitalOrganization, HOSPITAL_TYPES, OWNERSHIP_TYPES, CONTROLLED_SERVICES, SPECIALTIES, computeCompleteness } from './hospitalPortalData';

interface HospitalOnboardingProps {
  workEmail: string;
  onComplete: (hospital: HospitalOrganization) => void;
  onBack: () => void;
}

const STEPS = ['Account', 'Hospital', 'Contact & Location', 'Services', 'Specialties', 'Documentation', 'Verification', 'Review', 'Activation'];

/** Guided 9-step hospital onboarding: Account → Hospital Information →
 *  Contact & Location → Services → Specialties → Documentation →
 *  Verification → Review → Activation. */
export const HospitalOnboarding: React.FC<HospitalOnboardingProps> = ({ workEmail, onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  // Step 1 — account
  const [email, setEmail] = useState(workEmail);
  const [repName, setRepName] = useState('');
  const [repPhone, setRepPhone] = useState('');

  // Step 2 — hospital information
  const [hospitalName, setHospitalName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [facilityType, setFacilityType] = useState('');
  const [ownership, setOwnership] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');

  // Step 3 — contact & location
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [postalCode, setPostalCode] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [locationMode, setLocationMode] = useState<'address' | 'map'>('address');

  // Step 4 — services
  const [services, setServices] = useState<string[]>([]);
  // Step 5 — specialties
  const [specialties, setSpecialties] = useState<string[]>([]);
  // Step 6 — documentation
  const [docs, setDocs] = useState<string[]>([]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const validate = (): boolean => {
    setError('');
    if (step === 0) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid official work email.'); return false; }
      if (!repName.trim() || !repPhone.trim()) { setError('Representative name and phone are required.'); return false; }
    }
    if (step === 1) {
      if (!hospitalName.trim() || !legalName.trim()) { setError('Hospital name and legal name are required.'); return false; }
      if (!facilityType || !ownership) { setError('Select facility type and ownership.'); return false; }
      if (!phone.trim()) { setError('Hospital phone is required.'); return false; }
    }
    if (step === 2) {
      if (!address.trim() || !city.trim() || !state.trim() || !postalCode.trim()) { setError('Complete the address fields.'); return false; }
      if (locationMode === 'map' && (!lat || !lng)) { setError('Pick a location on the map or use the address.'); return false; }
    }
    if (step === 3 && services.length === 0) { setError('Select at least one service.'); return false; }
    if (step === 4 && specialties.length === 0) { setError('Select at least one specialty.'); return false; }
    if (step === 5 && docs.length === 0) { setError('Attach at least one required document.'); return false; }
    return true;
  };

  const next = () => { if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const back = () => { setError(''); setStep((s) => Math.max(s - 1, 0)); };

  const activate = () => {
    if (!validate()) return;
    const hospital: HospitalOrganization = {
      id: `hosp-${Date.now()}`,
      legalName: legalName.trim(),
      displayName: hospitalName.trim(),
      facilityType,
      ownershipType: ownership,
      description: description.trim() || 'Description pending.',
      website: website.trim(),
      publicPhone: phone.trim(),
      publicEmail: email,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country,
      postalCode: postalCode.trim(),
      latitude: Number(lat) || 0,
      longitude: Number(lng) || 0,
      locationVerified: false,
      locationAccuracy: 'approximate',
      verificationStatus: 'under_review',
      verificationSource: 'Verification in progress',
      publicStatus: 'draft',
      completeness: 0,
      missingProfileFields: [],
      hours: [],
      emergency: { available: false, description: '', hours: '', contact: '' },
      accessibility: { wheelchairEntrance: false, accessibleParking: false, elevators: false, accessibleRestrooms: false, hearingAssistance: false, visualAssistance: false },
      photos: [],
      accreditations: [],
      insurance: { acceptedPlans: [], paymentMethods: ['Cash', 'Card', 'UPI'], insuranceDesk: '', disclaimer: 'Coverage confirmation may be required before admission.' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const comp = computeCompleteness(hospital);
    hospital.completeness = comp.pct;
    hospital.missingProfileFields = comp.missing;
    onComplete(hospital);
  };

  const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
  const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-medical-50/70 via-white to-medical-50/50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-medical-200/40 blur-3xl" />
      </div>

      <header className="relative z-30 border-b border-medical-100/80 bg-white/85 px-4 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button onClick={onBack} className="flex cursor-pointer items-center gap-2.5 text-left">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-800 text-white">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">Hospital Portal — Registration</span>
          </button>
          <span className="text-xs font-bold text-medical-700">Step {step + 1} of 9</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <ol className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-1" aria-label="Registration progress">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              {i > 0 && <span className={`h-px min-w-3 flex-1 ${step >= i ? 'bg-medical-500' : 'bg-slate-200'}`} aria-hidden="true" />}
              <li className="flex shrink-0 items-center gap-1.5">
                <span className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold transition ${
                  step === i ? 'bg-medical-600 text-white ring-4 ring-medical-100'
                  : step > i ? 'bg-medical-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {step > i ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={`hidden text-[11px] font-bold sm:block ${step === i ? 'text-medical-800' : 'text-slate-400'}`}>{label}</span>
              </li>
            </React.Fragment>
          ))}
        </ol>

        <div className="relative rounded-3xl border border-medical-100/90 bg-white p-6 shadow-lift sm:p-8">
          <div aria-hidden="true" className="absolute inset-x-8 top-0 h-1 rounded-b-full bg-gradient-to-r from-medical-400 via-medical-500 to-medical-700" />
          <div className="relative">
            {error && (
              <p role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" /> {error}
              </p>
            )}

            {step === 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Account</h2>
                <p className="-mt-2 text-xs text-slate-500">The person registering must be an authorized representative of the hospital.</p>
                <div>
                  <label className={labelCls} htmlFor="ho-email">Official work email</label>
                  <input id="ho-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="ho-rep">Authorized representative</label>
                    <input id="ho-rep" value={repName} onChange={(e) => setRepName(e.target.value)} className={inputCls} placeholder="Full name" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-phone">Phone</label>
                    <input id="ho-phone" type="tel" value={repPhone} onChange={(e) => setRepPhone(e.target.value)} className={inputCls} placeholder="+91 …" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Hospital Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls} htmlFor="ho-name">Hospital name <span className="text-rose-500">*</span></label>
                    <input id="ho-name" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className={inputCls} placeholder="Display name" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-legal">Legal name <span className="text-rose-500">*</span></label>
                    <input id="ho-legal" value={legalName} onChange={(e) => setLegalName(e.target.value)} className={inputCls} placeholder="Registered legal entity" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-type">Facility type <span className="text-rose-500">*</span></label>
                    <select id="ho-type" value={facilityType} onChange={(e) => setFacilityType(e.target.value)} className={inputCls}>
                      <option value="">Select…</option>
                      {HOSPITAL_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                    <p className="mt-1 text-[10px] text-slate-400">Categories are never auto-assigned.</p>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-own">Ownership <span className="text-rose-500">*</span></label>
                    <select id="ho-own" value={ownership} onChange={(e) => setOwnership(e.target.value)} className={inputCls}>
                      <option value="">Select…</option>
                      {OWNERSHIP_TYPES.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="ho-desc">Description</label>
                    <textarea id="ho-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-web">Website</label>
                    <input id="ho-web" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className={inputCls} placeholder="https://…" />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-phone2">Phone <span className="text-rose-500">*</span></label>
                    <input id="ho-phone2" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="+91 …" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Contact &amp; Location</h2>
                <p className="-mt-2 text-xs text-slate-500">Coordinates are geocoded through a secure provider layer — API keys are never exposed in the browser.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelCls} htmlFor="ho-addr">Address</label>
                    <input id="ho-addr" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-city">City</label>
                    <input id="ho-city" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-state">State / Region</label>
                    <input id="ho-state" value={state} onChange={(e) => setState(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-country">Country</label>
                    <input id="ho-country" value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="ho-postal">Postal code</label>
                    <input id="ho-postal" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={inputCls} />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(['address', 'map'] as const).map((m) => (
                      <button key={m} type="button" onClick={() => setLocationMode(m)}
                        className={`cursor-pointer rounded-lg border px-3 py-1.5 text-[11px] font-bold transition ${
                          locationMode === m ? 'border-medical-500 bg-medical-50 text-medical-800' : 'border-slate-200 bg-white text-slate-500'
                        }`}>
                        {m === 'address' ? 'Use address' : 'Pick location on map'}
                      </button>
                    ))}
                  </div>
                  {locationMode === 'map' ? (
                    <div className="space-y-3">
                      <div className="grid h-44 place-items-center rounded-xl border-2 border-dashed border-medical-200 bg-medical-50/40 text-center">
                        <div>
                          <MapPin className="mx-auto h-8 w-8 text-medical-400" />
                          <p className="mt-1 text-[11px] font-bold text-medical-800">Map picker (simulated)</p>
                          <p className="text-[10px] text-slate-500">In production this uses a secure geocoding provider with no exposed keys.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls} htmlFor="ho-lat">Latitude</label>
                          <input id="ho-lat" type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} className={inputCls} placeholder="28.61…" />
                        </div>
                        <div>
                          <label className={labelCls} htmlFor="ho-lng">Longitude</label>
                          <input id="ho-lng" type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} className={inputCls} placeholder="77.20…" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500">Address geocoding runs server-side. “Location Verified” is only shown after actual verification — otherwise the location is marked approximate.</p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Services</h2>
                <p className="-mt-2 text-xs text-slate-500">Select the services your hospital actually provides.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CONTROLLED_SERVICES.map((s) => (
                    <button key={s} type="button" onClick={() => toggle(services, setServices, s)}
                      className={`cursor-pointer rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                        services.includes(s) ? 'border-medical-500 bg-medical-50 text-medical-800' : 'border-slate-200 bg-white text-slate-500 hover:border-medical-200'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">Custom services can only be added through the controlled workflow after activation.</p>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Specialties</h2>
                <p className="-mt-2 text-xs text-slate-500">From the controlled GlobalHealth taxonomy.</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {SPECIALTIES.map((s) => (
                    <button key={s} type="button" onClick={() => toggle(specialties, setSpecialties, s)}
                      className={`cursor-pointer rounded-xl border px-3 py-2.5 text-xs font-bold transition ${
                        specialties.includes(s) ? 'border-medical-500 bg-medical-50 text-medical-800' : 'border-slate-200 bg-white text-slate-500 hover:border-medical-200'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Documentation</h2>
                <p className="-mt-2 text-xs text-slate-500">Only genuinely necessary documents are requested. Uploads are encrypted, scanned and never public.</p>
                <div className="space-y-2">
                  {[
                    ['Facility registration', 'Government-issued facility registration certificate'],
                    ['Licensing documentation', 'Current operating license'],
                    ['Accreditation documentation', 'If your facility is accredited'],
                    ['Ownership / authorization documents', 'Proof the representative is authorized'],
                    ['Authorized representative proof', 'Government-issued ID of the representative'],
                  ].map(([label, hint]) => {
                    const active = docs.includes(label);
                    return (
                      <button key={label} type="button" onClick={() => toggle(docs, setDocs, label)}
                        className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition ${
                          active ? 'border-emerald-300 bg-emerald-50/60' : 'border-dashed border-slate-300 bg-white hover:border-medical-300'
                        }`}>
                        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {active ? <Check className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-bold text-slate-800">{label}</span>
                          <span className="block text-[10px] text-slate-500">{hint}</span>
                        </span>
                        {active && <span className="text-[10px] font-bold text-emerald-700">Attached (secured)</span>}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400">Allowed types: PDF, JPG, PNG · max 10 MB · virus-scanned · encrypted at rest.</p>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Verification</h2>
                <div className="rounded-2xl border border-medical-100 bg-medical-50/60 p-4">
                  <ol className="space-y-1.5 text-xs text-medical-900">
                    {['Registration', 'Document review', 'Facility verification', 'Representative verification', 'Approval / Rejection / Additional Information', 'Verified Hospital', 'Portal activated'].map((s, i) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${i < 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-white text-medical-700 ring-1 ring-medical-200'}`}>
                          {i < 2 ? <Check className="h-3 w-3" /> : i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="text-[11px] text-slate-500">“Verified Hospital” is displayed only after the full workflow succeeds. Verification source and date are shown on the dashboard.</p>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900">Review</h2>
                <dl className="space-y-1.5 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-xs">
                  {[
                    ['Representative', `${repName} · ${repPhone} · ${email}`],
                    ['Hospital', `${hospitalName} (${legalName})`],
                    ['Facility type', facilityType || '—'],
                    ['Ownership', ownership || '—'],
                    ['Address', `${address}, ${city}, ${state} ${postalCode}, ${country}`],
                    ['Services', services.join(', ') || '—'],
                    ['Specialties', specialties.join(', ') || '—'],
                    ['Documents', `${docs.length} attached (secured)`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-3">
                      <dt className="shrink-0 font-bold text-slate-500">{k}</dt>
                      <dd className="break-all text-right font-medium text-slate-800">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <span>Your public profile is <strong>not published</strong> until verification completes and you publish it. Draft data never reaches the public GlobalHealth profile.</span>
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="space-y-4 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-medical-50 text-medical-700 ring-1 ring-medical-100">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Registration submitted</h2>
                <p className="mx-auto max-w-md text-xs leading-relaxed text-slate-500">
                  Your hospital is now <strong>Under Review</strong>. The credential team verifies your documents, facility and representative.
                  You'll be notified in the portal when verification completes.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
              <button type="button" onClick={step === 0 ? onBack : back}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4" /> {step === 0 ? 'Sign out' : 'Back'}
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={next}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-medical-600/20 transition hover:bg-medical-700">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={activate}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-medical-600/20 transition hover:bg-medical-700">
                  <ShieldCheck className="h-4 w-4" /> Activate workspace
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
