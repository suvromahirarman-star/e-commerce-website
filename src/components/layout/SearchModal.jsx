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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
          />

          {/* Search Modal Surface */}
          <motion.div
            variants={modalContent}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[#EAEAEA] overflow-hidden z-10 my-auto"
          >
            {/* Search Header Bar with Orange Focus State */}
            <form
              onSubmit={handleSubmitSearch}
              className="flex items-center gap-3 px-6 py-4.5 border-b border-[#EAEAEA] bg-white transition-all focus-within:bg-[#FFF8F3]/30"
            >
              <Search className="w-5 h-5 text-[#FF6B2C] flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, fabrics, collections..."
                className="w-full text-base sm:text-lg bg-transparent text-neutral-950 placeholder:text-neutral-400 focus:outline-none font-medium font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] uppercase font-mono px-2 py-1 bg-neutral-100 border border-[#EAEAEA] text-neutral-500 rounded-lg hover:text-neutral-900 transition-colors"
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
                        className="text-xs font-semibold text-[#FF6B2C] hover:text-[#E9571F] flex items-center gap-1 cursor-pointer transition-colors"
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
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#FFF8F3] border border-transparent hover:border-[#FF6B2C]/20 transition-all cursor-pointer group"
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
                            <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-[#FF6B2C] transition-colors truncate font-display">
                              {prod.name}
                            </h4>
                            <span className="text-xs font-bold text-neutral-950 font-mono">
                              {formatPrice(prod.price)}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-[#FF6B2C] group-hover:translate-x-1 transition-all" />
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
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
                    <span>Popular Searches</span>
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
                        className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#F8F8F8] hover:bg-[#FFF1E8] hover:text-[#FF6B2C] text-neutral-700 transition-colors cursor-pointer border border-[#EAEAEA]"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Searches */}
              {!query.trim() && recentSearches.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#F2F2F2]">
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
                      className="text-[11px] text-neutral-400 hover:text-[#FF6B2C] underline transition-colors"
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
                        className="text-xs font-medium px-3 py-1 rounded-xl border border-[#EAEAEA] text-neutral-600 hover:border-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FFF8F3] transition-colors cursor-pointer"
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
      )}
    </AnimatePresence>
  );
}
