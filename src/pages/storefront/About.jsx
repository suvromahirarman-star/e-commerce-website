import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, Shield, Compass, Heart } from 'lucide-react';
import { Button } from '../../components/common';

const TIMELINE = [
  {
    year: '2021',
    title: 'The Atelier Inception',
    description: 'Founded with a singular manifesto: rejecting fast fashion obsolescence in favor of architectural, traceable silhouettes built to endure decades.',
  },
  {
    year: '2023',
    title: 'European Textile Partnerships',
    description: 'Secured exclusive relationships with generational wool spinning mills in Biella, Italy, and artisan leather tanneries in Tuscany.',
  },
  {
    year: '2025',
    title: 'Flagship Atelier Experience',
    description: 'Opened private appointment tailoring studios in Dhaka and expanded express white-glove logistics across all Bangladesh divisions.',
  },
  {
    year: '2026',
    title: 'Global Atelier Archive',
    description: 'Launched digital commerce platform with transparent guest checkout, digital lookbooks, and lifetime repair commitments.',
  },
];

const PILLARS = [
  {
    icon: Compass,
    title: 'Architectural Drape',
    description: 'We approach garment pattern-making like structural design. Proportions are balanced to flatter every stance while enabling natural fluid movement.',
  },
  {
    icon: Shield,
    title: 'Traceable Provenance',
    description: '100% of our merino wool originates from ethical non-mulesed farms in Australia, spun in historic Italian mills with zero synthetic dilution.',
  },
  {
    icon: Award,
    title: 'Generational Craft',
    description: 'Natural horn buttons, double-faced hand-finished hems, and Goodyear-welted French box calf boots built to be resoled for decades.',
  },
  {
    icon: Heart,
    title: 'Quiet Luxury Philosophy',
    description: 'No loud branding or gaudy logos. The quality of our garments announces itself through weight, hand-feel, and enduring composure.',
  },
];

export function About() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Editorial Story Hero */}
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#C45B32]" />
            <span>Studio Philosophy &amp; Vision</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold font-editorial text-neutral-950 tracking-tight leading-[1.1]">
            We believe in things <br />
            <span className="italic font-normal text-[#C45B32]">crafted to outlast time.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-sans">
            AURA Studio was founded as an antidote to disposable clothing culture. We design refined, minimalist garments, Goodyear-welted leather footwear, and tactile home objects crafted with generational textile mastery.
          </p>
        </div>

        {/* Large Editorial Portrait & Studio Image Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/10] bg-neutral-900">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=85"
              alt="Atelier fabric cutting and craftsmanship"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute bottom-6 left-6 text-white text-xs font-mono bg-neutral-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              Pattern Cutting Studio • Issue 04
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xs">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              The Atelier Ethos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-neutral-950">
              Form follows material honesty.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
              Every garment begins with the fiber. Whether selecting 480gsm double-faced merino wool from Portugal or 8mm organic cellulose acetate from Sabae, Japan, we collaborate only with artisans who take relentless pride in their trade.
            </p>
            <div className="pt-2">
              <Link to="/shop">
                <Button variant="primary" size="md" icon={ArrowRight}>
                  Explore The Collection
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Craftsmanship */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              Our Principles
            </span>
            <h2 className="text-3xl font-bold font-editorial text-neutral-950">
              Pillars of Integrity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4 hover:border-neutral-900 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-neutral-200/60 flex items-center justify-center text-[#C45B32]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold font-editorial text-neutral-950">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-8 sm:p-14 rounded-3xl border border-neutral-200/80 shadow-xs space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              Historical Milestones
            </span>
            <h2 className="text-3xl font-bold font-editorial text-neutral-950">
              The Evolution of AURA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {TIMELINE.map((item, idx) => (
              <div key={idx} className="space-y-3 relative">
                <span className="text-2xl font-bold font-mono text-[#C45B32] block">
                  {item.year}
                </span>
                <h4 className="text-sm font-bold font-editorial text-neutral-900">
                  {item.title}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed font-sans">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;
