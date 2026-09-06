import { MedicalMapFacility } from '../types/medicalMap';
import { DELHI_DIRECTORY_PART1 } from './facilities/delhiDirectoryPart1';
import { DELHI_DIRECTORY_PART2 } from './facilities/delhiDirectoryPart2';
import { DELHI_DIRECTORY_PART3 } from './facilities/delhiDirectoryPart3';
import { DELHI_GOVERNMENT_FACILITIES } from './facilities/delhiGovernmentFacilities';

// Combined master verified registry of Delhi healthcare institutions
export const MEDICAL_MAP_FACILITIES: MedicalMapFacility[] = [
  ...DELHI_DIRECTORY_PART1,
  ...DELHI_DIRECTORY_PART2,
  ...DELHI_DIRECTORY_PART3,
  ...DELHI_GOVERNMENT_FACILITIES
];

export const calculateHaversineDistanceKm = calculateDistanceKm;
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function isFacilityCurrentlyOpen(facility: MedicalMapFacility): boolean {
  if (facility.operatingHours.isOpen24x7) return true;
  if (!facility.operatingHours.openTime || !facility.operatingHours.closeTime) return true;

  try {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    const [openH, openM] = facility.operatingHours.openTime.split(':').map(Number);
    const [closeH, closeM] = facility.operatingHours.closeTime.split(':').map(Number);

    const openTotal = openH * 60 + (openM || 0);
    const closeTotal = closeH * 60 + (closeM || 0);

    return currentTotalMinutes >= openTotal && currentTotalMinutes <= closeTotal;
  } catch {
    return true;
  }
}
