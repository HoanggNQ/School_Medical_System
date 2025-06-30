"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle, XCircle, Users } from "lucide-react"
import ParentService from "../../api/services/parent.service"

const ParentSchedule = () => {
  const [allSchedules, setAllSchedules] = useState([]) // Store all schedules
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAllStudents, setShowAllStudents] = useState(true)

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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return { date: "N/A", time: "N/A" }
    try {
      const dateTime = new Date(dateTimeString)
      const date = dateTime.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const time = dateTime.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
      return { date, time }
    } catch {
      return { date: "N/A", time: "N/A" }
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "CANCELLED":
        return "bg-red-100 text-red-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      case "in_progress":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "Đã hoàn thành"
      case "PENDING":
        return "Chờ xử lý"
      case "CANCELLED":
        return "Đã hủy"
      case "IN_PROGRESS":
        return "Đang xử lý"
      default:
        return "Chưa xác định"
    }
  }

  const getInitials = (name) => {
    if (!name) return "N/A"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Fetch students và schedules một lần duy nhất
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch students first
        const studentRes = await ParentService.getStudent()
        const studentsData = studentRes.data || []
        setStudents(studentsData)
        console.log("Fetched students:", studentsData)

        if (studentsData.length > 0) {
          // Fetch schedules for all students at once
          const studentIds = studentsData.map((student) => student.id)
          const response = await ParentService.getParentSchedule(studentIds)
          const schedulesData = response.data || []

          // Enrich schedules with student names for better display
          const enrichedSchedules = schedulesData.map((schedule) => {
            const student = studentsData.find((s) => s.id === schedule.studentId)
            return {
              ...schedule,
              studentName: student?.user?.fullName || `Student ID: ${schedule.studentId}`,
            }
          })

          setAllSchedules(enrichedSchedules)
          console.log("Fetched all schedules:", enrichedSchedules)

          // Set first student as default selection
          setSelectedStudent(studentsData[0])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setAllSchedules([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle student selection - no API call needed
  const handleStudentChange = (student) => {
    setSelectedStudent(student)
    setShowAllStudents(false)
  }

  const handleShowAllStudents = () => {
    setShowAllStudents(true)
    setSelectedStudent(null)
  }

  // Filter schedules based on selected student - client side filtering
  const filteredSchedules = showAllStudents
    ? allSchedules
    : allSchedules.filter((schedule) => schedule.studentId === selectedStudent?.id)

  // Sort schedules by date (newest first)
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    const dateA = new Date(a.scheduleTime)
    const dateB = new Date(b.scheduleTime)
    return dateB - dateA
  })

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
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Lịch trình cá nhân</h2>
              <p className="text-purple-100">Quản lý lịch hẹn và cuộc hẹn y tế của con em</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{allSchedules.length}</div>
            <div className="text-sm text-purple-100">Tổng lịch trình</div>
          </div>
        </div>
      </div>

      {/* Student Selection */}
      {students.length > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-500" />
            Lọc theo học sinh
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShowAllStudents}
              className={`px-4 py-3 rounded-lg border-2 transition-all ${
                showAllStudents
                  ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md"
                  : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="font-medium">Tất cả học sinh</span>
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  {allSchedules.length}
                </span>
              </div>
            </button>
            {students.map((student) => {
              const studentScheduleCount = allSchedules.filter((s) => s.studentId === student.id).length
              return (
                <button
                  key={student.id}
                  onClick={() => handleStudentChange(student)}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    !showAllStudents && selectedStudent?.id === student.id
                      ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md"
                      : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(student.user?.fullName)}
                    </div>
                    <span className="font-medium">{formatValue(student.user?.fullName)}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {studentScheduleCount}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-purple-500" />
            Lịch trình {showAllStudents ? "tất cả học sinh" : `của ${formatValue(selectedStudent?.user?.fullName)}`}
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{sortedSchedules.length} lịch trình</span>
            </div>
            {/* Status Summary */}
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Chờ: {sortedSchedules.filter((s) => s.status === "PENDING").length}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Hoàn thành: {sortedSchedules.filter((s) => s.status === "COMPLETED").length}
              </span>
            </div>
          </div>
        </div>

        {sortedSchedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              {showAllStudents
                ? "Chưa có lịch trình nào"
                : `Chưa có lịch trình nào cho ${formatValue(selectedStudent?.user?.fullName)}`}
            </h4>
            <p className="text-gray-500">Lịch trình sẽ được cập nhật khi có thông báo từ nhà trường</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSchedules.map((schedule, index) => {
              const { date, time } = formatDateTime(schedule.scheduleTime)
              return (
                <motion.div
                  key={schedule.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 * index }}
                  className="border-2 rounded-lg p-6 hover:shadow-md transition-all duration-200 bg-orange-50 border-orange-200 hover:bg-orange-100"
                >
                  {/* Schedule Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <FileText className="w-6 h-6 text-orange-500" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Lịch hẹn y tế #{schedule.id}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Kết quả ID: {schedule.resultId}</span>
                          {schedule.studentName && showAllStudents && (
                            <>
                              <span>•</span>
                              <span className="font-medium text-purple-600">{schedule.studentName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(schedule.status)}`}
                    >
                      {getStatusIcon(schedule.status)}
                      <span>{getStatusLabel(schedule.status)}</span>
                    </span>
                  </div>

                  {/* Student Info (if showing all students) */}
                  {showAllStudents && schedule.studentName && (
                    <div className="bg-white bg-opacity-60 p-3 rounded-lg mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Học sinh:</span>
                        <span className="text-sm text-gray-900 font-semibold">{schedule.studentName}</span>
                      </div>
                    </div>
                  )}

                  {/* Schedule Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Ngày hẹn</p>
                        <p className="font-medium text-gray-900">{date}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Thời gian</p>
                        <p className="font-medium text-gray-900">{time}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 md:col-span-2">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">ID kết quả</p>
                        <p className="font-medium text-gray-900">#{schedule.resultId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg mb-4">
                    <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Lý do hẹn:
                    </h6>
                    <p className="text-sm text-gray-700 leading-relaxed">{schedule.reason}</p>
                  </div>

                  {/* Status Info */}
                  {schedule.status === "PENDING" && (
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <h6 className="font-medium text-yellow-800 mb-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Lưu ý:
                      </h6>
                      <p className="text-sm text-yellow-700">
                        Lịch hẹn đang chờ xử lý. Vui lòng theo dõi thông báo từ nhà trường.
                      </p>
                    </div>
                  )}

                  {schedule.status === "COMPLETED" && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <h6 className="font-medium text-green-800 mb-1 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Hoàn thành:
                      </h6>
                      <p className="text-sm text-green-700">
                        Lịch hẹn đã được hoàn thành. Kết quả có thể xem trong phần kết quả khám sức khỏe.
                      </p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ParentSchedule
