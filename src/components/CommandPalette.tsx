import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  BookOpen,
  Pill,
  FlaskConical,
  Stethoscope,
  Building2,
  MapPin,
  Bot,
  Activity,
  Calculator,
  Newspaper,
  Users,
  Ambulance,
  ArrowRight,
  Sparkles,
  Heart,
  X,
} from 'lucide-react';
import { NavigationTab, DashboardViewMode } from '../types';
import { EXPLORE_ITEMS, WORKSPACE_ITEMS } from './explore/exploreData';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavigationTab, mode?: DashboardViewMode) => void;
  onOpenEmergency: () => void;
}

interface PaletteItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Explore' | 'Workspaces' | 'Actions' | 'Emergency';
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenEmergency,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          window.dispatchEvent(new CustomEvent('gh:open-command-palette'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [
      {
        id: 'cmd-emergency',
        title: 'Emergency Services (SOS 911 / 112)',
        subtitle: 'Immediate hospital, ambulance & crisis hotlines',
        category: 'Emergency',
        icon: <Ambulance className="h-4 w-4 text-rose-600" />,
        action: onOpenEmergency,
      },
      {
        id: 'cmd-ai',
        title: 'Ask Clinical AI Assistant',
        subtitle: 'Instant symptom triage & medical guidance',
        category: 'Actions',
        icon: <Bot className="h-4 w-4 text-medical-600" />,
        action: () => onNavigate('ai-assistant'),
      },
    ];

    EXPLORE_ITEMS.forEach((it) => {
      list.push({
        id: `cmd-${it.id}`,
        title: it.label,
        subtitle: it.description,
        category: 'Explore',
        icon: it.icon,
        action: () => onNavigate(it.tab, it.mode),
      });
    });

    WORKSPACE_ITEMS.forEach((ws) => {
      list.push({
        id: `cmd-${ws.id}`,
        title: ws.label,
        subtitle: ws.description,
        category: 'Workspaces',
        icon: ws.icon,
        action: () => onNavigate(ws.tab, ws.mode),
      });
    });

    return list;
  }, [onNavigate, onOpenEmergency]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.subtitle.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  const handleKeyDownInMenu = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/60 p-4 pt-16 sm:pt-24 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDownInMenu}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands, destinations, conditions, tools…"
            className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500">
            ESC
          </kbd>
        </div>

        {/* List of actions */}
        <div className="max-h-96 overflow-y-auto p-2 scrollbar-thin">
          {filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs text-slate-500">
              No matching destinations found. Try searching for "Doctor", "Pharmacy", or "Calculators".
            </div>
          ) : (
            filtered.map((item, index) => {
              const active = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition ${
                    active ? 'bg-medical-50/80 text-medical-950' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                        active ? 'bg-medical-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-900">{item.title}</p>
                      <p className="truncate text-[11px] text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                      {item.category}
                    </span>
                    <ArrowRight
                      className={`h-3.5 w-3.5 text-slate-300 transition ${
                        active ? 'text-medical-600 translate-x-0.5' : ''
                      }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2.5 text-[11px] text-slate-400">
          <span>Navigate with ↑ and ↓</span>
          <span>Select with Enter</span>
        </div>
      </div>
    </div>
  );
};
