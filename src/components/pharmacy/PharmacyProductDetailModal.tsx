import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Clock, 
  AlertTriangle, 
  Info, 
  Check, 
  Sparkles,
  Award,
  Package,
  Layers,
  ThermometerSnowflake,
  ArrowRight,
  ShoppingCart,
  MapPin,
  Truck,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  ChevronRight,
  ShieldAlert,
  Droplet,
  HeartPulse,
  Activity,
  AlertCircle
} from 'lucide-react';
import { PharmacyProduct } from '../../types/pharmacyMarketplace';

interface PharmacyProductDetailModalProps {
  product: PharmacyProduct;
  onClose: () => void;
  onOpenBuyMedicine: (product: PharmacyProduct) => void;
}

export const PharmacyProductDetailModal: React.FC<PharmacyProductDetailModalProps> = ({
  product,
  onClose,
  onOpenBuyMedicine
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'safety' | 'directions' | 'generic' | 'faqs'>('overview');

  // Stock status text
  const stockLabel = product.availability === 'in_stock' 
    ? 'In Stock' 
    : product.availability === 'low_stock' 
    ? 'Limited Stock' 
    : 'Currently Unavailable';

  const stockBadgeClass = product.availability === 'in_stock'
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
    : product.availability === 'low_stock'
    ? 'bg-amber-100 text-amber-900 border-amber-200'
    : 'bg-rose-100 text-rose-800 border-rose-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 sm:px-6 py-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-0.5 text-xs font-extrabold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Medicine Information & Clinical Monograph</span>
            </span>

            {product.prescriptionRequired ? (
              <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-[11px] font-extrabold flex items-center gap-1">
                <FileText className="h-3 w-3 text-amber-700" />
                <span>Prescription Required ({product.rxSchedule})</span>
              </span>
            ) : (
              <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-[11px] font-bold">
                OTC / Non-Prescription
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sub-tab Navigation Bar for Clinical Monograph Sections */}
        <div className="flex items-center border-b border-slate-200/80 bg-white px-5 sm:px-6 gap-2 sm:gap-4 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            <span>Overview & Uses</span>
          </button>

          <button
            onClick={() => setActiveTab('directions')}
            className={`py-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'directions'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="h-3.5 w-3.5 text-slate-600" />
            <span>Dosage & Directions</span>
          </button>

          <button
            onClick={() => setActiveTab('safety')}
            className={`py-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'safety'
                ? 'border-emerald-600 text-emerald-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>Precautions & Side Effects</span>
          </button>

          {product.genericEquivalent && (
            <button
              onClick={() => setActiveTab('generic')}
              className={`py-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'generic'
                  ? 'border-teal-600 text-teal-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              <span>Generic Alternative</span>
            </button>
          )}

          {product.faqs && product.faqs.length > 0 && (
            <button
              onClick={() => setActiveTab('faqs')}
              className={`py-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'faqs'
                  ? 'border-purple-600 text-purple-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 text-purple-600" />
              <span>FAQs</span>
            </button>
          )}
        </div>

        {/* Modal Main Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          
          {/* Top Section: Photo + Specs & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Left Col: Image & Fulfillment Badge */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden border border-slate-100 shadow-inner">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-800 shadow-xs">
                  {product.dosageForm}
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono">
                  {product.packSize}
                </div>
              </div>

              {/* Verified Pharmacy Partner Badge */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Licensed Partner Fulfillment</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Medicines are fulfilled exclusively through state-licensed Verified Pharmacy Partners to guarantee pharmaceutical authenticity and safety.
                </p>
              </div>
            </div>

            {/* Right Col: Name, Active Ingredients, Benchmark Price, Primary Action */}
            <div className="md:col-span-7 space-y-3.5">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  {product.brandName} • {product.strength}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Active Ingredient: <strong className="text-slate-900">{product.genericName}</strong>
                </p>
              </div>

              {/* Pricing & Benchmark Info */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold line-through">
                    MRP ₹{product.mrp.toFixed(2)}
                  </span>
                  <span className="rounded-md bg-emerald-600 text-white px-2 py-0.5 text-xs font-extrabold">
                    {product.discountPercent}% OFF Benchmark
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-center justify-between border-t border-slate-200/80 pt-2 font-medium">
                  <span>Category: <strong className="text-slate-800">{product.category}</strong></span>
                  <span>Pack Size: <strong className="text-slate-800">{product.packSize}</strong></span>
                </div>
              </div>

              {/* Essential Specifications Table */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Manufacturer</span>
                  <span className="font-bold text-slate-800 truncate block">{product.manufacturer}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Availability Status</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${stockBadgeClass}`}>
                    {stockLabel}
                  </span>
                </div>
              </div>

              {/* Primary Buying Action (Triggers Pharmacy Selection) */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onOpenBuyMedicine(product);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs sm:text-sm font-bold transition shadow-md cursor-pointer group"
                >
                  <Building2 className="h-4 w-4 text-emerald-200" />
                  <span>
                    {product.prescriptionRequired ? 'Buy Medicine (Prescription Required)' : 'Buy Medicine via Verified Partner'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
                </button>
                <span className="text-[10px] text-slate-400 block text-center mt-1.5">
                  You will select a nearby Verified Pharmacy Partner in the next step
                </span>
              </div>

            </div>
          </div>

          {/* TAB 1: OVERVIEW & USES */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in">
              {/* General Medicine Description */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span>General Medicine Overview</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Medically Recognized Uses */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="h-4 w-4 text-emerald-600" />
                  <span>Medically Recognized Uses & Indications</span>
                </h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.uses.map((use, i) => (
                    <span key={i} className="rounded-lg bg-blue-50 text-blue-900 border border-blue-100 px-3 py-1 text-xs font-medium">
                      • {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Ingredients & Formulation */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-900 block">Active Pharmaceutical Ingredient(s) & Formulation:</span>
                <p className="text-slate-700 font-mono text-xs">
                  {product.composition}
                </p>
              </div>

              {/* Available Strengths / Forms */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <span className="font-bold text-slate-900 block">Available Strengths & Forms:</span>
                <p className="text-slate-600 text-xs">
                  Currently cataloged in <strong>{product.strength}</strong> ({product.dosageForm}) format. Additional strengths and suspensions are stocked across our partner network.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DOSAGE & DIRECTIONS */}
          {activeTab === 'directions' && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-sm block flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span>Basic Directions for Use & Administration</span>
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {product.dosageInstructions}
                </p>
                <div className="text-[11px] text-slate-500 italic pt-1">
                  Always adhere strictly to the dose, schedule, and duration prescribed by your treating physician.
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-sm block flex items-center gap-1.5">
                  <ThermometerSnowflake className="h-4 w-4 text-blue-600" />
                  <span>Storage Information</span>
                </span>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {product.storage}
                </p>
              </div>

              {product.prescriptionRequired && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-amber-900">
                    <FileText className="h-4 w-4 text-amber-700 shrink-0" />
                    <span>Prescription Information ({product.rxSchedule})</span>
                  </span>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    This medication is a scheduled drug under Indian regulatory standards. A valid registered doctor's prescription must be uploaded and validated by a licensed clinical pharmacist prior to dispensing.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAFETY & PRECAUTIONS */}
          {activeTab === 'safety' && (
            <div className="space-y-4 animate-in fade-in text-xs">
              {/* Important Warnings */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1.5">
                <span className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Important Medical Warnings & Contraindications</span>
                </span>
                <p className="text-xs text-amber-900 leading-relaxed">
                  {product.warnings}
                </p>
              </div>

              {/* Precautions */}
              {product.precautions && product.precautions.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 text-sm block">Important Precautions:</span>
                  <ul className="space-y-1.5 text-slate-700 text-xs list-disc list-inside">
                    {product.precautions.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Side Effects */}
              {product.sideEffects && product.sideEffects.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm block">Common Side Effects:</span>
                    <span className="text-[10px] text-slate-500 font-medium">Seek medical advice if persistent</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.sideEffects.map((effect, idx) => (
                      <span key={idx} className="rounded-lg bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 text-xs font-medium">
                        • {effect}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 pt-1 leading-normal">
                    Most side effects do not require urgent medical attention and disappear as your body adjusts. Consult your healthcare provider if they continue or cause concern.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GENERIC ALTERNATIVE */}
          {activeTab === 'generic' && product.genericEquivalent && (
            <div className="space-y-4 animate-in fade-in text-xs">
              <div className="p-5 rounded-2xl bg-teal-50/90 border border-teal-200 text-teal-950 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-950 flex items-center gap-1.5 text-sm">
                    <Sparkles className="h-4 w-4 text-teal-600" />
                    <span>Bioequivalent Generic Alternative Available</span>
                  </span>
                  <span className="rounded-full bg-teal-600 text-white font-black px-2.5 py-0.5 text-xs">
                    Save {product.genericEquivalent.savingsPercent}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-white/80 rounded-xl border border-teal-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Generic Drug Name</span>
                    <span className="font-bold text-slate-900 text-xs">{product.genericEquivalent.genericBrand}</span>
                    <span className="font-mono text-emerald-700 font-black text-sm block mt-0.5">
                      ₹{product.genericEquivalent.genericPrice.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Original Branded Price</span>
                    <span className="font-bold text-slate-700 text-xs">{product.brandName}</span>
                    <span className="font-mono text-slate-400 line-through text-xs block mt-0.5">
                      ₹{product.genericEquivalent.brandPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-teal-800 leading-relaxed">
                  {product.genericEquivalent.regulatoryNote} Under the Pradhan Mantri Jan Aushadhi initiative, generic equivalents undergo strict bioequivalence dissolution testing to provide identical therapeutic efficacy.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBuyMedicine(product);
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>Order Generic Bioequivalent via Verified Partners</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FAQS */}
          {activeTab === 'faqs' && product.faqs && (
            <div className="space-y-3 animate-in fade-in text-xs">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-purple-600" />
                <span>Frequently Asked Clinical Questions</span>
              </h4>
              <div className="space-y-2.5">
                {product.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 text-xs">Q: {faq.question}</div>
                    <div className="text-slate-600 text-xs leading-relaxed">A: {faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statutory Medical Disclaimer */}
          <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-normal">
            <strong>Medical Disclaimer:</strong> The information provided here is for educational and reference purposes only. It is not intended to substitute for professional medical advice, clinical diagnosis, or treatment. Always consult a qualified doctor or registered pharmacist regarding medical conditions.
          </div>

        </div>

      </div>
    </div>
  );
};
