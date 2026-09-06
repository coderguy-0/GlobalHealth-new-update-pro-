import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Video,
  ShieldCheck,
  Search,
  ExternalLink,
  Flame,
  Star,
  Layers,
  History,
  Info,
  Calendar,
  Trash2,
  Upload,
  Check
} from 'lucide-react';
import {
  NewsArticle,
  NewsStatus,
  NewsType,
  NewsEvidenceStatus,
  NewsEvidenceLevel,
  NewsCategoryItem,
  NewsAuthorItem,
  NewsSourceItem,
  NewsMediaItem
} from '../../types';

interface NewsEditorViewProps {
  initialArticle?: NewsArticle | null;
  categories: NewsCategoryItem[];
  authors: NewsAuthorItem[];
  sources: NewsSourceItem[];
  mediaLibrary: NewsMediaItem[];
  onSave: (articleData: Partial<NewsArticle>, isPublishing?: boolean) => void;
  onCancel: () => void;
  onPreview: (articleData: NewsArticle) => void;
  onOpenMediaLibraryModal: () => void;
  onOpenRevisionsModal: (article: NewsArticle) => void;
}

const NEWS_TYPES: NewsType[] = [
  'Medical Breakthrough',
  'Research Update',
  'Disease News',
  'Medicine Update',
  'Drug Safety',
  'Nutrition News',
  'Public Health',
  'Health Technology',
  'Medical Device',
  'Vaccination',
  'Wellness',
  'Global Health',
  'Healthcare Policy'
];

const RESEARCH_TYPES = [
  'Randomized Controlled Trial',
  'Prospective Cohort Study',
  'Systematic Review & Meta-Analysis',
  'Clinical Practice Guideline',
  'Case-Control Study',
  'Observational Study',
  'Pre-Clinical Laboratory Study'
];

