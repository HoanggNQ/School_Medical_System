"use client"

import { motion } from "framer-motion"
import { Syringe, Calendar, User, Shield, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { useState, useEffect } from "react"

const VaccinationHistory = ({ selectedStudent }) => {
  const [vaccinationHistory, setVaccinationHistory] = useState([])
  const [loading, setLoading] = useState(true)

  // Helper functions - moved inside component
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
    switch (status?.toLowerCase()) {
      case "bình thường":
      case "hoàn thành":
        return "bg-green-100 text-green-800"
      case "cần theo dõi":
      case "cần tiêm mũi tiếp theo":
        return "bg-yellow-100 text-yellow-800"
      case "bất thường":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  useEffect(() => {
    const fetchVaccinationData = async () => {
      if (!selectedStudent?.id) return

      try {
        setLoading(true)
        // TODO: Replace with actual API call when available
        // const vaccinationData = await ParentService.getStudentVaccination(selectedStudent.id)

        // Keep mock data for now
        const mockVaccinationHistory = [
          {
            id: 1,
            vaccineName: "Vắc-xin COVID-19 (Pfizer)",
            date: "2024-01-20",
            dose: "Mũi 3",
            batchNumber: "FF1234",
            location: "Trung tâm Y tế Quận 1",
            doctor: "BS. Lê Văn C",
            nextDue: "2024-07-20",
            status: "Hoàn thành",
            sideEffects: "Không có",
          },
          {
            id: 2,
            vaccineName: "Vắc-xin Cúm mùa",
            date: "2023-10-15",
            dose: "Mũi hàng năm",
            batchNumber: "FLU2023",
            location: "Trường THCS ABC",
            doctor: "BS. Phạm Thị D",
            nextDue: "2024-10-15",
            status: "Hoàn thành",
            sideEffects: "Đau nhẹ tại chỗ tiêm",
          },
        ]

        setVaccinationHistory(mockVaccinationHistory)
      } catch (error) {
        console.error("Error fetching vaccination data:", error)
        setVaccinationHistory([])
      } finally {
        setLoading(false)
      }
    }

    fetchVaccinationData()
  }, [selectedStudent?.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Đang tải lịch sử tiêm vắc-xin...</span>
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
            <Syringe className="w-6 h-6 mr-2 text-blue-500" />
            Lịch sử tiêm vắc-xin - {formatValue(selectedStudent.user?.fullName)}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>{vaccinationHistory.length} mũi tiêm</span>
          </div>
        </div>

        <div className="space-y-6">
          {vaccinationHistory.map((vaccination, index) => (
            <motion.div
              key={vaccination.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Vaccination Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Syringe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{vaccination.vaccineName}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(vaccination.date)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vaccination.status)}`}>
                  {vaccination.status}
                </span>
              </div>

              {/* Vaccination Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="text-sm text-gray-600">Liều:</span>
                      <span className="ml-2 font-medium">{vaccination.dose}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="text-sm text-gray-600">Số lô:</span>
                      <span className="ml-2 font-medium">{vaccination.batchNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <span className="text-sm text-gray-600">Địa điểm:</span>
                      <span className="ml-2 font-medium">{vaccination.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-600">Bác sĩ:</span>
                      <span className="ml-2 font-medium">{vaccination.doctor}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <div>
                      <span className="text-sm text-gray-600">Mũi tiếp theo:</span>
                      <span className="ml-2 font-medium">{formatDate(vaccination.nextDue)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {vaccination.sideEffects === "Không có" ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Tác dụng phụ:</span>
                      <span className="ml-2 font-medium">{vaccination.sideEffects}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Due Alert */}
              {vaccination.status === "Cần tiêm mũi tiếp theo" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      <strong>Lưu ý:</strong> Cần tiêm mũi tiếp theo vào ngày {formatDate(vaccination.nextDue)}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VaccinationHistory
