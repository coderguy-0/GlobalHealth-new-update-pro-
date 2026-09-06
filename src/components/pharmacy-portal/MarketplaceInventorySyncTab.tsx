import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Globe2,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Package,
  History,
  Save,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import {
  fetchPartnerInventory,
  fetchPartnerInventoryAudit,
  updatePartnerInventory,
  fetchPartnerMe,
  MarketplaceInventoryRecord,
  MarketplaceStockStatus,
  InventoryAuditRecord,
  PartnerAccountView
} from '../../services/pharmacyInventoryClient';
import { PharmacyStaffMember } from '../../types/pharmacyPortal';

// ---------------------------------------------------------------------------
// GlobalHealth Marketplace Inventory Sync.
//
// This tab is the pharmacy's control surface for the CUSTOMER-FACING
// catalogue. Every save writes straight to the central inventory engine
// (the source of truth) — the customer Buy Medicine flow reads that engine
// live, so an OUT_OF_STOCK save instantly hides this pharmacy for that
// medicine.
// ---------------------------------------------------------------------------

const STATUS_OPTIONS: { value: MarketplaceStockStatus; label: string; hint: string }[] = [
  { value: 'IN_STOCK', label: 'In Stock', hint: 'Auto (qty > 10)' },
  { value: 'LOW_STOCK', label: 'Low Stock', hint: 'Auto (1–10)' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock', hint: 'Auto (qty 0)' },
  { value: 'DISCONTINUED', label: 'Discontinued', hint: 'Withdraw listing' },
  { value: 'NOT_LISTED', label: 'Not Listed', hint: 'Hide from marketplace' }
];

const statusPill = (status: MarketplaceStockStatus): string => {
  switch (status) {
    case 'IN_STOCK':
      return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
    case 'LOW_STOCK':
      return 'bg-amber-500/10 border-amber-500/30 text-amber-300';
    case 'OUT_OF_STOCK':
      return 'bg-rose-500/10 border-rose-500/30 text-rose-300';
    case 'DISCONTINUED':
      return 'bg-slate-500/10 border-slate-500/30 text-slate-300';
    default:
      return 'bg-slate-700/30 border-slate-600/40 text-slate-400';
  }
};

interface MarketplaceInventorySyncTabProps {
  currentUser?: PharmacyStaffMember | null;
}

export const MarketplaceInventorySyncTab: React.FC<MarketplaceInventorySyncTabProps> = ({ currentUser }) => {
  const [records, setRecords] = useState<MarketplaceInventoryRecord[]>([]);
  const [partner, setPartner] = useState<PartnerAccountView | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [rowMessages, setRowMessages] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [drafts, setDrafts] = useState<Record<string, { quantity: number; status: MarketplaceStockStatus }>>({});
  const [audit, setAudit] = useState<InventoryAuditRecord[]>([]);

  const updatedByName = currentUser?.name || 'Pharmacy Partner';

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    // Partner identity comes from the SERVER session — this tab can only
    // ever manage the pharmacy the signed-in partner belongs to.
    const me = await fetchPartnerMe();
    if (!me.ok || !me.account) {
      setPartner(null);
      setRecords([]);
      setLoadError('Your partner session has expired. Please sign in again to manage marketplace inventory.');
      setLoading(false);
      return;
    }
    setPartner(me.account);
    const snap = await fetchPartnerInventory(me.account.partnerId);
    if (!snap.ok) {
      setLoadError(snap.error || 'Inventory temporarily unavailable. Please try again.');
      setRecords([]);
    } else {
      setRecords(snap.records);
      setAsOf(snap.asOf || null);
      setDrafts(
        Object.fromEntries(
          snap.records.map((r) => [r.medicineId, { quantity: r.stockQuantity, status: r.stockStatus }])
        )
      );
    }
    setLoading(false);
    if (partner) fetchPartnerInventoryAudit(partner.partnerId).then((a) => setAudit(a.records));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner?.partnerId]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      [r.medicineName, r.brandName, r.genericName, r.strength, r.dosageForm]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [records, search]);

  const dirty = (medicineId: string): boolean => {
    const rec = records.find((r) => r.medicineId === medicineId);
    const draft = drafts[medicineId];
    if (!rec || !draft) return false;
    return draft.quantity !== rec.stockQuantity || draft.status !== rec.stockStatus;
  };

  const save = async (rec: MarketplaceInventoryRecord) => {
    const draft = drafts[rec.medicineId];
    if (!draft) return;
    setSavingId(rec.medicineId);
    setRowMessages((prev) => ({ ...prev, [rec.medicineId]: { ok: true, text: 'Saving…' } }));
    const res = await updatePartnerInventory(
      {
        medicineId: rec.medicineId,
        stockQuantity: draft.quantity,
        // The server derives IN/LOW/OUT from quantity automatically; explicit
        // status is only sent for withdrawal states.
        stockStatus: draft.status === 'DISCONTINUED' || draft.status === 'NOT_LISTED' ? draft.status : undefined,
        updatedBy: updatedByName,
        source: 'PARTNER_WORKSPACE'
      },
      partner!.partnerId
    );
    if (res.ok && res.record) {
      setRecords((prev) => prev.map((r) => (r.medicineId === res.record!.medicineId ? res.record! : r)));
      setDrafts((prev) => ({
        ...prev,
        [rec.medicineId]: { quantity: res.record!.stockQuantity, status: res.record!.stockStatus }
      }));
      setRowMessages((prev) => ({
        ...prev,
        [rec.medicineId]: { ok: true, text: res.customerImpact || 'Inventory updated and synchronized.' }
      }));
      if (partner) fetchPartnerInventoryAudit(partner.partnerId).then((a) => setAudit(a.records));
    } else {
      setRowMessages((prev) => ({ ...prev, [rec.medicineId]: { ok: false, text: res.error || 'Update failed.' } }));
    }
    setSavingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/60 p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">GlobalHealth Marketplace Inventory Sync</h2>
              <p className="text-xs text-slate-400 leading-relaxed mt-0.5 max-w-2xl">
                Stock you save here is written to the central inventory engine — the <strong className="text-slate-200">source of truth</strong> the
                customer <em>Buy Medicine</em> flow reads live. Setting a medicine to <strong className="text-rose-300">Out of Stock</strong> instantly
                removes this pharmacy from that medicine's purchase options.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
            <button
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Syncing…' : 'Refresh sync'}
            </button>
            {asOf && (
              <span className="text-[10px] font-mono text-slate-500">
                Last synced {new Date(asOf).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2.5 py-1">
            <ShieldCheck className="w-3 h-3" /> {partner ? partner.pharmacyName : 'Partner session required'}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-300 px-2.5 py-1">
            <Package className="w-3 h-3" /> {records.length} marketplace medicines
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 px-2.5 py-1">
            <TrendingDown className="w-3 h-3" /> {records.filter((r) => r.availabilityStatus !== 'AVAILABLE').length} currently hidden from customers
          </span>
        </div>
      </div>

      {/* Error state */}
      {loadError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-xs text-rose-300 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {loadError}
          </span>
          <button onClick={load} className="shrink-0 rounded-xl border border-rose-400/40 px-3 py-1.5 font-bold hover:bg-rose-500/10 cursor-pointer">
            Try again
          </button>
        </div>
      )}

      {/* Search */}
      {!loading && !loadError && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search marketplace medicines (name, brand, generic, strength)…"
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-sky-400"
          />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-sky-400" />
          Loading live marketplace inventory from the central engine…
        </div>
      )}

      {/* Inventory editor */}
      {!loading && !loadError && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 font-bold">Medicine (exact variant)</th>
                  <th className="px-4 py-3 font-bold">Live status</th>
                  <th className="px-4 py-3 font-bold">Stock quantity</th>
                  <th className="px-4 py-3 font-bold">Availability status</th>
                  <th className="px-4 py-3 font-bold text-right">Save / Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec) => {
                  const draft = drafts[rec.medicineId] || { quantity: rec.stockQuantity, status: rec.stockStatus };
                  const isDirty = dirty(rec.medicineId);
                  const msg = rowMessages[rec.medicineId];
                  return (
                    <tr key={rec.medicineId} className="border-b border-slate-800/60 align-top hover:bg-slate-800/30">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-100">{rec.medicineName}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {rec.brandName} • {rec.genericName} • <span className="font-mono">{rec.strength}</span> • {rec.dosageForm} • Pack {rec.packSize}
                        </div>
                        {msg && (
                          <div className={`mt-1.5 text-[10px] font-semibold flex items-center gap-1 ${msg.ok ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {msg.ok ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />} {msg.text}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${statusPill(rec.stockStatus)}`}>
                          {rec.stockStatus.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">
                          {rec.availabilityStatus === 'AVAILABLE' ? 'Visible to customers' : 'Hidden from customers'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={draft.quantity}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [rec.medicineId]: { ...draft, quantity: Math.max(0, Number(e.target.value) || 0) }
                            }))
                          }
                          className="w-24 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-mono text-slate-100 outline-none focus:border-sky-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={draft.status}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [rec.medicineId]: { ...draft, status: e.target.value as MarketplaceStockStatus }
                            }))
                          }
                          className="rounded-xl border border-slate-700 bg-slate-800 px-2.5 py-2 text-xs font-semibold text-slate-100 outline-none focus:border-sky-400 cursor-pointer"
                        >
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label} — {o.hint}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => save(rec)}
                          disabled={savingId === rec.medicineId || !isDirty}
                          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${
                            isDirty ? 'bg-sky-600 hover:bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {savingId === rec.medicineId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          {savingId === rec.medicineId ? 'Saving…' : 'Save / Update'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No marketplace medicines match “{search}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-slate-900/80 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed">
            Status is derived from quantity (0 → Out of Stock, 1–10 → Low Stock, &gt; 10 → In Stock). Choose “Discontinued” or “Not Listed” to withdraw
            the listing regardless of quantity. Every save is written to the central inventory engine and recorded in the audit trail.
          </div>
        </div>
      )}

      {/* Audit trail */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900/80">
          <History className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Inventory Change Audit Trail</h3>
          <span className="text-[10px] text-slate-500 font-mono ml-auto">{audit.length} recent changes</span>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
          {audit.length === 0 && (
            <div className="px-4 py-8 text-center text-xs text-slate-500">No inventory changes recorded yet.</div>
          )}
          {audit.map((a) => (
            <div key={a.id} className="px-4 py-3 text-[11px] leading-relaxed">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-black ${a.result === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'}`}>
                  {a.result}
                </span>
                <span className="font-bold text-slate-200">{a.medicineName}</span>
                <span className="text-slate-500">
                  {a.previousStockQuantity} → <strong className="text-slate-300">{a.newStockQuantity}</strong>
                </span>
                <span className="text-slate-500">
                  {a.previousStatus.replace(/_/g, ' ')} → <strong className="text-slate-300">{a.newStatus.replace(/_/g, ' ')}</strong>
                </span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {a.pharmacyName} • Updated by {a.actorName} • {new Date(a.changedAt).toLocaleString()} • Source: {a.changeSource}
                {a.reason ? ` • ${a.reason}` : ''}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
