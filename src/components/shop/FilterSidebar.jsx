import React from 'react';
import { Filter, RotateCcw, Check, Sparkles } from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';
import { formatPrice } from '../../utils/formatters';

const SIZES = ['S', 'M', 'L', 'XL', '24', '26', '28', '30', '38mm', '41mm', '45L'];

const COLORS = [
  { name: 'Camel Tan', hex: '#C29B7F' },
  { name: 'Obsidian Noir', hex: '#1C1C1E' },
  { name: 'Sage Olive', hex: '#586249' },
  { name: 'Ecru Chalk', hex: '#EDE8DF' },
  { name: 'Deep Forest', hex: '#26382B' },
  { name: 'Cognac Saddle', hex: '#8B4513' },
  { name: 'Brushed Steel', hex: '#D8D8D8' },
];

const PRICE_PRESETS = [
  { label: 'All Prices', min: 0, max: 20000 },
  { label: 'Under ৳4,000', min: 0, max: 4000 },
  { label: '৳4,000 – ৳7,000', min: 4000, max: 7000 },
  { label: '৳7,000 – ৳10,000', min: 7000, max: 10000 },
  { label: 'Over ৳10,000', min: 10000, max: 50000 },
];

export function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
}) {
  const activePricePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.minPrice && p.max === filters.maxPrice
  ) || PRICE_PRESETS[0];

  return (
    <aside className="w-full space-y-8 text-neutral-900 select-none">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C45B32]" />
          <h3 className="font-editorial text-lg font-bold text-neutral-950">
            Refine Catalog
          </h3>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-mono text-neutral-400 hover:text-[#C45B32] transition-colors flex items-center gap-1 cursor-pointer"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
          Departments
        </span>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onFilterChange('category', 'all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
              !filters.category || filters.category === 'all'
                ? 'bg-neutral-950 text-white font-semibold'
                : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <span>All Departments</span>
            <span className="text-[10px] font-mono opacity-60">Total</span>
          </button>

          {mockCategories.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange('category', cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-950 text-white font-semibold'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] font-mono opacity-60">
                  {cat.itemCount || 12}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Presets */}
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
          Price Range
        </span>
        <div className="space-y-1.5">
          {PRICE_PRESETS.map((preset, idx) => {
            const isSelected =
              filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onFilterChange('minPrice', preset.min);
                  onFilterChange('maxPrice', preset.max);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF0EB] text-[#C45B32] font-bold border border-[#E8C0B2]'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 border border-transparent'
                }`}
              >
                <span>{preset.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#C45B32]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            Size Variant
          </span>
          {filters.size && (
            <button
              type="button"
              onClick={() => onFilterChange('size', null)}
              className="text-[10px] font-mono text-[#C45B32] underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => {
            const isSelected = filters.size === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => onFilterChange('size', isSelected ? null : size)}
                className={`min-w-9 py-1.5 px-2.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
            Color Palette
          </span>
          {filters.color && (
            <button
              type="button"
              onClick={() => onFilterChange('color', null)}
              className="text-[10px] font-mono text-[#C45B32] underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {COLORS.map((c) => {
            const isSelected = filters.color?.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => onFilterChange('color', isSelected ? null : c.name)}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-neutral-950 bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-neutral-300 flex-shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[11px] text-neutral-800 truncate font-medium">
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability & Discount Toggles */}
      <div className="space-y-3 pt-4 border-t border-neutral-200">
        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
          Stock &amp; Promotion
        </span>

        <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 cursor-pointer">
          <span className="text-xs font-medium text-neutral-800">In Stock Pieces Only</span>
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => onFilterChange('inStockOnly', e.target.checked)}
            className="w-4 h-4 text-[#C45B32] rounded focus:ring-[#C45B32] cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 cursor-pointer">
          <span className="text-xs font-medium text-neutral-800">Discounted Archive Pieces</span>
          <input
            type="checkbox"
            checked={!!filters.discountOnly}
            onChange={(e) => onFilterChange('discountOnly', e.target.checked)}
            className="w-4 h-4 text-[#C45B32] rounded focus:ring-[#C45B32] cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
}
