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
  Phone,
  FileText,
  X,
} from "lucide-react"
import ParentService from "../../api/services/parent.service"

const StudentEvents = ({ selectedStudent }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [updatingParticipation, setUpdatingParticipation] = useState(false)

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
        return "bg-blue-50 border-blue-200"
      case "health-check":
        return "bg-green-50 border-green-200"
      case "medical-exam":
        return "bg-purple-50 border-purple-200"
      case "consultation":
        return "bg-orange-50 border-orange-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getEventTypeIcon = (eventType) => {
    switch (eventType?.toLowerCase()) {
      case "vaccination":
        return <Syringe className="w-5 h-5 text-blue-500" />
      case "health-check":
        return <Stethoscope className="w-5 h-5 text-green-500" />
      case "medical-exam":
        return <FileText className="w-5 h-5 text-purple-500" />
      case "consultation":
        return <User className="w-5 h-5 text-orange-500" />
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />
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
        return "Sự kiện"
    }
  }

  const getParticipationColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800"
      case "declined":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
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

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedStudent?.id) return

      try {
        setLoading(true)
        const response = await ParentService.getStudentEvents(selectedStudent.id)
        console.log("Fetched student events:", response.data)
        setEvents(response.data || [])
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

      // Update local state
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
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-gray-600">Đang tải sự kiện...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-purple-500" />
            Sự kiện của {formatValue(selectedStudent.user?.fullName)}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{events.length} sự kiện</span>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có sự kiện nào</p>
            <p className="text-sm text-gray-400 mt-1">Sự kiện sẽ được cập nhật khi có thông báo từ nhà trường</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`border-2 rounded-lg p-6 hover:shadow-md transition-shadow ${getEventTypeColor(event.eventType)}`}
              >
                {/* Event Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getEventTypeIcon(event.eventType)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-600">{getEventTypeLabel(event.eventType)}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getParticipationColor(event.participationStatus)}`}
                  >
                    {getParticipationIcon(event.participationStatus)}
                    <span>{getParticipationLabel(event.participationStatus)}</span>
                  </span>
                </div>

                {/* Event Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600">Ngày:</span>
                      <span className="ml-2 font-medium">{formatDate(event.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600">Thời gian:</span>
                      <span className="ml-2 font-medium">{formatTime(event.time)}</span>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center space-x-3 md:col-span-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Địa điểm:</span>
                        <span className="ml-2 font-medium">{formatValue(event.location)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Short Description */}
                {event.description && (
                  <div className="bg-white bg-opacity-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">
                      {event.description.length > 150 ? `${event.description.substring(0, 150)}...` : event.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewDetail(event)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem chi tiết</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  {getEventTypeIcon(selectedEvent.eventType)}
                  <span className="ml-2">{selectedEvent.title}</span>
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Event Details */}
              <div className="space-y-6">
                {/* Status and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Thông tin cơ bản</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>Ngày: {formatDate(selectedEvent.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>Thời gian: {formatTime(selectedEvent.time)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>Địa điểm: {formatValue(selectedEvent.location)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Trạng thái tham gia</h5>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium items-center space-x-1 ${getParticipationColor(selectedEvent.participationStatus)}`}
                      >
                        {getParticipationIcon(selectedEvent.participationStatus)}
                        <span>{getParticipationLabel(selectedEvent.participationStatus)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {selectedEvent.organizer && (
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Người tổ chức</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>{formatValue(selectedEvent.organizer)}</span>
                          </div>
                          {selectedEvent.organizerPhone && (
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{formatValue(selectedEvent.organizerPhone)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedEvent.requirements && (
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Yêu cầu chuẩn bị</h5>
                        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                          <p className="text-sm text-yellow-800">{selectedEvent.requirements}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Description */}
                {selectedEvent.description && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Mô tả chi tiết</h5>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-line">{selectedEvent.description}</p>
                    </div>
                  </div>
                )}

                {/* Additional Details */}
                {selectedEvent.details && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Thông tin bổ sung</h5>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800 whitespace-pre-line">{selectedEvent.details}</p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedEvent.notes && (
                  <div>
                    <h5 className="font-medium text-gray-800 mb-2">Ghi chú</h5>
                    <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
                      <p className="text-sm text-orange-800">{selectedEvent.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {selectedEvent.requiresConsent && selectedEvent.participationStatus === "pending" && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h5 className="font-medium text-gray-800 mb-4">Phản hồi tham gia</h5>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleParticipationResponse(selectedEvent.id, "accepted")}
                      disabled={updatingParticipation}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {updatingParticipation ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                      <span>Chấp nhận tham gia</span>
                    </button>
                    <button
                      onClick={() => handleParticipationResponse(selectedEvent.id, "declined")}
                      disabled={updatingParticipation}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    >
                      {updatingParticipation ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span>Từ chối tham gia</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentEvents
