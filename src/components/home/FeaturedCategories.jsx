import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { mockCategories } from '../../data/mockCategories';

export function FeaturedCategories() {
  const displayCategories = mockCategories.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              Curated Departments
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-neutral-950 tracking-tight">
              Explore by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-700 hover:text-[#C45B32] transition-colors group cursor-pointer"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (Editorial asymmetric mosaic + mobile touch scroll) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category, index) => {
            const isTall = index === 0 || index === 3;
            return (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className={`group relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/60 shadow-xs hover:shadow-xl transition-all duration-500 block ${
                  isTall ? 'h-96 sm:h-[420px]' : 'h-80 sm:h-[420px]'
                }`}
              >
                {/* Background Image with Zoom */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-95"
                  loading="lazy"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent transition-opacity duration-300 group-hover:opacity-80" />

                {/* Arrow Action Icon (Top Right) */}
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight className="w-5 h-5" />
                </div>

                {/* Content Overlay (Bottom) */}
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white space-y-2 transform transition-transform duration-300 group-hover:-translate-y-1">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                    <span className="uppercase tracking-widest text-[#E8956A]">
                      Collection 0{index + 1}
                    </span>
                    <span>{category.itemCount || 18}+ Pieces</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold font-editorial tracking-tight group-hover:text-white transition-colors">
                    {category.name}
                  </h3>

                  <p className="text-xs text-neutral-300 line-clamp-2 max-w-sm opacity-90 group-hover:opacity-100 transition-opacity">
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
