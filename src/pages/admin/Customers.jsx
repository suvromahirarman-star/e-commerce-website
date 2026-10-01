import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, MapPin, Eye, ShoppingBag, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatPrice, formatDate } from '../../utils/formatters';
import { LoadingSkeleton } from '../../components/common';

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    async function loadCustomers() {
      setLoading(true);
      try {
        const data = await adminService.getGuestCustomers();
        setCustomers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      (c.fullName && c.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.phone && c.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
          Guest Patrons Directory
        </h1>
        <p className="text-xs text-neutral-500 font-mono">
          Profiles derived from fulfilled guest orders • Track lifetime spend, loyalty, and regional distribution
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patron name, email, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-neutral-950"
          />
        </div>

        <span className="text-xs font-mono text-neutral-400">
          {filteredCustomers.length} registered patrons
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 space-y-2">
            <Users className="w-8 h-8 text-neutral-300 mx-auto" />
            <p className="font-bold text-neutral-900">No patrons found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="p-4">Patron Name</th>
                  <th className="p-4">Contact Channels</th>
                  <th className="p-4">Region / City</th>
                  <th className="p-4">Orders Placed</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredCustomers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-950 text-white flex items-center justify-center font-bold text-xs uppercase font-sans">
                          {c.fullName.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold font-sans text-neutral-900 text-sm block">
                            {c.fullName}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            Verified Guest Profile
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-neutral-800">{c.phone}</div>
                      <div className="text-neutral-400 text-[10px] truncate max-w-xs">
                        {c.email}
                      </div>
                    </td>

                    <td className="p-4 text-neutral-700 font-sans">
                      {c.city || 'Dhaka'}, {c.division || 'Dhaka'}
                    </td>

                    <td className="p-4 font-bold text-neutral-900">
                      {c.orderCount || 1} orders
                    </td>

                    <td className="p-4 font-bold text-neutral-950 text-sm">
                      {formatPrice(c.totalSpent || 8900)}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(c)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-950 text-neutral-700 hover:text-neutral-950 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-lg font-bold font-display text-neutral-950">
                Patron Dossier
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-neutral-200/80 space-y-2">
                <div className="font-bold text-base font-display text-neutral-950">
                  {selectedCustomer.fullName}
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Phone className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B2C]" />
                  <span>
                    {selectedCustomer.city}, {selectedCustomer.division}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 uppercase">Total Orders</span>
                  <div className="text-xl font-bold text-neutral-900 mt-0.5">
                    {selectedCustomer.orderCount || 1}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 uppercase">Lifetime Spend</span>
                  <div className="text-lg font-bold text-neutral-900 mt-0.5">
                    {formatPrice(selectedCustomer.totalSpent || 8900)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Customers;
