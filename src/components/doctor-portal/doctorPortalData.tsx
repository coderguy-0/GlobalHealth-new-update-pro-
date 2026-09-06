import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { createAuditEvent, AuditEventInput } from '../../core/audit';
import { DOCTOR_PERMISSIONS, Permission } from '../../core/portalRoles';

/* ============================================================================
   Doctor Portal — data model, seed data, mock service and workspace store.
   Everything is shaped like the server-side models in the Doctor Portal spec
   (Doctor, ProfessionalCredential, DoctorAffiliation, DoctorAvailability,
   Appointment, AuditEvent…). The service layer is intentionally async so a
   real backend can replace it without touching the UI.
   ========================================================================== */

export type VerificationStatus =
  | 'not_started'
  | 'pending'
  | 'under_review'
  | 'additional_info_required'
  | 'verified'
  | 'rejected'
  | 'suspended'
  | 'expired';

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no_show';
export type ConsultationType = 'in_person' | 'video' | 'teleconsultation' | 'follow_up';
export type AffiliationStatus = 'requested' | 'pending' | 'active' | 'suspended' | 'ended' | 'rejected';
export type CredentialStatus = 'verified' | 'pending_verification' | 'expiring_soon' | 'expired' | 'suspended';
export type PublicStatus = 'draft' | 'pending_review' | 'published' | 'changes_requested';
export type NoteStatus = 'draft' | 'signed' | 'amended' | 'voided' | 'archived';

export interface DoctorProfile {
  id: string;
  userId: string;
  displayName: string;
  fullName: string;
  professionalTitle: string;
  specialty: string;
  subSpecialties: string[];
  qualifications: string[];
  bio: string;
  languages: string[];
  yearsOfPractice: number;
  areasOfPractice: string[];
  profilePhoto?: string;
  workEmail: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'in_app';
  verificationStatus: VerificationStatus;
  verificationNextAction?: string;
  profileCompleteness: number;
  missingProfileFields: string[];
  publicStatus: PublicStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  id: string;
  doctorId: string;
  title: string;
  authority: string;
  registrationNumber: string;
  issuedAt: string;
  expiresAt?: string;
  status: CredentialStatus;
  verifiedAt?: string;
  documentName?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'medical_center' | 'specialist_office';
  address: string;
}

export interface Affiliation {
  id: string;
  facilityId: string;
  department: string;
  role: string;
  status: AffiliationStatus;
  verificationStatus: VerificationStatus;
  startedAt?: string;
  endedAt?: string;
}

export type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface AvailabilityRule {
  id: string;
  doctorId: string;
  facilityId: string;
  days: DayKey[];
  startTime: string;
  endTime: string;
  slotDurationMin: number;
  consultationModes: ConsultationType[];
  breakStart?: string;
  breakEnd?: string;
  status: 'draft' | 'active';
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityException {
  id: string;
  doctorId: string;
  facilityId: string;
  date: string;
  type: 'leave' | 'holiday' | 'custom';
  startTime?: string;
  endTime?: string;
  reason: string;
}

export interface Appointment {
  id: string;
  facilityId: string;
  facilityName: string;
  department: string;
  patientIdentifier: string;
  date: string;
  startTime: string;
  endTime: string;
  type: ConsultationType;
  status: AppointmentStatus;
  bookingSource: 'public' | 'portal' | 'facility';
  notes?: string;
}

export interface SecureMessageItem {
  fromMe: boolean;
  text: string;
  time: string;
}

export interface SecureMessage {
  id: string;
  senderName: string;
  subject: string;
  scope: 'clinical' | 'community';
  date: string;
  read: boolean;
  messages: SecureMessageItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Referral {
  id: string;
  doctorId: string;
  facilityId: string;
  patientIdentifier: string;
  specialty: string;
  reason: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined' | 'completed';
  date: string;
}

export interface PortalDocument {
  id: string;
  doctorId: string;
  facilityId: string;
  name: string;
  kind: 'private' | 'credential';
  sizeKB: number;
  uploadedAt: string;
  version: number;
  private: boolean;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  resource: string;
  ip: string;
  location: string;
  date: string;
  time: string;
  outcome: 'success' | 'denied' | 'blocked';
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  signedInAt: string;
  lastActive: string;
  current: boolean;
}

export interface DelegatedAccess {
  id: string;
  email: string;
  scope: string;
  createdAt: string;
  status: 'pending' | 'active' | 'revoked';
}

export interface SupportTicket {
  id: string;
  subject: string;
  body: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
}

export interface SecurityState {
  mfaEnabled: boolean;
  recentLogins: { device: string; date: string; time: string; ip: string }[];
  connectedDevices: { id: string; deviceName: string; lastSeen: string; location: string }[];
  alerts: { id: string; title: string; message: string; severity: 'high' | 'medium'; date: string }[];
}

export const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  not_started: 'Not Started',
  pending: 'Pending',
  under_review: 'Under Review',
  additional_info_required: 'Additional Information Required',
  verified: 'Verified',
  rejected: 'Rejected',
  suspended: 'Suspended',
  expired: 'Expired',
};

export const CONSULTATION_LABEL: Record<ConsultationType, string> = {
  in_person: 'In-person',
  video: 'Video',
  teleconsultation: 'Teleconsultation',
  follow_up: 'Follow-up',
};

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending Confirmation',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No-show',
};

