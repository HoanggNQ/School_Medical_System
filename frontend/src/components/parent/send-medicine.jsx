"use client"

import { useState, useEffect } from "react"
import { Pill, Send, AlertCircle } from "lucide-react"

const SendMedicine = ({ selectedStudent, formatValue }) => {
  const [medicineForm, setMedicineForm] = useState({
    medicineName: "",
    dosage: "",
    frequency: "",
    duration: "",
    startDate: "",
    endDate: "",
    instructions: "",
    reason: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
        console.log("Selected student:", selectedStudent)
  },[])
  const handleMedicineFormChange = (field, value) => {
    setMedicineForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMedicineSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Call API to submit medicine request
      // const response = await ParentService.sendMedicineRequest(selectedStudent.id, medicineForm)
      console.log("Medicine form submitted:", medicineForm)

      // Reset form after successful submission
      setMedicineForm({
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        startDate: "",
        endDate: "",
        instructions: "",
        reason: "",
        notes: "",
      })

      alert("Đã gửi yêu cầu thuốc thành công!")
    } catch (error) {
      console.error("Error submitting medicine request:", error)
      alert("Có lỗi xảy ra khi gửi yêu cầu thuốc")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Pill className="w-6 h-6 mr-2 text-purple-500" />
            Gửi thuốc cho {formatValue(selectedStudent.user?.fullName)}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Send className="w-4 h-4" />
            <span>Yêu cầu thuốc</span>
          </div>
        </div>

        <form onSubmit={handleMedicineSubmit} className="space-y-6">
          {/* Medicine Information */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-purple-900 mb-4">Thông tin thuốc</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên thuốc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={medicineForm.medicineName}
                  onChange={(e) => handleMedicineFormChange("medicineName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ví dụ: Paracetamol"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Liều lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={medicineForm.dosage}
                  onChange={(e) => handleMedicineFormChange("dosage", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ví dụ: 500mg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tần suất sử dụng <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={medicineForm.frequency}
                  onChange={(e) => handleMedicineFormChange("frequency", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Chọn tần suất</option>
                  <option value="1-time-day">1 lần/ngày</option>
                  <option value="2-times-day">2 lần/ngày</option>
                  <option value="3-times-day">3 lần/ngày</option>
                  <option value="as-needed">Khi cần thiết</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian sử dụng</label>
                <input
                  type="text"
                  value={medicineForm.duration}
                  onChange={(e) => handleMedicineFormChange("duration", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ví dụ: 7 ngày"
                />
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">Thời gian sử dụng</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={medicineForm.startDate}
                  onChange={(e) => handleMedicineFormChange("startDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                <input
                  type="date"
                  value={medicineForm.endDate}
                  onChange={(e) => handleMedicineFormChange("endDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Instructions and Reason */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-green-900 mb-4">Hướng dẫn và lý do</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hướng dẫn sử dụng <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={medicineForm.instructions}
                  onChange={(e) => handleMedicineFormChange("instructions", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ví dụ: Uống sau ăn, với một cốc nước đầy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do sử dụng <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={medicineForm.reason}
                  onChange={(e) => handleMedicineFormChange("reason", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ví dụ: Sốt, đau đầu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú thêm</label>
                <textarea
                  rows={3}
                  value={medicineForm.notes}
                  onChange={(e) => handleMedicineFormChange("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  placeholder="Ghi chú thêm (nếu có)"
                />
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-800 mb-1">Lưu ý quan trọng</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Chỉ gửi thuốc khi thực sự cần thiết và theo chỉ định của bác sĩ</li>
                  <li>• Đảm bảo thuốc còn hạn sử dụng và được bảo quản đúng cách</li>
                  <li>• Ghi rõ tên học sinh trên bao bì thuốc</li>
                  <li>• Nhà trường sẽ xem xét và phê duyệt yêu cầu trước khi thực hiện</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() =>
                setMedicineForm({
                  medicineName: "",
                  dosage: "",
                  frequency: "",
                  duration: "",
                  startDate: "",
                  endDate: "",
                  instructions: "",
                  reason: "",
                  notes: "",
                })
              }
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Xóa form
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Gửi yêu cầu</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SendMedicine
