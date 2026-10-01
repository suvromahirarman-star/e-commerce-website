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
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#EAEAEA] bg-white hover:border-[#FF6B2C]/40 text-neutral-800 text-xs font-mono font-medium transition-colors shadow-2xs cursor-pointer"
        aria-expanded={isOpen}
      >
        <ArrowDownUp className="w-3.5 h-3.5 text-[#FF6B2C]" />
        <span className="text-[#666666]">Sort:</span>
        <span className="font-semibold text-neutral-950">{selectedOption.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
            isOpen ? 'rotate-180 text-[#FF6B2C]' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-[#EAEAEA] shadow-[0_12px_36px_rgba(0,0,0,0.08)] py-1.5 z-30 overflow-hidden">
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
                    ? 'bg-[#FFF1E8] text-[#FF6B2C] font-bold'
                    : 'text-neutral-700 hover:bg-[#FFF8F3] hover:text-[#FF6B2C]'
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#FF6B2C]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
