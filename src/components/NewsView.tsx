import React, { useState, useMemo, useEffect } from 'react';
import {
  Newspaper,
  Clock,
  Search,
  Flame,
  ShieldCheck,
  Star,
  ChevronRight,
} from 'lucide-react';
import { newsService } from '../services/newsService';
import { NewsArticle } from '../types';
import { useLocalization } from '../context/LocalizationContext';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../services/authClient';
import { Flag, Loader2, CheckCircle2 } from 'lucide-react';

interface AuthorityArticle {
  articleRef: string;
  headline: string;
  summary: string;
  content: string;
  category: string;
  sourceName: string;
  sourceUrl: string;
  sourceDate?: string;
  references: string[];
  highRisk: boolean;
  submittedBy: { name: string; orgType: string; verified: boolean } | null;
  publishedBy: string;
  publishedAt: string;
  updatedAt?: string;
  correctionNotice?: string | null;
}

const REPORT_REASONS: { id: string; label: string }[] = [
  { id: 'incorrect_information', label: 'Incorrect information' },
  { id: 'outdated_information', label: 'Outdated information' },
  { id: 'misleading_information', label: 'Misleading information' },
  { id: 'suspicious_source', label: 'Suspicious source' },
  { id: 'fake_authority', label: 'Fake authority' },
  { id: 'incorrect_medical_claim', label: 'Incorrect medical claim' },
  { id: 'broken_source', label: 'Broken source' },
  { id: 'duplicate_article', label: 'Duplicate article' },
  { id: 'inappropriate_content', label: 'Inappropriate content' }
];

