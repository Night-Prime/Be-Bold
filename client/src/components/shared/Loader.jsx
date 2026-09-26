export function Spinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3" role="status" aria-live="polite">
      <div className="w-10 h-10 rounded-full border-4 border-purple100 border-t-purple800 animate-spin" />
      <p className="text-sm text-purple800/60">{label}</p>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow animate-pulse">
      <div className="aspect-square bg-purple100/60" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-4 bg-purple100/60 rounded w-3/4" />
        <div className="h-3 bg-purple100/40 rounded w-full" />
        <div className="h-4 bg-purple100/60 rounded w-1/3" />
        <div className="h-9 bg-purple100/40 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 pb-20" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mt-4 animate-pulse" aria-hidden="true">
      <div className="w-full h-80 sm:h-[420px] lg:h-[500px] bg-purple100/60 rounded-xl" />
      <div className="py-2 sm:py-6 space-y-4">
        <div className="h-8 bg-purple100/60 rounded w-3/4" />
        <div className="h-4 bg-purple100/40 rounded w-full" />
        <div className="h-4 bg-purple100/40 rounded w-5/6" />
        <div className="h-8 bg-purple100/60 rounded w-1/3" />
        <div className="h-12 bg-purple100/40 rounded-full w-2/3" />
      </div>
    </div>
  );
}
