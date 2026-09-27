import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/formatters';

const DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
];

export function Checkout() {
  const { cart, subtotal, shippingFee, appliedCoupon, discountAmount, total, clearCart } =
    useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    streetAddress: '',
    apartment: '',
    city: 'Dhaka',
    division: 'Dhaka',
    postalCode: '',
    deliveryNotes: '',
    paymentMethod: 'Cash on Delivery',
    mobileNumber: '',
    trxId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Redirect to cart if empty
  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF9F6] min-h-[70vh] py-16 text-center flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl border border-neutral-200 max-w-md mx-auto space-y-4 shadow-xs">
          <AlertCircle className="w-10 h-10 text-neutral-400 mx-auto" />
          <h2 className="text-2xl font-bold font-editorial text-neutral-900">
            No Items in Bag
          </h2>
          <p className="text-xs text-neutral-500">
            Please add items to your shopping bag before proceeding to guest checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 rounded-full bg-neutral-950 text-white text-xs font-mono font-semibold"
          >
            Explore Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errors.email = 'Valid email is required for tracking';
    if (!formData.phone.trim() || formData.phone.length < 9)
      errors.phone = 'Valid phone number is required';
    if (!formData.streetAddress.trim()) errors.streetAddress = 'Delivery street address is required';
    if (!formData.city.trim()) errors.city = 'City is required';

    if (formData.paymentMethod === 'Mobile Financial Services (bKash/Nagad)') {
      if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Sender phone number is required';
      if (!formData.trxId.trim()) errors.trxId = 'Transaction ID is required';
    }

    if (formData.paymentMethod === 'Credit / Debit Card') {
      if (!formData.cardNumber.trim() || formData.cardNumber.length < 15)
        errors.cardNumber = 'Valid card number is required';
      if (!formData.cardExpiry.trim()) errors.cardExpiry = 'Expiry date required';
      if (!formData.cardCvc.trim()) errors.cardCvc = 'CVC required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please complete all required fields highlighted in red', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        shippingAddress: {
          street: formData.streetAddress.trim(),
          apartment: formData.apartment.trim() || undefined,
          city: formData.city.trim(),
          division: formData.division,
          postalCode: formData.postalCode.trim() || '1212',
          notes: formData.deliveryNotes.trim() || undefined,
        },
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          slug: item.product.slug,
          image: item.product.images[0],
          price: item.price,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })),
        pricing: {
          subtotal,
          shippingFee,
          discount: discountAmount,
          total,
          couponCode: appliedCoupon?.code || null,
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails:
          formData.paymentMethod === 'Mobile Financial Services (bKash/Nagad)'
            ? { senderPhone: formData.mobileNumber, trxId: formData.trxId }
            : formData.paymentMethod === 'Credit / Debit Card'
            ? { cardLast4: formData.cardNumber.slice(-4) }
            : null,
      };

      const createdOrder = await orderService.createGuestOrder(orderPayload);
      clearCart();
      showToast('Order confirmed successfully!', 'success');
      navigate('/order-success', { state: { order: createdOrder } });
    } catch (err) {
      console.error('Failed to create order:', err);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/cart" className="hover:text-neutral-900 transition-colors">
            Shopping Bag
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">Guest Checkout</span>
        </nav>

        {/* Frictionless Guest Reassurance Banner */}
        <div className="bg-neutral-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-neutral-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#C45B32]" />
              <span>Frictionless Protocol</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-editorial tracking-tight">
              Express Guest Checkout
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300">
              No registration or account creation required. Simply enter delivery details to dispatch your order.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 px-4 py-2 rounded-2xl flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit Encrypted</span>
          </div>
        </div>

        {/* Checkout Grid: Left Form (7 cols) + Right Order Review (5 cols) */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-base font-bold font-editorial text-neutral-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-mono">
                    1
                  </span>
                  <span>Contact Information</span>
                </h2>
                <span className="text-[11px] font-mono text-neutral-400">Order tracking updates</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="e.g. Samira Chowdhury"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                      formErrors.fullName
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                        : 'border-neutral-200 focus:ring-neutral-950'
                    }`}
                  />
                  {formErrors.fullName && (
                    <span className="text-[11px] text-rose-600 font-mono block">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                      formErrors.email
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                        : 'border-neutral-200 focus:ring-neutral-950'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-rose-600 font-mono block">
                      {formErrors.email}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="01712-345678"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                      formErrors.phone
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                        : 'border-neutral-200 focus:ring-neutral-950'
                    }`}
                  />
                  {formErrors.phone && (
                    <span className="text-[11px] text-rose-600 font-mono block">
                      {formErrors.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-base font-bold font-editorial text-neutral-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  <span>Delivery Address</span>
                </h2>
                <span className="text-[11px] font-mono text-neutral-400">White-glove dispatch</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Street Address &amp; House / Road No. *
                  </label>
                  <input
                    type="text"
                    name="streetAddress"
                    placeholder="House 42, Road 11, Block D, Banani"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 ${
                      formErrors.streetAddress
                        ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                        : 'border-neutral-200 focus:ring-neutral-950'
                    }`}
                  />
                  {formErrors.streetAddress && (
                    <span className="text-[11px] text-rose-600 font-mono block">
                      {formErrors.streetAddress}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Apartment / Suite / Floor (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    placeholder="Apt 4B"
                    value={formData.apartment}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    City / District *
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Dhaka"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Division *
                  </label>
                  <select
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 bg-white"
                  >
                    {DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div} Division
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="1213"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Courier Notes / Gate Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="deliveryNotes"
                    placeholder="e.g. Near Banani Club, call upon arrival at front gate"
                    value={formData.deliveryNotes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-base font-bold font-editorial text-neutral-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-neutral-950 text-white text-xs flex items-center justify-center font-mono">
                    3
                  </span>
                  <span>Payment Method</span>
                </h2>
                <span className="text-[11px] font-mono text-neutral-400">Guaranteed secure</span>
              </div>

              {/* Payment Radio Options */}
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'Cash on Delivery'
                      ? 'border-neutral-950 bg-[#FAF9F6] shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cash on Delivery"
                        checked={formData.paymentMethod === 'Cash on Delivery'}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#C45B32] focus:ring-[#C45B32]"
                      />
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#C45B32]" />
                        <span className="text-xs sm:text-sm font-bold text-neutral-900">
                          Cash on Delivery (Doorstep Inspection)
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  </div>
                  {formData.paymentMethod === 'Cash on Delivery' && (
                    <p className="text-xs text-neutral-500 pt-2 pl-7">
                      Pay with cash or mobile banking directly to the courier agent after inspecting your atelier parcel.
                    </p>
                  )}
                </label>

                {/* Mobile Financial Services (bKash / Nagad) */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'Mobile Financial Services (bKash/Nagad)'
                      ? 'border-neutral-950 bg-[#FAF9F6] shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Mobile Financial Services (bKash/Nagad)"
                        checked={
                          formData.paymentMethod ===
                          'Mobile Financial Services (bKash/Nagad)'
                        }
                        onChange={handleChange}
                        className="w-4 h-4 text-[#C45B32] focus:ring-[#C45B32]"
                      />
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-pink-600" />
                        <span className="text-xs sm:text-sm font-bold text-neutral-900">
                          bKash / Nagad / Upay (Direct Transfer)
                        </span>
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'Mobile Financial Services (bKash/Nagad)' && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 pl-7 space-y-3">
                      <p className="text-xs text-neutral-600">
                        Please send payment to AURA Merchant Account: <strong>01844-998822</strong>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="tel"
                          name="mobileNumber"
                          placeholder="Your bKash / Nagad Wallet No."
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                        />
                        <input
                          type="text"
                          name="trxId"
                          placeholder="Transaction TrxID (e.g. 9B47X1K)"
                          value={formData.trxId}
                          onChange={handleChange}
                          className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono uppercase"
                        />
                      </div>
                    </div>
                  )}
                </label>

                {/* Credit / Debit Card */}
                <label
                  className={`flex flex-col p-4 rounded-2xl border transition-all cursor-pointer ${
                    formData.paymentMethod === 'Credit / Debit Card'
                      ? 'border-neutral-950 bg-[#FAF9F6] shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Credit / Debit Card"
                        checked={formData.paymentMethod === 'Credit / Debit Card'}
                        onChange={handleChange}
                        className="w-4 h-4 text-[#C45B32] focus:ring-[#C45B32]"
                      />
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-neutral-900" />
                        <span className="text-xs sm:text-sm font-bold text-neutral-900">
                          Credit or Debit Card (Visa, Mastercard, AMEX)
                        </span>
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === 'Credit / Debit Card' && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 pl-7 space-y-3">
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number (4000 1234 5678 9010)"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="cardExpiry"
                          placeholder="MM / YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                        />
                        <input
                          type="text"
                          name="cardCvc"
                          placeholder="CVC / CVV"
                          value={formData.cardCvc}
                          onChange={handleChange}
                          className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Review Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h2 className="text-base font-bold font-editorial text-neutral-950">
                  Review Your Order ({cart.length} items)
                </h2>
                <Link
                  to="/cart"
                  className="text-xs font-mono text-[#C45B32] hover:underline font-semibold"
                >
                  Edit Bag
                </Link>
              </div>

              {/* Items List Mini Carousel */}
              <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-neutral-100 pr-1">
                {cart.map((item) => (
                  <div key={item.lineId} className="flex items-center gap-3 pt-3 first:pt-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 rounded-xl object-cover bg-neutral-100 flex-shrink-0 border border-neutral-200/60"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-semibold text-neutral-900 truncate">
                        {item.product.name}
                      </h4>
                      <span className="text-[10px] font-mono text-neutral-400 block">
                        {item.selectedColor} • {item.selectedSize} • Qty {item.quantity}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-neutral-950 text-xs">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-100 text-xs font-mono">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-neutral-950">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Express Courier:</span>
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
                <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold font-sans text-neutral-950">Total Payable:</span>
                  <span className="text-2xl font-bold text-neutral-950 font-mono">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Submit Order Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-neutral-950 hover:bg-[#C45B32] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <span>Dispatching Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Guest Order • {formatPrice(total)}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-neutral-400 text-center font-mono">
                By completing this purchase you agree to AURA Studio's 14-day exchange and terms policy.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Checkout;
