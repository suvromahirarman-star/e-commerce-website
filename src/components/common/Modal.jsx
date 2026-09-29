import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalBackdrop, modalContent } from '../../utils/animations';

export function Modal({
  isOpen,
  onClose,
  title = '',
  children,
  maxWidth = 'max-w-2xl',
  showClose = true,
}) {
  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-[#171717]/60 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`relative w-full ${maxWidth} bg-white rounded-3xl border border-[#EAEAEA] shadow-[0_20px_60px_rgba(0,0,0,0.10)] overflow-hidden my-auto z-10`}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#F2F2F2]">
                {title ? (
                  <h3 className="text-lg font-bold font-display text-[#171717] tracking-tight">
                    {title}
                  </h3>
                ) : (
                  <div />
                )}
                {showClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-[#666666] hover:text-[#FF6B2C] hover:bg-[#FFF8F3] transition-colors cursor-pointer"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
export default Modal;
