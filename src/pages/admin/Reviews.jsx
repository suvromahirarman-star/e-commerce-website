import React, { useState, useEffect } from 'react';
import {
  Star,
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Eye,
  MessageSquare,
  ShieldCheck,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { LoadingSkeleton, Modal } from '../../components/common';

export function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);

  const { showToast } = useToast();

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await reviewService.getAllReviews();
      // Ensure each review has a status (defaults to Approved if omitted)
      const sanitized = data.map((r) => ({
        ...r,
        status: r.status || 'Approved',
      }));
      setReviews(sanitized);
    } catch (err) {
      console.error(err);
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await reviewService.updateReviewStatus(id, newStatus);
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (selectedReview && selectedReview.id === id) {
        setSelectedReview((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      showToast(`Review marked as ${newStatus}`, 'success');
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) {
      return;
    }
    try {
      await reviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
      if (selectedReview?.id === id) setSelectedReview(null);
      showToast('Review permanently deleted', 'info');
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  // Metrics
  const totalCount = reviews.length;
  const approvedCount = reviews.filter((r) => r.status === 'Approved').length;
  const pendingCount = reviews.filter((r) => r.status === 'Pending').length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  // Filters
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ? true : r.status === statusFilter;

    const matchesRating =
      ratingFilter === 'all' ? true : Number(r.rating) === Number(ratingFilter);

    return matchesSearch && matchesStatus && matchesRating;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
          Reviews &amp; Editorial Moderation
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Inspect, curate, and moderate patron testimonials across atelier catalog items
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase">Total Reviews</span>
            <MessageSquare className="w-4 h-4 text-neutral-700" />
          </div>
          <div className="text-2xl font-bold font-display text-neutral-950">{totalCount}</div>
          <p className="text-[11px] text-neutral-400 font-mono mt-1">Across all collections</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">Average Rating</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-display text-neutral-950">{avgRating} / 5.0</div>
          <p className="text-[11px] text-neutral-400 font-mono mt-1">Customer satisfaction index</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">Approved</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-display text-neutral-950">{approvedCount}</div>
          <p className="text-[11px] text-emerald-600 font-mono mt-1">Published live on storefront</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <span className="text-[11px] font-mono tracking-wider uppercase text-neutral-400">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-display text-neutral-950">{pendingCount}</div>
          <p className="text-[11px] text-amber-600 font-mono mt-1">Awaiting moderation queue</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patron, product, comment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950"
          >
            <option value="all">All Moderation Statuses</option>
            <option value="Approved">Approved Only</option>
            <option value="Pending">Pending Queue</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">★ 5 Stars Only</option>
            <option value="4">★ 4 Stars Only</option>
            <option value="3">★ 3 Stars Only</option>
            <option value="2">★ 2 Stars Only</option>
            <option value="1">★ 1 Star Only</option>
          </select>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="font-display text-lg text-neutral-800">No reviews found</p>
            <p className="text-xs text-neutral-400 font-mono mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="p-4">Patron</th>
                  <th className="p-4">Product Piece</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 max-w-xs">Headline &amp; Feedback</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredReviews.map((r) => {
                  return (
                    <tr key={r.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                            alt={r.author}
                            className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                          />
                          <div>
                            <div className="font-semibold text-neutral-900">{r.author}</div>
                            {r.verified && (
                              <span className="inline-block text-[10px] text-emerald-600 font-sans">
                                ✓ Verified Buyer
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-sans font-medium text-neutral-800 line-clamp-1 max-w-[180px]">
                          {r.productName || 'Editorial Piece'}
                        </div>
                        <span className="text-[10px] text-neutral-400">ID: {r.productId}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (r.rating || 5)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="font-medium text-neutral-900 line-clamp-1">{r.title}</div>
                        <p className="text-[11px] text-neutral-500 font-sans line-clamp-2 mt-0.5">
                          {r.comment}
                        </p>
                      </td>

                      <td className="p-4 text-neutral-500 whitespace-nowrap">
                        {r.date ? formatDate(r.date) : 'Recent'}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                            r.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : r.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              r.status === 'Approved'
                                ? 'bg-emerald-500'
                                : r.status === 'Rejected'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          {r.status}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReview(r)}
                            title="Inspect Review"
                            className="p-1.5 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {r.status !== 'Approved' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Approved')}
                              title="Approve Review"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}

                          {r.status !== 'Rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                              title="Reject Review"
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            title="Delete Permanently"
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Review Inspection Modal */}
      {selectedReview && (
        <Modal
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          title="Review Inspection &amp; Moderation"
        >
          <div className="space-y-6 text-xs font-mono">
            {/* Header info */}
            <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
              <img
                src={selectedReview.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={selectedReview.author}
                className="w-12 h-12 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <div className="text-base font-bold font-display text-neutral-950">
                  {selectedReview.author}
                </div>
                <div className="text-neutral-400 text-[11px]">
                  Product: <span className="text-neutral-800 font-sans font-medium">{selectedReview.productName}</span>
                </div>
                <div className="text-[10px] text-neutral-400">
                  Date: {selectedReview.date ? formatDate(selectedReview.date) : 'Recent'}
                </div>
              </div>
            </div>

            {/* Stars & Title */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < (selectedReview.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
                <span className="font-bold text-neutral-900 ml-2">
                  {selectedReview.rating} out of 5 stars
                </span>
              </div>
              <h3 className="text-sm font-bold text-neutral-900">{selectedReview.title}</h3>
            </div>

            {/* Content */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60 font-sans text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {selectedReview.comment}
            </div>

            {/* Status controls */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-neutral-400 block mb-1">Current Moderation Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedReview.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : selectedReview.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {selectedReview.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReview.id, 'Approved')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-mono font-medium transition-colors"
                >
                  Approve Live
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedReview.id, 'Rejected')}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-mono font-medium transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
