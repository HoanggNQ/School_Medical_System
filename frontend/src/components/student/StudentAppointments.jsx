"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import {
  Calendar,
  MapPin,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Heart,
  Syringe,
  FileText,
  Activity,
  ChevronRight,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import studentService from "../../api/services/student.service"

const StudentAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [filterType, setFilterType] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState("ALL")

  useEffect(() => {
    const fetchStudentSchedule = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem("currentUser"))
        setCurrentUser(user)

        if (!user?.id) {
          throw new Error("Không tìm thấy thông tin người dùng")
        }

        const response = await studentService.getStudentSchedule(user.id, currentPage, pageSize)
        console.log("Student Schedule:", response)

        if (response && response.data) {
          setAppointments(response.data.content || response.data)
          setTotalPages(response.data.totalPages || 1)
        } else {
          setAppointments([])
        }
      } catch (error) {
        console.error("Error fetching student schedule:", error)
        setError("Không thể tải lịch hẹn")
        toast({
          title: "Lỗi tải dữ liệu",
          description: error.message,
          variant: "destructive",
        })
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchStudentSchedule()
  }, [currentPage, pageSize])

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
      return dateString
    }
  }

  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return "N/A"
    if (!endDate) return formatDate(startDate)
    if (!startDate) return formatDate(endDate)

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate)
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  const getEventIcon = (type) => {
    switch (type) {
      case "HEALTH_CHECK":
        return <Heart className="w-6 h-6 text-blue-600" />
      case "VACCINATION":
        return <Syringe className="w-6 h-6 text-green-600" />
      default:
        return <Activity className="w-6 h-6 text-gray-600" />
    }
  }

  const getEventColor = (type) => {
    switch (type) {
      case "HEALTH_CHECK":
        return "bg-blue-50 border-blue-200 hover:bg-blue-100"
      case "VACCINATION":
        return "bg-green-50 border-green-200 hover:bg-green-100"
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  const getEventTypeName = (type) => {
    switch (type) {
      case "HEALTH_CHECK":
        return "Khám sức khỏe"
      case "VACCINATION":
        return "Tiêm chủng"
      default:
        return "Sự kiện khác"
    }
  }

  const getConsentStatusBadge = (status, statusText) => {
    switch (status) {
      case "DONE":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            {statusText || "Đã có consent"}
          </Badge>
        )
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            {statusText || "Chờ xử lý"}
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <XCircle className="w-3 h-3 mr-1" />
            {statusText || "Chưa có consent"}
          </Badge>
        )
    }
  }

  const getResultStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Đã hoàn thành
          </Badge>
        )
      case "PENDING":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Đang chờ
          </Badge>
        )
      case "NO_CONSENT":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Chưa có consent
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Chưa xác định
          </Badge>
        )
    }
  }

  const getFilteredAppointments = () => {
    let filtered = appointments

    if (filterType !== "ALL") {
      filtered = filtered.filter((appointment) => appointment.type === filterType)
    }

    if (filterStatus !== "ALL") {
      filtered = filtered.filter((appointment) => appointment.resultStatus === filterStatus)
    }

    return filtered
  }

  const getUpcomingCount = () => {
    const now = new Date()
    return appointments.filter((appointment) => {
      const startDate = new Date(appointment.startDate)
      return startDate > now
    }).length
  }

  const getCompletedCount = () => {
    return appointments.filter((appointment) => appointment.resultStatus === "COMPLETED").length
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Đang tải lịch hẹn...</span>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </motion.div>
    )
  }

  const filteredAppointments = getFilteredAppointments()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Lịch hẹn của tôi</h2>
              <p className="text-blue-100">Theo dõi các sự kiện y tế của {currentUser?.fullName}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{appointments.length}</div>
            <div className="text-sm text-blue-100">Tổng sự kiện</div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sắp tới</p>
                <p className="text-2xl font-bold text-blue-600">{getUpcomingCount()}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">{getCompletedCount()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng cộng</p>
                <p className="text-2xl font-bold text-purple-600">{appointments.length}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Loại sự kiện</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="HEALTH_CHECK">Khám sức khỏe</SelectItem>
                  <SelectItem value="VACCINATION">Tiêm chủng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Trạng thái</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả</SelectItem>
                  <SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
                  <SelectItem value="PENDING">Đang chờ</SelectItem>
                  <SelectItem value="NO_CONSENT">Chưa có consent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Danh sách lịch hẹn
            </span>
            <span className="text-sm font-normal text-gray-600">{filteredAppointments.length} kết quả</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn</h4>
              <p className="text-gray-500">
                {appointments.length === 0
                  ? "Bạn chưa có lịch hẹn nào được lên lịch"
                  : "Không có lịch hẹn nào phù hợp với bộ lọc hiện tại"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppointments.map((appointment, index) => (
                <motion.div
                  key={`${appointment.campaignId}-${appointment.consentId || index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`border-2 rounded-lg p-6 hover:shadow-md transition-all duration-200 ${getEventColor(appointment.type)}`}
                >
                  {/* Appointment Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getEventIcon(appointment.type)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{appointment.campaignName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{getEventTypeName(appointment.type)}</span>
                          <span>•</span>
                          <span>Chiến dịch #{appointment.campaignId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      {getConsentStatusBadge(appointment.consentStatus, appointment.consentStatusText)}
                      {getResultStatusBadge(appointment.resultStatus)}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Thời gian</p>
                        <p className="font-medium text-gray-900">
                          {formatDateRange(appointment.startDate, appointment.endDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Địa điểm</p>
                        <p className="font-medium text-gray-900">{appointment.location || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Học sinh</p>
                        <p className="font-medium text-gray-900">{appointment.studentName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Consent Information */}
                  {appointment.consentId && (
                    <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">Consent ID:</span>
                          <span className="text-sm text-gray-900">#{appointment.consentId}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            Trang trước
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Trang {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Trang sau
          </Button>
        </div>
      )}
    </motion.div>
  )
}

export default StudentAppointments
