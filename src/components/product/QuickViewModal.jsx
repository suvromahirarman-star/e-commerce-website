import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../common';

export function QuickViewModal({ product, isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setSelectedColor(product.colors?.[0] || null);
      setSelectedSize(product.sizes?.[0] || null);
      setQuantity(1);
      setIsAdding(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const inWishlist = isInWishlist(product.id);
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedColor?.name, selectedSize);
    showToast(`Added ${quantity} × "${product.name}" to your bag`, 'success');
    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 600);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
    showToast(
      inWishlist
        ? `Removed "${product.name}" from wishlist`
        : `Saved "${product.name}" to wishlist`,
      inWishlist ? 'info' : 'success'
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl z-10 border border-neutral-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left Column */}
            <div className="p-6 bg-neutral-50 flex flex-col justify-between space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200 shadow-inner">
                <img
                  src={product.images?.[selectedImage] || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {product.badge && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="bestseller">{product.badge}</Badge>
                  </div>
                )}
              </div>

              {/* Thumbnails row */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                        selectedImage === idx
                          ? 'border-[#C45B32] ring-2 ring-[#C45B32]/20'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Right Column */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
                    {product.brand}
                  </span>

                  {product.rating && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold">{product.rating}</span>
                      <span className="text-neutral-400">({product.reviewCount || 0} reviews)</span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold font-editorial text-neutral-900 tracking-tight">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-2.5 font-mono">
                  <span className="text-2xl font-bold text-neutral-950">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-neutral-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                  {product.description}
                </p>

                {/* Color Swatches */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-500">Color:</span>
                      <span className="font-semibold text-neutral-900">{selectedColor?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.colors.map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          title={c.name}
                          className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                            selectedColor?.name === c.name
                              ? 'border-neutral-950 scale-110 shadow-sm ring-2 ring-neutral-300'
                              : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColor?.name === c.name && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-500">Select Size:</span>
                      <span className="text-neutral-400 text-[11px]">True to size</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-10 py-1.5 px-3 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                            selectedSize === s
                              ? 'bg-neutral-950 text-white border-neutral-950'
                              : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 font-mono text-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 font-semibold text-neutral-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 py-3 px-5 rounded-xl bg-neutral-950 hover:bg-[#C45B32] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                      </>
                    )}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={handleWishlistToggle}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      inWishlist
                        ? 'border-rose-300 bg-rose-50 text-rose-600'
                        : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                    }`}
                    aria-label="Toggle wishlist"
                  >
                    <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* View Full Product Details Link */}
                <div className="pt-2 text-center">
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#C45B32] transition-colors"
                  >
                    <span>View full product specifications and reviews</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
