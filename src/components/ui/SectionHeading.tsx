import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  id?: string;
}

/**
 * Consistent section header — eyebrow label, title, optional description and
 * an optional action (e.g. "Explore all →"). The action sits beside the title
 * on wide screens and below it on narrow ones.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  id,
}) => {
  const centered = align === 'center';
  return (
    <div className={`flex flex-col gap-4 ${centered ? 'items-center text-center' : 'items-start'}`}>
      <div
        className={`flex w-full flex-col gap-3 sm:flex-row sm:items-end ${
          centered ? 'sm:flex-col sm:items-center sm:text-center' : 'sm:justify-between'
        }`}
      >
        <div className={centered ? 'flex flex-col items-center' : 'min-w-0'}>
          {eyebrow && <span className="gh-eyebrow">{eyebrow}</span>}
          <h2 id={id} className="gh-h2 mt-3">
            {title}
          </h2>
          {description && <p className="gh-lead max-w-2xl">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
};
