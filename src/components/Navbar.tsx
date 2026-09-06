import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Pill,
  FlaskConical,
  Users,
  Newspaper,
  Bookmark,
  PhoneCall,
  Menu,
  X,
  Building2,
  Stethoscope,
  ShieldCheck,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  Calculator,
  Calendar,
  ShoppingBag,
  FileSpreadsheet,
  History,
  FileHeart,
  Search,
  Salad,
  Activity,
  User,
    Bell,
    MapPin,
  Droplets,
  BookOpen,
  MoreHorizontal} from 'lucide-react';
import { NavigationTab, UserAccount } from '../types';
import { LanguageSelector } from './LanguageSelector';
import { MoreOverlay } from './MoreOverlay';
import { EmergencyModal } from './EmergencyModal';
import { useLocalization } from '../context/LocalizationContext';

interface NavbarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab, subMode?: 'details' | 'dashboard' | 'ehr' | 'saved') => void;
  savedCount: number;
  currentUser: UserAccount | null;
  onOpenAuthModal: (mode?: 'login' | 'signup') => void;
  /** Open the dedicated full-page authentication experience (#auth). */
  onOpenAuthPage: (mode?: 'login' | 'signup') => void;
  /** Open Security & Privacy settings for the signed-in user. */
  onOpenSecuritySettings: () => void;
  /** Open a specific section of the user's Activity & Security history. */
  onOpenHistoryTab?: (tab: string) => void;
  onLogout: () => void;
}

