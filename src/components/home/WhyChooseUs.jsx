import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, Award, Sparkles } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Complimentary Express Delivery',
    description: 'Free courier shipping nationwide on all orders over ৳3,000. Securely packed and tracked in real time.',
    badge: '48h Dispatch',
  },
  {
    icon: ShieldCheck,
    title: '100% Traceable Craftsmanship',
    description: 'Direct partnerships with ethical European mills and workshops. Zero synthetic shortcuts or overproduction.',
    badge: 'Certified Atelier',
  },
  {
    icon: RefreshCw,
    title: '14-Day Doorstep Returns',
    description: 'No questions asked exchange or full refund policy. Our courier picks up directly from your doorstep.',
    badge: 'Frictionless',
  },
  {
    icon: Headphones,
    title: 'Dedicated Styling Concierge',
    description: 'Personalized fit advice, fabric care guidance, and order support via WhatsApp, phone, or email.',
    badge: '7 Days a Week',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#EAEAEA]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
            <Award className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span>The AURA Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold font-display text-neutral-950 tracking-tight leading-tight">
            Commitment to Perfection
          </h2>
          <p className="text-sm text-[#666666] font-sans">
            Every garment and service touchpoint is engineered to deliver an elevated, stress-free modern shopping experience.
          </p>
        </div>

        {/* 4 Pillars Grid (Pure White & Subtle Orange Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative bg-[#FBFBFA] hover:bg-[#FFF8F3] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#EAEAEA] hover:border-[#FF6B2C]/40 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF1E8] group-hover:bg-[#FF6B2C] border border-[#FF6B2C]/20 group-hover:border-[#FF6B2C] flex items-center justify-center text-[#FF6B2C] group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#FF6B2C] bg-[#FFF1E8] px-2.5 py-1 rounded-full border border-[#FF6B2C]/20">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold font-display text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#666666] leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAEAEA] flex items-center gap-1.5 text-[11px] font-mono text-[#FF6B2C] font-semibold">
                  <Sparkles className="w-3 h-3 text-[#FF6B2C]" />
                  <span>Guaranteed Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
