import React, { useMemo, useState } from 'react';
import { MapPin, Search, ArrowRight, Clock, Building2, Cross, Droplets, Activity } from 'lucide-react';
import { NavigationTab } from '../../types';
import { MEDICAL_MAP_FACILITIES, isFacilityCurrentlyOpen } from '../../data/medicalMapData';
import { MAP_FACILITY_TYPES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface MedicalMapSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

export const MedicalMapSection: React.FC<MedicalMapSectionProps> = ({ onTabChange }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const facilities = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEDICAL_MAP_FACILITIES.filter((f) => {
      const inFilter =
        filter === 'all' ||
        (filter === 'hospital' && f.facilityType === 'HOSPITAL') ||
        (filter === 'clinic' && (f.facilityType === 'CLINIC' || f.facilityType === 'MEDICAL_CENTER')) ||
        (filter === 'emergency' && f.emergencyServices);
      if (!inFilter) return false;
      if (!q) return true;
      return f.facilityName.toLowerCase().includes(q) || (f.district || '').toLowerCase().includes(q);
    }).slice(0, 4);
  }, [query, filter]);

  const markers = useMemo(() => {
    const lats = MEDICAL_MAP_FACILITIES.map((f) => f.latitude);
    const lons = MEDICAL_MAP_FACILITIES.map((f) => f.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    return MEDICAL_MAP_FACILITIES.slice(0, 14).map((f) => ({
      id: f.id,
      x: 8 + ((f.longitude - minLon) / (maxLon - minLon || 1)) * 84,
      y: 10 + ((maxLat - f.latitude) / (maxLat - minLat || 1)) * 76,
      type: f.facilityType,
      name: f.facilityName,
    }));
  }, []);

  return (
    <section className="gh-section bg-slate-50/70" aria-labelledby="map-title">
      <div className="gh-container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left: Copy + Search + Filters (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <SectionHeading
                id="map-title"
                eyebrow="Geospatial Care Locator"
                title="Interactive Medical Map &amp; Blood Bank Inventory"
                description="Discover 24/7 hospitals, outpatient clinics, intensive care units, nursing homes, and blood bank stock levels."
              />

              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-soft transition focus-within:border-medical-500 focus-within:shadow-card">
                <Search className="ml-2 h-4.5 w-4.5 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search facilities, districts, or areas…"
                  aria-label="Search medical facilities"
                  className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="mt-3.5 flex gap-1.5 overflow-x-auto pb-2 scrollbar-none" role="group" aria-label="Filter facilities">
                {MAP_FACILITY_TYPES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`gh-chip text-xs py-1 px-3 ${filter === f.id ? 'gh-chip-active' : ''}`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <ul className="mt-5 space-y-2.5">
                {facilities.map((f) => {
                  const open = isFacilityCurrentlyOpen(f);
                  return (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => onTabChange('medical-map')}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 text-left shadow-soft transition hover:border-medical-300 hover:shadow-card"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-medical-50 text-medical-700">
                            <Building2 className="h-4.5 w-4.5" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-slate-900">
                              {f.facilityName}
                            </span>
                            <span className="block truncate text-xs text-slate-500 mt-0.5">
                              {f.facilityType.replace(/_/g, ' ').toLowerCase()} · {f.district || f.address?.city || 'Healthcare facility'}
                            </span>
                          </span>
                        </span>
                        <span
                          className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            open ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {open ? 'Open Now' : 'Closed'}
                        </span>
                      </button>
                    </li>
                  );
                })}

                {facilities.length === 0 && (
                  <li className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center text-xs text-slate-500">
                    No medical facilities match this query.
                  </li>
                )}
              </ul>
            </div>

            <div className="mt-6">
              <Button size="lg" onClick={() => onTabChange('medical-map')}>
                <MapPin className="h-4.5 w-4.5" />
                Launch Interactive Medical Map
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right: Futuristic HUD Map Preview (6 cols) */}
          <div className="lg:col-span-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-medical-50/70 via-white to-slate-50 p-6 shadow-card">
                <div
                  className="absolute inset-0 opacity-[0.25]"
                  aria-hidden="true"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(42,87,109,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,87,109,0.12) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-medical-50 px-3 py-1 text-xs font-bold text-medical-800 border border-medical-100">
                      <MapPin className="h-3.5 w-3.5" />
                      Live Facility Telemetry
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-800 shadow-2xs border border-slate-200">
                      {MEDICAL_MAP_FACILITIES.length} Verified Facilities
                    </span>
                  </div>

                  <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-inner">
                    {/* Simulated Radar Wave */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-slate-950/80 to-slate-950" />

                    {/* Marker grid */}
                    {markers.map((m) => (
                      <span
                        key={m.id}
                        title={m.name}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-900 shadow-md transition hover:scale-125 ${
                          m.type === 'HOSPITAL'
                            ? 'h-4 w-4 bg-cyan-400 animate-pulse'
                            : m.type === 'CLINIC' || m.type === 'MEDICAL_CENTER'
                              ? 'h-3.5 w-3.5 bg-sky-400'
                              : 'h-3.5 w-3.5 bg-emerald-400'
                        }`}
                        style={{ left: `${m.x}%`, top: `${m.y}%` }}
                      />
                    ))}

                    {/* Center Crosshair HUD */}
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400/40">
                      <Cross className="h-6 w-6" />
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" /> Hospitals
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Clinics
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Emergency
                      </span>
                    </div>

                    <span className="font-semibold text-emerald-700 inline-flex items-center gap-1">
                      <Droplets className="h-3.5 w-3.5" /> Blood Bank Telemetry Live
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};
