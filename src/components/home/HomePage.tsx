import React from 'react';
import { NavigationTab, UserAccount } from '../../types';
import { HeroSection } from '../HeroSection';
import { PrimaryActions } from './PrimaryActions';
import { EcosystemSection } from './EcosystemSection';
import { TrustSection } from './TrustSection';
import { AIAssistantPromo } from './AIAssistantPromo';
import { ExploreHealthSection } from './ExploreHealthSection';
import { MedicinesSection } from './MedicinesSection';
import { DoctorsSection } from './DoctorsSection';
import { MedicalMapSection } from './MedicalMapSection';
import { LabTestsSection } from './LabTestsSection';
import { UpdatesSection } from './UpdatesSection';
import { CommunitySection } from './CommunitySection';
import { PersonalHealthSpace } from './PersonalHealthSpace';
import { FinalCtaSection } from './FinalCtaSection';

interface HomePageProps {
  onTabChange: (tab: NavigationTab, mode?: 'details' | 'dashboard' | 'ehr' | 'saved') => void;
  currentUser: UserAccount | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenNewsArticle?: (articleId: string) => void;
}

/**
 * GlobalHealth homepage — composed in the spec's information order:
 * header, hero, global search, primary actions, ecosystem, trust, AI assistant,
 * health information, medicines, doctors, medical map, lab tests, healthcare
 * updates, community, personal health space, final CTA, footer.
 */
export const HomePage: React.FC<HomePageProps> = ({ onTabChange, currentUser, onOpenAuth, onOpenNewsArticle }) => {
  return (
    <>
      <HeroSection onTabChange={onTabChange} />
      <PrimaryActions onTabChange={onTabChange} />
      <EcosystemSection onTabChange={onTabChange} />
      <TrustSection />
      <AIAssistantPromo onTabChange={onTabChange} />
      <ExploreHealthSection onTabChange={onTabChange} />
      <MedicinesSection onTabChange={onTabChange} />
      <DoctorsSection onTabChange={onTabChange} />
      <MedicalMapSection onTabChange={onTabChange} />
      <LabTestsSection onTabChange={onTabChange} />
      <UpdatesSection onTabChange={onTabChange} onOpenArticle={onOpenNewsArticle} />
      <CommunitySection onTabChange={onTabChange} />
      <PersonalHealthSpace onTabChange={onTabChange} currentUser={currentUser} onOpenAuth={onOpenAuth} />
      <FinalCtaSection onTabChange={onTabChange} currentUser={currentUser} onOpenAuth={onOpenAuth} />
    </>
  );
};
