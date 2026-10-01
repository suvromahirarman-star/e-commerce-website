import React from 'react';
import { X, Sparkles } from 'lucide-react';

export function ActiveFilterPills({ filters, onRemoveFilter, onClearAll }) {
  const pills = [];

  if (filters.category && filters.category !== 'all') {
    pills.push({ key: 'category', label: `Category: ${filters.category}` });
  }

  if (filters.minPrice || filters.maxPrice) {
    if (filters.minPrice > 0 || (filters.maxPrice && filters.maxPrice < 50000)) {
      pills.push({
        key: 'price',
        label: `৳${filters.minPrice || 0} – ৳${filters.maxPrice || 'Max'}`,
      });
    }
  }

  if (filters.size) {
    pills.push({ key: 'size', label: `Size: ${filters.size}` });
  }

  if (filters.color) {
    pills.push({ key: 'color', label: `Color: ${filters.color}` });
  }

  if (filters.inStockOnly) {
    pills.push({ key: 'inStockOnly', label: 'In Stock Only' });
  }

  if (filters.discountOnly) {
    pills.push({ key: 'discountOnly', label: 'Sale Archive' });
  }

  if (filters.search) {
    pills.push({ key: 'search', label: `Search: "${filters.search}"` });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-1 pb-3">
      <span className="text-[11px] font-mono text-[#999999] uppercase tracking-wider font-semibold">
        Active Filters:
      </span>

      {pills.map((pill) => (
        <span
          key={pill.key}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/25 text-[#FF6B2C] text-xs font-mono font-medium shadow-2xs"
        >
          <span>{pill.label}</span>
          <button
            type="button"
            onClick={() => onRemoveFilter(pill.key)}
            className="text-[#FF6B2C]/70 hover:text-[#C94716] cursor-pointer p-0.5 rounded-full hover:bg-[#FFE0CE] transition-colors"
            aria-label={`Remove filter ${pill.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-mono font-bold text-[#FF6B2C] hover:text-[#E9571F] hover:underline cursor-pointer ml-1 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
}
