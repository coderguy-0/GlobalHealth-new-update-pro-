import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  BiomedicalAsset,
  PpmScheduleRecord,
  BreakdownWorkOrder,
  BiomedicalSparePart,
  RadiationSafetyLog,
  AssetOperationalStatus,
  ModalityCategory,
  CriticalityTier,
  MaintenanceContractType,
  ElectricalSafetyRecord
} from '../types/biomedicalExtended';
import {
  INITIAL_BIOMEDICAL_ASSETS,
  INITIAL_PPM_SCHEDULES,
  INITIAL_BREAKDOWN_WORK_ORDERS,
  INITIAL_BIOMEDICAL_SPARE_PARTS,
  INITIAL_RADIATION_SAFETY_LOGS
} from '../data/biomedicalSeedData';
import { useHospitalPortal } from './HospitalContext';

interface BiomedicalContextType {
  // Master Datasets
  assets: BiomedicalAsset[];
  ppmSchedules: PpmScheduleRecord[];
  breakdownOrders: BreakdownWorkOrder[];
  spareParts: BiomedicalSparePart[];
  radiationLogs: RadiationSafetyLog[];

  // Computed KPIs & Aggregates
  totalAssetsCount: number;
  totalAssetValuation: number;
  fleetUptimeAverage: number;
  ppmDueCount: number;
  ppmOverdueCount: number;
  activeBreakdownsCount: number;
  statBreakdownsCount: number;
  aerbComplianceRate: number;
  expiringContractsCount: number;

  // Asset Operations
  addAsset: (asset: Omit<BiomedicalAsset, 'id' | 'hospitalId'>) => void;
  updateAsset: (id: string, updates: Partial<BiomedicalAsset>) => void;
  decommissionAsset: (id: string, reason: string) => void;

  // PPM Scheduler & Execution Operations
  schedulePpm: (schedule: Omit<PpmScheduleRecord, 'id' | 'hospitalId' | 'status'>) => void;
  startPpmExecution: (ppmId: string, technicianName: string) => void;
  completePpmChecklist: (
    ppmId: string,
    checklist: PpmScheduleRecord['checklist'],
    engineerNotes: string,
    partsReplaced: string[],
    calibrationValues: PpmScheduleRecord['calibrationValues'],
    signOffName: string
  ) => void;
  reschedulePpm: (ppmId: string, newDate: string, reason: string) => void;

  // Breakdown & CMMS Operations
  reportBreakdown: (order: Omit<BreakdownWorkOrder, 'id' | 'hospitalId' | 'reportedAt' | 'status' | 'downtimeMinutes' | 'slaBreached' | 'totalCostIncurred'>) => void;
  updateWorkOrderStatus: (orderId: string, status: BreakdownWorkOrder['status'], notes?: string, engineer?: string) => void;
  resolveWorkOrder: (orderId: string, rootCause: string, actionTaken: string, costIncurred: number, downtimeMins: number) => void;

  // Safety & Calibration
  recordElectricalSafetyTest: (assetId: string, testRecord: ElectricalSafetyRecord) => void;
  updateRadiationSurvey: (logId: string, updates: Partial<RadiationSafetyLog>) => void;

  // Spare Parts
  adjustSparePartStock: (partId: string, delta: number, reason: string) => void;
  reorderSparePart: (partId: string, qty: number) => void;
}

const BiomedicalContext = createContext<BiomedicalContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_BME = 'globalhealth_biomedical_assets_v2';

