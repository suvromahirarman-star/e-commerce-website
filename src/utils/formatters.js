/**
 * Formatting Utilities for Currency, Numbers, Dates, and Text
 */

export const CURRENCY_SYMBOL = '৳';
export const CURRENCY_CODE = 'BDT';

/**
 * Format a number as currency (e.g. ৳3,450)
 */
export function formatPrice(amount) {
  if (typeof amount !== 'number') {
    const parsed = parseFloat(amount);
    if (isNaN(parsed)) return `${CURRENCY_SYMBOL}0`;
    amount = parsed;
  }
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-BD', {
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Format date in modern editorial style (e.g. "24 Oct 2026")
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date with time (e.g. "24 Oct 2026, 04:30 PM")
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate percentage discount between regular price and sale price
 */
export function calculateDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Truncate long strings gracefully
 */
export function truncateText(text, maxLength = 80) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate human-readable SKU
 */
export function generateSKU(category, name) {
  const catCode = (category || 'GEN').slice(0, 3).toUpperCase();
  const nameCode = (name || 'ITEM').replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${catCode}-${nameCode}-${randomNum}`;
}
