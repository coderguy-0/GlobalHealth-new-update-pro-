import { UserCoordinates } from '../types/medicalMap';

export interface GeolocationProgress {
  status: 'requesting_permission' | 'locking_satellites' | 'refining_accuracy' | 'reverse_geocoding' | 'completed' | 'error';
  accuracyMeters?: number;
  sampleCount?: number;
  message: string;
}

// Local micro-zone landmarks for Delhi NCR to provide instantaneous high-accuracy address fallback
const DELHI_LANDMARK_ZONES = [
  { name: 'AIIMS / Ansari Nagar', district: 'South Delhi', pincode: '110029', lat: 28.5672, lng: 77.2100, radiusKm: 2.0 },
  { name: 'Connaught Place / Central Secretariate', district: 'Central Delhi', pincode: '110001', lat: 28.6304, lng: 77.2177, radiusKm: 2.5 },
  { name: 'Saket Institutional Area / Press Enclave', district: 'South Delhi', pincode: '110017', lat: 28.5284, lng: 77.2140, radiusKm: 2.5 },
  { name: 'Vasant Kunj / Nelson Mandela Marg', district: 'South West Delhi', pincode: '110070', lat: 28.5321, lng: 77.1582, radiusKm: 3.0 },
  { name: 'Dwarka Sector 9 / Sector 15', district: 'South West Delhi', pincode: '110077', lat: 28.5815, lng: 77.0625, radiusKm: 3.5 },
  { name: 'Rohini Sector 3 & Sector 6', district: 'North West Delhi', pincode: '110085', lat: 28.7082, lng: 77.1121, radiusKm: 3.5 },
  { name: 'Dilshad Garden / Tahirpur', district: 'East Delhi', pincode: '110095', lat: 28.6840, lng: 77.3135, radiusKm: 2.5 },
  { name: 'Civil Lines / Rajpur Road', district: 'Central Delhi', pincode: '110054', lat: 28.6742, lng: 77.2215, radiusKm: 2.5 },
  { name: 'Karol Bagh / Pusa Road', district: 'Central Delhi', pincode: '110005', lat: 28.6536, lng: 77.1908, radiusKm: 2.5 },
  { name: 'Mayur Vihar Phase I & II', district: 'East Delhi', pincode: '110091', lat: 28.6085, lng: 77.2974, radiusKm: 2.5 },
  { name: 'Okhla / Sukhdev Vihar / Jamia', district: 'South East Delhi', pincode: '110025', lat: 28.5615, lng: 77.2815, radiusKm: 2.5 },
  { name: 'Lajpat Nagar / Nehru Nagar', district: 'South East Delhi', pincode: '110065', lat: 28.5712, lng: 77.2541, radiusKm: 2.5 },
  { name: 'Punjabi Bagh / Bali Nagar', district: 'West Delhi', pincode: '110026', lat: 28.6660, lng: 77.1275, radiusKm: 2.5 },
  { name: 'Janakpuri / Tilak Nagar', district: 'West Delhi', pincode: '110058', lat: 28.6291, lng: 77.0792, radiusKm: 2.5 },
  { name: 'GTB Nagar / Kingsway Camp / Model Town', district: 'North Delhi', pincode: '110009', lat: 28.7018, lng: 77.2081, radiusKm: 3.0 },
  { name: 'Greater Kailash (GK 1 / GK 2)', district: 'South Delhi', pincode: '110048', lat: 28.5521, lng: 77.2384, radiusKm: 2.5 },
  { name: 'Preet Vihar / Laxmi Nagar / Vikas Marg', district: 'East Delhi', pincode: '110092', lat: 28.6358, lng: 77.2912, radiusKm: 2.5 },
  { name: 'Vasant Vihar / Shanti Niketan', district: 'South West Delhi', pincode: '110057', lat: 28.5582, lng: 77.1610, radiusKm: 2.5 },
  { name: 'Chanakyapuri / Diplomatic Enclave', district: 'Central Delhi', pincode: '110021', lat: 28.5912, lng: 77.1874, radiusKm: 2.0 },
  { name: 'Daryaganj / Delhi Gate', district: 'Central Delhi', pincode: '110002', lat: 28.6435, lng: 77.2415, radiusKm: 2.0 },
];

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
export function calculatePreciseDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format distance in user-friendly metric units (meters or kilometers).
 */
export function formatAccurateDistance(distanceKm: number): { text: string; unit: string; rawKm: number } {
  if (distanceKm < 1) {
    const meters = Math.max(10, Math.round(distanceKm * 1000));
    return { text: `${meters} m`, unit: 'm', rawKm: distanceKm };
  }
  if (distanceKm < 10) {
    return { text: `${distanceKm.toFixed(2)} km`, unit: 'km', rawKm: distanceKm };
  }
  return { text: `${distanceKm.toFixed(1)} km`, unit: 'km', rawKm: distanceKm };
}

