import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  MapPin,
  Search,
  Locate,
  Filter,
  SlidersHorizontal,
  Building2,
  Stethoscope,
  Building,
  HeartHandshake,
  Zap,
  Sparkles,
  ShieldCheck,
  Navigation,
  Clock,
  ChevronDown,
  RotateCcw,
  Info,
  Map as MapIcon,
  List,
  AlertCircle,
  X,
  ExternalLink,
  Copy,
  Check,
  Crosshair,
  Satellite,
  Compass
} from 'lucide-react';
import {
  MedicalMapFacility,
  MedicalFacilityType,
  MedicalMapSortOption,
  FacilityOwnership,
  UserCoordinates,
  PERMITTED_FACILITY_TYPES
} from '../../types/medicalMap';
import {
  MEDICAL_MAP_FACILITIES,
  calculateHaversineDistanceKm,
  isFacilityCurrentlyOpen
} from '../../data/medicalMapData';
import {
  getAccurateUserLocation,
  getGoogleMapsNavigationUrl,
  calculatePreciseDistanceKm,
  formatAccurateDistance,
  estimateTravelTime,
  GeolocationProgress
} from '../../utils/geolocationService';
import { MedicalMapCard, getCategoryIcon } from './MedicalMapCard';
import { MedicalMapInteractive } from './MedicalMapInteractive';
import { MedicalMapDetailModal } from './MedicalMapDetailModal';
import { fetchPublicHospitals } from '../../services/hospitalRegistryClient';

interface MedicalMapViewProps {
  onNavigateToHospitalProfile?: (hospitalProfileId: string) => void;
}

const CITY_PRESETS = [
  { label: 'Central Delhi', lat: 28.6369, lng: 77.2407 },
  { label: 'North East Delhi', lat: 28.6836, lng: 77.3113 },
  { label: 'South Delhi', lat: 28.5369, lng: 77.2091 },
  { label: 'West Delhi', lat: 28.6271, lng: 77.1084 },
  { label: 'North West Delhi', lat: 28.7126, lng: 77.1189 },
  { label: 'East Delhi', lat: 28.6542, lng: 77.2987 },
];

