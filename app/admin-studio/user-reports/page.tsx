"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import {
  Globe,
  ArrowLeft,
  Flag,
  EyeOff,
  Trash2,
  RotateCcw,
  X,
  MessageSquare,
  User,
  Calendar,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import UserMenu from "@/components/user-menu"

// Mock data for reported routes
const reportedRoutes = [
  {
    id: 1,
    reportId: "REP-001",
    routeId: "route-123",
    routeName: "Tokyo Nightlife Adventure",
    routeImage: "/img/tokyo-1/t-1.png",
    creatorId: "user456",
    creatorName: "Alex Johnson",
    creatorNickname: "worldexplorer",
    reportType: "inappropriate_content",
    reportReason: "This route contains inappropriate language and references to illegal activities.",
    reporterName: "Jane Smith",
    reporterNickname: "traveler_jane",
    reportDate: "2023-06-10T14:30:00Z",
    status: "pending", // pending, dismissed, hidden, deleted, revised
    routeDescription:
      "Explore the vibrant nightlife of Tokyo with this exciting route through the city's most popular districts.",
  },
  {
    id: 2,
    reportId: "REP-002",
    routeId: "route-456",
    routeName: "Berlin Street Art Tour",
    routeImage: "/img/berlin-1/b1.png",
    creatorId: "user789",
    creatorName: "Maria Garcia",
    creatorNickname: "foodie_traveler",
    reportType: "copyright_violation",
    reportReason: "This route uses copyrighted images without permission and copies content from my website.",
    reporterName: "David Lee",
    reporterNickname: "hikingmaster",
    reportDate: "2023-06-12T09:45:00Z",
    status: "pending",
    routeDescription:
      "Discover the best street art in Berlin with this walking tour through the city's most artistic neighborhoods.",
  },
  {
    id: 3,
    reportId: "REP-003",
    routeId: "route-789",
    routeName: "Paris Hidden Gems",
    routeImage: "/paris-street.png",
    creatorId: "user101",
    creatorName: "Sophie Chen",
    creatorNickname: "city_wanderer",
    reportType: "inaccurate_information",
    reportReason:
      "Several locations on this route are permanently closed or have moved. The information is outdated and misleading.",
    reporterName: "Michael Brown",
    reporterNickname: "travel_mike",
    reportDate: "2023-06-15T16:20:00Z",
    status: "pending",
    routeDescription: "Explore the lesser-known parts of Paris and discover hidden gems that most tourists never see.",
  },
  {
    id: 4,
    reportId: "REP-004",
    routeId: "route-012",
    routeName: "Rome Historical Walk",
    routeImage: "/rome-colosseum.png",
    creatorId: "user202",
    creatorName: "Marco Rossi",
    creatorNickname: "italian_guide",
    reportType: "safety_concern",
    reportReason:
      "This route takes people through unsafe areas, especially at night. There have been reports of robberies in these locations.",
    reporterName: "Emma Wilson",
    reporterNickname: "safe_traveler",
    reportDate: "2023-06-18T11:10:00Z",
    status: "pending",
    routeDescription:
      "Walk through the ancient streets of Rome and discover the city's rich history and architectural wonders.",
  },
  {
    id: 5,
    reportId: "REP-005",
    routeId: "route-345",
    routeName: "New York Food Tour",
    routeImage: "/new-york-food.png",
    creatorId: "user303",
    creatorName: "John Davis",
    creatorNickname: "nyc_foodie",
    reportType: "spam",
    reportReason:
      "This route is just an advertisement for specific restaurants. The creator seems to be affiliated with these businesses.",
    reporterName: "Lisa Chen",
    reporterNickname: "honest_reviews",
    reportDate: "2023-06-20T13:40:00Z",
    status: "pending",
    routeDescription:
      "Taste the best food New York has to offer with this culinary tour through Manhattan's diverse neighborhoods.",
  },
]

// Report type labels and colors
const reportTypeInfo = {
  inappropriate_content: {
    label: "Inappropriate Content",
    color: "bg-red-500/20 text-red-400",
    icon: AlertTriangle,
  },
  copyright_violation: {
    label: "Copyright Violation",
    color: "bg-orange-500/20 text-orange-400",
    icon: AlertTriangle,
  },
  inaccurate_information: {
    label: "Inaccurate Information",
    color: "bg-yellow-500/20 text-yellow-400",
    icon: AlertTriangle,
  },
  safety_concern: {
    label: "Safety Concern",
    color: "bg-red-500/20 text-red-400",
    icon: AlertTriangle,
  },
  spam: {
    label: "Spam/Advertising",
    color: "bg-purple-500/20 text-purple-400",
    icon: AlertTriangle,
  },
}

