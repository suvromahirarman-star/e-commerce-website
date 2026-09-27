import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function Footer() {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!emailInput.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.trim())) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubscribed(true);
    setEmailInput('');
    showToast('Welcome to AURA Circle! You have received 10% off with code AURA10', 'success');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Brand Newsletter Banner */}
        <div className="rounded-3xl p-8 sm:p-12 bg-neutral-900/60 border border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-lg text-center lg:text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
              The AURA Journal &amp; Privileges
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-white tracking-tight">
              Enjoy 10% off your inaugural order.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Receive private previews of limited atelier releases, seasonal campaigns, and editorial notes on modern living.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] max-w-md">
            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs font-medium text-center">
                ✓ Thank you for subscribing. Use code <strong>AURA10</strong> at guest checkout.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer flex-shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 block text-center lg:text-left">
                  Zero spam. Unsubscribe at any time with a single click.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Directory Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10 pt-4">
          {/* Brand Intro (Span 2) */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold font-editorial tracking-wider text-white">
                AURA
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase font-mono text-neutral-500 font-semibold block -mt-1">
                Studio
              </span>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Contemporary living, architectural apparel, and artisanal objects. Thoughtfully engineered to transcend fleeting trends and endure across seasons.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-neutral-400 font-mono">
              <span>Dhaka, Bangladesh</span>
              <span>•</span>
              <span>Global Sourcing</span>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link to="/category/mens" className="hover:text-white transition-colors">
                  Men's Atelier
                </Link>
              </li>
              <li>
                <Link to="/category/womens" className="hover:text-white transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/category/footwear" className="hover:text-white transition-colors">
                  Footwear &amp; Boots
                </Link>
              </li>
              <li>
                <Link to="/category/bags" className="hover:text-white transition-colors">
                  Artisanal Bags
                </Link>
              </li>
              <li>
                <Link to="/category/watches" className="hover:text-white transition-colors">
                  Timepieces
                </Link>
              </li>
              <li>
                <Link to="/category/living" className="hover:text-white transition-colors">
                  Living &amp; Objects
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Client Services
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/faq#shipping" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link to="/faq#returns" className="hover:text-white transition-colors">
                  7-Day Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: House & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              The House
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link to="/about#craft" className="hover:text-white transition-colors">
                  Sustainable Sourcing
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-amber-400 font-mono text-[11px] pt-2"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <p>© 2026 AURA Studio Inc. All rights reserved.</p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase text-neutral-600">Accepted:</span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">
              Cash on Delivery
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-pink-400 font-bold">
              bKash
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-orange-400 font-bold">
              Nagad
            </span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-sky-400 font-bold">
              Cards
            </span>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
