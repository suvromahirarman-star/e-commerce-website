import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react';
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
      className="group relative flex flex-col bg-white rounded-2xl border border-[#EAEAEA] hover:border-[#FF6B2C]/30 overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] bg-[#F8F8F8] overflow-hidden">
        {/* Main Product Image with Crossfade / Hover Zoom */}
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && hasMultipleImages ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top Badges (Orange background + white text) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider uppercase bg-[#FF6B2C] text-white shadow-xs">
              {product.badge}
            </span>
          )}

          {discountPercent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#171717] text-white shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button with Orange Reaction */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 z-10 cursor-pointer shadow-xs ${
            inWishlist
              ? 'bg-[#FF6B2C] text-white hover:bg-[#E9571F] scale-105 shadow-sm shadow-[#FF6B2C]/30'
              : 'bg-white/90 text-neutral-600 hover:bg-white hover:text-[#FF6B2C] hover:scale-105'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${inWishlist ? 'fill-current scale-110' : ''}`}
          />
        </button>

        {/* Quick View Button Slide-Up on Hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:block opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            type="button"
            onClick={handleQuickViewClick}
            className="w-full py-2.5 px-4 rounded-xl bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-semibold hover:bg-[#171717] hover:text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-sans"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-[11px] font-mono text-[#999999] uppercase tracking-wider">
            <span className="truncate max-w-[120px] font-medium">{product.brand}</span>
            {product.rating && (
              <span className="flex items-center gap-1 text-amber-600 font-semibold">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="font-mono text-neutral-800">{product.rating}</span>
                <span className="text-[#999999]">({product.reviewCount || 0})</span>
              </span>
            )}
          </div>

          {/* Product Title (Manrope display typography with orange hover) */}
          <h3 className="text-sm font-semibold text-neutral-950 line-clamp-1 group-hover:text-[#FF6B2C] transition-colors font-display">
            <Link to={`/product/${product.slug}`} title={product.name}>
              {product.name}
            </Link>
          </h3>

          {/* Color Preview Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-0.5">
              {product.colors.slice(0, 4).map((c, idx) => (
                <span
                  key={idx}
                  title={c.name}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300 shadow-2xs"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-[10px] text-[#999999] font-mono">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Tactile Add-to-Bag Action */}
        <div className="pt-2 border-t border-[#F2F2F2] flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-sm sm:text-base font-bold text-neutral-950">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#999999] line-through">
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
                ? 'bg-[#25855A] text-white shadow-xs'
                : 'bg-[#F8F8F8] hover:bg-[#FF6B2C] text-neutral-800 hover:text-white border border-[#EAEAEA] hover:border-[#FF6B2C]'
            }`}
            title="Add to Bag"
            aria-label="Add to Bag"
          >
            {isAdding ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
