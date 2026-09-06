import React, { useEffect, useState } from 'react';
import { AIAvatar } from './AIAvatar';
import { AIGreetingBubble } from './AIGreetingBubble';
import { AINovaCallout } from './AINovaCallout';

interface GlobalHealthAIAssistantProps {
  onOpen: () => void;
}

const GREETING_STORAGE_KEY = 'assistantGreetingDismissed';

const CONTEXTUAL_MESSAGES = [
  'Need help?',
  'I’m here to help.',
  'Ask me about your health information.',
  'Need help finding something?',
  'Let’s explore GlobalHealth.',
];

/**
 * Persistent floating AI Assistant launcher — the doctor-boy avatar at the
 * bottom-right corner of the viewport, visible across the whole website.
 *
 * - On load: the Dr. Nova introduction callout peeks out of the avatar
 *   ("Dr. Nova — Your Personal AI Health Assistant — Hi, I'm Dr. Nova…"),
 *   auto-hides after a few seconds and re-appears on hover.
 * - Occasionally shows a short contextual message.
 * - Clicking the avatar opens the dedicated AI Assistant workspace.
 * - Only `assistantGreetingDismissed` is stored locally (a UI preference —
 *   never interpreted as health data).
 *
 * Exactly ONE instance is mounted, at the App level. The widget sits at
 * z-40: above page content but below the auth gate (z-90), language modal
 * (z-50), workspaces (z-70) and emergency/system overlays.
 */
export const GlobalHealthAIAssistant: React.FC<GlobalHealthAIAssistantProps> = ({ onOpen }) => {
  const [introHidden, setIntroHidden] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [bubble, setBubble] = useState<{ text: string; persistent: boolean } | null>(null);

  useEffect(() => {
    // Record the visit — a UI preference only, never health data.
    try {
      localStorage.setItem(GREETING_STORAGE_KEY, '1');
    } catch {
      /* storage unavailable */
    }

    const timers: number[] = [];
    // Branded Dr. Nova introduction — the callout coming out of the avatar.
    timers.push(window.setTimeout(() => setShowIntro(true), 1500));
    timers.push(window.setTimeout(() => setShowIntro(false), 12000));

    // Occasionally surface a short contextual message.
    if (Math.random() < 0.4) {
      const text = CONTEXTUAL_MESSAGES[Math.floor(Math.random() * CONTEXTUAL_MESSAGES.length)];
      timers.push(window.setTimeout(() => setBubble({ text, persistent: false }), 5000));
      timers.push(window.setTimeout(() => setBubble(null), 9000));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const dismissIntro = () => {
    setShowIntro(false);
    setIntroHidden(true);
    try {
      localStorage.setItem(GREETING_STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  const handleOpen = () => {
    setShowIntro(false);
    setBubble(null);
    try {
      localStorage.setItem(GREETING_STORAGE_KEY, '1');
    } catch {
      /* ignore */
    }
    onOpen();
  };

  return (
    <div className="gh-float-anchor fixed z-40">
      {showIntro && !introHidden && <AINovaCallout onDismiss={dismissIntro} />}
      {!showIntro && bubble && <AIGreetingBubble text={bubble.text} onDismiss={() => setBubble(null)} />}

      <button
        type="button"
        onClick={handleOpen}
        onMouseEnter={() => {
          if (!introHidden) setShowIntro(true);
        }}
        onMouseLeave={() => setShowIntro(false)}
        aria-label="Open GlobalHealth AI Assistant"
        aria-haspopup="dialog"
        className="gh-float group relative block h-14 w-14 rounded-full border-2 border-white/90 shadow-lift ring-1 ring-slate-900/10 transition duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-500 focus-visible:ring-offset-2 active:scale-95 sm:h-16 sm:w-16"
      >
        <AIAvatar size={64} showStatus />
      </button>
    </div>
  );
};
