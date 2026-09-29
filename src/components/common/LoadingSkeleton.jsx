import React from 'react';

export function GenericSkeleton({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div
      className={`animate-pulse bg-[#F2F2F2] rounded-xl ${height} ${width} ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 bg-white p-3 rounded-2xl border border-[#F2F2F2]">
      <div className="aspect-[3/4] w-full bg-[#F2F2F2] animate-pulse rounded-xl" />
      <div className="space-y-2 pt-2 px-1">
        <div className="h-3 w-1/3 bg-[#F2F2F2] animate-pulse rounded-md" />
        <div className="h-4 w-4/5 bg-[#F2F2F2] animate-pulse rounded-md" />
        <div className="h-4 w-1/4 bg-[#F2F2F2] animate-pulse rounded-md" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-[#F2F2F2]">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-[#F2F2F2] animate-pulse rounded-md w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="aspect-[3/4] w-full bg-[#F2F2F2] animate-pulse rounded-2xl" />
      <div className="space-y-6 pt-4">
        <div className="h-4 w-28 bg-[#F2F2F2] animate-pulse rounded-md" />
        <div className="h-9 w-3/4 bg-[#F2F2F2] animate-pulse rounded-lg" />
        <div className="h-6 w-32 bg-[#F2F2F2] animate-pulse rounded-md" />
        <div className="h-24 w-full bg-[#F2F2F2] animate-pulse rounded-xl" />
        <div className="h-12 w-full bg-[#F2F2F2] animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
export default GenericSkeleton;
