import React, { useState } from 'react';
import {
  Network,
  Building,
  Layers,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Edit2,
  Trash2,
  Search,
  Users,
  BedDouble,
  Shield,
  Plane,
  Phone
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { Department, Wing } from '../../../types/hospitalPortal';

export const OrganizationView: React.FC = () => {
  const {
    wings,
    departments,
    otRooms,
    beds,
    openModal,
    deleteDepartment,
    deleteWing,
    currentRole
  } = useHospitalPortal();

  const [selectedWing, setSelectedWing] = useState(wings[0]?.id || 'WING-SOUTH');
  const [deptSearch, setDeptSearch] = useState('');
  const [deptWingFilter, setDeptWingFilter] = useState('ALL');

  const activeWingObj = wings.find((w) => w.id === selectedWing) || wings[0];
  const wingBeds = beds.filter((b) => b.wingId === selectedWing);
  const occupiedWingBeds = wingBeds.filter((b) => b.status === 'Occupied').length;

  const filteredDepts = departments.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.code.toLowerCase().includes(deptSearch.toLowerCase()) ||
      d.headOfDepartment.toLowerCase().includes(deptSearch.toLowerCase());
    const matchWing = deptWingFilter === 'ALL' || d.wingId === deptWingFilter || d.wingName === deptWingFilter;
    return matchSearch && matchWing;
  });

  const handleDeleteDepartment = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to decommission and delete clinical department "${name}"?`)) {
      deleteDepartment(id);
    }
  };

  const handleDeleteWing = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to decommission campus wing "${name}"?`)) {
      deleteWing(id);
      if (selectedWing === id) {
        const remaining = wings.filter((w) => w.id !== id);
        if (remaining.length > 0) setSelectedWing(remaining[0].id);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Campus Wings, Departments & Topology</h1>
          <p className="text-xs text-[#52635C]">
            Manage clinical department specialties, institutional wings, surgical suites, and bed allocations
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => openModal('wing_modal')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D8E7E0] hover:bg-[#F1FAF6] text-[#17221E] text-xs font-bold transition shadow-2xs cursor-pointer"
          >
            <Plus className="h-4 w-4 text-[#008F68]" />
            <span>Add Campus Wing</span>
          </button>
          <button
            onClick={() => openModal('department_modal')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Clinical Department</span>
          </button>
        </div>
      </div>

      {/* Wings Array */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#52635C]">
            Campus Towers & Structural Wings ({wings.length})
          </h2>
          <span className="text-xs text-[#52635C]">Click a wing card to inspect structural floor layout</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wings.map((wing) => {
            const isSelected = wing.id === selectedWing;
            const totalInWing = beds.filter((b) => b.wingId === wing.id).length;
            const occInWing = beds.filter((b) => b.wingId === wing.id && b.status === 'Occupied').length;
            const targetCapacity = wing.totalBeds || (wing as any).totalBedsCount || 150;
            const pct = totalInWing > 0 ? Math.round((occInWing / totalInWing) * 100) : 0;

            return (
              <div
                key={wing.id}
                onClick={() => setSelectedWing(wing.id)}
                className={`text-left p-4 rounded-2xl border transition shadow-xs cursor-pointer flex flex-col justify-between group relative ${
                  isSelected
                    ? 'bg-white border-[#008F68] ring-2 ring-[#008F68]/20'
                    : 'bg-white border-[#DCEBE4] hover:border-[#008F68]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#52635C]">{wing.id}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F7F1] text-[#008F68]">
                        {wing.floors || `${(wing as any).totalFloors || 5} Floors`}
                      </span>
                      <button
                        title="Edit Wing"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal('wing_modal', wing);
                        }}
                        className="p-1 rounded text-[#52635C] hover:text-[#008F68] hover:bg-[#E8F7F1] transition"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {wings.length > 1 && (
                        <button
                          title="Decommission Wing"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWing(wing.id, wing.name);
                          }}
                          className="p-1 rounded text-[#52635C] hover:text-[#C53939] hover:bg-[#FFF1F1] transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-[#17221E]">{wing.name}</h3>
                  <p className="text-xs text-[#52635C] mt-0.5">{targetCapacity} Beds Allocation Target</p>
                </div>

                <div className="mt-3 pt-3 border-t border-[#DCEBE4] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#52635C]">Live Beds</span>
                    <span className="font-bold font-mono text-[#17221E]">
                      {occInWing}/{totalInWing} ({pct}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#52635C]">
                    {wing.hasHelipad && (
                      <span className="flex items-center gap-1 bg-[#F1FAF6] px-1.5 py-0.5 rounded text-[#008F68] font-bold">
                        <Plane className="h-2.5 w-2.5" /> Helipad
                      </span>
                    )}
                    {wing.hasDedicatedICU && (
                      <span className="flex items-center gap-1 bg-[#F1FAF6] px-1.5 py-0.5 rounded text-[#287EA8] font-bold">
                        <Shield className="h-2.5 w-2.5" /> ICU Ward
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Wing Details & Structural Topology */}
      {activeWingObj && (
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCEBE4] pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#008F68]" />
              <div>
                <h2 className="text-base font-bold text-[#17221E]">
                  {activeWingObj.name} • Topology Profile
                </h2>
                <p className="text-xs text-[#52635C]">
                  Security Zone: {activeWingObj.securityZone || 'Semi-Sterile Inpatient'} • Supervisor: {activeWingObj.leadNurseSupervisor || 'Floor Nursing Station'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openModal('wing_modal', activeWingObj)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#D8E7E0] hover:bg-[#F1FAF6] text-[#17221E] text-xs font-bold transition cursor-pointer"
              >
                <Edit2 className="h-3.5 w-3.5 text-[#008F68]" />
                <span>Edit Wing</span>
              </button>
              <span className="text-xs font-mono font-bold text-[#008F68] bg-[#E8F7F1] px-2.5 py-1 rounded-lg border border-[#BDE4D5]">
                {wingBeds.length} Active Beds Mapped
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4]">
              <span className="text-xs font-bold text-[#52635C] block mb-1">Floor Levels Span</span>
              <span className="text-sm font-bold text-[#17221E]">{activeWingObj.floors || 'Level 1 to 6'}</span>
              <p className="text-xs text-[#52635C] mt-1">Trauma elevators with direct negative pressure ventilation</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4]">
              <span className="text-xs font-bold text-[#52635C] block mb-1">Bio-Security Classification</span>
              <span className="text-sm font-bold text-[#17221E]">{activeWingObj.securityZone || 'Semi-Sterile Inpatient'}</span>
              <p className="text-xs text-[#52635C] mt-1">HEPA air exchange & biometric scrub room access</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4]">
              <span className="text-xs font-bold text-[#52635C] block mb-1">Wing Nurse Matron / Station</span>
              <span className="text-sm font-bold text-[#17221E]">{activeWingObj.leadNurseSupervisor || 'Central Station Supervisor'}</span>
              <p className="text-xs text-[#52635C] mt-1">Direct crash cart telemetry & code blue trigger</p>
            </div>
          </div>
        </div>
      )}

      {/* Operation Theaters (OT) Surgical Suites Grid */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#DCEBE4] pb-3">
          <div className="flex items-center gap-2">
            <Scissors className="h-5 w-5 text-[#287EA8]" />
            <div>
              <h2 className="text-base font-bold text-[#17221E]">Operation Theater (OT) Suites Roster</h2>
              <p className="text-xs text-[#52635C]">Modular Laminar Flow Surgical Theaters & Robotic Suites</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otRooms.map((ot) => (
            <div
              key={ot.id}
              className="p-4 rounded-xl border border-[#DCEBE4] bg-[#F6FBF8] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#52635C]">{ot.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ot.status === 'In Surgery'
                      ? 'bg-[#FFF1F1] text-[#C53939] border border-[#F2CCCC]'
                      : ot.status === 'Sanitization in Progress'
                      ? 'bg-[#FFF7E6] text-[#A86E00] border border-[#FED88B]'
                      : 'bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]'
                  }`}
                >
                  {ot.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#17221E]">{ot.name}</h4>
                <p className="text-xs text-[#008F68] font-semibold">{ot.specialty}</p>
                <p className="text-xs text-[#52635C]">{ot.wingName} • {ot.floor}</p>
              </div>

              {ot.leadSurgeon && (
                <div className="p-2 rounded-lg bg-white border border-[#DCEBE4] text-xs">
                  <span className="text-[10px] font-bold text-[#52635C] block">Lead Operating Surgeon</span>
                  <span className="font-bold text-[#17221E]">{ot.leadSurgeon}</span>
                  <p className="text-[10px] text-[#52635C]">Proc: {ot.currentProcedure}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Departments Master Matrix */}
      <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-3">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-[#008F68]" />
            <div>
              <h2 className="text-base font-bold text-[#17221E]">
                Clinical Departments Directory ({filteredDepts.length})
              </h2>
              <p className="text-xs text-[#52635C]">
                Institutional specialties, faculty heads, inpatient quotas, and subspecialties
              </p>
            </div>
          </div>
          <button
            onClick={() => openModal('department_modal')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Department</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#52635C]" />
            <input
              type="text"
              placeholder="Search departments by name, code, or HOD..."
              value={deptSearch}
              onChange={(e) => setDeptSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>
          <select
            value={deptWingFilter}
            onChange={(e) => setDeptWingFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
          >
            <option value="ALL">All Campus Wings</option>
            {wings.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Departments Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepts.map((dept) => (
            <div
              key={dept.id}
              className="p-5 rounded-2xl border border-[#DCEBE4] bg-white hover:border-[#008F68]/40 hover:shadow-xs transition space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-[#008F68] bg-[#E8F7F1] px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1FAF6] text-[#52635C] border border-[#DCEBE4]">
                      {dept.status || 'Operational'}
                    </span>
                    <button
                      title="Edit Department"
                      onClick={() => openModal('department_modal', dept)}
                      className="p-1.5 rounded-lg text-[#52635C] hover:text-[#008F68] hover:bg-[#E8F7F1] transition cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title="Delete Department"
                      onClick={() => handleDeleteDepartment(dept.id, dept.name)}
                      className="p-1.5 rounded-lg text-[#52635C] hover:text-[#C53939] hover:bg-[#FFF1F1] transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#17221E]">{dept.name}</h3>
                <p className="text-xs text-[#52635C] mt-0.5 line-clamp-2">
                  {`${dept.wingName || 'Main Hospital Tower'} • ${dept.floor || 'Level 2'}`}
                </p>

                {/* Subspecialties Badges */}
                {Array.isArray(dept.subspecialties) && dept.subspecialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {dept.subspecialties.slice(0, 3).map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F6FBF8] border border-[#DCEBE4] text-[#52635C]"
                      >
                        {sub}
                      </span>
                    ))}
                    {dept.subspecialties.length > 3 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E8F7F1] text-[#008F68]">
                        +{dept.subspecialties.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#DCEBE4] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#52635C]">Head of Dept:</span>
                  <span className="font-bold text-[#17221E] truncate max-w-[170px]">
                    {dept.headOfDepartment}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#52635C] flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Ext: {dept.phoneExtension || dept.phoneExtension || '4000'}
                  </span>
                  <span className="font-mono text-[#52635C]">
                    {dept.totalBeds ? `${dept.totalBeds} Beds Quota` : `${dept.specialistsCount || 6} Doctors`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
