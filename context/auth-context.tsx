"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getUserByNickname } from "@/data/users"

type User = {
  nickname: string
  avatar?: string
  email?: string
  isVerifiedForRoutes?: boolean // Добавлено свойство isVerifiedForRoutes
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  login: (nickname: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        const userDetails = getUserByNickname(parsedUser.nickname)
        if (userDetails) {
          setUser({
            nickname: userDetails.nickname,
            avatar: userDetails.avatar,
            email: userDetails.email,
            isVerifiedForRoutes: userDetails.isVerifiedForRoutes, // Убедитесь, что это свойство передается
          })
        }
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (nickname: string) => {
    const userDetails = getUserByNickname(nickname)
    if (userDetails) {
      const userData = {
        nickname: userDetails.nickname,
        avatar: userDetails.avatar,
        email: userDetails.email,
        isVerifiedForRoutes: userDetails.isVerifiedForRoutes, // Убедитесь, что это свойство передается при входе
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (isLoading) {
    return null // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
