import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none cursor-pointer';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 min-h-[32px]',
    md: 'px-4 py-2 text-sm gap-2 min-h-[40px]',
    lg: 'px-5 py-2.5 text-base gap-2.5 min-h-[48px]'
  };

  const variantClasses = {
    primary: 'bg-[#0B1F3A] hover:bg-[#162C4E] text-white focus:ring-[#0B1F3A] shadow-sm',
    emergency: 'bg-[#D71920] hover:bg-[#B8141A] text-white focus:ring-[#D71920] shadow-sm font-semibold',
    warning: 'bg-[#F4B41A] hover:bg-[#D99E10] text-[#0B1F3A] focus:ring-[#F4B41A] font-semibold',
    secondary: 'bg-white hover:bg-slate-50 text-[#253246] border border-[#E2E8F0] shadow-xs focus:ring-slate-300',
    ghost: 'hover:bg-slate-100 text-[#253246] focus:ring-slate-200',
    dangerGhost: 'hover:bg-rose-50 text-[#D71920] focus:ring-rose-200'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

export default Button;
