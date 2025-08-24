"use client"

import { useState, useEffect } from "react"

export default function LoadingScreen() {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const fullText = "triptipp"

  useEffect(() => {
    const typeText = () => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      } else {
        // Задержка 2 секунды после завершения печати
        setTimeout(() => {
          setDisplayedText("")
          setCurrentIndex(0)
        }, 2000)
      }
    }

    const timer = setTimeout(typeText, 150) // Скорость печати
    return () => clearTimeout(timer)
  }, [currentIndex, fullText])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[200]">
      <div className="text-white text-2xl md:text-4xl font-mono">
        {displayedText}
        <span className="animate-pulse">|</span>
      </div>
    </div>
  )
}
