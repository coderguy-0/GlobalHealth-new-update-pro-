import React from 'react';
import { DirectoryPage, HealthDirectoryPageProps } from './HealthDirectoryPage';

export type HospitalsViewProps = Omit<HealthDirectoryPageProps, 'section'>;

/**
 * Public Hospitals directory — route `#/hospitals`.
 *
 * A standalone page: its own hero, its own trust strip and only hospital
 * results. Visitors looking for a clinician are cross-linked to DoctorsView.
 */
export const HospitalsView: React.FC<HospitalsViewProps> = (props) => (
  <DirectoryPage {...props} section="hospitals" />
);
