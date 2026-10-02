import { productRepository } from '../repositories/product.repository.js';
import { orderRepository } from '../repositories/order.repository.js';

export class DashboardService {
  async getDashboardStats() {
    const products = await productRepository.findAll({ status: 'all', limit: 200 });
    const ordersResult = await orderRepository.findAll({ limit: 200 });
    const orders = ordersResult.orders || [];

    const totalRevenue = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + (o.total ?? o.totalAmount ?? 0), 0);

    const customersSet = new Set<string>();
    orders.forEach((o) => {
      const email = o.customer?.email || o.customerEmail;
      if (email) customersSet.add(email);
    });

    // Breakdown by order status
    const statusCounts: Record<string, number> = {
      Delivered: 0,
      Shipped: 0,
      Processing: 0,
      Pending: 0,
    };

    orders.forEach((o) => {
      const st = o.orderStatus || 'Pending';
      if (statusCounts[st] !== undefined) {
        statusCounts[st] += 1;
      } else {
        statusCounts[st] = 1;
      }
    });

    const orderStatusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    products.forEach((p) => {
      const cat = p.category || 'Atelier Collection';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryBreakdown = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));

    // Low stock items (stock <= 10)
    const lowStockProducts = products
      .filter((p) => Number(p.stock ?? (p as any).stock_quantity ?? 0) <= 10)
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || `SKU-${p.id}`,
        stock: p.stock ?? 0,
        price: p.price,
        image: Array.isArray(p.images) && p.images.length > 0 ? (typeof p.images[0] === 'string' ? p.images[0] : (p.images[0] as any).url) : '',
      }));

    // Generate recent 7 days sales trend
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const salesTrend7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayName = dayNames[d.getDay()];
      const dayIso = d.toISOString().slice(0, 10);

      const dayOrders = orders.filter(
        (o) => (o.createdAt || '').slice(0, 10) === dayIso && o.orderStatus !== 'Cancelled'
      );
      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.total ?? o.totalAmount ?? 0), 0);

      return {
        day: dayName,
        date: dayIso,
        amount: dayRevenue,
        revenue: dayRevenue,
        orders: dayOrders.length,
      };
    });

    return {
      kpis: {
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customersSet.size,
      },
      salesTrend: salesTrend7Days,
      salesTrend7Days,
      categoryBreakdown,
      orderStatusBreakdown,
      recentOrders: orders.slice(0, 5),
      lowStockProducts,
    };
  }
}

export const dashboardService = new DashboardService();
