import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Sparkles, 
  Video, 
  Check, 
  Star, 
  Share2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { CommunityEvent } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityEventsProps {
  events: CommunityEvent[];
  onToggleRsvp: (eventId: string, status: 'going' | 'interested' | 'none') => void;
  onShareEvent?: (event: CommunityEvent) => void;
}

export const CommunityEvents: React.FC<CommunityEventsProps> = ({
  events,
  onToggleRsvp,
  onShareEvent
}) => {
  const { t, formatNumber } = useLocalization();
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const [filterType, setFilterType] = useState<string>('All');

  const filteredEvents = events.filter((ev) => {
    if (filterType !== 'All' && ev.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 to-purple-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold backdrop-blur-md">
            <CalendarIcon className="h-3.5 w-3.5 text-rose-300" />
            <span>{t('Live Health & Clinical Education Calendar')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{t('Interactive Webinars & Medical Workshops')}</h2>
          <p className="text-xs sm:text-sm text-slate-200">
            {t('Join live masterclasses with world-renowned specialists, ask questions in real-time, and participate in peer wellness cohorts.')}
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-2xl backdrop-blur-md shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            📋 {t('Event Cards')}
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-white hover:bg-white/10'
            }`}
          >
            📅 {t('Monthly Schedule')}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
        {['All', 'Online Webinar', 'Live Q&A', 'Workshop', 'Peer Circle'].map((tp, idx) => (
          <button
            key={idx}
            onClick={() => setFilterType(tp)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              filterType === tp
                ? 'bg-rose-700 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t(tp)}
          </button>
        ))}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Event Cover Image */}
                <div className="relative h-44 w-full bg-slate-900">
                  <img
                    src={evt.coverImage}
                    alt={evt.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                      {evt.type}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-2 text-xs text-rose-200 font-bold mb-1">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <h3 className="text-base font-extrabold tracking-tight line-clamp-2 leading-snug">
                      {evt.title}
                    </h3>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5 space-y-4">
                  {/* Host Info */}
                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <img
                      src={evt.hostAvatar}
                      alt={evt.hostName}
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{evt.hostName}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{evt.hostSpecialty}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                      <Users className="h-4 w-4 text-violet-600" />
                      <span>{formatNumber(evt.attendeesCount)} {t('Attending')}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">{evt.duration}</span>
                  </div>
                </div>
              </div>

              {/* RSVP Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onToggleRsvp(evt.id, evt.rsvpStatus === 'going' ? 'none' : 'going')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    evt.rsvpStatus === 'going'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-rose-700 hover:bg-rose-600 text-white shadow-2xs'
                  }`}
                >
                  {evt.rsvpStatus === 'going' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{t('RSVP: Going')}</span>
                    </>
                  ) : (
                    <span>{t('RSVP Now')}</span>
                  )}
                </button>

                <button
                  onClick={() => onToggleRsvp(evt.id, evt.rsvpStatus === 'interested' ? 'none' : 'interested')}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    evt.rsvpStatus === 'interested'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={t('Interested')}
                >
                  <Star className={`h-4 w-4 ${evt.rsvpStatus === 'interested' ? 'fill-current text-amber-600' : ''}`} />
                </button>

                <button
                  onClick={() => onShareEvent?.(evt)}
                  className="p-2.5 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 transition cursor-pointer"
                  title={t('Share Event')}
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar View Schedule */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">August 2026 {t('Schedule')}</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {events.map((evt) => (
              <div key={evt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">{evt.date}</span>
                    <span className="text-xs font-semibold text-slate-500">{evt.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                  <p className="text-xs text-slate-600">{t('Hosted by')} {evt.hostName} ({evt.hostSpecialty})</p>
                </div>

                <button
                  onClick={() => onToggleRsvp(evt.id, evt.rsvpStatus === 'going' ? 'none' : 'going')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    evt.rsvpStatus === 'going'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  {evt.rsvpStatus === 'going' ? t('Attending') : t('RSVP')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
