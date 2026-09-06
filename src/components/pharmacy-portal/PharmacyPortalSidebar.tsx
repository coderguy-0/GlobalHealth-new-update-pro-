import React from 'react';
import type { PharmacyPortalNavTab } from '../../types/pharmacyPortal';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileCheck2, 
  Pill, 
  Package, 
  CalendarClock, 
  DollarSign, 
  Building2, 
  Users, 
  Truck, 
  CreditCard, 
  BarChart3, 
  FileText, 
  HelpCircle, 
  Activity, 
  Store,
  Globe2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

// The sidebar and the portal shell must agree on tab ids, otherwise a nav
// item renders nothing. PharmacyPortalNavTab is the single source of truth.
export type PortalTabId = PharmacyPortalNavTab;

interface PharmacyPortalSidebarProps {
  activeTab: PortalTabId;
  onTabChange?: (tab: PortalTabId) => void;
  onSelectTab?: (tab: any) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  pendingRxCount?: number;
  newOrdersCount?: number;
  pendingOrdersCount?: number;
  lowStockCount?: number;
  allowedTabs?: PortalTabId[];
}

export const PharmacyPortalSidebar: React.FC<PharmacyPortalSidebarProps> = ({
  activeTab,
  onTabChange,
  onSelectTab,
  isCollapsed = false,
  onToggleCollapse,
  pendingRxCount = 0,
  newOrdersCount,
  pendingOrdersCount = 0,
  lowStockCount = 0,
  allowedTabs
}) => {
  const effectiveOrders = newOrdersCount ?? pendingOrdersCount ?? 0;
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: effectiveOrders > 0 ? effectiveOrders : undefined, badgeColor: 'bg-emerald-500' },
    { id: 'prescriptions', label: 'Prescription Inbox', icon: FileCheck2, badge: pendingRxCount > 0 ? pendingRxCount : undefined, badgeColor: 'bg-amber-500' },
    { id: 'catalog', label: 'Medicine Catalog', icon: Pill },
    { id: 'inventory', label: 'Inventory & Stock', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined, badgeColor: 'bg-rose-500' },
    { id: 'marketplace-sync', label: 'Marketplace Sync', icon: Globe2 },
    { id: 'batches', label: 'Batch & Expiry', icon: CalendarClock },
    { id: 'pricing', label: 'Pricing Rules', icon: DollarSign },
    { id: 'branches', label: 'Branches & Depots', icon: Building2 },
    { id: 'staff', label: 'Staff & Roles', icon: Users },
    { id: 'delivery', label: 'Delivery & Pickup', icon: Truck },
    { id: 'payments', label: 'Payments & Payouts', icon: CreditCard },
    { id: 'analytics', label: 'Analytics & KPIs', icon: BarChart3 },
    { id: 'compliance', label: 'Compliance Documents', icon: FileText },
    { id: 'support', label: 'Support & Tickets', icon: HelpCircle },
    { id: 'audit-logs', label: 'Audit Logs', icon: Activity },
    { id: 'profile', label: 'Pharmacy Profile', icon: Store }
  ];

  const visibleNavItems = allowedTabs
    ? navItems.filter((item) => allowedTabs.includes(item.id as PortalTabId))
    : navItems;

  const handleTabClick = (tabId: PortalTabId) => {
    if (onTabChange) onTabChange(tabId);
    else if (onSelectTab) onSelectTab(tabId);
  };

  return (
    <aside 
      className={`bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-60 lg:w-64'
      }`}
    >
      
      {/* Top Navigation Links */}
      <div className="py-3 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-110px)]">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id as PortalTabId)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              
              {!isCollapsed && (
                <span className="truncate text-left flex-1">{item.label}</span>
              )}

              {/* Notification Badges */}
              {item.badge !== undefined && (
                <span className={`text-[10px] font-black text-slate-950 px-1.5 py-0.2 rounded-full shrink-0 ${
                  item.badgeColor || 'bg-teal-400'
                } ${isCollapsed ? 'absolute top-1 right-1 px-1 text-[8px]' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Collapse Toggle & System Trust Footer */}
      <div className="p-2 border-t border-slate-800/80">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-slate-400 hover:text-white transition text-xs font-bold cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
};