export const MedicalMapView: React.FC<MedicalMapViewProps> = ({
  onNavigateToHospitalProfile,
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MedicalFacilityType | 'ALL'>('ALL');
  const [selectedOwnership, setSelectedOwnership] = useState<FacilityOwnership | 'ALL'>('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState<string | 'ALL'>('ALL');
  const [distanceRadiusKm, setDistanceRadiusKm] = useState<number | 'ALL'>('ALL');
  const [openNowOnly, setOpenNowOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [ewsOnly, setEwsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<MedicalMapSortOption>('recommended');

  // Location State
  const [userCoordinates, setUserCoordinates] = useState<UserCoordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locatingProgress, setLocatingProgress] = useState<GeolocationProgress | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Selected & Modal State
  const [selectedFacility, setSelectedFacility] = useState<MedicalMapFacility | null>(null);
  const [detailFacility, setDetailFacility] = useState<MedicalMapFacility | null>(null);
  const [showVerificationInfoModal, setShowVerificationInfoModal] = useState(false);

  // Mobile View Toggle
  const [mobileViewMode, setMobileViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Ref for card scroll container
  const listContainerRef = useRef<HTMLDivElement>(null);

  // High Precision Geolocation Handler
  const handleRequestUserLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    setLocatingProgress({
      status: 'requesting_permission',
      message: 'Accessing high-precision GPS hardware...',
    });

    try {
      const coords = await getAccurateUserLocation((progress) => {
        setLocatingProgress(progress);
      });

      setUserCoordinates(coords);
      setSortBy('nearest'); // Automatically sort closest facilities first
      setIsLocating(false);
      setLocatingProgress(null);
    } catch (err: any) {
      setIsLocating(false);
      setLocatingProgress(null);
      setLocationError(
        err?.message || 'Location access is unavailable. You can search or select a city preset below.'
      );
    }
  };

  const handleSelectCityPreset = (preset: typeof CITY_PRESETS[0]) => {
    setUserCoordinates({
      latitude: preset.lat,
      longitude: preset.lng,
      cityLabel: preset.label,
      exactAddress: `${preset.label}, New Delhi, India`,
      district: preset.label,
      precisionLevel: 'preset',
      accuracy: 500,
    });
    setSortBy('nearest');
    setLocationError(null);
  };

  const handleClearLocation = () => {
    setUserCoordinates(null);
    setLocationError(null);
    setSortBy('recommended');
  };

  const handleCopyCoordinates = () => {
    if (!userCoordinates) return;
    const text = `${userCoordinates.latitude.toFixed(6)}, ${userCoordinates.longitude.toFixed(6)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  // -----------------------------------------------------------------------
  // LIVE central hospital registry overlay. Hospital portals publish their
  // location/identity to the central registry; the map merges those records
  // fresh on every open — new hospitals appear as markers and a hospital that
  // moves updates its marker automatically (keyed by hospitalId, never name).
  // -----------------------------------------------------------------------
  const [registryFacilities, setRegistryFacilities] = useState<MedicalMapFacility[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicHospitals().then((res) => {
      if (cancelled || !res.ok) return;
      const overlays: MedicalMapFacility[] = res.hospitals.map((rec) => ({
        id: rec.hospitalId,
        facilityIdCode: rec.hospitalId,
        facilityName: rec.identity.name,
        facilityType: 'HOSPITAL' as MedicalFacilityType,
        ownership: (rec.identity.ownership === 'Government / Public'
          ? 'Government'
          : rec.identity.ownership === 'Trust / Non-Profit' ? 'Trust' : 'Private') as FacilityOwnership,
        category: rec.identity.hospitalType,
        district: rec.location.state,
        pincode: rec.location.postalCode,
        bedCount: rec.bedsFacilities.totalBeds,
        registrationNo: rec.identity.registrationNo,
        source: 'GlobalHealth Central Hospital Registry',
        lastVerified: rec.lastUpdated?.split('T')[0],
        verificationStatus: rec.identity.verificationStatus === 'Verified' ? 'Verified' : 'Pending Verification',
        verificationDetails: {
          verifiedByAuthority: 'GlobalHealth Registry',
          licenseNumber: rec.identity.registrationNo,
          auditDate: rec.lastUpdated?.split('T')[0] || '',
          accreditation: rec.accreditation.filter((a) => a.status === 'VERIFIED').map((a) => `${a.body} ${a.name}`),
          verificationBadge: 'Registry Synced'
        },
        address: {
          street: rec.location.streetAddress,
          area: rec.location.area || rec.location.city,
          city: rec.location.city,
          state: rec.location.state,
          postalCode: rec.location.postalCode,
          country: rec.location.country,
          landmark: rec.location.landmark || undefined
        },
        latitude: rec.location.latitude,
        longitude: rec.location.longitude,
        phone: rec.contact.mainPhone,
        emergencyPhone: rec.contact.emergencyPhone,
        website: rec.contact.website,
        operatingHours: {
          isOpen24x7: rec.contact.generalHours.toLowerCase().includes('24'),
          scheduleText: rec.contact.opdHours || rec.contact.generalHours,
          emergencyAvailable24x7: rec.contact.emergencyHours.toLowerCase().includes('24')
        },
        services: rec.services.filter((s) => s.status === 'ACTIVE').map((s) => s.name),
        departments: rec.departments.filter((d) => d.status === 'ACTIVE').map((d) => d.name),
        accessibility: {
          wheelchairAccessible: true,
          emergencyRamp: true,
          accessibleParking: rec.bedsFacilities.parkingAvailable,
          elevatorAccess: true
        },
        emergencyServices: rec.bedsFacilities.ambulanceServices || rec.contact.emergencyHours.toLowerCase().includes('24'),
        emergencyLevel: rec.identity.traumaLevel,
        bedsAvailable: rec.bedsFacilities.publishLiveAvailability ? rec.bedsFacilities.availableBeds : undefined,
        about: rec.identity.description,
        createdAt: rec.lastUpdated,
        updatedAt: rec.lastUpdated
      } as MedicalMapFacility));
      if (!cancelled) setRegistryFacilities(overlays);
    });
    return () => { cancelled = true; };
  }, []);

  // Registry records are keyed by hospitalId and OVERRIDE any seed marker for
  // the same hospital — the registry is the source of truth.
  const allFacilities = useMemo(() => {
    const map = new Map<string, MedicalMapFacility>();
    MEDICAL_MAP_FACILITIES.forEach((f) => map.set(f.id, f));
    registryFacilities.forEach((f) => map.set(f.id, f));
    return Array.from(map.values());
  }, [registryFacilities]);

  // Filter and compute distances
  const filteredFacilities = useMemo(() => {
    return allFacilities
      // Strict backend/frontend validation: ONLY permitted 6 categories
      .filter((fac) => PERMITTED_FACILITY_TYPES.includes(fac.facilityType))
      .map((facility) => {
        if (userCoordinates) {
          const dist = calculatePreciseDistanceKm(
            userCoordinates.latitude,
            userCoordinates.longitude,
            facility.latitude,
            facility.longitude
          );
          // Round to 2 decimals for precision
          return { ...facility, distanceKm: Math.round(dist * 100) / 100 };
        }
        return facility;
      })
      .filter((facility) => {
        // Category Filter
        if (selectedCategory !== 'ALL' && facility.facilityType !== selectedCategory) {
          return false;
        }

        // Ownership Filter (Government, Society, Private, Trust)
        if (selectedOwnership !== 'ALL' && facility.ownership !== selectedOwnership) {
          return false;
        }

        // District Filter
        if (selectedDistrict !== 'ALL' && facility.district !== selectedDistrict) {
          return false;
        }

        // EWS Quota Filter
        if (ewsOnly && !facility.ewsAvailable) {
          return false;
        }

        // Verified Only Filter
        if (verifiedOnly && facility.verificationStatus !== 'Verified') {
          return false;
        }

        // Open Now Filter
        if (openNowOnly && !isFacilityCurrentlyOpen(facility)) {
          return false;
        }

        // Emergency Only Filter
        if (emergencyOnly && !facility.emergencyServices) {
          return false;
        }

        // Distance Radius Filter
        if (distanceRadiusKm !== 'ALL' && facility.distanceKm !== undefined) {
          if (facility.distanceKm > distanceRadiusKm) {
            return false;
          }
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = facility.facilityName.toLowerCase().includes(q);
          const matchCode = facility.facilityIdCode?.toLowerCase().includes(q) ?? false;
          const matchDistrict = facility.district?.toLowerCase().includes(q) ?? false;
          const matchPincode = facility.pincode?.includes(q) ?? false;
          const matchCity = facility.address.city.toLowerCase().includes(q);
          const matchArea = facility.address.area.toLowerCase().includes(q);
          const matchState = facility.address.state.toLowerCase().includes(q);
          const matchPostal = facility.address.postalCode.toLowerCase().includes(q);
          const matchStreet = facility.address.street.toLowerCase().includes(q);
          const matchSpecialty = facility.specialtyType?.toLowerCase().includes(q) ?? false;
          const matchServices = facility.services.some((s) => s.toLowerCase().includes(q));
          const matchDepts = facility.departments?.some((d) => d.toLowerCase().includes(q)) ?? false;

          if (
            !matchName &&
            !matchCode &&
            !matchDistrict &&
            !matchPincode &&
            !matchCity &&
            !matchArea &&
            !matchState &&
            !matchPostal &&
            !matchStreet &&
            !matchSpecialty &&
            !matchServices &&
            !matchDepts
          ) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'beds_desc') {
          return (b.bedCount || 0) - (a.bedCount || 0);
        }
        if (sortBy === 'nearest') {
          if (a.distanceKm !== undefined && b.distanceKm !== undefined) {
            return a.distanceKm - b.distanceKm;
          }
          return 0;
        }
        if (sortBy === 'name_asc') {
          return a.facilityName.localeCompare(b.facilityName);
        }
        if (sortBy === 'open_now') {
          const aOpen = isFacilityCurrentlyOpen(a);
          const bOpen = isFacilityCurrentlyOpen(b);
          if (aOpen && !bOpen) return -1;
          if (!aOpen && bOpen) return 1;
          return 0;
        }
        if (sortBy === 'recently_verified') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        // Default: Recommended (Rating & Verification priority)
        const aScore = (a.rating || 4.5) + (a.verificationStatus === 'Verified' ? 1 : 0);
        const bScore = (b.rating || 4.5) + (b.verificationStatus === 'Verified' ? 1 : 0);
        return bScore - aScore;
      });
  }, [
    selectedCategory,
    selectedOwnership,
    selectedDistrict,
    ewsOnly,
    verifiedOnly,
    openNowOnly,
    emergencyOnly,
    distanceRadiusKm,
    searchQuery,
    sortBy,
    userCoordinates,
  ]);

  // Category dynamic counts based on active query & location
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: 0,
      HOSPITAL: 0,
      CLINIC: 0,
      MEDICAL_CENTER: 0,
      NURSING_HOME: 0,
      URGENT_CARE: 0,
      SPECIALIZED_HEALTH_OFFICE: 0,
    };

    allFacilities.forEach((fac) => {
      if (PERMITTED_FACILITY_TYPES.includes(fac.facilityType)) {
        counts.ALL += 1;
        counts[fac.facilityType] = (counts[fac.facilityType] || 0) + 1;
      }
    });

    return counts;
  }, [allFacilities]);

  // Synchronized Selection Handler
  const handleSelectFacility = (facility: MedicalMapFacility) => {
    setSelectedFacility(facility);
  };

  const handleGetDirections = (facility: MedicalMapFacility) => {
    const url = getGoogleMapsNavigationUrl(
      userCoordinates,
      facility.latitude,
      facility.longitude,
      facility.facilityName
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedOwnership('ALL');
    setSelectedDistrict('ALL');
    setDistanceRadiusKm('ALL');
    setOpenNowOnly(false);
    setVerifiedOnly(false);
    setEmergencyOnly(false);
    setEwsOnly(false);
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Top Header & Search Hero */}
      <section className="border-b border-slate-200 bg-white pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb & Trust Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                GlobalHealth Directory
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-emerald-700">Medical Map</span>
            </div>

            {/* Small Trust Indicator with Verification Info Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowVerificationInfoModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold hover:bg-emerald-100/70 transition"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Verified Healthcare Directory</span>
              <Info className="h-3 w-3 text-emerald-600 opacity-70" />
            </button>
          </div>

          {/* Page Title & Supporting Text */}
          <div className="max-w-3xl mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Medical Map
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Find verified healthcare facilities near you. Explore hospitals, clinics, medical centers, nursing homes, urgent care facilities, and specialized health offices on the map.
            </p>
          </div>

          {/* Hero Search & Use My Location Bar */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-4xl mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hospitals, clinics, medical centers, nursing homes, urgent care, or specialized health offices..."
                className="w-full pl-10 pr-9 py-3 rounded-2xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Use My Location Button */}
            <button
              type="button"
              onClick={handleRequestUserLocation}
              disabled={isLocating}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-xs transition shrink-0 ${
                userCoordinates
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
              title="Detect your exact GPS hardware position with highest accuracy"
            >
              <Locate className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
              <span className="whitespace-nowrap">
                {isLocating
                  ? 'Locking GPS Coordinates...'
                  : userCoordinates?.precisionLevel === 'gps_satellite'
                  ? 'GPS Locked (±' + Math.round(userCoordinates.accuracy || 5) + 'm)'
                  : userCoordinates
                  ? userCoordinates.cityLabel || 'Location Active'
                  : 'Use My Current Location'}
              </span>
            </button>
          </div>

          {/* Live Progressive GPS Sensor Locking State */}
          {isLocating && locatingProgress && (
            <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <Satellite className="h-4 w-4 text-emerald-600 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div>
                  <p className="font-bold text-emerald-900 leading-tight">Acquiring High-Precision GPS Lock</p>
                  <p className="text-[11px] text-emerald-700">{locatingProgress.message}</p>
                </div>
              </div>
              {locatingProgress.accuracyMeters !== undefined && (
                <span className="text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md shrink-0">
                  ±{Math.round(locatingProgress.accuracyMeters)}m
                </span>
              )}
            </div>
          )}

          {/* High-Precision GPS Telemetry Ribbon when active */}
          {userCoordinates && !isLocating && (
            <div className="mb-3.5 p-3 rounded-2xl bg-slate-900 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-start sm:items-center gap-2.5 min-w-0">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5 sm:mt-0">
                  <Crosshair className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white truncate max-w-[280px] sm:max-w-md">
                      {userCoordinates.exactAddress || userCoordinates.cityLabel || 'Current Location'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[10px] font-bold ${
                        userCoordinates.precisionLevel === 'gps_satellite' || (userCoordinates.accuracy && userCoordinates.accuracy <= 20)
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>
                        {userCoordinates.precisionLevel === 'gps_satellite'
                          ? `High-Precision GPS (±${Math.round(userCoordinates.accuracy || 5)}m)`
                          : userCoordinates.accuracy
                          ? `Accuracy: ±${Math.round(userCoordinates.accuracy)}m`
                          : 'Location Locked'}
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-300 font-mono">
                    <span>
                      {userCoordinates.latitude.toFixed(6)}° N, {userCoordinates.longitude.toFixed(6)}° E
                    </span>
                    {userCoordinates.altitude !== null && userCoordinates.altitude !== undefined && (
                      <span className="text-slate-400">Alt: {userCoordinates.altitude}m</span>
                    )}
                    <span className="text-emerald-400 font-sans font-semibold">
                      · Sorted by Nearest
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Action Controls on Active Location */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={handleCopyCoordinates}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  title="Copy exact GPS coordinates to clipboard"
                >
                  {copiedCoords ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copy Coords</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleRequestUserLocation}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                  title="Rescan GPS hardware sensors for fresh satellite lock"
                >
                  <RotateCcw className="h-3 w-3 text-slate-400" />
                  <span>Rescan GPS</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 border border-slate-700 transition"
                  title="Clear current location filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Location Denied / Error Non-blocking Banner */}
          {locationError && (
            <div className="mb-4 flex items-center justify-between gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>{locationError}</span>
              </div>
              <button
                type="button"
                onClick={() => setLocationError(null)}
                className="text-amber-700 hover:text-amber-900 font-bold underline shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Quick Location Presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="font-semibold text-slate-700 mr-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>Explore Cities:</span>
            </span>
            {CITY_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectCityPreset(preset)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition ${
                  userCoordinates?.cityLabel === preset.label
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Tabs & Filter Strip */}
      <section className="sticky top-[57px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md py-2.5 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          {/* Six Permitted Facility Categories + All Facilities */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 py-0.5">
            {/* All Facilities */}
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>All Facilities</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedCategory === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {categoryCounts.ALL}
              </span>
            </button>

            {/* 1. Hospitals */}
            <button
              type="button"
              onClick={() => setSelectedCategory('HOSPITAL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'HOSPITAL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/80'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              <span>Hospitals</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedCategory === 'HOSPITAL' ? 'bg-blue-800 text-white' : 'bg-blue-100 text-blue-800'}`}>
                {categoryCounts.HOSPITAL}
              </span>
            </button>

            {/* 2. Clinics */}
            <button
              type="button"
              onClick={() => setSelectedCategory('CLINIC')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'CLINIC'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Clinics</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedCategory === 'CLINIC' ? 'bg-emerald-800 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                {categoryCounts.CLINIC}
              </span>
            </button>

            {/* 3. Medical Centers */}
            <button
              type="button"
              onClick={() => setSelectedCategory('MEDICAL_CENTER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'MEDICAL_CENTER'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200/80'
              }`}
            >
              <Building className="h-3.5 w-3.5" />
              <span>Medical Centers</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedCategory === 'MEDICAL_CENTER' ? 'bg-cyan-800 text-white' : 'bg-cyan-100 text-cyan-800'}`}>
                {categoryCounts.MEDICAL_CENTER}
              </span>
            </button>

            {/* 4. Nursing Homes */}
            <button
              type="button"
              onClick={() => setSelectedCategory('NURSING_HOME')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'NURSING_HOME'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/80'
              }`}
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Nursing Homes</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedCategory === 'NURSING_HOME' ? 'bg-purple-800 text-white' : 'bg-purple-100 text-purple-800'}`}>
                {categoryCounts.NURSING_HOME}
              </span>
            </button>

            {/* 5. Urgent Care Facilities */}
            <button
              type="button"
              onClick={() => setSelectedCategory('URGENT_CARE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'URGENT_CARE'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Urgent Care</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedCategory === 'URGENT_CARE' ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-900'}`}>
                {categoryCounts.URGENT_CARE}
              </span>
            </button>

            {/* 6. Specialized Health Offices */}
            <button
              type="button"
              onClick={() => setSelectedCategory('SPECIALIZED_HEALTH_OFFICE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'SPECIALIZED_HEALTH_OFFICE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200/80'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Specialized Offices</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${selectedCategory === 'SPECIALIZED_HEALTH_OFFICE' ? 'bg-rose-800 text-white' : 'bg-rose-100 text-rose-900'}`}>
                {categoryCounts.SPECIALIZED_HEALTH_OFFICE}
              </span>
            </button>
          </div>

          {/* Mobile View Switcher (Map vs List) */}
          <div className="flex lg:hidden items-center rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setMobileViewMode('list')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${
                mobileViewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode('map')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${
                mobileViewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Split Layout */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Filters, Dynamic Count & Results List */}
          <div
            className={`lg:col-span-5 space-y-4 ${
              mobileViewMode === 'map' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Filter Controls Row */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              {/* Filter Toggles */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Ownership Filter */}
                <select
                  value={selectedOwnership}
                  onChange={(e) => setSelectedOwnership(e.target.value as FacilityOwnership | 'ALL')}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">All Ownerships</option>
                  <option value="Government">Government (GNCTD)</option>
                  <option value="Society">Autonomous Society</option>
                  <option value="Private">Private Super-Speciality</option>
                  <option value="Trust">Non-Profit / Trust</option>
                </select>

                {/* District Filter */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">All Delhi Districts</option>
                  <option value="Central Delhi">Central Delhi</option>
                  <option value="North East Delhi">North East Delhi</option>
                  <option value="South Delhi">South Delhi</option>
                  <option value="West Delhi">West Delhi</option>
                  <option value="North West Delhi">North West Delhi</option>
                  <option value="East Delhi">East Delhi</option>
                  <option value="South West Delhi">South West Delhi</option>
                  <option value="North Delhi">North Delhi</option>
                  <option value="South East Delhi">South East Delhi</option>
                </select>

                {/* Distance Filter Chips */}
                <select
                  value={distanceRadiusKm}
                  onChange={(e) =>
                    setDistanceRadiusKm(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                  }
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">Any Distance</option>
                  <option value="1">Within 1 km</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                  <option value="25">Within 25 km</option>
                  <option value="50">Within 50 km</option>
                </select>

                {/* EWS Quota Toggle */}
                <button
                  type="button"
                  onClick={() => setEwsOnly(!ewsOnly)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold border transition ${
                    ewsOnly
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>EWS Quota</span>
                </button>

                {/* Open Now Toggle */}
                <button
                  type="button"
                  onClick={() => setOpenNowOnly(!openNowOnly)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold border transition ${
                    openNowOnly
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  <span>Open Now</span>
                </button>

                {/* Verified Only Toggle */}
                <button
                  type="button"
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold border transition ${
                    verifiedOnly
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span>Verified Only</span>
                </button>

                {/* Emergency 24/7 Only */}
                <button
                  type="button"
                  onClick={() => setEmergencyOnly(!emergencyOnly)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl font-semibold border transition ${
                    emergencyOnly
                      ? 'bg-rose-50 text-rose-900 border-rose-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Zap className="h-3 w-3 text-rose-600" />
                  <span>Emergency 24/7</span>
                </button>
              </div>

              {/* Sort By & Results Count Summary */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="font-bold text-slate-900">
                  {filteredFacilities.length} healthcare facilities found
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as MedicalMapSortOption)}
                    className="py-1 px-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800 text-xs focus:outline-hidden"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="beds_desc">Most Approved Beds</option>
                    <option value="nearest">Nearest</option>
                    <option value="name_asc">Name A–Z</option>
                    <option value="open_now">Open Now</option>
                    <option value="recently_verified">Recently Verified</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Facility Cards List Container */}
            <div
              ref={listContainerRef}
              className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-thin"
            >
              {filteredFacilities.length === 0 ? (
                /* Empty State */
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xs">
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500">
                    <MapPin className="h-6 w-6 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">
                    No Healthcare Facilities Found
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
                    We couldn't find any eligible healthcare facilities in this area using your current filters. Try expanding your search radius or clearing active filters.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDistanceRadiusKm('ALL')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition"
                    >
                      Expand Search Radius
                    </button>
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              ) : (
                filteredFacilities.map((facility) => (
                  <MedicalMapCard
                    key={facility.id}
                    facility={facility}
                    isSelected={selectedFacility?.id === facility.id}
                    onSelect={handleSelectFacility}
                    onViewDetails={(fac) => setDetailFacility(fac)}
                    onGetDirections={handleGetDirections}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Column: Interactive Map */}
          <div
            className={`lg:col-span-7 sticky top-36 h-[calc(100vh-180px)] min-h-[500px] ${
              mobileViewMode === 'list' ? 'hidden lg:block' : 'block'
            }`}
          >
            <MedicalMapInteractive
              facilities={filteredFacilities}
              selectedFacility={selectedFacility}
              userCoordinates={userCoordinates}
              onSelectFacility={handleSelectFacility}
              onViewDetails={(fac) => setDetailFacility(fac)}
              onGetDirections={handleGetDirections}
              onRequestUserLocation={handleRequestUserLocation}
            />
          </div>
        </div>
      </main>

      {/* Facility Profile Detail Modal */}
      <MedicalMapDetailModal
        facility={detailFacility}
        userCoordinates={userCoordinates}
        onClose={() => setDetailFacility(null)}
        onNavigateToHospitalProfile={onNavigateToHospitalProfile}
      />

      {/* Verification Methodology Trust Modal */}
      {showVerificationInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowVerificationInfoModal(false)}
              className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base mb-3">
              <ShieldCheck className="h-5 w-5" />
              <span>GlobalHealth Verification Standards</span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Every facility designated with the <strong className="text-slate-900">Verified</strong> badge in the Medical Map has undergone structured multi-tiered audit protocols:
            </p>

            <div className="space-y-3 text-xs text-slate-700 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-0.5">1. State & National Licensure Audit</div>
                <p className="text-slate-600">Cross-verified against regional health authorities (NABH, JCI, NHS CQC, state medical licensing councils).</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-0.5">2. Physical Geolocation Validation</div>
                <p className="text-slate-600">Precise latitude/longitude geocoding and emergency access ramp confirmation.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 mb-0.5">3. Operating Services & Triage Certification</div>
                <p className="text-slate-600">Regular audits of 24/7 trauma emergency capabilities and registered clinical staffing.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowVerificationInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