export const NewsEditorView: React.FC<NewsEditorViewProps> = ({
  initialArticle,
  categories,
  authors,
  sources,
  mediaLibrary,
  onSave,
  onCancel,
  onPreview,
  onOpenMediaLibraryModal,
  onOpenRevisionsModal
}) => {
  const isEditMode = !!initialArticle?.id;

  // Form State
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [shortDescription, setShortDescription] = useState(initialArticle?.shortDescription || initialArticle?.summary || '');
  const [category, setCategory] = useState(initialArticle?.category || categories[0]?.name || 'Medical Breakthroughs');
  const [subcategory, setSubcategory] = useState(initialArticle?.subcategory || '');
  const [newsType, setNewsType] = useState<NewsType>(initialArticle?.newsType || 'Medical Breakthrough');
  const [content, setContent] = useState(initialArticle?.content || '');

  // Media
  const [featuredImage, setFeaturedImage] = useState(initialArticle?.featuredImage || '');
  const [imageAlt, setImageAlt] = useState(initialArticle?.imageAlt || '');
  const [imageCaption, setImageCaption] = useState(initialArticle?.imageCaption || '');
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Metadata
  const [author, setAuthor] = useState(initialArticle?.author || authors[0]?.name || 'GlobalHealth Editorial Board');
  const [medicalReviewer, setMedicalReviewer] = useState(initialArticle?.medicalReviewer || authors[1]?.name || 'Dr. Elena Rostova');
  const [source, setSource] = useState(initialArticle?.source || sources[0]?.name || 'New England Journal of Medicine (NEJM)');
  const [originalPublication, setOriginalPublication] = useState(initialArticle?.originalPublication || '');
  const [publicationDate, setPublicationDate] = useState(initialArticle?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
  const [readTimeMinutes, setReadTimeMinutes] = useState(initialArticle?.readTimeMinutes || 4);

  // Evidence
  const [evidenceStatus, setEvidenceStatus] = useState<NewsEvidenceStatus>(initialArticle?.evidenceStatus || 'peer-reviewed');
  const [evidenceLevel, setEvidenceLevel] = useState<NewsEvidenceLevel>(initialArticle?.evidenceLevel || 'High');
  const [researchType, setResearchType] = useState(initialArticle?.researchType || 'Randomized Controlled Trial');
  const [studyDoi, setStudyDoi] = useState(initialArticle?.studyDoi || '');
  const [clinicalTrialId, setClinicalTrialId] = useState(initialArticle?.clinicalTrialId || '');

  // Disclaimer
  const [showMedicalDisclaimer, setShowMedicalDisclaimer] = useState(initialArticle?.showMedicalDisclaimer ?? true);
  const [customDisclaimer, setCustomDisclaimer] = useState(
    initialArticle?.customDisclaimer ||
      'This article is synthesized from peer-reviewed clinical research and does not replace personalized medical advice from a certified physician.'
  );

  // SEO
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialArticle?.metaDescription || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [focusKeywords, setFocusKeywords] = useState<string>(
    initialArticle?.focusKeywords ? initialArticle.focusKeywords.join(', ') : 'cardiovascular, clinical trial, medical research'
  );
  const [canonicalUrl, setCanonicalUrl] = useState(initialArticle?.canonicalUrl || '');

  // Related Content
  const [relatedDiseases, setRelatedDiseases] = useState<string>(
    initialArticle?.relatedDiseases ? initialArticle.relatedDiseases.join(', ') : 'Stroke, Hypertension, Atherosclerosis'
  );
  const [relatedMedicines, setRelatedMedicines] = useState<string>(
    initialArticle?.relatedMedicines ? initialArticle.relatedMedicines.join(', ') : 'Atorvastatin, Aspirin'
  );
  const [relatedMedicalTests, setRelatedMedicalTests] = useState<string>(
    initialArticle?.relatedMedicalTests ? initialArticle.relatedMedicalTests.join(', ') : 'Lipid Panel, ApoB, hs-CRP'
  );
  const [relatedNutritionTopics, setRelatedNutritionTopics] = useState<string>(
    initialArticle?.relatedNutritionTopics ? initialArticle.relatedNutritionTopics.join(', ') : 'Mediterranean Diet, Omega-3'
  );

  // Publishing Controls (Right Column)
  const [status, setStatus] = useState<NewsStatus>(initialArticle?.status || 'draft');
  const [visibility, setVisibility] = useState<'Public' | 'Medical Professionals Only' | 'Internal Draft'>(
    initialArticle?.visibility === 'Medical Professionals Only' || initialArticle?.visibility === 'Internal Draft'
      ? initialArticle.visibility
      : 'Public'
  );
  const [publishTiming, setPublishTiming] = useState<'immediate' | 'scheduled'>(initialArticle?.publishTiming || 'immediate');
  const [scheduledDate, setScheduledDate] = useState(initialArticle?.scheduledDate || '2026-08-18');
  const [scheduledTime, setScheduledTime] = useState(initialArticle?.scheduledTime || '09:00 AM');
  const [timezone, setTimezone] = useState(initialArticle?.timezone || 'America/New_York (EST)');

  // Placement Directives
  const [isFeatured, setIsFeatured] = useState(initialArticle?.isFeatured || false);
  const [featurePriority, setFeaturePriority] = useState(initialArticle?.featurePriority || 1);
  const [featuredUntil, setFeaturedUntil] = useState(initialArticle?.featuredUntil || '2026-09-01');

  const [isBreaking, setIsBreaking] = useState(initialArticle?.isBreaking || false);
  const [breakingExpires, setBreakingExpires] = useState(initialArticle?.breakingExpires || '2026-08-18T23:59:59Z');
  const [isTrending, setIsTrending] = useState(initialArticle?.isTrending || false);

  // Review Feedback input
  const [reviewerNotes, setReviewerNotes] = useState('');

  // Auto-slug and SEO defaults generator
  useEffect(() => {
    if (!isEditMode && title && !slug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      setSeoTitle(`${title} | GlobalHealth Research`);
    }
  }, [title, isEditMode, slug]);

  // Auto calculate reading time based on content
  useEffect(() => {
    if (content) {
      const wordCount = content.trim().split(/\s+/).length;
      const mins = Math.max(1, Math.ceil(wordCount / 200));
      setReadTimeMinutes(mins);
    }
  }, [content]);

  // Current category subcategories
  const currentCategoryObj = categories.find((c) => c.name === category);

  // Content formatting toolbar helper
  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'Sample text';
    const newText = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
    setContent(newText);
  };

  const handleSaveAction = (newStatus?: NewsStatus) => {
    if (!title.trim()) {
      alert('Please enter a headline before saving.');
      return;
    }

    const payload: Partial<NewsArticle> = {
      title,
      shortDescription,
      summary: shortDescription || title,
      category,
      subcategory,
      newsType,
      content,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200',
      imageAlt,
      imageCaption,
      author,
      medicalReviewer,
      source,
      originalPublication,
      date: publicationDate,
      readTime: `${readTimeMinutes} min read`,
      readTimeMinutes,
      evidenceStatus,
      evidenceLevel,
      researchType,
      studyDoi,
      clinicalTrialId,
      showMedicalDisclaimer,
      customDisclaimer,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || shortDescription,
      slug: slug || 'article',
      focusKeywords: focusKeywords.split(',').map((s) => s.trim()).filter(Boolean),
      canonicalUrl,
      relatedDiseases: relatedDiseases.split(',').map((s) => s.trim()).filter(Boolean),
      relatedMedicines: relatedMedicines.split(',').map((s) => s.trim()).filter(Boolean),
      relatedMedicalTests: relatedMedicalTests.split(',').map((s) => s.trim()).filter(Boolean),
      relatedNutritionTopics: relatedNutritionTopics.split(',').map((s) => s.trim()).filter(Boolean),
      status: newStatus || status,
      visibility,
      publishTiming,
      scheduledDate,
      scheduledTime,
      timezone,
      isFeatured,
      featurePriority,
      featuredUntil,
      isBreaking,
      breakingExpires,
      isTrending
    };

    onSave(payload, newStatus === 'published');
  };

  const handlePreviewTrigger = () => {
    const previewData: NewsArticle = {
      id: initialArticle?.id || 'preview-temp',
      title,
      shortDescription,
      summary: shortDescription || title,
      category,
      subcategory,
      newsType,
      content,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=1200',
      imageAlt,
      imageCaption,
      author,
      medicalReviewer,
      source,
      originalPublication,
      date: publicationDate,
      readTime: `${readTimeMinutes} min read`,
      readTimeMinutes,
      evidenceStatus,
      evidenceLevel,
      researchType,
      studyDoi,
      clinicalTrialId,
      showMedicalDisclaimer,
      customDisclaimer,
      seoTitle,
      metaDescription,
      slug,
      focusKeywords: focusKeywords.split(',').map((s) => s.trim()).filter(Boolean),
      relatedDiseases: relatedDiseases.split(',').map((s) => s.trim()).filter(Boolean),
      relatedMedicines: relatedMedicines.split(',').map((s) => s.trim()).filter(Boolean),
      relatedMedicalTests: relatedMedicalTests.split(',').map((s) => s.trim()).filter(Boolean),
      relatedNutritionTopics: relatedNutritionTopics.split(',').map((s) => s.trim()).filter(Boolean),
      status,
      visibility,
      isFeatured,
      featurePriority,
      isBreaking,
      isTrending
    };

    onPreview(previewData);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Fixed Sticky Action Header (Section 23 Contract) */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 lg:px-8 py-3.5 shadow-2xs">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Back button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
              title="Back to News Management"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  {isEditMode ? 'Edit News Article' : 'Add New News'}
                </span>
                {isEditMode && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Status: {status}
                  </span>
                )}
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 truncate max-w-md">
                {title || 'Untitled Article'}
              </h1>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSaveAction('draft')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5 text-slate-500" />
              <span>Save Draft</span>
            </button>

            <button
              onClick={handlePreviewTrigger}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
            >
              <Eye className="h-3.5 w-3.5 text-slate-500" />
              <span>Preview</span>
            </button>

            <button
              onClick={() => handleSaveAction('pending_medical')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Submit for Review</span>
            </button>

            <button
              onClick={() => handleSaveAction('published')}
              className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isEditMode ? 'Save & Publish' : 'Publish Article'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Two-Column CMS Layout (Section 23) */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: ARTICLE CONTENT & SCIENTIFIC METADATA (8 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-8 space-y-6">

            {/* 1. Basic Information Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" /> Basic Information
                </h2>
                <span className="text-[10px] text-slate-400 font-medium">* Required medical journalism fields</span>
              </div>

              {/* Headline */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex justify-between">
                  <span>Headline *</span>
                  <span className="text-[10px] text-slate-400">{title.length} / 120 chars</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Breakthrough Study Confirms Mediterranean-DASH Diet Reduces Stroke Risk by 28%"
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800 flex justify-between">
                  <span>Short Description *</span>
                  <span className="text-[10px] text-slate-400">{shortDescription.length} / 250 chars</span>
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A clear 1-2 sentence executive summary of the clinical finding or policy announcement..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              {/* Category, Subcategory, News Type Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Category */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const matched = categories.find((c) => c.name === e.target.value);
                      if (matched?.subcategories?.[0]) {
                        setSubcategory(matched.subcategories[0]);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Subcategory</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="">General</option>
                    {currentCategoryObj?.subcategories?.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* News Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">News Type *</label>
                  <select
                    value={newsType}
                    onChange={(e) => setNewsType(e.target.value as NewsType)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  >
                    {NEWS_TYPES.map((nt) => (
                      <option key={nt} value={nt}>{nt}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 2. Rich Content Editor (Section 4) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" /> Article Content & Clinical Synthesis
                </h2>
                <span className="text-[10px] text-slate-400 font-medium">
                  {content.trim().split(/\s+/).filter(Boolean).length} words • {readTimeMinutes} min read
                </span>
              </div>

              {/* Rich Text Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  title="Bold"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition font-bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  title="Italic"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('<u>', '</u>')}
                  title="Underline"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition underline"
                >
                  <UnderlineIcon className="h-3.5 w-3.5" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('\n# ', '\n')}
                  title="Heading 1"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <Heading1 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n## ', '\n')}
                  title="Heading 2"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <Heading2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n### ', '\n')}
                  title="Heading 3"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <Heading3 className="h-3.5 w-3.5" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('\n- ')}
                  title="Bullet List"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n1. ')}
                  title="Numbered List"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n> ', '\n')}
                  title="Blockquote / Investigator Quote"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <Quote className="h-3.5 w-3.5" />
                </button>

                <div className="h-4 w-px bg-slate-200 mx-1" />

                <button
                  type="button"
                  onClick={() => insertFormatting('[Link Text](https://', ')')}
                  title="Insert Hyperlink"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  title="Insert Image from Media Library"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n| Parameter | Cohort A | Cohort B |\n|---|---|---|\n| p-value | <0.001 | 0.04 |\n')}
                  title="Insert Table"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-slate-900 transition"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('\n> 🔬 **Clinical Evidence Note**:\n> ')}
                  title="Clinical Evidence Callout"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-teal-700 transition"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Textarea */}
              <textarea
                id="article-content-textarea"
                rows={14}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your comprehensive medical article here with headings, clinical trial statistics, hazard ratios, and mechanism explanations..."
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-xs sm:text-sm font-sans text-slate-900 leading-relaxed placeholder:text-slate-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-hidden font-mono"
              />
            </div>

            {/* 3. Featured Image (Section 5) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" /> Featured Image
                </h2>
                <button
                  type="button"
                  onClick={() => setShowImagePicker(true)}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
                >
                  <ImageIcon className="h-3.5 w-3.5" /> Choose from Media Library
                </button>
              </div>

              {featuredImage ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-64 group">
                    <img
                      src={featuredImage}
                      alt={imageAlt || 'Featured medical news'}
                      className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setFeaturedImage('')}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition"
                      title="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Image Alt Text *</label>
                      <input
                        type="text"
                        value={imageAlt}
                        onChange={(e) => setImageAlt(e.target.value)}
                        placeholder="Accessible description of image"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">Image Caption</label>
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="Attribution / scientific caption"
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setShowImagePicker(true)}
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 hover:border-teal-500 p-8 text-center bg-slate-50/50 hover:bg-teal-50/30 transition space-y-2"
                >
                  <div className="h-10 w-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">Upload or Select Image from Media Library</div>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                    Supports high-resolution medical photography, diagrams, and microscopy (16:9 ratio recommended).
                  </p>
                </div>
              )}
            </div>

            {/* 4. Article Metadata (Section 6) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-500" /> Article Metadata & Attribution
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Author */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Author *</label>
                  <select
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.name}>{a.name} ({a.role})</option>
                    ))}
                  </select>
                </div>

                {/* Medical Reviewer */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Medical Reviewer (MD/PhD)</label>
                  <select
                    value={medicalReviewer}
                    onChange={(e) => setMedicalReviewer(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="">No reviewer assigned</option>
                    {authors.map((a) => (
                      <option key={a.id} value={a.name}>{a.name} ({a.credentials || a.role})</option>
                    ))}
                  </select>
                </div>

                {/* Source */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Source *</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="e.g. Journal of the American College of Cardiology"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                {/* Original Publication Citation */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Original Publication Citation</label>
                  <input
                    type="text"
                    value={originalPublication}
                    onChange={(e) => setOriginalPublication(e.target.value)}
                    placeholder="e.g. JACC 2026;88(3):245-259"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                {/* Publication Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Publication Date</label>
                  <input
                    type="text"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    placeholder="e.g. August 15, 2026"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                {/* Reading Time */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Reading Time (Minutes)</label>
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readTimeMinutes}
                    onChange={(e) => setReadTimeMinutes(Number(e.target.value) || 1)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 5. Evidence Classification (Section 7) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-teal-600" /> Evidence Classification & Trial IDs
                </h2>
                <span className="text-[10px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-full border border-teal-200">
                  GlobalHealth Scientific Trust Engine
                </span>
              </div>

              {/* Evidence Status Radios */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">Evidence Status *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'peer-reviewed', label: 'Peer-reviewed research' },
                    { key: 'government', label: 'Government / public health information' },
                    { key: 'professional-org', label: 'Professional organization consensus' },
                    { key: 'institutional', label: 'Institutional / university research' },
                    { key: 'preliminary', label: 'Preliminary / pre-print research' },
                    { key: 'news-report', label: 'News report / press release' },
                    { key: 'other', label: 'Other observational review' },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                        evidenceStatus === item.key
                          ? 'border-teal-500 bg-teal-50/50 text-teal-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="evidence-status"
                        checked={evidenceStatus === item.key}
                        onChange={() => setEvidenceStatus(item.key as NewsEvidenceStatus)}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Evidence Level & Research Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Evidence Level</label>
                  <select
                    value={evidenceLevel}
                    onChange={(e) => setEvidenceLevel(e.target.value as NewsEvidenceLevel)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  >
                    <option value="High">High (Randomized trials / systematic reviews)</option>
                    <option value="Moderate">Moderate (Cohort studies / observational)</option>
                    <option value="Preliminary">Preliminary (Laboratory / Phase I trials)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Research Type</label>
                  <select
                    value={researchType}
                    onChange={(e) => setResearchType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  >
                    {RESEARCH_TYPES.map((rt) => (
                      <option key={rt} value={rt}>{rt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Study Link / DOI & Clinical Trial ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Study Link / Digital Object Identifier (DOI)</label>
                  <input
                    type="text"
                    value={studyDoi}
                    onChange={(e) => setStudyDoi(e.target.value)}
                    placeholder="e.g. 10.1016/j.jacc.2026.04.019"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Clinical Trial ID (e.g. ClinicalTrials.gov)</label>
                  <input
                    type="text"
                    value={clinicalTrialId}
                    onChange={(e) => setClinicalTrialId(e.target.value)}
                    placeholder="e.g. NCT04829104"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 6. Medical Disclaimer Per Article (Section 8) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Info className="h-4 w-4 text-amber-600" /> Medical Information Disclaimer
                </h2>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={showMedicalDisclaimer}
                    onChange={(e) => setShowMedicalDisclaimer(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span>Show medical information disclaimer</span>
                </label>
              </div>

              {showMedicalDisclaimer && (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={customDisclaimer}
                    onChange={(e) => setCustomDisclaimer(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-amber-50/40 p-3 text-xs text-slate-700 focus:border-teal-500 focus:outline-hidden"
                  />
                  <p className="text-[10px] text-slate-400">
                    This disclaimer will automatically render at the bottom of the article and inside reader cards.
                  </p>
                </div>
              )}
            </div>

            {/* 7. SEO Settings & Google Search Preview (Section 9) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Search className="h-4 w-4 text-indigo-600" /> Search Engine Optimization (SEO)
                </h2>
                <span className="text-[10px] text-slate-400">Canonical indexation rules</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Title for Google search results..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Meta Description</label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Short summary under 160 characters for search engine snippets..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">URL Slug</label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs text-slate-500">
                      <span>/news/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full bg-transparent p-1.5 text-xs text-slate-900 font-mono focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">Focus Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={focusKeywords}
                      onChange={(e) => setFocusKeywords(e.target.value)}
                      placeholder="e.g. stroke prevention, MIND diet, cardiology"
                      className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Google Search Live Preview Card (Section 9) */}
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Google Search Preview
                  </div>
                  <div className="text-xs text-emerald-800 truncate font-mono">
                    https://www.globalhealth.org/news/{slug || 'heart-research-update'}
                  </div>
                  <div className="text-sm font-bold text-blue-800 hover:underline cursor-pointer">
                    {seoTitle || title || 'Health Research Update | GlobalHealth'}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2">
                    {metaDescription || shortDescription || 'Latest research and medical developments synthesized by certified clinical editors.'}
                  </div>
                </div>
              </div>
            </div>

            {/* 8. Connected Ecosystem / Related Content (Section 10) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-teal-600" /> Connected Ecosystem & Related Modules
                </h2>
                <span className="text-[10px] text-slate-400">Deep interconnectivity across GlobalHealth</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Related Diseases (Comma separated)</label>
                  <input
                    type="text"
                    value={relatedDiseases}
                    onChange={(e) => setRelatedDiseases(e.target.value)}
                    placeholder="e.g. Stroke, Hypertension, Atherosclerosis"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Related Medicines</label>
                  <input
                    type="text"
                    value={relatedMedicines}
                    onChange={(e) => setRelatedMedicines(e.target.value)}
                    placeholder="e.g. Atorvastatin, Aspirin, Amlodipine"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Related Medical Tests</label>
                  <input
                    type="text"
                    value={relatedMedicalTests}
                    onChange={(e) => setRelatedMedicalTests(e.target.value)}
                    placeholder="e.g. Lipid Panel, ApoB, hs-CRP, Carotid Ultrasound"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">Related Nutrition Topics</label>
                  <input
                    type="text"
                    value={relatedNutritionTopics}
                    onChange={(e) => setRelatedNutritionTopics(e.target.value)}
                    placeholder="e.g. Mediterranean Diet, Omega-3, Olive Oil"
                    className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: PUBLISHING, PLACEMENT & REVISION (4 Cols) */}
          {/* ========================================================= */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. Publishing Settings Card (Section 11) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Publishing Controls
                </h3>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as NewsStatus)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:border-teal-500 focus:outline-hidden"
                >
                  <option value="draft">Draft</option>
                  <option value="pending_editor">Pending Editor Review</option>
                  <option value="pending_medical">Pending Medical Review</option>
                  <option value="changes_requested">Changes Requested</option>
                  <option value="approved">Approved</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Visibility */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-hidden"
                >
                  <option value="Public">Public (Indexed globally)</option>
                  <option value="Medical Professionals Only">Medical Professionals Only</option>
                  <option value="Internal Draft">Internal Draft (Restricted)</option>
                </select>
              </div>

              {/* Publish Timing */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800">Publish Timing</label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="publish-timing"
                      checked={publishTiming === 'immediate'}
                      onChange={() => setPublishTiming('immediate')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Publish Immediately</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="publish-timing"
                      checked={publishTiming === 'scheduled'}
                      onChange={() => setPublishTiming('scheduled')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Schedule for Future Embargo Release</span>
                  </label>
                </div>

                {publishTiming === 'scheduled' && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 animate-in fade-in duration-150 mt-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Release Date</label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Release Time</label>
                      <input
                        type="text"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        placeholder="09:00 AM"
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Timezone</label>
                      <input
                        type="text"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        placeholder="America/New_York"
                        className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSaveAction('published')}
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Publish Article</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveAction('draft')}
                    className="py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition text-center"
                  >
                    Save Draft
                  </button>

                  <button
                    type="button"
                    onClick={handlePreviewTrigger}
                    className="py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition text-center"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Homepage Placement & Directives (Section 12, 13) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Homepage Placement
                </h3>
                <Star className="h-4 w-4 text-amber-500" />
              </div>

              {/* Featured News Checkbox */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span>Featured News (Top Hero Banner)</span>
                </label>

                {isFeatured && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2 mt-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-amber-900">Priority (1-5)</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={featurePriority}
                          onChange={(e) => setFeaturePriority(Number(e.target.value) || 1)}
                          className="w-full rounded-lg border border-amber-200 bg-white p-1 text-xs text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-amber-900">Featured Until</label>
                        <input
                          type="date"
                          value={featuredUntil}
                          onChange={(e) => setFeaturedUntil(e.target.value)}
                          className="w-full rounded-lg border border-amber-200 bg-white p-1 text-xs text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Breaking News Checkbox (Section 13) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                  />
                  <span className="flex items-center gap-1">
                    <span className="text-rose-600 font-extrabold">🔴 Mark as Breaking News</span>
                  </span>
                </label>

                {isBreaking && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-2 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        🔴 BREAKING
                      </span>
                      <span className="text-[10px] text-rose-800 font-bold">Live Ticker Broadcast</span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-rose-900">Breaking News Expires</label>
                      <input
                        type="text"
                        value={breakingExpires}
                        onChange={(e) => setBreakingExpires(e.target.value)}
                        placeholder="e.g. 2026-08-18T23:59:59Z"
                        className="w-full rounded-lg border border-rose-200 bg-white p-1 text-xs text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Trending News Checkbox */}
              <div className="pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                  />
                  <span>Trending Algorithm Boost</span>
                </label>
              </div>
            </div>

            {/* 3. Medical Review Comments & Feedback Box (Section 17) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-purple-600" /> Reviewer Feedback
                </h3>
              </div>

              {initialArticle?.reviewComments && initialArticle.reviewComments.length > 0 ? (
                <div className="space-y-2">
                  {initialArticle.reviewComments.map((rc) => (
                    <div
                      key={rc.id}
                      className={`p-3 rounded-xl text-xs space-y-1 border ${
                        rc.type === 'changes_requested'
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span>{rc.reviewerName} ({rc.reviewerRole})</span>
                        <span className="text-[10px] opacity-75">{rc.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{rc.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No review comments recorded on this draft.</p>
              )}
            </div>

            {/* 4. Revision History Card (Section 15) */}
            {isEditMode && initialArticle && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="h-4 w-4 text-slate-500" /> Revision History
                  </h3>
                  <button
                    type="button"
                    onClick={() => onOpenRevisionsModal(initialArticle)}
                    className="text-xs font-bold text-teal-700 hover:underline"
                  >
                    Compare / Restore
                  </button>
                </div>

                <div className="space-y-2">
                  {(initialArticle.revisions || []).slice(0, 3).map((rev) => (
                    <div key={rev.version} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>Version {rev.version}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{rev.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Edited by: <strong className="text-slate-700">{rev.editedBy}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400 italic">
                        {rev.changeSummary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Media Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-teal-600" /> Select Image from Media Library
              </h3>
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
              {mediaLibrary.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setFeaturedImage(item.url);
                    setImageAlt(item.altText || item.filename);
                    setImageCaption(item.caption || '');
                    setShowImagePicker(false);
                  }}
                  className="cursor-pointer group rounded-xl border border-slate-200 overflow-hidden hover:border-teal-500 transition shadow-2xs space-y-1 bg-white p-1"
                >
                  <img
                    src={item.url}
                    alt={item.altText}
                    className="w-full h-24 object-cover rounded-lg group-hover:scale-105 transition"
                  />
                  <div className="p-1">
                    <div className="text-[11px] font-bold text-slate-800 truncate">{item.filename}</div>
                    <div className="text-[9px] text-slate-400 truncate">{item.caption}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{mediaLibrary.length} images available</span>
              <button
                type="button"
                onClick={() => setShowImagePicker(false)}
                className="px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