export const SPECIALTIES = [
  'Cardiology', 'Interventional Cardiology', 'Neurology', 'Pediatric Neurology',
  'Gastroenterology', 'Nephrology', 'Pulmonology', 'Dermatology', 'Orthopedics',
  'Oncology', 'Pediatrics', 'General Medicine', 'Endocrinology', 'Obstetrics & Gynecology',
];

export const FACILITIES: Facility[] = [
  { id: 'fac-ghmc', name: 'GlobalHealth Medical Center', type: 'medical_center', address: '12 Wellness Avenue, New Delhi' },
  { id: 'fac-city', name: 'City Hospital', type: 'hospital', address: '4 Hospital Road, Delhi' },
  { id: 'fac-central', name: 'Central Clinic', type: 'clinic', address: '88 Market Lane, Noida' },
  { id: 'fac-practice', name: 'Nair Private Practice', type: 'specialist_office', address: '22 Care Street, Gurugram' },
];

export const APPOINTMENT_DURATIONS = [15, 20, 30, 45, 60];

/* ------------------------------------------------------------------ */
/* Seed data                                                            */
/* ------------------------------------------------------------------ */

const todayISO = () => new Date().toISOString().slice(0, 10);
function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export { addDays };

export const seedDoctor: DoctorProfile = {
  id: 'doc-1001',
  userId: 'usr-doc-1001',
  displayName: 'Dr. Priya Nair',
  fullName: 'Dr. Priya Nair',
  professionalTitle: 'Consultant Cardiologist',
  specialty: 'Cardiology',
  subSpecialties: ['Interventional Cardiology'],
  qualifications: ['MBBS', 'MD (Medicine)', 'DM (Cardiology)'],
  bio: 'Consultant cardiologist with 12 years of experience in preventive cardiology, echocardiography and interventional care. Committed to clear, patient-first communication and evidence-based practice.',
  languages: ['English', 'Hindi', 'Malayalam'],
  yearsOfPractice: 12,
  areasOfPractice: ['Hypertension', 'Heart Failure', 'Preventive Cardiology'],
  workEmail: 'priya.nair@example.com',
  phone: '+91 98100 12345',
  preferredContact: 'email',
  verificationStatus: 'verified',
  // Honest completeness: 5 of 6 tracked fields complete (photo missing).
  profileCompleteness: 83,
  missingProfileFields: ['Add profile photograph'],
  publicStatus: 'published',
  createdAt: '2025-11-02T09:00:00Z',
  updatedAt: '2026-08-24T10:30:00Z',
};

export const seedCredentials: Credential[] = [
  { id: 'cred-1', doctorId: 'doc-1001', title: 'MBBS', authority: 'All India Institute of Medical Sciences', registrationNumber: 'AIIMS-1172', issuedAt: '2010-06-01', status: 'verified', verifiedAt: '2025-11-05' },
  { id: 'cred-2', doctorId: 'doc-1001', title: 'MD (Medicine)', authority: 'Maulana Azad Medical College', registrationNumber: 'MAMC-3391', issuedAt: '2014-05-15', status: 'verified', verifiedAt: '2025-11-05' },
  { id: 'cred-3', doctorId: 'doc-1001', title: 'DM (Cardiology)', authority: 'Sree Chitra Tirunal Institute', registrationNumber: 'SCT-8820', issuedAt: '2017-07-10', status: 'verified', verifiedAt: '2025-11-06' },
  {
    id: 'cred-4', doctorId: 'doc-1001', title: 'Medical License — Delhi Medical Council', authority: 'Delhi Medical Council',
    registrationNumber: 'DMC-48291', issuedAt: '2024-01-15', expiresAt: addDays(todayISO(), 20), status: 'expiring_soon',
    verifiedAt: '2025-11-06', documentName: 'DMC License 2024.pdf',
  },
  { id: 'cred-5', doctorId: 'doc-1001', title: 'Board Certification — Cardiology', authority: 'National Board of Examinations', registrationNumber: 'NBE-2210', issuedAt: '2019-03-20', status: 'verified', verifiedAt: '2025-11-07' },
];

