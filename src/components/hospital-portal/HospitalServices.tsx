import React, { useState } from 'react';
import { ClipboardList, Plus, AlertCircle, CheckCircle2, Eye, EyeOff, FlaskConical, ScanLine, Pill, Droplets, Archive } from 'lucide-react';
import {
  useHospitalPortal, CONTROLLED_SERVICES, SPECIALTIES, LAB_TESTS, IMAGING_MODALITIES,
  ServiceItem, SpecialtyItem,
} from './hospitalPortalData';

interface HospitalServicesProps {
  section: 'services' | 'specialties' | 'laboratory' | 'imaging' | 'pharmacy' | 'blood_bank';
}

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700';
const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';

export const HospitalServices: React.FC<HospitalServicesProps> = ({ section }) => {
  if (section === 'specialties') return <SpecialtiesView />;
  if (section === 'laboratory') return <LaboratoryView />;
  if (section === 'imaging') return <ImagingView />;
  if (section === 'pharmacy') return <PharmacyView />;
  if (section === 'blood_bank') return <BloodBankView />;
  return <ServicesView />;
};

/* ---------------- Services ---------------- */

const ServicesView: React.FC = () => {
  const { organization, departments, services, addService, toggleServiceVisibility, setServiceAvailability, archiveService } = useHospitalPortal();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [deptId, setDeptId] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const scoped = services.filter((s) => s.hospitalId === organization.id && s.status === 'active');
  const depts = departments.filter((d) => d.hospitalId === organization.id && d.status === 'active');

  const create = () => {
    if (!name.trim()) { setErr('Service name is required.'); return; }
    if (scoped.some((s) => s.name.toLowerCase() === name.trim().toLowerCase())) { setErr('This service already exists.'); return; }
    addService({ name: name.trim(), description: description.trim() || 'Description pending.', departmentId: deptId || undefined, availability: 'available', publicVisibility: true, status: 'active' });
    setOpen(false); setName(''); setDescription(''); setDeptId(''); setErr('');
    setOk(`Service “${name.trim()}” added.`);
    window.setTimeout(() => setOk(''), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Services</h2>
          <p className="text-xs text-slate-500">Services are only published when you mark them publicly visible.</p>
        </div>
        <button type="button" onClick={() => setOpen(!open)} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">
          <Plus className="h-3.5 w-3.5" /> Add service
        </button>
      </div>

      {err && <p role="alert" className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800"><AlertCircle className="h-4 w-4" /> {err}</p>}
      {ok && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {ok}</p>}

      {open && (
        <section className={cardCls} aria-labelledby="svc-new">
          <h3 id="svc-new" className="mb-4 text-sm font-extrabold text-slate-900">Add service</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="svc-name">Service name</label>
              <input id="svc-name" list="svc-options" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. MRI" />
              <datalist id="svc-options">
                {CONTROLLED_SERVICES.map((s) => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls} htmlFor="svc-dept">Department</label>
              <select id="svc-dept" value={deptId} onChange={(e) => setDeptId(e.target.value)} className={inputCls}>
                <option value="">None</option>
                {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls} htmlFor="svc-desc">Description</label>
              <textarea id="svc-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={create} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Add service</button>
            <button type="button" onClick={() => setOpen(false)} className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
          </div>
        </section>
      )}

      {scoped.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">No services yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {scoped.map((s: ServiceItem) => (
            <article key={s.id} className={cardCls}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-extrabold text-slate-900">{s.name}</p>
                <button type="button" onClick={() => toggleServiceVisibility(s.id)} className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:border-medical-200 hover:text-medical-700" aria-label={s.publicVisibility ? 'Hide from public profile' : 'Show on public profile'}>
                  {s.publicVisibility ? <Eye className="h-3.5 w-3.5 text-medical-600" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{s.description}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                  Availability
                  <select value={s.availability} onChange={(e) => setServiceAvailability(s.id, e.target.value as ServiceItem['availability'])} className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold focus:outline-none">
                    <option value="available">Available</option>
                    <option value="limited">Limited</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </label>
                <button type="button" onClick={() => archiveService(s.id)} className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-400 hover:border-amber-200 hover:text-amber-700">
                  <Archive className="h-3 w-3" /> Archive
                </button>
              </div>
              <p className="mt-2 text-[9px] text-slate-400">{s.publicVisibility ? 'Visible on public profile' : 'Hidden from public profile'} · {s.hours || 'Hours not set'}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- Specialties ---------------- */

const SpecialtiesView: React.FC = () => {
  const { organization, specialties, departments, doctors, addService, toggleSpecialty } = useHospitalPortal();
  const [pending, setPending] = useState<string>('');
  const [ok, setOk] = useState('');

  const scoped = specialties.filter((s) => s.hospitalId === organization.id);
  const depts = departments.filter((d) => d.hospitalId === organization.id && d.status === 'active');

  const requestSpecialty = () => {
    if (!pending) return;
    addService({ name: `Specialty request: ${pending}`, description: 'Controlled specialty request — submitted to GlobalHealth for approval.', availability: 'unavailable', publicVisibility: false, status: 'active' });
    setOk(`Request for “${pending}” submitted — specialties outside the controlled taxonomy require approval.`);
    setPending('');
    window.setTimeout(() => setOk(''), 5000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Specialties</h2>
        <p className="text-xs text-slate-500">From the controlled GlobalHealth taxonomy — custom specialties require approval.</p>
      </div>

      {ok && <p role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800"><CheckCircle2 className="h-4 w-4" /> {ok}</p>}

      <section className={cardCls} aria-labelledby="sp-list">
        <h3 id="sp-list" className="mb-3 text-sm font-extrabold text-slate-900">Supported specialties</h3>
        {scoped.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No specialties configured.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {scoped.map((s: SpecialtyItem) => {
              const dept = depts.find((d) => d.id === s.departmentId);
              const docCount = doctors.filter((d) => d.hospitalId === organization.id && d.specialtyId === s.id && d.affiliationStatus === 'active').length;
              return (
                <div key={s.id} className={`rounded-xl border p-3 ${s.status === 'active' ? 'border-slate-100 bg-slate-50/60' : 'border-dashed border-slate-200 bg-white opacity-60'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-extrabold text-slate-800">{s.name}</p>
                    <button type="button" onClick={() => toggleSpecialty(s.id)} className={`cursor-pointer rounded-lg px-2 py-1 text-[9px] font-bold ${s.status === 'active' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100' : 'bg-medical-50 text-medical-700 hover:bg-medical-100'}`}>
                      {s.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">{dept ? `${dept.name} department` : 'No department assigned'} · {docCount} active doctor{docCount === 1 ? '' : 's'}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className={cardCls} aria-labelledby="sp-request">
        <h3 id="sp-request" className="mb-3 text-sm font-extrabold text-slate-900">Request a specialty</h3>
        <div className="flex flex-wrap gap-2">
          <select value={pending} onChange={(e) => setPending(e.target.value)} className={`${inputCls} max-w-xs`} aria-label="Requested specialty">
            <option value="">Select a specialty to request…</option>
            {SPECIALTIES.filter((n) => !scoped.some((s) => s.name === n)).map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
          <button type="button" onClick={requestSpecialty} disabled={!pending} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700 disabled:opacity-40">Submit request</button>
        </div>
        <p className="mt-2 text-[10px] text-slate-400">Requests are reviewed before the specialty appears in your profile.</p>
      </section>
    </div>
  );
};

/* ---------------- Laboratory (§41) ---------------- */

const LaboratoryView: React.FC = () => {
  const { organization, departments, labTests } = useHospitalPortal();
  const scoped = labTests.filter((t) => t.hospitalId === organization.id);
  const dept = departments.find((d) => d.id === 'dep-3');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Laboratory &amp; Diagnostics</h2>
        <p className="text-xs text-slate-500">Linked to GlobalHealth's central Lab Test database — hospitals cannot invent standardized test definitions.</p>
      </div>
      <section className={cardCls} aria-labelledby="lab-list">
        <h3 id="lab-list" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><FlaskConical className="h-4 w-4 text-medical-600" /> Offered tests ({scoped.length})</h3>
        {scoped.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No laboratory services configured at this hospital.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th scope="col" className="px-3 py-2.5">Test</th>
                  <th scope="col" className="px-3 py-2.5">Category</th>
                  <th scope="col" className="px-3 py-2.5">Availability</th>
                  <th scope="col" className="px-3 py-2.5">Hours</th>
                  <th scope="col" className="px-3 py-2.5">Booking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scoped.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 font-bold text-slate-800">{t.name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{t.category}</td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold capitalize ${
                        t.availability === 'available' ? 'bg-emerald-50 text-emerald-700' : t.availability === 'limited' ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-500'
                      }`}>{t.availability}</span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">{t.hours || '—'}</td>
                    <td className="px-3 py-2.5 text-slate-500">{t.bookingSupported ? 'Supported' : 'Not available'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {dept && <p className="mt-3 text-[10px] text-slate-400">Runs under {dept.name} · {dept.hours?.length ? `${dept.hours.length} configured day(s)` : 'hours not set'}.</p>}
      </section>
    </div>
  );
};

/* ---------------- Imaging (§44) ---------------- */

const ImagingView: React.FC = () => {
  const { organization, imaging } = useHospitalPortal();
  const scoped = imaging.filter((i) => i.hospitalId === organization.id);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Imaging Services</h2>
        <p className="text-xs text-slate-500">Only modalities actually offered are shown.</p>
      </div>
      <section className={cardCls} aria-labelledby="img-list">
        <h3 id="img-list" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><ScanLine className="h-4 w-4 text-medical-600" /> Modalities</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {IMAGING_MODALITIES.map((m) => {
            const item = scoped.find((i) => i.modality === m);
            const available = item?.available ?? false;
            return (
              <div key={m} className={`flex items-center justify-between rounded-xl border p-3 ${available ? 'border-slate-100 bg-slate-50/60' : 'border-dashed border-slate-200 bg-white opacity-60'}`}>
                <span className="text-xs font-extrabold text-slate-800">{m}</span>
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {available ? 'Offered' : 'Not offered'}
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-[10px] text-slate-400">{scoped.filter((i) => i.available).length} of {IMAGING_MODALITIES.length} modalities offered at this hospital.</p>
      </section>
    </div>
  );
};

/* ---------------- Pharmacy (§42) ---------------- */

const PharmacyView: React.FC = () => {
  const { organization, pharmacy } = useHospitalPortal();
  const scoped = pharmacy.filter((p) => p.hospitalId === organization.id);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Pharmacy Services</h2>
        <p className="text-xs text-slate-500">Pharmacy inventory is kept strictly separate from the hospital profile.</p>
      </div>
      {scoped.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">No affiliated pharmacy registered.</p>
      ) : (
        scoped.map((p) => (
          <section key={p.id} className={cardCls} aria-labelledby={`pharm-${p.id}`}>
            <h3 id={`pharm-${p.id}`} className="mb-1 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Pill className="h-4 w-4 text-medical-600" /> {p.name}</h3>
            <p className="text-[11px] text-slate-500">{p.relationship}</p>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[9px] font-bold uppercase text-slate-400">Hours</dt><dd className="font-bold text-slate-700">{p.hours}</dd></div>
              <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[9px] font-bold uppercase text-slate-400">Contact</dt><dd className="font-bold text-slate-700">{p.contact}</dd></div>
              <div className="rounded-lg bg-slate-50 p-2.5 sm:col-span-2"><dt className="text-[9px] font-bold uppercase text-slate-400">Services</dt><dd className="font-bold text-slate-700">{p.services.join(' · ')}</dd></div>
            </dl>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-medical-50 px-2.5 py-1 text-[10px] font-bold text-medical-800 ring-1 ring-medical-200">
              {p.prescriptionSupport ? 'Prescription support available' : 'No prescription support'}
            </p>
          </section>
        ))
      )}
    </div>
  );
};

/* ---------------- Blood bank (§43) ---------------- */

const BloodBankView: React.FC = () => {
  const { organization, bloodBanks } = useHospitalPortal();
  const scoped = bloodBanks.filter((b) => b.hospitalId === organization.id);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Blood Bank</h2>
        <p className="text-xs text-slate-500">Real-time stock is never displayed unless the system genuinely receives current stock data.</p>
      </div>
      {scoped.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-xs text-slate-400">No blood bank registered at this hospital.</p>
      ) : (
        scoped.map((b) => (
          <section key={b.id} className={cardCls} aria-labelledby={`bb-${b.id}`}>
            <h3 id={`bb-${b.id}`} className="mb-1 flex items-center gap-2 text-sm font-extrabold text-slate-900"><Droplets className="h-4 w-4 text-medical-600" /> {b.name}</h3>
            <p className="text-[11px] text-slate-500">{b.publicInfo}</p>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[9px] font-bold uppercase text-slate-400">Hours</dt><dd className="font-bold text-slate-700">{b.hours}</dd></div>
              <div className="rounded-lg bg-slate-50 p-2.5"><dt className="text-[9px] font-bold uppercase text-slate-400">Contact</dt><dd className="font-bold text-slate-700">{b.contact}</dd></div>
              <div className="rounded-lg bg-slate-50 p-2.5 sm:col-span-2"><dt className="text-[9px] font-bold uppercase text-slate-400">Services</dt><dd className="font-bold text-slate-700">{b.services.join(' · ')}</dd></div>
            </dl>
            <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-amber-50 p-2.5 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> Live stock counts are not displayed — stock data is not streamed to this portal.
            </p>
          </section>
        ))
      )}
    </div>
  );
};
