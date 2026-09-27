import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common';

export function CampaignBanner() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-950 text-white min-h-[520px] lg:min-h-[580px] flex items-center shadow-2xl">
          {/* Split Background Visuals */}
          <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
            <div className="hidden lg:block relative h-full">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
                alt="Campaign editorial photography"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 to-neutral-950" />
            </div>

            <div className="relative h-full">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85"
                alt="The New Season Edit"
                className="w-full h-full object-cover opacity-40 lg:opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent lg:bg-gradient-to-l lg:from-transparent lg:to-neutral-950" />
            </div>
          </div>

          {/* Foreground Editorial Story */}
          <div className="relative z-10 p-8 sm:p-14 lg:p-20 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-neutral-200 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#E8956A]" />
              <span>Editorial Lookbook 2026</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-editorial tracking-tight leading-[1.1]">
              The New Season <br />
              <span className="italic font-normal text-[#E8956A]">Curated Edit.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans max-w-xl">
              Where Scandinavian functional minimalism converges with European textile mastery. Cut from heavyweight virgin wools, double-faced cashmere blends, and unlined Italian silks designed to evolve through decades of wear.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/shop">
                <Button variant="accent" size="lg" icon={ArrowRight}>
                  Shop The Campaign
                </Button>
              </Link>

              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/10 text-white border-white/20 hover:bg-white hover:text-neutral-950"
                >
                  Read Studio Philosophy
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-8 text-xs font-mono text-neutral-400">
              <div>
                <span className="text-white font-bold block text-sm">Issue 04</span>
                <span>Autumn Edition</span>
              </div>
              <div>
                <span className="text-white font-bold block text-sm">Limited Batches</span>
                <span>Numbered Garments</span>
              </div>
              <div>
                <span className="text-white font-bold block text-sm">Worldwide Care</span>
                <span>Lifetime Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
