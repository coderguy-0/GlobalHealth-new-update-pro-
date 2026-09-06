import React, { useState } from 'react';
import { 
  HelpCircle, 
  Award, 
  CheckCircle2, 
  MessageSquare, 
  ArrowUp, 
  ArrowDown, 
  Bookmark, 
  Share2, 
  Eye, 
  Send, 
  Sparkles, 
  Filter, 
  Search,
  Check
} from 'lucide-react';
import { CommunityPostItem, CommunityComment } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityDiscussionsQAProps {
  posts: CommunityPostItem[];
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
  onOpenUserProfile: (username: string) => void;
  onOpenCreateQuestion: () => void;
}

export const CommunityDiscussionsQA: React.FC<CommunityDiscussionsQAProps> = ({
  posts,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onOpenUserProfile,
  onOpenCreateQuestion
}) => {
  const { t, formatNumber } = useLocalization();
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterSolved, setFilterSolved] = useState<'all' | 'solved' | 'unanswered'>('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState<Record<string, string>>({});

  const qaCategories = [
    'All',
    'Questions & Answers',
    'Clinical Insights',
    'Metabolic & Diabetes',
    'Cardiovascular & BP',
    'Nutrition & Gut Health',
    'Exam & NEET Prep',
    'Medication Guidance'
  ];

  const filteredQuestions = posts.filter(p => {
    const isQA = p.postType === 'question' || p.category.includes('Support') || p.category.includes('Research') || p.category.includes('Diabetes');
    if (!isQA) return false;
    if (activeCategory !== 'All' && !p.category.toLowerCase().includes(activeCategory.toLowerCase())) return false;
    if (filterSolved === 'solved') return p.comments.some(c => c.isBestAnswer);
    if (filterSolved === 'unanswered') return p.comments.length === 0;
    return true;
  });

  const handleAnswerSubmit = (postId: string) => {
    const text = answerInput[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setAnswerInput(prev => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Q&A Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold backdrop-blur-md">
            <HelpCircle className="h-3.5 w-3.5 text-blue-300" />
            <span>{t('Peer & Clinician Q&A Exchange')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{t('Medical Knowledge & Clinical Q&A')}</h2>
          <p className="text-xs sm:text-sm text-slate-200">
            {t('Ask medical questions, explore peer experiences, and receive evidence-supported answers verified by clinicians.')}
          </p>
        </div>

        <button
          onClick={onOpenCreateQuestion}
          className="px-6 py-3 rounded-2xl bg-white text-blue-950 font-black text-xs sm:text-sm shadow-md hover:bg-blue-50 transition cursor-pointer shrink-0"
        >
          ❓ {t('Ask a Health Question')}
        </button>
      </div>

      {/* Categories & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {qaCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: 'all', label: t('All') },
            { id: 'solved', label: t('Best Answer 🏆') },
            { id: 'unanswered', label: t('Unanswered') }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterSolved(f.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                filterSolved === f.id
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const hasBestAnswer = q.comments.some(c => c.isBestAnswer);
          const bestAnswer = q.comments.find(c => c.isBestAnswer);
          const isExpanded = expandedPostId === q.id;

          return (
            <div
              key={q.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={q.author.avatar}
                    alt={q.author.displayName}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenUserProfile(q.author.username)}
                        className="text-xs font-bold text-slate-900 hover:text-blue-700 transition cursor-pointer"
                      >
                        {q.author.displayName}
                      </button>
                      <span className="text-[10px] text-slate-400">@{q.author.username}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {q.timestamp} • <span className="font-semibold text-blue-700">{q.category}</span>
                    </div>
                  </div>
                </div>

                {hasBestAnswer && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold shadow-2xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{t('Solved / Best Answer Verified')}</span>
                  </span>
                )}
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                  {q.title || q.content.slice(0, 80)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {q.content}
                </p>
              </div>

              {/* Highlighted Best Answer Preview */}
              {bestAnswer && !isExpanded && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-white font-black text-[10px]">
                        <Award className="h-3 w-3" />
                        <span>{t('Top Verified Clinical Answer')}</span>
                      </span>
                      <span className="font-bold text-slate-900">{bestAnswer.authorName}</span>
                      {bestAnswer.authorSpecialty && (
                        <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">
                          {bestAnswer.authorSpecialty}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{bestAnswer.likes} {t('helpful votes')}</span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed line-clamp-3">
                    {bestAnswer.content}
                  </p>
                </div>
              )}

              {/* Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleLike(q.id)}
                    className="flex items-center gap-1 p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-700 transition cursor-pointer"
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span>{q.likesCount} {t('Upvotes')}</span>
                  </button>

                  <button
                    onClick={() => setExpandedPostId(isExpanded ? null : q.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                  >
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                    <span>{q.comments.length} {t('Answers')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSave(q.id)}
                    className="p-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                    title={t('Bookmark Question')}
                  >
                    <Bookmark className={`h-4 w-4 ${q.isSaved ? 'fill-current text-blue-700' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* Expanded Answers Section */}
              {isExpanded && (
                <div className="pt-4 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t('All Clinical & Peer Answers')} ({q.comments.length})
                  </h4>

                  <div className="space-y-3">
                    {q.comments.map((comm) => (
                      <div
                        key={comm.id}
                        className={`p-4 rounded-2xl border space-y-2 ${
                          comm.isBestAnswer
                            ? 'bg-amber-50/50 border-amber-200'
                            : 'bg-slate-50 border-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src={comm.authorAvatar} alt={comm.authorName} className="h-8 w-8 rounded-full object-cover" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{comm.authorName}</span>
                                {comm.isVerified && <CheckCircle2 className="h-3 w-3 text-blue-600" />}
                                {comm.authorSpecialty && (
                                  <span className="text-[10px] text-blue-700 bg-blue-50 px-1.5 rounded font-semibold">
                                    {comm.authorSpecialty}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
                            </div>
                          </div>

                          {comm.isBestAnswer && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                              🏆 {t('Best Answer')}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-700 leading-relaxed pl-10">
                          {comm.content}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Add Answer Input */}
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={3}
                      value={answerInput[q.id] || ''}
                      onChange={(e) => setAnswerInput(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder={t('Provide an evidence-based clinical answer or practical solution...')}
                      className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleAnswerSubmit(q.id)}
                        className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                      >
                        {t('Submit Answer')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
