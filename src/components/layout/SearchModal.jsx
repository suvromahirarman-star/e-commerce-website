import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';
import { modalBackdrop, modalContent } from '../../utils/animations';

const POPULAR_SEARCHES = [
  'Wool Trench',
  'Silk Dress',
  'Chelsea Boots',
  'Leather Duffle',
  'Minimalist Watch',
  'Denim Jacket',
];

const RECENT_KEY = 'aura_recent_searches';

export function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      return saved ? JSON.parse(saved) : ['Wool Trench', 'Silk Bias Dress', 'Boots'];
    } catch (e) {
      return ['Wool Trench', 'Silk Bias Dress', 'Boots'];
    }
  });

  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input on open & lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Live search debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const handler = setTimeout(async () => {
      const hits = await productService.searchProducts(query);
      setResults(hits);
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(handler);
  }, [query]);

  // Save query to recent searches
  const recordRecentSearch = (term) => {
    const clean = term.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== clean.toLowerCase());
      const updated = [clean, ...filtered].slice(0, 6);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      } catch (e) {
        // Ignore
      }
      return updated;
    });
  };

  const handleSelectProduct = (slug) => {
    recordRecentSearch(query || slug);
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleSubmitSearch = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    recordRecentSearch(query);
    onClose();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          variants={modalBackdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
        />

        {/* Search Modal Card */}
        <motion.div
          variants={modalContent}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden z-10 my-auto"
        >
          {/* Search Header Bar */}
          <form
            onSubmit={handleSubmitSearch}
            className="flex items-center gap-3 px-6 py-5 border-b border-neutral-100 bg-neutral-50/50"
          >
            <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, materials, collections, colors..."
              className="w-full text-base sm:text-lg bg-transparent text-neutral-900 placeholder:text-neutral-400 focus:outline-none font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-md"
                aria-label="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase font-mono px-2 py-1 bg-white border border-neutral-200 text-neutral-500 rounded-md hover:text-neutral-900 transition-colors"
            >
              ESC
            </button>
          </form>

          {/* Modal Content Body */}
          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
            {/* Live Search Results */}
            {query.trim() && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-neutral-400 tracking-wider">
                    {isLoading ? 'Searching...' : `Found ${results.length} results`}
                  </span>
                  {results.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSubmitSearch}
                      className="text-xs font-semibold text-[#C45B32] hover:text-[#963A1E] flex items-center gap-1 cursor-pointer"
                    >
                      <span>View all results</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {results.length > 0 ? (
                  <div className="space-y-2">
                    {results.slice(0, 5).map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod.slug)}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all cursor-pointer group"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-14 h-16 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block truncate">
                            {prod.category} • {prod.brand}
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-[#C45B32] transition-colors truncate">
                            {prod.name}
                          </h4>
                          <span className="text-xs font-bold text-neutral-950 font-mono">
                            {formatPrice(prod.price)}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                ) : !isLoading ? (
                  <div className="text-center py-10 space-y-2">
                    <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto" />
                    <p className="text-sm font-semibold text-neutral-800">
                      No matching products found
                    </p>
                    <p className="text-xs text-neutral-500">
                      Try searching with different keywords like "wool", "dress", "boots" or "bag"
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Popular Searches Pills */}
            {!query.trim() && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-neutral-400 tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-[#C45B32]" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        recordRecentSearch(term);
                      }}
                      className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query.trim() && recentSearches.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-neutral-400 tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Recent Searches</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem(RECENT_KEY);
                    }}
                    className="text-[11px] text-neutral-400 hover:text-neutral-700 underline"
                  >
                    Clear
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="text-xs font-medium px-3 py-1 rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-900 hover:text-neutral-900 transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
