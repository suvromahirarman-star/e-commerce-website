import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

const TABS = [
  { id: 'all', label: 'All Bestsellers' },
  { id: 'mens', label: "Men's Atelier", categorySlug: 'mens' },
  { id: 'womens', label: "Women's Collection", categorySlug: 'womens' },
  { id: 'accessories', label: 'Accessories & Horology', categorySlug: ['accessories', 'watches', 'bags'] },
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
    <section className="py-16 sm:py-24 bg-[#FAF9F6] border-b border-neutral-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header and Animated Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Timeless Staples</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-neutral-950 tracking-tight">
              Curated Bestsellers
            </h2>
            <p className="text-sm text-neutral-500 max-w-md">
              The signature garments and leather goods most cherished by our international clientele.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-full text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="bestsellerActiveTab"
                      className="absolute inset-0 bg-neutral-950 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3 }}
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
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-neutral-300 text-neutral-800 text-xs font-mono font-semibold hover:bg-neutral-950 hover:text-white hover:border-neutral-950 transition-all shadow-xs"
          >
            <span>Explore Entire Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
