import React, { useState } from 'react';
import { Save, Settings2, ShieldCheck, AlertTriangle, Percent, Wallet, Truck } from 'lucide-react';
import { PharmacyFeeConfiguration } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface PharmacyFeeConfigurationPanelProps {
  onConfigUpdated?: () => void;
}

const FLAT_COST_ITEMS: { label: string; value: string; note: string }[] = [
  { label: 'Platform subscription', value: '₹999/month', note: 'Configurable plan pricing' },
  { label: 'Basic delivery fee', value: '₹39', note: 'Configurable store setting' },
  { label: 'Express delivery', value: '₹79', note: 'Configurable store setting' },
  { label: 'Promotional campaign', value: '₹499', note: 'Optional marketing cost' },
  { label: 'Featured placement', value: '₹999', note: 'Optional catalog placement' },
  { label: 'Additional staff seat', value: '₹199/month', note: 'Configurable plan add-on' },
  { label: 'Analytics Pro', value: '₹499/month', note: 'Configurable plan add-on' },
  { label: 'POS integration', value: '₹999/month', note: 'Configurable integration plan' },
  { label: 'API integration', value: '₹1,999/month', note: 'Configurable integration plan' },
  { label: 'Document verification', value: 'Configurable', note: 'Admin / compliance configurable' },
  { label: 'Payment fee', value: 'Configurable %', note: 'Admin-configurable' },
  { label: 'Platform commission', value: 'Configurable %', note: 'Admin-configurable' },
];

