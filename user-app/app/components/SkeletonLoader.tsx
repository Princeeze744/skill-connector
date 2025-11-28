export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-24"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="flex justify-between pt-4 border-t">
        <div className="h-4 bg-gray-200 rounded w-16"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-lg w-full mt-4"></div>
    </div>
  )
}

export function SkeletonProfile() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full"></div>
        <div className="flex-1 w-full">
          <div className="h-10 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-4">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
            <div className="h-12 bg-gray-200 rounded-lg flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonMessage() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMessage key={i} />
      ))}
    </div>
  )
}