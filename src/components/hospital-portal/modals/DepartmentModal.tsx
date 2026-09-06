import React, { useState, useEffect } from 'react';
import { X, Network, AlertCircle, Building2 } from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { Department } from '../../../types/hospitalPortal';

export const DepartmentModal: React.FC = () => {
  const { activeModal, modalPayload, closeModal, addDepartment, updateDepartment, wings } = useHospitalPortal();

  const isEdit = Boolean(modalPayload && modalPayload.id);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [wingId, setWingId] = useState(wings[0]?.id || 'WING-SOUTH');
  const [floor, setFloor] = useState('Level 3');
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [phoneExtension, setPhoneExtension] = useState('');
  const [totalBeds, setTotalBeds] = useState(60);
  const [specialistsCount, setSpecialistsCount] = useState(8);
  const [status, setStatus] = useState<'Active 24/7' | 'Operational' | 'Under Expansion'>('Operational');
  const [subspecialtiesStr, setSubspecialtiesStr] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeModal === 'department_modal') {
      if (modalPayload && modalPayload.id) {
        const d: Department = modalPayload;
        setName(d.name || '');
        setCode(d.code || '');
        setWingId(d.wingId || wings[0]?.id || '');
        setFloor(d.floor || 'Level 1');
        setHeadOfDepartment(d.headOfDepartment || '');
        setPhoneExtension(d.phoneExtension || (d as any).contactExtension || '');
        setTotalBeds(d.totalBeds || 50);
        setSpecialistsCount(d.specialistsCount || 6);
        setStatus(d.status || 'Operational');
        setSubspecialtiesStr(Array.isArray(d.subspecialties) ? d.subspecialties.join(', ') : '');
        setDescription((d as any).description || '');
      } else {
        setName('');
        setCode(`DEPT-${Math.floor(10 + Math.random() * 90)}`);
        setWingId(wings[0]?.id || 'WING-SOUTH');
        setFloor('Level 2');
        setHeadOfDepartment('');
        setPhoneExtension(`${Math.floor(4000 + Math.random() * 900)}`);
        setTotalBeds(60);
        setSpecialistsCount(8);
        setStatus('Operational');
        setSubspecialtiesStr('');
        setDescription('');
      }
      setError('');
    }
  }, [activeModal, modalPayload, wings]);

  if (activeModal !== 'department_modal') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !headOfDepartment.trim()) {
      setError('Department Name, Code, and Head of Department are required.');
      return;
    }

    const selectedWingObj = wings.find((w) => w.id === wingId);
    const subspecialties = subspecialtiesStr
      ? subspecialtiesStr.split(',').map((s) => s.trim()).filter(Boolean)
      : ['General Care', 'Consultative Services'];

    if (isEdit) {
      updateDepartment(modalPayload.id, {
        name,
        code,
        wingId,
        wingName: selectedWingObj?.name || 'General Clinical Wing',
        floor,
        headOfDepartment,
        phoneExtension,
        totalBeds: Number(totalBeds),
        specialistsCount: Number(specialistsCount),
        status,
        subspecialties,
        ...(description ? { description } : {})
      } as any);
    } else {
      addDepartment({
        name,
        code,
        wingId,
        wingName: selectedWingObj?.name || 'General Clinical Wing',
        floor,
        headOfDepartment,
        phoneExtension,
        totalBeds: Number(totalBeds),
        specialistsCount: Number(specialistsCount),
        status,
        subspecialties
      });
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17221E]/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[#DCEBE4] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCEBE4] bg-[#F1FAF6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#008F68] text-white">
              <Network className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#17221E]">
                {isEdit ? 'Edit Clinical Department' : 'Create Clinical Department'}
              </h3>
              <p className="text-xs text-[#52635C]">
                Institutional Topology, Specialty Rostering & Wing Floor Assignment
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-[#52635C] hover:bg-[#DCEBE4] transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF1F1] border border-[#F2CCCC] text-[#C53939] text-xs font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#52635C] mb-1">Department Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cardiology & Vascular Surgery Institute"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Dept Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CARDIO-01"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Allocated Campus Wing *</label>
              <select
                value={wingId}
                onChange={(e) => setWingId(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                {wings.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Floor Level / Location</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="e.g. Level 3 & 4"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Head of Department (HOD) *</label>
              <input
                type="text"
                required
                value={headOfDepartment}
                onChange={(e) => setHeadOfDepartment(e.target.value)}
                placeholder="e.g. Prof. Dr. Vikram Sethi, MD, MCh"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Internal Phone Extension</label>
              <input
                type="text"
                value={phoneExtension}
                onChange={(e) => setPhoneExtension(e.target.value)}
                placeholder="e.g. 4301 / 4302"
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl font-mono text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Bed Quota</label>
              <input
                type="number"
                min="0"
                value={totalBeds}
                onChange={(e) => setTotalBeds(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Specialists Enrolled</label>
              <input
                type="number"
                min="1"
                value={specialistsCount}
                onChange={(e) => setSpecialistsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#52635C] mb-1">Operational Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
              >
                <option value="Active 24/7">Active 24/7</option>
                <option value="Operational">Operational</option>
                <option value="Under Expansion">Under Expansion</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">
              Subspecialties / Clinical Units (comma separated)
            </label>
            <input
              type="text"
              value={subspecialtiesStr}
              onChange={(e) => setSubspecialtiesStr(e.target.value)}
              placeholder="Interventional Cardiology, Electrophysiology, CTVS, Heart Failure"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#52635C] mb-1">Department Brief & Clinical Scope</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Clinical focus, diagnostic equipment, and treatment capabilities..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#DCEBE4]">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-bold text-[#52635C] hover:bg-[#F1FAF6] rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Network className="h-4 w-4" />
              <span>{isEdit ? 'Save Department Changes' : 'Create Department'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
