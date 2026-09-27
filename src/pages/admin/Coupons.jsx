import React, { useState, useEffect } from 'react';
import { Tag, Plus, Check, X, Trash2, Calendar, Percent, Banknote } from 'lucide-react';
import { couponService } from '../../services/couponService';
import { formatPrice, formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { LoadingSkeleton } from '../../components/common';

export function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minSpend: 2500,
    expiryDate: '2026-12-31',
  });

  const { showToast } = useToast();

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await couponService.listCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleToggle = async (id, code, currentStatus) => {
    try {
      await couponService.toggleCouponStatus(id);
      showToast(`Coupon "${code}" ${!currentStatus ? 'activated' : 'disabled'}`, 'info');
      loadCoupons();
    } catch (err) {
      showToast('Failed to toggle coupon status', 'error');
    }
  };

  const handleDelete = async (id, code) => {
    try {
      await couponService.deleteCoupon(id);
      showToast(`Deleted coupon "${code}"`, 'info');
      loadCoupons();
    } catch (err) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCoupon.code.trim()) return;

    try {
      await couponService.createCoupon({
        ...newCoupon,
        value: Number(newCoupon.value),
        minSpend: Number(newCoupon.minSpend),
      });
      showToast(`Created voucher "${newCoupon.code.toUpperCase()}"!`, 'success');
      setIsCreateModalOpen(false);
      setNewCoupon({
        code: '',
        type: 'percentage',
        value: 10,
        minSpend: 2500,
        expiryDate: '2026-12-31',
      });
      loadCoupons();
    } catch (err) {
      showToast('Failed to create coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-editorial text-neutral-950">
            Voucher &amp; Coupon Engine
          </h1>
          <p className="text-xs text-neutral-500 font-mono">
            Create and monitor promotional campaign codes for guest checkout
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-[#C45B32] text-white text-xs font-mono font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Voucher</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(4)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="p-4">Voucher Code</th>
                  <th className="p-4">Discount Value</th>
                  <th className="p-4">Min Order Threshold</th>
                  <th className="p-4">Redemption Count</th>
                  <th className="p-4">Expiration Date</th>
                  <th className="p-4">Active Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-neutral-950 px-3 py-1 rounded-xl bg-neutral-100 border border-neutral-200 inline-block text-xs">
                        {c.code}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-neutral-900 text-sm">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `-${formatPrice(c.value)}`}
                    </td>

                    <td className="p-4 text-neutral-600">
                      {c.minSpend ? formatPrice(c.minSpend) : 'No Minimum'}
                    </td>

                    <td className="p-4 text-neutral-600">{c.timesUsed || 0} times</td>

                    <td className="p-4 text-neutral-500">{formatDate(c.expiryDate)}</td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggle(c.id, c.code, c.active)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          c.active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                        }`}
                      >
                        {c.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, c.code)}
                        className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-bold font-editorial text-neutral-950">
                New Atelier Voucher
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                  Promo Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXE20"
                  value={newCoupon.code}
                  onChange={(e) =>
                    setNewCoupon((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-neutral-950"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Type
                  </label>
                  <select
                    value={newCoupon.type}
                    onChange={(e) =>
                      setNewCoupon((prev) => ({ ...prev, type: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono bg-white"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Value *
                  </label>
                  <input
                    type="number"
                    required
                    value={newCoupon.value}
                    onChange={(e) =>
                      setNewCoupon((prev) => ({ ...prev, value: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Min Order (৳)
                  </label>
                  <input
                    type="number"
                    value={newCoupon.minSpend}
                    onChange={(e) =>
                      setNewCoupon((prev) => ({ ...prev, minSpend: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-wider text-neutral-600 font-semibold block">
                    Expires On
                  </label>
                  <input
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) =>
                      setNewCoupon((prev) => ({ ...prev, expiryDate: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-neutral-950 hover:bg-[#C45B32] text-white text-xs font-mono font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  Activate Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default Coupons;
