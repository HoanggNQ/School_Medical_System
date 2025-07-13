"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Pill,
  Calendar,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  User,
  FileText,
  AlertCircle,
  Plus,
} from "lucide-react"
import ParentService from "../../api/services/parent.service"
import { toast } from "@/components/ui/use-toast"

const MedicineRequestHistory = ({ selectedStudent, onEdit, onNewRequest }) => {
  const [medicineRequests, setMedicineRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  // Helper functions
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "" || String(value).trim() === "null") {
      return "N/A"
    }
    return String(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN")
    } catch {
      return "N/A"
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return <CheckCircle className="w-4 h-4" />
      case "PENDING":
        return <Clock className="w-4 h-4" />
      case "REJECTED":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "Đã duyệt"
      case "PENDING":
        return "Chờ duyệt"
      case "REJECTED":
        return "Từ chối"
      default:
        return "Chờ duyệt"
    }
  }

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case "1-time-day":
        return "1 lần/ngày"
      case "2-times-day":
        return "2 lần/ngày"
      case "3-times-day":
        return "3 lần/ngày"
      case "as-needed":
        return "Khi cần thiết"
      case "other":
        return "Khác"
      default:
        return formatValue(frequency)
    }
  }

  const fetchMedicineRequests = async () => {
    if (!selectedStudent?.id) {
      setMedicineRequests([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await ParentService.getMedicineRequest(selectedStudent.id) // Assuming this API exists
      console.log("Fetched medicine requests:", response.data)
      setMedicineRequests(response.data || [])
    } catch (err) {
      console.error("Error fetching medicine requests:", err)
      setError("Không thể tải lịch sử yêu cầu thuốc: " + err.message)
      toast({
        title: "Lỗi tải dữ liệu",
        description: err.message,
        variant: "destructive",
      })
      setMedicineRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicineRequests()
  }, [selectedStudent?.id])

  const handleDelete = async (requestId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa yêu cầu thuốc này?")) {
      return
    }

    try {
      setDeletingId(requestId)
      await ParentService.deleteMedicineRequest(requestId) // Assuming this API exists
      setMedicineRequests(medicineRequests.filter((req) => req.id !== requestId))
      toast({
        title: "Xóa thành công",
        description: "Yêu cầu thuốc đã được xóa.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error deleting medicine request:", error)
      toast({
        title: "Lỗi xóa",
        description: "Có lỗi xảy ra khi xóa yêu cầu thuốc: " + error.message,
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const handleViewDetail = (request) => {
    setSelectedRequest(request)
    setShowDetailModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Đang tải lịch sử yêu cầu thuốc...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Có lỗi xảy ra</h3>
            <p className="text-gray-500">{error}</p>
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
            <Pill className="w-6 h-6 mr-2 text-blue-500" />
            Lịch sử yêu cầu thuốc - {formatValue(selectedStudent.user?.fullName)}
          </h3>
          <button
            onClick={onNewRequest}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo yêu cầu mới</span>
          </button>
        </div>

        {medicineRequests.length === 0 ? (
          <div className="text-center py-8">
            <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có yêu cầu thuốc nào</p>
            <p className="text-sm text-gray-400 mt-1">Tạo yêu cầu thuốc đầu tiên để gửi cho nhà trường</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reverse the array before mapping */}
            {[...medicineRequests].reverse().map((request, index) => {
              const canModify = request.status?.toUpperCase() === "PENDING"
              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Request Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Pill className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Yêu cầu thuốc năm học {formatValue(request.academicYear)}
                        </h4>
                        <p className="text-sm text-gray-600 flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(request.requestDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}
                      >
                        {getStatusIcon(request.status)}
                        <span>{getStatusLabel(request.status)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Quick Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-1 flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Học sinh
                      </h6>
                      <p className="text-sm text-gray-700">{formatValue(request.studentName)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-1 flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        Ghi chú
                      </h6>
                      <p className="text-sm text-gray-700">
                        {request.notes
                          ? request.notes.length > 70
                            ? `${request.notes.substring(0, 70)}...`
                            : request.notes
                          : "Không có ghi chú"}
                      </p>
                    </div>
                  </div>

                  {/* Medication Summary */}
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <h6 className="font-medium text-blue-800 mb-2 flex items-center">
                      <Pill className="w-4 h-4 mr-1" />
                      Thuốc yêu cầu ({request.details?.length || 0} loại)
                    </h6>
                    {request.details && request.details.length > 0 ? (
                      <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                        {request.details.slice(0, 2).map((detail, detailIndex) => (
                          <li key={detailIndex}>
                            {formatValue(detail.medicationName)}: {formatValue(detail.dosage)} (
                            {getFrequencyLabel(detail.frequency)})
                          </li>
                        ))}
                        {request.details.length > 2 && (
                          <li>
                            <em>Và {request.details.length - 2} loại thuốc khác...</em>
                          </li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm text-blue-700">Không có chi tiết thuốc.</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleViewDetail(request)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem chi tiết</span>
                    </button>

                    {canModify && (
                      <button
                        onClick={() => onEdit(request)}
                        className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center space-x-1"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                      </button>
                    )}

                    {canModify && (
                      <button
                        onClick={() => handleDelete(request.id)}
                        disabled={deletingId === request.id}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-1"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span>Xóa</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết yêu cầu thuốc</h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Request Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="font-medium text-gray-800 mb-2">Thông tin chung</h6>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Học sinh:</strong> {formatValue(selectedRequest.studentName)}
                      </p>
                      <p>
                        <strong>Năm học:</strong> {formatValue(selectedRequest.academicYear)}
                      </p>
                      <p>
                        <strong>Ngày yêu cầu:</strong> {formatDate(selectedRequest.requestDate)}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}
                        >
                          {getStatusLabel(selectedRequest.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="font-medium text-gray-800 mb-2">Ghi chú</h6>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{formatValue(selectedRequest.notes)}</p>
                  </div>
                </div>

                {/* Medication Details */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h6 className="font-medium text-blue-800 mb-2 flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Chi tiết thuốc ({selectedRequest.details?.length || 0} loại)
                  </h6>
                  {selectedRequest.details && selectedRequest.details.length > 0 ? (
                    <div className="space-y-4">
                      {selectedRequest.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="border border-blue-200 p-3 rounded-lg bg-white">
                          <p className="font-semibold text-gray-900 mb-1">{formatValue(detail.medicationName)}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                            <p>
                              <strong>Liều lượng:</strong> {formatValue(detail.dosage)}
                            </p>
                            <p>
                              <strong>Tần suất:</strong> {getFrequencyLabel(detail.frequency)}
                            </p>
                            <p>
                              <strong>Số lượng:</strong> {formatValue(detail.quantity)}
                            </p>
                            <p>
                              <strong>Phụ huynh cung cấp:</strong> {detail.providedByParent ? "Có" : "Không"}
                            </p>
                            <p>
                              <strong>Ngày bắt đầu:</strong> {formatDate(detail.startDate)}
                            </p>
                            <p>
                              <strong>Ngày kết thúc:</strong> {formatDate(detail.endDate)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-blue-700">Không có chi tiết thuốc nào được cung cấp.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
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

export default MedicineRequestHistory
