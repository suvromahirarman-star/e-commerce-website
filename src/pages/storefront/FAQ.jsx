import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, HelpCircle, Sparkles, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    category: 'Guest Orders & Checkout',
    items: [
      {
        q: 'Do I need an account or password to place an order?',
        a: 'No. AURA Studio operates an entirely frictionless guest checkout. You only provide your recipient name, delivery address, and phone number. No passwords, accounts, or mandatory logins are ever required.',
      },
      {
        q: 'How do I know my order has been placed successfully?',
        a: 'Immediately upon placing your order, an on-screen confirmation displays your unique Order ID (#AUR-2026-XXXX). A duplicate confirmation email is sent to your email with itemized receipts and live dispatch tracking.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'Orders enter preparation within 2 hours. If you need to modify garment sizing or update your delivery address, contact our concierge immediately via WhatsApp at +880 1844-998822.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'What are your delivery timelines and courier partners across Bangladesh?',
        a: 'Within Dhaka Metropolitan areas, deliveries arrive within 24 to 48 hours. For all other divisions and districts across Bangladesh, express courier transit takes 3 to 4 business days.',
      },
      {
        q: 'How does Complimentary Express Shipping work?',
        a: 'All orders with a subtotal of ৳3,000 or greater qualify automatically for 100% free white-glove express courier shipping nationwide.',
      },
      {
        q: 'How are garments packaged for transit?',
        a: 'Every piece is wrapped in unbleached acid-free tissue paper and enclosed inside an archival, water-resistant presentation box to prevent creasing and moisture exposure.',
      },
    ],
  },
  {
    category: 'Sizing & Tailoring',
    items: [
      {
        q: 'How do I know which size will fit me best?',
        a: 'Every garment page features our interactive Size Guide with exact measurements in centimeters and inches. You can also chat with our concierge for personalized fit recommendations based on your height and weight.',
      },
      {
        q: 'Are custom sleeve or trouser hem alterations possible?',
        a: 'Yes. Our tailored wool trousers feature generous interior hem allowances specifically left for custom tailoring. Clients in Dhaka may also schedule in-atelier fittings at our Gulshan studio.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      {
        q: 'What is your return and exchange policy?',
        a: 'We offer a 14-day hassle-free doorstep exchange guarantee. If the fit is not ideal, our courier will pick up the item directly from your address and dispatch your replacement size with zero return shipping fees.',
      },
      {
        q: 'What condition must garments be in to qualify for exchange?',
        a: 'Garments must be unworn, unwashed, with all original atelier labels and presentation packaging intact.',
      },
    ],
  },
  {
    category: 'Payments & Security',
    items: [
      {
        q: 'Can I pay with Cash on Delivery (COD)?',
        a: 'Yes. Cash on Delivery is supported nationwide. You may inspect your package at your doorstep before handing payment to the courier.',
      },
      {
        q: 'Do you accept bKash, Nagad, and Credit Cards?',
        a: 'Yes. We accept bKash and Nagad direct merchant transfers, as well as Visa, Mastercard, and American Express with 256-bit SSL encrypted gateway protection.',
      },
    ],
  },
];

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, itemIndex) => {
    const key = `${categoryIndex}-${itemIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredFaqs = FAQS.map((category) => {
    const matchedItems = category.items.filter(
      (item) =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, items: matchedItems };
  }).filter((category) => category.items.length > 0);

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-8 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-mono font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-[#C45B32]" />
            <span>Patron Knowledge Base</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-editorial text-neutral-950 tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
            Clear, transparent details on guest orders, nationwide courier logistics, craftsmanship guarantees, and returns.
          </p>

          {/* Search Input */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search topics (e.g. guest checkout, bKash, return policy)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-neutral-200/90 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-950 shadow-xs"
            />
          </div>
        </div>

        {/* FAQs Accordions */}
        <div className="space-y-10">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl text-center border border-neutral-200 space-y-2">
              <p className="text-sm font-semibold text-neutral-900">
                No matching questions found for "{searchQuery}"
              </p>
              <p className="text-xs text-neutral-500">
                Contact our concierge team directly and we will provide an immediate answer.
              </p>
            </div>
          ) : (
            filteredFaqs.map((category, catIdx) => (
              <div key={catIdx} className="space-y-4">
                <h2 className="text-sm font-mono uppercase tracking-widest text-[#C45B32] font-semibold">
                  {category.category}
                </h2>

                <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs divide-y divide-neutral-100 overflow-hidden">
                  {category.items.map((item, itemIdx) => {
                    const isOpen = !!openItems[`${catIdx}-${itemIdx}`];
                    return (
                      <div key={itemIdx}>
                        <button
                          type="button"
                          onClick={() => toggleItem(catIdx, itemIdx)}
                          className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-editorial font-bold text-sm sm:text-base text-neutral-900 hover:text-[#C45B32] transition-colors cursor-pointer"
                        >
                          <span>{item.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 flex-shrink-0 ${
                              isOpen ? 'rotate-180 text-neutral-900' : ''
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans border-t border-neutral-50 pt-2">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-editorial">Have a specific inquiry?</h3>
            <p className="text-xs text-neutral-400">
              Our Dhaka atelier concierge is available 7 days a week for styling and order assistance.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-neutral-950 text-xs font-mono font-semibold hover:bg-[#C45B32] hover:text-white transition-colors flex-shrink-0 cursor-pointer"
          >
            <span>Contact Concierge</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
export default FAQ;
