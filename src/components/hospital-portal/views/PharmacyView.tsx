import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Calculator,
  Activity,
  AlertTriangle,
  Zap,
  ArrowRightLeft,
  Truck,
  FileCheck2,
  History,
  Lock,
  Layers,
  ThermometerSnowflake,
  PackageCheck,
  Flame,
  FileText,
  RotateCcw,
  Sliders,
  DollarSign,
  TrendingDown,
  Building2,
  Boxes,
  Ban
} from 'lucide-react';
import { usePharmacy } from '../../../context/PharmacyContext';
import { useHospitalPortal } from '../../../context/HospitalContext';
import {
  EnterpriseMedication,
  PharmacyLocation,
  FormularyStatus,
  OrderPriority,
  TherapeuticClass
} from '../../../types/pharmacyExtended';

export const PharmacyView: React.FC = () => {
  const { currentRole, currentUser } = useHospitalPortal();
  const {
    medications,
    dispensingOrders,
    purchaseRequests,
    purchaseOrders,
    formularyProposals,
    recalls,
    stockMovements,
    totalSkusCount,
    totalInventoryValuation,
    lowStockItemsCount,
    criticalStockItemsCount,
    expiringSoonBatchesCount,
    activeRecallsCount,
    pendingDispenseCount,
    pendingPurchaseOrdersCount,
    pendingFormularyProposalsCount,
    addMedication,
    updateFormularyStatus,
    transferStock,
    quarantineBatch,
    releaseQuarantineBatch,
    adjustStockDiscrepancy,
    createDispensingOrder,
    verifyDispensingOrder,
    completeDispenseOrder,
    cancelDispensingOrder,
    createPurchaseRequest,
    approvePurchaseRequest,
    receivePurchaseOrderShipment,
    submitFormularyProposal,
    decideFormularyProposal,
    initiateRecall,
    closeRecall
  } = usePharmacy();

  // Navigation Subtabs
  const [activeTab, setActiveTab] = useState<
    'command' | 'master' | 'dispensing' | 'procurement' | 'formulary' | 'safety_recalls' | 'audit_trace' | 'iv_calc'
  >('command');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [selectedMedication, setSelectedMedication] = useState<EnterpriseMedication | null>(null);

  // Modals & Drawers
  const [showAddSkuModal, setShowAddSkuModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [showNewProposalModal, setShowNewProposalModal] = useState(false);
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [showReconcileModal, setShowReconcileModal] = useState(false);

  // Form States
  const [newBrandName, setNewBrandName] = useState('');
  const [newGenericName, setNewGenericName] = useState('');
  const [newClass, setNewClass] = useState<TherapeuticClass>('Antimicrobial / Antibiotic Stewardship');
  const [newStrength, setNewStrength] = useState('1.0 g');
  const [newDosageForm, setNewDosageForm] = useState<EnterpriseMedication['dosageForm']>('Vial');
  const [newPrice, setNewPrice] = useState(350);
  const [newCost, setNewCost] = useState(210);
  const [newInitialStock, setNewInitialStock] = useState(200);
  const [newHighAlert, setNewHighAlert] = useState(false);
  const [newControlled, setNewControlled] = useState(false);
  const [newColdChain, setNewColdChain] = useState(false);

  // Transfer Form
  const [transferMedId, setTransferMedId] = useState('');
  const [transferBatchId, setTransferBatchId] = useState('');
  const [transferFrom, setTransferFrom] = useState<PharmacyLocation>('Central Pharmacy Vault');
  const [transferTo, setTransferTo] = useState<PharmacyLocation>('ICU Satellite Pharmacy');
  const [transferQty, setTransferQty] = useState(10);
  const [transferReason, setTransferReason] = useState('Critical care emergency crash cart replenishment');

  // Purchase Request Form
  const [reqMedId, setReqMedId] = useState('');
  const [reqQty, setReqQty] = useState(250);
  const [reqSupplier, setReqSupplier] = useState('Global BioPharm Pvt Ltd');
  const [reqUrgency, setReqUrgency] = useState<any>('STAT Emergency Shortage');
  const [reqJustification, setReqJustification] = useState('Buffer threshold breached. Surge patient load.');

  // Formulary Proposal Form
  const [propGeneric, setPropGeneric] = useState('');
  const [propBrand, setPropBrand] = useState('');
  const [propStrength, setPropStrength] = useState('');
  const [propClass, setPropClass] = useState<TherapeuticClass>('Antimicrobial / Antibiotic Stewardship');
  const [propJustification, setPropJustification] = useState('');
  const [propAlternatives, setPropAlternatives] = useState('');
  const [propUsage, setPropUsage] = useState(50);
  const [propCost, setPropCost] = useState(450000);

  // Recall Form
  const [recallNumber, setRecallNumber] = useState('CDSCO-REC-2026-');
  const [recallBrand, setRecallBrand] = useState('');
  const [recallGeneric, setRecallGeneric] = useState('');
  const [recallBatch, setRecallBatch] = useState('');
  const [recallMfr, setRecallMfr] = useState('');
  const [recallSeverity, setRecallSeverity] = useState<any>('Class I (High Risk / Potentially Fatal)');
  const [recallReason, setRecallReason] = useState('');

  // Reconcile Discrepancy Form
  const [reconcileMedId, setReconcileMedId] = useState('');
  const [reconcileBatchId, setReconcileBatchId] = useState('');
  const [reconcileCount, setReconcileCount] = useState(0);
  const [reconcileReason, setReconcileReason] = useState('Physical cycle count discrepancy audit');

  // IV Calculator State
  const [ivVolumeMl, setIvVolumeMl] = useState(500);
  const [ivTimeHours, setIvTimeHours] = useState(4);
  const [dropFactorGtt, setDropFactorGtt] = useState(20);
  const [patientWeightKg, setPatientWeightKg] = useState(70);
  const [drugDoseMcgKgMin, setDrugDoseMcgKgMin] = useState(0.05);
  const [drugVialMg, setDrugVialMg] = useState(4);

  // Quick Action Handlers
  const handleCreateSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName || !newGenericName) return;

    addMedication({
      drugCode: `DRG-${newBrandName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      brandName: newBrandName,
      genericName: newGenericName,
      atcClassification: 'J01',
      therapeuticClass: newClass,
      dosageForm: newDosageForm,
      strength: newStrength,
      packSize: 'Standard Institutional Pack',
      route: 'Intravenous (IV)',
      manufacturer: 'Premier Therapeutics Corp',
      distributor: 'Apex Central MedSupply',
      formularyStatus: 'Formulary Approved',
      formularyCategory: 'Standard',
      isHighAlert: newHighAlert,
      isControlledSubstance: newControlled,
      isAntibioticStewardship: newClass.includes('Antimicrobial'),
      requiresColdChain: newColdChain,
      reorderLevel: 50,
      safetyStock: 20,
      maxStockLevel: 500,
      unitPrice: newPrice,
      acquisitionCost: newCost,
      approvedIndications: ['Institutional Inpatient Clinical Protocol'],
      formularyReviewedAt: new Date().toISOString().split('T')[0],
      formularyNextReview: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
      initialStock: newInitialStock,
      location: 'Central Pharmacy Vault'
    });

    setNewBrandName('');
    setNewGenericName('');
    setShowAddSkuModal(false);
  };

  const handleStockTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferMedId || !transferBatchId || transferQty <= 0) return;

    const ok = transferStock(transferMedId, transferBatchId, transferFrom, transferTo, transferQty, transferReason);
    if (ok) {
      setShowTransferModal(false);
    }
  };

  const handlePurchaseReqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medications.find((m) => m.id === reqMedId);
    if (!med) return;

    createPurchaseRequest({
      medicationId: med.id,
      brandName: med.brandName,
      genericName: med.genericName,
      currentStock: med.currentStock,
      requestedQuantity: reqQty,
      estimatedCost: reqQty * med.acquisitionCost,
      urgency: reqUrgency,
      preferredSupplier: reqSupplier,
      justification: reqJustification,
      requestedBy: currentUser?.name || 'Chief Pharmacist'
    });

    setShowRequisitionModal(false);
  };

  const handleFormularyProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propBrand || !propGeneric) return;

    submitFormularyProposal({
      proposedGenericName: propGeneric,
      proposedBrandName: propBrand,
      strength: propStrength,
      dosageForm: 'Vial for Injection',
      therapeuticClass: propClass,
      requestingPhysician: currentUser?.name || 'Prof. Dr. Vikram Sethi',
      requestingDepartment: 'Cardiothoracic Surgery & Intensive Care',
      clinicalJustification: propJustification,
      existingAlternativesEvaluated: propAlternatives,
      estimatedMonthlyUsage: propUsage,
      estimatedAnnualCost: propCost
    });

    setPropBrand('');
    setPropGeneric('');
    setPropJustification('');
    setShowNewProposalModal(false);
  };

  const handleRecallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recallBatch || !recallBrand) return;

    initiateRecall({
      recallNumber,
      brandName: recallBrand,
      genericName: recallGeneric,
      batchNumber: recallBatch,
      manufacturer: recallMfr,
      severity: recallSeverity,
      reason: recallReason,
      officerInCharge: currentUser?.name || 'Chief Pharmacist'
    });

    setShowRecallModal(false);
  };

  const handleReconcileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconcileMedId || !reconcileBatchId) return;

    adjustStockDiscrepancy(reconcileMedId, reconcileBatchId, reconcileCount, reconcileReason);
    setShowReconcileModal(false);
  };

  // Filtered master list
  const filteredMeds = medications.filter((m) => {
    const matchQuery =
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.drugCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.batches.some((b) => b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchStatus = statusFilter === 'ALL' || m.formularyStatus === statusFilter;
    const matchLoc = locationFilter === 'ALL' || (m.locationsStock[locationFilter as PharmacyLocation] || 0) > 0;

    return matchQuery && matchStatus && matchLoc;
  });

  // IV Calculations
  const calculatedFlowRateMlHr = Number((ivVolumeMl / (ivTimeHours || 1)).toFixed(1));
  const calculatedDropRateGttMin = Math.round((calculatedFlowRateMlHr * dropFactorGtt) / 60);
  const concentrationMcgMl = (drugVialMg * 1000) / 250;
  const inotropeFlowRateMlHr = Number(((drugDoseMcgKgMin * patientWeightKg * 60) / (concentrationMcgMl || 1)).toFixed(1));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header & Operational Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Pharmacy Operating System & Closed-Loop Formulary
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Autonomous FEFO Dispensation • Cold-Chain Monitoring • P&T Governance • Traceable Batch Ledger
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('command')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'command' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Command Center</span>
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'master' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Medicine Master ({totalSkusCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('dispensing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dispensing' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Dispensing Queue</span>
            {pendingDispenseCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-bold">
                {pendingDispenseCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('procurement')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'procurement' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Procurement & POs</span>
          </button>
          <button
            onClick={() => setActiveTab('formulary')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'formulary' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Formulary Governance</span>
          </button>
          <button
            onClick={() => setActiveTab('safety_recalls')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'safety_recalls' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Recalls & Safety</span>
            {activeRecallsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-600 text-white font-bold">
                {activeRecallsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('audit_trace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit_trace' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trace</span>
          </button>
          <button
            onClick={() => setActiveTab('iv_calc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'iv_calc' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>IV Calc</span>
          </button>
        </div>
      </div>

      {/* Global Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-700" />
            Operational Actions:
          </span>
          <button
            onClick={() => setShowAddSkuModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Enlist Medicine SKU</span>
          </button>
          <button
            onClick={() => setShowTransferModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Inter-Ward Transfer</span>
          </button>
          <button
            onClick={() => setShowRequisitionModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <Truck className="w-3.5 h-3.5 text-slate-600" />
            <span>Raise Purchase Requisition</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewProposalModal(true)}
            className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-teal-700" />
            <span>Submit Formulary Proposal</span>
          </button>
          <button
            onClick={() => setShowRecallModal(true)}
            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <Ban className="w-3.5 h-3.5 text-rose-700" />
            <span>Initiate Batch Recall</span>
          </button>
          <button
            onClick={() => setShowReconcileModal(true)}
            className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
            <span>Cycle Count Discrepancy</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. COMMAND CENTER DASHBOARD                                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'command' && (
        <div className="space-y-6">
          {/* Top 6 High-Density KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total SKUs</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{totalSkusCount}</div>
              <span className="text-[10px] text-emerald-700 font-semibold">100% Formulary Verified</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Inventory Valuation</span>
              <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                ₹{(totalInventoryValuation / 100000).toFixed(2)} L
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">At FIFO Acquisition Cost</span>
            </div>

            <div className={`p-4 rounded-2xl border shadow-xs ${lowStockItemsCount > 0 ? 'bg-amber-50/70 border-amber-200' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Low Buffer SKUs</span>
              <div className="text-2xl font-black text-amber-900 mt-1">{lowStockItemsCount}</div>
              <span className="text-[10px] text-amber-700 font-semibold">Reorder Advised</span>
            </div>

            <div className={`p-4 rounded-2xl border shadow-xs ${criticalStockItemsCount > 0 ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">Critical Stockout Risk</span>
              <div className="text-2xl font-black text-rose-900 mt-1">{criticalStockItemsCount}</div>
              <span className="text-[10px] text-rose-700 font-semibold">Below Safety Threshold</span>
            </div>

            <div className={`p-4 rounded-2xl border shadow-xs ${expiringSoonBatchesCount > 0 ? 'bg-orange-50 border-orange-200' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">Expiring &lt;90 Days</span>
              <div className="text-2xl font-black text-orange-900 mt-1">{expiringSoonBatchesCount} Batches</div>
              <span className="text-[10px] text-orange-700 font-semibold">FEFO Auto-Routing</span>
            </div>

            <div className={`p-4 rounded-2xl border shadow-xs ${activeRecallsCount > 0 ? 'bg-red-100 border-red-300' : 'bg-white border-slate-200'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-900 block">Active CDSCO Recalls</span>
              <div className="text-2xl font-black text-red-950 mt-1">{activeRecallsCount}</div>
              <span className="text-[10px] text-red-800 font-semibold">Quarantine Vault Frozen</span>
            </div>
          </div>

          {/* Departmental Distributed Stock Matrix */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-700" />
                  <span>Multi-Location Hospital Inventory Distribution Matrix</span>
                </h3>
                <p className="text-xs text-slate-500">Live physical unit telemetry synchronized across central and satellite pharmacies</p>
              </div>
              <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                8 Holding Zones Synchronized
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { loc: 'Central Pharmacy Vault', icon: Boxes, desc: 'Master Bulk Inpatient Store' },
                { loc: 'ICU Satellite Pharmacy', icon: Activity, desc: 'Critical Inotropes & Sedation' },
                { loc: 'Emergency Trauma Bay Pharmacy', icon: Flame, desc: 'ACLS Crash Cart Reserves' },
                { loc: 'Operating Theatre (OT) Satellite', icon: ShieldCheck, desc: 'Sterile Surgical Anesthetics' },
                { loc: 'Oncology Cleanroom / Infusion', icon: Lock, desc: 'Cytotoxic Biohazard Compounding' },
                { loc: 'Inpatient Ward Stock (Floors 1-5)', icon: Layers, desc: 'Routine Floor Stocks' },
                { loc: 'Cold-Chain Biologicals Storage (2-8°C)', icon: ThermometerSnowflake, desc: 'Vaccines, Biologics & Toxoids' },
                { loc: 'Quarantine & Disposal Holding', icon: Ban, desc: 'Isolated Suspended/Recalled Batches' }
              ].map((item, idx) => {
                const totalUnitsInLoc = medications.reduce((sum, m) => sum + (m.locationsStock[item.loc as PharmacyLocation] || 0), 0);
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Icon className="w-3.5 h-3.5 text-emerald-700" />
                        <span className="truncate">{item.loc}</span>
                      </div>
                      <span className="font-mono font-black text-slate-900 text-sm">{totalUnitsInLoc}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Strips: Urgent Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Dispensing Queue Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-emerald-700" />
                  <span>Pending Prescription Queue ({pendingDispenseCount})</span>
                </h3>
                <button
                  onClick={() => setActiveTab('dispensing')}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {dispensingOrders.slice(0, 3).map((order) => (
                  <div
                    key={order.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      order.priority.includes('STAT')
                        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{order.patientName}</span>
                        <span className="font-mono text-[10px] text-slate-500">({order.patientMRN})</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            order.priority.includes('STAT') ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {order.priority.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {order.bedOrLocation} • {order.items.map((i) => `${i.brandName} (${i.doseOrdered})`).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {order.status !== 'Dispensed / Administered' && (
                        <button
                          onClick={() => completeDispenseOrder(order.id, currentUser?.name || 'Chief Pharmacist')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Dispense
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Critical Stock & Safety Alerts Preview */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Critical Stock Shortage & Expiry Sentinel</span>
                </h3>
                <button
                  onClick={() => setActiveTab('master')}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  Manage Master →
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {medications
                  .filter((m) => m.currentStock <= m.reorderLevel || m.batches.some((b) => b.status === 'Expiring Soon'))
                  .slice(0, 3)
                  .map((med) => (
                    <div
                      key={med.id}
                      className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3 text-slate-900"
                    >
                      <div>
                        <div className="font-bold flex items-center gap-2">
                          <span>{med.brandName}</span>
                          <span className="font-mono text-[10px] text-amber-900 bg-amber-200 px-1.5 py-0.2 rounded">
                            Stock: {med.currentStock} / Reorder: {med.reorderLevel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          {med.genericName} • {med.therapeuticClass.split('/')[0]}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setReqMedId(med.id);
                          setShowRequisitionModal(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition cursor-pointer shrink-0"
                      >
                        Reorder PO
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MEDICINE MASTER & BATCH LEVEL INVENTORY                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'master' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brand, generic salt, ATC code, batch #..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none font-medium cursor-pointer"
              >
                <option value="ALL">All Formulary Statuses</option>
                <option value="Formulary Approved">Formulary Approved</option>
                <option value="Restricted / Prior Auth">Restricted / Prior Auth</option>
                <option value="Emergency Use Only">Emergency Use Only</option>
                <option value="Recalled">Recalled</option>
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-none font-medium cursor-pointer"
              >
                <option value="ALL">All Storage Locations</option>
                <option value="Central Pharmacy Vault">Central Pharmacy Vault</option>
                <option value="ICU Satellite Pharmacy">ICU Satellite Pharmacy</option>
                <option value="Emergency Trauma Bay Pharmacy">Emergency Trauma Bay</option>
                <option value="Operating Theatre (OT) Satellite">Operating Theatre</option>
              </select>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="py-3 px-4">Medication & Salt</th>
                    <th className="py-3 px-4">Form & Strength</th>
                    <th className="py-3 px-4">Formulary Class</th>
                    <th className="py-3 px-4">Total Stock</th>
                    <th className="py-3 px-4">Active Batches (FEFO)</th>
                    <th className="py-3 px-4">Unit Price / Cost</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMeds.map((med) => {
                    const isLow = med.currentStock <= med.reorderLevel;
                    const isCrit = med.currentStock <= med.safetyStock;
                    return (
                      <tr key={med.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{med.brandName}</div>
                          <div className="text-[11px] text-slate-500">{med.genericName}</div>
                          <div className="flex items-center gap-1 mt-1">
                            {med.isHighAlert && (
                              <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded border border-rose-200">
                                HIGH-ALERT
                              </span>
                            )}
                            {med.isControlledSubstance && (
                              <span className="text-[9px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded border border-purple-200">
                                SCHEDULE X
                              </span>
                            )}
                            {med.requiresColdChain && (
                              <span className="text-[9px] font-bold bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded border border-cyan-200 flex items-center gap-0.5">
                                <ThermometerSnowflake className="w-2.5 h-2.5" /> 2-8°C
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-slate-700">
                          <div>{med.dosageForm}</div>
                          <div className="font-mono font-bold text-slate-900">{med.strength}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              med.formularyStatus === 'Formulary Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : med.formularyStatus.includes('Restricted')
                                ? 'bg-amber-100 text-amber-800'
                                : med.formularyStatus === 'Recalled'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {med.formularyStatus}
                          </span>
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[140px]">
                            {med.therapeuticClass}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-mono font-black text-slate-900 text-sm">{med.currentStock} Units</div>
                          {isCrit ? (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                              CRITICAL SHORTAGE
                            </span>
                          ) : isLow ? (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              REORDER REQUIRED
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-700 font-semibold">Optimal Buffer</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            {med.batches.map((batch) => (
                              <div key={batch.id} className="flex items-center gap-1.5 text-[11px] font-mono">
                                <span className="font-bold text-slate-800">{batch.batchNumber}</span>
                                <span className="text-slate-400">({batch.quantityAvailable}u)</span>
                                <span
                                  className={`text-[9px] px-1 py-0.2 rounded ${
                                    batch.status === 'Expiring Soon'
                                      ? 'bg-orange-100 text-orange-800 font-bold'
                                      : batch.status === 'Quarantined'
                                      ? 'bg-purple-100 text-purple-800 font-bold'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}
                                >
                                  Exp: {batch.expiryDate}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-900">₹{med.unitPrice}</div>
                          <div className="text-[10px] text-slate-400">Cost: ₹{med.acquisitionCost}</div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedMedication(med)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                setTransferMedId(med.id);
                                if (med.batches[0]) setTransferBatchId(med.batches[0].id);
                                setShowTransferModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                            >
                              Transfer
                            </button>
                          </div>
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

      {/* ------------------------------------------------------------- */}
      {/* 3. DISPENSING QUEUE (CLOSED-LOOP VERIFICATION)                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'dispensing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-emerald-700" />
                <span>Active Inpatient Clinical Dispensing Queue</span>
              </h2>
              <p className="text-xs text-slate-500">Order verification, automated FEFO allocation, and two-pharmacist verification workflow</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {dispensingOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white p-5 rounded-2xl border shadow-xs space-y-3 ${
                  order.priority.includes('STAT') ? 'border-rose-300' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-black text-slate-900 font-mono text-sm">{order.id}</div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        order.priority.includes('STAT')
                          ? 'bg-rose-600 text-white animate-pulse'
                          : order.priority.includes('Urgent')
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {order.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Ordered: {new Date(order.orderedAt).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                        order.status === 'Dispensed / Administered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Ready for Dispensing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Patient & Prescriber Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Patient / Bed Location</span>
                    <span className="font-bold text-slate-900">{order.patientName}</span>
                    <span className="text-slate-500 block">{order.bedOrLocation} (MRN: {order.patientMRN})</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Ordering Physician</span>
                    <span className="font-bold text-slate-900">{order.orderingDoctor}</span>
                    <span className="text-slate-500 block">{order.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Clinical Indication</span>
                    <p className="text-slate-700 italic">{order.clinicalNotes || 'Routine Care'}</p>
                  </div>
                </div>

                {/* Ordered Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[9px] font-bold border-b border-slate-100">
                        <th className="pb-1.5">Prescribed Item</th>
                        <th className="pb-1.5">Ordered Dosage / Route</th>
                        <th className="pb-1.5">Allocated Batch (FEFO)</th>
                        <th className="pb-1.5">Qty Ordered</th>
                        <th className="pb-1.5">Total Charge</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="py-2">
                          <td className="py-2 font-bold text-slate-900">{item.brandName}</td>
                          <td className="py-2 text-slate-600">{item.doseOrdered} • {item.route}</td>
                          <td className="py-2 font-mono text-emerald-800 font-semibold">
                            {item.allocatedBatchNumber || 'AUTO-ASSIGNED'}
                          </td>
                          <td className="py-2 font-mono font-bold text-slate-900">{item.quantityOrdered} Units</td>
                          <td className="py-2 font-mono font-bold text-slate-900">₹{item.unitPrice * item.quantityOrdered}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Verification Actions Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <div className="text-xs text-slate-500">
                    {order.verifiedByPharmacist ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Pharmacist: {order.verifiedByPharmacist}
                      </span>
                    ) : (
                      <span className="text-amber-700 font-medium">Awaiting Pharmacist Clinical Check</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status === 'Under Clinical Verification' && (
                      <button
                        onClick={() => verifyDispensingOrder(order.id, currentUser?.name || 'Chief Pharmacist')}
                        className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Verify & Authorize
                      </button>
                    )}

                    {order.status !== 'Dispensed / Administered' && (
                      <button
                        onClick={() => completeDispenseOrder(order.id, currentUser?.name || 'Chief Pharmacist')}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs cursor-pointer"
                      >
                        Complete Dispense
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. PROCUREMENT & PURCHASE ORDERS                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'procurement' && (
        <div className="space-y-6">
          {/* Purchase Requests */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Internal Stock Requisitions ({purchaseRequests.length})</span>
              </h3>
              <button
                onClick={() => setShowRequisitionModal(true)}
                className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
              >
                + Create Requisition
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="pb-2 px-3">PR ID</th>
                    <th className="pb-2 px-3">Medication</th>
                    <th className="pb-2 px-3">Current / Required Qty</th>
                    <th className="pb-2 px-3">Urgency</th>
                    <th className="pb-2 px-3">Preferred Supplier</th>
                    <th className="pb-2 px-3">Status</th>
                    <th className="pb-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchaseRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{req.id}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{req.brandName}</div>
                        <div className="text-[10px] text-slate-500">{req.genericName}</div>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="text-rose-600 font-bold">{req.currentStock}</span> / <span className="font-bold text-slate-900">{req.requestedQuantity} Units</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.urgency.includes('STAT') ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {req.urgency}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{req.preferredSupplier}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            req.status.includes('Approved') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {req.status === 'Pending HOD Approval' && (
                          <button
                            onClick={() => approvePurchaseRequest(req.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
                          >
                            Approve PO
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Purchase Orders Active */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                <span>Supplier Purchase Orders ({purchaseOrders.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {purchaseOrders.map((po) => (
                <div key={po.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-slate-900 text-sm">{po.id}</span>
                      <span className="font-bold text-slate-800">{po.supplierName}</span>
                      <span className="text-slate-500 font-mono">₹{po.totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          po.status === 'Goods Received & Inspected'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {po.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-slate-600">
                    Lines: {po.lineItems.map((li) => `${li.brandName} (${li.quantityOrdered} Units)`).join(', ')}
                  </div>

                  {po.status === 'Confirmed / In Transit' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          receivePurchaseOrderShipment(
                            po.id,
                            po.lineItems.map((li) => ({
                              medicationId: li.medicationId,
                              batchNumber: `BAT-INW-${Math.floor(1000 + Math.random() * 9000)}`,
                              expiryDate: '2028-12-31',
                              qtyReceived: li.quantityOrdered,
                              storageLocation: 'Central Pharmacy Vault'
                            }))
                          );
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Receive & Inward Inspect Shipment
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. FORMULARY GOVERNANCE & P&T PROPOSALS                       */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'formulary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-700" />
                <span>Pharmacy & Therapeutics (P&T) Committee Governance</span>
              </h2>
              <p className="text-xs text-slate-500">Formal clinical review, cost-effectiveness dossiers, and institutional restriction policies</p>
            </div>
            <button
              onClick={() => setShowNewProposalModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              + Propose New Drug
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {formularyProposals.map((prop) => (
              <div key={prop.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{prop.id}</span>
                      <span className="font-bold text-slate-900 text-sm">{prop.proposedBrandName}</span>
                      <span className="text-slate-500 font-mono">({prop.proposedGenericName})</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Requested by {prop.requestingPhysician} ({prop.requestingDepartment})
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg font-bold text-xs ${
                      prop.status.includes('Approved')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-teal-100 text-teal-900'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Clinical Need & Indication
                    </span>
                    <p className="text-slate-800">{prop.clinicalJustification}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                      Alternatives & Economics
                    </span>
                    <p className="text-slate-800">
                      Evaluated: {prop.existingAlternativesEvaluated} • Est. Annual Spend: ₹{prop.estimatedAnnualCost.toLocaleString()}
                    </p>
                  </div>
                </div>

                {prop.status.includes('Review') || prop.status.includes('Scheduled') ? (
                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => decideFormularyProposal(prop.id, 'Approved for Formulary', 'P&T approved for unrestricted institutional use.')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Approve to Formulary
                    </button>
                    <button
                      onClick={() => decideFormularyProposal(prop.id, 'Approved with Restrictions', 'Approved under restricted specialist/ICU indication.')}
                      className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Approve with Restrictions
                    </button>
                    <button
                      onClick={() => decideFormularyProposal(prop.id, 'Rejected', 'Rejected due to sufficient existing formulary alternatives.')}
                      className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-900 font-bold text-xs transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. RECALLS & PHARMACOVIGILANCE SAFETY                        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'safety_recalls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-700" />
                <span>CDSCO / Regulatory Medication Recalls & Quarantine Vault</span>
              </h2>
              <p className="text-xs text-slate-500">Autonomous batch isolation, automated department notifications, and physical disposal tracking</p>
            </div>
            <button
              onClick={() => setShowRecallModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              + Initiate STAT Recall
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {recalls.map((rcl) => (
              <div key={rcl.id} className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-900">{rcl.recallNumber}</span>
                      <span className="font-bold text-slate-900 text-sm">{rcl.brandName}</span>
                      <span className="font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        Batch: {rcl.batchNumber}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">{rcl.severity} • Officer: {rcl.officerInCharge}</span>
                  </div>

                  <span className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs">
                    {rcl.status}
                  </span>
                </div>

                <div className="bg-rose-50 p-3 rounded-xl space-y-1 text-slate-900">
                  <span className="text-[10px] font-bold uppercase text-rose-900 block">Hazard Justification</span>
                  <p>{rcl.reason}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-medium text-slate-600 border-t border-slate-100 pt-3">
                  <span>Units Frozen in Quarantine Holding: <strong className="font-mono text-rose-900">{rcl.totalUnitsFrozen} Units</strong></span>
                  {rcl.status === 'Active Isolation' && (
                    <button
                      onClick={() => closeRecall(rcl.id, 'OEM reconciliation complete. Stock safely incinerated per bio-waste protocols.')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Reconcile & Close Recall
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 7. IMMUTABLE AUDIT TRAIL                                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'audit_trace' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-700" />
                <span>Cryptographic Stock Movement & Dispensation Ledger</span>
              </h3>
              <p className="text-xs text-slate-500">Tamper-evident chronological log of every medication transfer, quarantine, and patient charge</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="pb-2 px-3">Timestamp</th>
                  <th className="pb-2 px-3">Movement Type</th>
                  <th className="pb-2 px-3">Medication / Batch</th>
                  <th className="pb-2 px-3">Routing Route</th>
                  <th className="pb-2 px-3">Delta Qty</th>
                  <th className="pb-2 px-3">User</th>
                  <th className="pb-2 px-3">Hash Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-600">{new Date(mov.timestamp).toLocaleTimeString()}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{mov.movementType}</td>
                    <td className="py-2.5 px-3 text-slate-800">
                      <div>{mov.medicationName}</div>
                      <div className="text-[10px] text-slate-500">{mov.batchNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                      {mov.sourceLocation} {mov.destinationLocation ? `→ ${mov.destinationLocation}` : ''}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{mov.quantityChanged > 0 ? `+${mov.quantityChanged}` : mov.quantityChanged}</td>
                    <td className="py-2.5 px-3 text-slate-700">{mov.performedBy}</td>
                    <td className="py-2.5 px-3 text-[10px] text-emerald-800 truncate max-w-[120px]">{mov.immutableHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 8. IV INFUSION & INOTROPE CALCULATOR                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'iv_calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-700" />
                <span>Volumetric IV Infusion Calculator</span>
              </h2>
              <p className="text-xs text-slate-500">Computes pump rate (mL/hr) & gravity drop rate (gtt/min)</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">TOTAL INFUSION VOLUME (mL)</label>
                <input
                  type="number"
                  value={ivVolumeMl}
                  onChange={(e) => setIvVolumeMl(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">TARGET INFUSION TIME (HOURS)</label>
                <input
                  type="number"
                  step="0.5"
                  value={ivTimeHours}
                  onChange={(e) => setIvTimeHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">IV TUBING DROP FACTOR (gtt/mL)</label>
                <select
                  value={dropFactorGtt}
                  onChange={(e) => setDropFactorGtt(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium text-slate-800"
                >
                  <option value={10}>10 gtt/mL (Blood / Macro Drip)</option>
                  <option value={15}>15 gtt/mL (Standard Macro)</option>
                  <option value={20}>20 gtt/mL (Standard Adult)</option>
                  <option value={60}>60 gtt/mL (Micro Drip / Pediatric)</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 grid grid-cols-2 gap-4 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">VOLUMETRIC PUMP RATE</span>
                <div className="text-2xl font-black font-mono text-emerald-900 mt-0.5">{calculatedFlowRateMlHr} mL/hr</div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">GRAVITY DRIP RATE</span>
                <div className="text-2xl font-black font-mono text-emerald-900 mt-0.5">{calculatedDropRateGttMin} gtt/min</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-teal-700" />
                <span>Vasopressor / Inotrope Dosing Matrix</span>
              </h2>
              <p className="text-xs text-slate-500">Weight-based infusion computation (mcg/kg/min to mL/hr)</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">PATIENT WEIGHT (kg)</label>
                <input
                  type="number"
                  value={patientWeightKg}
                  onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">DESIRED DOSE (mcg/kg/min)</label>
                <input
                  type="number"
                  step="0.01"
                  value={drugDoseMcgKgMin}
                  onChange={(e) => setDrugDoseMcgKgMin(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">TOTAL DRUG IN 250mL D5W / NS (mg)</label>
                <input
                  type="number"
                  value={drugVialMg}
                  onChange={(e) => setDrugVialMg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase text-teal-800 block">SYRINGE PUMP FLOW RATE</span>
              <div className="text-3xl font-black font-mono text-teal-900">{inotropeFlowRateMlHr} mL/hr</div>
              <p className="text-[11px] text-teal-700 font-medium">Concentration: {concentrationMcgMl} mcg/mL</p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODALS & DRAWERS                                              */}
      {/* ------------------------------------------------------------- */}
      {/* 1. Add SKU Modal */}
      {showAddSkuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Enlist New Medication Master SKU</h3>
              <button onClick={() => setShowAddSkuModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleCreateSku} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="e.g. Meropenem IV 1g"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Generic / Active Salt</label>
                  <input
                    type="text"
                    required
                    value={newGenericName}
                    onChange={(e) => setNewGenericName(e.target.value)}
                    placeholder="e.g. Meropenem Trihydrate"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Strength / Presentation</label>
                  <input
                    type="text"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Therapeutic Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl font-medium"
                  >
                    <option value="Antimicrobial / Antibiotic Stewardship">Antimicrobial Stewardship</option>
                    <option value="Cardiovascular & Antithrombotic">Cardiovascular & Antithrombotic</option>
                    <option value="Critical Care & Vasopressors">Critical Care & Vasopressors</option>
                    <option value="Analgesics & Controlled Narcotics (Schedule X/H1)">Controlled Narcotics</option>
                    <option value="Anesthesia & Neuromuscular Blockers">Anesthesia & Blockers</option>
                    <option value="IV Fluids & Total Parenteral Nutrition (TPN)">IV Fluids & TPN</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Price (₹)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Acquisition Cost (₹)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={newInitialStock}
                    onChange={(e) => setNewInitialStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-4 p-3 bg-slate-50 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newHighAlert} onChange={(e) => setNewHighAlert(e.target.checked)} />
                  <span className="font-bold">ISMP High-Alert</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newControlled} onChange={(e) => setNewControlled(e.target.checked)} />
                  <span className="font-bold">Controlled Substance</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newColdChain} onChange={(e) => setNewColdChain(e.target.checked)} />
                  <span className="font-bold">Cold-Chain (2-8°C)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSkuModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Save to Formulary Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Stock Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Inter-Department Stock Transfer</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleStockTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Medication</label>
                <select
                  value={transferMedId}
                  onChange={(e) => {
                    setTransferMedId(e.target.value);
                    const m = medications.find((med) => med.id === e.target.value);
                    if (m && m.batches[0]) setTransferBatchId(m.batches[0].id);
                  }}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  <option value="">-- Choose Drug --</option>
                  {medications.map((m) => (
                    <option key={m.id} value={m.id}>{m.brandName} ({m.genericName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Source Location</label>
                  <select
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="Central Pharmacy Vault">Central Pharmacy Vault</option>
                    <option value="ICU Satellite Pharmacy">ICU Satellite</option>
                    <option value="Operating Theatre (OT) Satellite">OT Satellite</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destination Location</label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="ICU Satellite Pharmacy">ICU Satellite Pharmacy</option>
                    <option value="Emergency Trauma Bay Pharmacy">Emergency Trauma Bay</option>
                    <option value="Operating Theatre (OT) Satellite">Operating Theatre</option>
                    <option value="Inpatient Ward Stock (Floors 1-5)">Inpatient Ward Floor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Transfer Units</label>
                <input
                  type="number"
                  value={transferQty}
                  onChange={(e) => setTransferQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Execute Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Requisition Modal */}
      {showRequisitionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Raise Stock Requisition for Procurement</h3>
              <button onClick={() => setShowRequisitionModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handlePurchaseReqSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Medicine</label>
                <select
                  value={reqMedId}
                  onChange={(e) => setReqMedId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-medium"
                >
                  <option value="">-- Choose Medicine --</option>
                  {medications.map((m) => (
                    <option key={m.id} value={m.id}>{m.brandName} (Stock: {m.currentStock})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reorder Quantity</label>
                  <input
                    type="number"
                    value={reqQty}
                    onChange={(e) => setReqQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency</label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  >
                    <option value="STAT Emergency Shortage">STAT Emergency Shortage</option>
                    <option value="Scheduled Buffer Reorder">Scheduled Buffer Reorder</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequisitionModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Submit Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Formulary Proposal Modal */}
      {showNewProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Submit New Drug Formulary Addition Proposal</h3>
              <button onClick={() => setShowNewProposalModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleFormularyProposalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Proposed Generic Molecule</label>
                <input
                  type="text"
                  required
                  value={propGeneric}
                  onChange={(e) => setPropGeneric(e.target.value)}
                  placeholder="e.g. Ceftazidime / Avibactam"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Name & Strength</label>
                <input
                  type="text"
                  required
                  value={propBrand}
                  onChange={(e) => setPropBrand(e.target.value)}
                  placeholder="e.g. Zavicefta IV (2.5g)"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Justification</label>
                <textarea
                  required
                  value={propJustification}
                  onChange={(e) => setPropJustification(e.target.value)}
                  rows={3}
                  placeholder="Provide therapeutic benefit over existing formulary alternatives..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProposalModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Submit to P&T Committee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Recall Modal */}
      {showRecallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-rose-900">Initiate STAT Drug Recall & Isolation</h3>
              <button onClick={() => setShowRecallModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleRecallSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Batch Number to Freeze</label>
                <input
                  type="text"
                  required
                  value={recallBatch}
                  onChange={(e) => setRecallBatch(e.target.value)}
                  placeholder="e.g. HP26A09"
                  className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-rose-900"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={recallBrand}
                  onChange={(e) => setRecallBrand(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recall Reason / Hazard</label>
                <textarea
                  required
                  value={recallReason}
                  onChange={(e) => setRecallReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Particulate matter detected in ampoules by manufacturer..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRecallModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Freeze & Quarantine Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Cycle Count Discrepancy Modal */}
      {showReconcileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900">Inventory Cycle Count Reconciliation</h3>
              <button onClick={() => setShowReconcileModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={handleReconcileSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Medicine</label>
                <select
                  value={reconcileMedId}
                  onChange={(e) => {
                    setReconcileMedId(e.target.value);
                    const m = medications.find((med) => med.id === e.target.value);
                    if (m && m.batches[0]) {
                      setReconcileBatchId(m.batches[0].id);
                      setReconcileCount(m.batches[0].quantityAvailable);
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-xl"
                >
                  <option value="">-- Choose Medicine --</option>
                  {medications.map((m) => (
                    <option key={m.id} value={m.id}>{m.brandName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Physical Verified Count</label>
                <input
                  type="number"
                  value={reconcileCount}
                  onChange={(e) => setReconcileCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-xl font-mono text-sm font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReconcileModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Commit Reconciliation Delta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Medication Detail Drawer */}
      {selectedMedication && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40">
          <div className="bg-white w-full max-w-xl h-full p-6 overflow-y-auto space-y-5 shadow-2xl animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{selectedMedication.brandName}</h2>
                <p className="text-xs text-slate-500 font-mono">{selectedMedication.genericName} • {selectedMedication.drugCode}</p>
              </div>
              <button
                onClick={() => setSelectedMedication(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Formulary Status</span>
                <span className="font-bold text-slate-900">{selectedMedication.formularyStatus}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Active Units</span>
                <span className="font-mono font-bold text-slate-900">{selectedMedication.currentStock} Units</span>
              </div>
            </div>

            {/* Department Stock Breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Distribution by Physical Location</h4>
              <div className="space-y-1.5 text-xs">
                {Object.entries(selectedMedication.locationsStock).map(([loc, count], idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-700">{loc}</span>
                    <span className="font-mono font-bold text-slate-900">{count} Units</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Batches breakdown */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Batch-Level Inventory (FEFO Ranked)</h4>
              <div className="space-y-2 text-xs">
                {selectedMedication.batches.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1.5">
                    <div className="flex items-center justify-between font-mono">
                      <span className="font-bold text-slate-900">{b.batchNumber}</span>
                      <span className="text-emerald-700 font-bold">{b.quantityAvailable} Available</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Expires: {b.expiryDate}</span>
                      <span>Location: {b.currentLocation}</span>
                    </div>
                    {b.status === 'Available' && (
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => quarantineBatch(selectedMedication.id, b.id, 'Routine safety quarantine')}
                          className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-bold text-[10px]"
                        >
                          Quarantine Batch
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedMedication(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs text-slate-700 cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