export const PharmacyFeeConfigurationPanel: React.FC<PharmacyFeeConfigurationPanelProps> = ({ onConfigUpdated }) => {
  const [config, setConfig] = useState<PharmacyFeeConfiguration>(() => PharmacyPortalService.getFeeConfiguration());
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof PharmacyFeeConfiguration, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: typeof value === 'string' ? value : Number(value) }));
    setSaved(false);
  };

  const save = () => {
    if (config.platformCommissionPercent < 0 || config.paymentProcessingPercent < 0 || config.gstTdsPercent < 0) {
      setError('Fee percentages cannot be negative.');
      return;
    }
    if (config.standardDeliveryFee < 0 || config.expressDeliveryFee < 0 || config.subscriptionMonthlyFee < 0) {
      setError('Fees cannot be negative.');
      return;
    }
    const confirm = window.confirm(
      `Update pharmacy fee configuration?\n\nPlatform commission: ${config.platformCommissionPercent}%\nPayment processing: ${config.paymentProcessingPercent}% + ₹${config.paymentProcessingFixedFee}\nStandard delivery: ₹${config.standardDeliveryFee}\nExpress delivery: ₹${config.expressDeliveryFee}\n\nThis affects future settlement calculations.`
    );
    if (!confirm) return;
    setError('');
    PharmacyPortalService.updateFeeConfiguration(config);
    setSaved(true);
    onConfigUpdated?.();
    window.setTimeout(() => setSaved(false), 3000);
  };

  const fieldClass = 'w-full rounded-xl border border-[#D9E1E7] bg-[#F5F8FA] px-3 py-2 text-sm text-[#17212B] outline-none focus:border-[#1769AA]';
  const h3Class = 'mb-3 text-sm font-extrabold text-[#123B5D]';

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#D9E1E7] bg-white p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-[#123B5D]"><Settings2 className="h-4 w-4 text-[#1769AA]" /> Platform Fee Configuration</h3>
            <p className="mt-1 text-xs text-[#5F6B76]">Fees are administrator-configurable. This portal never embeds universal market rates.</p>
          </div>
          <button onClick={save} className="inline-flex items-center gap-1.5 rounded-xl bg-[#1769AA] px-4 py-2 text-xs font-bold text-white hover:bg-[#0B5B94] cursor-pointer">
            <Save className="h-3.5 w-3.5" /> Save configuration
          </button>
        </div>

        {saved && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#CDE9D9] bg-[#F0FAF5] px-3 py-2.5 text-xs font-bold text-[#16875D]">
            <ShieldCheck className="h-4 w-4" /> Fee configuration saved and audited.
          </div>
        )}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#F3D5D5] bg-[#FDF3F3] px-3 py-2.5 text-xs font-bold text-[#C73737]">
            <AlertTriangle className="h-4 w-4" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Platform commission (%)" value={config.platformCommissionPercent} onChange={(v) => set('platformCommissionPercent', v)} icon={<Percent className="h-4 w-4" />} />
          <Field label="Payment processing (%)" value={config.paymentProcessingPercent} onChange={(v) => set('paymentProcessingPercent', v)} icon={<Wallet className="h-4 w-4" />} />
          <Field label="Payment fixed fee (₹)" value={config.paymentProcessingFixedFee} onChange={(v) => set('paymentProcessingFixedFee', v)} icon={<Wallet className="h-4 w-4" />} />
          <Field label="GST TDS (%)" value={config.gstTdsPercent} onChange={(v) => set('gstTdsPercent', v)} icon={<Percent className="h-4 w-4" />} />
          <Field label="Standard delivery fee (₹)" value={config.standardDeliveryFee} onChange={(v) => set('standardDeliveryFee', v)} icon={<Truck className="h-4 w-4" />} />
          <Field label="Express delivery fee (₹)" value={config.expressDeliveryFee} onChange={(v) => set('expressDeliveryFee', v)} icon={<Truck className="h-4 w-4" />} />
          <Field label="Free delivery above (₹)" value={config.freeDeliveryAbove} onChange={(v) => set('freeDeliveryAbove', v)} icon={<Truck className="h-4 w-4" />} />
          <Field label="Subscription (₹/month)" value={config.subscriptionMonthlyFee} onChange={(v) => set('subscriptionMonthlyFee', v)} icon={<Wallet className="h-4 w-4" />} />
          <Field label="Promotional contribution (%)" value={config.promotionalContributionPercent} onChange={(v) => set('promotionalContributionPercent', v)} icon={<Percent className="h-4 w-4" />} />
          <div>
            <label className="mb-1 block text-[11px] font-bold text-[#5F6B76]">Delivery fee mode</label>
            <select value={config.deliveryFeeMode} onChange={(e) => set('deliveryFeeMode', e.target.value)} className={fieldClass}>
              <option value="CUSTOMER_PAID">Customer paid</option>
              <option value="PHARMACY_PAID">Pharmacy paid</option>
              <option value="SHARED">Shared</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-[#5F6B76]">Effective from</label>
            <input type="date" value={config.effectiveFrom} onChange={(e) => set('effectiveFrom', e.target.value)} className={fieldClass} />
          </div>
          <div className="md:col-span-3">
            <label className="mb-1 block text-[11px] font-bold text-[#5F6B76]">Description</label>
            <textarea value={config.description} onChange={(e) => set('description', e.target.value)} rows={2} className={fieldClass} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#D9E1E7] bg-white p-5">
        <h3 className={h3Class}>Business Cost Catalog</h3>
        <p className="mb-4 text-xs text-[#5F6B76]">These are configurable platform/admin values — not embedded assumptions.</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {FLAT_COST_ITEMS.map((item) => (
            <div key={item.label} className="rounded-xl border border-[#E2E8F0] bg-[#F5F8FA] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5F6B76]">{item.label}</p>
              <p className="mt-1 text-lg font-extrabold text-[#123B5D]">{item.value}</p>
              <p className="text-[10px] text-[#5F6B76]">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value: number; onChange: (v: number) => void; icon: React.ReactNode }> = ({ label, value, onChange, icon }) => (
  <div>
    <label className="mb-1 flex items-center gap-1.5 text-[11px] font-bold text-[#5F6B76]">{icon}{label}</label>
    <input type="number" min="0" step="0.01" value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full rounded-xl border border-[#D9E1E7] bg-[#F5F8FA] px-3 py-2 text-sm text-[#17212B] outline-none focus:border-[#1769AA]" />
  </div>
);
