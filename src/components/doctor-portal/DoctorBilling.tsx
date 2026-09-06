import React, { useMemo, useState } from 'react';
import { Download, Printer, IndianRupee, TrendingUp } from 'lucide-react';
import { useClinicalWorkspace } from './doctorClinicalData';

type Range = 'today' | 'week' | 'month' | 'custom';

export const DoctorBilling: React.FC = () => {
  const { billing, patients, selectedPatientId, selectPatient, addBilling, updateBillingStatus } = useClinicalWorkspace();
  const [range, setRange] = useState<Range>('month');
  const [charge, setCharge] = useState(800);
  const today = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => {
    if (range === 'today') return billing.filter((b) => b.date === today || b.date.includes(new Date().getDate().toString().padStart(2, '0')));
    return billing;
  }, [billing, range, today]);

  const gross = filtered.reduce((s, b) => s + b.amount, 0);
  const pending = filtered.filter((b) => b.status === 'pending');
  const paid = filtered.filter((b) => b.status === 'paid');
  const platformFee = Math.round(gross * 0.08);
  const facilityShare = Math.round(gross * 0.12);
  const net = Math.max(0, paid.reduce((s, b) => s + b.amount, 0) - Math.round(paid.reduce((s, b) => s + b.amount, 0) * 0.2));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Billing & Earnings</h2>
          <p className="text-xs text-[#607086]">Authorized financial information only. Export is permission-controlled.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['today', 'week', 'month', 'custom'] as Range[]).map((r) => (
            <button key={r} type="button" onClick={() => setRange(r)} className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${range === r ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-white text-[#607086] ring-1 ring-[#E3E8EF]'}`}>{r === 'today' ? 'Today' : r === 'week' ? 'This week' : r === 'month' ? 'This month' : 'Custom'}</button>
          ))}
          <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3.5 py-2 text-xs font-bold text-[#607086] hover:bg-slate-50"><Download className="h-3.5 w-3.5" /> Export</button>
        </div>
      </div>

      {selectedPatientId && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 px-4 py-3">
          <p className="text-xs font-bold text-emerald-900">Charge the selected patient — {patients.find((p) => p.id === selectedPatientId)?.name}</p>
          <div className="flex items-center gap-2">
            <input type="number" value={charge} onChange={(e) => setCharge(Number(e.target.value))} className="w-24 rounded-xl border px-2 py-1.5 text-xs font-bold" />
            <button
              type="button"
              onClick={() => {
                const p = patients.find((x) => x.id === selectedPatientId);
                if (!p) return;
                addBilling({ patientId: p.id, patientName: p.name, service: 'Consultation', date: today, amount: charge, status: 'pending' });
              }}
              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
            >
              Post charge
            </button>
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi label="Today's Revenue" value={`₹${billing.filter((b) => b.date === today).reduce((s, b) => s + b.amount, 0)}`} sub="today" icon={<IndianRupee className="h-4 w-4" />} />
        <Kpi label="This Month" value={`₹${gross}`} sub={`${filtered.length} txns`} icon={<TrendingUp className="h-4 w-4" />} />
        <Kpi label="Pending" value={`₹${pending.reduce((s, b) => s + b.amount, 0)}`} sub={`${pending.length} pending`} />
        <Kpi label="Paid" value={`₹${paid.reduce((s, b) => s + b.amount, 0)}`} sub={`${paid.length} settled`} />
        <Kpi label="Outstanding" value={`₹${pending.reduce((s, b) => s + b.amount, 0)}`} sub="awaiting collection" />
      </div>

      <section className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
        <h3 className="text-sm font-extrabold text-[#162235]">Earnings breakdown</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4 text-xs">
          <Box k="Gross" v={`₹${gross}`} />
          <Box k="Platform fee" v={`− ₹${platformFee}`} />
          <Box k="Facility share" v={`− ₹${facilityShare}`} />
          <Box k="Net earnings" v={`₹${net}`} accent />
        </div>
      </section>

      <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-slate-50/80"><tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="px-4 py-3">Date</th><th className="px-3 py-3">Patient</th><th className="px-3 py-3">Service</th><th className="px-3 py-3 text-right">Amount</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-slate-50">
                <td className="px-4 py-3">{b.date}</td>
                <td className="px-3 py-3 font-bold text-[#162235]">{b.patientName}</td>
                <td className="px-3 py-3 text-[#607086]">{b.service}</td>
                <td className="px-3 py-3 text-right font-bold text-[#162235]">₹{b.amount}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${b.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : b.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{b.status}</span></td>
                <td className="px-3 py-3 text-right">
                  <button type="button" onClick={() => selectPatient(b.patientId)} className="mr-1 rounded-lg border border-[#E3E8EF] px-2.5 py-1.5 text-[10px] font-bold text-[#607086]"><Printer className="mr-1 inline h-3 w-3" />Invoice</button>
                  {b.status === 'pending' && <button type="button" onClick={() => updateBillingStatus(b.id, 'paid')} className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white">Mark paid</button>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-xs text-slate-400">No transactions in this range.</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const Kpi: React.FC<{ label: string; value: string; sub: string; icon?: React.ReactNode }> = ({ label, value, sub, icon }) => (
  <div className="rounded-2xl border border-[#E3E8EF] bg-white p-4 shadow-soft">
    <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p>{icon && <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#0B1F3A] text-white">{icon}</span>}</div>
    <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#162235]">{value}</p>
    <p className="text-[11px] text-[#607086]">{sub}</p>
  </div>
);
const Box: React.FC<{ k: string; v: string; accent?: boolean }> = ({ k, v, accent }) => (
  <div className={`rounded-xl border p-3 ${accent ? 'border-emerald-200 bg-emerald-50' : 'border-[#E3E8EF] bg-slate-50/60'}`}>
    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{k}</p>
    <p className={`mt-1 text-lg font-extrabold ${accent ? 'text-emerald-800' : 'text-[#162235]'}`}>{v}</p>
  </div>
);
