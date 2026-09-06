import React, { useEffect, useState } from 'react';
import {
  ShieldCheck, AlertTriangle, Clock3, CalendarClock, UserRound, DoorOpen, ClipboardList,
  BadgeCheck, ArrowRight, Building2, CheckCircle2, Info, UserPlus, PlusCircle, CalendarDays,
  RefreshCw, FileCheck2, Users, Star, Siren, BedDouble, FlaskConical, ScanLine, Pill,
  Droplets, Truck, Link2, Wallet, Activity,
} from 'lucide-react';
import { useHospitalPortal, WorkspaceView, VERIFICATION_LABEL, APPOINTMENT_STATUS_LABEL, CONSULTATION_LABEL } from './hospitalPortalData';

const QUICK_ACTIONS: { label: string; view: WorkspaceView; icon: React.ReactNode }[] = [
  { label: 'Add Doctor', view: 'doctors', icon: <UserPlus className="h-4 w-4" /> },
  { label: 'Add Department', view: 'departments', icon: <PlusCircle className="h-4 w-4" /> },
  { label: 'Update Hospital Profile', view: 'profile', icon: <Building2 className="h-4 w-4" /> },
  { label: 'View Appointments', view: 'appointments', icon: <CalendarDays className="h-4 w-4" /> },
  { label: 'Update Hours', view: 'hours', icon: <Clock3 className="h-4 w-4" /> },
  { label: 'Manage Services', view: 'services', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Pricing Center', view: 'pricing', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Review Verification', view: 'verification', icon: <FileCheck2 className="h-4 w-4" /> },
  { label: 'Manage Staff', view: 'staff', icon: <Users className="h-4 w-4" /> },
];

