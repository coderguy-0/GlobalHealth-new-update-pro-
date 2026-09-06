import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  LabTestMaster,
  ImagingServiceMaster,
  DiagnosticOrder,
  RegulatorySafetyRecord,
  DiagnosticOrderStatus,
  OrderPriority
} from '../types/diagnostics';
import {
  SEED_LAB_TESTS_MASTER,
  SEED_IMAGING_MASTER,
  SEED_DIAGNOSTIC_ORDERS,
  SEED_REGULATORY_SAFETY
} from '../data/diagnosticsData';
import { useHospitalPortal } from './HospitalContext';

interface DiagnosticContextType {
  // Master Registries
  labTests: LabTestMaster[];
  imagingServices: ImagingServiceMaster[];
  orders: DiagnosticOrder[];
  safetyRecords: RegulatorySafetyRecord[];

  // Pathology Actions
  addLabTest: (test: Omit<LabTestMaster, 'id' | 'hospitalId'>) => void;
  updateLabTest: (id: string, test: Partial<LabTestMaster>) => void;
  deleteLabTest: (id: string) => void;

  // Radiology Actions
  addImagingService: (service: Omit<ImagingServiceMaster, 'id' | 'hospitalId'>) => void;
  updateImagingService: (id: string, service: Partial<ImagingServiceMaster>) => void;
  deleteImagingService: (id: string) => void;

  // Order Lifecycle
  createOrder: (order: Omit<DiagnosticOrder, 'orderId' | 'hospitalId' | 'requisitionTimestamp' | 'status'>) => DiagnosticOrder;
  updateOrderStatus: (orderId: string, status: DiagnosticOrderStatus) => void;
  collectSample: (orderId: string, barcode?: string) => void;
  processAnalyzer: (orderId: string) => void;
  verifyReport: (
    orderId: string,
    payload: {
      quantitativeValue?: string;
      findingsReport?: string;
      impression?: string;
      verifiedByDoctor?: string;
      isPanicValue?: boolean;
      panicValueNote?: string;
    }
  ) => void;
  acknowledgePanicAlert: (orderId: string, notes?: string) => void;

  // Safety & Audit
  addSafetyRecord: (record: Omit<RegulatorySafetyRecord, 'id' | 'hospitalId'>) => void;

  // Modals & Active State
  activeModal:
    | 'new_requisition'
    | 'add_lab_test'
    | 'add_imaging'
    | 'phlebotomy_barcode'
    | 'verify_report'
    | 'dicom_viewer'
    | null;
  selectedOrder: DiagnosticOrder | null;
  selectedDicomPreset: 'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO';
  openRequisitionModal: (targetService?: { id: string; name: string; code: string; type: 'LABORATORY' | 'IMAGING' }) => void;
  openAddLabModal: () => void;
  openAddImagingModal: () => void;
  openPhlebotomyModal: (order: DiagnosticOrder) => void;
  openVerificationModal: (order: DiagnosticOrder) => void;
  openDicomViewer: (preset: 'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO') => void;
  closeModal: () => void;

  // Computed KPIs
  stats: {
    totalLabTests: number;
    totalImagingServices: number;
    activeOrdersCount: number;
    statOrdersCount: number;
    panicAlertsCount: number;
    completedTodayCount: number;
    nablComplianceScore: number;
    aerbSafetyMargin: string;
  };
}

const DiagnosticContext = createContext<DiagnosticContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'apex_diagnostics_v2';

