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
    'relative inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2';

  const variants = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950 border border-neutral-900',
    secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 border border-neutral-200',
    accent: 'bg-[#C45B32] text-white hover:bg-[#B54924] active:bg-[#963A1E] border border-transparent shadow-sm',
    outline: 'bg-transparent text-neutral-900 border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50',
    ghost: 'bg-transparent text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 border border-transparent',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 border border-transparent',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-lg gap-2',
    lg: 'text-base px-7 py-3.5 rounded-xl gap-2.5',
    icon: 'p-2.5 rounded-lg',
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      whileHover={{ y: disabled || isLoading ? 0 : -1 }}
      transition={{ duration: 0.15 }}
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
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </motion.button>
  );
}
