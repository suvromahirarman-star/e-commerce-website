import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Users,
  Tag,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/products', label: 'Products Atelier', icon: Package },
  { path: '/admin/orders', label: 'Order Pipeline', icon: ShoppingBag },
  { path: '/admin/inventory', label: 'Stock & Inventory', icon: Layers },
  { path: '/admin/customers', label: 'Guest Customers', icon: Users },
  { path: '/admin/coupons', label: 'Vouchers & Deals', icon: Tag },
  { path: '/admin/reviews', label: 'Review Moderation', icon: MessageSquare },
  { path: '/admin/content', label: 'Homepage CMS', icon: FileText },
  { path: '/admin/settings', label: 'Store Settings', icon: Settings },
];

export function AdminLayout() {
  const { adminUser, isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F3F0] flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/70 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-64 bg-neutral-950 text-white z-50 flex flex-col justify-between transition-transform duration-300 border-r border-neutral-800 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Admin Brand Logo & Dismiss */}
          <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
            <Link to="/admin" className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold font-editorial tracking-widest text-white">
                  AURA
                </span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-[#C45B32] text-white uppercase tracking-wider font-semibold">
                  Admin
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block">
                Atelier Control Engine
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-white text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C45B32]' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Live Store Link & Profile) */}
        <div className="p-4 border-t border-neutral-900 space-y-3">
          {/* Quick link to live storefront */}
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C45B32]" />
              <span>Live Storefront</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>

          {/* Admin User Info & Logout */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={adminUser?.avatar}
                alt={adminUser?.name}
                className="w-8 h-8 rounded-full object-cover border border-neutral-700 flex-shrink-0"
              />
              <div className="min-w-0">
                <span className="text-xs font-bold text-white block truncate">
                  {adminUser?.name || 'Mahir Arman'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 block truncate">
                  {adminUser?.role || 'Super Admin'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 transition-colors cursor-pointer"
              title="Logout from Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content Wrapper (offset by sidebar width on lg) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-neutral-400 hidden sm:inline-block">
              AURA Management Studio
            </span>
          </div>

          {/* Header Right Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/admin/products/new"
              className="px-3.5 py-1.5 rounded-xl bg-neutral-950 hover:bg-[#C45B32] text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>+ Add Product</span>
            </Link>

            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 text-xs font-mono transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </Link>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
