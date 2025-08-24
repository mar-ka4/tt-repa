"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import {
  Globe,
  SettingsIcon,
  Eye,
  Mail,
  ChevronDown,
  Filter,
  Palette,
  Ruler,
  Globe2,
  Languages,
  ShieldCheck,
} from "lucide-react"
import UserMenu from "@/components/user-menu"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Состояния для общих настроек
  const [theme, setTheme] = useState("dark")
  const [distanceUnit, setDistanceUnit] = useState("kilometers")
  const [temperatureUnit, setTemperatureUnit] = useState("celsius")
  const [currency, setCurrency] = useState("usd")
  const [translationLanguage, setTranslationLanguage] = useState("original")

  // Состояния для настроек приватности
  const [profileVisibility, setProfileVisibility] = useState(true)
  const [showEmail, setShowEmail] = useState(false)
  const [showLocation, setShowLocation] = useState(false)
  const [showActivity, setShowActivity] = useState(true)
  const [saveSearchHistory, setSaveSearchHistory] = useState(true)

  // Состояния для настроек уведомлений безопасности
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [accountChanges, setAccountChanges] = useState(true)

  // Состояния для настроек уведомлений по email
  const [newSubscribers, setNewSubscribers] = useState(true)
  const [routeComments, setRouteComments] = useState(true)
  const [routeLikes, setRouteLikes] = useState(false)
  const [newsUpdates, setNewsUpdates] = useState(true)

  // Состояния для выпадающих списков
  const [distanceUnitOpen, setDistanceUnitOpen] = useState(false)
  const [temperatureUnitOpen, setTemperatureUnitOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)
  const [translationLanguageOpen, setTranslationLanguageOpen] = useState(false)

  // Новые состояния для фильтрации настроек
  const [settingsFilter, setSettingsFilter] = useState("all") // all, general, privacy, security, email
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)

  // Состояние для анимации сохранения
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Функция для сохранения настроек
  const saveSettings = () => {
    // В реальном приложении здесь был бы API-запрос для сохранения настроек
    setIsSaving(true)

    setTimeout(() => {
      setIsSaving(false)
      setSaveSuccess(true)

      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  // Функция для определения видимости блока настроек на основе фильтра
  const isSettingVisible = (settingType: string) => {
    return settingsFilter === "all" || settingsFilter === settingType
  }

  useEffect(() => {
    // Получаем данные пользователя (предполагаем, что это mar_ka4)
    const userData = getUserByNickname("mar_ka4")
    if (!userData) {
      router.push("/")
      return
    }

    setUser(userData)
    setLoading(false)
  }, [router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white pb-16 relative overflow-hidden">
      {/* Colored circles in background with animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[25%] left-[20%] w-[280px] h-[280px] rounded-full bg-orange-500/20 blur-[100px] animate-float-slow"></div>
        <div className="absolute top-[10%] right-[25%] w-[350px] h-[350px] rounded-full bg-green-500/20 blur-[120px] animate-float-delayed"></div>
        <div className="absolute bottom-[25%] left-[50%] w-[320px] h-[320px] rounded-full bg-blue-400/20 blur-[100px] animate-float-reverse"></div>
      </div>

      {/* Header */}
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
              <button className="flex items-center gap-1 px-3 py-1.5 hidden">
                <Globe size={18} />
                <span>RU</span>
              </button>
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className="max-w-[1100px] w-full mx-auto px-4 pt-24 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-medium">Settings</h1>
            <p className="text-gray-400 mt-1">Customize your experience</p>
          </div>

          {/* Фильтр настроек */}
          <div className="relative">
            <button
              className="px-4 py-2.5 bg-[#18181c] border border-[#27272f] rounded-md text-sm flex items-center gap-2 hover:bg-[#1e1e24] transition-colors"
              onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            >
              <Filter size={16} className="text-gray-400" />
              <span>
                {settingsFilter === "all"
                  ? "All Settings"
                  : settingsFilter === "general"
                    ? "General Settings"
                    : settingsFilter === "privacy"
                      ? "Privacy Settings"
                      : settingsFilter === "security"
                        ? "Security Notifications"
                        : "Email Notifications"}
              </span>
              <ChevronDown size={16} className={`transition-transform ${filterDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {filterDropdownOpen && (
              <div className="absolute right-0 mt-1 w-[250px] border border-[#27272f] rounded-md shadow-lg z-10 bg-[#0c0c10] backdrop-blur-xl animate-fadeIn">
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors flex items-center gap-2"
                  onClick={() => {
                    setSettingsFilter("all")
                    setFilterDropdownOpen(false)
                  }}
                >
                  <SettingsIcon size={16} className="text-gray-400" />
                  All Settings
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors flex items-center gap-2"
                  onClick={() => {
                    setSettingsFilter("general")
                    setFilterDropdownOpen(false)
                  }}
                >
                  <Palette size={16} className="text-gray-400" />
                  General Settings
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors flex items-center gap-2"
                  onClick={() => {
                    setSettingsFilter("privacy")
                    setFilterDropdownOpen(false)
                  }}
                >
                  <Eye size={16} className="text-gray-400" />
                  Privacy Settings
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors flex items-center gap-2"
                  onClick={() => {
                    setSettingsFilter("security")
                    setFilterDropdownOpen(false)
                  }}
                >
                  <ShieldCheck size={16} className="text-gray-400" />
                  Security Notifications
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors flex items-center gap-2"
                  onClick={() => {
                    setSettingsFilter("email")
                    setFilterDropdownOpen(false)
                  }}
                >
                  <Mail size={16} className="text-gray-400" />
                  Email Notifications
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Общие настройки */}
        {isSettingVisible("general") && (
          <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#18181c] flex items-center justify-center">
                  <Palette size={20} className="text-indigo-400" />
                </div>
                <h2 className="text-lg font-medium">General Settings</h2>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Тема */}
              <div>
                <h3 className="text-base text-gray-300 mb-3 flex items-center gap-2">
                  <Palette size={18} className="text-gray-400" />
                  Theme
                </h3>
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2.5 rounded-md text-sm transition-colors ${
                      theme === "dark" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300 hover:bg-[#27272f]"
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    Dark
                  </button>
                  <button
                    className={`px-4 py-2.5 rounded-md text-sm transition-colors ${
                      theme === "light" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300 hover:bg-[#27272f]"
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    Light
                  </button>
                  <button
                    className={`px-4 py-2.5 rounded-md text-sm transition-colors ${
                      theme === "system" ? "bg-indigo-500 text-white" : "bg-[#18181c] text-gray-300 hover:bg-[#27272f]"
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    System
                  </button>
                </div>
              </div>

              {/* Разделитель */}
              <div className="border-t border-[#1a1a1a]"></div>

              {/* Единицы измерения */}
              <div>
                <h3 className="text-base text-gray-300 mb-4 flex items-center gap-2">
                  <Ruler size={18} className="text-gray-400" />
                  Measurement Units
                </h3>

                {/* Единицы расстояния */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">Distance Units:</label>
                  <div className="relative">
                    <button
                      className="flex items-center justify-between w-full md:w-[350px] border border-[#27272f] rounded-md py-2.5 px-4 text-white bg-[#0c0c12] hover:bg-[#12121a] transition-colors"
                      onClick={() => setDistanceUnitOpen(!distanceUnitOpen)}
                    >
                      <span>
                        {distanceUnit === "kilometers"
                          ? "Kilometers"
                          : distanceUnit === "miles"
                            ? "Miles"
                            : distanceUnit === "feet"
                              ? "Feet"
                              : distanceUnit === "steps"
                                ? "Steps"
                                : "Kilometers"}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${distanceUnitOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {distanceUnitOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full md:w-[350px] border border-[#27272f] rounded-md shadow-lg z-10 bg-[#0c0c10] backdrop-blur-xl">
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors"
                          onClick={() => {
                            setDistanceUnit("kilometers")
                            setDistanceUnitOpen(false)
                          }}
                        >
                          Kilometers
                        </button>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors"
                          onClick={() => {
                            setDistanceUnit("miles")
                            setDistanceUnitOpen(false)
                          }}
                        >
                          Miles
                        </button>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors"
                          onClick={() => {
                            setDistanceUnit("feet")
                            setDistanceUnitOpen(false)
                          }}
                        >
                          Feet
                        </button>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors"
                          onClick={() => {
                            setDistanceUnit("steps")
                            setDistanceUnitOpen(false)
                          }}
                        >
                          Steps
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Единицы температуры */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Temperature Units:</label>
                  <div className="relative">
                    <button
                      className="flex items-center justify-between w-full md:w-[350px] border border-[#27272f] rounded-md py-2.5 px-4 text-white bg-[#0c0c12] hover:bg-[#12121a] transition-colors"
                      onClick={() => setTemperatureUnitOpen(!temperatureUnitOpen)}
                    >
                      <span>
                        {temperatureUnit === "celsius"
                          ? "Celsius (°C)"
                          : temperatureUnit === "fahrenheit"
                            ? "Fahrenheit (°F)"
                            : "Celsius (°C)"}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${temperatureUnitOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {temperatureUnitOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full md:w-[350px] border border-[#27272f] rounded-md shadow-lg z-10 bg-[#0c0c10] backdrop-blur-xl">
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors"
                          onClick={() => {
                            setTemperatureUnit("celsius")
                            setTemperatureUnitOpen(false)
                          }}
                        >
                          Celsius (°C)
                        </button>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors"
                          onClick={() => {
                            setTemperatureUnit("fahrenheit")
                            setTemperatureUnitOpen(false)
                          }}
                        >
                          Fahrenheit (°F)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Разделитель */}
              <div className="border-t border-[#1a1a1a]"></div>

              {/* Региональные настройки */}
              <div>
                <h3 className="text-base text-gray-300 mb-4 flex items-center gap-2">
                  <Globe2 size={18} className="text-gray-400" />
                  Regional Settings
                </h3>

                {/* Валюта */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">Currency:</label>
                  <div className="relative">
                    <button
                      className="flex items-center justify-between w-full md:w-[350px] border border-[#27272f] rounded-md py-2.5 px-4 text-white bg-[#0c0c12] hover:bg-[#12121a] transition-colors"
                      onClick={() => setCurrencyOpen(!currencyOpen)}
                    >
                      <span>
                        {currency === "usd" ? "US Dollar ($)" : currency === "eur" ? "Euro (€)" : "US Dollar ($)"}
                      </span>
                      <ChevronDown size={18} className={`transition-transform ${currencyOpen ? "rotate-180" : ""}`} />
                    </button>

                    {currencyOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full md:w-[350px] border border-[#27272f] rounded-md shadow-lg z-10 bg-[#0c0c10] backdrop-blur-xl">
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors"
                          onClick={() => {
                            setCurrency("usd")
                            setCurrencyOpen(false)
                          }}
                        >
                          US Dollar ($)
                        </button>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors"
                          onClick={() => {
                            setCurrency("eur")
                            setCurrencyOpen(false)
                          }}
                        >
                          Euro (€)
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Язык автоперевода маршрутов */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Route Auto-translation Language:</label>
                  <div className="relative">
                    <button
                      className="flex items-center justify-between w-full md:w-[350px] border border-[#27272f] rounded-md py-2.5 px-4 text-white bg-[#0c0c12] hover:bg-[#12121a] transition-colors"
                      onClick={() => setTranslationLanguageOpen(!translationLanguageOpen)}
                    >
                      <span>
                        {translationLanguage === "original"
                          ? "Original (no translation)"
                          : translationLanguage === "russian"
                            ? "Russian"
                            : translationLanguage === "english"
                              ? "English"
                              : "Original (no translation)"}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`transition-transform ${translationLanguageOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {translationLanguageOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full md:w-[350px] border border-[#27272f] rounded-md shadow-lg z-10 bg-[#0c0c10] backdrop-blur-xl">
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors flex items-center gap-2"
                          onClick={() => {
                            setTranslationLanguage("original")
                            setTranslationLanguageOpen(false)
                          }}
                        >
                          <Languages size={16} className="text-gray-400" />
                          Original (no translation)
                        </button>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors flex items-center gap-2"
                          onClick={() => {
                            setTranslationLanguage("russian")
                            setTranslationLanguageOpen(false)
                          }}
                        >
                          <Languages size={16} className="text-gray-400" />
                          Russian
                        </button>
                        <button
                          className="w-full text-left px-4 py-2.5 hover:bg-[#27272f] transition-colors flex items-center gap-2"
                          onClick={() => {
                            setTranslationLanguage("english")
                            setTranslationLanguageOpen(false)
                          }}
                        >
                          <Languages size={16} className="text-gray-400" />
                          English
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Настройки приватности */}
        {isSettingVisible("privacy") && (
          <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#18181c] flex items-center justify-center">
                  <Eye size={20} className="text-indigo-400" />
                </div>
                <h2 className="text-lg font-medium">Privacy Settings</h2>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-400 text-sm mb-6">Manage visibility settings for your profile and data.</p>

              {/* Видимость профиля */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Profile Visibility</div>
                  <div className="text-sm text-gray-400">Allow other users to see your profile and created routes.</div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="profileVisibility"
                    className="sr-only"
                    checked={profileVisibility}
                    onChange={() => setProfileVisibility(!profileVisibility)}
                  />
                  <label
                    htmlFor="profileVisibility"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      profileVisibility ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        profileVisibility ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* Показывать email */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Show Email</div>
                  <div className="text-sm text-gray-400">Allow other users to see your email address.</div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="showEmail"
                    className="sr-only"
                    checked={showEmail}
                    onChange={() => setShowEmail(!showEmail)}
                  />
                  <label
                    htmlFor="showEmail"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      showEmail ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        showEmail ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* Показывать местоположение */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Show Location</div>
                  <div className="text-sm text-gray-400">Allow other users to see your current location.</div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="showLocation"
                    className="sr-only"
                    checked={showLocation}
                    onChange={() => setShowLocation(!showLocation)}
                  />
                  <label
                    htmlFor="showLocation"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      showLocation ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        showLocation ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* История активности */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Activity History</div>
                  <div className="text-sm text-gray-400">
                    Show your activity (created routes, reviews) in your public profile.
                  </div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="showActivity"
                    className="sr-only"
                    checked={showActivity}
                    onChange={() => setShowActivity(!showActivity)}
                  />
                  <label
                    htmlFor="showActivity"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      showActivity ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        showActivity ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* История поиска */}
              <div className="flex items-center justify-between py-4 hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Search History</div>
                  <div className="text-sm text-gray-400">Save search history for quick access to previous queries.</div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="saveSearchHistory"
                    className="sr-only"
                    checked={saveSearchHistory}
                    onChange={() => setSaveSearchHistory(!saveSearchHistory)}
                  />
                  <label
                    htmlFor="saveSearchHistory"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      saveSearchHistory ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        saveSearchHistory ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Уведомления безопасности */}
        {isSettingVisible("security") && (
          <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#18181c] flex items-center justify-center">
                  <ShieldCheck size={20} className="text-indigo-400" />
                </div>
                <h2 className="text-lg font-medium">Security Notifications</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-[#0c0c12] border border-[#1a1a1a] rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm">
                  Configure notifications about your account security events. We recommend keeping these enabled for
                  better account protection.
                </p>
              </div>

              {/* Уведомления о входе */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Login Notifications</div>
                  <div className="text-sm text-gray-400">
                    Receive notifications when logging into your account from a new device or location.
                  </div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="loginAlerts"
                    className="sr-only"
                    checked={loginAlerts}
                    onChange={() => setLoginAlerts(!loginAlerts)}
                  />
                  <label
                    htmlFor="loginAlerts"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      loginAlerts ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        loginAlerts ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* Предупреждения безопасности */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Security Alerts</div>
                  <div className="text-sm text-gray-400">
                    Receive notifications about suspicious activity or potential security threats.
                  </div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="securityAlerts"
                    className="sr-only"
                    checked={securityAlerts}
                    onChange={() => setSecurityAlerts(!securityAlerts)}
                  />
                  <label
                    htmlFor="securityAlerts"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      securityAlerts ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        securityAlerts ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* Изменения аккаунта */}
              <div className="flex items-center justify-between py-4 hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Account Changes</div>
                  <div className="text-sm text-gray-400">
                    Receive notifications when important account settings are changed.
                  </div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="accountChanges"
                    className="sr-only"
                    checked={accountChanges}
                    onChange={() => setAccountChanges(!accountChanges)}
                  />
                  <label
                    htmlFor="accountChanges"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      accountChanges ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        accountChanges ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Уведомления по email */}
        {isSettingVisible("email") && (
          <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#18181c] flex items-center justify-center">
                  <Mail size={20} className="text-indigo-400" />
                </div>
                <h2 className="text-lg font-medium">Email Notifications</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-[#0c0c12] border border-[#1a1a1a] rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm">
                  Configure which notifications you want to receive to your email address{" "}
                  <span className="text-indigo-400">{user.email}</span>.
                </p>
              </div>

              {/* Новые подписчики */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">New Subscribers</div>
                  <div className="text-sm text-gray-400">
                    Receive notifications when someone subscribes to your profile.
                  </div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="newSubscribers"
                    className="sr-only"
                    checked={newSubscribers}
                    onChange={() => setNewSubscribers(!newSubscribers)}
                  />
                  <label
                    htmlFor="newSubscribers"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      newSubscribers ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        newSubscribers ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* Комментарии к маршрутам */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Route Comments</div>
                  <div className="text-sm text-gray-400">Receive notifications about new comments on your routes.</div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="routeComments"
                    className="sr-only"
                    checked={routeComments}
                    onChange={() => setRouteComments(!routeComments)}
                  />
                  <label
                    htmlFor="routeComments"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      routeComments ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        routeComments ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* Лайки маршрутов */}
              <div className="flex items-center justify-between py-4 border-b border-[#1a1a1a] hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">Route Likes</div>
                  <div className="text-sm text-gray-400">Receive notifications when someone likes your route.</div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="routeLikes"
                    className="sr-only"
                    checked={routeLikes}
                    onChange={() => setRouteLikes(!routeLikes)}
                  />
                  <label
                    htmlFor="routeLikes"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      routeLikes ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        routeLikes ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>

              {/* Новости и обновления */}
              <div className="flex items-center justify-between py-4 hover:bg-[#0c0c12] px-4 -mx-4 transition-colors rounded-md">
                <div>
                  <div className="font-medium mb-1">News and Updates</div>
                  <div className="text-sm text-gray-400">Receive information about platform news and updates.</div>
                </div>
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="newsUpdates"
                    className="sr-only"
                    checked={newsUpdates}
                    onChange={() => setNewSubscribers(!newsUpdates)}
                  />
                  <label
                    htmlFor="newsUpdates"
                    className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                      newsUpdates ? "bg-indigo-500" : "bg-[#27272f]"
                    }`}
                  >
                    <span
                      className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                        newsUpdates ? "translate-x-[26px]" : "translate-x-[4px]"
                      } top-[2px]`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Кнопка сохранения */}
        <div className="flex justify-start mb-8">
          <button
            className={`relative px-8 py-3 rounded-md text-white transition-colors ${
              isSaving
                ? "bg-gray-600 cursor-not-allowed"
                : saveSuccess
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-indigo-500 hover:bg-indigo-600"
            }`}
            onClick={saveSettings}
            disabled={isSaving}
          >
            {isSaving && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-600">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {saveSuccess ? "Changes Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </main>
  )
}