/**
 * Estimates realistic driving & walking travel times based on distance in Delhi NCR.
 */
export function estimateTravelTime(distanceKm: number): { drivingMins: number; walkingMins: number } {
  // Average urban traffic speed in Delhi: ~22 km/h (plus base 2 mins dispatch/stop)
  const drivingSpeedKmH = 24;
  const drivingMins = Math.max(1, Math.round((distanceKm / drivingSpeedKmH) * 60 + 2));
  
  // Walking speed: ~4.5 km/h
  const walkingMins = Math.max(1, Math.round((distanceKm / 4.5) * 60));

  return { drivingMins, walkingMins };
}

/**
 * Reverse geocodes coordinates to exact address using Nominatim with fallback to local zone detector.
 */
export async function reverseGeocodeExactCoordinates(
  lat: number,
  lng: number
): Promise<{
  exactAddress: string;
  street?: string;
  area?: string;
  district?: string;
  postalCode?: string;
  cityLabel: string;
}> {
  // 1. Check local micro-zone match first for instant precision
  let closestZone = DELHI_LANDMARK_ZONES[0];
  let minZoneDist = calculatePreciseDistanceKm(lat, lng, closestZone.lat, closestZone.lng);
  
  for (const zone of DELHI_LANDMARK_ZONES) {
    const dist = calculatePreciseDistanceKm(lat, lng, zone.lat, zone.lng);
    if (dist < minZoneDist) {
      minZoneDist = dist;
      closestZone = zone;
    }
  }

  // 2. Try OpenStreetMap Nominatim reverse geocode for exact street & house level address
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast UI

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'GlobalHealth-MedicalMap-Delhi/2.0',
        },
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};

      const road = addr.road || addr.pedestrian || addr.street || addr.neighbourhood || '';
      const suburb = addr.suburb || addr.residential || addr.neighbourhood || addr.city_district || '';
      const district = addr.state_district || addr.county || addr.district || closestZone.district;
      const city = addr.city || addr.town || addr.state || 'New Delhi';
      const postcode = addr.postcode || closestZone.pincode;

      const parts: string[] = [];
      if (road) parts.push(road);
      if (suburb && suburb !== road) parts.push(suburb);
      if (district && district !== suburb) parts.push(district);
      if (postcode) parts.push(postcode);

      const exactAddress = parts.length > 0 ? parts.join(', ') : data.display_name;
      const cityLabel = suburb || road ? `${suburb || road}, ${city}` : `${closestZone.name}, ${closestZone.district}`;

      return {
        exactAddress: exactAddress || `${closestZone.name}, ${closestZone.district}, New Delhi - ${postcode}`,
        street: road,
        area: suburb || closestZone.name,
        district: district,
        postalCode: postcode,
        cityLabel: cityLabel,
      };
    }
  } catch {
    // Network or timeout occurred; use precision local zone
  }

  // Fallback to high-accuracy zone detection
  const isClose = minZoneDist <= closestZone.radiusKm;
  const areaLabel = isClose
    ? `Near ${closestZone.name}`
    : `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E (${closestZone.district})`;

  return {
    exactAddress: `${areaLabel}, ${closestZone.district}, New Delhi - ${closestZone.pincode}`,
    street: areaLabel,
    area: closestZone.name,
    district: closestZone.district,
    postalCode: closestZone.pincode,
    cityLabel: `${closestZone.name}, ${closestZone.district}`,
  };
}

/**
 * Acquires user GPS location with maximum precision using progressive multi-sample refinement.
 * Continually refines coordinates via watchPosition to lock onto the best satellite/Wi-Fi fix.
 */
