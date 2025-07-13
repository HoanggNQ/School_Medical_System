"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  BellRing,
  Check,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Search,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ParentService from "../../api/services/parent.service"

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedNotifications, setSelectedNotifications] = useState([]) // This state is not used, can be removed if not needed
  const [showRead, setShowRead] = useState(true)
  const [markingAsRead, setMarkingAsRead] = useState(new Set())
  const [deleting, setDeleting] = useState(new Set())

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      const diffInDays = Math.floor(diffInHours / 24)

      if (diffInHours < 1) {
        return "Vừa xong"
      } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`
      } else if (diffInDays < 7) {
        return `${diffInDays} ngày trước`
      } else {
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      }
    } catch {
      return "N/A"
    }
  }

  const getNotificationIcon = (title, content) => {
    const text = (title + " " + content).toLowerCase()

    if (text.includes("từ chối") || text.includes("hủy")) {
      return <XCircle className="w-5 h-5 text-red-500" />
    } else if (text.includes("chấp nhận") || text.includes("thành công") || text.includes("kết quả tiêm chủng")) {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    } else if (text.includes("thuốc") || text.includes("y tế") || text.includes("sức khỏe")) {
      return <AlertCircle className="w-5 h-5 text-blue-500" />
    } else if (text.includes("thông báo") || text.includes("nhắc nhở")) {
      return <Info className="w-5 h-5 text-purple-500" />
    } else {
      return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (title, content) => {
    const text = (title + " " + content).toLowerCase()

    if (text.includes("từ chối") || text.includes("hủy")) {
      return "bg-red-50 border-red-200 hover:bg-red-100"
    } else if (text.includes("chấp nhận") || text.includes("thành công") || text.includes("kết quả tiêm chủng")) {
      return "bg-green-50 border-green-200 hover:bg-green-100"
    } else if (text.includes("thuốc") || text.includes("y tế") || text.includes("sức khỏe")) {
      return "bg-blue-50 border-blue-200 hover:bg-blue-100"
    } else if (text.includes("thông báo") || text.includes("nhắc nhở")) {
      return "bg-purple-50 border-purple-200 hover:bg-purple-100"
    } else {
      return "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }
  }

  const getNotificationType = (title, content) => {
    const text = (title + " " + content).toLowerCase()

    if (text.includes("từ chối") || text.includes("hủy")) {
      return "rejected"
    } else if (text.includes("chấp nhận") || text.includes("thành công") || text.includes("kết quả tiêm chủng")) {
      return "approved"
    } else if (text.includes("thuốc") || text.includes("y tế") || text.includes("sức khỏe")) {
      return "medical"
    } else if (text.includes("thông báo") || text.includes("nhắc nhở")) {
      return "info"
    } else {
      return "general"
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "rejected":
        return "Từ chối"
      case "approved":
        return "Chấp nhận"
      case "medical":
        return "Y tế"
      case "info":
        return "Thông báo"
      default:
        return "Chung"
    }
  }

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.content?.toLowerCase().includes(searchTerm.toLowerCase())

    const notificationType = getNotificationType(notification.title, notification.content)
    const matchesType = filterType === "all" || notificationType === filterType

    return matchesSearch && matchesType
  })

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        const response = await ParentService.getNotifications()
        console.log("Fetched notifications:", response)

        // Assuming response.data is the array of notifications
        if (response && Array.isArray(response.data)) {
          // Map 'status' from API to 'isRead' for local state
          const notificationsWithReadStatus = response.data.map((notification) => ({
            ...notification,
            isRead: notification.status === "SEEN", // Use actual status from API
          }))
          setNotifications(notificationsWithReadStatus)
        } else {
          setNotifications([])
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (notificationId) => {
    try {
      setMarkingAsRead((prev) => new Set([...prev, notificationId]))
      // Assuming markNotificationAsRead API updates the status to "SEEN" on backend
      await ParentService.markNotificationAsRead(notificationId)

      setNotifications(
        notifications.map((notification) =>
          notification.notificationId === notificationId
            ? { ...notification, isRead: true, status: "SEEN" }
            : notification,
        ),
      )
    } catch (error) {
      console.error("Error marking notification as read:", error)
      alert("Có lỗi xảy ra khi đánh dấu đã đọc")
    } finally {
      setMarkingAsRead((prev) => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.isRead)

      // Call API for each unread notification
      await Promise.all(
        unreadNotifications.map((notification) => ParentService.markNotificationAsRead(notification.notificationId)),
      )

      // Update local state after successful API calls
      setNotifications(notifications.map((notification) => ({ ...notification, isRead: true, status: "SEEN" })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      alert("Có lỗi xảy ra khi đánh dấu tất cả đã đọc")
    }
  }

  const handleDeleteNotification = async (notificationId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thông báo này?")) {
      return
    }

    try {
      setDeleting((prev) => new Set([...prev, notificationId]))
      await ParentService.deleteNotification(notificationId)

      setNotifications(notifications.filter((notification) => notification.notificationId !== notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
      alert("Có lỗi xảy ra khi xóa thông báo")
    } finally {
      setDeleting((prev) => {
        const newSet = new Set(prev)
        newSet.delete(notificationId)
        return newSet
      })
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-gray-600">Đang tải thông báo...</span>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Thông báo</h2>
                <p className="text-purple-100">Theo dõi các thông báo và cập nhật từ nhà trường</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{notifications.length}</div>
              <div className="text-sm text-purple-100">Tổng thông báo</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm thông báo..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="medical">Y tế</option>
                <option value="approved">Chấp nhận</option>
                <option value="rejected">Từ chối</option>
                <option value="info">Thông báo</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRead(!showRead)}
                className="flex items-center space-x-2"
              >
                {showRead ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span>{showRead ? "Ẩn đã đọc" : "Hiện đã đọc"}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Bell className="w-4 h-4" />
                <span>Tìm thấy {filteredNotifications.length} thông báo</span>
              </div>

              {unreadCount > 0 && (
                <Badge variant="destructive" className="bg-red-500">
                  <BellRing className="w-3 h-3 mr-1" />
                  {unreadCount} chưa đọc
                </Badge>
              )}
            </div>

            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 bg-transparent"
              >
                <Check className="w-4 h-4" />
                <span>Đánh dấu tất cả đã đọc</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterType !== "all" ? "Không tìm thấy thông báo nào" : "Chưa có thông báo nào"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== "all"
                  ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
                  : "Thông báo sẽ xuất hiện ở đây khi có cập nhật từ nhà trường"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications
            .filter((notification) => showRead || !notification.isRead)
            .map((notification, index) => (
              <motion.div
                key={notification.notificationId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
              >
                <Card
                  className={`transition-all duration-200 ${getNotificationColor(notification.title, notification.content)} ${
                    !notification.isRead ? "ring-2 ring-blue-200" : ""
                  } hover:shadow-md`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                          {getNotificationIcon(notification.title, notification.content)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4
                              className={`text-base font-semibold ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}
                            >
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              {/* <Badge variant="secondary" className="text-xs">
                                {getTypeLabel(getNotificationType(notification.title, notification.content))}
                              </Badge>
                              <span className="text-xs text-gray-500">ID: {notification.notificationId}</span> */}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {/* Show blue dot only if status is NOT "SEEN" */}
                            {notification.status !== "SEEN" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                            <div className="text-right">
                              <div className="text-xs text-gray-500">{formatDate(notification.dateCreate)}</div>
                            </div>
                          </div>
                        </div>

                        <p
                          className={`text-sm leading-relaxed ${!notification.isRead ? "text-gray-800" : "text-gray-600"}`}
                        >
                          {notification.content}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white border-opacity-50">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {/* <Clock className="w-3 h-3" />
                            <span>User ID: {notification.userId}</span> */}
                          </div>

                          <div className="flex items-center space-x-2">
                            {/* Only show Mark as Read button if status is NOT "SEEN" */}
                            {notification.status !== "SEEN" && (
                              <Button
                                onClick={() => handleMarkAsRead(notification.notificationId)}
                                variant="ghost"
                                size="sm"
                                className="text-xs h-7 px-2"
                                disabled={markingAsRead.has(notification.notificationId)}
                              >
                                {markingAsRead.has(notification.notificationId) ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                                ) : (
                                  <Check className="w-3 h-3 mr-1" />
                                )}
                                Đánh dấu đã đọc
                              </Button>
                            )}

                            <Button
                              onClick={() => handleDeleteNotification(notification.notificationId)}
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              disabled={deleting.has(notification.notificationId)}
                            >
                              {deleting.has(notification.notificationId) ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                              ) : (
                                <Trash2 className="w-3 h-3 mr-1" />
                              )}
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
        )}
      </div>

      {/* Load More Button */}
      {filteredNotifications.length > 0 && (
        <Card>
          <CardContent className="text-center py-6">
            <Button variant="outline" className="w-full md:w-auto bg-transparent">
              Tải thêm thông báo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default NotificationsPage
