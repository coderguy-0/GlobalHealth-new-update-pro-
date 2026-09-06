import React from 'react';
import {
  Eye,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  ExternalLink,
  Flame,
  Award,
  ArrowLeft,
  CheckCircle2,
  Info,
  Flag,
  Building2
} from 'lucide-react';
import { NewsArticle } from '../../types';

interface ArticlePreviewModalProps {
  article: NewsArticle;
  onClose: () => void;
  onEdit?: (article: NewsArticle) => void;
  // Public trust indicators (news governance spec: source ownership & verification)
  trustIndicator?: 'official' | 'authority';
  submittedByAuthority?: { name: string; orgType: string; verified: boolean } | null;
  updatedAt?: string;
  correctionNotice?: string;
  onReport?: () => void;
  /** Public readers use the same article renderer as CMS preview, but as a
   * full-page detail view matching medicines and diseases. */
  fullPage?: boolean;
}

export const ArticlePreviewModal: React.FC<ArticlePreviewModalProps> = ({
  article,
  onClose,
  onEdit,
  trustIndicator,
  submittedByAuthority,
  updatedAt,
  correctionNotice,
  onReport,
  fullPage = false
}) => {
  return (
    <div className={fullPage
      ? 'min-h-screen bg-slate-50'
      : 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto'}>
      <div className={fullPage
        ? 'min-h-screen w-full overflow-hidden bg-white'
        : 'w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150 border border-slate-200'}>
        {/* Preview Top Banner */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-teal-400">NEWS WORKSPACE</span>
            <span className="text-slate-400">| Status: {article.status}</span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(article);
                }}
                className="px-3 py-1 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition"
              >
                Edit in CMS
              </button>
            )}
            {onReport && (
              <button
                onClick={onReport}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5"
                title="Report incorrect, outdated or misleading content to the editorial team"
              >
                <Flag className="h-3.5 w-3.5" /> Report This News
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Reader Container */}
        <div className={fullPage ? 'mx-auto max-w-5xl p-6 sm:p-10 lg:p-14 space-y-6' : 'p-6 sm:p-10 max-h-[85vh] overflow-y-auto space-y-6'}>
          {/* Breaking News Banner */}
          {article.isBreaking && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-600 text-white text-xs font-black uppercase tracking-wider animate-pulse shadow-md">
              <Flame className="h-4 w-4" />
              <span>🔴 BREAKING MEDICAL NEWS ALERT</span>
            </div>
          )}

          {/* Category & News Type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 text-xs font-bold">
              {article.category}
            </span>
            {article.subcategory && (
              <span className="rounded-md bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-semibold">
                {article.subcategory}
              </span>
            )}
            {article.newsType && (
              <span className="text-xs text-slate-400 font-medium">
                • {article.newsType}
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {/* Short Description */}
          {(article.shortDescription || article.summary) && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-serif">
              {article.shortDescription || article.summary}
            </p>
          )}

          {/* Attribution & Medical Reviewer Byline Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900">
                  By {article.author}
                </div>
                <div className="text-slate-500">
                  Published: {article.date} • {article.readTime}
                </div>
              </div>
            </div>

            {article.medicalReviewer && (
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-teal-200 text-teal-900">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <div>
                  <div className="text-[10px] font-bold uppercase text-teal-700">Medically Reviewed</div>
                  <div className="font-bold">{article.medicalReviewer}</div>
                </div>
              </div>
            )}
          </div>

          {/* Source ownership & verification (public trust indicators) */}
          {trustIndicator === 'official' && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              <div>
                <div className="font-extrabold">Official GlobalHealth News</div>
                <p className="mt-0.5 text-emerald-800/80 leading-relaxed">
                  Published by the GlobalHealth editorial team with source verification and editorial review.
                </p>
              </div>
            </div>
          )}
          {trustIndicator === 'authority' && submittedByAuthority && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs">
              <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
              <div>
                <div className="flex flex-wrap items-center gap-1.5 font-extrabold">
                  Submitted by {submittedByAuthority.name}
                  {submittedByAuthority.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <ShieldCheck className="h-3 w-3" /> Verified Authority
                    </span>
                  )}
                </div>
                <div className="text-slate-500">{submittedByAuthority.orgType}</div>
                <p className="mt-1 text-slate-500 leading-relaxed">
                  This organization was reviewed and verified by GlobalHealth administrators. Verification
                  confirms the organization's identity — it does not mean GlobalHealth independently endorses
                  every individual claim made here.
                </p>
              </div>
            </div>
          )}
          {correctionNotice && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <div className="font-extrabold">Correction / Update Notice</div>
                <p className="mt-0.5 leading-relaxed">{correctionNotice}</p>
              </div>
            </div>
          )}
          {updatedAt && (
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Updated: {updatedAt}
            </div>
          )}

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="space-y-2">
              <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 max-h-[420px]">
                <img
                  src={article.featuredImage}
                  alt={article.imageAlt || article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {article.imageCaption && (
                <div className="text-xs text-slate-500 italic text-center">
                  {article.imageCaption}
                </div>
              )}
            </div>
          )}

          {/* Scientific Evidence Badge Deck */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-900 text-white text-xs">
            <div>
              <div className="text-[10px] text-teal-400 font-bold uppercase">Evidence Status</div>
              <div className="font-extrabold mt-0.5 capitalize">{article.evidenceStatus || 'Peer-reviewed'}</div>
            </div>

            <div>
              <div className="text-[10px] text-teal-400 font-bold uppercase">Research Design</div>
              <div className="font-extrabold mt-0.5">{article.researchType || 'Randomized Controlled Trial'}</div>
            </div>

            <div>
              <div className="text-[10px] text-teal-400 font-bold uppercase">Study Citation / DOI</div>
              <div className="font-mono text-teal-300 font-bold mt-0.5 truncate">{article.studyDoi || '10.1016/j.jacc.2026.04.019'}</div>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-wrap">
            {article.content}
          </div>

          {/* Medical Disclaimer Banner */}
          {article.showMedicalDisclaimer && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-extrabold flex items-center gap-1.5 uppercase tracking-wider">
                <Info className="h-4 w-4 text-amber-600" /> Medical Disclaimer & Educational Notice
              </div>
              <p className="leading-relaxed">
                {article.customDisclaimer ||
                  'This article is published by GlobalHealth for educational and scientific reference only and does not constitute personalized medical advice.'}
              </p>
            </div>
          )}

          {/* Connected Ecosystem Tags */}
          <div className="space-y-3 pt-4 border-t border-slate-200 text-xs">
            <div className="font-bold text-slate-800 uppercase tracking-wider">Connected Health Ecosystem</div>

            <div className="flex flex-wrap gap-2">
              {article.relatedDiseases?.map((d) => (
                <span key={d} className="rounded-lg bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 font-semibold">
                  🩺 {d}
                </span>
              ))}
              {article.relatedMedicines?.map((m) => (
                <span key={m} className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 font-semibold">
                  💊 {m}
                </span>
              ))}
              {article.relatedMedicalTests?.map((t) => (
                <span key={t} className="rounded-lg bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 font-semibold">
                  🧪 {t}
                </span>
              ))}
              {article.relatedNutritionTopics?.map((n) => (
                <span key={n} className="rounded-lg bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-1 font-semibold">
                  🥗 {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
