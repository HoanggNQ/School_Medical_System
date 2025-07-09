"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FileText,
  Calendar,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  User,
  Activity,
  Ruler,
  Weight,
  Droplets,
  Phone,
  Shield,
  Pill,
} from "lucide-react"
import ParentService from "../../api/services/parent.service"

const HealthDeclarationHistory = ({ selectedStudent, onEdit }) => {
  const [declarations, setDeclarations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDeclaration, setSelectedDeclaration] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

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

  const calculateBMI = (height, weight) => {
    if (height && weight) {
      const heightInM = height / 100
      const bmi = weight / (heightInM * heightInM)
      return bmi.toFixed(1)
    }
    return null
  }

  const getBMIStatus = (bmi) => {
    if (!bmi) return ""
    const bmiValue = Number.parseFloat(bmi)
    if (bmiValue < 18.5) return "Thiếu cân"
    if (bmiValue < 25) return "Bình thường"
    if (bmiValue < 30) return "Thừa cân"
    return "Béo phì"
  }

  useEffect(() => {
    const fetchDeclarations = async () => {
      if (!selectedStudent?.id) return

      try {
        setLoading(true)
        const response = await ParentService.getHealthDeclaration(selectedStudent.id)
        console.log("Fetched health declarations:", response.data)
        setDeclarations(response.data || [])
      } catch (error) {
        console.error("Error fetching health declarations:", error)
        setDeclarations([])
      } finally {
        setLoading(false)
      }
    }

    fetchDeclarations()
  }, [selectedStudent?.id])

  const handleDelete = async (declarationId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khai báo này?")) {
      return
    }

    try {
      await ParentService.deleteHealthDeclaration(declarationId)
      setDeclarations(declarations.filter((d) => d.id !== declarationId))
      alert("Xóa khai báo thành công!")
    } catch (error) {
      console.error("Error deleting declaration:", error)
      alert("Có lỗi xảy ra khi xóa khai báo")
    }
  }

  const handleViewDetail = (declaration) => {
    setSelectedDeclaration(declaration)
    setShowDetailModal(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Đang tải lịch sử khai báo...</span>
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
            <FileText className="w-6 h-6 mr-2 text-blue-500" />
            Lịch sử khai báo sức khỏe - {formatValue(selectedStudent.user?.fullName)}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{declarations.length} khai báo</span>
          </div>
        </div>

        {declarations.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có khai báo sức khỏe nào</p>
            <p className="text-sm text-gray-400 mt-1">Tạo khai báo đầu tiên để theo dõi sức khỏe con em</p>
          </div>
        ) : (
          <div className="space-y-4">
            {declarations.map((declaration, index) => (
              <motion.div
                key={declaration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Declaration Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        Khai báo năm học {declaration.academicYear}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(declaration.declarationDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(declaration.status)}`}
                    >
                      {getStatusIcon(declaration.status)}
                      <span>{getStatusLabel(declaration.status)}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Ruler className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Chiều cao</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{declaration.height} cm</p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Weight className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Cân nặng</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{declaration.weight} kg</p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Droplets className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">Nhóm máu</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">{formatValue(declaration.bloodType)}</p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Activity className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium text-gray-700">BMI</span>
                    </div>
                    <p className="text-lg font-bold text-purple-600">
                      {calculateBMI(declaration.height, declaration.weight) || "N/A"}
                    </p>
                    {calculateBMI(declaration.height, declaration.weight) && (
                      <p className="text-xs text-purple-500">
                        {getBMIStatus(calculateBMI(declaration.height, declaration.weight))}
                      </p>
                    )}
                  </div>
                </div>

                {/* Health Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h6 className="font-medium text-yellow-800 mb-1 flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Dị ứng
                    </h6>
                    <p className="text-sm text-yellow-700">
                      {declaration.allergies
                        ? declaration.allergies.length > 50
                          ? `${declaration.allergies.substring(0, 50)}...`
                          : declaration.allergies
                        : "Không có"}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h6 className="font-medium text-orange-800 mb-1 flex items-center">
                      <Activity className="w-4 h-4 mr-1" />
                      Bệnh mãn tính
                    </h6>
                    <p className="text-sm text-orange-700">
                      {declaration.chronicDiseases
                        ? declaration.chronicDiseases.length > 50
                          ? `${declaration.chronicDiseases.substring(0, 50)}...`
                          : declaration.chronicDiseases
                        : "Không có"}
                    </p>
                  </div>

                  <div className="bg-pink-50 p-3 rounded-lg">
                    <h6 className="font-medium text-pink-800 mb-1 flex items-center">
                      <Pill className="w-4 h-4 mr-1" />
                      Thuốc đang dùng
                    </h6>
                    <p className="text-sm text-pink-700">
                      {declaration.currentMedications
                        ? declaration.currentMedications.length > 50
                          ? `${declaration.currentMedications.substring(0, 50)}...`
                          : declaration.currentMedications
                        : "Không có"}
                    </p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 p-3 rounded-lg mb-4">
                  <h6 className="font-medium text-red-800 mb-2 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Liên hệ khẩn cấp
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <p className="text-sm text-red-700">
                      <User className="w-3 h-3 inline mr-1" />
                      {formatValue(declaration.declaredByName)}
                    </p>
                    {/* <p className="text-sm text-red-700">
                      <Phone className="w-3 h-3 inline mr-1" />
                      {formatValue(declaration.emergencyContactPhone)}
                    </p> */}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewDetail(declaration)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center space-x-1"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem chi tiết</span>
                  </button>

                  {declaration.status === "PENDING" && (
                    <button
                      onClick={() => onEdit(declaration)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Chỉnh sửa</span>
                    </button>
                  )}

                  {declaration.status === "PENDING" && (
                    <button
                      onClick={() => handleDelete(declaration.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDeclaration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Chi tiết khai báo năm học {selectedDeclaration.academicYear}
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="p-2 text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Full declaration details would go here */}
              <div className="space-y-6">
                {/* Status */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedDeclaration.status)}`}
                  >
                    {getStatusIcon(selectedDeclaration.status)}
                    <span>{getStatusLabel(selectedDeclaration.status)}</span>
                  </span>
                  <span className="text-sm text-gray-500">Tạo ngày: {formatDate(selectedDeclaration.createdAt)}</span>
                </div>

                {/* Physical measurements */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h6 className="font-medium text-green-800 mb-2">Chỉ số cơ thể</h6>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Chiều cao:</strong> {selectedDeclaration.height} cm
                      </p>
                      <p>
                        <strong>Cân nặng:</strong> {selectedDeclaration.weight} kg
                      </p>
                      <p>
                        <strong>BMI:</strong>{" "}
                        {calculateBMI(selectedDeclaration.height, selectedDeclaration.weight) || "N/A"}
                      </p>
                      <p>
                        <strong>Nhóm máu:</strong> {formatValue(selectedDeclaration.bloodType)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h6 className="font-medium text-yellow-800 mb-2">Thông tin sức khỏe</h6>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Dị ứng:</strong>
                        <p className="mt-1">{formatValue(selectedDeclaration.allergies)}</p>
                      </div>
                      <div>
                        <strong>Bệnh mãn tính:</strong>
                        <p className="mt-1">{formatValue(selectedDeclaration.chronicDiseases)}</p>
                      </div>
                      <div>
                        <strong>Thuốc đang dùng:</strong>
                        <p className="mt-1">{formatValue(selectedDeclaration.currentMedications)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h6 className="font-medium text-red-800 mb-2">Liên hệ khẩn cấp</h6>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Tên:</strong> {formatValue(selectedDeclaration.emergencyContactName)}
                      </p>
                      <p>
                        <strong>SĐT:</strong> {formatValue(selectedDeclaration.emergencyContactPhone)}
                      </p>
                    </div>
                  </div>
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

export default HealthDeclarationHistory
