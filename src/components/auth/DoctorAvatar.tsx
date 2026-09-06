import React, { useEffect, useRef, useState } from 'react';

export type AvatarExpression =
  | 'idle'
  | 'login'
  | 'password'
  | 'error'
  | 'success'
  | 'signup'
  | 'recover'
  | 'verifying';

interface DoctorAvatarProps {
  /** Emotional state driving the avatar's face, posture and gesture. */
  expression?: AvatarExpression;
  /** Contextual speech-bubble message. Overrides the greeting while present. */
  message?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const GREETING = 'Hi, I’m your GlobalHealth assistant.';

const SIZES = { sm: 'h-20 w-20', md: 'h-28 w-28', lg: 'h-36 w-36 sm:h-40 sm:w-40' };

/**
 * The GlobalHealth animated doctor avatar.
 *
 * A soft 3D-illustration style doctor rendered in SVG, themed entirely with
 * the platform's medical-blue palette. It has gentle idle motion (breathing,
 * blinking, subtle head movement) and reacts to the authentication state:
 * looking toward the form while signing in, a privacy gesture while typing a
 * password, a concerned-but-reassuring face on errors, a happy check on
 * success, welcoming on sign-up and supportive during recovery.
 *
 * All animation is CSS-driven so the global `prefers-reduced-motion` rule
 * (index.css) automatically disables it for users who ask for no motion.
 */
export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({
  expression = 'idle',
  message,
  size = 'md',
  className = ''
}) => {
  const [bubble, setBubble] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const showBubble = (text: string, duration = 5000) => {
    setBubble(text);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setBubble(null), duration);
  };

