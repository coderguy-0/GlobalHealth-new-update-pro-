// Central policy versioning for GlobalHealth.
//
// Every account records WHICH version of the Terms and Privacy Policy it
// accepted (never just "termsAccepted = true"). When these versions change,
// the platform can show an "Updated Terms & Conditions" re-acceptance flow
// instead of silently pretending the user accepted the new text.
//
// IMPORTANT (pre-launch): replace the legal-entity placeholders below with
// the actual GlobalHealth legal entity details. Do not claim legal
// compliance without a real legal review.

export const TERMS_VERSION = 'GH-TC-2026-01';
export const PRIVACY_VERSION = 'GH-PP-2026-01';

/** Date the current versions went into effect (display on the legal pages). */
export const TERMS_EFFECTIVE_DATE = 'January 1, 2026';
export const PRIVACY_EFFECTIVE_DATE = 'January 1, 2026';

export interface PolicyVersionInfo {
  termsVersion: string;
  privacyVersion: string;
}

export const CURRENT_POLICY_VERSIONS: PolicyVersionInfo = {
  termsVersion: TERMS_VERSION,
  privacyVersion: PRIVACY_VERSION,
};

// Legal placeholders — replaced before production launch with real details.
export const LEGAL_PLACEHOLDERS = {
  legalEntity: '[INSERT LEGAL ENTITY]',
  registeredAddress: '[INSERT REGISTERED ADDRESS]',
  supportEmail: '[INSERT SUPPORT EMAIL]',
  privacyEmail: '[INSERT PRIVACY EMAIL]',
  grievanceContact: '[INSERT GRIEVANCE CONTACT]',
  website: '[INSERT WEBSITE]',
} as const;
