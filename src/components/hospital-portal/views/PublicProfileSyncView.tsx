import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Globe2, RefreshCw, AlertCircle, CheckCircle2, Loader2, Save, History,
  ShieldCheck, Radio, Plus, Trash2, ChevronRight, Building2
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import {
  fetchHospitalRecord, saveHospitalSection, fetchHospitalAudit,
  CentralHospitalRecord, HospitalAuditRecord
} from '../../../services/hospitalRegistryClient';

// ---------------------------------------------------------------------------
// GlobalHealth Public Profile Sync.
//
// The hospital's control surface for its PUBLIC user-platform profile. Every
// save is validated, diffed, written to the central hospital registry (the
// source of truth) and published — the user platform (hospital profile,
// search, medical map, doctor directory) reads that registry live, so changes
// appear on the platform immediately. A hospital token only ever authorises
// THIS hospital's record.
// ---------------------------------------------------------------------------

const SECTION_META: Record<string, { label: string; hint: string }> = {
  identity: { label: 'Basic Identity', hint: 'Name, legal name, type, registration, verification' },
  location: { label: 'Location & Navigation', hint: 'Address, coordinates, entrances — syncs to the Medical Map' },
  contact: { label: 'Contact & Hours', hint: 'Phones, email, website, OPD/visiting hours' },
  departments: { label: 'Departments', hint: 'Department roster shown on the public profile' },
  doctors: { label: 'Doctor Roster', hint: 'Doctors displayed under this hospital' },
  bedsFacilities: { label: 'Beds & Facilities', hint: 'Bed inventory and public facilities' },
  labImaging: { label: 'Laboratory & Imaging', hint: 'Lab tests and imaging services' },
  pharmacyBlood: { label: 'Blood Bank Services', hint: 'Blood bank and pharmacy information' },
  services: { label: 'Services', hint: 'Public list of hospital services' },
  pricing: { label: 'Pricing & Finance', hint: 'Public pricing items only (drafts stay private)' },
  international: { label: 'International Care', hint: 'International patient desk' },
  accreditation: { label: 'Accreditation', hint: 'Verified accreditations' },
  researchEducation: { label: 'Research & Education', hint: 'Programs, publications, events' },
  news: { label: 'Updates & News', hint: 'Hospital-specific announcements (isolated to this hospital)' }
};

const OBJECT_SECTIONS = ['identity', 'location', 'contact', 'bedsFacilities', 'labImaging', 'pharmacyBlood', 'international'];
const LIST_SECTIONS = ['departments', 'doctors', 'services', 'pricing', 'accreditation', 'researchEducation', 'news'];

const inputCls =
  'w-full rounded-xl border border-[#D8E6DF] bg-white px-3 py-2 text-xs font-medium text-[#17221E] outline-none focus:border-[#008F68] focus:ring-2 focus:ring-[#BDE4D5]';

const FieldInput: React.FC<{
  value: any;
  onChange: (v: any) => void;
  label?: string;
}> = ({ value, onChange, label }) => {
  const common = { className: inputCls, 'aria-label': label };
  if (typeof value === 'boolean') {
    return (
      <label className="inline-flex items-center gap-2 text-xs font-bold text-[#33443C] cursor-pointer">
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#008F68]" />
        {label || 'Enabled'}
      </label>
    );
  }
  if (typeof value === 'number') {
    return <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value) || 0)} {...common} />;
  }
  if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
    return (
      <input
        type="text"
        value={value.join(', ')}
        onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
        placeholder="Comma separated"
        {...common}
      />
    );
  }
  return <input type="text" value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} {...common} />;
};

