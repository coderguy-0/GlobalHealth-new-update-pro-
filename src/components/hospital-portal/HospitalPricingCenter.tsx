import React, { useMemo, useState } from 'react';
import {
  Search, AlertTriangle, CheckCircle2, Clock, Eye, EyeOff, Send,
  History, IndianRupee, X, Save, FileCheck2,
} from 'lucide-react';
import {
  useHospitalPortal, HospitalPrice, StructuredPrice, BillableCategory, PublicStatus,
} from './hospitalPortalData';

export const PUBLIC_STATUS_LABEL_PRICE: Record<PublicStatus, { label: string; className: string; Icon: typeof Clock }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-slate-600 border-slate-200', Icon: Clock },
  pending_review: { label: 'Pending Review', className: 'bg-amber-50 text-amber-800 border-amber-200', Icon: Clock },
  published: { label: 'Published', className: 'bg-emerald-50 text-emerald-800 border-emerald-200', Icon: CheckCircle2 },
  rejected: { label: 'Rejected', className: 'bg-rose-50 text-rose-800 border-rose-200', Icon: AlertTriangle },
  changes_requested: { label: 'Changes Requested', className: 'bg-amber-50 text-amber-800 border-amber-200', Icon: AlertTriangle },
  suspended: { label: 'Suspended', className: 'bg-slate-100 text-slate-600 border-slate-200', Icon: AlertTriangle },
};

export function calculateEstimatedTotal(price: StructuredPrice): number {
  const subtotal = price.basePrice + price.professionalFee + price.facilityFee + price.consumables + price.equipmentFee;
  const withTax = subtotal * (1 + (price.taxRate || 0) / 100);
  return Math.max(0, withTax - (price.discount || 0));
}

const CATEGORY_OPTIONS: BillableCategory[] = [
  'Consultation', 'OPD', 'Emergency', 'Admission', 'Bed', 'Room', 'ICU', 'Surgery',
  'Anesthesia', 'Laboratory', 'Imaging', 'Pharmacy', 'Nursing', 'Ambulance',
  'Home Healthcare', 'Physiotherapy', 'Blood', 'Document', 'Certificate', 'Package', 'Other',
];

const AVAILABILITY_LABEL: Record<HospitalPrice['availability'], { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  limited: { label: 'Limited', className: 'bg-amber-50 text-amber-800 border-amber-200' },
  unavailable: { label: 'Unavailable', className: 'bg-rose-50 text-rose-800 border-rose-200' },
  coming_soon: { label: 'Coming Soon', className: 'bg-sky-50 text-sky-800 border-sky-200' },
};

const STATUS_LABEL: Record<PublicStatus, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  published: 'Published',
  rejected: 'Rejected',
  changes_requested: 'Changes Requested',
  suspended: 'Suspended',
};

