import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight, ChevronRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/product/ProductCard';

export function Wishlist() {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleMoveAllToBag = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
    showToast(`Moved all ${wishlist.length} pieces to your bag!`, 'success');
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-[#FAFAFA] min-h-[70vh] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-neutral-200/80 shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 mx-auto flex items-center justify-center text-rose-500 border border-rose-100">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-display text-neutral-950">
                Your Wishlist is Empty
              </h1>
              <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                Save your favorite atelier coats, footwear, and handcrafted accessories to curate your personal seasonal wishlist.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs font-mono font-semibold transition-colors shadow-sm hover:shadow-md"
            >
              <span>Explore The Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">Wishlist ({wishlist.length})</span>
        </nav>

        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-semibold">
              Curated Favorites
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-950">
              Saved Atelier Pieces
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearWishlist}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 hover:text-rose-600 text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              Clear All
            </button>

            <button
              type="button"
              onClick={handleMoveAllToBag}
              className="px-5 py-2.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Bag</span>
            </button>
          </div>
        </div>

        {/* Wishlist Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
export default Wishlist;
