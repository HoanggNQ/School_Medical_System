"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Save,
  AlertCircle,
  User,
  Phone,
  Heart,
  Activity,
  Ruler,
  Weight,
  Droplets,
  Shield,
  Pill,
  Calendar,
} from "lucide-react"
import ParentService from "../../api/services/parent.service"
import { toast } from "@/components/ui/use-toast"

const HealthDeclaration = ({ selectedStudent, editingDeclaration = null, onSave, onCancel }) => {
  const parentProfile = JSON.parse(localStorage.getItem("parentProfile")) || {}
  const [formData, setFormData] = useState({
    studentId: selectedStudent?.id || 0,
    declaredById: 0, // Will be set from parent profile
    status: "PENDING",
    academicYear: "",
    height: "",
    weight: "",
    bloodType: "",
    allergies: "",
    chronicDiseases: "",
    // currentMedications: "",
    emergencyContactName: parentProfile.fullName || "",
    emergencyContactPhone: parentProfile.phoneNumber || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // Helper function
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return ""
    }
    return String(value)
  }

  // Get current academic year
  const getCurrentAcademicYear = () => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    // Academic year typically starts in September
    if (currentMonth >= 9) {
      return `${currentYear}-${currentYear + 1}`
    } else {
      return `${currentYear - 1}-${currentYear}`
    }
  }

  // Thêm function để lấy current user từ localStorage
  const getCurrentUser = () => {
    try {
      const currentUser = localStorage.getItem("currentUser")
      if (currentUser) {
        return JSON.parse(currentUser)
      }
      return null
    } catch (error) {
      console.error("Error parsing current user:", error)
      return null
    }
  }

  // Trong useEffect, cập nhật để set declaredById từ current user
  useEffect(() => {
    const currentUser = getCurrentUser()
    const parentId = currentUser?.id || 0
    const parentProfile = JSON.parse(localStorage.getItem("parentProfile")) || {}

    if (editingDeclaration) {
      setFormData({
        ...editingDeclaration,
        studentId: selectedStudent?.id || editingDeclaration.studentId,
        declaredById: parentId,
        emergencyContactName: editingDeclaration.emergencyContactName || parentProfile.fullName || "",
        emergencyContactPhone: editingDeclaration.emergencyContactPhone || parentProfile.phoneNumber || "",
      })
    } else {
      setFormData({
        studentId: selectedStudent?.id || 0,
        declaredById: parentId,
        status: "PENDING",
        academicYear: getCurrentAcademicYear(),
        height: "",
        weight: "",
        bloodType: "",
        allergies: "",
        chronicDiseases: "",
        // currentMedications: "",
        emergencyContactName: parentProfile.fullName || "",
        emergencyContactPhone: parentProfile.phoneNumber || "",
      })
    }
  }, [selectedStudent, editingDeclaration])

  const bloodTypes = [
    { value: "", label: "Chọn nhóm máu" },
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
    { value: "UNKNOWN", label: "Chưa xác định" },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.academicYear.trim()) {
      newErrors.academicYear = "Vui lòng nhập năm học"
    }

    if (!formData.height || formData.height <= 0) {
      newErrors.height = "Vui lòng nhập chiều cao hợp lệ"
    } else if (formData.height < 50 || formData.height > 250) {
      newErrors.height = "Chiều cao phải từ 50-250 cm"
    }

    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = "Vui lòng nhập cân nặng hợp lệ"
    } else if (formData.weight < 10 || formData.weight > 200) {
      newErrors.weight = "Cân nặng phải từ 10-200 kg"
    }

    if (!formData.bloodType) {
      newErrors.bloodType = "Vui lòng chọn nhóm máu"
    }

    if (!formData.emergencyContactName.trim()) {
      newErrors.emergencyContactName = "Vui lòng nhập tên người liên hệ khẩn cấp"
    }

    if (!formData.emergencyContactPhone.trim()) {
      newErrors.emergencyContactPhone = "Vui lòng nhập số điện thoại khẩn cấp"
    } else if (!/^[0-9+\-\s()]{10,15}$/.test(formData.emergencyContactPhone.replace(/\s/g, ""))) {
      newErrors.emergencyContactPhone = "Số điện thoại không hợp lệ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Trong handleSubmit, đảm bảo declaredById luôn được set từ current user
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Get current user ID
      const currentUser = getCurrentUser()
      const parentId = currentUser?.id || 0

      const submitData = {
        ...formData,
        height: Number.parseFloat(formData.height),
        weight: Number.parseFloat(formData.weight),
        studentId: selectedStudent?.id || formData.studentId,
        declaredById: parentId, // Always use current user ID
      }

      console.log("Submitting health declaration:", submitData)

      if (editingDeclaration) {
        // Update existing declaration
        await ParentService.updateHealthDeclaration(editingDeclaration.id, submitData)
        toast({
                  title: "Cập nhật thành công",
                  description: "Cập nhật khai báo sức khỏe thành công!",
                  variant: "success",
        })
      } else {
        // Create new declaration
        await ParentService.postHealthDeclaration(submitData)
        toast({
                  title: "Tạo thành công",
                  description: "Tạo khai báo sức khỏe thành công!",
                  variant: "success",
        })
      }

      // Reset form if creating new
      if (!editingDeclaration) {
        const parentProfile = JSON.parse(localStorage.getItem("parentProfile")) || {}
        setFormData({
          studentId: selectedStudent?.id || 0,
          declaredById: parentId, // Use current user ID
          status: "PENDING",
          academicYear: getCurrentAcademicYear(),
          height: "",
          weight: "",
          bloodType: "",
          allergies: "",
          chronicDiseases: "",
          // currentMedications: "",
          emergencyContactName: parentProfile.fullName || "",
          emergencyContactPhone: parentProfile.phoneNumber || "",
        })
      }

      // Call parent callback
      if (onSave) {
        onSave()
      }
    } catch (error) {
      console.error("Error submitting health declaration:", error)
      toast({
                title: "Gửi thất bại",
                description: "Có lỗi xảy ra khi gửi khai báo sức khỏe",
                variant: "destructive",
      })

    } finally {
      setIsSubmitting(false)
    }
  }

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInM = formData.height / 100
      const bmi = formData.weight / (heightInM * heightInM)
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

  const getBMIColor = (bmi) => {
    if (!bmi) return "text-gray-500"
    const bmiValue = Number.parseFloat(bmi)
    if (bmiValue < 18.5) return "text-blue-600"
    if (bmiValue < 25) return "text-green-600"
    if (bmiValue < 30) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-500" />
            {editingDeclaration ? "Chỉnh sửa khai báo sức khỏe" : "Khai báo sức khỏe"} -{" "}
            {formatValue(selectedStudent.user?.fullName)}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Heart className="w-4 h-4" />
            <span>{editingDeclaration ? "Cập nhật" : "Tạo mới"}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Academic Year */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Thông tin năm học
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.academicYear}
                  onChange={(e) => handleInputChange("academicYear", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.academicYear ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ví dụ: 2024-2025"
                />
                {errors.academicYear && <p className="mt-1 text-sm text-red-600">{errors.academicYear}</p>}
              </div>
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Trạng thái:</strong> {formData.status === "PENDING" ? "Chờ duyệt" : formData.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Chỉ số cơ thể
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  Chiều cao (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  max="250"
                  step="0.1"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.height ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="150.5"
                />
                {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="w-4 h-4 inline mr-1" />
                  Cân nặng (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="10"
                  max="200"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.weight ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="45.5"
                />
                {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Droplets className="w-4 h-4 inline mr-1" />
                  Nhóm máu <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange("bloodType", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.bloodType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {bloodTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.bloodType && <p className="mt-1 text-sm text-red-600">{errors.bloodType}</p>}
              </div>
            </div>

            {/* BMI Calculation */}
            {calculateBMI() && (
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Chỉ số BMI:</span>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${getBMIColor(calculateBMI())}`}>{calculateBMI()}</span>
                    <span className={`ml-2 text-sm ${getBMIColor(calculateBMI())}`}>
                      ({getBMIStatus(calculateBMI())})
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Health Information */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Thông tin sức khỏe
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dị ứng (nếu có)</label>
                <textarea
                  rows={3}
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Mô tả các loại dị ứng: thức ăn, thuốc, môi trường..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bệnh mãn tính (nếu có)</label>
                <textarea
                  rows={3}
                  value={formData.chronicDiseases}
                  onChange={(e) => handleInputChange("chronicDiseases", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Mô tả các bệnh mãn tính: hen suyễn, tiểu đường, tim mạch..."
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Pill className="w-4 h-4 inline mr-1" />
                  Thuốc đang sử dụng (nếu có)
                </label>
                <textarea
                  rows={3}
                  value={formData.currentMedications}
                  onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Liệt kê các loại thuốc đang sử dụng thường xuyên..."
                />
              </div> */}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2" />
              Liên hệ khẩn cấp
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Tên người liên hệ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.emergencyContactName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Họ và tên người liên hệ khẩn cấp"
                />
                {errors.emergencyContactName && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.emergencyContactPhone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0901234567"
                />
                {errors.emergencyContactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-orange-800 mb-1">Lưu ý quan trọng</h5>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Vui lòng cung cấp thông tin chính xác và đầy đủ</li>
                  <li>• Thông tin này sẽ được sử dụng cho việc chăm sóc sức khỏe học sinh</li>
                  <li>• Cập nhật thông tin khi có thay đổi về sức khỏe</li>
                  <li>• Liên hệ khẩn cấp phải luôn có thể liên lạc được</li>
                  <li>• Khai báo sẽ được xem xét và phê duyệt bởi y tế trường</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            {editingDeclaration && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{editingDeclaration ? "Đang cập nhật..." : "Đang gửi..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingDeclaration ? "Cập nhật khai báo" : "Gửi khai báo"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HealthDeclaration
