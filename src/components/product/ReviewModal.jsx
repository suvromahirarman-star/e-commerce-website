import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Check } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';

export function ReviewModal({ product, isOpen, onClose, onReviewAdded }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !title.trim() || !comment.trim()) {
      showToast('Please fill out all review fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const newRev = await reviewService.addReview({
        productId: product.id,
        productName: product.name,
        author: author.trim(),
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating,
        title: title.trim(),
        comment: comment.trim(),
      });

      showToast('Thank you! Your verified review has been submitted', 'success');
      if (onReviewAdded) onReviewAdded(newRev);
      onClose();
    } catch (err) {
      showToast('Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-neutral-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-xl font-bold font-display text-neutral-950">
                Write a Verified Review
              </h3>
              <p className="text-xs text-neutral-500 truncate max-w-xs">{product.name}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Star Rating Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Overall Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                    aria-label={`${star} star rating`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-mono font-bold text-neutral-800 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Author Name */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Rahman"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C]"
              />
            </div>

            {/* Review Title */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Headline / Summary
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Exceptional woolen drape and finish"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C]"
              />
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                Detailed Review &amp; Fit Impression
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your thoughts on the craftsmanship, fabric feel, tailoring, and sizing..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C] resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publish Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
