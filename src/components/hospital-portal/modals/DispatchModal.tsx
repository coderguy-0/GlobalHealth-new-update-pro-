import React, { useState } from 'react';
import { X, Siren, Navigation, AlertCircle, ShieldAlert } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const DispatchModal: React.FC = () => {
  const { activeModal, closeModal, dispatchAmbulance, ambulances } = useHospitalPortal();

  const availableUnits = ambulances.filter((a) => a.status === 'Available');
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(availableUnits[0]?.id || ambulances[0]?.id || 'AMB-01');
  const [destination, setDestination] = useState('');
  const [paramedic, setParamedic] = useState('Lead EMT Vikrant Sharma, NRP');
  const [isStat, setIsStat] = useState(true);
  const [incidentType, setIncidentType] = useState<'Polytrauma / Road Crash' | 'Acute STEMI Cardiac' | 'Acute Stroke Protocol' | 'Pediatric / Neonatal Emergency'>('Polytrauma / Road Crash');
  const [error, setError] = useState('');

  if (activeModal !== 'dispatch_ambulance') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) {
      setError('Incident location / destination address is required for GPS routing.');
      return;
    }

    dispatchAmbulance(selectedAmbulanceId, `${destination} (${incidentType})`, paramedic, isStat);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#F2CCCC] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2CCCC] bg-[#FFF1F1]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#D64545] text-white animate-pulse">
              <Siren className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#C53939]">STAT Emergency Ambulance Dispatch</h3>
              <p className="text-xs text-[#52635C]">Rapid Response Trauma Telemetry Console</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1.5 rounded-lg text-[#52635C] hover:bg-[#F2CCCC] transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939] text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Select Active Ambulance Unit</label>
            <select
              value={selectedAmbulanceId}
              onChange={(e) => setSelectedAmbulanceId(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#D64545]"
            >
              {ambulances.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} ({a.vehicleNumber}) - {a.ambulanceType} [{a.status}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Incident Category / Code</label>
            <select
              value={incidentType}
              onChange={(e) => setIncidentType(e.target.value as any)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#D64545]"
            >
              <option value="Polytrauma / Road Crash">Code Red: Polytrauma / Major Road Crash</option>
              <option value="Acute STEMI Cardiac">Code STEMI: Acute Myocardial Infarction</option>
              <option value="Acute Stroke Protocol">Code Stroke: Acute Neurological Deficit</option>
              <option value="Pediatric / Neonatal Emergency">Code Pink: Neonatal Critical Resuscitation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Incident Landmark / Destination Address *</label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Ring Road Junction near AIIMS Flyover, Gate 3"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#D64545]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Lead Paramedic / EMT Assigned</label>
            <input
              type="text"
              value={paramedic}
              onChange={(e) => setParamedic(e.target.value)}
              placeholder="Lead Paramedic Name"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#D64545]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#FFF7E6] border border-[#FED88B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#D99718]" />
              <span className="text-xs font-bold text-[#A86E00]">STAT Siren Priority Clearance</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isStat}
                onChange={(e) => setIsStat(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D64545]"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-[#DCEBE4] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#D64545] hover:bg-[#C53939] rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Navigation className="h-4 w-4" />
              <span>STAT Dispatch Unit</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
