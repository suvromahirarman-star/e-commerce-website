import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Check,
  AlertCircle,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { LoadingSkeleton, Badge } from '../../components/common';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const { showToast } = useToast();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      await productService.deleteProduct(id);
      showToast(`Deleted "${name}" from atelier archive`, 'info');
      setDeleteCandidate(null);
      loadProducts();
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || p.categorySlug === selectedCategory;

    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? (p.stock || 0) <= 10
        : (p.stock || 0) > 10;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-neutral-950">
            Products Atelier Management
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            {products.length} total garments and luxury lifestyle objects registered
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-[#C45B32] text-white text-xs font-mono font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, SKU, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950"
          >
            <option value="all">All Departments</option>
            <option value="mens">Men's Atelier</option>
            <option value="womens">Women's Collection</option>
            <option value="footwear">Footwear &amp; Boots</option>
            <option value="bags">Artisanal Leather Bags</option>
            <option value="watches">Timepieces</option>
            <option value="accessories">Accessories</option>
            <option value="living">Modern Living</option>
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950"
          >
            <option value="all">All Stock Statuses</option>
            <option value="low">Low Stock (≤ 10 pcs)</option>
            <option value="healthy">In Healthy Stock</option>
          </select>

          <span className="text-xs font-mono text-neutral-400 ml-auto md:ml-0">
            {filteredProducts.length} results
          </span>
        </div>
      </div>

      {/* Products Data Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 space-y-2">
            <Package className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="font-bold text-neutral-900">No products match your criteria</p>
            <p>Try resetting the search or category filters.</p>
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
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">Badges</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Thumbnail & Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="w-12 h-14 rounded-xl object-cover bg-neutral-100 flex-shrink-0 border border-neutral-200/60"
                        />
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <Link
                            to={`/admin/products/${p.id}`}
                            className="font-bold text-neutral-950 font-sans text-sm hover:text-[#C45B32] transition-colors block truncate"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[10px] text-neutral-400 block truncate">
                            {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="p-4 font-bold text-neutral-600">{p.sku}</td>

                    {/* Department */}
                    <td className="p-4 font-sans text-neutral-700 capitalize">
                      {p.category}
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <span className="font-bold text-neutral-950 block">
                        {formatPrice(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {formatPrice(p.originalPrice)}
                        </span>
                      )}
                    </td>

                    {/* Stock Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          (p.stock || 0) <= 5
                            ? 'bg-rose-100 text-rose-800'
                            : (p.stock || 0) <= 10
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{p.stock || 0} units</span>
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="p-4">
                      {p.badge ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                          title="View on storefront"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/products/${p.id}`}
                          className="p-2 rounded-xl text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(p)}
                          className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-neutral-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold font-editorial text-neutral-950">
                Confirm Removal
              </h3>
              <p className="text-xs text-neutral-500 font-sans leading-relaxed">
                Are you sure you wish to delete <strong>"{deleteCandidate.name}"</strong>? This will remove the piece from the active catalog archive.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteCandidate.id, deleteCandidate.name)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-semibold transition-colors cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default ProductList;
