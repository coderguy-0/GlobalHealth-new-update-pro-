import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  AlertCircle,
  Pill,
  Users
} from 'lucide-react';

export const AnalyticsReportsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white">Dispensary Operations & Quality Analytics</h2>
          <p className="text-xs text-slate-400">
            Real-time fulfillment metrics, prescription SLA compliance, return ratios, and customer ratings.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
          ✓ NABH & CDSCO Tier-1 Benchmark
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Prescription SLA (&lt;15m)</div>
          <div className="text-2xl font-black text-emerald-400">98.6%</div>
          <div className="text-[10px] text-slate-400">Avg review: 7 mins</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">On-Time Dispatch Rate</div>
          <div className="text-2xl font-black text-teal-300">99.2%</div>
          <div className="text-[10px] text-slate-400">Express delivery 2-hr target</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Order Cancellation Rate</div>
          <div className="text-2xl font-black text-emerald-400">0.4%</div>
          <div className="text-[10px] text-slate-400">Industry avg: 3.2%</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Patient Trust Score</div>
          <div className="text-2xl font-black text-amber-300">4.9 / 5.0</div>
          <div className="text-[10px] text-slate-400">1,420 Verified Reviews</div>
        </div>
      </div>

      {/* Analytics Breakdown Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Dispensed Formulations */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Top Dispensed Formulations (This Month)
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Augmentin 625 Duo Tablet</span>
                <span className="font-mono font-bold text-teal-300">420 packs (₹83,160)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full w-[85%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Telma 40mg Tablet</span>
                <span className="font-mono font-bold text-teal-300">310 packs (₹75,950)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full w-[70%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Lantus Solostar 100IU/ml Insulin</span>
                <span className="font-mono font-bold text-cyan-300">92 pens (₹57,040)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full w-[55%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Pan-D Capsule</span>
                <span className="font-mono font-bold text-teal-300">280 packs (₹52,080)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full w-[50%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Prescription Verification Compliance */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Clinical Quality & Audit Indicators
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white">Pharmacist Digital Signatures</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">100% Compliant</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white">Cold Chain Data-Logger Compliance</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">100% Validated (2-8°C)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white">Schedule H1 Monitored Register</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">Up to Date</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-white">Near-Expiry Quarantine Disposal</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">0 Expired Units Dispensed</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
