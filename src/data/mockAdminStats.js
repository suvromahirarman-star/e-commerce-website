/**
 * Admin Dashboard Statistics Dataset for AURA Studio
 */

export const mockAdminStats = {
  kpis: {
    totalRevenue: 284500,
    revenueGrowth: '+18.4% vs last month',
    totalOrders: 64,
    ordersGrowth: '+12.1% vs last month',
    totalProducts: 24,
    productsLive: 22,
    totalCustomers: 58,
    averageOrderValue: 4445,
  },
  salesTrend7Days: [
    { day: 'Mon', revenue: 28400, orders: 7 },
    { day: 'Tue', revenue: 34200, orders: 9 },
    { day: 'Wed', revenue: 31000, orders: 8 },
    { day: 'Thu', revenue: 42500, orders: 11 },
    { day: 'Fri', revenue: 53800, orders: 14 },
    { day: 'Sat', revenue: 49100, orders: 12 },
    { day: 'Sun', revenue: 45500, orders: 10 },
  ],
  categoryBreakdown: [
    { category: "Men's Atelier", percentage: 38, revenue: 108110 },
    { category: "Women's Collection", percentage: 28, revenue: 79660 },
    { category: 'Footwear & Boots', percentage: 18, revenue: 51210 },
    { category: 'Leather Bags', percentage: 10, revenue: 28450 },
    { category: 'Accessories & Objects', percentage: 6, revenue: 17070 },
  ],
};
