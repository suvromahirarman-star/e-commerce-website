import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Mail,
  MapPin,
  CreditCard,
  Banknote,
  Headphones,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/formatters';

export function OrderSuccess() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    window.scrollTo(0, 0);

    async function fetchOrder() {
      if (!order && orderId) {
        setLoading(true);
        const fetched = await orderService.getOrderById(orderId);
        setOrder(fetched);
        setLoading(false);
      } else if (!order) {
        // Fallback: fetch most recent order from storage
        const all = await orderService.getOrders();
        if (all.length > 0) {
          setOrder(all[0]);
        }
        setLoading(false);
      }
    }

    fetchOrder();
  }, [order, orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-[#FAFAFA] min-h-[70vh] py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#FF6B2C] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs font-mono text-neutral-500">Retrieving order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-[#FAFAFA] min-h-[70vh] py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display text-neutral-900">
          No Order Found
        </h2>
        <p className="text-xs text-neutral-500">
          We could not locate this order reference.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 rounded-full bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs font-mono font-semibold transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8 sm:py-16 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Confirmation Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-neutral-200/80 shadow-xs space-y-8 print:border-none print:shadow-none">
          {/* Top Status */}
          <div className="text-center space-y-3 pb-8 border-b border-neutral-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-semibold block">
              Order Confirmed &amp; Dispatched
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-950">
              Thank You For Your Patronage
            </h1>

            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto leading-relaxed">
              We have received your guest order. A receipt and real-time courier tracking link have been dispatched to{' '}
              <strong className="text-neutral-900">{order.customer.email}</strong>.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-900 font-mono text-xs font-bold border border-neutral-200">
                Order ID: {order.id}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-mono text-xs font-semibold">
                Status: {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Logistics & Delivery Timeline Banner */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#FAFAFA] border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] shadow-2xs">
                <Truck className="w-5 h-5 text-[#FF6B2C]" />
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px] uppercase">
                  Estimated Dispatch &amp; Arrival
                </span>
                <span className="font-bold text-neutral-900 text-xs sm:text-sm">
                  24–48 Hours (Dhaka Metro) • 3–4 Days Nationwide
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-500 text-[11px]">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Insured White-Glove Packaging</span>
            </div>
          </div>

          {/* Order Details Matrix: Customer + Shipping + Payment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-xs">
            {/* Customer Contact */}
            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-400 font-mono uppercase tracking-wider text-[10px] font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#FF6B2C]" />
                <span>Client Contact</span>
              </div>
              <div className="font-bold text-neutral-900 text-sm font-display">
                {order.customer.fullName}
              </div>
              <div className="text-neutral-500 font-mono">{order.customer.phone}</div>
              <div className="text-neutral-500 font-mono truncate">{order.customer.email}</div>
            </div>

            {/* Shipping Address */}
            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-400 font-mono uppercase tracking-wider text-[10px] font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B2C]" />
                <span>Destination Address</span>
              </div>
              <div className="text-neutral-900 font-medium leading-relaxed">
                {order.shippingAddress.street}
                {order.shippingAddress.apartment && `, ${order.shippingAddress.apartment}`}
              </div>
              <div className="text-neutral-500 font-mono">
                {order.shippingAddress.city}, {order.shippingAddress.division} — {order.shippingAddress.postalCode}
              </div>
            </div>

            {/* Payment Details */}
            <div className="p-5 rounded-2xl bg-neutral-50/70 border border-neutral-100 space-y-2">
              <div className="flex items-center gap-1.5 text-neutral-400 font-mono uppercase tracking-wider text-[10px] font-semibold">
                <Banknote className="w-3.5 h-3.5 text-[#FF6B2C]" />
                <span>Payment Settlement</span>
              </div>
              <div className="font-bold text-neutral-900 text-sm">
                {order.paymentMethod}
              </div>
              <div className="text-neutral-500 font-mono">
                Payment Status:{' '}
                <span className="font-semibold text-neutral-900">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Order Breakdown Table */}
          <div className="space-y-4 pt-6">
            <h3 className="text-base font-bold font-display text-neutral-950">
              Purchased Garments &amp; Objects
            </h3>

            <div className="border border-neutral-200 rounded-2xl overflow-hidden divide-y divide-neutral-100">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 flex items-center justify-between gap-4 text-xs font-mono"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 rounded-xl object-cover bg-neutral-100 flex-shrink-0 border border-neutral-200/60"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-neutral-900 text-sm font-sans truncate">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-neutral-500 block">
                        Finish: {item.selectedColor} • Size: {item.selectedSize} • Qty {item.quantity}
                      </span>
                    </div>
                  </div>

                  <span className="font-bold text-neutral-950 text-sm flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Summary Breakdown */}
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/70 max-w-sm ml-auto space-y-2 text-xs font-mono">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-neutral-900">
                {formatPrice(order.pricing.subtotal)}
              </span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Express Delivery:</span>
              <span className="font-semibold text-neutral-900">
                {order.pricing.shippingFee === 0 ? 'FREE' : formatPrice(order.pricing.shippingFee)}
              </span>
            </div>
            {order.pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Voucher Discount:</span>
                <span>-{formatPrice(order.pricing.discount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline text-sm">
              <span className="font-bold font-sans text-neutral-950">Grand Total:</span>
              <span className="text-xl font-bold text-neutral-950 font-mono">
                {formatPrice(order.pricing.total)}
              </span>
            </div>
          </div>

          {/* Action Buttons (Print Receipt + Continue Shopping) */}
          <div className="pt-6 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-300 hover:border-neutral-950 text-neutral-800 text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Receipt</span>
            </button>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs font-mono font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Concierge Assistance Footer */}
        <div className="text-center text-xs font-mono text-neutral-500 space-y-1 print:hidden">
          <p>
            Questions regarding delivery tracking or measurements? Reach our concierge at{' '}
            <strong className="text-neutral-900">concierge@aurastudio.com</strong> or call{' '}
            <strong className="text-neutral-900">+880 1844-998822</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
export default OrderSuccess;
