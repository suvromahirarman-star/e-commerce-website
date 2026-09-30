import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Flame } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';

export function FlashSaleSection({ flashProducts, onQuickView }) {
  // 48-hour countdown target timer
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 14,
    minutes: 36,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  const displayProducts = flashProducts && flashProducts.length > 0
    ? flashProducts.slice(0, 4)
    : [];

  return (
    <section className="py-16 sm:py-24 bg-[#FFF8F3] border-b border-[#EAEAEA] relative overflow-hidden">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#FFF1E8] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Flash Sale Header & Animated Countdown Container */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-6 border-b border-[#EAEAEA]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/30 text-[#FF6B2C] text-xs font-mono font-bold tracking-wider uppercase">
              <Flame className="w-3.5 h-3.5 text-[#FF6B2C]" />
              <span>Limited Atelier Window</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold font-display text-neutral-950 tracking-tight">
              Seasonal <span className="text-[#FF6B2C]">Flash Event</span>
            </h2>

            <p className="text-sm text-[#666666] max-w-lg font-sans">
              Archive silhouettes discounted up to 35%. Once allocated vault quantities deplete, garments revert to full catalog pricing.
            </p>
          </div>

          {/* Clean White & Orange Countdown Blocks */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono">
            {[
              { label: 'Days', value: formatDigit(timeLeft.days) },
              { label: 'Hours', value: formatDigit(timeLeft.hours) },
              { label: 'Minutes', value: formatDigit(timeLeft.minutes) },
              { label: 'Seconds', value: formatDigit(timeLeft.seconds) },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3">
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-3 sm:p-4 text-center min-w-16 sm:min-w-20 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={item.value}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="block text-2xl sm:text-3xl font-extrabold text-[#FF6B2C] font-mono tracking-tight"
                    >
                      {item.value}
                    </motion.span>
                  </AnimatePresence>
                  <span className="block text-[10px] uppercase tracking-wider text-[#999999] font-medium mt-0.5">
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <span className="text-xl font-bold text-[#FF6B2C]">:</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Flash Sale Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>

        {/* Banner Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs font-mono text-[#666666] border-t border-[#EAEAEA]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF6B2C]" />
            <span>Guaranteed dispatch within 24 hours on all Flash Sale orders</span>
          </div>

          <Link
            to="/shop?filter=flash"
            className="inline-flex items-center gap-1.5 text-neutral-950 hover:text-[#FF6B2C] font-semibold transition-colors group cursor-pointer"
          >
            <span>View All Flash Offers</span>
            <ArrowRight className="w-4 h-4 text-[#FF6B2C] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
