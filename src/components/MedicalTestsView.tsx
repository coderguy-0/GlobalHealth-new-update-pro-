import React from 'react';
import { LabTestsWorkspace } from './medical-tests/LabTestsWorkspace';
import { NavigationTab } from '../types';

interface MedicalTestsViewProps {
  onNavigate?: (tab: NavigationTab) => void;
  onAskAI?: (prompt: string) => void;
  currentUser?: any;
}

export const MedicalTestsView: React.FC<MedicalTestsViewProps> = ({
  onNavigate,
  onAskAI,
  currentUser
}) => {
  return (
    <LabTestsWorkspace
      onNavigate={onNavigate}
      onAskAI={onAskAI}
      currentUser={currentUser}
    />
  );
};

export default MedicalTestsView;
