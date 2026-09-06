import React from 'react';

interface DiseaseAlphabetProps {
  activeLetter: string | null;
  onSelect: (letter: string | null) => void;
  /** Letters that actually have diseases — others render dimmed. */
  availableLetters: string[];
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/** A–Z disease explorer. Selecting a letter filters the directory. */
export const DiseaseAlphabet: React.FC<DiseaseAlphabetProps> = ({ activeLetter, onSelect, availableLetters }) => {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`gh-chip ${!activeLetter ? 'gh-chip-active' : ''}`}
      >
        All
      </button>
      {LETTERS.map((letter) => {
        const available = availableLetters.includes(letter);
        const active = activeLetter === letter;
        return (
          <button
            key={letter}
            type="button"
            disabled={!available}
            onClick={() => onSelect(active ? null : letter)}
            aria-pressed={active}
            aria-label={`Diseases starting with ${letter}`}
            className={`grid h-9 min-w-9 place-items-center rounded-lg px-1.5 text-xs font-bold transition ${
              active
                ? 'bg-medical-600 text-white shadow-sm'
                : available
                  ? 'bg-white text-slate-600 hover:bg-medical-50 hover:text-medical-700'
                  : 'cursor-not-allowed bg-slate-50 text-slate-300'
            }`}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
};
