import React, { useEffect, useState, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Info,
  ExternalLink,
  Newspaper,
  Building2,
  AlertCircle,
  Search,
  Share2,
  Bookmark,
  Flag,
  Flame,
  Award,
} from 'lucide-react';
import { NewsArticle } from '../../types';
import { newsService } from '../../services/newsService';

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

interface FullScreenNewsWorkspaceProps {
  articleId: string;
  onBack: () => void;
  onNavigateToSearch?: () => void;
  onReport?: (article: NewsArticle) => void;
}

type LoadState = 'loading' | 'ready' | 'not-found' | 'error';

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
    }
  } catch {}
  return dateStr;
}

function parseArticleBody(content: string) {
  // Split by double newlines into paragraphs, keep headings if markdown-like
  const blocks = content.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return blocks;
}

export const FullScreenNewsWorkspace: React.FC<FullScreenNewsWorkspaceProps> = ({
  articleId,
  onBack,
  onNavigateToSearch,
  onReport,
}) => {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [authorityMeta, setAuthorityMeta] = useState<AuthorityArticle | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load article - combines CMS + authority
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoadState('loading');
      try {
        // Simulate slight delay for skeleton visibility per spec (fast but not blank)
        await new Promise((r) => setTimeout(r, 180));

        // 1. Try local CMS store
        const local = newsService.getArticles().find((a) => {
          if (a.id === articleId) return true;
          if (a.slug && a.slug === articleId) return true;
          // slugified title match
          return false;
        });

        // 2. Try authority public API
        let authorityFound: AuthorityArticle | null = null;
        try {
          const res = await fetch('/api/news/public/articles');
          if (res.ok) {
            const data = await res.json();
            const list = (data.articles || []) as AuthorityArticle[];
            const match = list.find((a) => a.articleRef === articleId || a.articleRef === decodeURIComponent(articleId));
            if (match) authorityFound = match;
          }
        } catch {
          // ignore, fallback to local
        }

        if (cancelled) return;

        if (authorityFound) {
          setAuthorityMeta(authorityFound);
          const mapped: NewsArticle = {
            id: authorityFound.articleRef,
            title: authorityFound.headline,
            shortDescription: authorityFound.summary,
            source: authorityFound.sourceName,
            originalPublication: authorityFound.sourceName,
            date: authorityFound.publishedAt ? new Date(authorityFound.publishedAt).toLocaleDateString() : '',
            lastUpdated: authorityFound.updatedAt,
            category: authorityFound.category,
            summary: authorityFound.summary,
            content: authorityFound.content,
            readTime: `${Math.max(1, Math.round(authorityFound.content.length / 1000))} min read`,
            author: authorityFound.submittedBy ? authorityFound.submittedBy.name : authorityFound.publishedBy,
            status: 'published',
            visibility: 'Public',
            showMedicalDisclaimer: true,
            slug: authorityFound.articleRef,
          };
          // Only show published
          setArticle(mapped);
          setLoadState('ready');
          return;
        }

        if (local) {
          if (local.status !== 'published') {
            // Drafts must not be exposed as public
            setLoadState('not-found');
            return;
          }
          setArticle(local);
          setLoadState('ready');
          return;
        }

        // Also try getArticleById for slug fallback
        const byId = newsService.getArticleById(articleId);
        if (byId && byId.status === 'published') {
          setArticle(byId);
          setLoadState('ready');
          return;
        }

        // Try slug search across all published
        const allPublished = newsService.getPublicArticles();
        const slugMatch = allPublished.find(
          (a) => a.slug === articleId || a.id === decodeURIComponent(articleId)
        );
        if (slugMatch) {
          setArticle(slugMatch);
          setLoadState('ready');
          return;
        }

        setLoadState('not-found');
      } catch (e) {
        if (!cancelled) setLoadState('error');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [articleId, retryCount]);

  const isHealthNews = useMemo(() => {
    if (!article) return false;
    const healthCategories = [
      'Health',
      'Medical Research',
      'Public Health',
      'Healthcare',
      'Science',
      'Medicine',
      'Global Health',
      'Hospital & Healthcare',
      'Technology in Healthcare',
      'Medical Breakthrough',
      'Disease News',
      'Medicine Update',
    ];
    return (
      healthCategories.some((c) => article.category?.toLowerCase().includes(c.toLowerCase())) ||
      !!article.showMedicalDisclaimer
    );
  }, [article]);

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        {/* Minimal header skeleton */}
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-200 animate-pulse" />
              <div className="h-4 w-28 rounded bg-slate-200 animate-pulse hidden sm:block" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 rounded-xl bg-slate-100 animate-pulse" />
              <div className="h-8 w-8 rounded-xl bg-slate-100 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex-1 w-full bg-slate-50/50">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 animate-pulse">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="space-y-3">
              <div className="h-8 w-full rounded bg-slate-200" />
              <div className="h-8 w-[85%] rounded bg-slate-200" />
            </div>
            <div className="h-4 w-[90%] rounded bg-slate-100" />
            <div className="h-4 w-[70%] rounded bg-slate-100" />
            <div className="flex gap-2">
              <div className="h-5 w-24 rounded-full bg-slate-200" />
              <div className="h-5 w-24 rounded-full bg-slate-200" />
            </div>
            <div className="h-[360px] w-full rounded-3xl bg-slate-200" />
            <div className="space-y-3 pt-4">
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-[80%] rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-[60%] rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadState === 'not-found') {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back to News
            </button>
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white">
                <Newspaper className="h-4 w-4" />
              </span>
              <span className="hidden sm:block text-sm">GlobalHealth</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 border border-slate-200">
              <Newspaper className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">News Article Not Found</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                The news article you are looking for is unavailable. It may have been moved, archived, or the link is incorrect.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back to News
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadState === 'error') {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back to News
            </button>
            <div className="flex items-center gap-2 text-slate-900 font-bold">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-600 text-white">
                <Newspaper className="h-4 w-4" />
              </span>
              <span className="hidden sm:block text-sm">GlobalHealth</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-amber-50 border border-amber-200">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Unable to Load News</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                The article could not be loaded right now. Please check your connection and try again.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => setRetryCount((c) => c + 1)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition"
              >
                Retry
              </button>
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Back to News
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ready state - full article workspace
  if (!article) return null;

  const bodyBlocks = parseArticleBody(article.content);

  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      {/* GLOBALHEALTH HEADER - minimal, clean per spec section 4 */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
          {/* Left: Logo | GlobalHealth */}
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2.5 text-left group"
              aria-label="GlobalHealth Home"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm group-hover:shadow transition">
                <Newspaper className="h-4.5 w-4.5" />
              </span>
              <span className="hidden sm:block">
                <span className="block text-[15px] font-bold leading-none tracking-tight text-slate-900">
                  Global<span className="text-emerald-600">Health</span>
                </span>
                <span className="mt-0.5 block text-[9px] font-medium tracking-wide text-slate-400">
                  Universal Health Network
                </span>
              </span>
            </button>

            <div className="hidden md:flex items-center gap-1.5 pl-6 border-l border-slate-200">
              <span className="rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-white">
                News
              </span>
              <span className="text-slate-300">/</span>
              <span className="rounded-lg bg-teal-50 border border-teal-100 px-2.5 py-1 text-[11px] font-bold text-teal-800">
                {article.category}
              </span>
            </div>
          </div>

          {/* Center / navigation area - hidden on mobile, shown as category */}
          <div className="hidden lg:flex items-center gap-2 text-[13px] font-semibold text-slate-600">
            <span className="text-slate-400">Current:</span>
            <span className="text-slate-900 font-bold truncate max-w-[280px]">{article.category}</span>
          </div>

          {/* Right: Search | User controls (minimal) */}
          <div className="flex items-center gap-1.5">
            {onNavigateToSearch && (
              <button
                onClick={onNavigateToSearch}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, text: article.shortDescription || article.summary, url: window.location.href }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(window.location.href).catch(() => {});
                }
              }}
              className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* NEWS WORKSPACE - full viewport dedicated */}
      <main className="flex-1 w-full bg-white">
        {/* Back navigation - spec section 20 */}
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to News
          </button>
        </div>

        <article className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 pb-16">
          {/* Article Identity Area - spec section 5 */}
          <div className="mx-auto max-w-3xl pt-8 sm:pt-10">
            {/* Breaking badge if needed */}
            {article.isBreaking && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-600 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                <Flame className="h-3.5 w-3.5" /> Breaking News
              </div>
            )}

            {/* Category / Source / Date - spec section 3 layout */}
            <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
              <span className="inline-flex items-center rounded-full bg-teal-700 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white">
                {article.category}
              </span>
              {article.subcategory && (
                <span className="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                  {article.subcategory}
                </span>
              )}
              <span className="text-slate-400">•</span>
              <span className="font-semibold text-slate-600">{article.source}</span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="h-3 w-3" /> {formatDate(article.date)}
              </span>
            </div>

            {/* FULL NEWS HEADLINE - strongest visual */}
            <h1 className="text-[28px] sm:text-[36px] lg:text-[42px] font-black tracking-tight leading-[1.1] text-slate-900">
              {article.title}
            </h1>

            {/* Short article summary / subtitle - spec section 6 */}
            {(article.shortDescription || article.summary) && (
              <p className="mt-4 sm:mt-5 text-[16px] sm:text-[18px] leading-relaxed text-slate-600 font-medium border-l-4 border-emerald-500 pl-4 py-1">
                {article.shortDescription || article.summary}
              </p>
            )}

            {/* News Metadata - spec section 7 - horizontal arrangement */}
            <div className="mt-6 flex flex-wrap gap-4 sm:gap-6 border-y border-slate-100 py-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Published</span>
                <span className="font-semibold text-slate-800">{formatDate(article.date)}</span>
              </div>
              {article.lastUpdated && article.lastUpdated !== article.date && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Updated</span>
                  <span className="font-semibold text-slate-800">{formatDate(article.lastUpdated)}</span>
                </div>
              )}
              {authorityMeta?.updatedAt && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Updated</span>
                  <span className="font-semibold text-slate-800">{formatDate(authorityMeta.updatedAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Author</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" /> {article.author}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Source</span>
                <span className="font-semibold text-slate-800">{article.source}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</span>
                <span className="font-semibold text-slate-800">{article.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Read</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" /> {article.readTime}
                </span>
              </div>
            </div>

            {/* Medical reviewer badge */}
            {article.medicalReviewer && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-3.5 py-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">Medically Reviewed</span>
                  <span className="font-bold text-teal-900">{article.medicalReviewer}{article.medicalReviewerCredentials ? `, ${article.medicalReviewerCredentials}` : ''}</span>
                </div>
              </div>
            )}

            {/* Trust indicators */}
            {authorityMeta?.submittedBy && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs text-slate-800">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 font-extrabold">
                    Submitted by {authorityMeta.submittedBy.name}
                    {authorityMeta.submittedBy.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        <ShieldCheck className="h-3 w-3" /> Verified Authority
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500">{authorityMeta.submittedBy.orgType}</div>
                </div>
              </div>
            )}

            {authorityMeta?.correctionNotice && (
              <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div>
                  <div className="font-extrabold">Correction / Update Notice</div>
                  <p className="mt-1 leading-relaxed">{authorityMeta.correctionNotice}</p>
                </div>
              </div>
            )}
          </div>

          {/* Main News Image - spec section 8 */}
          {article.featuredImage && (
            <div className="mx-auto max-w-4xl mt-8 sm:mt-10">
              <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-slate-900 border border-slate-200 shadow-sm">
                <img
                  src={article.featuredImage}
                  alt={article.imageAlt || article.title}
                  className="w-full h-auto max-h-[560px] object-cover"
                  loading="eager"
                />
              </div>
              {/* Image Caption - spec section 9 */}
              {(article.imageCaption || article.imageAlt) && (
                <div className="mt-3 px-1 space-y-1">
                  {article.imageCaption && (
                    <p className="text-xs leading-relaxed text-slate-600">
                      <span className="font-bold text-slate-700">Caption:</span> {article.imageCaption}
                    </p>
                  )}
                  {article.source && (
                    <p className="text-[11px] text-slate-500">
                      <span className="font-bold">Image Credit:</span> {article.source} {article.originalPublication ? ` / ${article.originalPublication}` : ''}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Main Article Workspace - spec section 10 - centered reading column */}
          <div className="mx-auto max-w-3xl mt-8 sm:mt-10">
            {/* Evidence badge deck - subtle highlight */}
            {(article.evidenceStatus || article.researchType || article.studyDoi) && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl bg-slate-900 p-4 text-white text-xs">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Evidence Status</div>
                  <div className="mt-1 font-bold capitalize">{article.evidenceStatus || 'Peer-reviewed'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Research Design</div>
                  <div className="mt-1 font-bold">{article.researchType || 'Clinical Report'}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Study Citation / DOI</div>
                  <div className="mt-1 font-mono text-teal-300 font-bold truncate">{article.studyDoi || 'N/A'}</div>
                </div>
              </div>
            )}

            {/* Article Introduction - spec section 11 - first paragraph strongest */}
            <div className="prose prose-slate max-w-none">
              <div className="space-y-5 text-[15px] sm:text-[16px] leading-[1.8] text-slate-800">
                {bodyBlocks.map((block, idx) => {
                  // Detect markdown headings
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="mt-8 text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                        {block.replace(/^###\s+/, '')}
                      </h3>
                    );
                  }
                  if (block.startsWith('## ')) {
                    return (
                      <h2 key={idx} className="mt-10 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                        {block.replace(/^##\s+/, '')}
                      </h2>
                    );
                  }
                  if (block.startsWith('#### ')) {
                    return (
                      <h4 key={idx} className="mt-6 text-base font-bold text-slate-900">
                        {block.replace(/^####\s+/, '')}
                      </h4>
                    );
                  }
                  // Quote detection
                  if (block.startsWith('> ')) {
                    const quoteText = block.replace(/^>\s+/, '');
                    return (
                      <blockquote
                        key={idx}
                        className="my-6 border-l-4 border-teal-600 bg-teal-50/60 pl-4 pr-4 py-3 rounded-r-xl text-[15px] italic leading-relaxed text-slate-800"
                      >
                        {quoteText}
                      </blockquote>
                    );
                  }
                  // List detection
                  if (block.startsWith('- ') || block.startsWith('* ')) {
                    const items = block.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
                    if (items.length > 0) {
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-2">
                          {items.map((it, i) => (
                            <li key={i} className="leading-relaxed">
                              {it.replace(/^[-*]\s+/, '')}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                  }
                  // Important information highlighting - detect keywords
                  const isImportant =
                    /^(Key Development|Important Date|Important Number|Official Statement|Key Finding):/i.test(block);
                  if (isImportant) {
                    const [label, ...rest] = block.split(':');
                    return (
                      <div key={idx} className="my-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <div className="text-[11px] font-black uppercase tracking-wider text-amber-800">{label.trim()}</div>
                        <div className="mt-1 text-sm font-semibold leading-relaxed text-amber-900">
                          {rest.join(':').trim()}
                        </div>
                      </div>
                    );
                  }

                  // Normal paragraph - first paragraph larger
                  const isFirst = idx === 0;
                  return (
                    <p key={idx} className={isFirst ? 'text-[17px] sm:text-[18px] leading-relaxed font-medium text-slate-900' : ''}>
                      {block}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Source and Attribution - spec section 15 */}
            <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-xs space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">Source and Attribution</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Source</div>
                  <div className="font-semibold text-slate-800">{article.source}</div>
                </div>
                {article.originalPublication && (
                  <div>
                    <div className="text-[10px] font-bold uppercase text-slate-400">Original Publisher</div>
                    <div className="font-semibold text-slate-800">{article.originalPublication}</div>
                  </div>
                )}
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Published</div>
                  <div className="font-semibold text-slate-800">{formatDate(article.date)}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Author</div>
                  <div className="font-semibold text-slate-800">{article.author}</div>
                </div>
                {article.studyDoi && (
                  <div className="sm:col-span-2">
                    <div className="text-[10px] font-bold uppercase text-slate-400">DOI / Citation</div>
                    <div className="font-mono text-[11px] text-teal-700 font-bold">{article.studyDoi}</div>
                  </div>
                )}
              </div>
              {authorityMeta?.sourceUrl && (
                <a
                  href={authorityMeta.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  View Original Source <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {authorityMeta?.references && authorityMeta.references.length > 0 && (
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">References</div>
                  <ul className="space-y-1">
                    {authorityMeta.references.map((ref, i) => (
                      <li key={i} className="truncate">
                        <a href={ref} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-600 hover:text-slate-900 underline">
                          {ref}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Medical / Health News Notice - spec section 16 */}
            {isHealthNews && article.showMedicalDisclaimer && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
                <div className="flex items-center gap-2 font-extrabold uppercase tracking-wider">
                  <Info className="h-4 w-4 text-amber-600" /> Health Information Notice
                </div>
                <p className="mt-2 leading-relaxed">
                  {article.customDisclaimer ||
                    'This news article provides general information and does not replace advice from a qualified healthcare professional. Always consult a healthcare provider for personal medical guidance.'}
                </p>
              </div>
            )}

            {/* Connected ecosystem tags */}
            {(article.relatedDiseases?.length || article.relatedMedicines?.length || article.relatedMedicalTests?.length || article.relatedNutritionTopics?.length) && (
              <div className="mt-8 border-t border-slate-200 pt-6 space-y-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">Connected Health Ecosystem</div>
                <div className="flex flex-wrap gap-2">
                  {article.relatedDiseases?.map((d) => (
                    <span key={d} className="rounded-lg bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 text-xs font-semibold">
                      🩺 {d}
                    </span>
                  ))}
                  {article.relatedMedicines?.map((m) => (
                    <span key={m} className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 text-xs font-semibold">
                      💊 {m}
                    </span>
                  ))}
                  {article.relatedMedicalTests?.map((t) => (
                    <span key={t} className="rounded-lg bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 text-xs font-semibold">
                      🧪 {t}
                    </span>
                  ))}
                  {article.relatedNutritionTopics?.map((n) => (
                    <span key={n} className="rounded-lg bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 text-xs font-semibold">
                      🥗 {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Article Completion Area - spec section 17 */}
            <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-200 pt-8">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <div className="h-px w-12 bg-slate-200" />
                End of Article
                <div className="h-px w-12 bg-slate-200" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to News
                </button>
                {onReport && (
                  <button
                    onClick={() => onReport(article)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    <Flag className="h-4 w-4" /> Report This News
                  </button>
                )}
              </div>
              <div className="text-[11px] text-slate-400 text-center">
                Article ID: <span className="font-mono font-bold">{article.id}</span> {article.slug ? `• Slug: ${article.slug}` : ''}
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};
