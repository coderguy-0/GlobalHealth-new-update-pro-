import React, { useMemo } from 'react';
import { Download, Printer, IndianRupee, TrendingUp } from 'lucide-react';
import { useClinicalWorkspace } from './doctorClinicalData';

export const DoctorBilling: React.FC = () => {
  const { billing } = useClinicalWorkspace();
  const today = new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  const todays = billing.filter((b) => b.date === today);
  const todayTotal = todays.reduce((s, b) => s + b.amount, 0);
  const pending = billing.filter((b) => b.status === 'pending');
  const totals = useMemo(() => ({
    paid: billing.filter((b) => b.status === 'paid').reduce((s, b) => s + b.amount, 0),
    pending: pending.reduce((s, b) => s + b.amount, 0),
  }), [billing]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Billing & Payments</h2><p className="text-xs text-[#607086]">Consultation and service payments where applicable.</p></div>
        <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-[#E3E8EF] bg-white px-3.5 py-2 text-xs font-bold text-[#607086] hover:bg-slate-50"><Download className="h-3.5 w-3.5" /> Download statement</button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Kpi label="Today's earnings" value={`₹${todayTotal}`} sub={`${todays.length} transactions`} icon={<IndianRupee className="h-4 w-4" />} />
        <Kpi label="Pending payments" value={`₹${totals.pending}`} sub={`${pending.length} pending`} icon={<TrendingUp className="h-4 w-4" />} />
        <Kpi label="Completed payments" value={`₹${totals.paid}`} sub="All time" icon={<IndianRupee className="h-4 w-4" />} />
      </div>

      <section className="overflow-x-auto rounded-2xl border border-[#E3E8EF] bg-white shadow-soft">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="bg-slate-50/80"><tr className="border-b border-[#E3E8EF] text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]"><th className="px-4 py-3">Date</th><th className="px-3 py-3">Patient</th><th className="px-3 py-3">Service</th><th className="px-3 py-3 text-right">Amount</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-right">Action</th></tr></thead>
          <tbody>
            {billing.map((b) => (
              <tr key={b.id} className="border-b border-slate-50">
                <td className="px-4 py-3">{b.date}</td>
                <td className="px-3 py-3 font-bold text-[#162235]">{b.patientName}</td>
                <td className="px-3 py-3 text-[#607086]">{b.service}</td>
                <td className="px-3 py-3 text-right font-bold text-[#162235]">₹{b.amount}</td>
                <td className="px-3 py-3"><span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${b.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : b.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{b.status}</span></td>
                <td className="px-3 py-3 text-right"><button type="button" className="rounded-lg border border-[#E3E8EF] px-2.5 py-1.5 text-[10px] font-bold text-[#607086]"><Printer className="mr-1 inline h-3 w-3" />Invoice</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const Kpi: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode }> = ({ label, value, sub, icon }) => (
  <div className="rounded-2xl border border-[#E3E8EF] bg-white p-5 shadow-soft">
    <div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wider text-[#8A97A8]">{label}</p><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#0B1F3A] text-white">{icon}</span></div>
    <p className="mt-2 text-2xl font-extrabold tracking-tight text-[#162235]">{value}</p>
    <p className="text-[11px] text-[#607086]">{sub}</p>
  </div>
);
