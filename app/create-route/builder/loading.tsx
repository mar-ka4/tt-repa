"use client"

import { useEffect, useState } from "react"

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("Инициализация конструктора маршрутов...")

  const messages = [
    "Инициализация конструктора маршрутов...",
    "Загрузка компонентов интерфейса...",
    "Подготовка карты и инструментов...",
    "Настройка рабочего пространства...",
    "Почти готово...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15 + 5

        // Update message based on progress
        if (newProgress > 80) {
          setMessage(messages[4])
        } else if (newProgress > 60) {
          setMessage(messages[3])
        } else if (newProgress > 40) {
          setMessage(messages[2])
        } else if (newProgress > 20) {
          setMessage(messages[1])
        }

        return Math.min(newProgress, 95)
      })
    }, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center">
      {/* Logo and Brand */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-white text-4xl font-bold">TripTipp</span>
      </div>

      {/* Progress Bar */}
      <div className="w-96 mb-6">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Loading Message */}
      <p className="text-gray-400 text-sm font-mono tracking-wider uppercase">{message}</p>
    </div>
  )
}
