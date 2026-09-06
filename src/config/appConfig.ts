/**
 * Centralized Application Configuration & URLs
 *
 * Deployment-Aware External Destinations:
 * This file is the single source of truth for external portal destinations.
 * URLs are resolved from environment variables if defined (e.g. VITE_HOSPITAL_PORTAL_URL),
 * with universal production fallbacks so no manual code editing is required across
 * local dev, preview, or production deployments.
 */

export const HOSPITAL_PORTAL_URL: string =
  (import.meta.env.VITE_HOSPITAL_PORTAL_URL as string) ||
  'https://spiffy-pixie-d322e4.netlify.app/';

export const DOCTOR_PORTAL_URL: string =
  (import.meta.env.VITE_DOCTOR_PORTAL_URL as string) ||
  'https://resplendent-crepe-53b1c1.netlify.app/';