export const PublicProfileSyncView: React.FC = () => {
  const { currentHospital, currentUser } = useHospitalPortal();
  const hospitalId = currentHospital?.id;
  const actor = {
    userId: currentUser?.id || 'portal-user',
    userName: currentUser?.name || currentHospital?.name || 'Hospital Portal User',
    userRole: currentUser?.role || 'Hospital Administrator'
  };

  const [record, setRecord] = useState<CentralHospitalRecord | null>(null);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [activeSection, setActiveSection] = useState<string>('identity');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [audit, setAudit] = useState<HospitalAuditRecord[]>([]);

  const load = useCallback(async () => {
    if (!hospitalId) return;
    setLoading(true);
    setError(null);
    const res = await fetchHospitalRecord(hospitalId);
    if (!res.ok || !res.record) {
      setError(res.error || 'Registry temporarily unavailable.');
      setRecord(null);
    } else {
      setRecord(res.record);
      setDraft({
        identity: { ...res.record.identity },
        location: { ...res.record.location },
        contact: { ...res.record.contact },
        bedsFacilities: { ...res.record.bedsFacilities, facilities: res.record.bedsFacilities.facilities.map((f) => ({ ...f })) },
        labImaging: { ...res.record.labImaging, imagingServices: res.record.labImaging.imagingServices.map((s) => ({ ...s })), labTests: [...res.record.labImaging.labTests] },
        pharmacyBlood: {
          ...res.record.pharmacyBlood,
          bloodComponents: [...res.record.pharmacyBlood.bloodComponents],
          bloodInventory: (res.record.pharmacyBlood.bloodInventory || []).map((b) => ({ ...b }))
        },
        international: { ...res.record.international },
        departments: res.record.departments.map((d) => ({ ...d })),
        doctors: res.record.doctors.map((d) => ({ ...d })),
        services: res.record.services.map((s) => ({ ...s })),
        pricing: res.record.pricing.map((p) => ({ ...p })),
        accreditation: res.record.accreditation.map((a) => ({ ...a })),
        researchEducation: res.record.researchEducation.map((r) => ({ ...r })),
        news: res.record.news.map((n) => ({ ...n }))
      });
    }
    setLoading(false);
    fetchHospitalAudit(hospitalId).then((a) => setAudit(a.records));
  }, [hospitalId]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(() => {
    if (!record) return false;
    return JSON.stringify(draft[activeSection]) !== JSON.stringify((record as any)[activeSection]);
  }, [draft, record, activeSection]);

  const save = async () => {
    if (!hospitalId || !dirty) return;
    setSaving(true);
    setNotice(null);
    const res = await saveHospitalSection(hospitalId, activeSection, draft[activeSection], actor);
    if (res.ok && res.record) {
      setRecord(res.record);
      setNotice({
        ok: true,
        text: res.unchanged
          ? 'No changes detected.'
          : res.message || 'Saved and published to the GlobalHealth user platform.'
      });
      fetchHospitalAudit(hospitalId).then((a) => setAudit(a.records));
    } else {
      setNotice({
        ok: false,
        text: res.problems?.length ? `Validation failed: ${res.problems.join(' ')}` : res.error || 'The update could not be saved.'
      });
    }
    setSaving(false);
  };

  // ---- renderers ----
  // Inline editor for object-array fields inside section objects (e.g.
  // labImaging.imagingServices, bedsFacilities.facilities). Rows are editable;
  // removed rows keep their audit history on the server.
  const renderObjectArrayField = (section: string, field: string, rows: any[]) => {
    const setRows = (next: any[]) =>
      setDraft((prev) => ({ ...prev, [section]: { ...prev[section], [field]: next } }));
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const updateCell = (r: number, key: string, v: any) =>
      setRows(rows.map((row, i) => (i === r ? { ...row, [key]: v } : row)));

    return (
      <div className="sm:col-span-2 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black uppercase tracking-wide text-[#52635C]">
            {field.replace(/([A-Z])/g, ' $1')} ({rows.length})
          </label>
          <button
            onClick={() => {
              const blank: any = {};
              columns.forEach((c) => {
                blank[c] = c === 'status' ? 'ACTIVE' : c === 'hours' ? '08:00 AM - 08:00 PM' : '';
              });
              if (columns.length === 0) blank.name = '';
              setRows([...rows, blank]);
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-[#BDE4D5] bg-[#E8F7F1] px-2.5 py-1 text-[10px] font-black text-[#006B4F] hover:bg-[#D5F0E4] cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-[#D8E6DF]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6FBF8] text-[10px] uppercase tracking-wide text-[#52635C]">
              <tr>
                {columns.map((c) => <th key={c} className="px-2.5 py-2 font-black whitespace-nowrap">{c}</th>)}
                <th className="px-2.5 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF5F1]">
              {rows.map((row, r) => (
                <tr key={r}>
                  {columns.map((c) => (
                    <td key={c} className="px-1.5 py-1.5 min-w-[110px]">
                      {typeof row[c] === 'boolean' ? (
                        <FieldInput label={c} value={row[c]} onChange={(v) => updateCell(r, c, v)} />
                      ) : (
                        <FieldInput label={c} value={row[c] ?? ''} onChange={(v) => updateCell(r, c, v)} />
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-1.5 text-right">
                    <button
                      onClick={() => setRows(rows.filter((_, i) => i !== r))}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={columns.length + 1} className="px-2.5 py-4 text-center text-[#7A8B83]">No entries — use Add.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderObjectSection = (section: string) => {
    const data = draft[section] || {};
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(data).map(([field, value]) => {
          // Object arrays get a dedicated inline row editor.
          if (Array.isArray(value) && value.some((v) => typeof v === 'object' && v !== null)) {
            return renderObjectArrayField(section, field, value as any[]);
          }
          return (
            <div className={typeof value === 'boolean' ? 'flex items-end pb-1' : ''}>
              {typeof value !== 'boolean' && (
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-wide text-[#52635C]">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
              )}
              {typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                <pre className="rounded-xl bg-[#F6FBF8] border border-[#D8E6DF] p-3 text-[10px] text-[#33443C] overflow-x-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                <FieldInput
                  label={field}
                  value={value}
                  onChange={(v) => setDraft((prev) => ({ ...prev, [section]: { ...prev[section], [field]: v } }))}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderListSection = (section: string) => {
    const rows: any[] = draft[section] || [];
    const keys = rows.length > 0 ? Object.keys(rows[0]) : [];
    const setRows = (next: any[]) => setDraft((prev) => ({ ...prev, [section]: next }));
    const updateRow = (i: number, key: string, v: any) =>
      setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: v } : r)));

    return (
      <div className="space-y-3">
        <div className="overflow-x-auto rounded-2xl border border-[#D8E6DF]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F6FBF8] text-[10px] uppercase tracking-wide text-[#52635C]">
              <tr>
                {keys.map((k) => (
                  <th key={k} className="px-3 py-2 font-black whitespace-nowrap">{k}</th>
                ))}
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDF5F1]">
              {rows.map((row, i) => (
                <tr key={i}>
                  {keys.map((k) => (
                    <td key={k} className="px-2 py-1.5 min-w-[120px]">
                      {k === 'status' && typeof row[k] === 'string' ? (
                        <select value={row[k]} onChange={(e) => updateRow(i, k, e.target.value)} className={inputCls}>
                          {['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'PUBLISHED', 'DRAFT', 'VERIFIED', 'PENDING', 'ARCHIVED']
                            .filter((v, idx, arr) => arr.indexOf(v) === idx)
                            .map((opt) => <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>)}
                        </select>
                      ) : typeof row[k] === 'boolean' ? (
                        <FieldInput label={k} value={row[k]} onChange={(v) => updateRow(i, k, v)} />
                      ) : Array.isArray(row[k]) ? (
                        <FieldInput label={k} value={row[k]} onChange={(v) => updateRow(i, k, v)} />
                      ) : (
                        <FieldInput label={k} value={row[k]} onChange={(v) => updateRow(i, k, v)} />
                      )}
                    </td>
                  ))}
                  <td className="px-2 py-1.5 text-right">
                    <button
                      onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
                      className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Remove row (history is preserved in the audit trail)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={keys.length + 1} className="px-3 py-6 text-center text-[#52635C]">
                    No entries yet — add one below. Removed entries keep their audit history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => {
            const blank: any = {};
            keys.forEach((k) => {
              blank[k] = k === 'status' ? 'ACTIVE' : k === 'experienceYears' || k === 'consultationFee' ? 0 : '';
            });
            if (keys.length === 0) blank.name = '';
            setRows([...rows, blank]);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#BDE4D5] bg-[#E8F7F1] px-3 py-2 text-xs font-black text-[#006B4F] hover:bg-[#D5F0E4] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add entry
        </button>
      </div>
    );
  };

  if (!hospitalId) {
    return <div className="p-6 text-xs text-[#52635C]">No hospital is selected in this portal session.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#D8E6DF] bg-white p-5 sm:p-6 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#008F68] to-[#006B4F] text-white flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#17221E] tracking-tight">GlobalHealth Public Profile Sync</h2>
              <p className="text-xs text-[#52635C] leading-relaxed mt-0.5 max-w-2xl">
                Everything saved here is published to the <strong>central hospital registry</strong> — the source of truth the
                GlobalHealth user platform reads live. Updates appear automatically on this hospital&apos;s profile, search results,
                the Medical Map and the doctor directory. This portal can only modify{' '}
                <strong>{currentHospital?.name}</strong> (<span className="font-mono">{hospitalId}</span>).
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D8E6DF] bg-white px-3 py-2 text-xs font-bold text-[#33443C] hover:bg-[#F6FBF8] transition disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Syncing…' : 'Refresh from registry'}
            </button>
            {record && (
              <span className="text-[10px] font-mono text-[#52635C]">
                v{record.version} · published {new Date(record.lastUpdated).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        {record && (
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-black">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F7F1] border border-[#BDE4D5] text-[#006B4F] px-2.5 py-1">
              <ShieldCheck className="w-3 h-3" /> {record.identity.verificationStatus}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1">
              <Radio className="w-3 h-3 animate-pulse" /> {record.publicationStatus} · {record.syncStatus}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 px-2.5 py-1">
              <Building2 className="w-3 h-3" /> {record.departments.filter((d) => d.status === 'ACTIVE').length} active departments
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" /> {error}</span>
          <button onClick={load} className="shrink-0 rounded-xl border border-rose-300 px-3 py-1.5 font-bold hover:bg-rose-100 cursor-pointer">Try again</button>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-[#D8E6DF] bg-white p-10 text-center text-xs text-[#52635C] flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#008F68]" />
          Loading this hospital&apos;s central registry record…
        </div>
      )}

      {!loading && record && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Section nav */}
          <div className="lg:col-span-4 rounded-2xl border border-[#D8E6DF] bg-white p-3 space-y-1">
            <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#52635C]">
              Information sections
            </div>
            {[...OBJECT_SECTIONS, ...LIST_SECTIONS].map((section) => {
              const meta = SECTION_META[section];
              const isActive = activeSection === section;
              return (
                <button
                  key={section}
                  onClick={() => { setActiveSection(section); setNotice(null); }}
                  className={`w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left transition cursor-pointer ${
                    isActive ? 'bg-[#008F68] text-white shadow-sm' : 'hover:bg-[#F6FBF8] text-[#33443C]'
                  }`}
                >
                  <span>
                    <span className="block text-xs font-black">{meta?.label || section}</span>
                    <span className={`block text-[10px] leading-tight mt-0.5 ${isActive ? 'text-emerald-50' : 'text-[#7A8B83]'}`}>
                      {meta?.hint}
                    </span>
                  </span>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#9AABA3]'}`} />
                </button>
              );
            })}
          </div>

          {/* Editor */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-[#D8E6DF] bg-white p-5 space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-black text-[#17221E]">{SECTION_META[activeSection]?.label}</h3>
                  <p className="text-[11px] text-[#52635C]">{SECTION_META[activeSection]?.hint}</p>
                </div>
                <button
                  onClick={save}
                  disabled={saving || !dirty}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-black transition cursor-pointer disabled:opacity-40 ${
                    dirty ? 'bg-[#008F68] hover:bg-[#006B4F] text-white' : 'bg-[#EDF5F1] text-[#7A8B83]'
                  }`}
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {saving ? 'Validating & publishing…' : 'Save & Publish'}
                </button>
              </div>

              {notice && (
                <div className={`rounded-xl border p-3 text-[11px] font-semibold flex items-start gap-2 ${
                  notice.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'
                }`}>
                  {notice.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span>{notice.text}</span>
                </div>
              )}

              {OBJECT_SECTIONS.includes(activeSection)
                ? renderObjectSection(activeSection)
                : renderListSection(activeSection)}
            </div>

            {/* Audit trail */}
            <div className="rounded-2xl border border-[#D8E6DF] bg-white overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#EDF5F1] bg-[#F6FBF8]">
                <History className="w-4 h-4 text-[#008F68]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#33443C]">Change Audit History</h3>
                <span className="text-[10px] text-[#7A8B83] font-mono ml-auto">{audit.length} recent changes</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#EDF5F1]">
                {audit.length === 0 && <div className="px-4 py-8 text-center text-xs text-[#7A8B83]">No changes recorded yet.</div>}
                {audit.map((a) => (
                  <div key={a.id} className="px-4 py-3 text-[11px] leading-relaxed">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-black ${
                        a.result === 'SUCCESS' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {a.result}
                      </span>
                      <span className="font-black text-[#17221E]">{a.section}</span>
                      <span className="text-[#52635C]">
                        {a.changes.length} field{a.changes.length === 1 ? '' : 's'} changed · {a.publicationStatus} · {a.syncStatus}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#7A8B83] mt-0.5">
                      {a.userName} ({a.userRole}) · {new Date(a.changedAt).toLocaleString()} · Source: {a.source}
                      {a.reason ? ` · ${a.reason}` : ''}
                    </div>
                    {a.changes.slice(0, 3).map((c, i) => (
                      <div key={i} className="text-[10px] text-[#52635C] font-mono mt-0.5 truncate">
                        {c.field}: {JSON.stringify(c.oldValue)} → {JSON.stringify(c.newValue)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
