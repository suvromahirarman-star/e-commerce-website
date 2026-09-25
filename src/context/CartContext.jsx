import React, { createContext, useContext, useState, useEffect } from 'react';
import { couponService } from '../services/couponService';

const CartContext = createContext(null);

const STORAGE_KEY = 'aura_shopping_cart';
const COUPON_STORAGE_KEY = 'aura_applied_coupon';
const FREE_SHIPPING_THRESHOLD = 3000;
const STANDARD_SHIPPING_FEE = 120;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to sync cart to localStorage:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync coupon to localStorage:', e);
    }
  }, [appliedCoupon]);

  /**
   * Add product to cart with chosen variants
   */
  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const color = selectedColor || product.colors?.[0]?.name || 'Standard';
    const size = selectedSize || product.sizes?.[0] || 'Standard';
    const lineId = `${product.id}-${color}-${size}`;

    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.lineId === lineId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          lineId,
          product,
          quantity,
          selectedColor: color,
          selectedSize: size,
          price: product.price,
        },
      ];
    });

    // Auto-open side drawer to confirm addition to customer
    setIsCartOpen(true);
  };

  /**
   * Update item quantity
   */
  const updateQuantity = (lineId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(lineId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.lineId === lineId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  /**
   * Remove item from cart
   */
  const removeFromCart = (lineId) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId));
  };

  /**
   * Clear all cart contents
   */
  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  /**
   * Apply coupon code
   */
  const applyCoupon = async (code) => {
    const res = await couponService.validateCoupon(code, subtotal);
    if (res.valid) {
      setAppliedCoupon({
        code: res.coupon.code,
        discountAmount: res.discountAmount,
        type: res.coupon.type,
        value: res.coupon.value,
      });
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message };
  };

  /**
   * Remove applied coupon
   */
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingFee = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        shippingFee,
        discountAmount,
        grandTotal,
        appliedCoupon,
        freeShippingRemaining,
        freeShippingProgress,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
