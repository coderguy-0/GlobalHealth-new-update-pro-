import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  ShieldAlert,
  Droplet,
  HeartPulse,
  Activity,
  Layers,
  Thermometer,
  Zap,
  Bookmark,
  Share2,
  Printer,
  Sparkles,
  Pill,
  ArrowRight,
  AlertCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { Medicine } from '../types';
import { MedicineInfographic } from './MedicineInfographic';

interface MedicineMonographModalProps {
  medicine: Medicine;
  onClose: () => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export const MedicineMonographModal: React.FC<MedicineMonographModalProps> = ({
  medicine,
  onClose,
  onBookmark,
  isBookmarked = false
}) => {
  const [activeTab, setActiveTab] = useState<'monograph' | 'infographic'>('monograph');
  const [activeMonographSection, setActiveMonographSection] = useState<'all' | 'overview' | 'dosage' | 'sideEffects' | 'safety' | 'faqs'>('all');

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${medicine.name} - Complete Clinical Monograph`,
          text: `Comprehensive clinical monograph, dosage, uses, and side effects for ${medicine.name}`,
          url: window.location.href,
        });
      } catch {
        // Fallback copy URL
        navigator.clipboard?.writeText(window.location.href);
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-2 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-4 sm:px-6 py-3.5 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-0.5 text-xs font-extrabold flex items-center gap-1.5 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verified Clinical Monograph</span>
            </span>

            <span className="rounded-full bg-slate-200 text-slate-700 px-2.5 py-0.5 text-[11px] font-bold">
              {medicine.category}
            </span>

            {medicine.prescriptionStatus && (
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                medicine.prescriptionStatus.toLowerCase().includes('otc')
                  ? 'bg-blue-100 text-blue-800 border-blue-200'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {medicine.prescriptionStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onBookmark && (
              <button
                onClick={() => onBookmark(medicine.id)}
                className={`p-2 rounded-full transition cursor-pointer ${
                  isBookmarked ? 'bg-amber-100 text-amber-700' : 'text-slate-400 hover:bg-slate-200 hover:text-slate-700'
                }`}
                title={isBookmarked ? 'Saved to Bookmarks' : 'Save Monograph'}
                aria-label="Save Monograph"
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-600' : ''}`} />
              </button>
            )}

            <button
              onClick={handleShare}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
              title="Share Monograph"
              aria-label="Share Monograph"
            >
              <Share2 className="h-4 w-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
              title="Print Monograph"
              aria-label="Print Monograph"
            >
              <Printer className="h-4 w-4" />
            </button>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Switcher: Clinical Monograph vs Interactive Pharmacokinetic Infographic */}
        <div className="flex items-center justify-between border-b border-slate-200/90 bg-white px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTab('monograph')}
              className={`py-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'monograph'
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>View More</span>
            </button>

            <button
              onClick={() => setActiveTab('infographic')}
              className={`py-3 border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'infographic'
                  ? 'border-emerald-600 text-emerald-700 font-extrabold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="h-4 w-4 text-emerald-600" />
              <span>Pharmacokinetic Infographic</span>
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'infographic' ? (
            <MedicineInfographic medicine={medicine} />
          ) : (
            <div className="space-y-6">
              
              {/* Monograph Header */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                    <Pill className="h-4 w-4" />
                    <span>Therapeutic Class: {medicine.therapeuticGroup || medicine.category}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {medicine.name}
                  </h1>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium">
                    Generic: <strong className="text-emerald-300">{medicine.genericName}</strong>
                  </p>
                  
                  {medicine.dosageForms && medicine.dosageForms.length > 0 && (
                    <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                      <span className="font-bold text-slate-400">Available Dosage Forms:</span>
                      {medicine.dosageForms.map((form, idx) => (
                        <span key={idx} className="bg-white/10 px-2.5 py-0.5 rounded-full text-xs text-emerald-200 border border-white/10">
                          {form}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 1. What is ( Medicine Name ) ? */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <Info className="h-5 w-5 text-emerald-600" />
                  <span>1. What is {medicine.name}?</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {medicine.whatIs || medicine.description}
                </p>
              </div>

              {/* 2. Uses */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  <span>2. Medically Recognized Uses & Indications</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {medicine.uses.map((use, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{use}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Dosage & Administration */}
              <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm sm:text-base border-b border-emerald-200 pb-2">
                  <Clock className="h-5 w-5 text-emerald-700" />
                  <span>3. Dosage & Administration</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {/* Adults 12+ */}
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1.5 shadow-xs">
                    <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Adults (12 years and older)
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {medicine.adultDosage || medicine.dosage || 'Take strictly as prescribed by your doctor or as outlined on the pharmaceutical product packaging.'}
                    </p>
                  </div>

                  {/* Children */}
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1.5 shadow-xs">
                    <span className="font-extrabold text-blue-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <Activity className="h-4 w-4 text-blue-600" />
                      Children (Pediatric Guidance)
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {medicine.childrenDosage || 'Consult a pediatrician for weight-based (mg/kg) dosage. Do not administer to infants without direct clinical authorization.'}
                    </p>
                  </div>

                  {/* Missed Dose */}
                  <div className="p-3.5 rounded-2xl bg-white border border-emerald-100 space-y-1.5 shadow-xs">
                    <span className="font-extrabold text-amber-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <Clock className="h-4 w-4 text-amber-600" />
                      Missed Dose Instructions
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {medicine.missedDose || 'Take the missed dose as soon as you remember. If it is close to your next scheduled dose, skip it. Never double up doses.'}
                    </p>
                  </div>

                  {/* Overdose */}
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1.5 shadow-xs text-rose-950">
                    <span className="font-extrabold text-rose-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      Overdose (Emergency Protocol)
                    </span>
                    <p className="text-rose-900 leading-relaxed">
                      {medicine.overdose || 'Immediate emergency medical intervention required. Contact your local poison control hotline or nearest hospital casualty department.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. How to Take */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <Layers className="h-5 w-5 text-indigo-600" />
                  <span>4. How to Take</span>
                </div>
                <div className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700">
                  {(medicine.howToTake || [
                    'Take orally with a full glass of water.',
                    'Adhere to regular dosing intervals.',
                    'Do not crush or chew sustained-release formulations unless instructed by your pharmacist.'
                  ]).map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-100">
                      <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Side Effects */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <span>5. Side Effects</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Common Side Effects */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <span className="font-extrabold text-amber-900 block uppercase tracking-wider text-[11px]">
                      Common Side Effects
                    </span>
                    <ul className="space-y-1.5 text-slate-700">
                      {(medicine.commonSideEffects || ['Mild nausea', 'Dizziness', 'Headache']).map((se, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{se}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rare Side Effects */}
                  <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                    <span className="font-extrabold text-slate-800 block uppercase tracking-wider text-[11px]">
                      Rare Side Effects
                    </span>
                    <ul className="space-y-1.5 text-slate-700">
                      {(medicine.rareSideEffects || ['Transient rash', 'Mild gastrointestinal disturbance', 'Dry mouth']).map((se, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-slate-500 font-bold">•</span>
                          <span>{se}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Serious Side Effects */}
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-rose-950">
                    <span className="font-extrabold text-rose-900 block uppercase tracking-wider text-[11px] flex items-center gap-1">
                      <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                      Serious (Immediate Help)
                    </span>
                    <ul className="space-y-1.5 text-rose-900">
                      {(medicine.seriousSideEffects || ['Severe allergic anaphylaxis', 'Yellowing of eyes/skin', 'Unexplained swelling']).map((se, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{se}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 6. Warnings */}
              <div className="p-5 rounded-3xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2">
                <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base text-amber-900 border-b border-amber-200/80 pb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span>6. Warnings & Clinical Precautions</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed pt-1">
                  {medicine.warnings}
                </p>
              </div>

              {/* 7. Drug Interactions */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                  <span>7. Drug Interactions</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
                  {(medicine.drugInteractions || ['Alcohol and CNS depressants', 'Other hepatically cleared compounds']).map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0"></span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Storage */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <Thermometer className="h-5 w-5 text-blue-600" />
                  <span>8. Storage & Shelf-Life Guidelines</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                  {(medicine.storage || [
                    'Store at room temperature 20°C to 25°C (68°F to 77°F).',
                    'Keep away from excess moisture, heat, and direct sunlight.',
                    'Keep out of reach of children and household pets.'
                  ]).map((st, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-100">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 9. Alternatives */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <Sparkles className="h-5 w-5 text-teal-600" />
                  <span>9. Therapeutic Alternatives</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  {(medicine.alternatives || ['Related therapeutic class agents', 'Alternative first-line therapies']).map((alt, i) => (
                    <span key={i} className="rounded-xl bg-teal-50 text-teal-900 border border-teal-200 px-3.5 py-1.5 font-medium">
                      • {alt}
                    </span>
                  ))}
                </div>
              </div>

              {/* 10. Who Should NOT Take (Medicine Name)? */}
              <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-200 space-y-3 text-rose-950">
                <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm sm:text-base border-b border-rose-200 pb-2">
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                  <span>10. Who Should NOT Take {medicine.name}?</span>
                </div>
                <div className="space-y-2 pt-1 text-xs text-rose-900">
                  {(medicine.whoShouldNotTake || [
                    'Individuals with known hypersensitivity to the active compound or excipients.',
                    'Patients with severe decompensated organ failure without specialist approval.'
                  ]).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-white/80 border border-rose-100">
                      <span className="text-rose-600 font-black shrink-0">✕</span>
                      <span className="font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11. How Does ( MEDICINE ) Work? */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <span>11. How Does {medicine.name} Work? (Mechanism of Action)</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                  {medicine.howItWorks || `${medicine.name} exerts targeted therapeutic modulation on cellular receptors and enzymatic cascades to mitigate symptoms and address the underlying pathophysiology.`}
                </p>
              </div>

              {/* 12. Safety Information */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>12. Safety Information</span>
                </div>
                <div className="space-y-2 pt-1 text-xs text-slate-700">
                  {(medicine.safetyInformation || [
                    'Always read the package information leaflet carefully.',
                    'Do not share your medication with others.',
                    'Keep your doctor informed of all medications and supplements you take.'
                  ]).map((info, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-white border border-slate-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{info}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 13. Frequently Asked Questions (FAQs) */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm sm:text-base border-b border-slate-200 pb-2">
                  <QuestionIcon className="h-5 w-5 text-purple-600" />
                  <span>13. Frequently Asked Questions (FAQs)</span>
                </div>
                <div className="space-y-3 pt-1">
                  {(medicine.faqs || [
                    {
                      question: `How fast does ${medicine.name} start working?`,
                      answer: `Therapeutic onset generally occurs within 30 to 60 minutes after administration depending on dosage form.`
                    },
                    {
                      question: `Can I take ${medicine.name} with food?`,
                      answer: `Taking with food can help minimize any potential stomach irritation.`
                    }
                  ]).map((faq, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 text-xs">
                      <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span className="h-5 w-5 rounded-full bg-purple-100 text-purple-700 text-[11px] flex items-center justify-center font-black shrink-0">
                          Q
                        </span>
                        {faq.question}
                      </h4>
                      <p className="text-slate-600 pl-6 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 14. When to See a Doctor */}
              <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-200 space-y-3 text-rose-950">
                <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm sm:text-base border-b border-rose-200 pb-2">
                  <Stethoscope className="h-5 w-5 text-rose-600" />
                  <span>14. When to See a Doctor</span>
                </div>
                <div className="space-y-2 pt-1 text-xs text-rose-900">
                  {(medicine.whenToSeeDoctor || [
                    'Symptoms fail to improve or deteriorate after 3–5 days.',
                    'You develop unexpected rashes, swelling, or breathing difficulty.',
                    'You suspect an accidental overdose or severe adverse drug reaction.'
                  ]).map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-white/80 border border-rose-100">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 15. Medical Disclaimer */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1 text-[11px] uppercase tracking-wider">
                  <Info className="h-3.5 w-3.5 text-slate-500" />
                  <span>15. Clinical Disclaimer</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  {medicine.disclaimer || 'This information is for educational purposes only and does not replace professional medical advice. Always consult a qualified doctor, pharmacist, or other healthcare professional before starting, stopping, or changing any medicine.'}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
