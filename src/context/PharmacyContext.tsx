import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  EnterpriseMedication,
  MedicationBatch,
  DispensingOrder,
  PurchaseRequest,
  PharmacyPurchaseOrder,
  FormularyProposal,
  MedicationRecall,
  StockMovementRecord,
  PharmacyLocation,
  FormularyStatus,
  OrderPriority
} from '../types/pharmacyExtended';
import {
  INITIAL_ENTERPRISE_MEDICATIONS,
  INITIAL_DISPENSING_ORDERS,
  INITIAL_PURCHASE_REQUESTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_FORMULARY_PROPOSALS,
  INITIAL_MEDICATION_RECALLS,
  INITIAL_STOCK_MOVEMENTS
} from '../data/pharmacySeedData';
import { useHospitalPortal } from './HospitalContext';

interface PharmacyContextType {
  // Master Datasets
  medications: EnterpriseMedication[];
  dispensingOrders: DispensingOrder[];
  purchaseRequests: PurchaseRequest[];
  purchaseOrders: PharmacyPurchaseOrder[];
  formularyProposals: FormularyProposal[];
  recalls: MedicationRecall[];
  stockMovements: StockMovementRecord[];

  // Computed KPIs & Aggregates
  totalSkusCount: number;
  totalInventoryValuation: number;
  lowStockItemsCount: number;
  criticalStockItemsCount: number;
  expiringSoonBatchesCount: number;
  activeRecallsCount: number;
  pendingDispenseCount: number;
  pendingPurchaseOrdersCount: number;
  pendingFormularyProposalsCount: number;

  // Medication Master Operations
  addMedication: (med: Omit<EnterpriseMedication, 'id' | 'hospitalId' | 'batches' | 'locationsStock' | 'currentStock'> & { initialStock?: number; initialBatchNumber?: string; initialExpiry?: string; location?: PharmacyLocation }) => void;
  updateMedication: (id: string, updates: Partial<EnterpriseMedication>) => void;
  updateFormularyStatus: (id: string, status: FormularyStatus, rationale: string) => void;
  
  // Batch & Stock Movements
  addBatchToMedication: (medId: string, batchData: Omit<MedicationBatch, 'id' | 'drugId' | 'fefoRank'>) => void;
  transferStock: (medId: string, batchId: string, fromLoc: PharmacyLocation, toLoc: PharmacyLocation, qty: number, reason: string) => boolean;
  quarantineBatch: (medId: string, batchId: string, reason: string) => void;
  releaseQuarantineBatch: (medId: string, batchId: string, reason: string) => void;
  adjustStockDiscrepancy: (medId: string, batchId: string, physicalCount: number, reason: string) => void;

  // Dispensing Closed-Loop Operations
  createDispensingOrder: (order: Omit<DispensingOrder, 'id' | 'hospitalId' | 'orderedAt' | 'status' | 'dispensedAt' | 'totalCost'>) => void;
  verifyDispensingOrder: (orderId: string, pharmacistName: string) => void;
  completeDispenseOrder: (orderId: string, pharmacistName: string, secondVerifier?: string) => boolean;
  cancelDispensingOrder: (orderId: string, reason: string) => void;

  // Procurement & Receiving Operations
  createPurchaseRequest: (req: Omit<PurchaseRequest, 'id' | 'hospitalId' | 'requestedAt' | 'status'>) => void;
  approvePurchaseRequest: (requestId: string) => void;
  receivePurchaseOrderShipment: (poId: string, receivedLines: { medicationId: string; batchNumber: string; expiryDate: string; qtyReceived: number; storageLocation: PharmacyLocation }[]) => void;

  // Formulary Governance & Proposals
  submitFormularyProposal: (proposal: Omit<FormularyProposal, 'id' | 'hospitalId' | 'submittedAt' | 'status'>) => void;
  decideFormularyProposal: (proposalId: string, decision: 'Approved for Formulary' | 'Approved with Restrictions' | 'Rejected', notes: string) => void;

