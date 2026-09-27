import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatPrice, formatDate } from '../../utils/formatters';
import { LoadingSkeleton } from '../../components/common';

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [revenueTimeframe, setRevenueTimeframe] = useState('7d');

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-64 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
        <LoadingSkeleton className="h-80 rounded-3xl" />
      </div>
    );
  }

  const { kpis, salesTrend, recentOrders, lowStockProducts, orderStatusBreakdown } = stats;

  return (
    <div className="space-y-8">
      {/* Dashboard Top Greeting & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Operational Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-neutral-950">
            Performance Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-neutral-950 hover:bg-[#C45B32] text-white text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>+ Add New Product</span>
          </Link>
        </div>
      </div>

      {/* 4 Animated KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">
              {formatPrice(kpis.totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono font-medium pt-1">
              <span>+18.4%</span>
              <span className="text-neutral-400">vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Guest Orders
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">
              {kpis.totalOrders}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono pt-1">
              <span className="text-emerald-700 font-medium">+8 today</span>
              <span>• 100% guest</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Active Products */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Active Catalog
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">
              {kpis.totalProducts}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono pt-1">
              <span>Across 7 categories</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Guest Customers */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
              Unique Patrons
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neutral-950">
              {kpis.totalCustomers}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-purple-700 font-mono font-medium pt-1">
              <span>92% repurchase rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Sales Trend Chart + Order Status Donut/Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sales Trend Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-editorial text-neutral-950">
                Revenue Trajectory
              </h2>
              <p className="text-xs text-neutral-500 font-mono">
                Daily dispatch turnover in ৳ BDT
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 text-xs font-mono">
              <button
                type="button"
                onClick={() => setRevenueTimeframe('7d')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  revenueTimeframe === '7d'
                    ? 'bg-white font-bold text-neutral-950 shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                Last 7 Days
              </button>
              <button
                type="button"
                onClick={() => setRevenueTimeframe('30d')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  revenueTimeframe === '30d'
                    ? 'bg-white font-bold text-neutral-950 shadow-xs'
                    : 'text-neutral-500'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* SVG Custom Revenue Bars */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-4 border-b border-neutral-100">
            {salesTrend.map((day, idx) => {
              const heightPercent = Math.min(100, Math.max(15, Math.round((day.amount / 60000) * 100)));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-950 text-white text-[10px] font-mono px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-10 shadow-lg">
                    {formatPrice(day.amount)} ({day.orders} orders)
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-10 bg-neutral-100 rounded-t-xl overflow-hidden h-48 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="w-full bg-neutral-900 group-hover:bg-[#C45B32] transition-colors rounded-t-xl"
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-mono text-neutral-500">{day.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Avg Daily Order: ৳28,400</span>
            <span className="text-emerald-700 font-bold">100% Courier Handover</span>
          </div>
        </div>

        {/* Order Status Volume (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold font-editorial text-neutral-950">
            Fulfillment Pipeline
          </h2>

          <div className="space-y-4">
            {orderStatusBreakdown.map((status, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-neutral-700 font-medium">{status.status}</span>
                  <span className="font-bold text-neutral-950">{status.count} orders</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((status.count / kpis.totalOrders) * 100)}%`,
                      backgroundColor:
                        status.status === 'Delivered'
                          ? '#059669'
                          : status.status === 'Shipped'
                          ? '#2563EB'
                          : status.status === 'Processing'
                          ? '#D97706'
                          : '#C45B32',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-neutral-200/70 text-xs font-mono space-y-1">
            <span className="font-bold text-neutral-950 block">Courier Performance</span>
            <p className="text-neutral-500 text-[11px]">
              98.2% on-time delivery across Dhaka and divisional hubs in the last 30 days.
            </p>
          </div>
        </div>
      </div>

      {/* Two Data Tables: Recent Orders (8 cols) + Low Stock Alert (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-bold font-editorial text-neutral-950">
                Recent Guest Orders
              </h2>
              <p className="text-xs text-neutral-500 font-mono">Live customer dispatch queue</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-mono font-semibold text-[#C45B32] hover:underline"
            >
              View All Pipeline →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/60">
                    <td className="p-3 font-bold text-neutral-950">{order.id}</td>
                    <td className="p-3 font-sans font-medium text-neutral-800">
                      {order.customer.fullName}
                    </td>
                    <td className="p-3 text-neutral-600">{order.paymentMethod}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-neutral-950">
                      {formatPrice(order.total || 8900)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold font-editorial text-neutral-950">
                Low Stock Atelier
              </h2>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs font-mono font-semibold text-[#C45B32] hover:underline"
            >
              Inventory →
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <h4 className="font-semibold text-neutral-900 truncate">{prod.name}</h4>
                  <span className="text-[10px] font-mono text-neutral-400 block">
                    SKU: {prod.sku}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-mono font-bold text-xs flex-shrink-0">
                  {prod.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
