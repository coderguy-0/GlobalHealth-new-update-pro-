import React from 'react';
import { 
  Building2, 
  Stethoscope, 
  Building, 
  HeartHandshake, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { MedicalMapFacility, MedicalFacilityType } from '../../types/medicalMap';
import { isFacilityCurrentlyOpen } from '../../data/medicalMapData';
import { formatAccurateDistance, estimateTravelTime } from '../../utils/geolocationService';

interface MedicalMapCardProps {
  facility: MedicalMapFacility;
  isSelected?: boolean;
  onSelect: (facility: MedicalMapFacility) => void;
  onViewDetails: (facility: MedicalMapFacility) => void;
  onGetDirections: (facility: MedicalMapFacility) => void;
}

export const getCategoryIcon = (type: MedicalFacilityType, className: string = 'h-4 w-4') => {
  switch (type) {
    case 'HOSPITAL':
      return <Building2 className={className} />;
    case 'CLINIC':
      return <Stethoscope className={className} />;
    case 'MEDICAL_CENTER':
      return <Building className={className} />;
    case 'NURSING_HOME':
      return <HeartHandshake className={className} />;
    case 'URGENT_CARE':
      return <Zap className={className} />;
    case 'SPECIALIZED_HEALTH_OFFICE':
      return <Sparkles className={className} />;
  }
};

export const getCategoryBadgeStyles = (type: MedicalFacilityType) => {
  switch (type) {
    case 'HOSPITAL':
      return {
        bg: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-600',
        markerBg: '#2563eb',
        label: 'Hospital'
      };
    case 'CLINIC':
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-600',
        markerBg: '#059669',
        label: 'Clinic'
      };
    case 'MEDICAL_CENTER':
      return {
        bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
        dot: 'bg-cyan-600',
        markerBg: '#0891b2',
        label: 'Medical Center'
      };
    case 'NURSING_HOME':
      return {
        bg: 'bg-purple-50 text-purple-800 border-purple-200',
        dot: 'bg-purple-600',
        markerBg: '#7c3aed',
        label: 'Nursing Home'
      };
    case 'URGENT_CARE':
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        dot: 'bg-amber-600',
        markerBg: '#d97706',
        label: 'Urgent Care Facility'
      };
    case 'SPECIALIZED_HEALTH_OFFICE':
      return {
        bg: 'bg-rose-50 text-rose-900 border-rose-200',
        dot: 'bg-rose-600',
        markerBg: '#e11d48',
        label: 'Specialized Health Office'
      };
  }
};

export const MedicalMapCard: React.FC<MedicalMapCardProps> = ({
  facility,
  isSelected,
  onSelect,
  onViewDetails,
  onGetDirections
}) => {
  const categoryStyle = getCategoryBadgeStyles(facility.facilityType);
  const isOpen = isFacilityCurrentlyOpen(facility);

  return (
    <div
      onClick={() => onSelect(facility)}
      className={`group relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer text-left ${
        isSelected
          ? 'border-emerald-500 bg-emerald-50/30 shadow-md ring-2 ring-emerald-500/20'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Top Header: Category, Ownership & Verification */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryStyle.bg}`}
          >
            {getCategoryIcon(facility.facilityType, 'h-3.5 w-3.5')}
            <span className="whitespace-nowrap">{categoryStyle.label}</span>
          </span>

          {facility.ownership && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                facility.ownership === 'Government'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : facility.ownership === 'Society'
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  : facility.ownership === 'Trust'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {facility.ownership}
            </span>
          )}

          {facility.verificationStatus === 'Verified' && (
            <span 
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
              title={facility.verificationDetails?.verifiedByAuthority || 'Verified Healthcare Facility'}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span className="whitespace-nowrap">Verified</span>
            </span>
          )}
        </div>

        {facility.distanceKm !== undefined && (
          <div className="flex flex-col items-end shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
              <Navigation className="h-3 w-3 text-emerald-600" />
              <span>{formatAccurateDistance(facility.distanceKm).text}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5">
              ~{estimateTravelTime(facility.distanceKm).drivingMins} min drive
            </span>
          </div>
        )}
      </div>

      {/* Facility Name & ID */}
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition leading-snug">
          {facility.facilityName}
        </h3>
        {facility.facilityIdCode && (
          <span className="text-[10px] font-mono text-slate-600 shrink-0 font-medium">
            {facility.facilityIdCode}
          </span>
        )}
      </div>

      {/* Address, District & PIN */}
      <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-2">
        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span className="line-clamp-1">
          {facility.address.street}{facility.district ? ` · ${facility.district}` : ''}{facility.pincode ? ` (${facility.pincode})` : ''}
        </span>
      </div>

      {/* Badges: Bed count & EWS & Emergency */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
        {facility.bedCount !== undefined && facility.bedCount > 0 && (
          <span className="inline-flex items-center text-[11px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
            {facility.bedCount.toLocaleString()} Verified Beds
          </span>
        )}
        {facility.ewsAvailable && (
          <span className="inline-flex items-center text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            EWS Quota Available
          </span>
        )}
      </div>

      {/* Operating Status & Wait Time / Emergency */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
        <div className="flex items-center gap-1 font-medium">
          <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className={isOpen ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
            {facility.operatingHours.isOpen24x7 ? 'Open 24/7' : isOpen ? 'Open Now' : 'Closed'}
          </span>
          {!facility.operatingHours.isOpen24x7 && facility.operatingHours.closeTime && isOpen && (
            <span className="text-slate-500 text-[11px] font-normal">
              · Closes {facility.operatingHours.closeTime}
            </span>
          )}
        </div>

        {facility.emergencyServices && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
            Emergency 24/7
          </span>
        )}

        {facility.facilityType === 'URGENT_CARE' && facility.estimatedWaitTimeMinutes !== undefined && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            <Clock className="h-3 w-3 text-amber-600" />
            <span>Est. Wait ~{facility.estimatedWaitTimeMinutes}m</span>
          </span>
        )}
      </div>

      {/* Key Services Preview */}
      {facility.services && facility.services.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {facility.services.slice(0, 3).map((service, idx) => (
            <span
              key={idx}
              className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200/80 line-clamp-1"
            >
              {service}
            </span>
          ))}
          {facility.services.length > 3 && (
            <span className="text-[10px] text-slate-500 self-center font-medium">
              +{facility.services.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onGetDirections(facility);
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <Navigation className="h-3.5 w-3.5 text-emerald-600" />
          <span>Directions</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(facility);
          }}
          className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200/80 transition"
        >
          <span>View Details</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
