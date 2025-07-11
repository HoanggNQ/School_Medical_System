"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Calendar, MapPin, FileText, AlertCircle, Stethoscope, ClipboardList } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ParentService from "../../api/services/parent.service" // Assuming ParentService handles student-related APIs

const StudentMedicalEvent = ({ selectedStudent }) => {
  const [medicalEvents, setMedicalEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchMedicalEvents = async () => {
      if (!selectedStudent?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await ParentService.getStudentMedicalEvent(selectedStudent.id, currentPage, pageSize)
        console.log("Student Medical Events:", response)

        if (response && response.data) {
          setMedicalEvents(response.data.content || response.data)
          setTotalPages(response.data.totalPages || 1)
        } else {
          setMedicalEvents([])
        }
      } catch (error) {
        console.error("Error fetching medical events:", error)
        setError("Không thể tải sự kiện y tế")
        toast({
          title: "Lỗi tải dữ liệu",
          description: error.message,
          variant: "destructive",
        })
        setMedicalEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchMedicalEvents()
  }, [selectedStudent?.id, currentPage, pageSize])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      // Assuming eventDate is ISO string, format to Vietnamese locale
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A"
    }
    return String(value)
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
            <span className="ml-2 text-gray-600">Đang tải sự kiện y tế...</span>
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
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Sự kiện y tế tại trường</h2>
              <p className="text-orange-100">
                Theo dõi các sự cố y tế của {formatValue(selectedStudent?.user?.fullName)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{medicalEvents.length}</div>
            <div className="text-sm text-orange-100">Tổng sự kiện</div>
          </div>
        </div>
      </div>

      {/* Medical Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <ClipboardList className="w-5 h-5 mr-2" />
              Danh sách sự kiện
            </span>
            <span className="text-sm font-normal text-gray-600">{medicalEvents.length} kết quả</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {medicalEvents.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Không có sự kiện y tế nào</h4>
              <p className="text-gray-500">Chưa có sự kiện y tế nào được ghi nhận cho học sinh này.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {medicalEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="border-2 rounded-lg p-6 hover:shadow-md transition-all duration-200 bg-red-50 border-red-200 hover:bg-red-100"
                >
                  {/* Event Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Stethoscope className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{formatValue(event.eventType)}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Sự kiện ID: #{event.id}</span>
                          <span>•</span>
                          <span>Học sinh ID: #{event.studentId}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Sự cố
                    </Badge>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Thời gian</p>
                        <p className="font-medium text-gray-900">{formatDate(event.eventDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Địa điểm</p>
                        <p className="font-medium text-gray-900">{formatValue(event.location)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 md:col-span-2">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Mô tả</p>
                        <p className="font-medium text-gray-900">{formatValue(event.description)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Follow-up Notes */}
                  {event.followUpNotes && (
                    <div className="bg-white bg-opacity-60 p-4 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Ghi chú theo dõi:
                      </h6>
                      <p className="text-sm text-gray-700 leading-relaxed">{formatValue(event.followUpNotes)}</p>
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

export default StudentMedicalEvent
