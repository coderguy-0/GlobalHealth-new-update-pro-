import React, { useState } from 'react';
import { DoctorPortalProvider, useDoctorPortal, DoctorProfile, seedDoctor } from './doctorPortalData';
import { ClinicalWorkspaceProvider } from './doctorClinicalData';
import { PortalRoleProvider } from '../portal/PermissionGate';
import { DoctorAuth } from './DoctorAuth';
import { DoctorOnboarding } from './DoctorOnboarding';
import { DoctorWorkspace } from './DoctorWorkspace';

interface DoctorPortalAppProps {
  onBackToGlobalHealth: () => void;
}

type Phase = 'auth' | 'onboarding' | 'workspace';

const Inner: React.FC<DoctorPortalAppProps> = ({ onBackToGlobalHealth }) => {
  const { doctor, setDoctor } = useDoctorPortal();
  const [phase, setPhase] = useState<Phase>('auth');

  // Auth gate: portal data is only mounted inside the workspace after login.
  const enterWorkspace = (d: DoctorProfile) => {
    setDoctor(d);
    setPhase(d.verificationStatus === 'not_started' && !d.qualifications.length ? 'onboarding' : 'workspace');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {phase === 'auth' && (
        <DoctorAuth
          initialPhase="login"
          onBackToGlobalHealth={onBackToGlobalHealth}
          onLoginSuccess={enterWorkspace}
          onVerified={() => setPhase('onboarding')}
        />
      )}
      {phase === 'onboarding' && (
        <DoctorOnboarding
          workEmail={doctor.workEmail}
          onComplete={(d) => { setDoctor(d); setPhase('workspace'); }}
          onBack={() => setPhase('auth')}
        />
      )}
      {phase === 'workspace' && (
        <ClinicalWorkspaceProvider>
          <DoctorWorkspace onBackToGlobalHealth={onBackToGlobalHealth} onLogout={() => setPhase('auth')} />
        </ClinicalWorkspaceProvider>
      )}
    </div>
  );
};

export const DoctorPortalApp: React.FC<DoctorPortalAppProps> = ({ onBackToGlobalHealth }) => {
  return (
    <DoctorPortalProvider initialDoctor={seedDoctor}>
      <PortalRoleProvider role="DOCTOR">
        <Inner onBackToGlobalHealth={onBackToGlobalHealth} />
      </PortalRoleProvider>
    </DoctorPortalProvider>
  );
};
