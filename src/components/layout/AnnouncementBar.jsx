import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles, Truck, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  {
    id: 1,
    icon: Truck,
    text: 'Complimentary white-glove express delivery on orders over ৳3,000 across Bangladesh',
    ctaText: 'Shop Catalog',
    ctaLink: '/shop',
  },
  {
    id: 2,
    icon: Sparkles,
    text: 'Autumn / Winter 2026 Collection — Handcrafted limited atelier releases now live',
    ctaText: 'Discover New Arrivals',
    ctaLink: '/shop?filter=new',
  },
  {
    id: 3,
    icon: Tag,
    text: 'Use code AURA10 at guest checkout for 10% off your entire seasonal order',
    ctaText: 'Copy Code',
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
      className="relative z-40 bg-neutral-950 text-neutral-100 border-b border-neutral-800 text-xs py-2 px-4 transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Spacer for symmetry */}
        <div className="hidden sm:block w-8" />

        {/* Animated Announcement Content */}
        <div className="flex-1 overflow-hidden h-5 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 font-medium tracking-wide text-center"
            >
              <Icon className="w-3.5 h-3.5 text-[#C45B32] flex-shrink-0" />
              <span className="truncate max-w-[280px] sm:max-w-none text-neutral-200">
                {current.text}
              </span>
              {current.ctaLink && (
                <Link
                  to={current.ctaLink}
                  className="hidden md:inline-flex items-center gap-1 text-[#D97746] hover:text-[#E8956A] underline font-semibold ml-1 cursor-pointer transition-colors"
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
          className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          aria-label="Dismiss announcement"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
