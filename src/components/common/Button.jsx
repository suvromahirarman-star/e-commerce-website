import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium font-sans select-none cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B2C] focus-visible:ring-offset-2';

  const variants = {
    // Primary Orange CTA (#FF6B2C with #E9571F hover, subtle lift and orange glow)
    primary:
      'bg-[#FF6B2C] hover:bg-[#E9571F] active:bg-[#C94716] text-white font-semibold shadow-xs hover:shadow-[0_8px_20px_rgba(255,107,44,0.28)] border border-transparent',
    
    // Secondary White Button with Subtle Border & Soft Orange Hover
    secondary:
      'bg-white hover:bg-[#FFF8F3] active:bg-[#FFF1E8] text-[#171717] hover:text-[#FF6B2C] border border-[#EAEAEA] hover:border-[#FF6B2C] shadow-xs',
    
    // Dark Contrast Button (used in admin or high-contrast sections)
    dark:
      'bg-[#171717] hover:bg-[#262626] active:bg-[#000000] text-white border border-[#171717] shadow-xs',
    
    // Orange Outline Button
    outline:
      'bg-transparent hover:bg-[#FF6B2C] text-[#FF6B2C] hover:text-white border border-[#FF6B2C] active:bg-[#E9571F]',
    
    // Ghost Button (clean surface, soft orange on hover)
    ghost:
      'bg-transparent hover:bg-[#FFF8F3] text-[#171717] hover:text-[#FF6B2C] border border-transparent',
    
    // Danger / Destructive
    danger:
      'bg-[#D64545] hover:bg-[#B83838] active:bg-[#962B2B] text-white border border-transparent shadow-xs',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 rounded-lg gap-1.5 min-h-[34px]',
    md: 'text-xs sm:text-sm px-5 py-2.5 rounded-xl gap-2 min-h-[42px]',
    lg: 'text-sm sm:text-base px-7 py-3.5 rounded-xl gap-2.5 min-h-[48px]',
    icon: 'p-2.5 rounded-xl min-h-[40px] min-w-[40px]',
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      whileHover={{
        y: disabled || isLoading ? 0 : -1.5,
        scale: disabled || isLoading ? 1 : 1.01,
      }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant] || variants.primary}
        ${sizes[size] || sizes.md}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </motion.button>
  );
}
