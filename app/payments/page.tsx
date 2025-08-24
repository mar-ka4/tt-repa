"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import UserMenu from "@/components/user-menu"
import {
  Download,
  CreditCard,
  Wallet,
  BanknoteIcon as Bank,
  DollarSign,
  Calendar,
  ChevronDown,
  Filter,
  Search,
  Plus,
  ExternalLink,
  HelpCircle,
  AlertCircle,
} from "lucide-react"

export default function PaymentsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("transactions")
  const [selectedPeriod, setSelectedPeriod] = useState("last30days")
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)

  // Mock data for payments
  const mockEarnings = {
    total: 2845.75,
    available: 1250.0,
    pending: 595.75,
    lastPayout: 1000.0,
    lastPayoutDate: "Apr 15, 2025",
    nextEstimatedPayout: "May 15, 2025",
  }

  const mockTransactions = [
    {
      id: "tx-001",
      date: "Apr 15, 2025",
      type: "payout",
      amount: 1000.0,
      status: "completed",
      description: "Monthly payout to bank account",
    },
    {
      id: "tx-002",
      date: "Apr 12, 2025",
      type: "earning",
      amount: 125.5,
      status: "completed",
      description: "Route purchase: Berlin City Tour",
    },
    {
      id: "tx-003",
      date: "Apr 10, 2025",
      type: "earning",
      amount: 89.99,
      status: "completed",
      description: "Route purchase: Tokyo Highlights",
    },
    {
      id: "tx-004",
      date: "Apr 5, 2025",
      type: "earning",
      amount: 199.99,
      status: "completed",
      description: "Route purchase: Iceland Adventure",
    },
    {
      id: "tx-005",
      date: "Apr 1, 2025",
      type: "payout",
      amount: 850.0,
      status: "completed",
      description: "Monthly payout to bank account",
    },
    {
      id: "tx-006",
      date: "Mar 28, 2025",
      type: "earning",
      amount: 75.25,
      status: "completed",
      description: "Route purchase: London Walking Tour",
    },
    {
      id: "tx-007",
      date: "Mar 25, 2025",
      type: "fee",
      amount: -15.0,
      status: "completed",
      description: "Platform fee",
    },
    {
      id: "tx-008",
      date: "Mar 20, 2025",
      type: "earning",
      amount: 150.0,
      status: "completed",
      description: "Subscription revenue share",
    },
  ]

  const mockPaymentMethods = [
    {
      id: "pm-001",
      type: "bank",
      name: "Chase Bank",
      last4: "4567",
      isDefault: true,
    },
    {
      id: "pm-002",
      type: "paypal",
      email: "creator@example.com",
      isDefault: false,
    },
  ]

  const mockRevenueBreakdown = {
    routeSales: 1845.75,
    subscriptions: 950.0,
    tips: 50.0,
    platformFees: -150.0,
    taxes: -100.0,
  }

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const details = getUserByNickname(user.nickname)
      if (details) {
        setUserDetails(details)
      }
    }

    setLoading(false)
  }, [isAuthenticated, user, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400"
      case "pending":
        return "px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400"
      case "failed":
        return "px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400"
      default:
        return "px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payout":
        return <Bank size={18} className="text-blue-400" />
      case "earning":
        return <DollarSign size={18} className="text-green-400" />
      case "fee":
        return <DollarSign size={18} className="text-red-400" />
      default:
        return <DollarSign size={18} className="text-gray-400" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "payout":
        return "text-blue-400"
      case "earning":
        return "text-green-400"
      case "fee":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const renderPeriodText = () => {
    switch (selectedPeriod) {
      case "last30days":
        return "Last 30 days"
      case "last90days":
        return "Last 90 days"
      case "thisYear":
        return "This year"
      case "lastYear":
        return "Last year"
      case "allTime":
        return "All time"
      default:
        return "Last 30 days"
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-16">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-black border-b border-[#1a1a1a]">
        <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center min-w-[40px]">
            <Image src="/logo.png" alt="Logo" width={73} height={40} />
          </Link>

          {/* User Menu */}
          <UserMenu />
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-[1100px] w-full mx-auto px-4 pt-24">
        {/* Breadcrumb navigation */}
        <div className="py-2 px-4 mb-8 -mx-4">
          <div className="flex items-center text-sm">
            <Link href="/studio" className="text-gray-400 hover:text-white">
              Creator Studio
            </Link>
            <span className="mx-2 text-gray-600">›</span>
            <span className="text-white">Payments</span>
          </div>
        </div>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium">Payments</h1>
        </div>

        {/* Earnings summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total earnings */}
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-400 text-sm">Total Earnings</h2>
              <DollarSign size={18} className="text-indigo-400" />
            </div>
            <div className="text-2xl font-medium">${mockEarnings.total.toFixed(2)}</div>
            <div className="mt-2 text-xs text-gray-400">Lifetime earnings</div>
          </div>

          {/* Available for payout */}
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-400 text-sm">Available for Payout</h2>
              <Wallet size={18} className="text-green-400" />
            </div>
            <div className="text-2xl font-medium">${mockEarnings.available.toFixed(2)}</div>
            <div className="mt-2 text-xs text-gray-400">Next payout: {mockEarnings.nextEstimatedPayout}</div>
          </div>

          {/* Pending earnings */}
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-gray-400 text-sm">Pending Earnings</h2>
              <Calendar size={18} className="text-yellow-400" />
            </div>
            <div className="text-2xl font-medium">${mockEarnings.pending.toFixed(2)}</div>
            <div className="mt-2 text-xs text-gray-400">Will be available in 15-30 days</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1a1a1a] mb-6 overflow-x-auto">
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "transactions" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("transactions")}
          >
            Transactions
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "paymentMethods" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("paymentMethods")}
          >
            Payment Methods
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "analytics" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Revenue Analytics
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === "settings" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-400"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Payout Settings
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "transactions" && (
          <div>
            {/* Filters and actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                <div className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-2 bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg text-sm w-full sm:w-auto"
                    onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                  >
                    <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate">{renderPeriodText()}</span>
                    <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />
                  </button>

                  {showPeriodDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#18181c]"
                          onClick={() => {
                            setSelectedPeriod("last30days")
                            setShowPeriodDropdown(false)
                          }}
                        >
                          Last 30 days
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#18181c]"
                          onClick={() => {
                            setSelectedPeriod("last90days")
                            setShowPeriodDropdown(false)
                          }}
                        >
                          Last 90 days
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#18181c]"
                          onClick={() => {
                            setSelectedPeriod("thisYear")
                            setShowPeriodDropdown(false)
                          }}
                        >
                          This year
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#18181c]"
                          onClick={() => {
                            setSelectedPeriod("lastYear")
                            setShowPeriodDropdown(false)
                          }}
                        >
                          Last year
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[#18181c]"
                          onClick={() => {
                            setSelectedPeriod("allTime")
                            setShowPeriodDropdown(false)
                          }}
                        >
                          All time
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button className="flex items-center gap-1 px-3 py-2 bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg text-sm w-full sm:w-auto">
                  <Filter size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">Filter</span>
                </button>

                <div className="relative w-full sm:w-auto">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions"
                    className="pl-9 pr-3 py-2 bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg text-sm w-full sm:w-64"
                  />
                </div>
              </div>

              <button className="flex items-center gap-1 px-3 py-2 bg-[#0c0c0e] border border-[#1a1a1a] rounded-lg text-sm w-full sm:w-auto">
                <Download size={16} className="text-gray-400 flex-shrink-0" />
                <span className="truncate">Export CSV</span>
              </button>
            </div>

            {/* Mobile-friendly transactions */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getTypeIcon(transaction.type)}
                        <span className={`ml-2 text-sm font-medium ${getTypeColor(transaction.type)}`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </div>
                      <span className={getStatusBadge(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">{transaction.description}</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">{transaction.date}</span>
                      <span
                        className={`text-sm font-medium ${transaction.amount < 0 ? "text-red-400" : "text-green-400"}`}
                      >
                        {transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-[#18181c]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.date}</td>
                        <td className="px-6 py-4 text-sm">{transaction.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            {getTypeIcon(transaction.type)}
                            <span className={`ml-2 ${getTypeColor(transaction.type)}`}>
                              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm text-right ${transaction.amount < 0 ? "text-red-400" : "text-green-400"}`}
                        >
                          {transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={getStatusBadge(transaction.status)}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#1a1a1a] gap-4">
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{" "}
                  <span className="font-medium">24</span> results
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 rounded-md bg-[#18181c] text-sm">Previous</button>
                  <button className="px-3 py-1 rounded-md bg-indigo-500 text-sm">1</button>
                  <button className="px-3 py-1 rounded-md bg-[#18181c] text-sm">2</button>
                  <button className="px-3 py-1 rounded-md bg-[#18181c] text-sm">3</button>
                  <button className="px-3 py-1 rounded-md bg-[#18181c] text-sm">Next</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "paymentMethods" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-medium">Your Payment Methods</h2>
              <button className="flex items-center gap-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors w-full sm:w-auto">
                <Plus size={16} />
                <span>Add Payment Method</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPaymentMethods.map((method) => (
                <div key={method.id} className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center mb-2">
                        {method.type === "bank" ? (
                          <Bank size={20} className="text-indigo-400 mr-2" />
                        ) : (
                          <CreditCard size={20} className="text-indigo-400 mr-2" />
                        )}
                        <h3 className="font-medium">{method.type === "bank" ? method.name : "PayPal"}</h3>
                        {method.isDefault && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {method.type === "bank" ? `Account ending in ••••${method.last4}` : `${method.email}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-white">
                        <HelpCircle size={16} />
                      </button>
                      <button className="text-gray-400 hover:text-white">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex flex-col sm:flex-row justify-between gap-2">
                    <button className="text-sm text-gray-400 hover:text-white">Edit</button>
                    {!method.isDefault && (
                      <button className="text-sm text-gray-400 hover:text-white">Set as default</button>
                    )}
                    <button className="text-sm text-red-400 hover:text-red-300">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
              <div className="flex items-start">
                <AlertCircle size={20} className="text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Important Information About Payments</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Payouts are processed on the 15th of each month for all earnings that have cleared the 30-day
                    holding period. The minimum payout amount is $50. If your available balance is below $50, it will
                    roll over to the next payout period.
                  </p>
                  <p className="text-sm text-gray-400">
                    For more information, please review our{" "}
                    <a href="#" className="text-indigo-400 hover:underline">
                      Creator Payment Terms
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">Revenue Breakdown</h2>
              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Route Sales</h3>
                    <p className="text-xl font-medium text-green-400">${mockRevenueBreakdown.routeSales.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Subscriptions</h3>
                    <p className="text-xl font-medium text-green-400">
                      ${mockRevenueBreakdown.subscriptions.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Tips</h3>
                    <p className="text-xl font-medium text-green-400">${mockRevenueBreakdown.tips.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Platform Fees</h3>
                    <p className="text-xl font-medium text-red-400">${mockRevenueBreakdown.platformFees.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-400 mb-1">Taxes</h3>
                    <p className="text-xl font-medium text-red-400">${mockRevenueBreakdown.taxes.toFixed(2)}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
                  <h3 className="text-sm text-gray-400 mb-2">Revenue Distribution</h3>
                  <div className="w-full h-4 bg-[#18181c] rounded-full overflow-hidden">
                    <div className="flex h-full">
                      <div className="bg-green-500" style={{ width: "65%" }}></div>
                      <div className="bg-blue-500" style={{ width: "20%" }}></div>
                      <div className="bg-yellow-500" style={{ width: "5%" }}></div>
                      <div className="bg-red-500" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap mt-3 gap-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">Route Sales (65%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">Subscriptions (20%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">Tips (5%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-400">Fees & Taxes (10%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">Monthly Revenue</h2>
              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
                <div className="h-64 flex items-end justify-between px-2">
                  {/* Mock bar chart */}
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => {
                    const height = [60, 45, 75, 90, 65, 80][index]
                    return (
                      <div key={month} className="flex flex-col items-center">
                        <div className="w-12 bg-indigo-500 rounded-t-md" style={{ height: `${height}%` }}></div>
                        <div className="mt-2 text-xs text-gray-400">{month}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4">Top Performing Routes</h2>
              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1a1a1a]">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Route
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Conversion
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]">
                      <tr className="hover:bg-[#18181c]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Tokyo Highlights</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">42</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">$839.58</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">8.4%</td>
                      </tr>
                      <tr className="hover:bg-[#18181c]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Berlin City Tour</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">38</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">$752.50</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">7.2%</td>
                      </tr>
                      <tr className="hover:bg-[#18181c]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Iceland Adventure</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">25</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">$624.75</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">6.8%</td>
                      </tr>
                      <tr className="hover:bg-[#18181c]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">London Walking Tour</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">31</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">$464.69</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">5.9%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-medium mb-4">Payout Settings</h2>

              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 mb-6">
                <h3 className="font-medium mb-4">Payout Schedule</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="monthly"
                      name="payoutSchedule"
                      className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-700 bg-[#18181c]"
                      defaultChecked
                    />
                    <label htmlFor="monthly" className="ml-2 block">
                      <span className="font-medium">Monthly</span>
                      <p className="text-sm text-gray-400">Get paid once a month on the 15th</p>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="biweekly"
                      name="payoutSchedule"
                      className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-700 bg-[#18181c]"
                    />
                    <label htmlFor="biweekly" className="ml-2 block">
                      <span className="font-medium">Bi-weekly</span>
                      <p className="text-sm text-gray-400">
                        Get paid every two weeks (requires premium creator status)
                      </p>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="manual"
                      name="payoutSchedule"
                      className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-700 bg-[#18181c]"
                    />
                    <label htmlFor="manual" className="ml-2 block">
                      <span className="font-medium">Manual</span>
                      <p className="text-sm text-gray-400">Request payouts manually when you want them</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 mb-6">
                <h3 className="font-medium mb-4">Minimum Payout Amount</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="min50"
                      name="minPayout"
                      className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-700 bg-[#18181c]"
                      defaultChecked
                    />
                    <label htmlFor="min50" className="ml-2 block">
                      <span className="font-medium">$50</span>
                      <p className="text-sm text-gray-400">Default minimum payout amount</p>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="min100"
                      name="minPayout"
                      className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-700 bg-[#18181c]"
                    />
                    <label htmlFor="min100" className="ml-2 block">
                      <span className="font-medium">$100</span>
                      <p className="text-sm text-gray-400">Accumulate more before payout</p>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="min200"
                      name="minPayout"
                      className="h-4 w-4 text-indigo-500 focus:ring-indigo-400 border-gray-700 bg-[#18181c]"
                    />
                    <label htmlFor="min200" className="ml-2 block">
                      <span className="font-medium">$200</span>
                      <p className="text-sm text-gray-400">Maximize earnings before payout</p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 mb-6">
                <h3 className="font-medium mb-4">Tax Information</h3>
                <p className="text-sm text-gray-400 mb-4">
                  We need your tax information to process payouts correctly and comply with tax regulations.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#18181c] rounded-lg mb-4 gap-4">
                  <div>
                    <h4 className="font-medium">Tax Form Status</h4>
                    <p className="text-sm text-yellow-400">Pending - Action Required</p>
                  </div>
                  <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors w-full sm:w-auto">
                    Complete Tax Form
                  </button>
                </div>

                <p className="text-sm text-gray-400">
                  Note: You must complete your tax information before you can receive payouts exceeding $600 in a
                  calendar year.
                </p>
              </div>

              <div className="flex justify-end">
                <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm transition-colors">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
