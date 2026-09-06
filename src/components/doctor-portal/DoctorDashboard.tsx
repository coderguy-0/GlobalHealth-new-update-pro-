import React from 'react';
import {
  AlertTriangle, ShieldCheck, Clock3, CalendarClock, BadgeCheck, ArrowRight, FileText,
  Building2, CalendarDays, UserRound, CheckCircle2, Info, Users, ClipboardList, FlaskConical, Activity
} from 'lucide-react';
import { useDoctorPortal, WorkspaceView, CONSULTATION_LABEL, STATUS_LABEL, FACILITIES } from './doctorPortalData';
import { useClinicalWorkspace } from './doctorClinicalData';

export const DoctorDashboard: React.FC<{ onNavigate: (v: WorkspaceView) => void }> = ({ onNavigate }) => {
  const { doctor, activeFacilityId, appointments, availability, credentials, affiliations } = useDoctorPortal();
  const { patients } = useClinicalWorkspace();
  const pendingLabs = patients.flatMap((p) => p.labs).filter((l) => l.status === 'available').length;
  const pendingRx = patients.flatMap((p) => p.prescriptions).filter((r) => r.status === 'draft').length;
  const followUps = patients.filter((p) => p.status === 'follow_up').length;
  const waiting = patients.filter((p) => p.status === 'critical' || p.status === 'pending_review').length;
  const today = new Date().toISOString().slice(0, 10);
  const facility = FACILITIES.find((f) => f.id === activeFacilityId);

  const todays = appointments
    .filter((a) => a.date === today && a.facilityId === activeFacilityId)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const upcoming = appointments
    .filter((a) => a.date > today && (a.status === 'confirmed' || a.status === 'pending') && a.facilityId === activeFacilityId)
    .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime))
    .slice(0, 3);
  const nextAppointment = todays.find((a) => a.status === 'confirmed' || a.status === 'pending');

  const expiringCredential = credentials.find((c) => c.status === 'expiring_soon' || c.status === 'expired');
  const pendingAffiliation = affiliations.find((a) => a.status === 'requested' || a.status === 'pending');
  const incompleteAvailability = availability.filter((r) => r.facilityId === activeFacilityId && r.status === 'active').length === 0;

  const tasks: { label: string; detail: string; action?: WorkspaceView }[] = [];
  if (doctor.verificationStatus !== 'verified') {
    tasks.push({ label: doctor.verificationStatus === 'not_started' ? 'Complete credential verification' : 'Verification in progress', detail: doctor.verificationNextAction || 'Submit your credentials to complete verification.', action: 'credentials' });
  }
  if (expiringCredential) tasks.push({ label: expiringCredential.status === 'expired' ? 'Credential expired' : 'Credential expires soon', detail: expiringCredential.title, action: 'credentials' });
  if (pendingAffiliation) tasks.push({ label: 'Confirm facility affiliation', detail: `${FACILITIES.find((f) => f.id === pendingAffiliation.facilityId)?.name} — ${pendingAffiliation.status}`, action: 'affiliations' });
  if (incompleteAvailability) tasks.push({ label: 'Update availability', detail: `No active schedule for ${facility?.name}`, action: 'availability' });
  if (doctor.missingProfileFields.length) tasks.push({ label: 'Complete public profile', detail: doctor.missingProfileFields[0], action: 'profile' });
  if (todays.some((a) => a.status === 'pending')) tasks.push({ label: 'Review appointment', detail: 'Appointments are waiting for confirmation.', action: 'appointments' });

  return (
    <div className="space-y-5">
      {/* 1 — Security / verification alert */}
      {doctor.verificationStatus !== 'verified' ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700"><AlertTriangle className="h-5 w-5" /></span>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">Verification {doctor.verificationStatus === 'not_started' ? 'not started' : 'in progress'}</p>
            <p className="text-xs text-amber-800/90">{doctor.verificationNextAction || 'Submit your professional credentials to activate your public profile.'}</p>
          </div>
          <button type="button" onClick={() => onNavigate('credentials')} className="cursor-pointer rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-amber-700">
            Complete Verification
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><BadgeCheck className="h-5 w-5" /></span>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-900">Verification complete</p>
            <p className="text-xs text-emerald-800/90">Your public profile may be published. Verify your details before publishing.</p>
          </div>
          <button type="button" onClick={() => onNavigate('profile')} className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700">Review Profile</button>
        </div>
      )}

      {/* Compact clinical KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Today's Appointments" value={String(todays.length)} sub="scheduled" icon={<CalendarClock className="h-4 w-4" />} onClick={() => onNavigate('appointments')} />
        <Kpi label="Waiting / Attention" value={String(waiting)} sub="needs attention" icon={<Users className="h-4 w-4" />} onClick={() => onNavigate('patients')} />
        <Kpi label="Completed" value={String(todays.filter((a) => a.status === 'completed').length)} sub="today" icon={<CheckCircle2 className="h-4 w-4" />} onClick={() => onNavigate('consultations')} />
        <Kpi label="Pending Labs" value={String(pendingLabs)} sub="review required" icon={<FlaskConical className="h-4 w-4" />} onClick={() => onNavigate('labs')} />
        <Kpi label="Rx Requests" value={String(pendingRx)} sub="pending" icon={<ClipboardList className="h-4 w-4" />} onClick={() => onNavigate('prescriptions')} />
        <Kpi label="Follow-ups Due" value={String(followUps)} sub="this week" icon={<Activity className="h-4 w-4" />} onClick={() => onNavigate('patients')} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        {/* Today */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Clock3 className="h-4 w-4 text-medical-600" /> Today</h3>
            <button type="button" onClick={() => onNavigate('appointments')} className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-medical-700 hover:underline">
              View Appointments <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {nextAppointment ? (
            <div className="rounded-2xl border border-medical-100 bg-medical-50/60 p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-medical-700">Next appointment</p>
              <div className="mt-1.5 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-2xl font-extrabold tracking-tight text-slate-900">{nextAppointment.startTime}</p>
                  <p className="text-sm font-bold text-slate-700">{nextAppointment.patientIdentifier} · {CONSULTATION_LABEL[nextAppointment.type]}</p>
                  <p className="text-xs text-slate-500">{facility?.name} · {nextAppointment.department}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                  nextAppointment.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {STATUS_LABEL[nextAppointment.status]}
                </span>
              </div>
              <button type="button" onClick={() => onNavigate('appointments')} className="mt-3 cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-medical-700">Open</button>
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">No upcoming appointment today at {facility?.name}.</p>
          )}

          <div className="mt-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Today's schedule</p>
            {todays.length === 0 ? (
              <p className="text-xs text-slate-400">No appointments scheduled today.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {todays.slice(0, 5).map((a) => (
                  <li key={a.id} className="flex items-center gap-3 py-2">
                    <span className="w-12 shrink-0 text-xs font-extrabold text-slate-800">{a.startTime}</span>
                    <span className="min-w-0 flex-1 truncate text-xs text-slate-600">
                      <span className="font-bold text-slate-800">{a.patientIdentifier}</span> · {CONSULTATION_LABEL[a.type]}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      a.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700'
                      : a.status === 'completed' ? 'bg-slate-100 text-slate-500'
                      : a.status === 'cancelled' ? 'bg-rose-50 text-rose-600'
                      : a.status === 'no_show' ? 'bg-slate-100 text-slate-500'
                      : 'bg-amber-50 text-amber-700'
                    }`}>{STATUS_LABEL[a.status]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Right column */}
        <div className="space-y-5">
          {/* Upcoming */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><CalendarClock className="h-4 w-4 text-medical-600" /> Upcoming</h3>
              <button type="button" onClick={() => onNavigate('calendar')} className="cursor-pointer text-xs font-bold text-medical-700 hover:underline">Calendar</button>
            </div>
            {upcoming.length === 0 ? (
              <p className="text-xs text-slate-400">No upcoming appointments.</p>
            ) : (
              <ul className="space-y-2">
                {upcoming.map((a) => (
                  <li key={a.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{a.date.slice(5)} · {a.startTime}</p>
                      <p className="text-[11px] text-slate-500">{a.patientIdentifier} · {CONSULTATION_LABEL[a.type]}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${a.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{STATUS_LABEL[a.status]}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Availability snapshot */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><CalendarDays className="h-4 w-4 text-medical-600" /> Availability</h3>
              <button type="button" onClick={() => onNavigate('availability')} className="cursor-pointer text-xs font-bold text-medical-700 hover:underline">Manage</button>
            </div>
            <p className="text-xs text-slate-600">
              {facility?.name}:{' '}
              <span className="font-bold text-slate-800">
                {availability.filter((r) => r.facilityId === activeFacilityId && r.status === 'active').length
                  ? `${availability.filter((r) => r.facilityId === activeFacilityId && r.status === 'active').length} active schedule rules`
                  : 'No active schedule'}
              </span>
            </p>
            {incompleteAvailability && (
              <p className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[11px] font-semibold text-amber-800">
                <Info className="h-3 w-3" /> Set working hours to accept bookings.
              </p>
            )}
          </section>
        </div>
      </div>

      {/* Action required */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><ShieldCheck className="h-4 w-4 text-medical-600" /> Action Required</h3>
        {tasks.length === 0 ? (
          <p className="flex items-center gap-2 text-xs text-emerald-700"><CheckCircle2 className="h-4 w-4" /> All caught up. Nothing needs your attention.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {tasks.map((t) => (
              <li key={t.label}>
                <button type="button" onClick={() => t.action && onNavigate(t.action)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-left transition hover:border-medical-200 hover:bg-medical-50">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-medical-600 ring-1 ring-slate-200">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-slate-800">{t.label}</span>
                    <span className="block truncate text-[11px] text-slate-500">{t.detail}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-300" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Profile + quick actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-medical-50 text-medical-700 ring-1 ring-medical-100"><UserRound className="h-5 w-5" /></span>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Profile {doctor.profileCompleteness}% complete</h3>
              <p className="text-xs text-slate-500">{doctor.missingProfileFields.length ? `Missing: ${doctor.missingProfileFields.slice(0, 2).join(' · ')}` : 'Profile is complete.'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => onNavigate('profile')} className="cursor-pointer rounded-xl bg-medical-600 px-4 py-2 text-xs font-bold text-white hover:bg-medical-700">Edit Profile</button>
            <button type="button" onClick={() => onNavigate('availability')} className="cursor-pointer rounded-xl border border-medical-200 bg-white px-4 py-2 text-xs font-bold text-medical-700 hover:bg-medical-50">Update Availability</button>
            <button type="button" onClick={() => onNavigate('affiliations')} className="cursor-pointer rounded-xl border border-medical-200 bg-white px-4 py-2 text-xs font-bold text-medical-700 hover:bg-medical-50">Manage Affiliations</button>
            <button type="button" onClick={() => onNavigate('appointments')} className="cursor-pointer rounded-xl border border-medical-200 bg-white px-4 py-2 text-xs font-bold text-medical-700 hover:bg-medical-50">View Schedule</button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400">
          <Building2 className="h-3.5 w-3.5 text-medical-500" />
          {affiliations.filter((a) => a.status === 'active').length} active affiliation{affiliations.filter((a) => a.status === 'active').length === 1 ? '' : 's'} · Data scoped to {facility?.name}.
        </div>
      </section>
    </div>
  );
};

const Kpi: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode; onClick: () => void }> = ({ label, value, sub, icon, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-2xl border border-[#E3E8EF] bg-white p-4 text-left shadow-soft transition hover:border-[#1769E0]/40 hover:bg-[#1769E0]/5"
  >
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p>
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0B1F3A] text-white">{icon}</span>
    </div>
    <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#162235]">{value}</p>
    <p className="text-[10px] font-semibold text-[#607086]">{sub}</p>
  </button>
);
