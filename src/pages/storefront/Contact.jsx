import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Check, Sparkles, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function Contact() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill out all required fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Message sent to AURA Concierge! We will respond within 4 hours.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: '',
      });
    }, 700);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span>Concierge &amp; Private Appointments</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-neutral-950 tracking-tight">
            Connect With Our Studio
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-sans">
            Whether inquiring about custom tailoring adjustments, order dispatch tracking, or private showroom visits in Dhaka, our concierge team is at your disposal.
          </p>
        </div>

        {/* Contact Layout: Left Info Cards + Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Touchpoints (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold font-display text-neutral-950 pb-3 border-b border-neutral-100">
                Direct Channels
              </h2>

              <div className="space-y-4 text-xs font-mono">
                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAFAFA] border border-neutral-200/70">
                  <div className="p-2.5 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] shadow-2xs">
                    <Phone className="w-4 h-4 text-[#FF6B2C]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Direct Hotline &amp; WhatsApp
                    </span>
                    <a
                      href="tel:+8801844998822"
                      className="font-bold text-neutral-900 text-sm hover:text-[#FF6B2C] transition-colors block"
                    >
                      +880 1844-998822
                    </a>
                    <span className="text-[11px] text-neutral-500">Available 9am – 10pm Daily</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAFAFA] border border-neutral-200/70">
                  <div className="p-2.5 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] shadow-2xs">
                    <Mail className="w-4 h-4 text-[#FF6B2C]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Client Concierge Email
                    </span>
                    <a
                      href="mailto:concierge@aurastudio.com"
                      className="font-bold text-neutral-900 text-sm hover:text-[#FF6B2C] transition-colors block"
                    >
                      concierge@aurastudio.com
                    </a>
                    <span className="text-[11px] text-neutral-500">Response guaranteed in 4h</span>
                  </div>
                </div>

                {/* Studio Location */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#FAFAFA] border border-neutral-200/70">
                  <div className="p-2.5 rounded-xl bg-[#FFF1E8] text-[#FF6B2C] shadow-2xs">
                    <MapPin className="w-4 h-4 text-[#FF6B2C]" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Flagship Atelier Showroom
                    </span>
                    <div className="font-bold text-neutral-900 text-sm font-sans">
                      Road 11, Block D, Gulshan-2
                    </div>
                    <span className="text-[11px] text-neutral-500 font-sans block">
                      Dhaka 1212, Bangladesh (By Private Appointment)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Box */}
            <div className="bg-neutral-950 text-white p-6 sm:p-8 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF6B2C]">
                <Clock className="w-4 h-4" />
                <span>Operating Timetable</span>
              </div>
              <h3 className="text-base font-bold font-display">
                Saturday to Thursday: 10:00 AM – 8:00 PM
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Friday atelier showroom visits are reserved exclusively for bespoke bridal and private tailoring fittings.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
            <div className="space-y-1 pb-4 border-b border-neutral-100">
              <h2 className="text-xl font-bold font-display text-neutral-950">
                Send a Dispatch Message
              </h2>
              <p className="text-xs text-neutral-500">
                Fill in your details below and our personal styling lead will be in touch promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    placeholder="e.g. Farhan Anis"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="01712-345678"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                    Inquiry Type
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C] bg-white"
                  >
                    <option value="General Inquiry">General Atelier Inquiry</option>
                    <option value="Order Tracking">Courier &amp; Delivery Tracking</option>
                    <option value="Custom Sizing">Bespoke Fit &amp; Size Consultation</option>
                    <option value="Returns">14-Day Doorstep Return / Exchange</option>
                    <option value="Private Showroom">Book Gulshan Showroom Visit</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                  Detailed Inquiry *
                </label>
                <textarea
                  required
                  rows={5}
                  name="message"
                  placeholder="How may our concierge assist your atelier experience today?..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B2C]/20 focus:border-[#FF6B2C] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#FF6B2C] hover:bg-[#E9571F] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <span>Transmitting Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Concierge</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Contact;
