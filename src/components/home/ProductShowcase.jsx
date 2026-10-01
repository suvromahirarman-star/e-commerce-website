import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Star, Check, Sparkles, Shield, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export function ProductShowcase({ showcaseProduct }) {
  // Always invoke hooks at the top level
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    showcaseProduct?.colors?.[0] || { name: 'Camel Tan', hex: '#C29B7F' }
  );
  const [selectedSize, setSelectedSize] = useState(showcaseProduct?.sizes?.[1] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (!showcaseProduct) return null;

  const inWishlist = isInWishlist(showcaseProduct.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(showcaseProduct, quantity, selectedColor.name, selectedSize);
    showToast(`Added ${quantity} × "${showcaseProduct.name}" to your bag`, 'success');
    setTimeout(() => setIsAdding(false), 900);
  };

  const handleBuyNow = () => {
    addToCart(showcaseProduct, quantity, selectedColor.name, selectedSize);
    setIsCartOpen(true);
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFF8F3]/60 border-b border-[#EAEAEA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span>Signature Atelier Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-display text-neutral-950 tracking-tight leading-tight">
            Craftsmanship in Focus
          </h2>
          <p className="text-sm text-[#666666] font-sans">
            A closer look into the construction, drape, and material integrity of our flagship outerwear staple.
          </p>
        </div>

        {/* Large Product Showcase Grid (Pure White Card with Modern Corner Radii) */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-[0_16px_48px_rgba(0,0,0,0.06)] overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left 7 cols: Interactive Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-[#F8F8F8] border border-[#EAEAEA] shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={showcaseProduct.images?.[selectedImage] || showcaseProduct.images?.[0]}
                    alt={showcaseProduct.name}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center"
                  />
                </AnimatePresence>

                {/* Wishlist toggle */}
                <button
                  type="button"
                  onClick={() => {
                    toggleWishlist(showcaseProduct);
                    showToast(
                      inWishlist
                        ? `Removed "${showcaseProduct.name}" from wishlist`
                        : `Saved "${showcaseProduct.name}" to wishlist`,
                      inWishlist ? 'info' : 'success'
                    );
                  }}
                  className={`absolute top-4 right-4 p-3 rounded-xl transition-all cursor-pointer shadow-md ${
                    inWishlist
                      ? 'bg-[#FF6B2C] text-white'
                      : 'bg-white/90 text-neutral-700 hover:text-[#FF6B2C] hover:bg-white'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Multi-angle Thumbnails with Orange Focus Ring */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {showcaseProduct.images?.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      selectedImage === idx
                        ? 'border-[#FF6B2C] ring-2 ring-[#FF6B2C]/20 scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Product Details & Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
                    {showcaseProduct.brand}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{showcaseProduct.rating}</span>
                    <span className="text-[#999999] font-normal">
                      ({showcaseProduct.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950 tracking-tight">
                  {showcaseProduct.name}
                </h3>

                <div className="flex items-baseline gap-3 font-mono">
                  <span className="text-2xl font-bold text-neutral-950">
                    {formatPrice(showcaseProduct.price)}
                  </span>
                  {showcaseProduct.originalPrice && (
                    <span className="text-base text-[#999999] line-through">
                      {formatPrice(showcaseProduct.originalPrice)}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 text-[#25855A]">
                    In Stock
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-sans">
                  {showcaseProduct.overview || showcaseProduct.description}
                </p>
              </div>

              {/* Color Selectors with Orange Ring */}
              {showcaseProduct.colors && (
                <div className="space-y-2 pt-2 border-t border-[#F2F2F2]">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500">Selected Color:</span>
                    <span className="font-semibold text-neutral-900">{selectedColor.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {showcaseProduct.colors.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                          selectedColor.name === color.name
                            ? 'border-[#FF6B2C] scale-110 shadow-sm ring-2 ring-[#FF6B2C]/20'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      >
                        {selectedColor.name === color.name && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selectors */}
              {showcaseProduct.sizes && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-500">Select Size:</span>
                    <span className="text-[11px] text-neutral-400">Standard fit</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {showcaseProduct.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-11 py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                          selectedSize === size
                            ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                            : 'bg-white text-neutral-800 border-[#EAEAEA] hover:border-[#FF6B2C] hover:text-[#FF6B2C]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-4 border-t border-[#F2F2F2]">
                <div className="flex items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-[#EAEAEA] rounded-xl overflow-hidden bg-[#F8F8F8] font-mono text-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-3 text-neutral-600 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] cursor-pointer transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 font-semibold text-neutral-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-3 text-neutral-600 hover:bg-[#FFF8F3] hover:text-[#FF6B2C] cursor-pointer transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag (Vibrant Orange Button) */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs sm:text-sm font-semibold tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF6B2C]/25 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • {formatPrice(showcaseProduct.price * quantity)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Checkout Button (Soft Orange Pill) */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3 px-6 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] hover:bg-[#FFE6D6] hover:text-[#E9571F] text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center border border-[#FF6B2C]/20"
                >
                  Instant Guest Checkout (Direct to Cart)
                </button>
              </div>

              {/* Atelier Specs Callout */}
              <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-[#FF6B2C]/20 space-y-1 text-xs text-neutral-700">
                <div className="font-semibold text-neutral-950 flex items-center gap-1.5 font-display">
                  <Shield className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>Atelier Lifetime Guarantee</span>
                </div>
                <p className="text-[11px] text-[#666666] font-sans">
                  Includes Italian horn buttons, reinforced French seams, and complimentary lifetime repair service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
