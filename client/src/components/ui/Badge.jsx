import React from 'react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-colors';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-800 border border-slate-200',
    primary: 'bg-[#0B1F3A]/10 text-[#0B1F3A] border border-[#0B1F3A]/20',
    emergency: 'bg-[#D71920]/10 text-[#D71920] border border-[#D71920]/25 font-semibold',
    warning: 'bg-amber-100 text-amber-900 border border-amber-300',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    info: 'bg-sky-100 text-sky-800 border border-sky-300',
    
    // Explicit sync states
    synced: 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-medium',
    pending: 'bg-amber-50 text-amber-800 border border-amber-300 animate-pulse font-medium',
    failed: 'bg-rose-50 text-rose-700 border border-rose-300 font-semibold',
    localOnly: 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium',
    SAVED_ON_DEVICE: 'bg-indigo-50 text-indigo-800 border border-indigo-300 font-medium',
    PENDING_SYNC: 'bg-amber-50 text-amber-800 border border-amber-300 font-medium',
    SYNCING: 'bg-blue-50 text-blue-800 border border-blue-300 animate-pulse font-medium',
    SERVER_ACKNOWLEDGED: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold',
    SYNC_FAILED: 'bg-rose-50 text-rose-800 border border-rose-300 font-semibold',
    
    // SiteWatch states
    online: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
    stale: 'bg-amber-100 text-amber-900 border border-amber-300',
    unreachable: 'bg-rose-100 text-rose-800 border border-rose-300',
    unknown: 'bg-slate-100 text-slate-700 border border-slate-300',

    demo: 'bg-purple-100 text-purple-800 border border-purple-300 text-[10px] tracking-wider font-bold uppercase',
    simulation: 'bg-cyan-100 text-cyan-800 border border-cyan-300 text-[10px] tracking-wider font-bold uppercase'
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;
