"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  Syringe,
  Stethoscope,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ParentService from "../../api/services/parent.service"
import { useToast } from "@/components/ui/use-toast" // Corrected import for toast notifications

const StudentEvents = ({ selectedStudent }) => {
  const { toast } = useToast() // Initialize toast hook
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // Filter by resultStatus
  const [filterType, setFilterType] = useState("all")
  const [updatingResponse, setUpdatingResponse] = useState(new Set())

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Helper functions
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A"
    }
    return String(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return "N/A"
    }
  }

  const getEventTypeColor = (eventType) => {
    switch (eventType?.toUpperCase()) {
      case "HEALTH_CHECK":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "VACCINATION":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  const getEventTypeIcon = (eventType) => {
    switch (eventType?.toUpperCase()) {
      case "HEALTH_CHECK":
        return <Stethoscope className="w-5 h-5 text-green-600" />
      case "VACCINATION":
        return <Syringe className="w-5 h-5 text-blue-600" />
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />
    }
  }

  const getEventTypeLabel = (eventType) => {
    switch (eventType?.toUpperCase()) {
      case "HEALTH_CHECK":
        return "Khám sức khỏe"
      case "VACCINATION":
        return "Tiêm vắc-xin"
      default:
        return "Sự kiện y tế"
    }
  }

  // Updated consent status handling
  const getConsentStatusColor = (consentStatus) => {
    if (!consentStatus) return "bg-gray-100 text-gray-800 border-gray-200"

    switch (consentStatus.toUpperCase()) {
      case "APPROVED":
        return "bg-green-100 text-green-800 border-green-200"
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "DONE":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConsentStatusIcon = (consentStatus) => {
    if (!consentStatus) return <AlertCircle className="w-4 h-4" />

    switch (consentStatus.toUpperCase()) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />
      case "REJECTED":
        return <XCircle className="w-4 h-4" />
      case "PENDING":
        return <Clock className="w-4 h-4" /> // Reverted to Clock for PENDING
      case "DONE":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getConsentStatusLabel = (consentStatus) => {
    if (!consentStatus) return "Chưa phản hồi"

    switch (consentStatus.toUpperCase()) {
      case "APPROVED":
        return "Đã đồng ý"
      case "REJECTED":
        return "Đã từ chối"
      case "PENDING":
        return "Đang chờ phản hồi"
      case "DONE":
        return "Đã hoàn thành consent"
      default:
        return "Chưa phản hồi"
    }
  }

  // Updated result status handling based on new API structure
  const getResultStatusInfo = (resultStatus) => {
    switch (resultStatus?.toUpperCase()) {
      case "DONE":
        return {
          label: "Đã hoàn thành",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-4 h-4" />,
          description: "Kết quả sự kiện đã được ghi nhận và hoàn thành.",
          shouldDisplay: true,
        }
      case "PENDING":
        return {
          label: "Đang chờ xử lý",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="w-4 h-4" />,
          description: "Sự kiện đang chờ xử lý hoặc cập nhật kết quả.",
          shouldDisplay: true,
        }
      case "APPROVED":
        return {
          label: "Đã chấp thuận",
          color: "bg-blue-100 text-blue-800",
          icon: <ThumbsUp className="w-4 h-4" />,
          description: "Sự kiện đã được chấp thuận và đang chờ kết quả.",
          shouldDisplay: true,
        }
      case "REJECTED":
        return {
          label: "Đã từ chối",
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="w-4 h-4" />,
          description: "Sự kiện đã bị từ chối hoặc không có sự đồng ý.",
          shouldDisplay: true,
        }
      case "NULL": // Specific case to hide this status
        return {
          label: "Chưa có kết quả",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="w-4 h-4" />,
          description: "Kết quả sự kiện chưa được ghi nhận.",
          shouldDisplay: false, // Do not display this status
        }
      default: // Handles "null" or any other unexpected status
        return {
          label: "Chưa xác định",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="w-4 h-4" />,
          description: "Trạng thái kết quả không xác định.",
          shouldDisplay: true,
        }
    }
  }

  // Filter events based on null statuses first, then apply search/type filters
  const rawEvents = Array.isArray(events) ? events : []

  const preFilteredEvents = rawEvents.filter((event) => {
    // An event is considered "displayable" if its consentStatus is not null
    // AND its resultStatus is not null AND not "Chưa có kết quả"
    const hasConsentStatus = event.consentStatus !== null
    const hasValidResultStatus = event.resultStatus !== null && event.resultStatus !== "Chưa có kết quả"

    return hasConsentStatus && hasValidResultStatus
  })

  const filteredEvents = preFilteredEvents.filter((event) => {
    const matchesSearch = event.campaignName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || event.resultStatus?.toUpperCase() === filterStatus.toUpperCase()
    const matchesType = filterType === "all" || event.type?.toUpperCase() === filterType.toUpperCase()
    return matchesSearch && matchesStatus && matchesType
  })

  // Fetch events with pagination
  const fetchEvents = async (page = 0) => {
    if (!selectedStudent?.id) {
      setEvents([])
      return
    }

    try {
      setLoading(true)
      const response = await ParentService.getStudentEvent(selectedStudent.id, page, 10)

      console.log("Fetched student events:", response)

      if (response && response.data) {
        // Handle paginated response structure
        const pageData = response.data

        if (pageData.content && Array.isArray(pageData.content)) {
          setEvents(pageData.content)
          setTotalPages(pageData.totalPages || 0)
          setTotalElements(pageData.totalElements || 0)
          setCurrentPage(page) // Ensure currentPage is updated correctly
        } else if (Array.isArray(pageData)) {
          // Handle direct array response (if API doesn't paginate)
          setEvents(pageData)
          setTotalPages(1)
          setTotalElements(pageData.length)
          setCurrentPage(0)
        } else {
          setEvents([])
        }
      } else {
        setEvents([])
      }
    } catch (error) {
      console.error("Error fetching student events:", error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentPage(0) // Reset về trang đầu khi đổi student
    fetchEvents(0)
  }, [selectedStudent?.id])

  const handleViewDetail = (event) => {
    setSelectedEvent(event)
    setShowDetailModal(true)
  }

  const handleConsentResponse = async (event, response) => {
    if (!event.consentId) {
      alert("Không tìm thấy ID đồng ý cho sự kiện này")
      return
    }

    try {
      setUpdatingResponse((prev) => new Set([...prev, event.eventId]))

      const consentStatus = response === "approved" ? "APPROVED" : "REJECTED"
      const requestData = { consentStatus }

      if (event.type?.toUpperCase() === "VACCINATION") {
        console.log("Vaccination consent updated:", event.consentId, requestData)
        await ParentService.updateAcceptedVaccination(event.consentId, requestData)
      } else if (event.type?.toUpperCase() === "HEALTH_CHECK") {
        console.log("Healthcheck consent updated:", event.consentId, requestData)
        await ParentService.updateAcceptedHealthCheck(event.consentId, requestData)
      } else {
        console.warn("Unknown event type, defaulting to health check API:", event.type)
        await ParentService.updateAcceptedHealthCheck(event.consentId, requestData)
      }

      // Refresh the current page to get updated data
      await fetchEvents(currentPage)

      toast({
        title: "Cập nhật thành công",
        description: `Đã ${response === "approved" ? "chấp nhận" : "từ chối"} tham gia sự kiện!`,
        variant: "success",
      })
    } catch (error) {
      console.error("Error updating consent:", error)
      toast({
        title: "Lỗi cập nhật",
        description: "Có lỗi xảy ra khi cập nhật phản hồi: " + error.message,
        variant: "destructive",
      })
    } finally {
      setUpdatingResponse((prev) => {
        const newSet = new Set(prev)
        newSet.delete(event.eventId)
        return newSet
      })
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage)
      fetchEvents(newPage) // pageSize is fixed at 10 in fetchEvents
    }
  }

  // Get status counts for display
  const getEventSummaryCounts = () => {
    if (!Array.isArray(events)) return {}

    const counts = {
      consentPending: 0,
      consentApproved: 0,
      consentRejected: 0,
      consentDone: 0,
      resultPending: 0,
      resultCompleted: 0,
      resultNoConsent: 0,
    }

    events.forEach((e) => {
      // Consent Status Counts
      switch (e.consentStatus?.toUpperCase()) {
        case "PENDING":
          counts.consentPending++
          break
        case "APPROVED":
          counts.consentApproved++
          break
        case "REJECTED":
          counts.consentRejected++
          break
        case "DONE":
          counts.consentDone++
          break
      }

      // Result Status Counts
      switch (e.resultStatus?.toUpperCase()) {
        case "PENDING":
          counts.resultPending++
          break
        case "DONE":
          counts.resultCompleted++
          break
        case "REJECTED":
          counts.resultNoConsent++
          break
      }
    })
    return counts
  }

  const eventSummaryCounts = getEventSummaryCounts()

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="text-gray-600">Đang tải sự kiện y tế...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Sự kiện Y tế</h2>
              <p className="text-purple-100">
                Theo dõi các sự kiện y tế của{" "}
                {formatValue(selectedStudent?.user?.fullName || selectedStudent?.fullName)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm sự kiện y tế..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tất cả trạng thái kết quả</option>
                <option value="DONE">Đã hoàn thành</option>
                <option value="PENDING">Đang chờ xử lý</option>
                <option value="APPROVED">Đã chấp thuận</option>
                <option value="REJECTED">Đã từ chối</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="health_check">Khám sức khỏe</option>
                <option value="vaccination">Tiêm vaccine</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 flex-wrap gap-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                Hiển thị {Math.min(currentPage * 10 + 1, totalElements || filteredEvents.length)} -{" "}
                {Math.min((currentPage + 1) * 10, totalElements || filteredEvents.length)}
                trong tổng số {totalElements || filteredEvents.length} sự kiện
              </span>
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                <Clock className="w-3 h-3 mr-1" />
                Consent Chờ: {eventSummaryCounts.consentPending}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Consent Đã đồng ý: {eventSummaryCounts.consentApproved}
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700">
                <XCircle className="w-3 h-3 mr-1" />
                Consent Từ chối: {eventSummaryCounts.consentRejected}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Consent Hoàn thành: {eventSummaryCounts.consentDone}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Stethoscope className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Không tìm thấy sự kiện nào"
                  : "Chưa có sự kiện y tế nào"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Sự kiện y tế sẽ được cập nhật khi có lịch hẹn từ nhà trường"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event, index) => {
            const resultStatusInfo = getResultStatusInfo(event.resultStatus)
            // Only allow response if consentStatus is PENDING
            const canRespondToConsent = event.consentId && event.consentStatus?.toUpperCase() === "PENDING"

            return (
              <motion.div
                key={event.eventId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className={`transition-all duration-200 ${getEventTypeColor(event.type)} hover:shadow-lg`}>
                  <CardContent className="p-6">
                    {/* Event Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-1">
                            {formatValue(event.campaignName)}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {getEventTypeLabel(event.type)}
                            </Badge>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-600">Ngày: {formatDate(event.startDate)}</span>
                            {event.consentStatus && (
                              <>
                                <span className="text-sm text-gray-500">•</span>
                                <Badge className={getConsentStatusColor(event.consentStatus)}>
                                  <div className="flex items-center space-x-1">
                                    {getConsentStatusIcon(event.consentStatus)}
                                    <span>{getConsentStatusLabel(event.consentStatus)}</span>
                                  </div>
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* {resultStatusInfo.shouldDisplay && (
                        <Badge className={resultStatusInfo.color}>
                          <div className="flex items-center space-x-1">
                            {resultStatusInfo.icon}
                            <span>{resultStatusInfo.label}</span>
                          </div>
                        </Badge>
                      )} */}
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Ngày bắt đầu</p>
                          <p className="font-medium text-gray-900">{formatDate(event.startDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Ngày kết thúc</p>
                          <p className="font-medium text-gray-900">{formatDate(event.endDate)}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Địa điểm</p>
                          <p className="font-medium text-gray-900 truncate" title={formatValue(event.location)}>
                            {formatValue(event.location)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Học sinh</p>
                          <p className="font-medium text-gray-900 truncate" title={formatValue(event.studentName)}>
                            {formatValue(event.studentName)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Description Preview */}
                    {event.description && (
                      <div className="bg-white bg-opacity-60 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {event.description.length > 200
                            ? `${event.description.substring(0, 200)}...`
                            : event.description}
                        </p>
                      </div>
                    )}

                    {/* Status Information */}
                    {/* {resultStatusInfo.shouldDisplay && (
                      <div
                        className={`p-3 rounded-lg mb-4 ${resultStatusInfo.color.replace("text-", "text-opacity-80 bg-opacity-50 ")}`}
                      >
                        <div className="flex items-center space-x-2">
                          {resultStatusInfo.icon}
                          <span className="text-sm font-medium">{resultStatusInfo.description}</span>
                        </div>
                      </div>
                    )} */}

                    {/* Consent Status Text */}
                    {/* {event.consentStatusText && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
                        <p className="text-sm text-blue-800 font-medium">{event.consentStatusText}</p>
                      </div>
                    )} */}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-white border-opacity-50">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        {/* Removed commented-out "Hoàn thành" status display */}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleViewDetail(event)}
                          variant="outline"
                          size="sm"
                          className="bg-white hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>

                        {/* Consent Response Buttons - Only show if consentStatus is PENDING */}
                        {canRespondToConsent && (
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleConsentResponse(event, "approved")}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              disabled={updatingResponse.has(event.eventId)}
                            >
                              {updatingResponse.has(event.eventId) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              ) : (
                                <CheckCircle className="w-4 h-4 mr-2" />
                              )}
                              Đồng ý
                            </Button>

                            <Button
                              onClick={() => handleConsentResponse(event, "rejected")}
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50"
                              disabled={updatingResponse.has(event.eventId)}
                            >
                              {updatingResponse.has(event.eventId) ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                              ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                              )}
                              Từ chối
                            </Button>
                          </div>
                        )}

                        {/* Show status message for non-actionable consent states */}
                        {event.consentStatus?.toUpperCase() === "APPROVED" && (
                          <div className="text-sm text-green-600 font-medium">✓ Đã đồng ý tham gia</div>
                        )}
                        {event.consentStatus?.toUpperCase() === "REJECTED" && (
                          <div className="text-sm text-red-600 font-medium">✗ Đã từ chối tham gia</div>
                        )}
                        {event.consentStatus?.toUpperCase() === "DONE" && (
                          <div className="text-sm text-blue-600 font-medium">✓ Consent đã hoàn thành</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>
                  Trang {currentPage + 1} / {totalPages}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i
                    } else if (currentPage < 3) {
                      pageNum = i
                    } else if (currentPage > totalPages - 4) {
                      pageNum = totalPages - 5 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        {pageNum + 1}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  variant="outline"
                  size="sm"
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getEventTypeIcon(selectedEvent.type)}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedEvent.campaignName}</h3>
                    <p className="text-sm text-gray-600">
                      {getEventTypeLabel(selectedEvent.type)} - {selectedEvent.studentName}
                    </p>
                  </div>
                </div>
                <Button onClick={() => setShowDetailModal(false)} variant="ghost" size="sm" className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Status Banner */}
              {getResultStatusInfo(selectedEvent.resultStatus).shouldDisplay && (
                <div className={`p-4 rounded-lg mb-6 ${getResultStatusInfo(selectedEvent.resultStatus).color}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getResultStatusInfo(selectedEvent.resultStatus).icon}
                      <span className="font-medium">
                        Trạng thái: {getResultStatusInfo(selectedEvent.resultStatus).label}
                      </span>
                    </div>
                    <span className="text-sm">{getResultStatusInfo(selectedEvent.resultStatus).description}</span>
                  </div>
                </div>
              )}

              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chi tiết</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Tên chiến dịch</p>
                        <p className="font-medium">{selectedEvent.campaignName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Loại sự kiện</p>
                        <p className="font-medium">{getEventTypeLabel(selectedEvent.type)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                        <p className="font-medium">{formatDate(selectedEvent.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày kết thúc</p>
                        <p className="font-medium">{formatDate(selectedEvent.endDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Địa điểm</p>
                        <p className="font-medium">{formatValue(selectedEvent.location)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Học sinh</p>
                        <p className="font-medium">{selectedEvent.studentName}</p>
                      </div>
                      {/* <div>
                        <p className="text-sm text-gray-500">Thiết bị yêu cầu</p>
                        <p className="font-medium">{formatValue(selectedEvent.requirementEquipment)}</p>
                      </div> */}
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái hoàn thành</p>
                        <p className="font-medium">{selectedEvent.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedEvent.description && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.consentStatusText && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đồng ý</h4>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">{selectedEvent.consentStatusText}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <Button onClick={() => setShowDetailModal(false)} variant="outline">
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentEvents
