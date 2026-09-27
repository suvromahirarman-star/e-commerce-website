import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, Award, Sparkles } from 'lucide-react';

const BENEFITS = [
  {
    icon: Truck,
    title: 'Complimentary Express Delivery',
    description: 'Free white-glove courier shipping nationwide on all orders over ৳3,000. Securely packed and tracked.',
    badge: '48h Dispatch',
  },
  {
    icon: ShieldCheck,
    title: '100% Traceable Craftsmanship',
    description: 'Direct relationships with ethical European mills and workshops. Zero synthetic shortcuts.',
    badge: 'Certified Atelier',
  },
  {
    icon: RefreshCw,
    title: '14-Day Doorstep Returns',
    description: 'No questions asked exchange or full refund policy. Our courier picks up directly from your location.',
    badge: 'Frictionless',
  },
  {
    icon: Headphones,
    title: 'Dedicated Styling Concierge',
    description: 'Personalized fit advice, garment care guidance, and order support via WhatsApp, phone, or email.',
    badge: '7 Days a Week',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-24 bg-white border-b border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>The AURA Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-editorial text-neutral-950 tracking-tight">
            Commitment to Perfection
          </h2>
          <p className="text-sm text-neutral-500">
            Every garment and service touchpoint is engineered to deliver an elevated, stress-free luxury shopping experience.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {BENEFITS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative bg-[#FAF9F6] p-6 sm:p-8 rounded-3xl border border-neutral-200/70 hover:border-neutral-900 transition-all duration-300 hover:shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-200/60 flex items-center justify-center text-neutral-950 group-hover:bg-[#C45B32] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-neutral-500 bg-white px-2.5 py-1 rounded-full border border-neutral-200/60">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold font-editorial text-neutral-950">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-200/50 flex items-center gap-1.5 text-[11px] font-mono text-[#C45B32] font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Guaranteed Standards</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
