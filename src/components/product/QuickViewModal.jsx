import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingBag, Heart, ArrowRight, Check } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

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
          className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-10 border border-[#EAEAEA]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/90 hover:bg-[#FFF8F3] text-neutral-500 hover:text-[#FF6B2C] border border-[#EAEAEA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Left Column */}
            <div className="p-6 bg-[#F8F8F8] flex flex-col justify-between space-y-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-[#EAEAEA]">
                <img
                  src={product.images?.[selectedImage] || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {product.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-[#FF6B2C] text-white shadow-xs">
                      {product.badge}
                    </span>
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
                      className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                        selectedImage === idx
                          ? 'border-[#FF6B2C] ring-2 ring-[#FF6B2C]/20'
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
                  <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
                    {product.brand}
                  </span>

                  {product.rating && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span className="font-bold text-neutral-900">{product.rating}</span>
                      <span className="text-neutral-400">({product.reviewCount || 0} reviews)</span>
                    </div>
                  )}
                </div>

                {/* Name */}
                <h2 className="text-2xl font-bold font-display text-neutral-950 tracking-tight">
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
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#171717] text-white">
                      Save {discountPercent}%
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3 font-sans">
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
                              ? 'border-[#FF6B2C] scale-110 shadow-sm ring-2 ring-[#FF6B2C]/20'
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
                      <span className="text-neutral-400 text-[11px]">True to standard fit</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`min-w-10 py-1.5 px-3 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                            selectedSize === s
                              ? 'bg-[#171717] text-white border-[#171717]'
                              : 'bg-white text-neutral-800 border-[#EAEAEA] hover:border-[#FF6B2C] hover:text-[#FF6B2C]'
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
              <div className="space-y-3 pt-4 border-t border-[#EAEAEA]">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-[#EAEAEA] rounded-xl overflow-hidden bg-[#F8F8F8] font-mono text-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-neutral-600 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] cursor-pointer transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 font-semibold text-neutral-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3 py-2 text-neutral-600 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] cursor-pointer transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag CTA (Vibrant Orange Button) */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 py-3.5 px-5 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF6B2C]/25 hover:-translate-y-0.5 active:translate-y-0"
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
                        ? 'border-[#FF6B2C] bg-[#FFF1E8] text-[#FF6B2C]'
                        : 'border-[#EAEAEA] text-neutral-600 hover:border-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FFF8F3]'
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#FF6B2C] transition-colors font-sans"
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
