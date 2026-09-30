import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

export function NewArrivalsCarousel({ products = [], onQuickView }) {
  const scrollContainerRef = useRef(null);

  // Filter or prioritize new arrival products
  const newArrivals = products
    .filter((p) => p.badge === 'New' || p.isNew || p.id)
    .slice(0, 8);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!newArrivals || newArrivals.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-[#FFF8F3]/50 border-b border-[#EAEAEA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
              <span>Autumn / Winter 2026</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-display text-neutral-950 tracking-tight leading-tight">
              Fresh New Arrivals
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/shop?filter=new"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-[#FF6B2C] transition-colors font-sans"
            >
              <span>Explore All New</span>
              <ArrowRight className="w-4 h-4 text-[#FF6B2C]" />
            </Link>

            {/* Minimal Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#FF6B2C] hover:text-[#FF6B2C] text-neutral-700 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#FF6B2C] hover:text-[#FF6B2C] text-neutral-700 flex items-center justify-center transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {newArrivals.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[310px] flex-shrink-0 snap-start"
            >
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="sm:hidden text-center pt-2">
          <Link
            to="/shop?filter=new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6B2C] font-sans"
          >
            <span>Explore All New Arrivals</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
