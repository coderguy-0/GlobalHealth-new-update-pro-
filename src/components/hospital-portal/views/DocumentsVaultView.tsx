import React, { useState } from 'react';
import {
  FileCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const DocumentsVaultView: React.FC = () => {
  const { documents } = useHospitalPortal();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.issuingAuthority.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Institutional License & Compliance Vault</h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {documents.length} Valid Certificates
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            NABH Hospital Standards, AERB Radiation Safety, Bio-Medical Waste & Fire Safety Clearance Repository
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search certificate title, issuing agency, or license number..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
        />
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]">
                  {doc.status}
                </span>
                <span className="font-mono text-[10px] text-[#52635C]">ID: {doc.id}</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#F6FBF8] text-[#008F68] border border-[#DCEBE4] shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#17221E]">{doc.title}</h3>
                  <p className="text-xs text-[#008F68] font-semibold">{doc.issuingAuthority}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1 text-xs">
                <div className="flex items-center justify-between text-[#52635C]">
                  <span>Certificate No:</span>
                  <span className="font-mono font-bold text-[#17221E]">{doc.licenseNumber}</span>
                </div>
                <div className="flex items-center justify-between text-[#52635C]">
                  <span>Valid Until:</span>
                  <span className="font-mono font-bold text-[#17221E]">{doc.expiryDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCEBE4] flex items-center justify-between">
              <span className="text-[11px] text-[#52635C]">Encrypted PDF Vault</span>
              <button
                onClick={() => alert(`Downloading verified institutional credential: ${doc.title}`)}
                className="flex items-center gap-1.5 text-xs font-bold text-[#008F68] hover:underline cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Verify & Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
