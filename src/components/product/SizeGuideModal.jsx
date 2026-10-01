import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler } from 'lucide-react';

const SIZE_CHART = [
  { size: 'XS', chestCm: '88-92', waistCm: '72-76', hipCm: '88-92', chestIn: '34-36', waistIn: '28-30' },
  { size: 'S', chestCm: '92-96', waistCm: '76-80', hipCm: '92-96', chestIn: '36-38', waistIn: '30-32' },
  { size: 'M', chestCm: '96-102', waistCm: '80-86', hipCm: '96-102', chestIn: '38-40', waistIn: '32-34' },
  { size: 'L', chestCm: '102-108', waistCm: '86-92', hipCm: '102-108', chestIn: '40-42', waistIn: '34-36' },
  { size: 'XL', chestCm: '108-114', waistCm: '92-98', hipCm: '108-114', chestIn: '42-44', waistIn: '36-38' },
];

export function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState('cm');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-neutral-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-50 text-[#FF6B2C]">
                <Ruler className="w-5 h-5 text-[#FF6B2C]" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display text-neutral-950">
                  Garment Fit &amp; Size Guide
                </h3>
                <p className="text-xs text-neutral-500">Universal Atelier Measurements</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center justify-between pt-4 pb-2">
            <span className="text-xs text-neutral-600">
              Measurements taken flat on finished garment.
            </span>
            <div className="flex items-center p-1 rounded-xl bg-neutral-100 text-xs font-mono font-medium">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  unit === 'cm' ? 'bg-white text-[#FF6B2C] font-semibold shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Centimeters
              </button>
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  unit === 'in' ? 'bg-white text-[#FF6B2C] font-semibold shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Inches
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 border border-neutral-200 rounded-2xl overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="p-3 font-semibold">Size</th>
                  <th className="p-3 font-semibold">Chest</th>
                  <th className="p-3 font-semibold">Waist</th>
                  <th className="p-3 font-semibold">Hip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-neutral-50/60">
                    <td className="p-3 font-bold text-neutral-900">{row.size}</td>
                    <td className="p-3 text-neutral-700">
                      {unit === 'cm' ? `${row.chestCm} cm` : `${row.chestIn} in`}
                    </td>
                    <td className="p-3 text-neutral-700">
                      {unit === 'cm' ? `${row.waistCm} cm` : `${row.waistIn} in`}
                    </td>
                    <td className="p-3 text-neutral-700">
                      {unit === 'cm' ? `${row.hipCm} cm` : `—`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sizing Advisory */}
          <div className="mt-6 p-4 rounded-2xl bg-[#FFF8F3] border border-[#FF6B2C]/20 text-xs text-neutral-600 space-y-1">
            <span className="font-bold text-neutral-950 block">Still unsure of your sizing?</span>
            <p>
              Our tailoring atelier provides complimentary exchanges within 14 days. You can also contact our concierge team at support@aurastudio.com for individual fit recommendations.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
