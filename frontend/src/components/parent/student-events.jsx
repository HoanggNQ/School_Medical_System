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
  FileText,
  X,
  Search,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ParentService from "../../api/services/parent.service"

const StudentEvents = ({ selectedStudent }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [updatingParticipation, setUpdatingParticipation] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

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

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return timeString
    }
  }

  const getEventTypeColor = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case "vaccination":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
      case "health-check":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      case "medical-exam":
        return "bg-purple-50 border-purple-200 hover:bg-purple-100"
      case "consultation":
        return "bg-orange-50 border-orange-200 hover:bg-orange-100"
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  const getEventTypeIcon = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case "vaccination":
        return <Syringe className="w-5 h-5 text-blue-600" />
      case "health-check":
        return <Stethoscope className="w-5 h-5 text-green-600" />
      case "medical-exam":
        return <FileText className="w-5 h-5 text-purple-600" />
      case "consultation":
        return <User className="w-5 h-5 text-orange-600" />
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />
    }
  }

  const getEventTypeLabel = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case "vaccination":
        return "Tiêm vắc-xin"
      case "health-check":
        return "Kiểm tra sức khỏe"
      case "medical-exam":
        return "Khám sức khỏe"
      case "consultation":
        return "Tư vấn y tế"
      default:
        return "Sự kiện y tế"
    }
  }

  const getParticipationColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200"
      case "declined":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getParticipationIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "declined":
        return <XCircle className="w-4 h-4" />
      case "pending":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getParticipationLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "Đã chấp nhận"
      case "declined":
        return "Đã từ chối"
      case "pending":
        return "Chờ phản hồi"
      default:
        return "Chưa phản hồi"
    }
  }

  const getHealthCheckStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "done":
        return {
          label: "Đã hoàn thành",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-4 h-4" />,
        }
      case "pending":
        return {
          label: "Chờ thực hiện",
          color: "bg-yellow-100 text-yellow-800",
          icon: <AlertCircle className="w-4 h-4" />,
        }
      case "cancelled":
        return { label: "Đã hủy", color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" /> }
      default:
        return { label: "Chưa xác định", color: "bg-gray-100 text-gray-800", icon: <AlertCircle className="w-4 h-4" /> }
    }
  }

  // Filter events based on search term, status, and type
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || event.status?.toLowerCase() === filterStatus
    const matchesType = filterType === "all" || event.eventType?.toLowerCase() === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedStudent?.id) return

      try {
        setLoading(true)
        const healthCheckRes = await ParentService.getStudentHealthCheckEvent(localStorage.getItem("user").id)
        console.log("Fetched health check events:", healthCheckRes.data)
        setEvents(healthCheckRes.data || [])
      } catch (error) {
        console.error("Error fetching student events:", error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [selectedStudent?.id])

  const handleViewDetail = (event) => {
    setSelectedEvent(event)
    setShowDetailModal(true)
  }

  const handleParticipationResponse = async (eventId, response) => {
    try {
      setUpdatingParticipation(true)
      await ParentService.updateEventParticipation(eventId, selectedStudent.id, response)

      setEvents(events.map((event) => (event.id === eventId ? { ...event, participationStatus: response } : event)))

      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent({ ...selectedEvent, participationStatus: response })
      }

      alert(`Đã ${response === "accepted" ? "chấp nhận" : "từ chối"} tham gia sự kiện!`)
    } catch (error) {
      console.error("Error updating participation:", error)
      alert("Có lỗi xảy ra khi cập nhật phản hồi")
    } finally {
      setUpdatingParticipation(false)
    }
  }

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
              <h2 className="text-2xl font-bold">Sự kiện Khám sức khỏe</h2>
              <p className="text-purple-100">
                Theo dõi lịch trình khám sức khỏe của {formatValue(selectedStudent?.user?.fullName)}
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
                  placeholder="Tìm kiếm sự kiện khám sức khỏe..."
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
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ thực hiện</option>
                <option value="done">Đã hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="health-check">Khám tổng quát</option>
                <option value="vaccination">Tiêm vaccine</option>
                <option value="dental">Khám răng miệng</option>
                <option value="vision">Khám mắt</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Tìm thấy {filteredEvents.length} sự kiện</span>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                Hoàn thành: {filteredEvents.filter((e) => e.status === "DONE").length}
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                <AlertCircle className="w-3 h-3 mr-1" />
                Chờ thực hiện: {filteredEvents.filter((e) => e.status === "PENDING").length}
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
                  : "Chưa có sự kiện khám sức khỏe nào"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all" || filterType !== "all"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Sự kiện khám sức khỏe sẽ được cập nhật khi có lịch hẹn từ nhà trường"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event, index) => {
            const statusInfo = getHealthCheckStatus(event.status)
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className={`transition-all duration-200 ${getEventTypeColor("health-check")} hover:shadow-lg`}>
                  <CardContent className="p-6">
                    {/* Event Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Stethoscope className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-1">{event.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              Khám sức khỏe
                            </Badge>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-600">Lớp {event.targetGrade}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={statusInfo.color}>
                        <div className="flex items-center space-x-1">
                          {statusInfo.icon}
                          <span>{statusInfo.label}</span>
                        </div>
                      </Badge>
                    </div>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Ngày khám</p>
                          <p className="font-medium text-gray-900">{formatDate(event.checkDate)}</p>
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
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Chuẩn bị</p>
                          <p
                            className="font-medium text-gray-900 truncate"
                            title={formatValue(event.requiredEquipment)}
                          >
                            {formatValue(event.requiredEquipment)}
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

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center pt-4 border-t border-white border-opacity-50">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Tạo: {formatDate(event.createdAt)}</span>
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

                        {event.status === "PENDING" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Đăng ký
                          </Button>
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

      {/* Detail Modal - Enhanced */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Stethoscope className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedEvent.name}</h3>
                    <p className="text-sm text-gray-600">Sự kiện khám sức khỏe - Lớp {selectedEvent.targetGrade}</p>
                  </div>
                </div>
                <Button onClick={() => setShowDetailModal(false)} variant="ghost" size="sm" className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg mb-6 ${getHealthCheckStatus(selectedEvent.status).color}`}>
                <div className="flex items-center space-x-2">
                  {getHealthCheckStatus(selectedEvent.status).icon}
                  <span className="font-medium">Trạng thái: {getHealthCheckStatus(selectedEvent.status).label}</span>
                </div>
              </div>

              {/* Event Details Sections */}
              <div className="space-y-6">
                {/* Thông tin cơ bản */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                    Thông tin cơ bản
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Thời gian & Địa điểm
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Ngày khám</p>
                          <p className="font-medium">{formatDate(selectedEvent.checkDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Địa điểm</p>
                          <p className="font-medium">{formatValue(selectedEvent.location)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Đối tượng</p>
                          <p className="font-medium">Học sinh lớp {selectedEvent.targetGrade}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Thông tin bổ sung
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Mã sự kiện</p>
                          <p className="font-medium">#{selectedEvent.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Ngày tạo</p>
                          <p className="font-medium">{formatDate(selectedEvent.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Người tạo</p>
                          <p className="font-medium">ID: {selectedEvent.createdById}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Chi tiết khám */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2 text-green-600" />
                    Chi tiết khám
                  </h4>
                  <div className="space-y-4">
                    {selectedEvent.description && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm font-medium text-gray-600">Mô tả chi tiết</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                              {selectedEvent.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-600">Nội dung khám</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h6 className="font-medium text-blue-900 mb-2">Khám tổng quát</h6>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Đo chiều cao, cân nặng</li>
                              <li>• Kiểm tra huyết áp</li>
                              <li>• Khám tim phổi</li>
                              <li>• Khám bụng</li>
                            </ul>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h6 className="font-medium text-green-900 mb-2">Khám chuyên khoa</h6>
                            <ul className="text-sm text-green-800 space-y-1">
                              <li>• Khám mắt, đo thị lực</li>
                              <li>• Khám tai mũi họng</li>
                              <li>• Khám răng miệng</li>
                              <li>• Khám da liễu</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Chuẩn bị */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-orange-600" />
                    Chuẩn bị
                  </h4>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-600">Chuẩn bị trước khi khám</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                          <p className="text-sm text-yellow-800 mb-3 font-medium">Vật dụng cần mang theo:</p>
                          <p className="text-sm text-yellow-800">{formatValue(selectedEvent.requiredEquipment)}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-gray-600">Lưu ý quan trọng</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>Lưu ý:</strong> Học sinh cần có mặt đúng giờ và mang đầy đủ giấy tờ cần thiết
                            </p>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Khuyến nghị:</strong> Nghỉ ngơi đầy đủ trước ngày khám và ăn sáng nhẹ
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
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
