import React, { useState, useEffect } from 'react';
import {
  NewsAdminSidebar,
  NewsAdminTab
} from './news-admin/NewsAdminSidebar';
import { NewsDashboardView } from './news-admin/NewsDashboardView';
import { AllNewsTableView } from './news-admin/AllNewsTableView';
import { NewsEditorView } from './news-admin/NewsEditorView';
import { ReviewApprovalView } from './news-admin/ReviewApprovalView';
import { CategoriesManagementView } from './news-admin/CategoriesManagementView';
import { AuthorsSourcesView } from './news-admin/AuthorsSourcesView';
import { MediaLibraryView } from './news-admin/MediaLibraryView';
import { NewsAnalyticsView } from './news-admin/NewsAnalyticsView';
import { RevisionHistoryModal } from './news-admin/RevisionHistoryModal';
import { ArticlePreviewModal } from './news-admin/ArticlePreviewModal';
import { NewsSettingsView } from './news-admin/NewsSettingsView';
import { StaffPermissionsView } from './news-admin/StaffPermissionsView';
import { AuditLogsView } from './news-admin/AuditLogsView';
import { NewsAuthGuard } from './news-admin/NewsAuthGuard';
import { AuthoritySubmissionsView } from './news-admin/AuthoritySubmissionsView';
import { AuthorityVerificationView } from './news-admin/AuthorityVerificationView';
import { VerifiedAuthoritiesView } from './news-admin/VerifiedAuthoritiesView';
import { ReportedNewsView } from './news-admin/ReportedNewsView';
import { AdminProfileSecurityView } from './news-admin/AdminProfileSecurityView';
import { newsService } from '../services/newsService';
import { newsAuthService } from '../services/newsAuthService';
import {
  NewsArticle,
  NewsCategoryItem,
  NewsAuthorItem,
  NewsSourceItem,
  NewsMediaItem,
  NewsStatus,
  StaffMember
} from '../types';
import { Globe, ArrowLeft, ExternalLink, ShieldCheck, RotateCcw, X } from 'lucide-react';
import { useLocalization } from '../context/LocalizationContext';

interface NewsManagementCMSProps {
  onBackToPublicNews?: () => void;
}

