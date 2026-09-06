import React, { useState } from 'react';
import {
  BadgePercent,
  GitPullRequest,
  Search,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Package,
  IndianRupee,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { ServiceTariff, SurgicalPackage } from '../../../types/hospitalPortal';

export const PricingFinanceView: React.FC = () => {
  const {
    tariffs,
    packages,
    openModal,
    deleteTariff,
    deletePackage
  } = useHospitalPortal();

  const [activeTab, setActiveTab] = useState<'packages' | 'tariffs'>('packages');
  const [searchQuery, setSearchQuery] = useState('');
  const [tariffCategoryFilter, setTariffCategoryFilter] = useState('ALL');

  const filteredTariffs = tariffs.filter((t) => {
    const name = t.name || '';
    const code = t.code || '';
    const cat = t.category || '';
    const matchSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = tariffCategoryFilter === 'ALL' || cat === tariffCategoryFilter;
    return matchSearch && matchCat;
  });

  const filteredPackages = packages.filter((p: any) => {
    const name = p.packageName || p.name || '';
    const code = p.packageCode || '';
    const spec = p.specialty || p.department || '';
    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleDeleteTariff = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove tariff item "${name}" from master price schedule?`)) {
      deleteTariff(id);
    }
  };

  const handleDeletePackage = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove surgical package "${name}"?`)) {
      deletePackage(id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">
              Services, Tariffs & Surgical Packages
            </h1>
            <span className="text-xs font-mono font-bold bg-[#E8F7F1] text-[#008F68] px-2 py-0.5 rounded border border-[#BDE4D5]">
              Live Fee Master
            </span>
          </div>
          <p className="text-xs text-[#52635C]">
            Manage clinical procedure pricing, bundled surgical packages, and two-phase governance revisions
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-[#F1FAF6] rounded-xl border border-[#DCEBE4]">
            <button
              onClick={() => setActiveTab('packages')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'packages'
                  ? 'bg-white text-[#008F68] shadow-xs'
                  : 'text-[#52635C] hover:text-[#17221E]'
              }`}
            >
              Surgical Packages ({packages.length})
            </button>
            <button
              onClick={() => setActiveTab('tariffs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'tariffs'
                  ? 'bg-white text-[#008F68] shadow-xs'
                  : 'text-[#52635C] hover:text-[#17221E]'
              }`}
            >
              Line Tariffs ({tariffs.length})
            </button>
          </div>

          {activeTab === 'packages' ? (
            <button
              onClick={() => openModal('package_modal')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Surgical Package</span>
            </button>
          ) : (
            <button
              onClick={() => openModal('tariff_modal')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008F68] hover:bg-[#007A59] text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Service Tariff</span>
            </button>
          )}

          <button
            onClick={() => openModal('submit_draft')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D8E7E0] hover:bg-[#F1FAF6] text-[#17221E] text-xs font-bold transition shadow-2xs cursor-pointer shrink-0"
            title="Institutional Governance Proposal"
          >
            <GitPullRequest className="h-4 w-4 text-[#D99718]" />
            <span>Propose Revision</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#52635C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'packages'
                ? 'Search surgical package name, code, or specialty...'
                : 'Search tariff code, procedure name, or category...'
            }
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] placeholder-[#8A9993] focus:outline-none focus:border-[#008F68]"
          />
        </div>

        {activeTab === 'tariffs' && (
          <select
            value={tariffCategoryFilter}
            onChange={(e) => setTariffCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#D8E7E0] rounded-xl text-[#17221E] focus:outline-none focus:border-[#008F68]"
          >
            <option value="ALL">All Tariff Categories</option>
            <option value="Consultation & OPD">Consultation & OPD</option>
            <option value="Radiology & Imaging">Radiology & Imaging</option>
            <option value="Pathology & Lab">Pathology & Lab</option>
            <option value="Surgical Procedures">Surgical Procedures</option>
            <option value="Critical Care & ICU">Critical Care & ICU</option>
            <option value="Nursing & Daycare">Nursing & Daycare</option>
          </select>
        )}
      </div>

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackages.map((pkg: any) => {
            const name = pkg.packageName || pkg.name || 'Surgical Procedure';
            const spec = pkg.specialty || pkg.department || 'Surgery';
            const price = pkg.packagePrice || 120000;
            const days = pkg.stayDays || pkg.estimatedStayDays || 3;
            const inclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions : [];
            const exclusions = Array.isArray(pkg.exclusions) ? pkg.exclusions : [];

            return (
              <div
                key={pkg.id}
                className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs hover:border-[#008F68]/40 hover:shadow-sm transition space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#008F68] bg-[#E8F7F1] px-2 py-0.5 rounded border border-[#BDE4D5]">
                      {pkg.packageCode}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1FAF6] text-[#52635C]">
                        {days} Days Inpatient
                      </span>
                      <button
                        title="Edit Package"
                        onClick={() => openModal('package_modal', pkg)}
                        className="p-1.5 rounded-lg text-[#52635C] hover:text-[#008F68] hover:bg-[#E8F7F1] transition cursor-pointer"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title="Delete Package"
                        onClick={() => handleDeletePackage(pkg.id, name)}
                        className="p-1.5 rounded-lg text-[#52635C] hover:text-[#C53939] hover:bg-[#FFF1F1] transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#17221E]">{name}</h3>
                    <p className="text-xs font-semibold text-[#008F68]">{spec}</p>
                    {pkg.description && (
                      <p className="text-xs text-[#52635C] mt-1 line-clamp-2">{pkg.description}</p>
                    )}
                  </div>

                  {inclusions.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-bold text-[#52635C] block">Inclusions:</span>
                      <div className="flex flex-wrap gap-1">
                        {inclusions.slice(0, 4).map((inc: string, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] bg-[#F6FBF8] border border-[#DCEBE4] px-2 py-0.5 rounded text-[#17221E]"
                          >
                            ✓ {inc}
                          </span>
                        ))}
                        {inclusions.length > 4 && (
                          <span className="text-[10px] font-bold bg-[#E8F7F1] text-[#008F68] px-1.5 py-0.5 rounded">
                            +{inclusions.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {exclusions.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] text-[#8A9993] block">
                        Exclusions: {exclusions.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#DCEBE4] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#52635C] block">Standard Package Tariff</span>
                    <span className="text-base font-bold font-mono text-[#17221E]">
                      ₹{price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => openModal('package_modal', pkg)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F1FAF6] hover:bg-[#E8F7F1] text-[#008F68] text-xs font-bold transition cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Edit Tariff</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tariffs Tab */}
      {activeTab === 'tariffs' && (
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#DCEBE4] text-[#52635C] font-bold uppercase text-[10px]">
                  <th className="pb-3 px-3">Service Code</th>
                  <th className="pb-3 px-3">Service & Procedure Name</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Duration / Prep</th>
                  <th className="pb-3 px-3">TPA / Cashless</th>
                  <th className="pb-3 px-3 text-right">Standard Tariff (₹)</th>
                  <th className="pb-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEBE4]">
                {filteredTariffs.map((t) => {
                  const price = t.standardPrice || (t as any).price || 0;
                  const isCovered = t.insuranceCovered !== undefined ? t.insuranceCovered : (t as any).tpaCovered;

                  return (
                    <tr key={t.id} className="hover:bg-[#F6FBF8] group transition">
                      <td className="py-3 px-3 font-mono font-bold text-[#008F68]">{t.code}</td>
                      <td className="py-3 px-3 font-bold text-[#17221E]">
                        <div>{t.name}</div>
                        {t.description && (
                          <div className="text-[11px] font-normal text-[#52635C] line-clamp-1">{t.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-[#52635C]">{t.category}</td>
                      <td className="py-3 px-3 text-[#52635C]">{t.typicalDuration || '30 Mins'}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isCovered
                              ? 'bg-[#E8F7F1] text-[#008F68] border border-[#BDE4D5]'
                              : 'bg-[#F1FAF6] text-[#52635C]'
                          }`}
                        >
                          {isCovered ? 'Yes (Cashless)' : 'Self-Pay / Non-Empaneled'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-[#17221E]">
                        ₹{price.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="Edit Tariff"
                            onClick={() => openModal('tariff_modal', t)}
                            className="p-1.5 rounded-lg text-[#52635C] hover:text-[#008F68] hover:bg-[#E8F7F1] transition cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Delete Tariff"
                            onClick={() => handleDeleteTariff(t.id, t.name)}
                            className="p-1.5 rounded-lg text-[#52635C] hover:text-[#C53939] hover:bg-[#FFF1F1] transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
