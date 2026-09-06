import React, { useMemo, useState } from 'react';
import { MapPin, Search, ArrowRight, Clock, Building2, Cross } from 'lucide-react';
import { NavigationTab } from '../../types';
import { MEDICAL_MAP_FACILITIES, isFacilityCurrentlyOpen } from '../../data/medicalMapData';
import { MAP_FACILITY_TYPES } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface MedicalMapSectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

/** Compact, static map preview — routes users to the full interactive map. */
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

  // Normalize real coordinates into a small stylized map grid.
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
    <section className="gh-section" aria-labelledby="map-title">
      <div className="gh-container">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left: copy + search + filters + CTA */}
          <div>
            <SectionHeading
              id="map-title"
              eyebrow="Medical Map"
              title="Find healthcare around you."
              description="Discover hospitals, clinics, medical centers, nursing homes, urgent care facilities and specialized healthcare locations."
            />

            <div className="mt-7 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft transition focus-within:border-medical-300 focus-within:shadow-lift">
              <Search className="ml-2 h-4.5 w-4.5 shrink-0 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search facilities or areas…"
                aria-label="Search medical facilities"
                className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none" role="group" aria-label="Filter facilities">
              {MAP_FACILITY_TYPES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`gh-chip ${filter === f.id ? 'gh-chip-active' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <ul className="mt-6 space-y-2.5">
              {facilities.map((f) => {
                const open = isFacilityCurrentlyOpen(f);
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => onTabChange('medical-map')}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-left shadow-soft transition hover:border-medical-200 hover:shadow-lift"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <Building2 className="h-4 w-4 shrink-0 text-medical-600" />
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-slate-800">
                            {f.facilityName}
                          </span>
                          <span className="block truncate text-[11px] text-slate-500">
                            {f.facilityType.replace(/_/g, ' ').toLowerCase()} · {f.district || f.address?.city || 'Healthcare facility'}
                          </span>
                        </span>
                      </span>
                      <span
                        className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          open ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        {open ? 'Open' : 'Closed'}
                      </span>
                    </button>
                  </li>
                );
              })}
              {facilities.length === 0 && (
                <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-6 text-center text-xs text-slate-500">
                  No facilities match this search.
                </li>
              )}
            </ul>

            <Button className="mt-6" onClick={() => onTabChange('medical-map')}>
              Open Medical Map
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: stylized compact map preview */}
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-medical-50/60 p-5 shadow-soft">
              {/* faux map grid */}
              <div
                className="absolute inset-0 opacity-[0.35]"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(42,87,109,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,87,109,0.08) 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="gh-eyebrow">
                    <MapPin className="h-3.5 w-3.5" />
                    Verified facility registry
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-medical-700 shadow-sm">
                    {MEDICAL_MAP_FACILITIES.length} locations
                  </span>
                </div>

                <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-medical-50 to-white">
                  {/* marker grid */}
                  {markers.map((m) => (
                    <span
                      key={m.id}
                      title={m.name}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm ${
                        m.type === 'HOSPITAL'
                          ? 'h-3.5 w-3.5 bg-medical-600'
                          : m.type === 'CLINIC' || m.type === 'MEDICAL_CENTER'
                            ? 'h-3 w-3 bg-sky-400'
                            : 'h-3 w-3 bg-emerald-500'
                      }`}
                      style={{ left: `${m.x}%`, top: `${m.y}%` }}
                    />
                  ))}
                  {/* crosshair center */}
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Cross className="h-5 w-5 text-medical-300" />
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-medical-600" /> Hospitals
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Clinics
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Emergency
                  </span>
                  <span className="ml-auto text-slate-400">Open/closed status shown where verified</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