export const seedAffiliations: Affiliation[] = [
  { id: 'aff-1', facilityId: 'fac-ghmc', department: 'Cardiology', role: 'Consultant', status: 'active', verificationStatus: 'verified', startedAt: '2024-02-01' },
  { id: 'aff-2', facilityId: 'fac-city', department: 'Cardiology', role: 'Visiting Consultant', status: 'active', verificationStatus: 'verified', startedAt: '2025-01-10' },
  { id: 'aff-3', facilityId: 'fac-central', department: 'Cardiology Clinic', role: 'Consultant', status: 'requested', verificationStatus: 'pending' },
];

export const seedAvailability: AvailabilityRule[] = [
  { id: 'av-1', doctorId: 'doc-1001', facilityId: 'fac-ghmc', days: ['monday'], startTime: '09:00', endTime: '13:00', slotDurationMin: 30, consultationModes: ['in_person'], status: 'active', createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z' },
  { id: 'av-2', doctorId: 'doc-1001', facilityId: 'fac-ghmc', days: ['monday'], startTime: '14:00', endTime: '17:00', slotDurationMin: 30, consultationModes: ['in_person', 'follow_up'], status: 'active', createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z' },
  { id: 'av-3', doctorId: 'doc-1001', facilityId: 'fac-ghmc', days: ['wednesday'], startTime: '09:00', endTime: '13:00', slotDurationMin: 30, consultationModes: ['in_person'], status: 'active', createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z' },
  { id: 'av-4', doctorId: 'doc-1001', facilityId: 'fac-city', days: ['tuesday'], startTime: '16:00', endTime: '20:00', slotDurationMin: 20, consultationModes: ['video'], status: 'active', createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z' },
  { id: 'av-5', doctorId: 'doc-1001', facilityId: 'fac-city', days: ['thursday'], startTime: '16:00', endTime: '19:00', slotDurationMin: 20, consultationModes: ['teleconsultation'], status: 'active', createdAt: '2026-06-01T09:00:00Z', updatedAt: '2026-06-01T09:00:00Z' },
];

export const seedExceptions: AvailabilityException[] = [
  { id: 'ex-1', doctorId: 'doc-1001', facilityId: 'fac-ghmc', date: '2026-09-15', type: 'leave', startTime: '09:00', endTime: '17:00', reason: 'Personal leave' },
  { id: 'ex-2', doctorId: 'doc-1001', facilityId: 'fac-city', date: '2026-10-02', type: 'holiday', reason: 'Public holiday' },
];

export const seedAppointments: Appointment[] = [
  { id: 'apt-1', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1083', date: todayISO(), startTime: '10:30', endTime: '11:00', type: 'in_person', status: 'confirmed', bookingSource: 'public', notes: 'Routine cardiac review — brings latest reports.' },
  { id: 'apt-2', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-0912', date: todayISO(), startTime: '11:30', endTime: '12:00', type: 'follow_up', status: 'confirmed', bookingSource: 'portal' },
  { id: 'apt-3', facilityId: 'fac-city', facilityName: 'City Hospital', department: 'Cardiology', patientIdentifier: 'P-1277', date: todayISO(), startTime: '17:00', endTime: '17:20', type: 'video', status: 'pending', bookingSource: 'public' },
  { id: 'apt-4', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-0764', date: todayISO(), startTime: '09:15', endTime: '09:45', type: 'in_person', status: 'completed', bookingSource: 'portal' },
  { id: 'apt-5', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1150', date: todayISO(), startTime: '12:15', endTime: '12:45', type: 'in_person', status: 'cancelled', bookingSource: 'public' },
  { id: 'apt-6', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1301', date: todayISO(), startTime: '15:30', endTime: '16:00', type: 'teleconsultation', status: 'no_show', bookingSource: 'public' },
  { id: 'apt-7', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1402', date: addDays(todayISO(), 1), startTime: '10:00', endTime: '10:30', type: 'in_person', status: 'confirmed', bookingSource: 'public' },
  { id: 'apt-8', facilityId: 'fac-city', facilityName: 'City Hospital', department: 'Cardiology', patientIdentifier: 'P-1420', date: addDays(todayISO(), 2), startTime: '17:30', endTime: '17:50', type: 'video', status: 'confirmed', bookingSource: 'public' },
  { id: 'apt-9', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-0999', date: addDays(todayISO(), 3), startTime: '11:00', endTime: '11:30', type: 'follow_up', status: 'pending', bookingSource: 'portal' },
  { id: 'apt-10', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-0888', date: addDays(todayISO(), 5), startTime: '09:30', endTime: '10:00', type: 'in_person', status: 'confirmed', bookingSource: 'facility' },
  { id: 'apt-11', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1212', date: addDays(todayISO(), -2), startTime: '10:00', endTime: '10:30', type: 'in_person', status: 'completed', bookingSource: 'public' },
  { id: 'apt-12', facilityId: 'fac-city', facilityName: 'City Hospital', department: 'Cardiology', patientIdentifier: 'P-1345', date: addDays(todayISO(), -1), startTime: '18:00', endTime: '18:20', type: 'video', status: 'completed', bookingSource: 'public' },
];

export const seedMessages: SecureMessage[] = [
  {
    id: 'msg-1', senderName: 'Facility — GlobalHealth Medical Center', subject: 'Appointment update · P-1083', scope: 'clinical',
    date: '2026-08-30', read: false,
    messages: [
      { fromMe: false, text: 'Patient P-1083 confirmed the 10:30 appointment and uploaded a recent ECG.', time: '08:10' },
    ],
  },
  {
    id: 'msg-2', senderName: 'Central Clinic (Affiliations)', subject: 'Affiliation request received', scope: 'community',
    date: '2026-08-28', read: true,
    messages: [
      { fromMe: false, text: 'Your affiliation request with Central Clinic — Cardiology Clinic has been received and is under review.', time: '14:00' },
    ],
  },
  {
    id: 'msg-3', senderName: 'City Hospital — Scheduling Desk', subject: 'Thursday evening video slots', scope: 'community',
    date: '2026-08-27', read: true,
    messages: [
      { fromMe: false, text: 'Video consultation slot availability updated for Thursday evenings.', time: '09:30' },
      { fromMe: true, text: 'Thanks — confirming the 20-minute slots work for us.', time: '09:45' },
    ],
  },
];

export const seedNotifications: NotificationItem[] = [
  { id: 'ntf-1', title: 'Credential renewal reminder', message: 'Your license renewal window opens soon — see Credentials.', date: '2026-08-30', read: false },
  { id: 'ntf-2', title: 'New appointment update', message: 'One appointment changed today. Review your schedule.', date: '2026-08-30', read: false },
  { id: 'ntf-3', title: 'Affiliation under review', message: 'Central Clinic is reviewing your affiliation request.', date: '2026-08-28', read: true },
  { id: 'ntf-4', title: 'New secure message', message: 'You have 1 unread secure message.', date: '2026-08-28', read: true },
];

export const seedReferrals: Referral[] = [
  { id: 'ref-1', doctorId: 'doc-1001', facilityId: 'fac-ghmc', patientIdentifier: 'P-1083', specialty: 'Endocrinology', reason: 'Diabetic dyslipidemia — needs combined metabolic review.', status: 'sent', date: '2026-08-25' },
  { id: 'ref-2', doctorId: 'doc-1001', facilityId: 'fac-city', patientIdentifier: 'P-0912', specialty: 'Neurology', reason: 'Recurrent episodes of vertigo — vestibular assessment.', status: 'accepted', date: '2026-08-20' },
  { id: 'ref-3', doctorId: 'doc-1001', facilityId: 'fac-ghmc', patientIdentifier: 'P-1402', specialty: 'Pulmonology', reason: 'Chronic cough with suspected asthma — lung function review.', status: 'completed', date: '2026-08-14' },
];

export const seedDocuments: PortalDocument[] = [
  { id: 'doc-1', doctorId: 'doc-1001', facilityId: 'fac-ghmc', name: 'DMC License 2024.pdf', kind: 'credential', sizeKB: 412, uploadedAt: '2026-01-10', version: 1, private: true },
  { id: 'doc-2', doctorId: 'doc-1001', facilityId: 'fac-ghmc', name: 'DM Cardiology Certificate.pdf', kind: 'credential', sizeKB: 890, uploadedAt: '2025-12-05', version: 1, private: true },
  { id: 'doc-3', doctorId: 'doc-1001', facilityId: 'fac-ghmc', name: 'CME Conference Certificate.pdf', kind: 'private', sizeKB: 655, uploadedAt: '2026-07-20', version: 2, private: true },
];

export const seedAudit: AuditEvent[] = [
  { id: 'aud-1', actor: 'Dr. Priya Nair', action: 'LOGIN', resource: 'session', ip: '103.21.58.12', location: 'New Delhi, IN', date: '2026-08-30', time: '08:05', outcome: 'success' },
  { id: 'aud-2', actor: 'Dr. Priya Nair', action: 'APPOINTMENT_VIEW', resource: 'apt-1', ip: '103.21.58.12', location: 'New Delhi, IN', date: '2026-08-30', time: '08:06', outcome: 'success' },
  { id: 'aud-3', actor: 'System', action: 'AFFILIATION_STATUS_CHANGE', resource: 'aff-3', ip: '—', location: 'GlobalHealth platform', date: '2026-08-28', time: '15:20', outcome: 'success' },
  { id: 'aud-4', actor: 'Dr. Priya Nair', action: 'AVAILABILITY_UPDATE', resource: 'av-4', ip: '103.21.58.12', location: 'New Delhi, IN', date: '2026-08-27', time: '18:40', outcome: 'success' },
  { id: 'aud-5', actor: 'Unknown', action: 'LOGIN', resource: 'session', ip: '45.129.2.200', location: 'Unknown region', date: '2026-08-26', time: '02:14', outcome: 'denied' },
  { id: 'aud-6', actor: 'Dr. Priya Nair', action: 'DOCUMENT_VIEW', resource: 'doc-1', ip: '103.21.58.12', location: 'New Delhi, IN', date: '2026-08-25', time: '12:02', outcome: 'success' },
  { id: 'aud-7', actor: 'System', action: 'CREDENTIAL_EXPIRY_CHECK', resource: 'cred-4', ip: '—', location: 'GlobalHealth platform', date: '2026-08-24', time: '00:00', outcome: 'success' },
  { id: 'aud-8', actor: 'Dr. Priya Nair', action: 'REFERRAL_SENT', resource: 'ref-1', ip: '103.21.58.12', location: 'New Delhi, IN', date: '2026-08-25', time: '09:15', outcome: 'success' },
];

export const seedSessions: Session[] = [
  { id: 'sess-3321', device: 'MacBook Pro', browser: 'Chrome 128', location: 'New Delhi, IN', ip: '103.21.58.12', signedInAt: '2026-08-30 08:05', lastActive: 'now', current: true },
  { id: 'sess-3188', device: 'iPhone 15', browser: 'Safari 18', location: 'New Delhi, IN', ip: '103.21.58.12', signedInAt: '2026-08-28 19:12', lastActive: '2026-08-28 20:40', current: false },
];

export const seedDelegatedAccess: DelegatedAccess[] = [
  { id: 'del-1', email: 'scheduling@ghmc.example.com', scope: 'schedule', createdAt: '2026-08-01', status: 'active' },
];

export const seedTickets: SupportTicket[] = [
  { id: 'tkt-1', subject: 'Video slots appear duplicated at City Hospital', body: 'Thursday video slots show twice in the booking view.', status: 'answered', createdAt: '2026-08-26' },
];

export const seedSecurity: SecurityState = {
  mfaEnabled: false,
  recentLogins: [
    { device: 'MacBook Pro · Chrome 128', date: '2026-08-30', time: '08:05', ip: '103.21.58.12' },
    { device: 'iPhone 15 · Safari 18', date: '2026-08-28', time: '19:12', ip: '103.21.58.12' },
    { device: 'MacBook Pro · Chrome 127', date: '2026-08-24', time: '09:40', ip: '103.21.58.12' },
  ],
  connectedDevices: [
    { id: 'dev-1', deviceName: 'MacBook Pro (this device)', lastSeen: 'now', location: 'New Delhi, IN' },
    { id: 'dev-2', deviceName: 'iPhone 15', lastSeen: 'Aug 28, 2026', location: 'New Delhi, IN' },
  ],
  alerts: [
    { id: 'alert-1', title: 'Unusual sign-in attempt blocked', message: 'A login from an unknown region was blocked and logged.', severity: 'medium', date: '2026-08-26' },
  ],
};

export const seedNotificationPrefs: Record<string, boolean> = {
  appointments: true,
  schedule_changes: true,
  credential_alerts: true,
  messages: true,
  security_alerts: true,
  marketing: false,
};

/* ------------------------------------------------------------------ */
/* Mock service — replaceable by a real backend                        */
/* ------------------------------------------------------------------ */

const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));

export const doctorPortalApi = {
  async login(identifier: string, password: string) {
    await wait();
    if (identifier.trim().toLowerCase() === 'priya.nair@example.com' && password.length >= 8) {
      return { success: true as const, doctor: seedDoctor };
    }
    if (identifier.trim() && password.length >= 8) {
      // Any other well-formed credentials create a fresh (unverified) doctor.
      const fresh: DoctorProfile = {
        ...seedDoctor,
        id: `doc-${Date.now()}`,
        userId: `usr-doc-${Date.now()}`,
        displayName: 'Dr. New Physician',
        fullName: 'Dr. New Physician',
        professionalTitle: 'Consultant',
        specialty: 'General Medicine',
        subSpecialties: [],
        qualifications: [],
        bio: '',
        languages: [],
        yearsOfPractice: 0,
        areasOfPractice: [],
        phone: '',
        workEmail: identifier.trim(),
        verificationStatus: 'not_started',
        profileCompleteness: 0,
        missingProfileFields: ['Complete professional information', 'Submit credentials', 'Add affiliations', 'Configure availability'],
        publicStatus: 'draft',
      };
      return { success: true as const, doctor: fresh };
    }
    return { success: false as const, error: 'Unable to sign in with those credentials.' };
  },

  async signup() {
    await wait();
    return { success: true as const, doctor: null as null, verificationRequired: true };
  },

  async verify(_code: string) {
    await wait();
    // Local verification is intentionally non-authoritative. The server-side
    // verification flow must confirm any real activation; this guard prevents
    // a universal/demo code from ever completing a client-side sign-up.
    return { success: false as const, error: 'This sign-up must be completed through the server-verified activation flow.' };
  },

  async forgot() {
    await wait();
    return { success: true as const };
  },

  async reset() {
    await wait();
    return { success: true as const };
  },
};

/* ------------------------------------------------------------------ */
/* Workspace store (context)                                           */
/* ------------------------------------------------------------------ */

export type WorkspaceView =
  | 'dashboard' | 'calendar' | 'availability' | 'appointments'
  | 'profile' | 'credentials' | 'affiliations'
  | 'patients' | 'consultations' | 'prescriptions' | 'labs' | 'imaging' | 'billing'
  | 'messages' | 'notifications' | 'referrals' | 'documents'
  | 'security' | 'sessions' | 'delegated' | 'audit'
  | 'insights' | 'help' | 'support';

interface DoctorPortalState {
  doctor: DoctorProfile;
  /** Phase 0 RBAC — the Doctor Portal always acts as the DOCTOR role. */
  actorRole: 'DOCTOR';
  /** The permission set granted to the current role. */
  permissions: Permission[];
  activeFacilityId: string;
  credentials: Credential[];
  affiliations: Affiliation[];
  availability: AvailabilityRule[];
  exceptions: AvailabilityException[];
  appointments: Appointment[];
  messages: SecureMessage[];
  notifications: NotificationItem[];
  referrals: Referral[];
  documents: PortalDocument[];
  auditEvents: AuditEvent[];
  sessions: Session[];
  delegated: DelegatedAccess[];
  tickets: SupportTicket[];
  security: SecurityState;
  notificationPrefs: Record<string, boolean>;
  setDoctor: (d: DoctorProfile) => void;
  setActiveFacility: (id: string) => void;
  updateProfile: (patch: Partial<DoctorProfile>) => void;
  updateVerificationStatus: (status: VerificationStatus) => void;
  addCredential: (c: Omit<Credential, 'id' | 'doctorId' | 'verifiedAt' | 'status'> & { status?: CredentialStatus }) => void;
  setAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addReferral: (r: Omit<Referral, 'id'>) => void;
  requestAffiliation: (facilityId: string, department: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleNotificationPref: (key: string) => void;
  sendMessage: (threadId: string, text: string) => void;
  markMessageRead: (id: string) => void;
  addDocument: (d: PortalDocument) => void;
  addAvailabilityRule: (r: AvailabilityRule) => void;
  removeAvailabilityRule: (id: string) => void;
  addAvailabilityException: (e: AvailabilityException) => void;
  removeAvailabilityException: (id: string) => void;
  setMfaEnabled: (enabled: boolean) => void;
  revokeSession: (id: string) => void;
  addDelegatedAccess: (d: Omit<DelegatedAccess, 'id' | 'createdAt' | 'status'>) => void;
  revokeDelegatedAccess: (id: string) => void;
  addTicket: (t: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
  addAuditEvent: (event: AuditEventInput) => void;
}

const DoctorPortalContext = createContext<DoctorPortalState | null>(null);

export const useDoctorPortal = (): DoctorPortalState => {
  const ctx = useContext(DoctorPortalContext);
  if (!ctx) throw new Error('useDoctorPortal must be used within DoctorPortalProvider');
  return ctx;
};

export const DoctorPortalProvider: React.FC<{ children: React.ReactNode; initialDoctor: DoctorProfile }> = ({ children, initialDoctor }) => {
  const [doctor, setDoctor] = useState<DoctorProfile>(initialDoctor);
  const [activeFacilityId, setActiveFacility] = useState('fac-ghmc');
  const [credentials, setCredentials] = useState<Credential[]>(seedCredentials);
  const [affiliations, setAffiliations] = useState<Affiliation[]>(seedAffiliations);
  const [availability, setAvailability] = useState<AvailabilityRule[]>(seedAvailability);
  const [exceptions, setExceptions] = useState<AvailabilityException[]>(seedExceptions);
  const [appointments, setAppointments] = useState<Appointment[]>(seedAppointments);
  const [messages, setMessages] = useState<SecureMessage[]>(seedMessages);
  const [notifications, setNotifications] = useState<NotificationItem[]>(seedNotifications);
  const [referrals, setReferrals] = useState<Referral[]>(seedReferrals);
  const [documents, setDocuments] = useState<PortalDocument[]>(seedDocuments);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(seedAudit);
  const [sessions, setSessions] = useState<Session[]>(seedSessions);
  const [delegated, setDelegated] = useState<DelegatedAccess[]>(seedDelegatedAccess);
  const [tickets, setTickets] = useState<SupportTicket[]>(seedTickets);
  const [security, setSecurity] = useState<SecurityState>(seedSecurity);
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>(seedNotificationPrefs);

  const updateProfile = useCallback((patch: Partial<DoctorProfile>) => {
    setDoctor((prev) => {
      const next = { ...prev, ...patch, updatedAt: new Date().toISOString() };
      // Honest completeness: computed from what is actually missing.
      const missing: string[] = [];
      if (!next.bio.trim()) missing.push('Add professional biography');
      if (!next.profilePhoto) missing.push('Add profile photograph');
      if (!next.languages.length) missing.push('Add languages');
      if (!next.yearsOfPractice) missing.push('Add years of practice');
      if (!next.qualifications.length) missing.push('Add qualifications');
      if (next.verificationStatus === 'not_started') missing.push('Complete professional verification');
      const total = 6;
      const done = total - missing.length;
      next.profileCompleteness = Math.min(100, Math.round((done / total) * 100));
      next.missingProfileFields = missing;
      return next;
    });
  }, []);

  const updateVerificationStatus = useCallback((status: VerificationStatus) => {
    setDoctor((prev) => ({ ...prev, verificationStatus: status, updatedAt: new Date().toISOString() }));
  }, []);

  const addCredential: DoctorPortalState['addCredential'] = useCallback((c) => {
    setCredentials((prev) => [
      ...prev,
      {
        id: `cred-${Date.now()}`,
        doctorId: doctor.id,
        title: c.title,
        authority: c.authority,
        registrationNumber: c.registrationNumber,
        issuedAt: c.issuedAt || new Date().toISOString().slice(0, 10),
        expiresAt: c.expiresAt,
        status: c.status || 'pending_verification',
        documentName: c.documentName,
      },
    ]);
  }, [doctor.id]);

  const setAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const addReferral = useCallback((r: Omit<Referral, 'id'>) => {
    setReferrals((prev) => [{ ...r, id: `ref-${Date.now()}` }, ...prev]);
  }, []);

  const requestAffiliation = useCallback((facilityId: string, department: string) => {
    setAffiliations((prev) => [
      ...prev,
      { id: `aff-${Date.now()}`, facilityId, department, role: 'Consultant', status: 'requested', verificationStatus: 'pending' },
    ]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const toggleNotificationPref = useCallback((key: string) => {
    setNotificationPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const sendMessage = useCallback((threadId: string, text: string) => {
    setMessages((prev) => prev.map((m) => (m.id === threadId ? { ...m, messages: [...m.messages, { fromMe: true, text, time: new Date().toTimeString().slice(0, 5) }] } : m)));
  }, []);

  const markMessageRead = useCallback((id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }, []);

  const addDocument = useCallback((d: PortalDocument) => {
    setDocuments((prev) => [d, ...prev]);
  }, []);

  const addAvailabilityRule = useCallback((r: AvailabilityRule) => {
    setAvailability((prev) => [...prev, r]);
  }, []);

  const removeAvailabilityRule = useCallback((id: string) => {
    setAvailability((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addAvailabilityException = useCallback((e: AvailabilityException) => {
    setExceptions((prev) => [...prev, e]);
  }, []);

  const removeAvailabilityException = useCallback((id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const setMfaEnabled = useCallback((enabled: boolean) => {
    setSecurity((prev) => ({ ...prev, mfaEnabled: enabled }));
  }, []);

  const revokeSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const addDelegatedAccess = useCallback((d: Omit<DelegatedAccess, 'id' | 'createdAt' | 'status'>) => {
    setDelegated((prev) => [...prev, { ...d, id: `del-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10), status: 'pending' }]);
  }, []);

  const revokeDelegatedAccess = useCallback((id: string) => {
    setDelegated((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'revoked' } : d)));
  }, []);

  const addTicket = useCallback((t: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    setTickets((prev) => [{ ...t, id: `tkt-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10), status: 'open' }, ...prev]);
  }, []);

  const addAuditEvent = useCallback((event: AuditEventInput) => {
    const ev = createAuditEvent(event);
    setAuditEvents((prev) => [
      {
        id: ev.id,
        actor: ev.actorRole || ev.actorId,
        action: ev.action,
        resource: ev.resourceId || '',
        ip: ev.ip || '—',
        location: ev.location || 'GlobalHealth platform',
        date: ev.timestamp.slice(0, 10),
        time: ev.timestamp.slice(11, 16),
        outcome: ev.outcome || 'success',
      },
      ...prev,
    ]);
  }, []);

  const value = useMemo<DoctorPortalState>(() => ({
    doctor,
    actorRole: 'DOCTOR',
    permissions: DOCTOR_PERMISSIONS,
    activeFacilityId, credentials, affiliations, availability, exceptions,
    appointments, messages, notifications, referrals, documents, auditEvents, sessions,
    delegated, tickets, security, notificationPrefs,
    setDoctor, setActiveFacility, updateProfile, updateVerificationStatus, addCredential,
    setAppointmentStatus, addReferral, requestAffiliation, markNotificationRead,
    markAllNotificationsRead, toggleNotificationPref, sendMessage, markMessageRead,
    addDocument, addAvailabilityRule, removeAvailabilityRule, addAvailabilityException,
    removeAvailabilityException, setMfaEnabled, revokeSession, addDelegatedAccess,
    revokeDelegatedAccess, addTicket, addAuditEvent,
  }), [doctor, activeFacilityId, credentials, affiliations, availability, exceptions,
    appointments, messages, notifications, referrals, documents, auditEvents, sessions,
    delegated, tickets, security, notificationPrefs,
    updateProfile, updateVerificationStatus, addCredential, setAppointmentStatus,
    addReferral, requestAffiliation, markNotificationRead, markAllNotificationsRead,
    toggleNotificationPref, sendMessage, markMessageRead, addDocument, addAvailabilityRule,
    removeAvailabilityRule, addAvailabilityException, removeAvailabilityException,
    setMfaEnabled, revokeSession, addDelegatedAccess, revokeDelegatedAccess, addTicket, addAuditEvent]);

  return <DoctorPortalContext.Provider value={value}>{children}</DoctorPortalContext.Provider>;
};
