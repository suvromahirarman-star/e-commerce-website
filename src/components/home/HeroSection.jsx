import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShoppingBag, Star, ShieldCheck, Truck } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-white border-b border-[#EAEAEA] pt-8 pb-16 sm:py-20 lg:py-24">
      {/* Subtle Warm Secondary BG Glow in corner (Orange Strategic Accent) */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFF1E8]/70 rounded-full blur-3xl pointer-events-none -mr-40 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-[#FFF8F3] rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          
          {/* Left Column: Asymmetric Editorial Composition (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Small Orange Category Badge */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-[#FF6B2C] text-xs font-mono font-semibold tracking-wider uppercase shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
              <span>Autumn / Winter 2026 Collection</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
              <span className="text-[#C94716] font-bold">Limited Drop</span>
            </motion.div>

            {/* Large Editorial Headline (56-76px Desktop, tight tracking, Manrope) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
              className="space-y-1"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold font-display text-neutral-950 tracking-tight leading-[1.06]">
                Modern silhouettes, <br />
                <span className="text-[#FF6B2C] relative inline-block">
                  crafted with intention.
                  {/* Subtle decorative curved underline */}
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[#FF6B2C]/30"
                    viewBox="0 0 300 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 9.5C65.5 3 189.5 2 297.5 9.5"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
            </motion.div>

            {/* Supporting Copy (16-17px, line height 1.6-1.7, #666666, Inter) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
              className="text-base sm:text-lg text-[#666666] max-w-xl leading-relaxed font-sans"
            >
              Elevate your everyday rotation with architectural tailoring, traceable Australian merino wool, and hand-finished European outerwear engineered for enduring comfort.
            </motion.p>

            {/* CTAs: Primary Orange & Tactile Secondary Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-sm font-semibold tracking-wide uppercase transition-all duration-200 shadow-lg shadow-[#FF6B2C]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/category/mens"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-[#FFF8F3] text-neutral-900 hover:text-[#FF6B2C] border border-[#EAEAEA] hover:border-[#FF6B2C]/40 text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-2xs hover:-translate-y-0.5"
              >
                <span>Men's Atelier</span>
              </Link>
            </motion.div>

            {/* Social Proof & Trust Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="pt-6 sm:pt-8 border-t border-[#EAEAEA] grid grid-cols-3 gap-4 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-neutral-950 font-bold font-display text-lg sm:text-xl">
                  <span>4.9</span>
                  <div className="flex text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  </div>
                </div>
                <div className="text-[11px] text-[#666666]">Over 12,000+ Patrons</div>
              </div>

              <div className="border-l border-[#EAEAEA] pl-4 sm:pl-6 space-y-1">
                <div className="text-neutral-950 font-bold font-display text-lg sm:text-xl">
                  48-Hour
                </div>
                <div className="text-[11px] text-[#666666]">Dhaka &amp; Hub Express</div>
              </div>

              <div className="border-l border-[#EAEAEA] pl-4 sm:pl-6 space-y-1">
                <div className="text-neutral-950 font-bold font-display text-lg sm:text-xl">
                  100% Free
                </div>
                <div className="text-[11px] text-[#666666]">Orders Over ৳3,000</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial Visual Composition (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              {/* Subtle Geometric Orange Accent Frame Behind Image */}
              <div className="absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-tr from-[#FFF1E8] to-[#FFF8F3] border border-[#FF6B2C]/20 -rotate-2 transform pointer-events-none" />

              {/* Primary Large Editorial Portrait Frame */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] border-2 border-white bg-[#F8F8F8] z-10">
                <img
                  src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85"
                  alt="AURA Autumn Winter Atelier 2026 Collection"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Subtle dark gradient at bottom for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent pointer-events-none" />

                {/* Editorial Tag at bottom */}
                <div className="absolute bottom-5 left-5 right-5 text-white flex items-center justify-between z-20">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6B2C] font-bold block">
                      Look No. 01 • Studio Release
                    </span>
                    <p className="text-sm font-display font-semibold">Soren Double-Breasted Trench</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                    ৳8,900
                  </span>
                </div>
              </div>

              {/* Floating Badge (Top Right) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="absolute -top-4 -right-3 sm:-right-5 bg-white p-3.5 sm:p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#EAEAEA] flex items-center gap-3 z-30"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E8] flex items-center justify-center text-[#FF6B2C]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-[#999999] uppercase tracking-wider font-semibold">
                    Original Craft
                  </div>
                  <div className="text-xs font-bold text-neutral-950 font-display">
                    Porto Edition • 480gsm
                  </div>
                </div>
              </motion.div>

              {/* Floating Interactive Quick Add Hero Product Card (Bottom Left) */}
              {heroProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="absolute -bottom-5 -left-3 sm:-left-7 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.10)] border border-[#EAEAEA] max-w-[270px] sm:max-w-xs z-30"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={heroProduct.images[0]}
                      alt={heroProduct.name}
                      className="w-12 h-14 object-cover rounded-xl bg-[#F8F8F8] border border-[#EAEAEA] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#FF6B2C] font-bold block truncate">
                        Quick Add Hero
                      </span>
                      <h4 className="text-xs font-semibold text-neutral-950 truncate font-display">
                        {heroProduct.name}
                      </h4>
                      <div className="text-xs font-mono font-bold text-neutral-950 pt-0.5">
                        {formatPrice(heroProduct.price)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className="p-2.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white transition-all shadow-sm shadow-[#FF6B2C]/30 hover:scale-105 active:scale-95 cursor-pointer"
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
