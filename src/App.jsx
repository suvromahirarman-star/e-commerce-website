import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/storefront/Home';

// Lazy-loaded Storefront Routes
const Shop = lazy(() => import('./pages/storefront/Shop').then((m) => ({ default: m.Shop || m.default })));
const ProductDetail = lazy(() => import('./pages/storefront/ProductDetail').then((m) => ({ default: m.ProductDetail || m.default })));
const Cart = lazy(() => import('./pages/storefront/Cart').then((m) => ({ default: m.Cart || m.default })));
const Checkout = lazy(() => import('./pages/storefront/Checkout').then((m) => ({ default: m.Checkout || m.default })));
const OrderSuccess = lazy(() => import('./pages/storefront/OrderSuccess').then((m) => ({ default: m.OrderSuccess || m.default })));
const Wishlist = lazy(() => import('./pages/storefront/Wishlist').then((m) => ({ default: m.Wishlist || m.default })));
const About = lazy(() => import('./pages/storefront/About').then((m) => ({ default: m.About || m.default })));
const Contact = lazy(() => import('./pages/storefront/Contact').then((m) => ({ default: m.Contact || m.default })));
const FAQ = lazy(() => import('./pages/storefront/FAQ').then((m) => ({ default: m.FAQ || m.default })));
const PrivacyPolicy = lazy(() => import('./pages/storefront/PrivacyPolicy').then((m) => ({ default: m.PrivacyPolicy || m.default })));
const TermsConditions = lazy(() => import('./pages/storefront/TermsConditions').then((m) => ({ default: m.TermsConditions || m.default })));
const NotFound = lazy(() => import('./pages/storefront/NotFound').then((m) => ({ default: m.NotFound || m.default })));

// Lazy-loaded Admin Routes
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout || m.default })));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin || m.default })));
const Dashboard = lazy(() => import('./pages/admin/Dashboard').then((m) => ({ default: m.Dashboard || m.default })));
const ProductList = lazy(() => import('./pages/admin/ProductList').then((m) => ({ default: m.ProductList || m.default })));
const ProductForm = lazy(() => import('./pages/admin/ProductForm').then((m) => ({ default: m.ProductForm || m.default })));
const Orders = lazy(() => import('./pages/admin/Orders').then((m) => ({ default: m.Orders || m.default })));
const Inventory = lazy(() => import('./pages/admin/Inventory').then((m) => ({ default: m.Inventory || m.default })));
const Customers = lazy(() => import('./pages/admin/Customers').then((m) => ({ default: m.Customers || m.default })));
const Coupons = lazy(() => import('./pages/admin/Coupons').then((m) => ({ default: m.Coupons || m.default })));
const Reviews = lazy(() => import('./pages/admin/Reviews').then((m) => ({ default: m.Reviews || m.default })));
const ContentCMS = lazy(() => import('./pages/admin/ContentCMS').then((m) => ({ default: m.ContentCMS || m.default })));
const Settings = lazy(() => import('./pages/admin/Settings').then((m) => ({ default: m.Settings || m.default })));

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
      <div className="w-10 h-10 rounded-full border-2 border-[#FF6B2C] border-t-transparent animate-spin" />
      <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
        Loading Atelier...
      </span>
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
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                  {/* Admin Auth Route */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Dashboard Protected Routes */}
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/:id" element={<ProductForm />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="customers" element={<Customers />} />
                    <Route path="coupons" element={<Coupons />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="content" element={<ContentCMS />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Dashboard />} />
                  </Route>

                  {/* Customer Storefront Layout */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/category/:slug" element={<Shop />} />
                    <Route path="/search" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsConditions />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </AdminAuthProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
