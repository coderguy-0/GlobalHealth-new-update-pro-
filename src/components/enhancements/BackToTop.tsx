import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Circular "Back to top" FAB that fades in after 500px of scroll.
 * Smooth-scrolls the window to the top when activated. Accessible via keyboard
 * and respects reduced-motion (uses instant scroll in that case).
 */
export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goUp = () => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={goUp}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-[7.5rem] right-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-medical-200 bg-white text-medical-700 shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-medical-50 hover:text-medical-800 sm:bottom-24 sm:right-6 ${
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
};
