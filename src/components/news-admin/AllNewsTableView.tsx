import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Star,
  Flame,
  BarChart2,
  Archive,
  Trash2,
  Check,
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  ArrowUpDown,
  ExternalLink,
  Plus,
  RotateCcw,
  ShieldAlert,
  Send,
  XCircle
} from 'lucide-react';
import { NewsArticle, NewsStatus, NewsCategoryItem, NewsAuthorItem } from '../../types';
import { newsAuthService } from '../../services/newsAuthService';
import { useLocalization } from '../../context/LocalizationContext';

interface AllNewsTableViewProps {
  articles: NewsArticle[];
  categories: NewsCategoryItem[];
  authors: NewsAuthorItem[];
  currentFilterTab?: NewsStatus | 'all';
  onFilterTabChange: (status: NewsStatus | 'all') => void;
  onAddNew: () => void;
  onEditArticle: (article: NewsArticle) => void;
  onPreviewArticle: (article: NewsArticle) => void;
  onDuplicateArticle: (id: string) => void;
  onToggleFeature: (id: string, isFeatured: boolean) => void;
  onToggleBreaking: (id: string, isBreaking: boolean) => void;
  onArchiveArticle: (id: string) => void;
  onDeleteArticle: (id: string) => void;
  onRestoreFromTrash?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
  onPublishArticle?: (id: string) => void;
  onUnpublishArticle?: (id: string) => void;
  onBulkUpdateStatus: (ids: string[], status: NewsStatus) => void;
  onBulkUpdateCategory: (ids: string[], category: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onViewAnalytics: (article: NewsArticle) => void;
}

export const AllNewsTableView: React.FC<AllNewsTableViewProps> = ({
  articles,
  categories,
  authors,
  currentFilterTab = 'all',
  onFilterTabChange,
  onAddNew,
  onEditArticle,
  onPreviewArticle,
  onDuplicateArticle,
  onToggleFeature,
  onToggleBreaking,
  onArchiveArticle,
  onDeleteArticle,
  onRestoreFromTrash,
  onPermanentDelete,
  onPublishArticle,
  onUnpublishArticle,
  onBulkUpdateStatus,
  onBulkUpdateCategory,
  onBulkDelete,
  onViewAnalytics
}) => {
  const { t, formatNumber } = useLocalization();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>('date');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Confirmation Modals
  const [trashConfirmArticle, setTrashConfirmArticle] = useState<NewsArticle | null>(null);
  const [permanentDeleteArticle, setPermanentDeleteArticle] = useState<NewsArticle | null>(null);
  const [permanentConfirmInput, setPermanentConfirmInput] = useState('');
  const [bulkCategoryModalOpen, setBulkCategoryModalOpen] = useState(false);
  const [targetBulkCategory, setTargetBulkCategory] = useState('');
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  // Permissions Check
  const canCreate = newsAuthService.hasPermission('news.create');
  const canPublish = newsAuthService.hasPermission('news.publish');
  const canUnpublish = newsAuthService.hasPermission('news.unpublish');
  const canDelete = newsAuthService.hasPermission('news.delete');
  const canPermanentDelete = newsAuthService.hasPermission('news.permanent_delete');
  const canRestore = newsAuthService.hasPermission('news.restore');
  const canManageBreaking = newsAuthService.hasPermission('news.manage_breaking_news');
  const canManageFeatured = newsAuthService.hasPermission('news.manage_featured');
  const canViewAnalytics = newsAuthService.hasPermission('news.view_analytics');

  // Filtering
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Tab Status filter
      if (currentFilterTab === 'drafts' as any || currentFilterTab === 'draft') {
        if (art.status !== 'draft') return false;
      } else if (currentFilterTab === 'pending-review' as any) {
        if (!['pending_editor', 'pending_medical', 'changes_requested'].includes(art.status)) return false;
      } else if (currentFilterTab === 'trash') {
        if (art.status !== 'trash') return false;
      } else if (currentFilterTab === 'rejected') {
        if (art.status !== 'rejected') return false;
      } else if (currentFilterTab !== 'all') {
        if (art.status !== currentFilterTab) return false;
      } else {
        // 'all' tab does not show trash items by default
        if (art.status === 'trash') return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && art.category !== selectedCategory) {
        return false;
      }

      // Author filter
      if (selectedAuthor !== 'all' && art.author !== selectedAuthor) {
        return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(q);
        const matchesSummary = art.summary?.toLowerCase().includes(q);
        const matchesAuthor = art.author.toLowerCase().includes(q);
        const matchesSource = art.source?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary && !matchesAuthor && !matchesSource) {
          return false;
        }
      }