  // Greeting on first visit; contextual messages when the parent provides one.
  useEffect(() => {
    if (message) {
      showBubble(message, 5200);
    } else {
      showBubble(GREETING, 4200);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const stateClass =
    expression === 'login'
      ? 'gh-av-look'
      : expression === 'password'
        ? 'gh-av-privacy'
        : expression === 'error'
          ? 'gh-av-error'
          : expression === 'success'
            ? 'gh-av-success'
            : expression === 'signup'
              ? 'gh-av-signup'
              : expression === 'recover' || expression === 'verifying'
                ? 'gh-av-recover'
                : '';

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Frame + character */}
      <div
        className={`relative rounded-full ${SIZES[size]}`}
        onMouseEnter={() => {
          if (!bubble) showBubble(GREETING, 3800);
        }}
        onFocus={() => {
          if (!bubble) showBubble(GREETING, 3800);
        }}
      >
        {/* Soft blue glow behind the avatar */}
        <div className="gh-av-glow" aria-hidden="true" />

        <svg viewBox="0 0 240 240" className="gh-av-svg relative" role="img" aria-label="GlobalHealth assistant doctor">
          <defs>
            <radialGradient id="ghAvBg" cx="50%" cy="36%" r="78%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="62%" stopColor="#eef6fa" />
              <stop offset="100%" stopColor="#d5e8f0" />
            </radialGradient>
            <linearGradient id="ghAvHair" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5c4632" />
              <stop offset="100%" stopColor="#3d2e1f" />
            </linearGradient>
            <linearGradient id="ghAvCoat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#eef3f7" />
            </linearGradient>
          </defs>

          {/* Circular frame */}
          <circle cx="120" cy="120" r="116" fill="url(#ghAvBg)" />
          <circle cx="120" cy="120" r="113" fill="none" stroke="#ffffff" strokeWidth="5" />
          <circle cx="120" cy="120" r="105" fill="none" stroke="#b9d7e3" strokeOpacity="0.55" strokeWidth="1.5" />

          {/* Whole character gently breathes */}
          <g className="gh-av-body">
            {/* Shoulders / medical coat */}
            <path
              d="M62 214 Q64 168 92 154 L148 154 Q176 168 178 214 Z"
              fill="url(#ghAvCoat)"
              stroke="#dce6ee"
              strokeWidth="2"
            />
            {/* Coat lapels */}
            <path d="M104 152 L120 178 L136 152" fill="#f4f8fb" stroke="#c9d9e6" strokeWidth="2" />
            {/* Buttons */}
            <circle cx="120" cy="186" r="2.6" fill="#b9d7e3" />
            <circle cx="120" cy="197" r="2.6" fill="#b9d7e3" />
            {/* ID badge with medical cross */}
            <g>
              <rect x="140" y="160" width="24" height="15" rx="4" fill="#ffffff" stroke="#8dbccf" strokeWidth="1.4" />
              <path d="M150 163.5 h4 v3 h3 v4 h-3 v3 h-4 v-3 h-3 v-4 h3 Z" fill="#2f6a85" />
            </g>
            {/* Stethoscope */}
            <path
              d="M92 148 Q92 132 104 130 Q116 128 116 140"
              fill="none"
              stroke="#2f6a85"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="116" cy="143" r="5" fill="#2f6a85" stroke="#1e3a49" strokeWidth="1.5" />
            <path d="M116 143 L110 150" stroke="#2f6a85" strokeWidth="2" strokeLinecap="round" />

            {/* Left arm (resting) */}
            <path d="M70 158 Q58 172 56 192 Q55 198 62 200 Q70 201 74 194 Q80 178 82 166 Z" fill="#f7fafc" stroke="#dce6ee" strokeWidth="1.6" />

            {/* Right arm — raises into a privacy gesture on the password state */}
            <g className="gh-av-privacy-arm">
              <path d="M170 158 Q182 170 186 184 Q188 192 181 194 Q174 195 170 188 Q164 176 162 166 Z" fill="#f7fafc" stroke="#dce6ee" strokeWidth="1.6" />
            </g>
            {/* Privacy shield held by the raised arm */}
            <g className="gh-av-shield">
              <path d="M178 150 L188 145 L191 153 Q191 162 183 165 Q175 162 175 153 Z" fill="#daeaf0" stroke="#2f6a85" strokeWidth="1.6" />
              <path d="M183 151 v7 M180 154 h6" stroke="#2f6a85" strokeWidth="1.6" strokeLinecap="round" />
            </g>

            {/* Head group — subtle rotation/tilt per expression */}
            <g className="gh-av-head">
              {/* Ears */}
              <ellipse cx="84" cy="112" rx="7" ry="10.5" fill="#f0c6a2" />
              <ellipse cx="156" cy="112" rx="7" ry="10.5" fill="#f0c6a2" />
              {/* Neck */}
              <rect x="109" y="128" width="22" height="20" rx="7" fill="#edbe99" />
              <path d="M109 148 Q120 140 131 148 Z" fill="#d8a682" />
              {/* Face */}
              <ellipse cx="120" cy="110" rx="43" ry="47" fill="#f6d3b8" />
              {/* Hair — back */}
              <path d="M77 96 Q74 58 120 54 Q166 58 163 96 Q156 70 120 68 Q84 70 77 96 Z" fill="url(#ghAvHair)" />
              {/* Hair — top/fringe */}
              <path d="M77 98 Q76 64 104 57 Q120 53 136 57 Q164 64 163 98 Q150 76 132 74 Q120 72 108 74 Q90 76 77 98 Z" fill="url(#ghAvHair)" />
              {/* Hair side locks */}
              <path d="M77 98 Q72 116 76 128 Q79 122 79 110 Z" fill="url(#ghAvHair)" />
              <path d="M163 98 Q168 116 164 128 Q161 122 161 110 Z" fill="url(#ghAvHair)" />

              {/* Brows */}
              <g className="gh-av-brows">
                <path d="M93 90 Q102 85.5 111 89" stroke="#57422e" strokeWidth="3.2" fill="none" strokeLinecap="round" />
                <path d="M129 89 Q138 85.5 147 90" stroke="#57422e" strokeWidth="3.2" fill="none" strokeLinecap="round" />
              </g>

              {/* Eyes */}
              <g className="gh-av-eyes">
                <ellipse cx="102" cy="101" rx="7" ry="8.2" fill="#334155" />
                <ellipse cx="138" cy="101" rx="7" ry="8.2" fill="#334155" />
                <g className="gh-av-pupils">
                  <circle cx="104.2" cy="99.5" r="2.3" fill="#ffffff" />
                  <circle cx="140.2" cy="99.5" r="2.3" fill="#ffffff" />
                </g>
              </g>
              {/* Happy eyes (success / sign-up) */}
              <g className="gh-av-happy-eyes">
                <path d="M94 100 Q102 94 110 100" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M130 100 Q138 94 146 100" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
              </g>
              {/* Eyelids — blink */}
              <g className="gh-av-lids">
                <ellipse cx="102" cy="101" rx="8.4" ry="3" fill="#f0c6a2" />
                <ellipse cx="138" cy="101" rx="8.4" ry="3" fill="#f0c6a2" />
              </g>

              {/* Nose */}
              <path d="M120 106 Q118.5 114 122.5 116.5" stroke="#e2ab82" strokeWidth="2.6" fill="none" strokeLinecap="round" />

              {/* Mouth variants */}
              {/* neutral smile */}
              <path className="gh-av-mouth-neutral" d="M112 121 Q120 127.5 128 121" stroke="#a5684a" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* open happy smile */}
              <path className="gh-av-mouth-happy" d="M109 119 Q120 132 131 119 Q120 127 109 119 Z" fill="#b9765a" stroke="#a5684a" strokeWidth="1.6" strokeLinejoin="round" />
              {/* concerned frown */}
              <path className="gh-av-mouth-concern" d="M113 125 Q120 120 127 125" stroke="#a5684a" strokeWidth="3" fill="none" strokeLinecap="round" />
              {/* reassuring gentle smile */}
              <path className="gh-av-mouth-gentle" d="M111 120.5 Q120 128 129 120.5" stroke="#a5684a" strokeWidth="2.6" fill="none" strokeLinecap="round" />

              {/* Cheeks */}
              <ellipse cx="90" cy="116" rx="7" ry="4" fill="#f0ab7e" opacity="0.45" />
              <ellipse cx="150" cy="116" rx="7" ry="4" fill="#f0ab7e" opacity="0.45" />
            </g>
          </g>
        </svg>

        {/* Online status indicator */}
        <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-medical-500" aria-hidden="true" />

        {/* Success check badge */}
        {expression === 'success' && (
          <span
            className="gh-av-check absolute -right-1 -top-1 grid h-9 w-9 place-items-center rounded-full bg-medical-600 text-white shadow-lift"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        )}
      </div>

      {/* Speech bubble — non-blocking, auto-minimizes, re-appears on interaction */}
      <div aria-live="polite">
        {bubble && (
          <div className="gh-av-bubble pointer-events-none absolute -top-10 left-1/2 z-10 w-max max-w-[220px] -translate-x-1/2 rounded-2xl border border-medical-200 bg-white px-3 py-2 text-center text-[11px] font-semibold leading-snug text-slate-700 shadow-lift">
            {bubble}
            <span
              className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-b border-r border-medical-200 bg-white"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    </div>
  );
};
