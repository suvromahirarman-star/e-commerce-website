import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastProvider, useToast } from './context/ToastContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Button, Badge } from './components/common';
import { formatPrice } from './utils/formatters';
import { mockProducts } from './data/mockProducts';
import { mockCategories } from './data/mockCategories';
import { Sparkles, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

function Part1FoundationPreview() {
  const { showToast } = useToast();
  const { itemCount, subtotal, addToCart } = useCart();
  const { wishlistCount, toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col justify-between">
      {/* Editorial Announcement Banner */}
      <div className="bg-neutral-900 text-white text-xs py-2 px-4 text-center tracking-wider uppercase font-mono">
        AURA Studio — Architectural Luxury &amp; Living • Part 1 Foundation Initialized
      </div>

      <main className="max-w-6xl mx-auto px-4 py-16 w-full space-y-12">
        {/* Header Intro */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <Badge variant="bestseller" size="md">
            Part 1 Complete: Architecture &amp; Data Layer
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold font-editorial tracking-tight text-neutral-950">
            AURA Studio
          </h1>
          <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
            Project foundation, editorial design tokens, API-ready service abstractions, and reactive state systems are successfully initialized.
          </p>
        </div>

        {/* Real-time State & Context Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-neutral-500">Cart System</span>
              <ShoppingBag className="w-5 h-5 text-neutral-800" />
            </div>
            <div className="text-2xl font-bold text-neutral-950 font-editorial">
              {itemCount} Items
            </div>
            <p className="text-xs text-neutral-500">
              Active Subtotal: <strong className="text-neutral-900">{formatPrice(subtotal)}</strong>
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-neutral-500">Wishlist System</span>
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <div className="text-2xl font-bold text-neutral-950 font-editorial">
              {wishlistCount} Saved
            </div>
            <p className="text-xs text-neutral-500">
              Synchronized to localStorage
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-neutral-500">API Service Layer</span>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-neutral-950 font-editorial">
              {mockProducts.length} Products
            </div>
            <p className="text-xs text-neutral-500">
              Across {mockCategories.length} curated categories
            </p>
          </div>
        </div>

        {/* Interactive Feature Verification Card */}
        <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h2 className="text-xl font-bold font-editorial text-neutral-900">
                Interactive Micro-Interactions Test
              </h2>
              <p className="text-xs text-neutral-500">
                Verify buttons, toasts, and reactive context pipelines
              </p>
            </div>
            <Badge variant="new">Ready for Part 2</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="primary"
              onClick={() => {
                const sample = mockProducts[0];
                addToCart(sample, 1);
                showToast(`Added "${sample.name}" to bag!`, 'success');
              }}
              icon={ShoppingBag}
            >
              Test Add to Cart ({formatPrice(mockProducts[0].price)})
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const sample = mockProducts[1];
                toggleWishlist(sample);
                const inList = isInWishlist(sample.id);
                showToast(
                  inList ? `Removed "${sample.name}" from wishlist` : `Saved "${sample.name}" to wishlist`,
                  'info'
                );
              }}
              icon={Heart}
            >
              Test Wishlist Toggle
            </Button>

            <Button
              variant="secondary"
              onClick={() => showToast('Toast notification pipeline operational!', 'success')}
            >
              Trigger Toast Notification
            </Button>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200 py-6 text-center text-xs text-neutral-500 font-mono">
        © 2026 AURA Studio. Modern E-Commerce Platform Architecture.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <AdminAuthProvider>
              <Routes>
                <Route path="*" element={<Part1FoundationPreview />} />
              </Routes>
            </AdminAuthProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
