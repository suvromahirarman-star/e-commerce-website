import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2 } from 'lucide-react';
import { mockReviews } from '../../data/mockReviews';
import { formatDate } from '../../utils/formatters';

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = mockReviews && mockReviews.length > 0 ? mockReviews : [];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFF8F3]/50 border-b border-[#EAEAEA] overflow-hidden">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header with Carousel Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
              Verified Patron Impressions
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-display text-neutral-950 tracking-tight leading-tight">
              Words From Our Patrons
            </h2>
            <p className="text-sm text-[#666666] font-sans">
              Authentic reviews from discerning patrons across Bangladesh who value enduring quality.
            </p>
          </div>

          {/* Carousel Arrows with Orange Hover States */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-3 rounded-xl bg-white border border-[#EAEAEA] text-neutral-800 hover:border-[#FF6B2C] hover:text-[#FF6B2C] transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-3 rounded-xl bg-white border border-[#EAEAEA] text-neutral-800 hover:border-[#FF6B2C] hover:text-[#FF6B2C] transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#EAEAEA] hover:border-[#FF6B2C]/30 shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Rating & Orange Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#FF6B2C]/25" />
                </div>

                {/* Review Title & Body */}
                <h4 className="text-base font-bold font-display text-neutral-950 line-clamp-1">
                  "{review.title}"
                </h4>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-sans line-clamp-4">
                  {review.comment}
                </p>
              </div>

              {/* Author & Product Verification */}
              <div className="pt-4 border-t border-[#F2F2F2] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.author}
                    className="w-10 h-10 rounded-full object-cover bg-neutral-100 border border-[#EAEAEA]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-950 font-display">
                        {review.author}
                      </span>
                      {review.verified && (
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-[#25855A]"
                          title="Verified Client"
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#999999] block truncate max-w-[140px]">
                      {review.productName}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#999999]">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
