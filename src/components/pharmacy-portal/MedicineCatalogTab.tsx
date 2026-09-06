import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Snowflake, 
  Tag, 
  Layers, 
  DollarSign, 
  ShieldCheck, 
  Trash2,
  X
} from 'lucide-react';
import { PortalMedicine, PrescriptionClassification } from '../../types/pharmacyPortal';
import { PharmacyPortalService } from '../../services/pharmacyPortalStore';

interface MedicineCatalogTabProps {
  medicines: PortalMedicine[];
  onMedicinesUpdated: () => void;
  openAddModalInitially?: boolean;
}

export const MedicineCatalogTab: React.FC<MedicineCatalogTabProps> = ({
  medicines,
  onMedicinesUpdated,
  openAddModalInitially = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [scheduleFilter, setScheduleFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(openAddModalInitially);
  const [editingMedicine, setEditingMedicine] = useState<PortalMedicine | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [strength, setStrength] = useState('');
  const [dosageForm, setDosageForm] = useState('Tablet');
  const [packSize, setPackSize] = useState('Strip of 10 Tablets');
  const [unit, setUnit] = useState('Strip');
  const [category, setCategory] = useState<PortalMedicine['category']>('Heart Health');
  const [prescriptionClassification, setPrescriptionClassification] = useState<PrescriptionClassification>('Prescription Required');
  const [rxSchedule, setRxSchedule] = useState<PortalMedicine['rxSchedule']>('Schedule H');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [mrp, setMrp] = useState('150');
  const [sellingPrice, setSellingPrice] = useState('130');
  const [purchaseCost, setPurchaseCost] = useState('95');
  const [taxRatePercent, setTaxRatePercent] = useState('12');
  const [stockQuantity, setStockQuantity] = useState('100');
  const [minStockLevel, setMinStockLevel] = useState('20');
  const [batchNumber, setBatchNumber] = useState('BAT-2026-X1');
  const [manufacturingDate, setManufacturingDate] = useState('2026-01-01');
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [storageInstructions, setStorageInstructions] = useState('Store below 25°C in dry place.');
  const [requiresColdChain, setRequiresColdChain] = useState(false);
  const [description, setDescription] = useState('');

  const categories = [
    'All',
    'Heart Health',
    'Diabetes Care',
    'Respiratory Care',
    'Digestive Health',
    'Fever & Cold',
    'Vitamins & Supplements',
    'Medical Devices'
  ];

  const filteredMedicines = medicines.filter(m => {
    const matchesCat = categoryFilter === 'All' || m.category === categoryFilter;
    const matchesSched = scheduleFilter === 'All' || m.rxSchedule === scheduleFilter;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesSched && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingMedicine(null);
    setName('');
    setBrandName('');
    setGenericName('');
    setManufacturer('');
    setStrength('');
    setDosageForm('Tablet');
    setPackSize('Strip of 10 Tablets');
    setUnit('Strip');
    setCategory('Heart Health');
    setPrescriptionClassification('Prescription Required');
    setRxSchedule('Schedule H');
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setBarcode('890' + Math.floor(1000000000 + Math.random() * 9000000000));
    setMrp('150');
    setSellingPrice('130');
    setPurchaseCost('95');
    setTaxRatePercent('12');
    setStockQuantity('100');
    setMinStockLevel('20');
    setBatchNumber(`BAT-${Math.floor(100 + Math.random() * 900)}`);
    setRequiresColdChain(false);
    setDescription('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (med: PortalMedicine) => {
    setEditingMedicine(med);
    setName(med.name);
    setBrandName(med.brandName);
    setGenericName(med.genericName);
    setManufacturer(med.manufacturer);
    setStrength(med.strength);
    setDosageForm(med.dosageForm);
    setPackSize(med.packSize);
    setUnit(med.unit);
    setCategory(med.category);
    setPrescriptionClassification(med.prescriptionClassification);
    setRxSchedule(med.rxSchedule);
    setSku(med.sku);
    setBarcode(med.barcode || '');
    setMrp(med.mrp.toString());
    setSellingPrice(med.sellingPrice.toString());
    setPurchaseCost(med.purchaseCost.toString());
    setTaxRatePercent(med.taxRatePercent.toString());
    setStockQuantity(med.stockQuantity.toString());
    setMinStockLevel(med.minStockLevel.toString());
    setBatchNumber(med.batchNumber);
    setManufacturingDate(med.manufacturingDate);
    setExpiryDate(med.expiryDate);
    setStorageInstructions(med.storageInstructions || '');
    setRequiresColdChain(med.requiresColdChain || false);
    setDescription(med.description || '');
    setIsAddModalOpen(true);
  };

  const handleSaveMedicine = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedStock = parseInt(stockQuantity, 10) || 0;
    const parsedMinStock = parseInt(minStockLevel, 10) || 10;
    const parsedMrp = parseFloat(mrp) || 100;
    const parsedSelling = parseFloat(sellingPrice) || 90;
    const parsedPurchase = parseFloat(purchaseCost) || 70;
    const parsedTax = parseFloat(taxRatePercent) || 12;

    if (editingMedicine) {
      PharmacyPortalService.updateMedicine(editingMedicine.id, {
        name,
        brandName,
        genericName,
        manufacturer,
        strength,
        dosageForm: dosageForm as any,
        packSize,
        unit,
        category,
        prescriptionClassification,
        rxSchedule,
        sku,
        barcode,
        mrp: parsedMrp,
        sellingPrice: parsedSelling,
        purchaseCost: parsedPurchase,
        discountPercent: Math.round(((parsedMrp - parsedSelling) / parsedMrp) * 100),
        taxRatePercent: parsedTax,
        stockQuantity: parsedStock,
        minStockLevel: parsedMinStock,
        batchNumber,
        manufacturingDate,
        expiryDate,
        storageInstructions,
        requiresColdChain,
        description
      });
    } else {
      PharmacyPortalService.addMedicine({
        name,
        brandName: brandName || name.split(' ')[0],
        genericName,
        manufacturer,
        composition: `${genericName} ${strength}`,
        strength,
        dosageForm: dosageForm as any,
        packSize,
        unit,
        category,
        prescriptionClassification,
        rxSchedule,
        sku,
        barcode,
        mrp: parsedMrp,
        sellingPrice: parsedSelling,
        purchaseCost: parsedPurchase,
        discountPercent: Math.round(((parsedMrp - parsedSelling) / parsedMrp) * 100),
        minAllowedPrice: Math.round(parsedPurchase * 1.1),
        taxRatePercent: parsedTax,
        stockQuantity: parsedStock,
        minStockLevel: parsedMinStock,
        batchNumber,
        manufacturingDate,
        expiryDate,
        storageInstructions,
        branchId: 'branch-south-ext',
        description,
        requiresColdChain,
        isPopular: false
      });
    }

    setIsAddModalOpen(false);
    onMedicinesUpdated();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-black text-white">Dispensary Medicine Catalog</h2>
            <p className="text-xs text-slate-400">
              Manage clinical formulations, regulatory schedules, selling prices, packaging, and cold-chain attributes.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-teal-950/50"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Medicine</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand name, generic composition, manufacturer, or SKU..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 pl-10 pr-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={scheduleFilter}
              onChange={(e) => setScheduleFilter(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 font-bold focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="All">All Schedules</option>
              <option value="Schedule H">Schedule H (Prescription)</option>
              <option value="Schedule H1">Schedule H1 (Monitored)</option>
              <option value="OTC / Non-Scheduled">OTC / Non-Scheduled</option>
              <option value="General Supplement">General Supplement</option>
            </select>
          </div>

        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="p-4 font-semibold">Medicine & Composition</th>
                <th className="p-4 font-semibold">Dosage Form</th>
                <th className="p-4 font-semibold">Category & Rx Schedule</th>
                <th className="p-4 font-semibold">SKU / Batch</th>
                <th className="p-4 font-semibold">MRP / Price</th>
                <th className="p-4 font-semibold">Available Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No medicines match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map(med => (
                  <tr key={med.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <div className="flex items-start gap-2">
                        {med.requiresColdChain && (
                          <span title="Cold Chain Required (2-8°C)">
                            <Snowflake className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          </span>
                        )}
                        <div>
                          <div className="font-bold text-white text-xs">{med.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{med.genericName}</div>
                          <div className="text-[10px] text-slate-500">{med.manufacturer}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-slate-300">
                      <div>{med.dosageForm} ({med.strength})</div>
                      <div className="text-[10px] text-slate-500">{med.packSize}</div>
                    </td>

                    <td className="p-4">
                      <div className="text-slate-200">{med.category}</div>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-mono mt-0.5 font-bold ${
                        med.rxSchedule.includes('H1')
                          ? 'bg-rose-500/20 text-rose-300'
                          : med.rxSchedule.includes('H')
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {med.rxSchedule}
                      </span>
                    </td>

                    <td className="p-4 font-mono text-[11px]">
                      <div className="text-teal-300">{med.sku}</div>
                      <div className="text-slate-500 text-[10px]">Batch: {med.batchNumber}</div>
                    </td>

                    <td className="p-4 font-mono">
                      <div className="text-white font-bold">₹{med.sellingPrice}</div>
                      <div className="text-[10px] text-slate-500 line-through">MRP ₹{med.mrp}</div>
                    </td>

                    <td className="p-4 font-mono">
                      <span className="font-bold text-white text-sm">{med.stockQuantity}</span>
                      <span className="text-[10px] text-slate-500 block">Min: {med.minStockLevel}</span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        med.status === 'In Stock'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : med.status === 'Low Stock'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {med.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenEdit(med)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold transition cursor-pointer text-xs flex items-center gap-1 ml-auto"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-black text-white">
                  {editingMedicine ? `Edit Medicine Parameters — ${editingMedicine.name}` : 'Add New Medicine Formulation'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicine} className="space-y-4 text-xs">
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Medicine Trade / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Augmentin 625 Duo Tablet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Generic Active Composition *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amoxicillin (500mg) + Clavulanic Acid (125mg)"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Manufacturer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. GlaxoSmithKline Pharmaceuticals"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Dosage Form</label>
                  <select
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup / Oral Liquid</option>
                    <option value="Injection">Injection / Vial</option>
                    <option value="Inhaler">Inhaler / Respules</option>
                    <option value="Drops">Eye / Ear Drops</option>
                    <option value="Ointment">Ointment / Cream</option>
                    <option value="Gel">Gel</option>
                    <option value="Powder">Powder / Sachet</option>
                    <option value="Medical Device">Medical Device</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Strength / Potency *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 625 mg"
                    value={strength}
                    onChange={(e) => setStrength(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PortalMedicine['category'])}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Heart Health">Heart Health</option>
                    <option value="Diabetes Care">Diabetes Care</option>
                    <option value="Respiratory Care">Respiratory Care</option>
                    <option value="Digestive Health">Digestive Health</option>
                    <option value="Fever & Cold">Fever & Cold</option>
                    <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                    <option value="Medical Devices">Medical Devices</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Prescription Requirement</label>
                  <select
                    value={prescriptionClassification}
                    onChange={(e) => setPrescriptionClassification(e.target.value as any)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Prescription Required">Prescription Required (Rx)</option>
                    <option value="OTC / Non-Prescription">OTC / Non-Prescription</option>
                    <option value="Restricted / Special Handling">Restricted / Special Handling</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Rx Drug Schedule</label>
                  <select
                    value={rxSchedule}
                    onChange={(e) => setRxSchedule(e.target.value as PortalMedicine['rxSchedule'])}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Schedule H">Schedule H</option>
                    <option value="Schedule H1">Schedule H1 (High Alert)</option>
                    <option value="Schedule X">Schedule X (Narcotics/Psychotropic)</option>
                    <option value="Schedule G">Schedule G</option>
                    <option value="OTC / Non-Scheduled">OTC / Non-Scheduled</option>
                    <option value="General Supplement">General Supplement</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Pricing & Taxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Purchase Cost (₹)</label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">GST Tax %</label>
                  <select
                    value={taxRatePercent}
                    onChange={(e) => setTaxRatePercent(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="0">0% (Nil)</option>
                    <option value="5">5% (Life Saving)</option>
                    <option value="12">12% (Standard Pharma)</option>
                    <option value="18">18% (Devices/Supplements)</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Stock & Batches */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Opening Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Min Safety Level</label>
                  <input
                    type="number"
                    value={minStockLevel}
                    onChange={(e) => setMinStockLevel(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Batch Number *</label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Checkbox Cold Chain */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={requiresColdChain}
                  onChange={(e) => setRequiresColdChain(e.target.checked)}
                  className="rounded text-teal-500 focus:ring-teal-400"
                />
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Requires Certified Cold Chain Refrigeration (2°C to 8°C)</span>
                </span>
              </label>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md shadow-teal-950/50"
                >
                  {editingMedicine ? 'Save Changes' : 'Add Medicine to Catalog'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
