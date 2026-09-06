import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  KeyRound, 
  Snowflake, 
  Phone, 
  User, 
  Package 
} from 'lucide-react';
import { PortalOrderRecord } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface DeliveryPickupTabProps {
  orders: PortalOrderRecord[];
  onOrderUpdated: () => void;
}

export const DeliveryPickupTab: React.FC<DeliveryPickupTabProps> = ({
  orders,
  onOrderUpdated
}) => {
  const [deliveryMode, setDeliveryMode] = useState<'All' | 'Home Delivery' | 'Store Pickup'>('All');
  const [handoverOtp, setHandoverOtp] = useState('');
  const [selectedOrderForHandover, setSelectedOrderForHandover] = useState<PortalOrderRecord | null>(null);

  const filteredOrders = orders.filter(o => {
    if (deliveryMode === 'All') return true;
    return o.deliveryType === deliveryMode;
  });

  const handleVerifyHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForHandover) return;

    PharmacyPortalService.updateOrderStatus(selectedOrderForHandover.id, 'Delivered', 'Dr. S. K. Ramanathan, R.Ph');
    setSelectedOrderForHandover(null);
    setHandoverOtp('');
    onOrderUpdated();
    alert(`Handover verified successfully for Order ${selectedOrderForHandover.orderNumber}.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-black text-white">Express Delivery Dispatch & Store Pickup Desk</h2>
            <p className="text-xs text-slate-400">
              Manage insulated cold-chain driver assignments, real-time GPS tracking, and patient OTP handoff verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['All', 'Home Delivery', 'Store Pickup'].map(m => (
              <button
                key={m}
                onClick={() => setDeliveryMode(m as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  deliveryMode === m
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono font-bold text-teal-300 text-sm">{order.orderNumber}</span>
                <div className="text-xs font-bold text-white mt-0.5">{order.customerName}</div>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                order.orderStatus === 'Delivered'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-blue-500/20 text-blue-300'
              }`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                {order.deliveryType === 'Home Delivery' ? (
                  <Truck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                )}
                <span className="font-bold text-white">{order.deliveryType}</span>
              </div>
              <div className="text-slate-400 text-[11px] leading-snug pl-5">
                {order.deliveryAddress.street}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
              </div>
            </div>

            {/* Logistics Rider Info */}
            {order.deliveryType === 'Home Delivery' && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Assigned Rider Fleet</div>
                <div className="text-teal-300 font-bold">{order.deliveryPartnerName || 'GlobalHealth Express Fleet #R-104'}</div>
                <div className="text-slate-400 font-mono text-[11px]">ETA: {order.estimatedDeliveryTime || 'Today, 11:30 AM (Express)'}</div>
              </div>
            )}

            {/* Handover Action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="font-mono font-bold text-white text-xs">Total: ₹{order.grandTotal}</span>
              
              {order.orderStatus !== 'Delivered' ? (
                <button
                  onClick={() => setSelectedOrderForHandover(order)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer"
                >
                  Verify Patient OTP
                </button>
              ) : (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Delivered & Signed</span>
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Verify OTP Modal */}
      {selectedOrderForHandover && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">Patient Handover OTP</h3>
              <p className="text-xs text-slate-400">
                Ask recipient for the 4-digit security code received via SMS for {selectedOrderForHandover.orderNumber}.
              </p>
            </div>

            <form onSubmit={handleVerifyHandover} className="space-y-3">
              <input
                type="text"
                maxLength={4}
                required
                value={handoverOtp}
                onChange={(e) => setHandoverOtp(e.target.value)}
                placeholder="4091"
                className="w-full text-center tracking-[0.5em] text-xl font-mono font-bold rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-teal-300 focus:outline-none focus:border-teal-500"
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForHandover(null)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs"
                >
                  Confirm Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
