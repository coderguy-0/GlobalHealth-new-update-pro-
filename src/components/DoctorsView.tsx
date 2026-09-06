import React from 'react';
import { DirectoryPage, HealthDirectoryPageProps } from './HealthDirectoryPage';

export type DoctorsViewProps = Omit<HealthDirectoryPageProps, 'section'>;

/**
 * Public Doctors & Specialists directory — route `#/doctors`.
 *
 * A standalone page: its own hero, its own trust strip and only doctor
 * results. Visitors looking for a facility are cross-linked to HospitalsView.
 */
export const DoctorsView: React.FC<DoctorsViewProps> = (props) => (
  <DirectoryPage {...props} section="doctors" />
);
