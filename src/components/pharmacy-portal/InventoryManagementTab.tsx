import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Upload, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Layers,
  X
} from 'lucide-react';
import { PortalMedicine } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface InventoryManagementTabProps {
  medicines: PortalMedicine[];
  onMedicinesUpdated: () => void;
  openAdjustModalInitially?: boolean;
}

export const InventoryManagementTab: React.FC<InventoryManagementTabProps> = ({
  medicines,
  onMedicinesUpdated,
  openAdjustModalInitially = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [adjustModalMed, setAdjustModalMed] = useState<PortalMedicine | null>(
    openAdjustModalInitially ? medicines[0] : null
  );
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('Stock Receipt from Wholesaler');

  const filteredMedicines = medicines.filter(m => {
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenAdjust = (med: PortalMedicine) => {
    setAdjustModalMed(med);
    setNewQuantity(med.stockQuantity);
    setAdjustmentReason('Stock Receipt from Wholesaler');
  };

  const handleSaveAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustModalMed) return;

    PharmacyPortalService.adjustStock(adjustModalMed.id, newQuantity, adjustmentReason);
    setAdjustModalMed(null);
    onMedicinesUpdated();
  };

  const totalStockCount = medicines.reduce((acc, m) => acc + m.stockQuantity, 0);
  const totalReservedCount = medicines.reduce((acc, m) => acc + (m.reservedStock || 0), 0);
  const lowStockCount = medicines.filter(m => m.status === 'Low Stock').length;

  return (
    <div className="space-y-6">
      
      {/* Top Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Total Stock In-Hand</div>
          <div className="text-2xl font-black text-white font-mono">{totalStockCount.toLocaleString()}</div>
          <div className="text-[10px] text-teal-400 font-bold">Live synchronized</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Reserved for Open Orders</div>
          <div className="text-2xl font-black text-amber-300 font-mono">{totalReservedCount.toLocaleString()}</div>
          <div className="text-[10px] text-amber-400 font-bold">Locked in fulfillment</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Low Stock SKUs</div>
          <div className="text-2xl font-black text-rose-400 font-mono">{lowStockCount}</div>
          <div className="text-[10px] text-rose-400 font-bold">Below safety threshold</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Dispensary Valuation</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">₹4,82,400</div>
          <div className="text-[10px] text-slate-400">Purchase cost basis</div>
        </div>
      </div>

      {/* Control Strip */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white">Stock Level Monitoring & Audit Adjustments</h2>
            <p className="text-xs text-slate-400">Track physical dispensary units vs platform reserved allocations.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Stock ledger exported as CSV report.')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          <div className="sm:col-span-8 relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine name, SKU, or batch number..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Stock Statuses</option>
              <option value="In Stock">In Stock (Healthy)</option>
              <option value="Low Stock">Low Stock Alert</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-4 font-semibold">Medicine SKU</th>
                <th className="p-4 font-semibold">Form & Pack</th>
                <th className="p-4 font-semibold">Current Physical Stock</th>
                <th className="p-4 font-semibold">Reserved (In Orders)</th>
                <th className="p-4 font-semibold">Available for Sale</th>
                <th className="p-4 font-semibold">Safety Min</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMedicines.map(med => (
                <tr key={med.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <div className="font-bold text-white text-xs">{med.name}</div>
                    <div className="text-[10px] text-teal-400 font-mono">{med.sku} • Batch {med.batchNumber}</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{med.dosageForm}</div>
                    <div className="text-[10px] text-slate-500">{med.packSize}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white text-sm">
                    {med.stockQuantity}
                  </td>
                  <td className="p-4 font-mono text-amber-300">
                    {med.reservedStock || 0}
                  </td>
                  <td className="p-4 font-mono text-teal-300 font-bold">
                    {med.availableStock}
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {med.minStockLevel}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      med.status === 'In Stock'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : med.status === 'Low Stock'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {med.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenAdjust(med)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs transition cursor-pointer"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModalMed && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400">Stock Count Adjustment</span>
                <h3 className="text-base font-black text-white">{adjustModalMed.name}</h3>
              </div>
              <button
                onClick={() => setAdjustModalMed(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Current Physical Stock:</span>
                  <span className="font-mono text-white font-bold">{adjustModalMed.stockQuantity} units</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Current Reserved in Orders:</span>
                  <span className="font-mono text-amber-300">{adjustModalMed.reservedStock || 0} units</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Batch Number:</span>
                  <span className="font-mono text-teal-300">{adjustModalMed.batchNumber}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">New Physical Count (Units) *</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Adjustment Reason *</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Stock Receipt from Wholesaler">Stock Receipt from Wholesaler</option>
                  <option value="Physical Stock Audit Reconciliation">Physical Stock Audit Reconciliation</option>
                  <option value="Damaged / Broken Vial Write-Off">Damaged / Broken Vial Write-Off</option>
                  <option value="Quarantine Expired Units">Quarantine Expired Units</option>
                  <option value="Customer Return Restock">Customer Return Restock</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalMed(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-teal-950/50"
                >
                  Save Stock Adjustment
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
