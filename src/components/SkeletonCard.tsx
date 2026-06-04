export const SkeletonFeatured = () => (
  <div className="mb-10 overflow-hidden rounded-3xl border border-gray-200 bg-white">
    <div className="flex flex-col lg:flex-row">
      <div className="h-52 animate-pulse bg-gray-100 lg:h-auto lg:w-[340px] lg:shrink-0" />
      <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
        <div className="flex gap-3">
          <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
          <div className="h-5 w-24 animate-pulse rounded-full bg-gray-100" />
        </div>
        <div className="space-y-2">
          <div className="h-7 w-full animate-pulse rounded-lg bg-gray-100" />
          <div className="h-7 w-4/5 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>
  </div>
);

export const SkeletonCard = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white">
    <div className="h-44 animate-pulse bg-gray-100" />
    <div className="flex flex-1 flex-col gap-3 p-6">
      <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
      <div className="space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="space-y-1.5 pt-1">
        <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-11/12 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mt-auto flex justify-between border-t border-gray-100 pt-4">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  </div>
);
