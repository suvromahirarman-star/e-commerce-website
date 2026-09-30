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
  Flame,
} from 'lucide-react';
import { slideDrawerLeft, modalBackdrop } from '../../utils/animations';
import { mockCategories } from '../../data/mockCategories';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export function MobileNavDrawer({ isOpen, onClose, onOpenSearch }) {
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const { wishlistCount } = useWishlist();
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
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
              <div className="flex items-center justify-between p-5 border-b border-[#EAEAEA]">
                <Link to="/" onClick={onClose} className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-[#171717] text-white flex items-center justify-center font-display font-extrabold text-base">
                    A
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold font-display tracking-tight text-neutral-950 leading-none">
                      AURA<span className="text-[#FF6B2C]">.</span>
                    </span>
                    <span className="text-[8px] tracking-[0.25em] uppercase font-mono text-neutral-400 font-semibold leading-none mt-0.5">
                      Studio
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-[#FFF8F3] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search Button */}
              <div className="p-4 border-b border-[#F2F2F2]">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FFF8F3] border border-[#FF6B2C]/20 text-neutral-700 rounded-xl text-xs font-medium hover:border-[#FF6B2C] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#FF6B2C]" />
                    <span>Search catalog...</span>
                  </div>
                  <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-neutral-400 border border-[#EAEAEA]">
                    Search
                  </kbd>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="p-4 space-y-1">
                <Link
                  to="/"
                  onClick={onClose}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-900 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] transition-colors"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>

                <Link
                  to="/shop"
                  onClick={onClose}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-900 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] transition-colors"
                >
                  <span>All Products</span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </Link>

                <Link
                  to="/shop?filter=new"
                  onClick={onClose}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-neutral-900 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF6B2C]" />
                    <span>New Arrivals</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#FFF1E8] text-[#FF6B2C] font-bold">
                    NEW
                  </span>
                </Link>

                <Link
                  to="/shop?filter=sale"
                  onClick={onClose}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#FF6B2C] hover:bg-[#FFF8F3] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF6B2C]" />
                    <span>Seasonal Deals</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#FF6B2C] text-white font-bold">
                    SALE
                  </span>
                </Link>

                {/* Categories Accordion */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((prev) => !prev)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold text-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    <span>Categories</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        categoriesOpen ? 'rotate-180 text-[#FF6B2C]' : ''
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
                          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-[#FF6B2C] hover:bg-[#FFF8F3] transition-colors"
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
            <div className="p-4 border-t border-[#EAEAEA] bg-[#FFF8F3]/40 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 p-2.5 bg-white border border-[#EAEAEA] rounded-xl text-xs font-semibold text-neutral-800 hover:border-[#FF6B2C] hover:text-[#FF6B2C] transition-colors shadow-2xs"
                >
                  <Heart className="w-4 h-4 text-[#FF6B2C]" />
                  <span>Wishlist ({wishlistCount})</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsCartOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 p-2.5 bg-[#FF6B2C] hover:bg-[#E9571F] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Bag ({itemCount})</span>
                </button>
              </div>

              <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-500 font-medium px-1">
                <Link to="/about" onClick={onClose} className="hover:text-[#FF6B2C]">
                  Our Story
                </Link>
                <span>•</span>
                <Link to="/contact" onClick={onClose} className="hover:text-[#FF6B2C]">
                  Contact
                </Link>
                <span>•</span>
                <Link to="/faq" onClick={onClose} className="hover:text-[#FF6B2C]">
                  FAQs
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
