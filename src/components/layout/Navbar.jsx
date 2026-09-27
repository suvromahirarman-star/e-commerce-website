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

  // Detect scroll to toggle sticky glass background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setIsCategoryMenuOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }) =>
    `relative text-xs uppercase tracking-wider font-semibold py-1.5 transition-colors duration-200 ${
      isActive
        ? 'text-neutral-950 font-bold'
        : 'text-neutral-600 hover:text-neutral-950'
    }`;

  return (
    <header
      className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF9F6]/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs py-3'
          : 'bg-[#FAF9F6] border-b border-neutral-200/50 py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button (Left on mobile) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="p-2 -ml-2 rounded-lg text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenSearch}
              className="p-2 text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer ml-1"
              aria-label="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Desktop Left: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/shop" className={navLinkClass}>
              Shop
            </NavLink>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-neutral-600 hover:text-neutral-950 py-1.5 cursor-pointer transition-colors"
                onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
              >
                <span>Categories</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isCategoryMenuOpen ? 'rotate-180 text-neutral-950' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isCategoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden py-3 z-50"
                  >
                    <div className="px-4 py-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 border-b border-neutral-100 flex items-center justify-between">
                      <span>Curated Departments</span>
                      <Sparkles className="w-3 h-3 text-[#C45B32]" />
                    </div>

                    <div className="py-1">
                      {mockCategories.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/category/${cat.slug}`}
                          className="flex items-center justify-between px-4 py-2 text-xs font-medium text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50 transition-colors"
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {cat.itemCount} items
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2 mt-1 border-t border-neutral-100 px-4">
                      <Link
                        to="/shop"
                        className="flex items-center justify-between text-xs font-semibold text-[#C45B32] hover:text-[#963A1E] transition-colors py-1"
                      >
                        <span>View All Collections</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/shop?filter=new" className={navLinkClass}>
              New Arrivals
            </NavLink>
            <NavLink to="/shop?filter=sale" className={navLinkClass}>
              <span className="text-[#C45B32]">Deals</span>
            </NavLink>
          </nav>

          {/* Center: Brand Editorial Logo */}
          <div className="text-center">
            <Link
              to="/"
              className="inline-flex flex-col items-center group cursor-pointer"
            >
              <span className="text-2xl sm:text-3xl font-bold font-editorial tracking-wider text-neutral-950 group-hover:text-neutral-800 transition-colors">
                AURA
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase font-mono text-neutral-500 font-semibold -mt-1 group-hover:text-neutral-900 transition-colors">
                Studio
              </span>
            </Link>
          </div>

          {/* Right: Actions (Search, Wishlist, Cart) */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search (Desktop) */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-500 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 transition-colors cursor-pointer"
              title="Search products (Ctrl + K)"
            >
              <Search className="w-3.5 h-3.5 text-neutral-600" />
              <span>Search...</span>
              <kbd className="text-[10px] font-mono px-1 rounded bg-white border border-neutral-300 text-neutral-400">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono leading-none"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </motion.span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Shopping bag"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider">
                Bag
              </span>

              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={itemCount}
                  className="w-4 h-4 bg-neutral-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-mono leading-none"
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
