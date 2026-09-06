import React from 'react';
import { LanguageCode } from '../types';
import { AIWorkspace } from './ai/AIWorkspace';

interface AIAssistantViewProps {
  currentLanguage: LanguageCode;
  /** Optional prompt to pre-fill (e.g. from a disease page). */
  initialPrompt?: string;
  /** Mobile back button — leaves the workspace. */
  onBack?: () => void;
  /** Navigate to another GlobalHealth tab (action cards). */
  onNavigate?: (tab: string) => void;
  onLogout?: () => void;
  /**
   * The workspace stays mounted (hidden) while another tab is active so the
   * guest session conversation survives page navigation.
   */
  active?: boolean;
}

/**
 * Route host for the GlobalHealth AI Assistant workspace (/ai-assistant).
 * All workspace behavior lives in ./ai/AIWorkspace; this thin wrapper keeps
 * the App-level import and the hash route stable.
 */
export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  currentLanguage,
  initialPrompt,
  onBack = () => {},
  onNavigate = () => {},
  onLogout = async () => {},
  active = true,
}) => (
  <AIWorkspace
    currentLanguage={currentLanguage}
    initialPrompt={initialPrompt}
    onBack={onBack}
    onNavigate={onNavigate}
    onLogout={onLogout}
    active={active}
  />
);
