import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Maximize2, 
  Minimize2, 
  Locate, 
  Compass, 
  Plus, 
  Minus, 
  Layers,
  MapPin
} from 'lucide-react';
import { MedicalMapFacility, MedicalFacilityType, UserCoordinates } from '../../types/medicalMap';
import { getCategoryBadgeStyles } from './MedicalMapCard';
import { isFacilityCurrentlyOpen } from '../../data/medicalMapData';

interface MedicalMapInteractiveProps {
  facilities: MedicalMapFacility[];
  selectedFacility: MedicalMapFacility | null;
  userCoordinates: UserCoordinates | null;
  onSelectFacility: (facility: MedicalMapFacility) => void;
  onViewDetails: (facility: MedicalMapFacility) => void;
  onGetDirections: (facility: MedicalMapFacility) => void;
  onRequestUserLocation: () => void;
}

export const MedicalMapInteractive: React.FC<MedicalMapInteractiveProps> = ({
  facilities,
  selectedFacility,
  userCoordinates,
  onSelectFacility,
  onViewDetails,
  onGetDirections,
  onRequestUserLocation,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTileLayer, setActiveTileLayer] = useState<'streets' | 'osm'>('streets');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center defaults to New Delhi or first facility
    const initialLat = userCoordinates?.latitude || (facilities[0]?.latitude ?? 28.5494);
    const initialLng = userCoordinates?.longitude || (facilities[0]?.longitude ?? 77.2001);

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
    });

    // High quality OpenStreetMap / Carto Positron tile layer
    const tileLayer = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersGroupRef.current = markersGroup;

    // Clean up on unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Facility Markers whenever facilities change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    facilities.forEach((facility) => {
      const style = getCategoryBadgeStyles(facility.facilityType);
      const isSelected = selectedFacility?.id === facility.id;
      const isOpen = isFacilityCurrentlyOpen(facility);

      // Category Icon SVG Symbol
      let iconSymbol = '🏥';
      if (facility.facilityType === 'CLINIC') iconSymbol = '🩺';
      if (facility.facilityType === 'MEDICAL_CENTER') iconSymbol = '🏢';
      if (facility.facilityType === 'NURSING_HOME') iconSymbol = '🤝';
      if (facility.facilityType === 'URGENT_CARE') iconSymbol = '⚡';
      if (facility.facilityType === 'SPECIALIZED_HEALTH_OFFICE') iconSymbol = '✨';

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-10'
        }">
          <div class="flex items-center justify-center h-9 w-9 rounded-2xl shadow-lg border-2 ${
            isSelected ? 'border-emerald-400 ring-4 ring-emerald-500/30' : 'border-white'
          }" style="background-color: ${style.markerBg}; color: #ffffff;">
            <span class="text-sm select-none">${iconSymbol}</span>
          </div>
          <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b border-white" style="background-color: ${style.markerBg}"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-medical-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([facility.latitude, facility.longitude], {
        icon: customIcon,
        title: facility.facilityName,
      });

      // Compact Popup Content
      const popupHtml = `
        <div class="p-1 max-w-[260px] text-slate-800 font-sans text-xs">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${style.bg}">
              ${style.label}
            </span>
            ${facility.verificationStatus === 'Verified' ? '<span class="text-emerald-700 font-bold text-[10px]">✓ Verified</span>' : ''}
          </div>
          <h4 class="font-bold text-slate-900 text-sm leading-tight mb-1">${facility.facilityName}</h4>
          <p class="text-slate-600 text-[11px] mb-1.5">${facility.address.area ? facility.address.area + ', ' : ''}${facility.address.city}</p>
          <div class="flex items-center justify-between text-[11px] text-slate-500 mb-2">
            <span class="${isOpen ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}">
              ${facility.operatingHours.isOpen24x7 ? 'Open 24/7' : isOpen ? 'Open Now' : 'Closed'}
            </span>
            ${facility.distanceKm !== undefined ? `<span class="font-bold text-slate-700">${facility.distanceKm} km</span>` : ''}
          </div>
          <div class="flex items-center gap-1.5 pt-1.5 border-t border-slate-100">
            <button id="btn-popup-dir-${facility.id}" class="flex-1 py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] text-center">
              Directions
            </button>
            <button id="btn-popup-view-${facility.id}" class="flex-1 py-1 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] text-center">
              Details
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        offset: [0, -10],
        className: 'globalhealth-map-popup',
      });

      marker.on('popupopen', () => {
        const btnDir = document.getElementById(`btn-popup-dir-${facility.id}`);
        const btnView = document.getElementById(`btn-popup-view-${facility.id}`);

        if (btnDir) {
          btnDir.onclick = (e) => {
            e.stopPropagation();
            onGetDirections(facility);
          };
        }
        if (btnView) {
          btnView.onclick = (e) => {
            e.stopPropagation();
            onViewDetails(facility);
          };
        }
      });

      marker.on('click', () => {
        onSelectFacility(facility);
      });

      group.addLayer(marker);
    });

    // Auto fit bounds if facilities exist
    if (facilities.length > 0) {
      const bounds = L.latLngBounds(facilities.map((f) => [f.latitude, f.longitude]));
      if (userCoordinates) {
        bounds.extend([userCoordinates.latitude, userCoordinates.longitude]);
      }
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [facilities]);

  // Pan & Zoom to selected facility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedFacility) return;

    map.flyTo([selectedFacility.latitude, selectedFacility.longitude], 15, {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [selectedFacility]);

  // Update User Location Beacon & Accuracy Radius Circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userCoordinates) {
      // Remove previous markers & accuracy circles if any
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.remove();
        accuracyCircleRef.current = null;
      }

      const accMeters = userCoordinates.accuracy || 15;
      const isHighPrecision = accMeters <= 20;

      // Draw high precision accuracy circle
      const accuracyCircle = L.circle([userCoordinates.latitude, userCoordinates.longitude], {
        radius: accMeters,
        color: isHighPrecision ? '#059669' : '#0284c7',
        fillColor: isHighPrecision ? '#10b981' : '#38bdf8',
        fillOpacity: 0.14,
        weight: 1.5,
        dashArray: '3, 6',
      }).addTo(map);

      accuracyCircleRef.current = accuracyCircle;

      // Custom Precision Radar Pin
      const userIconHtml = `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          <!-- Pulse Radar Wave -->
          <div class="absolute -inset-3 rounded-full ${isHighPrecision ? 'bg-emerald-500/25' : 'bg-sky-500/25'} animate-ping"></div>
          <!-- Outer Ring -->
          <div class="h-8 w-8 rounded-full ${isHighPrecision ? 'bg-emerald-500/30 ring-2 ring-emerald-600/50' : 'bg-sky-500/30 ring-2 ring-sky-600/50'} flex items-center justify-center shadow-lg">
            <!-- Center Core Indicator -->
            <div class="h-4 w-4 rounded-full ${isHighPrecision ? 'bg-emerald-600' : 'bg-sky-600'} border-2 border-white shadow-md flex items-center justify-center">
              <div class="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
            </div>
          </div>
        </div>
      `;

      const userIcon = L.divIcon({
        className: 'custom-user-location-marker',
        html: userIconHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const userPopupContent = `
        <div class="p-1 max-w-[240px] text-slate-800 font-sans text-xs">
          <div class="flex items-center gap-1.5 mb-1 text-[11px] font-bold ${isHighPrecision ? 'text-emerald-700' : 'text-sky-700'}">
            <span class="inline-block h-2 w-2 rounded-full ${isHighPrecision ? 'bg-emerald-500 animate-pulse' : 'bg-sky-500'}"></span>
            <span>${isHighPrecision ? 'Exact GPS Satellite Position' : 'Device Location Detected'}</span>
          </div>
          <p class="font-bold text-slate-900 text-xs mb-1">${userCoordinates.exactAddress || userCoordinates.cityLabel || 'Your Current Location'}</p>
          <div class="text-[10px] text-slate-500 space-y-0.5 border-t border-slate-100 pt-1">
            <div><span class="font-semibold text-slate-700">GPS Accuracy:</span> ±${userCoordinates.accuracy || 10} meters</div>
            <div><span class="font-semibold text-slate-700">Coordinates:</span> ${userCoordinates.latitude.toFixed(6)}°N, ${userCoordinates.longitude.toFixed(6)}°E</div>
            ${userCoordinates.altitude ? `<div><span class="font-semibold text-slate-700">Altitude:</span> ${userCoordinates.altitude}m</div>` : ''}
          </div>
        </div>
      `;

      const userMarker = L.marker([userCoordinates.latitude, userCoordinates.longitude], {
        icon: userIcon,
        zIndexOffset: 2000,
      })
        .bindTooltip(`📍 You are here (±${Math.round(accMeters)}m)`, { permanent: false, direction: 'top', offset: [0, -14] })
        .bindPopup(userPopupContent, { className: 'globalhealth-map-popup' });

      userMarker.addTo(map);
      userMarkerRef.current = userMarker;

      // Smooth zoom to user location based on precision
      const zoomLevel = accMeters <= 20 ? 15 : 13;
      map.flyTo([userCoordinates.latitude, userCoordinates.longitude], zoomLevel, { duration: 1.4 });
    } else {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.remove();
        accuracyCircleRef.current = null;
      }
    }
  }, [userCoordinates]);

  // Map Controls Helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleFitAllResults = () => {
    if (!mapInstanceRef.current || facilities.length === 0) return;
    const bounds = L.latLngBounds(facilities.map((f) => [f.latitude, f.longitude]));
    if (userCoordinates) {
      bounds.extend([userCoordinates.latitude, userCoordinates.longitude]);
    }
    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  };

  const handleRecenter = () => {
    if (userCoordinates) {
      mapInstanceRef.current?.flyTo([userCoordinates.latitude, userCoordinates.longitude], 14);
    } else if (facilities.length > 0) {
      mapInstanceRef.current?.flyTo([facilities[0].latitude, facilities[0].longitude], 13);
    }
  };

  return (
    <div
      className={`relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen min-h-screen border-none' : ''
      }`}
    >
      {/* Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Custom Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-slate-700 shadow-md backdrop-blur-xs hover:bg-white hover:text-emerald-700 transition"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>

        {/* Fit Bounds */}
        <button
          type="button"
          onClick={handleFitAllResults}
          className="grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-slate-700 shadow-md backdrop-blur-xs hover:bg-white hover:text-emerald-700 transition"
          title="Fit to all results"
          aria-label="Fit to all results"
        >
          <Compass className="h-4 w-4" />
        </button>

        {/* Locate Me Button */}
        <button
          type="button"
          onClick={() => {
            if (userCoordinates) {
              handleRecenter();
            } else {
              onRequestUserLocation();
            }
          }}
          className={`grid h-9 w-9 place-items-center rounded-xl shadow-md backdrop-blur-xs transition ${
            userCoordinates
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-white/95 text-slate-700 hover:bg-white hover:text-emerald-700'
          }`}
          title="Use My Location"
          aria-label="Locate me"
        >
          <Locate className="h-4 w-4" />
        </button>

        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl bg-white/95 shadow-md backdrop-blur-xs overflow-hidden divide-y divide-slate-100">
          <button
            type="button"
            onClick={handleZoomIn}
            className="grid h-9 w-9 place-items-center text-slate-700 hover:bg-white hover:text-emerald-700 transition"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="grid h-9 w-9 place-items-center text-slate-700 hover:bg-white hover:text-emerald-700 transition"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Floating Map Legend Indicator */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs shadow-md border border-slate-200/80 text-[11px] font-medium text-slate-700">
        <span className="font-bold text-slate-900">Map Legend:</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600"></span>Hospital</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-600"></span>Clinic</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-600"></span>Medical Center</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-purple-600"></span>Nursing Home</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-600"></span>Urgent Care</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-600"></span>Specialized Office</span>
      </div>
    </div>
  );
};
