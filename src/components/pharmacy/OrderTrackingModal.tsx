import React from 'react';
import { 
  X, 
  Package, 
  Check, 
  Clock, 
  Truck, 
  MapPin, 
  Building2, 
  Download, 
  FileText, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { PharmacyOrder } from '../../types/pharmacyMarketplace';

interface OrderTrackingModalProps {
  order: PharmacyOrder | null;
  onClose: () => void;
  onReorder?: (order: PharmacyOrder) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onReorder
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Track Order #{order.id}</h3>
              <span className="text-[11px] text-slate-500 font-medium">Placed on {new Date(order.date).toLocaleDateString()}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Status & Estimated Delivery Box */}
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Current Status</span>
              <h4 className="text-base font-extrabold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{order.status}</span>
              </h4>
              <p className="text-[11px] text-emerald-800">
                Estimated Delivery: <strong className="text-slate-950">{order.estimatedDelivery}</strong>
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-emerald-200 sm:pl-4">
              <span className="text-[10px] text-slate-500 block">Total Amount</span>
              <span className="text-base font-black text-slate-900 font-mono">₹{order.pricing.grandTotal.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-emerald-700 block">{order.paymentStatus} via {order.paymentMethod}</span>
            </div>
          </div>

          {/* Live Progress Pipeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Fulfillment & Dispatch Pipeline</span>
            </h4>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
              {order.trackingSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                    step.completed
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : step.current
                      ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {step.completed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${step.completed || step.current ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items In This Order */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Ordered Medicines & Healthcare Supplies ({order.items.length})
            </h4>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-slate-900">{item.productName}</h5>
                    <span className="text-[11px] text-slate-500">
                      Qty: {item.quantity} • Unit Price: ₹{item.unitPrice.toFixed(2)}
                    </span>
                    {item.prescriptionRequired && (
                      <span className="ml-2 inline-block bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.2 rounded">
                        Rx Verified
                      </span>
                    )}
                  </div>
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    ₹{item.totalPrice.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Pharmacy Hub Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>Delivery Address</span>
              </span>
              <p className="text-slate-800 font-medium">{order.deliveryAddress.fullName}</p>
              <p className="text-slate-500 text-[11px]">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
              <p className="text-slate-500 text-[11px]">Phone: {order.deliveryAddress.phone}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-blue-600" />
                <span>Fulfilling Pharmacy Partner</span>
              </span>
              <p className="text-slate-800 font-medium">{order.fulfillingPharmacy.name}</p>
              <p className="text-slate-500 text-[11px]">License: {order.fulfillingPharmacy.license}</p>
              <p className="text-slate-500 text-[11px]">Support: {order.fulfillingPharmacy.phone}</p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              onClick={() => alert(`Downloading official pharmacy invoice for Order ${order.id}...`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Download Tax Invoice</span>
            </button>

            {onReorder && (
              <button
                onClick={() => {
                  onReorder(order);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Re-Order Medicines</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
