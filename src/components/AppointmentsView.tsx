import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  Building2, 
  Video, 
  MapPin, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Plus, 
  RotateCcw, 
  Star, 
  ShieldCheck, 
  CalendarCheck, 
  CalendarX
} from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';
import { usePatientEhr, AppointmentItem } from '../context/PatientEhrContext';
import { DOCTORS } from '../data/healthData';
import { Doctor, NavigationTab } from '../types';

interface AppointmentsViewProps {
  onTabChange?: (tab: NavigationTab) => void;
  onNavigateToDoctorProfile?: (doctorId: string) => void;
  onNavigateToHospital?: (hospitalId: string) => void;
  isAuthenticated?: boolean;
  onRequireAuth?: (feature: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onTabChange,
  isAuthenticated = false,
  onRequireAuth
}) => {
  const { t, formatNumber } = useLocalization();
  const { 
    activePatient, 
    appointments, 
    bookAppointment, 
    updateAppointmentStatus 
  } = usePatientEhr();

  // Active view tab: 'my-appointments' | 'book-new'
  const [activeTab, setActiveTab] = useState<'my-appointments' | 'book-new'>('my-appointments');

  // Search & Filter for Booking
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All'); // All, In-Person, Video Consult
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  // Booking Modal State
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [bookingType, setBookingType] = useState<'In-Person' | 'Video Consult'>('In-Person');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Cancellation & Reschedule Modals
  const [cancellingApptId, setCancellingApptId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [reschedulingAppt, setReschedulingAppt] = useState<AppointmentItem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('11:00 AM');

  // Specialties list
  const specialties = useMemo(() => {
    const list = Array.from(new Set(DOCTORS.map(d => d.specialty)));
    return ['All', ...list];
  }, []);

  // Filtered doctors for booking
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.location && doc.location.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesType = 
        selectedType === 'All' || 
        (selectedType === 'Video Consult' && (doc.telehealthAvailable !== false)) ||
        (selectedType === 'In-Person' && (doc.inPersonAvailable !== false));

      return matchesSearch && matchesSpecialty && matchesType;
    });
  }, [searchTerm, selectedSpecialty, selectedType]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appt => {
      const isUpcoming = appt.status === 'Confirmed' || appt.status === 'SCHEDULED' || appt.status === 'Waiting' || appt.status === 'In-Progress';
      const isCompleted = appt.status === 'Completed';
      const isCancelled = appt.status === 'Cancelled';

      if (statusFilter === 'all') return true;
      if (statusFilter === 'upcoming') return isUpcoming;
      if (statusFilter === 'completed') return isCompleted;
      if (statusFilter === 'cancelled') return isCancelled;
      return true;
    });
  }, [appointments, statusFilter]);

  const upcomingCount = appointments.filter(a => a.status === 'Confirmed' || a.status === 'SCHEDULED' || a.status === 'Waiting' || a.status === 'In-Progress').length;
  const completedCount = appointments.filter(a => a.status === 'Completed').length;

  const handleOpenBookingModal = (doc: Doctor) => {
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth('book an appointment with a verified healthcare professional');
      return;
    }
    setSelectedDoctorForBooking(doc);
    setBookingError(null);
    setBookingReason('');
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctorForBooking) return;

    if (!bookingDate) {
      setBookingError('Please select a valid appointment date.');
      return;
    }

    // Double-booking check: prevent booking exact same doctor, date and time
    const collision = appointments.some(
      a => (a.doctorName || '').toLowerCase().includes(selectedDoctorForBooking.name.toLowerCase()) && 
           a.date === bookingDate && 
           a.time === bookingTime && 
           a.status !== 'Cancelled'
    );

    if (collision) {
      setBookingError(`You already have an appointment scheduled with ${selectedDoctorForBooking.name} at ${bookingTime} on ${bookingDate}. Please choose a different time slot.`);
      return;
    }

    bookAppointment({
      doctorName: selectedDoctorForBooking.name,
      patientId: activePatient.id,
      patientName: activePatient.name,
      mrn: activePatient.mrn,
      age: activePatient.age,
      gender: activePatient.gender,
      date: bookingDate,
      time: bookingTime,
      reason: bookingReason || `Routine consultation with ${selectedDoctorForBooking.specialty} specialist.`,
      type: bookingType === 'Video Consult' ? 'Video Call (Telemedicine)' : 'Clinic (In-Person)',
      priority: 'Routine',
      notes: `Consultation at ${selectedDoctorForBooking.hospital}. Fee: ${selectedDoctorForBooking.consultationFee}`,
      roomOrDesk: selectedDoctorForBooking.hospital
    });

    setSelectedDoctorForBooking(null);
    setBookingSuccessMsg(`Appointment successfully confirmed with ${selectedDoctorForBooking.name} for ${bookingDate} at ${bookingTime}.`);
    setActiveTab('my-appointments');
    setTimeout(() => setBookingSuccessMsg(null), 5000);
  };

  const handleCancelAppointment = () => {
    if (!cancellingApptId) return;
    updateAppointmentStatus(cancellingApptId, 'Cancelled');
    setCancellingApptId(null);
    setCancelReason('');
  };

  const handleConfirmReschedule = () => {
    if (!reschedulingAppt || !rescheduleDate) return;
    updateAppointmentStatus(reschedulingAppt.id, 'SCHEDULED');
    setReschedulingAppt(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Symmetrical Top Banner & Stats */}
        <div className="mb-6 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                <CalendarCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Verified Clinical Appointments Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Appointments &amp; Consultations
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Schedule, manage, reschedule, and attend verified in-person hospital consultations and secure telehealth sessions.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 text-center min-w-28">
                <div className="text-2xl font-black text-emerald-700">{formatNumber(upcomingCount)}</div>
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Upcoming</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center min-w-28">
                <div className="text-2xl font-black text-slate-800">{formatNumber(completedCount)}</div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Completed</div>
              </div>
            </div>
          </div>

          {/* Booking Success Toast */}
          {bookingSuccessMsg && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-900 flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{bookingSuccessMsg}</span>
              </div>
              <button onClick={() => setBookingSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Navigation Bar Toggle */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('my-appointments')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
                  activeTab === 'my-appointments'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>My Appointments ({formatNumber(appointments.length)})</span>
              </button>
              <button
                onClick={() => setActiveTab('book-new')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold transition ${
                  activeTab === 'book-new'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Plus className="h-4 w-4" />
                <span>Book New Consultation</span>
              </button>
            </div>

            {activeTab === 'my-appointments' && (
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <span className="text-slate-400 mr-1 text-[11px]">Filter:</span>
                {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-xl px-3 py-1.5 capitalize transition ${
                      statusFilter === s
                        ? 'bg-slate-900 font-bold text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: MY APPOINTMENTS */}
        {activeTab === 'my-appointments' && (
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Calendar className="h-7 w-7" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-slate-900">No appointments in this view</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {statusFilter === 'all' 
                      ? 'You have not scheduled any doctor or hospital appointments yet.'
                      : `You have no ${statusFilter} appointments recorded.`}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('book-new')}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Book Your First Consultation</span>
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAppointments.map(appt => {
                  const isUpcoming = appt.status === 'Confirmed' || appt.status === 'SCHEDULED' || appt.status === 'Waiting' || appt.status === 'In-Progress';
                  const isCompleted = appt.status === 'Completed';

                  return (
                    <div 
                      key={appt.id}
                      className={`rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                        isUpcoming ? 'border-emerald-200/90' : isCompleted ? 'border-slate-200' : 'border-rose-100 bg-rose-50/20'
                      }`}
                    >
                      <div className="space-y-3.5">
                        {/* Status Badge & Consultation Type */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            isUpcoming ? 'bg-emerald-100 text-emerald-800' :
                            isCompleted ? 'bg-slate-100 text-slate-700' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {isUpcoming && <CheckCircle2 className="h-3 w-3" />}
                            {isCompleted && <CheckCircle2 className="h-3 w-3" />}
                            {appt.status === 'Cancelled' && <CalendarX className="h-3 w-3" />}
                            <span>{appt.status}</span>
                          </span>

                          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            {appt.type.includes('Video') || appt.type.includes('TELEMEDICINE') ? (
                              <Video className="h-3.5 w-3.5 text-teal-600" />
                            ) : (
                              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                            <span className="truncate">{appt.type}</span>
                          </span>
                        </div>

                        {/* Doctor Info */}
                        <div className="space-y-1">
                          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                            <Stethoscope className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span>{appt.doctorName || 'Attending Physician'}</span>
                          </h3>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{appt.roomOrDesk || 'Clinical Facility'}</span>
                          </div>
                        </div>

                        {/* Date and Time Box */}
                        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 flex items-center justify-between text-xs font-bold text-slate-800">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-emerald-600" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-600">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{appt.time}</span>
                          </div>
                        </div>

                        {/* Reason / Notes */}
                        {appt.reason && (
                          <p className="text-[11px] text-slate-600 line-clamp-2">
                            <span className="font-semibold text-slate-800">Reason: </span>
                            {appt.reason}
                          </p>
                        )}
                        {appt.notes && (
                          <p className="text-[10px] text-slate-400 italic line-clamp-1">
                            {appt.notes}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        {isUpcoming ? (
                          <>
                            <button
                              onClick={() => {
                                setReschedulingAppt(appt);
                                setRescheduleDate(appt.date);
                                setRescheduleTime(appt.time);
                              }}
                              className="flex-1 rounded-xl border border-slate-200 bg-white py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition text-center"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => setCancellingApptId(appt.id)}
                              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-medium">
                            <span>Record: #{appt.id.slice(0, 8)}</span>
                            <button
                              onClick={() => setActiveTab('book-new')}
                              className="font-bold text-emerald-600 hover:underline"
                            >
                              Book Again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOK NEW CONSULTATION */}
        {activeTab === 'book-new' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Search */}
                <div className="sm:col-span-1 relative flex items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search doctor, hospital, or specialty..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-10 pr-3 py-2 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-3 text-slate-400 hover:text-slate-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Specialty Select */}
                <div className="sm:col-span-1">
                  <select
                    value={selectedSpecialty}
                    onChange={e => setSelectedSpecialty(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                  >
                    {specialties.map(spec => (
                      <option key={spec} value={spec}>
                        {spec === 'All' ? 'All Specialties' : spec}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mode Filter */}
                <div className="sm:col-span-1 flex items-center gap-2">
                  {(['All', 'In-Person', 'Video Consult'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setSelectedType(m)}
                      className={`flex-1 rounded-2xl py-2 text-xs font-bold transition border ${
                        selectedType === m
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map(doctor => (
                <div 
                  key={doctor.id}
                  className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    {/* Doctor Header */}
                    <div className="flex items-start gap-3.5">
                      <img 
                        src={doctor.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'} 
                        alt={doctor.name} 
                        className="h-14 w-14 rounded-2xl object-cover border border-emerald-200 shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-extrabold text-slate-900 truncate">{doctor.name}</h3>
                          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" aria-label="Board-Certified Specialist" />
                        </div>
                        <div className="text-xs font-semibold text-emerald-700">{doctor.specialty}</div>
                        <div className="text-[11px] text-slate-500 truncate">{doctor.degree || 'MD, Clinical Specialist'}</div>
                      </div>
                    </div>

                    {/* Hospital & Location */}
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 space-y-1.5 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                        <Building2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{doctor.hospital}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {doctor.location}
                        </span>
                        <span className="flex items-center gap-1 text-amber-700 font-bold">
                          <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" /> {doctor.rating} ({doctor.experienceYears} yrs)
                        </span>
                      </div>
                    </div>

                    {/* Fees & Consultation Modes */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500 font-medium">Consultation Fee:</span>
                      <span className="font-extrabold text-slate-900">{doctor.consultationFee}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold">
                        In-Person Clinic
                      </span>
                      <span className="rounded-lg bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 text-[10px] font-semibold">
                        Video Telehealth
                      </span>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => handleOpenBookingModal(doctor)}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-2.5 text-xs font-extrabold text-white shadow-xs hover:bg-emerald-700 transition"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Book Consultation</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: BOOKING CONFIRMATION FORM */}
      {selectedDoctorForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2 text-emerald-800">
                <CalendarCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">Book Clinical Appointment</h3>
              </div>
              <button
                onClick={() => setSelectedDoctorForBooking(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Doctor Snapshot */}
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5 mb-4">
              <img 
                src={selectedDoctorForBooking.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200'} 
                alt={selectedDoctorForBooking.name}
                className="h-12 w-12 rounded-xl object-cover border border-emerald-200"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">{selectedDoctorForBooking.name}</h4>
                <div className="text-[11px] font-semibold text-emerald-800">{selectedDoctorForBooking.specialty}</div>
                <div className="text-[10px] text-slate-500 truncate">{selectedDoctorForBooking.hospital}</div>
              </div>
            </div>

            {bookingError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-4 text-xs">
              {/* Date & Time Select */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Consultation Mode */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('In-Person')}
                    className={`flex items-center justify-center gap-2 rounded-xl p-2.5 font-bold transition border ${
                      bookingType === 'In-Person'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>In-Person Clinic</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('Video Consult')}
                    className={`flex items-center justify-center gap-2 rounded-xl p-2.5 font-bold transition border ${
                      bookingType === 'Video Consult'
                        ? 'border-teal-500 bg-teal-50 text-teal-900'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Telehealth Video</span>
                  </button>
                </div>
              </div>

              {/* Reason / Notes */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for Visit (Optional)</label>
                <textarea
                  rows={2}
                  value={bookingReason}
                  onChange={e => setBookingReason(e.target.value)}
                  placeholder="Describe your symptoms or consultation goals..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden resize-none"
                />
              </div>

              {/* Security & Double Booking Warning */}
              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 space-y-1 border border-slate-200">
                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Instant Verification &amp; Collision Protection</span>
                </div>
                <p>This slot will be locked directly into the hospital's clinical schedule and synced with your private GlobalHealth EHR.</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoctorForBooking(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white shadow-xs hover:bg-emerald-700 transition flex items-center gap-1.5"
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CANCEL APPOINTMENT */}
      {cancellingApptId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-150 space-y-4">
            <div className="flex items-center gap-2 text-rose-700">
              <CalendarX className="h-5 w-5" />
              <h3 className="text-base font-extrabold text-slate-900">Cancel Appointment</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel this scheduled consultation? The doctor's department will be notified and your EHR record updated.
            </p>
            <div>
              <label className="block text-slate-700 font-bold mb-1 text-xs">Cancellation Reason</label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                placeholder="Schedule conflict, symptom resolved, etc..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingApptId(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelAppointment}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: RESCHEDULE APPOINTMENT */}
      {reschedulingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in fade-in duration-150 space-y-4">
            <div className="flex items-center gap-2 text-indigo-700">
              <RotateCcw className="h-5 w-5" />
              <h3 className="text-base font-extrabold text-slate-900">Reschedule Appointment</h3>
            </div>
            <div className="text-xs text-slate-600">
              Rescheduling consultation with <strong>{reschedulingAppt.doctorName}</strong>.
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">New Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">New Time Slot</label>
                <select
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-800"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReschedulingAppt(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                Confirm New Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
