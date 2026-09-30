import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Compass } from 'lucide-react';

export function CampaignBanner() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Composition Card (White background, strategic orange accent panel) */}
        <div className="relative rounded-3xl overflow-hidden bg-[#FFF8F3] border border-[#FF6B2C]/20 shadow-[0_16px_48px_rgba(0,0,0,0.06)] grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Left Column: Editorial Campaign Story (7 Cols) */}
          <div className="lg:col-span-7 p-8 sm:p-14 lg:p-16 flex flex-col justify-between space-y-8 z-10">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1E8] border border-[#FF6B2C]/20 text-[#FF6B2C] text-xs font-mono font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
                <span>Editorial Lookbook 2026</span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold font-display text-neutral-950 tracking-tight leading-[1.08]">
                The New Season <br />
                <span className="text-[#FF6B2C]">Curated Edit.</span>
              </h2>

              <p className="text-base sm:text-lg text-[#666666] leading-relaxed font-sans max-w-xl">
                Where functional minimalism converges with European textile mastery. Cut from heavyweight virgin wools, double-faced cashmere blends, and unlined Italian silks designed to evolve through decades of wear.
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-200 shadow-md shadow-[#FF6B2C]/25 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>Shop The Campaign</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/about"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-[#FFF1E8] text-neutral-900 hover:text-[#FF6B2C] border border-[#EAEAEA] hover:border-[#FF6B2C]/40 text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Studio Philosophy</span>
                </Link>
              </div>

              {/* Atelier Details Strip */}
              <div className="pt-6 border-t border-[#EAEAEA] grid grid-cols-3 gap-4 text-xs font-mono text-[#666666]">
                <div>
                  <span className="text-neutral-950 font-bold block text-sm sm:text-base font-display">
                    Issue 04
                  </span>
                  <span className="text-[11px] text-[#999999]">Seasonal Atelier</span>
                </div>
                <div className="border-l border-[#EAEAEA] pl-4">
                  <span className="text-neutral-950 font-bold block text-sm sm:text-base font-display">
                    Limited Run
                  </span>
                  <span className="text-[11px] text-[#999999]">Numbered Pieces</span>
                </div>
                <div className="border-l border-[#EAEAEA] pl-4">
                  <span className="text-neutral-950 font-bold block text-sm sm:text-base font-display">
                    Guaranteed
                  </span>
                  <span className="text-[11px] text-[#999999]">Doorstep Exchange</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: High-Impact Photography with Strategic Orange Accent (5 Cols) */}
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden bg-neutral-100">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
              alt="The New Season Curated Edit"
              className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#FFF8F3] lg:via-transparent lg:to-transparent pointer-events-none" />

            {/* Orange Corner Pill */}
            <div className="absolute bottom-6 right-6 z-10">
              <span className="px-4 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#EAEAEA] text-neutral-900 font-mono text-xs font-semibold shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6B2C]" />
                <span>Atelier Release 2026</span>
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
