import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function TermsConditions() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">Terms &amp; Conditions</span>
        </nav>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-14 rounded-3xl border border-neutral-200/80 shadow-xs space-y-8 text-neutral-800 font-sans">
          <div className="space-y-2 pb-6 border-b border-neutral-100">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              Atelier Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-neutral-950">
              Terms &amp; Conditions of Service
            </h1>
            <p className="text-xs font-mono text-neutral-400">Effective Date: Autumn 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              1. General Provisions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              These terms govern the purchase of all garments, leather goods, footwear, and lifestyle objects offered through AURA Studio platforms. By confirming a guest checkout order, you agree to comply with these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              2. Currency &amp; Pricing Accuracy
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              All prices quoted on the platform are in Bangladeshi Taka (৳ BDT) inclusive of applicable atelier duties and packaging. We reserve the right to correct typographical pricing discrepancies before dispatch with prior client notification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              3. Courier Dispatch &amp; Doorstep Inspection
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              For Cash on Delivery orders, clients are invited to inspect outer parcel seals and item contents in the presence of the courier agent before final tender. Dispatch transit times are subject to division logistics and weather conditions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              4. 14-Day Exchange Guarantee
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Garments in original, unwashed, unaltered condition with atelier hangtags attached are eligible for size or color exchange within 14 calendar days of receipt. Doorstep courier pickup is organized compliments of AURA Studio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              5. Intellectual Property
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              All editorial imagery, typography compositions, pattern descriptions, and trade names are the exclusive intellectual property of AURA Studio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
export default TermsConditions;
