import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  User, 
  Stethoscope, 
  Calendar,
  Lock,
  ArrowRight
} from 'lucide-react';
import { UploadedPrescription } from '../../types/pharmacyMarketplace';

interface PrescriptionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrescriptionUploaded: (prescription: UploadedPrescription) => void;
}

export const PrescriptionUploadModal: React.FC<PrescriptionUploadModalProps> = ({
  isOpen,
  onClose,
  onPrescriptionUploaded
}) => {
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [prescriptionDate, setPrescriptionDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(2)} MB`);
    }
  };

  const handleChooseSamplePrescription = () => {
    setFileName('Dr_Rostova_Clinical_Prescription_Cardiology.pdf');
    setFileSize('1.4 MB');
    setDoctorName('Dr. Elena Rostova, MD, FACC');
    setHospitalName('Apex Central Clinical Institute');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !doctorName || !fileName) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newPrescription: UploadedPrescription = {
        id: `RX-VER-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName,
        doctorName,
        hospitalName: hospitalName || 'Verified Clinical Hospital',
        prescriptionDate,
        fileName,
        fileSize: fileSize || '1.2 MB',
        uploadedAt: new Date().toISOString(),
        status: 'Submitted',
        notes: notes || undefined,
        verifiedByPharmacist: 'Pending R.Ph Verification'
      };

      onPrescriptionUploaded(newPrescription);
      setIsSubmitting(false);
      setUploadSuccess(true);
    }, 600);
  };

  const handleDone = () => {
    setUploadSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/90 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Upload Doctor's Prescription</h3>
              <span className="text-[11px] text-slate-500 font-medium">Safe, Encrypted Clinical Review</span>
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

        {uploadSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-slate-900">Prescription Submitted Successfully!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your medical prescription has been securely routed to our registered on-duty clinical pharmacist for verification.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Patient:</span>
                <span className="text-slate-900 font-bold">{patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prescribing Doctor:</span>
                <span className="text-slate-900 font-bold">{doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Submitted for Pharmacist Review
                </span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold transition cursor-pointer"
            >
              Done & Continue Shopping
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Upload Box */}
            <div className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/70 p-6 text-center transition">
              <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              {fileName ? (
                <div className="space-y-1">
                  <span className="font-bold text-emerald-800 text-xs block">{fileName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{fileSize} • Ready to upload</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="rx-file" className="font-bold text-emerald-700 hover:underline cursor-pointer block text-xs">
                    Choose prescription image or PDF
                  </label>
                  <span className="text-[10px] text-slate-400 block">
                    Supported formats: PDF, JPG, PNG (Max 10MB)
                  </span>
                  <input
                    id="rx-file"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleSimulatedFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={handleChooseSamplePrescription}
                    className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 inline-block cursor-pointer"
                  >
                    + Auto-fill verified sample prescription
                  </button>
                </div>
              )}
            </div>

            {/* Patient & Prescriber Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Patient Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Doctor / Specialist Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="e.g. Dr. Elena Rostova"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Prescription Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="date"
                      value={prescriptionDate}
                      onChange={(e) => setPrescriptionDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Hospital / Clinic (Optional)</label>
                <input
                  type="text"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder="e.g. Mayo Clinic / Apex Central Hospital"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Special Notes for Pharmacist (Optional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need 1 month supply for hypertension & diabetes management..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Trust & Legal Compliance Note */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
              <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Prescriptions are encrypted and processed in accordance with the Drugs and Cosmetics Act & Pharmacy Practice Regulations. Only verified registered pharmacists access clinical records.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !fileName || !patientName || !doctorName}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting Prescription for Review...</span>
              ) : (
                <>
                  <span>Submit Prescription for Pharmacist Verification</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
