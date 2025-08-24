"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import LoadingScreen from "@/components/loading-screen" // Импортируем компонент LoadingScreen

export default function CreateRoutePage() {
  const [selectedOption, setSelectedOption] = useState<"route" | "list" | null>(null)
  const [showLoadingScreen, setShowLoadingScreen] = useState(false) // Новое состояние для экрана загрузки

  const handleNextStepClick = () => {
    if (selectedOption && selectedOption !== "route") {
      setShowLoadingScreen(true) // Показываем экран загрузки
      // Небольшая задержка для того, чтобы анимация успела начаться,
      // прежде чем произойдет полный редирект.
      setTimeout(() => {
        window.location.href = `/create-route/builder?type=${selectedOption}`
      }, 300) // Задержка в 300 мс
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header with logo */}
      <header className="absolute top-0 left-0 p-6">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="Logo" width={77} height={40} />
        </Link>
      </header>
      {/* Main content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Title */}
        <h1 className="text-4xl font-medium mb-12 text-center">What would you like to create?</h1>

        {/* Options - Now arranged horizontally and wider */}
        <div className="flex flex-wrap justify-center gap-4 mb-16 w-full max-w-4xl">
          {/* List Option (formerly Points) - Now first */}
          <div
            className={`flex-1 min-w-[300px] max-w-[48%] rounded-2xl border cursor-pointer transition-all duration-200 ${
              selectedOption === "list" ? "border-white bg-white/5" : "border-gray-700 hover:border-gray-600"
            }`}
            onClick={() => setSelectedOption("list")}
          >
            <div className="p-6 flex flex-col items-center text-center gap-4 h-full">
              {/* Image */}
              <div className="flex-shrink-0 h-full max-h-[130px]">
                <Image
                  src="/list-img.png"
                  alt="List illustration"
                  width={130}
                  height={130}
                  className="h-full w-auto max-h-[130px] object-contain"
                />
              </div>

              {/* Text content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-medium mb-3">List</h2>
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    Highlight on the map suggested locations to visit, allowing the user to decide which places to
                    explore and in what sequence.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-gray-400 text-sm w-full">
                  <ul className="list-disc list-inside text-left">
                    <li>Food Spots</li>
                    <li>Photo Spots</li>
                  </ul>
                  <ul className="list-disc list-inside text-left">
                    <li>Historical Sites</li>
                    <li>Art Galleries</li>
                  </ul>
                  <ul className="list-disc list-inside text-left">
                    <li>Nature Trails</li>
                    <li>and others</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Route Option - Now second */}
          <div
            className={`relative flex-1 min-w-[300px] max-w-[48%] rounded-2xl border transition-all duration-200 pointer-events-none opacity-50 ${
              selectedOption === "route" ? "border-white bg-white/5" : "border-gray-700"
            }`}
            onClick={null}
          >
            <div className="p-6 flex flex-col items-center text-center gap-4 h-full filter blur-sm">
              {/* Image */}
              <div className="flex-shrink-0 h-full max-h-[130px]">
                <Image
                  src="/route-img.png"
                  alt="Route illustration"
                  width={130}
                  height={130}
                  className="h-full w-auto max-h-[130px] object-contain"
                />
              </div>

              {/* Text content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-medium mb-3">Route</h2>
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    Create a fully planned route with seamlessly linked destinations, ensuring an ideal and
                    comprehensive travel experience.
                  </p>
                </div>
                <div className="flex flex-col gap-2 text-gray-400 text-sm w-full">
                  <ul className="list-disc list-inside text-left">
                    <li>City tours with time limits</li>
                    <li>Complex multi-day itineraries</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
              Coming soon
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex items-center justify-between w-full max-w-2xl">
          <div className="text-white">
            <Link href="#" className="text-[#277DFF] hover:text-[#1E6FE6] transition-colors">
              Learn more
            </Link>
            <span> about each option.</span>
          </div>

          <button
            className={`px-8 py-3 rounded-full transition-all duration-200 ${
              selectedOption
                ? "bg-white text-black hover:bg-gray-200"
                : "bg-transparent border border-gray-600 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!selectedOption || selectedOption === "route"}
            onClick={handleNextStepClick} // Используем новую функцию-обработчик
          >
            Next step
          </button>
        </div>
      </div>
      {showLoadingScreen && <LoadingScreen />} {/* Условный рендеринг экрана загрузки */}
    </main>
  )
}
