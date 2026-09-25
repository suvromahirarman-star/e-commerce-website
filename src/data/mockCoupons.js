/**
 * Mock Promo Coupons Dataset
 */

export const mockCoupons = [
  {
    id: 'coup-01',
    code: 'AURA10',
    type: 'percentage',
    value: 10,
    minSpend: 3000,
    expiryDate: '2026-12-31',
    description: '10% off on orders over ৳3,000',
    usageLimit: 500,
    timesUsed: 142,
    active: true,
  },
  {
    id: 'coup-02',
    code: 'FIRSTORDER',
    type: 'percentage',
    value: 15,
    minSpend: 2500,
    expiryDate: '2026-12-31',
    description: '15% welcome discount on your first order',
    usageLimit: 1000,
    timesUsed: 389,
    active: true,
  },
  {
    id: 'coup-03',
    code: 'FREESHIP',
    type: 'fixed',
    value: 150, // Standard shipping cost
    minSpend: 2000,
    expiryDate: '2026-11-30',
    description: 'Free standard delivery across Bangladesh',
    usageLimit: 250,
    timesUsed: 88,
    active: true,
  },
  {
    id: 'coup-04',
    code: 'LUXE500',
    type: 'fixed',
    value: 500,
    minSpend: 8000,
    expiryDate: '2026-10-31',
    description: '৳500 flat discount on luxury orders over ৳8,000',
    usageLimit: 100,
    timesUsed: 46,
    active: true,
  },
];
