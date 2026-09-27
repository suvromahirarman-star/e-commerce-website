import React, { useState, useEffect, useMemo } from 
'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Grid3X3,
  LayoutGrid,
  Sparkles,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { productService } from '../../services/productService';
import { mockCategories } from '../../data/mockCategories';
import { ProductCard } from '../../components/product/ProductCard';
import { QuickViewModal } from '../../components/product/QuickViewModal';
import { FilterSidebar } from '../../components/shop/FilterSidebar';
import { FilterDrawer } from '../../components/shop/FilterDrawer';
import { SortDropdown } from '../../components/shop/SortDropdown';
import { ActiveFilterPills } from '../../components/shop/ActiveFilterPills';
import { LoadingSkeleton, EmptyState } from '../../components/common';

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState(3); // 3 or 4 cols

  // Quick view state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Initialize filters from URL parameters
  const initialCategory = searchParams.get('category') || 'all';
  const initialFilter = searchParams.get('filter') || null;
  const initialQuery = searchParams.get('q') || '';

  const [filters, setFilters] = useState({
    category: initialCategory,
    minPrice: 0,
    maxPrice: 50000,
    size: null,
    color: null,
    inStockOnly: false,
    discountOnly: initialFilter === 'flash',
    search: initialQuery,
    sortBy: 'most-popular',
  });

  // Sync state if URL changes (e.g., clicking category link in navbar)
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'all';
    const urlFilter = searchParams.get('filter') || null;
    const urlQuery = searchParams.get('q') || '';

    setFilters((prev) => ({
      ...prev,
      category: urlCategory,
      discountOnly: urlFilter === 'flash' || prev.discountOnly,
      search: urlQuery,
    }));
  }, [searchParams]);

  // Fetch products whenever filters or sort changes
  useEffect(() => {
    let isCancelled = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const result = await productService.getProducts(filters);
        if (!isCancelled) {
          setProducts(result);
        }
      } catch (err) {
        console.error('Error fetching shop products:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: 50000,
      size: null,
      color: null,
      inStockOnly: false,
      discountOnly: false,
      search: '',
      sortBy: 'most-popular',
    });
    setSearchParams({});
  };

  const handleRemoveFilter = (key) => {
    if (key === 'category') handleFilterChange('category', 'all');
    else if (key === 'price') {
      handleFilterChange('minPrice', 0);
      handleFilterChange('maxPrice', 50000);
    } else if (key === 'search') {
      handleFilterChange('search', '');
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('q');
      setSearchParams(newParams);
    } else {
      handleFilterChange(key, null);
    }
  };

  const activeCategoryObj = mockCategories.find((c) => c.slug === filters.category);

  // Calculate active filter count for mobile badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category && filters.category !== 'all') count++;
    if (filters.minPrice > 0 || filters.maxPrice < 50000) count++;
    if (filters.size) count++;
    if (filters.color) count++;
    if (filters.inStockOnly) count++;
    if (filters.discountOnly) count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">Shop Archive</span>
          {activeCategoryObj && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#C45B32]">{activeCategoryObj.name}</span>
            </>
          )}
        </nav>

        {/* Page Title & Category Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              The Complete Atelier Collection
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-neutral-950 tracking-tight">
              {filters.search
                ? `Search: "${filters.search}"`
                : activeCategoryObj
                ? activeCategoryObj.name
                : 'All Garments & Objects'}
            </h1>
            <p className="text-sm text-neutral-500 leading-relaxed">
              {activeCategoryObj
                ? activeCategoryObj.tagline
                : 'Curated architectural tailoring, double-faced wools, Tuscan leather goods, and Swiss mechanical horology.'}
            </p>
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-xs font-mono text-neutral-400 block">Catalog Volume</span>
            <span className="text-2xl sm:text-3xl font-bold font-editorial text-neutral-900">
              {products.length} Pieces
            </span>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        <ActiveFilterPills
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleResetFilters}
        />

        {/* Catalog Main Layout (Sidebar + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Left Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={products.length}
            />
          </div>

          {/* Right Main Catalog (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Controls Bar (Mobile Filter Button, View Toggles, Sorting) */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between gap-4">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-semibold hover:bg-[#C45B32] transition-colors cursor-pointer shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C45B32] text-white text-[10px] font-mono flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <span className="text-xs font-mono text-neutral-500 hidden sm:inline-block">
                Showing <strong className="text-neutral-900">{products.length}</strong> items
              </span>

              {/* Right: Grid Switcher + Sort Dropdown */}
              <div className="flex items-center gap-3 ml-auto">
                {/* Desktop Grid Switcher */}
                <div className="hidden sm:flex items-center border border-neutral-200 rounded-xl p-1 bg-neutral-50">
                  <button
                    type="button"
                    onClick={() => setGridColumns(3)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      gridColumns === 3
                        ? 'bg-white text-neutral-950 shadow-xs'
                        : 'text-neutral-400 hover:text-neutral-900'
                    }`}
                    title="3 Columns"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridColumns(4)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      gridColumns === 4
                        ? 'bg-white text-neutral-950 shadow-xs'
                        : 'text-neutral-400 hover:text-neutral-900'
                    }`}
                    title="4 Columns"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <SortDropdown
                  value={filters.sortBy}
                  onChange={(val) => handleFilterChange('sortBy', val)}
                />
              </div>
            </div>

            {/* Product Grid / Loading / Empty States */}
            {loading ? (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridColumns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                } gap-6`}
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 space-y-4">
                    <LoadingSkeleton className="aspect-[3/4] w-full rounded-xl" />
                    <LoadingSkeleton className="h-4 w-3/4 rounded" />
                    <LoadingSkeleton className="h-4 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200/80 shadow-xs space-y-4">
                <EmptyState
                  title="No Matching Atelier Pieces"
                  description="We could not locate any garments matching your exact combination of filters. Try clearing your size, color, or price selections."
                  actionText="Reset All Filters"
                  onAction={handleResetFilters}
                />
              </div>
            ) : (
              <motion.div
                layout
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridColumns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                } gap-6`}
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ProductCard
                        product={product}
                        onQuickView={(p) => {
                          setQuickViewProduct(p);
                          setIsQuickViewOpen(true);
                        }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={products.length}
      />

      {/* Global Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProduct(null);
        }}
      />
    </div>
  );
}
export default Shop;
