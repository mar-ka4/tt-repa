"use client"

import { useState, useEffect } from "react"

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const consent = localStorage.getItem("cookieConsent")
    if (!consent) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "accepted_all")
    setIsOpen(false)
    console.log("Cookies: All accepted")
  }

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookieConsent", "accepted_necessary")
    setIsOpen(false)
    console.log("Cookies: Necessary accepted")
  }

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined")
    setIsOpen(false)
    console.log("Cookies: Declined")
  }

  // Hide cookie consent for now
  return null
}
