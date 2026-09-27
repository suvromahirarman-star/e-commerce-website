import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-900 font-semibold">Privacy Policy</span>
        </nav>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-14 rounded-3xl border border-neutral-200/80 shadow-xs space-y-8 text-neutral-800 font-sans">
          <div className="space-y-2 pb-6 border-b border-neutral-100">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              Data Protection Protocol
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-editorial text-neutral-950">
              Privacy Policy &amp; Data Ethics
            </h1>
            <p className="text-xs font-mono text-neutral-400">Last updated: September 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              1. Guest Checkout &amp; Data Minimization
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              At AURA Studio, privacy is an architectural pillar of our customer experience. We enforce a strict guest checkout protocol: we do not mandate account creation, password generation, or public social profile linking. We collect solely the information required to fulfill and deliver your luxury garments: your recipient name, phone contact, delivery destination, and email address.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              2. How Your Information Is Used
            </h2>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-neutral-600 space-y-1.5 leading-relaxed">
              <li>Dispatching courier notifications and real-time delivery SMS/email tracking.</li>
              <li>Processing secure transactions via certified encrypted payment gateways.</li>
              <li>Providing styling support, bespoke tailoring consultations, or exchange assistance.</li>
              <li>We will never rent, sell, or trade your personal data to third-party ad networks.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              3. Payment Security &amp; Encryption
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              All payment submissions (bKash merchant routing, credit/debit card processing) are transmitted through 256-bit SSL encrypted channels conforming to PCI-DSS Level 1 compliance standards. Card details are processed directly by our licensed gateway partners and are never stored on AURA servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold font-editorial text-neutral-950">
              4. Contacting Our Data Concierge
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              If you have any questions regarding your delivery records or wish to request complete data erasure following fulfillment, please email{' '}
              <strong className="text-neutral-950">privacy@aurastudio.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
export default PrivacyPolicy;
