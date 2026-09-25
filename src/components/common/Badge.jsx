import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  const variants = {
    neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
    dark: 'bg-neutral-900 text-white border-neutral-800',
    new: 'bg-neutral-900 text-white border-neutral-900 uppercase font-mono tracking-wider',
    bestseller: 'bg-[#C45B32]/10 text-[#C45B32] border-[#C45B32]/30 font-medium',
    sale: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
    limited: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    outline: 'bg-transparent text-neutral-600 border-neutral-300',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 rounded',
    sm: 'text-xs px-2.5 py-1 rounded-md',
    md: 'text-sm px-3 py-1.5 rounded-lg',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border select-none ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
}
