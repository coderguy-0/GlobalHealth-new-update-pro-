import React from 'react';
import {
  Brain,
  HeartPulse,
  Wind,
  UtensilsCrossed,
  FlaskConical,
  Droplets,
  Waves,
  Bone,
  Layers,
  Shield,
  Venus,
  Dna,
} from 'lucide-react';
import { BODY_SYSTEMS } from '../../data/diseases/diseaseIndex';

interface BodySystemExplorerProps {
  onSelect: (bodySystemId: string, label: string) => void;
  selectedId?: string | null;
}

const ICONS: Record<string, React.ReactNode> = {
  'brain-nervous': <Brain className="h-5 w-5" />,
  'heart-circulatory': <HeartPulse className="h-5 w-5" />,
  'lungs-respiratory': <Wind className="h-5 w-5" />,
  digestive: <UtensilsCrossed className="h-5 w-5" />,
  liver: <FlaskConical className="h-5 w-5" />,
  'kidneys-urinary': <Droplets className="h-5 w-5" />,
  endocrine: <Waves className="h-5 w-5" />,
  'bones-joints': <Bone className="h-5 w-5" />,
  skin: <Layers className="h-5 w-5" />,
  immune: <Shield className="h-5 w-5" />,
  reproductive: <Venus className="h-5 w-5" />,
  cancer: <Dna className="h-5 w-5" />,
};

/**
 * Visually elegant body-system navigator. Selecting a system filters the
 * disease directory instantly. Lightweight — not an anatomical simulator.
 */
export const BodySystemExplorer: React.FC<BodySystemExplorerProps> = ({ onSelect, selectedId }) => {
  const visible = BODY_SYSTEMS.filter((bs) => bs.count > 0);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {visible.map((bs) => {
        const active = selectedId === bs.id;
        return (
          <button
            key={bs.id}
            type="button"
            onClick={() => onSelect(bs.id, bs.label)}
            aria-pressed={active}
            className={`group flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition duration-200 ${
              active
                ? 'border-medical-600 bg-medical-50 shadow-sm'
                : 'border-slate-200/80 bg-white shadow-soft hover:-translate-y-0.5 hover:border-medical-200 hover:shadow-lift'
            }`}
          >
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl transition ${
                active ? 'bg-medical-600 text-white' : 'bg-medical-50 text-medical-700 group-hover:bg-medical-100'
              }`}
            >
              {ICONS[bs.id] || <Shield className="h-5 w-5" />}
            </span>
            <span>
              <span className={`block text-[13px] font-bold leading-snug ${active ? 'text-medical-800' : 'text-slate-800'}`}>
                {bs.label}
              </span>
              <span className="mt-0.5 block text-[11px] text-slate-400">
                {bs.count} {bs.count === 1 ? 'condition' : 'conditions'}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
