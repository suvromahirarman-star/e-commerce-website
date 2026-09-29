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
        <div className="w-16 h-16 rounded-2xl bg-[#FFF1E8] border border-[#FFE2D1] flex items-center justify-center text-[#FF6B2C] mb-5 shadow-2xs">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-bold font-display text-[#171717] tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#666666] font-sans leading-relaxed mb-6">
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
export default EmptyState;
