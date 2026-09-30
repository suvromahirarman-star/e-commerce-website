import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles, Truck, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: Truck,
    text: 'FREE EXPRESS SHIPPING ON ORDERS OVER ৳3,000 ACROSS BANGLADESH',
    ctaText: 'Shop Catalog',
    ctaLink: '/shop',
  },
  {
    id: 2,
    icon: Sparkles,
    text: 'NEW ARRIVALS 2026 — DISCOVER THE SEASON EDIT WITH ORIGINAL SILHOUETTES',
    ctaText: 'Explore Now',
    ctaLink: '/shop?filter=new',
  },
  {
    id: 3,
    icon: Tag,
    text: 'USE CODE AURA10 AT GUEST CHECKOUT FOR 10% OFF YOUR INAUGURAL ORDER',
    ctaText: 'Copy Voucher',
    ctaLink: '/shop',
  },
];

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(() => {
    try {
      return sessionStorage.getItem('aura_announcement_dismissed') !== 'true';
    } catch (e) {
      return true;
    }
  });

  // Cycle through announcements every 5 seconds
  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isVisible]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem('aura_announcement_dismissed', 'true');
    } catch (e) {
      // Ignore
    }
  };

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <aside
      aria-label="Store Announcement"
      className="relative z-40 bg-[#FF6B2C] text-white text-[11px] sm:text-xs py-2 px-3 sm:px-4 shadow-xs"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Spacer for symmetrical optical alignment */}
        <div className="hidden sm:block w-7" />

        {/* Animated Announcement Carousel */}
        <div className="flex-1 overflow-hidden h-5 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex items-center gap-2 font-medium tracking-wider uppercase text-center"
            >
              <Icon className="w-3.5 h-3.5 text-white flex-shrink-0" />
              <span className="truncate max-w-[260px] sm:max-w-none text-white font-medium">
                {current.text}
              </span>
              {current.ctaLink && (
                <Link
                  to={current.ctaLink}
                  className="hidden md:inline-flex items-center gap-1 text-white hover:text-white/90 underline font-semibold ml-1 cursor-pointer transition-colors"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="text-white/80 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          aria-label="Dismiss announcement"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
