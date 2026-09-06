import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Clock, 
  Truck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  SlidersHorizontal,
  Package,
  Store,
  ChevronRight,
  RefreshCw,
  Radio
} from 'lucide-react';
import { PharmacyProduct, PartnerAvailabilityOption } from '../../types/pharmacyMarketplace';
import { fetchProductAvailability, validateInventoryItems } from '../../services/pharmacyInventoryClient';

interface VerifiedPartnerSelectModalProps {
  product: PharmacyProduct;
  onClose: () => void;
  onSelectPartnerAndProceed: (product: PharmacyProduct, partner: PartnerAvailabilityOption) => void;
}

/**
 * Customer pharmacy-selection screen. Every open performs a FRESH availability
 * lookup against the central marketplace inventory engine (the source of
 * truth) — pharmacies whose current stock is OUT_OF_STOCK / DISCONTINUED /
 * NOT_LISTED / unverified are never displayed. Selecting a pharmacy runs a
 * final live validation before proceeding to the cart.
 */
export const VerifiedPartnerSelectModal: React.FC<VerifiedPartnerSelectModalProps> = ({
  product,
  onClose,
  onSelectPartnerAndProceed
}) => {
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [deliveryTypeFilter, setDeliveryTypeFilter] = useState<'all' | 'delivery' | 'pickup'>('all');

  // Live inventory state (never cached between opens)
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [liveOptions, setLiveOptions] = useState<PartnerAvailabilityOption[]>([]);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [selectError, setSelectError] = useState<string | null>(null);
  const [validatingPartnerId, setValidatingPartnerId] = useState<string | null>(null);

  const refreshAvailability = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setSelectError(null);
    const result = await fetchProductAvailability(product.id);
    if (!result.ok) {
      // Fail SAFE — never show unverified stock as available.
      setLiveOptions([]);
      setLoadError(result.error || 'Availability temporarily unavailable. Please try again.');
    } else {
      setLiveOptions(result.options);
      setAsOf(result.asOf || null);
    }
    setLoading(false);
  }, [product.id]);

  useEffect(() => {
    refreshAvailability();
  }, [refreshAvailability]);

  // Extract unique areas
  const uniqueAreas = useMemo(() => {
    const areas = new Set<string>();
    liveOptions.forEach(p => {
      if (p.area) areas.add(p.area);
      if (p.city) areas.add(p.city);
    });
    return ['All', ...Array.from(areas)];
  }, [liveOptions]);

  // Filter partner options (only over the LIVE eligible list)
  const filteredPartners = useMemo(() => {
    return liveOptions.filter(partner => {
      const matchesArea = selectedArea === 'All' || 
        partner.area.toLowerCase().includes(selectedArea.toLowerCase()) ||
        partner.city.toLowerCase().includes(selectedArea.toLowerCase());

      let matchesDistance = true;
      if (maxDistance === '1') matchesDistance = partner.distanceKm <= 1.5;
      else if (maxDistance === '3') matchesDistance = partner.distanceKm <= 3.0;
      else if (maxDistance === '5') matchesDistance = partner.distanceKm <= 5.0;
      else if (maxDistance === '10') matchesDistance = partner.distanceKm <= 10.0;

      let matchesStatus = true;
      if (statusFilter === 'open') matchesStatus = partner.isOpenNow;
      else if (statusFilter === 'closed') matchesStatus = !partner.isOpenNow;

      let matchesDelivery = true;
      if (deliveryTypeFilter === 'delivery') matchesDelivery = partner.deliveryAvailable;
      else if (deliveryTypeFilter === 'pickup') matchesDelivery = partner.pickupAvailable;

      return matchesArea && matchesDistance && matchesStatus && matchesDelivery;
    });
  }, [liveOptions, selectedArea, maxDistance, statusFilter, deliveryTypeFilter]);

  // Final live stock validation before handing the customer to the cart.
  const handleSelectPartner = async (partner: PartnerAvailabilityOption) => {
    setValidatingPartnerId(partner.partnerId);
    setSelectError(null);
    const validation = await validateInventoryItems([
      { productId: product.id, pharmacyId: partner.partnerId, quantity: 1 }
    ]);
    setValidatingPartnerId(null);

    if (!validation.ok) {
      setSelectError('Availability temporarily unavailable. Please try again.');
      refreshAvailability();
      return;
    }
    const item = validation.results[0];
    if (!item?.eligible) {
      setSelectError(
        'This pharmacy no longer has this medicine in stock. Please select another available pharmacy.'
      );
      refreshAvailability();
      return;
    }
    onSelectPartnerAndProceed(product, partner);
  };

  const resetFilters = () => {
    setSelectedArea('All');
    setMaxDistance('all');
    setStatusFilter('all');
    setDeliveryTypeFilter('all');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-6">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 sm:px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Building2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  Select a Verified Pharmacy Partner
                </h3>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-extrabold flex items-center gap-0.5">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  <span>Licensed Only</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Purchases must be fulfilled through accredited State Drug Controller licensed pharmacies.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Product Summary Strip */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-12 h-12 rounded-xl object-cover border border-emerald-200 shrink-0 bg-white" 
            />
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase block">
                {product.brandName} • {product.strength}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
              <span className="text-[11px] text-slate-600">Pack: {product.packSize}</span>
            </div>
          </div>

          <div className="text-right sm:text-right shrink-0">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Benchmark MRP</span>
            <span className="text-base font-black text-slate-900 font-mono">₹{product.price.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 line-through block">₹{product.mrp.toFixed(2)}</span>
          </div>
        </div>

        {/* Live inventory status bar */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            Live pharmacy inventory
            {asOf && <span className="font-mono font-medium text-slate-400">· checked {new Date(asOf).toLocaleTimeString()}</span>}
          </span>
          <button
            onClick={refreshAvailability}
            disabled={loading}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            Re-check stock
          </button>
        </div>

        {/* Prescription Warning if Required */}
        {product.prescriptionRequired && (
          <div className="p-3.5 bg-amber-50 border-b border-amber-200 flex items-start gap-2.5 text-xs text-amber-950">
            <FileText className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Prescription required.</strong> Upload a valid prescription to continue. A pharmacy professional will verify it before the order is fulfilled.
            </p>
          </div>
        )}

        {/* Inline selection error (stock vanished between listing and click) */}
        {selectError && (
          <div className="p-3.5 bg-rose-50 border-b border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
            <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-semibold">{selectError}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="h-7 w-7 animate-spin text-emerald-600 mx-auto" />
            <div className="text-sm font-bold text-slate-800">Checking live inventory at verified pharmacies…</div>
            <p className="text-xs text-slate-500">We only show pharmacies that currently have this exact medicine in stock.</p>
          </div>
        )}

        {/* Safe error state — availability could NOT be verified */}
        {!loading && loadError && (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="text-sm font-bold text-slate-800">Availability temporarily unavailable. Please try again.</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We could not verify current pharmacy stock for {product.name} ({product.strength}). For your safety we
              never display a pharmacy as available unless its inventory is verified.
            </p>
            <button
              onClick={refreshAvailability}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Retry availability check
            </button>
          </div>
        )}

        {/* Verified empty state — medicine stays in catalogue, just no sellers */}
        {!loading && !loadError && liveOptions.length === 0 && (
          <div className="p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto">
              <Package className="h-6 w-6 text-slate-400" />
            </div>
            <div className="text-sm font-bold text-slate-800">
              No verified pharmacies currently have this medicine in stock
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {product.name} ({product.strength}, {product.dosageForm}) remains in the GlobalHealth catalogue, but no
              verified partner can fulfil it right now. Please check again later — pharmacies restock throughout the day.
            </p>
            <button
              onClick={refreshAvailability}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
            >
              Check again
            </button>
          </div>
        )}

        {/* Availability & Location Filters */}
        {!loading && !loadError && liveOptions.length > 0 && (
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5 text-slate-600">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filter Verified Pharmacies ({filteredPartners.length} in stock now)</span>
            </span>

            {(selectedArea !== 'All' || maxDistance !== 'all' || statusFilter !== 'all' || deliveryTypeFilter !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-emerald-700 hover:underline text-[11px] font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Area Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Area / Location</label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {uniqueAreas.map(area => (
                  <option key={area} value={area}>{area === 'All' ? 'All Areas' : area}</option>
                ))}
              </select>
            </div>

            {/* Distance Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Distance</label>
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Any distance</option>
                <option value="1">Within 1.5 km</option>
                <option value="3">Within 3 km</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
              </select>
            </div>

            {/* Pharmacy Status */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open Now</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* Delivery/Pickup */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fulfillment</label>
              <select
                value={deliveryTypeFilter}
                onChange={(e) => setDeliveryTypeFilter(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option value="delivery">Home Delivery</option>
                <option value="pickup">Store Pickup</option>
              </select>
            </div>
          </div>
        </div>
        )}

        {/* Partners List */}
        {!loading && !loadError && liveOptions.length > 0 && (
        <div className="p-4 sm:p-6 space-y-3.5 max-h-[50vh] overflow-y-auto">
          {filteredPartners.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs space-y-2">
              <Building2 className="h-8 w-8 text-slate-400 mx-auto" />
              <div className="font-bold text-slate-800">No verified pharmacies match these filters</div>
              <p>Try expanding your distance range or resetting area filters.</p>
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition cursor-pointer"
              >
                Show All Available Partners
              </button>
            </div>
          ) : (
            filteredPartners.map((partner) => (
              <div
                key={partner.partnerId}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">
                        {partner.partnerName}
                      </h4>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                        <span>✓ Verified Pharmacy Partner</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {partner.area}, {partner.city} ({partner.distanceKm} km)
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <Clock className="h-3 w-3" />
                        {partner.isOpenNow ? 'Open Now' : 'Closed'} ({partner.operatingHours})
                      </span>
                    </div>
                  </div>

                  <div className="text-right sm:text-right shrink-0">
                    <div className="text-lg font-black text-slate-900 font-mono">
                      ₹{partner.price.toFixed(2)}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                      {partner.stockStatus} ({partner.stockCount} in stock)
                    </span>
                  </div>
                </div>

                {/* Logistics & Credentials Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Truck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>Fulfillment: <strong className="text-slate-900">{partner.estimatedFulfillment}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>Lic: <strong className="text-slate-800">{partner.licenseNumber}</strong> • Pharmacist: <strong className="text-slate-800">{partner.pharmacistInCharge}</strong></span>
                  </div>
                </div>

                {/* Select Action Button */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-500">
                    {partner.coldChainAvailable ? '❄️ Cold-chain storage audited' : 'Standard temperature storage'}
                  </span>

                  <button
                    onClick={() => handleSelectPartner(partner)}
                    disabled={validatingPartnerId === partner.partnerId}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer group disabled:opacity-60"
                  >
                    {validatingPartnerId === partner.partnerId ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Verifying stock…</span>
                      </>
                    ) : (
                      <>
                        <span>Select Pharmacy & Order</span>
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* Modal Footer Disclaimer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          All selected partners are verified against State Drug Controller databases under Good Pharmacy Practice (GPP).
          Stock is confirmed live at selection and re-validated before your order is placed.
        </div>

      </div>
    </div>
  );
};
