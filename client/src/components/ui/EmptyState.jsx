import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionText,
  onAction,
  className = ''
}) {
  return (
    <div className={`text-center py-12 px-4 flex flex-col items-center justify-center ${className}`}>
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-[#0B1F3A] mb-1">{title}</h3>
      <p className="text-sm text-[#64748B] max-w-sm mb-4">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
