import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ArrowDownUp, Check } from 'lucide-react';

const SORT_OPTIONS = [
  { id: 'most-popular', label: 'Most Popular' },
  { id: 'newest', label: 'New Arrivals' },
  { id: 'price-low-to-high', label: 'Price: Low to High' },
  { id: 'price-high-to-low', label: 'Price: High to Low' },
  { id: 'highest-rated', label: 'Highest Rated' },
];

export function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = SORT_OPTIONS.find((o) => o.id === value) || SORT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-400 text-neutral-800 text-xs font-mono font-medium transition-colors shadow-2xs cursor-pointer"
        aria-expanded={isOpen}
      >
        <ArrowDownUp className="w-3.5 h-3.5 text-neutral-500" />
        <span className="text-neutral-500">Sort:</span>
        <span className="font-semibold text-neutral-950">{selectedOption.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-neutral-200/90 shadow-xl py-1.5 z-30">
          {SORT_OPTIONS.map((option) => {
            const isSelected = option.id === selectedOption.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#FAF0EB] text-[#C45B32] font-bold'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#C45B32]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
