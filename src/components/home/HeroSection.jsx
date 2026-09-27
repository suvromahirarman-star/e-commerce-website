import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Star } from 'lucide-react';
import { Button, Badge } from '../common';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export function HeroSection({ heroProduct }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleQuickAdd = () => {
    if (heroProduct) {
      addToCart(heroProduct, 1);
      showToast(`Added "${heroProduct.name}" to your bag`, 'success');
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-neutral-200/80 pt-6 pb-16 sm:py-20 lg:py-24">
      {/* Subtle architectural background grid / watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
        <span className="text-[28vw] font-editorial font-bold text-neutral-900 leading-none tracking-tighter">
          AURA
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Seasonal Kicker */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-mono font-medium tracking-wide shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C45B32]" />
              <span>Autumn / Winter Atelier '26</span>
              <span className="w-1 h-1 rounded-full bg-neutral-400" />
              <span className="text-neutral-300">Limited Release</span>
            </motion.div>

            {/* Editorial Bold Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-editorial text-neutral-950 tracking-tight leading-[1.08]">
                Designed for the <br />
                <span className="italic font-normal text-[#C45B32]">way you live.</span>
              </h1>
            </motion.div>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed font-sans"
            >
              Quiet luxury tailored with purpose. Discover sculptural silhouettes, traceable Australian merino wool, and hand-finished European outerwear engineered for enduring elegance.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link to="/shop">
                <Button variant="primary" size="lg" icon={ArrowRight}>
                  Explore The Collection
                </Button>
              </Link>

              <Link to="/category/mens">
                <Button variant="outline" size="lg">
                  Men's Atelier
                </Button>
              </Link>
            </motion.div>

            {/* Trust Metrics & Editorial Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 border-t border-neutral-200/90 grid grid-cols-3 gap-4 text-xs font-mono text-neutral-600"
            >
              <div>
                <div className="text-base sm:text-xl font-bold text-neutral-900 font-editorial">
                  100%
                </div>
                <div className="text-[11px] text-neutral-500 pt-0.5">Traceable Merino</div>
              </div>
              <div className="border-l border-neutral-200 pl-4">
                <div className="text-base sm:text-xl font-bold text-neutral-900 font-editorial">
                  48-Hour
                </div>
                <div className="text-[11px] text-neutral-500 pt-0.5">Nationwide Express</div>
              </div>
              <div className="border-l border-neutral-200 pl-4">
                <div className="text-base sm:text-xl font-bold text-neutral-900 font-editorial">
                  14-Day
                </div>
                <div className="text-[11px] text-neutral-500 pt-0.5">Doorstep Returns</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Visual Composition */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Primary Large Editorial Portrait Frame */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-100">
                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85"
                  alt="AURA Autumn Winter Atelier 2026 Collection"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient vignette for legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pointer-events-none" />

                {/* Editorial Tag at bottom */}
                <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#E8956A]">
                      Look No. 01
                    </span>
                    <p className="text-sm font-editorial font-medium">Soren Double-Breasted Trench</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md">
                    ৳8,900
                  </span>
                </div>
              </div>

              {/* Floating Badge (Top Right) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-4 -right-4 sm:-right-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-xl border border-neutral-100 flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF0EB] flex items-center justify-center text-[#C45B32]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                    Atelier Craft
                  </div>
                  <div className="text-xs font-bold text-neutral-900 font-editorial">
                    Porto Edition • 480gsm
                  </div>
                </div>
              </motion.div>

              {/* Floating Interactive Product Card (Bottom Left) */}
              {heroProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute -bottom-6 -left-4 sm:-left-8 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-neutral-200/80 max-w-[280px] sm:max-w-xs z-20"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={heroProduct.images[0]}
                      alt={heroProduct.name}
                      className="w-12 h-14 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#C45B32] font-semibold block truncate">
                        Quick Add Hero
                      </span>
                      <h4 className="text-xs font-semibold text-neutral-900 truncate">
                        {heroProduct.name}
                      </h4>
                      <div className="text-xs font-mono font-bold text-neutral-950 pt-0.5">
                        {formatPrice(heroProduct.price)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className="p-2.5 rounded-xl bg-neutral-950 text-white hover:bg-[#C45B32] transition-colors cursor-pointer"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
