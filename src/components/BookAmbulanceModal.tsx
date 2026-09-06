import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  X,
  Radio,
  Share2,
  Navigation,
  Compass,
  Zap,
  Check,
  Building2,
  Copy,
  Crosshair,
  Satellite
} from 'lucide-react';
import { Hospital } from '../types';
import { useHospitalPortal } from '../context/HospitalContext';
import { getAccurateUserLocation } from '../utils/geolocationService';

interface BookAmbulanceModalProps {
  hospital: Hospital;
  onClose: () => void;
  initialType?: 'ALS' | 'BLS' | 'NICU' | 'PT';
}

export const BookAmbulanceModal: React.FC<BookAmbulanceModalProps> = ({
  hospital,
  onClose,
  initialType = 'ALS'
}) => {
  const { ambulances, dispatchAmbulance, addAuditLog } = useHospitalPortal();

  // Booking Form State
  const [ambulanceType, setAmbulanceType] = useState<'ALS' | 'BLS' | 'NICU' | 'PT'>(initialType);
  const [urgency, setUrgency] = useState<'stat' | 'urgent' | 'scheduled'>('stat');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('14:00');

  const [pickupAddress, setPickupAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [contactPhone, setContactPhone] = useState('');
  const [chiefEmergency, setChiefEmergency] = useState('Chest Pain / Suspected Cardiac Arrest');
  const [notes, setNotes] = useState('');
  const [gpsDetecting, setGpsDetecting] = useState(false);

  // Dispatch Confirmation & Live Telemetry State
  const [dispatched, setDispatched] = useState(false);
  const [dispatchInfo, setDispatchInfo] = useState<{
    dispatchId: string;
    unitId: string;
    vehicleModel: string;
    paramedicLead: string;
    paramedicPhone: string;
    etaMinutes: number;
    dispatchedAt: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-detect High-Precision GPS Location
  const handleAutoDetectLocation = async () => {
    setGpsDetecting(true);
    try {
      const coords = await getAccurateUserLocation();
      setGpsDetecting(false);
      
      const addr = coords.exactAddress || `Near ${hospital.city}`;
      setPickupAddress(addr);
      
      const accText = coords.accuracy ? ` (±${Math.round(coords.accuracy)}m GPS Accuracy)` : '';
      setLandmark(`Exact GPS Telemetry: ${coords.latitude.toFixed(6)}°N, ${coords.longitude.toFixed(6)}°E${accText}`);
    } catch {
      setGpsDetecting(false);
      setPickupAddress(`Main Boulevard, ${hospital.city}, ${hospital.country}`);
      setLandmark('City Center / Metro Junction');
    }
  };

  // Submit Ambulance Dispatch
  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress || !patientName || !contactPhone) return;

    const availableUnit = ambulances.find((a) => a.status === 'Available') || ambulances[0];
    const unitName = availableUnit?.vehicleNumber || (ambulanceType === 'ALS' ? 'ALS-04 (Mercedes ICU)' : 'BLS-02 (Toyota HiAce)');
    const paramedic = availableUnit?.paramedicName || 'Paramedic Capt. Robert Evans, EMT-P';
    const dispatchId = `AMB-DISP-${Math.floor(100000 + Math.random() * 900000)}`;
    const eta = urgency === 'stat' ? 7 : urgency === 'urgent' ? 18 : 35;

    // Dispatch in Hospital Context
    if (availableUnit) {
      dispatchAmbulance(availableUnit.id, pickupAddress, paramedic, urgency === 'stat');
    }
    if (addAuditLog) {
      addAuditLog(
        'Public Emergency Ambulance Booked',
        'Ambulance Fleet',
        `Dispatched ${unitName} to ${pickupAddress} for patient ${patientName} (${chiefEmergency}).`
      );
    }

    setDispatchInfo({
      dispatchId,
      unitId: unitName,
      vehicleModel: ambulanceType === 'ALS' ? 'Mercedes-Benz Sprinter Mobile ICU' : ambulanceType === 'NICU' ? 'Custom Pediatric Care Unit' : 'Force Citiline ALS Ambulance',
      paramedicLead: paramedic,
      paramedicPhone: hospital.contact || '+1 800 555 0199',
      etaMinutes: eta,
      dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    setDispatched(true);
  };

  const handleCopyTracking = () => {
    if (!dispatchInfo) return;
    navigator.clipboard.writeText(
      `https://globalhealth.org/track-ambulance/${dispatchInfo.dispatchId}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 text-white font-black backdrop-blur-xs shrink-0">
              <ShieldAlert className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded text-white">
                  24/7 Rapid Dispatch
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-100">
                  <Radio className="h-3 w-3 text-emerald-300 animate-ping" />
                  Live GPS Active
                </span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight">
                Emergency Ambulance Dispatch
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Facility Sub-Header Banner */}
        <div className="bg-rose-50 border-b border-rose-100 px-5 py-3 flex items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 text-rose-600 shrink-0" />
            <span className="font-bold text-slate-900 truncate">{hospital.name}</span>
            <span className="text-rose-600 font-semibold hidden sm:inline">• {hospital.traumaLevel || 'Level 1 Trauma Center'}</span>
          </div>
          <a
            href={`tel:${hospital.emergencyHotline || hospital.contact}`}
            className="flex items-center gap-1 font-bold text-rose-700 bg-white border border-rose-200 px-2.5 py-1 rounded-lg hover:bg-rose-100 transition shrink-0"
          >
            <Phone className="h-3 w-3 text-rose-600" />
            <span>{hospital.emergencyHotline || hospital.contact}</span>
          </a>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {!dispatched ? (
            <form onSubmit={handleDispatch} className="space-y-5">
              
              {/* Service Tier Selector */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  1. Select Ambulance Capability Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAmbulanceType('ALS')}
                    className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      ambulanceType === 'ALS'
                        ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-rose-600 text-white font-bold text-xs shrink-0 mt-0.5">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900">ALS Mobile ICU</span>
                        <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded">CRITICAL</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Ventilator, Defibrillator, Infusion Pumps & Critical Care Paramedic.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmbulanceType('BLS')}
                    className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      ambulanceType === 'BLS'
                        ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-600 text-white font-bold text-xs shrink-0 mt-0.5">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-900">BLS Emergency</span>
                        <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">STANDARD</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Oxygen delivery, AED, trauma immobilization & EMT team.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmbulanceType('NICU')}
                    className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      ambulanceType === 'NICU'
                        ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-600 text-white font-bold text-xs shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900">Neonatal / Pediatric ICU</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Transport incubator & specialized pediatric life support.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmbulanceType('PT')}
                    className={`p-3 rounded-2xl border text-left transition flex items-start gap-3 cursor-pointer ${
                      ambulanceType === 'PT'
                        ? 'border-rose-600 bg-rose-50/70 ring-2 ring-rose-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white font-bold text-xs shrink-0 mt-0.5">
                      <Navigation className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900">Patient Stretcher Transport</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Non-acute hospital transfers, dialysis & wheelchair mobility.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Urgency Level */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  2. Priority Level & Urgency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('stat')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      urgency === 'stat'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Radio className="h-3.5 w-3.5 animate-ping" />
                    <span>STAT (Immediate)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      urgency === 'urgent'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Within 30 Mins</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUrgency('scheduled')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      urgency === 'scheduled'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>Scheduled</span>
                  </button>
                </div>

                {urgency === 'scheduled' && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Pickup Date</span>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Pickup Time</span>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-2 text-xs font-semibold text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Pickup Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                    3. Exact Pickup Location & Landmark *
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={gpsDetecting}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                  >
                    <Compass className={`h-3 w-3 ${gpsDetecting ? 'animate-spin' : ''}`} />
                    <span>{gpsDetecting ? 'Detecting GPS...' : 'Use My Live GPS Location'}</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-rose-500" />
                    <input
                      type="text"
                      required
                      placeholder="Street address, building name, flat number..."
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Landmark or specific gate (e.g., Near City Mall Gate 2)"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Patient Details & Chief Emergency */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 block">
                  4. Patient & Emergency Details *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Patient Full Name *"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Age"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="Contact Mobile Number (for Driver) *"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={chiefEmergency}
                    onChange={(e) => setChiefEmergency(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none font-medium"
                  >
                    <option>Chest Pain / Suspected Cardiac Arrest</option>
                    <option>Stroke / Facial Droop / Slurred Speech</option>
                    <option>Severe Trauma / Road Accident / Fracture</option>
                    <option>Breathing Distress / Severe Asthma</option>
                    <option>Pregnancy / Active Labor Delivery</option>
                    <option>Unconscious / Seizures / Severe Fever</option>
                    <option>Routine Inter-Hospital ICU Transfer</option>
                    <option>Other Critical Emergency</option>
                  </select>
                </div>

                <textarea
                  rows={2}
                  placeholder="Special paramedic notes (e.g. 4th floor, elevator working, patient needs oxygen)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-none"
                />
              </div>

              {/* Submit Dispatch CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-rose-600 hover:bg-rose-700 text-white py-3.5 text-sm font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="h-5 w-5" />
                  <span>CONFIRM & DISPATCH AMBULANCE NOW</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-2">
                  Emergency dispatch commands are relayed directly to {hospital.name}'s active ambulance bay and trauma team.
                </p>
              </div>
            </form>
          ) : (
            /* Live Dispatch Tracking Screen */
            <div className="space-y-5 animate-in zoom-in-95 duration-200">
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="font-extrabold text-sm text-white">AMBULANCE DISPATCHED & EN ROUTE</span>
                  </div>
                  <span className="font-mono text-xs text-rose-400 font-bold bg-slate-800 px-2 py-0.5 rounded">
                    {dispatchInfo?.dispatchId}
                  </span>
                </div>

                {/* Big ETA Banner */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Arrival</span>
                    <span className="text-2xl font-black text-emerald-400">~{dispatchInfo?.etaMinutes} Mins</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Unit Assigned</span>
                    <span className="text-xs font-black text-white truncate block mt-1">{dispatchInfo?.unitId}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Paramedic Lead</span>
                    <span className="text-xs font-bold text-slate-200 truncate block mt-1">{dispatchInfo?.paramedicLead.split(',')[0]}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination</span>
                    <span className="text-xs font-bold text-rose-400 truncate block mt-1">ER Trauma Bay</span>
                  </div>
                </div>

                {/* Route Snapshot */}
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Pickup Target</span>
                      <p className="font-semibold text-white">{pickupAddress}</p>
                      {landmark && <p className="text-[11px] text-slate-400">Landmark: {landmark}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 pt-2 border-t border-slate-700/60">
                    <Building2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Emergency Center</span>
                      <p className="font-semibold text-white">{hospital.name}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct 1-Tap Call & Share Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${dispatchInfo?.paramedicPhone}`}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-xs font-bold transition shadow-xs"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Paramedic Driver</span>
                </a>

                <button
                  onClick={handleCopyTracking}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 py-3 text-xs font-bold transition cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span className="text-emerald-600">Tracking Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4 text-slate-500" />
                      <span>Share Live Telemetry Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Close / Return Button */}
              <button
                onClick={onClose}
                className="w-full rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 text-xs font-bold transition cursor-pointer"
              >
                Close Tracking Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
