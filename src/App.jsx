import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastProvider, useToast } from './context/ToastContext';
import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Button, Badge } from './components/common';
import { formatPrice } from './utils/formatters';
import { mockProducts } from './data/mockProducts';
import { mockCategories } from './data/mockCategories';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  Search,
  Truck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

function Part2PreviewHome() {
  const { showToast } = useToast();
  const { itemCount, subtotal, addToCart, setIsCartOpen } = useCart();
  const { wishlistCount, toggleWishlist, isInWishlist } = useWishlist();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Hero Announcement Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white p-8 sm:p-14 border border-neutral-800 shadow-xl">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-xs font-mono font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#C45B32]" />
              <span>Part 2 Complete — Global UI System Operational</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-editorial tracking-tight leading-tight">
              Designed with Intention. Crafted to Endure.
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
              The entire global storefront shell is now fully active: Rotating Announcement Bar, Sticky Navigation with Department Dropdowns, Slide-Over Cart Drawer, Search Experience (⌘K), Mobile Drawer, and Modern Multi-Column Footer.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="accent"
                size="md"
                onClick={() => {
                  const sample = mockProducts[0];
                  addToCart(sample, 1);
                  showToast(`Added "${sample.name}" to bag!`, 'success');
                }}
                icon={ShoppingBag}
              >
                Add Sample to Bag ({formatPrice(mockProducts[0].price)})
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => setIsCartOpen(true)}
                className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-neutral-900"
              >
                Open Cart Drawer ({itemCount})
              </Button>
            </div>
          </div>
        </div>

        {/* Global UI Components Verified Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Truck className="w-5 h-5 text-[#C45B32]" />
            </div>
            <h3 className="text-base font-bold font-editorial text-neutral-900">
              Announcement &amp; Header
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Automatic text carousel with dismissal option. Sticky navigation with transparent-to-solid transitions upon scrolling.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified &amp; Operational</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Search className="w-5 h-5 text-sky-600" />
            </div>
            <h3 className="text-base font-bold font-editorial text-neutral-900">
              Instant Search Experience
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Instant live search with debounced query execution, trending pills, recent searches cache, and product preview cards.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Try pressing ⌘K or Ctrl+K</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="text-base font-bold font-editorial text-neutral-900">
              Slide-Over Cart Drawer
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Free shipping progress calculation (Free over ৳3,000), quantity steppers, item deletion, live coupon validation, and guest checkout trigger.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{itemCount} items currently in bag</span>
            </div>
          </div>
        </div>

        {/* Sample Product Showcase to test Global UI features */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
                Curated Atelier
              </span>
              <h2 className="text-2xl font-bold font-editorial text-neutral-950 mt-1">
                Featured Highlights
              </h2>
            </div>
            <span className="text-xs text-neutral-500 font-mono">
              Ready for Part 3: Complete Homepage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.slice(0, 4).map((product) => {
              const inWishlist = isInWishlist(product.id);
              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <Badge variant={product.badge === 'Bestseller' ? 'bestseller' : 'new'}>
                          {product.badge}
                        </Badge>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        toggleWishlist(product);
                        showToast(
                          inWishlist
                            ? `Removed "${product.name}" from wishlist`
                            : `Added "${product.name}" to wishlist`,
                          inWishlist ? 'info' : 'success'
                        );
                      }}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                        inWishlist
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-neutral-950'
                      }`}
                      aria-label="Toggle wishlist"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block truncate">
                      {product.category}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-[#C45B32] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 pt-1 font-mono">
                      <span className="text-sm font-bold text-neutral-950">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={() => {
                          addToCart(product, 1);
                          showToast(`Added "${product.name}" to bag!`, 'success');
                        }}
                        icon={ShoppingBag}
                      >
                        Add to Bag
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Part2PreviewHome />} />
                  <Route path="/shop" element={<Part2PreviewHome />} />
                  <Route path="/category/:slug" element={<Part2PreviewHome />} />
                  <Route path="/cart" element={<Part2PreviewHome />} />
                  <Route path="/wishlist" element={<Part2PreviewHome />} />
                  <Route path="*" element={<Part2PreviewHome />} />
                </Route>
              </Routes>
            </AdminAuthProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
