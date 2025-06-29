"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, MapPin, User, FileText, CheckCircle, AlertCircle, XCircle, Plus } from "lucide-react"
import ParentService from "../../api/services/parent.service"

const ParentSchedule = () => {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "upcoming":
        return <Clock className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "Đã hoàn thành"
      case "upcoming":
        return "Sắp tới"
      case "cancelled":
        return "Đã hủy"
      case "in-progress":
        return "Đang diễn ra"
      default:
        return "Chưa xác định"
    }
  }

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "meeting":
        return "bg-blue-50 border-blue-200"
      case "appointment":
        return "bg-green-50 border-green-200"
      case "consultation":
        return "bg-purple-50 border-purple-200"
      case "event":
        return "bg-orange-50 border-orange-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "meeting":
        return <User className="w-5 h-5 text-blue-500" />
      case "appointment":
        return <Calendar className="w-5 h-5 text-green-500" />
      case "consultation":
        return <FileText className="w-5 h-5 text-purple-500" />
      case "event":
        return <MapPin className="w-5 h-5 text-orange-500" />
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />
    }
  }

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true)
        const response = await ParentService.getParentSchedule()
        console.log("Fetched parent schedules:", response.data)
        setSchedules(response.data || [])
      } catch (error) {
        console.error("Error fetching parent schedules:", error)
        setSchedules([])
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-gray-600">Đang tải lịch trình...</span>
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
            Lịch trình của tôi
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{schedules.length} lịch trình</span>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Thêm lịch trình</span>
            </button>
          </div>
        </div>

        {schedules.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có lịch trình nào</p>
            <p className="text-sm text-gray-400 mt-1">Thêm lịch trình đầu tiên để quản lý thời gian hiệu quả</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`border-2 rounded-lg p-6 hover:shadow-md transition-shadow ${getTypeColor(schedule.type)}`}
              >
                {/* Schedule Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getTypeIcon(schedule.type)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{schedule.title}</h4>
                      <p className="text-sm text-gray-600 capitalize">{schedule.type}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(schedule.status)}`}
                  >
                    {getStatusIcon(schedule.status)}
                    <span>{getStatusLabel(schedule.status)}</span>
                  </span>
                </div>

                {/* Schedule Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600">Ngày:</span>
                      <span className="ml-2 font-medium">{formatDate(schedule.date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-sm text-gray-600">Thời gian:</span>
                      <span className="ml-2 font-medium">{formatTime(schedule.time)}</span>
                    </div>
                  </div>

                  {schedule.location && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Địa điểm:</span>
                        <span className="ml-2 font-medium">{formatValue(schedule.location)}</span>
                      </div>
                    </div>
                  )}

                  {schedule.organizer && (
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <span className="text-sm text-gray-600">Người tổ chức:</span>
                        <span className="ml-2 font-medium">{formatValue(schedule.organizer)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {schedule.description && (
                  <div className="bg-white bg-opacity-50 p-3 rounded-lg mb-4">
                    <h6 className="font-medium text-gray-800 mb-1">Mô tả:</h6>
                    <p className="text-sm text-gray-700">{schedule.description}</p>
                  </div>
                )}

                {/* Notes */}
                {schedule.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <h6 className="font-medium text-yellow-800 mb-1 flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      Ghi chú:
                    </h6>
                    <p className="text-sm text-yellow-700">{schedule.notes}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ParentSchedule
