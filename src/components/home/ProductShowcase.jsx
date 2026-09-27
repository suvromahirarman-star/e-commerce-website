import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Star, Check, Sparkles, Shield, Heart } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

export function ProductShowcase({ showcaseProduct }) {
  if (!showcaseProduct) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    showcaseProduct.colors?.[0] || { name: 'Camel Tan', hex: '#C29B7F' }
  );
  const [selectedSize, setSelectedSize] = useState(showcaseProduct.sizes?.[1] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
    <section className="py-16 sm:py-24 bg-[#F5F4F0] border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature Atelier Spotlight</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-neutral-950 tracking-tight">
            Craftsmanship in Focus
          </h2>
          <p className="text-sm text-neutral-600">
            A closer look into the construction, drape, and material integrity of our flagship outerwear staple.
          </p>
        </div>

        {/* Large Product Showcase Grid */}
        <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 7 cols: Interactive Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 shadow-inner">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={showcaseProduct.images?.[selectedImage] || showcaseProduct.images?.[0]}
                    alt={showcaseProduct.name}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
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
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all cursor-pointer shadow-md ${
                    inWishlist
                      ? 'bg-rose-500 text-white'
                      : 'bg-white/85 text-neutral-700 hover:bg-white hover:text-neutral-950'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Multi-angle Thumbnails */}
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
                {showcaseProduct.images?.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                      selectedImage === idx
                        ? 'border-[#C45B32] ring-2 ring-[#C45B32]/20'
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
                  <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
                    {showcaseProduct.brand}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-mono text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{showcaseProduct.rating}</span>
                    <span className="text-neutral-400 font-normal">
                      ({showcaseProduct.reviewCount} verified reviews)
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-neutral-950 tracking-tight">
                  {showcaseProduct.name}
                </h3>

                <div className="flex items-baseline gap-3 font-mono">
                  <span className="text-2xl font-bold text-neutral-950">
                    {formatPrice(showcaseProduct.price)}
                  </span>
                  {showcaseProduct.originalPrice && (
                    <span className="text-base text-neutral-400 line-through">
                      {formatPrice(showcaseProduct.originalPrice)}
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-emerald-100 text-emerald-800">
                    In Stock
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {showcaseProduct.overview || showcaseProduct.description}
                </p>
              </div>

              {/* Color Selectors */}
              {showcaseProduct.colors && (
                <div className="space-y-2 pt-2 border-t border-neutral-100">
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
                            ? 'border-neutral-950 scale-110 shadow-sm ring-2 ring-neutral-300'
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
                    <span className="text-[11px] text-neutral-400">Model is 186cm wearing M</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {showcaseProduct.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-11 py-2 px-3 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer border ${
                          selectedSize === size
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm'
                            : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-3">
                  {/* Stepper */}
                  <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 font-mono text-sm">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-3 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 font-semibold text-neutral-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-3 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-neutral-950 hover:bg-[#C45B32] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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

                {/* Instant Checkout Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3 px-6 rounded-xl bg-[#FAF0EB] text-[#C45B32] hover:bg-[#F5E2D7] text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
                >
                  Instant Guest Checkout (Direct to Cart)
                </button>
              </div>

              {/* Atelier Specs Callout */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1 text-xs text-neutral-600">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#C45B32]" />
                  <span>Atelier Guarantee</span>
                </div>
                <p className="text-[11px] text-neutral-500">
                  Includes Italian horn buttons, French seams, and complimentary lifetime repair warranty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
