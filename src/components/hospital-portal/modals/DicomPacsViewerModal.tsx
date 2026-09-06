import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Contrast,
  Sliders,
  Ruler,
  FileText,
  Activity,
  Layers,
  Sparkles,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck
} from 'lucide-react';

interface DicomPacsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModality?: 'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO';
}

interface ScanPreset {
  id: 'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO';
  title: string;
  patientName: string;
  patientMrn: string;
  patientAgeGender: string;
  date: string;
  modalityCode: string;
  description: string;
  totalSlices: number;
  aiFindings: {
    title: string;
    confidence: number;
    severity: 'NORMAL' | 'WARNING' | 'CRITICAL';
    boxText: string;
    location: string;
    radLexCode: string;
  }[];
  radiologistImpression: string;
  recommendation: string;
}

const SCAN_DATA: Record<string, ScanPreset> = {
  CXR: {
    id: 'CXR',
    title: 'Digital Chest Radiography (PA & Lateral)',
    patientName: 'David K. Miller',
    patientMrn: 'MRN-78401-09',
    patientAgeGender: '42 Y / Male',
    date: '2026-08-22 09:14:20',
    modalityCode: 'CR / DX Chest',
    description: 'Bilateral PA upright chest projection with full inspiratory effort. 120 kVp, 4.2 mAs.',
    totalSlices: 1,
    aiFindings: [
      {
        title: 'Right Lower Lobe Consolidation',
        confidence: 94.8,
        severity: 'CRITICAL',
        boxText: 'Alveolar Infiltrate & Air Bronchogram (RLL)',
        location: 'Right Hemithorax Base',
        radLexCode: 'RID49528'
      },
      {
        title: 'Mild Left Ventricular Prominence',
        confidence: 86.2,
        severity: 'WARNING',
        boxText: 'Cardiothoracic Ratio 0.53',
        location: 'Cardiac Silhouette',
        radLexCode: 'RID1398'
      }
    ],
    radiologistImpression: '1. Acute right lower lobe consolidation consistent with community-acquired lobar pneumonia.\n2. Borderline cardiomegaly (CTR 0.53) without overt pulmonary venous congestion.\n3. Costophrenic sulci remain clear. No visible pneumothorax.',
    recommendation: 'Targeted antibiotic therapy against atypical respiratory pathogens. Follow-up CXR in 14 days post-antimicrobial completion.'
  },
  CT_BRAIN: {
    id: 'CT_BRAIN',
    title: 'Computed Tomography (CT) Brain Axial Non-Contrast',
    patientName: 'Margaret Holloway',
    patientMrn: 'MRN-91204-18',
    patientAgeGender: '78 Y / Female',
    date: '2026-08-22 08:30:15',
    modalityCode: 'CT Multislice (64-Slice)',
    description: 'Axial non-contrast helical brain acquisition from skull base to vertex. Slice thickness 1.25mm.',
    totalSlices: 24,
    aiFindings: [
      {
        title: 'Acute Subdural Hematoma (Left Frontoparietal)',
        confidence: 97.4,
        severity: 'CRITICAL',
        boxText: 'Hyperdense Crescentic Extra-axial Fluid (68 HU)',
        location: 'Left Frontoparietal Convexity',
        radLexCode: 'RID38761'
      },
      {
        title: 'Midline Shift (3.8 mm to Right)',
        confidence: 91.5,
        severity: 'CRITICAL',
        boxText: 'Subfalcine Herniation Vector 3.8mm',
        location: 'Septum Pellucidum',
        radLexCode: 'RID4981'
      }
    ],
    radiologistImpression: '1. Hyperdense crescentic extra-axial collection along the left frontoparietal convexity measuring up to 9mm in maximal depth, characteristic of acute subdural hematoma (SDH).\n2. Subfalcine herniation with 3.8mm rightward midline shift.\n3. Basal cisterns remain patent. No calvarial fracture on bone algorithms.',
    recommendation: 'STAT Neurosurgical consultation for decompression evaluation. Serial non-contrast head CT in 6 hours or upon any neurologic deterioration.'
  },
  MRI_SPINE: {
    id: 'MRI_SPINE',
    title: 'Magnetic Resonance Imaging (MRI) Lumbar Spine 3.0T',
    patientName: 'Sophia Sterling',
    patientMrn: 'MRN-55291-77',
    patientAgeGender: '52 Y / Female',
    date: '2026-08-21 16:45:00',
    modalityCode: 'MR 3.0 Tesla Multi-Echo',
    description: 'Sagittal and Axial T1, T2, and STIR weighted lumbar sequences. Slice thickness 3.0mm.',
    totalSlices: 16,
    aiFindings: [
      {
        title: 'L4-L5 Paracentral Disc Extrusion',
        confidence: 93.1,
        severity: 'CRITICAL',
        boxText: 'Posterior-Left Disc Extrusion (5.4mm AP)',
        location: 'L4-L5 Subarticular Zone',
        radLexCode: 'RID34710'
      },
      {
        title: 'Left L5 Exiting Nerve Root Impingement',
        confidence: 89.7,
        severity: 'WARNING',
        boxText: 'Lateral Recess Compression',
        location: 'Left L5 Neuroforamen',
        radLexCode: 'RID4901'
      }
    ],
    radiologistImpression: '1. Prominent posterolateral/left subarticular disc herniation at L4-L5 with severe lateral recess stenosis and left L5 traversing nerve root abutment/compression.\n2. Moderate facet joint arthropathy at L5-S1 without high-grade central canal stenosis.',
    recommendation: 'Orthopedic Spine / Physical Medicine correlation. Elective transforaminal epidural steroid injection vs minimally invasive microdiscectomy.'
  },
  ANGIO: {
    id: 'ANGIO',
    title: 'Digital Subtraction Coronary Angiography (Cath Lab)',
    patientName: 'Marcus Brody',
    patientMrn: 'MRN-33019-54',
    patientAgeGender: '61 Y / Male',
    date: '2026-08-22 10:05:00',
    modalityCode: 'XA Fluoroscopy C-Arm',
    description: 'Selective left and right coronary angiograms in LAO cranial and RAO caudal projections. Optiray 320 contrast.',
    totalSlices: 8,
    aiFindings: [
      {
        title: 'Mid-LAD Critical Stenosis (85%)',
        confidence: 98.2,
        severity: 'CRITICAL',
        boxText: 'Flow-Limiting Calcified Plaque (TIMI-2)',
        location: 'Mid Left Anterior Descending',
        radLexCode: 'RID1940'
      }
    ],
    radiologistImpression: '1. Left main trunk is widely patent.\n2. Mid LAD demonstrates severe eccentric 85% stenosis with TIMI Grade 2 distal antegrade flow.\n3. LCx and RCA show non-obstructive 30-40% luminal irregularities.',
    recommendation: 'Immediate Percutaneous Coronary Intervention (PCI) with Drug-Eluting Stent (DES) to mid-LAD under intravascular ultrasound (IVUS) guidance.'
  }
};

