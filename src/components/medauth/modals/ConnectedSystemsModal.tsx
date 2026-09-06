import React, { useState } from 'react';
import {
  Server,
  CheckCircle2,
  Lock,
  RefreshCw,
  Copy,
  Check,
  X,
  ExternalLink,
  Shield,
  Activity,
  Layers,
  Database
} from 'lucide-react';
import { DoctorProfile } from '../../../types/medauth';

interface ConnectedSystemsModalProps {
  doctor: DoctorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectedSystemsModal: React.FC<ConnectedSystemsModalProps> = ({
  doctor,
  isOpen,
  onClose
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [currentToken, setCurrentToken] = useState(doctor.integrationToken);

  if (!isOpen) return null;

  const handleCopyToken = () => {
    navigator.clipboard.writeText(currentToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleRotateToken = () => {
    setIsRotating(true);
    setTimeout(() => {
      const newToken = `mat_live_${doctor.npiNumber}_${Math.random().toString(36).substring(2, 8)}_sec`;
      setCurrentToken(newToken);
      setIsRotating(false);
    }, 800);
  };

  const connectedServices = [
    {
      id: 'ehr',
      name: 'Hospital EHR & Inpatient Gateway',
      protocol: 'FHIR R4 / HL7 v2.5.1',
      status: 'Connected',
      latency: '24ms',
      lastSync: 'Just now'
    },
    {
      id: 'lis',
      name: 'Laboratory Information System (LIS)',
      protocol: 'LOINC / ASTM E1394 Direct',
      status: 'Connected',
      latency: '38ms',
      lastSync: '2 mins ago'
    },
    {
      id: 'rx',
      name: 'e-Prescription Routing Network',
      protocol: 'NCPDP SCRIPT v2017071 (Surescripts)',
      status: 'Connected',
      latency: '45ms',
      lastSync: '5 mins ago'
    },
    {
      id: 'pacs',
      name: 'Radiology PACS / DICOM Bridge',
      protocol: 'DICOMweb / WADO-RS',
      status: 'Connected',
      latency: '52ms',
      lastSync: '12 mins ago'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-1">
                Enterprise Clinical Infrastructure
              </span>
              <h2 className="text-xl font-extrabold text-white">Connected Systems & Integrations</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Active FHIR bridges, LIS pathology gateways, and automated e-Prescription routes.
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* Integration Token Area */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">Practitioner API Integration Secret</span>
                <span className="text-[11px] text-slate-500">
                  Scoped to Dr. Alexandra Chen (NPI: {doctor.npiNumber})
                </span>
              </div>
              <button
                onClick={handleRotateToken}
                disabled={isRotating}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                <span>Rotate Secret</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentToken}
                className="w-full font-mono text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 select-all"
              />
              <button
                onClick={handleCopyToken}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shrink-0 cursor-pointer shadow-2xs"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Connected Services List */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
              Active Enterprise Health Links (4 Connected)
            </span>

            <div className="space-y-2.5">
              {connectedServices.map((service) => (
                <div
                  key={service.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900">{service.name}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{service.status}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Protocol: {service.protocol} • Ping: {service.latency}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Sync: {service.lastSync}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End TLS 1.3 + HIPAA Encrypted Bridge</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
