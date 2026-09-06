import React, { useMemo } from 'react';
import { BarChart3, History, ScrollText, Info } from 'lucide-react';
import { useHospitalPortal } from './hospitalPortalData';

interface HospitalInsightsProps {
  section: 'analytics' | 'activity' | 'audit';
}

const cardCls = 'rounded-2xl border border-slate-200 bg-white p-5 shadow-soft';

export const HospitalInsights: React.FC<HospitalInsightsProps> = ({ section }) => {
  if (section === 'activity') return <ActivityView />;
  if (section === 'audit') return <AuditView />;
  return <AnalyticsView />;
};

/* ---------------- Analytics (§64–66) ---------------- */

const AnalyticsView: React.FC = () => {
  const { organization, appointments, doctors, services } = useHospitalPortal();
  const scopedAppts = appointments.filter((a) => a.hospitalId === organization.id);
  const today = new Date().toISOString().slice(0, 10);
  const last30 = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const fromIso = from.toISOString().slice(0, 10);
    return scopedAppts.filter((a) => a.date >= fromIso && a.date <= today);
  }, [scopedAppts, today]);

  // Public-discovery metrics are only shown when tracking actually exists.
  const tracked = false;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Analytics</h2>
        <p className="text-xs text-slate-500">Aggregate only — no individual patient identities are exposed. Analytics period: last 30 days.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <AnalyticMetric label="Appointment bookings" value={last30.length} sub="last 30 days" />
        <AnalyticMetric label="Completed appointments" value={last30.filter((a) => a.status === 'completed').length} sub={`${Math.round((last30.filter((a) => a.status === 'completed').length / Math.max(1, last30.length)) * 100)}% completion`} />
        <AnalyticMetric label="Cancellations" value={last30.filter((a) => a.status === 'cancelled').length} sub="with audit records" />
        <AnalyticMetric label="No-shows" value={last30.filter((a) => a.status === 'no_show').length} sub="logged" />
      </div>

      <section className={cardCls} aria-labelledby="an-booking">
        <h3 id="an-booking" className="mb-3 text-sm font-extrabold text-slate-900">Booking sources (last 30 days)</h3>
        {last30.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-center text-xs text-slate-400">No appointments in the analytics period.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(['public', 'portal', 'walk_in'] as const).map((src) => {
              const count = last30.filter((a) => a.bookingSource === src).length;
              const pct = Math.round((count / last30.length) * 100);
              return (
                <span key={src} className="rounded-xl border border-medical-100 bg-medical-50 px-3 py-2 text-xs font-bold text-medical-800">
                  {src.replace('_', ' ')} · {count} ({pct}%)
                </span>
              );
            })}
          </div>
        )}
        <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
          <Info className="h-3.5 w-3.5 text-medical-500" /> Metrics are computed from your authorized appointment records only — no fabricated numbers.
        </p>
      </section>

      <section className={cardCls} aria-labelledby="an-public">
        <h3 id="an-public" className="mb-2 text-sm font-extrabold text-slate-900">How users find your hospital</h3>
        {tracked ? (
          <p className="text-xs text-slate-500">Search impressions, map appearances, profile views and website clicks are shown here.</p>
        ) : (
          <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
            Public-discovery metrics (profile views, search impressions, map appearances, website clicks) are <strong>not available</strong> —
            tracking is not enabled for this portal yet. No numbers are fabricated.
          </p>
        )}
        <p className="mt-2 text-[10px] text-slate-400">{doctors.filter((d) => d.hospitalId === organization.id).length} doctors · {services.filter((s) => s.hospitalId === organization.id && s.status === 'active').length} services in the public profile.</p>
      </section>
    </div>
  );
};

const AnalyticMetric: React.FC<{ label: string; value: number; sub: string }> = ({ label, value, sub }) => (
  <div className={cardCls}>
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="mt-1 text-2xl font-extrabold text-slate-900">{value}</p>
    <p className="text-[10px] text-slate-400">{sub}</p>
  </div>
);

/* ---------------- Activity (§55) ---------------- */

const ActivityView: React.FC = () => {
  const { activityEvents } = useHospitalPortal();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Activity</h2>
        <p className="text-xs text-slate-500">Who did what, when — with sensitive details minimized by role.</p>
      </div>
      <section className={cardCls} aria-labelledby="act-list">
        <h3 id="act-list" className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900"><History className="h-4 w-4 text-medical-600" /> Recent activity</h3>
        <ul className="space-y-2">
          {activityEvents.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">{e.what}</p>
                <p className="text-[10px] text-slate-400">{e.who}</p>
              </div>
              <span className="shrink-0 text-[10px] font-semibold text-slate-400">{e.when}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

/* ---------------- Audit log (§56) ---------------- */

const AuditView: React.FC = () => {
  const { auditEvents } = useHospitalPortal();
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Audit Log</h2>
        <p className="text-xs text-slate-500">Append-oriented, protected from ordinary users — entries cannot be edited or deleted.</p>
      </div>
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
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
                  <td className="px-4 py-2.5 text-slate-600">{e.resourceType} · {e.resourceId}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">{e.ip} · {e.location}</td>
                  <td className="whitespace-nowrap px-4 py-2.5">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      e.outcome === 'success' ? 'bg-emerald-50 text-emerald-700' : e.outcome === 'denied' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-800'
                    }`}>{e.outcome}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="flex items-center gap-1.5 text-[11px] text-slate-400"><ScrollText className="h-3.5 w-3.5 text-medical-500" /> Audit records are written server-side; the UI cannot alter them.</p>
    </div>
  );
};
