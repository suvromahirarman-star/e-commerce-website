import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronRight,
  ChevronDown,
  Search,
  ShoppingBag,
  Heart,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { slideDrawerLeft, modalBackdrop } from '../../utils/animations';
import { mockCategories } from '../../data/mockCategories';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export function MobileNavDrawer({ isOpen, onClose, onOpenSearch }) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const { wishlistCount } = useWishlist();
  const { itemCount, setIsCartOpen } = useCart();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex lg:hidden">
        {/* Backdrop */}
        <motion.div
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
        />

        {/* Drawer Window */}
        <motion.div
          variants={slideDrawerLeft}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
        >
          {/* Top Bar */}
          <div>
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <Link to="/" onClick={onClose} className="flex flex-col">
                <span className="text-2xl font-bold font-editorial tracking-wider text-neutral-950">
                  AURA
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase font-mono text-neutral-500 font-semibold -mt-1">
                  Studio
                </span>
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Button */}
            <div className="p-4 border-b border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-100 text-neutral-600 rounded-xl text-xs font-medium hover:bg-neutral-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-neutral-500" />
                  <span>Search products...</span>
                </div>
                <kbd className="text-[10px] font-mono px-1 rounded bg-white text-neutral-400 border border-neutral-200">
                  Search
                </kbd>
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1">
              <Link
                to="/"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              <Link
                to="/shop"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <span>All Products</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              <Link
                to="/shop?filter=new"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C45B32]" />
                  <span>New Arrivals</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-white font-bold">
                  2026
                </span>
              </Link>

              <Link
                to="/shop?filter=sale"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-[#C45B32] hover:bg-rose-50 transition-colors"
              >
                <span>Seasonal Deals</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                  Sale
                </span>
              </Link>

              {/* Categories Accordion */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setCategoriesOpen((prev) => !prev)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <span>Categories</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      categoriesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {categoriesOpen && (
                  <div className="pl-3 pr-1 py-1 space-y-0.5">
                    {mockCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[11px] text-neutral-400 font-mono">
                          {cat.itemCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Bottom Info & Shortcuts */}
          <div className="p-4 border-t border-neutral-100 bg-neutral-50/70 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="flex items-center justify-center gap-2 p-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 hover:border-neutral-900 transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsCartOpen(true);
                }}
                className="flex items-center justify-center gap-2 p-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Bag ({itemCount})</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
              <Link to="/about" onClick={onClose} className="hover:text-neutral-900">
                Our Story
              </Link>
              <span>•</span>
              <Link to="/contact" onClick={onClose} className="hover:text-neutral-900">
                Customer Care
              </Link>
              <span>•</span>
              <Link to="/faq" onClick={onClose} className="hover:text-neutral-900">
                FAQs
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
