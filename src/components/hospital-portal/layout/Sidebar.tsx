import React from 'react';
import {
  LayoutDashboard,
  Building,
  Network,
  Stethoscope,
  Users,
  Calendar,
  BedDouble,
  Siren,
  Ambulance,
  FlaskConical,
  Droplets,
  Pill,
  Wrench,
  BadgePercent,
  ShieldAlert,
  FileCheck,
  GitPullRequest,
  Radio,
  BarChart3,
  ScrollText,
  Lock,
  Settings,
  Globe,
  Globe2,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { useHospitalPortal } from '../../../context/HospitalContext';
import { NavigationView } from '../../../types/hospitalPortal';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    drafts,
    beds,
    currentHospital,
    bloodBank,
    currentUser,
    currentRole
  } = useHospitalPortal();

  // Metrics for badges
  const pendingDraftsCount = drafts.filter((d) => d.status === 'Pending Review').length;
  const occupiedBedsCount = beds.filter((b) => b.status === 'Occupied').length;
  const lowBloodCount = bloodBank.filter((b) => b.prbcUnits < b.criticalMinThreshold).length;

  const NAV_SECTIONS: {
    title: string;
    items: {
      id: NavigationView;
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      badge?: string | number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      title: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'profile', label: 'Hospital Profile & ID', icon: Building },
        { id: 'public-sync', label: 'GlobalHealth Public Sync', icon: Globe2 },
        { id: 'organization', label: 'Campus Wings & OTs', icon: Network }
      ]
    },
    {
      title: 'Clinical Faculty',
      items: [
        { id: 'doctors', label: 'Doctors & Specialists', icon: Stethoscope },
        { id: 'staff', label: 'Personnel & RBAC', icon: Users },
        { id: 'appointments', label: 'OPD Queue & Tokens', icon: Calendar }
      ]
    },
    {
      title: 'Capacity & Emergency',
      items: [
        {
          id: 'capacity',
          label: 'Inpatient Beds & ICU',
          icon: BedDouble,
          badge: `${occupiedBedsCount}/${beds.length}`,
          badgeColor: 'bg-[#E8F7F1] text-[#008F68]'
        },
        {
          id: 'emergency',
          label: 'Emergency & Code Red',
          icon: Siren,
          badge: currentHospital.redAlertActive ? 'STAT' : undefined,
          badgeColor: 'bg-[#D64545] text-white animate-pulse'
        },
        { id: 'ambulance', label: 'Ambulance Fleet Telemetry', icon: Ambulance }
      ]
    },
    {
      title: 'Diagnostics & Pharma',
      items: [
        { id: 'diagnostics', label: 'Laboratory & Imaging', icon: FlaskConical },
        {
          id: 'blood-bank',
          label: 'Blood Bank Reserves',
          icon: Droplets,
          badge: lowBloodCount > 0 ? `${lowBloodCount} low` : undefined,
          badgeColor: 'bg-[#FFF1F1] text-[#C53939]'
        },
        { id: 'pharmacy', label: 'Pharmacy & Formulary', icon: Pill }
      ]
    },
    {
      title: 'Assets & Finance',
      items: [
        { id: 'equipment', label: 'Biomedical Assets (PPM)', icon: Wrench },
        { id: 'tariffs', label: 'Pricing & Packages Master', icon: BadgePercent },
        { id: 'insurance', label: 'Insurance & TPAs (Cashless)', icon: ShieldAlert }
      ]
    },
    {
      title: 'Governance & Quality',
      items: [
        { id: 'documents', label: 'License & Compliance Vault', icon: FileCheck },
        {
          id: 'drafts',
          label: 'Change Management Pipeline',
          icon: GitPullRequest,
          badge: pendingDraftsCount > 0 ? pendingDraftsCount : undefined,
          badgeColor: 'bg-[#FFF7E6] text-[#A86E00]'
        },
        { id: 'communication', label: 'Announcements Broadcast', icon: Radio },
        { id: 'analytics', label: 'Clinical Intelligence', icon: BarChart3 }
      ]
    },
    {
      title: 'Security & System',
      items: [
        { id: 'audit-logs', label: 'Immutable SHA-256 Audit', icon: ScrollText },
        { id: 'security', label: '2FA Center & Sessions', icon: Lock },
        { id: 'settings', label: 'Hospital Settings', icon: Settings },
        { id: 'global-admin', label: 'SuperAdmin Control Tower', icon: Globe },
        { id: 'auth', label: 'Personnel Auth Gateway', icon: KeyRound }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#FFFFFF] border-r border-[#DCEBE4] flex flex-col shrink-0 h-[calc(100vh-53px)] sticky top-[53px] overflow-y-auto">
      {/* Hospital Identity Header Card */}
      <div className="p-3.5 border-b border-[#DCEBE4] bg-[#F6FBF8]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-[#008F68] text-white flex items-center justify-center font-black text-sm shrink-0">
            {currentHospital.name.slice(0, 1)}
          </div>
          <div className="truncate">
            <h4 className="text-xs font-extrabold text-[#17221E] truncate">{currentHospital.shortName || currentHospital.name}</h4>
            <span className="text-[10px] text-[#008F68] font-bold bg-[#E8F7F1] px-1.5 py-0.5 rounded border border-[#BDE4D5]">
              {currentHospital.traumaLevel.split(' ')[0]} {currentHospital.traumaLevel.split(' ')[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 p-3 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            <h5 className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-[#687971]">
              {section.title}
            </h5>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#E8F7F1] text-[#006B4F] font-bold border border-[#BDE4D5]'
                        : 'text-[#52635C] hover:bg-[#F1FAF6] hover:text-[#17221E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#008F68]' : 'text-[#52635C]'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor || 'bg-[#F1FAF6] text-[#52635C]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Session Summary */}
      <div className="p-3 border-t border-[#DCEBE4] bg-[#F6FBF8]">
        <div className="p-2.5 rounded-xl bg-white border border-[#DCEBE4] flex items-center justify-between">
          <div className="truncate">
            <div className="text-[11px] font-bold text-[#17221E] truncate">{currentUser?.name}</div>
            <div className="text-[10px] text-[#008F68] font-bold truncate">{currentRole}</div>
          </div>
          <span className="h-2 w-2 rounded-full bg-[#008F68] ring-2 ring-[#BDE4D5]" title="Session Verified" />
        </div>
      </div>
    </aside>
  );
};
