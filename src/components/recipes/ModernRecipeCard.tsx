import React from 'react';
import { Clock, ArrowUpRight, ChefHat, Flame } from 'lucide-react';

export interface ModernRecipeCardProps {
  imageUrl: string;
  title: string;
  description: string;
  prepTime?: string;
  calories?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  buttonText?: string;
  onViewRecipe?: () => void;
  className?: string;
}

/**
 * ModernRecipeCard — Short, attractive, minimalist recipe card
 * - Beautiful food image
 * - Recipe name + 1-line description
 * - View Recipe / Start Cooking button
 * - Rounded, clean typography, subtle shadows, excellent contrast, mobile responsive, compact
 */
export const ModernRecipeCard: React.FC<ModernRecipeCardProps> = ({
  imageUrl,
  title,
  description,
  prepTime = '25 min',
  calories = '320 kcal',
  difficulty = 'Easy',
  buttonText = 'View Recipe',
  onViewRecipe,
  className = '',
}) => {
  return (
    <div
      className={`group relative w-full max-w-[360px] rounded-[28px] bg-white border border-slate-200/70 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300 ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-[1.05] transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {/* Subtle gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-transparent pointer-events-none" />

        {/* Top badges — minimal, floating */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/50 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm">
            <Clock className="h-3.5 w-3.5 text-slate-600" />
            {prepTime}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 text-[11px] font-bold shadow-sm">
            <Flame className="h-3 w-3 text-amber-300" />
            {calories}
          </span>
        </div>

        {/* Difficulty dot */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md border border-white/60 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-700 shadow-sm">
            <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${difficulty === 'Easy' ? 'bg-emerald-500' : difficulty === 'Medium' ? 'bg-amber-500' : 'bg-rose-500'}`} />
            {difficulty}
          </span>
        </div>
      </div>

      {/* Content — clean hierarchy, generous spacing */}
      <div className="p-5">
        {/* Title — strong visual hierarchy */}
        <h3 className="text-[18px] font-black tracking-tight leading-[1.2] text-slate-900 line-clamp-1">
          {title}
        </h3>

        {/* 1-line description — muted, easy to scan */}
        <p className="mt-1.5 text-[13px] leading-[1.5] text-slate-500 line-clamp-1">
          {description}
        </p>

        {/* Action row — balanced spacing */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={onViewRecipe}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 active:bg-black text-white px-5 py-3 text-[13px] font-bold tracking-wide transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <ChefHat className="h-4 w-4 text-emerald-300" />
            <span>{buttonText}</span>
            <ArrowUpRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Optional secondary quick meta — keeps card compact but informative */}
          <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:text-slate-700 transition-colors">
            <Clock className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------- */
/* Demo / Preview wrapper — shows how it looks in grid */
/* -------------------------------------------------- */
export const ModernRecipeCardDemo: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#fcfcfd] flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="text-sm font-black tracking-tight text-slate-900">Recipe Card — Minimal</div>
          <div className="text-[11px] font-bold text-slate-500">Rounded • Clean • Responsive</div>
        </div>
      </div>

      {/* Showcase */}
      <div className="flex-1 mx-auto max-w-6xl w-full px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          <ModernRecipeCard
            imageUrl="/images/modern-recipe-card.jpg"
            title="Mediterranean Quinoa Bowl"
            description="Crunchy chickpeas, creamy feta & avocado in 25 min."
            prepTime="25 min"
            calories="420 kcal"
            difficulty="Easy"
            buttonText="View Recipe"
            onViewRecipe={() => alert('Opening recipe: Mediterranean Quinoa Bowl')}
          />

          <ModernRecipeCard
            imageUrl="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&auto=format&fit=crop&q=80"
            title="Avocado Toast Deluxe"
            description="Sourdough, poached egg & chili flakes — brunch ready."
            prepTime="15 min"
            calories="320 kcal"
            difficulty="Easy"
            buttonText="Start Cooking"
            onViewRecipe={() => alert('Start cooking: Avocado Toast Deluxe')}
          />

          <ModernRecipeCard
            imageUrl="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80"
            title="Margherita Pizza"
            description="Wood-fired crust, fresh basil & mozzarella magic."
            prepTime="30 min"
            calories="580 kcal"
            difficulty="Medium"
            buttonText="View Recipe"
          />
        </div>

        {/* Spec note */}
        <div className="mt-12 rounded-2xl bg-white border border-slate-200 p-5 max-w-2xl mx-auto">
          <h4 className="text-sm font-bold text-slate-900">Design specs</h4>
          <ul className="mt-2 text-xs text-slate-600 space-y-1 list-disc pl-4">
            <li>Rounded card — 28px radius, soft border, subtle shadow 0_8px_32px</li>
            <li>Strong hierarchy — 18px black title, 13px muted description, 1-line clamp</li>
            <li>Appetizing visual — 4:3 image, hover scale 1.05, gradient depth</li>
            <li>Compact — max 360px width, p-5 content, balanced spacing</li>
            <li>Excellent contrast — slate-900 on white, emerald accent, WCAG AA</li>
            <li>Mobile responsive — w-full, grid 1→2→3, touch-friendly 44px button</li>
            <li>Clean typography — tracking-tight, leading 1.2, font-black title</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModernRecipeCard;
