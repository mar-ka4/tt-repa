import { Loader } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a24]">
      <div className="flex flex-col items-center">
        <Loader className="h-10 w-10 text-[#a0a0e1] animate-spin" />
        <p className="mt-4 text-white text-lg">Загрузка...</p>
      </div>
    </div>
  )
}