export const BiomedicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentHospitalId, currentUser, addAuditLog } = useHospitalPortal();

  // Assets Master
  const [assets, setAssets] = useState<BiomedicalAsset[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_BME}_assets`);
      return stored ? JSON.parse(stored) : INITIAL_BIOMEDICAL_ASSETS;
    } catch {
      return INITIAL_BIOMEDICAL_ASSETS;
    }
  });

  // PPM Schedules
  const [ppmSchedules, setPpmSchedules] = useState<PpmScheduleRecord[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_BME}_ppm`);
      return stored ? JSON.parse(stored) : INITIAL_PPM_SCHEDULES;
    } catch {
      return INITIAL_PPM_SCHEDULES;
    }
  });

  // Breakdown Work Orders
  const [breakdownOrders, setBreakdownOrders] = useState<BreakdownWorkOrder[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_BME}_breakdown`);
      return stored ? JSON.parse(stored) : INITIAL_BREAKDOWN_WORK_ORDERS;
    } catch {
      return INITIAL_BREAKDOWN_WORK_ORDERS;
    }
  });

  // Spare Parts
  const [spareParts, setSpareParts] = useState<BiomedicalSparePart[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_BME}_parts`);
      return stored ? JSON.parse(stored) : INITIAL_BIOMEDICAL_SPARE_PARTS;
    } catch {
      return INITIAL_BIOMEDICAL_SPARE_PARTS;
    }
  });

  // Radiation Logs
  const [radiationLogs, setRadiationLogs] = useState<RadiationSafetyLog[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_BME}_rad`);
      return stored ? JSON.parse(stored) : INITIAL_RADIATION_SAFETY_LOGS;
    } catch {
      return INITIAL_RADIATION_SAFETY_LOGS;
    }
  });

  // Local Storage Persistence
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_BME}_assets`, JSON.stringify(assets));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_BME}_ppm`, JSON.stringify(ppmSchedules));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_BME}_breakdown`, JSON.stringify(breakdownOrders));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_BME}_parts`, JSON.stringify(spareParts));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_BME}_rad`, JSON.stringify(radiationLogs));
  }, [assets, ppmSchedules, breakdownOrders, spareParts, radiationLogs]);

  // Aggregate KPIs
  const totalAssetsCount = assets.length;

  const totalAssetValuation = useMemo(() => {
    return assets.reduce((sum, item) => sum + (item.currentBookValue || item.purchaseCost || 0), 0);
  }, [assets]);

  const fleetUptimeAverage = useMemo(() => {
    if (assets.length === 0) return 100;
    const sum = assets.reduce((acc, item) => acc + (item.uptimePercentage || 99.5), 0);
    return Number((sum / assets.length).toFixed(1));
  }, [assets]);

  const ppmDueCount = useMemo(() => {
    return ppmSchedules.filter((p) => p.status === 'Due Today' || p.status === 'Scheduled').length;
  }, [ppmSchedules]);

  const ppmOverdueCount = useMemo(() => {
    return ppmSchedules.filter((p) => p.status === 'Overdue').length;
  }, [ppmSchedules]);

  const activeBreakdownsCount = useMemo(() => {
    return breakdownOrders.filter((b) => b.status !== 'Resolved & Restored' && b.status !== 'Closed').length;
  }, [breakdownOrders]);

  const statBreakdownsCount = useMemo(() => {
    return breakdownOrders.filter(
      (b) =>
        (b.status !== 'Resolved & Restored' && b.status !== 'Closed') &&
        (b.priority.includes('STAT') || b.priority.includes('High Priority'))
    ).length;
  }, [breakdownOrders]);

  const aerbComplianceRate = useMemo(() => {
    const licensedAssets = assets.filter((a) => a.aerbRadiationCompliance);
    if (licensedAssets.length === 0) return 100;
    const compliant = licensedAssets.filter((a) => a.aerbRadiationCompliance?.qaSurveyPassed);
    return Math.round((compliant.length / licensedAssets.length) * 100);
  }, [assets]);

  const expiringContractsCount = useMemo(() => {
    const now = new Date();
    const thresholdDays = 60;
    return assets.filter((a) => {
      if (!a.contractExpiryDate) return false;
      const exp = new Date(a.contractExpiryDate);
      const diff = (exp.getTime() - now.getTime()) / (1000 * 3600 * 24);
      return diff > 0 && diff <= thresholdDays;
    }).length;
  }, [assets]);

  // Asset Actions
  const addAsset: BiomedicalContextType['addAsset'] = (assetData) => {
    const newId = `BME-${Math.floor(100 + Math.random() * 900)}`;
    const newAsset: BiomedicalAsset = {
      ...assetData,
      id: newId,
      hospitalId: currentHospitalId
    };

    setAssets((prev) => [newAsset, ...prev]);
    addAuditLog(
      'Biomedical Asset Enrolled',
      'Clinical Engineering (HTM)',
      `Commissioned ${newAsset.assetName} (${newAsset.assetTag}) in ${newAsset.roomLocation}.`
    );
  };

  const updateAsset: BiomedicalContextType['updateAsset'] = (id, updates) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    addAuditLog(
      'Biomedical Asset Updated',
      'Clinical Engineering (HTM)',
      `Updated asset parameters on ${id}.`
    );
  };

  const decommissionAsset: BiomedicalContextType['decommissionAsset'] = (id, reason) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              operationalStatus: 'Decommissioned / Quarantined' as AssetOperationalStatus
            }
          : a
      )
    );
    addAuditLog(
      'Biomedical Asset Decommissioned',
      'Clinical Engineering (HTM)',
      `Asset ${id} quarantined and marked decommissioned. Reason: ${reason}`
    );
  };

  // PPM Scheduler & Execution
  const schedulePpm: BiomedicalContextType['schedulePpm'] = (scheduleData) => {
    const newPpm: PpmScheduleRecord = {
      ...scheduleData,
      id: `PPM-2026-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId: currentHospitalId,
      status: 'Scheduled'
    };

    setPpmSchedules((prev) => [newPpm, ...prev]);
    addAuditLog(
      'Planned Preventive Maintenance Scheduled',
      'Biomedical PPM Hub',
      `Scheduled ${newPpm.frequency} PPM for ${newPpm.assetName} on ${newPpm.scheduledDate}.`
    );
  };

  const startPpmExecution: BiomedicalContextType['startPpmExecution'] = (ppmId, technicianName) => {
    setPpmSchedules((prev) =>
      prev.map((p) =>
        p.id === ppmId
          ? {
              ...p,
              status: 'In Progress',
              assignedTechnician: technicianName
            }
          : p
      )
    );
  };

  const completePpmChecklist: BiomedicalContextType['completePpmChecklist'] = (
    ppmId,
    checklist,
    engineerNotes,
    partsReplaced,
    calibrationValues,
    signOffName
  ) => {
    const certId = `CERT-PPM-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];

    let targetAssetId = '';
    let targetFrequency = 'Quarterly';

    setPpmSchedules((prev) =>
      prev.map((p) => {
        if (p.id === ppmId) {
          targetAssetId = p.assetId;
          targetFrequency = p.frequency;
          return {
            ...p,
            status: 'Completed - Passed',
            completedDate: nowIso,
            checklist,
            engineerNotes,
            partsReplaced,
            calibrationValues,
            digitalSignOff: {
              engineerName: signOffName,
              signTimestamp: nowIso,
              certificateId: certId
            }
          };
        }
        return p;
      })
    );

    // Update Asset's last PPM and compute next PPM date
    if (targetAssetId) {
      let intervalDays = 90; // Default quarterly
      if (targetFrequency === 'Monthly') intervalDays = 30;
      if (targetFrequency === 'Semi-Annual') intervalDays = 180;
      if (targetFrequency === 'Annual') intervalDays = 365;

      const nextPpmDate = new Date(Date.now() + intervalDays * 24 * 3600 * 1000).toISOString().split('T')[0];

      setAssets((prev) =>
        prev.map((a) => {
          if (a.id === targetAssetId) {
            return {
              ...a,
              operationalStatus: 'Operational & Calibrated',
              lastPpmDate: todayDate,
              nextPpmDate
            };
          }
          return a;
        })
      );
    }

    addAuditLog(
      'Biomedical PPM Completed & Certified',
      'Biomedical PPM Hub',
      `Completed PPM certificate ${certId} by ${signOffName}. Asset ${targetAssetId} restored to Operational & Calibrated.`
    );
  };

  const reschedulePpm: BiomedicalContextType['reschedulePpm'] = (ppmId, newDate, reason) => {
    setPpmSchedules((prev) =>
      prev.map((p) => (p.id === ppmId ? { ...p, scheduledDate: newDate, status: 'Scheduled' } : p))
    );
    addAuditLog(
      'PPM Maintenance Rescheduled',
      'Biomedical PPM Hub',
      `Rescheduled PPM ${ppmId} to ${newDate}. Reason: ${reason}`
    );
  };

  // Breakdown & CMMS Work Orders
  const reportBreakdown: BiomedicalContextType['reportBreakdown'] = (orderData) => {
    const orderId = `WO-BD-2026-${Math.floor(100 + Math.random() * 900)}`;
    const isStat = orderData.priority.includes('STAT') || orderData.priority.includes('Code Red');

    const newOrder: BreakdownWorkOrder = {
      ...orderData,
      id: orderId,
      hospitalId: currentHospitalId,
      reportedAt: new Date().toISOString(),
      status: 'Open - Awaiting Triage',
      slaTargetMinutes: isStat ? 30 : 120,
      slaBreached: false,
      downtimeMinutes: 0,
      totalCostIncurred: 0
    };

    // Mark corresponding asset as Under Breakdown Maintenance
    setAssets((prev) =>
      prev.map((a) =>
        a.id === orderData.assetId
          ? {
              ...a,
              operationalStatus: 'Under Breakdown Maintenance'
            }
          : a
      )
    );

    setBreakdownOrders((prev) => [newOrder, ...prev]);

    addAuditLog(
      'EMERGENCY BIOMEDICAL BREAKDOWN REPORTED',
      'Biomedical CMMS',
      `Breakdown order ${orderId} logged on ${orderData.assetName} (${orderData.priority}). Reported by ${orderData.reportedBy}.`
    );
  };

  const updateWorkOrderStatus: BiomedicalContextType['updateWorkOrderStatus'] = (orderId, status, notes, engineer) => {
    setBreakdownOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            assignedEngineer: engineer || o.assignedEngineer,
            actionTaken: notes ? `${o.actionTaken || ''} [${status}: ${notes}]` : o.actionTaken
          };
        }
        return o;
      })
    );

    addAuditLog(
      'Breakdown Work Order Status Updated',
      'Biomedical CMMS',
      `Work order ${orderId} transitioned to '${status}'.`
    );
  };

  const resolveWorkOrder: BiomedicalContextType['resolveWorkOrder'] = (
    orderId,
    rootCause,
    actionTaken,
    costIncurred,
    downtimeMins
  ) => {
    let targetAssetId = '';

    setBreakdownOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          targetAssetId = o.assetId;
          return {
            ...o,
            status: 'Resolved & Restored',
            rootCause,
            actionTaken,
            totalCostIncurred: costIncurred,
            downtimeMinutes: downtimeMins,
            resolvedAt: new Date().toISOString()
          };
        }
        return o;
      })
    );

    // Restore asset operational status
    if (targetAssetId) {
      setAssets((prev) =>
        prev.map((a) =>
          a.id === targetAssetId
            ? {
                ...a,
                operationalStatus: 'Operational & Calibrated'
              }
            : a
        )
      );
    }

    addAuditLog(
      'Biomedical Breakdown Resolved & Calibrated',
      'Biomedical CMMS',
      `Restored asset ${targetAssetId} to service after resolving work order ${orderId}. Downtime: ${downtimeMins} mins.`
    );
  };

  // Safety & Calibration
  const recordElectricalSafetyTest: BiomedicalContextType['recordElectricalSafetyTest'] = (assetId, testRecord) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          return {
            ...a,
            electricalSafetyTesting: testRecord,
            operationalStatus: testRecord.passed ? a.operationalStatus : 'Calibration Expired'
          };
        }
        return a;
      })
    );

    addAuditLog(
      'IEC Electrical Safety Test (EST) Logged',
      'Biomedical Safety & Quality',
      `EST recorded on asset ${assetId}. Result: ${testRecord.passed ? 'PASSED' : 'FAILED'}.`
    );
  };

  const updateRadiationSurvey: BiomedicalContextType['updateRadiationSurvey'] = (logId, updates) => {
    setRadiationLogs((prev) => prev.map((l) => (l.id === logId ? { ...l, ...updates } : l)));
    addAuditLog(
      'AERB Radiation Survey QA Updated',
      'Radiation Safety Officer (RSO)',
      `Updated radiation safety survey record on ${logId}.`
    );
  };

  // Spare Parts
  const adjustSparePartStock: BiomedicalContextType['adjustSparePartStock'] = (partId, delta, reason) => {
    setSpareParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          return {
            ...p,
            stockQuantity: Math.max(0, p.stockQuantity + delta)
          };
        }
        return p;
      })
    );

    addAuditLog(
      'Biomedical Spare Parts Stock Adjusted',
      'Biomedical Logistics',
      `Adjusted part ${partId} by ${delta > 0 ? `+${delta}` : delta} units. Reason: ${reason}`
    );
  };

  const reorderSparePart: BiomedicalContextType['reorderSparePart'] = (partId, qty) => {
    setSpareParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          return {
            ...p,
            stockQuantity: p.stockQuantity + qty
          };
        }
        return p;
      })
    );

    addAuditLog(
      'Biomedical Spare Part PO Inwarded',
      'Biomedical Logistics',
      `Received shipment of ${qty} units for spare part ID ${partId}.`
    );
  };

  return (
    <BiomedicalContext.Provider
      value={{
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
      }}
    >
      {children}
    </BiomedicalContext.Provider>
  );
};

export const useBiomedical = () => {
  const context = useContext(BiomedicalContext);
  if (!context) {
    throw new Error('useBiomedical must be used within a BiomedicalProvider');
  }
  return context;
};
