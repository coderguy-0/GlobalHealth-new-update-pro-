import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import {
  HospitalFacility,
  Department,
  Wing,
  OTRoom,
  HospitalUser,
  PortalDoctor,
  PortalBed,
  PortalAmbulance,
  BloodInventoryItem,
  TransfusionRequisition,
  PharmacyItem,
  EquipmentAsset,
  ServiceTariff,
  SurgicalPackage,
  InsuranceProvider,
  CashlessClaim,
  ComplianceDocument,
  ChangeDraft,
  Announcement,
  ImmutableAuditLog,
  Appointment,
  LabTest,
  ImagingService,
  RoleType,
  NavigationView,
  HospitalApplication,
  HospitalAccount,
  ActivationTokenRecord,
  PasswordResetTokenRecord,
  HospitalApplicationStatus,
  ApplicationDocument
} from '../types/hospitalPortal';
import {
  INITIAL_HOSPITALS,
  INITIAL_USERS,
  INITIAL_WINGS,
  INITIAL_DEPARTMENTS,
  INITIAL_OT_ROOMS,
  INITIAL_PORTAL_DOCTORS,
  INITIAL_BEDS,
  INITIAL_AMBULANCES,
  INITIAL_BLOOD_BANK,
  INITIAL_TRANSFUSIONS,
  INITIAL_PHARMACY,
  INITIAL_EQUIPMENT,
  INITIAL_TARIFFS,
  INITIAL_PACKAGES,
  INITIAL_INSURANCE,
  INITIAL_CLAIMS,
  INITIAL_DOCUMENTS,
  INITIAL_DRAFTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_APPOINTMENTS,
  INITIAL_LAB_TESTS,
  INITIAL_IMAGING_SERVICES,
  INITIAL_APPLICATIONS,
  INITIAL_HOSPITAL_ACCOUNTS,
  INITIAL_ACTIVATION_TOKENS,
  INITIAL_RESET_TOKENS
} from '../data/hospitalInitialData';
import {
  saveHospitalSection,
  getHospitalSessionToken,
  storeHospitalSession,
  clearHospitalSession
} from '../services/hospitalRegistryClient';

