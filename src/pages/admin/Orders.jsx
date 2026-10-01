import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  X,
  MapPin,
  Mail,
  Phone,
  Banknote,
  Package,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { LoadingSkeleton } from '../../components/common';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { showToast } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
      loadOrders();
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      (o.id && o.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customer?.fullName && o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customer?.phone && o.customer.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.customer?.email && o.customer.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || o.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    const matchesPayment =
      paymentFilter === 'all' || o.paymentMethod === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
            Order Fulfillment Pipeline
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            {orders.length} total orders recorded • Track dispatch, payment reconciliation, and statuses
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ID, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950"
          >
            <option value="all">All Payment Methods</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Mobile Financial Services (bKash/Nagad)">bKash / Nagad</option>
            <option value="Credit / Debit Card">Credit / Debit Card</option>
          </select>

          <span className="text-xs font-mono text-neutral-400 ml-auto md:ml-0">
            {filteredOrders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 space-y-2">
            <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="font-bold text-neutral-900">No matching orders found</p>
            <p>Try resetting the search query or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status Pipeline</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Order ID & Date */}
                    <td className="p-4">
                      <span className="font-bold text-neutral-950 block">{order.id}</span>
                      <span className="text-[10px] text-neutral-400">
                        {order.createdAt ? formatDate(order.createdAt) : 'Today'}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="p-4 font-sans">
                      <span className="font-bold text-neutral-900 block">
                        {order.customer?.fullName}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {order.customer?.phone}
                      </span>
                    </td>

                    {/* Items Count */}
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-[10px] font-bold">
                        {order.items?.length || 1} pieces
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="p-4 text-neutral-700">
                      <span>{order.paymentMethod}</span>
                      <span
                        className={`block text-[10px] font-bold ${
                          order.paymentStatus === 'Paid'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>

                    {/* Status Pipeline Dropdown */}
                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border focus:outline-none cursor-pointer ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-sky-50 border-sky-200 text-sky-800'
                            : order.orderStatus === 'Processing'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-50 border-rose-200 text-rose-800'
                            : 'bg-neutral-100 border-neutral-300 text-neutral-800'
                        }`}
                      >
                        {STATUS_OPTIONS.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Total */}
                    <td className="p-4 font-bold text-neutral-950 text-sm">
                      {formatPrice(order.pricing?.total || order.total || 8900)}
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-950 text-neutral-700 hover:text-neutral-950 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF6B2C] font-semibold">
                  Order Dossier
                </span>
                <h3 className="text-xl font-bold font-display text-neutral-950">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Change Selector inside Modal */}
            <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-neutral-200/80 flex items-center justify-between gap-4">
              <span className="text-xs font-mono font-semibold text-neutral-700">
                Pipeline Status:
              </span>
              <select
                value={selectedOrder.orderStatus}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-white border border-neutral-300"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Guest Patron
                </span>
                <div className="font-bold text-neutral-900 text-sm font-sans">
                  {selectedOrder.customer?.fullName}
                </div>
                <div className="text-neutral-600">{selectedOrder.customer?.phone}</div>
                <div className="text-neutral-600 truncate">{selectedOrder.customer?.email}</div>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-1.5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Delivery Destination
                </span>
                <div className="text-neutral-900 font-sans leading-relaxed">
                  {selectedOrder.shippingAddress?.street}
                  {selectedOrder.shippingAddress?.apartment && `, ${selectedOrder.shippingAddress.apartment}`}
                </div>
                <div className="text-neutral-500">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.division} — {selectedOrder.shippingAddress?.postalCode}
                </div>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Garments in Order
              </h4>
              <div className="border border-neutral-200 rounded-2xl divide-y divide-neutral-100 overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-12 rounded-lg object-cover bg-neutral-100 border border-neutral-200"
                        />
                      )}
                      <div>
                        <div className="font-bold text-neutral-900 font-sans">{item.name}</div>
                        <div className="text-[10px] text-neutral-400">
                          {item.selectedColor} • {item.selectedSize} • Qty {item.quantity}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-950">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-neutral-100 flex justify-between items-baseline font-mono text-xs">
              <span className="text-neutral-500 font-sans">Payment via {selectedOrder.paymentMethod}:</span>
              <span className="text-xl font-bold text-neutral-950">
                {formatPrice(selectedOrder.pricing?.total || selectedOrder.total || 8900)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Orders;
