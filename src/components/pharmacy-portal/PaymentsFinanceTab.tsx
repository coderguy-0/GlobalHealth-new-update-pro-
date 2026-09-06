import React from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Download, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText,
  TrendingUp 
} from 'lucide-react';
import { SettlementLedgerItem } from '../../types/pharmacyPortal';

interface PaymentsFinanceTabProps {
  settlements: SettlementLedgerItem[];
}

export const PaymentsFinanceTab: React.FC<PaymentsFinanceTabProps> = ({ settlements }) => {
  return (
    <div className="space-y-6">
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Total Net Settled (August)</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">₹1,45,770</div>
          <div className="text-[10px] text-emerald-400 font-bold">100% On-Time T+1 Settlement</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Platform Commission (5%)</div>
          <div className="text-2xl font-black text-slate-300 font-mono">₹8,207</div>
          <div className="text-[10px] text-slate-400">Includes secure payment gateway</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Statutory GST TDS (1%)</div>
          <div className="text-2xl font-black text-slate-300 font-mono">₹1,641</div>
          <div className="text-[10px] text-teal-400">Form 16A Auto-generated</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Next Payout Cycle</div>
          <div className="text-2xl font-black text-teal-300 font-mono">Tomorrow 06:00 AM</div>
          <div className="text-[10px] text-teal-400 font-bold">Direct NEFT to HDFC Bank</div>
        </div>
      </div>

      {/* Verified Bank Account Box */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">HDFC Bank Ltd • Current A/C ending in ...2834</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Penny-Drop Verified
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono">IFSC: HDFC0000043 • South Extension Branch, New Delhi</div>
          </div>
        </div>

        <button
          onClick={() => alert('Download monthly reconciliation statement requested.')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download GST Report</span>
        </button>
      </div>

      {/* Settlements Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Settlement & Payout Ledger</h3>
          <span className="text-[10px] text-slate-400 font-mono">Daily T+1 Automated Clearance</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/30">
                <th className="p-4 font-semibold">Payout ID</th>
                <th className="p-4 font-semibold">Settlement Date</th>
                <th className="p-4 font-semibold">Orders Count</th>
                <th className="p-4 font-semibold">Gross Medicine Sales</th>
                <th className="p-4 font-semibold">Platform Fee (5%)</th>
                <th className="p-4 font-semibold">GST TDS (1%)</th>
                <th className="p-4 font-semibold">Net Bank Transfer</th>
                <th className="p-4 font-semibold">Bank UTR Reference</th>
                <th className="p-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {settlements.map(s => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-bold text-teal-300">{s.payoutId}</td>
                  <td className="p-4 text-slate-300">{s.date}</td>
                  <td className="p-4 text-white font-bold">{s.ordersCount}</td>
                  <td className="p-4 text-white">₹{s.grossSales.toLocaleString()}</td>
                  <td className="p-4 text-slate-400">-₹{s.platformCommission}</td>
                  <td className="p-4 text-slate-400">-₹{s.gstTds}</td>
                  <td className="p-4 text-emerald-400 font-bold text-sm">
                    ₹{s.netPayoutAmount.toLocaleString()}
                  </td>
                  <td className="p-4 text-slate-400 text-[11px]">{s.bankReferenceNumber}</td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{s.payoutStatus}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
