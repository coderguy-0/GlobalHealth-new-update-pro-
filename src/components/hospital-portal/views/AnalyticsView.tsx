import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  BedDouble,
  DollarSign,
  Users,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';

export const AnalyticsView: React.FC = () => {
  const { currentHospital, beds, doctors, appointments, claims } = useHospitalPortal();

  const totalOccupied = beds.filter((b) => b.status === 'Occupied').length;
  const occupancyRate = beds.length > 0 ? Math.round((totalOccupied / beds.length) * 100) : 0;
  const totalClaimsVal = claims.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCEBE4] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#17221E]">Executive Clinical & Financial Intelligence</h1>
          <p className="text-xs text-[#52635C]">
            Real-Time Inpatient Throughput, Surgical Utilization & Cashless Revenue Analytics
          </p>
        </div>
      </div>

      {/* 4 Top Level Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#52635C] uppercase tracking-wider">Average Length of Stay (ALOS)</span>
          <div className="text-2xl font-bold text-[#17221E] font-mono">3.8 Days</div>
          <p className="text-xs text-[#008F68] font-semibold">↓ 0.4 days vs Metropolitan benchmark</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#52635C] uppercase tracking-wider">Bed Turnover Interval</span>
          <div className="text-2xl font-bold text-[#17221E] font-mono">42 Mins</div>
          <p className="text-xs text-[#008F68] font-semibold">Fast terminal disinfection protocol</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#52635C] uppercase tracking-wider">OT Suite Utilization</span>
          <div className="text-2xl font-bold text-[#17221E] font-mono">88.4%</div>
          <p className="text-xs text-[#287EA8] font-semibold">Robotic & CVTS suites peak load</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-2">
          <span className="text-xs font-bold text-[#52635C] uppercase tracking-wider">Active Cashless Pipeline</span>
          <div className="text-2xl font-bold text-[#17221E] font-mono">₹{(totalClaimsVal / 100000).toFixed(1)} Lakhs</div>
          <p className="text-xs text-[#008F68] font-semibold">94.2% pre-auth settlement rate</p>
        </div>
      </div>

      {/* Visual Simulated Charts / Progress Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inpatient Occupancy Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCEBE4] pb-3">
            <h3 className="text-sm font-bold text-[#17221E]">Inpatient Ward Occupancy Distribution</h3>
            <span className="text-xs font-mono font-bold text-[#008F68]">{occupancyRate}% Overall</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>ICU / CCU Critical Beds (80 Total)</span>
                <span className="font-mono font-bold text-[#D64545]">92% Full</span>
              </div>
              <div className="w-full bg-[#F1FAF6] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#D64545] h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Surgical Post-Op Wards (120 Total)</span>
                <span className="font-mono font-bold text-[#008F68]">76% Full</span>
              </div>
              <div className="w-full bg-[#F1FAF6] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#008F68] h-full rounded-full" style={{ width: '76%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>Private & Deluxe Suites (150 Total)</span>
                <span className="font-mono font-bold text-[#287EA8]">84% Full</span>
              </div>
              <div className="w-full bg-[#F1FAF6] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#287EA8] h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span>General Inpatient Wards (100 Total)</span>
                <span className="font-mono font-bold text-[#008F68]">68% Full</span>
              </div>
              <div className="w-full bg-[#F1FAF6] rounded-full h-2.5 overflow-hidden">
                <div className="bg-[#008F68] h-full rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Quality & Infection Control */}
        <div className="p-6 rounded-2xl bg-white border border-[#DCEBE4] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCEBE4] pb-3">
            <h3 className="text-sm font-bold text-[#17221E]">NABH Quality & Infection Control Indices</h3>
            <span className="text-xs font-mono font-bold text-[#008F68] bg-[#E8F7F1] px-2 py-0.5 rounded">
              Green Zone
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1">
              <span className="text-[#52635C] block">CLABSI Rate</span>
              <div className="text-lg font-bold text-[#008F68] font-mono">0.12 / 1000</div>
              <span className="text-[10px] text-[#52635C]">Central Line Catheter Days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1">
              <span className="text-[#52635C] block">CAUTI Rate</span>
              <div className="text-lg font-bold text-[#008F68] font-mono">0.18 / 1000</div>
              <span className="text-[10px] text-[#52635C]">Urinary Catheter Days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1">
              <span className="text-[#52635C] block">VAP Incident Rate</span>
              <div className="text-lg font-bold text-[#008F68] font-mono">0.08 / 1000</div>
              <span className="text-[10px] text-[#52635C]">Ventilator Days</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F6FBF8] border border-[#DCEBE4] space-y-1">
              <span className="text-[#52635C] block">Hand Hygiene Compliance</span>
              <div className="text-lg font-bold text-[#008F68] font-mono">98.4%</div>
              <span className="text-[10px] text-[#52635C]">WHO 5 Moments Audit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
