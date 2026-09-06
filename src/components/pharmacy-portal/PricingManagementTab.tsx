import React, { useState } from 'react';
import { 
  DollarSign, 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  Tag, 
  Percent, 
  AlertCircle, 
  Save, 
  Layers 
} from 'lucide-react';
import { PortalMedicine } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';
import { PharmacyFeeConfigurationPanel } from './PharmacyFeeConfigurationPanel';

interface PricingManagementTabProps {
  medicines?: PortalMedicine[];
  onMedicinesUpdated?: () => void;
}

export const PricingManagementTab: React.FC<PricingManagementTabProps> = ({
  medicines = [],
  onMedicinesUpdated
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editedPrices, setEditedPrices] = useState<{ [id: string]: number }>({});
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [activeSection, setActiveSection] = useState<'prices' | 'fees'>('prices');

  const filteredMedicines = (medicines || []).filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePriceChange = (id: string, newPrice: number) => {
    setEditedPrices(prev => ({ ...prev, [id]: newPrice }));
  };

  const handleSaveAll = () => {
    Object.entries(editedPrices).forEach(([id, price]) => {
      PharmacyPortalService.updateMedicine(id, { sellingPrice: Number(price) });
    });
    setEditedPrices({});
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
    onMedicinesUpdated?.();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white">Dispensary Pricing & Profit Margin Desk</h2>
            <p className="text-xs text-slate-400">
              Configure patient selling prices, set minimum price floors, and maintain statutory DPCO drug compliance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl bg-slate-950 border border-slate-800 p-1">
              <button onClick={() => setActiveSection('prices')} className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${activeSection === 'prices' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'}`}>
                Product Prices
              </button>
              <button onClick={() => setActiveSection('fees')} className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${activeSection === 'fees' ? 'bg-teal-500/20 text-teal-300' : 'text-slate-400'}`}>
                Platform Fees
              </button>
            </div>
            {activeSection === 'prices' && (
              <button
                onClick={handleSaveAll}
                disabled={Object.keys(editedPrices).length === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition disabled:opacity-40 cursor-pointer shadow-md shadow-teal-950/50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Modified Prices ({Object.keys(editedPrices).length})</span>
              </button>
            )}
          </div>
        </div>

        {isSavedToast && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Prices successfully updated and synchronized across all active branches.</span>
          </div>
        )}

        {activeSection === 'prices' && (
          <div className="relative text-xs">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicine to adjust price..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>
        )}
      </div>

      {activeSection === 'fees' && <PharmacyFeeConfigurationPanel onConfigUpdated={() => undefined} />}

      {activeSection === 'prices' && (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-4 font-semibold">Medicine Formulation</th>
                <th className="p-4 font-semibold">Purchase Cost</th>
                <th className="p-4 font-semibold">Statutory MRP</th>
                <th className="p-4 font-semibold">Min Floor Price</th>
                <th className="p-4 font-semibold">Platform Selling Price</th>
                <th className="p-4 font-semibold">Dispensary Margin</th>
                <th className="p-4 font-semibold">GST Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMedicines.map(med => {
                const currentSelling = editedPrices[med.id] !== undefined ? editedPrices[med.id] : med.sellingPrice;
                const margin = currentSelling - med.purchaseCost;
                const marginPct = Math.round((margin / currentSelling) * 100);

                return (
                  <tr key={med.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="font-bold text-white text-xs">{med.name}</div>
                      <div className="text-[10px] text-teal-400 font-mono">{med.sku}</div>
                    </td>

                    <td className="p-4 font-mono text-slate-300">
                      ₹{med.purchaseCost}
                    </td>

                    <td className="p-4 font-mono text-slate-400">
                      ₹{med.mrp}
                    </td>

                    <td className="p-4 font-mono text-amber-300">
                      ₹{med.minAllowedPrice || Math.round(med.purchaseCost * 1.1)}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-slate-400">₹</span>
                        <input
                          type="number"
                          value={currentSelling}
                          onChange={(e) => handlePriceChange(med.id, parseFloat(e.target.value) || med.purchaseCost)}
                          className="w-20 rounded-lg bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                        />
                      </div>
                    </td>

                    <td className="p-4 font-mono">
                      <span className={`font-bold ${marginPct > 15 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        +₹{margin} ({marginPct}%)
                      </span>
                    </td>

                    <td className="p-4 font-mono text-slate-400">
                      {med.taxRatePercent}% GST
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

    </div>
  );
};
