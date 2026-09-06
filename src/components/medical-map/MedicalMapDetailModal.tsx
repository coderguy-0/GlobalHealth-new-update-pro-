import React from 'react';
import {
  X,
  MapPin,
  Phone,
  Clock,
  Globe,
  ShieldCheck,
  Building2,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  HeartHandshake,
  Activity,
  Layers,
  ExternalLink,
  Accessibility,
  Share2
} from 'lucide-react';
import { MedicalMapFacility, UserCoordinates } from '../../types/medicalMap';
import { getCategoryIcon, getCategoryBadgeStyles } from './MedicalMapCard';
import { isFacilityCurrentlyOpen } from '../../data/medicalMapData';
import { getGoogleMapsNavigationUrl, formatAccurateDistance, estimateTravelTime } from '../../utils/geolocationService';

interface MedicalMapDetailModalProps {
  facility: MedicalMapFacility | null;
  userCoordinates?: UserCoordinates | null;
  onClose: () => void;
  onNavigateToHospitalProfile?: (hospitalProfileId: string) => void;
}

export const MedicalMapDetailModal: React.FC<MedicalMapDetailModalProps> = ({
  facility,
  userCoordinates = null,
  onClose,
  onNavigateToHospitalProfile
}) => {
  if (!facility) return null;

  const categoryStyle = getCategoryBadgeStyles(facility.facilityType);
  const isOpen = isFacilityCurrentlyOpen(facility);

  const handleOpenDirections = () => {
    const url = getGoogleMapsNavigationUrl(
      userCoordinates,
      facility.latitude,
      facility.longitude,
      facility.facilityName
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
          aria-label="Close facility details"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryStyle.bg}`}>
            {getCategoryIcon(facility.facilityType, 'h-3.5 w-3.5')}
            <span>{categoryStyle.label}</span>
          </span>

          {facility.ownership && (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                facility.ownership === 'Government'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : facility.ownership === 'Society'
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                  : facility.ownership === 'Trust'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              {facility.ownership} Ownership
            </span>
          )}

          {facility.verificationStatus === 'Verified' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Verified Facility</span>
            </span>
          )}

          {facility.bedCount !== undefined && facility.bedCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span>{facility.bedCount.toLocaleString()} Approved Beds</span>
            </span>
          )}

          {facility.distanceKm !== undefined && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
              <Navigation className="h-3 w-3 text-emerald-600" />
              <span>{formatAccurateDistance(facility.distanceKm).text} away (~{estimateTravelTime(facility.distanceKm).drivingMins}m drive)</span>
            </span>
          )}
        </div>

        {/* Facility Title & Tagline */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {facility.facilityName}
          </h2>
          {facility.facilityIdCode && (
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md shrink-0">
              {facility.facilityIdCode}
            </span>
          )}
        </div>
        {facility.specialtyType && (
          <p className="text-xs font-semibold text-emerald-700 mb-4">
            {facility.specialtyType}
          </p>
        )}

        {/* Main Info Columns */}
        <div className="space-y-4 text-xs text-slate-700">
          {/* Address & Navigation Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">{facility.address.street}</p>
                <p className="text-slate-600">
                  {facility.address.area ? `${facility.address.area}, ` : ''}{facility.address.city}, {facility.address.state} {facility.address.postalCode}, {facility.address.country}
                </p>
                {facility.address.landmark && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Landmark: {facility.address.landmark}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenDirections}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition shrink-0"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Get Directions</span>
            </button>
          </div>

          {/* Quick Contact & Operating Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Contact Phone Numbers */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 border-b border-slate-100 pb-1.5">
                <Phone className="h-4 w-4 text-emerald-600" />
                <span>Contact Helplines</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Reception:</span>
                  <a href={`tel:${facility.phone}`} className="font-semibold text-slate-800 hover:text-emerald-600">
                    {facility.phone}
                  </a>
                </div>
                {facility.emergencyPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-rose-600 font-medium">Emergency:</span>
                    <a href={`tel:${facility.emergencyPhone}`} className="font-bold text-rose-700 hover:underline">
                      {facility.emergencyPhone}
                    </a>
                  </div>
                )}
                {facility.website && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Website:</span>
                    <a
                      href={facility.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 font-semibold hover:underline"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Operating Hours */}
            <div className="p-3 rounded-2xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span>Operating Hours</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {facility.operatingHours.isOpen24x7 ? '24/7 Service' : isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {facility.operatingHours.scheduleText}
              </p>
              {facility.emergencyServices && (
                <div className="text-[11px] font-semibold text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-200">
                  Emergency & Triage: 24 Hours continuous coverage
                </div>
              )}
            </div>
          </div>

          {/* About Section */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              About This Facility
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-200/60">
              {facility.about}
            </p>
          </div>

          {/* Clinical Departments & Services */}
          {facility.departments && facility.departments.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-emerald-600" />
                <span>Clinical Departments</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {facility.departments.map((dept, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-medium">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          )}

          {facility.services && facility.services.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-600" />
                <span>Key Healthcare Services</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {facility.services.map((service, idx) => (
                  <span key={idx} className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded-lg text-xs font-medium">
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Accessibility & Verification Audit Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Accessibility Features */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Accessibility className="h-3.5 w-3.5 text-emerald-600" />
                <span>Accessibility Features</span>
              </h5>
              <div className="space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${facility.accessibility.wheelchairAccessible ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>Wheelchair Accessible Entrances</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${facility.accessibility.emergencyRamp ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>Emergency Stretcher Ramps</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={`h-3.5 w-3.5 ${facility.accessibility.accessibleParking ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>Accessible Disabled Parking</span>
                </div>
                {facility.accessibility.brailleAssistance && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Braille Signage & Assistance</span>
                  </div>
                )}
              </div>
            </div>

            {/* Verification & Official Registration Metadata */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <h5 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Official Registration & Audit</span>
              </h5>
              <div className="space-y-1 text-[11px] text-slate-600">
                {facility.source && (
                  <p><span className="font-semibold text-slate-800">Source:</span> {facility.source}</p>
                )}
                {facility.registrationNo && (
                  <p><span className="font-semibold text-slate-800">Reg No:</span> {facility.registrationNo}</p>
                )}
                {facility.registrationValidUntil && (
                  <p><span className="font-semibold text-slate-800">Valid Until:</span> {facility.registrationValidUntil}</p>
                )}
                {facility.district && (
                  <p><span className="font-semibold text-slate-800">Health District:</span> {facility.district}</p>
                )}
                {facility.lastVerified && (
                  <p><span className="font-semibold text-slate-800">Last Verified:</span> {facility.lastVerified}</p>
                )}
                {facility.ewsAvailable !== undefined && (
                  <p>
                    <span className="font-semibold text-slate-800">EWS Mandate:</span>{' '}
                    <span className={facility.ewsAvailable ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                      {facility.ewsAvailable ? 'Yes (Reserved EWS Beds & Free IPD/OPD)' : 'Standard Tariff'}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            {facility.hospitalProfileId && onNavigateToHospitalProfile && (
              <button
                type="button"
                onClick={() => {
                  onNavigateToHospitalProfile(facility.hospitalProfileId!);
                  onClose();
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
              >
                <span>View Full Hospital Profile in Directory</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenDirections}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>Get Directions</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
