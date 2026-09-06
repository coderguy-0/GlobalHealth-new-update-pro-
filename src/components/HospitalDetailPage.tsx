import React from 'react';
import { ArrowLeft, Award, Building2, Calendar, CheckCircle2, Clock, MapPin, PhoneCall, ShieldCheck, Star, Truck } from 'lucide-react';
import { Hospital } from '../types';

interface HospitalDetailPageProps {
  hospital: Hospital;
  onBack: () => void;
  onBookAppointment: (hospital: Hospital) => void;
  onBookAmbulance: (hospital: Hospital) => void;
}

/** A full-page hospital profile, matching the medicine and disease detail pattern. */
export const HospitalDetailPage: React.FC<HospitalDetailPageProps> = ({ hospital, onBack, onBookAppointment, onBookAmbulance }) => (
  <div className="min-h-screen bg-slate-50">
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-white hover:text-blue-700">
        <ArrowLeft className="h-4 w-4" /> Back to hospitals
      </button>

      <article className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="relative h-56 bg-slate-900 sm:h-72">
          <img src={hospital.imageUrl} alt={hospital.name} className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 text-white sm:left-8 sm:right-8">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1"><ShieldCheck className="h-3.5 w-3.5" /> Verified hospital</span>
              <span className="rounded-full bg-white/15 px-2.5 py-1">{hospital.traumaLevel}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{hospital.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-200"><MapPin className="h-4 w-4 text-blue-300" /> {hospital.address}</p>
          </div>
        </div>

        <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {hospital.rating} rating</span>
              <span className="text-xs font-mono font-bold text-slate-500">{hospital.globalHealthId || hospital.id}</span>
              <span className="text-xs font-semibold text-slate-500">{hospital.type}</span>
            </div>
            <section>
              <h2 className="text-lg font-extrabold text-slate-900">About this hospital</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{hospital.description}</p>
            </section>
            <section>
              <h2 className="text-lg font-extrabold text-slate-900">Departments and specialties</h2>
              <div className="mt-3 flex flex-wrap gap-2">{hospital.specialties.map((specialty) => <span key={specialty} className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800">{specialty}</span>)}</div>
            </section>
            <section className="grid gap-3 sm:grid-cols-3">
              <InfoCard icon={<Building2 className="h-4 w-4" />} label="Total beds" value={String(hospital.totalBeds)} />
              <InfoCard icon={<ShieldCheck className="h-4 w-4" />} label="ICU beds" value={String(hospital.icuBeds)} />
              <InfoCard icon={<Award className="h-4 w-4" />} label="Accreditation" value={(hospital.accreditations || [])[0] || 'Verified'} />
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-extrabold text-slate-900">Plan your visit</h2>
            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <p className="flex items-start gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /> Emergency services: {hospital.operatingHours?.hospitalEmergency || 'Contact hospital'}</p>
              <p className="flex items-start gap-2"><PhoneCall className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /> Main line: {hospital.contact}</p>
              <p className="flex items-start gap-2"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /> Emergency transport available</p>
            </div>
            <div className="mt-5 space-y-2">
              <button type="button" onClick={() => onBookAppointment(hospital)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-700"><Calendar className="h-4 w-4" /> Book appointment</button>
              <button type="button" onClick={() => onBookAmbulance(hospital)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-xs font-bold text-rose-700 transition hover:bg-rose-50"><PhoneCall className="h-4 w-4" /> Ambulance</button>
            </div>
            <p className="mt-4 flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-400"><CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" /> Confirm availability with the hospital before travelling.</p>
          </aside>
        </div>
      </article>
    </div>
  </div>
);

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">{icon}{label}</span><p className="mt-1 text-sm font-extrabold text-slate-900">{value}</p></div>
);
