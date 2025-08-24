import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Left Panel - Landmarks List */}
      <div className="w-full md:w-[400px] h-full flex flex-col border-r border-[#1a1a1a] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-center">
          <Skeleton className="h-6 w-6 rounded-full mr-3 bg-[#27272f]" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 bg-[#27272f]" />
            <Skeleton className="h-4 w-32 bg-[#27272f]" />
          </div>
        </div>

        {/* Landmarks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-[#27272f]" />
                <Skeleton className="h-5 w-32 bg-[#27272f]" />
              </div>
              <Skeleton className="h-48 w-full rounded-lg bg-[#27272f]" />
              <Skeleton className="h-5 w-40 bg-[#27272f]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-[#27272f]" />
                <Skeleton className="h-4 w-full bg-[#27272f]" />
                <Skeleton className="h-4 w-3/4 bg-[#27272f]" />
              </div>
              <Skeleton className="h-4 w-24 bg-[#27272f]" />
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="hidden md:block flex-1 bg-[#0c0c0e]">
        <div className="h-full w-full flex items-center justify-center">
          <Skeleton className="h-16 w-16 rounded-lg bg-[#27272f]" />
        </div>
      </div>
    </div>
  )
}
