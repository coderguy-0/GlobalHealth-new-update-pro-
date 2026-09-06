import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Trash2,
  Filter
} from 'lucide-react';
import { NotificationItem, DoctorProfile } from '../../types/medauth';
import { sampleNotifications } from '../../data/samplePatients';

interface NotificationsViewProps {
  doctor: DoctorProfile;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ doctor }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(sampleNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>Clinical Alerts Stream</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Notifications & System Alerts
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Real-time critical lab flags, pharmacy refill requests, and State Medical Board audits.
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 cursor-pointer self-start sm:self-auto"
        >
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No active alerts or unread notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 ${
                !n.read
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                    n.type === 'CRITICAL_LAB'
                      ? 'bg-amber-600'
                      : n.type === 'PHARMACY'
                      ? 'bg-emerald-700'
                      : 'bg-slate-700'
                  }`}
                >
                  {n.type === 'CRITICAL_LAB' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : n.type === 'PHARMACY' ? (
                    <FileText className="w-4 h-4" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{n.description}</p>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                    {n.timeAgo}
                  </span>
                </div>
              </div>

              <button
                onClick={() => clearNotification(n.id)}
                className="text-slate-400 hover:text-rose-600 p-1 transition cursor-pointer"
                title="Dismiss"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