interface NewsViewProps {
  onOpenAdminCMS?: () => void;
  onOpenArticle?: (articleId: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onOpenAdminCMS, onOpenArticle }) => {
  const { t } = useLocalization();
  const { user: currentUser, requireAuth } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [authorityArticles, setAuthorityArticles] = useState<AuthorityArticle[]>([]);
  const [reportTarget, setReportTarget] = useState<NewsArticle | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [reportBusy, setReportBusy] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  // Published Verified-Authority articles (server-side, admin-published only)
  useEffect(() => {
    fetch('/api/news/public/articles')
      .then((r) => r.json())
      .then((d) => setAuthorityArticles((d.articles || []) as AuthorityArticle[]))
      .catch(() => {});
  }, []);

  // Load articles dynamically from newsService (filtered strictly to published status for public view)
  const allArticles = useMemo(() => newsService.getArticles(), []);
  // Merge: authority-published articles (from the governance engine) + CMS articles.
  const publishedArticles = useMemo(() => {
    const cms = allArticles.filter((a) => a.status === 'published');
    const fromAuthority: NewsArticle[] = authorityArticles.map((a) => ({
      id: a.articleRef,
      title: a.headline,
      shortDescription: a.summary,
      source: a.sourceName,
      date: a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : '',
      lastUpdated: a.updatedAt,
      category: a.category,
      summary: a.summary,
      content: a.content,
      readTime: `${Math.max(1, Math.round(a.content.length / 1000))} min read`,
      author: a.submittedBy ? a.submittedBy.name : a.publishedBy,
      status: 'published' as const,
      visibility: 'Public' as const,
      showMedicalDisclaimer: true,
      slug: a.articleRef,
    }));
    const seen = new Set(fromAuthority.map((a) => a.id));
    return [...fromAuthority, ...cms.filter((a) => !seen.has(a.id))];
  }, [allArticles, authorityArticles]);

  const openReport = (art: NewsArticle, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!currentUser) {
      requireAuth({ feature: 'report a news article to the editorial team' }, 'login');
      return;
    }
    setReportTarget(art);
    setReportReason('');
    setReportDetail('');
    setReportDone(false);
  };

  const submitReport = async () => {
    if (!reportTarget || !reportReason) return;
    setReportBusy(true);
    try {
      await apiFetch('/api/news/public/report', {
        method: 'POST',
        body: { articleRef: reportTarget.id, articleTitle: reportTarget.title, reason: reportReason, detail: reportDetail }
      });
      setReportDone(true);
    } catch {
      setReportDetail('');
      alert('Your report could not be submitted. Please try again.');
    } finally {
      setReportBusy(false);
    }
  };

  const categories = useMemo(() => {
    const list = Array.from(new Set(publishedArticles.map((a) => a.category)));
    return ['All', ...list];
  }, [publishedArticles]);

  const breakingNews = publishedArticles.filter((a) => a.isBreaking);
  const featuredArticle = publishedArticles.find((a) => a.isFeatured) || publishedArticles[0];

  const filteredNews = publishedArticles.filter((a) => {
    if (selectedCategory !== 'All' && a.category !== selectedCategory) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        (a.summary && a.summary.toLowerCase().includes(q)) ||
        (a.shortDescription && a.shortDescription.toLowerCase().includes(q)) ||
        a.category.toLowerCase().includes(q) ||
        (a.author && a.author.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenArticle = (art: NewsArticle) => {
    if (onOpenArticle) {
      onOpenArticle(art.slug || art.id);
    } else {
      // Fallback: update hash to #news/<id> which App will pick up
      window.location.hash = `news/${encodeURIComponent(art.slug || art.id)}`;
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen animate-in fade-in duration-200">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8">
        
        {/* Breaking News Ticker if Active - now opens full-screen workspace */}
        {breakingNews.length > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-rose-600 text-white shadow-md animate-in fade-in duration-300">
            <span className="flex items-center gap-1 bg-white text-rose-600 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 animate-pulse">
              <Flame className="h-3 w-3" /> {t('Breaking News')}
            </span>
            <div 
              onClick={() => handleOpenArticle(breakingNews[0])}
              className="text-xs sm:text-sm font-bold truncate flex-1 cursor-pointer hover:underline"
            >
              {breakingNews[0].title}
            </div>
            <span className="text-[11px] text-rose-100 hidden sm:inline-block">
              {breakingNews[0].date}
            </span>
          </div>
        )}

        {/* Header Title & Protected Admin Access */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-teal-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Newspaper className="h-4 w-4" /> {t('Global Health Intelligence & Peer-Reviewed Science')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('Health News & Clinical Research')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('Stay informed with peer-reviewed medical trial results, health technology innovations, and public health guidelines.')}
            </p>
          </div>

          {/* Action Controls & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('Search clinical news, DOI...')}
                className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs text-slate-800 shadow-2xs focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat === 'All' ? t('All') : cat}
            </button>
          ))}
        </div>

        {/* Featured Top Story Banner - opens full-screen workspace */}
        {featuredArticle && !searchTerm && selectedCategory === 'All' && (
          <div 
            onClick={() => handleOpenArticle(featuredArticle)}
            className="cursor-pointer group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:border-teal-400 transition grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-6 relative bg-slate-900 overflow-hidden min-h-[260px] lg:min-h-[340px]">
              <img
                src={featuredArticle.featuredImage || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200'}
                alt={featuredArticle.imageAlt || featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-teal-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Star className="h-3 w-3 fill-white" /> {t('Featured Breakthrough')}
                </span>
                <span className="bg-black/60 text-white px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-xs">
                  {featuredArticle.category}
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">
                  {featuredArticle.source}
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight group-hover:text-teal-700 transition">
                  {featuredArticle.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredArticle.shortDescription || featuredArticle.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{t('By')} {featuredArticle.author}</span>
                  {featuredArticle.medicalReviewer && (
                    <span className="text-teal-700 font-medium flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> {t('Reviewed by')} {featuredArticle.medicalReviewer}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-teal-700 font-bold group-hover:translate-x-0.5 transition">
                  <span>{t('Read Full Study')}</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Cards Grid - each opens full-screen workspace */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((art) => (
            <div
              key={art.id}
              onClick={() => handleOpenArticle(art)}
              className="cursor-pointer group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs hover:border-teal-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {art.featuredImage && (
                  <div className="relative h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={art.featuredImage}
                      alt={art.imageAlt || art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="rounded-md bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-slate-800 shadow-2xs">
                        {art.category}
                      </span>
                      {art.isBreaking && (
                        <span className="rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-black text-white flex items-center gap-1">
                          <Flame className="h-3 w-3" /> BREAKING
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  {!art.featuredImage && (
                    <span className="inline-block rounded-md bg-teal-50 border border-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                      {art.category}
                    </span>
                  )}

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium line-clamp-2">
                    {art.shortDescription || art.summary}
                  </p>

                  {art.studyDoi && (
                    <div className="text-[10px] font-mono text-teal-700">
                      DOI: {art.studyDoi}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                  <span className="truncate max-w-[140px]">{t('Source')}: {art.source}</span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {art.readTime}
                  </span>
                </div>
                {/* Quick report action - prevents modal, uses full-screen workspace for reading */}
                <button
                  onClick={(e) => openReport(art, e)}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white py-2 text-[11px] font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition flex items-center justify-center gap-1.5"
                >
                  <Flag className="h-3 w-3" /> Report This News
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
            <Newspaper className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-700">No news articles found</h3>
            <p className="mt-1 text-xs text-slate-500">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      {/* Report This News (regular users; server-validated, never auto-deletes) */}
      {reportTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" onClick={() => !reportBusy && setReportTarget(null)}>
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {reportDone ? (
              <>
                <div className="flex items-center gap-2 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                  <h4 className="text-lg font-extrabold">Report submitted</h4>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  Thank you. Your report on “{reportTarget.title}” has been recorded and will be reviewed by the
                  GlobalHealth editorial team. Reporting never automatically removes content.
                </p>
                <button onClick={() => setReportTarget(null)} className="mt-4 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white hover:bg-slate-800">
                  Close
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-slate-800">
                  <Flag className="h-5 w-5 text-rose-500" />
                  <h4 className="text-lg font-extrabold">Report This News</h4>
                </div>
                <p className="mt-1 text-xs text-slate-500">“{reportTarget.title}”</p>
                <div className="mt-3 max-h-52 space-y-1.5 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((r) => (
                    <label key={r.id} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${reportReason === r.id ? 'border-rose-300 bg-rose-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input type="radio" name="report-reason" className="accent-rose-600" checked={reportReason === r.id} onChange={() => setReportReason(r.id)} />
                      {r.label}
                    </label>
                  ))}
                </div>
                <textarea
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                  rows={2}
                  placeholder="Optional: add details to help the editorial team…"
                  className="w-full mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-rose-300 focus:outline-none"
                />
                <div className="mt-4 flex gap-2">
                  <button disabled={reportBusy} onClick={() => setReportTarget(null)} className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
                    Cancel
                  </button>
                  <button
                    disabled={reportBusy || !reportReason}
                    onClick={submitReport}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rose-600 py-2.5 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                  >
                    {reportBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />} Submit Report
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