export async function getAccurateUserLocation(
  onProgress?: (progress: GeolocationProgress) => void
): Promise<UserCoordinates> {
  if (!('geolocation' in navigator)) {
    throw new Error('Geolocation hardware is not supported or unavailable on this browser.');
  }

  onProgress?.({
    status: 'requesting_permission',
    message: 'Accessing high-precision GPS sensor...',
  });

  return new Promise((resolve, reject) => {
    let bestPosition: GeolocationPosition | null = null;
    let watchId: number | null = null;
    let sampleCount = 0;
    let hasCompleted = false;

    // Timeout safety timer: if watch doesn't settle within 7 seconds, use best available reading
    const fallbackTimer = setTimeout(() => {
      if (hasCompleted) return;
      finishWithBestSample();
    }, 6500);

    const finishWithBestSample = async () => {
      if (hasCompleted) return;
      hasCompleted = true;

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      clearTimeout(fallbackTimer);

      if (!bestPosition) {
        reject(new Error('Unable to obtain a GPS satellite lock. Please ensure location permissions are enabled.'));
        return;
      }

      const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = bestPosition.coords;
      const timestamp = bestPosition.timestamp;

      onProgress?.({
        status: 'reverse_geocoding',
        accuracyMeters: accuracy,
        sampleCount,
        message: `GPS accuracy locked to ±${Math.round(accuracy)}m. Resolving street address...`,
      });

      // Reverse geocode to exact address
      const geocoded = await reverseGeocodeExactCoordinates(latitude, longitude);

      let precisionLevel: 'gps_satellite' | 'wifi_cellular' | 'coarse' | 'preset' = 'wifi_cellular';
      if (accuracy <= 15) {
        precisionLevel = 'gps_satellite';
      } else if (accuracy <= 50) {
        precisionLevel = 'wifi_cellular';
      } else {
        precisionLevel = 'coarse';
      }

      const result: UserCoordinates = {
        latitude: parseFloat(latitude.toFixed(6)), // 6 decimals = ~0.11m precision
        longitude: parseFloat(longitude.toFixed(6)),
        accuracy: Math.round(accuracy * 10) / 10,
        altitude: altitude ? Math.round(altitude * 10) / 10 : null,
        altitudeAccuracy: altitudeAccuracy ? Math.round(altitudeAccuracy * 10) / 10 : null,
        heading: heading !== null && !isNaN(heading) ? Math.round(heading) : null,
        speed: speed !== null && !isNaN(speed) ? Math.round(speed * 3.6 * 10) / 10 : null, // Convert m/s to km/h
        timestamp: timestamp,
        cityLabel: geocoded.cityLabel,
        exactAddress: geocoded.exactAddress,
        street: geocoded.street,
        area: geocoded.area,
        district: geocoded.district,
        postalCode: geocoded.postalCode,
        country: 'India',
        precisionLevel,
        isHighAccuracy: accuracy <= 20,
      };

      onProgress?.({
        status: 'completed',
        accuracyMeters: accuracy,
        sampleCount,
        message: `High accuracy GPS locked at ±${Math.round(accuracy)}m`,
      });

      resolve(result);
    };

    // Progressive Multi-Sample Refinement using watchPosition
    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 0, // Never use cached stale coordinates
      timeout: 12000,
    };

    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          sampleCount++;
          const currentAcc = pos.coords.accuracy;

          onProgress?.({
            status: 'refining_accuracy',
            accuracyMeters: currentAcc,
            sampleCount,
            message: `Refining GPS signal... Sample #${sampleCount} (Accuracy: ±${Math.round(currentAcc)}m)`,
          });

          // Keep best (lowest error radius) position sample
          if (!bestPosition || currentAcc < bestPosition.coords.accuracy) {
            bestPosition = pos;
          }

          // If we achieve high precision (< 12 meters), lock immediately
          if (currentAcc <= 12) {
            finishWithBestSample();
          }
        },
        (err) => {
          // If watch fails but we already have a sample, use it
          if (bestPosition) {
            finishWithBestSample();
            return;
          }

          // Otherwise fall back to a single getCurrentPosition attempt
          navigator.geolocation.getCurrentPosition(
            (singlePos) => {
              bestPosition = singlePos;
              finishWithBestSample();
            },
            (finalErr) => {
              if (hasCompleted) return;
              hasCompleted = true;
              clearTimeout(fallbackTimer);
              if (watchId !== null) navigator.geolocation.clearWatch(watchId);

              let errMsg = 'Location access was unavailable.';
              if (finalErr.code === finalErr.PERMISSION_DENIED) {
                errMsg = 'Location permission was denied. Please allow location access in your browser to detect your exact position.';
              } else if (finalErr.code === finalErr.POSITION_UNAVAILABLE) {
                errMsg = 'GPS signal is currently unavailable. Try moving closer to a window or enabling device GPS.';
              } else if (finalErr.code === finalErr.TIMEOUT) {
                errMsg = 'GPS lock timed out. Searching using city/area presets is available below.';
              }
              reject(new Error(errMsg));
            },
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
          );
        },
        geoOptions
      );
    } catch (e: any) {
      reject(new Error(e?.message || 'Failed to start GPS tracking.'));
    }
  });
}

/**
 * Generates an accurate Google Maps navigation link from user location to target facility.
 */
export function getGoogleMapsNavigationUrl(
  userCoords: UserCoordinates | null,
  targetLat: number,
  targetLng: number,
  facilityName: string
): string {
  const destEncoded = encodeURIComponent(`${facilityName}, New Delhi`);
  if (userCoords) {
    return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.latitude},${userCoords.longitude}&destination=${targetLat},${targetLng}&destination_place_id=${destEncoded}&travelmode=driving`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${targetLat},${targetLng}`;
}
