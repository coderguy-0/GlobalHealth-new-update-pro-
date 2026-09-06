import React from 'react';
import { 
  ShoppingBag, 
  FileCheck2, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Star, 
  Plus, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  FileText,
  Building2,
  RefreshCw
} from 'lucide-react';
import { PortalOrderRecord, PortalPrescriptionRecord, PortalMedicine, PharmacyBranchInfo } from '../../types/pharmacyPortal';

interface DashboardHomeTabProps {
  orders?: PortalOrderRecord[];
  prescriptions?: PortalPrescriptionRecord[];
  medicines?: PortalMedicine[];
  branches?: PharmacyBranchInfo[];
  currentBranchId?: string;
  profile?: any;
  onNavigateTab?: (tabId: string) => void;
  onQuickAction?: (actionId: string) => void;
  onSelectOrder?: (order: PortalOrderRecord) => void;
  onSelectRx?: (rx: PortalPrescriptionRecord) => void;
  onSelectPrescription?: (rx: PortalPrescriptionRecord) => void;
  onOpenAddMedicine?: () => void;
  onOpenAdjustStock?: () => void;
}

export const DashboardHomeTab: React.FC<DashboardHomeTabProps> = ({
  orders = [],
  prescriptions = [],
  medicines = [],
  branches = [],
  currentBranchId,
  profile,
  onNavigateTab,
  onQuickAction,
  onSelectOrder,
  onSelectRx,
  onSelectPrescription,
  onOpenAddMedicine,
  onOpenAdjustStock
}) => {
  const navigate = (tabId: string) => {
    if (onNavigateTab) onNavigateTab(tabId);
    else if (onQuickAction) onQuickAction(tabId);
  };

  const handleSelectPrescription = (rx: PortalPrescriptionRecord) => {
    if (onSelectRx) onSelectRx(rx);
    else if (onSelectPrescription) onSelectPrescription(rx);
  };

  const handleOpenAddMed = () => {
    if (onOpenAddMedicine) onOpenAddMedicine();
    else if (onQuickAction) onQuickAction('add-medicine');
    else if (onNavigateTab) onNavigateTab('catalog');
  };

  const handleOpenStock = () => {
    if (onOpenAdjustStock) onOpenAdjustStock();
    else if (onQuickAction) onQuickAction('adjust-stock');
    else if (onNavigateTab) onNavigateTab('inventory');
  };

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'Awaiting Review' || p.status === 'Under Review');
  const awaitingFulfillment = orders.filter(o => o.orderStatus === 'New' || o.orderStatus === 'Confirmed' || o.orderStatus === 'Preparing');
  const lowStockMeds = medicines.filter(m => m.status === 'Low Stock');
  const outOfStockMeds = medicines.filter(m => m.status === 'Out of Stock' || m.stockQuantity === 0);

  const today = new Date().toISOString().slice(0, 10);
  const todaysOrders = orders.filter(o => o.createdAt.slice(0, 10) === today);
  const totalOrderValue = orders.reduce((sum, o) => sum + o.grandTotal, 0);
  const pendingOrderCount = orders.filter(o => o.orderStatus === 'New' || o.orderStatus === 'Prescription Review').length;
  const totalMedicinesCount = medicines.length;
  const lowStockCount = lowStockMeds.length;
  const outOfStockCount = outOfStockMeds.length;
  const expiringMedicineCount = medicines.filter(m => m.expiryDate && m.expiryDate < today).length + medicines.filter(m => m.expiryDate && m.expiryDate >= today && m.expiryDate <= new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)).length;
  const pendingRefundCount = orders.filter(o => o.orderStatus === 'Refund Pending').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Alert Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-teal-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Clinical Alert:</strong> {pendingPrescriptions.length} new doctor prescriptions require registered pharmacist verification before dispensing.
          </span>
        </div>
        <button
          onClick={() => navigate('prescriptions')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black transition cursor-pointer text-xs shrink-0"
        >
          <span>Open Prescription Inbox</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Dynamic Operational Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Card 1: Today's Orders */}
        <div 
          onClick={() => navigate('orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Today's Orders</span>
            <ShoppingBag className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">{todaysOrders.length}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
            <TrendingUp className="w-3 h-3" />
            <span>{todaysOrders.length > 0 ? 'Live order data' : 'No orders yet today'}</span>
          </div>
        </div>

        {/* Card 2: Pending Prescriptions */}
        <div 
          onClick={() => navigate('prescriptions')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Prescriptions</span>
            <FileCheck2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {pendingPrescriptions.length}
          </div>
          <div className="text-[11px] text-amber-400/90 font-medium">
            {pendingPrescriptions.length === 0 ? 'Prescription inbox clear' : 'SLA &lt; 15 mins'}
          </div>
        </div>

        {/* Card 3: Orders Awaiting Fulfillment */}
        <div 
          onClick={() => navigate('orders')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Awaiting Fulfillment</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {awaitingFulfillment.length}
          </div>
          <div className="text-[11px] text-blue-400 font-medium">
            {awaitingFulfillment.length === 0 ? 'No orders awaiting dispatch' : 'Ready for packing & dispatch'}
          </div>
        </div>

        {/* Card 4: Today's Revenue */}
        <div 
          onClick={() => navigate('payments')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Today's Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            ₹{totalOrderValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">
            {pendingOrderCount > 0 ? `${pendingOrderCount} new orders awaiting processing` : 'No new orders awaiting processing'}
          </div>
        </div>

      </div>

      {/* Row 2: Stock & Operational Score Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div 
          onClick={() => navigate('inventory')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Low Stock Items</span>
            <Package className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-300">
            {lowStockCount} Items
          </div>
          <p className="text-[11px] text-slate-400">Below safety threshold. Re-order suggested.</p>
        </div>

        <div 
          onClick={() => navigate('inventory')}
          className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/40 transition cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Out of Stock</span>
            <AlertTriangle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xl font-bold text-slate-300">
            {outOfStockCount} Items
          </div>
          <p className="text-[11px] text-slate-400">Hidden from patient search until restocked.</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pharmacy Performance Score</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-teal-300">{profile?.performanceScore ?? 0}%</span>
            <span className="text-xs text-slate-400 font-mono">Rating: {profile?.rating ? profile.rating.toFixed(1) : '—'} / 5.0 ({profile?.ratingCount ? profile.ratingCount.toLocaleString() : 0} Reviews)</span>
          </div>
          <p className="text-[11px] text-emerald-400">Compliance score: {profile?.complianceScore ?? 0}%</p>
        </div>

      </div>

      {/* Inventory alert center (§10) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
          <div>
            <p className="text-slate-400">Catalog medicines</p>
            <p className="mt-1 text-xl font-black text-white">{totalMedicinesCount}</p>
          </div>
          <div>
            <p className="text-slate-400">Expiring within 30 days</p>
            <p className="mt-1 text-xl font-black text-amber-300">{expiringMedicineCount}</p>
          </div>
          <div>
            <p className="text-slate-400">Pending refunds</p>
            <p className="mt-1 text-xl font-black text-rose-300">{pendingRefundCount}</p>
          </div>
          <div>
            <p className="text-slate-400">Low / out of stock</p>
            <p className="mt-1 text-xl font-black text-rose-300">{lowStockCount + outOfStockCount}</p>
          </div>
        </div>
      </div>

      {/* Row 3: Quick Operational Actions */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">
            Dispensary Quick Actions
          </h3>
          <span className="text-[10px] text-slate-500">Fast Operations Desk</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={handleOpenAddMed}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 text-left transition cursor-pointer group"
          >
            <Plus className="w-4 h-4 text-teal-400 mb-1 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white">Add Medicine</div>
            <div className="text-[10px] text-slate-400">New SKU / Catalog</div>
          </button>

          <button
            onClick={handleOpenStock}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-left transition cursor-pointer group"
          >
            <RefreshCw className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white">Update Stock</div>
            <div className="text-[10px] text-slate-400">Adjust / Count</div>
          </button>

          <button
            onClick={() => navigate('prescriptions')}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 text-left transition cursor-pointer group"
          >
            <FileCheck2 className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white">Review Rx</div>
            <div className="text-[10px] text-slate-400">Sign-off Prescriptions</div>
          </button>

          <button
            onClick={() => navigate('orders')}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/40 text-left transition cursor-pointer group"
          >
            <ShoppingBag className="w-4 h-4 text-blue-400 mb-1 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white">Process Orders</div>
            <div className="text-[10px] text-slate-400">Pack & Dispatch</div>
          </button>

          <button
            onClick={() => navigate('documents')}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 text-left transition cursor-pointer group"
          >
            <FileText className="w-4 h-4 text-teal-400 mb-1 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white">Documents</div>
            <div className="text-[10px] text-slate-400">Renew Licenses</div>
          </button>

          <button
            onClick={() => navigate('support')}
            className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 text-left transition cursor-pointer group"
          >
            <HelpCircle className="w-4 h-4 text-teal-400 mb-1 group-hover:scale-110 transition" />
            <div className="text-xs font-bold text-white">Help Desk</div>
            <div className="text-[10px] text-slate-400">Compliance Support</div>
          </button>
        </div>
      </div>

      {/* Row 4: Recent Orders Feed */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Live Medicine Orders</h3>
            <p className="text-xs text-slate-400">Fulfillment orders synchronized from GlobalHealth patient app</p>
          </div>
          <button
            onClick={() => navigate('orders')}
            className="text-xs font-bold text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          {orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/40 p-8 text-center">
              <p className="text-sm font-bold text-slate-200">No orders yet</p>
              <p className="mt-1 text-xs text-slate-400">Orders from GlobalHealth customers will appear here.</p>
            </div>
          )}
          {orders.length > 0 && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Time</th>
                <th className="pb-3 font-semibold">Patient / Customer</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Grand Total</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 font-mono font-bold text-teal-300">{o.orderNumber}</td>
                  <td className="py-3 text-slate-400">{o.createdAt}</td>
                  <td className="py-3 font-medium text-white">
                    {o.customerName}
                    <span className="text-[10px] text-slate-500 block">{o.maskedPhone}</span>
                  </td>
                  <td className="py-3 text-slate-300">
                    {o.items.map(i => `${i.productName} (${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 font-mono font-bold text-white">₹{o.grandTotal}</td>
                  <td className="py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      o.orderStatus === 'Delivered'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : o.orderStatus === 'Prescription Review'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : o.orderStatus === 'Preparing' || o.orderStatus === 'Ready for Pickup'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => {
                        if (onSelectOrder) onSelectOrder(o);
                        else navigate('orders');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold transition cursor-pointer text-xs"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

    </div>
  );
};
