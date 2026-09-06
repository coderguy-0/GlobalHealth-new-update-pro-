import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorProps = ButtonBaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-medical-600 text-white shadow-sm hover:bg-medical-700 focus-visible:ring-medical-500',
  secondary:
    'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400',
  ghost:
    'text-medical-700 hover:bg-medical-50 focus-visible:ring-medical-300',
  subtle:
    'bg-medical-50 text-medical-800 hover:bg-medical-100 focus-visible:ring-medical-300',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-[15px]',
};

function baseClass(variant: ButtonVariant, size: ButtonSize, fullWidth?: boolean) {
  return [
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-150 select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
  ].join(' ');
}

/**
 * Reusable button. Renders an <a> when `href` is provided, otherwise a <button>.
 */
export const Button: React.FC<ButtonProps | AnchorProps> = (props) => {
  const { variant = 'primary', size = 'md', fullWidth, className = '', children, ...rest } =
    props as ButtonProps;

  if ('href' in props && props.href) {
    const { href, ...anchorRest } = props as AnchorProps;
    return (
      <a href={href} className={`${baseClass(variant, size, fullWidth)} ${className}`} {...anchorRest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={`${baseClass(variant, size, fullWidth)} ${className}`} {...rest}>
      {children}
    </button>
  );
};
