import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { mockCategories } from '../../data/mockCategories';

export function Navbar({ onOpenSearch, onOpenMobileMenu }) {
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  // Detect scroll to toggle sticky glass background and subtle elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsCategoryMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#EAEAEA] shadow-[0_4px_14px_rgba(0,0,0,0.04)] py-3'
          : 'bg-white border-b border-[#EAEAEA] py-4 sm:py-4.5'
      }`}
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile Menu & Search Icon (Left on mobile) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 rounded-xl text-neutral-900 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] transition-colors cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-neutral-900 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] rounded-xl transition-colors cursor-pointer ml-1"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Left: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `relative text-xs uppercase tracking-wider font-semibold py-1.5 transition-colors group ${
                  isActive ? 'text-[#FF6B2C]' : 'text-neutral-800 hover:text-[#FF6B2C]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Home</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF6B2C] rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `relative text-xs uppercase tracking-wider font-semibold py-1.5 transition-colors group ${
                  isActive ? 'text-[#FF6B2C]' : 'text-neutral-800 hover:text-[#FF6B2C]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>Shop</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF6B2C] rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 text-xs uppercase tracking-wider font-semibold py-1.5 cursor-pointer transition-colors ${
                  isCategoryMenuOpen ? 'text-[#FF6B2C]' : 'text-neutral-800 hover:text-[#FF6B2C]'
                }`}
                onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoryMenuOpen ? 'rotate-180 text-[#FF6B2C]' : 'text-neutral-400'
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.16, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-[#EAEAEA] overflow-hidden py-3 z-50"
                  >
                    <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-[#F2F2F2] flex items-center justify-between">
                      <span>Curated Categories</span>
                      <Sparkles className="w-3 h-3 text-[#FF6B2C]" />
                    </div>

                    <div className="py-1">
                      {mockCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.slug}`}
                          className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-neutral-800 hover:text-[#FF6B2C] hover:bg-[#FFF8F3] transition-colors"
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {cat.itemCount} items
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2 mt-1 border-t border-[#F2F2F2] px-4">
                      <Link
                        to="/shop"
                        className="flex items-center justify-between text-xs font-semibold text-[#FF6B2C] hover:text-[#E9571F] transition-colors py-1"
                      >
                        <span>View All Products</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink
              to="/shop?filter=new"
              className={({ isActive }) =>
                `relative text-xs uppercase tracking-wider font-semibold py-1.5 transition-colors group flex items-center gap-1.5 ${
                  isActive ? 'text-[#FF6B2C]' : 'text-neutral-800 hover:text-[#FF6B2C]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>New Arrivals</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B2C]" />
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FF6B2C] rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>

            <NavLink
              to="/shop?filter=sale"
              className={({ isActive }) =>
                `relative text-xs uppercase tracking-wider font-semibold py-1.5 transition-colors group flex items-center gap-1 text-[#FF6B2C] hover:text-[#E9571F]`
              }
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Deals</span>
            </NavLink>
          </nav>

          {/* Center: Brand Identity Logo (White & Orange Theme) */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 group cursor-pointer"
            >
              <span className="w-8 h-8 rounded-xl bg-[#171717] text-white flex items-center justify-center font-display font-extrabold text-lg tracking-tighter group-hover:bg-[#FF6B2C] transition-colors shadow-xs">
                A
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xl sm:text-2xl font-bold font-display tracking-tight text-neutral-950 group-hover:text-[#FF6B2C] transition-colors leading-none">
                  AURA<span className="text-[#FF6B2C]">.</span>
                </span>
                <span className="text-[8px] tracking-[0.25em] uppercase font-mono text-neutral-400 font-semibold leading-none mt-0.5">
                  Studio
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Actions (Search, Wishlist, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Capsule (Desktop) */}
            <button
              type="button"
              onClick={onOpenSearch}
              aria-label="Search products"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-500 hover:text-neutral-950 bg-[#F8F8F8] hover:bg-[#FFF8F3] hover:border-[#FF6B2C]/40 border border-[#EAEAEA] transition-all cursor-pointer"
              title="Search products (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FF6B2C]" />
              <span className="text-neutral-500">Search products...</span>
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white border border-[#EAEAEA] text-neutral-400">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist Button */}
            <Link
              to="/wishlist"
              className="relative p-2 text-neutral-800 hover:text-[#FF6B2C] hover:bg-[#FFF8F3] rounded-xl transition-colors cursor-pointer"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-[#FF6B2C] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono leading-none shadow-xs"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-neutral-950 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] rounded-xl transition-colors cursor-pointer group"
              aria-label="Shopping bag"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-900 group-hover:text-[#FF6B2C] transition-colors" />
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider font-display">
                Bag
              </span>

              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={itemCount}
                  className="w-4 h-4 bg-[#FF6B2C] text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono leading-none shadow-xs"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