export const DiagnosticProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentHospitalId, addAuditLog } = useHospitalPortal();

  // 1. Lab Tests State
  const [labTests, setLabTests] = useState<LabTestMaster[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_lab_tests`);
      return saved ? JSON.parse(saved) : SEED_LAB_TESTS_MASTER;
    } catch {
      return SEED_LAB_TESTS_MASTER;
    }
  });

  // 2. Imaging Suites State
  const [imagingServices, setImagingServices] = useState<ImagingServiceMaster[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_imaging`);
      return saved ? JSON.parse(saved) : SEED_IMAGING_MASTER;
    } catch {
      return SEED_IMAGING_MASTER;
    }
  });

  // 3. Orders State
  const [orders, setOrders] = useState<DiagnosticOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_orders`);
      return saved ? JSON.parse(saved) : SEED_DIAGNOSTIC_ORDERS;
    } catch {
      return SEED_DIAGNOSTIC_ORDERS;
    }
  });

  // 4. Safety Records State
  const [safetyRecords, setSafetyRecords] = useState<RegulatorySafetyRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}_safety`);
      return saved ? JSON.parse(saved) : SEED_REGULATORY_SAFETY;
    } catch {
      return SEED_REGULATORY_SAFETY;
    }
  });

  // Modals & selections
  const [activeModal, setActiveModal] = useState<
    | 'new_requisition'
    | 'add_lab_test'
    | 'add_imaging'
    | 'phlebotomy_barcode'
    | 'verify_report'
    | 'dicom_viewer'
    | null
  >(null);
  const [selectedOrder, setSelectedOrder] = useState<DiagnosticOrder | null>(null);
  const [selectedDicomPreset, setSelectedDicomPreset] = useState<'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO'>('CXR');
  const [requisitionPreload, setRequisitionPreload] = useState<{
    id: string;
    name: string;
    code: string;
    type: 'LABORATORY' | 'IMAGING';
  } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_lab_tests`, JSON.stringify(labTests));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_imaging`, JSON.stringify(imagingServices));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_orders`, JSON.stringify(orders));
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}_safety`, JSON.stringify(safetyRecords));
    } catch {
      // ignore
    }
  }, [labTests, imagingServices, orders, safetyRecords]);

  // LAB TESTS CRUD
  const addLabTest = (test: Omit<LabTestMaster, 'id' | 'hospitalId'>) => {
    const newTest: LabTestMaster = {
      ...test,
      id: `LAB-${test.category.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId: currentHospitalId,
      activeTodayCount: 0
    };
    setLabTests((prev) => [newTest, ...prev]);
    addAuditLog('Lab Test Formulary Expanded', 'Pathology & Laboratory', `Enrolled test ${newTest.name} (${newTest.testCode}) in ${newTest.category}.`);
  };

  const updateLabTest = (id: string, data: Partial<LabTestMaster>) => {
    setLabTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    addAuditLog('Lab Test Formulary Updated', 'Pathology & Laboratory', `Updated parameters and reference ranges for test ${id}.`);
  };

  const deleteLabTest = (id: string) => {
    const target = labTests.find((t) => t.id === id);
    setLabTests((prev) => prev.filter((t) => t.id !== id));
    addAuditLog('Lab Test Decommissioned', 'Pathology & Laboratory', `Removed test ${target?.name || id} from active formulary.`);
  };

  // IMAGING CRUD
  const addImagingService = (service: Omit<ImagingServiceMaster, 'id' | 'hospitalId'>) => {
    const newService: ImagingServiceMaster = {
      ...service,
      id: `IMG-${service.modalityCode}-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId: currentHospitalId,
      todayScheduledCount: 0,
      operationalStatus: 'Online & Operational'
    };
    setImagingServices((prev) => [newService, ...prev]);
    addAuditLog('Radiology Modality Registered', 'Radiology & Imaging', `Registered ${newService.name} (${newService.scannerModel}) with AERB License ${newService.aerbLicenseNo}.`);
  };

  const updateImagingService = (id: string, data: Partial<ImagingServiceMaster>) => {
    setImagingServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    addAuditLog('Radiology Modality Modified', 'Radiology & Imaging', `Updated scan suite parameters for ${id}.`);
  };

  const deleteImagingService = (id: string) => {
    const target = imagingServices.find((s) => s.id === id);
    setImagingServices((prev) => prev.filter((s) => s.id !== id));
    addAuditLog('Radiology Modality Decommissioned', 'Radiology & Imaging', `Removed modality ${target?.name || id}.`);
  };

  // ORDER LIFECYCLE
  const createOrder = (orderData: Omit<DiagnosticOrder, 'orderId' | 'hospitalId' | 'requisitionTimestamp' | 'status'>): DiagnosticOrder => {
    const newOrder: DiagnosticOrder = {
      ...orderData,
      orderId: `ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      hospitalId: currentHospitalId,
      requisitionTimestamp: new Date().toISOString(),
      status: 'Requisitioned',
      specimenBarcode: orderData.orderType === 'LABORATORY' ? `BAR-${Math.floor(10000000 + Math.random() * 90000000)}` : undefined,
      tatRemainingMinutes: orderData.priority === 'EMERGENCY STAT' ? 30 : orderData.priority === 'URGENT' ? 60 : 120
    };

    setOrders((prev) => [newOrder, ...prev]);
    addAuditLog(
      `Diagnostic Requisition Created (${newOrder.priority})`,
      'Diagnostic Orders',
      `Requisitioned ${newOrder.serviceName} for Patient ${newOrder.patientName} (${newOrder.patientId}) ordered by ${newOrder.orderingDoctorName}.`
    );
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: DiagnosticOrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)));
    addAuditLog('Diagnostic Order Status Updated', 'Diagnostic Orders', `Order ${orderId} transitioned to '${status}'.`);
  };

  const collectSample = (orderId: string, barcode?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              status: 'Sample Collected',
              sampleCollectedTimestamp: new Date().toISOString(),
              specimenBarcode: barcode || o.specimenBarcode || `BAR-${Math.floor(10000000 + Math.random() * 90000000)}`
            }
          : o
      )
    );
    addAuditLog('Specimen Phlebotomy Collected', 'Pathology & Laboratory', `Phlebotomy completed for Order ${orderId}. Specimen barcode validated.`);
  };

  const processAnalyzer = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: 'Processing on Analyzer' } : o))
    );
    addAuditLog('Analyzer Pipeline Ingestion', 'Pathology & Laboratory', `Specimen ${orderId} loaded on automated analyzer.`);
  };

  const verifyReport = (
    orderId: string,
    payload: {
      quantitativeValue?: string;
      findingsReport?: string;
      impression?: string;
      verifiedByDoctor?: string;
      isPanicValue?: boolean;
      panicValueNote?: string;
    }
  ) => {
    const finalStatus: DiagnosticOrderStatus = payload.isPanicValue
      ? 'Critical Panic Alert Triggered'
      : 'Report Verified';

    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              ...payload,
              status: finalStatus,
              resultGeneratedTimestamp: new Date().toISOString(),
              tatRemainingMinutes: 0
            }
          : o
      )
    );

    addAuditLog(
      payload.isPanicValue ? 'CRITICAL PANIC VALUE ESCALATION' : 'Diagnostic Report Authorized',
      'Diagnostic Reporting',
      payload.isPanicValue
        ? `Order ${orderId}: Critical panic alert triggered for ${payload.quantitativeValue || 'findings'}. Immediate physician notification dispatched.`
        : `Order ${orderId} verified by ${payload.verifiedByDoctor || 'Clinical Specialist'}.`
    );
  };

  const acknowledgePanicAlert = (orderId: string, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              status: 'Report Verified',
              panicValueNote: `${o.panicValueNote || ''} [ACKNOWLEDGED by Emergency Unit: ${notes || 'Action initiated'}]`
            }
          : o
      )
    );
    addAuditLog('Panic Value Acknowledged', 'Emergency & Critical Care', `Panic alert for Order ${orderId} acknowledged by on-duty physician.`);
  };

  // SAFETY RECORDS
  const addSafetyRecord = (record: Omit<RegulatorySafetyRecord, 'id' | 'hospitalId'>) => {
    const newRecord: RegulatorySafetyRecord = {
      ...record,
      id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId
    };
    setSafetyRecords((prev) => [newRecord, ...prev]);
    addAuditLog('Regulatory Safety Record Added', 'Radiation Safety & NABL', `Added compliance record for ${newRecord.entityName} (${newRecord.licenseNumber}).`);
  };

  // MODAL HANDLERS
  const openRequisitionModal = (targetService?: { id: string; name: string; code: string; type: 'LABORATORY' | 'IMAGING' }) => {
    setRequisitionPreload(targetService || null);
    setActiveModal('new_requisition');
  };

  const openAddLabModal = () => {
    setActiveModal('add_lab_test');
  };

  const openAddImagingModal = () => {
    setActiveModal('add_imaging');
  };

  const openPhlebotomyModal = (order: DiagnosticOrder) => {
    setSelectedOrder(order);
    setActiveModal('phlebotomy_barcode');
  };

  const openVerificationModal = (order: DiagnosticOrder) => {
    setSelectedOrder(order);
    setActiveModal('verify_report');
  };

  const openDicomViewer = (preset: 'CXR' | 'CT_BRAIN' | 'MRI_SPINE' | 'ANGIO') => {
    setSelectedDicomPreset(preset);
    setActiveModal('dicom_viewer');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedOrder(null);
    setRequisitionPreload(null);
  };

  // COMPUTED STATS
  const stats = useMemo(() => {
    const activeOrders = orders.filter((o) => o.status !== 'Report Verified');
    const statOrders = orders.filter((o) => o.priority === 'EMERGENCY STAT' && o.status !== 'Report Verified');
    const panicAlerts = orders.filter((o) => o.status === 'Critical Panic Alert Triggered');
    const completedToday = orders.filter((o) => o.status === 'Report Verified');

    return {
      totalLabTests: labTests.length,
      totalImagingServices: imagingServices.length,
      activeOrdersCount: activeOrders.length,
      statOrdersCount: statOrders.length,
      panicAlertsCount: panicAlerts.length,
      completedTodayCount: completedToday.length,
      nablComplianceScore: 99.4,
      aerbSafetyMargin: '0.11 mSv/qtr (< 20 mSv/yr cap)'
    };
  }, [labTests, imagingServices, orders]);

  return (
    <DiagnosticContext.Provider
      value={{
        labTests,
        imagingServices,
        orders,
        safetyRecords,
        addLabTest,
        updateLabTest,
        deleteLabTest,
        addImagingService,
        updateImagingService,
        deleteImagingService,
        createOrder,
        updateOrderStatus,
        collectSample,
        processAnalyzer,
        verifyReport,
        acknowledgePanicAlert,
        addSafetyRecord,
        activeModal,
        selectedOrder,
        selectedDicomPreset,
        openRequisitionModal,
        openAddLabModal,
        openAddImagingModal,
        openPhlebotomyModal,
        openVerificationModal,
        openDicomViewer,
        closeModal,
        stats
      }}
    >
      {children}
    </DiagnosticContext.Provider>
  );
};

export const useDiagnostics = () => {
  const context = useContext(DiagnosticContext);
  if (!context) {
    throw new Error('useDiagnostics must be used within a DiagnosticProvider');
  }
  return context;
};
