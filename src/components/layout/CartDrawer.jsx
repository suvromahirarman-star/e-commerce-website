import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Truck,
  Sparkles,
  ArrowRight,
  Tag,
  Check,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatters';
import { slideDrawerRight, modalBackdrop } from '../../utils/animations';

export function CartDrawer() {
  const {
    cart,
    itemCount,
    subtotal,
    shippingFee,
    discountAmount,
    grandTotal,
    appliedCoupon,
    freeShippingRemaining,
    freeShippingProgress,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');

    const res = await applyCoupon(couponInput);
    setCouponLoading(false);
    if (res.success) {
      setCouponInput('');
      showToast(res.message, 'success');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewBagClick = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Drawer Window */}
          <motion.div
            variants={slideDrawerRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md bg-white h-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-10 flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-[#EAEAEA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF6B2C]" />
                <h3 className="text-base font-bold font-display text-neutral-950 tracking-tight">
                  Shopping Bag
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#FFF1E8] text-[#FF6B2C] font-semibold">
                  {itemCount}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-[#FFF8F3] transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator (Orange themed) */}
            <div className="px-6 py-3.5 bg-[#FFF8F3] border-b border-[#FF6B2C]/10">
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span className="flex items-center gap-1.5 text-neutral-800">
                  <Truck className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  {freeShippingRemaining > 0 ? (
                    <span>
                      Add <strong>{formatPrice(freeShippingRemaining)}</strong> more for{' '}
                      <strong className="text-[#FF6B2C]">FREE Delivery</strong>
                    </span>
                  ) : (
                    <span className="text-[#25855A] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Unlocked: Complimentary White-Glove Delivery
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-mono text-neutral-500 font-bold">
                  {freeShippingProgress}%
                </span>
              </div>

              <div className="w-full bg-[#EAEAEA] h-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full transition-all ${
                    freeShippingRemaining === 0 ? 'bg-[#25855A]' : 'bg-[#FF6B2C]'
                  }`}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#F2F2F2]">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.lineId} className="py-4 flex gap-4 group">
                    {/* Thumbnail */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-xl bg-[#F8F8F8] border border-[#EAEAEA] flex-shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-neutral-900 leading-snug line-clamp-2 font-display">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => {
                              removeFromCart(item.lineId);
                              showToast(`Removed from bag`, 'info');
                            }}
                            className="text-neutral-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500 font-mono">
                          <span>Color: {item.selectedColor}</span>
                          <span>•</span>
                          <span>Size: {item.selectedSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-[#EAEAEA] rounded-xl bg-white overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                            className="p-1 px-2.5 text-neutral-500 hover:text-[#FF6B2C] hover:bg-[#FFF8F3] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-semibold text-neutral-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                            className="p-1 px-2.5 text-neutral-500 hover:text-[#FF6B2C] hover:bg-[#FFF8F3] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-bold text-neutral-950 font-mono">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF1E8] flex items-center justify-center text-[#FF6B2C] mx-auto">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-neutral-900 font-display">
                      Your bag is empty
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                      Explore our seasonal collection and curate your wardrobe essentials.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/shop');
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white transition-colors cursor-pointer shadow-sm shadow-[#FF6B2C]/20"
                  >
                    <span>Explore Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer & Checkout Area */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#EAEAEA] bg-[#FAF9F8]/60 space-y-4">
                {/* Promo Coupon Form */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>
                          Coupon <strong>{appliedCoupon.code}</strong> applied (-
                          {formatPrice(discountAmount)})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-emerald-700 hover:text-emerald-900 text-[11px] font-semibold underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value.toUpperCase());
                          setCouponError('');
                        }}
                        placeholder="Voucher code (e.g. AURA10)"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#EAEAEA] text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C]/30 uppercase font-mono"
                      />
                      <button
                        type="submit"
                        disabled={couponLoading || !couponInput.trim()}
                        className="px-4 py-2 rounded-xl bg-[#171717] text-white text-xs font-semibold hover:bg-[#FF6B2C] disabled:opacity-50 transition-colors"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">
                      {couponError}
                    </p>
                  )}
                </div>

                {/* Totals Breakdown */}
                <div className="space-y-1.5 text-xs text-neutral-600 border-t border-[#EAEAEA] pt-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-neutral-900 font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-neutral-900 font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-[#25855A] font-semibold">FREE</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#25855A] font-medium">
                      <span>Discount</span>
                      <span className="font-mono">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-[#EAEAEA]">
                    <span className="font-display">Grand Total</span>
                    <span className="font-mono text-base font-bold text-neutral-950">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTAs with Primary Orange Button */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCheckoutClick}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#FF6B2C]/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleViewBagClick}
                    className="w-full py-2.5 px-4 rounded-xl bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-950 text-xs font-medium transition-colors cursor-pointer"
                  >
                    View Bag Details
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
