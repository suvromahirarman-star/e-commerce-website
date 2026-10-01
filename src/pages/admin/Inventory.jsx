import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Filter,
  AlertTriangle,
  Plus,
  Minus,
  Check,
  Package,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { LoadingSkeleton } from '../../components/common';

export function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const { showToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStockAdjust = async (id, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await productService.updateProduct(id, { stock: newStock });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
      showToast(`Stock updated to ${newStock} units`, 'success');
    } catch (err) {
      showToast('Failed to adjust stock', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase());

    const stock = p.stock || 0;
    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'critical'
        ? stock <= 5
        : filterType === 'low'
        ? stock <= 10
        : stock > 10;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
          Stock &amp; Inventory Tracker
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Monitor physical atelier stock levels and adjust batch replenishment units
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950"
          >
            <option value="all">All Inventory ({products.length})</option>
            <option value="critical">Critical Stock (≤ 5 units)</option>
            <option value="low">Low Stock (≤ 10 units)</option>
            <option value="healthy">Healthy Stock (&gt; 10 units)</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="p-4">Piece</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Level Gauge</th>
                  <th className="p-4 text-right">Quick Restock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((p) => {
                  const stock = p.stock || 0;
                  const isCritical = stock <= 5;
                  const isLow = stock <= 10 && stock > 5;

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0]}
                            alt=""
                            className="w-10 h-12 rounded-xl object-cover bg-neutral-100 border border-neutral-200"
                          />
                          <div className="min-w-0 max-w-[200px] truncate font-sans font-bold text-neutral-900 text-sm">
                            {p.name}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-bold text-neutral-600">{p.sku}</td>
                      <td className="p-4 font-sans capitalize text-neutral-600">{p.category}</td>
                      <td className="p-4 font-bold text-neutral-900">{formatPrice(p.price)}</td>

                      {/* Stock Level Gauge */}
                      <td className="p-4">
                        <div className="space-y-1.5 max-w-[180px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span
                              className={`font-bold ${
                                isCritical
                                  ? 'text-rose-600'
                                  : isLow
                                  ? 'text-amber-600'
                                  : 'text-emerald-700'
                              }`}
                            >
                              {stock} units left
                            </span>
                            <span className="text-neutral-400">Cap: 30</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isCritical
                                  ? 'bg-rose-500'
                                  : isLow
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, (stock / 30) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Quick Restock Adjust Stepper */}
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 text-xs">
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(p.id, stock, -1)}
                            className="px-2.5 py-1.5 text-neutral-600 hover:bg-neutral-200 cursor-pointer"
                            title="Decrement stock (-1)"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-bold text-neutral-900 min-w-8 text-center">
                            {stock}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleStockAdjust(p.id, stock, +5)}
                            className="px-2.5 py-1.5 text-neutral-600 hover:bg-neutral-200 cursor-pointer font-bold"
                            title="Restock batch (+5)"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Inventory;
