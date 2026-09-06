import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  MapPin, 
  User, 
  FileText, 
  Printer, 
  AlertCircle, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  Pill,
  DollarSign
} from 'lucide-react';
import { PortalOrderRecord, PortalOrderStatus, PharmacyStaffMember } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface OrdersManagementTabProps {
  orders: PortalOrderRecord[];
  staff: PharmacyStaffMember[];
  onOrderUpdated: () => void;
  selectedOrderProp?: PortalOrderRecord | null;
}

export const OrdersManagementTab: React.FC<OrdersManagementTabProps> = ({
  orders,
  staff,
  onOrderUpdated,
  selectedOrderProp
}) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('All');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<'All' | 'Home Delivery' | 'Store Pickup'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalOrder, setActiveModalOrder] = useState<PortalOrderRecord | null>(selectedOrderProp || null);

  // Status options
  const statusTabs = [
    'All',
    'New',
    'Prescription Review',
    'Confirmed',
    'Preparing',
    'Ready for Pickup',
    'Out for Delivery',
    'Delivered',
    'Rejected'
  ];

  const filteredOrders = orders.filter(o => {
    const matchesStatus = activeStatusFilter === 'All' || o.orderStatus === activeStatusFilter;
    const matchesDelivery = deliveryTypeFilter === 'All' || o.deliveryType === deliveryTypeFilter;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some(i => i.productName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesDelivery && matchesSearch;
  });

  const handleUpdateStatus = (orderId: string, nextStatus: PortalOrderStatus) => {
    const updated = PharmacyPortalService.updateOrderStatus(orderId, nextStatus, 'Dr. S. K. Ramanathan, R.Ph');
    if (updated && activeModalOrder?.id === orderId) {
      setActiveModalOrder(updated);
    }
    onOrderUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white">Order Management & Fulfillment</h2>
            <p className="text-xs text-slate-400">Process user orders, assign dispensary staff, print invoices, and update delivery dispatch.</p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={deliveryTypeFilter}
              onChange={(e) => setDeliveryTypeFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Delivery Types</option>
              <option value="Home Delivery">Home Delivery (Express)</option>
              <option value="Store Pickup">Store Counter Pickup</option>
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID (e.g. GH-10482), customer name, or medicine name..."
            className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                activeStatusFilter === tab
                  ? 'bg-teal-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Time & Date</th>
                <th className="p-4 font-semibold">Customer & Patient</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No orders match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4 font-mono font-bold text-teal-300">
                      {order.orderNumber}
                      {order.prescriptionRequired && (
                        <span className="block text-[10px] text-amber-400 font-bold">Rx Required</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400">{order.createdAt}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{order.maskedPhone}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                        {order.deliveryType === 'Home Delivery' ? (
                          <Truck className="w-3 h-3 text-teal-400" />
                        ) : (
                          <MapPin className="w-3 h-3 text-blue-400" />
                        )}
                        <span>{order.deliveryType}</span>
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">
                      {order.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      ₹{order.grandTotal}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.paymentStatus === 'Paid Online'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {order.paymentStatus} ({order.paymentMethod})
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : order.orderStatus === 'Prescription Review'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : order.orderStatus === 'Preparing' || order.orderStatus === 'Ready for Pickup'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setActiveModalOrder(order)}
                        className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold text-xs transition cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400">Order Fulfillment Details</span>
                <h3 className="text-lg font-black text-white font-mono">{activeModalOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setActiveModalOrder(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Status Workflow Ribbon */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Current Status</span>
                <span className="font-bold text-teal-300 text-sm">{activeModalOrder.orderStatus}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {activeModalOrder.orderStatus === 'New' && (
                  <button
                    onClick={() => handleUpdateStatus(activeModalOrder.id, 'Preparing')}
                    className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    Accept & Prepare Order
                  </button>
                )}
                {activeModalOrder.orderStatus === 'Prescription Review' && (
                  <button
                    onClick={() => handleUpdateStatus(activeModalOrder.id, 'Preparing')}
                    className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    Approve Rx & Prepare
                  </button>
                )}
                {activeModalOrder.orderStatus === 'Preparing' && (
                  <button
                    onClick={() => handleUpdateStatus(activeModalOrder.id, activeModalOrder.deliveryType === 'Store Pickup' ? 'Ready for Pickup' : 'Out for Delivery')}
                    className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    {activeModalOrder.deliveryType === 'Store Pickup' ? 'Mark Ready for Pickup' : 'Dispatch (Out for Delivery)'}
                  </button>
                )}
                {(activeModalOrder.orderStatus === 'Out for Delivery' || activeModalOrder.orderStatus === 'Ready for Pickup') && (
                  <button
                    onClick={() => handleUpdateStatus(activeModalOrder.id, 'Delivered')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
                  >
                    Complete Delivery (Handover)
                  </button>
                )}
              </div>
            </div>

            {/* Customer & Destination Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Patient Details</span>
                <div className="font-bold text-white">{activeModalOrder.customerName}</div>
                <div className="text-slate-400">Phone: {activeModalOrder.maskedPhone}</div>
                {activeModalOrder.patientAge && (
                  <div className="text-slate-400">Age / Gender: {activeModalOrder.patientAge} Yrs / {activeModalOrder.patientGender}</div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 font-bold block text-[10px] uppercase">Delivery Information</span>
                <div className="font-bold text-teal-300">{activeModalOrder.deliveryType}</div>
                <div className="text-slate-300 leading-snug">
                  {activeModalOrder.deliveryAddress.street}, {activeModalOrder.deliveryAddress.city} - {activeModalOrder.deliveryAddress.pincode}
                </div>
              </div>
            </div>

            {/* Prescribed Items Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Dispensed Items & Batch Traceability</span>
              <div className="rounded-2xl border border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-2.5 font-semibold">Medicine</th>
                      <th className="p-2.5 font-semibold">Batch No</th>
                      <th className="p-2.5 font-semibold">Expiry</th>
                      <th className="p-2.5 font-semibold">Qty</th>
                      <th className="p-2.5 font-semibold">Price</th>
                      <th className="p-2.5 font-semibold text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {activeModalOrder.items.map(item => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-medium text-white">{item.productName}</td>
                        <td className="p-2.5 font-mono text-teal-300">{item.batchNumber || 'AUG-24K09'}</td>
                        <td className="p-2.5 font-mono text-slate-400">{item.expiryDate || '2027-10-31'}</td>
                        <td className="p-2.5">{item.quantity}</td>
                        <td className="p-2.5 font-mono">₹{item.unitPrice}</td>
                        <td className="p-2.5 font-mono font-bold text-right">₹{item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financials Breakdown */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Items:</span>
                <span className="font-mono">₹{activeModalOrder.subtotalAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dispensary Discount:</span>
                <span className="font-mono text-emerald-400">-₹{activeModalOrder.discountAmount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (Tax):</span>
                <span className="font-mono">₹{activeModalOrder.taxAmount}</span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="font-mono text-teal-300">₹{activeModalOrder.grandTotal}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => alert(`Printing Official Dispensary Invoice & Rx Label for ${activeModalOrder.orderNumber}`)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" />
                <span>Print Invoice & Label</span>
              </button>

              <button
                onClick={() => setActiveModalOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
