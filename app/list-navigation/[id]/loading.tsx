import { Skeleton } from "@/components/ui/skeleton"

export default function ListNavigationLoading() {
  return (
    <main className="flex h-screen bg-[#0c0c0e] text-white overflow-hidden">
      <div className="flex w-full h-full">
        {/* Left Panel Skeleton (Desktop only) */}
        <div className="hidden md:flex w-[400px] h-full flex-col border-r border-[#1a1a1a] overflow-hidden">
          {/* Header Skeleton */}
          <div className="p-4 border-b border-[#1a1a1a] flex items-center bg-[#0c0c0e]">
            <Skeleton className="w-5 h-5 mr-3 bg-[#18181c]" />
            <Skeleton className="h-6 w-48 bg-[#18181c]" />
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-[#1a1a1a] bg-[#0c0c0e]">
            <div className="flex bg-[#18181c] rounded-2xl p-1 w-full gap-2">
              <Skeleton className="flex-1 h-10 bg-[#27272f] rounded-full" />
              <Skeleton className="flex-1 h-10 bg-[#27272f] rounded-full" />
            </div>
          </div>

          {/* Content Area Skeleton */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0 p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#18181c] rounded-lg overflow-hidden">
                <Skeleton className="w-full h-40 bg-[#27272f]" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4 bg-[#27272f]" />
                  <Skeleton className="h-4 w-full bg-[#27272f]" />
                  <Skeleton className="h-4 w-2/3 bg-[#27272f]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Container Skeleton */}
        <div className="flex-1 relative">
          {/* Mobile Header Skeleton */}
          <div className="md:hidden absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-sm border-b border-white/10">
            <div className="p-4 flex items-center">
              <Skeleton className="w-5 h-5 mr-3 bg-white/20" />
              <Skeleton className="h-6 w-48 bg-white/20" />
            </div>
          </div>

          {/* Map Skeleton */}
          <div className="w-full h-full bg-[#18181c] flex items-center justify-center">
            <div className="text-center">
              <Skeleton className="w-16 h-16 rounded-full bg-[#27272f] mx-auto mb-4" />
              <Skeleton className="h-4 w-32 bg-[#27272f] mx-auto mb-2" />
              <Skeleton className="h-3 w-24 bg-[#27272f] mx-auto" />
            </div>
          </div>

          {/* Map Controls Skeleton */}
          <div className="absolute top-20 md:top-4 right-4 z-10 flex flex-col gap-2">
            <Skeleton className="w-10 h-10 bg-black/50 rounded-lg" />
          </div>
        </div>

        {/* Mobile Bottom Sheet Skeleton */}
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0c0c0e] border-t border-[#1a1a1a] z-30"
          style={{ height: "120px" }}
        >
          {/* Drag Handle */}
          <div className="flex justify-center py-2">
            <Skeleton className="w-8 h-1 bg-gray-600 rounded-full" />
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-[#1a1a1a]">
            <div className="flex bg-[#18181c] rounded-2xl p-1 w-full gap-2">
              <Skeleton className="flex-1 h-10 bg-[#27272f] rounded-full" />
              <Skeleton className="flex-1 h-10 bg-[#27272f] rounded-full" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="p-4">
            <Skeleton className="h-4 w-3/4 bg-[#18181c]" />
          </div>
        </div>
      </div>
    </main>
  )
}
