import React, { useEffect, useState } from 'react';

/**
 * Thin gradient progress bar pinned to the top of the viewport that reflects
 * the user's vertical scroll position. Respects reduced-motion and avoids
 * paint thrash by rAF-throttling the scroll handler.
 */
export const ScrollProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const p = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0;
      setProgress(p);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-medical-500 to-emerald-500 shadow-[0_0_10px_rgba(5,150,105,0.5)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
