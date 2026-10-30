import React from 'react';

export function Card({ children, className = '', hoverEffect = false, ...props }) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E2E8F0] shadow-xs ${
        hoverEffect ? 'hover:border-slate-300 hover:shadow-sm transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`p-4 sm:p-5 border-b border-[#E2E8F0] ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-base font-semibold text-[#0B1F3A] ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-4 sm:p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`p-4 sm:p-5 border-t border-[#E2E8F0] bg-slate-50/50 rounded-b-xl ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