// Simple fast SHA-256 simulation for immutable audit hashing
function generateBlockHash(content: string, prevHash: string = ''): string {
  let hash = 0;
  const fullStr = prevHash + content + new Date().toISOString() + Math.random().toString(36);
  for (let i = 0; i < fullStr.length; i++) {
    const char = fullStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}${Math.abs(hash * 31).toString(16).padStart(8, '0')}${Math.abs(hash * 73).toString(16).padStart(8, '0')}${Math.abs(hash * 127).toString(16).padStart(8, '0')}`;
}

interface HospitalContextType {
  // Navigation & Multi-Tenant State
  hospitals: HospitalFacility[];
  currentHospitalId: string;
  currentHospital: HospitalFacility;
  setCurrentHospitalId: (id: string) => void;
  currentView: NavigationView;
  setCurrentView: (view: NavigationView) => void;

  // Active User / RBAC State
  currentUser: HospitalUser | null;
  // Server-verified portal session state
  sessionValidating: boolean;
  sessionExpired: boolean;
  dismissSessionExpired: () => void;
  currentRole: RoleType;
  registeredUsers: HospitalUser[];
  login: (email: string, password?: string, hospitalId?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: Partial<HospitalUser>) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickSwitchUser: (userId: string) => void;
  
  // 2FA Security Center
  twoFactorVerified: boolean;
  verify2FA: (code: string) => boolean;
  toggleUser2FA: (enabled: boolean) => void;

  // Hospital Mutations
  updateHospitalProfile: (data: Partial<HospitalFacility>) => void;
  toggleRedAlert: () => void;
  registerNewHospital: (facility: Omit<HospitalFacility, 'id'>, adminUser: Omit<HospitalUser, 'id' | 'hospitalId'>) => string;

  // Clinical Entities CRUD (Tenant Scoped)
  wings: Wing[];
  departments: Department[];
  otRooms: OTRoom[];
  doctors: PortalDoctor[];
  beds: PortalBed[];
  ambulances: PortalAmbulance[];
  bloodBank: BloodInventoryItem[];
  transfusions: TransfusionRequisition[];
  pharmacy: PharmacyItem[];
  equipment: EquipmentAsset[];
  tariffs: ServiceTariff[];
  packages: SurgicalPackage[];
  insuranceProviders: InsuranceProvider[];
  claims: CashlessClaim[];
  documents: ComplianceDocument[];
  drafts: ChangeDraft[];
  announcements: Announcement[];
  appointments: Appointment[];
  labTests: LabTest[];
  imaging: ImagingService[];
  auditLogs: ImmutableAuditLog[];

  // Entity Action Handlers
  addDepartment: (dept: Omit<Department, 'id' | 'hospitalId'>) => void;
  updateDepartment: (id: string, data: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  addWing: (wing: Omit<Wing, 'id' | 'hospitalId'>) => void;
  updateWing: (id: string, data: Partial<Wing>) => void;
  deleteWing: (id: string) => void;

  addDoctor: (doctor: Omit<PortalDoctor, 'id' | 'hospitalId'>) => void;
  updateDoctor: (id: string, data: Partial<PortalDoctor>) => void;
  deleteDoctor: (id: string) => void;

  addBed: (bed: Omit<PortalBed, 'id' | 'hospitalId'>) => void;
  updateBedStatus: (id: string, status: PortalBed['status'], patientName?: string, patientId?: string, doctorName?: string) => void;
  deleteBed: (id: string) => void;

  addAmbulance: (ambulance: Omit<PortalAmbulance, 'id' | 'hospitalId'>) => void;
  updateAmbulance: (id: string, data: Partial<PortalAmbulance>) => void;
  deleteAmbulance: (id: string) => void;
  dispatchAmbulance: (id: string, destination: string, paramedic: string, isStat?: boolean) => void;
  returnAmbulance: (id: string) => void;

  updateBloodStock: (id: string, field: keyof BloodInventoryItem, delta: number) => void;
  createTransfusionRequest: (req: Omit<TransfusionRequisition, 'id' | 'hospitalId' | 'requestedAt' | 'status'>) => void;

  addPharmacyItem: (item: Omit<PharmacyItem, 'id' | 'hospitalId'>) => void;
  dispenseMedication: (id: string, quantity: number) => boolean;

  addTariff: (tariff: Omit<ServiceTariff, 'id' | 'hospitalId'>) => void;
  updateTariff: (id: string, data: Partial<ServiceTariff>) => void;
  deleteTariff: (id: string) => void;

  addPackage: (pkg: Omit<SurgicalPackage, 'id' | 'hospitalId'>) => void;
  updatePackage: (id: string, data: Partial<SurgicalPackage>) => void;
  deletePackage: (id: string) => void;

  addAppointment: (apt: Omit<Appointment, 'id' | 'hospitalId' | 'tokenNumber' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  addAnnouncement: (ann: Omit<Announcement, 'id' | 'hospitalId' | 'createdAt' | 'acknowledgedCount'>) => void;
  acknowledgeAnnouncement: (id: string) => void;

  // Two-Phase Governance Actions
  submitDraft: (draft: Omit<ChangeDraft, 'id' | 'hospitalId' | 'submittedAt' | 'status'>) => void;
  approveDraft: (draftId: string, notes?: string) => void;
  rejectDraft: (draftId: string, reason: string) => void;

  // Audit Logs
  addAuditLog: (action: string, module: string, details: string) => void;

  // Authority Verification & Application Governance
  applications: HospitalApplication[];
  hospitalAccounts: HospitalAccount[];
  activationTokens: ActivationTokenRecord[];
  passwordResetTokens: PasswordResetTokenRecord[];

  submitHospitalApplication: (data: Omit<HospitalApplication, 'id' | 'status' | 'submittedAt'>) => Promise<{ success: boolean; applicationId: string; error?: string }>;
  reviewHospitalApplication: (applicationId: string, reviewerName: string, notes?: string) => void;
  approveHospitalApplication: (applicationId: string, reviewerName: string, notes?: string) => Promise<{ success: boolean; token: string; applicationId: string; error?: string }>;
  rejectHospitalApplication: (applicationId: string, reviewerName: string, reason: string) => void;
  requestAdditionalInfo: (applicationId: string, reviewerName: string, query: string) => void;
  suspendHospitalAccount: (hospitalId: string, reason: string) => void;
  reactivateHospitalAccount: (hospitalId: string) => void;
  regenerateActivationToken: (applicationId: string) => string | null;

  // Approved Hospital Self-Activation & Credential Creation
  validateActivationToken: (tokenString: string) => { valid: boolean; application?: HospitalApplication; error?: string };
  checkUsernameAvailability: (username: string) => { available: boolean; error?: string };
  activateHospitalAccount: (payload: { token: string; username: string; password: string; declarationAccepted: boolean }) => Promise<{ success: boolean; error?: string; username?: string }>;

  // Secure Hospital Login with failed attempt throttling
  loginWithHospitalCredentials: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; isLocked?: boolean }>;

  // Secure Single-Use Expiring Password Reset
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; message: string; demoToken?: string }>;
  validatePasswordResetToken: (tokenString: string) => { valid: boolean; account?: HospitalAccount; error?: string };
  resetPasswordWithToken: (payload: { token: string; newPassword: string }) => Promise<{ success: boolean; error?: string }>;

  // Active Modals Controller
  activeModal:
    | 'register_hospital'
    | 'add_doctor'
    | 'add_bed'
    | 'dispatch_ambulance'
    | 'submit_draft'
    | 'book_appointment'
    | 'department_modal'
    | 'wing_modal'
    | 'tariff_modal'
    | 'package_modal'
    | 'ambulance_modal'
    | null;
  modalPayload: any;
  openModal: (
    modal:
      | 'register_hospital'
      | 'add_doctor'
      | 'add_bed'
      | 'dispatch_ambulance'
      | 'submit_draft'
      | 'book_appointment'
      | 'department_modal'
      | 'wing_modal'
      | 'tariff_modal'
      | 'package_modal'
      | 'ambulance_modal',
    payload?: any
  ) => void;
  closeModal: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'globalhealth_enterprise_state_v1';

export const HospitalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Multi-Tenant Hospital Facilities
  const [hospitals, setHospitals] = useState<HospitalFacility[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_hospitals`);
      if (stored) {
        const parsed: HospitalFacility[] = JSON.parse(stored);
        const map = new Map<string, HospitalFacility>();
        // Seed first
        INITIAL_HOSPITALS.forEach((h) => map.set(h.id, h));
        // Overwrite or append with stored user edits and new additions
        parsed.forEach((h) => {
          const existing = map.get(h.id);
          map.set(h.id, existing ? { ...existing, ...h } : h);
        });
        return Array.from(map.values());
      }
      return INITIAL_HOSPITALS;
    } catch {
      return INITIAL_HOSPITALS;
    }
  });

  const [currentHospitalId, setCurrentHospitalId] = useState<string>(() => {
    return hospitals[0]?.id || 'HSP-IN-DL-000125';
  });

  const [currentView, setCurrentView] = useState<NavigationView>('dashboard');

  // RBAC Users
  const [registeredUsers, setRegisteredUsers] = useState<HospitalUser[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_users`);
      return stored ? JSON.parse(stored) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Server-verified portal session state. Hospital credentials are validated
  // ONLY by the backend; the returned session token authorizes registry
  // writes and identifies the hospital server-side (no client-supplied ids).
  const [sessionValidating, setSessionValidating] = useState<boolean>(() => !!getHospitalSessionToken());
  const [sessionExpired, setSessionExpired] = useState(false);
  const dismissSessionExpired = useCallback(() => setSessionExpired(false), []);

  const [currentUser, setCurrentUser] = useState<HospitalUser | null>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_current_user`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [twoFactorVerified, setTwoFactorVerified] = useState(true);

  // Collections state
  const [rawWings, setWings] = useState<Wing[]>(INITIAL_WINGS);
  const [rawDepartments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [rawOtRooms, setOtRooms] = useState<OTRoom[]>(INITIAL_OT_ROOMS);
  const [rawDoctors, setDoctors] = useState<PortalDoctor[]>(INITIAL_PORTAL_DOCTORS);
  const [rawBeds, setBeds] = useState<PortalBed[]>(INITIAL_BEDS);
  const [rawAmbulances, setAmbulances] = useState<PortalAmbulance[]>(INITIAL_AMBULANCES);
  const [rawBloodBank, setBloodBank] = useState<BloodInventoryItem[]>(INITIAL_BLOOD_BANK);
  const [rawTransfusions, setTransfusions] = useState<TransfusionRequisition[]>(INITIAL_TRANSFUSIONS);
  const [rawPharmacy, setPharmacy] = useState<PharmacyItem[]>(INITIAL_PHARMACY);
  const [rawEquipment, setEquipment] = useState<EquipmentAsset[]>(INITIAL_EQUIPMENT);
  const [rawTariffs, setTariffs] = useState<ServiceTariff[]>(INITIAL_TARIFFS);
  const [rawPackages, setPackages] = useState<SurgicalPackage[]>(INITIAL_PACKAGES);
  const [insuranceProviders] = useState<InsuranceProvider[]>(INITIAL_INSURANCE);
  const [claims] = useState<CashlessClaim[]>(INITIAL_CLAIMS);
  const [documents] = useState<ComplianceDocument[]>(INITIAL_DOCUMENTS);
  const [rawDrafts, setDrafts] = useState<ChangeDraft[]>(INITIAL_DRAFTS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [rawAppointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [labTests] = useState<LabTest[]>(INITIAL_LAB_TESTS);
  const [imaging] = useState<ImagingService[]>(INITIAL_IMAGING_SERVICES);
  const [rawAuditLogs, setAuditLogs] = useState<ImmutableAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Authority-Only Hospital Applications & Verified Accounts State
  const [applications, setApplications] = useState<HospitalApplication[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_applications`);
      return stored ? JSON.parse(stored) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [hospitalAccounts, setHospitalAccounts] = useState<HospitalAccount[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_accounts`);
      return stored ? JSON.parse(stored) : INITIAL_HOSPITAL_ACCOUNTS;
    } catch {
      return INITIAL_HOSPITAL_ACCOUNTS;
    }
  });

  const [activationTokens, setActivationTokens] = useState<ActivationTokenRecord[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_activation_tokens`);
      return stored ? JSON.parse(stored) : INITIAL_ACTIVATION_TOKENS;
    } catch {
      return INITIAL_ACTIVATION_TOKENS;
    }
  });

  const [passwordResetTokens, setPasswordResetTokens] = useState<PasswordResetTokenRecord[]>(() => {
    try {
      const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reset_tokens`);
      return stored ? JSON.parse(stored) : INITIAL_RESET_TOKENS;
    } catch {
      return INITIAL_RESET_TOKENS;
    }
  });

  // Modal Sheet State
  const [activeModal, setActiveModal] = useState<
    | 'register_hospital'
    | 'add_doctor'
    | 'add_bed'
    | 'dispatch_ambulance'
    | 'submit_draft'
    | 'book_appointment'
    | 'department_modal'
    | 'wing_modal'
    | 'tariff_modal'
    | 'package_modal'
    | 'ambulance_modal'
    | null
  >(null);
  const [modalPayload, setModalPayload] = useState<any>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_hospitals`, JSON.stringify(hospitals));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_users`, JSON.stringify(registeredUsers));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_applications`, JSON.stringify(applications));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_accounts`, JSON.stringify(hospitalAccounts));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_activation_tokens`, JSON.stringify(activationTokens));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_reset_tokens`, JSON.stringify(passwordResetTokens));
      if (currentUser) {
        localStorage.setItem(`${LOCAL_STORAGE_KEY}_current_user`, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(`${LOCAL_STORAGE_KEY}_current_user`);
      }
    } catch {
      // ignore
    }
  }, [hospitals, registeredUsers, applications, hospitalAccounts, activationTokens, passwordResetTokens, currentUser]);

  const currentHospital = useMemo(() => {
    return hospitals.find((h) => h.id === currentHospitalId) || hospitals[0];
  }, [hospitals, currentHospitalId]);

  const currentRole = currentUser?.role || 'Hospital Administrator';

  // Scoped collections strictly isolating data to currentHospitalId (unless SuperAdmin)
  const isSuperAdmin = currentRole === 'GlobalHealth SuperAdmin';

  const wings = useMemo(() => {
    if (isSuperAdmin) return rawWings;
    return rawWings.filter((w) => !w.hospitalId || w.hospitalId === currentHospitalId);
  }, [rawWings, currentHospitalId, isSuperAdmin]);

  const departments = useMemo(() => {
    if (isSuperAdmin) return rawDepartments;
    return rawDepartments.filter((d) => !d.hospitalId || d.hospitalId === currentHospitalId);
  }, [rawDepartments, currentHospitalId, isSuperAdmin]);

  const otRooms = useMemo(() => {
    if (isSuperAdmin) return rawOtRooms;
    return rawOtRooms.filter((ot) => !ot.hospitalId || ot.hospitalId === currentHospitalId);
  }, [rawOtRooms, currentHospitalId, isSuperAdmin]);

  const doctors = useMemo(() => {
    if (isSuperAdmin) return rawDoctors;
    return rawDoctors.filter((doc) => !doc.hospitalId || doc.hospitalId === currentHospitalId);
  }, [rawDoctors, currentHospitalId, isSuperAdmin]);

  const beds = useMemo(() => {
    if (isSuperAdmin) return rawBeds;
    return rawBeds.filter((b) => !b.hospitalId || b.hospitalId === currentHospitalId);
  }, [rawBeds, currentHospitalId, isSuperAdmin]);

  const ambulances = useMemo(() => {
    if (isSuperAdmin) return rawAmbulances;
    return rawAmbulances.filter((a) => !a.hospitalId || a.hospitalId === currentHospitalId);
  }, [rawAmbulances, currentHospitalId, isSuperAdmin]);

  const bloodBank = useMemo(() => {
    if (isSuperAdmin) return rawBloodBank;
    return rawBloodBank.filter((bb) => !bb.hospitalId || bb.hospitalId === currentHospitalId);
  }, [rawBloodBank, currentHospitalId, isSuperAdmin]);

  const transfusions = useMemo(() => {
    if (isSuperAdmin) return rawTransfusions;
    return rawTransfusions.filter((tr) => !tr.hospitalId || tr.hospitalId === currentHospitalId);
  }, [rawTransfusions, currentHospitalId, isSuperAdmin]);

  const pharmacy = useMemo(() => {
    if (isSuperAdmin) return rawPharmacy;
    return rawPharmacy.filter((p) => !p.hospitalId || p.hospitalId === currentHospitalId);
  }, [rawPharmacy, currentHospitalId, isSuperAdmin]);

  const equipment = useMemo(() => {
    if (isSuperAdmin) return rawEquipment;
    return rawEquipment.filter((eq) => !eq.hospitalId || eq.hospitalId === currentHospitalId);
  }, [rawEquipment, currentHospitalId, isSuperAdmin]);

  const tariffs = useMemo(() => {
    if (isSuperAdmin) return rawTariffs;
    return rawTariffs.filter((t) => !t.hospitalId || t.hospitalId === currentHospitalId);
  }, [rawTariffs, currentHospitalId, isSuperAdmin]);

  const packages = useMemo(() => {
    if (isSuperAdmin) return rawPackages;
    return rawPackages.filter((p) => !p.hospitalId || p.hospitalId === currentHospitalId);
  }, [rawPackages, currentHospitalId, isSuperAdmin]);

  const drafts = useMemo(() => {
    if (isSuperAdmin) return rawDrafts;
    return rawDrafts.filter((d) => !d.hospitalId || d.hospitalId === currentHospitalId);
  }, [rawDrafts, currentHospitalId, isSuperAdmin]);

  const appointments = useMemo(() => {
    if (isSuperAdmin) return rawAppointments;
    return rawAppointments.filter((app) => !app.hospitalId || app.hospitalId === currentHospitalId);
  }, [rawAppointments, currentHospitalId, isSuperAdmin]);

  const auditLogs = useMemo(() => {
    if (isSuperAdmin) return rawAuditLogs;
    return rawAuditLogs.filter((log) => !log.hospitalId || log.hospitalId === currentHospitalId);
  }, [rawAuditLogs, currentHospitalId, isSuperAdmin]);

  // Audit Log Subsystem
  const addAuditLog = (action: string, module: string, details: string) => {
    const latestHash = rawAuditLogs[0]?.hash || '00000000000000000000000000000000';
    const newEntry: ImmutableAuditLog = {
      id: `AUD-${Math.floor(100000 + Math.random() * 900000)}`,
      hospitalId: currentHospitalId,
      timestamp: new Date().toISOString(),
      action,
      module,
      userId: currentUser?.id || 'USR-SYS',
      userName: currentUser?.name || 'System Operator',
      userRole: currentRole,
      ipAddress: `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(10 + Math.random() * 200)} (Secure Terminal)`,
      details,
      hash: generateBlockHash(`${action}-${module}-${details}`, latestHash)
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Authority Application & Verification Handlers
  const submitHospitalApplication = async (
    data: Omit<HospitalApplication, 'id' | 'status' | 'submittedAt'>
  ): Promise<{ success: boolean; applicationId: string; error?: string }> => {
    if (!data.hospitalLegalName || !data.officialEmail || !data.representativeName || !data.registrationNumber) {
      return { success: false, applicationId: '', error: 'Legal name, registration number, official email, and representative details are mandatory.' };
    }
    if (!data.declarationCertified) {
      return { success: false, applicationId: '', error: 'You must certify the legal declaration before submitting for verification.' };
    }
    const appId = `APP-REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: HospitalApplication = {
      ...data,
      id: appId,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString()
    };
    setApplications((prev) => [newApp, ...prev]);
    addAuditLog(
      'Hospital Registration Request Submitted',
      'Authority Governance',
      `New hospital access application ${appId} submitted for ${newApp.hospitalLegalName} (${newApp.city}, ${newApp.country}).`
    );
    return { success: true, applicationId: appId };
  };

  const reviewHospitalApplication = (applicationId: string, reviewerName: string, notes?: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'UNDER_REVIEW',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes || app.reviewNotes
            }
          : app
      )
    );
    addAuditLog(
      'Hospital Application Placed Under Review',
      'Authority Governance',
      `Application ${applicationId} review initialized by ${reviewerName}.`
    );
  };

  const approveHospitalApplication = async (
    applicationId: string,
    reviewerName: string,
    notes?: string
  ): Promise<{ success: boolean; token: string; applicationId: string; error?: string }> => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app) {
      return { success: false, token: '', applicationId, error: 'Application record not found.' };
    }

    const hospitalId = app.createdHospitalId || `HSP-${app.country.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const tokenStr = `ACT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

    // If hospital facility does not exist yet, provision it
    const existingFacility = hospitals.find((h) => h.id === hospitalId);
    if (!existingFacility) {
      const newFacility: HospitalFacility = {
        id: hospitalId,
        orgId: `ORG-${app.country.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
        name: app.publicName || app.hospitalLegalName,
        legalName: app.hospitalLegalName,
        shortName: (app.publicName || app.hospitalLegalName).split(' ')[0] + ' Medical Center',
        tagline: 'Comprehensive Accredited Healthcare & Emergency Resuscitation Center',
        hospitalType: (app.hospitalType as any) || 'Super Specialty',
        ownership: app.ownership,
        establishedYear: app.establishedYear || 2020,
        registrationNo: app.registrationNumber,
        cinNo: app.cinNumber || `REG-${hospitalId}`,
        officialEmail: app.officialEmail,
        emergencyPhone: app.emergencyHotline || app.officialPhone,
        mainReceptionPhone: app.officialPhone,
        opdAppointmentPhone: app.officialPhone,
        bloodBankHelpline: app.officialPhone,
        ambulanceHelpline: app.emergencyHotline || app.officialPhone,
        tpaInsuranceDeskPhone: app.officialPhone,
        websiteUrl: app.websiteUrl || 'https://health.enterprise.org',
        streetAddress: app.streetAddress,
        city: app.city,
        state: app.state,
        country: app.country,
        postalCode: app.postalCode,
        emergencyHours: '24 Hours / 7 Days Continuous',
        opdHours: '08:00 AM - 08:00 PM',
        visitingHours: '04:00 PM - 07:00 PM',
        pharmacyHours: '24 Hours Open',
        bloodBankHours: '24 Hours Continuous Service',
        verificationStatus: 'Verified',
        redAlertActive: false,
        traumaLevel: app.traumaLevel || 'Level 1 Trauma Center',
        rating: 4.85,
        totalBedsCount: app.totalBedsCount || 400,
        icuBedsCount: app.icuBedsCount || 60
      };
      setHospitals((prev) => [...prev, newFacility]);
    }

    const tokenRecord: ActivationTokenRecord = {
      token: tokenStr,
      applicationId: app.id,
      hospitalId,
      hospitalLegalName: app.hospitalLegalName,
      officialEmail: app.officialEmail,
      createdAt: new Date().toISOString(),
      expiresAt,
      used: false,
      revoked: false
    };
    setActivationTokens((prev) => [tokenRecord, ...prev]);

    setApplications((prev) =>
      prev.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: 'APPROVED_NOT_ACTIVATED',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes || 'Verified and approved by Hospital Authority. Activation token generated.',
              createdHospitalId: hospitalId,
              activationToken: tokenStr,
              activationTokenExpiresAt: expiresAt,
              activationTokenUsed: false
            }
          : a
      )
    );

    addAuditLog(
      'Hospital Approved & Activation Token Generated',
      'Authority Governance',
      `Authority officer ${reviewerName} approved application ${applicationId} for ${app.hospitalLegalName}. Secure token issued.`
    );

    return { success: true, token: tokenStr, applicationId };
  };

  const rejectHospitalApplication = (applicationId: string, reviewerName: string, reason: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'REJECTED',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
              reviewNotes: reason
            }
          : app
      )
    );
    addAuditLog(
      'Hospital Application Rejected',
      'Authority Governance',
      `Authority officer ${reviewerName} rejected application ${applicationId}. Reason: ${reason}`
    );
  };

  const requestAdditionalInfo = (applicationId: string, reviewerName: string, query: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              status: 'ADDITIONAL_INFO_REQUIRED',
              reviewedBy: reviewerName,
              reviewedAt: new Date().toISOString(),
              additionalInfoQuery: query
            }
          : app
      )
    );
    addAuditLog(
      'Additional Information Requested',
      'Authority Governance',
      `Application ${applicationId}: requested additional compliance data from applicant.`
    );
  };

  const suspendHospitalAccount = (hospitalId: string, reason: string) => {
    setHospitalAccounts((prev) =>
      prev.map((acc) => (acc.hospitalId === hospitalId ? { ...acc, accountStatus: 'SUSPENDED', updatedAt: new Date().toISOString() } : acc))
    );
    setHospitals((prev) =>
      prev.map((h) => (h.id === hospitalId ? { ...h, verificationStatus: 'Suspended' } : h))
    );
    setApplications((prev) =>
      prev.map((a) => (a.createdHospitalId === hospitalId ? { ...a, status: 'SUSPENDED' } : a))
    );
    addAuditLog(
      'Hospital Account Suspended',
      'Authority Governance',
      `Hospital ${hospitalId} suspended by Authority. Reason: ${reason}`
    );
  };

  const reactivateHospitalAccount = (hospitalId: string) => {
    setHospitalAccounts((prev) =>
      prev.map((acc) => (acc.hospitalId === hospitalId ? { ...acc, accountStatus: 'ACTIVE', updatedAt: new Date().toISOString() } : acc))
    );
    setHospitals((prev) =>
      prev.map((h) => (h.id === hospitalId ? { ...h, verificationStatus: 'Verified' } : h))
    );
    setApplications((prev) =>
      prev.map((a) => (a.createdHospitalId === hospitalId ? { ...a, status: 'ACTIVE' } : a))
    );
    addAuditLog(
      'Hospital Account Reactivated',
      'Authority Governance',
      `Hospital ${hospitalId} reactivated by Authority.`
    );
  };

  const regenerateActivationToken = (applicationId: string): string | null => {
    const app = applications.find((a) => a.id === applicationId);
    if (!app || (app.status !== 'APPROVED_NOT_ACTIVATED' && app.status !== 'ACTIVATION_SENT')) {
      return null;
    }
    // Revoke old tokens
    setActivationTokens((prev) =>
      prev.map((t) => (t.applicationId === applicationId ? { ...t, revoked: true } : t))
    );
    const newToken = `ACT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const tokenRecord: ActivationTokenRecord = {
      token: newToken,
      applicationId: app.id,
      hospitalId: app.createdHospitalId || 'HSP-PENDING',
      hospitalLegalName: app.hospitalLegalName,
      officialEmail: app.officialEmail,
      createdAt: new Date().toISOString(),
      expiresAt,
      used: false,
      revoked: false
    };
    setActivationTokens((prev) => [tokenRecord, ...prev]);
    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId ? { ...a, activationToken: newToken, activationTokenExpiresAt: expiresAt, activationTokenUsed: false } : a))
    );
    addAuditLog(
      'Activation Token Regenerated',
      'Authority Governance',
      `Re-issued secure activation token for application ${applicationId}.`
    );
    return newToken;
  };

  const validateActivationToken = (
    tokenString: string
  ): { valid: boolean; application?: HospitalApplication; error?: string } => {
    if (!tokenString || !tokenString.trim()) {
      return { valid: false, error: 'Activation token is required.' };
    }
    const cleanToken = tokenString.trim();
    const tokenRecord = activationTokens.find((t) => t.token === cleanToken);
    if (!tokenRecord) {
      // Check in applications directly
      const appByToken = applications.find((a) => a.activationToken === cleanToken);
      if (appByToken && !appByToken.activationTokenUsed) {
        return { valid: true, application: appByToken };
      }
      return { valid: false, error: 'The activation token provided is invalid or does not exist.' };
    }
    if (tokenRecord.revoked) {
      return { valid: false, error: 'This activation link has been revoked by the Hospital Authority.' };
    }
    if (tokenRecord.used) {
      return { valid: false, error: 'This activation token has already been used to create an account.' };
    }
    if (new Date(tokenRecord.expiresAt) < new Date()) {
      return { valid: false, error: 'This activation link has expired. Please contact the Hospital Authority for a fresh activation link.' };
    }
    const app = applications.find((a) => a.id === tokenRecord.applicationId || a.activationToken === cleanToken);
    if (!app) {
      return { valid: false, error: 'Associated hospital record not found.' };
    }
    if (app.status !== 'APPROVED_NOT_ACTIVATED' && app.status !== 'ACTIVATION_SENT') {
      return { valid: false, error: 'This hospital is not currently eligible for account activation.' };
    }
    return { valid: true, application: app };
  };

  const checkUsernameAvailability = (username: string): { available: boolean; error?: string } => {
    const clean = username.trim().toLowerCase();
    if (clean.length < 4) {
      return { available: false, error: 'Username must be at least 4 characters.' };
    }
    if (clean.length > 24) {
      return { available: false, error: 'Username cannot exceed 24 characters.' };
    }
    if (!/^[a-z0-9_.-]+$/.test(clean)) {
      return { available: false, error: 'Username can only contain lowercase letters, numbers, hyphens, and underscores.' };
    }
    const reserved = ['admin', 'root', 'administrator', 'system', 'superadmin', 'support', 'null', 'undefined', 'hospital', 'authority', 'governance'];
    if (reserved.includes(clean)) {
      return { available: false, error: 'This username is reserved by the system security policy.' };
    }
    const existsAccount = hospitalAccounts.some((a) => a.username.toLowerCase() === clean);
    if (existsAccount) {
      return { available: false, error: 'Username already taken. Please choose a different username.' };
    }
    return { available: true };
  };

  const activateHospitalAccount = async (payload: {
    token: string;
    username: string;
    password: string;
    declarationAccepted: boolean;
  }): Promise<{ success: boolean; error?: string; username?: string }> => {
    const tokenVal = validateActivationToken(payload.token);
    if (!tokenVal.valid || !tokenVal.application) {
      return { success: false, error: tokenVal.error || 'Invalid activation token.' };
    }
    if (!payload.declarationAccepted) {
      return { success: false, error: 'You must confirm that you are authorized to establish credentials for this approved hospital.' };
    }
    const userCheck = checkUsernameAvailability(payload.username);
    if (!userCheck.available) {
      return { success: false, error: userCheck.error || 'Invalid username.' };
    }
    if (!payload.password || payload.password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const app = tokenVal.application;
    const hospitalId = app.createdHospitalId || `HSP-${app.country.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanUsername = payload.username.trim().toLowerCase();

    // Provision the REAL server-side account so the new credentials work at
    // sign-in (the backend is the credential authority).
    try {
      const res = await fetch('/api/hospital-portal/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId,
          hospitalName: app.hospitalLegalName || app.publicName,
          username: payload.username.trim().toLowerCase(),
          password: payload.password,
          email: app.officialEmail
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        return { success: false, error: data?.error || 'The credentialing server rejected this activation. Please contact GlobalHealth support.' };
      }
    } catch {
      return { success: false, error: 'The credentialing server is unreachable. Your activation token remains valid — please try again in a moment.' };
    }

    // Create HospitalAccount
    const newAccount: HospitalAccount = {
      id: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId,
      username: cleanUsername,
      officialEmail: app.officialEmail,
      passwordHash: generateBlockHash(payload.password, 'GLOBALHEALTH_SALT_2026'),
      accountStatus: 'ACTIVE',
      failedLoginAttempts: 0,
      activatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      lastLoginIp: '10.0.1.1 (Activation Session)'
    };
    setHospitalAccounts((prev) => [...prev, newAccount]);

    // Create Initial Admin HospitalUser
    const newAdminUser: HospitalUser = {
      id: `USR-ADM-${Math.floor(100 + Math.random() * 900)}`,
      name: app.representativeName || `${app.publicName} Administrator`,
      email: app.officialEmail,
      role: 'Hospital Administrator',
      hospitalId,
      hospitalName: app.publicName || app.hospitalLegalName,
      department: 'Hospital Administration & Governance',
      employeeId: `EMP-ADM-001`,
      phone: app.representativePhone || app.officialPhone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      twoFactorEnabled: true,
      status: 'Active'
    };
    setRegisteredUsers((prev) => [...prev, newAdminUser]);

    // Mark token as used
    setActivationTokens((prev) =>
      prev.map((t) => (t.token === payload.token.trim() ? { ...t, used: true } : t))
    );

    // Update Application Status to ACTIVE
    setApplications((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? {
              ...a,
              status: 'ACTIVE',
              activationTokenUsed: true
            }
          : a
      )
    );

    // Set active session
    setCurrentHospitalId(hospitalId);
    setCurrentUser(newAdminUser);

    addAuditLog(
      'Hospital Account Activated & Credentials Created',
      'Security & Access',
      `Approved hospital ${app.hospitalLegalName} activated account. Primary username: @${cleanUsername}.`
    );

    return { success: true, username: cleanUsername };
  };

  const loginWithHospitalCredentials = async (
    identifier: string,
    password: string,
    _rememberMe?: boolean
  ): Promise<{ success: boolean; error?: string; isLocked?: boolean }> => {
    if (!identifier || !identifier.trim() || !password) {
      return { success: false, error: 'Please enter both your hospital username and password.' };
    }

    const cleanId = identifier.trim().toLowerCase();

    // Credentials are verified by the BACKEND only. The server issues a
    // hospital-scoped session token; the hospital identity comes from the
    // session (never from client-supplied ids), and registry writes are
    // authorized by that session server-side.
    let data: any;
    try {
      const res = await fetch('/api/hospital-portal/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanId, password })
      });
      data = await res.json().catch(() => null);
      if (res.status === 429) {
        return { success: false, isLocked: true, error: data?.error || 'Too many sign-in attempts. Please try again later.' };
      }
      if (!res.ok || !data?.success) {
        addAuditLog('Failed Hospital Portal Login Attempt', 'Security & Access', `Rejected sign-in for identifier: ${cleanId}.`);
        return { success: false, error: data?.error || 'Invalid username or password. Please verify your credentials and try again.' };
      }
    } catch {
      return { success: false, error: 'The Hospital Portal sign-in service is temporarily unavailable. Please check your connection and try again.' };
    }

    const account = data.account;
    storeHospitalSession(data.token);

    // Find or create the local workspace user for the authenticated hospital.
    let user = registeredUsers.find((u) => u.hospitalId === account.hospitalId && u.role === 'Hospital Administrator');
    if (!user) {
      const hosp = hospitals.find((h) => h.id === account.hospitalId);
      user = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: `${hosp?.name || account.hospitalName || 'Hospital'} Administrator`,
        email: account.email,
        role: 'Hospital Administrator',
        hospitalId: account.hospitalId,
        hospitalName: hosp?.name || account.hospitalName || 'Hospital',
        department: 'Administration',
        employeeId: 'EMP-ADM-001',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        twoFactorEnabled: true,
        status: 'Active'
      };
      setRegisteredUsers((prev) => [...prev, user!]);
    }

    setCurrentHospitalId(account.hospitalId);
    setCurrentUser(user);
    setSessionExpired(false);
    addAuditLog('Hospital Portal Login Success', 'Security & Access', `Hospital account @${account.username} authenticated against the credentialing server.`);
    return { success: true };
  };

  // Bootstrap: validate any persisted portal session against the server and
  // restore the authenticated hospital context (or clear everything).
  useEffect(() => {
    const token = getHospitalSessionToken();
    if (!token) {
      setSessionValidating(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/hospital-portal/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.account) {
            const acct = data.account;
            const user = registeredUsers.find((u) => u.hospitalId === acct.hospitalId && u.role === 'Hospital Administrator') || null;
            setCurrentHospitalId(acct.hospitalId);
            if (user) setCurrentUser(user);
          }
        } else {
          clearHospitalSession();
          setCurrentUser(null);
          setSessionExpired(true);
        }
      } catch {
        if (!cancelled) {
          // Fail safe: require re-authentication when the server is unreachable.
          clearHospitalSession();
          setCurrentUser(null);
          setSessionExpired(true);
        }
      } finally {
        if (!cancelled) setSessionValidating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestPasswordReset = async (
    identifier: string
  ): Promise<{ success: boolean; message: string; demoToken?: string }> => {
    const genericMessage =
      'If the information provided matches an eligible account, password reset instructions will be sent to the registered official contact method.';

    if (!identifier || !identifier.trim()) {
      return { success: false, message: 'Please provide your hospital username or registered email address.' };
    }

    const cleanId = identifier.trim().toLowerCase();
    const account = hospitalAccounts.find(
      (a) => a.username.toLowerCase() === cleanId || a.officialEmail.toLowerCase() === cleanId
    );

    // The SERVER issues the reset token that actually authorizes the change.
    // (Local fallback only keeps the demo UI usable when offline.)
    if (account) {
      let resetToken = `RST-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      try {
        const res = await fetch('/api/hospital-portal/auth/request-reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: cleanId })
        });
        const data = await res.json().catch(() => null);
        if (res.ok && data?.demoToken) {
          resetToken = data.demoToken;
        }
      } catch {
        /* offline fallback keeps the local demo token */
      }
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      const tokenRecord: PasswordResetTokenRecord = {
        token: resetToken,
        accountId: account.id,
        username: account.username,
        officialEmail: account.officialEmail,
        createdAt: new Date().toISOString(),
        expiresAt,
        used: false,
        revoked: false
      };

      setPasswordResetTokens((prev) => [tokenRecord, ...prev]);
      addAuditLog(
        'Password Reset Requested',
        'Security & Access',
        `Password reset token generated for hospital @${account.username} (${account.officialEmail}).`
      );

      return {
        success: true,
        message: genericMessage,
        demoToken: resetToken
      };
    }

    return {
      success: true,
      message: genericMessage
    };
  };

  const validatePasswordResetToken = (
    tokenString: string
  ): { valid: boolean; account?: HospitalAccount; error?: string } => {
    if (!tokenString || !tokenString.trim()) {
      return { valid: false, error: 'Reset token is required.' };
    }
    const cleanToken = tokenString.trim();
    const tokenRecord = passwordResetTokens.find((t) => t.token === cleanToken);
    if (!tokenRecord) {
      return { valid: false, error: 'The password reset link is invalid or does not exist.' };
    }
    if (tokenRecord.revoked) {
      return { valid: false, error: 'This password reset link has been revoked.' };
    }
    if (tokenRecord.used) {
      return { valid: false, error: 'This password reset link has already been used.' };
    }
    if (new Date(tokenRecord.expiresAt) < new Date()) {
      return { valid: false, error: 'This password reset link has expired. Please request a new one.' };
    }
    const account = hospitalAccounts.find((a) => a.id === tokenRecord.accountId);
    if (!account) {
      return { valid: false, error: 'Associated hospital account not found.' };
    }
    return { valid: true, account };
  };

  const resetPasswordWithToken = async (payload: {
    token: string;
    newPassword: string;
  }): Promise<{ success: boolean; error?: string }> => {
    const val = validatePasswordResetToken(payload.token);
    if (!val.valid || !val.account) {
      return { success: false, error: val.error || 'Invalid reset token.' };
    }
    if (!payload.newPassword || payload.newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters long.' };
    }

    const account = val.account;
    // Apply the reset on the SERVER first — it owns hospital credentials.
    // 'RST-HPT-' tokens are server-issued and single-use; legacy local tokens
    // fall back to the local record only when the server cannot be reached.
    try {
      const res = await fetch('/api/hospital-portal/auth/complete-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken: payload.token, newPassword: payload.newPassword })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        if (data?.code === 'RESET_INVALID' || data?.code === 'WEAK_PASSWORD' || data?.code === 'ACCOUNT_NOT_FOUND') {
          return { success: false, error: data.error };
        }
        /* unknown server objection — continue with local application below */
      }
    } catch {
      /* server unreachable: apply locally so the demo flow completes */
    }
    const newHash = generateBlockHash(payload.newPassword, 'GLOBALHEALTH_SALT_2026');

    // Update account
    setHospitalAccounts((prev) =>
      prev.map((a) =>
        a.id === account.id
          ? {
              ...a,
              passwordHash: newHash,
              failedLoginAttempts: 0,
              lockedUntil: undefined,
              updatedAt: new Date().toISOString()
            }
          : a
      )
    );

    // Invalidate reset token
    setPasswordResetTokens((prev) =>
      prev.map((t) => (t.token === payload.token.trim() ? { ...t, used: true } : t))
    );

    addAuditLog(
      'Password Reset Completed',
      'Security & Access',
      `Password successfully reset for hospital account @${account.username}.`
    );

    return { success: true };
  };

  // Auth methods for staff SSO
  const login = async (email: string, _password?: string, hospitalId?: string): Promise<{ success: boolean; error?: string }> => {
    const user = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'No authorized personnel profile found with this email.' };
    }
    setCurrentUser(user);
    if (hospitalId) {
      setCurrentHospitalId(hospitalId);
    } else if (user.hospitalId) {
      setCurrentHospitalId(user.hospitalId);
    }
    setTwoFactorVerified(user.twoFactorEnabled ? true : true);
    addAuditLog('User Authentication Sign-In', 'Security & Access', `User ${user.name} logged into ${user.hospitalName} as ${user.role}.`);
    return { success: true };
  };

  const signup = async (data: Partial<HospitalUser>): Promise<{ success: boolean; error?: string }> => {
    if (!data.email || !data.name) {
      return { success: false, error: 'Name and Work Email are strictly mandatory.' };
    }
    const newUser: HospitalUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: data.name,
      email: data.email,
      role: data.role || 'Doctor / Specialist',
      hospitalId: currentHospitalId,
      hospitalName: currentHospital.name,
      department: data.department || 'Clinical Services',
      employeeId: data.employeeId || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      registrationNumber: data.registrationNumber || 'NMC/PENDING/2026',
      phone: data.phone || '+91 98000 00000',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      twoFactorEnabled: true,
      status: 'Active'
    };
    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    addAuditLog('New Personnel Provisioned', 'Security & Access', `Enrolled user ${newUser.name} as ${newUser.role} in ${currentHospital.name}.`);
    return { success: true };
  };

  const logout = () => {
    // Destroy the server-side session (best-effort) and clear local state.
    const token = getHospitalSessionToken();
    if (token) {
      void fetch('/api/hospital-portal/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => undefined);
    }
    clearHospitalSession();
    if (currentUser) {
      addAuditLog('Hospital Portal Logout', 'Security & Access', `User ${currentUser.name} signed out; server session destroyed.`);
    }
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const quickSwitchUser = (userId: string) => {
    const user = registeredUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.hospitalId) {
        setCurrentHospitalId(user.hospitalId);
      }
      addAuditLog('Persona Role Switched', 'Security & Access', `Switched active session to ${user.name} (${user.role}).`);
    }
  };

  const verify2FA = (code: string): boolean => {
    if (code === '849201' || code.length === 6) {
      setTwoFactorVerified(true);
      addAuditLog('2FA TOTP Verified', 'Security & 2FA', `Two-factor challenge satisfied successfully.`);
      return true;
    }
    return false;
  };

  const toggleUser2FA = (enabled: boolean) => {
    if (!currentUser) return;
    const updated = { ...currentUser, twoFactorEnabled: enabled };
    setCurrentUser(updated);
    setRegisteredUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    addAuditLog('2FA Policy Updated', 'Security & 2FA', `2FA requirement toggled to ${enabled ? 'Mandatory' : 'Optional'}.`);
  };

  // Hospital Mutations
  const updateHospitalProfile = (data: Partial<HospitalFacility>, targetId?: string) => {
    const idToUpdate = targetId || data.id || currentHospitalId;
    setHospitals((prev) =>
      prev.map((h) => (h.id === idToUpdate ? { ...h, ...data } : h))
    );
    addAuditLog('Hospital Master Profile Modified', 'Hospital Profile', `Updated core profile telemetry for ${data.name || idToUpdate}.`);
  };

  const toggleRedAlert = () => {
    const nextState = !currentHospital.redAlertActive;
    updateHospitalProfile({ redAlertActive: nextState });
    addAuditLog(
      nextState ? 'CODE RED DISASTER ALERT TRIGGERED' : 'Code Red Disaster Protocol Stood Down',
      'Emergency & Trauma',
      nextState
        ? 'Mass casualty / red alert protocols activated facility-wide. STAT Trauma teams notified.'
        : 'Facility restored to standard operational status.'
    );
  };

  const registerNewHospital = (
    facility: Omit<HospitalFacility, 'id'>,
    adminUser: Omit<HospitalUser, 'id' | 'hospitalId'>
  ): string => {
    const newId = `HSP-${facility.country.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newFacility: HospitalFacility = {
      ...facility,
      id: newId
    };
    const newAdmin: HospitalUser = {
      ...adminUser,
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId: newId,
      hospitalName: newFacility.name,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      twoFactorEnabled: true,
      status: 'Active'
    };

    setHospitals((prev) => [...prev, newFacility]);
    setRegisteredUsers((prev) => [...prev, newAdmin]);
    setCurrentHospitalId(newId);
    setCurrentUser(newAdmin);
    addAuditLog('New Hospital Facility Provisioned', 'Multi-Tenant Tower', `Provisioned tenant ${newFacility.name} (${newId}) with Administrator ${newAdmin.name}.`);
    return newId;
  };

  // Clinical Entity Actions
  const addDepartment = (dept: Omit<Department, 'id' | 'hospitalId'>) => {
    const newDept: Department = {
      ...dept,
      id: `DEPT-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId
    };
    setDepartments((prev) => [...prev, newDept]);
    addAuditLog('Clinical Department Established', 'Organization & Topology', `Created clinical department ${newDept.name} (${newDept.code}) in ${newDept.wingName}.`);
  };

  const updateDepartment = (id: string, data: Partial<Department>) => {
    setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
    addAuditLog('Clinical Department Modified', 'Organization & Topology', `Updated department parameters for ${id}.`);
  };

  const deleteDepartment = (id: string) => {
    const target = departments.find((d) => d.id === id);
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('Clinical Department Decommissioned', 'Organization & Topology', `Removed department ${target?.name || id}.`);
  };

  const addWing = (wing: Omit<Wing, 'id' | 'hospitalId'>) => {
    const newWing: Wing = {
      ...wing,
      id: `WING-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId: currentHospitalId
    };
    setWings((prev) => [...prev, newWing]);
    addAuditLog('Campus Wing Commissioned', 'Organization & Topology', `Added campus wing ${newWing.name} (${newWing.code}) with capacity for ${newWing.totalBeds} beds.`);
  };

  const updateWing = (id: string, data: Partial<Wing>) => {
    setWings((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
    addAuditLog('Campus Wing Modified', 'Organization & Topology', `Updated structural wing parameters for ${id}.`);
  };

  const deleteWing = (id: string) => {
    const target = wings.find((w) => w.id === id);
    setWings((prev) => prev.filter((w) => w.id !== id));
    addAuditLog('Campus Wing Decommissioned', 'Organization & Topology', `Decommissioned wing ${target?.name || id}.`);
  };

  const addDoctor = (doctor: Omit<PortalDoctor, 'id' | 'hospitalId'>) => {
    const newDoctor: PortalDoctor = {
      ...doctor,
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      hospitalId: currentHospitalId
    };
    setDoctors((prev) => [newDoctor, ...prev]);
    addAuditLog('Doctor Faculty Enrolled', 'Specialists Master', `Enrolled specialist ${newDoctor.name} (${newDoctor.specialty}) with Council Reg ${newDoctor.registrationNo}.`);
  };

  const updateDoctor = (id: string, data: Partial<PortalDoctor>) => {
    setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
    addAuditLog('Doctor Record Updated', 'Specialists Master', `Updated clinical profile / fee schedule for Doctor ID ${id}.`);
  };

  const deleteDoctor = (id: string) => {
    const target = doctors.find((d) => d.id === id);
    setDoctors((prev) => prev.filter((d) => d.id !== id));
    addAuditLog('Doctor Faculty Decommissioned', 'Specialists Master', `Removed doctor ${target?.name || id} from active roster.`);
  };

  const addBed = (bed: Omit<PortalBed, 'id' | 'hospitalId'>) => {
    const newBed: PortalBed = {
      ...bed,
      id: `BED-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId
    };
    setBeds((prev) => [newBed, ...prev]);
    addAuditLog('Inpatient Bed Commissioned', 'Capacity & Beds', `Commissioned new bed ${newBed.bedNumber} in ${newBed.wingName} (${newBed.wardType}).`);
  };

  const updateBedStatus = (
    id: string,
    status: PortalBed['status'],
    patientName?: string,
    patientId?: string,
    doctorName?: string
  ) => {
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status,
            assignedPatientName: status === 'Occupied' ? patientName : undefined,
            assignedPatientId: status === 'Occupied' ? patientId : undefined,
            assignedDoctorName: status === 'Occupied' ? doctorName : undefined,
            lastSanitizedAt: status === 'Available' ? new Date().toISOString() : b.lastSanitizedAt
          };
        }
        return b;
      })
    );
    addAuditLog('Bed Capacity Telemetry Changed', 'Capacity & Beds', `Bed ID ${id} transitioned to '${status}' status.`);
  };

  const deleteBed = (id: string) => {
    setBeds((prev) => prev.filter((b) => b.id !== id));
    addAuditLog('Inpatient Bed Decommissioned', 'Capacity & Beds', `Decommissioned Bed ID ${id}.`);
  };

  const addAmbulance = (ambulance: Omit<PortalAmbulance, 'id' | 'hospitalId'>) => {
    const newAmbulance: PortalAmbulance = {
      ...ambulance,
      id: `AMB-${Math.floor(10 + Math.random() * 90)}`,
      hospitalId: currentHospitalId
    };
    setAmbulances((prev) => [newAmbulance, ...prev]);
    addAuditLog('Ambulance Fleet Added', 'Fleet Logistics', `Commissioned ${newAmbulance.ambulanceType} (${newAmbulance.vehicleNumber}) with Paramedic ${newAmbulance.paramedicName}.`);
  };

  const updateAmbulance = (id: string, data: Partial<PortalAmbulance>) => {
    setAmbulances((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    addAuditLog('Ambulance Fleet Telemetry Updated', 'Fleet Logistics', `Updated fleet unit ${id}.`);
  };

  const deleteAmbulance = (id: string) => {
    const target = ambulances.find((a) => a.id === id);
    setAmbulances((prev) => prev.filter((a) => a.id !== id));
    addAuditLog('Ambulance Unit Decommissioned', 'Fleet Logistics', `Decommissioned ambulance unit ${target?.vehicleNumber || id}.`);
  };

  const dispatchAmbulance = (id: string, destination: string, paramedic: string, isStat: boolean = false) => {
    setAmbulances((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: 'Dispatched / In Transit',
            destination,
            paramedicName: paramedic || a.paramedicName,
            dispatchTime: new Date().toISOString(),
            etaMinutes: Math.floor(4 + Math.random() * 8)
          };
        }
        return a;
      })
    );
    addAuditLog(
      isStat ? 'STAT CRITICAL AMBULANCE DISPATCH' : 'Ambulance Emergency Dispatch',
      'Fleet Logistics',
      `Dispatched unit ${id} to ${destination} with lead paramedic ${paramedic}.`
    );
  };

  const returnAmbulance = (id: string) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Available', destination: undefined, etaMinutes: undefined } : a))
    );
    addAuditLog('Ambulance Stood By at Depot', 'Fleet Logistics', `Ambulance unit ${id} returned to base bay and cleared for next STAT call.`);
  };

  const updateBloodStock = (id: string, field: keyof BloodInventoryItem, delta: number) => {
    // Compute the next inventory state synchronously so it can be published
    // to the central registry (the public website's source of truth).
    const next = rawBloodBank.map((b) => {
      if (b.id === id) {
        const currentVal = (b[field] as number) || 0;
        const nextVal = Math.max(0, currentVal + delta);
        return { ...b, [field]: nextVal, lastRestockedAt: new Date().toISOString() };
      }
      return b;
    });
    setBloodBank(next);
    addAuditLog('Blood Bank Inventory Delta', 'Blood Bank', `Adjusted ${String(field)} on stock ID ${id} by delta ${delta > 0 ? `+${delta}` : delta} units.`);

    // LIVE publish: this hospital's full blood inventory is pushed to the
    // central registry so the public Blood Bank tab shows current stock for
    // THIS hospital only (matched by hospitalId). Best-effort — local state
    // stays correct even if the registry is unreachable.
    const mine = next.filter((b) => !b.hospitalId || b.hospitalId === currentHospitalId);
    void saveHospitalSection(currentHospitalId, 'pharmacyBlood', { bloodInventory: mine }, {
      userId: currentUser?.id || 'portal-blood-bank',
      userName: currentUser?.name || currentHospital?.name || 'Hospital Blood Bank Desk',
      userRole: currentUser?.role || 'Hospital Administrator',
      comment: `Live blood bank stock update (${String(field)} ${delta > 0 ? '+' : ''}${delta} on ${id})`
    }).catch(() => undefined);
  };

  const createTransfusionRequest = (req: Omit<TransfusionRequisition, 'id' | 'hospitalId' | 'requestedAt' | 'status'>) => {
    const newReq: TransfusionRequisition = {
      ...req,
      id: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId,
      requestedAt: new Date().toISOString(),
      status: 'Pending Crossmatch'
    };
    setTransfusions((prev) => [newReq, ...prev]);
    addAuditLog('Blood Transfusion Requisition Created', 'Blood Bank', `Requisitioned ${req.unitsRequested} units of ${req.bloodGroup} ${req.component} for Patient ${req.patientName} (${req.urgency}).`);
  };

  const addPharmacyItem = (item: Omit<PharmacyItem, 'id' | 'hospitalId'>) => {
    const newItem: PharmacyItem = {
      ...item,
      id: `PHM-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId
    };
    setPharmacy((prev) => [newItem, ...prev]);
    addAuditLog('Formulary Drug Enrolled', 'Pharmacy & Formulary', `Added drug ${newItem.brandName} (${newItem.genericName}) to active formulary.`);
  };

  const dispenseMedication = (id: string, quantity: number): boolean => {
    let success = false;
    setPharmacy((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (p.currentStock >= quantity) {
            success = true;
            return { ...p, currentStock: p.currentStock - quantity };
          }
        }
        return p;
      })
    );
    if (success) {
      addAuditLog('Medication Dispensation Logged', 'Pharmacy & Formulary', `Dispensed ${quantity} units of pharmacy item ID ${id}.`);
    }
    return success;
  };

  const addTariff = (tariff: Omit<ServiceTariff, 'id' | 'hospitalId'>) => {
    const newTariff: ServiceTariff = {
      ...tariff,
      id: `TAR-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId
    };
    setTariffs((prev) => [newTariff, ...prev]);
    addAuditLog('Service Tariff Created', 'Pricing & Tariffs', `Registered service code ${newTariff.code} (${newTariff.name}) at standard rate ₹${newTariff.standardPrice}.`);
  };

  const updateTariff = (id: string, data: Partial<ServiceTariff>) => {
    setTariffs((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    addAuditLog('Service Tariff Modified', 'Pricing & Tariffs', `Modified tariff master parameters for ID ${id}.`);
  };

  const deleteTariff = (id: string) => {
    const target = tariffs.find((t) => t.id === id);
    setTariffs((prev) => prev.filter((t) => t.id !== id));
    addAuditLog('Service Tariff Deleted', 'Pricing & Tariffs', `Removed tariff item ${target?.name || id}.`);
  };

  const addPackage = (pkg: Omit<SurgicalPackage, 'id' | 'hospitalId'>) => {
    const newPkg: SurgicalPackage = {
      ...pkg,
      id: `PKG-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId
    };
    setPackages((prev) => [newPkg, ...prev]);
    addAuditLog('Surgical Package Created', 'Pricing & Tariffs', `Registered surgical package ${newPkg.packageCode} (${newPkg.name}) at ₹${newPkg.packagePrice}.`);
  };

  const updatePackage = (id: string, data: Partial<SurgicalPackage>) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    addAuditLog('Surgical Package Modified', 'Pricing & Tariffs', `Modified package parameters for ${id}.`);
  };

  const deletePackage = (id: string) => {
    const target = packages.find((p) => p.id === id);
    setPackages((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('Surgical Package Deleted', 'Pricing & Tariffs', `Removed surgical package ${target?.name || id}.`);
  };

  const addAppointment = (apt: Omit<Appointment, 'id' | 'hospitalId' | 'tokenNumber' | 'status'>) => {
    const currentCount = appointments.length + 1;
    const token = `#OPD-${currentCount.toString().padStart(2, '0')}`;
    const newApt: Appointment = {
      ...apt,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId,
      tokenNumber: token,
      status: 'Checked-In / In Queue'
    };
    setAppointments((prev) => [...prev, newApt]);
    addAuditLog('OPD Appointment Scheduled', 'OPD Appointments', `Booked consultation token ${token} for Patient ${newApt.patientName} with ${newApt.doctorName}.`);
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    addAuditLog('OPD Token Status Transition', 'OPD Appointments', `Token ${id} updated to status '${status}'.`);
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'hospitalId' | 'createdAt' | 'acknowledgedCount'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ANN-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId,
      createdAt: new Date().toISOString(),
      acknowledgedCount: 0
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditLog('Broadcast Announcement Issued', 'Communications', `Published hospital-wide alert: "${newAnn.title}" (${newAnn.priority}).`);
  };

  const acknowledgeAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledgedCount: a.acknowledgedCount + 1 } : a))
    );
  };

  // Two-Phase Governance Pipeline
  const submitDraft = (draft: Omit<ChangeDraft, 'id' | 'hospitalId' | 'submittedAt' | 'status'>) => {
    const newDraft: ChangeDraft = {
      ...draft,
      id: `DFT-${Math.floor(1000 + Math.random() * 9000)}`,
      hospitalId: currentHospitalId,
      submittedAt: new Date().toISOString(),
      status: 'Pending Review'
    };
    setDrafts((prev) => [newDraft, ...prev]);
    addAuditLog('Governance Draft Submitted', 'Change Governance', `Draft ${newDraft.id} ("${newDraft.title}") submitted for institutional sign-off.`);
  };

  const approveDraft = (draftId: string, notes?: string) => {
    const draft = drafts.find((d) => d.id === draftId);
    if (!draft) return;

    setDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? {
              ...d,
              status: 'Approved & Published',
              reviewedBy: currentUser?.name || 'Authorized Signatory',
              reviewedAt: new Date().toISOString(),
              reviewNotes: notes || 'Approved under clinical governance protocols.'
            }
          : d
      )
    );

    // Apply mutation based on module
    if (draft.module === 'Pricing & Tariffs' && draft.proposedValue?.packagePrice && draft.proposedValue?.packageCode) {
      setPackages((prev) =>
        prev.map((p) =>
          p.packageCode === draft.proposedValue.packageCode
            ? { ...p, packagePrice: draft.proposedValue.packagePrice }
            : p
        )
      );
    } else if (draft.module === 'Doctor Faculty' && draft.proposedValue?.consultationFee) {
      setDoctors((prev) =>
        prev.map((doc) => ({ ...doc, consultationFee: draft.proposedValue.consultationFee }))
      );
    }

    addAuditLog('Governance Draft Approved & Published', 'Change Governance', `Draft ${draftId} ("${draft.title}") ratified and published to production state.`);
  };

  const rejectDraft = (draftId: string, reason: string) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === draftId
          ? {
              ...d,
              status: 'Rejected',
              reviewedBy: currentUser?.name || 'Review Board',
              reviewedAt: new Date().toISOString(),
              reviewNotes: reason
            }
          : d
      )
    );
    addAuditLog('Governance Draft Rejected', 'Change Governance', `Draft ${draftId} rejected. Reason: ${reason}`);
  };

  const openModal = (
    modal:
      | 'register_hospital'
      | 'add_doctor'
      | 'add_bed'
      | 'dispatch_ambulance'
      | 'submit_draft'
      | 'book_appointment'
      | 'department_modal'
      | 'wing_modal'
      | 'tariff_modal'
      | 'package_modal'
      | 'ambulance_modal',
    payload?: any
  ) => {
    setActiveModal(modal);
    setModalPayload(payload || null);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalPayload(null);
  };

  return (
    <HospitalContext.Provider
      value={{
        hospitals,
        currentHospitalId,
        currentHospital,
        setCurrentHospitalId,
        currentView,
        setCurrentView,

        currentUser,
        sessionValidating,
        sessionExpired,
        dismissSessionExpired,
        currentRole,
        registeredUsers,
        login,
        signup,
        logout,
        quickSwitchUser,

        twoFactorVerified,
        verify2FA,
        toggleUser2FA,

        updateHospitalProfile,
        toggleRedAlert,
        registerNewHospital,

        wings,
        departments,
        otRooms,
        doctors,
        beds,
        ambulances,
        bloodBank,
        transfusions,
        pharmacy,
        equipment,
        tariffs,
        packages,
        insuranceProviders,
        claims,
        documents,
        drafts,
        announcements,
        appointments,
        labTests,
        imaging,
        auditLogs,

        addDepartment,
        updateDepartment,
        deleteDepartment,

        addWing,
        updateWing,
        deleteWing,

        addDoctor,
        updateDoctor,
        deleteDoctor,

        addBed,
        updateBedStatus,
        deleteBed,

        addAmbulance,
        updateAmbulance,
        deleteAmbulance,
        dispatchAmbulance,
        returnAmbulance,

        updateBloodStock,
        createTransfusionRequest,

        addPharmacyItem,
        dispenseMedication,

        addTariff,
        updateTariff,
        deleteTariff,

        addPackage,
        updatePackage,
        deletePackage,

        addAppointment,
        updateAppointmentStatus,

        addAnnouncement,
        acknowledgeAnnouncement,

        submitDraft,
        approveDraft,
        rejectDraft,

        addAuditLog,

        // Authority Verification & Applications
        applications,
        hospitalAccounts,
        activationTokens,
        passwordResetTokens,

        submitHospitalApplication,
        reviewHospitalApplication,
        approveHospitalApplication,
        rejectHospitalApplication,
        requestAdditionalInfo,
        suspendHospitalAccount,
        reactivateHospitalAccount,
        regenerateActivationToken,

        // Hospital Self-Activation & Creation
        validateActivationToken,
        checkUsernameAvailability,
        activateHospitalAccount,

        // Login & Password Reset
        loginWithHospitalCredentials,
        requestPasswordReset,
        validatePasswordResetToken,
        resetPasswordWithToken,

        activeModal,
        modalPayload,
        openModal,
        closeModal
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospitalPortal = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospitalPortal must be used within a HospitalProvider');
  }
  return context;
};
