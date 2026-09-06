import React, { useState } from 'react';
import {
  Ambulance,
  Siren,
  Navigation,
  CheckCircle2,
  Clock,
  Phone,
  Plus,
  ShieldCheck,
  RotateCcw,
  Edit2,
  Trash2,
  Search,
  Wrench,
  Activity
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { PortalAmbulance } from '../../../types/hospitalPortal';

export const AmbulanceView: React.FC = () => {
  const {
    ambulances,
    openModal,
    returnAmbulance,
    deleteAmbulance
  } = useHospitalPortal();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const inTransitCount = ambulances.filter(
    (a) => a.status === 'Dispatched / In Transit' || a.status === 'At Incident Scene' || a.status === 'Returning with Patient'
  ).length;
  const availableCount = ambulances.filter((a) => a.status === 'Available').length;
  const maintenanceCount = ambulances.filter((a) => a.status === 'Maintenance').length;

  const filteredAmbulances = ambulances.filter((amb) => {
    const vNum = amb.vehicleNumber || '';
    const id = amb.id || '';
    const paramedic = amb.paramedicName || '';
    const driver = amb.driverName || '';
    const matchSearch =
      vNum.toLowerCase().includes(searchQuery.toLowerCase()) ||
      id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paramedic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || amb.status === statusFilter;
    const matchType = typeFilter === 'ALL' || amb.ambulanceType === typeFilter;

    return matchSearch && matchStatus && matchType;
  });

  const handleDelete = (id: string, vNum: string) => {
    if (window.confirm(`Are you sure you want to decommission ambulance unit "${vNum}" from active fleet?`)) {
      deleteAmbulance(id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">
              Ambulance Fleet & STAT Dispatch Telemetry
            </h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              {ambulances.length} Active Fleet Units
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Advanced Life Support (ALS), Basic Life Support (BLS) & NICU Units GPS Dispatch and Roster
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openModal('ambulance_modal')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Ambulance Unit</span>
          </button>
          <button
            onClick={() => openModal('dispatch_ambulance')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D64545] hover:bg-[#C53939] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            <Siren className="h-4 w-4" />
            <span>STAT Emergency Dispatch</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs">
          <span className="text-xs font-bold text-[#008F68] block">Available Base Fleet</span>
          <div className="text-2xl font-bold text-[#008F68] font-mono mt-1">{availableCount} Units</div>
          <span className="text-[10px] text-[#52635C]">Ready at hospital emergency vehicle bay</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs">
          <span className="text-xs font-bold text-[#D64545] block">Dispatched / In Field</span>
          <div className="text-2xl font-bold text-[#D64545] font-mono mt-1">{inTransitCount} Units</div>
          <span className="text-[10px] text-[#52635C]">Active emergency GPS response routes</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs">
          <span className="text-xs font-bold text-[#A86E00] block">Fleet In Inspection</span>
          <div className="text-2xl font-bold text-[#A86E00] font-mono mt-1">{maintenanceCount} Units</div>
          <span className="text-[10px] text-[#52635C]">Sterilization & equipment maintenance</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs">
          <span className="text-xs font-bold text-[#287EA8] block">Rapid Response Benchmark</span>
          <div className="text-2xl font-bold text-[#287EA8] font-mono mt-1">6.2 Mins</div>
          <span className="text-[10px] text-[#52635C]">Metropolitan golden hour response</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicle reg number, unit ID, paramedic, or driver..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
          >
            <option value="ALL">All Life Support Types</option>
            <option value="Advanced Life Support (ALS)">Advanced Life Support (ALS)</option>
            <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
            <option value="Neonatal Intensive Care (NICU Ambulance)">Neonatal NICU</option>
            <option value="Patient Transport">Patient Transport</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
          >
            <option value="ALL">All Statuses</option>
            <option value="Available">Available (Base Depot)</option>
            <option value="Dispatched / In Transit">Dispatched / In Transit</option>
            <option value="At Incident Scene">At Incident Scene</option>
            <option value="Returning with Patient">Returning with Patient</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAmbulances.map((amb: any) => {
          const isDispatched =
            amb.status === 'Dispatched / In Transit' ||
            amb.status === 'At Incident Scene' ||
            amb.status === 'Returning with Patient';
          const isMaintenance = amb.status === 'Maintenance';
          const driverPhone = amb.driverPhone || amb.driverContact || '+91 98110 99881';
          const equipment = Array.isArray(amb.equipmentList) ? amb.equipmentList : [];

          return (
            <div
              key={amb.id}
              className={`p-5 rounded-2xl bg-white border shadow-xs space-y-4 transition flex flex-col justify-between hover:shadow-sm ${
                isDispatched
                  ? 'border-[#F2CCCC] bg-[#FFFDFD]'
                  : isMaintenance
                  ? 'border-[#FED88B] bg-[#FFFDF8]'
                  : 'border-[#DCEBE4]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2.5 rounded-xl ${
                        isDispatched
                          ? 'bg-[#FFF1F1] text-[#D64545] animate-pulse'
                          : isMaintenance
                          ? 'bg-[#FFF7E6] text-[#A86E00]'
                          : 'bg-[#E8F7F1] text-[#008F68]'
                      }`}
                    >
                      <Ambulance className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#17221E]">{amb.id}</h4>
                      <p className="text-xs font-mono font-bold text-[#52635C]">{amb.vehicleNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isDispatched
                          ? 'bg-[#FFF1F1] text-[#C53939] border border-[#F2CCCC]'
                          : isMaintenance
                          ? 'bg-[#FFF7E6] text-[#A86E00] border border-[#FED88B]'
                          : 'bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]'
                      }`}
                    >
                      {amb.status}
                    </span>
                    <button
                      title="Edit Fleet Unit"
                      onClick={() => openModal('ambulance_modal', amb)}
                      className="p-1.5 rounded-lg text-[#52635C] hover:text-[#008F68] hover:bg-[#E8F7F1] transition cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    {ambulances.length > 1 && (
                      <button
                        title="Decommission Ambulance"
                        onClick={() => handleDelete(amb.id, amb.vehicleNumber)}
                        className="p-1.5 rounded-lg text-[#52635C] hover:text-[#C53939] hover:bg-[#FFF1F1] transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 bg-[#F6FBF8] p-3 rounded-xl border border-[#DCEBE4]/60">
                  <div className="text-xs font-bold text-[#008F68] flex items-center justify-between">
                    <span>{amb.ambulanceType}</span>
                    <span className="text-[10px] text-[#52635C] font-normal">
                      Bay: {amb.currentLocation || 'Depot'}
                    </span>
                  </div>
                  <div className="text-xs text-[#52635C] flex items-center justify-between">
                    <span>Lead Paramedic:</span>
                    <strong className="text-[#17221E]">{amb.paramedicName}</strong>
                  </div>
                  <div className="text-xs text-[#52635C] flex items-center justify-between">
                    <span>Driver Contact:</span>
                    <strong className="text-[#17221E] font-mono">{driverPhone}</strong>
                  </div>
                </div>

                {/* Onboard Hardware Tags */}
                {equipment.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#52635C] block">Onboard Life Support:</span>
                    <div className="flex flex-wrap gap-1">
                      {equipment.slice(0, 3).map((eq: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white border border-[#DCEBE4] px-1.5 py-0.5 rounded text-[#17221E] font-medium"
                        >
                          ✓ {eq}
                        </span>
                      ))}
                      {equipment.length > 3 && (
                        <span className="text-[10px] font-bold bg-[#E8F7F1] text-[#008F68] px-1.5 py-0.5 rounded">
                          +{equipment.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {isDispatched && (
                  <div className="p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[#C53939] font-bold">
                      <span>Live Incident / Destination:</span>
                      <span>ETA: ~{amb.etaMinutes || 5} Mins</span>
                    </div>
                    <p className="text-[#17221E] font-semibold">{amb.destination || 'Urban Emergency Call'}</p>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-[#DCEBE4] flex items-center gap-2">
                {isDispatched ? (
                  <button
                    onClick={() => returnAmbulance(amb.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#008F68] bg-[#E8F7F1] hover:bg-[#BDE4D5] rounded-xl transition cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Return to Depot Standby</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => openModal('ambulance_modal', amb)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-[#17221E] bg-[#F1FAF6] hover:bg-[#E8F7F1] rounded-xl transition cursor-pointer border border-[#D8E7E0]"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-[#008F68]" />
                      <span>Edit Unit</span>
                    </button>
                    <button
                      onClick={() => openModal('dispatch_ambulance')}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#D64545] bg-[#FFF1F1] hover:bg-[#F2CCCC] rounded-xl transition cursor-pointer border border-[#F2CCCC]"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      <span>STAT Dispatch</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
