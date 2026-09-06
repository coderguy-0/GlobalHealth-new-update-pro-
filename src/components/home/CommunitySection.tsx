import React, { useMemo } from 'react';
import { MessageSquare, TrendingUp, BookOpen, ArrowRight, Lock, Users } from 'lucide-react';
import { NavigationTab } from '../../types';
import { FORUM_POSTS } from '../../data/forumPosts';
import { COMMUNITY_DISTINCTIONS } from './homeData';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

interface CommunitySectionProps {
  onTabChange: (tab: NavigationTab) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ onTabChange }) => {
  const previews = useMemo(() => {
    const discussions = FORUM_POSTS.filter((p) => p.postType === 'question').slice(0, 2);
    const trending = [...FORUM_POSTS].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
    const educational = FORUM_POSTS.filter((p) => p.postType !== 'question').slice(0, 2);
    return { discussions, trending, educational };
  }, []);

  return (
    <section className="gh-section bg-slate-50/70" aria-labelledby="community-title">
      <div className="gh-container">
        <SectionHeading
          id="community-title"
          eyebrow="Peer Support &amp; Knowledge Exchange"
          title="Patient Community &amp; Healthcare Discussions"
          description="Participate in patient support circles, learn from verified clinicians, and explore community wellness insights."
          align="center"
        />

        {/* Symmetrical 3-Column Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Discussions */}
          <Reveal>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft">
              <div>
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-medical-50 text-medical-600">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <span>Active Discussions</span>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {previews.discussions.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onTabChange('community')}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-left transition hover:border-medical-200 hover:bg-medical-50/50"
                      >
                        <p className="line-clamp-2 text-xs font-bold leading-snug text-slate-800">{p.title}</p>
                        <p className="mt-2 text-[11px] text-slate-400">
                          {p.author} · {p.repliesCount} replies
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onTabChange('community')}
                className="mt-4 text-xs font-bold text-medical-700 hover:underline flex items-center justify-between pt-2 border-t border-slate-100"
              >
                <span>Browse All Q&amp;A</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Reveal>

          {/* Trending Topics */}
          <Reveal delay={40}>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft">
              <div>
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                  <span>Trending Health Topics</span>
                </div>

                <ul className="mt-4 space-y-2">
                  {previews.trending.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onTabChange('community')}
                        className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-left transition hover:bg-slate-100"
                      >
                        <span className="line-clamp-1 text-xs font-semibold text-slate-700">{p.title}</span>
                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          {p.upvotes}
                          <TrendingUp className="h-3 w-3" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => onTabChange('community')}
                className="mt-4 text-xs font-bold text-medical-700 hover:underline flex items-center justify-between pt-2 border-t border-slate-100"
              >
                <span>View Trending Feed</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </Reveal>

          {/* Educational Content & Privacy Notice */}
          <Reveal delay={80}>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-soft">
              <div>
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <span>Patient Educational Articles</span>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {previews.educational.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => onTabChange('community')}
                        className="w-full rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 text-left transition hover:border-medical-200 hover:bg-medical-50/50"
                      >
                        <p className="line-clamp-2 text-xs font-bold leading-snug text-slate-800">{p.title}</p>
                        <p className="mt-2 text-[11px] text-slate-400">{p.category}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-2xl bg-medical-50/80 p-3 border border-medical-100">
                <p className="flex items-start gap-2 text-[11px] leading-relaxed text-medical-900">
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-medical-700" />
                  Private personal health records and EHR data are never published in public community spaces.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Content-Type Distinctions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {COMMUNITY_DISTINCTIONS.map((d) => (
            <div key={d.label} className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
              <span className="mt-0.5 text-medical-600">{d.icon}</span>
              <div>
                <p className="text-xs font-bold text-slate-900">{d.label}</p>
                <p className="text-[11px] leading-relaxed text-slate-500 mt-0.5">{d.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" onClick={() => onTabChange('community')}>
            <Users className="h-4.5 w-4.5" />
            Join GlobalHealth Community Network
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