      return true;
    });
  }, [articles, currentFilterTab, selectedCategory, selectedAuthor, searchTerm]);

  // Sorting
  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      if (sortBy === 'views') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredArticles, sortBy]);

  // Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sortedArticles.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExecutePermanentDelete = () => {
    if (!permanentDeleteArticle || !onPermanentDelete) return;
    if (permanentConfirmInput.trim().toUpperCase() !== 'PERMANENTLY DELETE') {
      alert(t('Please type "PERMANENTLY DELETE" exactly to confirm irreversible deletion.'));
      return;
    }
    onPermanentDelete(permanentDeleteArticle.id);
    setPermanentDeleteArticle(null);
    setPermanentConfirmInput('');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {currentFilterTab === 'trash'
              ? t('Trash Bin & Content Recovery')
              : currentFilterTab === 'rejected'
              ? t('Rejected Submissions')
              : currentFilterTab === 'draft' || currentFilterTab === ('drafts' as any)
              ? t('Draft Articles')
              : currentFilterTab === 'scheduled'
              ? t('Scheduled Releases')
              : currentFilterTab === 'published'
              ? t('Published News')
              : currentFilterTab === 'archived'
              ? t('Archived News')
              : t('All News Articles')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {currentFilterTab === 'trash'
              ? t('Manage soft-deleted items. Restore them to active status or permanently purge with Administrator authorization.')
              : t('Manage editorial status, publication schedules, clinical metadata, and placement.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canCreate && currentFilterTab !== 'trash' && (
            <button
              onClick={onAddNew}
              className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t('Add New Article')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { key: 'all', label: t('All Articles'), count: articles.filter((a) => a.status !== 'trash').length },
          { key: 'published', label: t('Published'), count: articles.filter((a) => a.status === 'published').length },
          { key: 'draft', label: t('Drafts'), count: articles.filter((a) => a.status === 'draft').length },
          { key: 'scheduled', label: t('Scheduled'), count: articles.filter((a) => a.status === 'scheduled').length },
          { key: 'archived', label: t('Archived'), count: articles.filter((a) => a.status === 'archived').length },
          { key: 'rejected', label: t('Rejected'), count: articles.filter((a) => a.status === 'rejected').length },
          { key: 'trash', label: t('Trash'), count: articles.filter((a) => a.status === 'trash').length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onFilterTabChange(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition cursor-pointer ${
              currentFilterTab === tab.key
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                currentFilterTab === tab.key
                  ? 'bg-teal-100 text-teal-800 font-extrabold'
                  : 'bg-slate-100 text-slate-600 font-medium'
              }`}
            >
              {formatNumber(tab.count)}
            </span>
          </button>
        ))}
      </div>

      {/* Filters and Search Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Search headline, summary, author or source...')}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-500 focus:outline-hidden"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">{t('All Categories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Author Filter */}
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden cursor-pointer"
          >
            <option value="all">{t('All Authors')}</option>
            {authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 focus:bg-white focus:border-teal-500 focus:outline-hidden cursor-pointer"
          >
            <option value="date">{t('Sort: Date')}</option>
            <option value="views">{t('Sort: Views')}</option>
            <option value="title">{t('Sort: Title')}</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Ribbon when items selected */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs">
          <div className="font-bold text-teal-900">
            {formatNumber(selectedIds.length)} {t('articles selected')}
          </div>

          <div className="flex items-center gap-2">
            {canPublish && (
              <button
                onClick={() => onBulkUpdateStatus(selectedIds, 'published')}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition cursor-pointer"
              >
                {t('Publish Selected')}
              </button>
            )}

            {canDelete && (
              <button
                onClick={() => setBulkDeleteConfirmOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition cursor-pointer"
              >
                {t('Move to Trash')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={sortedArticles.length > 0 && selectedIds.length === sortedArticles.length}
                    onChange={handleSelectAll}
                    className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                </th>
                <th className="p-4">{t('Article & Headline')}</th>
                <th className="p-4">{t('Category')}</th>
                <th className="p-4">{t('Author & Reviewer')}</th>
                <th className="p-4">{t('Status')}</th>
                <th className="p-4">{t('Readership')}</th>
                <th className="p-4 text-right">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400 text-xs">
                    {t('No news articles found matching the selected filters.')}
                  </td>
                </tr>
              ) : (
                sortedArticles.map((article) => {
                  const isSelected = selectedIds.includes(article.id);
                  const canEditThisArticle = newsAuthService.hasPermission('news.edit', {
                    category: article.category,
                    articleId: article.id,
                    author: article.author,
                    authorId: article.authorId
                  });

                  return (
                    <tr
                      key={article.id}
                      className={`hover:bg-slate-50/80 transition ${
                        isSelected ? 'bg-teal-50/40' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectOne(article.id)}
                          className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500"
                        />
                      </td>

                      <td className="p-4 max-w-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {article.isBreaking && (
                              <span className="px-1.5 py-0.2 rounded-md bg-rose-500 text-white font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                                <Flame className="h-2.5 w-2.5" /> {t('Breaking')}
                              </span>
                            )}
                            {article.isFeatured && (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                                <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> {t('Featured')}
                              </span>
                            )}
                          </div>

                          <h3
                            onClick={() => onPreviewArticle(article)}
                            className="font-bold text-slate-900 hover:text-teal-700 cursor-pointer line-clamp-2 leading-snug"
                          >
                            {article.title}
                          </h3>

                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{article.date}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>

                          {article.status === 'rejected' && article.rejectionReason && (
                            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[10px]">
                              <strong>{t('Rejection Note')}:</strong> {article.rejectionReason}
                            </div>
                          )}

                          {article.status === 'trash' && article.deletedBy && (
                            <div className="text-[10px] text-slate-400 italic">
                              {t('Deleted by')} {article.deletedBy} ({article.deletedAt})
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                          {article.category}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="space-y-0.5 text-[11px]">
                          <span className="font-bold text-slate-800 block">{article.author}</span>
                          {article.medicalReviewer ? (
                            <span className="text-[10px] text-teal-700 font-semibold block">
                              ✓ {article.medicalReviewer}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic block">
                              {t('Pending Review')}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                            article.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : article.status === 'draft'
                              ? 'bg-slate-100 text-slate-800 border border-slate-200'
                              : article.status === 'scheduled'
                              ? 'bg-sky-50 text-sky-800 border border-sky-200'
                              : article.status === 'rejected'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : article.status === 'trash'
                              ? 'bg-slate-200 text-slate-700 border border-slate-300'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {article.status === 'published' && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
                          {article.status === 'scheduled' && <Clock className="h-3 w-3 text-sky-600" />}
                          {article.status === 'rejected' && <XCircle className="h-3 w-3 text-rose-600" />}
                          {article.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap text-slate-600 text-[11px]">
                        <div>
                          <strong className="text-slate-900">{formatNumber(article.viewsCount || 0)}</strong> {t('views')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {formatNumber(article.uniqueVisitors || 0)} {t('visitors')}
                        </div>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* Preview Action */}
                          <button
                            onClick={() => onPreviewArticle(article)}
                            title={t('Preview Article')}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>

                          {/* Normal Article Actions (Non-trash) */}
                          {article.status !== 'trash' ? (
                            <>
                              {canEditThisArticle && (
                                <button
                                  onClick={() => onEditArticle(article)}
                                  title={t('Edit Article')}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {canPublish && article.status !== 'published' && onPublishArticle && (
                                <button
                                  onClick={() => onPublishArticle(article.id)}
                                  title={t('Publish Live')}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition cursor-pointer"
                                >
                                  <Send className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {canUnpublish && article.status === 'published' && onUnpublishArticle && (
                                <button
                                  onClick={() => onUnpublishArticle(article.id)}
                                  title={t('Unpublish / Return to Draft')}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition cursor-pointer"
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {canManageFeatured && (
                                <button
                                  onClick={() => onToggleFeature(article.id, !article.isFeatured)}
                                  title={article.isFeatured ? t('Remove from Featured') : t('Mark as Featured')}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    article.isFeatured
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                                  }`}
                                >
                                  <Star className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {canManageBreaking && (
                                <button
                                  onClick={() => onToggleBreaking(article.id, !article.isBreaking)}
                                  title={article.isBreaking ? t('Disable Breaking Banner') : t('Enable Breaking Banner')}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    article.isBreaking
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-slate-100 hover:bg-slate-200 text-slate-400'
                                  }`}
                                >
                                  <Flame className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {canViewAnalytics && (
                                <button
                                  onClick={() => onViewAnalytics(article)}
                                  title={t('View Article Analytics')}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                                >
                                  <BarChart2 className="h-3.5 w-3.5" />
                                </button>
                              )}

                              {canDelete && (
                                <button
                                  onClick={() => setTrashConfirmArticle(article)}
                                  title={t('Move to Trash')}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </>
                          ) : (
                            /* Trash Bin Actions */
                            <>
                              {canRestore && onRestoreFromTrash && (
                                <button
                                  onClick={() => onRestoreFromTrash(article.id)}
                                  title={t('Restore Article to Workflow')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                  <span>{t('Restore')}</span>
                                </button>
                              )}

                              {canPermanentDelete && onPermanentDelete && (
                                <button
                                  onClick={() => setPermanentDeleteArticle(article)}
                                  title={t('Permanently Purge Article (Admin Only)')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] transition flex items-center gap-1 cursor-pointer ml-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span>{t('Purge')}</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Move to Trash Modal */}
      {trashConfirmArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-rose-600">
              <Trash2 className="h-6 w-6" />
              <h3 className="text-lg font-black text-slate-900">{t('Move Article to Trash?')}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('Are you sure you want to move')} <strong className="text-slate-900">"{trashConfirmArticle.title}"</strong> {t('to the trash bin? It will be taken down from public view immediately, but can be restored later by an authorized editor.')}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setTrashConfirmArticle(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={() => {
                  onDeleteArticle(trashConfirmArticle.id);
                  setTrashConfirmArticle(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
              >
                {t('Move to Trash')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Strict Administrator Permanent Delete Confirmation Modal */}
      {permanentDeleteArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border-2 border-rose-500">
            <div className="flex items-center gap-2.5 text-rose-600">
              <ShieldAlert className="h-7 w-7" />
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 block">
                  {t('Administrator Override Required')}
                </span>
                <h3 className="text-lg font-black text-slate-900">{t('Permanent Irreversible Deletion')}</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed">
              {t('WARNING: This action will permanently erase')} <strong className="text-slate-900">"{permanentDeleteArticle.title}"</strong> {t('along with its complete revision history, comments, and analytics snapshots. This action CANNOT be undone.')}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('Type "PERMANENTLY DELETE" to proceed:')}
              </label>
              <input
                type="text"
                value={permanentConfirmInput}
                onChange={(e) => setPermanentConfirmInput(e.target.value)}
                placeholder="PERMANENTLY DELETE"
                className="w-full rounded-xl border border-rose-300 px-3.5 py-2 text-xs font-mono text-rose-900 focus:border-rose-600 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => {
                  setPermanentDeleteArticle(null);
                  setPermanentConfirmInput('');
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={handleExecutePermanentDelete}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider transition cursor-pointer"
              >
                {t('Purge Record')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Move to Trash Modal */}
      {bulkDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2.5 text-rose-600">
              <Trash2 className="h-6 w-6" />
              <h3 className="text-lg font-black text-slate-900">{t('Move Selected to Trash?')}</h3>
            </div>
            <p className="text-xs text-slate-600">
              {t('Are you sure you want to move')} <strong className="text-slate-900">{selectedIds.length} {t('articles')}</strong> {t('to the trash bin?')}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setBulkDeleteConfirmOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                {t('Cancel')}
              </button>
              <button
                onClick={() => {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                  setBulkDeleteConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
              >
                {t('Move to Trash')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
