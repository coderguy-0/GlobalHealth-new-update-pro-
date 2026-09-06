import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Search, 
  Sparkles, 
  Scale, 
  Activity, 
  HeartPulse, 
  Stethoscope, 
  Baby, 
  Flame, 
  Zap, 
  CheckCircle2, 
  Info, 
  SlidersHorizontal,
  ChevronRight,
  Filter
} from 'lucide-react';
import { 
  ALL_CALCULATORS, 
  CALCULATOR_CATEGORIES, 
  CalculatorItem 
} from '../data/calculatorsData';
import { usePatientEhr } from '../context/PatientEhrContext';

export const CalculatorsView: React.FC = () => {
  const { activePatient, wellness } = usePatientEhr();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCalcId, setActiveCalcId] = useState<string>('bmi');

  // Active calculator state mapping for form fields
  const activeCalc = useMemo(() => {
    return ALL_CALCULATORS.find(c => c.id === activeCalcId) || ALL_CALCULATORS[0];
  }, [activeCalcId]);

  // Dynamic form input values state
  const [formValues, setFormValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    activeCalc.inputs.forEach(input => {
      initial[input.id] = input.defaultValue;
    });
    return initial;
  });

  // Prefill active calculator with EHR values
  const handlePrefillEhrData = () => {
    const nextValues: Record<string, any> = { ...formValues };
    
    // Parse BP
    const bpParts = (activePatient.recentVitals.bp || '120/80').split('/');
    const sys = parseInt(bpParts[0]) || 120;
    const dia = parseInt(bpParts[1]) || 80;

    activeCalc.inputs.forEach(input => {
      const idLower = input.id.toLowerCase();
      if (idLower.includes('weight')) nextValues[input.id] = wellness.weightKg;
      else if (idLower.includes('height')) nextValues[input.id] = wellness.heightCm;
      else if (idLower.includes('age')) nextValues[input.id] = activePatient.age || 35;
      else if (idLower.includes('sys') || idLower.includes('sbp')) nextValues[input.id] = sys;
      else if (idLower.includes('dia') || idLower.includes('dbp')) nextValues[input.id] = dia;
      else if (idLower.includes('pulse') || idLower.includes('hr') || idLower.includes('heart')) nextValues[input.id] = activePatient.recentVitals.hr || 72;
      else if (idLower.includes('gender') || idLower.includes('sex')) nextValues[input.id] = (activePatient.gender || 'male').toLowerCase();
    });

    setFormValues(nextValues);
  };

  // Handle switching calculator and loading default values
  const handleSelectCalculator = (calc: CalculatorItem) => {
    setActiveCalcId(calc.id);
    const initial: Record<string, any> = {};
    calc.inputs.forEach(input => {
      initial[input.id] = input.defaultValue;
    });
    setFormValues(initial);
  };

  // Filtered calculators list based on category and search
  const filteredCalculators = useMemo(() => {
    return ALL_CALCULATORS.filter(calc => {
      const matchesCategory = selectedCategory === 'All' || calc.category === selectedCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        calc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        calc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        calc.number.toString().includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle input changes
  const handleInputChange = (id: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Compute results
  const result = useMemo(() => {
    try {
      return activeCalc.calculate(formValues);
    } catch (err) {
      return {
        primaryResult: 'Invalid Input',
        primaryLabel: 'Error calculating',
        status: 'Please verify input values',
        statusColor: 'amber'
      };
    }
  }, [activeCalc, formValues]);

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8">
        {/* Header Title & Summary */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-bold uppercase tracking-wider mb-2">
              <Calculator className="h-3.5 w-3.5 text-amber-700" />
              <span>80 Clinical & Physiology Calculators</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Health Calculators
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Access 80 evidence-based calculators spanning body composition, metabolic rate, cardiovascular risk, renal function, pediatric growth, and sports performance.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-800 font-bold">
              80
            </div>
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Complete Suite</span>
              <span className="text-slate-500">100% Free Medical Tools</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 80 calculators (e.g., BMI, GFR, Heart Rate, ASCVD, APGAR)..."
                className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs sm:text-sm placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
              />
            </div>

            {/* Total Results Counter */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 whitespace-nowrap">
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <span>Showing {filteredCalculators.length} of 80 Calculators</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CALCULATOR_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-2xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Calculator Selection Sidebar + Active Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Calculator Index List (4 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-4 shadow-2xs space-y-3 max-h-[720px] overflow-y-auto">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" /> Select Calculator
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md">
                {filteredCalculators.length} available
              </span>
            </div>

            {filteredCalculators.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No calculator matches "{searchQuery}". Try clearing filters.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCalculators.map((calc) => {
                  const isSelected = activeCalcId === calc.id;
                  return (
                    <button
                      key={calc.id}
                      onClick={() => handleSelectCalculator(calc)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 group ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-300 shadow-2xs ring-1 ring-amber-400/40'
                          : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-black ${
                        isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800'
                      }`}>
                        #{calc.number}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-amber-950' : 'text-slate-900'}`}>
                            {calc.title}
                          </h4>
                          <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-amber-600' : 'text-slate-300'}`} />
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {calc.description}
                        </p>
                        <span className="inline-block mt-1 text-[9px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded-md">
                          {calc.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active Interactive Calculator Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Active Calculator Header */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-lg bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[11px] font-bold">
                  Calculator #{activeCalc.number}
                </span>
                <span className="rounded-lg bg-slate-100 text-slate-600 px-2.5 py-0.5 text-[11px] font-semibold">
                  {activeCalc.category}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                {activeCalc.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {activeCalc.description}
              </p>
            </div>

            {/* Interactive Inputs Form */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Input Parameters
                </h4>

                <button
                  type="button"
                  onClick={handlePrefillEhrData}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold transition shadow-2xs cursor-pointer self-start sm:self-auto"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Prefill from EHR ({activePatient.name.split(' ')[0]})</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {activeCalc.inputs.map((input) => {
                  const val = formValues[input.id] ?? input.defaultValue;

                  if (input.type === 'select') {
                    return (
                      <div key={input.id} className="space-y-1 sm:col-span-2">
                        <label className="font-bold text-slate-700 block">
                          {input.label}
                        </label>
                        <select
                          value={val}
                          onChange={(e) => handleInputChange(input.id, e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800 focus:border-amber-500 focus:bg-white focus:outline-none"
                        >
                          {input.options?.map((opt, i) => (
                            <option key={i} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (input.type === 'boolean') {
                    return (
                      <div key={input.id} className="sm:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                        <span className="font-bold text-slate-700">{input.label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean(val)}
                          onChange={(e) => handleInputChange(input.id, e.target.checked)}
                          className="h-4 w-4 accent-amber-600 rounded-md cursor-pointer"
                        />
                      </div>
                    );
                  }

                  // Number input with slider
                  return (
                    <div key={input.id} className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center font-bold text-slate-700">
                        <span>{input.label}</span>
                        <span className="text-amber-800 font-extrabold bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                          {val} {input.unit || ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={val}
                          min={input.min}
                          max={input.max}
                          step={input.step || 1}
                          onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                          className="w-24 rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-center font-bold"
                        />
                        {input.min !== undefined && input.max !== undefined && (
                          <input
                            type="range"
                            min={input.min}
                            max={input.max}
                            step={input.step || 1}
                            value={val}
                            onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                            className="flex-1 accent-amber-600 cursor-pointer"
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Calculated Output Display Box */}
            <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/90 to-amber-100/40 p-6 space-y-4">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block">
                  {result.primaryLabel}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">
                  {result.primaryResult}
                </span>

                {result.status && (
                  <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border mt-2 ${
                    result.statusColor === 'red' 
                      ? 'bg-red-100 text-red-900 border-red-200'
                      : result.statusColor === 'amber'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{result.status}</span>
                  </div>
                )}
              </div>

              {/* Extra Details breakdown */}
              {result.details && result.details.length > 0 && (
                <div className="pt-3 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {result.details.map((detail, idx) => (
                    <div key={idx} className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60 flex flex-col">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{detail.label}</span>
                      <span className="font-bold text-slate-800 mt-0.5">{detail.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {result.explanation && (
                <p className="text-[11px] text-slate-600 leading-relaxed text-center pt-1 border-t border-amber-200/60">
                  <Info className="inline h-3.5 w-3.5 text-amber-700 mr-1" />
                  {result.explanation}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
