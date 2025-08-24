"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { users } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

// Secret key for route creation access
const SECRET_ROUTE_KEY = "route-creator-2023"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showSecretKey, setShowSecretKey] = useState(false)
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretKey: "",
    agreeToTerms: false,
  })
  const [error, setError] = useState("")

  // Check if we should show signup form based on URL parameter
  useEffect(() => {
    const signup = searchParams.get("signup")
    setIsLogin(signup !== "true") // True for login, false for signup
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    // For demo purposes, we'll just log in as a default user
    login("mar_ka4")
    router.push("/")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      // Login logic
      const user = users.find((u) => u.nickname === formData.nickname && u.password === formData.password)

      if (user) {
        login(user.nickname)
        router.push("/")
      } else {
        setError("Invalid username or password")
      }
    } else {
      // Registration logic
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match")
        return
      }

      if (!formData.agreeToTerms) {
        setError("You must agree to the Terms of Service")
        return
      }

      const userExists = users.some((u) => u.nickname === formData.nickname || u.email === formData.email)

      if (userExists) {
        setError("User with this username or email already exists")
        return
      }

      const hasRouteCreationAccess = formData.secretKey === SECRET_ROUTE_KEY

      console.log("Registration successful:", {
        ...formData,
        isVerifiedForRoutes: hasRouteCreationAccess,
      })

      login(formData.nickname)
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Triptipp Logo" width={90} height={60} className="mb-6" />
          <h1 className="text-3xl font-bold mb-2">{isLogin ? "Log in to Triptipp" : "Sign up for Triptipp"}</h1>
          <p className="text-gray-400 text-center">
            {isLogin ? "Enter your details to log in." : "Create a Triptipp account to sign up."}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isLogin ? (
            // Login form
            <>
              <div>
                <label htmlFor="nickname" className="sr-only">
                  Username
                </label>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg"
              >
                Log in
              </Button>
            </>
          ) : (
            // Signup form (all fields visible by default)
            <>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white"
                  placeholder="Email Address"
                />
              </div>
              <div>
                <label htmlFor="nickname" className="sr-only">
                  Username
                </label>
                <input
                  id="nickname"
                  name="nickname"
                  type="text"
                  required
                  value={formData.nickname}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white"
                  placeholder="Confirm Password"
                />
              </div>
              <div>
                <label htmlFor="secretKey" className="sr-only">
                  Secret Key (optional)
                </label>
                <div className="relative">
                  <input
                    id="secretKey"
                    name="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    value={formData.secretKey}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white"
                    placeholder="Secret Key (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                    aria-label={showSecretKey ? "Hide secret key" : "Show secret key"}
                  >
                    {showSecretKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="h-4 w-4 bg-[#1a1a1a] border border-[#3a3a3a] rounded text-white focus:ring-1 focus:ring-white"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeToTerms" className="text-gray-400">
                    I agree to the{" "}
                    <Link href="/terms" className="text-white hover:underline">
                      Terms of Service
                    </Link>
                  </label>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-100 font-medium py-3 rounded-lg"
              >
                Create account
              </Button>
            </>
          )}
        </form>

        {/* "Show other options" is only relevant for login now, as signup shows all fields by default */}
        {isLogin && (
          <div className="flex items-center justify-center">
            <span className="text-sm text-gray-400">
              <Link
                href="/login?signup=true"
                className="text-white hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/login?signup=true")
                }}
              >
                Show other options
              </Link>
            </span>
          </div>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => handleSocialLogin("Google")}
            className="w-full bg-[#1a1a1a] text-white border border-[#3a3a3a] hover:bg-[#2a2a2a] py-3 rounded-lg flex items-center justify-center"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
              />
              <path
                fill="#34A853"
                d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
              />
              <path
                fill="#4A90E2"
                d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1272727,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <Button
            onClick={() => handleSocialLogin("GitHub")}
            className="w-full bg-[#1a1a1a] text-white border border-[#3a3a3a] hover:bg-[#2a2a2a] py-3 rounded-lg flex items-center justify-center"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.47.087.671-.205.671-.456 0-.227-.007-.752-.011-1.489-2.775.605-3.364-1.34-3.364-1.34-.455-1.152-1.11-1.455-1.11-1.455-.908-.612.069-.6.069-.6 1.004.07 1.532 1.03 1.532 1.03.892 1.53 2.341 1.088 2.91.829.091-.645.351-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.953 0-1.092.39-1.988 1.029-2.681-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.025 2.747-1.025.546 1.379.202 2.398.099 2.651.64.693 1.029 1.59 1.029 2.681 0 3.848-2.339 4.69-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .254.207.549.684.456C21.135 20.197 24 16.442 24 12.017 24 6.484 19.522 2 14 2h-2z"
                clipRule="evenodd"
              />
            </svg>
            <span>Continue with GitHub</span>
          </Button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <Link
                href="/login?signup=true"
                className="text-white hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/login?signup=true")
                }}
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-white hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/login")
                }}
              >
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
