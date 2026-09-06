import React, { useState } from 'react';
import { 
  X, 
  Check, 
  MapPin, 
  FileText, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Phone, 
  User, 
  Building, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowRight,
  ArrowLeft,
  Download,
  Package
} from 'lucide-react';
import { CartItem, UploadedPrescription, PharmacyOrder } from '../../types/pharmacyMarketplace';
import { usePatientEhr } from '../../context/PatientEhrContext';
import { placeMarketplaceOrder, ValidationResultItem } from '../../services/pharmacyInventoryClient';

interface PharmacyCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  uploadedPrescriptions?: UploadedPrescription[];
  onOrderPlaced: (order: PharmacyOrder) => void;
  /** Notified with items that failed final live stock validation, so the cart
      can flag/remove them and the customer can re-pick an eligible pharmacy. */
  onUnavailableItems?: (items: ValidationResultItem[]) => void;
}

export const PharmacyCheckoutModal: React.FC<PharmacyCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  uploadedPrescriptions = [],
  onOrderPlaced,
  onUnavailableItems
}) => {
  const { clinicalPrescriptions, activePatient } = usePatientEhr();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [placedOrder, setPlacedOrder] = useState<PharmacyOrder | null>(null);

  // Step 1 Form State: Delivery Details
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rahul.sharma@example.com');
  const [street, setStreet] = useState('Flat 402, Green Valley Apartments, Outer Ring Road');
  const [apartment, setApartment] = useState('Tower B');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560103');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');

  // Step 2 Form State: Prescription Selection (from EHR)
  const hasPrescriptionItems = cartItems.some(i => i.product.prescriptionRequired);
  
  // Available clinical prescriptions from EHR
  const allAvailableRxs = [
    ...clinicalPrescriptions.map(rx => ({
      id: rx.id,
      title: rx.title,
      doctorName: rx.doctorName,
      hospitalClinic: rx.hospitalClinic,
      prescriptionDate: rx.prescriptionDate,
      validUntil: rx.validUntil,
      status: rx.status,
      medications: rx.medications.map(m => m.name).join(', ')
    })),
    ...uploadedPrescriptions.map(rx => ({
      id: rx.id,
      title: rx.fileName,
      doctorName: rx.doctorName,
      hospitalClinic: 'Uploaded Record',
      prescriptionDate: rx.prescriptionDate,
      validUntil: 'Verified',
      status: rx.status,
      medications: 'Verified Schedule H Drugs'
    }))
  ];

  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string>(
    allAvailableRxs.length > 0 ? allAvailableRxs[0].id : 'EHR_CANONICAL_CONSENT'
  );

  // Step 3 Form State: Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Credit / Debit Card' | 'Net Banking' | 'Cash on Delivery'>('UPI');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  // Set when final live stock validation blocks the order.
  const [stockValidationError, setStockValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Transparent calculations
  const subtotalMRP = cartItems.reduce((sum, item) => sum + (item.product.mrp * item.quantity), 0);
  const itemsSubtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const totalDiscount = subtotalMRP - itemsSubtotal;
  const isFreeDelivery = itemsSubtotal >= 500 && deliveryType === 'standard';
  const deliveryFee = deliveryType === 'express' ? 90 : (isFreeDelivery ? 0 : 40);
  const tax = itemsSubtotal * 0.05;
  const grandTotal = itemsSubtotal + deliveryFee + tax;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (hasPrescriptionItems) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 3) {
      if (hasPrescriptionItems) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setStockValidationError(null);

    // -----------------------------------------------------------------
    // ATOMIC ORDER PLACEMENT (server-side validate + stock decrement).
    // The central inventory engine re-verifies every line and decrements
    // stock in one synchronous section — overselling is impossible and
    // totals are recalculated server-side (client totals never trusted).
    // -----------------------------------------------------------------
    const orderItems = cartItems.map(item => ({ productId: item.product.id, pharmacyId: item.selectedPharmacyId, quantity: item.quantity }));
    const placement = await placeMarketplaceOrder(orderItems, deliveryFee);

    if (!placement.ok) {
      const failure = placement as unknown as { code?: string; error?: string; medicineName?: string; availableQuantity?: number };
      if (failure.medicineName) {
        setStockValidationError(
          `This pharmacy no longer has this medicine in stock: ${failure.medicineName}${failure.code === 'INSUFFICIENT_STOCK' && failure.availableQuantity !== undefined ? ` (only ${failure.availableQuantity} left)` : ''}. Please select another available pharmacy.`
        );
        if (onUnavailableItems) {
          onUnavailableItems([
            { productId: '', pharmacyId: '', eligible: false, reason: failure.code || 'OUT_OF_STOCK', medicineName: failure.medicineName }
          ]);
        }
      } else {
        setStockValidationError(failure.error || 'The order could not be placed. Please try again.');
      }
      setIsProcessing(false);
      return;
    }

    const serverOrderId = placement.orderId;
    const serverPricing = placement.pricing;

    setTimeout(() => {
      const orderId = serverOrderId;
      const now = new Date();
      
      const newOrder: PharmacyOrder = {
        id: orderId,
        date: now.toISOString(),
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          brandName: item.product.brandName,
          strength: item.product.strength,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: item.product.price * item.quantity,
          prescriptionRequired: item.product.prescriptionRequired
        })),
        deliveryAddress: {
          fullName,
          phone,
          email,
          street,
          apartment,
          city,
          state,
          pincode,
          deliveryType
        },
        pricing: {
          subtotalMRP,
          totalDiscount,
          itemsSubtotal: serverPricing?.itemsSubtotal ?? itemsSubtotal,
          deliveryFee: serverPricing?.deliveryFee ?? deliveryFee,
          tax: serverPricing?.tax ?? tax,
          grandTotal: serverPricing?.grandTotal ?? grandTotal
        },
        prescriptionId: hasPrescriptionItems ? (selectedPrescriptionId || 'RX-VER-77401') : undefined,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending on Delivery' : 'Paid',
        status: hasPrescriptionItems ? 'Prescription Verified' : 'Order Placed',
        estimatedDelivery: deliveryType === 'express' ? 'Today in 2-3 Hours' : 'Tomorrow by 02:00 PM',
        trackingSteps: [
          {
            title: 'Order Placed & Logged',
            description: 'Order confirmed and routed to dispensary hub.',
            timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            completed: true
          },
          {
            title: hasPrescriptionItems ? 'Prescription Verified by Pharmacist' : 'Inventory Reserved',
            description: hasPrescriptionItems 
              ? 'Doctor prescription validated by Dr. S. K. Ramanathan, R.Ph' 
              : 'Batch allocated under GPP standards.',
            timestamp: 'In Progress',
            completed: true,
            current: true
          },
          {
            title: 'Dispensing & Quality Packaging',
            description: 'Stored in tamper-proof cool packaging with verified invoice.',
            timestamp: 'Pending',
            completed: false
          },
          {
            title: 'Dispatched with Courier Partner',
            description: 'Assigned to cold-chain delivery agent with live GPS tracking.',
            timestamp: 'Pending',
            completed: false
          },
          {
            title: 'Delivered',
            description: 'Handover at doorstep with OTP verification.',
            timestamp: 'Pending',
            completed: false
          }
        ],
        fulfillingPharmacy: {
          name: cartItems[0]?.product.pharmacyPartnerName || 'Apex Central Clinical Dispensary',
          license: 'DL-ND-2024-88910',
          phone: '+91 11 4982 3000'
        }
      };

      setPlacedOrder(newOrder);
      onOrderPlaced(newOrder);
      setIsProcessing(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">GlobalHealth Safe Pharmacy Checkout</h3>
              <span className="text-[11px] text-slate-500 font-medium">Verified Fulfillments • Transparent Invoicing</span>
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

        {/* If Order Placed: Confirmation View */}
        {placedOrder ? (
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  Order Successfully Confirmed
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Order ID: {placedOrder.id}
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your medicine package is being prepared at <strong className="text-slate-800">{placedOrder.fulfillingPharmacy.name}</strong>.
                </p>
              </div>
            </div>

            {/* Order Highlight Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Delivery</span>
                <span className="font-bold text-emerald-700">{placedOrder.estimatedDelivery}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Payment</span>
                <span className="font-bold text-slate-800">{placedOrder.paymentMethod}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Amount</span>
                <span className="font-bold text-slate-950 text-sm">₹{placedOrder.pricing.grandTotal.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Fulfillment</span>
                <span className="font-bold text-blue-700 truncate block">GPP Licensed</span>
              </div>
            </div>

            {/* Tracking Progress Timeline */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="h-4 w-4 text-emerald-600" />
                <span>Live Order Fulfillment Pipeline</span>
              </h4>
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                {placedOrder.trackingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 relative">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                      step.completed 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      {step.completed ? <Check className="h-3 w-3" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${step.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                          {step.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{step.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onClose}
                className="w-full flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold transition cursor-pointer"
              >
                Continue Shopping & Explore Medicines
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            
            {/* Step Progress Tracker */}
            <div className="flex items-center justify-between px-2 text-xs font-bold">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100'
                }`}>1</span>
                <span>Delivery</span>
              </div>
              <div className="h-0.5 flex-1 mx-3 bg-slate-200">
                <div className={`h-full bg-emerald-500 transition-all ${currentStep >= 2 ? 'w-full' : 'w-0'}`} />
              </div>

              {hasPrescriptionItems && (
                <>
                  <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                      currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100'
                    }`}>2</span>
                    <span>Prescription</span>
                  </div>
                  <div className="h-0.5 flex-1 mx-3 bg-slate-200">
                    <div className={`h-full bg-emerald-500 transition-all ${currentStep >= 3 ? 'w-full' : 'w-0'}`} />
                  </div>
                </>
              )}

              <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100'
                }`}>
                  {hasPrescriptionItems ? 3 : 2}
                </span>
                <span>Payment</span>
              </div>
            </div>

            {/* STEP 1: Delivery Details */}
            {currentStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>Delivery Address & Recipient</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number (for Delivery OTP)</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={e => setState(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Speed Options */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-900 block text-xs">Choose Delivery Option</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label
                      onClick={() => setDeliveryType('standard')}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-2.5 ${
                        deliveryType === 'standard'
                          ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={deliveryType === 'standard'}
                        onChange={() => setDeliveryType('standard')}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span>Standard Delivery</span>
                          <span className="text-emerald-700 font-bold">{isFreeDelivery ? 'FREE' : '₹40'}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Est. Delivery in 24–48 Hours</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setDeliveryType('express')}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-start gap-2.5 ${
                        deliveryType === 'express'
                          ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={deliveryType === 'express'}
                        onChange={() => setDeliveryType('express')}
                        className="mt-0.5 text-emerald-600"
                      />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-emerald-900">
                            <Clock className="h-3 w-3 text-emerald-600" />
                            <span>Express 2-Hour Delivery</span>
                          </span>
                          <span className="text-slate-900 font-bold">₹90</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">From nearest satellite pharmacy</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Continue to Next Step */}
                <button
                  onClick={handleNextStep}
                  disabled={!fullName || !phone || !street || !pincode}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 text-xs font-bold transition shadow-xs cursor-pointer mt-2"
                >
                  <span>{hasPrescriptionItems ? 'Proceed to Prescription Review' : 'Proceed to Payment & Summary'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Prescription Verification (if applicable) */}
            {currentStep === 2 && hasPrescriptionItems && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <FileText className="h-4 w-4 text-amber-700" />
                    <span>Schedule H Prescription Verification</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed">
                    Under statutory drug dispensing regulations, prescription medicines cannot be dispatched without validation by our licensed clinical pharmacist.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Verified Clinical Health Record (EHR) Prescription</h4>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                      {allAvailableRxs.length} Saved in EHR
                    </span>
                  </div>

                  {allAvailableRxs.length > 0 ? (
                    <div className="space-y-2">
                      {allAvailableRxs.map(rx => (
                        <label
                          key={rx.id}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                            selectedPrescriptionId === rx.id
                              ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="selected-rx"
                            checked={selectedPrescriptionId === rx.id}
                            onChange={() => setSelectedPrescriptionId(rx.id)}
                            className="mt-1 text-emerald-600"
                          />
                          <div className="flex-1 text-xs space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900">{rx.title}</span>
                              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                                {rx.status}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px]">
                              Prescribed by: <strong>{rx.doctorName}</strong> ({rx.hospitalClinic})
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Drugs: <span className="font-medium text-slate-700">{rx.medications}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">Date: {rx.prescriptionDate} • Valid Until: {rx.validUntil}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl border border-slate-200 text-center space-y-2 bg-slate-50">
                      <FileText className="h-7 w-7 text-teal-600 mx-auto" />
                      <h5 className="font-bold text-slate-800 text-xs">EHR Prescription Linkage</h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Your registered physician's e-prescription or health record slip will be validated directly from your Health Record profile prior to dispensing.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>

                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment & Summary */}
            {currentStep === 3 && (
              <div className="space-y-4 text-xs">
                
                {/* Payment Methods */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>Select Payment Method</span>
                  </h4>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'UPI', label: 'UPI (GPay / PhonePe / Paytm / BHIM)', icon: '⚡' },
                      { id: 'Credit / Debit Card', label: 'Credit or Debit Card', icon: '💳' },
                      { id: 'Net Banking', label: 'Net Banking (All Indian Banks)', icon: '🏛️' },
                      { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', icon: '💵' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition ${
                          paymentMethod === method.id
                            ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-500 font-bold text-emerald-950'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-base mr-1.5">{method.icon}</span>
                        <span className="text-xs">{method.label}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <label className="font-bold text-slate-700 block">Enter UPI ID / VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Final Order Price Breakdown */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex justify-between">
                    <span>Order Summary ({cartItems.length} items)</span>
                    <span className="text-emerald-700 text-xs">Total Savings: ₹{totalDiscount.toFixed(2)}</span>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Total MRP</span>
                      <span className="font-mono">₹{subtotalMRP.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount</span>
                      <span className="font-mono">-₹{totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated GST (5%)</span>
                      <span className="font-mono">₹{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery ({deliveryType === 'express' ? 'Express 2-Hr' : 'Standard'})</span>
                      <span className="font-mono font-bold text-slate-800">
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-950 border-t border-slate-200 pt-2">
                      <span>Final Payable Amount</span>
                      <span className="font-mono text-base text-emerald-700">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Final stock validation failure — order is blocked */}
                {stockValidationError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-rose-800 leading-relaxed">
                      <strong className="block text-sm mb-0.5">Order blocked — pharmacy stock changed</strong>
                      {stockValidationError}
                    </div>
                  </div>
                )}

                {/* Navigation & Confirmation Action */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-6 py-3 text-xs font-black transition shadow-md cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    <span>{isProcessing ? 'Verifying stock & Processing…' : `Pay & Confirm Order (₹${grandTotal.toFixed(2)})`}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
