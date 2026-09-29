import React, { useState } from 'react';
import {
  DoctorPortalProvider,
  DoctorProfile,
  seedDoctor,
  getActiveDoctorSession,
  setActiveDoctorSession,
  clearActiveDoctorSession,
} from './doctorPortalData';
import { ClinicalWorkspaceProvider } from './doctorClinicalData';
import { PortalRoleProvider } from '../portal/PermissionGate';
import { DoctorAuth } from './DoctorAuth';
import { DoctorOnboarding } from './DoctorOnboarding';
import { DoctorWorkspace } from './DoctorWorkspace';

interface DoctorPortalAppProps {
  onBackToGlobalHealth: () => void;
}

type Phase = 'auth' | 'onboarding' | 'workspace';

export const DoctorPortalApp: React.FC<DoctorPortalAppProps> = ({ onBackToGlobalHealth }) => {
  const [activeDoctor, setActiveDoctor] = useState<DoctorProfile>(() => {
    const sess = getActiveDoctorSession();
    return sess?.doctor || seedDoctor;
  });

  const [phase, setPhase] = useState<Phase>(() => {
    const sess = getActiveDoctorSession();
    if (!sess?.doctor) return 'auth';
    return sess.doctor.verificationStatus === 'not_started' && !sess.doctor.qualifications.length
      ? 'onboarding'
      : 'workspace';
  });

  const enterWorkspace = (d: DoctorProfile) => {
    setActiveDoctor(d);
    const needsOnboarding = d.verificationStatus === 'not_started' && !d.qualifications.length;
    setActiveDoctorSession({ doctor: d, onboardingDone: !needsOnboarding });
    setPhase(needsOnboarding ? 'onboarding' : 'workspace');
  };

  const handleLogout = () => {
    clearActiveDoctorSession();
    setPhase('auth');
  };

  return (
    <DoctorPortalProvider key={activeDoctor.id} initialDoctor={activeDoctor}>
      <PortalRoleProvider role="DOCTOR">
        <div className="min-h-screen bg-slate-50">
          {phase === 'auth' && (
            <DoctorAuth
              initialPhase="login"
              onBackToGlobalHealth={onBackToGlobalHealth}
              onLoginSuccess={enterWorkspace}
              onVerified={(d) => {
                if (d) {
                  enterWorkspace(d);
                } else {
                  setPhase('onboarding');
                }
              }}
            />
          )}
          {phase === 'onboarding' && (
            <DoctorOnboarding
              workEmail={activeDoctor.workEmail}
              onComplete={(d) => {
                setActiveDoctor(d);
                setActiveDoctorSession({ doctor: d, onboardingDone: true });
                setPhase('workspace');
              }}
              onBack={() => setPhase('auth')}
            />
          )}
          {phase === 'workspace' && (
            <ClinicalWorkspaceProvider key={activeDoctor.id}>
              <DoctorWorkspace onBackToGlobalHealth={onBackToGlobalHealth} onLogout={handleLogout} />
            </ClinicalWorkspaceProvider>
          )}
        </div>
      </PortalRoleProvider>
    </DoctorPortalProvider>
  );
};
