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

export type AppointmentStatus =
  | 'requested'
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'waiting'
  | 'in_consultation'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'no_show'
  | 'rejected'
  | 'expired';
export type ConsultationType = 'in_person' | 'video' | 'teleconsultation' | 'follow_up' | 'walk_in' | 'procedure';
export type AppointmentPriority = 'routine' | 'urgent' | 'stat';
export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'refunded' | 'cancelled' | 'disputed';
export type NotificationCategory = 'clinical' | 'appointments' | 'communication' | 'administrative' | 'financial' | 'security';
export type NotificationPriority = 'critical' | 'high' | 'normal' | 'low';
export type TelemedicineSessionStatus = 'upcoming' | 'waiting' | 'live' | 'completed' | 'missed';
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
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  patientSex?: 'Male' | 'Female' | 'Other';
  date: string;
  startTime: string;
  endTime: string;
  type: ConsultationType;
  status: AppointmentStatus;
  bookingSource: 'public' | 'portal' | 'facility' | 'walk_in';
  notes?: string;
  reason?: string;
  paymentStatus?: PaymentStatus;
  consentStatus?: 'granted' | 'pending' | 'expired' | 'revoked' | 'denied' | 'not_required';
  telemedicine?: boolean;
  priority?: AppointmentPriority;
  assignedDoctor?: string;
  checkInStatus?: 'not_arrived' | 'checked_in' | 'called';
  token?: number;
  room?: string;
  encounterId?: string;
}

export interface SecureMessageItem {
  fromMe: boolean;
  text: string;
  time: string;
}

export type ConversationType = 'patient' | 'hospital' | 'staff' | 'doctor' | 'laboratory' | 'pharmacy' | 'care_team';

export interface SecureMessage {
  id: string;
  senderName: string;
  subject: string;
  scope: 'clinical' | 'community';
  conversationType?: ConversationType;
  patientId?: string;
  patientIdentifier?: string;
  date: string;
  read: boolean;
  pinned?: boolean;
  muted?: boolean;
  archived?: boolean;
  priority?: 'normal' | 'high';
  online?: boolean;
  messages: SecureMessageItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  time?: string;
  read: boolean;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  source?: string;
  patientIdentifier?: string;
  patientId?: string;
  actionLabel?: string;
  actionView?: WorkspaceView;
}

export interface TelemedicineSession {
  id: string;
  appointmentId: string;
  patientId: string;
  patientIdentifier: string;
  patientName: string;
  status: TelemedicineSessionStatus;
  scheduledAt: string;
  startTime: string;
  durationMin?: number;
  consentStatus: 'granted' | 'pending' | 'denied';
  connectionStatus: 'idle' | 'connecting' | 'connected' | 'poor' | 'ended';
  waitingSince?: string;
}

export type ReferralLoopStatus = 'draft' | 'sent' | 'accepted' | 'scheduled' | 'in_progress' | 'completed' | 'declined' | 'cancelled';

export interface Referral {
  id: string;
  doctorId: string;
  facilityId: string;
  patientIdentifier: string;
  patientId?: string;
  patientName?: string;
  specialty: string;
  reason: string;
  status: ReferralLoopStatus;
  date: string;
  receivingProvider?: string;
  receivingFacility?: string;
  urgency?: 'routine' | 'urgent' | 'stat';
  requestedService?: string;
  clinicalSummary?: string;
  appointmentDate?: string;
  specialistResponse?: string;
  attachments?: string[];
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
  walk_in: 'Walk-in',
  procedure: 'Procedure',
};

export const STATUS_LABEL: Record<AppointmentStatus, string> = {
  requested: 'Requested',
  pending: 'Pending Confirmation',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  waiting: 'Waiting',
  in_consultation: 'In Consultation',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
  no_show: 'No Show',
  rejected: 'Rejected',
  expired: 'Expired',
};

