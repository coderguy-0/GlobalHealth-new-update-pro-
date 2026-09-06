import React, { useEffect, useState } from 'react';
import { Newspaper, ArrowRight, CalendarDays, Bookmark } from 'lucide-react';
import { NavigationTab } from '../../types';
import type { NewsArticle } from '../../types';
import { newsService } from '../../services/newsService';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { CardSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/States';

interface UpdatesSectionProps {
  onTabChange: (tab: NavigationTab) => void;
  onOpenArticle?: (articleId: string) => void;
}

/** Section 16 — "Healthcare Updates". Data comes from the news service (CMS-backed). */
export const UpdatesSection: React.FC<UpdatesSectionProps> = ({ onTabChange, onOpenArticle }) => {
  const [articles, setArticles] = useState<NewsArticle[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = () => {
    setFailed(false);
    setArticles(null);
    try {
      // Server-seeded public feed (published articles only).
      window.setTimeout(() => {
        setArticles(newsService.getPublicArticles().slice(0, 4));
      }, 250);
    } catch {
      setFailed(true);
    }
  };

  useEffect(load, []);

  return (
    <section className="gh-section" aria-labelledby="updates-title">
      <div className="gh-container">
        <SectionHeading
          id="updates-title"
          eyebrow="Health News"
          title="Healthcare Updates"
          description="Relevant, sourced healthcare updates — published through a managed editorial system."
          action={
            <button
              type="button"
              onClick={() => onTabChange('news')}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-medical-700 transition hover:text-medical-800"
            >
              View all updates
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          }
        />

        <div className="mt-10">
          {failed ? (
            <ErrorState onRetry={load} />
          ) : articles === null ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No updates published yet</p>
              <p className="mt-1 text-xs text-slate-500">New healthcare updates will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((a, i) => (
                <Reveal key={a.id} delay={i * 50}>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenArticle) onOpenArticle(a.id);
                      else onTabChange('news');
                    }}
                    className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
                  >
                    {a.featuredImage ? (
                      <img
                        src={a.featuredImage}
                        alt={a.imageAlt || a.title}
                        loading="lazy"
                        className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-36 w-full items-center justify-center bg-gradient-to-br from-medical-50 to-medical-100/70 text-medical-300">
                        <Newspaper className="h-9 w-9" />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-medical-50 px-2 py-0.5 text-[10px] font-bold text-medical-700">
                          {a.category}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                          <CalendarDays className="h-3 w-3" />
                          {a.date}
                        </span>
                      </div>
                      <h3 className="mt-2.5 line-clamp-2 text-[13px] font-bold leading-snug text-slate-900 group-hover:text-medical-800">
                        {a.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
                        {a.shortDescription || a.summary}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="truncate text-[10px] font-semibold text-slate-400">
                          {a.source}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-medical-700">
                          Read
                          <Bookmark className="h-3 w-3" />
                          <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
