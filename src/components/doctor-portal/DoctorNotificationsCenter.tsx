import React, { useMemo, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useDoctorPortal, WorkspaceView, NotificationCategory, NotificationPriority } from './doctorPortalData';
import { useClinicalWorkspace } from './doctorClinicalData';

interface Props { onNavigate: (v: WorkspaceView) => void }

const CATS: { id: 'all' | NotificationCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'clinical', label: 'Clinical' },
  { id: 'appointments', label: 'Appointments' },
  { id: 'communication', label: 'Communication' },
  { id: 'administrative', label: 'Administrative' },
  { id: 'financial', label: 'Financial' },
  { id: 'security', label: 'Security' },
];

const TONE: Record<NotificationPriority, string> = {
  critical: 'bg-rose-50 text-rose-800 ring-rose-200',
  high: 'bg-amber-50 text-amber-800 ring-amber-200',
  normal: 'bg-slate-50 text-slate-600 ring-slate-200',
  low: 'bg-white text-[#8A97A8] ring-[#E3E8EF]',
};

export const DoctorNotificationsCenter: React.FC<Props> = ({ onNavigate }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDoctorPortal();
  const { selectPatient } = useClinicalWorkspace();
  const [cat, setCat] = useState<(typeof CATS)[number]['id']>('all');
  const unread = notifications.filter((n) => !n.read).length;
  const list = useMemo(
    () => notifications.filter((n) => cat === 'all' || n.category === cat),
    [notifications, cat],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#162235]">Notifications</h2>
          <p className="text-xs text-[#607086]">{unread} unread · action center for clinical, appointment, financial and security events.</p>
        </div>
        {unread > 0 && (
          <button type="button" onClick={markAllNotificationsRead} className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700">
            <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
          </button>
        )}
      </div>
      <div className="flex gap-1.5 overflow-x-auto">
        {CATS.map((c) => (
          <button key={c.id} type="button" onClick={() => setCat(c.id)} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold ${cat === c.id ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-white text-[#607086] ring-1 ring-[#E3E8EF]'}`}>{c.label}</button>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#E3E8EF] bg-white p-10 text-center text-xs text-slate-400">No notifications in this category.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((n) => (
            <li key={n.id} className={`rounded-2xl border bg-white p-4 shadow-soft ${n.read ? 'border-[#E3E8EF]' : 'border-emerald-200'}`}>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-emerald-700"><Bell className="h-4 w-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className={`text-sm font-extrabold ${n.read ? 'text-[#607086]' : 'text-[#162235]'}`}>{n.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ring-1 ${TONE[n.priority || 'normal']}`}>{n.priority || 'normal'}</span>
                    {n.category && <span className="text-[10px] font-bold uppercase text-[#8A97A8]">{n.category}</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-[#607086]">{n.message}</p>
                  <p className="mt-1 text-[10px] text-[#8A97A8]">{n.source || 'System'} · {n.date} {n.time || ''} {n.patientIdentifier ? `· ${n.patientIdentifier}` : ''}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {n.actionLabel && n.actionView && (
                    <button
                      type="button"
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.patientId) selectPatient(n.patientId);
                        onNavigate(n.actionView!);
                      }}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white"
                    >
                      {n.actionLabel}
                    </button>
                  )}
                  {!n.read && (
                    <button type="button" onClick={() => markNotificationRead(n.id)} className="text-[10px] font-bold text-[#8A97A8] hover:text-[#162235]">Mark read</button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
