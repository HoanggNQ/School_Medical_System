"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import ParentService from "../../api/services/parent.service"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast" // Import toast

const ParentSchedule = () => {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedScheduleForAction, setSelectedScheduleForAction] = useState(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

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
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "COMPLETED":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return <ThumbsUp className="w-4 h-4" />
      case "rejected":
        return <ThumbsDown className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in_progress":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "Đã đồng ý"
      case "REJECTED":
        return "Đã từ chối"
      case "COMPLETED":
        return "Đã hoàn thành"
      case "PENDING":
        return "Chờ xử lý"
      case "IN_PROGRESS":
        return "Đang xử lý"
      default:
        return "Chưa xác định"
    }
  }

  // Get user info from localStorage
  const getUserFromStorage = () => {
    try {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        return user
      }
      return null
    } catch (error) {
      console.error("Error parsing user from localStorage:", error)
      return null
    }
  }

  // Fetch schedules using user ID from localStorage
  const fetchSchedules = async () => {
    try {
      setLoading(true)

      // Get user info from localStorage
      const user = getUserFromStorage()
      if (!user || !user.id) {
        console.error("No user found in localStorage or user ID missing")
        setSchedules([])
        return
      }

      setUserInfo(user)
      console.log("User from localStorage:", user)

      // Fetch schedules using user ID
      const response = await ParentService.getParentSchedule(user.id)
      const schedulesData = response.data || []

      console.log("Fetched schedules for user ID:", user.id, schedulesData)
      setSchedules(schedulesData)
    } catch (error) {
      console.error("Error fetching schedules:", error)
      setSchedules([])
      toast({
        title: "Lỗi tải lịch trình",
        description: "Không thể tải lịch trình của bạn. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [])

  // Sort schedules by date (newest first)
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dateA = new Date(a.scheduleTime)
    const dateB = new Date(b.scheduleTime)
    return dateB - dateA
  })

  const handleApprove = async (scheduleId) => {
    setIsUpdatingStatus(true)
    try {
      await ParentService.updateConsultationStatus(scheduleId, "APPROVED")
      toast({
        title: "Thành công",
        description: "Lịch hẹn đã được đồng ý.",
        variant: "success",
      })
      fetchSchedules() // Re-fetch schedules to update status
    } catch (error) {
      console.error("Error approving schedule:", error)
      toast({
        title: "Lỗi",
        description: "Không thể đồng ý lịch hẹn. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleRejectClick = (schedule) => {
    setSelectedScheduleForAction(schedule)
    setRejectionReason("") // Clear previous reason
    setShowRejectModal(true)
  }

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Thiếu lý do",
        description: "Vui lòng nhập lý do từ chối.",
        variant: "destructive",
      })
      return
    }

    setIsUpdatingStatus(true)
    try {
      await ParentService.updateConsultationStatus(selectedScheduleForAction.id, "REJECTED", rejectionReason)
      toast({
        title: "Thành công",
        description: "Lịch hẹn đã được từ chối.",
        variant: "success",
      })
      setShowRejectModal(false)
      setSelectedScheduleForAction(null)
      setRejectionReason("")
      fetchSchedules() // Re-fetch schedules to update status
    } catch (error) {
      console.error("Error rejecting schedule:", error)
      toast({
        title: "Lỗi",
        description: "Không thể từ chối lịch hẹn. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

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
              <p className="text-purple-100">Quản lý lịch hẹn và cuộc hẹn y tế của {userInfo?.fullName || "bạn"}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{schedules.length}</div>
            <div className="text-sm text-purple-100">Tổng lịch trình</div>
          </div>
        </div>
      </div>

      {/* Schedules List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-purple-500" />
            Lịch trình của bạn
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
                Đã đồng ý: {sortedSchedules.filter((s) => s.status === "APPROVED").length}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                Đã từ chối: {sortedSchedules.filter((s) => s.status === "REJECTED").length}
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Hoàn thành: {sortedSchedules.filter((s) => s.status === "COMPLETED").length}
              </span>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Đang xử lý: {sortedSchedules.filter((s) => s.status === "IN_PROGRESS").length}
              </span>
            </div>
          </div>
        </div>

        {sortedSchedules.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch trình nào</h4>
            <p className="text-gray-500">Lịch trình sẽ được cập nhật khi có thông báo từ nhà trường</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSchedules.map((schedule, index) => {
              const { date, time } = formatDateTime(schedule.scheduleTime)
              const isPending = schedule.status === "PENDING"
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
                        <h4 className="text-lg font-semibold text-gray-900">Lịch hẹn y tế</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          {schedule.studentName && (
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

                    {schedule.studentId && (
                      <div className="flex items-center space-x-3 md:col-span-2">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Tên học sinh</p>
                          <p className="font-medium text-gray-900">{schedule.studentName}</p>
                        </div>
                      </div>
                    )}
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
                      <p className="text-sm text-yellow-700">Lịch hẹn đang chờ xử lý. Vui lòng phản hồi để xác nhận.</p>
                    </div>
                  )}

                  {schedule.status === "COMPLETED" && (
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                      <h6 className="font-medium text-blue-800 mb-1 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Hoàn thành:
                      </h6>
                      <p className="text-sm text-blue-700">
                        Lịch hẹn đã được hoàn thành. Kết quả có thể xem trong phần kết quả khám sức khỏe.
                      </p>
                    </div>
                  )}

                  {schedule.status === "IN_PROGRESS" && (
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded-lg">
                      <h6 className="font-medium text-purple-800 mb-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Đang xử lý:
                      </h6>
                      <p className="text-sm text-purple-700">
                        Lịch hẹn đang được xử lý. Vui lòng chờ thông báo kết quả.
                      </p>
                    </div>
                  )}

                  {schedule.status === "APPROVED" && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <h6 className="font-medium text-green-800 mb-1 flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        Đã đồng ý:
                      </h6>
                      <p className="text-sm text-green-700">Bạn đã đồng ý tham gia lịch hẹn này.</p>
                    </div>
                  )}

                  {schedule.status === "REJECTED" && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <h6 className="font-medium text-red-800 mb-1 flex items-center">
                        <ThumbsDown className="w-4 h-4 mr-1" />
                        Đã từ chối:
                      </h6>
                      <p className="text-sm text-red-700">
                        Bạn đã từ chối lịch hẹn này. Lý do: {formatValue(schedule.note)}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {isPending && (
                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => handleApprove(schedule.id)}
                        disabled={isUpdatingStatus}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {isUpdatingStatus ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <ThumbsUp className="w-4 h-4 mr-2" />
                        )}
                        Đồng ý
                      </Button>
                      <Button
                        onClick={() => handleRejectClick(schedule)}
                        disabled={isUpdatingStatus}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {isUpdatingStatus ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                        ) : (
                          <ThumbsDown className="w-4 h-4 mr-2" />
                        )}
                        Từ chối
                      </Button>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Từ chối lịch hẹn</DialogTitle>
            <DialogDescription>Vui lòng nhập lý do bạn muốn từ chối lịch hẹn này.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Lý do từ chối..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)} disabled={isUpdatingStatus}>
              Hủy
            </Button>
            <Button onClick={confirmReject} disabled={isUpdatingStatus || !rejectionReason.trim()}>
              {isUpdatingStatus ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <ThumbsDown className="w-4 h-4 mr-2" />
              )}
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ParentSchedule