export const HospitalPricingCenter: React.FC = () => {
  const { prices, priceHistory, updatePrice, submitPriceForReview, publishPrice, setPricePublicVisibility } = useHospitalPortal();

  const [activeTab, setActiveTab] = useState<'prices' | 'history'>('prices');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'ALL' | BillableCategory>('ALL');
  const [status, setStatus] = useState<'ALL' | PublicStatus>('ALL');
  const [editing, setEditing] = useState<HospitalPrice | null>(null);

  const filtered = useMemo(() => prices.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.itemId.toLowerCase().includes(q);
    const matchCat = category === 'ALL' || p.itemType === category;
    const matchStatus = status === 'ALL' || p.publicStatus === status;
    return matchSearch && matchCat && matchStatus;
  }), [prices, search, category, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-[#0B1F33] sm:text-2xl">Pricing Center</h1>
            <span className="rounded-lg border border-[#D9E5EB] bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1769AA]">Structured · Audit-safe</span>
          </div>
          <p className="mt-1 text-xs text-[#607080]">
            Every billable service, test, procedure and package uses a structured price: base + fees + consumables + tax − discount.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-[#607080]">Published price items</p>
          <p className="mt-1 text-2xl font-extrabold text-[#1769AA]">{prices.filter((p) => p.publicStatus === 'published').length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex rounded-xl border border-[#E2E8F0] bg-white p-1">
          <button onClick={() => setActiveTab('prices')} className={`rounded-lg px-4 py-1.5 text-xs font-bold ${activeTab === 'prices' ? 'bg-[#0B1F33] text-white' : 'text-[#607080] hover:text-[#0B1F33]'}`}>
            Price Items ({prices.length})
          </button>
          <button onClick={() => setActiveTab('history')} className={`rounded-lg px-4 py-1.5 text-xs font-bold ${activeTab === 'history' ? 'bg-[#0B1F33] text-white' : 'text-[#607080] hover:text-[#0B1F33]'}`}>
            Price History ({priceHistory.length})
          </button>
        </div>
        <div className="ml-auto flex-1 sm:max-w-xs"></div>
      </div>

      {activeTab === 'prices' && (
        <>
          <div className="flex flex-col gap-3 bg-white p-3 rounded-2xl border border-[#E2E8F0] sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#607080]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search price item, code or category…"
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#F5F8FA] py-2 pl-9 pr-3 text-xs text-[#0B1F33] outline-none focus:border-[#1769AA]"
              />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value as 'ALL' | BillableCategory)} className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0B1F33] outline-none focus:border-[#1769AA]">
              <option value="ALL">All categories</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'ALL' | PublicStatus)} className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs text-[#0B1F33] outline-none focus:border-[#1769AA]">
              <option value="ALL">All statuses</option>
              {(Object.keys(STATUS_LABEL) as PublicStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white">
            <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F5F8FA] text-[10px] font-bold uppercase tracking-wider text-[#607080]">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Base</th>
                  <th className="px-3 py-3">Fees + Consumables</th>
                  <th className="px-3 py-3">Tax</th>
                  <th className="px-3 py-3">Discount</th>
                  <th className="px-3 py-3">Est. Total</th>
                  <th className="px-3 py-3">Validity</th>
                  <th className="px-3 py-3">Availability</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Public</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={12} className="px-4 py-10 text-center text-sm font-semibold text-[#607080]">
                      No price items match your filters.
                    </td>
                  </tr>
                )}
                {filtered.map((p) => {
                  const total = calculateEstimatedTotal(p.price);
                  const st = PUBLIC_STATUS_LABEL_PRICE[p.publicStatus];
                  const av = AVAILABILITY_LABEL[p.availability];
                  return (
                    <tr key={p.id} className="border-b border-[#EEF2F6] last:border-0 hover:bg-[#F8FBFD]">
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#0B1F33]">{p.name}</p>
                        <p className="mt-0.5 font-mono text-[10px] text-[#607080]">{p.itemId} · {p.price.currency}/{p.price.unit}</p>
                      </td>
                      <td className="px-3 py-3 text-[#1769AA]">{p.itemType}</td>
                      <td className="px-3 py-3 font-semibold text-[#0B1F33]">₹{p.price.basePrice.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3 text-[#0B1F33]">
                        ₹{(p.price.professionalFee + p.price.facilityFee + p.price.consumables + p.price.equipmentFee).toLocaleString('en-IN')}
                        <span className="block text-[10px] text-[#607080]">fees + consumables + equipment</span>
                      </td>
                      <td className="px-3 py-3 text-[#607080]">{p.price.taxRate}%</td>
                      <td className="px-3 py-3 text-[#607080]">₹{p.price.discount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 rounded-lg border border-[#CDE0EC] bg-[#EDF6FC] px-2 py-1 font-extrabold text-[#1769AA]">
                          <IndianRupee className="h-3 w-3" /> {total.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-[#607080]">
                        {p.price.effectiveDate}
                        {p.price.expiryDate && <span className="block text-[10px]">to {p.price.expiryDate}</span>}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${av.className}`}>{av.label}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${st.className}`}>
                          <st.Icon className="h-3 w-3" /> {st.label}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => setPricePublicVisibility(p.id, !p.publicVisibility)}
                          className="cursor-pointer rounded-lg p-1.5 text-[#607080] hover:bg-[#F5F8FA] hover:text-[#1769AA]"
                          title={p.publicVisibility ? 'Visible on public profile — click to hide' : 'Hidden — click to show'}
                        >
                          {p.publicVisibility ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {p.publicStatus !== 'published' && (
                            <button onClick={() => submitPriceForReview(p.id)} className="rounded-lg border border-[#E2E8F0] p-1.5 text-[#607080] hover:bg-[#F5F8FA]" title="Submit for review">
                              <Send className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {p.publicStatus === 'pending_review' && (
                            <button onClick={() => publishPrice(p.id)} className="rounded-lg border border-[#CDE0EC] p-1.5 text-[#1769AA] hover:bg-[#EDF6FC]" title="Publish">
                              <FileCheck2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button onClick={() => setEditing(p)} className="rounded-lg border border-[#E2E8F0] p-1.5 text-[#607080] hover:bg-[#F5F8FA]" title="Edit price">
                            <Save className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EDF6FC] text-[#1769AA]"><History className="h-5 w-5" /></span>
              <div>
                <p className="text-sm font-bold text-[#0B1F33]">Price history is never silently overwritten</p>
                <p className="mt-1 text-xs text-[#607080]">Every edit creates an immutable history record with old price, new price, reason, approver and timestamp.</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {priceHistory.map((h) => {
              const oldTotal = calculateEstimatedTotal(h.oldPrice);
              const newTotal = calculateEstimatedTotal(h.newPrice);
              return (
                <div key={h.id} className="rounded-2xl border border-[#E2E8F0] bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1769AA]">{h.priceId}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${h.approvalState === 'approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : h.approvalState === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
                          {h.approvalState}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold text-[#0B1F33]">₹{oldTotal.toLocaleString('en-IN')} → ₹{newTotal.toLocaleString('en-IN')}</p>
                      <p className="mt-1 text-xs text-[#607080]">{h.reason}</p>
                    </div>
                    <div className="text-xs text-[#607080]">
                      <p className="font-bold text-[#0B1F33]">{h.changedBy}</p>
                      <p>{h.changedAt}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {priceHistory.length === 0 && (
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-10 text-center text-sm font-semibold text-[#607080]">No price changes recorded yet.</div>
            )}
          </div>
        </div>
      )}

      {editing && <PriceEditor price={editing} onClose={() => setEditing(null)} onSave={updatePrice} />}
    </div>
  );
};

interface PriceEditorProps {
  price: HospitalPrice;
  onClose: () => void;
  onSave: (id: string, patch: Partial<StructuredPrice>, reason: string) => void;
}

const PriceEditor: React.FC<PriceEditorProps> = ({ price, onClose, onSave }) => {
  const [form, setForm] = useState<StructuredPrice>({ ...price.price });
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const set = (key: keyof StructuredPrice, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: typeof value === 'string' ? value : Number(value) }));
  };

  const save = () => {
    if (!reason.trim()) { setError('A reason is required for every price change.'); return; }
    if (!form.basePrice || form.basePrice < 0) { setError('Base price must be greater than or equal to zero.'); return; }
    if (form.taxRate < 0) { setError('Tax rate cannot be negative.'); return; }
    onSave(price.id, form, reason.trim());
    onClose();
  };

  const total = calculateEstimatedTotal(form);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F33]/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F5F8FA] px-5 py-3">
          <div>
            <p className="text-sm font-extrabold text-[#0B1F33]">Edit Price — {price.name}</p>
            <p className="font-mono text-[10px] text-[#607080]">{price.itemId} · {price.itemType}</p>
          </div>
          <button onClick={onClose} className="cursor-pointer rounded-lg p-1.5 text-[#607080] hover:bg-[#E2E8F0]" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5">
          {error && <p className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">{error}</p>}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <NumberField label="Base price (₹)" value={form.basePrice} onChange={(v) => set('basePrice', v)} />
            <NumberField label="Professional fee (₹)" value={form.professionalFee} onChange={(v) => set('professionalFee', v)} />
            <NumberField label="Facility fee (₹)" value={form.facilityFee} onChange={(v) => set('facilityFee', v)} />
            <NumberField label="Consumables (₹)" value={form.consumables} onChange={(v) => set('consumables', v)} />
            <NumberField label="Equipment fee (₹)" value={form.equipmentFee} onChange={(v) => set('equipmentFee', v)} />
            <NumberField label="Tax rate (%)" value={form.taxRate} onChange={(v) => set('taxRate', v)} />
            <NumberField label="Discount (₹)" value={form.discount} onChange={(v) => set('discount', v)} />
            <div className="sm:col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#607080]">Unit</label>
              <input value={form.unit} onChange={(e) => set('unit', e.target.value)} className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs text-[#0B1F33] outline-none focus:border-[#1769AA]" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#607080]">Effective date</label>
              <input type="date" value={form.effectiveDate} onChange={(e) => set('effectiveDate', e.target.value)} className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs text-[#0B1F33] outline-none focus:border-[#1769AA]" />
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#CDE0EC] bg-[#EDF6FC] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-bold text-[#1769AA]">Estimated total</p>
              <p className="text-2xl font-extrabold text-[#1769AA]">₹{total.toLocaleString('en-IN')}</p>
            </div>
            <p className="mt-1 text-[10px] text-[#607080]">(base + fees + consumables + equipment) * (1 + tax%) − discount, in INR.</p>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#607080]">Change reason *</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="e.g. Vendor contract renewal, updated consumable cost, tariff review." className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs text-[#0B1F33] outline-none focus:border-[#1769AA]" />
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#F1D8A8] bg-[#FFF8E8] p-3">
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#D99A00]" />
            <p className="text-xs text-[#0B1F33]">
              Saving creates a <strong>pending price revision</strong>, records the old price in immutable history, and submits the item for review. It does not silently overwrite the published tariff.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] bg-[#F5F8FA] px-5 py-3">
          <button onClick={onClose} className="cursor-pointer rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-bold text-[#607080]">Cancel</button>
          <button onClick={save} className="cursor-pointer rounded-xl bg-[#1769AA] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B5B94]"><Save className="mr-1 inline h-3.5 w-3.5" /> Save revision</button>
        </div>
      </div>
    </div>
  );
};

const NumberField: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-[#607080]">{label}</label>
    <input type="number" min="0" step="0.01" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-xs text-[#0B1F33] outline-none focus:border-[#1769AA]" />
  </div>
);
