"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Pill, Send, AlertCircle, Plus, X, Search, Save } from "lucide-react" // Added Save icon
import ParentService from "../../api/services/parent.service"
import { toast } from "@/components/ui/use-toast" // Ensure toast is imported

const SendMedicine = ({ selectedStudent, editingRequest, onSave, onCancel }) => {
  const [availableMedicines, setAvailableMedicines] = useState([])
  const [selectedMedicines, setSelectedMedicines] = useState([])
  const [medicineForm, setMedicineForm] = useState({
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showMedicineSelector, setShowMedicineSelector] = useState(false)

  // Helper function
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A"
    }
    return String(value)
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toISOString().split("T")[0]
    } catch {
      return ""
    }
  }

  // Validation logic for dates - now only called on submit
  const validateDates = (startDate, endDate, isEditing = false, originalStartDate = null) => {
    const errors = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : null

    // Start date cannot be in the past for new requests or if editing and start date is changed to past
    if (!isEditing && start < today) {
      errors.push("Ngày bắt đầu không thể là ngày trong quá khứ.")
    } else if (
      isEditing &&
      originalStartDate &&
      formatDateForInput(originalStartDate) !== formatDateForInput(startDate) &&
      start < today
    ) {
      // If editing, and start date is changed to a past date, it's an error
      errors.push("Ngày bắt đầu không thể là ngày trong quá khứ.")
    }

    // End date must be after start date
    if (end && end <= start) {
      errors.push("Ngày kết thúc phải sau ngày bắt đầu.")
    }

    // End date cannot be more than 1 year from start date
    if (end) {
      const oneYearLater = new Date(start)
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1)
      if (end > oneYearLater) {
        errors.push("Ngày kết thúc không thể quá 1 năm từ ngày bắt đầu.")
      }
    }

    return errors
  }

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true)
        const medicineRes = await ParentService.getAllMedicine()
        console.log("Fetched medicines:", medicineRes.data)

        const medicines = medicineRes.data?.content || []
        setAvailableMedicines(medicines)
      } catch (error) {
        console.error("Error fetching medicines:", error)
        setAvailableMedicines([])
      } finally {
        setLoading(false)
      }
    }

    fetchMedicines()
  }, [])

  // Populate form if editing an existing request
  useEffect(() => {
    if (editingRequest) {
      setMedicineForm({
        notes: editingRequest.notes || "",
      })
      setSelectedMedicines(
        editingRequest.details.map((detail) => ({
          medicationId: detail.medicationId,
          medicineName: detail.medicationName,
          // Assuming these fields are available in the detail object or can be looked up from availableMedicines
          // For simplicity, I'll add placeholders if not directly available in the provided structure
          medicineCategory: detail.medicineCategory || "",
          medicineDosageForm: detail.dosageForm || "", // Corrected from medicineDosageForm
          prescriptionRequired: detail.prescriptionRequired || false,
          activeIngredient: detail.activeIngredient || "",
          dosage: detail.dosage,
          frequency: detail.frequency,
          startDate: formatDateForInput(detail.startDate),
          endDate: formatDateForInput(detail.endDate),
          quantity: detail.quantity,
          providedByParent: detail.providedByParent,
        })),
      )
    } else {
      // Reset form for new request
      setSelectedMedicines([])
      setMedicineForm({ notes: "" })
    }
  }, [editingRequest])

  const handleFormChange = (field, value) => {
    setMedicineForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addMedicine = (medicine) => {
    const newMedication = {
      medicationId: medicine.id,
      medicineName: medicine.medicationName,
      medicineCategory: medicine.category,
      medicineDosageForm: medicine.dosageForm,
      prescriptionRequired: medicine.prescriptionRequired,
      activeIngredient: medicine.activeIngredient,
      dosage: "",
      frequency: "",
      startDate: formatDateForInput(new Date()), // Default to today
      endDate: "",
      quantity: 1,
      providedByParent: true,
    }
    setSelectedMedicines([...selectedMedicines, newMedication])
    setShowMedicineSelector(false)
    setSearchTerm("")
  }

  const removeMedicine = (index) => {
    setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index))
  }

  const updateMedicine = (index, field, value) => {
    const updated = [...selectedMedicines]
    updated[index] = { ...updated[index], [field]: value }
    setSelectedMedicines(updated)
  }

  const filteredMedicines = availableMedicines.filter(
    (medicine) =>
      medicine.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.dosageForm?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (selectedMedicines.length === 0) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn ít nhất một loại thuốc.",
        variant: "destructive",
      })
      return
    }

    // Validate required fields for each medicine
    const invalidMedicines = selectedMedicines.filter(
      (med) => !med.dosage || !med.frequency || !med.startDate || !med.quantity,
    )

    if (invalidMedicines.length > 0) {
      toast({
        title: "Thiếu thông tin",
        description:
          "Vui lòng điền đầy đủ thông tin (liều lượng, tần suất, ngày bắt đầu, số lượng) cho tất cả các loại thuốc đã chọn.",
        variant: "destructive",
      })
      return
    }

    // Validate dates for all medicines on submit
    const dateValidationErrors = []
    selectedMedicines.forEach((med, index) => {
      const originalStartDate = editingRequest?.details[index]?.startDate // Get original start date if editing
      const errors = validateDates(med.startDate, med.endDate, !!editingRequest, originalStartDate)
      if (errors.length > 0) {
        dateValidationErrors.push(`Thuốc ${index + 1} (${med.medicineName}): ${errors.join(", ")}`)
      }
    })

    if (dateValidationErrors.length > 0) {
      toast({
        title: "Lỗi ngày tháng",
        description: dateValidationErrors.join("\n"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const requestData = {
        studentId: selectedStudent.id,
        notes: medicineForm.notes,
        medications: selectedMedicines.map((med) => ({
          medicationId: med.medicationId,
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: med.startDate,
          endDate: med.endDate || null,
          quantity: Number.parseInt(med.quantity),
          providedByParent: med.providedByParent,
        })),
      }

      console.log(editingRequest ? "Updating medicine request:" : "Submitting new medicine request:", requestData)

      let response
      if (editingRequest) {
        response = await ParentService.updateMedicineRequest(editingRequest.id, requestData) // Assuming this API exists
        toast({
          title: "Cập nhật thành công",
          description: "Yêu cầu thuốc đã được cập nhật.",
          variant: "success",
        })
      } else {
        response = await ParentService.postMedicineRequest(requestData)
        toast({
          title: "Gửi thành công",
          description: "Yêu cầu thuốc đã được gửi.",
          variant: "success",
        })
      }

      console.log("Medicine request operation successful:", response)
      onSave() // Notify parent component to refresh and close form
    } catch (error) {
      console.error("Error submitting/updating medicine request:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi gửi/cập nhật yêu cầu thuốc: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getPrescriptionBadge = (required) => {
    if (required) {
      return (
        <span className="inline-flex px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          Cần đơn thuốc
        </span>
      )
    }
    return (
      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Không cần đơn
      </span>
    )
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Đang tải danh sách thuốc...</span>
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Pill className="w-6 h-6 mr-2 text-blue-500" />
            {editingRequest ? "Chỉnh sửa yêu cầu thuốc" : "Gửi thuốc"} cho {formatValue(selectedStudent.user?.fullName)}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Send className="w-4 h-4" />
            <span>Yêu cầu thuốc</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Medicine Selection */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-blue-900">Chọn thuốc</h4>
              <button
                type="button"
                onClick={() => setShowMedicineSelector(!showMedicineSelector)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm thuốc</span>
              </button>
            </div>

            {/* Medicine Selector Modal */}
            {showMedicineSelector && (
              <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-white">
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thuốc theo tên, loại hoặc dạng bào chế..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMedicineSelector(false)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredMedicines.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      {availableMedicines.length === 0
                        ? "Không có thuốc nào trong hệ thống"
                        : "Không tìm thấy thuốc nào"}
                    </p>
                  ) : (
                    filteredMedicines.map((medicine) => (
                      <div
                        key={medicine.id}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => addMedicine(medicine)}
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-gray-900">{medicine.medicationName}</h5>
                            {getPrescriptionBadge(medicine.prescriptionRequired)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <p>
                              <span className="font-medium">Loại:</span> {formatValue(medicine.category)}
                            </p>
                            <p>
                              <span className="font-medium">Dạng:</span> {formatValue(medicine.dosageForm)}
                            </p>
                          </div>
                          {medicine.activeIngredient && (
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">Hoạt chất:</span> {medicine.activeIngredient}
                            </p>
                          )}
                        </div>
                        <Plus className="w-5 h-5 text-blue-600 ml-3" />
                      </div>
                    ))
                  )}
                </div>

                {availableMedicines.length > 0 && (
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    Hiển thị {filteredMedicines.length} / {availableMedicines.length} thuốc
                  </div>
                )}
              </div>
            )}

            {/* Selected Medicines */}
            {selectedMedicines.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Pill className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Chưa chọn thuốc nào</p>
                <p className="text-sm">Nhấn "Thêm thuốc" để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h5 className="font-medium text-blue-900">Thuốc đã chọn ({selectedMedicines.length})</h5>
                {selectedMedicines.map((medicine, index) => (
                  <div key={index} className="border border-blue-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h6 className="font-medium text-gray-900">{medicine.medicineName}</h6>
                          <div className="flex items-center space-x-2">
                            {getPrescriptionBadge(medicine.prescriptionRequired)}
                            <button
                              type="button"
                              onClick={() => removeMedicine(index)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Loại:</span> {formatValue(medicine.medicineCategory)}
                          </p>
                          <p>
                            <span className="font-medium">Dạng:</span> {formatValue(medicine.medicineDosageForm)}
                          </p>
                        </div>
                        {medicine.activeIngredient && (
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">Hoạt chất:</span> {medicine.activeIngredient}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Liều lượng <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={medicine.dosage}
                          onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ví dụ: 500mg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tần suất <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          value={medicine.frequency}
                          onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số lượng <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={medicine.quantity}
                          onChange={(e) => updateMedicine(index, "quantity", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày bắt đầu <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          // Removed min attribute here to allow validation only on submit
                          value={medicine.startDate}
                          onChange={(e) => updateMedicine(index, "startDate", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Ngày không thể trong quá khứ (kiểm tra khi gửi)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                        <input
                          type="date"
                          // Removed min attribute here to allow validation only on submit
                          value={medicine.endDate}
                          onChange={(e) => updateMedicine(index, "endDate", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Phải sau ngày bắt đầu, tối đa 1 năm (kiểm tra khi gửi)
                        </p>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={medicine.providedByParent}
                            onChange={(e) => updateMedicine(index, "providedByParent", e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Phụ huynh cung cấp</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes Section - Only show after medicines are selected */}
          {selectedMedicines.length > 0 && (
            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-green-900 mb-4">Ghi chú</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú chung</label>
                <textarea
                  rows={3}
                  value={medicineForm.notes}
                  onChange={(e) => handleFormChange("notes", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ghi chú về tình trạng sức khỏe hoặc yêu cầu đặc biệt..."
                />
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedMedicines.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt yêu cầu</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Học sinh:</p>
                  <p className="font-medium">{formatValue(selectedStudent.user?.fullName)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số loại thuốc:</p>
                  <p className="font-medium">{selectedMedicines.length} loại</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tổng số lượng:</p>
                  <p className="font-medium">
                    {selectedMedicines.reduce((total, med) => total + Number.parseInt(med.quantity || 0), 0)} viên/gói
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thuốc cần đơn:</p>
                  <p className="font-medium">
                    {selectedMedicines.filter((med) => med.prescriptionRequired).length} loại
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phụ huynh cung cấp:</p>
                  <p className="font-medium">{selectedMedicines.filter((med) => med.providedByParent).length} loại</p>
                </div>
              </div>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-yellow-800 mb-1">Lưu ý quan trọng</h5>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Chỉ gửi thuốc khi thực sự cần thiết và theo chỉ định của bác sĩ</li>
                  <li>• Thuốc có nhãn "Cần đơn thuốc" phải có đơn từ bác sĩ</li>
                  <li>• Đảm bảo thuốc còn hạn sử dụng và được bảo quản đúng cách</li>
                  <li>• Ghi rõ tên học sinh trên bao bì thuốc</li>
                  <li>• Nhà trường sẽ xem xét và phê duyệt yêu cầu trước khi thực hiện</li>
                  <li>• Vui lòng kiểm tra kỹ thông tin trước khi gửi</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            {editingRequest && (
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
              disabled={isSubmitting || selectedMedicines.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  {editingRequest ? <Save className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  <span>{editingRequest ? "Cập nhật yêu cầu" : `Gửi yêu cầu (${selectedMedicines.length} thuốc)`}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default SendMedicine
