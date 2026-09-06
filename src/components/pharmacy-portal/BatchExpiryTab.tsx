import React, { useState } from 'react';
import { 
  CalendarClock, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Archive, 
  Clock, 
  Snowflake,
  Filter
} from 'lucide-react';
import { PortalMedicine } from '../../types/pharmacyPortal';

interface BatchExpiryTabProps {
  medicines: PortalMedicine[];
  onMedicinesUpdated: () => void;
}

export const BatchExpiryTab: React.FC<BatchExpiryTabProps> = ({
  medicines,
  onMedicinesUpdated
}) => {
  const [filterBucket, setFilterBucket] = useState<'All' | 'Critical' | 'Upcoming' | 'Safe'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate expiry status for demo:
  // We can tag medicines based on their expiryDate
  const batchList = medicines.map(m => {
    const expDate = new Date(m.expiryDate);
    const now = new Date('2026-08-25');
    const diffMonths = (expDate.getFullYear() - now.getFullYear()) * 12 + (expDate.getMonth() - now.getMonth());

    let expiryCategory: 'Critical' | 'Upcoming' | 'Safe' = 'Safe';
    if (diffMonths <= 6) expiryCategory = 'Critical';
    else if (diffMonths <= 12) expiryCategory = 'Upcoming';

    return {
      ...m,
      diffMonths,
      expiryCategory
    };
  });

  const filteredBatches = batchList.filter(b => {
    const matchesBucket = filterBucket === 'All' || b.expiryCategory === filterBucket;
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBucket && matchesSearch;
  });

  const handleQuarantine = (batchNo: string, medName: string) => {
    alert(`Batch ${batchNo} of ${medName} has been moved to Quarantine Isolation. Dispensary stock locked from public listing.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Zero-Tolerance Expiry Policy</span>
            </div>
            <h2 className="text-base font-black text-white">Batch Lifecycle & Expiry Control Desk</h2>
            <p className="text-xs text-slate-400">
              Track manufacturing batches, isolate near-expiry lots, and record quarantine disposal audits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Batch trace report exported for drug inspector compliance.')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-teal-300 border border-slate-800 text-xs font-bold transition cursor-pointer"
            >
              Export Batch Audit Log
            </button>
          </div>
        </div>

        {/* Filter Buckets */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'All', label: 'All Batches' },
            { id: 'Critical', label: 'Near Expiry (< 6 Months)' },
            { id: 'Upcoming', label: 'Expiring in 6-12 Months' },
            { id: 'Safe', label: 'Healthy (> 12 Months)' }
          ].map(b => (
            <button
              key={b.id}
              onClick={() => setFilterBucket(b.id as any)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                filterBucket === b.id
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-4 font-semibold">Medicine & Brand</th>
                <th className="p-4 font-semibold">Batch Number</th>
                <th className="p-4 font-semibold">Mfg Date</th>
                <th className="p-4 font-semibold">Expiry Date</th>
                <th className="p-4 font-semibold">Shelf Life Status</th>
                <th className="p-4 font-semibold">Quantity</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBatches.map(b => (
                <tr key={b.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-white text-xs">{b.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{b.genericName}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-teal-300">
                    {b.batchNumber}
                  </td>
                  <td className="p-4 text-slate-400 font-mono">
                    {b.manufacturingDate}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {b.expiryDate}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.expiryCategory === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : b.expiryCategory === 'Upcoming'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {b.expiryCategory === 'Critical' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                      {b.expiryCategory === 'Upcoming' && <Clock className="w-3 h-3 text-amber-400" />}
                      {b.expiryCategory === 'Safe' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      <span>{b.expiryCategory === 'Critical' ? 'Urgent Attention' : b.expiryCategory === 'Upcoming' ? 'Monitor Expiry' : 'Valid'}</span>
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {b.stockQuantity} units
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleQuarantine(b.batchNumber, b.name)}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-slate-700 hover:border-rose-500/40 font-bold text-xs transition cursor-pointer"
                    >
                      Quarantine
                    </button>
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