export const DicomPacsViewerModal: React.FC<DicomPacsViewerModalProps> = ({
  isOpen,
  onClose,
  initialModality = 'CXR'
}) => {
  const [selectedModality, setSelectedModality] = useState<'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO'>(initialModality);
  const [currentSlice, setCurrentSlice] = useState(1);
  const [windowPreset, setWindowPreset] = useState<'STANDARD' | 'LUNG' | 'BONE' | 'BRAIN' | 'INVERT' | 'HEATMAP'>('STANDARD');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [activeTool, setActiveTool] = useState<'PAN' | 'CALIPER' | 'ROI' | 'NONE'>('NONE');
  const [measurementLines, setMeasurementLines] = useState<{ x1: number; y1: number; x2: number; y2: number; distMm: number }[]>([]);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [pushedToEhr, setPushedToEhr] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const currentScan = SCAN_DATA[selectedModality];

  useEffect(() => {
    setCurrentSlice(1);
    setMeasurementLines([]);
    setPushedToEhr(false);
  }, [selectedModality]);

  if (!isOpen) return null;

  const handlePushToEhr = () => {
    setPushedToEhr(true);
    setTimeout(() => setPushedToEhr(false), 4000);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'CALIPER') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPoint({ x, y });
    setIsMeasuring(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMeasuring || !startPoint || activeTool !== 'CALIPER') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - startPoint.x;
    const dy = y - startPoint.y;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const distMm = Number((distPx * 0.35).toFixed(1)); // 0.35 mm/px calibration
    if (distPx > 10) {
      setMeasurementLines((prev) => [...prev, { x1: startPoint.x, y1: startPoint.y, x2: x, y2: y, distMm }]);
    }
    setIsMeasuring(false);
    setStartPoint(null);
  };

  // Filter styles based on Window/Level
  const getFilterStyle = () => {
    let filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    if (windowPreset === 'INVERT') {
      filter += ' invert(100%)';
    } else if (windowPreset === 'BONE') {
      filter += ' contrast(180%) brightness(120%)';
    } else if (windowPreset === 'LUNG') {
      filter += ' contrast(150%) brightness(90%)';
    } else if (windowPreset === 'BRAIN') {
      filter += ' contrast(130%) brightness(105%)';
    } else if (windowPreset === 'HEATMAP') {
      filter += ' hue-rotate(180deg) saturate(200%)';
    }
    return filter;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-slate-950 text-slate-100 w-full max-w-7xl h-[92vh] rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top PACS Header Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white tracking-tight">
                  MedAuth™ Diagnostic PACS & Radiography Workstation
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                  DICOM 3.0 / RadLex Validated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentScan.patientName} • {currentScan.patientMrn} • {currentScan.patientAgeGender} • {currentScan.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePushToEhr}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                pushedToEhr
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{pushedToEhr ? 'Verified & Synced with EHR' : 'Sync Findings to EHR'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Header: Modality Switcher & Toolbar */}
        <div className="bg-slate-900/70 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          
          {/* Modality Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['CXR', 'CT_BRAIN', 'MRI_SPINE', 'ANGIO'] as const).map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModality(mod)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedModality === mod
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mod === 'CXR' && 'Chest X-Ray (PA)'}
                {mod === 'CT_BRAIN' && 'CT Brain Axial'}
                {mod === 'MRI_SPINE' && 'MRI Lumbar 3.0T'}
                {mod === 'ANGIO' && 'Coronary Angio'}
              </button>
            ))}
          </div>

          {/* Imaging Manipulation Tools */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveTool(activeTool === 'CALIPER' ? 'NONE' : 'CALIPER')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                activeTool === 'CALIPER'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Calibrated Measurement Caliper (mm)"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Caliper Tool</span>
            </button>

            <button
              onClick={() => setShowAiBoxes(!showAiBoxes)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                showAiBoxes
                  ? 'bg-purple-900/70 text-purple-200 border-purple-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI CAD Overlays</span>
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            {/* Window Presets Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Window:</span>
              <select
                value={windowPreset}
                onChange={(e) => setWindowPreset(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 cursor-pointer font-mono"
              >
                <option value="STANDARD">Standard DICOM</option>
                <option value="LUNG">Lung Window (-600/1500 HU)</option>
                <option value="BONE">Bone Algorithm (300/1500 HU)</option>
                <option value="BRAIN">Brain Soft (40/80 HU)</option>
                <option value="INVERT">Inverse Negative</option>
                <option value="HEATMAP">Pseudo-Color Perfusion</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setZoomLevel((prev) => Math.max(0.75, prev - 0.25))}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-300 px-1">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {measurementLines.length > 0 && (
              <button
                onClick={() => setMeasurementLines([])}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-bold ml-1 cursor-pointer"
              >
                Clear Calipers ({measurementLines.length})
              </button>
            )}
          </div>
        </div>

        {/* Main Workstation Body: Split View (Viewport Left, Clinical Report Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
          
          {/* Left: Interactive Canvas Viewport (7 Cols) */}
          <div className="lg:col-span-7 bg-black flex flex-col relative border-r border-slate-800 overflow-hidden select-none">
            
            {/* HUD Telemetry Overlay on Canvas */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none space-y-1 font-mono text-[11px] text-emerald-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <div>INSTITUTION: METRO GENERAL PACS ARCHIVE</div>
              <div>MODALITY: {currentScan.modalityCode}</div>
              <div>PATIENT: {currentScan.patientName}</div>
              <div>MRN: {currentScan.patientMrn}</div>
              <div>KV: 120 | MA: 350 | FOV: 350mm</div>
            </div>

            <div className="absolute top-3 right-3 z-20 pointer-events-none text-right font-mono text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
              <div>W: {contrast * 10} L: {brightness * 5}</div>
              <div>ZOOM: {(zoomLevel * 100).toFixed(0)}%</div>
              {currentScan.totalSlices > 1 && (
                <div className="text-emerald-400 font-bold">
                  SLICE: {currentSlice} / {currentScan.totalSlices}
                </div>
              )}
            </div>

            {/* Interactive Image Display Area */}
            <div
              ref={canvasContainerRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className={`flex-1 flex items-center justify-center relative overflow-hidden ${
                activeTool === 'CALIPER' ? 'cursor-crosshair' : 'cursor-default'
              }`}
            >
              {/* Simulated High-Res Diagnostic Graphic */}
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  filter: getFilterStyle(),
                  transition: 'transform 0.15s ease-out'
                }}
                className="relative w-full max-w-[480px] aspect-square rounded-lg flex items-center justify-center p-4"
              >
                {/* SVG Medical Radiograph Rendering */}
                {selectedModality === 'CXR' && (
                  <svg viewBox="0 0 400 400" className="w-full h-full text-slate-200">
                    <defs>
                      <radialGradient id="cxrGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#8899aa" stopOpacity="0.8" />
                        <stop offset="60%" stopColor="#223344" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#050a10" stopOpacity="0.9" />
                      </radialGradient>
                    </defs>
                    <rect width="400" height="400" fill="#06090e" />
                    {/* Thoracic rib cage cage outline */}
                    <path d="M 60,80 Q 200,40 340,80 Q 370,250 340,360 Q 200,380 60,360 Q 30,250 60,80 Z" fill="url(#cxrGlow)" />
                    {/* Spine column */}
                    <rect x="188" y="50" width="24" height="320" fill="#cbd5e1" opacity="0.6" rx="4" />
                    {/* Clavicles */}
                    <path d="M 60,90 Q 150,110 200,100 Q 250,110 340,90" stroke="#f1f5f9" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
                    {/* Left Lung Field */}
                    <path d="M 90,120 C 70,180 80,310 140,330 C 160,330 175,270 175,170 C 175,130 130,110 90,120 Z" fill="#0a121c" opacity="0.95" />
                    {/* Right Lung Field (with consolidation in base) */}
                    <path d="M 310,120 C 330,180 320,310 260,330 C 240,330 225,270 225,170 C 225,130 270,110 310,120 Z" fill="#0a121c" opacity="0.95" />
                    {/* Cardiac Silhouette */}
                    <path d="M 180,180 Q 260,260 210,320 Q 150,330 170,210 Z" fill="#e2e8f0" opacity="0.75" />
                    {/* Acute Right Lower Lobe Consolidation Patch */}
                    <circle cx="280" cy="275" r="32" fill="#cbd5e1" opacity="0.65" filter="blur(6px)" />
                    <circle cx="295" cy="285" r="22" fill="#f8fafc" opacity="0.5" filter="blur(4px)" />
                    {/* Diaphragmatic domes */}
                    <path d="M 60,340 Q 140,310 180,340" stroke="#e2e8f0" strokeWidth="6" fill="none" opacity="0.8" />
                    <path d="M 220,340 Q 280,320 340,350" stroke="#e2e8f0" strokeWidth="6" fill="none" opacity="0.8" />
                  </svg>
                )}

                {selectedModality === 'CT_BRAIN' && (
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <rect width="400" height="400" fill="#030712" />
                    {/* Calvarium / Skull Bone Ring */}
                    <ellipse cx="200" cy="200" rx="140" ry="160" fill="#111827" stroke="#f8fafc" strokeWidth="12" />
                    {/* Cerebral Parenchyma Hemispheres */}
                    <ellipse cx="155" cy="200" rx="38" ry="120" fill="#475569" opacity="0.8" />
                    <ellipse cx="240" cy="200" rx="38" ry="120" fill="#475569" opacity="0.8" />
                    {/* Ventricular System */}
                    <path d="M 185,170 Q 170,200 185,230" stroke="#0f172a" strokeWidth="10" fill="none" strokeLinecap="round" />
                    <path d="M 215,170 Q 230,200 215,230" stroke="#0f172a" strokeWidth="8" fill="none" strokeLinecap="round" />
                    {/* Left Subdural Hematoma Hyperdensity (Crescent along skull inner table) */}
                    <path d="M 75,130 Q 60,200 85,270 Q 95,200 85,150 Z" fill="#f1f5f9" opacity="0.9" filter="drop-shadow(0 0 4px #cbd5e1)" />
                    {/* Midline Falx Deviation vector */}
                    <line x1="200" y1="70" x2="208" y2="330" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                )}

                {selectedModality === 'MRI_SPINE' && (
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <rect width="400" height="400" fill="#020617" />
                    {/* Vertebral Bodies L1-L5 */}
                    <rect x="110" y="50" width="65" height="40" rx="4" fill="#64748b" opacity="0.8" />
                    <rect x="110" y="105" width="65" height="40" rx="4" fill="#64748b" opacity="0.8" />
                    <rect x="110" y="160" width="65" height="40" rx="4" fill="#64748b" opacity="0.8" />
                    <rect x="110" y="215" width="65" height="42" rx="4" fill="#64748b" opacity="0.8" />
                    <rect x="110" y="272" width="65" height="45" rx="4" fill="#64748b" opacity="0.8" />
                    {/* Sacrum S1 */}
                    <path d="M 110,330 L 175,330 L 160,390 L 110,390 Z" fill="#475569" />
                    {/* Intervertebral Discs */}
                    <rect x="115" y="92" width="55" height="11" rx="2" fill="#94a3b8" />
                    <rect x="115" y="147" width="55" height="11" rx="2" fill="#94a3b8" />
                    <rect x="115" y="202" width="55" height="11" rx="2" fill="#94a3b8" />
                    {/* L4-L5 Protruding Herniated Disc Extrusion */}
                    <path d="M 115,259 L 170,259 L 192,264 L 170,270 L 115,270 Z" fill="#f8fafc" opacity="0.95" filter="drop-shadow(0 0 3px #cbd5e1)" />
                    {/* Spinal Cord / Thecal Sac (T2 Hyperintense CSF) */}
                    <rect x="180" y="40" width="22" height="340" fill="#e2e8f0" opacity="0.75" />
                    {/* Posterior Spinous Processes */}
                    <path d="M 215,70 L 260,85 L 215,95" stroke="#475569" strokeWidth="8" fill="none" />
                    <path d="M 215,125 L 260,140 L 215,150" stroke="#475569" strokeWidth="8" fill="none" />
                    <path d="M 215,180 L 260,195 L 215,205" stroke="#475569" strokeWidth="8" fill="none" />
                    <path d="M 215,235 L 260,250 L 215,260" stroke="#475569" strokeWidth="8" fill="none" />
                  </svg>
                )}

                {selectedModality === 'ANGIO' && (
                  <svg viewBox="0 0 400 400" className="w-full h-full">
                    <rect width="400" height="400" fill="#0f172a" />
                    {/* Catheter insertion */}
                    <path d="M 50,50 Q 140,80 180,120" stroke="#94a3b8" strokeWidth="5" fill="none" />
                    {/* Left Main Coronary Artery */}
                    <path d="M 180,120 L 210,140" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="round" />
                    {/* Circumflex Branch */}
                    <path d="M 210,140 Q 280,160 320,250" stroke="#cbd5e1" strokeWidth="7" fill="none" strokeLinecap="round" />
                    {/* Left Anterior Descending (LAD) Artery */}
                    <path d="M 210,140 Q 190,200 215,230" stroke="#f1f5f9" strokeWidth="9" fill="none" strokeLinecap="round" />
                    {/* Severe 85% Focal Stenosis Waist */}
                    <path d="M 215,230 L 218,245" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
                    {/* Post-Stenotic Distal LAD Vessel */}
                    <path d="M 218,245 Q 230,300 240,360" stroke="#94a3b8" strokeWidth="6" fill="none" strokeLinecap="round" />
                    {/* Diagonal branches */}
                    <path d="M 200,180 Q 150,230 130,280" stroke="#cbd5e1" strokeWidth="4" fill="none" />
                  </svg>
                )}

                {/* AI CAD Bounding Boxes Overlay */}
                {showAiBoxes && (
                  <div className="absolute inset-0 pointer-events-none">
                    {selectedModality === 'CXR' && (
                      <div className="absolute top-[60%] right-[18%] w-24 h-24 border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-lg p-1 animate-pulse">
                        <span className="bg-rose-600 text-white font-mono text-[9px] font-bold px-1 py-0.5 rounded block truncate">
                          Consolidation 94.8%
                        </span>
                      </div>
                    )}
                    {selectedModality === 'CT_BRAIN' && (
                      <div className="absolute top-[32%] left-[14%] w-20 h-36 border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-lg p-1 animate-pulse">
                        <span className="bg-rose-600 text-white font-mono text-[9px] font-bold px-1 py-0.5 rounded block truncate">
                          Acute SDH 97.4%
                        </span>
                      </div>
                    )}
                    {selectedModality === 'MRI_SPINE' && (
                      <div className="absolute top-[60%] left-[38%] w-20 h-12 border-2 border-dashed border-amber-500 bg-amber-500/10 rounded-lg p-1 animate-pulse">
                        <span className="bg-amber-600 text-white font-mono text-[9px] font-bold px-1 py-0.5 rounded block truncate">
                          L4-L5 Disc 93.1%
                        </span>
                      </div>
                    )}
                    {selectedModality === 'ANGIO' && (
                      <div className="absolute top-[52%] left-[48%] w-16 h-14 border-2 border-dashed border-rose-500 bg-rose-500/10 rounded-lg p-1 animate-pulse">
                        <span className="bg-rose-600 text-white font-mono text-[9px] font-bold px-1 py-0.5 rounded block truncate">
                          LAD 85% Stenosis
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Caliper Render Lines */}
                {measurementLines.map((line, idx) => (
                  <div key={idx} className="absolute inset-0 pointer-events-none">
                    <svg className="w-full h-full">
                      <line
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="2 2"
                      />
                      <circle cx={line.x1} cy={line.y1} r="3" fill="#10b981" />
                      <circle cx={line.x2} cy={line.y2} r="3" fill="#10b981" />
                      <text
                        x={(line.x1 + line.x2) / 2 + 5}
                        y={(line.y1 + line.y2) / 2 - 5}
                        fill="#34d399"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {line.distMm} mm
                      </text>
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Slice Slider (for CT/MRI) */}
            {currentScan.totalSlices > 1 && (
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-3 shrink-0">
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  SLICE {currentSlice} / {currentScan.totalSlices}
                </span>
                <input
                  type="range"
                  min={1}
                  max={currentScan.totalSlices}
                  value={currentSlice}
                  onChange={(e) => setCurrentSlice(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Right: Clinical Radiology Findings & ACR RadLex Report (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 flex flex-col overflow-y-auto divide-y divide-slate-800 text-xs">
            
            {/* AI CAD Diagnostic Intelligence Panel */}
            <div className="p-4 space-y-3 bg-slate-900/90">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-purple-400 font-bold uppercase tracking-wider text-[11px]">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Computer-Aided Detection (CAD)</span>
                </div>
                <span className="text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded">
                  Deep Learning v4.2
                </span>
              </div>

              <div className="space-y-2">
                {currentScan.aiFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border ${
                      finding.severity === 'CRITICAL'
                        ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                        : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold">{finding.title}</span>
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700">
                        {finding.confidence}% CONF
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{finding.boxText}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800/60">
                      <span>Loc: {finding.location}</span>
                      <span>RadLex: {finding.radLexCode}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Radiologist Diagnostic Report */}
            <div className="p-4 space-y-4 flex-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5 text-slate-200 font-bold text-xs uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>ACR RadLex Diagnostic Impression</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">STATUS: SIGNED</span>
              </div>

              <div className="space-y-3 font-sans">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                    CLINICAL INDICATION & TECHNIQUE
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {currentScan.description}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                    DIAGNOSTIC FINDINGS & IMPRESSION
                  </span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 font-mono text-[11px] leading-relaxed whitespace-pre-line">
                    {currentScan.radiologistImpression}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider block mb-1">
                    ACTIONABLE CLINICAL RECOMMENDATION
                  </span>
                  <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] font-medium">
                    {currentScan.recommendation}
                  </div>
                </div>
              </div>

              {/* Attending Radiologist Signature */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <div>
                  <div className="font-bold text-white">Dr. Marcus Brody, MD, FACR</div>
                  <div className="text-[10px] text-slate-400">Chief of Diagnostic & Interventional Radiology</div>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/40">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>DIGITALLY SIGNED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
