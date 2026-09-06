import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Send,
  FileCheck,
  Award,
  ExternalLink,
  MessageSquare,
  Sparkles,
  XCircle,
  StickyNote,
  UserPlus,
  Info
} from 'lucide-react';
import { NewsArticle, NewsReviewComment, InternalNote } from '../../types';
import { newsAuthService } from '../../services/newsAuthService';
import { useLocalization } from '../../context/LocalizationContext';

interface ReviewApprovalViewProps {
  articles: NewsArticle[];
  onApproveArticle: (id: string, comment?: string) => void;
  onRequestChanges: (id: string, comment: string) => void;
  onRejectArticle?: (id: string, reason: string) => void;
  onAddInternalNote?: (id: string, message: string) => void;
  onEditArticle: (article: NewsArticle) => void;
  onPreviewArticle: (article: NewsArticle) => void;
}

export const ReviewApprovalView: React.FC<ReviewApprovalViewProps> = ({
  articles,
  onApproveArticle,
  onRequestChanges,
  onRejectArticle,
  onAddInternalNote,
  onEditArticle,
  onPreviewArticle
}) => {
  const { t } = useLocalization();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'review' | 'internal_notes'>('review');

  const [verifiedChecklist, setVerifiedChecklist] = useState<{ [key: string]: boolean }>({
    doiVerified: true,
    methodologySound: true,
    claimsAccurate: true,
    disclaimerChecked: true
  });

  const canApprove = newsAuthService.hasPermission('news.approve');
  const canReject = newsAuthService.hasPermission('news.reject');
  const canRequestChanges = newsAuthService.hasPermission('news.request_changes');

  const queueArticles = articles.filter(
    (a) => a.status === 'pending_medical' || a.status === 'pending_editor' || a.status === 'changes_requested' || a.status === 'approved'
  );

  const selectedArticle = articles.find((a) => a.id === selectedArticleId) || queueArticles[0];

  const handleApprove = () => {
    if (!selectedArticle) return;
    onApproveArticle(selectedArticle.id, reviewNote || t('Verified against published clinical trial protocol. Approved for publication.'));
    setReviewNote('');
  };

  const handleRequestChanges = () => {
    if (!selectedArticle) return;
    if (!reviewNote.trim()) {
      alert(t('Please provide feedback notes explaining what revisions are required.'));
      return;
    }
    onRequestChanges(selectedArticle.id, reviewNote);
    setReviewNote('');
  };

  const handleConfirmReject = () => {
    if (!selectedArticle || !onRejectArticle) return;
    if (!rejectionReason.trim()) {
      alert(t('Please specify the scientific or editorial reason for rejection.'));
      return;
    }
    onRejectArticle(selectedArticle.id, rejectionReason);
    setRejectionReason('');
    setShowRejectModal(false);
  };

  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle || !internalNoteText.trim() || !onAddInternalNote) return;
    onAddInternalNote(selectedArticle.id, internalNoteText);
    setInternalNoteText('');
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
          <ShieldCheck className="h-4 w-4" /> {t('Controlled Editorial Governance')}
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('Review & Medical Approval Pipeline')}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {t('Peer-review verification pipeline: Draft → Fact/Source Check → Medical Review → Approve → Schedule → Publish.')}
        </p>
      </div>

      {/* Editorial Workflow Visual Pipeline */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
          {t('GlobalHealth 8-Stage Publication Protocol')}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2 text-center text-xs">
          {[
            { step: t('1. Create'), desc: t('Author Draft'), bg: 'bg-slate-100 text-slate-700' },
            { step: t('2. Draft'), desc: t('Writing'), bg: 'bg-amber-100 text-amber-800' },
            { step: t('3. Edit'), desc: t('Copy Review'), bg: 'bg-blue-100 text-blue-800' },
            { step: t('4. Source Check'), desc: t('DOI & Trial Check'), bg: 'bg-indigo-100 text-indigo-800' },
            { step: t('5. Medical Review'), desc: t('MD Validation'), bg: 'bg-purple-100 text-purple-800 font-bold' },
            { step: t('6. Approve'), desc: t('Certified Stamp'), bg: 'bg-teal-100 text-teal-800 font-bold' },
            { step: t('7. Schedule'), desc: t('Embargo Queue'), bg: 'bg-sky-100 text-sky-800' },
            { step: t('8. Publish'), desc: t('Public Index'), bg: 'bg-emerald-100 text-emerald-800 font-bold' },
          ].map((st) => (
            <div key={st.step} className={`p-2.5 rounded-xl ${st.bg} space-y-0.5 border border-black/5`}>
              <div className="text-[11px] font-bold truncate">{st.step}</div>
              <div className="text-[9px] opacity-75 truncate">{st.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Queue List (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{t('Awaiting Review')} ({queueArticles.length})</span>
            <span className="text-[10px] text-slate-400">{t('Select to evaluate')}</span>
          </div>

          {queueArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center bg-white space-y-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
              <div className="text-xs font-bold text-slate-800">{t('Pipeline is clear!')}</div>
              <p className="text-[11px] text-slate-500">{t('No articles currently in the review queue.')}</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {queueArticles.map((art) => {
                const isSelected = selectedArticle?.id === art.id;
                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition shadow-2xs space-y-2 cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                        {art.category}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        art.status === 'pending_medical'
                          ? 'bg-purple-100 text-purple-800'
                          : art.status === 'pending_editor'
                          ? 'bg-blue-100 text-blue-800'
                          : art.status === 'changes_requested'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {art.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                      {art.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{t('By')} {art.author}</span>
                      <span>{art.date}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Selected Article Review Details (8 Cols) */}
        {selectedArticle ? (
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">
                      {selectedArticle.category}
                    </span>
                    {selectedArticle.evidenceStatus && (
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">
                        {selectedArticle.evidenceStatus}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                    {selectedArticle.title}
                  </h2>
                  <div className="text-xs text-slate-500 flex items-center gap-3 pt-1">
                    <span>{t('Author')}: <strong className="text-slate-800">{selectedArticle.author}</strong></span>
                    <span>•</span>
                    <span>{t('Source')}: <strong className="text-slate-800">{selectedArticle.source}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPreviewArticle(selectedArticle)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    {t('Preview')}
                  </button>
                  <button
                    onClick={() => onEditArticle(selectedArticle)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                  >
                    {t('Edit Copy')}
                  </button>
                </div>
              </div>

              {/* Tab Navigation: Review vs Internal Notes */}
              <div className="flex gap-3 border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('review')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'review'
                      ? 'border-teal-600 text-teal-700'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t('Medical Verification & Decision')}</span>
                </button>
                <button
                  onClick={() => setActiveTab('internal_notes')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'internal_notes'
                      ? 'border-teal-600 text-teal-700'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <StickyNote className="h-4 w-4" />
                  <span>{t('Private Internal Notes')} ({selectedArticle.internalNotes?.length || 0})</span>
                </button>
              </div>

              {activeTab === 'review' ? (
                <div className="space-y-6">
                  {/* Article Abstract Summary */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                    <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
                      {t('Clinical Abstract / Executive Summary')}
                    </div>
                    <p className="leading-relaxed">
                      {selectedArticle.summary}
                    </p>
                  </div>

                  {/* Verification Checklist */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      {t('Clinical Rigor Verification Checklist')}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {[
                        { key: 'doiVerified', label: t('Primary DOI & Journal Protocol Confirmed') },
                        { key: 'methodologySound', label: t('Trial Methodology & Sample Size Stated') },
                        { key: 'claimsAccurate', label: t('No Unsubstantiated Health Claims') },
                        { key: 'disclaimerChecked', label: t('Standard Medical Disclaimer Attached') }
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer text-xs font-medium text-slate-800 transition"
                        >
                          <input
                            type="checkbox"
                            checked={!!verifiedChecklist[item.key]}
                            onChange={(e) =>
                              setVerifiedChecklist({
                                ...verifiedChecklist,
                                [item.key]: e.target.checked
                              })
                            }
                            className="h-4 w-4 rounded-sm text-teal-600 focus:ring-teal-500 border-slate-300"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Review Notes Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('Editorial Review Feedback / Decision Notes')}
                    </label>
                    <textarea
                      rows={3}
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder={t('Add formal reviewer feedback, required clinical clarifications, or sign-off notes...')}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Review Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      {canReject && (
                        <button
                          onClick={() => setShowRejectModal(true)}
                          className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>{t('Reject Article')}</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      {canRequestChanges && (
                        <button
                          onClick={handleRequestChanges}
                          className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span>{t('Request Revisions')}</span>
                        </button>
                      )}

                      {canApprove && (
                        <button
                          onClick={handleApprove}
                          className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold transition shadow-xs flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{t('Certify & Approve for Publication')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Internal Staff Notes */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{t('Private Editorial Communication: These internal notes are strictly confidential to editorial staff and are never displayed on the public website.')}</span>
                  </div>

                  <form onSubmit={handleAddInternalNote} className="space-y-2">
                    <textarea
                      rows={2}
                      required
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      placeholder={t('Add confidential internal note for the editorial team...')}
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-900 focus:border-teal-500 focus:outline-hidden"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{t('Add Private Note')}</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2.5 pt-2">
                    {selectedArticle.internalNotes && selectedArticle.internalNotes.length > 0 ? (
                      selectedArticle.internalNotes.map((note) => (
                        <div key={note.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900">{note.authorName} ({note.authorRole})</span>
                            <span className="text-slate-400">{note.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-700">{note.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic py-4 text-center">
                        {t('No internal notes yet on this article.')}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 flex items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            {t('Select an article from the left queue to evaluate.')}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-rose-600">
              <XCircle className="h-6 w-6" />
              <h3 className="text-lg font-black text-slate-900">{t('Reject Article Submission')}</h3>
            </div>
            <p className="text-xs text-slate-600">
              {t('Please state the reasons for rejecting')} <strong className="text-slate-900">{selectedArticle?.title}</strong>. {t('This will move the article to the Rejected tab.')}
            </p>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder={t('e.g. Failed statistical power requirements, conflicting commercial disclosures...')}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-900 focus:border-rose-500 focus:outline-hidden"
            />
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
              >
                {t('Confirm Rejection')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
