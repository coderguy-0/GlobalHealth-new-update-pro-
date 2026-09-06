import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavigationTab } from '../../types';
import { getDiseaseById } from '../../data/diseases/diseaseIndex';
import { DiseaseLandingPage } from './DiseaseLandingPage';
import { DiseaseDirectoryPage } from './DiseaseDirectoryPage';
import { DiseaseDetailPage, DiseaseDetailSkeleton } from './detail/DiseaseDetailPage';
import { DiseaseFilters } from './diseaseState';

interface DiseasesSectionProps {
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onNavigate: (tab: NavigationTab) => void;
  onAskAI: (prompt: string) => void;
  isAuthenticated: boolean;
}

type View = 'landing' | 'directory' | 'detail';

/**
 * Diseases section container — manages landing / directory / detail views and
 * supports deep-linkable routes via the URL hash:
 *   #diseases                → landing
 *   #diseases/directory      → directory
 *   #diseases/<id>           → disease detail
 */
export const DiseasesSection: React.FC<DiseasesSectionProps> = ({
  savedIds,
  onToggleSave,
  onNavigate,
  onAskAI,
}) => {
  const [view, setView] = useState<View>('landing');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [prefilter, setPrefilter] = useState<Partial<DiseaseFilters>>({});
  const [resetKey, setResetKey] = useState(0);
  const lastHashRef = useRef<string>('');

  const selected = selectedId ? getDiseaseById(selectedId) : undefined;

  const parseHash = useCallback((): { view: View; id?: string } => {
    const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0];
    const parts = raw.split('/').filter(Boolean);
    if (parts[0] !== 'diseases') return { view: 'landing' };
    if (parts.length >= 2 && parts[1] === 'directory') return { view: 'directory' };
    if (parts.length >= 2 && parts[1]) return { view: 'detail', id: parts[1] };
    return { view: 'landing' };
  }, []);

  // Hash-driven routing.
  useEffect(() => {
    const apply = () => {
      const parsed = parseHash();
      if (parsed.view === 'detail' && parsed.id) {
        if (getDiseaseById(parsed.id)) {
          setSelectedId(parsed.id);
          setView('detail');
          window.scrollTo({ top: 0 });
        }
      } else if (parsed.view === 'directory') {
        setView('directory');
        window.scrollTo({ top: 0 });
      } else if (parsed.view === 'landing') {
        setView('landing');
        window.scrollTo({ top: 0 });
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, [parseHash]);

  const writeHash = (value: string) => {
    if (window.location.hash !== value) {
      lastHashRef.current = value;
      // window.location.hash assignment triggers hashchange → apply().
      window.location.hash = value;
    } else {
      lastHashRef.current = value;
    }
  };

  const openDisease = useCallback(
    (id: string) => {
      setLoadingDetail(true);
      setSelectedId(id);
      setView('detail');
      writeHash(`#diseases/${id}`);
      window.scrollTo({ top: 0 });
      window.setTimeout(() => setLoadingDetail(false), 280);
    },
    []
  );

  const openDirectory = useCallback((next?: Partial<DiseaseFilters>) => {
    if (next) {
      setPrefilter(next);
      setResetKey((k) => k + 1);
    }
    setView('directory');
    writeHash('#diseases/directory');
    window.scrollTo({ top: 0 });
  }, []);

  const goLanding = useCallback(() => {
    setView('landing');
    writeHash('#diseases');
    window.scrollTo({ top: 0 });
  }, []);

  const handleToggleSave = useCallback(
    (id: string) => {
      onToggleSave(id);
    },
    [onToggleSave]
  );

  return (
    <div className="min-h-[60vh]">
      {view === 'landing' && (
        <DiseaseLandingPage
          onOpenDisease={openDisease}
          onOpenDirectory={openDirectory}
          onNavigate={onNavigate}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
        />
      )}

      {view === 'directory' && (
        <DiseaseDirectoryPage
          key={resetKey}
          initialFilters={prefilter}
          resetKey={resetKey}
          onOpenDisease={openDisease}
          onBack={goLanding}
          onNavigate={onNavigate}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
        />
      )}

      {view === 'detail' &&
        (loadingDetail || !selected ? (
          <DiseaseDetailSkeleton />
        ) : (
          <DiseaseDetailPage
            condition={selected}
            isSaved={savedIds.includes(selected.id)}
            onToggleSave={() => handleToggleSave(selected.id)}
            onOpenDisease={openDisease}
            onBack={goLanding}
            onNavigate={onNavigate}
            onAskAI={(prompt) => onAskAI(prompt)}
            onFindDoctor={() => onNavigate('doctors')}
            onFindTests={() => onNavigate('medical-tests')}
            onOpenMap={() => onNavigate('medical-map')}
          />
        ))}
    </div>
  );
};
