// Shared implementation behind the two public directory pages.
//
// Hospitals (#/hospitals) and Doctors (#/doctors) are separate pages with their
// own hero, trust strip and result set. They share this component because the
// search / filter / booking machinery is identical; the `section` prop decides
// which directory is rendered. See HospitalsView.tsx and DoctorsView.tsx.
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Stethoscope, 
  Search, 
  MapPin, 
  Star, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  Eye,
  Lock,
  Award,
  Clock,
  Activity,
  SlidersHorizontal,
  RotateCcw,
  Info,
  ChevronRight,
  Shield,
  Video,
  FileCheck2
} from 'lucide-react';
import { DOCTORS, HOSPITALS } from '../data/healthData';
import { Doctor, Hospital } from '../types';
import { HospitalDetailPage } from './HospitalDetailPage';
import { BookAmbulanceModal } from './BookAmbulanceModal';
import { BookHospitalAppointmentModal } from './BookHospitalAppointmentModal';
import { useHospitalPortal } from '../context/HospitalContext';
import { HospitalFacility } from '../types/hospitalPortal';
import { fetchPublicHospitals, CentralHospitalRecord } from '../services/hospitalRegistryClient';

export interface HealthDirectoryPageProps {
  /** Which directory this page shows. Driven by the route ('hospitals' or
   *  'doctors') so each is a genuinely separate page with its own URL, hero
   *  and result set, rather than two tabs behind one address. */
  section: UserWebsiteMainTab;
  onTabChange?: (tab: any) => void;
  isAuthenticated?: boolean;
  onRequireAuth?: (feature: string) => void;
}

export type UserWebsiteMainTab = 'hospitals' | 'doctors';

// Adapter to ensure dynamic portal facilities and standard healthData hospitals are unified
const normalizeHospital = (f: HospitalFacility | Hospital): Hospital => {
  const isFacility = 'streetAddress' in f || 'registrationNo' in f || 'totalBedsCount' in f;
  if (!isFacility && (f as Hospital).totalBeds) {
    return f as Hospital;
  }

  const facility = f as HospitalFacility;
  return {
    id: facility.id,
    globalHealthId: facility.id.startsWith('HSP-') ? facility.id : `GH-HOSP-${(facility.country || 'GL').slice(0, 2).toUpperCase()}-00${facility.id.replace('hosp-', '')}`,
    name: facility.name,
    country: facility.country || 'Global',
    city: facility.city || 'Central City',
    location: `${facility.city || ''}, ${facility.country || ''}`.trim().replace(/^,\s*/, ''),
    type: (facility.hospitalType === 'Teaching Hospital' ? 'Teaching Hospital' : 'Super-Specialty Hospital') as Hospital['type'],
    traumaLevel: (facility.traumaLevel?.includes('Level 2') || facility.traumaLevel?.includes('Level II') ? 'Level II' : 'Level I') as Hospital['traumaLevel'],
    verified: facility.verificationStatus === 'Verified' || true,
    rating: facility.rating || 4.9,
    totalBeds: facility.totalBedsCount || 500,
    icuBeds: facility.icuBedsCount || 80,
    surgeriesPerYear: '12,500+',
    specialties: [
      'Cardiology',
      'Trauma & Emergency',
      'Neurology & Stroke',
      'Orthopedics & Joint',
      'Oncology',
      'Organ Transplant'
    ],
    emergencyServices: true,
    contact: facility.emergencyPhone || facility.ambulanceHelpline || '+1 800 555 0199',
    address: facility.streetAddress
      ? `${facility.streetAddress}, ${facility.city}, ${facility.state || ''} ${facility.postalCode || ''}, ${facility.country}`
      : `${facility.city}, ${facility.country}`,
    imageUrl: facility.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=60',
    description: facility.tagline || 'Comprehensive tertiary medical center delivering multidisciplinary acute clinical care and advanced trauma resuscitation.',
    officialLegalName: facility.legalName || `${facility.name} Health Enterprise`,
    yearEstablished: facility.establishedYear || 1995,
    ownership: facility.ownership || 'Trust / Non-Profit',
    hospitalNetwork: facility.shortName || 'GlobalHealth Apex Network',
    coordinates: { lat: '28.5672° N', lng: '77.2100° E' },
    emergencyHotline: facility.emergencyPhone,
    mainHotline: {
      phone: facility.mainReceptionPhone || '+1 800 555 0199',
      email: facility.officialEmail || 'info@globalhealth.org',
      hours: facility.opdHours || '24/7 Available',
      languages: 'English, Multilingual'
    },
    internationalCare: {
      phone: facility.opdAppointmentPhone || '+1 800 555 0122',
      email: facility.officialEmail || 'international@healthnetwork.org',
      hours: '24/7 Dedicated Desk',
      languages: 'English, Spanish, Arabic, French, Hindi, German'
    },
    operatingHours: {
      hospitalEmergency: facility.emergencyHours || '24 Hours / 365 Days',
      clinics: facility.opdHours || '08:00 AM - 07:00 PM',
      radiologyLabs: facility.pharmacyHours || '24 Hours Open'
    },
    accreditations: ['JCI Accredited', 'NABH Apex Level', 'ISO 9001:2015', 'CAP Certified'],
    insurancePartners: ['Bupa Global', 'Cigna Global', 'Allianz Worldwide', 'Aetna International', 'UnitedHealthcare Global']
  };
};

