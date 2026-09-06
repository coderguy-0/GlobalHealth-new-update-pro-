import React, { useState, useEffect } from 'react';
import { X, Ambulance, AlertCircle, Phone, Navigation, ShieldCheck, Wrench } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { PortalAmbulance } from '../../../types/hospitalPortal';

const COMMON_EQUIPMENT = [
  'Transport Ventilator',
  'Defibrillator / External Pacemaker',
  'Multipara Cardiac Monitor',
  'Syringe Infusion Pumps',
  'Type D Medical Oxygen Cylinders',
  'Suction Unit & Intubation Kit',
  'Spinal Immobilization Spine Board',
  'Automated CPR Device',
  'Neonatal Transport Incubator'
];

export const AmbulanceModal: React.FC = () => {
  const { activeModal, modalPayload, closeModal, addAmbulance, updateAmbulance } = useHospitalPortal();

  const isEdit = Boolean(modalPayload && modalPayload.id);

  const [vehicleNumber, setVehicleNumber] = useState('');
  const [ambulanceType, setAmbulanceType] = useState<PortalAmbulance['ambulanceType']>('Advanced Life Support (ALS)');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [paramedicName, setParamedicName] = useState('');
  const [status, setStatus] = useState<PortalAmbulance['status']>('Available');
  const [currentLocation, setCurrentLocation] = useState('Central Emergency Bay 1');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([
    'Transport Ventilator',
    'Defibrillator / External Pacemaker',
    'Multipara Cardiac Monitor'
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeModal === 'ambulance_modal') {
      if (modalPayload && modalPayload.id) {
        const amb: any = modalPayload;
        setVehicleNumber(amb.vehicleNumber || '');
        setAmbulanceType(amb.ambulanceType || 'Advanced Life Support (ALS)');
        setDriverName(amb.driverName || (amb.driverContact ? 'Senior Fleet Driver' : ''));
        setDriverPhone(amb.driverPhone || amb.driverContact || '');
        setParamedicName(amb.paramedicName || '');
        setStatus(amb.status || 'Available');
        setCurrentLocation(amb.currentLocation || 'Depot Bay');
        setSelectedEquipment(
          Array.isArray(amb.equipmentList) && amb.equipmentList.length > 0
            ? amb.equipmentList
            : ['Transport Ventilator', 'Defibrillator / External Pacemaker']
        );
      } else {
        setVehicleNumber(`DL-${Math.floor(10 + Math.random() * 89)}-AM-${Math.floor(1000 + Math.random() * 9000)}`);
        setAmbulanceType('Advanced Life Support (ALS)');
        setDriverName('Ramesh Kumar');
        setDriverPhone('+91 98110 99881');
        setParamedicName('Lead EMT Vikas Malhotra');
        setStatus('Available');
        setCurrentLocation('Hospital Emergency Fleet Bay');
        setSelectedEquipment([
          'Transport Ventilator',
          'Defibrillator / External Pacemaker',
          'Multipara Cardiac Monitor',
          'Type D Medical Oxygen Cylinders'
        ]);
      }
      setError('');
    }
  }, [activeModal, modalPayload]);

  if (activeModal !== 'ambulance_modal') return null;

  const toggleEquipment = (eq: string) => {
    if (selectedEquipment.includes(eq)) {
      setSelectedEquipment(selectedEquipment.filter((item) => item !== eq));
    } else {
      setSelectedEquipment([...selectedEquipment, eq]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNumber.trim() || !driverPhone.trim() || !paramedicName.trim()) {
      setError('Vehicle Registration, Driver Contact, and Paramedic Name are required.');
      return;
    }

    if (isEdit) {
      updateAmbulance(modalPayload.id, {
        vehicleNumber,
        ambulanceType,
        driverName: driverName || 'Senior Fleet Driver',
        driverPhone,
        paramedicName,
        status,
        currentLocation,
        equipmentList: selectedEquipment,
        ...(modalPayload.driverContact ? { driverContact: driverPhone } : {})
      } as any);
    } else {
      addAmbulance({
        vehicleNumber,
        ambulanceType,
        driverName: driverName || 'Senior Fleet Driver',
        driverPhone,
        paramedicName,
        status,
        currentLocation,
        equipmentList: selectedEquipment
      });
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#F1FAF6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#008F68] text-white">
              <Ambulance className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">
                {isEdit ? 'Edit Ambulance Fleet Unit' : 'Commission Ambulance to Fleet'}
              </h3>
              <p className="text-xs text-[#52635C]">
                Vehicle Telemetry, Life Support Class, Crew Roster & Onboard Equipment
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-[#52635C] hover:bg-[#DCEBE4] transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939] text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">
                Vehicle Registration Number *
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. DL-01-AB-9901"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono uppercase text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Ambulance Life Support Class</label>
              <select
                value={ambulanceType}
                onChange={(e) => setAmbulanceType(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Advanced Life Support (ALS)">Advanced Life Support (ALS)</option>
                <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
                <option value="Neonatal Intensive Care (NICU Ambulance)">Neonatal Intensive Care (NICU Ambulance)</option>
                <option value="Patient Transport">Patient Transport / Non-Emergency</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Assigned Driver Name</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Driver Emergency Phone *</label>
              <input
                type="tel"
                required
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="e.g. +91 98110 99881"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Lead EMT / Paramedic Officer *</label>
              <input
                type="text"
                required
                value={paramedicName}
                onChange={(e) => setParamedicName(e.target.value)}
                placeholder="e.g. Lead EMT Vikas Malhotra"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Fleet Unit Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Available">Available (Standby Depot)</option>
                <option value="Dispatched / In Transit">Dispatched / In Transit</option>
                <option value="At Incident Scene">At Incident Scene</option>
                <option value="Returning with Patient">Returning with Patient</option>
                <option value="Maintenance">Under Maintenance / Inspection</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Base Depot / Parking Bay Location</label>
            <input
              type="text"
              value={currentLocation}
              onChange={(e) => setCurrentLocation(e.target.value)}
              placeholder="e.g. Ground Floor Trauma Bay 3"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          {/* Onboard Equipment Checklist */}
          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-2">
              Equipped Critical Care & Life Support Hardware
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#F6FBF8] p-3 rounded-xl border border-[#DCEBE4]">
              {COMMON_EQUIPMENT.map((eq) => {
                const isChecked = selectedEquipment.includes(eq);
                return (
                  <label
                    key={eq}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs transition cursor-pointer border ${
                      isChecked
                        ? 'bg-white border-[#008F68] text-[#17221E] font-semibold shadow-xs'
                        : 'border-transparent text-[#52635C] hover:bg-white/60'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleEquipment(eq)}
                      className="h-4 w-4 rounded text-[#008F68] focus:ring-[#008F68]"
                    />
                    <span>{eq}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE4]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Ambulance className="h-4 w-4" />
              <span>{isEdit ? 'Save Fleet Updates' : 'Add to Fleet Roster'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