interface MenuItem {
  id: string;
  tab: NavigationTab;
  label: string;
  icon: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  savedCount,
  currentUser,
  onOpenAuthModal,
  onOpenAuthPage,
  onOpenSecuritySettings,
  onOpenHistoryTab,
  onLogout}) => {
  const { t, setIsLanguageModalOpen } = useLocalization();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreOverlayOpen, setMoreOverlayOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);

  // Subtle shadow appears only after scrolling.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
        setMoreOverlayOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const go = (tab: NavigationTab, mode?: 'details' | 'dashboard' | 'ehr' | 'saved') => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    setMoreOverlayOpen(false);
    onTabChange(tab, mode);
  };

  const focusHeroSearch = () => {
    setMobileMenuOpen(false);
    if (currentTab !== 'home') {
      onTabChange('home');
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('gh:focus-search')), 120);
    } else {
      window.dispatchEvent(new CustomEvent('gh:focus-search'));
    }
  };

  const moreMenu: MenuItem[] = [
    { id: 'nav-news', tab: 'news', label: 'Health News', icon: <Newspaper className="h-4 w-4" /> },
    { id: 'nav-hospitals', tab: 'hospitals', label: 'Hospitals', icon: <Building2 className="h-4 w-4" /> },
    { id: 'nav-blood-banks', tab: 'medical-map', label: 'MAP', icon: <Droplets className="h-4 w-4" /> },
    { id: 'nav-community', tab: 'community', label: 'Community', icon: <Users className="h-4 w-4" /> },
  ];

  const isMoreActive = moreMenu.some((m) => currentTab === m.tab) || currentTab === 'dashboard' || currentTab === 'privacy' || currentTab === 'doctor-consent' || currentTab === 'my-history' || currentTab === 'doctor-portal' || currentTab === 'hospital-portal' || currentTab === 'medauth' || currentTab === 'news-management' || currentTab === 'news-admin' || currentTab === 'news-authority' || currentTab === 'doctor-console';

  const navLinkClass = (active: boolean) =>
    `relative flex items-center gap-1 rounded-lg px-2.5 py-2 text-[13px] font-semibold whitespace-nowrap transition duration-150 ${
      active ? 'text-medical-800' : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
    }`;

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow duration-200 ${
          scrolled ? 'border-slate-200 shadow-[0_2px_16px_-6px_rgba(15,23,42,0.12)]' : 'border-slate-100'
        }`}
      >
        <div className="gh-container gh-sym-navbar h-16">
          {/* Brand */}
          <button
            id="brand-logo-btn"
            type="button"
            onClick={() => go('home')}
            className="flex shrink-0 items-center gap-2.5 text-left"
            aria-label="GlobalHealth Home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 text-white shadow-sm">
              <Heart className="h-4.5 w-4.5 fill-white/20" />
            </span>
            <span className="hidden sm:block">
              <span className="block text-[15px] font-bold leading-none tracking-tight text-slate-900">
                Global<span className="text-medical-600">Health</span>
              </span>
              <span className="mt-0.5 block text-[9px] font-medium tracking-wide text-slate-400">
                Universal Health Network
              </span>
            </span>
          </button>

          {/* Center: primary navigation (desktop) */}
          <nav className="hidden lg:flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto scrollbar-none justify-center" aria-label="Primary">
            <button
              id="nav-home"
              type="button"
              onClick={() => go('home')}
              className={navLinkClass(currentTab === 'home')}
            >
              Home
            </button>

            <button
              id="nav-diseases"
              type="button"
              onClick={() => go('diseases')}
              className={navLinkClass(currentTab === 'diseases')}
            >
              Diseases
            </button>
            <button
              id="nav-medicines"
              type="button"
              onClick={() => go('medicines')}
              className={navLinkClass(currentTab === 'medicines')}
            >
              Medicines
            </button>
            <button
              id="nav-doctors"
              type="button"
              onClick={() => go('doctors')}
              className={navLinkClass(currentTab === 'doctors')}
            >
              Doctors
            </button>
            <button
              id="nav-medical-map"
              type="button"
              onClick={() => go('medical-map')}
              className={navLinkClass(currentTab === 'medical-map')}
            >
              Medical Map
            </button>
            <button
              id="nav-community"
              type="button"
              onClick={() => go('community')}
              className={navLinkClass(currentTab === 'community')}
            >
              Community
            </button>

            {/* More overlay trigger */}
            <div className="relative">
              <button
                id="nav-more"
                type="button"
                aria-expanded={moreOverlayOpen}
                aria-haspopup="dialog"
                onClick={() => setMoreOverlayOpen(!moreOverlayOpen)}
                className={navLinkClass(isMoreActive)}
              >
                <MoreHorizontal className="h-4 w-4" />
                More
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${moreOverlayOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </nav>

          {/* Right zone: utilities (desktop) + actions (mobile) */}
          <div className="flex items-center justify-end gap-1.5">
            <div className="hidden lg:flex shrink-0 items-center gap-1.5">
            <button
              id="navbar-search-btn"
              type="button"
              onClick={focusHeroSearch}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-medical-200 hover:bg-medical-50 hover:text-medical-700"
              aria-label="Search GlobalHealth"
              title="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <LanguageSelector compact />

            {currentUser ? (
              <div className="relative" ref={userRef}>
                <button
                  id="user-profile-menu-btn"
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-expanded={userDropdownOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 rounded-xl border border-medical-200 bg-medical-50/70 py-1.5 pl-1.5 pr-2.5 text-xs font-bold text-slate-800 transition hover:bg-medical-100/70"
                >
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.fullName || 'User'}
                      className="h-6 w-6 rounded-full border border-medical-300 object-cover"
                    />
                  ) : (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-medical-600 text-[10px] font-extrabold text-white">
                      {currentUser.fullName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                    </span>
                  )}
                  <span className="max-w-24 truncate">{currentUser.fullName || currentUser.username || 'User'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-medical-700" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 text-xs text-slate-800 shadow-lift">
                    <div className="border-b border-slate-100 px-2 pb-2">
                      <p className="text-sm font-extrabold text-slate-900">{currentUser.fullName}</p>
                      <p className="font-mono text-[11px] text-slate-500">@{currentUser.username}</p>
                    </div>
                    <div className="mt-1 space-y-0.5">
                      <button onClick={() => go('dashboard', 'dashboard')} className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-semibold text-slate-700 transition hover:bg-slate-50">
                        <LayoutDashboard className="h-4 w-4 text-medical-600" /> My Dashboard
                      </button>
                      <button onClick={() => go('dashboard', 'ehr')} className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-semibold text-slate-700 transition hover:bg-slate-50">
                        <FileSpreadsheet className="h-4 w-4 text-blue-600" /> My Health Records
                      </button>
                      <button onClick={() => go('appointments')} className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-semibold text-slate-700 transition hover:bg-slate-50">
                        <Calendar className="h-4 w-4 text-indigo-600" /> Appointments
                      </button>
                      <button onClick={() => go('dashboard', 'saved')} className="flex w-full items-center justify-between rounded-xl p-2 text-left font-semibold text-slate-700 transition hover:bg-slate-50">
                        <span className="flex items-center gap-2">
                          <Bookmark className="h-4 w-4 text-amber-600" /> Saved Items
                        </span>
                        {savedCount > 0 && (
                          <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">{savedCount}</span>
                        )}
                      </button>
                      <button onClick={() => { onOpenHistoryTab?.('notifications'); go('my-history'); }} className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-semibold text-slate-700 transition hover:bg-slate-50">
                        <Bell className="h-4 w-4 text-sky-600" /> Notifications
                      </button>
                      <button onClick={() => go('my-history')} className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-semibold text-slate-700 transition hover:bg-slate-50">
                        <History className="h-4 w-4 text-slate-600" /> Activity &amp; Security History
                      </button>
                      <button onClick={() => go('doctor-consent')} className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-semibold text-emerald-800 transition hover:bg-emerald-50">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" /> Doctor Access &amp; Consent
                      </button>
                      <button onClick={() => { setUserDropdownOpen(false); onOpenSecuritySettings(); }} className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-semibold text-slate-700 transition hover:bg-slate-50">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" /> Account Settings
                      </button>
                    </div>
                    <div className="mt-1 border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-xl p-2 text-left font-semibold text-rose-700 transition hover:bg-rose-50"
                      >
                        <LogOut className="h-4 w-4" /> {t('nav.signOut')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="navbar-signin-btn"
                  type="button"
                  onClick={() => onOpenAuthPage('login')}
                  className="rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  {t('nav.signIn')}
                </button>
                <button
                  id="navbar-signup-btn"
                  type="button"
                  onClick={() => onOpenAuthPage('signup')}
                  className="flex items-center gap-1.5 rounded-xl bg-medical-600 px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-medical-700"
                >
                  <UserPlus className="h-4 w-4" />
                  {t('nav.signUp')}
                </button>
              </div>
            )}
            </div>

            {/* Mobile actions */}
            <div className="flex lg:hidden items-center gap-1.5">
              <button
                type="button"
                onClick={focusHeroSearch}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500"
                aria-label="Search"
              >
                <Search className="h-4.5 w-4.5" />
              </button>
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => go('dashboard', 'dashboard')}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-medical-50 text-medical-700"
                  aria-label="Your dashboard"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-medical-600 text-[11px] font-extrabold text-white">
                    {currentUser.fullName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuthPage('signup')}
                  className="flex items-center gap-1.5 rounded-xl bg-medical-600 px-3.5 py-2 text-[13px] font-semibold text-white shadow-sm"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </button>
              )}
              <button
                id="mobile-menu-toggle-btn"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ---------------- Mobile drawer ---------------- */}
        {mobileMenuOpen && (
          <div className="lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-100 bg-white px-4 pb-6 pt-3">
            {/* Auth bar */}
            <div className="mb-4 rounded-2xl bg-slate-50 p-3">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-medical-600 text-xs font-bold text-white">
                      {currentUser.fullName?.charAt(0) || currentUser.username?.charAt(0) || 'U'}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{currentUser.fullName || currentUser.username}</p>
                      <p className="text-[10px] text-slate-500">@{currentUser.username || 'user'}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700"
                  >
                    {t('nav.signOut')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthPage('login');
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700"
                  >
                    <LogIn className="h-4 w-4 text-medical-600" /> Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuthPage('signup');
                    }}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-medical-600 py-2.5 text-xs font-semibold text-white"
                  >
                    <UserPlus className="h-4 w-4" /> Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Primary links */}
            <nav aria-label="Mobile navigation" className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'm-home', tab: 'home' as NavigationTab, label: 'Home', icon: <Heart className="h-4 w-4" /> },
                { id: 'm-diseases', tab: 'diseases' as NavigationTab, label: 'Diseases', icon: <BookOpen className="h-4 w-4" /> },
                { id: 'm-medicines', tab: 'medicines' as NavigationTab, label: 'Medicines', icon: <Pill className="h-4 w-4" /> },
                { id: 'm-doctors', tab: 'doctors' as NavigationTab, label: 'Doctors', icon: <Stethoscope className="h-4 w-4" /> },
                { id: 'm-map', tab: 'medical-map' as NavigationTab, label: 'Medical Map', icon: <MapPin className="h-4 w-4" /> },
                { id: 'm-community', tab: 'community' as NavigationTab, label: 'Community', icon: <Users className="h-4 w-4" /> },
                { id: 'm-tests', tab: 'medical-tests' as NavigationTab, label: 'Lab Tests', icon: <FlaskConical className="h-4 w-4" /> },
                { id: 'm-news', tab: 'news' as NavigationTab, label: 'Health News', icon: <Newspaper className="h-4 w-4" /> },
                { id: 'm-nutrition', tab: 'nutrition' as NavigationTab, label: 'Nutrition', icon: <Salad className="h-4 w-4" /> },
                { id: 'm-calculators', tab: 'calculators' as NavigationTab, label: 'Health Tools', icon: <Calculator className="h-4 w-4" /> },
                { id: 'm-wellness', tab: 'wellness' as NavigationTab, label: 'Wellness & Fitness', icon: <Activity className="h-4 w-4" /> },
                { id: 'm-hospitals', tab: 'hospitals' as NavigationTab, label: 'Hospitals', icon: <Building2 className="h-4 w-4" /> },
              ].map((item) => {
                const active = currentTab === item.tab;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go(item.tab)}
                    className={`flex items-center gap-2.5 rounded-xl p-3 text-xs font-medium transition ${
                      active ? 'bg-medical-50 font-bold text-medical-800' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className={active ? 'text-medical-600' : 'text-slate-400'}>{item.icon}</span>
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Account & workspaces */}
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Account &amp; workspaces</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button type="button" onClick={() => go('dashboard', 'dashboard')} className="flex items-center gap-2 rounded-xl bg-teal-50 p-2.5 text-xs font-semibold text-teal-900">
                  <FileHeart className="h-4 w-4 text-teal-600" /> Health Records
                </button>
                <button type="button" onClick={() => go('doctor-portal')} className="flex items-center gap-2 rounded-xl bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-900">
                  <Stethoscope className="h-4 w-4 text-emerald-600" /> Doctor Portal
                </button>
                <button type="button" onClick={() => go('hospital-portal')} className="flex items-center gap-2 rounded-xl bg-indigo-50 p-2.5 text-xs font-semibold text-indigo-900">
                  <Building2 className="h-4 w-4 text-indigo-600" /> Hospital Portal
                </button>
                <button type="button" onClick={() => go('pharmacy-portal')} className="flex items-center gap-2 rounded-xl bg-teal-50 p-2.5 text-xs font-semibold text-teal-900">
                  <ShoppingBag className="h-4 w-4 text-teal-600" /> Pharmacy Porter
                </button>
                <button type="button" onClick={() => go('news-management')} className="flex items-center gap-2 rounded-xl bg-purple-50 p-2.5 text-xs font-semibold text-purple-900">
                  <Newspaper className="h-4 w-4 text-purple-600" /> News Management
                </button>
                <button type="button" onClick={() => go('appointments')} className="flex items-center gap-2 rounded-xl bg-slate-100 p-2.5 text-xs font-semibold text-slate-700">
                  <Calendar className="h-4 w-4 text-slate-500" /> Appointments
                </button>
              </div>
            </div>

            {/* Bottom utilities */}
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowEmergencyModal(true);
                  setMobileMenuOpen(false);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-semibold text-white"
              >
                <PhoneCall className="h-4 w-4" /> Emergency
              </button>
              <LanguageSelector />
            </div>
          </div>
        )}
      </header>

      {/* Emergency Contact Modal (shared with the Explore page) */}
      <EmergencyModal open={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} />

      {/* Full-page "More" overlay — covers the website with all More tabs */}
      <MoreOverlay
        open={moreOverlayOpen}
        onClose={() => setMoreOverlayOpen(false)}
        currentTab={currentTab}
        onNavigate={(tab, mode) => go(tab, mode)}
        onEmergency={() => {
          setMoreOverlayOpen(false);
          setShowEmergencyModal(true);
        }}
        onLanguages={() => {
          setMoreOverlayOpen(false);
          setIsLanguageModalOpen(true);
        }}
      />
    </>
  );
};