export const HospitalDashboard: React.FC<{ onNavigate: (v: WorkspaceView) => void }> = ({ onNavigate }) => {
  const { organization, departments, doctors, services, appointments, documents, verification, labTests, imaging, pharmacy, bloodBanks, prices } = useHospitalPortal();
  const [loading, setLoading] = useState(true);

  // Simulated fetch — skeleton states per spec §77.
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(t);
  }, [organization.id]);

  const today = new Date().toISOString().slice(0, 10);
  const scoped = appointments.filter((a) => a.hospitalId === organization.id);
  const todays = scoped.filter((a) => a.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = scoped.filter((a) => a.date > today && (a.status === 'confirmed' || a.status === 'pending')).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 3);
  const activeDoctors = doctors.filter((d) => d.hospitalId === organization.id && d.affiliationStatus === 'active');
  const activeDepts = departments.filter((d) => d.hospitalId === organization.id && d.status === 'active');
  const activeServices = services.filter((s) => s.hospitalId === organization.id && s.status === 'active');
  const scopedLab = labTests.filter((l) => l.hospitalId === organization.id);
  const scopedImaging = imaging.filter((i) => i.hospitalId === organization.id);
  const scopedPharmacy = pharmacy.filter((p) => p.hospitalId === organization.id);
  const scopedBlood = bloodBanks.filter((b) => b.hospitalId === organization.id);
  const scopedPrices = prices.filter((p) => p.hospitalId === organization.id);
  const publishedPrices = scopedPrices.filter((p) => p.publicStatus === 'published').length;
  const pendingPrices = scopedPrices.filter((p) => p.publicStatus === 'pending_review' || p.publicStatus === 'draft').length;
  const emergencyAvailable = organization.emergency.available;
  const labAvailable = scopedLab.filter((l) => l.availability === 'available').length;
  const imagingAvailable = scopedImaging.filter((i) => i.available).length;
  const pharmacyAvailable = scopedPharmacy.filter((p) => p.name).length;

  const expiringDoc = documents.find((d) => d.hospitalId === organization.id && d.status === 'expiring_soon');
  const expiringAcc = organization.accreditations.find((a) => a.verificationStatus === 'expiring_soon' || a.verificationStatus === 'expired');
  const pendingPhotos = organization.photos.filter((p) => p.approvalStatus === 'pending');
  const pendingDoctors = doctors.filter((d) => d.hospitalId === organization.id && (d.affiliationStatus === 'pending' || d.affiliationStatus === 'invited'));

  const tasks: { priority: 'high' | 'attention' | 'recommended'; label: string; detail: string; view: WorkspaceView }[] = [];
  if (organization.verificationStatus !== 'verified') {
    tasks.push({ priority: 'high', label: 'Verification issue', detail: verification.nextAction || 'Complete hospital verification to activate the portal.', view: 'verification' });
  }
  if (expiringDoc) tasks.push({ priority: 'attention', label: 'Document expiring', detail: `${expiringDoc.name} expires soon — upload the renewal.`, view: 'documents' });
  if (expiringAcc) tasks.push({ priority: 'attention', label: expiringAcc.verificationStatus === 'expired' ? 'Accreditation expired' : 'Accreditation expiring', detail: `${expiringAcc.body} — ${expiringAcc.certification}.`, view: 'accreditations' });
  if (pendingDoctors.length) tasks.push({ priority: 'attention', label: 'Confirm doctor affiliation', detail: `${pendingDoctors.length} doctor${pendingDoctors.length > 1 ? 's' : ''} await${pendingDoctors.length > 1 ? '' : 's'} confirmation.`, view: 'doctors' });
  if (pendingPhotos.length) tasks.push({ priority: 'recommended', label: 'Photos awaiting approval', detail: `${pendingPhotos.length} photo${pendingPhotos.length > 1 ? 's' : ''} pending review before public display.`, view: 'photos' });
  if (organization.missingProfileFields.length) tasks.push({ priority: 'recommended', label: 'Complete hospital profile', detail: organization.missingProfileFields[0], view: 'profile' });

  if (loading) {
    return (
      <div className="space-y-5" aria-busy="true" aria-label="Loading dashboard">
        <div className="h-20 animate-pulse rounded-2xl bg-slate-200/70" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200/70" />)}
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200/70 xl:col-span-2" />
          <div className="h-72 animate-pulse rounded-2xl bg-slate-200/70" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Verification banner (§13) — the first thing the homepage shows */}
      {organization.verificationStatus === 'verified' ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><BadgeCheck className="h-5 w-5" /></span>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-900">Verified Hospital</p>
            <p className="text-xs text-emerald-800/90">
              Last verified: <strong>{organization.verificationDate}</strong> · Source: {organization.verificationSource}
            </p>
          </div>
          <button type="button" onClick={() => onNavigate('verification')} className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">View verification</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><AlertTriangle className="h-5 w-5" /></span>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Verification in progress — {Math.max(0, verification.stepsTotal - verification.stepsDone)} step{verification.stepsTotal - verification.stepsDone === 1 ? '' : 's'} remaining</p>
            <p className="text-xs text-amber-800/90">{verification.nextAction}</p>
          </div>
          <button type="button" onClick={() => onNavigate('verification')} className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700">Continue</button>
        </div>
      )}

      {/* Welcome + key metrics (§14) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">{organization.displayName || 'Your hospital'}</h2>
          <p className="text-xs text-slate-500">
            {VERIFICATION_LABEL[organization.verificationStatus]} hospital · Public profile: {organization.publicStatus.replace('_', ' ')}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-medical-200 bg-medical-50 px-3 py-1 text-[11px] font-bold text-medical-800">
          <Star className="h-3.5 w-3.5" /> Portal active
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metric label="Today's appointments" value={todays.length} sub={`${todays.filter((a) => a.status === 'pending').length} awaiting confirmation`} />
        <Metric label="Upcoming appointments" value={upcoming.length + todays.filter((a) => a.status === 'confirmed').length} sub="confirmed + pending" />
        <Metric label="Active doctors" value={activeDoctors.length} sub={`${doctors.filter((d) => d.hospitalId === organization.id).length} total`} />
        <Metric label="Departments" value={activeDepts.length} sub={`${activeServices.length} services`} />
      </div>

      {/* Operations center (§59–§60): service-level status, never color alone */}
      <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-soft" aria-labelledby="ops-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 id="ops-title" className="flex items-center gap-2 text-sm font-extrabold text-[#0B1F33]">
            <Activity className="h-4 w-4 text-[#1769AA]" /> Operations Center
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE0EC] bg-[#EDF6FC] px-3 py-1 text-[10px] font-bold text-[#1769AA]">
            <RefreshCw className="h-3 w-3" /> Auto-refreshes with hospital data
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <OpCard
            icon={<Siren className="h-4 w-4" />} title="Emergency"
            status={emergencyAvailable ? 'Operational' : 'Downtime'}
            statusClassName={emergencyAvailable ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-700'}
            detail={organization.emergency.hours || '24×7'}
            action="Review emergency profile"
            onClick={() => onNavigate('services')}
          />
          <OpCard
            icon={<BedDouble className="h-4 w-4" />} title="Care & Beds"
            status={organization.emergency.available ? 'Admissions open' : 'Check emergency'}
            statusClassName="border-[#CDE0EC] bg-[#EDF6FC] text-[#1769AA]"
            detail={`${activeServices.length} active services · ${activeDepts.length} departments`}
            action="Open departments"
            onClick={() => onNavigate('departments')}
          />
          <OpCard
            icon={<FlaskConical className="h-4 w-4" />} title="Laboratory"
            status={labAvailable > 0 ? `${labAvailable} tests available` : 'Not configured'}
            statusClassName={labAvailable > 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'}
            detail={`${scopedLab.length} tests total`}
            action="Manage lab"
            onClick={() => onNavigate('laboratory')}
          />
          <OpCard
            icon={<ScanLine className="h-4 w-4" />} title="Imaging"
            status={imagingAvailable > 0 ? `${imagingAvailable} modalities online` : 'Not configured'}
            statusClassName={imagingAvailable > 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'}
            detail={`${scopedImaging.length} modalities total`}
            action="Manage imaging"
            onClick={() => onNavigate('imaging')}
          />
          <OpCard
            icon={<Pill className="h-4 w-4" />} title="Pharmacy"
            status={pharmacyAvailable > 0 ? 'In-house active' : 'No pharmacy configured'}
            statusClassName={pharmacyAvailable > 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'}
            detail={scopedPharmacy[0]?.hours || '—'}
            action="Manage pharmacy"
            onClick={() => onNavigate('pharmacy')}
          />
          <OpCard
            icon={<Droplets className="h-4 w-4" />} title="Blood Bank"
            status={scopedBlood.length > 0 ? 'Operational' : 'Not configured'}
            statusClassName={scopedBlood.length > 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'}
            detail={scopedBlood[0]?.hours || '—'}
            action="Manage blood bank"
            onClick={() => onNavigate('blood_bank')}
          />
          <OpCard
            icon={<Truck className="h-4 w-4" />} title="Ambulance"
            status={organization.emergency.available ? 'Dispatch available' : 'Dispatch check required'}
            statusClassName={organization.emergency.available ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-50 text-slate-600'}
            detail={organization.emergency.contact || 'Emergency contact not set'}
            action="Manage emergency"
            onClick={() => onNavigate('services')}
          />
          <OpCard
            icon={<Wallet className="h-4 w-4" />} title="Pricing & Billing"
            status={publishedPrices > 0 ? `${publishedPrices} published prices` : 'No published prices'}
            statusClassName={publishedPrices > 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}
            detail={`${pendingPrices} pending review`}
            action="Open pricing center"
            onClick={() => onNavigate('pricing')}
          />
          <OpCard
            icon={<Link2 className="h-4 w-4" />} title="GlobalHealth Sync"
            status={organization.publicStatus === 'published' ? 'Profile synchronized' : 'Profile awaiting publication'}
            statusClassName={organization.publicStatus === 'published' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}
            detail={`Profile ${organization.publicStatus.replace('_', ' ')}`}
            action="Review publication"
            onClick={() => onNavigate('verification')}
          />
        </div>
      </section>

      {/* Quick actions (§15) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="qa-title">
        <h3 id="qa-title" className="mb-3 text-sm font-extrabold text-slate-900">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {QUICK_ACTIONS.map((qa) => (
            <button key={qa.label} type="button" onClick={() => onNavigate(qa.view)}
              className="flex cursor-pointer flex-col items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-3 text-left transition hover:border-medical-200 hover:bg-medical-50">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-medical-600 ring-1 ring-slate-200">{qa.icon}</span>
              <span className="text-[11px] font-bold leading-tight text-slate-700">{qa.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Today's appointments */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2" aria-labelledby="today-title">
          <div className="mb-4 flex items-center justify-between">
            <h3 id="today-title" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Clock3 className="h-4 w-4 text-medical-600" /> Today's appointments</h3>
            <button type="button" onClick={() => onNavigate('appointments')} className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-medical-700 hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          {todays.length === 0 ? (
            <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">No appointments scheduled today.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {todays.slice(0, 6).map((a) => {
                const doc = doctors.find((d) => d.id === a.doctorId);
                const dep = departments.find((d) => d.id === a.departmentId);
                return (
                  <li key={a.id} className="flex items-center gap-3 py-2.5">
                    <span className="w-12 shrink-0 text-xs font-extrabold text-slate-800">{a.time}</span>
                    <span className="min-w-0 flex-1 truncate text-xs text-slate-600">
                      <span className="font-bold text-slate-800">{a.patientIdentifier}</span> · {doc?.name || 'Doctor'} · {dep?.name || '—'}
                    </span>
                    <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold sm:inline ${
                      a.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700'
                      : a.status === 'pending' ? 'bg-amber-50 text-amber-700'
                      : a.status === 'completed' ? 'bg-slate-100 text-slate-500'
                      : a.status === 'cancelled' ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-100 text-slate-500'
                    }`}>{APPOINTMENT_STATUS_LABEL[a.status]}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Right column */}
        <div className="space-y-5">
          {/* Profile completeness (§16) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="comp-title">
            <div className="flex items-center justify-between">
              <h3 id="comp-title" className="text-sm font-extrabold text-slate-900">Profile completeness</h3>
              <span className="text-sm font-extrabold text-medical-700">{organization.completeness}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={organization.completeness} aria-valuemin={0} aria-valuemax={100} aria-label="Hospital profile completeness">
              <div className="h-full rounded-full bg-gradient-to-r from-medical-400 to-medical-700 transition-all" style={{ width: `${organization.completeness}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              {organization.missingProfileFields.length ? `Missing: ${organization.missingProfileFields.slice(0, 2).join(' · ')}` : 'Profile complete.'}
            </p>
            <button type="button" onClick={() => onNavigate('profile')} className="mt-3 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Complete Profile</button>
          </section>

          {/* Information freshness (§104) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="fresh-title">
            <h3 id="fresh-title" className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><RefreshCw className="h-4 w-4 text-medical-600" /> Information health</h3>
            <dl className="mt-3 space-y-2 text-xs">
              <FreshRow label="Hospital profile" value={organization.updatedAt.slice(0, 10)} />
              <FreshRow label="Hours" value={organization.hours.length ? 'Configured' : 'Not configured'} />
              <FreshRow label="Services" value={`${activeServices.length} active`} />
              <FreshRow label="Accreditation" value={expiringAcc ? (expiringAcc.verificationStatus === 'expired' ? 'Expired' : 'Expires soon') : 'Current'} warn={Boolean(expiringAcc)} />
            </dl>
          </section>
        </div>
      </div>

      {/* Action required (§54, §106) — prioritized */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="tasks-title">
        <h3 id="tasks-title" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><ShieldCheck className="h-4 w-4 text-medical-600" /> Action Required</h3>
        {tasks.length === 0 ? (
          <p className="flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4" /> All caught up. No outstanding actions.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {tasks.map((t) => (
              <li key={t.label}>
                <button type="button" onClick={() => onNavigate(t.view)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-xl border p-3 text-left transition ${
                    t.priority === 'high' ? 'border-rose-200 bg-rose-50/60 hover:bg-rose-50'
                    : t.priority === 'attention' ? 'border-amber-200 bg-amber-50/60 hover:bg-amber-50'
                    : 'border-slate-100 bg-slate-50/70 hover:bg-medical-50'
                  }`}>
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    t.priority === 'high' ? 'bg-rose-100 text-rose-700' : t.priority === 'attention' ? 'bg-amber-100 text-amber-700' : 'bg-white text-medical-600 ring-1 ring-slate-200'
                  }`}>
                    {t.priority === 'high' ? <AlertTriangle className="h-4 w-4" /> : t.priority === 'attention' ? <Info className="h-4 w-4" /> : <ClipboardList className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-800">
                      <span className={`mr-1.5 text-[9px] font-extrabold uppercase ${t.priority === 'high' ? 'text-rose-600' : t.priority === 'attention' ? 'text-amber-700' : 'text-medical-600'}`}>{t.priority}</span>
                      {t.label}
                    </span>
                    <span className="block truncate text-[11px] text-slate-500">{t.detail}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Secondary strip: doctors / departments / services (§121) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard icon={<UserRound className="h-4 w-4" />} label="Doctors" value={activeDoctors.length} sub={`${pendingDoctors.length} pending affiliation`} onClick={() => onNavigate('doctors')} />
        <SummaryCard icon={<DoorOpen className="h-4 w-4" />} label="Departments" value={activeDepts.length} sub={`${departments.filter((d) => d.hospitalId === organization.id && d.status === 'archived').length} archived`} onClick={() => onNavigate('departments')} />
        <SummaryCard icon={<ClipboardList className="h-4 w-4" />} label="Services" value={activeServices.length} sub={`${activeServices.filter((s) => s.publicVisibility).length} public`} onClick={() => onNavigate('services')} />
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: number; sub: string }> = ({ label, value, sub }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
    <p className="text-[10px] text-slate-400">{sub}</p>
  </div>
);

const FreshRow: React.FC<{ label: string; value: string; warn?: boolean }> = ({ label, value, warn }) => (
  <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
    <dt className="text-slate-500">{label}</dt>
    <dd className={`font-bold ${warn ? 'text-amber-700' : 'text-slate-700'}`}>{value}</dd>
  </div>
);

const SummaryCard: React.FC<{ icon: React.ReactNode; label: string; value: number; sub: string; onClick: () => void }> = ({ icon, label, value, sub, onClick }) => (
  <button type="button" onClick={onClick} className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-soft transition hover:border-medical-200 hover:shadow-lift">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-medical-50 text-medical-700 ring-1 ring-medical-100">{icon}</span>
    <span className="min-w-0">
      <span className="block text-sm font-extrabold text-slate-900">{value} {label}</span>
      <span className="block truncate text-[10px] text-slate-400">{sub}</span>
    </span>
  </button>
);

const OpCard: React.FC<{ icon: React.ReactNode; title: string; status: string; statusClassName: string; detail: string; action: string; onClick: () => void }> = ({ icon, title, status, statusClassName, detail, action, onClick }) => (
  <button type="button" onClick={onClick} className="flex cursor-pointer flex-col rounded-2xl border border-[#E2E8F0] bg-[#F5F8FA] p-4 text-left transition hover:border-[#CDE0EC] hover:bg-[#EDF6FC]">
    <span className="flex items-center gap-2 text-[#0B1F33]">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-[#1769AA] ring-1 ring-[#E2E8F0]">{icon}</span>
      <span className="text-xs font-extrabold">{title}</span>
    </span>
    <span className={`mt-3 inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClassName}`}>{status}</span>
    <span className="mt-1.5 text-[11px] text-[#607080]">{detail}</span>
    <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#1769AA]">{action} <ArrowRight className="h-3 w-3" /></span>
  </button>
);
