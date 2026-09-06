import React from 'react';
import { NavigationTab, UserAccount } from '../../types';
import { HeroSection } from '../HeroSection';
import { PrimaryActions } from './PrimaryActions';
import { SymptomTriageNavigator } from './SymptomTriageNavigator';
import { DoctorsSection } from './DoctorsSection';
import { MedicinesSection } from './MedicinesSection';
import { LabTestsSection } from './LabTestsSection';
import { MedicalMapSection } from './MedicalMapSection';
import { AIAssistantPromo } from './AIAssistantPromo';
import { InteractiveHealthToolsSection } from './InteractiveHealthToolsSection';
import { EcosystemSection } from './EcosystemSection';
import { ExploreHealthSection } from './ExploreHealthSection';
import { UpdatesSection } from './UpdatesSection';
import { CommunitySection } from './CommunitySection';
import { TrustSection } from './TrustSection';
import { PersonalHealthSpace } from './PersonalHealthSpace';
import { FinalCtaSection } from './FinalCtaSection';

interface HomePageProps {
  onTabChange: (tab: NavigationTab, mode?: 'details' | 'dashboard' | 'ehr' | 'saved') => void;
  currentUser: UserAccount | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenNewsArticle?: (articleId: string) => void;
}

/**
 * GlobalHealth Homepage — Structured in optimal clinical and patient discovery order,
 * with mathematical symmetry, rhythmic alternation, and modern UX design.
 */
export const HomePage: React.FC<HomePageProps> = ({
  onTabChange,
  currentUser,
  onOpenAuth,
  onOpenNewsArticle,
}) => {
  return (
    <div className="space-y-0">
      {/* 1. Hero & Universal Search Matrix */}
      <HeroSection onTabChange={onTabChange} />

      {/* 2. Rapid Access Action Matrix (8 Symmetrical Gateways) */}
      <PrimaryActions onTabChange={onTabChange} />

      {/* 3. Interactive Clinical Symptom & Specialty Navigator */}
      <SymptomTriageNavigator onTabChange={onTabChange} />

      {/* 4. Verified Healthcare Professionals & Specialists */}
      <DoctorsSection onTabChange={onTabChange} />

      {/* 5. Medicines, Dosages & Verified Pharmacy Fulfillment */}
      <MedicinesSection onTabChange={onTabChange} />

      {/* 6. Diagnostic Laboratory & Pathology Investigations */}
      <LabTestsSection onTabChange={onTabChange} />

      {/* 7. Geospatial Medical Map, Hospitals & Blood Bank Network */}
      <MedicalMapSection onTabChange={onTabChange} />

      {/* 8. Conversational Clinical AI Assistant */}
      <AIAssistantPromo onTabChange={onTabChange} />

      {/* 9. Live Vitality Simulator & Evidence-Based Health Calculators */}
      <InteractiveHealthToolsSection onTabChange={onTabChange} />

      {/* 10. Six Core Pillars of Connected Healthcare */}
      <EcosystemSection onTabChange={onTabChange} />

      {/* 11. Clinical Diseases & Health Guides Knowledge Base */}
      <ExploreHealthSection onTabChange={onTabChange} />

      {/* 12. Verified Healthcare Bulletins & Medical Research News */}
      <UpdatesSection onTabChange={onTabChange} onOpenArticle={onOpenNewsArticle} />

      {/* 13. Peer Support Circles & Clinician Q&A Community */}
      <CommunitySection onTabChange={onTabChange} />

      {/* 14. MedAuth™ Trust, Clinical Rigor & Privacy Architecture */}
      <TrustSection />

      {/* 15. Personal Health Space, FHIR EHR & Authenticated Vault */}
      <PersonalHealthSpace onTabChange={onTabChange} currentUser={currentUser} onOpenAuth={onOpenAuth} />

      {/* 16. Symmetrical Final Call-to-Action Supercard */}
      <FinalCtaSection onTabChange={onTabChange} currentUser={currentUser} onOpenAuth={onOpenAuth} />
    </div>
  );
};
