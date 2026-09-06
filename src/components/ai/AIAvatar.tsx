import React from 'react';

interface AIAvatarProps {
  /** Diameter in pixels. */
  size?: number;
  /** Show the small "online" status dot. */
  showStatus?: boolean;
  className?: string;
}

/**
 * GlobalHealth AI — the reusable "doctor-boy" avatar persona.
 *
 * A friendly, professional, clearly-AI illustrated character (soft smile,
 * medical coat, subtle stethoscope). Used consistently across the floating
 * widget, workspace header, welcome state, loading state and message headers.
 * The character is a visual persona — never a claim of medical credentials.
 */
export const AIAvatar: React.FC<AIAvatarProps> = ({ size = 64, showStatus = false, className = '' }) => (
  <span className={`relative inline-grid shrink-0 place-items-center ${className}`} style={{ width: size, height: size }}>
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      role="img"
      aria-label="GlobalHealth AI Assistant — a friendly illustrated doctor character"
      className="h-full w-full rounded-full"
    >
      <defs>
        <linearGradient id="gh-ai-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3d829e" />
          <stop offset="55%" stopColor="#2f6a85" />
          <stop offset="100%" stopColor="#1e3a49" />
        </linearGradient>
        <clipPath id="gh-ai-circle">
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>

      <g clipPath="url(#gh-ai-circle)">
        {/* Background */}
        <circle cx="60" cy="60" r="60" fill="url(#gh-ai-bg)" />

        {/* Subtle backdrop glow */}
        <circle cx="60" cy="92" r="46" fill="#ffffff" opacity="0.06" />

        {/* Ears */}
        <circle cx="33" cy="50" r="5.5" fill="#f7c9a6" />
        <circle cx="87" cy="50" r="5.5" fill="#f7c9a6" />

        {/* Head */}
        <circle cx="60" cy="48" r="27" fill="#ffd9b8" />

        {/* Hair — soft cap with fringe */}
        <path
          d="M33 48 Q33 22 60 21 Q87 22 87 48 L87 42 Q87 26 60 25 Q33 26 33 42 Z"
          fill="#3b2a22"
        />
        <path d="M38 34 Q44 30 50 33 Q56 36 62 32 Q68 28 74 32 Q80 36 84 32" stroke="#3b2a22" strokeWidth="5" strokeLinecap="round" fill="none" />

        {/* Eyes */}
        <ellipse cx="49" cy="49" rx="3.2" ry="4" fill="#2b2b2b" />
        <ellipse cx="71" cy="49" rx="3.2" ry="4" fill="#2b2b2b" />
        <circle cx="50.2" cy="47.2" r="1.1" fill="#ffffff" />
        <circle cx="72.2" cy="47.2" r="1.1" fill="#ffffff" />

        {/* Eyebrows */}
        <path d="M43 41 Q49 38 55 41" stroke="#5a4030" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M65 41 Q71 38 77 41" stroke="#5a4030" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <circle cx="42" cy="58" r="4.2" fill="#ff9b84" opacity="0.4" />
        <circle cx="78" cy="58" r="4.2" fill="#ff9b84" opacity="0.4" />

        {/* Smile */}
        <path d="M50 60 Q60 68 70 60" stroke="#8a5a44" strokeWidth="2.6" strokeLinecap="round" fill="none" />

        {/* Medical coat */}
        <path d="M37 121 L37 86 Q37 72 60 72 Q83 72 83 86 L83 121 Z" fill="#ffffff" />
        <path d="M60 72 Q60 82 60 92 L60 121 L37 121 L37 86 Q37 72 60 72 Z" fill="#eef4f8" />
        <path d="M60 72 Q60 82 60 92 L60 121 L83 121 L83 86 Q83 72 60 72 Z" fill="#e3edf3" />
        {/* Coat lapel lines */}
        <path d="M54 74 L58 86 L60 86" stroke="#c3d4de" strokeWidth="1.6" fill="none" />
        <path d="M66 74 L62 86 L60 86" stroke="#c3d4de" strokeWidth="1.6" fill="none" />

        {/* Stethoscope */}
        <path
          d="M60 70 Q57 76 61 80 Q67 86 70 92 Q72 96 76 96"
          stroke="#334155"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="77" cy="96" r="4.6" fill="#94a3b8" stroke="#334155" strokeWidth="2" />
        <circle cx="77" cy="96" r="1.8" fill="#334155" />

        {/* Pocket + medical cross */}
        <path d="M42 96 h12 v9 h-12 z" fill="#dbe7ee" />
        <path d="M47 99 h4 M45 101 h8" stroke="#2f6a85" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    </svg>

    {showStatus && (
      <span
        className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400"
        aria-hidden="true"
      />
    )}
  </span>
);
