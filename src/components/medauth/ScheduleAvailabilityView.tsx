import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  Users,
  Video,
  Building,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DoctorProfile } from '../../types/medauth';
import { sampleAppointments } from '../../data/samplePatients';

interface ScheduleAvailabilityViewProps {
  doctor: DoctorProfile;
}

export const ScheduleAvailabilityView: React.FC<ScheduleAvailabilityViewProps> = ({ doctor }) => {
  const [selectedDay, setSelectedDay] = useState('Monday, August 24');
  const [clinicHours, setClinicHours] = useState({ start: '08:30 AM', end: '05:30 PM', slotDuration: 30 });
  const [telehealthEnabled, setTelehealthEnabled] = useState(true);

  const timeSlots = [
    { time: '08:30 AM', patient: 'Rahul Kumar (Clinic)', booked: true },
    { time: '09:00 AM', patient: 'Available Slot', booked: false },
    { time: '09:30 AM', patient: 'Available Slot', booked: false },
    { time: '10:00 AM', patient: 'Sophia Sterling (Telehealth)', booked: true },
    { time: '10:30 AM', patient: 'Available Slot', booked: false },
    { time: '11:00 AM', patient: 'Clinical Team Grand Rounds', booked: true },
    { time: '01:30 PM', patient: 'Available Slot', booked: false },
    { time: '02:00 PM', patient: 'Marcus Brody (Clinic)', booked: true },
    { time: '02:30 PM', patient: 'Available Slot', booked: false },
    { time: '03:00 PM', patient: 'Elena Rostova (Clinic)', booked: true },
    { time: '03:30 PM', patient: 'David Miller (Telehealth)', booked: true },
    { time: '04:00 PM', patient: 'Available Slot', booked: false }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Practitioner Roster & Slot Dispatch</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Schedule & Availability Manager
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure outpatient appointment slots, telemedicine buffers, and on-call rotations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-2xs cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Open Ad-hoc Booking Slot</span>
          </button>
        </div>
      </div>

      {/* Date Bar & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-slate-900">{selectedDay}</span>
          <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={telehealthEnabled}
              onChange={(e) => setTelehealthEnabled(e.target.checked)}
              className="accent-emerald-700 rounded"
            />
            <span>Accept Telemedicine Bookings</span>
          </label>
        </div>
      </div>

      {/* Daily Slot Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Daily Consultation Slots (30 Min Standard Cadence)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {timeSlots.map((slot, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border transition space-y-2 ${
                slot.booked
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                  : 'bg-slate-50/50 border-dashed border-slate-300 hover:border-emerald-500'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-800">{slot.time}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    slot.booked ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {slot.booked ? 'BOOKED' : 'OPEN'}
                </span>
              </div>

              <p className={`text-xs ${slot.booked ? 'font-bold text-slate-900' : 'text-slate-500 italic'}`}>
                {slot.patient}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
