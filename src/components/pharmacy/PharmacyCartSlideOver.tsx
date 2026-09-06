import React from 'react';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  FileText, 
  ShieldCheck, 
  ArrowRight, 
  Truck, 
  AlertCircle, 
  Sparkles,
  Info
} from 'lucide-react';
import { CartItem } from '../../types/pharmacyMarketplace';

interface PharmacyCartSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const PharmacyCartSlideOver: React.FC<PharmacyCartSlideOverProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  // Transparent calculations
  const subtotalMRP = cartItems.reduce((sum, item) => sum + (item.product.mrp * item.quantity), 0);
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalDiscount = subtotalMRP - itemsSubtotal;
  const isFreeDelivery = itemsSubtotal >= 500;
  const deliveryFee = itemsSubtotal === 0 ? 0 : (isFreeDelivery ? 0 : 40);
  const estimatedTax = itemsSubtotal * 0.05; // 5% GST transparent calculation
  const grandTotal = itemsSubtotal + deliveryFee + estimatedTax;

  const hasPrescriptionItems = cartItems.some(i => i.product.prescriptionRequired);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-slate-200/90 bg-slate-50/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShoppingCart className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Your Pharmacy Cart</h3>
                <span className="text-xs text-slate-500 font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            
            {/* Prescription Requirement Alert */}
            {hasPrescriptionItems && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-xs space-y-1 text-amber-950">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <FileText className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>Prescription Verification</span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Your cart contains Schedule H/H1 medicines. Prescription will be verified against your Clinical Health Record (EHR) during checkout.
                </p>
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <ShoppingCart className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm">Your Cart is Empty</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Browse verified medicines, healthcare essentials, and wellness supplies to add them to your cart.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 flex items-start gap-3 relative group"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug truncate">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1 cursor-pointer shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-500">
                        {product.packSize} • <strong className="text-slate-700">{product.dosageForm}</strong>
                      </p>

                      {product.prescriptionRequired && (
                        <span className="inline-block rounded-md bg-amber-100 text-amber-900 px-1.5 py-0.2 text-[9px] font-bold">
                          Rx Required
                        </span>
                      )}

                      <div className="flex items-center justify-between pt-1.5">
                        {/* Price Breakdown */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-black text-slate-900">
                            ₹{(product.price * quantity).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{(product.mrp * quantity).toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                            className="p-1 text-slate-600 hover:bg-slate-100 rounded-l-md transition cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-900 min-w-5 text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                            className="p-1 text-slate-600 hover:bg-slate-100 rounded-r-md transition cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transparent Price Summary & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-slate-50/90 space-y-3.5">
              
              {/* Delivery Free Progress Bar */}
              <div className="text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-semibold">
                    <Truck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isFreeDelivery ? 'Free Delivery Qualified!' : `Add ₹${(500 - itemsSubtotal).toFixed(2)} more for Free Delivery`}</span>
                  </span>
                  <span className="font-bold text-emerald-700">
                    {isFreeDelivery ? 'FREE' : '₹40.00'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (itemsSubtotal / 500) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-slate-200/80 pt-2.5">
                <div className="flex justify-between text-slate-500">
                  <span>Total MRP</span>
                  <span className="font-mono">₹{subtotalMRP.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Savings / Discount</span>
                  <span className="font-mono font-bold">-₹{totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Taxes (GST 5%)</span>
                  <span className="font-mono">₹{estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charges</span>
                  <span className="font-mono font-bold text-slate-700">
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2">
                  <span>Grand Total Payable</span>
                  <span className="font-mono text-base text-slate-950">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 space-y-2">
                <button
                  onClick={onProceedToCheckout}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-xs font-extrabold transition shadow-md cursor-pointer"
                >
                  <span>Proceed to Safe Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Genuine Medicines • GPP Verified Fulfillment</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
