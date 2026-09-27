import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/storefront/Home';
import { Shop } from './pages/storefront/Shop';
import { ProductDetail } from './pages/storefront/ProductDetail';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <WishlistProvider>
            <AdminAuthProvider>
              <Routes>
                {/* Storefront Layout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/category/:slug" element={<Shop />} />
                  <Route path="/search" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="*" element={<Home />} />
                </Route>
              </Routes>
            </AdminAuthProvider>
          </WishlistProvider>
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
