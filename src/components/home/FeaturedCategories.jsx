import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Sparkles } from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';

export function FeaturedCategories() {
  // Focus on the core 6 categories from design spec: Men, Women, Shoes, Bags, Watches, Accessories
  const displayCategories = mockCategories.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
              <span>Curated Departments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-display text-neutral-950 tracking-tight leading-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 hover:text-[#FF6B2C] transition-colors group cursor-pointer font-sans"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 text-[#FF6B2C] group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (Image-Led Editorial Composition with Subtle Orange Accents) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayCategories.map((category, index) => {
            const isFeaturedLarge = index === 0 || index === 3;
            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-500 block ${
                  isFeaturedLarge ? 'h-96 sm:h-[440px]' : 'h-80 sm:h-[440px]'
                }`}
              >
                {/* Product/Lifestyle Photography with Smooth Zoom */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay with Subtle Orange Tint on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
                
                {/* Subtle Orange Glow at Bottom on Hover */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FF6B2C]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Top Corner Pill Badge */}
                <div className="absolute top-5 left-5 z-10">
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 border border-white/40 shadow-xs">
                    Dept 0{index + 1}
                  </span>
                </div>

                {/* Circular Arrow Action Icon (Top Right) */}
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 group-hover:bg-[#FF6B2C] backdrop-blur-md text-neutral-900 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105 z-10">
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Content Overlay (Bottom) */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white space-y-2 transform transition-transform duration-300 group-hover:-translate-y-1 z-10">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                    <span className="uppercase tracking-widest text-[#FF6B2C] font-semibold group-hover:text-[#FFF1E8] transition-colors">
                      {category.itemCount || 18}+ Selected Pieces
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white group-hover:text-[#FFF8F3] transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-xs text-neutral-300 line-clamp-2 max-w-sm opacity-90 group-hover:opacity-100 transition-opacity font-sans leading-relaxed">
                    {category.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
