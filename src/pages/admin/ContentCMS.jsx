import React, { useState, useEffect } from 'react';
import {
  Layout,
  Type,
  Bell,
  Sparkles,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  Image as ImageIcon,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export function ContentCMS() {
  const [content, setContent] = useState(null);
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const data = adminService.getHomepageContent();
    setContent(data);
  }, []);

  const handleHeroChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const handleAnnouncementChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      announcement: {
        ...prev.announcement,
        [field]: value,
      },
    }));
  };

  const handleBannerChange = (field, value) => {
    setContent((prev) => ({
      ...prev,
      promotionalBanner: {
        ...prev.promotionalBanner,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setSaving(true);
    try {
      adminService.updateHomepageContent(content);
      showToast('Homepage CMS updated successfully', 'success');
    } catch (err) {
      showToast('Failed to save CMS configuration', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!window.confirm('Reset all homepage CMS content to default factory values?')) return;
    localStorage.removeItem('aura_homepage_cms');
    const fresh = adminService.getHomepageContent();
    setContent(fresh);
    showToast('Reset to default content', 'info');
  };

  if (!content) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
            Storefront CMS &amp; Content
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Customize hero editorial copy, announcement bar tickers, and seasonal banner campaigns
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-mono transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-mono font-medium shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? 'Publishing...' : 'Save & Publish'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 gap-6 font-mono text-xs">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'hero'
              ? 'border-neutral-950 text-neutral-950 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Hero Showcase
        </button>

        <button
          onClick={() => setActiveTab('announcement')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'announcement'
              ? 'border-neutral-950 text-neutral-950 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Bell className="w-4 h-4" />
          Announcement Bar
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'banner'
              ? 'border-neutral-950 text-neutral-950 font-bold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Layout className="w-4 h-4" />
          Campaign Banner
        </button>
      </div>

      {/* Tab 1: Hero Section */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold font-display text-neutral-950">
              Hero Header &amp; Visuals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                  Seasonal Badge / Kicker
                </label>
                <input
                  type="text"
                  value={content.hero.badge || ''}
                  onChange={(e) => handleHeroChange('badge', e.target.value)}
                  placeholder="e.g. Autumn / Winter 2026 Collection"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                  Hero Imagery (Unsplash or CDN URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={content.hero.heroImage || ''}
                    onChange={(e) => handleHeroChange('heroImage', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
                  />
                  {content.hero.heroImage && (
                    <img
                      src={content.hero.heroImage}
                      alt="Hero preview"
                      className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Main Editorial Headline
              </label>
              <input
                type="text"
                value={content.hero.headline || ''}
                onChange={(e) => handleHeroChange('headline', e.target.value)}
                placeholder="Designed with Intention. Crafted to Endure."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm font-display focus:outline-none focus:ring-2 focus:ring-neutral-950 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Supporting Brand Copy
              </label>
              <textarea
                rows={3}
                value={content.hero.supportingCopy || ''}
                onChange={(e) => handleHeroChange('supportingCopy', e.target.value)}
                placeholder="Narrative description..."
                className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-neutral-950 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-neutral-100">
              <div className="space-y-3">
                <span className="text-xs font-bold font-mono text-neutral-800">Primary CTA Button</span>
                <input
                  type="text"
                  placeholder="Button Label"
                  value={content.hero.primaryCtaText || ''}
                  onChange={(e) => handleHeroChange('primaryCtaText', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Target Route (e.g. /shop)"
                  value={content.hero.primaryCtaLink || ''}
                  onChange={(e) => handleHeroChange('primaryCtaLink', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold font-mono text-neutral-800">Secondary CTA Button</span>
                <input
                  type="text"
                  placeholder="Button Label"
                  value={content.hero.secondaryCtaText || ''}
                  onChange={(e) => handleHeroChange('secondaryCtaText', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Target Route (e.g. /about)"
                  value={content.hero.secondaryCtaLink || ''}
                  onChange={(e) => handleHeroChange('secondaryCtaLink', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Hero Live Preview */}
          <div className="bg-neutral-950 text-white p-8 rounded-3xl overflow-hidden relative shadow-lg">
            <div className="absolute top-4 right-4 bg-neutral-800/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-neutral-300 flex items-center gap-1.5">
              <Eye className="w-3 h-3" />
              Storefront Preview
            </div>
            <div className="max-w-xl space-y-4">
              <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-terracotta-400">
                {content.hero.badge}
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-bold leading-tight">
                {content.hero.headline}
              </h1>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                {content.hero.supportingCopy}
              </p>
              <div className="flex gap-3 pt-2">
                <span className="px-4 py-2 bg-white text-neutral-950 rounded-xl text-xs font-mono font-medium">
                  {content.hero.primaryCtaText} →
                </span>
                <span className="px-4 py-2 border border-white/20 text-neutral-300 rounded-xl text-xs font-mono">
                  {content.hero.secondaryCtaText}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Announcement Bar */}
      {activeTab === 'announcement' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold font-display text-neutral-950">
                  Global Storefront Banner Ticker
                </h2>
                <p className="text-xs text-neutral-500 font-mono">
                  Pinned at the very top of all customer-facing storefront pages
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.announcement.enabled ?? true}
                  onChange={(e) => handleAnnouncementChange('enabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-950"></div>
                <span className="ml-3 text-xs font-mono text-neutral-700">
                  {content.announcement.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Announcement Text Notice
              </label>
              <input
                type="text"
                value={content.announcement.text || ''}
                onChange={(e) => handleAnnouncementChange('text', e.target.value)}
                placeholder="e.g. Complimentary delivery across Bangladesh..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                  Link Text (Optional)
                </label>
                <input
                  type="text"
                  value={content.announcement.linkText || ''}
                  onChange={(e) => handleAnnouncementChange('linkText', e.target.value)}
                  placeholder="e.g. Shop Now"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                  Target Route URL
                </label>
                <input
                  type="text"
                  value={content.announcement.linkUrl || ''}
                  onChange={(e) => handleAnnouncementChange('linkUrl', e.target.value)}
                  placeholder="/shop"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Announcement Preview */}
          <div className="bg-neutral-950 text-white p-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-mono shadow-xs">
            <span>{content.announcement.text}</span>
            {content.announcement.linkText && (
              <span className="underline font-bold text-terracotta-400">
                {content.announcement.linkText} →
              </span>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Campaign Banner */}
      {activeTab === 'banner' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-bold font-display text-neutral-950">
              Middle-Page Editorial Campaign Banner
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                  Campaign Title
                </label>
                <input
                  type="text"
                  value={content.promotionalBanner.title || ''}
                  onChange={(e) => handleBannerChange('title', e.target.value)}
                  placeholder="THE MODERN ATELIER EDIT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={content.promotionalBanner.subtitle || ''}
                  onChange={(e) => handleBannerChange('subtitle', e.target.value)}
                  placeholder="Limited Production Runs"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Campaign Imagery (URL)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={content.promotionalBanner.image || ''}
                  onChange={(e) => handleBannerChange('image', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
                {content.promotionalBanner.image && (
                  <img
                    src={content.promotionalBanner.image}
                    alt="Banner preview"
                    className="w-10 h-10 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Editorial Description
              </label>
              <textarea
                rows={3}
                value={content.promotionalBanner.description || ''}
                onChange={(e) => handleBannerChange('description', e.target.value)}
                placeholder="Narrative..."
                className="w-full p-3 rounded-xl border border-neutral-200 text-xs font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                  Button Call-to-Action
                </label>
                <input
                  type="text"
                  value={content.promotionalBanner.ctaText || ''}
                  onChange={(e) => handleBannerChange('ctaText', e.target.value)}
                  placeholder="Discover Collection"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                  Button Link
                </label>
                <input
                  type="text"
                  value={content.promotionalBanner.ctaLink || ''}
                  onChange={(e) => handleBannerChange('ctaLink', e.target.value)}
                  placeholder="/category/mens"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Banner Live Preview */}
          <div className="relative rounded-3xl overflow-hidden bg-neutral-900 text-white min-h-[200px] flex items-center p-8">
            {content.promotionalBanner.image && (
              <img
                src={content.promotionalBanner.image}
                alt="Banner visual"
                className="absolute inset-0 w-full h-full object-cover opacity-35"
              />
            )}
            <div className="relative z-10 max-w-lg space-y-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-terracotta-400">
                {content.promotionalBanner.subtitle}
              </span>
              <h3 className="text-xl font-display font-bold">{content.promotionalBanner.title}</h3>
              <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                {content.promotionalBanner.description}
              </p>
              <span className="inline-block mt-2 px-4 py-2 bg-white text-neutral-950 rounded-xl text-xs font-mono font-medium">
                {content.promotionalBanner.ctaText} →
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
