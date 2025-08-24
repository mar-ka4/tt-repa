"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserByNickname } from "@/data/users"
import { useAuth } from "@/context/auth-context"
import {
  Globe,
  MessageSquare,
  Mail,
  Video,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  FileText,
  ExternalLink,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Map,
} from "lucide-react"
import UserMenu from "@/components/user-menu"

// FAQ data
const faqItems = [
  {
    question: "How do I become a verified route creator?",
    answer:
      "To become a verified route creator, navigate to the 'Become a Creator' page and complete the application form. You'll need to provide some personal information, examples of your travel experience, and agree to our creator guidelines. Our team will review your application within 3-5 business days.",
  },
  {
    question: "When and how do I get paid for my routes?",
    answer:
      "Payments are processed according to your creator level: Level 1 creators receive monthly payments, Level 2 bi-weekly, and Level 3 weekly. You'll need to set up your payment method in the Payments section. We support PayPal, bank transfers, and other payment methods depending on your region. The minimum payout threshold is $20.",
  },
  {
    question: "How do I edit a published route?",
    answer:
      "You can edit a published route by going to 'My Routes' in Creator Studio, selecting the route you want to edit, and clicking the 'Edit' button. Minor changes like fixing typos or updating descriptions will be applied immediately. Major changes like pricing or significant content changes will require review before going live.",
  },
  {
    question: "What happens if a traveler reports an issue with my route?",
    answer:
      "If a traveler reports an issue, you'll receive a notification in your Creator Studio dashboard. We recommend addressing the issue promptly by either updating your route or responding to the traveler. Serious or repeated issues may result in your route being temporarily hidden while our team reviews it.",
  },
  {
    question: "How can I improve my route's visibility and sales?",
    answer:
      "To improve visibility, ensure your route has high-quality photos, detailed descriptions, and accurate tags. Respond promptly to feedback and maintain a high rating. You can also promote your routes on social media and other platforms. Check the Resources section for more marketing tips and best practices.",
  },
  {
    question: "Can I create routes for locations I haven't personally visited?",
    answer:
      "We strongly recommend creating routes only for locations you've personally visited to ensure authenticity and quality. However, if you have extensive research and reliable local contacts, you may create routes with a clear disclaimer. These routes will be subject to additional verification.",
  },
  {
    question: "What are the image requirements for routes?",
    answer:
      "Route images should be high-quality, at least 1200x800 pixels, and in JPG or PNG format. You should have the rights to all images you upload. We recommend 6-12 images per route, including overview shots and specific landmark photos. Avoid using stock photos when possible.",
  },
  {
    question: "How do I handle negative reviews?",
    answer:
      "Respond professionally to negative reviews by acknowledging the feedback, thanking the traveler, and explaining how you'll address their concerns. Avoid defensive responses. If a review violates our guidelines (contains abusive language, etc.), you can report it for review by our moderation team.",
  },
]

// Support categories
const supportCategories = [
  {
    title: "Account & Verification",
    icon: <CheckCircle size={20} />,
    description: "Help with account access, verification, and profile settings",
  },
  {
    title: "Payments & Earnings",
    icon: <FileText size={20} />,
    description: "Questions about payments, revenue share, and financial matters",
  },
  {
    title: "Route Creation",
    icon: <BookOpen size={20} />,
    description: "Assistance with creating, editing, and publishing routes",
  },
  {
    title: "Technical Issues",
    icon: <AlertTriangle size={20} />,
    description: "Help with platform bugs, errors, or technical problems",
  },
]

