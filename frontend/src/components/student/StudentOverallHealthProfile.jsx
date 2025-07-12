"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  HeartPulse,
  Ruler,
  Scale,
  Eye,
  Ear,
  SmileIcon as Tooth,
  Heart,
  Thermometer,
  Droplet,
  ShieldOff,
  Bug as Virus,
  Pill,
  FileText,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ParentService from "../../api/services/parent.service" // Đảm bảo đường dẫn đúng

const StudentOverallHealthProfile = ({ selectedStudent }) => {
  const [healthProfile, setHealthProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHealthProfile = async () => {
      if (!selectedStudent?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await ParentService.getStudentHealthProfile(selectedStudent.id)
        console.log("Student Health Profile API Response:", response)

        if (response) {
          setHealthProfile(response) // API trả về trực tiếp object data
        } else {
          setHealthProfile(null)
          setError("Không tìm thấy dữ liệu hồ sơ sức khỏe.")
        }
      } catch (err) {
        console.error("Error fetching student health profile:", err)
        setError("Không thể tải hồ sơ sức khỏe: " + err.message)
        setHealthProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthProfile()
  }, [selectedStudent?.id])

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "" || String(value).trim() === "null") {
      return "Không"
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

  if (!healthProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center py-12">
            <HeartPulse className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Không có hồ sơ sức khỏe</h4>
            <p className="text-gray-500">Chưa có thông tin hồ sơ sức khỏe nào được ghi nhận cho học sinh này.</p>
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
      {/* <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Hồ sơ sức khỏe</h2>
              <p className="text-pink-100">Thông tin sức khỏe của {formatValue(selectedStudent?.user?.fullName)}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* General Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HeartPulse className="w-5 h-5 mr-2" />
            Chỉ số sức khỏe tổng quát
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Ruler className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Chiều cao</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.heightCm)} cm</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Scale className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Cân nặng</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.weightKg)} kg</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <HeartPulse className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">BMI</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.bmi)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Eye className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Thị lực (Trái/Phải)</p>
                <p className="font-medium text-gray-900">
                  {formatValue(healthProfile.visionLeft)} / {formatValue(healthProfile.visionRight)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Ear className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-sm text-gray-600">Thính lực</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.hearing)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Tooth className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Sức khỏe răng miệng</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.dentalHealth)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Chỉ số quan trọng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Heart className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Huyết áp</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.bloodPressure)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <HeartPulse className="w-5 h-5 text-indigo-500" />
              <div>
                <p className="text-sm text-gray-600">Nhịp tim</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.pulse)} bpm</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Thermometer className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Nhiệt độ</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.temperature)} °C</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Droplet className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Nhóm máu</p>
                <p className="font-medium text-gray-900">{formatValue(healthProfile.bloodType)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Tiền sử bệnh lý
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Virus className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600">Bệnh di truyền</p>
                  <p className="font-medium text-gray-900">{formatValue(healthProfile.geneticDiseases)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <ShieldOff className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">Dị ứng</p>
                  <p className="font-medium text-gray-900">{formatValue(healthProfile.allergies)}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Virus className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Bệnh mãn tính</p>
                  <p className="font-medium text-gray-900">{formatValue(healthProfile.chronicDiseases)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Pill className="w-5 h-5 text-teal-500" />
                <div>
                  <p className="text-sm text-gray-600">Thuốc đang dùng</p>
                  <p className="font-medium text-gray-900">{formatValue(healthProfile.currentMedications)}</p>
                </div>
              </div>
            </div>
          </div>
          {healthProfile.otherMedicalNotes && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Ghi chú y tế khác
              </h4>
              <p className="text-gray-900 leading-relaxed">{formatValue(healthProfile.otherMedicalNotes)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default StudentOverallHealthProfile