export default function UserReportsPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [reports, setReports] = useState(reportedRoutes)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean
    type: string
    reportId: number | null
  }>({
    show: false,
    type: "",
    reportId: null,
  })

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

  const handleDismissReport = (id: number) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, status: "dismissed" } : report)))
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status: "dismissed" })
    }
    setConfirmAction({ show: false, type: "", reportId: null })
  }

  const handleHideRoute = (id: number) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, status: "hidden" } : report)))
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status: "hidden" })
    }
    setConfirmAction({ show: false, type: "", reportId: null })
  }

  const handleSendForRevision = (id: number) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, status: "revised" } : report)))
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status: "revised" })
    }
    setConfirmAction({ show: false, type: "", reportId: null })
  }

  const handleDeleteRoute = (id: number) => {
    setReports(reports.map((report) => (report.id === id ? { ...report, status: "deleted" } : report)))
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status: "deleted" })
    }
    setConfirmAction({ show: false, type: "", reportId: null })
  }

  const showConfirmation = (type: string, reportId: number) => {
    setConfirmAction({
      show: true,
      type,
      reportId,
    })
  }

  const cancelConfirmation = () => {
    setConfirmAction({ show: false, type: "", reportId: null })
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
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
        {/* Back button and title */}
        <div className="mb-8">
          <Link href="/admin-studio" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to Admin Studio</span>
          </Link>
          <h1 className="text-2xl font-medium">User Reports</h1>
          <p className="text-gray-400 mt-1">Review and manage reported routes</p>
        </div>

        {/* Reports list and details */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Reports list */}
          <div className="w-full lg:w-1/2 space-y-4">
            {reports.map((report) => {
              const typeInfo = reportTypeInfo[report.reportType as keyof typeof reportTypeInfo]

              return (
                <div
                  key={report.id}
                  className={`bg-[#0c0c0e] rounded-xl border ${
                    selectedReport?.id === report.id
                      ? "border-indigo-500"
                      : report.status === "dismissed"
                        ? "border-gray-500"
                        : report.status === "hidden"
                          ? "border-yellow-500"
                          : report.status === "deleted"
                            ? "border-red-500"
                            : report.status === "revised"
                              ? "border-green-500"
                              : "border-[#1a1a1a]"
                  } p-4 cursor-pointer hover:border-indigo-500 transition-colors`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full ${typeInfo.color}`}>{typeInfo.label}</span>
                    </div>
                    <div>
                      {report.status === "dismissed" ? (
                        <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full">Dismissed</span>
                      ) : report.status === "hidden" ? (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Hidden</span>
                      ) : report.status === "deleted" ? (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">Deleted</span>
                      ) : report.status === "revised" ? (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                          Sent for Revision
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">Pending</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={report.routeImage || "/placeholder.svg"}
                        alt={report.routeName}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium line-clamp-1">{report.routeName}</h3>
                      <p className="text-sm text-gray-400 mb-1">by @{report.creatorNickname}</p>
                      <p className="text-xs text-gray-500">
                        Reported: {new Date(report.reportDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Report details */}
          {selectedReport ? (
            <div className="w-full lg:w-1/2 bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
              {confirmAction.show && confirmAction.reportId === selectedReport.id ? (
                <div className="bg-[#18181c] rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-medium mb-4">Confirm Action</h3>

                  {confirmAction.type === "dismiss" && (
                    <p className="text-gray-300 mb-6">
                      Are you sure you want to dismiss this report? This action will mark the report as reviewed with no
                      action taken.
                    </p>
                  )}

                  {confirmAction.type === "hide" && (
                    <p className="text-gray-300 mb-6">
                      Are you sure you want to hide this route? The route will be temporarily hidden from public view.
                    </p>
                  )}

                  {confirmAction.type === "revise" && (
                    <p className="text-gray-300 mb-6">
                      Are you sure you want to send this route for revision? The creator will be notified to make
                      changes.
                    </p>
                  )}

                  {confirmAction.type === "delete" && (
                    <p className="text-gray-300 mb-6">
                      Are you sure you want to delete this route? This action cannot be undone.
                    </p>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={cancelConfirmation}
                      className="px-4 py-2 rounded-lg bg-[#27272f] text-white hover:bg-[#323238] transition-colors"
                    >
                      Cancel
                    </button>

                    {confirmAction.type === "dismiss" && (
                      <button
                        onClick={() => handleDismissReport(selectedReport.id)}
                        className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors"
                      >
                        Confirm Dismiss
                      </button>
                    )}

                    {confirmAction.type === "hide" && (
                      <button
                        onClick={() => handleHideRoute(selectedReport.id)}
                        className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                      >
                        Confirm Hide
                      </button>
                    )}

                    {confirmAction.type === "revise" && (
                      <button
                        onClick={() => handleSendForRevision(selectedReport.id)}
                        className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        Confirm Send for Revision
                      </button>
                    )}

                    {confirmAction.type === "delete" && (
                      <button
                        onClick={() => handleDeleteRoute(selectedReport.id)}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        Confirm Delete
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-medium">{selectedReport.routeName}</h2>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            reportTypeInfo[selectedReport.reportType as keyof typeof reportTypeInfo].color
                          }`}
                        >
                          {reportTypeInfo[selectedReport.reportType as keyof typeof reportTypeInfo].label}
                        </span>
                      </div>
                      <p className="text-gray-400">Report ID: {selectedReport.reportId}</p>
                    </div>
                    <div>
                      {selectedReport.status === "dismissed" ? (
                        <span className="text-sm px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full">Dismissed</span>
                      ) : selectedReport.status === "hidden" ? (
                        <span className="text-sm px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Hidden</span>
                      ) : selectedReport.status === "deleted" ? (
                        <span className="text-sm px-3 py-1 bg-red-500/20 text-red-400 rounded-full">Deleted</span>
                      ) : selectedReport.status === "revised" ? (
                        <span className="text-sm px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                          Sent for Revision
                        </span>
                      ) : (
                        <span className="text-sm px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Pending</span>
                      )}
                    </div>
                  </div>

                  {/* Route preview */}
                  <div className="mb-6">
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={selectedReport.routeImage || "/placeholder.svg"}
                        alt={selectedReport.routeName}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-300">{selectedReport.routeDescription}</p>
                    <div className="mt-3">
                      <Link
                        href={`/route/${selectedReport.routeId}`}
                        className="inline-flex items-center text-indigo-400 hover:underline"
                      >
                        View Route <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Report Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Report Information</h3>
                      <div className="bg-[#18181c] rounded-lg p-4">
                        <div className="flex items-start mb-4">
                          <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-400">Report Reason</p>
                            <p className="text-gray-300">{selectedReport.reportReason}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-400">Reported By</p>
                            <p>
                              {selectedReport.reporterName} (@{selectedReport.reporterNickname})
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start mt-4">
                          <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <p className="text-sm text-gray-400">Report Date</p>
                            <p>{new Date(selectedReport.reportDate).toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Creator Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Creator Information</h3>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          <Image
                            src={`/diverse-professional-profiles.png?height=40&width=40&query=profile ${selectedReport.creatorNickname}`}
                            alt={selectedReport.creatorName}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{selectedReport.creatorName}</p>
                          <Link
                            href={`/profile/${selectedReport.creatorNickname}`}
                            className="text-sm text-indigo-400 hover:underline"
                          >
                            @{selectedReport.creatorNickname}
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {selectedReport.status === "pending" && (
                      <div className="flex flex-wrap justify-end gap-3 pt-4">
                        <button
                          onClick={() => showConfirmation("dismiss", selectedReport.id)}
                          className="px-4 py-2 rounded-lg bg-[#27272f] text-white hover:bg-[#323238] transition-colors flex items-center"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Dismiss Report
                        </button>
                        <button
                          onClick={() => showConfirmation("hide", selectedReport.id)}
                          className="px-4 py-2 rounded-lg bg-[#27272f] text-white hover:bg-[#323238] transition-colors flex items-center"
                        >
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide Route
                        </button>
                        <button
                          onClick={() => showConfirmation("revise", selectedReport.id)}
                          className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors flex items-center"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Send for Revision
                        </button>
                        <button
                          onClick={() => showConfirmation("delete", selectedReport.id)}
                          className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Route
                        </button>
                      </div>
                    )}

                    {selectedReport.status !== "pending" && (
                      <div className="bg-[#18181c] rounded-lg p-4 mt-6">
                        <p className="text-gray-300">
                          {selectedReport.status === "dismissed" &&
                            "This report has been dismissed. No action was taken."}
                          {selectedReport.status === "hidden" && "This route has been hidden from public view."}
                          {selectedReport.status === "deleted" && "This route has been deleted."}
                          {selectedReport.status === "revised" &&
                            "This route has been sent to the creator for revision."}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="w-full lg:w-1/2 bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 flex items-center justify-center">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#18181c] flex items-center justify-center mx-auto mb-4">
                  <Flag className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Select a Report</h3>
                <p className="text-gray-400 max-w-xs mx-auto">
                  Click on a report from the list to view details and take action
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
