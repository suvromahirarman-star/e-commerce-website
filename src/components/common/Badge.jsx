import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }) {
  const variants = {
    // Primary Orange Accent Badge
    orange: 'bg-[#FF6B2C] text-white border-transparent font-semibold shadow-2xs',
    
    // Soft Orange Tint Badge
    softOrange: 'bg-[#FFF1E8] text-[#C94716] border-[#FFE2D1] font-semibold',
    
    // New Arrivals Badge
    new: 'bg-[#FF6B2C] text-white border-transparent font-mono tracking-wider uppercase font-semibold shadow-2xs',
    
    // Bestseller Badge
    bestseller: 'bg-[#171717] text-white border-transparent font-sans font-medium',
    
    // Flash / Discount Sale
    sale: 'bg-[#D64545] text-white border-transparent font-mono font-bold shadow-2xs',
    
    // Limited Stock Warning
    limited: 'bg-[#FFF8F3] text-[#C98A16] border-[#FBEAD2] font-semibold',
    
    // Neutral White / Slate
    neutral: 'bg-[#F2F2F2] text-[#171717] border-transparent font-medium',
    
    // Semantic Success
    success: 'bg-[#EAF5EE] text-[#25855A] border-[#CDE8D8] font-medium',
    
    // Semantic Warning
    warning: 'bg-[#FFF8F3] text-[#C98A16] border-[#FBEAD2] font-medium',
    
    // Semantic Danger
    danger: 'bg-[#FDECEC] text-[#D64545] border-[#F9CACA] font-medium',
    
    // Outline
    outline: 'bg-white text-[#171717] border-[#EAEAEA]',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 rounded-md leading-normal',
    sm: 'text-xs px-2.5 py-1 rounded-lg leading-normal',
    md: 'text-sm px-3.5 py-1.5 rounded-xl leading-normal',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 border select-none transition-colors ${
        variants[variant] || variants.neutral
      } ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
}
