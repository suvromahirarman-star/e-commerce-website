import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Home, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="bg-[#FAFAFA] min-h-[75vh] flex items-center justify-center py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
        {/* Large Decorative 404 */}
        <div className="relative select-none">
          <span className="text-8xl sm:text-9xl font-bold font-display text-neutral-200 block tracking-tighter">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-neutral-950 text-white flex items-center justify-center shadow-xl">
              <Compass className="w-8 h-8 text-[#FF6B2C]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-semibold">
            Uncharted Coordinate
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-neutral-950">
            Page Not Found in Atelier
          </h1>
          <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed font-sans">
            The link you followed may have expired, or the garment has moved to another collection within our seasonal archive.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FF6B2C] hover:bg-[#E9571F] text-white text-xs font-mono font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-neutral-300 hover:border-[#FF6B2C] hover:text-[#FF6B2C] text-neutral-900 text-xs font-mono font-semibold transition-colors shadow-xs"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Department Shortcuts */}
        <div className="pt-8 border-t border-neutral-200/70 space-y-3">
          <span className="text-xs font-mono text-neutral-400">
            Or discover our core departments:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: "Men's Atelier", slug: 'mens' },
              { label: "Women's Collection", slug: 'womens' },
              { label: 'Footwear & Boots', slug: 'footwear' },
              { label: 'Artisanal Leather Bags', slug: 'bags' },
            ].map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-neutral-700 hover:text-[#FF6B2C] hover:border-[#FF6B2C]/40 text-xs font-mono transition-colors shadow-2xs"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default NotFound;
