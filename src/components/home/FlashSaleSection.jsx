import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Clock, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
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
    <section className="py-16 sm:py-24 bg-neutral-950 text-white relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C45B32]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Flash Sale Header & Countdown Container */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4 border-b border-neutral-800">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-medium tracking-wide">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Limited Atelier Window</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold font-editorial tracking-tight">
              Seasonal Flash Event
            </h2>

            <p className="text-sm text-neutral-400 max-w-lg">
              Exceptional archive pieces discounted up to 35%. Once allocated vault quantities deplete, garments revert to catalog pricing.
            </p>
          </div>

          {/* Countdown Blocks */}
          <div className="flex items-center gap-2 sm:gap-3 font-mono">
            {[
              { label: 'Days', value: formatDigit(timeLeft.days) },
              { label: 'Hours', value: formatDigit(timeLeft.hours) },
              { label: 'Mins', value: formatDigit(timeLeft.minutes) },
              { label: 'Secs', value: formatDigit(timeLeft.seconds) },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3 sm:p-4 text-center min-w-16 sm:min-w-20 shadow-inner">
                  <span className="block text-2xl sm:text-3xl font-bold text-white font-mono tracking-tight">
                    {item.value}
                  </span>
                  <span className="block text-[10px] uppercase tracking-wider text-neutral-400 mt-0.5">
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <span className="text-xl font-bold text-neutral-600">:</span>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C45B32]" />
            <span>Guaranteed dispatch within 24 hours on all Flash Sale orders</span>
          </div>

          <Link
            to="/shop?filter=flash"
            className="inline-flex items-center gap-1.5 text-white hover:text-[#E8956A] font-semibold transition-colors group cursor-pointer"
          >
            <span>View All Flash Offers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
