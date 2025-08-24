"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import { Globe, Minus, Plus, Copy, Trash2, Check, ChevronLeft } from "lucide-react"
import UserMenu from "@/components/user-menu"

type Role = "Content Creator" | "Content Moderator" | "Head Admin"
type SecretKey = {
  id: string
  key: string
  role: Role
  createdAt: Date
}

export default function SecretKeysPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)

  const [selectedRoles, setSelectedRoles] = useState<Role[]>(["Content Creator"])
  const [keyCount, setKeyCount] = useState(12)
  const [generatedKeys, setGeneratedKeys] = useState<SecretKey[]>([])
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null)
  const [allCopied, setAllCopied] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const details = getUserByNickname(user.nickname)
      if (details) {
        setUserDetails(details)

        // If user is not an admin, redirect to home
        if (!details.isAdmin) {
          router.push("/")
          return
        }
      }
    }

    setLoading(false)
  }, [isAuthenticated, user, router])

  const toggleRole = (role: Role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role))
    } else {
      setSelectedRoles([...selectedRoles, role])
    }
  }

  const decreaseCount = () => {
    if (keyCount > 1) setKeyCount(keyCount - 1)
  }

  const increaseCount = () => {
    setKeyCount(keyCount + 1)
  }

  const generateRandomKey = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const keyLength = 32
    let result = ""

    for (let i = 0; i < keyLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return result
  }

  const generateKeys = () => {
    if (selectedRoles.length === 0) return

    const newKeys: SecretKey[] = []

    for (let i = 0; i < keyCount; i++) {
      const role = selectedRoles[Math.floor(Math.random() * selectedRoles.length)]
      newKeys.push({
        id: `key-${Date.now()}-${i}`,
        key: generateRandomKey(),
        role,
        createdAt: new Date(),
      })
    }

    setGeneratedKeys([...newKeys, ...generatedKeys])
  }

  const copyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKeyId(id)
    setTimeout(() => setCopiedKeyId(null), 2000)
  }

  const copyAllKeys = () => {
    const allKeys = generatedKeys.map((k) => k.key).join("\n")
    navigator.clipboard.writeText(allKeys)
    setAllCopied(true)
    setTimeout(() => setAllCopied(false), 2000)
  }

  const downloadKeys = () => {
    const allKeys = generatedKeys.map((k) => `${k.role}: ${k.key}`).join("\n")
    const blob = new Blob([allKeys], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "secret-keys.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteKey = (id: string) => {
    setGeneratedKeys(generatedKeys.filter((k) => k.id !== id))
  }

  const deleteAllKeys = () => {
    setGeneratedKeys([])
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-16 relative overflow-hidden">
      {/* Blurred circles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[30%] w-[250px] h-[250px] rounded-full bg-indigo-500/20 blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-[#1a1a1a]">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-[40px]">
            <Image src="/logo.png" alt="Logo" width={73} height={40} />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative">
              <button className="flex items-center gap-1 px-3 py-1.5">
                <Globe size={18} />
                <span>EN</span>
              </button>
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-[1300px] w-full mx-auto px-4 pt-24">
        <div className="mb-8 flex items-center">
          <Link href="/admin-studio" className="mr-4 hover:text-gray-300">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-medium">Secret key generation</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left panel - Key generation options */}
          <div className="w-full lg:w-1/3">
            <div className="bg-[#0c0c0e]/80 backdrop-blur-md rounded-xl border border-[#1a1a1a] p-6">
              {/* Role selection */}
              <div className="mb-6">
                <div
                  className={`flex items-center justify-between p-3 mb-2 rounded-md cursor-pointer ${
                    selectedRoles.includes("Content Creator") ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  }`}
                  onClick={() => toggleRole("Content Creator")}
                >
                  <span>Content Creator</span>
                  <div
                    className={`w-5 h-5 rounded border ${
                      selectedRoles.includes("Content Creator")
                        ? "border-indigo-500 bg-indigo-500 flex items-center justify-center"
                        : "border-gray-600"
                    }`}
                  >
                    {selectedRoles.includes("Content Creator") && <Check size={14} />}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between p-3 mb-2 rounded-md cursor-pointer ${
                    selectedRoles.includes("Content Moderator") ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  }`}
                  onClick={() => toggleRole("Content Moderator")}
                >
                  <span>Content Moderator</span>
                  <div
                    className={`w-5 h-5 rounded border ${
                      selectedRoles.includes("Content Moderator")
                        ? "border-indigo-500 bg-indigo-500 flex items-center justify-center"
                        : "border-gray-600"
                    }`}
                  >
                    {selectedRoles.includes("Content Moderator") && <Check size={14} />}
                  </div>
                </div>

                <div
                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                    selectedRoles.includes("Head Admin") ? "bg-[#1a1a1a]" : "hover:bg-[#1a1a1a]/50"
                  }`}
                  onClick={() => toggleRole("Head Admin")}
                >
                  <span>Head Admin</span>
                  <div
                    className={`w-5 h-5 rounded border ${
                      selectedRoles.includes("Head Admin")
                        ? "border-indigo-500 bg-indigo-500 flex items-center justify-center"
                        : "border-gray-600"
                    }`}
                  >
                    {selectedRoles.includes("Head Admin") && <Check size={14} />}
                  </div>
                </div>
              </div>

              {/* Key count selector */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={decreaseCount}
                  className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#2a2a2a]"
                >
                  <Minus size={18} />
                </button>
                <div className="w-16 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">{keyCount}</div>
                <button
                  onClick={increaseCount}
                  className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#2a2a2a]"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Generate button */}
              <button
                onClick={generateKeys}
                disabled={selectedRoles.length === 0}
                className={`w-full py-3 rounded-md text-center ${
                  selectedRoles.length === 0
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                Generate
              </button>
            </div>
          </div>

          {/* Right panel - Generated keys */}
          <div className="w-full lg:w-2/3">
            <div className="bg-[#0c0c0e]/80 backdrop-blur-md rounded-xl border border-[#1a1a1a] p-6">
              {/* Actions for all keys */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">All:</div>
                <div className="flex gap-2">
                  <button
                    onClick={downloadKeys}
                    disabled={generatedKeys.length === 0}
                    className={`px-3 py-1 rounded text-sm ${
                      generatedKeys.length === 0
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                    }`}
                  >
                    download
                  </button>

                  <button
                    onClick={copyAllKeys}
                    disabled={generatedKeys.length === 0}
                    className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                      generatedKeys.length === 0
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-[#1a1a1a] hover:bg-[#2a2a2a]"
                    }`}
                  >
                    {allCopied ? <Check size={14} /> : null}
                    copy
                  </button>

                  <button
                    onClick={deleteAllKeys}
                    disabled={generatedKeys.length === 0}
                    className={`px-3 py-1 rounded text-sm ${
                      generatedKeys.length === 0
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-red-900/50 hover:bg-red-900/70"
                    }`}
                  >
                    delete
                  </button>
                </div>
              </div>

              {/* List of keys */}
              <div className="space-y-2 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {generatedKeys.length > 0 ? (
                  generatedKeys.map((keyItem) => (
                    <div key={keyItem.id} className="flex items-center justify-between bg-[#1a1a1a]/50 rounded-md p-2">
                      <div className="truncate w-3/4 font-mono text-sm text-gray-300">{keyItem.key}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyKey(keyItem.key, keyItem.id)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-[#2a2a2a]"
                        >
                          {copiedKeyId === keyItem.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                        <button
                          onClick={() => deleteKey(keyItem.id)}
                          className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-900/70"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No keys generated yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
