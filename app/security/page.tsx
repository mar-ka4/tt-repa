"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { Globe, User, Lock, Shield, Mail, Bell, X } from "lucide-react"
import UserMenu from "@/components/user-menu"
import { useAuth } from "@/context/auth-context"

export default function SecurityPage() {
  const router = useRouter()
  const { user: authUser, isAuthenticated } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Состояния для переключателей уведомлений
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [accountChanges, setAccountChanges] = useState(true)

  // Добавим состояния для модальных окон после существующих состояний:
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isBackupEmailModalOpen, setIsBackupEmailModalOpen] = useState(false)
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false)

  // Добавим состояния для форм
  const [formUsername, setFormUsername] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPhone, setFormPhone] = useState("")
  const [formCurrentPassword, setFormCurrentPassword] = useState("")
  const [formNewPassword, setFormNewPassword] = useState("")
  const [formConfirmPassword, setFormConfirmPassword] = useState("")
  const [formBackupEmail, setFormBackupEmail] = useState("")

  // Добавим функцию для сохранения настроек уведомлений
  const saveNotificationSettings = (type: string, value: boolean) => {
    // В реальном приложении здесь был бы API-запрос для сохранения настроек
    console.log(`Saving ${type} setting: ${value}`)

    // Обновляем локальное состояние
    if (type === "loginAlerts") setLoginAlerts(value)
    if (type === "securityAlerts") setSecurityAlerts(value)
    if (type === "accountChanges") setAccountChanges(value)
  }

  // Добавим функцию для отключения 2FA
  const disable2FA = () => {
    setIs2FAModalOpen(true)
  }

  // Добавим функцию для подтверждения отключения 2FA
  const confirm2FADisable = () => {
    // В реальном приложении здесь был бы API-запрос для отключения 2FA
    console.log("Disabling 2FA")
    setIs2FAModalOpen(false)
    // Здесь можно было бы обновить состояние пользователя
  }

  // Добавим функции для открытия модальных окон
  const openUsernameModal = () => {
    setFormUsername(user.nickname)
    setIsUsernameModalOpen(true)
  }

  const openEmailModal = () => {
    setFormEmail(user.email)
    setIsEmailModalOpen(true)
  }

  const openPhoneModal = () => {
    setFormPhone(user.phone)
    setIsPhoneModalOpen(true)
  }

  const openPasswordModal = () => {
    setFormCurrentPassword("")
    setFormNewPassword("")
    setFormConfirmPassword("")
    setIsPasswordModalOpen(true)
  }

  const openBackupEmailModal = () => {
    setFormBackupEmail(user.backupEmail || "")
    setIsBackupEmailModalOpen(true)
  }

  // Добавим функции для сохранения данных
  const saveUsername = () => {
    // В реальном приложении здесь был бы API-запрос для сохранения имени пользователя
    console.log(`Saving username: ${formUsername}`)
    setIsUsernameModalOpen(false)
  }

  const saveEmail = () => {
    // В реальном приложении здесь был бы API-запрос для сохранения email
    console.log(`Saving email: ${formEmail}`)
    setIsEmailModalOpen(false)
  }

  const savePhone = () => {
    // В реальном приложении здесь был бы API-запрос для сохранения телефона
    console.log(`Saving phone: ${formPhone}`)
    setIsPhoneModalOpen(false)
  }

  const savePassword = () => {
    // В реальном приложении здесь была бы проверка текущего пароля и сохранение нового
    if (formNewPassword !== formConfirmPassword) {
      alert("Passwords don't match")
      return
    }
    console.log("Saving new password")
    setIsPasswordModalOpen(false)
  }

  const saveBackupEmail = () => {
    // В реальном приложении здесь был бы API-запрос для сохранения резервного email
    console.log(`Saving backup email: ${formBackupEmail}`)
    setIsBackupEmailModalOpen(false)
  }

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    // Get current user data
    if (authUser?.nickname) {
      const userData = getUserByNickname(authUser.nickname)
      if (!userData) {
        router.push("/")
        return
      }

      setUser(userData)

      // Set notification states from user data
      if (userData.securityNotifications) {
        setLoginAlerts(userData.securityNotifications.loginAlerts)
        setSecurityAlerts(userData.securityNotifications.securityAlerts)
        setAccountChanges(userData.securityNotifications.accountChanges)
      }
    }

    setLoading(false)
  }, [authUser, isAuthenticated, router])

  // Форматирование даты регистрации
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)

    // Месяцы на русском
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ]

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

    return `${day} ${month} ${year} г.`
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
      {/* Colored circles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[300px] h-[300px] rounded-full bg-purple-500/20 blur-[100px]"></div>
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] rounded-full bg-teal-400/20 blur-[100px]"></div>
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
                <span>EN</span>
              </button>
            </div>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className="max-w-[1100px] w-full mx-auto px-4 pt-24 relative z-10">
        <h1 className="text-2xl font-medium mb-2">Login and Security</h1>
        <p className="text-gray-400 mb-8">Manage your account security settings</p>

        {/* Информация аккаунта */}
        <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6 shadow-lg">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
            <h2 className="text-lg font-medium">Account Information</h2>
            <User size={20} className="text-indigo-400" />
          </div>

          <div className="p-4">
            {/* Имя пользователя */}
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
              <div>
                <div className="text-sm text-gray-400 mb-1">Username</div>
                <div>{user.nickname}</div>
              </div>
              <button
                className="px-4 py-1.5 bg-[#18181c]/80 hover:bg-[#27272f] rounded-md text-sm text-indigo-400 transition-colors"
                onClick={openUsernameModal}
              >
                Change
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
              <div>
                <div className="text-sm text-gray-400 mb-1">Email</div>
                <div>{user.email}</div>
              </div>
              <button
                className="px-4 py-1.5 bg-[#18181c]/80 hover:bg-[#27272f] rounded-md text-sm text-indigo-400 transition-colors"
                onClick={openEmailModal}
              >
                Change
              </button>
            </div>

            {/* Телефон */}
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
              <div>
                <div className="text-sm text-gray-400 mb-1">Phone</div>
                <div>{user.phone}</div>
              </div>
              <button
                className="px-4 py-1.5 bg-[#18181c]/80 hover:bg-[#27272f] rounded-md text-sm text-indigo-400 transition-colors"
                onClick={openPhoneModal}
              >
                Change
              </button>
            </div>

            {/* Дата рег��страции */}
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Registration Date</div>
                <div>{formatDate(user.accountCreated)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Пароль */}
        <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6 shadow-lg">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
            <h2 className="text-lg font-medium">Password</h2>
            <Lock size={20} className="text-indigo-400" />
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between py-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Password</div>
                <div>••••••••</div>
              </div>
              <button
                className="px-4 py-1.5 bg-[#18181c]/80 hover:bg-[#27272f] rounded-md text-sm text-indigo-400 transition-colors"
                onClick={openPasswordModal}
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Двухфакторная аутентификация */}
        <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6 shadow-lg">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
            <h2 className="text-lg font-medium">Two-Factor Authentication</h2>
            <Shield size={20} className="text-indigo-400" />
          </div>

          <div className="p-4">
            <p className="text-gray-400 text-sm mb-4">
              Two-factor authentication adds an extra layer of security by requiring a second method to verify your
              identity when logging into your account.
            </p>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <div className={user.twoFactorAuth?.enabled ? "text-green-500" : "text-gray-400"}>
                  {user.twoFactorAuth?.enabled ? "Enabled" : "Disabled"}
                </div>
              </div>
              {user.twoFactorAuth?.enabled ? (
                <button
                  className="px-4 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-md text-sm text-white transition-colors"
                  onClick={disable2FA}
                >
                  Disable
                </button>
              ) : (
                <button className="px-4 py-1.5 bg-[#18181c]/80 hover:bg-[#27272f] rounded-md text-sm text-indigo-400 transition-colors">
                  Enable
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Резервный email */}
        <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6 shadow-lg">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
            <h2 className="text-lg font-medium">Backup Email</h2>
            <Mail size={20} className="text-indigo-400" />
          </div>

          <div className="p-4">
            <p className="text-gray-400 text-sm mb-4">
              Backup email is used to recover access to your account in case you lose access to your primary email.
            </p>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm text-gray-400 mb-1">Backup Email</div>
                <div>{user.backupEmail || "Not specified"}</div>
              </div>
              <button
                className="px-4 py-1.5 bg-[#18181c]/80 hover:bg-[#27272f] rounded-md text-sm text-indigo-400 transition-colors"
                onClick={openBackupEmailModal}
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Уведомления безопасности */}
        <div className="bg-[#080809]/80 backdrop-blur-sm rounded-xl border border-[#2a2a2a] overflow-hidden mb-6 shadow-lg">
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
            <h2 className="text-lg font-medium">Security Notifications</h2>
            <Bell size={20} className="text-indigo-400" />
          </div>

          <div className="p-4">
            <p className="text-gray-400 text-sm mb-4">Configure notifications about your account security events.</p>

            {/* Уведомления о входе */}
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
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
                  onChange={() => saveNotificationSettings("loginAlerts", !loginAlerts)}
                />
                <label
                  htmlFor="loginAlerts"
                  className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                    loginAlerts ? "bg-indigo-500" : "bg-[#27272f]"
                  }`}
                >
                  <span
                    className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                      loginAlerts ? "translate-x-[26px]" : "translate-x-[2px]"
                    } top-[2px]`}
                  ></span>
                </label>
              </div>
            </div>

            {/* Предупреждения безопасности */}
            <div className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
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
                  onChange={() => saveNotificationSettings("securityAlerts", !securityAlerts)}
                />
                <label
                  htmlFor="securityAlerts"
                  className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                    securityAlerts ? "bg-indigo-500" : "bg-[#27272f]"
                  }`}
                >
                  <span
                    className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                      securityAlerts ? "translate-x-[26px]" : "translate-x-[2px]"
                    } top-[2px]`}
                  ></span>
                </label>
              </div>
            </div>

            {/* Изменения аккаунта */}
            <div className="flex items-center justify-between py-4">
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
                  onChange={() => saveNotificationSettings("accountChanges", !accountChanges)}
                />
                <label
                  htmlFor="accountChanges"
                  className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                    accountChanges ? "bg-indigo-500" : "bg-[#27272f]"
                  }`}
                >
                  <span
                    className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-200 transform ${
                      accountChanges ? "translate-x-[26px]" : "translate-x-[2px]"
                    } top-[2px]`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно для изменения имени пользователя */}
      {isUsernameModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-[#080809]/90 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col border border-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-medium">Change Username</h2>
              <button
                className="text-gray-400 hover:text-white transition-colors p-1"
                onClick={() => setIsUsernameModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">New Username</label>
                <input
                  type="text"
                  value={formUsername}
                  onChange={(e) => setFormUsername(e.target.value)}
                  className="w-full bg-[#18181c]/80 border border-[#2a2a2a] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-[#27272f]/80 hover:bg-[#323238] rounded-md text-white transition-colors"
                  onClick={() => setIsUsernameModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
                  onClick={saveUsername}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для изменения email */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-[#080809]/90 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col border border-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-medium">Change Email</h2>
              <button
                className="text-gray-400 hover:text-white transition-colors p-1"
                onClick={() => setIsEmailModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">New Email</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full bg-[#18181c]/80 border border-[#2a2a2a] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-[#27272f]/80 hover:bg-[#323238] rounded-md text-white transition-colors"
                  onClick={() => setIsEmailModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
                  onClick={saveEmail}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для изменения телефона */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-[#080809]/90 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col border border-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-medium">Change Phone</h2>
              <button
                className="text-gray-400 hover:text-white transition-colors p-1"
                onClick={() => setIsPhoneModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">New Phone Number</label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-[#18181c]/80 border border-[#2a2a2a] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-[#27272f]/80 hover:bg-[#323238] rounded-md text-white transition-colors"
                  onClick={() => setIsPhoneModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
                  onClick={savePhone}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для изменения пароля */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-[#080809]/90 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col border border-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-medium">Change Password</h2>
              <button
                className="text-gray-400 hover:text-white transition-colors p-1"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                <input
                  type="password"
                  value={formCurrentPassword}
                  onChange={(e) => setFormCurrentPassword(e.target.value)}
                  className="w-full bg-[#18181c]/80 border border-[#2a2a2a] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">New Password</label>
                <input
                  type="password"
                  value={formNewPassword}
                  onChange={(e) => setFormNewPassword(e.target.value)}
                  className="w-full bg-[#18181c]/80 border border-[#2a2a2a] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={formConfirmPassword}
                  onChange={(e) => setFormConfirmPassword(e.target.value)}
                  className="w-full bg-[#18181c]/80 border border-[#2a2a2a] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-[#27272f]/80 hover:bg-[#323238] rounded-md text-white transition-colors"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
                  onClick={savePassword}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для изменения резервного email */}
      {isBackupEmailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-[#080809]/90 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col border border-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-medium">Change Backup Email</h2>
              <button
                className="text-gray-400 hover:text-white transition-colors p-1"
                onClick={() => setIsBackupEmailModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Backup Email</label>
                <input
                  type="email"
                  value={formBackupEmail}
                  onChange={(e) => setFormBackupEmail(e.target.value)}
                  className="w-full bg-[#18181c]/80 border border-[#2a2a2a] rounded-md py-2 px-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-[#27272f]/80 hover:bg-[#323238] rounded-md text-white transition-colors"
                  onClick={() => setIsBackupEmailModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-md text-white transition-colors"
                  onClick={saveBackupEmail}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно для подтверждения отключения 2FA */}
      {is2FAModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100]">
          <div className="bg-[#080809]/90 backdrop-blur-sm rounded-xl shadow-xl w-full max-w-md mx-4 flex flex-col border border-[#2a2a2a]">
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-medium">Disable Two-Factor Authentication</h2>
              <button
                className="text-gray-400 hover:text-white transition-colors p-1"
                onClick={() => setIs2FAModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to disable two-factor authentication? This will reduce the security level of your
                account.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 bg-[#27272f]/80 hover:bg-[#323238] rounded-md text-white transition-colors"
                  onClick={() => setIs2FAModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white transition-colors"
                  onClick={confirm2FADisable}
                >
                  Disable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
