import React, { useState } from 'react';
import {
  Stethoscope,
  Building2,
  Pill,
  Newspaper,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Globe,
  FileBadge,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { doctorPortalApi } from '../doctor-portal/doctorPortalData';
import { hospitalPortalApi } from '../hospital-portal/hospitalPortalData';
import {
  partnerLogin,
  partnerRegister,
  partnerRequestReset,
  partnerCompleteReset,
} from '../../services/pharmacyInventoryClient';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';
import {
  newsFetch,
  storeAdminSession,
  storeAuthorityToken,
  newsStaffRegister,
  newsAuthorityRegister,
  UnifiedLoginResult,
} from '../../services/newsGovernanceClient';
import { newsAuthService } from '../../services/newsAuthService';

export type AuthRoleKey = 'user' | 'doctor' | 'hospital' | 'pharmacy' | 'news';
export type RoleAuthMode = 'login' | 'signup' | 'recover';

export type TargetPortalRoute =
  | 'dashboard'
  | 'doctor-portal'
  | 'hospital-portal'
  | 'pharmacy-portal'
  | 'news-management'
  | 'news-authority';

interface RolePortalAuthPanelProps {
  role: Exclude<AuthRoleKey, 'user'>;
  mode: RoleAuthMode;
  onModeChange: (mode: RoleAuthMode) => void;
  onSuccessNavigate: (portal: TargetPortalRoute) => void;
}

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const plainInputCls =
  'w-full rounded-xl border border-slate-300 bg-white py-2.5 px-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-medical-500 focus:outline-none focus:ring-2 focus:ring-medical-500/20 transition';
const labelCls = 'block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 text-left';

export const RolePortalAuthPanel: React.FC<RolePortalAuthPanelProps> = ({
  role,
  mode,
  onModeChange,
  onSuccessNavigate,
}) => {
  // Shared Login state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Doctor Signup state
  const [docFullName, setDocFullName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Internal Medicine');
  const [docRegNo, setDocRegNo] = useState('');
  const [docHospital, setDocHospital] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docConfirmPw, setDocConfirmPw] = useState('');

  // Hospital Signup state
  const [hospName, setHospName] = useState('');
  const [hospType, setHospType] = useState('Multi-Specialty Tertiary Hospital');
  const [hospCity, setHospCity] = useState('');
  const [hospRepName, setHospRepName] = useState('');
  const [hospRole, setHospRole] = useState('Hospital Administrator');
  const [hospPhone, setHospPhone] = useState('');
  const [hospConfirmPw, setHospConfirmPw] = useState('');

  // Pharmacy Signup state
  const [pharmaName, setPharmaName] = useState('');
  const [pharmaLicense, setPharmaLicense] = useState('');
  const [pharmaContact, setPharmaContact] = useState('');
  const [pharmaPhone, setPharmaPhone] = useState('');
  const [pharmaConfirmPw, setPharmaConfirmPw] = useState('');

  // News Management Signup & MFA state
  const [newsAccountKind, setNewsAccountKind] = useState<'admin' | 'authority'>('admin');
  const [newsFullName, setNewsFullName] = useState('');
  const [newsRole, setNewsRole] = useState('EDITOR');
  const [newsTitle, setNewsTitle] = useState('Senior Medical Editor');
  const [newsOrgName, setNewsOrgName] = useState('');
  const [newsOrgType, setNewsOrgType] = useState('Medical Research Institute');
  const [newsWebsite, setNewsWebsite] = useState('https://');
  const [newsDescription, setNewsDescription] = useState('');
  const [newsConfirmPw, setNewsConfirmPw] = useState('');
  const [newsMfaChallenge, setNewsMfaChallenge] = useState<{
    challengeId: string;
    accountType: 'admin' | 'authority';
    demoCode?: string;
    recipientEmail?: string;
  } | null>(null);
  const [newsMfaCode, setNewsMfaCode] = useState('');

  // Recovery state
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'reset' | 'done'>('request');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [demoRecoveryCode, setDemoRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const clearFeedback = () => {
    setError('');
    setInfo('');
  };

  // ---------------- DOCTOR PORTAL HANDLERS ----------------
  const handleDoctorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!identifier.trim() || !password) {
      setError('Please enter your professional email/username and password.');
      return;
    }
    setBusy(true);
    const res = await doctorPortalApi.login(identifier.trim(), password);
    setBusy(false);
    if (res.success) {
      onSuccessNavigate('doctor-portal');
    } else {
      setError(res.error || 'Unable to sign in to Doctor Portal.');
    }
  };

  const handleDoctorSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!docFullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!identifier.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      setError('Please enter a valid professional email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== docConfirmPw) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    const res = await doctorPortalApi.signup({
      fullName: docFullName.trim(),
      email: identifier.trim(),
      phone: docPhone.trim() || '+91 98200 11223',
      specialty: docSpecialty.trim() || 'Internal Medicine',
      registrationNo: docRegNo.trim() || `NMC-${Math.floor(100000 + Math.random() * 900000)}`,
      organization: docHospital.trim() || 'GlobalHealth Partner Medical Center',
      password,
      autoVerify: true,
    });
    setBusy(false);
    if (res.success) {
      onSuccessNavigate('doctor-portal');
    } else {
      setError(res.error || 'Unable to create Doctor Portal account.');
    }
  };

  // ---------------- HOSPITAL PORTAL HANDLERS ----------------
  const handleHospitalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!identifier.trim() || !password) {
      setError('Please enter your hospital email/username and password.');
      return;
    }
    setBusy(true);
    const res = await hospitalPortalApi.login(identifier.trim(), password);
    setBusy(false);
    if (res.success) {
      onSuccessNavigate('hospital-portal');
    } else {
      setError(res.error || 'Unable to sign in to Hospital Portal.');
    }
  };

  const handleHospitalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!hospName.trim()) {
      setError('Please enter the hospital or medical facility name.');
      return;
    }
    if (!identifier.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      setError('Please enter a valid official hospital email address.');
      return;
    }
    if (!hospRepName.trim()) {
      setError('Please enter the authorized representative name.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== hospConfirmPw) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    const res = await hospitalPortalApi.signup({
      hospitalName: hospName.trim(),
      facilityType: hospType.trim(),
      city: hospCity.trim() || 'Metropolitan Campus',
      representativeName: hospRepName.trim(),
      role: hospRole,
      email: identifier.trim(),
      phone: hospPhone.trim() || '+91 11 4000 1000',
      password,
      autoVerify: true,
    });
    setBusy(false);
    if (res.success) {
      onSuccessNavigate('hospital-portal');
    } else {
      setError(res.error || 'Unable to register Hospital Portal account.');
    }
  };

  // ---------------- PHARMACY PORTAL HANDLERS ----------------
  const handlePharmacyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!identifier.trim() || !password) {
      setError('Please enter your registered pharmacy email and password.');
      return;
    }
    setBusy(true);
    const res = await partnerLogin(identifier.trim(), password);
    setBusy(false);
    if (res.ok && res.account) {
      PharmacyPortalService.setActiveWorkspaceScope(res.account.partnerId, res.account);
      onSuccessNavigate('pharmacy-portal');
    } else {
      setError(res.error || 'Incorrect pharmacy partner credentials.');
    }
  };

  const handlePharmacySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!pharmaName.trim() || pharmaName.trim().length < 3) {
      setError('Please enter the pharmacy legal name (at least 3 characters).');
      return;
    }
    if (!pharmaLicense.trim() || pharmaLicense.trim().length < 4) {
      setError('Please enter a valid pharmacy / drug license number.');
      return;
    }
    if (!identifier.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      setError('Please enter a valid pharmacy contact email.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== pharmaConfirmPw) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    const res = await partnerRegister({
      pharmacyName: pharmaName.trim(),
      licenseNumber: pharmaLicense.trim(),
      contactName: pharmaContact.trim() || 'Chief Pharmacist',
      email: identifier.trim(),
      phone: pharmaPhone.trim() || '+91 98000 11111',
      password,
    });
    setBusy(false);
    if (res.ok && res.account) {
      PharmacyPortalService.setActiveWorkspaceScope(res.account.partnerId, res.account);
      onSuccessNavigate('pharmacy-portal');
    } else {
      setError(res.error || 'Unable to register Pharmacy Portal account.');
    }
  };

  // ---------------- NEWS MANAGEMENT HANDLERS ----------------
  const handleNewsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!identifier.trim() || !password) {
      setError('Please enter your editorial/authority email and password.');
      return;
    }
    setBusy(true);
    try {
      const res = await newsFetch<UnifiedLoginResult>('/api/news/login', {
        method: 'POST',
        body: { identifier: identifier.trim(), password },
        token: null,
      });
      setBusy(false);
      if (res.stage === 'mfa' && res.challengeId) {
        setNewsMfaChallenge({
          challengeId: res.challengeId,
          accountType: res.accountType,
          demoCode: res.demoDelivery?.code,
          recipientEmail: res.demoDelivery?.recipientEmail || identifier.trim(),
        });
        setNewsMfaCode(res.demoDelivery?.code || '');
        return;
      }
      if (res.stage === 'complete' && res.token) {
        if (res.accountType === 'admin') {
          storeAdminSession(res.token, res.admin || null);
          if (res.admin) newsAuthService.adoptServerAccount(res.admin);
          onSuccessNavigate('news-management');
        } else {
          storeAuthorityToken(res.token);
          onSuccessNavigate('news-authority');
        }
      }
    } catch (err: any) {
      setBusy(false);
      setError(err?.message || 'Unable to sign in to News Management.');
    }
  };

  const handleNewsMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsMfaChallenge) return;
    clearFeedback();
    if (!/^\d{6}$/.test(newsMfaCode.trim())) {
      setError('Please enter the 6-digit MFA verification code.');
      return;
    }
    setBusy(true);
    try {
      const res = await newsFetch<UnifiedLoginResult>('/api/news/mfa/verify', {
        method: 'POST',
        body: { challengeId: newsMfaChallenge.challengeId, code: newsMfaCode.trim() },
        token: null,
      });
      setBusy(false);
      if (res.stage === 'complete' && res.token) {
        setNewsMfaChallenge(null);
        if (res.accountType === 'admin') {
          storeAdminSession(res.token, res.admin || null);
          if (res.admin) newsAuthService.adoptServerAccount(res.admin);
          onSuccessNavigate('news-management');
        } else {
          storeAuthorityToken(res.token);
          onSuccessNavigate('news-authority');
        }
      }
    } catch (err: any) {
      setBusy(false);
      setError(err?.message || 'Invalid verification code.');
    }
  };

  const handleNewsSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (!identifier.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim())) {
      setError('Please enter a valid official email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== newsConfirmPw) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      if (newsAccountKind === 'admin') {
        if (!newsFullName.trim()) {
          setBusy(false);
          setError('Please enter your full name.');
          return;
        }
        const res = await newsStaffRegister({
          fullName: newsFullName.trim(),
          email: identifier.trim(),
          role: newsRole,
          title: newsTitle.trim() || 'Medical Editor',
          password,
        });
        setBusy(false);
        if (res.success && res.token && res.admin) {
          storeAdminSession(res.token, res.admin);
          newsAuthService.adoptServerAccount(res.admin);
          onSuccessNavigate('news-management');
        } else {
          setError(res.error || 'Unable to create News Management account.');
        }
      } else {
        if (!newsOrgName.trim()) {
          setBusy(false);
          setError('Please enter your organization name.');
          return;
        }
        const websiteUrl =
          newsWebsite.trim().startsWith('http://') || newsWebsite.trim().startsWith('https://')
            ? newsWebsite.trim()
            : `https://${newsWebsite.trim() || 'organization.org'}`;
        const descText =
          newsDescription.trim().length >= 30
            ? newsDescription.trim()
            : `${newsDescription.trim() || newsOrgName.trim()} — Official health communications and medical research publication authority.`;
        const res = await newsAuthorityRegister({
          orgName: newsOrgName.trim(),
          orgType: newsOrgType,
          website: websiteUrl.includes('.') ? websiteUrl : 'https://globalhealth.org',
          contactName: newsFullName.trim() || 'Authorized Representative',
          contactEmail: identifier.trim(),
          representativeName: newsFullName.trim() || 'Authorized Representative',
          representativeRole: newsTitle.trim() || 'Director of Communications',
          description: descText,
          verificationReason: 'Official public health & clinical research publishing workflow on GlobalHealth.',
          password,
        });
        setBusy(false);
        if (res.success && res.token) {
          storeAuthorityToken(res.token);
          onSuccessNavigate('news-authority');
        } else {
          setInfo(res.message || 'Authority account created.');
          onModeChange('login');
        }
      }
    } catch (err: any) {
      setBusy(false);
      setError(err?.message || 'Registration failed. Please check your details.');
    }
  };

  // ---------------- UNIFIED RECOVERY HANDLERS ----------------
  const handleRecoveryRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    const target = (recoveryEmail || identifier).trim();
    if (!target) {
      setError('Please enter your registered email address or username.');
      return;
    }
    setRecoveryEmail(target);
    setBusy(true);
    try {
      if (role === 'doctor') {
        const res = await doctorPortalApi.forgot(target);
        if (res.demoResetToken) setRecoveryToken(res.demoResetToken);
        setRecoveryStep('reset');
        setInfo('Verification complete. Set your new Doctor Portal password below.');
      } else if (role === 'hospital') {
        const res = await hospitalPortalApi.forgot(target);
        if (res.demoResetToken) setRecoveryToken(res.demoResetToken);
        setRecoveryStep('reset');
        setInfo('Verification complete. Set your new Hospital Portal password below.');
      } else if (role === 'pharmacy') {
        const res = await partnerRequestReset(target);
        if (res.demoToken) setRecoveryToken(res.demoToken);
        setRecoveryStep('reset');
        setInfo('Reset token generated. Set your new Pharmacy Portal password below.');
      } else if (role === 'news') {
        const res = await newsFetch<{
          success: boolean;
          message: string;
          demoReset?: { resetToken: string; code: string };
        }>('/api/news/forgot-password', {
          method: 'POST',
          body: { email: target },
          token: null,
        });
        if (res.demoReset?.resetToken) {
          setRecoveryToken(res.demoReset.resetToken);
          setDemoRecoveryCode(res.demoReset.code);
          setRecoveryCode(res.demoReset.code);
        }
        setRecoveryStep('reset');
        setInfo('Enter the reset verification code and your new password below.');
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to process recovery request.');
    } finally {
      setBusy(false);
    }
  };

  const handleRecoveryReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearFeedback();
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match.');
      return;
    }
    setBusy(true);
    try {
      if (role === 'doctor') {
        await doctorPortalApi.reset(newPassword, recoveryEmail, recoveryToken);
        setRecoveryStep('done');
      } else if (role === 'hospital') {
        await hospitalPortalApi.reset(newPassword, recoveryEmail, recoveryToken);
        setRecoveryStep('done');
      } else if (role === 'pharmacy') {
        if (recoveryToken) {
          const res = await partnerCompleteReset(recoveryToken, newPassword);
          if (!res.ok) {
            setError(res.error || 'Could not reset pharmacy password.');
            setBusy(false);
            return;
          }
        }
        setRecoveryStep('done');
      } else if (role === 'news') {
        await newsFetch('/api/news/reset-password', {
          method: 'POST',
          body: {
            resetToken: recoveryToken,
            code: recoveryCode.trim(),
            newPassword,
          },
          token: null,
        });
        setRecoveryStep('done');
      }
    } catch (err: any) {
      setError(err?.message || 'Could not complete password reset.');
    } finally {
      setBusy(false);
    }
  };

  const roleConfig = {
    doctor: {
      badge: 'Doctor Portal Workspace',
      icon: <Stethoscope className="h-5 w-5 text-medical-600" />,
      loginTitle: 'Sign In to Doctor Portal',
      loginSubtitle: 'Access your private clinical EHR, patient consultations, schedule & e-prescriptions.',
      signupTitle: 'Create Doctor Portal Account',
      signupSubtitle: 'Register your medical credentials to launch your isolated physician workspace.',
      recoverTitle: 'Recover Doctor Portal Account',
      demoAccounts: [
        { label: 'Dr. Priya Nair (Internal Medicine)', id: 'priya.nair@example.com', pw: 'Doctor123!' },
        { label: 'Dr. Alexandra Chen (Cardiology)', id: 'a.chen@medauth.org', pw: 'chen123' },
        { label: 'Dr. Robert Harrison (Orthopedics)', id: 'r.harrison@medauth.org', pw: 'harr123' },
        { label: 'Dr. Anita Rao (City Care)', id: 'anita.rao@globalhealth.org', pw: 'Doctor123!' },
      ],
    },
    hospital: {
      badge: 'Hospital Portal Workspace',
      icon: <Building2 className="h-5 w-5 text-indigo-600" />,
      loginTitle: 'Sign In to Hospital Portal',
      loginSubtitle: 'Manage your hospital profile, departments, doctors, bed telemetry & pricing.',
      signupTitle: 'Register Hospital Account',
      signupSubtitle: 'Create a dedicated private workspace for your hospital or medical center.',
      recoverTitle: 'Recover Hospital Portal Account',
      demoAccounts: [
        { label: 'GlobalHealth Medical Centre', id: 'admin@ghmc.example.com', pw: 'Password@123' },
        { label: 'Apex Institute of Medical Sciences', id: 'admin@apexhealth.org', pw: 'Password@123' },
        { label: 'AIIMS New Delhi', id: 'appointments@aiims.edu', pw: 'Password@123' },
        { label: 'Mayo Clinic Rochester', id: 'appointments@mayoclinic.org', pw: 'Password@123' },
      ],
    },
    pharmacy: {
      badge: 'Pharmacy Portal Workspace',
      icon: <Pill className="h-5 w-5 text-emerald-600" />,
      loginTitle: 'Sign In to Pharmacy Portal',
      loginSubtitle: 'Access your private dispensary inventory, prescription verification, branches & orders.',
      signupTitle: 'Create Pharmacy Partner Account',
      signupSubtitle: 'Register your licensed pharmacy to launch your isolated dispensary workspace.',
      recoverTitle: 'Recover Pharmacy Partner Account',
      demoAccounts: [
        { label: 'Apex Central Dispensary (Owner)', id: 'dr.ramanathan@apexhealth.org', pw: 'Pharmacy@123' },
        { label: 'GlobalHealth Express Hub', id: 'mumbai.depot@globalhealth.org', pw: 'Pharmacy@123' },
        { label: 'Apollo Care Clinical Pharmacy', id: 'bangalore.pharmacy@apollocare.org', pw: 'Pharmacy@123' },
        { label: 'MedPlus Community Dispensary', id: 'hyderabad.hub@medpluscommunity.org', pw: 'Pharmacy@123' },
      ],
    },
    news: {
      badge: 'News Management Workspace',
      icon: <Newspaper className="h-5 w-5 text-amber-600" />,
      loginTitle: 'Sign In to News Management',
      loginSubtitle: 'Access the Editorial CMS or Verified Health Authority publishing workspace.',
      signupTitle: 'Create News Management Account',
      signupSubtitle: 'Register as an Editorial Staff member or a Verified Health Authority organization.',
      recoverTitle: 'Recover News Management Account',
      demoAccounts: [
        { label: 'Dr. Evelyn Carter (Super Admin)', id: 'admin@globalhealth.org', pw: 'Password123!' },
        { label: 'Sarah Chen, MD (Senior Editor)', id: 'editor@globalhealth.org', pw: 'Password123!' },
        { label: 'Marcus Sterling (News Admin)', id: 'newsadmin@globalhealth.org', pw: 'Password123!' },
        { label: 'David Kim (Medical Author)', id: 'author@globalhealth.org', pw: 'Password123!' },
      ],
    },
  }[role];

  return (
    <div className="w-full text-left">
      {/* Header */}
      <div className="mb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700 mb-2.5">
          {roleConfig.icon}
          <span>{roleConfig.badge}</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
          {mode === 'login'
            ? roleConfig.loginTitle
            : mode === 'signup'
              ? roleConfig.signupTitle
              : roleConfig.recoverTitle}
        </h1>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
          {mode === 'login'
            ? roleConfig.loginSubtitle
            : mode === 'signup'
              ? roleConfig.signupSubtitle
              : 'Reset your password to securely regain access to your private portal workspace.'}
        </p>
      </div>

      {/* Feedback Alerts */}
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3 text-xs text-rose-800"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="leading-snug">
            <span className="font-semibold block mb-0.5">Authentication Notice</span>
            {error}
          </div>
        </div>
      )}
      {info && (
        <div
          role="status"
          className="mb-4 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          <span>{info}</span>
        </div>
      )}

      {/* ==================== SIGN IN / LOG IN ==================== */}
      {mode === 'login' && (
        <>
          {role === 'news' && newsMfaChallenge ? (
            <form onSubmit={handleNewsMfaVerify} className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-3.5 text-xs text-amber-900">
                <span className="font-bold uppercase tracking-wider text-[10px] text-amber-700 block mb-1">
                  Multi-Factor Verification Required
                </span>
                <p>
                  Enter the 6-digit security code dispatched to{' '}
                  <strong>{newsMfaChallenge.recipientEmail}</strong>.
                </p>
                {newsMfaChallenge.demoCode && (
                  <div className="mt-2 flex items-center justify-between rounded-lg bg-white/90 px-3 py-2 border border-amber-200">
                    <span>
                      Simulated Code:{' '}
                      <strong className="font-mono text-sm text-slate-900">{newsMfaChallenge.demoCode}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setNewsMfaCode(newsMfaChallenge.demoCode || '')}
                      className="rounded-md bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700 cursor-pointer"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls}>6-Digit Security Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={newsMfaCode}
                  onChange={(e) => setNewsMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`${plainInputCls} text-center font-mono text-lg tracking-[0.35em] font-bold`}
                  placeholder="••••••"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer disabled:opacity-60"
              >
                {busy ? 'Verifying...' : 'Verify & Open News Management Workspace'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setNewsMfaChallenge(null)}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form
              onSubmit={
                role === 'doctor'
                  ? handleDoctorLogin
                  : role === 'hospital'
                    ? handleHospitalLogin
                    : role === 'pharmacy'
                      ? handlePharmacyLogin
                      : handleNewsLogin
              }
              className="space-y-4"
            >
              <div>
                <label className={labelCls}>
                  {role === 'doctor'
                    ? 'Professional Email / Username / License ID'
                    : role === 'hospital'
                      ? 'Official Hospital Email / Username'
                      : role === 'pharmacy'
                        ? 'Registered Pharmacy Email'
                        : 'Editorial or Authority Email'}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      clearFeedback();
                    }}
                    className={inputCls}
                    placeholder={roleConfig.demoAccounts[0].id}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      clearFeedback();
                      setRecoveryEmail(identifier);
                      setRecoveryStep('request');
                      onModeChange('recover');
                    }}
                    className="text-xs font-bold text-medical-700 hover:text-medical-800 hover:underline cursor-pointer"
                  >
                    Forgot / Recover Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFeedback();
                    }}
                    className={`${inputCls} pr-10`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-medical-600/20 hover:bg-medical-700 transition cursor-pointer disabled:opacity-60"
              >
                {busy ? (
                  <span>Signing in to workspace...</span>
                ) : (
                  <>
                    <span>{roleConfig.loginTitle}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Quick-Fill Demo Accounts for this Role */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/90 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-medical-600" />
                    Quick-Fill Accounts (Each has its own private workspace)
                  </span>
                  <span className="text-[10px] font-semibold text-medical-700">Click to fill</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {roleConfig.demoAccounts.map((acct) => (
                    <button
                      key={acct.id}
                      type="button"
                      onClick={() => {
                        setIdentifier(acct.id);
                        setPassword(acct.pw);
                        clearFeedback();
                      }}
                      className="flex flex-col rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left hover:border-medical-400 hover:bg-medical-50/40 transition cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-900 truncate">{acct.label}</span>
                      <span className="text-[11px] font-mono text-slate-500 truncate">{acct.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>
                  New to {roleConfig.badge}?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      clearFeedback();
                      onModeChange('signup');
                    }}
                    className="font-bold text-medical-700 hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearFeedback();
                    setRecoveryEmail(identifier);
                    setRecoveryStep('request');
                    onModeChange('recover');
                  }}
                  className="font-bold text-slate-600 hover:text-slate-900 hover:underline cursor-pointer"
                >
                  Recover Account
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* ==================== SIGN UP ==================== */}
      {mode === 'signup' && (
        <>
          {role === 'doctor' && (
            <form onSubmit={handleDoctorSignup} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Full Name *</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={docFullName}
                      onChange={(e) => setDocFullName(e.target.value)}
                      className={inputCls}
                      placeholder="Dr. Rohan Verma"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Primary Specialty *</label>
                  <input
                    type="text"
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    className={plainInputCls}
                    placeholder="Cardiology / Internal Medicine"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Medical Registration / License No.</label>
                  <div className="relative">
                    <FileBadge className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={docRegNo}
                      onChange={(e) => setDocRegNo(e.target.value)}
                      className={inputCls}
                      placeholder="NMC-IN-2024-88210"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Hospital / Clinic Affiliation</label>
                  <input
                    type="text"
                    value={docHospital}
                    onChange={(e) => setDocHospital(e.target.value)}
                    className={plainInputCls}
                    placeholder="City Care Hospital"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Professional Email *</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className={inputCls}
                      placeholder="doctor@hospital.org"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Mobile / Direct Phone</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      value={docPhone}
                      onChange={(e) => setDocPhone(e.target.value)}
                      className={inputCls}
                      placeholder="+91 98200 11223"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Password (8+ chars) *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={plainInputCls}
                    placeholder="Create password"
                  />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password *</label>
                  <input
                    type="password"
                    value={docConfirmPw}
                    onChange={(e) => setDocConfirmPw(e.target.value)}
                    className={plainInputCls}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer disabled:opacity-60"
              >
                {busy ? 'Creating your private Doctor workspace...' : 'Sign Up & Enter Doctor Portal'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {role === 'hospital' && (
            <form onSubmit={handleHospitalSignup} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Hospital / Facility Legal Name *</label>
                  <input
                    type="text"
                    value={hospName}
                    onChange={(e) => setHospName(e.target.value)}
                    className={plainInputCls}
                    placeholder="Sunrise Multispecialty Hospital"
                  />
                </div>
                <div>
                  <label className={labelCls}>Facility Type</label>
                  <select
                    value={hospType}
                    onChange={(e) => setHospType(e.target.value)}
                    className={plainInputCls}
                  >
                    <option>Multi-Specialty Tertiary Hospital</option>
                    <option>Academic Medical Center</option>
                    <option>Specialty Surgical Center</option>
                    <option>Community Hospital</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Authorized Representative Name *</label>
                  <input
                    type="text"
                    value={hospRepName}
                    onChange={(e) => setHospRepName(e.target.value)}
                    className={plainInputCls}
                    placeholder="Dr. Meera Krishnan"
                  />
                </div>
                <div>
                  <label className={labelCls}>Administrative Role</label>
                  <select
                    value={hospRole}
                    onChange={(e) => setHospRole(e.target.value)}
                    className={plainInputCls}
                  >
                    <option>Hospital Administrator</option>
                    <option>Hospital Owner</option>
                    <option>Medical Superintendent</option>
                    <option>Operations Director</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className={labelCls}>City / Campus</label>
                  <input
                    type="text"
                    value={hospCity}
                    onChange={(e) => setHospCity(e.target.value)}
                    className={plainInputCls}
                    placeholder="Mumbai"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className={labelCls}>Official Email *</label>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={plainInputCls}
                    placeholder="admin@sunrisehospital.org"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className={labelCls}>Reception Phone</label>
                  <input
                    type="tel"
                    value={hospPhone}
                    onChange={(e) => setHospPhone(e.target.value)}
                    className={plainInputCls}
                    placeholder="+91 22 4000 9000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Password (8+ chars) *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={plainInputCls}
                    placeholder="Create password"
                  />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password *</label>
                  <input
                    type="password"
                    value={hospConfirmPw}
                    onChange={(e) => setHospConfirmPw(e.target.value)}
                    className={plainInputCls}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer disabled:opacity-60"
              >
                {busy ? 'Creating your private Hospital workspace...' : 'Sign Up & Enter Hospital Portal'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {role === 'pharmacy' && (
            <form onSubmit={handlePharmacySignup} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Pharmacy Legal Name *</label>
                  <input
                    type="text"
                    value={pharmaName}
                    onChange={(e) => setPharmaName(e.target.value)}
                    className={plainInputCls}
                    placeholder="LifeCare Clinical Dispensary"
                  />
                </div>
                <div>
                  <label className={labelCls}>Drug License / Reg No. *</label>
                  <input
                    type="text"
                    value={pharmaLicense}
                    onChange={(e) => setPharmaLicense(e.target.value)}
                    className={plainInputCls}
                    placeholder="DL-MH-2025-99412"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Chief Pharmacist / Contact</label>
                  <input
                    type="text"
                    value={pharmaContact}
                    onChange={(e) => setPharmaContact(e.target.value)}
                    className={plainInputCls}
                    placeholder="Dr. Suresh Iyer"
                  />
                </div>
                <div>
                  <label className={labelCls}>Official Email *</label>
                  <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className={plainInputCls}
                    placeholder="dispensary@lifecare.org"
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input
                    type="tel"
                    value={pharmaPhone}
                    onChange={(e) => setPharmaPhone(e.target.value)}
                    className={plainInputCls}
                    placeholder="+91 98200 55443"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Password (8+ chars) *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={plainInputCls}
                    placeholder="Create password"
                  />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password *</label>
                  <input
                    type="password"
                    value={pharmaConfirmPw}
                    onChange={(e) => setPharmaConfirmPw(e.target.value)}
                    className={plainInputCls}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer disabled:opacity-60"
              >
                {busy ? 'Creating your private Pharmacy workspace...' : 'Sign Up & Enter Pharmacy Portal'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {role === 'news' && (
            <form onSubmit={handleNewsSignup} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setNewsAccountKind('admin')}
                  className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                    newsAccountKind === 'admin'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Editorial / News Staff
                </button>
                <button
                  type="button"
                  onClick={() => setNewsAccountKind('authority')}
                  className={`rounded-lg py-2 text-xs font-bold transition cursor-pointer ${
                    newsAccountKind === 'authority'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Health Authority Org
                </button>
              </div>

              {newsAccountKind === 'admin' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input
                        type="text"
                        value={newsFullName}
                        onChange={(e) => setNewsFullName(e.target.value)}
                        className={plainInputCls}
                        placeholder="Dr. Kavita Menon"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Editorial Role</label>
                      <select
                        value={newsRole}
                        onChange={(e) => setNewsRole(e.target.value)}
                        className={plainInputCls}
                      >
                        <option value="EDITOR">Senior Editor</option>
                        <option value="AUTHOR">Medical Author / Journalist</option>
                        <option value="REVIEWER">Medical Peer Reviewer</option>
                        <option value="PUBLISHER">Managing Publisher</option>
                        <option value="NEWS_ADMIN">News Administrator</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Official Editorial Email *</label>
                      <input
                        type="email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className={plainInputCls}
                        placeholder="kavita.menon@globalhealth.org"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Job Title / Desk</label>
                      <input
                        type="text"
                        value={newsTitle}
                        onChange={(e) => setNewsTitle(e.target.value)}
                        className={plainInputCls}
                        placeholder="Clinical Research Editor"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Organization Name *</label>
                      <input
                        type="text"
                        value={newsOrgName}
                        onChange={(e) => setNewsOrgName(e.target.value)}
                        className={plainInputCls}
                        placeholder="National Heart & Lung Institute"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Organization Type</label>
                      <select
                        value={newsOrgType}
                        onChange={(e) => setNewsOrgType(e.target.value)}
                        className={plainInputCls}
                      >
                        <option>Medical Research Institute</option>
                        <option>Public Health Agency</option>
                        <option>Academic Hospital Network</option>
                        <option>Global Health NGO</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls}>Representative Name *</label>
                      <input
                        type="text"
                        value={newsFullName}
                        onChange={(e) => setNewsFullName(e.target.value)}
                        className={plainInputCls}
                        placeholder="Dr. Alan Grant"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Official Email *</label>
                      <input
                        type="email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className={plainInputCls}
                        placeholder="press@nhli.org"
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Official Website</label>
                      <div className="relative">
                        <Globe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="url"
                          value={newsWebsite}
                          onChange={(e) => setNewsWebsite(e.target.value)}
                          className={inputCls}
                          placeholder="https://nhli.org"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Organization Mandate / Description</label>
                    <input
                      type="text"
                      value={newsDescription}
                      onChange={(e) => setNewsDescription(e.target.value)}
                      className={plainInputCls}
                      placeholder="Peer-reviewed clinical advisories and public health bulletins"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Password (8+ chars) *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={plainInputCls}
                    placeholder="Create password"
                  />
                </div>
                <div>
                  <label className={labelCls}>Confirm Password *</label>
                  <input
                    type="password"
                    value={newsConfirmPw}
                    onChange={(e) => setNewsConfirmPw(e.target.value)}
                    className={plainInputCls}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer disabled:opacity-60"
              >
                {busy
                  ? 'Creating your private News workspace...'
                  : 'Sign Up & Enter News Management Workspace'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
            Already have a {roleConfig.badge} account?{' '}
            <button
              type="button"
              onClick={() => {
                clearFeedback();
                onModeChange('login');
              }}
              className="font-bold text-medical-700 hover:underline cursor-pointer"
            >
              Sign In / Log In
            </button>
          </div>
        </>
      )}

      {/* ==================== RECOVER ACCOUNT ==================== */}
      {mode === 'recover' && (
        <>
          {recoveryStep === 'request' && (
            <form onSubmit={handleRecoveryRequest} className="space-y-4">
              <div>
                <label className={labelCls}>Registered {roleConfig.badge} Email or Username</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={recoveryEmail}
                    onChange={(e) => {
                      setRecoveryEmail(e.target.value);
                      clearFeedback();
                    }}
                    className={inputCls}
                    placeholder={roleConfig.demoAccounts[0].id}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer disabled:opacity-60"
              >
                {busy ? 'Requesting recovery token...' : 'Send Recovery Instructions'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  clearFeedback();
                  onModeChange('login');
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </button>
            </form>
          )}

          {recoveryStep === 'reset' && (
            <form onSubmit={handleRecoveryReset} className="space-y-4">
              {role === 'news' && (
                <div>
                  <label className={labelCls}>6-Digit Recovery Code</label>
                  {demoRecoveryCode && (
                    <div className="mb-2 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      <span>
                        Simulated Reset Code: <strong className="font-mono">{demoRecoveryCode}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setRecoveryCode(demoRecoveryCode)}
                        className="rounded bg-amber-600 px-2 py-0.5 text-[11px] font-bold text-white cursor-pointer"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    value={recoveryCode}
                    onChange={(e) => setRecoveryCode(e.target.value)}
                    className={plainInputCls}
                    placeholder="6-digit code"
                  />
                </div>
              )}

              <div>
                <label className={labelCls}>New Password (8+ characters)</label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputCls}
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Confirm New Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={inputCls}
                    placeholder="Re-enter new password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-medical-700 transition cursor-pointer disabled:opacity-60"
              >
                {busy ? 'Updating password...' : 'Update Password'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {recoveryStep === 'done' && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 text-center space-y-3">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Password Updated Successfully</h3>
              <p className="text-xs text-slate-600">
                Your {roleConfig.badge} password has been reset. You can now sign in with your new password.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIdentifier(recoveryEmail);
                  setPassword(newPassword);
                  setRecoveryStep('request');
                  onModeChange('login');
                }}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-medical-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-medical-700 transition cursor-pointer"
              >
                Continue to Sign In
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-medical-500" />
        <span>Isolated private workspace with role-verified access &amp; encrypted session controls.</span>
      </div>
    </div>
  );
};
