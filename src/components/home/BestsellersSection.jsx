import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

const TABS = [
  { id: 'all', label: 'All Bestsellers' },
  { id: 'mens', label: "Men's Atelier", categorySlug: 'mens' },
  { id: 'womens', label: "Women's Collection", categorySlug: 'womens' },
  { id: 'accessories', label: 'Accessories', categorySlug: ['accessories', 'watches', 'bags'] },
];

export function BestsellersSection({ products, onQuickView }) {
  const [activeTab, setActiveTab] = useState('all');

  // Filter products based on selected tab
  const filteredProducts = products.filter((prod) => {
    if (activeTab === 'all') return prod.isBestseller || prod.isFeatured;
    const tabConfig = TABS.find((t) => t.id === activeTab);
    if (!tabConfig) return true;
    if (Array.isArray(tabConfig.categorySlug)) {
      return tabConfig.categorySlug.includes(prod.categorySlug);
    }
    return prod.categorySlug === tabConfig.categorySlug;
  }).slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header and Animated Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#F2F2F2] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
              <span>Timeless Staples</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-display text-neutral-950 tracking-tight leading-tight">
              Curated Bestsellers
            </h2>
            <p className="text-sm text-[#666666] max-w-md font-sans">
              The signature garments and artisanal leather goods most cherished by our international clientele.
            </p>
          </div>

          {/* Animated Category Tabs (Orange Text + Orange Animated Underline) */}
          <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar pb-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-2.5 px-2 text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#FF6B2C]'
                      : 'text-[#666666] hover:text-neutral-950'
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="bestsellerTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B2C] rounded-full"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Staggered Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <ProductCard product={product} onQuickView={onQuickView} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Section Footer Link */}
        <div className="text-center pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-[#EAEAEA] text-neutral-900 text-xs font-semibold uppercase tracking-wider hover:border-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FFF8F3] transition-all duration-200 shadow-2xs hover:-translate-y-0.5"
          >
            <span>Explore Entire Archive</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF6B2C]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
