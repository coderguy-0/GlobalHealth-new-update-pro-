import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Upload, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  X 
} from 'lucide-react';
import { RegulatoryDocument } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface ComplianceDocumentsTabProps {
  documents: RegulatoryDocument[];
  onDocumentsUpdated: () => void;
}

export const ComplianceDocumentsTab: React.FC<ComplianceDocumentsTabProps> = ({
  documents,
  onDocumentsUpdated
}) => {
  const [isUploadModal, setIsUploadModal] = useState(false);
  const [docType, setDocType] = useState<RegulatoryDocument['type']>('Drug License (Form 20B/21B)');
  const [docNumber, setDocNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('State Drugs Standard Control Organization');
  const [expiryDate, setExpiryDate] = useState('2029-12-31');

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    PharmacyPortalService.addDocument({
      type: docType,
      documentNumber: docNumber || 'REG-2026-88102',
      issuingAuthority,
      state: 'Under Review',
      expiryDate,
      fileName: `${docType.replace(/\s+/g, '_')}_Document.pdf`,
      fileSize: '1.5 MB'
    });
    setIsUploadModal(false);
    onDocumentsUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Statutory Verification Vault</span>
          </div>
          <h2 className="text-base font-black text-white">Regulatory Licenses & Compliance Vault</h2>
          <p className="text-xs text-slate-400">
            Mandatory state licenses, pharmacist registration certificates, premises clearances, and annual inspection reports.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-teal-950/50"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document / Renewal</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map(doc => (
          <div key={doc.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-teal-500/40 transition">
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{doc.type}</h3>
                  <div className="text-[10px] text-teal-300 font-mono">{doc.documentNumber}</div>
                </div>
              </div>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                doc.state === 'Verified'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : doc.state === 'Expiring Soon'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {doc.state}
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-400">
              <div>Issuing Body: <span className="text-slate-200">{doc.issuingAuthority}</span></div>
              <div className="flex justify-between">
                <span>Verified: <strong className="text-slate-300">{doc.verifiedAt || doc.uploadedAt}</strong></span>
                {doc.expiryDate && (
                  <span>Expires: <strong className="text-teal-300 font-mono">{doc.expiryDate}</strong></span>
                )}
              </div>
            </div>

            {doc.reviewerNotes && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <strong className="text-slate-300">Auditor Notes:</strong> {doc.reviewerNotes}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-[10px] text-slate-500 font-mono">{doc.fileName} ({doc.fileSize})</span>
              <button
                onClick={() => alert(`Downloading verified copy of ${doc.type}`)}
                className="flex items-center gap-1 text-teal-400 hover:underline font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-black text-white">Upload Regulatory Document</h3>
              <button onClick={() => setIsUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Document Type *</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as RegulatoryDocument['type'])}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Drug License (Form 20B/21B)">Drug License (Form 20B/21B)</option>
                  <option value="Pharmacist Registration Certificate">Pharmacist Registration Certificate (PCI)</option>
                  <option value="Premises Fire &amp; Safety Clearance">Premises Fire &amp; Safety Clearance</option>
                  <option value="GST Registration">GST Registration Certificate</option>
                  <option value="FSSAI License">FSSAI License</option>
                  <option value="Business Establishment Proof">Business Establishment Proof</option>
                  <option value="Bank Account Verification">Bank Account Verification</option>
                  <option value="Identity Proof">Identity Proof</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Certificate / License Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-ND-2024-88910"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Issuing Authority *</label>
                <input
                  type="text"
                  required
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Expiry Date</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
