import React, { useState, useEffect, useRef } from 'react';
import {
  Siren,
  AlertTriangle,
  Flame,
  Droplets,
  Phone,
  Radio,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Activity,
  Heart,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Users,
  BedDouble,
  FileSpreadsheet,
  Download,
  Printer,
  X
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const EmergencyView: React.FC = () => {
  const { currentHospital, toggleRedAlert, ambulances, bloodBank, openModal } = useHospitalPortal();

  // Active Sub-Station State
  const [activeStation, setActiveStation] = useState<'OVERVIEW' | 'ESI_TRIAGE' | 'CODE_BLUE'>('OVERVIEW');

  // ESI Triage Calculator State
  const [triagePatientName, setTriagePatientName] = useState('Arthur Pendelton');
  const [triageAge, setTriageAge] = useState('58');
  const [triageChiefComplaint, setTriageChiefComplaint] = useState('Severe crushing retrosternal chest pain with diaphoresis');
  const [isLifeThreatening, setIsLifeThreatening] = useState(false); // ESI 1
  const [isHighRiskOrConfused, setIsHighRiskOrConfused] = useState(true); // ESI 2
  const [expectedResources, setExpectedResources] = useState<'NONE' | 'ONE' | 'MANY'>('MANY'); // ESI 3, 4, 5
  const [heartRate, setHeartRate] = useState(118);
  const [respRate, setRespRate] = useState(24);
  const [spo2, setSpo2] = useState(93);
  const [painScale, setPainScale] = useState(8);
  const [triagedList, setTriagedList] = useState<any[]>([
    {
      id: 'TR-101',
      name: 'Arthur Pendelton (58y/M)',
      complaint: 'Severe crushing retrosternal chest pain',
      esiLevel: 2,
      assignedBay: 'Trauma Bay 1 (STAT)',
      vitals: 'HR 118 | BP 168/98 | SpO2 93%',
      status: 'Admitted to Bay 1',
      time: '09:42 AM'
    },
    {
      id: 'TR-102',
      name: 'Elena Rostova (29y/F)',
      complaint: 'Acute asthma exacerbation, refractory to albuterol',
      esiLevel: 2,
      assignedBay: 'Resuscitation Bay 2',
      vitals: 'HR 110 | BP 130/82 | SpO2 91%',
      status: 'Nebulizer Therapy Active',
      time: '09:50 AM'
    },
    {
      id: 'TR-103',
      name: 'Michael Chang (34y/M)',
      complaint: 'Deep forearm laceration with controlled bleeding',
      esiLevel: 4,
      assignedBay: 'Fast-Track Bay 4',
      vitals: 'HR 78 | BP 122/76 | SpO2 99%',
      status: 'Suture Cart Assigned',
      time: '09:55 AM'
    }
  ]);

  // Code Blue Conductor State
  const [isCodeBlueRunning, setIsCodeBlueRunning] = useState(false);
  const [cprSeconds, setCprSeconds] = useState(120); // 2 min cycle
  const [totalCodeSeconds, setTotalCodeSeconds] = useState(0);
  const [shocksDelivered, setShocksDelivered] = useState(0);
  const [lastEpinephrineMin, setLastEpinephrineMin] = useState(0);
  const [selectedEnergyJoules, setSelectedEnergyJoules] = useState('200 J (Biphasic)');
  const [codeLogs, setCodeLogs] = useState<{ time: string; action: string; note: string }[]>([
    { time: '00:00', action: 'CODE BLUE ACTIVATED', note: 'Unresponsive in Bed 4, Pulseless VT/VF on monitor' },
    { time: '00:15', action: 'HIGH-QUALITY CPR INITIATED', note: 'Compression depth > 5cm, rate 110/min' }
  ]);

  // CPR Timer Loop
  useEffect(() => {
    let interval: any = null;
    if (isCodeBlueRunning) {
      interval = setInterval(() => {
        setTotalCodeSeconds((prev) => prev + 1);
        setCprSeconds((prev) => {
          if (prev <= 1) {
            // Sound or trigger rhythm check
            return 120; // reset 2 min cycle
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCodeBlueRunning]);

  // Compute calculated ESI Level
  const computeEsiLevel = () => {
    if (isLifeThreatening) return 1;
    if (isHighRiskOrConfused || painScale >= 8 || spo2 < 92 || heartRate > 120 || respRate > 26) return 2;
    if (expectedResources === 'MANY') return 3;
    if (expectedResources === 'ONE') return 4;
    return 5;
  };

  const calculatedEsi = computeEsiLevel();

  const handleCommitTriage = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `TR-${Math.floor(100 + Math.random() * 900)}`,
      name: `${triagePatientName} (${triageAge}y)`,
      complaint: triageChiefComplaint,
      esiLevel: calculatedEsi,
      assignedBay: calculatedEsi <= 2 ? 'Trauma Bay 1 (STAT)' : calculatedEsi === 3 ? 'Acute Bay 3' : 'Fast-Track Bay 4',
      vitals: `HR ${heartRate} | SpO2 ${spo2}% | RR ${respRate}`,
      status: calculatedEsi === 1 ? 'STAT Resuscitation' : 'Triage Registered',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTriagedList((prev) => [newEntry, ...prev]);
    setTriagePatientName('');
    setTriageChiefComplaint('');
  };

  const handleLogCodeAction = (action: string, note: string) => {
    const min = Math.floor(totalCodeSeconds / 60);
    const sec = totalCodeSeconds % 60;
    const timeStr = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    setCodeLogs((prev) => [{ time: timeStr, action, note }, ...prev]);
  };

  const handleDeliverShock = () => {
    setShocksDelivered((prev) => prev + 1);
    handleLogCodeAction('DEFIBRILLATION SHOCK DELIVERED', `Energy: ${selectedEnergyJoules}. Clear area, resume compressions immediately.`);
  };

  const handlePushEpi = () => {
    setLastEpinephrineMin(Math.floor(totalCodeSeconds / 60));
    handleLogCodeAction('EPINEPHRINE 1mg IV/IO PUSH', '1mg (1:10,000) followed by 20mL normal saline flush & arm elevation.');
  };

  const handlePushAmiodarone = (dose: string) => {
    handleLogCodeAction(`AMIODARONE ${dose} IV PUSH`, `Refractory VF/pVT antiarrhythmic administration in D5W.`);
  };

  const formatCodeTime = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Code Red Banner Alert */}
      <div
        className={`p-6 rounded-2xl border transition shadow-xs ${
          currentHospital.redAlertActive
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-2xl ${
                currentHospital.redAlertActive
                  ? 'bg-rose-700 text-white animate-pulse'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              <Siren className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  {currentHospital.redAlertActive
                    ? 'FACILITY CODE RED DISASTER PROTOCOL ENGAGED'
                    : 'Emergency Department & Level-1 Disaster Command'}
                </h1>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    currentHospital.redAlertActive
                      ? 'bg-rose-700 text-white animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {currentHospital.redAlertActive ? 'STAT ACTIVE' : 'LEVEL-1 READY'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {currentHospital.redAlertActive
                  ? 'Mass casualty protocol engaged: Trauma teams on immediate standby, blood bank crossmatch queues expedited, emergency triage rooms unlocked.'
                  : 'Facility is operating under Level 1 Trauma Center standards. All 24/7 crash teams and on-call trauma surgeons are ready for instantaneous activation.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={toggleRedAlert}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-xs cursor-pointer ${
                currentHospital.redAlertActive
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-rose-700 hover:bg-rose-800'
              }`}
            >
              {currentHospital.redAlertActive ? 'Stand Down Red Alert' : 'Trigger Facility Code Red'}
            </button>
            <button
              onClick={() => openModal('dispatch_ambulance')}
              className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              STAT Dispatch
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Station Switcher Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveStation('OVERVIEW')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeStation === 'OVERVIEW'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Trauma Bays & Resuscitation</span>
        </button>

        <button
          onClick={() => setActiveStation('ESI_TRIAGE')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeStation === 'ESI_TRIAGE'
              ? 'bg-emerald-700 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>ESI Level 1-5 Triage Station</span>
        </button>

        <button
          onClick={() => setActiveStation('CODE_BLUE')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeStation === 'CODE_BLUE'
              ? 'bg-rose-700 text-white shadow-2xs animate-pulse'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Code Blue CPR Conductor & Metronome</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. OVERVIEW: Trauma Bays, Disaster Teams, Blood Bank Telemetry */}
      {/* ------------------------------------------------------------- */}
      {activeStation === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Panel 1: Trauma Bays */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Trauma Bays (ER 1-4)</h3>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded">
                  24/7 Resuscitation
                </span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Bay 1 (Trauma STAT)</span>
                    <p className="text-[10px] text-rose-700 font-bold">Occupied • Arthur Pendelton (58y/M)</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                    STEMI PROTOCOL
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Bay 2 (Resuscitation)</span>
                    <p className="text-[10px] text-emerald-700 font-bold">Available • Cleaned & Stocked</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    READY
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">Bay 3 (Pediatric Trauma)</span>
                    <p className="text-[10px] text-emerald-700 font-bold">Available • Broselow Cart Ready</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    READY
                  </span>
                </div>
              </div>
            </div>

            {/* Panel 2: Blood Bank STAT reserves */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">STAT Blood Supply</h3>
                <span className="text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200 px-2 py-0.5 rounded">
                  O-Neg Priority
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {bloodBank.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-900">{item.bloodGroup}</span>
                    <div className="font-mono text-sm font-bold text-slate-900 mt-0.5">{item.prbcUnits} Units</div>
                    <span className="text-[10px] text-slate-500">PRBC In Stock</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel 3: Rapid Response & Trauma Teams */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rapid Response Teams</h3>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                  Active Shift
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Team Alpha (Code Blue)</span>
                    <p className="text-[10px] text-slate-500">Lead: Dr. Elena Rostova (Intensivist)</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Team Bravo (Trauma Surgery)</span>
                    <p className="text-[10px] text-slate-500">Lead: Dr. Marcus Brody (Trauma Chief)</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Code Stroke Rapid Team</span>
                    <p className="text-[10px] text-slate-500">CT Brain & tPA Interventional Ready</p>
                  </div>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Real-Time Live Triage Queue Table */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Current Emergency Inflow & Triage Queue</h3>
                <p className="text-xs text-slate-500">Ranked by Emergency Severity Index (ESI 1-5)</p>
              </div>
              <button
                onClick={() => setActiveStation('ESI_TRIAGE')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                + Triage New Inflow Patient
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                    <th className="pb-2 px-2">Token</th>
                    <th className="pb-2 px-2">Patient</th>
                    <th className="pb-2 px-2">Chief Complaint</th>
                    <th className="pb-2 px-2">ESI Acuity</th>
                    <th className="pb-2 px-2">Assigned ER Location</th>
                    <th className="pb-2 px-2">Biometrics</th>
                    <th className="pb-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {triagedList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-2 font-mono font-bold text-emerald-700">{item.id}</td>
                      <td className="py-2.5 px-2 font-bold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-2 text-slate-700">{item.complaint}</td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            item.esiLevel === 1
                              ? 'bg-rose-700 text-white animate-pulse'
                              : item.esiLevel === 2
                              ? 'bg-orange-600 text-white'
                              : item.esiLevel === 3
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          ESI Level {item.esiLevel}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 font-medium text-slate-800">{item.assignedBay}</td>
                      <td className="py-2.5 px-2 font-mono text-[11px] text-slate-600">{item.vitals}</td>
                      <td className="py-2.5 px-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-[10px] text-slate-800">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. ESI TRIAGE CALCULATOR & INTAKE STATION                       */}
      {/* ------------------------------------------------------------- */}
      {activeStation === 'ESI_TRIAGE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Triage Evaluation (7 Cols) */}
          <form onSubmit={handleCommitTriage} className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900">Emergency Severity Index (ESI v4) Triage Wizard</h2>
              <p className="text-xs text-slate-500">Algorithmic 5-tier clinical intake and danger-zone screening</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={triagePatientName}
                  onChange={(e) => setTriagePatientName(e.target.value)}
                  placeholder="e.g. Arthur Pendelton"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                <input
                  type="number"
                  required
                  value={triageAge}
                  onChange={(e) => setTriageAge(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaint & Onset</label>
              <textarea
                rows={2}
                required
                value={triageChiefComplaint}
                onChange={(e) => setTriageChiefComplaint(e.target.value)}
                placeholder="Describe acute symptoms, duration, radiating patterns..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600 resize-none"
              />
            </div>

            {/* Algorithmic Decision Blocks */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                Decision Point A & B: Life Support & High Risk Check
              </span>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLifeThreatening}
                  onChange={(e) => setIsLifeThreatening(e.target.checked)}
                  className="rounded text-rose-600 accent-rose-600 h-4 w-4"
                />
                <span className="text-slate-800 font-bold">
                  Decision A: Requires immediate life-saving intervention? (Unresponsive, Intubated, Cardiac Arrest, Apnea)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHighRiskOrConfused}
                  onChange={(e) => setIsHighRiskOrConfused(e.target.checked)}
                  className="rounded text-orange-600 accent-orange-600 h-4 w-4"
                />
                <span className="text-slate-800 font-bold">
                  Decision B: High-risk situation, new confusion/lethargy, or severe respiratory distress?
                </span>
              </label>
            </div>

            {/* Vital Signs Danger Zone Input */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">HEART RATE (BPM)</label>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">RESP RATE (/MIN)</label>
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">SpO2 SAT (%)</label>
                <input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">PAIN SCORE (1-10)</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={painScale}
                  onChange={(e) => setPainScale(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Decision C: Predicted Diagnostic Resources Needed
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setExpectedResources('MANY')}
                  className={`p-2 rounded-xl border font-bold transition cursor-pointer ${
                    expectedResources === 'MANY'
                      ? 'bg-amber-100 border-amber-400 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  Many (2+ Resources: Labs + ECG + CT)
                </button>
                <button
                  type="button"
                  onClick={() => setExpectedResources('ONE')}
                  className={`p-2 rounded-xl border font-bold transition cursor-pointer ${
                    expectedResources === 'ONE'
                      ? 'bg-blue-100 border-blue-400 text-blue-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  One (X-Ray or Simple Suture)
                </button>
                <button
                  type="button"
                  onClick={() => setExpectedResources('NONE')}
                  className={`p-2 rounded-xl border font-bold transition cursor-pointer ${
                    expectedResources === 'NONE'
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  None (Oral Rx / Reassurance)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-2xs cursor-pointer"
            >
              Commit Triage & Auto-Assign Emergency Bay
            </button>
          </form>

          {/* Right Card: Computed ESI Score Result (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                ALGORITHMIC TRIAGE RECOMMENDATION
              </span>

              <div
                className={`p-5 rounded-2xl border text-center space-y-2 ${
                  calculatedEsi === 1
                    ? 'bg-rose-100 border-rose-300 text-rose-950'
                    : calculatedEsi === 2
                    ? 'bg-orange-100 border-orange-300 text-orange-950'
                    : calculatedEsi === 3
                    ? 'bg-amber-100 border-amber-300 text-amber-950'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-950'
                }`}
              >
                <span className="text-xs font-extrabold uppercase tracking-wider block">
                  {calculatedEsi === 1 && 'IMMEDIATE RESUSCITATION (LEVEL 1)'}
                  {calculatedEsi === 2 && 'EMERGENT / HIGH ACUITY (LEVEL 2)'}
                  {calculatedEsi === 3 && 'URGENT / MULTI-RESOURCE (LEVEL 3)'}
                  {calculatedEsi === 4 && 'LESS URGENT (LEVEL 4)'}
                  {calculatedEsi === 5 && 'NON-URGENT (LEVEL 5)'}
                </span>
                <div className="text-4xl font-black font-mono">ESI LEVEL {calculatedEsi}</div>
                <p className="text-xs">
                  {calculatedEsi <= 2
                    ? 'Immediate Bedside Physician Assessment & Trauma Team notification triggered.'
                    : 'Place in Acute Monitoring Area; nurse vitals check every 30 minutes.'}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                <span className="font-bold text-slate-900 block">Automated Dispatch Bay Allocation</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Designated Bay:</span>
                  <span className="font-bold text-emerald-800">
                    {calculatedEsi <= 2 ? 'Trauma Bay 1 (STAT)' : calculatedEsi === 3 ? 'Acute Bay 3' : 'Fast-Track Bay 4'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Nursing Ratio:</span>
                  <span className="font-bold text-slate-800">{calculatedEsi === 1 ? '1:1 Dedicated' : '1:2 Monitored'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Target Time to MD:</span>
                  <span className="font-bold text-rose-700 font-mono">
                    {calculatedEsi === 1 ? '< 0 mins (Immediate)' : calculatedEsi === 2 ? '< 10 mins' : '< 30 mins'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Conforms to Emergency Nurses Association (ENA) & ACEP Standards.</span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. CODE BLUE CPR CONDUCTOR & METRONOME                         */}
      {/* ------------------------------------------------------------- */}
      {activeStation === 'CODE_BLUE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Conductor Console (8 Cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-rose-700 flex items-center gap-2">
                    <Heart className="w-5 h-5 animate-pulse" />
                    <span>Resuscitation Code Blue Conductor (ACLS 2026)</span>
                  </h2>
                  <span className="text-xs font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300">
                    VF / Pulseless VT Protocol
                  </span>
                </div>
                <p className="text-xs text-slate-500">Live 2-minute CPR cycle metronome, shock logger & drug interval alarms</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCodeBlueRunning(!isCodeBlueRunning)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition shadow-2xs cursor-pointer ${
                    isCodeBlueRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-700 hover:bg-emerald-800'
                  }`}
                >
                  {isCodeBlueRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isCodeBlueRunning ? 'Pause Resuscitation' : 'Start CPR Session'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsCodeBlueRunning(false);
                    setCprSeconds(120);
                    setTotalCodeSeconds(0);
                    setShocksDelivered(0);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  title="Reset Code Conductor"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 3 Telemetry Clocks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* 2-min CPR Cycle Countdown */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  CPR 2-MIN CYCLE COUNTDOWN
                </span>
                <div
                  className={`text-3xl font-black font-mono ${
                    cprSeconds <= 15 ? 'text-rose-700 animate-bounce' : 'text-slate-900'
                  }`}
                >
                  {Math.floor(cprSeconds / 60)}:{String(cprSeconds % 60).padStart(2, '0')}
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-rose-600 h-full transition-all"
                    style={{ width: `${(cprSeconds / 120) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-medium">Switch compressor at 0:00</span>
              </div>

              {/* Total Code Elapsed */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  TOTAL RESUSCITATION TIME
                </span>
                <div className="text-3xl font-black font-mono text-slate-900">
                  {formatCodeTime(totalCodeSeconds)}
                </div>
                <span className="text-[10px] text-slate-500">Continuous Stopwatch</span>
              </div>

              {/* Defibrillation Shocks */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  SHOCKS DELIVERED
                </span>
                <div className="text-3xl font-black font-mono text-teal-800">
                  {shocksDelivered}
                </div>
                <span className="text-[10px] text-slate-500">Biphasic Defibrillator</span>
              </div>
            </div>

            {/* Rapid ACLS Action Buttons */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                RAPID ACLS INTERVENTIONS & DRUG PUSHES
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Defibrillate Shock Button */}
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 text-xs">Defibrillation</span>
                    <select
                      value={selectedEnergyJoules}
                      onChange={(e) => setSelectedEnergyJoules(e.target.value)}
                      className="bg-white border border-rose-300 text-rose-900 text-[10px] font-mono rounded px-1 py-0.5"
                    >
                      <option value="120 J (Biphasic)">120 J</option>
                      <option value="150 J (Biphasic)">150 J</option>
                      <option value="200 J (Biphasic)">200 J</option>
                    </select>
                  </div>
                  <button
                    onClick={handleDeliverShock}
                    className="w-full py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Deliver Shock</span>
                  </button>
                </div>

                {/* Epinephrine Button */}
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 text-xs">Epinephrine 1mg</span>
                    <span className="text-[10px] text-teal-700 font-mono">Every 3-5 min</span>
                  </div>
                  <button
                    onClick={handlePushEpi}
                    className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Droplets className="w-4 h-4" />
                    <span>Push Epi 1mg IV</span>
                  </button>
                </div>

                {/* Amiodarone Button */}
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 text-xs">Amiodarone</span>
                    <span className="text-[10px] text-indigo-700 font-mono">Antiarrhythmic</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => handlePushAmiodarone('300mg')}
                      className="py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-lg text-[11px] transition cursor-pointer"
                    >
                      300mg Dose 1
                    </button>
                    <button
                      onClick={() => handlePushAmiodarone('150mg')}
                      className="py-2 bg-indigo-800 hover:bg-indigo-900 text-white font-bold rounded-lg text-[11px] transition cursor-pointer"
                    >
                      150mg Dose 2
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Reversible 5 H's and 5 T's Checklist */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                Reversible Causes Checklist (5 H's & 5 T's)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Hypovolemia</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Hypoxia</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Hydrogen (Acidosis)</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Hypo/Hyperkalemia</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Hypothermia</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Tension Pneumothorax</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Tamponade (Cardiac)</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Toxins / Overdose</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Thrombosis (Pulm PE)</span>
                <span className="p-1.5 bg-white border border-slate-200 rounded text-slate-700 font-medium">Thrombosis (Coronary)</span>
              </div>
            </div>
          </div>

          {/* Right: Timestamped Resuscitation Code Event Log (4 Cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Timestamped Event Log
              </span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                AUDITED
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[460px] text-xs">
              {codeLogs.map((log, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-800">{log.action}</span>
                    <span className="font-mono text-[10px] text-slate-500 font-bold">{log.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">{log.note}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleLogCodeAction('ROSC ACHIEVED', 'Return of spontaneous circulation noted. Commencing post-resuscitation targeted temperature management.')}
              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-2xs cursor-pointer"
            >
              Log ROSC (Return of Spontaneous Circulation)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
