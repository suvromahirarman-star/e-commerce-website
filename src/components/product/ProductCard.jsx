import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Badge } from '../common';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export function ProductCard({ product, onQuickView }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const inWishlist = isInWishlist(product.id);
  const hasMultipleImages = product.images && product.images.length > 1;
  const primaryImage = product.images?.[0];
  const secondaryImage = hasMultipleImages ? product.images[1] : primaryImage;

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, 1);
    showToast(`Added "${product.name}" to your bag`, 'success');
    setTimeout(() => setIsAdding(false), 1200);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      inWishlist
        ? `Removed "${product.name}" from wishlist`
        : `Saved "${product.name}" to wishlist`,
      inWishlist ? 'info' : 'success'
    );
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <article
      className="group relative flex flex-col bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
        {/* Main Product Image with Hover Swap */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && hasMultipleImages ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Badges (New, Bestseller, Flash Sale, Discount %) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <Badge
              variant={
                product.badge === 'Bestseller'
                  ? 'bestseller'
                  : product.badge === 'Limited'
                  ? 'limited'
                  : product.badge === 'Flash Sale'
                  ? 'flash'
                  : 'new'
              }
            >
              {product.badge}
            </Badge>
          )}

          {discountPercent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-600 text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 cursor-pointer shadow-xs ${
            inWishlist
              ? 'bg-rose-500 text-white hover:bg-rose-600 scale-105'
              : 'bg-white/85 text-neutral-700 hover:bg-white hover:text-neutral-950 hover:scale-105'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${inWishlist ? 'fill-current scale-110' : ''}`}
          />
        </button>

        {/* Quick View Button Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:block opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="w-full py-2.5 px-4 rounded-xl bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-semibold hover:bg-neutral-950 hover:text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
            <span className="truncate max-w-[120px]">{product.brand}</span>
            {product.rating && (
              <span className="flex items-center gap-1 text-amber-600 font-semibold lowercase">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="font-mono">{product.rating}</span>
                <span className="text-neutral-400">({product.reviewCount || 0})</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1 group-hover:text-[#C45B32] transition-colors">
            <Link to={`/product/${product.slug}`} title={product.name}>
              {product.name}
            </Link>
          </h3>

          {/* Color Preview Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.slice(0, 4).map((c, idx) => (
                <span
                  key={idx}
                  title={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-neutral-400 font-mono">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-sm sm:text-base font-bold text-neutral-950">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`p-2.5 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 hover:bg-[#C45B32] text-neutral-800 hover:text-white'
            }`}
            title="Add to Bag"
            aria-label="Add to Bag"
          >
            {isAdding ? (
              <Check className="w-4 h-4 animate-scale" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