export default function CreatorSupportPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "Account & Verification",
    message: "",
    attachments: [] as File[],
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Filter FAQs based on search query
  const filteredFaqs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user) {
      const details = getUserByNickname(user.nickname)
      if (details) {
        setUserDetails(details)

        // If user is not verified for routes, redirect to become creator
        if (!details.isVerifiedForRoutes && !details.hasSubmittedVerificationForm) {
          router.push("/become-creator")
          return
        }
      }
    }

    setLoading(false)
  }, [isAuthenticated, user, router])

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(index)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setContactForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files || [])],
      }))
    }
  }

  const removeAttachment = (index: number) => {
    setContactForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the form data to an API
    console.log("Form submitted:", contactForm)
    setFormSubmitted(true)

    // Reset form after submission
    setTimeout(() => {
      setContactForm({
        subject: "",
        category: "Account & Verification",
        message: "",
        attachments: [],
      })
      setFormSubmitted(false)
    }, 5000)
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
        {/* Breadcrumb navigation */}
        <div className="py-2 px-4 mb-8 -mx-4">
          <div className="flex items-center text-sm">
            <Link href="/studio" className="text-gray-400 hover:text-white">
              Creator Studio
            </Link>
            <span className="mx-2 text-gray-600">›</span>
            <span className="text-white">Help & Support</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-medium">Help & Support</h1>
          <p className="text-gray-400 mt-2">
            Get help with your creator account, route creation, and other platform-related questions
          </p>
        </div>

        {/* Support Options Grid */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-6">How Can We Help You?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category, index) => (
              <div
                key={index}
                className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-5 hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => setContactForm((prev) => ({ ...prev, category: category.title }))}
              >
                <div className="w-12 h-12 rounded-md bg-[#18181c] flex items-center justify-center mb-3 mx-auto">
                  <div className="text-indigo-400">{category.icon}</div>
                </div>
                <h3 className="font-medium mb-2 text-center">{category.title}</h3>
                <p className="text-sm text-gray-400 text-center">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-6">Contact Support</h2>
          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            {formSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Message Sent Successfully</h3>
                <p className="text-gray-400 mb-6">
                  Thank you for contacting us. We'll get back to you within 24-48 hours.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleFormChange}
                      placeholder="Brief description of your issue"
                      className="w-full py-3 px-4 bg-[#18181c] border border-[#2a2a2a] rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={contactForm.category}
                      onChange={handleFormChange}
                      className="w-full py-3 px-4 bg-[#18181c] border border-[#2a2a2a] rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-white appearance-none"
                      required
                    >
                      {supportCategories.map((category, index) => (
                        <option key={index} value={category.title}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleFormChange}
                    placeholder="Please describe your issue in detail. Include any relevant information that might help us assist you better."
                    className="w-full py-3 px-4 bg-[#18181c] border border-[#2a2a2a] rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-white min-h-[150px] resize-none"
                    required
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Attachments (Optional)</label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#2a2a2a] rounded-lg cursor-pointer bg-[#18181c] hover:bg-[#1c1c20] transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileText size={24} className="text-gray-400 mb-2" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF, or ZIP (max. 10MB)</p>
                      </div>
                      <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple />
                    </label>
                  </div>

                  {/* Display attached files */}
                  {contactForm.attachments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-300">Attached files:</p>
                      {contactForm.attachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-[#18181c] p-2 rounded-lg">
                          <div className="flex items-center">
                            <FileText size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors flex items-center"
                  >
                    Send Message <Send size={16} className="ml-2" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Contact Methods Section */}
        <section className="mb-12">
          <h2 className="text-xl font-medium mb-6">Other Ways to Get Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#18181c] flex items-center justify-center mb-4 mx-auto">
                <Mail size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-center">Email Support</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                Send us an email directly for non-urgent inquiries
              </p>
              <div className="text-center">
                <a
                  href="mailto:creator-support@travelplatform.com"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  creator-support@travelplatform.com
                </a>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Response time: 24-48 hours</p>
            </div>

            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#18181c] flex items-center justify-center mb-4 mx-auto">
                <MessageSquare size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-center">Live Chat</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                Chat with our support team in real-time for quick assistance
              </p>
              <div className="text-center">
                <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors">
                  Start Chat
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Available: Mon-Fri, 9AM-6PM UTC</p>
            </div>

            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#18181c] flex items-center justify-center mb-4 mx-auto">
                <Video size={24} className="text-indigo-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-center">Video Support</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                Schedule a video call for complex issues or personalized guidance
              </p>
              <div className="text-center">
                <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors">
                  Schedule Call
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">By appointment only</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Frequently Asked Questions</h2>

            {/* Search */}
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search FAQs..."
                className="w-full py-2 pl-10 pr-4 bg-[#18181c] border border-[#2a2a2a] rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none text-white text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6">
            {filteredFaqs.length > 0 ? (
              <div className="divide-y divide-[#1a1a1a]">
                {filteredFaqs.map((faq, index) => (
                  <div key={index} className={index === 0 ? "" : "pt-4"}>
                    <button
                      className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
                      onClick={() => toggleFaq(index)}
                    >
                      <h3 className="font-medium pr-8">{faq.question}</h3>
                      {expandedFaq === index ? (
                        <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="pb-4 text-gray-400">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HelpCircle size={40} className="text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No results found</h3>
                <p className="text-gray-400 mb-4">We couldn't find any FAQs matching your search query.</p>
                <button onClick={() => setSearchQuery("")} className="text-indigo-400 hover:text-indigo-300">
                  Clear search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Knowledge Base Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium">Knowledge Base</h2>
            <div className="text-indigo-400 flex items-center text-sm cursor-pointer">
              View all resources <ArrowRight size={16} className="ml-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-3">
                <BookOpen size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-medium mb-2">Getting Started Guide</h3>
              <p className="text-sm text-gray-400 mb-3">
                Everything you need to know to start creating and publishing routes
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>10 min read</span>
              </div>
            </div>

            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-3">
                <Map size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-medium mb-2">Route Creation Best Practices</h3>
              <p className="text-sm text-gray-400 mb-3">
                Tips and guidelines for creating high-quality, engaging routes
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>15 min read</span>
              </div>
            </div>

            <div className="bg-[#0c0c0e] rounded-xl border border-[#1a1a1a] p-6 hover:border-indigo-500 transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-md bg-[#18181c] flex items-center justify-center mb-3">
                <HelpCircle size={20} className="text-indigo-400" />
              </div>
              <h3 className="font-medium mb-2">Troubleshooting Guide</h3>
              <p className="text-sm text-gray-400 mb-3">Solutions to common issues and technical problems</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock size={14} className="mr-1" />
                <span>8 min read</span>
              </div>
            </div>
          </div>
        </section>

        {/* Support Status */}
        <section>
          <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border border-purple-500/20 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium mb-2">Support Status</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <p className="text-gray-300">All systems operational</p>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  Current average response time: <span className="text-white">4 hours</span>
                </p>
              </div>

              <div className="flex flex-col items-center md:items-end">
                <p className="text-sm text-gray-400 mb-2">Need urgent assistance?</p>
                <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors flex items-center">
                  Priority Support <ExternalLink size={14} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