  // Recall Operations
  initiateRecall: (recallData: Omit<MedicationRecall, 'id' | 'hospitalId' | 'initiatedAt' | 'status' | 'totalUnitsFrozen' | 'affectedLocations'>) => void;
  closeRecall: (recallId: string, notes: string) => void;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PHARMACY = 'globalhealth_enterprise_pharmacy_v2';

export const PharmacyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentHospitalId, currentUser, addAuditLog } = useHospitalPortal();

  // Medications master
  const [medications, setMedications] = useState<EnterpriseMedication[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PHARMACY}_meds`);
      return stored ? JSON.parse(stored) : INITIAL_ENTERPRISE_MEDICATIONS;
    } catch {
      return INITIAL_ENTERPRISE_MEDICATIONS;
    }
  });

  // Dispensing Orders
  const [dispensingOrders, setDispensingOrders] = useState<DispensingOrder[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PHARMACY}_dispense`);
      return stored ? JSON.parse(stored) : INITIAL_DISPENSING_ORDERS;
    } catch {
      return INITIAL_DISPENSING_ORDERS;
    }
  });

  // Purchase Requests
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PHARMACY}_requests`);
      return stored ? JSON.parse(stored) : INITIAL_PURCHASE_REQUESTS;
    } catch {
      return INITIAL_PURCHASE_REQUESTS;
    }
  });

  // Purchase Orders
  const [purchaseOrders, setPurchaseOrders] = useState<PharmacyPurchaseOrder[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PHARMACY}_pos`);
      return stored ? JSON.parse(stored) : INITIAL_PURCHASE_ORDERS;
    } catch {
      return INITIAL_PURCHASE_ORDERS;
    }
  });

  // Formulary Proposals
  const [formularyProposals, setFormularyProposals] = useState<FormularyProposal[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PHARMACY}_proposals`);
      return stored ? JSON.parse(stored) : INITIAL_FORMULARY_PROPOSALS;
    } catch {
      return INITIAL_FORMULARY_PROPOSALS;
    }
  });

  // Medication Recalls
  const [recalls, setRecalls] = useState<MedicationRecall[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PHARMACY}_recalls`);
      return stored ? JSON.parse(stored) : INITIAL_MEDICATION_RECALLS;
    } catch {
      return INITIAL_MEDICATION_RECALLS;
    }
  });

  // Stock Movements Ledger
  const [stockMovements, setStockMovements] = useState<StockMovementRecord[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PHARMACY}_movements`);
      return stored ? JSON.parse(stored) : INITIAL_STOCK_MOVEMENTS;
    } catch {
      return INITIAL_STOCK_MOVEMENTS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PHARMACY}_meds`, JSON.stringify(medications));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PHARMACY}_dispense`, JSON.stringify(dispensingOrders));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PHARMACY}_requests`, JSON.stringify(purchaseRequests));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PHARMACY}_pos`, JSON.stringify(purchaseOrders));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PHARMACY}_proposals`, JSON.stringify(formularyProposals));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PHARMACY}_recalls`, JSON.stringify(recalls));
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PHARMACY}_movements`, JSON.stringify(stockMovements));
  }, [medications, dispensingOrders, purchaseRequests, purchaseOrders, formularyProposals, recalls, stockMovements]);

  // Aggregated KPIs
  const totalSkusCount = medications.length;

  const totalInventoryValuation = useMemo(() => {
    return medications.reduce((sum, med) => sum + med.currentStock * med.acquisitionCost, 0);
  }, [medications]);

  const lowStockItemsCount = useMemo(() => {
    return medications.filter((m) => m.currentStock <= m.reorderLevel && m.currentStock > m.safetyStock).length;
  }, [medications]);

  const criticalStockItemsCount = useMemo(() => {
    return medications.filter((m) => m.currentStock <= m.safetyStock).length;
  }, [medications]);

  const expiringSoonBatchesCount = useMemo(() => {
    let count = 0;
    const now = new Date();
    const thresholdDays = 90; // 90 days threshold
    medications.forEach((m) => {
      m.batches.forEach((b) => {
        if (b.status === 'Expiring Soon') {
          count++;
        } else {
          const exp = new Date(b.expiryDate);
          const diffDays = (exp.getTime() - now.getTime()) / (1000 * 3600 * 24);
          if (diffDays <= thresholdDays && diffDays > 0) {
            count++;
          }
        }
      });
    });
    return count;
  }, [medications]);

  const activeRecallsCount = useMemo(() => {
    return recalls.filter((r) => r.status === 'Active Isolation' || r.status === 'Batch Reconciled').length;
  }, [recalls]);

  const pendingDispenseCount = useMemo(() => {
    return dispensingOrders.filter((o) => o.status !== 'Dispensed / Administered' && o.status !== 'Cancelled').length;
  }, [dispensingOrders]);

  const pendingPurchaseOrdersCount = useMemo(() => {
    return purchaseOrders.filter((p) => p.status === 'Sent to Supplier' || p.status === 'Confirmed / In Transit' || p.status === 'Partially Received').length;
  }, [purchaseOrders]);

  const pendingFormularyProposalsCount = useMemo(() => {
    return formularyProposals.filter((p) => p.status.includes('Review') || p.status.includes('Scheduled')).length;
  }, [formularyProposals]);

  // Actions
  const addMedication: PharmacyContextType['addMedication'] = (medData) => {
    const medId = `DRG-${Math.floor(100 + Math.random() * 900)}`;
    const initStock = medData.initialStock || 0;
    const batchNo = medData.initialBatchNumber || `BAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const initialLocation = medData.location || 'Central Pharmacy Vault';

    const defaultLocationStock: Record<PharmacyLocation, number> = {
      'Central Pharmacy Vault': initialLocation === 'Central Pharmacy Vault' ? initStock : 0,
      'ICU Satellite Pharmacy': initialLocation === 'ICU Satellite Pharmacy' ? initStock : 0,
      'Emergency Trauma Bay Pharmacy': initialLocation === 'Emergency Trauma Bay Pharmacy' ? initStock : 0,
      'Operating Theatre (OT) Satellite': initialLocation === 'Operating Theatre (OT) Satellite' ? initStock : 0,
      'Oncology Cleanroom / Infusion': initialLocation === 'Oncology Cleanroom / Infusion' ? initStock : 0,
      'Inpatient Ward Stock (Floors 1-5)': initialLocation === 'Inpatient Ward Stock (Floors 1-5)' ? initStock : 0,
      'Cold-Chain Biologicals Storage (2-8°C)': initialLocation === 'Cold-Chain Biologicals Storage (2-8°C)' ? initStock : 0,
      'Quarantine & Disposal Holding': 0
    };

    const initialBatch: MedicationBatch = {
      id: `BAT-${Math.floor(10000 + Math.random() * 90000)}`,
      drugId: medId,
      batchNumber: batchNo,
      barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
      manufacturer: medData.manufacturer,
      supplierName: medData.distributor || 'Apex Central MedSupply',
      mfgDate: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      expiryDate: medData.initialExpiry || new Date(Date.now() + 730 * 24 * 3600 * 1000).toISOString().split('T')[0],
      receivedDate: new Date().toISOString().split('T')[0],
      quantityReceived: initStock,
      quantityAvailable: initStock,
      quantityReserved: 0,
      quantityDispensed: 0,
      currentLocation: initialLocation,
      storageCondition: medData.requiresColdChain ? 'Refrigerated Cold-Chain (2-8°C)' : medData.isControlledSubstance ? 'Controlled Lockbox (Double Lock)' : 'Room Temp (15-25°C)',
      unitCost: medData.acquisitionCost,
      status: 'Available',
      fefoRank: 1
    };

    const newMed: EnterpriseMedication = {
      ...medData,
      id: medId,
      hospitalId: currentHospitalId,
      currentStock: initStock,
      locationsStock: defaultLocationStock,
      batches: initStock > 0 ? [initialBatch] : []
    };

    setMedications((prev) => [newMed, ...prev]);

    if (initStock > 0) {
      const movement: StockMovementRecord = {
        id: `MOV-${Date.now()}`,
        hospitalId: currentHospitalId,
        timestamp: new Date().toISOString(),
        movementType: 'Receipt',
        medicationName: newMed.brandName,
        batchNumber: batchNo,
        sourceLocation: initialLocation,
        quantityChanged: initStock,
        resultingQuantity: initStock,
        performedBy: currentUser?.name || 'Chief Pharmacist',
        referenceId: `INIT-${medId}`,
        reason: 'Initial SKU master inventory onboarding',
        immutableHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
      };
      setStockMovements((prev) => [movement, ...prev]);
    }

    addAuditLog('Medication Master SKU Created', 'Pharmacy & Formulary', `Enrolled SKU ${newMed.brandName} (${newMed.genericName}) with status ${newMed.formularyStatus}.`);
  };

  const updateMedication: PharmacyContextType['updateMedication'] = (id, updates) => {
    setMedications((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    addAuditLog('Medication Master Updated', 'Pharmacy & Formulary', `Modified configuration parameters on SKU ID ${id}.`);
  };

  const updateFormularyStatus: PharmacyContextType['updateFormularyStatus'] = (id, status, rationale) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            formularyStatus: status,
            formularyReviewedAt: new Date().toISOString().split('T')[0]
          };
        }
        return m;
      })
    );
    addAuditLog('Formulary Status Governance Changed', 'Pharmacy Governance', `Updated SKU ${id} status to '${status}'. Rationale: ${rationale}`);
  };

  const addBatchToMedication: PharmacyContextType['addBatchToMedication'] = (medId, batchData) => {
    const batchId = `BAT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBatch: MedicationBatch = {
      ...batchData,
      id: batchId,
      drugId: medId,
      fefoRank: 99
    };

    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const updatedBatches = [...m.batches, newBatch].sort(
            (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
          ).map((b, idx) => ({ ...b, fefoRank: idx + 1 }));

          const loc = batchData.currentLocation;
          const currentLocStock = m.locationsStock[loc] || 0;
          const newLocStock = currentLocStock + batchData.quantityAvailable;

          return {
            ...m,
            currentStock: m.currentStock + batchData.quantityAvailable,
            locationsStock: {
              ...m.locationsStock,
              [loc]: newLocStock
            },
            batches: updatedBatches
          };
        }
        return m;
      })
    );

    const movement: StockMovementRecord = {
      id: `MOV-${Date.now()}`,
      hospitalId: currentHospitalId,
      timestamp: new Date().toISOString(),
      movementType: 'Receipt',
      medicationName: batchData.batchNumber,
      batchNumber: batchData.batchNumber,
      sourceLocation: batchData.currentLocation,
      quantityChanged: batchData.quantityAvailable,
      resultingQuantity: batchData.quantityAvailable,
      performedBy: currentUser?.name || 'Chief Pharmacist',
      referenceId: batchData.purchaseOrderId || 'INWARD-INSP',
      reason: 'Batch receiving & quality verification release',
      immutableHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    };
    setStockMovements((prev) => [movement, ...prev]);

    addAuditLog('Medication Batch Stocked', 'Pharmacy & Formulary', `Added batch ${batchData.batchNumber} (${batchData.quantityAvailable} units) to SKU ${medId} at ${batchData.currentLocation}.`);
  };

  const transferStock: PharmacyContextType['transferStock'] = (medId, batchId, fromLoc, toLoc, qty, reason) => {
    if (fromLoc === toLoc || qty <= 0) return false;

    let success = false;
    let targetMedName = '';
    let targetBatchNo = '';

    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          targetMedName = m.brandName;
          const fromLocQty = m.locationsStock[fromLoc] || 0;
          if (fromLocQty < qty) return m;

          const batch = m.batches.find((b) => b.id === batchId);
          if (!batch || batch.quantityAvailable < qty) return m;

          targetBatchNo = batch.batchNumber;
          success = true;

          const updatedBatches = m.batches.map((b) => {
            if (b.id === batchId) {
              return {
                ...b,
                quantityAvailable: b.quantityAvailable - qty
              };
            }
            return b;
          });

          // Add or update batch in destination
          const existingDestBatch = updatedBatches.find((b) => b.batchNumber === targetBatchNo && b.currentLocation === toLoc);
          if (existingDestBatch) {
            existingDestBatch.quantityAvailable += qty;
          } else {
            updatedBatches.push({
              ...batch,
              id: `BAT-${Math.floor(10000 + Math.random() * 90000)}`,
              currentLocation: toLoc,
              quantityAvailable: qty,
              quantityReserved: 0,
              quantityDispensed: 0
            });
          }

          return {
            ...m,
            locationsStock: {
              ...m.locationsStock,
              [fromLoc]: Math.max(0, fromLocQty - qty),
              [toLoc]: (m.locationsStock[toLoc] || 0) + qty
            },
            batches: updatedBatches
          };
        }
        return m;
      })
    );

    if (success) {
      const movement: StockMovementRecord = {
        id: `MOV-${Date.now()}`,
        hospitalId: currentHospitalId,
        timestamp: new Date().toISOString(),
        movementType: 'Inter-Ward Transfer',
        medicationName: targetMedName,
        batchNumber: targetBatchNo,
        sourceLocation: fromLoc,
        destinationLocation: toLoc,
        quantityChanged: -qty,
        resultingQuantity: qty,
        performedBy: currentUser?.name || 'Pharmacist',
        referenceId: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
        reason,
        immutableHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
      };
      setStockMovements((prev) => [movement, ...prev]);

      addAuditLog('Stock Transferred Between Locations', 'Pharmacy Inventory', `Transferred ${qty} units of ${targetMedName} (${targetBatchNo}) from ${fromLoc} to ${toLoc}.`);
    }

    return success;
  };

  const quarantineBatch: PharmacyContextType['quarantineBatch'] = (medId, batchId, reason) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const batch = m.batches.find((b) => b.id === batchId);
          if (!batch) return m;

          const qtyToQuarantine = batch.quantityAvailable;
          const oldLoc = batch.currentLocation;

          const updatedBatches = m.batches.map((b) => (b.id === batchId ? { ...b, status: 'Quarantined' as const, currentLocation: 'Quarantine & Disposal Holding' as const } : b));

          return {
            ...m,
            currentStock: Math.max(0, m.currentStock - qtyToQuarantine),
            locationsStock: {
              ...m.locationsStock,
              [oldLoc]: Math.max(0, (m.locationsStock[oldLoc] || 0) - qtyToQuarantine),
              'Quarantine & Disposal Holding': (m.locationsStock['Quarantine & Disposal Holding'] || 0) + qtyToQuarantine
            },
            batches: updatedBatches
          };
        }
        return m;
      })
    );

    addAuditLog('Batch Quarantined', 'Pharmacy Safety', `Quarantined batch ${batchId} on SKU ${medId}. Reason: ${reason}`);
  };

  const releaseQuarantineBatch: PharmacyContextType['releaseQuarantineBatch'] = (medId, batchId, reason) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const batch = m.batches.find((b) => b.id === batchId);
          if (!batch) return m;

          const qty = batch.quantityAvailable;
          const updatedBatches = m.batches.map((b) => (b.id === batchId ? { ...b, status: 'Available' as const, currentLocation: 'Central Pharmacy Vault' as const } : b));

          return {
            ...m,
            currentStock: m.currentStock + qty,
            locationsStock: {
              ...m.locationsStock,
              'Central Pharmacy Vault': (m.locationsStock['Central Pharmacy Vault'] || 0) + qty,
              'Quarantine & Disposal Holding': Math.max(0, (m.locationsStock['Quarantine & Disposal Holding'] || 0) - qty)
            },
            batches: updatedBatches
          };
        }
        return m;
      })
    );

    addAuditLog('Batch Released from Quarantine', 'Pharmacy Safety', `Released batch ${batchId} back to Central Pharmacy Vault. Reason: ${reason}`);
  };

  const adjustStockDiscrepancy: PharmacyContextType['adjustStockDiscrepancy'] = (medId, batchId, physicalCount, reason) => {
    setMedications((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          const batch = m.batches.find((b) => b.id === batchId);
          if (!batch) return m;

          const delta = physicalCount - batch.quantityAvailable;
          const loc = batch.currentLocation;

          const updatedBatches = m.batches.map((b) => (b.id === batchId ? { ...b, quantityAvailable: physicalCount } : b));

          return {
            ...m,
            currentStock: Math.max(0, m.currentStock + delta),
            locationsStock: {
              ...m.locationsStock,
              [loc]: Math.max(0, (m.locationsStock[loc] || 0) + delta)
            },
            batches: updatedBatches
          };
        }
        return m;
      })
    );

    addAuditLog('Inventory Reconciliation Discrepancy Adjusted', 'Pharmacy Audit', `Reconciled physical count (${physicalCount}) on batch ${batchId} (SKU: ${medId}). Reason: ${reason}`);
  };

  // Dispensing operations
  const createDispensingOrder: PharmacyContextType['createDispensingOrder'] = (orderData) => {
    const orderId = `DSP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let totalCost = 0;

    const items = orderData.items.map((item) => {
      const med = medications.find((m) => m.id === item.medicationId);
      const unitPrice = med?.unitPrice || 100;
      totalCost += unitPrice * item.quantityOrdered;

      // Select top FEFO batch
      const topBatch = med?.batches.find((b) => b.status === 'Available' && b.quantityAvailable >= item.quantityOrdered);

      return {
        ...item,
        unitPrice,
        allocatedBatchId: topBatch?.id,
        allocatedBatchNumber: topBatch?.batchNumber,
        dispensedQuantity: 0
      };
    });

    const newOrder: DispensingOrder = {
      ...orderData,
      id: orderId,
      hospitalId: currentHospitalId,
      orderedAt: new Date().toISOString(),
      status: orderData.priority.includes('STAT') ? 'Ready for Dispensing' : 'Under Clinical Verification',
      totalCost,
      items
    };

    setDispensingOrders((prev) => [newOrder, ...prev]);

    addAuditLog('Medication Order Queued', 'Pharmacy Dispensing', `Prescription ${orderId} received for Patient ${orderData.patientName} (${orderData.priority}).`);
  };

  const verifyDispensingOrder: PharmacyContextType['verifyDispensingOrder'] = (orderId, pharmacistName) => {
    setDispensingOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Ready for Dispensing', verifiedByPharmacist: pharmacistName } : o))
    );
    addAuditLog('Prescription Clinical Verification Completed', 'Pharmacy Dispensing', `Order ${orderId} verified by Pharmacist ${pharmacistName}.`);
  };

  const completeDispenseOrder: PharmacyContextType['completeDispenseOrder'] = (orderId, pharmacistName, secondVerifier) => {
    const targetOrder = dispensingOrders.find((o) => o.id === orderId);
    if (!targetOrder || targetOrder.status === 'Dispensed / Administered') return false;

    // Deduct stock from medication master and batches
    setMedications((prevMeds) => {
      return prevMeds.map((med) => {
        const matchingItem = targetOrder.items.find((item) => item.medicationId === med.id);
        if (!matchingItem) return med;

        const qtyToDeduct = matchingItem.quantityOrdered;
        const batchId = matchingItem.allocatedBatchId;

        const updatedBatches = med.batches.map((b) => {
          if (b.id === batchId || (matchingItem.allocatedBatchNumber && b.batchNumber === matchingItem.allocatedBatchNumber)) {
            return {
              ...b,
              quantityAvailable: Math.max(0, b.quantityAvailable - qtyToDeduct),
              quantityDispensed: b.quantityDispensed + qtyToDeduct
            };
          }
          return b;
        });

        // Deduct from central pharmacy or first available location
        const loc = 'Central Pharmacy Vault';
        const currentLocStock = med.locationsStock[loc] || 0;

        return {
          ...med,
          currentStock: Math.max(0, med.currentStock - qtyToDeduct),
          locationsStock: {
            ...med.locationsStock,
            [loc]: Math.max(0, currentLocStock - qtyToDeduct)
          },
          batches: updatedBatches
        };
      });
    });

    // Update order status
    setDispensingOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'Dispensed / Administered',
            dispensedAt: new Date().toISOString(),
            verifiedByPharmacist: pharmacistName,
            secondVerifier: secondVerifier || o.secondVerifier,
            items: o.items.map((i) => ({ ...i, dispensedQuantity: i.quantityOrdered }))
          };
        }
        return o;
      })
    );

    // Create stock movement ledger entry
    targetOrder.items.forEach((item) => {
      const movement: StockMovementRecord = {
        id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        hospitalId: currentHospitalId,
        timestamp: new Date().toISOString(),
        movementType: 'Dispensing',
        medicationName: item.brandName,
        batchNumber: item.allocatedBatchNumber || 'AUTO-FEFO',
        sourceLocation: 'Central Pharmacy Vault',
        destinationLocation: targetOrder.department.includes('ICU') ? 'ICU Satellite Pharmacy' : 'Operating Theatre (OT) Satellite',
        quantityChanged: -item.quantityOrdered,
        resultingQuantity: 0,
        performedBy: pharmacistName,
        referenceId: targetOrder.id,
        reason: `Dispensation for Patient ${targetOrder.patientName} (${targetOrder.bedOrLocation})`,
        immutableHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
      };
      setStockMovements((prev) => [movement, ...prev]);
    });

    addAuditLog('Medication Dispensed to Patient Care Unit', 'Pharmacy Dispensing', `Dispensed prescription ${orderId} (${targetOrder.patientName}) verified by ${pharmacistName}.`);
    return true;
  };

  const cancelDispensingOrder: PharmacyContextType['cancelDispensingOrder'] = (orderId, reason) => {
    setDispensingOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Cancelled', clinicalNotes: `${o.clinicalNotes || ''} [Cancelled: ${reason}]` } : o))
    );
    addAuditLog('Medication Order Cancelled', 'Pharmacy Dispensing', `Cancelled prescription ${orderId}. Reason: ${reason}`);
  };

  // Procurement
  const createPurchaseRequest: PharmacyContextType['createPurchaseRequest'] = (reqData) => {
    const newReq: PurchaseRequest = {
      ...reqData,
      id: `PR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId: currentHospitalId,
      requestedAt: new Date().toISOString(),
      status: 'Pending HOD Approval'
    };

    setPurchaseRequests((prev) => [newReq, ...prev]);
    addAuditLog('Purchase Requisition Raised', 'Pharmacy Procurement', `Created requisition ${newReq.id} for ${newReq.requestedQuantity} units of ${newReq.brandName}.`);
  };

  const approvePurchaseRequest: PharmacyContextType['approvePurchaseRequest'] = (requestId) => {
    let poCreatedId = '';
    setPurchaseRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          poCreatedId = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          return { ...r, status: 'Approved by Medical Director', purchaseOrderId: poCreatedId };
        }
        return r;
      })
    );

    const targetReq = purchaseRequests.find((r) => r.id === requestId);
    if (targetReq && poCreatedId) {
      const newPo: PharmacyPurchaseOrder = {
        id: poCreatedId,
        hospitalId: currentHospitalId,
        supplierName: targetReq.preferredSupplier,
        supplierContact: 'orders@suppliermed.in / +91 11 2659 0000',
        createdAt: new Date().toISOString(),
        deliveryExpectedDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        totalItemsCount: targetReq.requestedQuantity,
        totalAmount: targetReq.estimatedCost,
        paymentTerms: '30 Days Net',
        status: 'Sent to Supplier',
        lineItems: [
          {
            medicationId: targetReq.medicationId,
            brandName: targetReq.brandName,
            strength: 'Standard Dosage',
            quantityOrdered: targetReq.requestedQuantity,
            quantityReceived: 0,
            unitCost: Math.round(targetReq.estimatedCost / (targetReq.requestedQuantity || 1))
          }
        ],
        inspectedByPharmacist: currentUser?.name || 'Chief Pharmacist'
      };

      setPurchaseOrders((prev) => [newPo, ...prev]);
      addAuditLog('Purchase Order Issued to Supplier', 'Pharmacy Procurement', `Converted PR ${requestId} into PO ${poCreatedId} (${targetReq.preferredSupplier}).`);
    }
  };

  const receivePurchaseOrderShipment: PharmacyContextType['receivePurchaseOrderShipment'] = (poId, receivedLines) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id === poId) {
          return {
            ...po,
            status: 'Goods Received & Inspected',
            lineItems: po.lineItems.map((li) => {
              const matched = receivedLines.find((r) => r.medicationId === li.medicationId);
              return matched
                ? {
                    ...li,
                    quantityReceived: li.quantityOrdered,
                    batchNumberCaptured: matched.batchNumber,
                    expiryCaptured: matched.expiryDate
                  }
                : li;
            })
          };
        }
        return po;
      })
    );

    // Stock the received lines into medication master
    receivedLines.forEach((line) => {
      addBatchToMedication(line.medicationId, {
        batchNumber: line.batchNumber,
        barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
        manufacturer: 'Verified OEM Supplier',
        supplierName: 'Official Distributor',
        purchaseOrderId: poId,
        mfgDate: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
        expiryDate: line.expiryDate,
        receivedDate: new Date().toISOString().split('T')[0],
        quantityReceived: line.qtyReceived,
        quantityAvailable: line.qtyReceived,
        quantityReserved: 0,
        quantityDispensed: 0,
        currentLocation: line.storageLocation,
        storageCondition: 'Room Temp (15-25°C)',
        unitCost: 150,
        status: 'Available'
      });
    });

    addAuditLog('Shipment Inward & Quality Verified', 'Pharmacy Procurement', `PO ${poId} verified and stocked into active inventory.`);
  };

  // Formulary Governance
  const submitFormularyProposal: PharmacyContextType['submitFormularyProposal'] = (proposalData) => {
    const newProposal: FormularyProposal = {
      ...proposalData,
      id: `FML-PROP-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId: currentHospitalId,
      submittedAt: new Date().toISOString(),
      status: 'Submitted / Clinical Review'
    };

    setFormularyProposals((prev) => [newProposal, ...prev]);
    addAuditLog('New Drug Formulary Proposal Submitted', 'Pharmacy Governance', `Proposed ${newProposal.proposedBrandName} (${newProposal.proposedGenericName}) by ${newProposal.requestingPhysician}.`);
  };

  const decideFormularyProposal: PharmacyContextType['decideFormularyProposal'] = (proposalId, decision, notes) => {
    setFormularyProposals((prev) =>
      prev.map((p) => (p.id === proposalId ? { ...p, status: decision, decisionNotes: notes } : p))
    );

    const prop = formularyProposals.find((p) => p.id === proposalId);
    if (prop && (decision === 'Approved for Formulary' || decision === 'Approved with Restrictions')) {
      // Auto enroll to medication master
      addMedication({
        drugCode: `DRG-${prop.proposedBrandName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        brandName: prop.proposedBrandName,
        genericName: prop.proposedGenericName,
        atcClassification: 'N/A',
        therapeuticClass: prop.therapeuticClass,
        dosageForm: 'Vial',
        strength: prop.strength,
        packSize: 'Standard Unit',
        route: 'Intravenous (IV)',
        manufacturer: 'OEM Pharma',
        distributor: 'Apex Central MedSupply',
        formularyStatus: decision === 'Approved for Formulary' ? 'Formulary Approved' : 'Restricted / Prior Auth',
        formularyCategory: decision === 'Approved for Formulary' ? 'Standard' : 'Restricted',
        isHighAlert: false,
        isControlledSubstance: false,
        isAntibioticStewardship: prop.therapeuticClass.includes('Antimicrobial'),
        requiresColdChain: false,
        reorderLevel: 50,
        safetyStock: 20,
        maxStockLevel: 300,
        unitPrice: 500,
        acquisitionCost: 350,
        approvedIndications: [prop.clinicalJustification],
        formularyReviewedAt: new Date().toISOString().split('T')[0],
        formularyNextReview: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split('T')[0]
      });
    }

    addAuditLog('P&T Committee Formulary Decision', 'Pharmacy Governance', `Proposal ${proposalId} ruled as '${decision}'.`);
  };

  // Recalls
  const initiateRecall: PharmacyContextType['initiateRecall'] = (recallData) => {
    const recallId = `RCL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    let totalUnitsFrozen = 0;
    const affectedLocations: { location: PharmacyLocation; quantityQuarantined: number }[] = [];

    // Locate and freeze all batches matching this batchNumber
    setMedications((prev) =>
      prev.map((med) => {
        const matchingBatches = med.batches.filter((b) => b.batchNumber === recallData.batchNumber);
        if (matchingBatches.length === 0) return med;

        let medQuarantineTotal = 0;
        matchingBatches.forEach((b) => {
          totalUnitsFrozen += b.quantityAvailable;
          medQuarantineTotal += b.quantityAvailable;
          affectedLocations.push({ location: b.currentLocation, quantityQuarantined: b.quantityAvailable });
        });

        const updatedBatches = med.batches.map((b) => (b.batchNumber === recallData.batchNumber ? { ...b, status: 'Recalled' as const, currentLocation: 'Quarantine & Disposal Holding' as const } : b));

        return {
          ...med,
          formularyStatus: 'Recalled',
          currentStock: Math.max(0, med.currentStock - medQuarantineTotal),
          locationsStock: {
            ...med.locationsStock,
            'Quarantine & Disposal Holding': (med.locationsStock['Quarantine & Disposal Holding'] || 0) + medQuarantineTotal
          },
          batches: updatedBatches
        };
      })
    );

    const newRecall: MedicationRecall = {
      ...recallData,
      id: recallId,
      hospitalId: currentHospitalId,
      initiatedAt: new Date().toISOString(),
      status: 'Active Isolation',
      totalUnitsFrozen,
      affectedLocations
    };

    setRecalls((prev) => [newRecall, ...prev]);
    addAuditLog('STAT DRUG RECALL INITIATED', 'Pharmacy Safety', `Recall ${newRecall.recallNumber} for ${newRecall.brandName} (Batch: ${newRecall.batchNumber}). Quarantined ${totalUnitsFrozen} units.`);
  };

  const closeRecall: PharmacyContextType['closeRecall'] = (recallId, notes) => {
    setRecalls((prev) =>
      prev.map((r) => (r.id === recallId ? { ...r, status: 'Closed', reason: `${r.reason} [Closure: ${notes}]` } : r))
    );
    addAuditLog('Medication Recall Closed', 'Pharmacy Safety', `Closed recall ${recallId}.`);
  };

  return (
    <PharmacyContext.Provider
      value={{
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
        updateMedication,
        updateFormularyStatus,
        addBatchToMedication,
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
      }}
    >
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) {
    throw new Error('usePharmacy must be used within a PharmacyProvider');
  }
  return context;
};
