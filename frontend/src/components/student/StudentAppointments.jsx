"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Calendar, MapPin, Clock, AlertCircle, Heart, Syringe, FileText, Activity, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import studentService from "../../api/services/student.service"

const StudentAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [filterType, setFilterType] = useState("ALL")

  useEffect(() => {
    const fetchStudentSchedule = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem("currentUser"))
        setCurrentUser(user)

        if (!user?.id) {
          throw new Error("Không tìm thấy thông tin người dùng")
        }

        const response = await studentService.getStudentSchedule(user.id)
        console.log("Student Schedule API Response:", response) // Log the full response

        if (response && response.data) {
          const fetchedData = response.data // Access the 'data' key
          console.log("Fetched appointments data:", fetchedData) // Log the fetched data
          if (Array.isArray(fetchedData)) {
            // Ensure it's an array
            setAppointments(fetchedData)
            console.log("Appointments state set to:", fetchedData) // Log after setting state
          } else {
            console.warn("API response data.data is not an array:", fetchedData)
            setAppointments([])
          }
        } else {
          setAppointments([])
          console.log("Appointments set to empty array due to no response data.")
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
  }, [])

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

  const getFilteredAppointments = () => {
    let filtered = appointments

    if (filterType !== "ALL") {
      filtered = filtered.filter((appointment) => appointment.eventType === filterType)
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

  // Log state before rendering
  const filteredAppointments = getFilteredAppointments()
  console.log("Appointments state at render:", appointments)
  console.log("Filter type at render:", filterType)
  console.log("Filtered appointments length at render:", filteredAppointments.length)

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  key={`${appointment.campaignId}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`border-2 rounded-lg p-6 hover:shadow-md transition-all duration-200 ${getEventColor(appointment.eventType)}`}
                >
                  {/* Appointment Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getEventIcon(appointment.eventType)}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{appointment.campaignName}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{getEventTypeName(appointment.eventType)}</span>
                          <span>•</span>
                          <span>Chiến dịch #{appointment.campaignId}</span>
                        </div>
                      </div>
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
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Năm học</p>
                        <p className="font-medium text-gray-900">{appointment.academicYear || "N/A"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Mô tả</p>
                        <p className="font-medium text-gray-900">{appointment.description || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default StudentAppointments
