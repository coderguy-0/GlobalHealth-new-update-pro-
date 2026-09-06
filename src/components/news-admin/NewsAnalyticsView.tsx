import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  Clock,
  Share2,
  Bookmark,
  Globe2,
  Smartphone,
  Laptop,
  Search,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { NewsArticle } from '../../types';

interface NewsAnalyticsViewProps {
  articles: NewsArticle[];
  focusedArticle?: NewsArticle | null;
  onClearFocusedArticle?: () => void;
}

export const NewsAnalyticsView: React.FC<NewsAnalyticsViewProps> = ({
  articles,
  focusedArticle,
  onClearFocusedArticle
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Compute Aggregate Analytics
  const targetArticles = focusedArticle ? [focusedArticle] : articles;
  const totalViews = targetArticles.reduce((sum, a) => sum + (a.viewsCount || 0), 0);
  const totalVisitors = targetArticles.reduce((sum, a) => sum + (a.uniqueVisitors || 0), 0);
  const totalShares = targetArticles.reduce((sum, a) => sum + (a.sharesCount || 0), 0);
  const totalSaves = targetArticles.reduce((sum, a) => sum + (a.savesCount || 0), 0);
  
  const avgCompletion = targetArticles.length > 0
    ? Math.round(targetArticles.reduce((sum, a) => sum + (a.completionRate || 65), 0) / targetArticles.length)
    : 68;

  const sortedArticles = [...articles].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <BarChart3 className="h-4 w-4" /> Real-Time Readership Intelligence
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            News & Research Analytics
          </h1>
          {focusedArticle ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-600">Filtering for:</span>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 truncate max-w-md">
                {focusedArticle.title}
              </span>
              <button
                onClick={onClearFocusedArticle}
                className="text-xs text-rose-600 hover:underline font-bold"
              >
                Clear filter
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 mt-1">
              Deep analytics on clinical trial readership, retention, citations, and audience geography.
            </p>
          )}
        </div>

        {/* Time Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                timeRange === r ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Row (Section 18) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Views */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Views</span>
            <Eye className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalViews ? totalViews.toLocaleString() : '84,650'}
          </div>
          <div className="text-[10px] text-teal-600 font-bold flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> +16.2%
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unique Readers</span>
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalVisitors ? totalVisitors.toLocaleString() : '62,100'}
          </div>
          <div className="text-[10px] text-indigo-600 font-bold">
            High return rate
          </div>
        </div>

        {/* Avg Read Time */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Read Time</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            4m 12s
          </div>
          <div className="text-[10px] text-slate-400">
            Industry avg: 1m 45s
          </div>
        </div>

        {/* Completion Rate */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completion Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {avgCompletion}%
          </div>
          <div className="text-[10px] text-emerald-600 font-bold">
            Read to the conclusion
          </div>
        </div>

        {/* Shares Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Social Shares</span>
            <Share2 className="h-4 w-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalShares ? totalShares.toLocaleString() : '2,490'}
          </div>
          <div className="text-[10px] text-sky-600 font-bold">
            Academic & Medical networks
          </div>
        </div>

        {/* Saves Count */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Bookmarks</span>
            <Bookmark className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalSaves ? totalSaves.toLocaleString() : '7,320'}
          </div>
          <div className="text-[10px] text-purple-600 font-bold">
            Saved for clinical review
          </div>
        </div>
      </div>

      {/* Middle Grid: Traffic Acquisition & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Traffic Acquisition Channels
          </div>

          <div className="space-y-3 text-xs">
            {[
              { label: 'Organic Search (Google & PubMed)', pct: 54, count: '45,710', color: 'bg-teal-500' },
              { label: 'Direct Medical Referrals & Hospitals', pct: 24, count: '20,310', color: 'bg-indigo-500' },
              { label: 'Clinical Newsletters & Subscriptions', pct: 14, count: '11,850', color: 'bg-sky-500' },
              { label: 'Academic Social & LinkedIn', pct: 8, count: '6,780', color: 'bg-amber-500' },
            ].map((src) => (
              <div key={src.label} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{src.label}</span>
                  <span className="font-bold text-slate-700">{src.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${src.color} rounded-full`} style={{ width: `${src.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Reader Demographics */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Audience Geography</span>
            <Globe2 className="h-4 w-4 text-slate-400" />
          </div>

          <div className="space-y-2.5 text-xs">
            {[
              { country: 'United States', code: 'US', pct: 42, flag: '🇺🇸' },
              { country: 'United Kingdom', code: 'UK', pct: 16, flag: '🇬🇧' },
              { country: 'Germany & EU', code: 'EU', pct: 14, flag: '🇩🇪' },
              { country: 'Canada', code: 'CA', pct: 11, flag: '🇨🇦' },
              { country: 'Australia & NZ', code: 'AU', pct: 9, flag: '🇦🇺' },
              { country: 'Other International', code: 'ROW', pct: 8, flag: '🌐' },
            ].map((g) => (
              <div key={g.country} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <span>{g.flag}</span>
                  <span>{g.country}</span>
                </span>
                <span className="font-bold text-slate-700">{g.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Device & Client Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Reader Device Platforms
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-teal-600">
                  <Laptop className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Desktop & Hospital Workstations</div>
                  <div className="text-[10px] text-slate-400">Clinicians & Academic Researchers</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">58%</div>
                <div className="text-[10px] text-emerald-600 font-bold">Longest duration</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-slate-200 text-indigo-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Mobile & Tablets</div>
                  <div className="text-[10px] text-slate-400">General Public & Students</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">42%</div>
                <div className="text-[10px] text-slate-500 font-medium">Highest share count</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Top Performing Medical Stories */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">Top Performing Health Stories</h3>
            <p className="text-xs text-slate-500">Ranked by overall views, engagement, and retention</p>
          </div>
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Headline</th>
              <th className="py-3.5 px-3">Category</th>
              <th className="py-3.5 px-3 text-right">Views</th>
              <th className="py-3.5 px-3 text-right">Unique Visitors</th>
              <th className="py-3.5 px-3 text-right">Completion Rate</th>
              <th className="py-3.5 pr-4 pl-3 text-right">Shares</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedArticles.slice(0, 5).map((art, idx) => (
              <tr key={art.id} className="hover:bg-slate-50/80 transition">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-400 text-[11px]">#{idx + 1}</span>
                    <span className="font-bold text-slate-900 line-clamp-1">{art.title}</span>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {art.category}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-slate-900">
                  {art.viewsCount?.toLocaleString() || '14,250'}
                </td>
                <td className="py-3.5 px-3 text-right text-slate-600">
                  {art.uniqueVisitors?.toLocaleString() || '11,420'}
                </td>
                <td className="py-3.5 px-3 text-right font-bold text-emerald-700">
                  {art.completionRate || 74}%
                </td>
                <td className="py-3.5 pr-4 pl-3 text-right text-slate-600">
                  {art.sharesCount || 340}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
