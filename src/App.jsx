import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/storefront/Home';

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
                  <Route path="/shop" element={<Home />} />
                  <Route path="/category/:slug" element={<Home />} />
                  <Route path="/product/:slug" element={<Home />} />
                  <Route path="/cart" element={<Home />} />
                  <Route path="/wishlist" element={<Home />} />
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
