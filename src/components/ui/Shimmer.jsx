export function ShimmerBlock({ className = "" }) {
  return <div className={`wn-shimmer ${className}`} />;
}

/** Super Admin Dashboard skeleton (cards + table) */
export function SuperAdminDashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="space-y-2">
        <ShimmerBlock className="h-8 w-64 rounded-lg" />
        <ShimmerBlock className="h-4 w-96 max-w-full rounded-md" />
      </div>

      {/* 8 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <ShimmerBlock className="h-3 w-28 rounded" />
                <ShimmerBlock className="h-8 w-16 rounded-md" />
                <ShimmerBlock className="h-3 w-24 rounded" />
              </div>
              <ShimmerBlock className="h-11 w-11 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <ShimmerBlock className="h-5 w-56 rounded-md" />
        </div>

        {/* header row */}
        <div className="grid grid-cols-7 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {Array.from({ length: 7 }).map((_, i) => (
            <ShimmerBlock key={i} className="h-3 rounded" />
          ))}
        </div>

        {/* body rows */}
        {Array.from({ length: 5 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-7 gap-3 px-5 py-4 border-b border-gray-50 last:border-0"
          >
            {Array.from({ length: 7 }).map((_, col) => (
              <ShimmerBlock
                key={col}
                className={`h-4 rounded ${col === 0 ? "w-full" : "w-4/5"}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}