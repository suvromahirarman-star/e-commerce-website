import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  Truck,
  CreditCard,
  Shield,
  Save,
  RotateCcw,
  Check,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  Lock,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';

export function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    let mounted = true;
    adminService.getStoreSettings().then((data) => {
      if (mounted) setSettings(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const updated = await adminService.updateStoreSettings(settings);
      setSettings(updated);
      showToast('Store settings updated successfully', 'success');
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all store configurations to default factory values?')) return;
    localStorage.removeItem('aura_store_settings');
    const fresh = await adminService.getStoreSettings();
    setSettings(fresh);
    showToast('Reset to default configurations', 'info');
  };

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
            Store &amp; Operational Settings
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Configure logistics rates, delivery thresholds, contact concierge, and storefront policies
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
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Storefront Identity & Concierge */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <Store className="w-4 h-4 text-neutral-900" />
            <h2 className="text-base font-bold font-display text-neutral-950">
              Brand Identity &amp; Concierge Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Official Brand Name
              </label>
              <input
                type="text"
                value={settings.storeName || ''}
                onChange={(e) => handleChange('storeName', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Brand Tagline
              </label>
              <input
                type="text"
                value={settings.storeTagline || ''}
                onChange={(e) => handleChange('storeTagline', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Concierge Support Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={settings.supportEmail || ''}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Direct Telephone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={settings.supportPhone || ''}
                  onChange={(e) => handleChange('supportPhone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Atelier Showroom &amp; Dispatch Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={`${settings.addressLine1 || ''}, ${settings.city || ''}`}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Fulfillment & Shipping Economics */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <Truck className="w-4 h-4 text-neutral-900" />
            <h2 className="text-base font-bold font-display text-neutral-950">
              Logistics &amp; Delivery Rates (BDT ৳)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Inside Dhaka Flat Rate (৳)
              </label>
              <input
                type="number"
                min="0"
                value={settings.insideDhakaShipping ?? 60}
                onChange={(e) => handleChange('insideDhakaShipping', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
              <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                Standard next-day courier
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Outside Dhaka Flat Rate (৳)
              </label>
              <input
                type="number"
                min="0"
                value={settings.outsideDhakaShipping ?? 120}
                onChange={(e) => handleChange('outsideDhakaShipping', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
              <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                2-4 business days nationwide
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1.5">
                Free Delivery Threshold (৳)
              </label>
              <input
                type="number"
                min="0"
                value={settings.freeShippingThreshold ?? 3000}
                onChange={(e) => handleChange('freeShippingThreshold', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
              />
              <span className="text-[10px] text-neutral-400 font-mono mt-1 block">
                Cart bar triggers free shipping
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Payment Methods & Guest Protocol */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <CreditCard className="w-4 h-4 text-neutral-900" />
            <h2 className="text-base font-bold font-display text-neutral-950">
              Payment Gateways &amp; Guest Protocol
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div>
                <div className="font-bold text-xs font-mono text-neutral-900">
                  Guest Checkout Protocol
                </div>
                <div className="text-[11px] text-neutral-500 font-sans">
                  Mandatory zero-friction checkout without requiring customer registration or password creation.
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <Lock className="w-3 h-3" />
                Active &amp; Enforced
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div>
                <div className="font-bold text-xs font-mono text-neutral-900">
                  Cash on Delivery (COD)
                </div>
                <div className="text-[11px] text-neutral-500 font-sans">
                  Allow patrons across Bangladesh to inspect their package and pay cash to the courier.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableCod ?? true}
                  onChange={(e) => handleChange('enableCod', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-950"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/60">
              <div>
                <div className="font-bold text-xs font-mono text-neutral-900">
                  bKash / Nagad Instant Mobile Banking
                </div>
                <div className="text-[11px] text-neutral-500 font-sans">
                  Enable secure digital payment via bKash / Nagad merchant gateways.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableBkash ?? true}
                  onChange={(e) => handleChange('enableBkash', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neutral-950"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Maintenance Mode */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-3">
            <Shield className="w-4 h-4 text-neutral-900" />
            <h2 className="text-base font-bold font-display text-neutral-950">
              Maintenance &amp; Atelier System Controls
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-xs font-mono text-neutral-900">
                Atelier Maintenance Mode
              </div>
              <div className="text-[11px] text-neutral-500 font-sans">
                When active, storefront displays a private collection refresh landing screen.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode ?? false}
                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
