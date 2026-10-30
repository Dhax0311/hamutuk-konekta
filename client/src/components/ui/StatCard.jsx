import React from 'react';
import Card from './Card';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = 'default',
  trend,
  className = ''
}) {
  return (
    <Card className={`p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#64748B]">{title}</p>
          <h4 className="text-2xl sm:text-3xl font-bold text-[#0B1F3A] mt-1 tracking-tight">{value}</h4>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[#0B1F3A] shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
        <span>{subtitle}</span>
        {badgeText && (
          <span className="font-semibold text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {badgeText}
          </span>
        )}
      </div>
    </Card>
  );
}

export default StatCard;
