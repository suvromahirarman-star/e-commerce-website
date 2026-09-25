import React from 'react';
import { Button } from './Button';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto ${className}`}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 mb-5">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-xl font-bold text-neutral-900 tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
