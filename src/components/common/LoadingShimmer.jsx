// src/components/common/LoadingShimmer.jsx

export default function LoadingShimmer({
  message = "Loading...",
  variant = "cards",
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-6xl space-y-4">
        {variant === "kanban" && <KanbanShimmer />}
        {variant === "cards" && <CardsShimmer />}
        {variant === "meetings" && <MeetingsShimmer />}
        {variant === "projects" && <ProjectsShimmer />}
      </div>

      <div className="flex items-center gap-3 text-slate-500">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}

/* ========== KANBAN ========== */
function KanbanShimmer() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-10 w-40 bg-slate-200 rounded-lg animate-pulse" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 min-w-[240px] space-y-3">
            <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
            {[1, 2].map((c) => (
              <div key={c} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                <div className="flex items-center gap-2 mt-4">
                  <div className="h-6 w-6 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

/* ========== CARDS ========== */
function CardsShimmer() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-slate-200 rounded-full animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-6 w-12 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-5 gap-4 pb-3 border-b border-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b border-slate-50">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </>
  );
}

/* ========== MEETINGS ========== */
function MeetingsShimmer() {
  return (
    <>
      <div className="mb-6 space-y-2">
        <div className="h-7 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 w-80 bg-slate-200 rounded animate-pulse" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 mb-3">
          <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      ))}
    </>
  );
}

/* ========== PROJECTS ========== */
function ProjectsShimmer() {
  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="h-10 w-72 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-96 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="h-12 w-40 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      {/* Stats — 5 cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-slate-200 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-7 w-12 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="rounded-3xl bg-white p-6 shadow-sm mb-8">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="h-12 flex-1 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse" />
          <div className="h-12 w-32 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>

      {/* Section title */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-7 w-40 bg-slate-200 rounded animate-pulse" />
        <div className="h-8 w-24 bg-slate-200 rounded-full animate-pulse" />
      </div>

      {/* Project cards */}
      <div className="grid auto-rows-fr gap-7 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-200 rounded animate-pulse" />
                <div className="h-3 w-5/6 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
                  <div className="h-3 w-10 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-slate-200 rounded-full animate-pulse" />
                  <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-3 border-t border-slate-100 p-4">
              <div className="h-11 flex-1 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-11 flex-1 bg-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}