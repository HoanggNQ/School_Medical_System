"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import {
  Heart,
  Activity,
  Eye,
  Ear,
  Thermometer,
  Weight,
  Ruler,
  Droplets,
  User,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  TrendingUp,
  Shield,
} from "lucide-react"
import studentService from "../../api/services/student.service"

const StudentHealthProfile = () => {
  const [healthRecords, setHealthRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchStudentHealthCheckRecord = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem("currentUser"))
        setCurrentUser(user)

        const response = await studentService.getStudentHealthCheckRecord(user.id)
        console.log("Student Health Check Records:", response)

        if (response && response.data) {
          setHealthRecords(response.data)
        } else {
          setHealthRecords([])
        }
      } catch (error) {
        console.error("Error fetching health check records:", error)
        setError("Không thể tải hồ sơ sức khỏe")
        toast({
          title: "Lỗi tải dữ liệu",
          description: error.message,
          variant: "destructive",
        })
        setHealthRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchStudentHealthCheckRecord()
  }, [])

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
      return dateString
    }
  }

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A"
    }
    return String(value)
  }

  const getBMIStatus = (bmi) => {
    if (!bmi || bmi === "N/A") return { status: "Chưa xác định", color: "text-gray-500" }
    const bmiValue = Number.parseFloat(bmi)
    if (bmiValue < 18.5) return { status: "Thiếu cân", color: "text-blue-600" }
    if (bmiValue < 25) return { status: "Bình thường", color: "text-green-600" }
    if (bmiValue < 30) return { status: "Thừa cân", color: "text-yellow-600" }
    return { status: "Béo phì", color: "text-red-600" }
  }

  const getHealthRatingColor = (rating) => {
    if (!rating) return "bg-gray-100 text-gray-800"
    const ratingLower = rating.toLowerCase()
    if (ratingLower.includes("tốt") || ratingLower.includes("khỏe")) {
      return "bg-green-100 text-green-800"
    } else if (ratingLower.includes("trung bình")) {
      return "bg-yellow-100 text-yellow-800"
    } else if (ratingLower.includes("yếu") || ratingLower.includes("kém")) {
      return "bg-red-100 text-red-800"
    }
    return "bg-blue-100 text-blue-800"
  }

  const getVitalSignStatus = (type, value) => {
    if (!value || value === "N/A") return { status: "normal", color: "text-gray-500" }

    const numValue = Number.parseFloat(value)

    switch (type) {
      case "temperature":
        if (numValue < 36.1) return { status: "low", color: "text-blue-600" }
        if (numValue > 37.2) return { status: "high", color: "text-red-600" }
        return { status: "normal", color: "text-green-600" }

      case "pulse":
        if (numValue < 60) return { status: "low", color: "text-blue-600" }
        if (numValue > 100) return { status: "high", color: "text-red-600" }
        return { status: "normal", color: "text-green-600" }

      default:
        return { status: "normal", color: "text-gray-500" }
    }
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
            <span className="ml-2 text-gray-600">Đang tải hồ sơ sức khỏe...</span>
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
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Hồ sơ sức khỏe</h2>
              <p className="text-blue-100">Theo dõi kết quả khám sức khỏe của {formatValue(currentUser?.fullName)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{healthRecords.length}</div>
            <div className="text-sm text-blue-100">Lần khám</div>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      {currentUser && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{currentUser.fullName}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>ID: {currentUser.id}</span>
                {currentUser.email && (
                  <>
                    <span>•</span>
                    <span>{currentUser.email}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Records */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Stethoscope className="w-6 h-6 mr-2 text-blue-500" />
            Kết quả khám sức khỏe
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4" />
            <span>{healthRecords.length} bản ghi</span>
          </div>
        </div>

        {healthRecords.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có kết quả khám sức khỏe</h4>
            <p className="text-gray-500">Kết quả khám sức khỏe sẽ được cập nhật sau khi khám</p>
          </div>
        ) : (
          <div className="space-y-6">
            {healthRecords.map((record, index) => {
              const bmiStatus = getBMIStatus(record.bmi)
              const tempStatus = getVitalSignStatus("temperature", record.temperature)
              const pulseStatus = getVitalSignStatus("pulse", record.pulse)

              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="border-2 rounded-lg p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 hover:from-blue-100 hover:to-green-100"
                >
                  {/* Record Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Heart className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{formatValue(record.campaignName)}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>Khám lần #{record.id}</span>
                          <span>•</span>
                          <span>Chiến dịch #{record.campaignId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Năm học</div>
                      <div className="font-medium text-gray-900">{formatValue(record.academicYear)}</div>
                    </div>
                  </div>

                  {/* Overall Health Rating */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Đánh giá tổng thể:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthRatingColor(record.overallHealthRating)}`}
                      >
                        {formatValue(record.overallHealthRating)}
                      </span>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Ngày khám</p>
                        <p className="font-medium text-gray-900">{formatDate(record.checkDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Bác sĩ khám</p>
                        <p className="font-medium text-gray-900">{formatValue(record.checkedByName)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Học sinh</p>
                        <p className="font-medium text-gray-900">{formatValue(record.studentName)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Physical Measurements */}
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Chỉ số cơ thể
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Ruler className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-xs text-gray-500">Chiều cao</p>
                        <p className="font-semibold text-gray-900">{formatValue(record.heightCm)} cm</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Weight className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-xs text-gray-500">Cân nặng</p>
                        <p className="font-semibold text-gray-900">{formatValue(record.weightKg)} kg</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Activity className="w-5 h-5 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500">BMI</p>
                        <p className={`font-semibold ${bmiStatus.color}`}>{formatValue(record.bmi)}</p>
                        <p className={`text-xs ${bmiStatus.color}`}>{bmiStatus.status}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Droplets className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-xs text-gray-500">Huyết áp</p>
                        <p className="font-semibold text-gray-900">{formatValue(record.bloodPressure)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      Dấu hiệu sinh tồn
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Thermometer className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Nhiệt độ</p>
                          <p className={`font-medium ${tempStatus.color}`}>{formatValue(record.temperature)}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Heart className="w-4 h-4 text-red-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Mạch</p>
                          <p className={`font-medium ${pulseStatus.color}`}>{formatValue(record.pulse)} bpm</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sensory Functions */}
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Chức năng cảm giác
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Eye className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Thị lực</p>
                          <p className="font-medium text-gray-900">
                            T: {formatValue(record.visionLeft)} | P: {formatValue(record.visionRight)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Ear className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Thính lực</p>
                          <p className="font-medium text-gray-900">{formatValue(record.hearing)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <Stethoscope className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Răng miệng</p>
                          <p className="font-medium text-gray-900">{formatValue(record.dentalHealth)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {record.recommendation && (
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
                      <h6 className="font-medium text-blue-800 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Khuyến nghị:
                      </h6>
                      <p className="text-sm text-blue-700 leading-relaxed">{record.recommendation}</p>
                    </div>
                  )}

                  {/* Follow-up Notes */}
                  {record.followUpNotes && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
                      <h6 className="font-medium text-yellow-800 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Ghi chú theo dõi:
                      </h6>
                      <p className="text-sm text-yellow-700 leading-relaxed">{record.followUpNotes}</p>
                      {record.followUpRequired && (
                        <div className="mt-2 flex items-center">
                          <CheckCircle className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm text-yellow-700 font-medium">Cần theo dõi thêm</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Other Notes */}
                  {record.otherNotes && (
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Ghi chú khác:
                      </h6>
                      <p className="text-sm text-gray-700 leading-relaxed">{record.otherNotes}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Health Summary Statistics */}
      {healthRecords.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê sức khỏe</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Tổng lần khám</p>
                  <p className="text-2xl font-bold text-blue-800">{healthRecords.length}</p>
                </div>
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">BMI gần nhất</p>
                  <p className="text-2xl font-bold text-green-800">
                    {healthRecords.length > 0 ? formatValue(healthRecords[0]?.bmi) : "N/A"}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Chiều cao gần nhất</p>
                  <p className="text-lg font-bold text-purple-800">
                    {healthRecords.length > 0 ? `${formatValue(healthRecords[0]?.heightCm)} cm` : "N/A"}
                  </p>
                </div>
                <Ruler className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600">Cân nặng gần nhất</p>
                  <p className="text-lg font-bold text-orange-800">
                    {healthRecords.length > 0 ? `${formatValue(healthRecords[0]?.weightKg)} kg` : "N/A"}
                  </p>
                </div>
                <Weight className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default StudentHealthProfile
