import React, { useEffect, useRef, useState } from 'react';
import { Activity, Heart, Globe, ShieldCheck, Zap, Server, Users } from 'lucide-react';

type PulseItem = {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  tint: string;
};

/**
 * "Global Health Pulse" — animated scrolling live-stats ticker that sits
 * between the hero and the first content section. Provides a real-time
 * telemetry feel with counters that gently drift over time.
 */
export const LiveHealthPulse: React.FC = () => {
  const [tps, setTps] = useState(1842);
  const [activeUsers, setActiveUsers] = useState(28_341);
  const [hospitals] = useState(14_237);
  const [queries, setQueries] = useState(98);
  const [alerts, setAlerts] = useState(3);
  const [pulse, setPulse] = useState(true);
  const timerRef = useRef<number | null>(null);

  // Drift counters for the "live" feeling
  useEffect(() => {
    const tick = () => {
      setTps((v) => Math.max(1500, v + Math.floor(Math.random() * 7) - 2));
      setActiveUsers((v) => Math.max(20_000, v + Math.floor(Math.random() * 11) - 3));
      setQueries((v) => Math.max(40, Math.min(100, v + Math.floor(Math.random() * 5) - 2)));
      if (Math.random() < 0.04) setAlerts((v) => Math.max(0, v + (Math.random() < 0.5 ? 1 : -1)));
      timerRef.current = window.setTimeout(tick, 1600);
    };
    tick();
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  // Heartbeat pulse
  useEffect(() => {
    const i = window.setInterval(() => {
      setPulse(false);
      window.setTimeout(() => setPulse(true), 160);
    }, 1200);
    return () => window.clearInterval(i);
  }, []);

  const items: PulseItem[] = [
    {
      id: 'transactions',
      icon: <Zap className="h-3.5 w-3.5 text-amber-500" />,
      label: 'Health queries / sec',
      value: tps.toLocaleString(),
      tint: 'text-amber-600',
    },
    {
      id: 'users',
      icon: <Users className="h-3.5 w-3.5 text-sky-500" />,
      label: 'Active users online',
      value: activeUsers.toLocaleString(),
      tint: 'text-sky-600',
    },
    {
      id: 'hospitals',
      icon: <Globe className="h-3.5 w-3.5 text-emerald-500" />,
      label: 'Verified facilities',
      value: hospitals.toLocaleString(),
      tint: 'text-emerald-600',
    },
    {
      id: 'uptime',
      icon: <Server className="h-3.5 w-3.5 text-medical-500" />,
      label: 'Platform uptime',
      value: '99.998%',
      tint: 'text-medical-700',
    },
    {
      id: 'ai',
      icon: <Activity className="h-3.5 w-3.5 text-violet-500" />,
      label: 'AI triage load',
      value: `${queries}%`,
      tint: 'text-violet-600',
    },
    {
      id: 'alerts',
      icon: <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />,
      label: 'Active health advisories',
      value: `${alerts} region${alerts === 1 ? '' : 's'}`,
      tint: 'text-rose-600',
    },
  ];

  return (
    <div className="relative z-10 border-y border-slate-200/70 bg-gradient-to-r from-slate-50 via-white to-slate-50">
      <div className="gh-container flex items-center gap-4 overflow-hidden py-2.5">
        {/* Live indicator */}
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 ${pulse ? 'opacity-75' : 'opacity-30'} transition-opacity`} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <Heart className={`h-3 w-3 fill-emerald-500 text-emerald-600 transition-transform ${pulse ? 'scale-110' : 'scale-100'}`} />
          Global Pulse
        </div>

        {/* Scrolling ticker */}
        <div className="relative flex-1 overflow-hidden">
          <div className="flex animate-[gh-pulse-scroll_45s_linear_infinite] gap-8 whitespace-nowrap will-change-transform">
            {[...items, ...items].map((it, idx) => (
              <div key={`${it.id}-${idx}`} className="flex items-center gap-2 text-xs">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white ring-1 ring-slate-200">
                  {it.icon}
                </span>
                <span className="font-semibold text-slate-500">{it.label}:</span>
                <span className={`font-extrabold tabular-nums ${it.tint}`}>{it.value}</span>
              </div>
            ))}
          </div>
          {/* Edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-slate-50 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent" />
        </div>
      </div>

      <style>{`
        @keyframes gh-pulse-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[gh-pulse-scroll_45s_linear_infinite] { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
