import React, { useState, useMemo } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Activity,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  Sparkles,
  FileText,
  Calendar,
  Layers,
  Thermometer,
  Cpu,
  RefreshCw,
  Sliders,
  Settings,
  Flame,
  Check,
  X,
  ChevronRight,
  Eye,
  PhoneCall,
  Mail,
  Building,
  Package,
  FileCheck
} from 'lucide-react';
import { useBiomedical } from '../../../context/BiomedicalContext';
import {
  BiomedicalAsset,
  PpmScheduleRecord,
  BreakdownWorkOrder,
  ModalityCategory,
  CriticalityTier,
  AssetOperationalStatus,
  ElectricalSafetyRecord
} from '../../../types/biomedicalExtended';

type TabType = 'fleet' | 'ppm' | 'breakdowns' | 'safety-aerb' | 'spares' | 'calculators';

/** Response-time SLA (minutes) the biomedical team commits to per breakdown priority. */
const BREAKDOWN_SLA_TARGET_MINUTES: Record<string, number> = {
  'Code Red - STAT (Life Support Failure)': 15,
  'High Priority (OR / Diagnostic Interrupted)': 60,
  'Medium Priority (Backup Unit Available)': 240,
  'Low / Routine': 1440
};

export const EquipmentView: React.FC = () => {
  const {
    assets,
    ppmSchedules,
    breakdownOrders,
    spareParts,
    radiationLogs,
    totalAssetsCount,
    totalAssetValuation,
    fleetUptimeAverage,
    ppmDueCount,
    ppmOverdueCount,
    activeBreakdownsCount,
    statBreakdownsCount,
    aerbComplianceRate,
    expiringContractsCount,
    addAsset,
    updateAsset,
    decommissionAsset,
    schedulePpm,
    startPpmExecution,
    completePpmChecklist,
    reschedulePpm,
    reportBreakdown,
    updateWorkOrderStatus,
    resolveWorkOrder,
    recordElectricalSafetyTest,
    updateRadiationSurvey,
    adjustSparePartStock,
    reorderSparePart
  } = useBiomedical();

  const [activeTab, setActiveTab] = useState<TabType>('fleet');

  // Search & Filters for Fleet
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  // Modals state
  const [selectedAssetForDetails, setSelectedAssetForDetails] = useState<BiomedicalAsset | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isSchedulePpmModalOpen, setIsSchedulePpmModalOpen] = useState(false);
  const [isReportBreakdownModalOpen, setIsReportBreakdownModalOpen] = useState(false);
  const [activePpmForExecution, setActivePpmForExecution] = useState<PpmScheduleRecord | null>(null);
  const [activeBreakdownForResolve, setActiveBreakdownForResolve] = useState<BreakdownWorkOrder | null>(null);

  // Form states for new Asset
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetTag, setNewAssetTag] = useState('');
  const [newModality, setNewModality] = useState<ModalityCategory>('Critical Care & Life Support');
  const [newTier, setNewTier] = useState<CriticalityTier>('Tier 1: Life Support (Immediate Danger if Down)');
  const [newManufacturer, setNewManufacturer] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newSerial, setNewSerial] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDepartment, setNewDepartment] = useState('Critical Care Medicine (ICU-A)');
  const [newCost, setNewCost] = useState(2500000);
  const [newContract, setNewContract] = useState<'Comprehensive AMC (CAMC)' | 'CMC (Parts & Labor Inclusive)' | 'OEM Direct Warranty'>('Comprehensive AMC (CAMC)');
  const [newVendor, setNewVendor] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');

  // Form states for Breakdown
  const [breakdownAssetId, setBreakdownAssetId] = useState('');
  const [breakdownPriority, setBreakdownPriority] = useState<BreakdownWorkOrder['priority']>(
    'Code Red - STAT (Life Support Failure)'
  );
  const [breakdownSymptom, setBreakdownSymptom] = useState('');
  const [breakdownErrorCode, setBreakdownErrorCode] = useState('');
  const [breakdownReportedBy, setBreakdownReportedBy] = useState('Sister Rachel Adams, RN (ICU Lead)');

  // Form states for Schedule PPM
  const [ppmAssetId, setPpmAssetId] = useState('');
  const [ppmDate, setPpmDate] = useState(new Date().toISOString().split('T')[0]);
  const [ppmFreq, setPpmFreq] = useState<'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual'>('Quarterly');
  const [ppmEngineer, setPpmEngineer] = useState('Er. Rakesh Sharma, Sr. BME');

  // Interactive PPM Execution State
  const [execChecklist, setExecChecklist] = useState<PpmScheduleRecord['checklist']>([]);
  const [execNotes, setExecNotes] = useState('');
  const [execPartsReplaced, setExecPartsReplaced] = useState('');
  const [execSignOffName, setExecSignOffName] = useState('Er. Rakesh Sharma, Sr. BME');

  // Breakdown Resolve State
  const [resolveRootCause, setResolveRootCause] = useState('');
  const [resolveAction, setResolveAction] = useState('');
  const [resolveCost, setResolveCost] = useState(15000);
  const [resolveDowntime, setResolveDowntime] = useState(120);

  // Electrical Safety Calculator State
  const [estEarthRes, setEstEarthRes] = useState<number>(0.08);
  const [estLeakageCurrent, setEstLeakageCurrent] = useState<number>(65);
  const [estStandard, setEstStandard] = useState<'IEC 62353' | 'IEC 60601-1'>('IEC 62353');
  const [estTargetAssetId, setEstTargetAssetId] = useState<string>('');

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.roomLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesModality = selectedModality === 'All' || asset.modalityCategory === selectedModality;
      const matchesStatus = selectedStatus === 'All' || asset.operationalStatus === selectedStatus;
      const matchesTier = selectedTier === 'All' || asset.criticalityTier === selectedTier;

      return matchesSearch && matchesModality && matchesStatus && matchesTier;
    });
  }, [assets, searchQuery, selectedModality, selectedStatus, selectedTier]);

  // Handle opening PPM execution drawer
  const handleOpenPpmExecution = (ppm: PpmScheduleRecord) => {
    setActivePpmForExecution(ppm);
    setExecChecklist(ppm.checklist.map((item) => ({ ...item })));
    setExecNotes(ppm.engineerNotes || 'All primary parameters tested within OEM specifications.');
    setExecPartsReplaced(ppm.partsReplaced?.join(', ') || '');
  };

  // Submit PPM Execution
  const handleSubmitPpmCompletion = () => {
    if (!activePpmForExecution) return;
    const partsArray = execPartsReplaced
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    completePpmChecklist(
      activePpmForExecution.id,
      execChecklist,
      execNotes,
      partsArray,
      activePpmForExecution.calibrationValues || [],
      execSignOffName
    );
    setActivePpmForExecution(null);
  };

  // Submit Breakdown Reporting
  const handleCreateBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === breakdownAssetId);
    if (!asset) return;

    reportBreakdown({
      assetId: asset.id,
      assetTag: asset.assetTag,
      assetName: asset.assetName,
      department: asset.departmentName,
      location: asset.roomLocation,
      reportedBy: breakdownReportedBy,
      priority: breakdownPriority,
      symptomDescription: breakdownSymptom,
      errorCode: breakdownErrorCode,
      assignedEngineer: asset.assignedBioEngineer || 'Duty Biomedical Engineer',
      slaTargetMinutes: BREAKDOWN_SLA_TARGET_MINUTES[breakdownPriority] ?? 240
    });

    setIsReportBreakdownModalOpen(false);
    setBreakdownSymptom('');
    setBreakdownErrorCode('');
  };

  // Submit New Asset Enrollment
  const handleEnrollAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newAssetTag || `BME-EQ-${Math.floor(100 + Math.random() * 900)}`;

    addAsset({
      assetTag: tag,
      barcode: `890119${Math.floor(100000 + Math.random() * 900000)}`,
      assetName: newAssetName,
      modalityCategory: newModality,
      criticalityTier: newTier,
      manufacturer: newManufacturer,
      model: newModel,
      serialNumber: newSerial,
      departmentId: 'DEP-GEN',
      departmentName: newDepartment,
      roomLocation: newLocation,
      floorWing: 'Main Hospital Complex',
      commissioningDate: new Date().toISOString().split('T')[0],
      purchaseCost: Number(newCost),
      currentBookValue: Number(newCost) * 0.9,
      expectedLifespanYears: 8,
      operationalStatus: 'Operational & Calibrated',
      uptimePercentage: 100.0,
      riskScore: newTier.includes('Tier 1') ? 25 : 15,
      contractType: newContract,
      vendorName: newVendor || 'OEM Certified Partner',
      vendorContactPhone: newVendorPhone || '+91 1800 200 0000',
      vendorEmail: 'support@medical-oem.com',
      contractExpiryDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      ppmFrequency: 'Quarterly',
      lastPpmDate: new Date().toISOString().split('T')[0],
      nextPpmDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split('T')[0],
      assignedBioEngineer: 'Er. Rakesh Sharma, Sr. BME'
    });

    setIsEnrollModalOpen(false);
    setNewAssetName('');
    setNewManufacturer('');
    setNewModel('');
    setNewSerial('');
    setNewLocation('');
  };

  // Submit Schedule PPM
  const handleSchedulePpmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === ppmAssetId);
    if (!asset) return;

    schedulePpm({
      assetId: asset.id,
      assetTag: asset.assetTag,
      assetName: asset.assetName,
      department: asset.departmentName,
      location: asset.roomLocation,
      scheduledDate: ppmDate,
      dueMonth: new Date(ppmDate).toLocaleString('default', { month: 'long', year: 'numeric' }),
      frequency: ppmFreq,
      assignedTechnician: ppmEngineer,
      checklist: [
        { id: 'CHK-01', title: 'Visual & mechanical integrity inspect (chassis, cabling, filters)', category: 'Visual & Mechanical', passed: true },
        { id: 'CHK-02', title: 'Power supply voltage and backup battery discharge load test', category: 'Electrical Safety', passed: true },
        { id: 'CHK-03', title: 'Modality output accuracy & sensor baseline calibration', category: 'Calibration & Output', passed: true },
        { id: 'CHK-04', title: 'Safety cutoff switches & emergency alarm triggers', category: 'Alarm & Safety Cutoff', passed: true }
      ]
    });

    setIsSchedulePpmModalOpen(false);
  };

  // Submit Resolve Breakdown
  const handleResolveBreakdownSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBreakdownForResolve) return;

    resolveWorkOrder(
      activeBreakdownForResolve.id,
      resolveRootCause,
      resolveAction,
      Number(resolveCost),
      Number(resolveDowntime)
    );

    setActiveBreakdownForResolve(null);
    setResolveRootCause('');
    setResolveAction('');
  };

  // Submit EST Test
  const handleSaveEstTest = () => {
    if (!estTargetAssetId) return;
    const isPass = estEarthRes <= 0.2 && estLeakageCurrent <= 500;

    const estRecord: ElectricalSafetyRecord = {
      standard: estStandard,
      earthResistanceOhms: estEarthRes,
      earthLeakageCurrentMicroAmps: estLeakageCurrent,
      enclosureLeakageCurrentMicroAmps: Math.round(estLeakageCurrent * 0.2),
      testDate: new Date().toISOString().split('T')[0],
      testedBy: 'Er. Rakesh Sharma, Sr. BME',
      passed: isPass
    };

    recordElectricalSafetyTest(estTargetAssetId, estRecord);
    alert(`IEC Electrical Safety Test saved! Status: ${isPass ? 'PASSED' : 'FAILED'}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E0EBE6] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#006B4F] text-white flex items-center justify-center shadow-sm">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#17221E] font-serif">
                Biomedical Assets & Clinical Engineering (HTM)
              </h1>
              <p className="text-xs text-[#52605B] mt-0.5">
                PPM Maintenance Engine, NABH/AERB Regulatory Compliance, EST Safety & CMMS Work Orders
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsReportBreakdownModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#DE3730] text-white hover:bg-[#B3261E] shadow-sm transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>🚨 Report Breakdown (STAT)</span>
          </button>

          <button
            onClick={() => setIsSchedulePpmModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#EAF5F0] text-[#006B4F] border border-[#BDE4D5] hover:bg-[#D5EFE3] transition-colors cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>+ Schedule PPM</span>
          </button>

          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#006B4F] text-white hover:bg-[#00543E] shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Enroll Asset</span>
          </button>
        </div>
      </div>

      {/* Critical STAT Alert Bar (if active breakdowns exist) */}
      {statBreakdownsCount > 0 && (
        <div className="bg-[#FFF0F0] border-l-4 border-[#DE3730] p-4 rounded-r-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFDADA] text-[#DE3730] flex items-center justify-center shrink-0 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#DE3730] uppercase tracking-wider">
                Active Code Red / High-Priority Breakdown Tickets ({statBreakdownsCount})
              </div>
              <div className="text-xs text-[#601410] mt-0.5">
                Critical life-support or surgical machinery requires active triage & engineering intervention.
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('breakdowns')}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#DE3730] text-white hover:bg-[#B3261E] whitespace-nowrap self-start sm:self-auto"
          >
            Open Breakdown CMMS →
          </button>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        <div className="bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#52605B] text-xs">
            <span>Fleet Uptime</span>
            <Activity className="w-4 h-4 text-[#006B4F]" />
          </div>
          <div className="text-2xl font-bold text-[#17221E] mt-1 tracking-tight font-serif">
            {fleetUptimeAverage}%
          </div>
          <div className="text-[11px] text-[#006B4F] mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> NABH Benchmark &gt;98%
          </div>
        </div>

        <div className="bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#52605B] text-xs">
            <span>Total Asset Pool</span>
            <Cpu className="w-4 h-4 text-[#006B4F]" />
          </div>
          <div className="text-2xl font-bold text-[#17221E] mt-1 tracking-tight font-serif">
            {totalAssetsCount} <span className="text-xs font-sans text-[#52605B]">Units</span>
          </div>
          <div className="text-[11px] text-[#52605B] mt-1 truncate">
            Valuation: ₹{(totalAssetValuation / 10000000).toFixed(1)} Cr
          </div>
        </div>

        <div className="bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#52605B] text-xs">
            <span>PPM Due / Overdue</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-bold text-[#D97706] mt-1 tracking-tight font-serif">
            {ppmDueCount + ppmOverdueCount}
          </div>
          <div className="text-[11px] text-[#52605B] mt-1">
            {ppmOverdueCount} Overdue | {ppmDueCount} Due Today
          </div>
        </div>

        <div className="bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#52605B] text-xs">
            <span>Active Breakdowns</span>
            <Flame className="w-4 h-4 text-[#DE3730]" />
          </div>
          <div className="text-2xl font-bold text-[#DE3730] mt-1 tracking-tight font-serif">
            {activeBreakdownsCount}
          </div>
          <div className="text-[11px] text-[#DE3730] mt-1 font-medium">
            {statBreakdownsCount} STAT / High SLA
          </div>
        </div>

        <div className="bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#52605B] text-xs">
            <span>AERB / QA Status</span>
            <ShieldCheck className="w-4 h-4 text-[#006B4F]" />
          </div>
          <div className="text-2xl font-bold text-[#006B4F] mt-1 tracking-tight font-serif">
            {aerbComplianceRate}%
          </div>
          <div className="text-[11px] text-[#52605B] mt-1">e-LORA Licensed</div>
        </div>

        <div className="bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[#52605B] text-xs">
            <span>Cryogen & AMC</span>
            <Thermometer className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-2xl font-bold text-[#0284C7] mt-1 tracking-tight font-serif">
            88.5%
          </div>
          <div className="text-[11px] text-[#52605B] mt-1">
            {expiringContractsCount} Contracts Expiring
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-[#E0EBE6] flex gap-1 overflow-x-auto pb-px">
        {[
          { id: 'fleet', label: 'Fleet Register & Live Matrix', icon: Layers, count: totalAssetsCount },
          { id: 'ppm', label: 'PPM Maintenance Hub & Calendar', icon: Calendar, count: ppmDueCount + ppmOverdueCount },
          { id: 'breakdowns', label: 'Breakdown CMMS Work Orders', icon: Wrench, count: activeBreakdownsCount },
          { id: 'safety-aerb', label: 'AERB Radiation & EST Safety', icon: ShieldCheck },
          { id: 'spares', label: 'Spare Parts & BME Inventory', icon: Package, count: spareParts.length },
          { id: 'calculators', label: 'BME Engineering Tools', icon: Cpu }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'border-[#006B4F] text-[#006B4F] bg-white rounded-t-lg'
                  : 'border-transparent text-[#52605B] hover:text-[#17221E] hover:border-[#BDE4D5]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#006B4F]' : 'text-[#85958F]'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-[#006B4F] text-white' : 'bg-[#E0EBE6] text-[#52605B]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: Fleet Register & Live Matrix */}
      {activeTab === 'fleet' && (
        <div className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#85958F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search equipment, asset code, model, room..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#006B4F]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                className="text-xs bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg px-2.5 py-1.5 text-[#17221E]"
              >
                <option value="All">All Modalities</option>
                <option value="Radiology & Radiation Oncology">Radiology & Radiation</option>
                <option value="Critical Care & Life Support">Critical Care & Life Support</option>
                <option value="Surgical & OT Workstations">Surgical & OT</option>
                <option value="Cardiology & Hybrid Cath Lab">Cardiology & Cath Lab</option>
                <option value="Dialysis & Renal Care">Dialysis & Renal</option>
              </select>

              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value)}
                className="text-xs bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg px-2.5 py-1.5 text-[#17221E]"
              >
                <option value="All">All Criticality Tiers</option>
                <option value="Tier 1: Life Support (Immediate Danger if Down)">Tier 1 Life Support</option>
                <option value="Tier 2: Critical Diagnostic & Surgical">Tier 2 Surgical/Diagnostic</option>
                <option value="Tier 3: Supportive Clinical Device">Tier 3 Supportive</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg px-2.5 py-1.5 text-[#17221E]"
              >
                <option value="All">All Statuses</option>
                <option value="Operational & Calibrated">Operational & Calibrated</option>
                <option value="PPM Due / Scheduled">PPM Due / Scheduled</option>
                <option value="Under Breakdown Maintenance">Under Breakdown</option>
                <option value="Calibration Expired">Calibration Expired</option>
              </select>
            </div>
          </div>

          {/* Asset List Grid / Table */}
          <div className="bg-white border border-[#E0EBE6] rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#17221E]">
                <thead className="bg-[#F6FBF8] border-b border-[#E0EBE6] text-[#52605B] font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Asset Tag & Device</th>
                    <th className="py-3 px-4">Modality & Criticality</th>
                    <th className="py-3 px-4">Location & Dept</th>
                    <th className="py-3 px-4">Operational Status</th>
                    <th className="py-3 px-4">PPM Timeline</th>
                    <th className="py-3 px-4">Safety & Contract</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0EBE6]">
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#52605B]">
                        No biomedical assets match your search filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map((asset) => {
                      const isOperational = asset.operationalStatus === 'Operational & Calibrated';
                      const isDuePpm = asset.operationalStatus === 'PPM Due / Scheduled';
                      const isBreakdown = asset.operationalStatus === 'Under Breakdown Maintenance';

                      return (
                        <tr key={asset.id} className="hover:bg-[#F9FCFA] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  isOperational
                                    ? 'bg-[#EAF5F0] text-[#006B4F]'
                                    : isBreakdown
                                    ? 'bg-[#FFDADA] text-[#DE3730]'
                                    : 'bg-[#FEF3C7] text-[#D97706]'
                                }`}
                              >
                                <Cpu className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-[#17221E] hover:underline cursor-pointer" onClick={() => setSelectedAssetForDetails(asset)}>
                                  {asset.assetName}
                                </div>
                                <div className="text-[11px] text-[#52605B] font-mono">
                                  {asset.assetTag} • {asset.manufacturer}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#17221E]">{asset.modalityCategory}</div>
                            <span
                              className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                                asset.criticalityTier.includes('Tier 1')
                                  ? 'bg-[#FFDADA] text-[#DE3730]'
                                  : asset.criticalityTier.includes('Tier 2')
                                  ? 'bg-[#E0F2FE] text-[#0284C7]'
                                  : 'bg-[#E0EBE6] text-[#52605B]'
                              }`}
                            >
                              {asset.criticalityTier.split(':')[0]}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#17221E]">{asset.roomLocation}</div>
                            <div className="text-[11px] text-[#52605B]">{asset.departmentName}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                                isOperational
                                  ? 'bg-[#EAF5F0] text-[#006B4F]'
                                  : isBreakdown
                                  ? 'bg-[#FFDADA] text-[#DE3730] animate-pulse'
                                  : isDuePpm
                                  ? 'bg-[#FEF3C7] text-[#D97706]'
                                  : 'bg-[#F3F4F6] text-[#52605B]'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isOperational
                                    ? 'bg-[#006B4F]'
                                    : isBreakdown
                                    ? 'bg-[#DE3730]'
                                    : isDuePpm
                                    ? 'bg-[#D97706]'
                                    : 'bg-[#52605B]'
                                }`}
                              />
                              {asset.operationalStatus}
                            </span>
                            <div className="text-[10px] text-[#52605B] mt-0.5">Uptime: {asset.uptimePercentage}%</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-[11px]">
                              <span className="text-[#52605B]">Next PPM:</span>{' '}
                              <span className="font-bold text-[#17221E]">{asset.nextPpmDate}</span>
                            </div>
                            <div className="text-[10px] text-[#52605B]">Freq: {asset.ppmFrequency}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-[11px] font-medium text-[#17221E]">{asset.contractType}</div>
                            <div className="text-[10px] text-[#006B4F] flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> IEC EST Passed
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedAssetForDetails(asset)}
                                className="p-1.5 rounded-lg border border-[#BDE4D5] text-[#006B4F] hover:bg-[#EAF5F0] transition-colors"
                                title="View Complete Specs & History"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setBreakdownAssetId(asset.id);
                                  setIsReportBreakdownModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg border border-[#FFDADA] text-[#DE3730] hover:bg-[#FFF0F0] transition-colors"
                                title="Report Breakdown Work Order"
                              >
                                <Flame className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PPM Maintenance Hub & Calendar */}
      {activeTab === 'ppm' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#17221E] font-serif">
                Planned Preventive Maintenance (PPM) Scheduler
              </h2>
              <p className="text-xs text-[#52605B]">
                Interactive multi-point safety inspections, sensor calibrations, and NABL digital certification sign-offs.
              </p>
            </div>
            <button
              onClick={() => setIsSchedulePpmModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#006B4F] text-white hover:bg-[#00543E] shadow-sm transition-colors cursor-pointer"
            >
              + Schedule Preventive Maintenance
            </button>
          </div>

          {/* PPM Schedule Table */}
          <div className="bg-white border border-[#E0EBE6] rounded-xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#17221E]">
                <thead className="bg-[#F6FBF8] border-b border-[#E0EBE6] text-[#52605B] font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">PPM Ticket & Asset</th>
                    <th className="py-3 px-4">Department & Suite</th>
                    <th className="py-3 px-4">Scheduled Date & Interval</th>
                    <th className="py-3 px-4">Assigned Engineer</th>
                    <th className="py-3 px-4">Execution Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0EBE6]">
                  {ppmSchedules.map((ppm) => {
                    const isCompleted = ppm.status.includes('Completed');
                    const isDueToday = ppm.status === 'Due Today';
                    const isOverdue = ppm.status === 'Overdue';
                    const isInProgress = ppm.status === 'In Progress';

                    return (
                      <tr key={ppm.id} className="hover:bg-[#F9FCFA] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#17221E]">{ppm.assetName}</div>
                          <div className="text-[11px] text-[#52605B] font-mono">
                            {ppm.id} • Tag: {ppm.assetTag}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#17221E]">{ppm.location}</div>
                          <div className="text-[11px] text-[#52605B]">{ppm.department}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#17221E]">{ppm.scheduledDate}</div>
                          <div className="text-[11px] text-[#52605B]">{ppm.frequency} Interval</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#17221E]">{ppm.assignedTechnician}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                              isCompleted
                                ? 'bg-[#EAF5F0] text-[#006B4F]'
                                : isDueToday || isOverdue
                                ? 'bg-[#FEF3C7] text-[#D97706]'
                                : isInProgress
                                ? 'bg-[#E0F2FE] text-[#0284C7] animate-pulse'
                                : 'bg-[#F3F4F6] text-[#52605B]'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            {ppm.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isCompleted ? (
                            <button
                              onClick={() => handleOpenPpmExecution(ppm)}
                              className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#EAF5F0] text-[#006B4F] hover:bg-[#D5EFE3] transition-colors"
                            >
                              View Certificate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenPpmExecution(ppm)}
                              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#006B4F] text-white hover:bg-[#00543E] shadow-sm transition-colors cursor-pointer"
                            >
                              Execute Checklist & Certify
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Breakdown CMMS Work Orders */}
      {activeTab === 'breakdowns' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs">
            <div>
              <h2 className="text-base font-bold text-[#17221E] font-serif">
                Computerized Maintenance Management System (CMMS)
              </h2>
              <p className="text-xs text-[#52605B]">
                Real-time reactive breakdown work orders, MTTR tracking, SLA management, and OEM escalation.
              </p>
            </div>
            <button
              onClick={() => setIsReportBreakdownModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#DE3730] text-white hover:bg-[#B3261E] shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Flame className="w-4 h-4" />
              <span>+ Log Emergency Work Order</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {breakdownOrders.map((wo) => {
              const isResolved = wo.status === 'Resolved & Restored' || wo.status === 'Closed';
              const isCodeRed = wo.priority.includes('Code Red') || wo.priority.includes('STAT');

              return (
                <div
                  key={wo.id}
                  className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                    isCodeRed && !isResolved ? 'border-[#DE3730] ring-1 ring-[#DE3730]' : 'border-[#E0EBE6]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isCodeRed ? 'bg-[#FFDADA] text-[#DE3730]' : 'bg-[#FEF3C7] text-[#D97706]'
                            }`}
                          >
                            {wo.priority}
                          </span>
                          <span className="text-xs font-mono text-[#52605B]">{wo.id}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#17221E] mt-1 font-serif">{wo.assetName}</h3>
                        <p className="text-xs text-[#52605B]">
                          {wo.department} • {wo.location}
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isResolved
                            ? 'bg-[#EAF5F0] text-[#006B4F]'
                            : 'bg-[#FFDADA] text-[#DE3730] animate-pulse'
                        }`}
                      >
                        {wo.status}
                      </span>
                    </div>

                    <div className="bg-[#F6FBF8] border border-[#E0EBE6] p-3 rounded-lg text-xs space-y-1.5">
                      <div className="text-[#17221E] font-medium">
                        <span className="text-[#52605B]">Symptom:</span> {wo.symptomDescription}
                      </div>
                      {wo.errorCode && (
                        <div className="text-[#DE3730] font-mono text-[11px]">
                          <span className="font-bold">Error Code:</span> {wo.errorCode}
                        </div>
                      )}
                      {wo.rootCause && (
                        <div className="text-[#006B4F] text-[11px]">
                          <span className="font-bold">Root Cause:</span> {wo.rootCause}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#52605B]">
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-[#85958F]">Reported By</span>
                        <span className="font-medium text-[#17221E]">{wo.reportedBy}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-[#85958F]">Assigned Engineer</span>
                        <span className="font-medium text-[#17221E]">{wo.assignedEngineer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#E0EBE6] pt-4 mt-4 flex items-center justify-between">
                    <div className="text-xs text-[#52605B]">
                      Downtime: <span className="font-bold text-[#17221E]">{wo.downtimeMinutes || 0} mins</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isResolved ? (
                        <>
                          <button
                            onClick={() => updateWorkOrderStatus(wo.id, 'Diagnosis In Progress')}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#BDE4D5] text-[#006B4F] hover:bg-[#EAF5F0]"
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => {
                              setActiveBreakdownForResolve(wo);
                              setResolveDowntime(wo.downtimeMinutes || 120);
                            }}
                            className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#006B4F] text-white hover:bg-[#00543E]"
                          >
                            Resolve & Restore →
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-[#006B4F] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Operational
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: AERB Radiation & EST Safety */}
      {activeTab === 'safety-aerb' && (
        <div className="space-y-6">
          <div className="bg-white border border-[#E0EBE6] p-5 rounded-xl shadow-xs">
            <h2 className="text-base font-bold text-[#17221E] font-serif flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#006B4F]" />
              AERB Radiation Safety & e-LORA Diagnostic Bunkers
            </h2>
            <p className="text-xs text-[#52605B] mt-0.5">
              Atomic Energy Regulatory Board compliance monitor, lead-shielding thickness, and lead apron integrity testing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {radiationLogs.map((log) => (
                <div key={log.id} className="border border-[#E0EBE6] rounded-xl p-4 bg-[#F6FBF8]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-[#17221E] text-sm">{log.roomName}</h3>
                      <p className="text-xs text-[#52605B]">{log.modality}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF5F0] text-[#006B4F]">
                      {log.leakageSurveyStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mt-3 bg-white p-3 rounded-lg border border-[#E0EBE6]">
                    <div>
                      <span className="text-[#52605B] block text-[10px]">AERB License No.</span>
                      <span className="font-mono text-[#17221E] font-medium">{log.aerbLicenseNo}</span>
                    </div>
                    <div>
                      <span className="text-[#52605B] block text-[10px]">Lead Shielding</span>
                      <span className="font-medium text-[#17221E]">{log.leadGlassShieldingMm} mm Pb Eq</span>
                    </div>
                    <div>
                      <span className="text-[#52605B] block text-[10px]">Ambient Dose Rate</span>
                      <span className="font-bold text-[#006B4F]">{log.ambientRadiationDoseMicroSvHr} µSv/hr</span>
                    </div>
                    <div>
                      <span className="text-[#52605B] block text-[10px]">Lead Apron Audit</span>
                      <span className="font-medium text-[#17221E]">{log.totalApronsTested} Tested (0 Defect)</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#52605B] mt-2 flex items-center justify-between">
                    <span>Officer in Charge: {log.officerInCharge}</span>
                    <span className="text-[#006B4F] font-medium">Valid QA Certificate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IEC Electrical Safety Standard Reference */}
          <div className="bg-white border border-[#E0EBE6] p-5 rounded-xl shadow-xs">
            <h3 className="text-sm font-bold text-[#17221E] font-serif">
              IEC 62353 & IEC 60601-1 Medical Electrical Safety Standard Margins
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="p-3 bg-[#F6FBF8] border border-[#E0EBE6] rounded-lg">
                <div className="font-bold text-[#17221E]">Protective Earth Resistance</div>
                <div className="text-xl font-bold text-[#006B4F] mt-1 font-serif">&le; 0.20 &Omega;</div>
                <div className="text-[11px] text-[#52605B] mt-0.5">200mA/10A test current</div>
              </div>
              <div className="p-3 bg-[#F6FBF8] border border-[#E0EBE6] rounded-lg">
                <div className="font-bold text-[#17221E]">Earth Leakage Current</div>
                <div className="text-xl font-bold text-[#006B4F] mt-1 font-serif">&le; 500 &mu;A</div>
                <div className="text-[11px] text-[#52605B] mt-0.5">Normal condition (NC)</div>
              </div>
              <div className="p-3 bg-[#F6FBF8] border border-[#E0EBE6] rounded-lg">
                <div className="font-bold text-[#17221E]">Enclosure Touch Leakage</div>
                <div className="text-xl font-bold text-[#006B4F] mt-1 font-serif">&le; 100 &mu;A</div>
                <div className="text-[11px] text-[#52605B] mt-0.5">Direct contact safe limit</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Spare Parts & BME Inventory */}
      {activeTab === 'spares' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E0EBE6] p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#17221E] font-serif">
                Biomedical Spares & Critical Consumables Depot
              </h2>
              <p className="text-xs text-[#52605B]">
                Sensors, expiratory cassettes, C-arm detector cables, burst discs, and dialysis conductivity probes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spareParts.map((part) => {
              const isLowStock = part.stockQuantity <= part.reorderLevel;

              return (
                <div key={part.id} className="bg-white border border-[#E0EBE6] rounded-xl p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm text-[#17221E]">{part.partName}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isLowStock ? 'bg-[#FFDADA] text-[#DE3730]' : 'bg-[#EAF5F0] text-[#006B4F]'
                        }`}
                      >
                        {isLowStock ? 'Low Stock' : 'Optimal Stock'}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-[#52605B] mt-1">
                      PN: {part.partNumber} • Bin: {part.storageBin}
                    </div>

                    <div className="text-xs text-[#52605B] mt-2">
                      <span className="font-medium text-[#17221E]">Compatible Models:</span>{' '}
                      {part.compatibleModels.join(', ')}
                    </div>

                    <div className="flex items-center justify-between text-xs mt-3 bg-[#F6FBF8] p-2.5 rounded-lg border border-[#E0EBE6]">
                      <div>
                        <span className="text-[#52605B] block text-[10px]">In Stock</span>
                        <span className="text-lg font-bold text-[#17221E] font-serif">{part.stockQuantity}</span>
                      </div>
                      <div>
                        <span className="text-[#52605B] block text-[10px]">Reorder Min</span>
                        <span className="text-sm font-medium text-[#52605B]">{part.reorderLevel}</span>
                      </div>
                      <div>
                        <span className="text-[#52605B] block text-[10px]">Unit Price</span>
                        <span className="text-sm font-bold text-[#006B4F]">₹{part.unitCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#E0EBE6]">
                    <button
                      onClick={() => adjustSparePartStock(part.id, -1, 'Used in OT PPM maintenance')}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-[#BDE4D5] text-[#006B4F] hover:bg-[#EAF5F0]"
                    >
                      - Issue 1 Unit
                    </button>
                    <button
                      onClick={() => reorderSparePart(part.id, 5)}
                      className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-[#006B4F] text-white hover:bg-[#00543E]"
                    >
                      + Inward (+5)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: BME Calculators & Tools */}
      {activeTab === 'calculators' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool 1: Electrical Safety Analyzer */}
          <div className="bg-white border border-[#E0EBE6] p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#006B4F]" />
              <h3 className="text-base font-bold text-[#17221E] font-serif">
                IEC 62353 Electrical Safety (EST) Live Validator
              </h3>
            </div>
            <p className="text-xs text-[#52605B]">
              Simulate or record direct earth bond resistance and patient leakage measurements to ensure zero shock hazard.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#52605B] font-medium mb-1">Target Biomedical Asset</label>
                <select
                  value={estTargetAssetId}
                  onChange={(e) => setEstTargetAssetId(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                >
                  <option value="">Select Equipment Asset...</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assetTag} - {a.assetName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Protective Earth Res (&Omega;)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={estEarthRes}
                    onChange={(e) => setEstEarthRes(Number(e.target.value))}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                  <span className="text-[10px] text-[#52605B]">Pass limit: &le; 0.20 &Omega;</span>
                </div>

                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Earth Leakage (&mu;A)</label>
                  <input
                    type="number"
                    value={estLeakageCurrent}
                    onChange={(e) => setEstLeakageCurrent(Number(e.target.value))}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                  <span className="text-[10px] text-[#52605B]">Pass limit: &le; 500 &mu;A</span>
                </div>
              </div>

              {/* Status Outcome Banner */}
              <div
                className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                  estEarthRes <= 0.2 && estLeakageCurrent <= 500
                    ? 'bg-[#EAF5F0] border-[#BDE4D5] text-[#006B4F]'
                    : 'bg-[#FFDADA] border-[#DE3730] text-[#DE3730]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  {estEarthRes <= 0.2 && estLeakageCurrent <= 500 ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> TEST RESULT: COMPLIANT / SAFE
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" /> TEST RESULT: FAILED / HAZARD DETECTED
                    </>
                  )}
                </div>
                <button
                  disabled={!estTargetAssetId}
                  onClick={handleSaveEstTest}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#006B4F] text-white hover:bg-[#00543E] disabled:opacity-50"
                >
                  Save to Asset Cert
                </button>
              </div>
            </div>
          </div>

          {/* Tool 2: MRI Cryogen & Helium Boil-Off Status */}
          <div className="bg-white border border-[#E0EBE6] p-5 rounded-xl shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-[#0284C7]" />
              <h3 className="text-base font-bold text-[#17221E] font-serif">
                3.0T MRI Cryogenic Cold-Head & Helium Watch
              </h3>
            </div>
            <p className="text-xs text-[#52605B]">
              Real-time liquid helium level monitoring (4.2 Kelvin superconducting magnet coil preservation).
            </p>

            <div className="bg-[#F0F9FF] border border-[#BAE6FD] p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0369A1]">Siemens Magnetom Vida 3.0T</span>
                <span className="font-bold text-[#0284C7] text-lg font-serif">88.5% Helium Level</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-[#BAE6FD] rounded-full overflow-hidden">
                <div className="h-full bg-[#0284C7] rounded-full" style={{ width: '88.5%' }} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-[#0369A1]">
                <div>
                  <span className="block text-[10px]">Cold-Head Compressor</span>
                  <span className="font-bold">Active & Nominal (18.2 Bar)</span>
                </div>
                <div>
                  <span className="block text-[10px]">Quench Valve Shield</span>
                  <span className="font-bold">Sealed & Intact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Complete & Execute PPM Checklist */}
      {activePpmForExecution && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-[#E0EBE6] flex items-center justify-between bg-[#F6FBF8]">
              <div>
                <h3 className="font-bold text-base text-[#17221E] font-serif">
                  Execute Planned Preventive Maintenance (PPM)
                </h3>
                <p className="text-xs text-[#52605B]">
                  {activePpmForExecution.assetName} • Ticket: {activePpmForExecution.id}
                </p>
              </div>
              <button
                onClick={() => setActivePpmForExecution(null)}
                className="p-1 rounded-lg hover:bg-[#E0EBE6] text-[#52605B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Checklist items */}
              <div>
                <div className="font-bold text-sm text-[#17221E] mb-2 font-serif">
                  1. Multi-Point Preventive Checklist
                </div>
                <div className="space-y-2">
                  {execChecklist.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        const updated = [...execChecklist];
                        updated[idx].passed = !updated[idx].passed;
                        setExecChecklist(updated);
                      }}
                      className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        item.passed
                          ? 'bg-[#EAF5F0] border-[#BDE4D5] text-[#006B4F]'
                          : 'bg-[#FFDADA] border-[#DE3730] text-[#DE3730]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center text-white text-xs ${
                            item.passed ? 'bg-[#006B4F]' : 'bg-[#DE3730]'
                          }`}
                        >
                          {item.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-medium text-[#17221E]">{item.title}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{item.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calibration values preview */}
              {activePpmForExecution.calibrationValues && (
                <div>
                  <div className="font-bold text-sm text-[#17221E] mb-2 font-serif">
                    2. Sensor Output & Calibration Tolerance Verification
                  </div>
                  <div className="bg-[#F6FBF8] border border-[#E0EBE6] rounded-lg p-3 space-y-2">
                    {activePpmForExecution.calibrationValues.map((cal, i) => (
                      <div key={i} className="flex items-center justify-between text-xs border-b border-[#E0EBE6] pb-1.5 last:border-0 last:pb-0">
                        <span className="text-[#17221E] font-medium">{cal.parameterName}</span>
                        <span className="font-mono text-[#006B4F] font-bold">
                          {cal.measuredValue} (Nominal: {cal.nominalValue})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parts Replaced & Notes */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Consumables / Spare Parts Replaced</label>
                  <input
                    type="text"
                    placeholder="e.g. O2 Cell Sensor, Bacterial Filter Kit, Silicone Seals"
                    value={execPartsReplaced}
                    onChange={(e) => setExecPartsReplaced(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>

                <div>
                  <label className="block text-[#52605B] font-medium mb-1">BME Technical Engineer Remarks</label>
                  <textarea
                    rows={2}
                    value={execNotes}
                    onChange={(e) => setExecNotes(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>

                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Digital Sign-Off Engineer Name</label>
                  <input
                    type="text"
                    value={execSignOffName}
                    onChange={(e) => setExecSignOffName(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E0EBE6] bg-[#F6FBF8] flex items-center justify-end gap-2">
              <button
                onClick={() => setActivePpmForExecution(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#BDE4D5] text-[#52605B] hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPpmCompletion}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#006B4F] text-white hover:bg-[#00543E] shadow-sm"
              >
                Certify & Complete PPM Checklist →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Report Breakdown */}
      {isReportBreakdownModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0EBE6] pb-3">
              <h3 className="text-base font-bold text-[#DE3730] font-serif flex items-center gap-1.5">
                <Flame className="w-5 h-5" /> Report Emergency Breakdown
              </h3>
              <button onClick={() => setIsReportBreakdownModalOpen(false)} className="text-[#52605B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBreakdown} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#52605B] font-medium mb-1">Select Machine / Asset</label>
                <select
                  required
                  value={breakdownAssetId}
                  onChange={(e) => setBreakdownAssetId(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                >
                  <option value="">Select Equipment Asset...</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assetTag} - {a.assetName} ({a.roomLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#52605B] font-medium mb-1">Priority / Urgency SLA</label>
                <select
                  value={breakdownPriority}
                  onChange={(e) => setBreakdownPriority(e.target.value as any)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                >
                  <option value="Code Red - STAT (Life Support Failure)">🚨 Code Red - STAT (Life Support Failure - 30m SLA)</option>
                  <option value="High Priority (OR / Diagnostic Interrupted)">High Priority (OR / Diagnostic Interrupted - 2h SLA)</option>
                  <option value="Medium Priority (Backup Unit Available)">Medium Priority (Backup Unit Available)</option>
                  <option value="Low / Routine">Low / Routine Inspection</option>
                </select>
              </div>

              <div>
                <label className="block text-[#52605B] font-medium mb-1">Symptom / Fault Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe failure behavior, audible alarms, smoke, loss of pressure..."
                  value={breakdownSymptom}
                  onChange={(e) => setBreakdownSymptom(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                />
              </div>

              <div>
                <label className="block text-[#52605B] font-medium mb-1">Display Error Code (if visible)</label>
                <input
                  type="text"
                  placeholder="e.g. ERR-KIN-7721, ALARM-O2-LOW"
                  value={breakdownErrorCode}
                  onChange={(e) => setBreakdownErrorCode(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                />
              </div>

              <div>
                <label className="block text-[#52605B] font-medium mb-1">Reporting Personnel Name</label>
                <input
                  type="text"
                  value={breakdownReportedBy}
                  onChange={(e) => setBreakdownReportedBy(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                />
              </div>

              <div className="pt-3 border-t border-[#E0EBE6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportBreakdownModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#BDE4D5] text-[#52605B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#DE3730] text-white font-semibold hover:bg-[#B3261E]"
                >
                  Dispatch Biomedical Team Now 🚨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Resolve Breakdown */}
      {activeBreakdownForResolve && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0EBE6] pb-3">
              <h3 className="text-base font-bold text-[#006B4F] font-serif flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> Resolve & Restore Machine to Service
              </h3>
              <button onClick={() => setActiveBreakdownForResolve(null)} className="text-[#52605B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveBreakdownSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#52605B] font-medium mb-1">Root Cause Analysis</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Root cause identified during teardown or diagnostics..."
                  value={resolveRootCause}
                  onChange={(e) => setResolveRootCause(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                />
              </div>

              <div>
                <label className="block text-[#52605B] font-medium mb-1">Corrective Action Taken</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Parts replaced, calibration run, positive pressure leak tests..."
                  value={resolveAction}
                  onChange={(e) => setResolveAction(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Downtime (Minutes)</label>
                  <input
                    type="number"
                    value={resolveDowntime}
                    onChange={(e) => setResolveDowntime(Number(e.target.value))}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>

                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Total Repair Cost (₹)</label>
                  <input
                    type="number"
                    value={resolveCost}
                    onChange={(e) => setResolveCost(Number(e.target.value))}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#E0EBE6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBreakdownForResolve(null)}
                  className="px-4 py-2 rounded-lg border border-[#BDE4D5] text-[#52605B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#006B4F] text-white font-semibold hover:bg-[#00543E]"
                >
                  Restore Asset to Operational State →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Schedule PPM */}
      {isSchedulePpmModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0EBE6] pb-3">
              <h3 className="text-base font-bold text-[#17221E] font-serif">
                Schedule Planned Preventive Maintenance (PPM)
              </h3>
              <button onClick={() => setIsSchedulePpmModalOpen(false)} className="text-[#52605B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSchedulePpmSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#52605B] font-medium mb-1">Select Equipment</label>
                <select
                  required
                  value={ppmAssetId}
                  onChange={(e) => setPpmAssetId(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                >
                  <option value="">Choose asset...</option>
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assetTag} - {a.assetName} ({a.roomLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={ppmDate}
                    onChange={(e) => setPpmDate(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>

                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Frequency</label>
                  <select
                    value={ppmFreq}
                    onChange={(e) => setPpmFreq(e.target.value as any)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#52605B] font-medium mb-1">Assigned Lead Biomedical Engineer</label>
                <input
                  type="text"
                  value={ppmEngineer}
                  onChange={(e) => setPpmEngineer(e.target.value)}
                  className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                />
              </div>

              <div className="pt-3 border-t border-[#E0EBE6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSchedulePpmModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#BDE4D5] text-[#52605B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#006B4F] text-white font-semibold hover:bg-[#00543E]"
                >
                  Confirm PPM Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Enroll Asset */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#E0EBE6] flex items-center justify-between bg-[#F6FBF8]">
              <h3 className="font-bold text-base text-[#17221E] font-serif">
                Enroll New Biomedical Device / Clinical Asset
              </h3>
              <button onClick={() => setIsEnrollModalOpen(false)} className="text-[#52605B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEnrollAsset} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Asset Name</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Philips Ultrasound Epiq 7"
                    value={newAssetName}
                    onChange={(e) => setNewAssetName(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Asset Code / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. BME-CARD-US-01"
                    value={newAssetTag}
                    onChange={(e) => setNewAssetTag(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Modality Category</label>
                  <select
                    value={newModality}
                    onChange={(e) => setNewModality(e.target.value as any)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  >
                    <option value="Critical Care & Life Support">Critical Care & Life Support</option>
                    <option value="Radiology & Radiation Oncology">Radiology & Radiation</option>
                    <option value="Surgical & OT Workstations">Surgical & OT</option>
                    <option value="Cardiology & Hybrid Cath Lab">Cardiology & Cath Lab</option>
                    <option value="Dialysis & Renal Care">Dialysis & Renal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Criticality Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  >
                    <option value="Tier 1: Life Support (Immediate Danger if Down)">Tier 1 Life Support</option>
                    <option value="Tier 2: Critical Diagnostic & Surgical">Tier 2 Critical Diagnostic/Surgical</option>
                    <option value="Tier 3: Supportive Clinical Device">Tier 3 Supportive Clinical Device</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Manufacturer</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Philips, GE, Getinge"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Model</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Epiq 7G"
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Serial Number</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. SN-88192-US"
                    value={newSerial}
                    onChange={(e) => setNewSerial(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Location Room / Suite</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Echo Room 102, Ground Floor"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Purchase Valuation (₹)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  />
                </div>
                <div>
                  <label className="block text-[#52605B] font-medium mb-1">Contract / Warranty</label>
                  <select
                    value={newContract}
                    onChange={(e) => setNewContract(e.target.value as any)}
                    className="w-full bg-[#F6FBF8] border border-[#BDE4D5] rounded-lg p-2 text-[#17221E]"
                  >
                    <option value="Comprehensive AMC (CAMC)">Comprehensive AMC (CAMC)</option>
                    <option value="CMC (Parts & Labor Inclusive)">CMC (Parts & Labor Inclusive)</option>
                    <option value="OEM Direct Warranty">OEM Direct Warranty</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border-t border-[#E0EBE6] bg-[#F6FBF8] flex justify-end gap-2 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={() => setIsEnrollModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#BDE4D5] text-[#52605B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#006B4F] text-white font-semibold hover:bg-[#00543E]"
                >
                  Commission Asset & Save →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Full Asset Details Drawer */}
      {selectedAssetForDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in">
            <div className="p-5 border-b border-[#E0EBE6] flex items-center justify-between bg-[#F6FBF8]">
              <div>
                <span className="text-[10px] font-bold font-mono text-[#006B4F] bg-[#EAF5F0] px-2 py-0.5 rounded-full">
                  {selectedAssetForDetails.assetTag}
                </span>
                <h3 className="font-bold text-lg text-[#17221E] font-serif mt-1">
                  {selectedAssetForDetails.assetName}
                </h3>
              </div>
              <button onClick={() => setSelectedAssetForDetails(null)} className="text-[#52605B]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#F6FBF8] p-4 rounded-xl border border-[#E0EBE6]">
                <div>
                  <span className="text-[#52605B] block">Manufacturer & Model:</span>
                  <span className="font-bold text-[#17221E]">
                    {selectedAssetForDetails.manufacturer} ({selectedAssetForDetails.model})
                  </span>
                </div>
                <div>
                  <span className="text-[#52605B] block">Serial Number:</span>
                  <span className="font-mono text-[#17221E] font-bold">{selectedAssetForDetails.serialNumber}</span>
                </div>
                <div>
                  <span className="text-[#52605B] block">Location:</span>
                  <span className="font-medium text-[#17221E]">{selectedAssetForDetails.roomLocation}</span>
                </div>
                <div>
                  <span className="text-[#52605B] block">Commissioning Date:</span>
                  <span className="font-medium text-[#17221E]">{selectedAssetForDetails.commissioningDate}</span>
                </div>
              </div>

              <div className="border border-[#E0EBE6] p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-[#17221E] text-xs font-serif">Maintenance & Vendor Service Level</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#52605B] block">Contract:</span>
                    <span className="font-medium text-[#17221E]">{selectedAssetForDetails.contractType}</span>
                  </div>
                  <div>
                    <span className="text-[#52605B] block">Service Partner:</span>
                    <span className="font-medium text-[#17221E]">{selectedAssetForDetails.vendorName}</span>
                  </div>
                  <div>
                    <span className="text-[#52605B] block">Vendor Hotline:</span>
                    <span className="font-mono text-[#006B4F] font-bold">{selectedAssetForDetails.vendorContactPhone}</span>
                  </div>
                  <div>
                    <span className="text-[#52605B] block">Contract Expiry:</span>
                    <span className="font-medium text-[#17221E]">{selectedAssetForDetails.contractExpiryDate}</span>
                  </div>
                </div>
              </div>

              {selectedAssetForDetails.aerbRadiationCompliance && (
                <div className="border border-[#BDE4D5] bg-[#EAF5F0] p-4 rounded-xl space-y-1">
                  <h4 className="font-bold text-[#006B4F] text-xs">AERB Radiation Safety Registration</h4>
                  <div className="text-[11px] text-[#17221E]">
                    License: {selectedAssetForDetails.aerbRadiationCompliance.licenseNo} • Valid Until:{' '}
                    {selectedAssetForDetails.aerbRadiationCompliance.validUntil}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E0EBE6] bg-[#F6FBF8] flex justify-between items-center">
              <button
                onClick={() => {
                  decommissionAsset(selectedAssetForDetails.id, 'Routine life-cycle retirement');
                  setSelectedAssetForDetails(null);
                }}
                className="px-3 py-1.5 text-xs text-[#DE3730] hover:underline"
              >
                Quarantine / Decommission Asset
              </button>
              <button
                onClick={() => setSelectedAssetForDetails(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#006B4F] text-white hover:bg-[#00543E]"
              >
                Close Spec Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
