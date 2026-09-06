import React, { useEffect, useState } from 'react';
import { Newspaper, ArrowRight, CalendarDays, Bookmark } from 'lucide-react';
import { NavigationTab } from '../../types';
import type { NewsArticle } from '../../types';
import { newsService } from '../../services/newsService';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { CardSkeleton } from '../ui/Skeleton';
import { ErrorState } from '../ui/States';
import { Button } from '../ui/Button';

interface UpdatesSectionProps {
  onTabChange: (tab: NavigationTab) => void;
  onOpenArticle?: (articleId: string) => void;
}

export const UpdatesSection: React.FC<UpdatesSectionProps> = ({ onTabChange, onOpenArticle }) => {
  const [articles, setArticles] = useState<NewsArticle[] | null>(null);
  const [failed, setFailed] = useState(false);

  const load = () => {
    setFailed(false);
    setArticles(null);
    try {
      window.setTimeout(() => {
        setArticles(newsService.getPublicArticles().slice(0, 4));
      }, 150);
    } catch {
      setFailed(true);
    }
  };

  useEffect(load, []);

  return (
    <section className="gh-section bg-white" aria-labelledby="updates-title">
      <div className="gh-container">
        <SectionHeading
          id="updates-title"
          eyebrow="Health Journalism &amp; Advisories"
          title="Verified Healthcare News &amp; Bulletins"
          description="Peer-reviewed research digests, public health advisories, and institutional announcements verified through our editorial board."
          align="center"
        />

        <div className="mt-12">
          {failed ? (
            <ErrorState onRetry={load} />
          ) : articles === null ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
              <p className="text-sm font-semibold text-slate-700">No published articles yet</p>
              <p className="mt-1 text-xs text-slate-500">New healthcare updates will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((a, i) => (
                <Reveal key={a.id} delay={i * 40}>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenArticle) onOpenArticle(a.id);
                      else onTabChange('news');
                    }}
                    className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-medical-300 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500"
                  >
                    {a.featuredImage ? (
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={a.featuredImage}
                          alt={a.imageAlt || a.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white border border-white/20">
                          {a.category}
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-44 w-full items-center justify-center bg-gradient-to-br from-medical-50 to-medical-100/70 text-medical-300">
                        <Newspaper className="h-10 w-10" />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>{a.date}</span>
                      </div>

                      <h3 className="mt-2.5 line-clamp-2 text-sm font-bold leading-snug text-slate-900 group-hover:text-medical-800">
                        {a.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
                        {a.shortDescription || a.summary}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span className="truncate text-[11px] font-semibold text-slate-400 max-w-[120px]">
                          {a.source}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 font-bold text-medical-700 group-hover:underline">
                          Read Brief
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Button variant="secondary" size="lg" onClick={() => onTabChange('news')}>
            <Newspaper className="h-4.5 w-4.5 text-medical-600" />
            View All Health News &amp; Bulletins
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
