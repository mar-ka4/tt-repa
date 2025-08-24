"use client"

import Image from "next/image"
import Link from "next/link"
import { Globe } from "lucide-react"
import UserMenu from "@/components/user-menu"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { iconCategories } from "@/data/icons"

export default function IconLibraryPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-16">
      {/* Header - copied from studio page */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black border-b border-[#1a1a1a]">
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
      <div className="max-w-[1100px] w-full mx-auto px-4 pt-24">
        <div className="mb-8">
          <h1 className="text-2xl font-medium">Библиотека иконок</h1>
          <p className="text-gray-400 mt-2">Визуальный справочник доступных иконок по категориям.</p>
        </div>

        {iconCategories.map((category, categoryIndex) => {
          const CategoryIconComponent = category.categoryIcon
          return (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-xl font-semibold mb-6 border-b border-[#1a1a1a] pb-3 flex items-center gap-2">
                {CategoryIconComponent && <CategoryIconComponent size={24} className="text-gray-400" />}
                {category.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {category.subcategories.flatMap((subcategory) =>
                  subcategory.icons.map((iconEntry, iconIndex) => {
                    const IconComponent = iconEntry.icon
                    return (
                      <Card
                        key={`${categoryIndex}-${subcategory.name}-${iconIndex}`} // Unique key
                        className="bg-[#0c0c0e] border border-[#1a1a1a] flex flex-col items-center justify-center p-4 text-center"
                      >
                        <CardContent className="p-0 flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-3">
                            <IconComponent size={24} className="text-indigo-400" />
                          </div>
                          <CardTitle className="text-sm font-medium text-gray-300 break-words">
                            {iconEntry.category}
                          </CardTitle>
                        </CardContent>
                      </Card>
                    )
                  }),
                )}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