export const DirectoryPage: React.FC<HealthDirectoryPageProps> = ({
  section,
  onTabChange,
  isAuthenticated = false,
  onRequireAuth
}) => {
  // Booking appointments / ambulances are transactional → require an account.
  const requireBookingAuth = (feature: string) => {
    if (isAuthenticated) return true;
    onRequireAuth?.(feature);
    return false;
  };
  const { hospitals: liveHospitals, doctors: livePortalDoctors } = useHospitalPortal();

  // Which directory is being shown. Comes from the route, so /#/hospitals and
  // /#/doctors are two independent pages.
  const activeTab = section;
  const isHospitals = section === 'hospitals';
  
  // Search and Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [telehealthOnly, setTelehealthOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'name'>('rating');

  // Verification info modal state
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  // Modals for Public User Actions (View Info, Book Ambulance, Book Appointment)
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedAmbulanceHospital, setSelectedAmbulanceHospital] = useState<Hospital | null>(null);
  const [selectedAppointmentHospital, setSelectedAppointmentHospital] = useState<Hospital | null>(null);

  // Doctor Appointment Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [appointmentTime, setAppointmentTime] = useState('09:00 AM');
  const [consultationMode, setConsultationMode] = useState<'in-person' | 'telehealth'>('in-person');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // -----------------------------------------------------------------------
  // LIVE central hospital registry. The registry (fed by each hospital's own
  // portal workspace) is the source of truth — its published records are
  // fetched fresh and merged OVER the static seed data, so a hospital's
  // latest approved name/address/contact/roster is what customers see across
  // search, the directory and the profile. Failures fall back to seeds.
  // -----------------------------------------------------------------------
  const [registryHospitals, setRegistryHospitals] = useState<CentralHospitalRecord[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicHospitals().then((res) => {
      if (!cancelled && res.ok) setRegistryHospitals(res.hospitals);
    });
    return () => { cancelled = true; };
  }, []);

  // Central registry record → public Hospital shape (drives search, cards,
  // detail modals, appointment/ambulance flows — everything below).
  const centralToHospital = (rec: CentralHospitalRecord): Hospital => {
    const latDir = rec.location.latitude >= 0 ? 'N' : 'S';
    const lngDir = rec.location.longitude >= 0 ? 'E' : 'W';
    return {
      id: rec.hospitalId,
      globalHealthId: rec.hospitalId,
      name: rec.identity.name,
      country: rec.location.country,
      city: rec.location.city,
      location: `${rec.location.city}, ${rec.location.state || rec.location.country}`,
      type: (rec.identity.hospitalType === 'Teaching Hospital' || rec.identity.teachingHospital
        ? 'Teaching Hospital'
        : rec.identity.hospitalType === 'Super Specialty' ? 'Super-Specialty Hospital' : 'Multi-Specialty Hospital') as Hospital['type'],
      traumaLevel: (rec.identity.traumaLevel.includes('Level 2') || rec.identity.traumaLevel.includes('Level II') ? 'Level II' : 'Level I') as Hospital['traumaLevel'],
      verified: rec.identity.verificationStatus === 'Verified',
      rating: 4.9,
      totalBeds: rec.bedsFacilities.totalBeds,
      icuBeds: rec.bedsFacilities.icuBeds,
      surgeriesPerYear: '—',
      specialties: [
        ...new Set([
          ...rec.services.filter((s) => s.status === 'ACTIVE').map((s) => s.name),
          ...rec.departments.map((d) => d.name.split(' ')[0])
        ])
      ].slice(0, 8),
      emergencyServices: rec.contact.emergencyHours.toLowerCase().includes('24'),
      contact: rec.contact.appointmentPhone || rec.contact.mainPhone,
      address: `${rec.location.streetAddress}, ${rec.location.city}, ${rec.location.state} ${rec.location.postalCode}, ${rec.location.country}`,
      imageUrl: rec.identity.imageUrl || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&auto=format&fit=crop&q=60',
      description: rec.identity.description,
      officialLegalName: rec.identity.legalName,
      yearEstablished: rec.identity.establishedYear,
      ownership: rec.identity.ownership,
      hospitalNetwork: rec.identity.shortName,
      coordinates: { lat: `${Math.abs(rec.location.latitude).toFixed(4)}° ${latDir}`, lng: `${Math.abs(rec.location.longitude).toFixed(4)}° ${lngDir}` },
      emergencyHotline: rec.contact.emergencyPhone,
      mainHotline: {
        phone: rec.contact.mainPhone,
        email: rec.contact.email,
        hours: rec.contact.generalHours,
        languages: rec.international.languages
      },
      internationalCare: {
        phone: rec.international.phone,
        email: rec.international.email,
        hours: rec.contact.generalHours,
        languages: rec.international.languages
      },
      operatingHours: {
        hospitalEmergency: rec.contact.emergencyHours,
        clinics: rec.contact.opdHours,
        radiologyLabs: rec.labImaging.labHours
      },
      accreditations: rec.accreditation.filter((a) => a.status === 'VERIFIED').map((a) => `${a.body} — ${a.name}`),
      insurancePartners: []
    };
  };

  // Unified Dynamic Hospitals Dataset
  const allHospitals = useMemo(() => {
    const map = new Map<string, Hospital>();

    // Seed from healthData
    HOSPITALS.forEach((h) => map.set(h.id, h));

    // Live central registry records take precedence (latest published data)
    registryHospitals.forEach((rec) => {
      map.set(rec.hospitalId, centralToHospital(rec));
    });

    // Local portal context facilities (same-browser edits) still contribute
    // any hospitals the registry does not already cover.
    if (liveHospitals && liveHospitals.length > 0) {
      liveHospitals.forEach((fh) => {
        if (!map.has(fh.id)) map.set(fh.id, normalizeHospital(fh));
      });
    }

    return Array.from(map.values());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveHospitals, registryHospitals]);

  // Unified Dynamic Doctors Dataset
  const allDoctors = useMemo(() => {
    const map = new Map<string, Doctor>();
    DOCTORS.forEach((d) => map.set(d.id, d));

    if (livePortalDoctors && livePortalDoctors.length > 0) {
      livePortalDoctors.forEach((pd) => {
        if (!map.has(pd.id)) {
          map.set(pd.id, {
            id: pd.id,
            name: pd.name,
            specialty: pd.departmentName || pd.specialty,
            hospital: 'Apex Institute of Medical Sciences',
            location: 'New Delhi, India',
            experienceYears: pd.experienceYears || 14,
            rating: 4.9,
            availability: 'Today 09:00 AM - 05:00 PM',
            consultationFee: pd.consultationFee || '$120',
            availableSlots: ['09:00 AM', '11:15 AM', '02:30 PM', '04:30 PM'],
            telehealthAvailable: true,
            languages: ['English', 'Hindi'],
            education: pd.qualifications || 'MBBS, MD',
            bio: 'Board-certified medical specialist committed to evidence-based tertiary care.',
            verifiedLicense: true
          } as any);
        }
      });
    }

    // Doctor roster from the LIVE central registry — the hospital portal's
    // approved roster is what appears in the public doctor directory.
    registryHospitals.forEach((rec) => {
      rec.doctors.forEach((cd) => {
        if (!map.has(cd.id)) {
          map.set(cd.id, {
            id: cd.id,
            name: cd.name,
            specialty: cd.specialty,
            hospital: rec.identity.name,
            location: `${rec.location.city}, ${rec.location.country}`,
            experienceYears: cd.experienceYears || 10,
            rating: 4.9,
            availability: cd.status === 'ON_LEAVE' ? 'On Leave' : (cd.opdSchedule || 'Contact hospital for slots'),
            consultationFee: `₹ ${cd.consultationFee}`,
            availableSlots: [],
            telehealthAvailable: false,
            languages: ['English', 'Hindi'],
            education: cd.qualifications,
            bio: `${cd.title} — ${cd.department}${cd.subSpecialty ? ` (${cd.subSpecialty})` : ''}. Reg: ${cd.registrationNo}`,
            verifiedLicense: true
          } as any);
        }
      });
    });

    return Array.from(map.values());
  }, [livePortalDoctors, registryHospitals]);

  // Filter options
  const locations = useMemo(() => {
    const locSet = new Set<string>();
    allHospitals.forEach(h => {
      if (h.city) locSet.add(h.city);
      if (h.country) locSet.add(h.country);
    });
    allDoctors.forEach(d => {
      if (d.location) {
        const parts = d.location.split(',');
        parts.forEach(p => locSet.add(p.trim()));
      }
    });
    return ['All', ...Array.from(locSet).filter(l => l.length > 2)];
  }, [allHospitals, allDoctors]);

  const specialtiesList = useMemo(() => [
    'All',
    'Cardiology',
    'Endocrinology',
    'Neurology',
    'Oncology',
    'Orthopedics',
    'Nephrology',
    'Surgical Subspecialties',
    'Digestive Disease',
    'Pediatrics'
  ], []);

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm.trim() !== '' ||
      selectedSpecialty !== 'All' ||
      selectedLocation !== 'All' ||
      emergencyOnly ||
      telehealthOnly ||
      sortBy !== 'rating'
    );
  }, [searchTerm, selectedSpecialty, selectedLocation, emergencyOnly, telehealthOnly, sortBy]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedSpecialty('All');
    setSelectedLocation('All');
    setEmergencyOnly(false);
    setTelehealthOnly(false);
    setSortBy('rating');
  };

  // Filtered & Sorted Hospitals
  const filteredHospitals = useMemo(() => {
    return allHospitals.filter((h) => {
      const matchesSearch = 
        searchTerm === '' ||
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialty = selectedSpecialty === 'All' || h.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
      const matchesLocation = selectedLocation === 'All' || h.city.toLowerCase().includes(selectedLocation.toLowerCase()) || h.country.toLowerCase().includes(selectedLocation.toLowerCase()) || h.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesEmergency = !emergencyOnly || h.emergencyServices;

      return matchesSearch && matchesSpecialty && matchesLocation && matchesEmergency;
    }).sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.rating - a.rating;
    });
  }, [allHospitals, searchTerm, selectedSpecialty, selectedLocation, emergencyOnly, sortBy]);

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((d) => {
      const matchesSearch = 
        searchTerm === '' ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialty = selectedSpecialty === 'All' || d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
      const matchesLocation = selectedLocation === 'All' || d.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesTelehealth = !telehealthOnly || (d.telehealthAvailable !== false);

      return matchesSearch && matchesSpecialty && matchesLocation && matchesTelehealth;
    }).sort((a, b) => {
      if (sortBy === 'experience') {
        return b.experienceYears - a.experienceYears;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.rating - a.rating;
    });
  }, [allDoctors, searchTerm, selectedSpecialty, selectedLocation, telehealthOnly, sortBy]);

  const handleOpenAppointmentForDoctor = (doc: Doctor, preselectedSlot?: string, mode: 'in-person' | 'telehealth' = 'in-person') => {
    if (!requireBookingAuth('book your doctor appointment')) return;
    setSelectedDoctor(doc);
    if (preselectedSlot) {
      setAppointmentTime(preselectedSlot);
    } else if (doc.availableSlots && doc.availableSlots.length > 0) {
      setAppointmentTime(doc.availableSlots[0]);
    } else {
      setAppointmentTime('09:00 AM');
    }
    setConsultationMode(mode);
    setBookingSuccess(false);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !appointmentDate || !patientPhone) return;
    setBookingSuccess(true);
  };

  const resetAppointmentModal = () => {
    setSelectedDoctor(null);
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setAppointmentReason('');
    setBookingSuccess(false);
  };

  // Hospital profiles follow the same full-page detail pattern as medicine
  // and disease pages. This keeps discovery consistent and avoids trapping a
  // profile inside a modal on smaller screens.
  if (isHospitals && selectedHospital) {
    return (
      <HospitalDetailPage
        hospital={selectedHospital}
        onBack={() => setSelectedHospital(null)}
        onBookAppointment={(hospital) => {
          if (requireBookingAuth('book a hospital appointment')) {
            setSelectedHospital(null);
            setSelectedAppointmentHospital(hospital);
          }
        }}
        onBookAmbulance={(hospital) => {
          if (requireBookingAuth('book an ambulance')) {
            setSelectedHospital(null);
            setSelectedAmbulanceHospital(hospital);
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 text-slate-800 antialiased">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: ANCHORING CLINICAL REGISTRY & GOVERNANCE */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-lg border border-slate-800">
          {/* Subtle architectural background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left Column: Heading & Mission */}
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  {isHospitals
                    ? 'Public Transparency Health Portal • Verified Hospital Registry'
                    : 'Public Transparency Health Portal • Verified Doctor Directory'}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isHospitals ? 'Global Hospital Registry' : 'Verified Doctors Directory'}
              </h1>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {isHospitals
                  ? 'Real-time verified hospital registry. Browse accredited hospital networks, specialized clinical institutes, bed and ICU capacity, trauma levels and 24/7 emergency services.'
                  : 'Real-time verified directory of practising medical faculty. Browse board-certified specialists by department, experience and consultation mode, then book an appointment.'}
              </p>
            </div>
          </div>

          {/* Hero Bottom Institutional Governance & Certification Strip */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">User Access: Strictly Read-Only</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline text-slate-400">Hospital Staff & Admins edit via Hospital Portal</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-300">
              <span className="inline-flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
                <Award className="h-3 w-3 text-amber-400" />
                JCI Accredited
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                NABH Apex Level
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-lg">
                <FileCheck2 className="h-3 w-3 text-blue-400" />
                Board Certified Faculty
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. COMPACT CREDIBILITY & VERIFICATION TRUST LAYER */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(isHospitals
            ? [
                { icon: <Building2 className="h-4.5 w-4.5" />, tone: 'bg-blue-50 text-blue-600', title: 'Verified Hospitals', sub: `${allHospitals.length} Accredited Centers` },
                { icon: <Award className="h-4.5 w-4.5" />, tone: 'bg-amber-50 text-amber-600', title: 'Accreditation Records', sub: 'JCI & NABH Audited' },
                { icon: <Activity className="h-4.5 w-4.5" />, tone: 'bg-indigo-50 text-indigo-600', title: 'Capacity Published', sub: 'Beds, ICU & Trauma Level' },
                { icon: <PhoneCall className="h-4.5 w-4.5" />, tone: 'bg-rose-50 text-rose-600', title: 'Emergency Services', sub: '24/7 Trauma Level I/II' },
                { icon: <Clock className="h-4.5 w-4.5" />, tone: 'bg-teal-50 text-teal-600', title: 'Updated Registry', sub: 'Daily Portal Sync' },
              ]
            : [
                { icon: <Stethoscope className="h-4.5 w-4.5" />, tone: 'bg-emerald-50 text-emerald-600', title: 'Verified Doctors', sub: `${allDoctors.length} Specialists` },
                { icon: <FileCheck2 className="h-4.5 w-4.5" />, tone: 'bg-blue-50 text-blue-600', title: 'Board Certified', sub: 'Council Licence Checked' },
                { icon: <Video className="h-4.5 w-4.5" />, tone: 'bg-indigo-50 text-indigo-600', title: 'Telehealth Ready', sub: 'Video & In-Person OPD' },
                { icon: <Calendar className="h-4.5 w-4.5" />, tone: 'bg-amber-50 text-amber-600', title: 'Live Availability', sub: 'Published Slot Roster' },
                { icon: <Clock className="h-4.5 w-4.5" />, tone: 'bg-teal-50 text-teal-600', title: 'Updated Roster', sub: 'Daily Portal Sync' },
              ]
          ).map((card, i, arr) => (
            <div
              key={card.title}
              className={`flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs ${
                i === arr.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${card.tone}`}>
                {card.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{card.title}</div>
                <div className="text-[11px] text-slate-500 font-medium">{card.sub}</div>
              </div>
            </div>
          ))}
        </section>

        {/* ========================================================================= */}
        {/* 3. DIRECTORY CONTEXT + LINK TO THE OTHER DIRECTORY                        */}
        {/* Hospitals and Doctors are separate pages; this is a cross-link, not a tab */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isHospitals ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {isHospitals ? <Building2 className="h-5 w-5" /> : <Stethoscope className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {isHospitals ? 'Hospitals' : 'Doctors & Specialists'}
              </h2>
              <p className="text-[11px] font-medium text-slate-500">
                {isHospitals
                  ? `${allHospitals.length} verified hospitals in the registry`
                  : `${allDoctors.length} verified specialists in the directory`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onTabChange && (
              <button
                type="button"
                onClick={() => onTabChange(isHospitals ? 'doctors' : 'hospitals')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition shadow-xs cursor-pointer ${
                  isHospitals
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border-blue-200'
                }`}
              >
                {isHospitals ? <Stethoscope className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
                <span>{isHospitals ? 'Looking for a doctor?' : 'Looking for a hospital?'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
            {onTabChange && (
              <button
                type="button"
                onClick={() => onTabChange('medical-map')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                <span>Explore on Medical Map</span>
              </button>
            )}

            <button
              onClick={() => setShowVerificationInfo(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              <Info className="h-3.5 w-3.5 text-emerald-600" />
              <span>How verification works</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: HOSPITALS DIRECTORY & PROFILES */}
        {/* ========================================================================= */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            {/* Search and Filters Floating Panel */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xs border border-slate-200 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search hospitals by name, city, country, or clinical institute..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-3.5 rounded-full p-1 text-slate-400 hover:bg-slate-200 transition"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Symmetrical Filter Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Specialty / Department
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                  >
                    {specialtiesList.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    City / Region
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none transition"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A – Z</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => setEmergencyOnly(!emergencyOnly)}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition cursor-pointer ${
                      emergencyOnly
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <PhoneCall className={`h-3.5 w-3.5 ${emergencyOnly ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span>24/7 Emergency Only</span>
                  </button>
                </div>
              </div>

              {/* Results Count & Reset Filter Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  Showing <strong className="text-slate-900">{filteredHospitals.length}</strong> {filteredHospitals.length === 1 ? 'hospital' : 'hospitals'} {hasActiveFilters ? 'matching your criteria' : 'registered in directory'}
                </span>

                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Symmetrical Hospital Cards Grid */}
            {filteredHospitals.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-slate-900">No Hospitals Found</h3>
                  <p className="text-xs text-slate-500">
                    We could not find any hospitals matching your current search and filter settings.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    className="group rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image Banner */}
                      <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                        <img
                          src={hosp.imageUrl}
                          alt={hosp.name}
                          className="h-full w-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                        
                        {/* Top Floating Badges */}
                        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                          <span className="rounded-full bg-blue-600/95 backdrop-blur-xs text-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                            {hosp.traumaLevel}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/90 backdrop-blur-xs text-white px-2.5 py-0.5 text-[10px] font-bold shadow-xs">
                              <ShieldCheck className="h-3 w-3" />
                              <span>Verified</span>
                            </span>

                            <div className="flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-extrabold text-slate-900 shadow-xs">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span>{hosp.rating}</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Overlay Title & Location */}
                        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                          <span className="text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wider block">
                            {hosp.globalHealthId || hosp.id}
                          </span>
                          <h3 className="text-base font-extrabold text-white leading-snug line-clamp-1 mt-0.5">
                            {hosp.name}
                          </h3>
                          <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span className="truncate">{hosp.location}</span>
                          </p>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed h-8">
                          {hosp.description}
                        </p>

                        {/* Specialties Section with Strict Clamping for Uniform Height */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Key Institutes:
                          </span>
                          <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
                            {hosp.specialties.slice(0, 3).map((spec, i) => (
                              <span key={i} className="rounded-lg bg-slate-100 text-slate-700 px-2 py-0.5 text-[10px] font-semibold truncate max-w-[120px]">
                                {spec}
                              </span>
                            ))}
                            {hosp.specialties.length > 3 && (
                              <span className="rounded-lg bg-slate-50 border border-slate-200 text-slate-500 px-1.5 py-0.5 text-[10px] font-medium">
                                +{hosp.specialties.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dedicated Emergency Hotline Row */}
                        <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                          <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                            <PhoneCall className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                            <span>Emergency 24/7:</span>
                          </span>
                          <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                            {hosp.contact}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Symmetrical Actions Footer */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setSelectedHospital(hosp)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => { if (requireBookingAuth('book a hospital OPD appointment')) setSelectedAppointmentHospital(hosp); }}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 text-xs font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                      >
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        <span>Book OPD</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: DOCTORS & SPECIALIZATIONS DIRECTORY */}
        {/* ========================================================================= */}
        {activeTab === 'doctors' && (
          <div className="space-y-6">
            {/* Search and Filters Floating Panel */}
            <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-xs border border-slate-200 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search doctor by name, specialty, qualification, or hospital affiliation..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-10 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none transition"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-3.5 rounded-full p-1 text-slate-400 hover:bg-slate-200 transition"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Symmetrical Filter Controls Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Specialty / Department
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none transition"
                  >
                    {specialtiesList.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    City / Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none transition"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Sort Specialist By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-none transition"
                  >
                    <option value="rating">Top Rated Specialist</option>
                    <option value="experience">Years of Experience</option>
                    <option value="name">Name A – Z</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={() => setTelehealthOnly(!telehealthOnly)}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition cursor-pointer ${
                      telehealthOnly
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Video className={`h-3.5 w-3.5 ${telehealthOnly ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>Telehealth Available</span>
                  </button>
                </div>
              </div>

              {/* Results Count & Reset Filter Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">
                  Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> {filteredDoctors.length === 1 ? 'doctor' : 'doctors & specialists'} {hasActiveFilters ? 'matching your criteria' : 'verified in directory'}
                </span>

                {hasActiveFilters && (
                  <button
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* Symmetrical Doctors Cards Grid */}
            {filteredDoctors.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-4 shadow-xs">
                <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-slate-900">No Doctors Found</h3>
                  <p className="text-xs text-slate-500">
                    We could not find any doctors or specialists matching your current search filters.
                  </p>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="group rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3.5">
                      {/* Doctor Identity Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 font-extrabold text-base shrink-0 shadow-xs">
                            {(doc?.name || 'Dr. Doctor').replace('Dr. ', '').charAt(0) || 'D'}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                              {doc.name}
                            </h3>
                            <span className="text-xs font-bold text-emerald-600 block mt-0.5">
                              {doc.specialty}
                            </span>
                          </div>
                        </div>

                        <span className="flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 text-[10px] font-bold shrink-0">
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          <span>Verified</span>
                        </span>
                      </div>

                      {/* Doctor Metadata Box */}
                      <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Affiliation:</span>
                          <span className="font-bold text-slate-800 truncate max-w-[180px]" title={doc.hospital}>
                            {doc.hospital}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Degrees:</span>
                          <span className="font-semibold text-slate-800">{doc.education || 'MBBS, MD'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">Experience:</span>
                          <span className="font-bold text-slate-800">{doc.experienceYears} Years</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                          <span className="text-slate-400 font-medium">Consultation Fee:</span>
                          <span className="font-extrabold text-emerald-700">{doc.consultationFee}</span>
                        </div>
                      </div>

                      {/* Available Slots Row */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Available Slots Today:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(doc.availableSlots || ['09:00 AM', '11:15 AM', '02:30 PM', '04:30 PM']).map((slot, i) => (
                            <button
                              key={i}
                              onClick={() => handleOpenAppointmentForDoctor(doc, slot, 'in-person')}
                              className="rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer"
                              title={`Select ${slot}`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Symmetrical Doctor Footer CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Video className="h-3 w-3 text-emerald-600" />
                        In-Person & Telehealth
                      </span>
                      <button
                        onClick={() => handleOpenAppointmentForDoctor(doc, undefined, 'in-person')}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                      >
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Book Slot</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* VERIFICATION TRUST STANDARDS MODAL */}
      {/* ========================================================================= */}
      {showVerificationInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <button
              onClick={() => setShowVerificationInfo(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Verification Standards</h3>
                <p className="text-xs text-slate-500">GlobalHealth Clinical Governance</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                Profiles marked with <strong className="text-emerald-700">Verified Professional</strong> or <strong className="text-blue-700">Level I/II Trauma</strong> have been authenticated against active institutional medical licensure databases and international hospital accreditations (JCI, NABH, ISO-15189).
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-800 text-[11px] uppercase">Standards Checked:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Active National Medical Council / Board Certification</li>
                  <li>Hospital Affiliation and Credentialing Verification</li>
                  <li>Continuous Professional Development & Good Standing</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowVerificationInfo(false)}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: HOSPITAL INTELLIGENCE, AMBULANCE, APPOINTMENT */}
      {/* ========================================================================= */}

      {/* Hospital profiles render as a full page above, matching the medicine
          and disease detail experience. */}

      {/* Book Ambulance Modal */}
      {selectedAmbulanceHospital && (
        <BookAmbulanceModal
          hospital={selectedAmbulanceHospital}
          onClose={() => setSelectedAmbulanceHospital(null)}
        />
      )}

      {/* Book Hospital Appointment Modal */}
      {selectedAppointmentHospital && (
        <BookHospitalAppointmentModal
          hospital={selectedAppointmentHospital}
          onClose={() => setSelectedAppointmentHospital(null)}
        />
      )}

      {/* Direct Doctor Appointment Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <button
              onClick={resetAppointmentModal}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {bookingSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">Appointment Confirmed!</h3>
                  <p className="text-xs text-slate-600">
                    Your appointment with <span className="font-bold text-slate-800">{selectedDoctor.name}</span> is scheduled for <span className="font-bold text-slate-800">{appointmentDate}</span> at <span className="font-bold text-slate-800">{appointmentTime}</span>.
                  </p>
                </div>
                <button
                  onClick={resetAppointmentModal}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                    {(selectedDoctor?.name || 'Dr. Doctor').replace('Dr. ', '').charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedDoctor?.name || 'Specialist'}</h3>
                    <p className="text-xs text-emerald-600 font-semibold">{selectedDoctor?.specialty || 'General'} • {selectedDoctor?.hospital || 'Hospital'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Appointment Date</label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Select Time Slot</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      {(selectedDoctor.availableSlots || ['09:00 AM', '11:15 AM', '02:30 PM', '04:30 PM']).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Patient Full Name</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Consultation Mode</label>
                      <select
                        value={consultationMode}
                        onChange={(e) => setConsultationMode(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold focus:outline-none"
                      >
                        <option value="in-person">In-Person OPD</option>
                        <option value="telehealth">Telehealth Video</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Fee</span>
                    <span className="text-sm font-black text-slate-900">{selectedDoctor.consultationFee}</span>
                  </div>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
