import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Laptop, 
  KeyRound, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  History, 
  ArrowLeft, 
  RefreshCw, 
  QrCode, 
  Copy, 
  Check, 
  Eye, 
  EyeOff,
  AlertCircle,
  Clock,
  MapPin,
  Globe,
  FileText,
  MousePointerClick,
  ExternalLink,
  Ban as BanIcon
} from 'lucide-react';
import { PublicUserAccount, PublicUserSession, SecurityAuditLogEntry } from '../../types/auth';
import { 
  getActiveSessions, 
  terminateSession, 
  terminateAllOtherSessions, 
  changePassword, 
  setupTwoFactor, 
  verifyTwoFactor, 
  getAuditLogs, 
  calculatePasswordStrength,
  updateMarketingConsent,
  acceptPolicyVersions
} from '../../services/authService';
import { TERMS_VERSION, PRIVACY_VERSION, TERMS_EFFECTIVE_DATE, PRIVACY_EFFECTIVE_DATE } from '../../lib/policyVersions';

interface AccountSecurityViewProps {
  currentUser: PublicUserAccount;
  onUpdateUser: (updated: PublicUserAccount) => void;
  onBackToDashboard: () => void;
  onLogout: () => void;
  onOpenLegalPage?: (tab: 'terms' | 'privacy-policy') => void;
}

