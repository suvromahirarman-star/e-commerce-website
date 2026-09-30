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
    showToast('Welcome! You have received 10% off with code AURA10', 'success');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#171717] text-neutral-300 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Brand Newsletter Card */}
        <div className="rounded-3xl p-8 sm:p-12 bg-neutral-900 border border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Subtle Orange Accent Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF6B2C]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-lg text-center lg:text-left relative z-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6B2C] font-bold">
              Privileges &amp; Updates
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Enjoy 10% off your inaugural order.
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
              Receive private previews of limited seasonal drops, special discounts, and editorial notes on modern living.
            </p>
          </div>

          <div className="w-full lg:w-auto min-w-[320px] max-w-md relative z-10">
            {isSubscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs font-medium text-center">
                ✓ Thank you for subscribing. Use voucher code <strong>AURA10</strong> at guest checkout.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C]/30 font-sans"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-[#FF6B2C] hover:bg-[#E9571F] text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer flex-shrink-0 shadow-sm shadow-[#FF6B2C]/30 hover:-translate-y-0.5"
                  >
                    Subscribe
                  </button>
                </div>
                <span className="text-[10px] text-neutral-500 block text-center lg:text-left font-mono">
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
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FF6B2C] text-white flex items-center justify-center font-display font-extrabold text-base">
                A
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-bold font-display tracking-tight text-white leading-none">
                  AURA<span className="text-[#FF6B2C]">.</span>
                </span>
                <span className="text-[8px] tracking-[0.25em] uppercase font-mono text-neutral-400 font-semibold leading-none mt-0.5">
                  Studio
                </span>
              </div>
            </Link>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-sans">
              Original fashion, architectural silhouettes, and curated essentials. Distinctive design built for modern everyday elegance.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-neutral-400 font-mono">
              <span>Dhaka, Bangladesh</span>
              <span>•</span>
              <span className="text-[#FF6B2C]">Worldwide Atelier</span>
            </div>
          </div>

          {/* Column 1: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Shop
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link to="/category/mens" className="hover:text-[#FF6B2C] transition-colors">
                  Men's Atelier
                </Link>
              </li>
              <li>
                <Link to="/category/womens" className="hover:text-[#FF6B2C] transition-colors">
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link to="/category/footwear" className="hover:text-[#FF6B2C] transition-colors">
                  Footwear &amp; Boots
                </Link>
              </li>
              <li>
                <Link to="/category/bags" className="hover:text-[#FF6B2C] transition-colors">
                  Artisanal Bags
                </Link>
              </li>
              <li>
                <Link to="/category/watches" className="hover:text-[#FF6B2C] transition-colors">
                  Timepieces
                </Link>
              </li>
              <li>
                <Link to="/category/living" className="hover:text-[#FF6B2C] transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              Client Care
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link to="/contact" className="hover:text-[#FF6B2C] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#FF6B2C] transition-colors">
                  FAQs &amp; Help
                </Link>
              </li>
              <li>
                <Link to="/faq#shipping" className="hover:text-[#FF6B2C] transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/faq#returns" className="hover:text-[#FF6B2C] transition-colors">
                  7-Day Returns
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#FF6B2C] transition-colors">
                  Track Delivery
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: The House & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
              The Brand
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <Link to="/about" className="hover:text-[#FF6B2C] transition-colors">
                  Brand Story
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#FF6B2C] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#FF6B2C] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#FF6B2C] font-mono text-[11px] pt-2 transition-colors"
                >
                  <Lock className="w-3 h-3 text-[#FF6B2C]" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
          <p>© 2026 AURA Studio. All rights reserved.</p>

          {/* Payment Methods */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase text-neutral-500">Payments:</span>
            <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300">
              Cash on Delivery
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] text-pink-400 font-bold">
              bKash
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] text-[#FF6B2C] font-bold">
              Nagad
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-neutral-900 border border-neutral-800 text-[10px] text-sky-400 font-bold">
              Visa / MC
            </span>
          </div>

          {/* Back to top button */}
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-[#FF6B2C] p-1 rounded-lg transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#FF6B2C]" />
          </button>
        </div>
      </div>
    </footer>
  );
}