export const PRIORITY_LABEL: Record<AppointmentPriority, string> = {
  routine: 'Routine',
  urgent: 'Urgent',
  stat: 'STAT',
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  pending: 'Pending',
  authorized: 'Authorized',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
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
  { id: 'apt-1', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1083', patientId: 'pat-1083', patientName: 'John Smith', patientAge: 45, patientSex: 'Male', date: todayISO(), startTime: '10:30', endTime: '11:00', type: 'in_person', status: 'waiting', bookingSource: 'public', notes: 'Routine cardiac review — brings latest reports.', reason: 'Routine cardiac review', paymentStatus: 'paid', consentStatus: 'granted', telemedicine: false, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'checked_in', token: 18, room: 'Room 3' },
  { id: 'apt-2', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-0912', patientId: 'pat-0912', patientName: 'Aisha Khan', patientAge: 32, patientSex: 'Female', date: todayISO(), startTime: '11:30', endTime: '12:00', type: 'follow_up', status: 'checked_in', bookingSource: 'portal', reason: 'AF follow-up / anticoagulation', paymentStatus: 'pending', consentStatus: 'pending', telemedicine: false, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'checked_in', token: 19, room: 'Room 3' },
  { id: 'apt-3', facilityId: 'fac-city', facilityName: 'City Hospital', department: 'Cardiology', patientIdentifier: 'P-1277', patientId: 'pat-1277', patientName: 'Rahul Verma', patientAge: 57, patientSex: 'Male', date: todayISO(), startTime: '17:00', endTime: '17:20', type: 'video', status: 'waiting', bookingSource: 'public', reason: 'Chest pain evaluation', paymentStatus: 'authorized', consentStatus: 'granted', telemedicine: true, priority: 'stat', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'checked_in', token: 4 },
  { id: 'apt-4', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-0764', patientId: 'pat-0764', patientName: 'Meera Menon', patientAge: 39, patientSex: 'Female', date: todayISO(), startTime: '09:15', endTime: '09:45', type: 'in_person', status: 'completed', bookingSource: 'portal', reason: 'New patient consult', paymentStatus: 'paid', consentStatus: 'not_required', telemedicine: false, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'called', token: 12, room: 'Room 3', encounterId: 'ENC-2401' },
  { id: 'apt-5', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1150', patientId: 'pat-1150', patientName: 'Arjun Patel', patientAge: 68, patientSex: 'Male', date: todayISO(), startTime: '12:15', endTime: '12:45', type: 'in_person', status: 'cancelled', bookingSource: 'public', reason: 'Heart failure review', paymentStatus: 'refunded', consentStatus: 'granted', telemedicine: false, priority: 'urgent', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'not_arrived', token: 21 },
  { id: 'apt-6', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1301', patientName: 'Sanjay Rao', patientAge: 51, patientSex: 'Male', date: todayISO(), startTime: '15:30', endTime: '16:00', type: 'teleconsultation', status: 'no_show', bookingSource: 'public', reason: 'BP review', paymentStatus: 'pending', consentStatus: 'granted', telemedicine: true, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'not_arrived', token: 27 },
  { id: 'apt-13', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1083', patientId: 'pat-1083', patientName: 'John Smith', patientAge: 45, patientSex: 'Male', date: todayISO(), startTime: '09:00', endTime: '09:15', type: 'walk_in', status: 'in_consultation', bookingSource: 'walk_in', reason: 'Home BP spike', paymentStatus: 'paid', consentStatus: 'granted', telemedicine: false, priority: 'urgent', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'called', token: 14, room: 'Room 3', encounterId: 'ENC-2410' },
  { id: 'apt-7', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1402', patientName: 'Leela Iyer', patientAge: 44, patientSex: 'Female', date: addDays(todayISO(), 1), startTime: '10:00', endTime: '10:30', type: 'in_person', status: 'confirmed', bookingSource: 'public', reason: 'Post-referral review', paymentStatus: 'pending', consentStatus: 'granted', telemedicine: false, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'not_arrived' },
  { id: 'apt-8', facilityId: 'fac-city', facilityName: 'City Hospital', department: 'Cardiology', patientIdentifier: 'P-1420', patientName: 'Omar Sheikh', patientAge: 61, patientSex: 'Male', date: addDays(todayISO(), 2), startTime: '17:30', endTime: '17:50', type: 'video', status: 'confirmed', bookingSource: 'public', reason: 'Telemedicine follow-up', paymentStatus: 'authorized', consentStatus: 'granted', telemedicine: true, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'not_arrived' },
  { id: 'apt-9', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-0999', patientName: 'Fatima Noor', patientAge: 29, patientSex: 'Female', date: addDays(todayISO(), 3), startTime: '11:00', endTime: '11:30', type: 'follow_up', status: 'requested', bookingSource: 'portal', reason: 'New patient request', paymentStatus: 'pending', consentStatus: 'pending', telemedicine: false, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'not_arrived' },
  { id: 'apt-10', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-0888', patientName: 'Vikram Das', patientAge: 54, patientSex: 'Male', date: addDays(todayISO(), 5), startTime: '09:30', endTime: '10:00', type: 'in_person', status: 'confirmed', bookingSource: 'facility', reason: 'Pre-procedure review', paymentStatus: 'paid', consentStatus: 'granted', telemedicine: false, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'not_arrived' },
  { id: 'apt-11', facilityId: 'fac-ghmc', facilityName: 'GlobalHealth Medical Center', department: 'Cardiology', patientIdentifier: 'P-1212', patientName: 'Anita Bose', patientAge: 47, patientSex: 'Female', date: addDays(todayISO(), -2), startTime: '10:00', endTime: '10:30', type: 'in_person', status: 'completed', bookingSource: 'public', reason: 'Hypertension review', paymentStatus: 'paid', consentStatus: 'granted', telemedicine: false, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'called', encounterId: 'ENC-2388' },
  { id: 'apt-12', facilityId: 'fac-city', facilityName: 'City Hospital', department: 'Cardiology', patientIdentifier: 'P-1345', patientName: 'Kiran Shah', patientAge: 63, patientSex: 'Male', date: addDays(todayISO(), -1), startTime: '18:00', endTime: '18:20', type: 'video', status: 'completed', bookingSource: 'public', reason: 'Video consult', paymentStatus: 'paid', consentStatus: 'granted', telemedicine: true, priority: 'routine', assignedDoctor: 'Dr. Priya Nair', checkInStatus: 'called', encounterId: 'ENC-2394' },
];

export const seedTelemedicine: TelemedicineSession[] = [
  { id: 'tm-1', appointmentId: 'apt-3', patientId: 'pat-1277', patientIdentifier: 'P-1277', patientName: 'Rahul Verma', status: 'waiting', scheduledAt: todayISO(), startTime: '17:00', consentStatus: 'granted', connectionStatus: 'idle', waitingSince: '16:48' },
  { id: 'tm-2', appointmentId: 'apt-8', patientId: 'pat-1420', patientIdentifier: 'P-1420', patientName: 'Omar Sheikh', status: 'upcoming', scheduledAt: addDays(todayISO(), 2), startTime: '17:30', consentStatus: 'granted', connectionStatus: 'idle' },
  { id: 'tm-3', appointmentId: 'apt-12', patientId: 'pat-1345', patientIdentifier: 'P-1345', patientName: 'Kiran Shah', status: 'completed', scheduledAt: addDays(todayISO(), -1), startTime: '18:00', durationMin: 18, consentStatus: 'granted', connectionStatus: 'ended' },
  { id: 'tm-4', appointmentId: 'apt-6', patientId: 'pat-1301', patientIdentifier: 'P-1301', patientName: 'Sanjay Rao', status: 'missed', scheduledAt: todayISO(), startTime: '15:30', consentStatus: 'granted', connectionStatus: 'ended' },
];

export const seedMessages: SecureMessage[] = [
  {
    id: 'msg-1', senderName: 'John Smith', subject: 'Home BP log · P-1083', scope: 'clinical',
    conversationType: 'patient', patientId: 'pat-1083', patientIdentifier: 'P-1083',
    date: todayISO(), read: false, pinned: true, priority: 'normal', online: false,
    messages: [
      { fromMe: false, text: 'Doctor, I uploaded this week’s home BP readings. Morning average is 128/82.', time: '08:10' },
      { fromMe: true, text: 'Received — we will review them together at 10:30.', time: '08:18' },
    ],
  },
  {
    id: 'msg-lab', senderName: 'GHMC Central Laboratory', subject: 'Critical result · Troponin I · P-1277', scope: 'clinical',
    conversationType: 'laboratory', patientId: 'pat-1277', patientIdentifier: 'P-1277',
    date: todayISO(), read: false, priority: 'high', online: true,
    messages: [
      { fromMe: false, text: 'Troponin I is available for Rahul Verma (P-1277). Flagged high. Please acknowledge review.', time: '17:06' },
    ],
  },
  {
    id: 'msg-pharm', senderName: 'Wellness Pharmacy', subject: 'Substitution query · RX-GH-29483', scope: 'clinical',
    conversationType: 'pharmacy', patientId: 'pat-1083', patientIdentifier: 'P-1083',
    date: '2026-09-02', read: false, priority: 'normal', online: true,
    messages: [
      { fromMe: false, text: 'Telmisartan 40 mg is short. May we dispense an equivalent ARB pending your confirmation?', time: '11:22' },
    ],
  },
  {
    id: 'msg-doc', senderName: 'Dr. Ananya Rao', subject: 'Endocrine opinion · P-1083', scope: 'clinical',
    conversationType: 'doctor', patientId: 'pat-1083', patientIdentifier: 'P-1083',
    date: '2026-08-26', read: true, priority: 'normal', online: false,
    messages: [
      { fromMe: false, text: 'Happy to see John Smith. HbA1c 7.1% — I will tighten metformin and review in 8 weeks.', time: '16:40' },
      { fromMe: true, text: 'Thank you. I have shared the lipid panel and current BP log.', time: '16:52' },
    ],
  },
  {
    id: 'msg-hosp', senderName: 'City Hospital — Scheduling Desk', subject: 'Thursday evening video slots', scope: 'community',
    conversationType: 'hospital', date: '2026-08-27', read: true, muted: true,
    messages: [
      { fromMe: false, text: 'Video consultation slot availability updated for Thursday evenings.', time: '09:30' },
      { fromMe: true, text: 'Thanks — confirming the 20-minute slots work for us.', time: '09:45' },
    ],
  },
  {
    id: 'msg-staff', senderName: 'Nurse Anjali', subject: 'Queue note · Token 18', scope: 'clinical',
    conversationType: 'staff', patientId: 'pat-1083', patientIdentifier: 'P-1083',
    date: todayISO(), read: true, online: true,
    messages: [
      { fromMe: false, text: 'John Smith is checked in, Room 3. ECG uploaded to the encounter.', time: '10:12' },
    ],
  },
  {
    id: 'msg-2', senderName: 'Central Clinic (Affiliations)', subject: 'Affiliation request received', scope: 'community',
    conversationType: 'hospital', date: '2026-08-28', read: true, archived: true,
    messages: [
      { fromMe: false, text: 'Your affiliation request with Central Clinic — Cardiology Clinic has been received and is under review.', time: '14:00' },
    ],
  },
];

export const seedNotifications: NotificationItem[] = [
  { id: 'ntf-1', title: 'Critical laboratory result', message: 'Troponin I is available for Rahul Verma (P-1277). Immediate review required.', date: todayISO(), time: '17:06', read: false, category: 'clinical', priority: 'critical', source: 'Laboratory', patientIdentifier: 'P-1277', patientId: 'pat-1277', actionLabel: 'Review Result', actionView: 'labs' },
  { id: 'ntf-2', title: 'Patient checked in', message: 'Token 18 — John Smith is waiting in Room 3.', date: todayISO(), time: '10:12', read: false, category: 'appointments', priority: 'high', source: 'Queue', patientIdentifier: 'P-1083', patientId: 'pat-1083', actionLabel: 'Open Queue', actionView: 'patients_appointments' },
  { id: 'ntf-3', title: 'Consent request pending', message: 'Aisha Khan has not yet approved electrophysiology record access.', date: todayISO(), time: '09:40', read: false, category: 'clinical', priority: 'high', source: 'Consent', patientIdentifier: 'P-0912', patientId: 'pat-0912', actionLabel: 'Open EHR', actionView: 'ehr' },
  { id: 'ntf-4', title: 'Telemedicine waiting room', message: 'Rahul Verma has entered the virtual waiting room.', date: todayISO(), time: '16:48', read: false, category: 'appointments', priority: 'high', source: 'Telemedicine', patientIdentifier: 'P-1277', patientId: 'pat-1277', actionLabel: 'Join Consultation', actionView: 'telemedicine' },
  { id: 'ntf-5', title: 'New appointment request', message: 'Fatima Noor requested a follow-up.', date: todayISO(), time: '08:22', read: false, category: 'appointments', priority: 'normal', source: 'Scheduling', actionLabel: 'Review Request', actionView: 'patients_appointments' },
  { id: 'ntf-6', title: 'Credential renewal reminder', message: 'Delhi Medical Council license expires in 20 days.', date: '2026-08-30', time: '08:00', read: false, category: 'administrative', priority: 'normal', source: 'Credentials', actionLabel: 'Open Credentials', actionView: 'profile' },
  { id: 'ntf-7', title: 'EHR modification request', message: 'A change you requested is awaiting patient approval.', date: '2026-08-30', time: '11:10', read: true, category: 'clinical', priority: 'normal', source: 'EHR', patientIdentifier: 'P-1083', actionView: 'ehr' },
  { id: 'ntf-8', title: 'Payment received', message: 'Consultation fee for Meera Menon has been paid.', date: todayISO(), time: '09:50', read: true, category: 'financial', priority: 'low', source: 'Billing', actionView: 'billing' },
  { id: 'ntf-9', title: 'Unusual sign-in attempt blocked', message: 'A login from an unknown region was blocked and logged.', date: '2026-08-26', time: '02:14', read: true, category: 'security', priority: 'high', source: 'Security', actionView: 'audit' },
  { id: 'ntf-10', title: 'New secure message', message: 'Facility sent an appointment update for P-1083.', date: '2026-08-30', time: '08:10', read: true, category: 'communication', priority: 'normal', source: 'Messages', actionView: 'messages' },
];

export const seedReferrals: Referral[] = [
  { id: 'ref-1', doctorId: 'doc-1001', facilityId: 'fac-ghmc', patientIdentifier: 'P-1083', patientId: 'pat-1083', patientName: 'John Smith', specialty: 'Endocrinology', reason: 'Diabetic dyslipidemia — needs combined metabolic review.', status: 'sent', date: '2026-08-25', receivingProvider: 'Dr. Ananya Rao', receivingFacility: 'Metabolic Clinic', urgency: 'routine', requestedService: 'Combined metabolic review', clinicalSummary: 'T2DM + hypertension on Telmisartan/Metformin. HbA1c 7.1%.', attachments: ['HbA1c', 'Lipid profile'] },
  { id: 'ref-2', doctorId: 'doc-1001', facilityId: 'fac-city', patientIdentifier: 'P-0912', patientId: 'pat-0912', patientName: 'Aisha Khan', specialty: 'Neurology', reason: 'Recurrent episodes of vertigo — vestibular assessment.', status: 'accepted', date: '2026-08-20', receivingProvider: 'Dr. Vivek Menon', receivingFacility: 'City Hospital Neurology', urgency: 'urgent', requestedService: 'Vestibular assessment', appointmentDate: addDays(todayISO(), 4), specialistResponse: 'Accepted — slot offered Thursday 11:00.' },
  { id: 'ref-4', doctorId: 'doc-1001', facilityId: 'fac-ghmc', patientIdentifier: 'P-1277', patientId: 'pat-1277', patientName: 'Rahul Verma', specialty: 'Interventional Cardiology', reason: 'Possible ACS — urgent cath opinion.', status: 'scheduled', date: todayISO(), receivingProvider: 'Cath Lab on-call', receivingFacility: 'GlobalHealth Medical Center', urgency: 'stat', requestedService: 'Urgent coronary assessment', appointmentDate: todayISO(), clinicalSummary: 'Chest pain, Troponin I high, lateral ST depression.', attachments: ['Troponin I', '12-Lead ECG'] },
  { id: 'ref-3', doctorId: 'doc-1001', facilityId: 'fac-ghmc', patientIdentifier: 'P-1402', patientName: 'Leela Iyer', specialty: 'Pulmonology', reason: 'Chronic cough with suspected asthma — lung function review.', status: 'completed', date: '2026-08-14', receivingProvider: 'Dr. Farah Qureshi', receivingFacility: 'City Pulmonology', urgency: 'routine', requestedService: 'Spirometry + consult', specialistResponse: 'Asthma confirmed. Inhaler started. Notes returned.' },
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
  | 'dashboard'
  | 'patients_appointments'
  | 'messages'
  | 'notifications'
  | 'ehr'
  | 'consultations'
  | 'prescriptions'
  | 'labs'
  | 'vitals'
  | 'referrals'
  | 'telemedicine'
  | 'profile'
  | 'billing'
  | 'ai'
  | 'schedule'
  | 'audit'
  | 'settings'
  /* legacy aliases kept so existing modules continue to compile */
  | 'calendar' | 'availability' | 'appointments' | 'patients'
  | 'credentials' | 'affiliations' | 'imaging' | 'documents'
  | 'security' | 'sessions' | 'delegated' | 'insights' | 'help' | 'support';

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
  telemedicineSessions: TelemedicineSession[];
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
  rescheduleAppointment: (id: string, date: string, startTime: string, endTime: string) => void;
  callNextPatient: () => Appointment | null;
  updateTelemedicineSession: (id: string, patch: Partial<TelemedicineSession>) => void;
  addReferral: (r: Omit<Referral, 'id'>) => void;
  updateReferral: (id: string, patch: Partial<Referral>) => void;
  patchMessage: (id: string, patch: Partial<SecureMessage>) => void;
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
  const [telemedicineSessions, setTelemedicineSessions] = useState<TelemedicineSession[]>(seedTelemedicine);
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
    setAppointments((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      const patch: Partial<Appointment> = { status };
      if (status === 'checked_in' || status === 'waiting') patch.checkInStatus = 'checked_in';
      if (status === 'in_consultation') patch.checkInStatus = 'called';
      return { ...a, ...patch };
    }));
  }, []);

  const rescheduleAppointment = useCallback((id: string, date: string, startTime: string, endTime: string) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, date, startTime, endTime, status: 'rescheduled' } : a)));
  }, []);

  const callNextPatient = useCallback((): Appointment | null => {
    const today = new Date().toISOString().slice(0, 10);
    let called: Appointment | null = null;
    setAppointments((prev) => {
      const waiting = prev
        .filter((a) => a.facilityId === activeFacilityId && a.date === today && (a.status === 'waiting' || a.status === 'checked_in'))
        .sort((a, b) => (a.token || 99) - (b.token || 99) || a.startTime.localeCompare(b.startTime));
      const next = waiting[0];
      if (!next) return prev;
      called = { ...next, status: 'in_consultation', checkInStatus: 'called' };
      return prev.map((a) => (a.id === next.id ? called! : a));
    });
    return called;
  }, [activeFacilityId]);

  const updateTelemedicineSession = useCallback((id: string, patch: Partial<TelemedicineSession>) => {
    setTelemedicineSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const addReferral = useCallback((r: Omit<Referral, 'id'>) => {
    setReferrals((prev) => [{ ...r, id: `ref-${Date.now()}` }, ...prev]);
  }, []);

  const updateReferral = useCallback((id: string, patch: Partial<Referral>) => {
    setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const patchMessage = useCallback((id: string, patch: Partial<SecureMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
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
    appointments, telemedicineSessions, messages, notifications, referrals, documents, auditEvents, sessions,
    delegated, tickets, security, notificationPrefs,
    setDoctor, setActiveFacility, updateProfile, updateVerificationStatus, addCredential,
    setAppointmentStatus, rescheduleAppointment, callNextPatient, updateTelemedicineSession, addReferral, updateReferral, patchMessage, requestAffiliation, markNotificationRead,
    markAllNotificationsRead, toggleNotificationPref, sendMessage, markMessageRead,
    addDocument, addAvailabilityRule, removeAvailabilityRule, addAvailabilityException,
    removeAvailabilityException, setMfaEnabled, revokeSession, addDelegatedAccess,
    revokeDelegatedAccess, addTicket, addAuditEvent,
  }), [doctor, activeFacilityId, credentials, affiliations, availability, exceptions,
    appointments, telemedicineSessions, messages, notifications, referrals, documents, auditEvents, sessions,
    delegated, tickets, security, notificationPrefs,
    updateProfile, updateVerificationStatus, addCredential, setAppointmentStatus, rescheduleAppointment, callNextPatient, updateTelemedicineSession,
    addReferral, updateReferral, patchMessage, requestAffiliation, markNotificationRead, markAllNotificationsRead,
    toggleNotificationPref, sendMessage, markMessageRead, addDocument, addAvailabilityRule,
    removeAvailabilityRule, addAvailabilityException, removeAvailabilityException,
    setMfaEnabled, revokeSession, addDelegatedAccess, revokeDelegatedAccess, addTicket, addAuditEvent]);

  return <DoctorPortalContext.Provider value={value}>{children}</DoctorPortalContext.Provider>;
};
