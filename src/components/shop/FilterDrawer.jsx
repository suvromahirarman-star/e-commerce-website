import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden lg:hidden flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative max-w-xs sm:max-w-md w-full bg-[#FAF9F6] h-full shadow-2xl z-10 flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-editorial text-neutral-950">
                Filter Catalog
              </h2>
              <span className="text-xs text-neutral-500 font-mono">
                {totalResults} matching pieces
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 cursor-pointer"
              aria-label="Close filters"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Filter Body */}
          <div className="p-6 overflow-y-auto flex-1">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              onResetFilters={onResetFilters}
              totalResults={totalResults}
            />
          </div>

          {/* Footer Action */}
          <div className="p-4 sm:p-6 bg-white border-t border-neutral-200 flex items-center gap-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="py-3 px-4 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-mono font-semibold hover:bg-neutral-100 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-[#C45B32] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Show {totalResults} Results</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