export const AccountSecurityView: React.FC<AccountSecurityViewProps> = ({
  currentUser,
  onUpdateUser,
  onBackToDashboard,
  onLogout,
  onOpenLegalPage
}) => {
  const [activeTab, setActiveTab] = useState<'password' | 'sessions' | '2fa' | 'audit' | 'consent' | 'danger'>('sessions');
  const [consentMsg, setConsentMsg] = useState('');
  const [consentErr, setConsentErr] = useState('');
  const [consentBusy, setConsentBusy] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwError, setPwError] = useState('');

  // Sessions state
  const [sessions, setSessions] = useState<PublicUserSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionActionMsg, setSessionActionMsg] = useState('');

  // 2FA state
  const [twoFactorStep, setTwoFactorStep] = useState<'status' | 'setup' | 'backup'>('status');
  const [totpSecret, setTotpSecret] = useState('');
  const [totpQrUri, setTotpQrUri] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpError, setTotpError] = useState('');

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Danger state
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');

  const newPwStrength = calculatePasswordStrength(newPassword);

  // Load Sessions
  const loadSessions = async () => {
    setSessionsLoading(true);
    const data = await getActiveSessions(currentUser.id);
    setSessions(data);
    setSessionsLoading(false);
  };

  // Load Audit Logs
  const loadAudit = async () => {
    setLogsLoading(true);
    const logs = await getAuditLogs(currentUser.id);
    setAuditLogs(logs);
    setLogsLoading(false);
  };

  useEffect(() => {
    loadSessions();
    loadAudit();
  }, [currentUser.id]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');

    if (!currentPassword) {
      setPwError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match.');
      return;
    }

    setPwLoading(true);
    const res = await changePassword(currentUser.id, currentPassword, newPassword, confirmPassword);
    setPwLoading(false);

    if (res.success) {
      setPwSuccess('Password updated successfully. Other devices were prompted to re-authenticate.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      loadSessions();
      loadAudit();
    } else {
      setPwError(res.error || 'Failed to update password.');
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    await terminateSession(sessionId);
    setSessionActionMsg('Device session terminated.');
    loadSessions();
    loadAudit();
    setTimeout(() => setSessionActionMsg(''), 3000);
  };

  const handleTerminateAllOther = async () => {
    const current = sessions.find(s => s.isCurrent)?.sessionId || 'sess-current';
    await terminateAllOtherSessions(currentUser.id, current);
    setSessionActionMsg('All other devices have been logged out.');
    loadSessions();
    loadAudit();
    setTimeout(() => setSessionActionMsg(''), 3000);
  };

  const handleStart2faSetup = async () => {
    setTotpLoading(true);
    setTotpError('');
    const res = await setupTwoFactor(currentUser.id);
    setTotpLoading(false);

    if (res.success) {
      setTotpSecret(res.secretKey);
      setTotpQrUri(res.qrCodeUri);
      setBackupCodes(res.backupCodes || []);
      setTwoFactorStep('setup');
    } else {
      setTotpError(res.error || 'Failed to start 2FA configuration.');
    }
  };

  const handleConfirm2fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setTotpError('');

    if (totpCode.trim().length !== 6) {
      setTotpError('Please enter the 6-digit code from your authenticator app.');
      return;
    }

    setTotpLoading(true);
    const res = await verifyTwoFactor(currentUser.id, totpCode.trim());
    setTotpLoading(false);

    if (res.success) {
      onUpdateUser({
        ...currentUser,
        twoFactor: {
          enabled: true,
          method: 'authenticator_app',
          verifiedAt: new Date().toISOString(),
          backupCodes
        }
      });
      setTwoFactorStep('backup');
      loadAudit();
    } else {
      setTotpError(res.error || 'Invalid 6-digit code. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-slate-900">
      {/* Top Breadcrumb & Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5 text-left">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Account Security & Sessions
              </h1>
              <p className="text-xs text-slate-500">
                Manage your credentials, active devices, and two-factor authentication.
              </p>
            </div>
          </div>
        </div>

        {/* Verification Status Pills */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Email Verified</span>
          </div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            currentUser.isPhoneVerified
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            <Smartphone className="h-3.5 w-3.5" />
            <span>{currentUser.isPhoneVerified ? 'Phone Verified' : 'Phone Unlinked'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Laptop className="h-3.5 w-3.5" />
          <span>Active Sessions ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'password'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Lock className="h-3.5 w-3.5" />
          <span>Change Password</span>
        </button>

        <button
          onClick={() => setActiveTab('2fa')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === '2fa'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <KeyRound className="h-3.5 w-3.5" />
          <span>Two-Factor Auth {currentUser.twoFactor?.enabled && '✓'}</span>
        </button>

        <button
          onClick={() => setActiveTab('consent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'consent'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <FileText className="h-3.5 w-3.5" />
          <span>Privacy &amp; Consent</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'audit'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>Security Audit Trail</span>
        </button>

        <button
          onClick={() => setActiveTab('danger')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer ml-auto ${
            activeTab === 'danger'
              ? 'bg-rose-700 text-white shadow-xs'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Account Management</span>
        </button>
      </div>

      {/* Tab 1: ACTIVE SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="space-y-4 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Devices & Browsers</h2>
              <p className="text-xs text-slate-500">
                You are currently signed in to your GlobalHealth account on these devices.
              </p>
            </div>
            {sessions.length > 1 && (
              <button
                type="button"
                onClick={handleTerminateAllOther}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out All Other Devices</span>
              </button>
            )}
          </div>

          {sessionActionMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{sessionActionMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.sessionId}
                className={`p-4 rounded-2xl border transition ${
                  sess.isCurrent
                    ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      sess.deviceType === 'Mobile' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {sess.deviceType === 'Mobile' ? (
                        <Smartphone className="h-5 w-5" />
                      ) : (
                        <Laptop className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{sess.deviceName}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                            Current Device
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3 text-slate-400" />
                          {sess.browser} · {sess.os}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {sess.location} ({sess.ipAddress})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          Last active: {new Date(sess.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <button
                      type="button"
                      onClick={() => handleTerminateSession(sess.sessionId)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold transition cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: CHANGE PASSWORD */}
      {activeTab === 'password' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-left">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Update Your Password</h2>
          <p className="text-xs text-slate-500 mb-5">
            Use a sufficiently long password that is unique to GlobalHealth.
          </p>

          {pwError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{pwError}</span>
            </div>
          )}

          {pwSuccess && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{pwSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                New Password
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a new secure password"
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPw ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-slate-300 py-2.5 px-3 text-sm text-slate-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Strength Meter */}
            {newPassword && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Strength:</span>
                  <span>{newPwStrength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1.5">
                  <div className={`h-full ${newPwStrength.score >= 1 ? newPwStrength.color : ''}`} />
                  <div className={`h-full ${newPwStrength.score >= 2 ? newPwStrength.color : ''}`} />
                  <div className={`h-full ${newPwStrength.score >= 3 ? newPwStrength.color : ''}`} />
                  <div className={`h-full ${newPwStrength.score >= 4 ? newPwStrength.color : ''}`} />
                </div>
                {newPwStrength.feedback.length > 0 && (
                  <p className="text-[11px] text-slate-500">{newPwStrength.feedback.join(' · ')}</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
              >
                {showPw ? 'Hide Passwords' : 'Show Passwords'}
              </button>

              <button
                type="submit"
                disabled={pwLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
              >
                {pwLoading ? 'Saving...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: TWO-FACTOR AUTH */}
      {activeTab === '2fa' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Two-Factor Authentication (2FA)</h2>
              <p className="text-xs text-slate-500">
                Adds a critical security layer using Google Authenticator or any TOTP app.
              </p>
            </div>
            {currentUser.twoFactor?.enabled ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs">
                Enabled
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold rounded-full text-xs">
                Disabled
              </span>
            )}
          </div>

          {totpError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{totpError}</span>
            </div>
          )}

          {twoFactorStep === 'status' && (
            <div className="space-y-4">
              {currentUser.twoFactor?.enabled ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span>Your account is protected by 2FA</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    Method: Authenticator App. Every login requires a 6-digit one-time code.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Protect your medical profile and saved healthcare services from unauthorized access. When enabled, signing in will require your password plus a temporary 6-digit code.
                  </p>
                  <button
                    type="button"
                    onClick={handleStart2faSetup}
                    disabled={totpLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    {totpLoading ? 'Generating Secret...' : 'Set Up Two-Factor Authentication'}
                  </button>
                </div>
              )}
            </div>
          )}

          {twoFactorStep === 'setup' && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="h-32 w-32 mx-auto bg-white border border-slate-300 rounded-xl flex items-center justify-center p-2 mb-3">
                  <QrCode className="h-28 w-28 text-slate-800" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Scan this QR code with Google Authenticator, Authy, or 1Password.
                </p>
                <div className="mt-3 p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800 flex items-center justify-between">
                  <span>{totpSecret}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(totpSecret);
                      setCopiedSecret(true);
                      setTimeout(() => setCopiedSecret(false), 2000);
                    }}
                    className="p-1 text-slate-500 hover:text-emerald-700 cursor-pointer"
                  >
                    {copiedSecret ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleConfirm2fa} className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Enter 6-Digit Authenticator Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full text-center tracking-widest font-mono text-xl py-2 rounded-xl border border-slate-300 text-slate-900 focus:border-emerald-600 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={totpLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
                >
                  {totpLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
                </button>
              </form>
            </div>
          )}

          {twoFactorStep === 'backup' && (
            <div className="space-y-4 text-left">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h3 className="font-bold text-sm text-emerald-900 mb-1">Save Your Emergency Backup Codes</h3>
                <p className="text-xs text-emerald-800 mb-3">
                  If you lose access to your authenticator device, you can use these one-time codes to sign in.
                </p>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs text-slate-900 bg-white p-3 rounded-xl border border-emerald-200">
                  {backupCodes.map((code, i) => (
                    <div key={i} className="p-1 bg-slate-50 rounded text-center font-bold">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTwoFactorStep('status')}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                I have saved my backup codes
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: SECURITY AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm text-left">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Security Audit Log</h2>
              <p className="text-xs text-slate-500">
                Recent authentication and credential modification events for this account.
              </p>
            </div>
            <button
              onClick={loadAudit}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Event</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {log.event}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{log.details}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: ACCOUNT MANAGEMENT / DANGER ZONE */}
      {activeTab === 'consent' && (
        <div className="max-w-3xl">
          <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <ShieldCheck className="h-4 w-4" />
              <span>Your consent record</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-emerald-900/80">
              GlobalHealth records which version of the Terms &amp; Conditions and Privacy Policy you accepted, and
              when. Consent is specific and itemized — it is never a blanket &ldquo;I consent to everything&rdquo;.
              You can withdraw optional consents here, and manage or withdraw account-necessary consent in Account
              Management.
            </p>
          </div>

          {consentMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">{consentMsg}</div>
          )}
          {consentErr && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">{consentErr}</div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Accepted policy versions</h3>
              <dl className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Terms &amp; Conditions</dt>
                  <dd className="mt-1 text-sm font-bold text-slate-900">{currentUser.consent?.termsVersion || '—'}</dd>
                  <dd className="text-[11px] text-slate-500">Effective {TERMS_EFFECTIVE_DATE}</dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Privacy Policy</dt>
                  <dd className="mt-1 text-sm font-bold text-slate-900">{currentUser.consent?.privacyVersion || '—'}</dd>
                  <dd className="text-[11px] text-slate-500">Effective {PRIVACY_EFFECTIVE_DATE}</dd>
                </div>
              </dl>
              <p className="mt-2 text-[11px] text-slate-500">
                Accepted at:{' '}
                {currentUser.consent?.acceptedAt
                  ? new Date(currentUser.consent.acceptedAt).toLocaleString()
                  : '—'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenLegalPage?.('terms')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3" /> Read Terms &amp; Conditions
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLegalPage?.('privacy-policy')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                >
                  <ExternalLink className="h-3 w-3" /> Read Privacy Policy
                </button>
              </div>
            </div>

            {/* Policy-update re-acceptance */}
            {currentUser.consent &&
              (currentUser.consent.termsVersion !== TERMS_VERSION ||
                currentUser.consent.privacyVersion !== PRIVACY_VERSION) && (
                <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    <div className="text-xs text-amber-900">
                      <span className="font-bold">Updated policies available.</span> We&apos;ve updated our Terms &amp;
                      Conditions and Privacy Policy. Review them above, then accept the current versions.
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={consentBusy}
                    onClick={async () => {
                      setConsentBusy(true);
                      setConsentMsg('');
                      setConsentErr('');
                      const result = await acceptPolicyVersions(TERMS_VERSION, PRIVACY_VERSION);
                      setConsentBusy(false);
                      if (result.success && currentUser.consent) {
                        onUpdateUser({
                          ...currentUser,
                          consent: result.consent,
                          consentHistory: result.consentHistory
                        });
                        setConsentMsg('You have accepted the updated policies. Thank you.');
                      } else {
                        setConsentErr(result.error || 'Could not record acceptance. Please try again.');
                      }
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-amber-700 transition cursor-pointer disabled:opacity-60"
                  >
                    {consentBusy ? 'Recording…' : 'Accept updated policies'}
                  </button>
                </div>
              )}

            {/* Optional marketing consent — withdrawal at comparable ease */}
            <div className="rounded-xl border border-slate-200 p-3.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Optional communications</h4>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                    GlobalHealth updates, health education, product news and service communications by email or other
                    selected channels. This is separate from your account consent, and you can change it here at any
                    time — the same ease as granting it.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setConsentBusy(true);
                    setConsentMsg('');
                    setConsentErr('');
                    const result = await updateMarketingConsent(!currentUser.marketingConsent);
                    setConsentBusy(false);
                    if (result.success) {
                      onUpdateUser({ ...currentUser, marketingConsent: result.marketingConsent });
                      setConsentMsg(
                        result.marketingConsent
                          ? 'Optional communications enabled.'
                          : 'Optional communications turned off. Your preference is saved.'
                      );
                    } else {
                      setConsentErr(result.error || 'Could not update your preference. Please try again.');
                    }
                  }}
                  disabled={consentBusy}
                  aria-pressed={Boolean(currentUser.marketingConsent)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold transition cursor-pointer disabled:opacity-60 ${
                    currentUser.marketingConsent
                      ? 'bg-slate-900 text-white hover:bg-slate-700'
                      : 'bg-medical-600 text-white hover:bg-medical-700'
                  }`}
                >
                  <MousePointerClick className="h-3 w-3" />
                  {currentUser.marketingConsent ? 'Opt out' : 'Opt in'}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Current preference: <strong>{currentUser.marketingConsent ? 'Receiving optional communications' : 'Not receiving optional communications'}</strong>
              </p>
            </div>

            {/* Withdrawal path — account-necessary consent */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5">
              <div className="flex items-start gap-2">
                <BanIcon className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                <div className="text-xs text-rose-900">
                  <span className="font-bold">Withdraw account consent (comparable ease to granting).</span>{' '}
                  Some GlobalHealth features (personal health records, saved library, appointments) require an account
                  and the personal information described in the Privacy Policy. Withdrawing that consent means closing
                  your account — go to <strong>Account Management</strong> to delete or deactivate it. Historic
                  consent versions remain recorded for compliance.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('danger')}
                className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
              >
                Go to Account Management
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'danger' && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-rose-200 shadow-sm text-left space-y-6">
          <div>
            <h2 className="text-lg font-bold text-rose-900">Account Management & Data Retention</h2>
            <p className="text-xs text-slate-500">
              Manage your personal data in accordance with healthcare privacy regulations.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50 space-y-3">
            <h3 className="font-bold text-sm text-amber-900">Deactivate Account</h3>
            <p className="text-xs text-amber-800 leading-relaxed">
              Temporarily disable your GlobalHealth account. Your saved items and history will be preserved if you decide to reactivate later.
            </p>
            <button
              type="button"
              onClick={() => setShowDeactivateModal(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Deactivate Account
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-rose-200 bg-rose-50 space-y-3">
            <h3 className="font-bold text-sm text-rose-900">Delete Account</h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              Permanently delete your account profile and authentication credentials. Medical consultations or official clinic appointments are retained according to statutory medical record guidelines.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
            >
              Delete Account Permanently
            </button>
          </div>
        </div>
      )}

      {/* Deactivation Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-left">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Account Deactivation</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Are you sure you want to deactivate your GlobalHealth account? You will be immediately signed out from all devices.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeactivateModal(false);
                  onLogout();
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-rose-200 shadow-2xl text-left">
            <h3 className="text-lg font-bold text-rose-900 mb-2">Permanently Delete Account</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              This action cannot be undone. Type <strong className="text-slate-900">DELETE</strong> to confirm permanent deletion.
            </p>
            <input
              type="text"
              value={confirmDeleteText}
              onChange={(e) => setConfirmDeleteText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full py-2 px-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 mb-5 focus:outline-hidden focus:border-rose-600"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmDeleteText('');
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmDeleteText !== 'DELETE'}
                onClick={() => {
                  setShowDeleteModal(false);
                  onLogout();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
