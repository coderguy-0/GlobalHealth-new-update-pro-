import React, { useMemo } from 'react';
import { MessageSquare, TrendingUp, BookOpen, ArrowRight, Lock } from 'lucide-react';
import { NavigationTab } from '../../types';
import { FORUM_POSTS } from '../../data/forumPosts';
import { COMMUNITY_DISTINCTIONS } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface CommunitySectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

/** Section 17 — Community preview: discussions, trending topics, educational posts. */
export const CommunitySection: React.FC<CommunitySectionProps> = ({ onTabChange }) => {
  const previews = useMemo(() => {
    const discussions = FORUM_POSTS.filter((p) => p.postType === 'question').slice(0, 2);
    const trending = [...FORUM_POSTS].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
    const educational = FORUM_POSTS.filter((p) => p.postType !== 'question').slice(0, 2);
    return { discussions, trending, educational };
  }, []);

  return (
    <section className="gh-section bg-slate-50/60" aria-labelledby="community-title">
      <div className="gh-container">
        <SectionHeading
          id="community-title"
          eyebrow="Community"
          title="Learn. Share. Connect."
          description="Join thoughtful healthcare discussions, ask questions, share experiences and discover useful educational content."
          align="center"
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/* Discussions */}
          <Reveal>
            <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <MessageSquare className="h-4 w-4 text-medical-600" />
                Community discussions
              </h3>
              <ul className="mt-4 flex-1 space-y-3">
                {previews.discussions.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => onTabChange('community')}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition hover:border-medical-200 hover:bg-medical-50/50"
                    >
                      <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-800">{p.title}</p>
                      <p className="mt-1.5 text-[10px] text-slate-400">
                        {p.author} · {p.repliesCount} replies
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Trending topics */}
          <Reveal delay={60}>
            <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <TrendingUp className="h-4 w-4 text-medical-600" />
                Trending topics
              </h3>
              <ul className="mt-4 flex-1 space-y-2">
                {previews.trending.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => onTabChange('community')}
                      className="flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition hover:bg-slate-50"
                    >
                      <span className="line-clamp-1 text-xs font-medium text-slate-700">{p.title}</span>
                      <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-slate-400">
                        {p.upvotes}
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Educational + privacy */}
          <Reveal delay={120}>
            <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <BookOpen className="h-4 w-4 text-medical-600" />
                Educational content
              </h3>
              <ul className="mt-4 flex-1 space-y-3">
                {previews.educational.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => onTabChange('community')}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50/60 p-3 text-left transition hover:border-medical-200 hover:bg-medical-50/50"
                    >
                      <p className="line-clamp-2 text-xs font-semibold leading-snug text-slate-800">{p.title}</p>
                      <p className="mt-1.5 text-[10px] text-slate-400">{p.category}</p>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4 rounded-xl bg-medical-50/70 p-3">
                <p className="flex items-start gap-2 text-[10px] leading-relaxed text-medical-800">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Private personal health information is never published in the community.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Content-type distinctions */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {COMMUNITY_DISTINCTIONS.map((d) => (
            <div key={d.label} className="flex items-start gap-2.5 rounded-xl border border-slate-200/70 bg-white px-4 py-3">
              <span className="mt-0.5 text-medical-600">{d.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-800">{d.label}</p>
                <p className="text-[11px] leading-relaxed text-slate-500">{d.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => onTabChange('community')}>
            Explore Community
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
