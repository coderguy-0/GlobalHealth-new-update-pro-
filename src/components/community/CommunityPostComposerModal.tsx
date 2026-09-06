import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  HelpCircle, 
  BarChart2, 
  Megaphone, 
  Award, 
  FileText, 
  Image as ImageIcon, 
  Globe, 
  Lock, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { CommunityPostItem, CommunityUserProfile } from './CommunityTypes';
import { useLocalization } from '../../context/LocalizationContext';

interface CommunityPostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CommunityUserProfile;
  onSubmitPost: (post: Partial<CommunityPostItem>) => void;
  initialType?: string;
}

export const CommunityPostComposerModal: React.FC<CommunityPostComposerModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitPost,
  initialType = 'discussion'
}) => {
  const { t } = useLocalization();
  const [postType, setPostType] = useState<string>(initialType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General Health & Wellness');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [visibility, setVisibility] = useState<'everyone' | 'members' | 'followers'>('everyone');
  const [agreedToRules, setAgreedToRules] = useState(true);

  // Poll options state
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  if (!isOpen) return null;

  const categories = [
    'General Health & Wellness',
    'Cardiovascular Research',
    'Diabetes & Metabolism',
    'Nutrition & Gut Health',
    'Neuroscience & Sleep',
    'Medicines & Pharmacology',
    'Fitness & Physical Therapy',
    'Medical Students & Exam Prep'
  ];

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const next = [...pollOptions];
    next[index] = val;
    setPollOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !agreedToRules) return;

    const tags = tagsInput
      .split(',')
      .map(s => s.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newPost: Partial<CommunityPostItem> = {
      author: currentUser,
      postType: postType as any,
      title: title.trim() || undefined,
      content: content.trim(),
      category,
      tags: tags.length > 0 ? tags : ['HealthCommunity'],
      visibility,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      timestamp: 'Just now',
      comments: []
    };

    if (imageUrl.trim()) {
      newPost.attachments = [
        {
          type: 'image',
          url: imageUrl.trim(),
          title: title || 'Attached Health Illustration'
        }
      ];
    }

    if (postType === 'poll') {
      const validOpts = pollOptions.filter(o => o.trim().length > 0);
      if (validOpts.length >= 2) {
        newPost.poll = {
          question: title.trim() || content.slice(0, 60),
          options: validOpts.map((text, idx) => ({
            id: `opt-${Date.now()}-${idx}`,
            text,
            votes: 0
          })),
          totalVotes: 0,
          endsIn: '7 days remaining'
        };
      }
    }

    onSubmitPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">{t('Create Community Post')}</h2>
              <p className="text-xs text-slate-500">{t('Share clinical research, pose a medical question, or start a poll')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Post Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider">
              {t('Select Post Format')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'discussion', label: t('Discussion'), icon: MessageSquare },
                { id: 'question', label: t('Question / Q&A'), icon: HelpCircle },
                { id: 'poll', label: t('Community Poll'), icon: BarChart2 },
                { id: 'announcement', label: t('Announcement'), icon: Megaphone }
              ].map(tp => {
                const Icon = tp.icon;
                const isSel = postType === tp.id;
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => setPostType(tp.id)}
                    className={`p-3 rounded-2xl border text-left transition flex flex-col gap-2 cursor-pointer ${
                      isSel
                        ? 'border-violet-600 bg-violet-50/80 text-violet-900 font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isSel ? 'text-violet-600' : 'text-slate-500'}`} />
                    <span className="text-xs">{tp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              {t('Topic or Headline')} {postType === 'question' && <span className="text-rose-500">*</span>}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === 'question'
                  ? t('e.g., What dietary protocol best stabilizes morning cortisol spikes?')
                  : t('Give your post a concise, clear title...')
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              {t('Content Details & Clinical Insight')} <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('Share context, mechanistic explanation, lifestyle observations, or references to published literature...')}
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          {/* Dynamic Poll Options */}
          {postType === 'poll' && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
              <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                {t('Poll Options (2 to 5 options)')}
              </label>
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                    placeholder={`${t('Option')} ${idx + 1}`}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-blue-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}

              {pollOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer pt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t('Add Another Option')}</span>
                </button>
              )}
            </div>
          )}

          {/* Category & Tags Row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">{t('Medical Category')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              >
                {categories.map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1.5">{t('Hashtags (comma-separated)')}</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. ApoB, Lipidology, Longevity"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
          </div>

          {/* Image URL Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>{t('Attach Image URL (Optional)')}</span>
              </span>
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          {/* Rules Agreement Checkbox */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="rulesAgree"
              checked={agreedToRules}
              onChange={(e) => setAgreedToRules(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-violet-600 focus:ring-violet-500"
            />
            <label htmlFor="rulesAgree" className="text-xs text-emerald-950 leading-relaxed cursor-pointer">
              <strong>{t('Medical Community Guidelines Consent')}:</strong> {t('I affirm that this post complies with evidence-based standards, does not promote unverified cures or commercial spam, and respects privacy.')}
            </label>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              {t('Cancel')}
            </button>

            <button
              type="submit"
              disabled={!content.trim() || !agreedToRules}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-md ${
                content.trim() && agreedToRules
                  ? 'bg-violet-700 hover:bg-violet-600'
                  : 'bg-slate-300 opacity-60 cursor-not-allowed'
              }`}
            >
              {t('Publish Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
