import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatters';
import { EmptyState } from '../../components/common';

export function Cart() {
  const {
    cart,
    itemCount,
    subtotal,
    shippingFee,
    appliedCoupon,
    discountAmount,
    total,
    isFreeShipping,
    amountNeededForFreeShipping,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const { showToast } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    const res = await applyCoupon(couponCode.trim());
    setIsApplyingCoupon(false);

    if (res.success) {
      showToast(res.message, 'success');
      setCouponCode('');
    } else {
      showToast(res.message, 'error');
    }
  };

  const freeShippingProgress = Math.min(100, Math.round((subtotal / 3000) * 100));

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAFAFA] min-h-[70vh] py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 sm:p-14 border border-neutral-200/80 shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FFF1E8] mx-auto flex items-center justify-center text-[#FF6B2C]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-display text-neutral-950">
                Your Bag is Currently Empty
              </h1>
              <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                Discover our curated archive of tailored overcoats, French calfskin boots, and minimalist lifestyle objects.
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
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-neutral-900 transition-colors">
            Catalog
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">Shopping Bag ({itemCount})</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-neutral-200">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-semibold">
              Atelier Selection
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-950">
              Your Shopping Bag
            </h1>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-mono text-neutral-400 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Bag</span>
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#FF6B2C]" />
              <span className="font-semibold text-neutral-900">
                {isFreeShipping ? (
                  <span className="text-emerald-700 font-bold">
                    You've unlocked Complimentary Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatPrice(amountNeededForFreeShipping)}</strong> more for Free Shipping
                  </span>
                )}
              </span>
            </div>
            <span className="text-neutral-500">{freeShippingProgress}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isFreeShipping ? 'bg-emerald-600' : 'bg-[#FF6B2C]'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${freeShippingProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Cart Layout: Left Items Table + Right Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs divide-y divide-neutral-100 overflow-hidden">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.lineId}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 justify-between"
                  >
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center gap-4 min-w-0">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200/60 block"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block truncate">
                          {item.product.brand}
                        </span>
                        <h3 className="text-sm sm:text-base font-semibold text-neutral-900 truncate">
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="hover:text-[#FF6B2C] transition-colors"
                          >
                            {item.product.name}
                          </Link>
                        </h3>

                        <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 pt-0.5">
                          <span>Finish: <strong>{item.selectedColor}</strong></span>
                          <span>•</span>
                          <span>Size: <strong>{item.selectedSize}</strong></span>
                        </div>

                        <div className="text-xs font-mono text-neutral-900 pt-1 sm:hidden">
                          {formatPrice(item.price)} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                      {/* Stepper */}
                      <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 font-semibold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                          className="px-3 py-2 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right font-mono min-w-24">
                        <span className="text-sm sm:text-base font-bold text-neutral-950 block">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <span className="text-[11px] text-neutral-400 hidden sm:block">
                          {formatPrice(item.price)} each
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.lineId)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Special Instructions Textarea */}
            <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Atelier Notes &amp; Delivery Instructions (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Leave with building concierge, specific packaging request, or preferred dispatch hour..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full p-3.5 rounded-2xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 resize-none"
              />
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout (4 cols) */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold font-display text-neutral-950 pb-4 border-b border-neutral-100">
                Order Summary
              </h2>

              {/* Coupon Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
                  Promotional Voucher
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>Code <strong>{appliedCoupon.code}</strong> Applied</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Try 'AURA10'"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C]"
                    />
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-[#FF6B2C] disabled:opacity-50 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>Bag Subtotal:</span>
                  <span className="font-semibold text-neutral-950">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Express Courier Delivery:</span>
                  <span className="font-semibold text-neutral-950">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold font-sans text-neutral-950">Estimated Total:</span>
                  <span className="text-2xl font-bold text-neutral-950 font-mono">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Proceed to Guest Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 px-6 rounded-2xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Reassurances */}
              <div className="pt-4 border-t border-neutral-100 space-y-2.5 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>No account or password required to complete order</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-neutral-600 flex-shrink-0" />
                  <span>Complimentary 14-day doorstep exchange guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Cart;
