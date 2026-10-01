import React from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const GALLERY_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    handle: '@aurastudio',
    likes: '1.4k',
    tag: 'Look 04 • Cashmere',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    handle: '@aurastudio',
    likes: '890',
    tag: 'Look 07 • Tailored Coat',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    handle: '@aurastudio',
    likes: '2.1k',
    tag: 'Look 09 • Calfskin Loafers',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    handle: '@aurastudio',
    likes: '1.8k',
    tag: 'Look 11 • Saddle Leather',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=800&q=80',
    handle: '@aurastudio',
    likes: '950',
    tag: 'Look 14 • Sapphire Horology',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    handle: '@aurastudio',
    likes: '1.2k',
    tag: 'Living • Bronze Objects',
  },
];

export function SocialGallery() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
              <InstagramIcon className="w-3.5 h-3.5 text-[#FF6B2C]" />
              <span>Community &amp; Lookbook</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-display text-neutral-950 tracking-tight leading-tight">
              Curated on Instagram
            </h2>
            <p className="text-sm text-[#666666] font-sans">
              Tag <span className="font-semibold text-neutral-950">#AuraLiving</span> to be featured in our global seasonal lookbook.
            </p>
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#FF6B2C] text-neutral-800 hover:text-[#FF6B2C] hover:bg-[#FFF8F3] text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-2xs cursor-pointer hover:-translate-y-0.5"
          >
            <span>Follow @aurastudio</span>
            <ArrowUpRight className="w-4 h-4 text-[#FF6B2C]" />
          </a>
        </div>

        {/* Visual Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {GALLERY_POSTS.map((post) => (
            <div
              key={post.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-[#EAEAEA] shadow-2xs block cursor-pointer"
            >
              <img
                src={post.image}
                alt={post.tag}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Hover Dark Overlay with Orange Tag */}
              <div className="absolute inset-0 bg-neutral-950/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3.5 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-300">
                  <InstagramIcon className="w-3.5 h-3.5 text-white" />
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-[#FF6B2C] text-[#FF6B2C]" />
                    <span>{post.likes}</span>
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6B2C] font-bold block">
                    {post.handle}
                  </span>
                  <p className="text-xs font-medium font-display line-clamp-1">
                    {post.tag}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
