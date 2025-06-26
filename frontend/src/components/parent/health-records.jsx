"use client"

import { motion } from "framer-motion"
import {
  FileText,
  Calendar,
  User,
  Activity,
  Stethoscope,
  Thermometer,
  Weight,
  Ruler,
  Eye,
  Heart,
  AlertCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import ParentService from "../../api/services/parent.service"

const HealthRecords = ({ selectedStudent }) => {
  const [healthRecords, setHealthRecords] = useState([])
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
    const fetchHealthData = async () => {
      if (!selectedStudent?.id) return

      try {
        setLoading(true)
        // Fetch real health check data from API
        const studentHealthCheck = await ParentService.getStudentHealthCheck(selectedStudent.id)
        console.log("Fetched student health check:", studentHealthCheck.data)

        // Transform API data to match our display format
        const transformedHealthRecords = studentHealthCheck.data.map((record) => ({
          id: record.id,
          date: record.checkDate,
          type: `Khám sức khỏe năm học ${record.academicYear}`,
          doctor: record.checkedByName,
          height: `${record.heightCm} cm`,
          weight: `${record.weightKg} kg`,
          bloodPressure: record.bloodPressure || "N/A",
          heartRate: record.pulse ? `${record.pulse} bpm` : "N/A",
          temperature: record.temperature ? `${record.temperature}°C` : "N/A",
          vision: `Trái: ${record.visionLeft || "N/A"}, Phải: ${record.visionRight || "N/A"}`,
          bmi: record.bmi,
          dentalHealth: record.dentalHealth,
          hearing: record.hearing,
          overallRating: record.overallHealthRating,
          recommendation: record.recommendation,
          followUpRequired: record.followUpRequired,
          followUpNotes: record.followUpNotes,
          otherNotes: record.otherNotes,
          notes: record.otherNotes || "Không có ghi chú đặc biệt",
          status: record.overallHealthRating || "Bình thường",
        }))

        setHealthRecords(transformedHealthRecords)
      } catch (error) {
        console.error("Error fetching health data:", error)
        setHealthRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchHealthData()
  }, [selectedStudent?.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Đang tải dữ liệu khám sức khỏe...</span>
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
            <FileText className="w-6 h-6 mr-2 text-green-500" />
            Hồ sơ khám sức khỏe - {formatValue(selectedStudent.user?.fullName)}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>{healthRecords.length} lần khám</span>
          </div>
        </div>

        {healthRecords.length === 0 ? (
          <div className="text-center py-8">
            <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có dữ liệu khám sức khỏe</p>
          </div>
        ) : (
          <div className="space-y-6">
            {healthRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Record Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{record.type}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(record.date)}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </div>

                {/* Vital Signs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Ruler className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Chiều cao</span>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{formatValue(record.height)}</p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Weight className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-700">Cân nặng</span>
                    </div>
                    <p className="text-lg font-bold text-green-600">{formatValue(record.weight)}</p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Activity className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-gray-700">Huyết áp</span>
                    </div>
                    <p className="text-lg font-bold text-red-600">{formatValue(record.bloodPressure)}</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700">Nhiệt độ</span>
                    </div>
                    <p className="text-lg font-bold text-orange-600">{formatValue(record.temperature)}</p>
                  </div>
                </div>

                {/* Additional Health Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <div>
                      <span className="text-sm text-gray-600">Nhịp tim:</span>
                      <span className="ml-2 font-medium">{formatValue(record.heartRate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-purple-500" />
                    <div>
                      <span className="text-sm text-gray-600">Thị lực:</span>
                      <span className="ml-2 font-medium">{formatValue(record.vision)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <div>
                      <span className="text-sm text-gray-600">BMI:</span>
                      <span className="ml-2 font-medium">{formatValue(record.bmi)}</span>
                    </div>
                  </div>
                </div>

                {/* Health Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h6 className="font-medium text-blue-800 mb-2">Sức khỏe răng miệng</h6>
                    <p className="text-sm text-blue-700">{formatValue(record.dentalHealth)}</p>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <h6 className="font-medium text-green-800 mb-2">Thính lực</h6>
                    <p className="text-sm text-green-700">{formatValue(record.hearing)}</p>
                  </div>
                </div>

                {/* Overall Rating and Recommendations */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-medium text-gray-800 mb-2">Đánh giá tổng thể</h6>
                      <p className="text-sm text-gray-700">{formatValue(record.overallRating)}</p>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-800 mb-2">Khuyến nghị</h6>
                      <p className="text-sm text-gray-700">{formatValue(record.recommendation)}</p>
                    </div>
                  </div>
                </div>

                {/* Follow-up Section */}
                {record.followUpRequired && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <h6 className="font-medium text-yellow-800">Cần theo dõi</h6>
                    </div>
                    <p className="text-sm text-yellow-700">{formatValue(record.followUpNotes)}</p>
                  </div>
                )}

                {/* Doctor and Notes */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-900">Bác sĩ khám: {record.doctor}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Ghi chú:</strong> {record.notes}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthRecords
