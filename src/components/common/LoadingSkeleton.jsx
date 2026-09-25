import React from 'react';

export function GenericSkeleton({ className = '', height = 'h-4', width = 'w-full' }) {
  return (
    <div
      className={`animate-pulse bg-neutral-200/80 rounded-md ${height} ${width} ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="aspect-[3/4] w-full bg-neutral-200/80 animate-pulse rounded-xl" />
      <div className="space-y-2 pt-1">
        <div className="h-3 w-1/3 bg-neutral-200/80 animate-pulse rounded" />
        <div className="h-4 w-4/5 bg-neutral-200/80 animate-pulse rounded" />
        <div className="h-4 w-1/4 bg-neutral-200/80 animate-pulse rounded" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <tr className="border-b border-neutral-200">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-neutral-200/70 animate-pulse rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto px-4 py-8">
      <div className="aspect-[3/4] w-full bg-neutral-200/80 animate-pulse rounded-2xl" />
      <div className="space-y-6 pt-4">
        <div className="h-4 w-24 bg-neutral-200/80 animate-pulse rounded" />
        <div className="h-8 w-3/4 bg-neutral-200/80 animate-pulse rounded" />
        <div className="h-6 w-32 bg-neutral-200/80 animate-pulse rounded" />
        <div className="h-20 w-full bg-neutral-200/80 animate-pulse rounded" />
        <div className="h-12 w-full bg-neutral-200/80 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}
