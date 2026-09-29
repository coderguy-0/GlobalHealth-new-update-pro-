import React, { useState } from 'react';
import {
  HospitalPortalProvider,
  HospitalOrganization,
  StaffRole,
  seedOrganizations,
  getActiveHospitalSession,
  setActiveHospitalSession,
  clearActiveHospitalSession,
} from './hospitalPortalData';
import { PortalRoleProvider } from '../portal/PermissionGate';
import { portalRoleForStaffRole } from '../../core/hospitalAccess';
import { HospitalAuth } from './HospitalAuth';
import { HospitalOnboarding } from './HospitalOnboarding';
import { HospitalWorkspace } from './HospitalWorkspace';

interface HospitalPortalAppProps {
  onBackToGlobalHealth: () => void;
}

type Phase = 'auth' | 'onboarding' | 'workspace';

export const HospitalPortalApp: React.FC<HospitalPortalAppProps> = ({ onBackToGlobalHealth }) => {
  const [activeOrgs, setActiveOrgs] = useState<HospitalOrganization[]>(() => {
    const sess = getActiveHospitalSession();
    return sess?.organizations?.length ? sess.organizations : seedOrganizations;
  });

  const [activeRole, setActiveRole] = useState<StaffRole>(() => {
    const sess = getActiveHospitalSession();
    return sess?.staffRole || 'owner';
  });

  const [phase, setPhase] = useState<Phase>(() => {
    const sess = getActiveHospitalSession();
    if (!sess?.organizations?.length) return 'auth';
    return sess.organizations[0]?.legalName ? 'workspace' : 'onboarding';
  });

  const enterWorkspace = (orgs: HospitalOrganization[], role: StaffRole) => {
    setActiveOrgs(orgs);
    setActiveRole(role);
    setActiveHospitalSession({
      accountId: `hosp-acct-${orgs[0]?.id || 'default'}`,
      email: orgs[0]?.publicEmail || '',
      organizations: orgs,
      staffRole: role,
    });
    setPhase(orgs[0]?.legalName ? 'workspace' : 'onboarding');
  };

  const handleLogout = () => {
    clearActiveHospitalSession();
    setPhase('auth');
  };

  const primaryOrg = activeOrgs[0] ?? seedOrganizations[0];
  const portalRole = portalRoleForStaffRole(activeRole);

  return (
    <HospitalPortalProvider key={primaryOrg.id} initialOrganizations={activeOrgs} initialRole={activeRole}>
      <PortalRoleProvider role={portalRole}>
        <div className="min-h-screen bg-slate-50">
          {phase === 'auth' && (
            <HospitalAuth
              onBackToGlobalHealth={onBackToGlobalHealth}
              onLoginSuccess={enterWorkspace}
            />
          )}
          {phase === 'onboarding' && (
            <HospitalOnboarding
              workEmail={primaryOrg.publicEmail}
              onComplete={(h: HospitalOrganization) => {
                setActiveOrgs([h]);
                setActiveRole('owner');
                setActiveHospitalSession({
                  accountId: `hosp-acct-${h.id}`,
                  email: h.publicEmail,
                  organizations: [h],
                  staffRole: 'owner',
                });
                setPhase('workspace');
              }}
              onBack={() => setPhase('auth')}
            />
          )}
          {phase === 'workspace' && (
            <HospitalWorkspace onBackToGlobalHealth={onBackToGlobalHealth} onLogout={handleLogout} />
          )}
        </div>
      </PortalRoleProvider>
    </HospitalPortalProvider>
  );
};