export const NewsManagementCMS: React.FC<NewsManagementCMSProps> = ({
  onBackToPublicNews
}) => {
  const { t } = useLocalization();

  // Authentication State
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(() =>
    newsAuthService.getCurrentStaffUser()
  );

  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<NewsAdminTab>('dashboard');
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Modals
  const [previewArticle, setPreviewArticle] = useState<NewsArticle | null>(null);
  const [revisionArticle, setRevisionArticle] = useState<NewsArticle | null>(null);

  // Global Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [analyticsFocusedArticle, setAnalyticsFocusedArticle] = useState<NewsArticle | null>(null);

  // Data States
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategoryItem[]>([]);
  const [authors, setAuthors] = useState<NewsAuthorItem[]>([]);
  const [sources, setSources] = useState<NewsSourceItem[]>([]);
  const [media, setMedia] = useState<NewsMediaItem[]>([]);

  // Load data on mount & refresh
  const refreshData = () => {
    setCurrentStaff(newsAuthService.getCurrentStaffUser());
    setArticles(newsService.getArticles());
    setCategories(newsService.getCategories());
    setAuthors(newsService.getAuthors());
    setSources(newsService.getSources());
    setMedia(newsService.getMedia());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const analytics = newsService.getAnalytics();

  // Sidebar Counts
  const counts = {
    total: articles.filter((a) => a.status !== 'trash').length,
    drafts: articles.filter((a) => a.status === 'draft').length,
    pendingReview: articles.filter((a) => ['pending_editor', 'pending_medical', 'changes_requested'].includes(a.status)).length,
    scheduled: articles.filter((a) => a.status === 'scheduled').length,
    published: articles.filter((a) => a.status === 'published').length,
    archived: articles.filter((a) => a.status === 'archived').length,
    rejected: articles.filter((a) => a.status === 'rejected').length,
    trash: articles.filter((a) => a.status === 'trash').length,
  };

  // Auth Handlers
  const handleAuthSuccess = (staff: StaffMember) => {
    setCurrentStaff(staff);
    refreshData();
  };

  const handleLogout = () => {
    newsAuthService.logout();
    setCurrentStaff(null);
  };

  // Handlers for Articles
  const handleAddNew = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
  };

  const handleEditArticle = (article: NewsArticle) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const handleSaveArticle = (articleData: Partial<NewsArticle>, isPublishing = false) => {
    try {
      if (editingArticle?.id) {
        newsService.updateArticle(
          editingArticle.id, 
          articleData, 
          currentStaff?.name || 'Staff Editor', 
          isPublishing ? 'Published article live' : 'Edited article content'
        );
      } else {
        newsService.createArticle(articleData as any);
      }
      refreshData();
      setIsEditorOpen(false);
      setEditingArticle(null);
    } catch (err: any) {
      alert(err.message || 'Operation failed due to permission constraints.');
    }
  };

  const handleDuplicateArticle = (id: string) => {
    try {
      newsService.duplicateArticle(id);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleFeature = (id: string, isFeatured: boolean) => {
    try {
      newsService.updateArticle(id, { isFeatured }, currentStaff?.name || 'Admin', `Feature status set to ${isFeatured}`);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleBreaking = (id: string, isBreaking: boolean) => {
    try {
      newsService.setBreakingNews(id, isBreaking);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleArchiveArticle = (id: string) => {
    try {
      newsService.updateArticle(id, { status: 'archived' }, currentStaff?.name || 'Admin', 'Archived article');
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteArticle = (id: string) => {
    try {
      newsService.moveToTrash(id);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRestoreFromTrash = (id: string) => {
    try {
      newsService.restoreFromTrash(id);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePermanentDelete = (id: string) => {
    try {
      newsService.permanentDelete(id);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePublishArticle = (id: string) => {
    try {
      newsService.publishArticle(id);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUnpublishArticle = (id: string) => {
    try {
      newsService.unpublishArticle(id);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApproveArticle = (id: string, comment?: string) => {
    try {
      newsService.approveArticle(id, comment);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRejectArticle = (id: string, reason: string) => {
    try {
      newsService.rejectArticle(id, reason);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRequestChanges = (id: string, comment: string) => {
    try {
      newsService.requestChanges(id, comment);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddInternalNote = (articleId: string, message: string) => {
    try {
      newsService.addInternalNote(articleId, message);
      refreshData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRestoreRevision = (version: number) => {
    if (revisionArticle) {
      try {
        newsService.restoreRevision(revisionArticle.id, version);
        refreshData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleResetData = () => {
    try {
      if (window.confirm(t('Reset the news database to verified initial clinical research articles?'))) {
        newsService.resetToInitialData();
        refreshData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(articles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `globalhealth_news_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = () => {
    const jsonInput = prompt(t('Paste GlobalHealth News JSON array to import:'));
    if (!jsonInput) return;
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        newsService.saveArticles(parsed);
        refreshData();
        alert(t(`Successfully imported ${parsed.length} news articles.`));
      }
    } catch (e) {
      alert(t('Invalid JSON format.'));
    }
  };

  // If unauthenticated or no valid staff session exists, render strict Auth Guard
  if (!currentStaff) {
    return (
      <NewsAuthGuard
        onSuccess={handleAuthSuccess}
        onBackToPublic={onBackToPublicNews || (() => {})}
      />
    );
  }

  // If Editor View is active, render full-screen 2-column CMS
  if (isEditorOpen) {
    return (
      <NewsEditorView
        initialArticle={editingArticle}
        categories={categories}
        authors={authors}
        sources={sources}
        mediaLibrary={media}
        onSave={handleSaveArticle}
        onCancel={() => {
          setIsEditorOpen(false);
          setEditingArticle(null);
        }}
        onPreview={(art) => setPreviewArticle(art)}
        onOpenMediaLibraryModal={() => setCurrentTab('media')}
        onOpenRevisionsModal={(art) => setRevisionArticle(art)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans animate-in fade-in duration-200">
      {/* Sidebar Navigation */}
      <NewsAdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'add-news') {
            handleAddNew();
          } else {
            setCurrentTab(tab);
          }
        }}
        counts={counts}
        onAddNew={handleAddNew}
        currentStaff={currentStaff}
        onLogout={handleLogout}
      />

      {/* Main CMS View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Ribbon */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t('Administration Portal')}
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-black text-slate-900 capitalize">
              {t(currentTab.replace('-', ' '))}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 text-xs font-bold shadow-2xs"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
              <span>{t('Role')}: {currentStaff.role.replace('_', ' ')}</span>
            </div>

            {onBackToPublicNews && (
              <button
                onClick={onBackToPublicNews}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs cursor-pointer"
              >
                <Globe className="h-3.5 w-3.5 text-teal-600" />
                <span>{t('View Public News Site')}</span>
                <ExternalLink className="h-3 w-3 text-slate-400 ml-0.5" />
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <NewsDashboardView
              articles={articles}
              analytics={analytics}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onAddNew={handleAddNew}
              onEditArticle={handleEditArticle}
              onPreviewArticle={(art) => setPreviewArticle(art)}
              onResetData={handleResetData}
              onImportDemo={handleImportJson}
            />
          )}

          {(currentTab === 'all-news' ||
            currentTab === 'drafts' ||
            currentTab === 'scheduled' ||
            currentTab === 'published' ||
            currentTab === 'archived' ||
            currentTab === 'rejected' ||
            currentTab === 'trash') && (
            <AllNewsTableView
              articles={articles}
              categories={categories}
              authors={authors}
              currentFilterTab={currentTab === 'all-news' ? 'all' : (currentTab as any)}
              onFilterTabChange={(status) => {
                if (status === 'all') setCurrentTab('all-news');
                else if (status === 'draft') setCurrentTab('drafts');
                else if (status === 'scheduled') setCurrentTab('scheduled');
                else if (status === 'published') setCurrentTab('published');
                else if (status === 'archived') setCurrentTab('archived');
                else if (status === 'rejected') setCurrentTab('rejected');
                else if (status === 'trash') setCurrentTab('trash');
                else setCurrentTab('all-news');
              }}
              onAddNew={handleAddNew}
              onEditArticle={handleEditArticle}
              onPreviewArticle={(art) => setPreviewArticle(art)}
              onDuplicateArticle={handleDuplicateArticle}
              onToggleFeature={handleToggleFeature}
              onToggleBreaking={handleToggleBreaking}
              onArchiveArticle={handleArchiveArticle}
              onDeleteArticle={handleDeleteArticle}
              onRestoreFromTrash={handleRestoreFromTrash}
              onPermanentDelete={handlePermanentDelete}
              onPublishArticle={handlePublishArticle}
              onUnpublishArticle={handleUnpublishArticle}
              onBulkUpdateStatus={(ids, status) => {
                try {
                  newsService.bulkUpdateStatus(ids, status);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
              onBulkUpdateCategory={(ids, cat) => {
                try {
                  newsService.bulkUpdateCategory(ids, cat);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
              onBulkDelete={(ids) => {
                try {
                  newsService.bulkTrash(ids);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
              onViewAnalytics={(art) => {
                setAnalyticsFocusedArticle(art);
                setCurrentTab('analytics');
              }}
            />
          )}

          {currentTab === 'pending-review' && (
            <ReviewApprovalView
              articles={articles}
              onApproveArticle={handleApproveArticle}
              onRequestChanges={handleRequestChanges}
              onRejectArticle={handleRejectArticle}
              onAddInternalNote={handleAddInternalNote}
              onEditArticle={handleEditArticle}
              onPreviewArticle={(art) => setPreviewArticle(art)}
            />
          )}

          {currentTab === 'staff' && (
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
              <StaffPermissionsView
                currentStaff={currentStaff}
                onRefreshStaff={refreshData}
              />
            </div>
          )}

          {currentTab === 'audit-logs' && (
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
              <AuditLogsView />
            </div>
          )}

          {currentTab === 'categories' && (
            <CategoriesManagementView
              categories={categories}
              onCreateCategory={(cat) => {
                try {
                  newsService.createCategory(cat);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
              onUpdateCategory={(id, upd) => {
                try {
                  newsService.updateCategory(id, upd);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
              onDeleteCategory={(id, reassignTo) => {
                try {
                  newsService.deleteCategory(id, reassignTo);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
            />
          )}

          {(currentTab === 'authors' || currentTab === 'sources') && (
            <AuthorsSourcesView
              authors={authors}
              sources={sources}
              defaultTab={currentTab === 'sources' ? 'sources' : 'authors'}
              onCreateAuthor={(auth) => {
                try {
                  newsService.createAuthor(auth);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
              onCreateSource={(src) => {
                try {
                  newsService.createSource(src);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
            />
          )}

          {currentTab === 'media' && (
            <MediaLibraryView
              media={media}
              onUploadMedia={(item) => {
                try {
                  newsService.createMediaItem(item);
                  refreshData();
                } catch (err: any) {
                  alert(err.message);
                }
              }}
            />
          )}

          {currentTab === 'analytics' && (
            <NewsAnalyticsView
              articles={articles}
              focusedArticle={analyticsFocusedArticle}
              onClearFocusedArticle={() => setAnalyticsFocusedArticle(null)}
            />
          )}

          {currentTab === 'settings' && (
            <NewsSettingsView
              onResetAllData={handleResetData}
              onExportJson={handleExportJson}
              onImportJson={handleImportJson}
            />
          )}

          {/* Verified Authority Governance — backed by the server-side
              News Governance Engine (server-enforced authorization). */}
          {currentTab === 'authority-submissions' && <AuthoritySubmissionsView />}
          {currentTab === 'authority-verification' && <AuthorityVerificationView />}
          {currentTab === 'verified-authorities' && <VerifiedAuthoritiesView />}
          {currentTab === 'reported-news' && <ReportedNewsView />}

          {/* Signed-in administrator's own profile & security */}
          {currentTab === 'profile-security' && <AdminProfileSecurityView />}
        </main>
      </div>

      {/* Preview Modal */}
      {previewArticle && (
        <ArticlePreviewModal
          article={previewArticle}
          onClose={() => setPreviewArticle(null)}
          onEdit={(art) => {
            setPreviewArticle(null);
            handleEditArticle(art);
          }}
        />
      )}

      {/* Revisions History Modal */}
      {revisionArticle && (
        <RevisionHistoryModal
          article={revisionArticle}
          onRestoreRevision={handleRestoreRevision}
          onClose={() => setRevisionArticle(null)}
        />
      )}
    </div>
  );
};
