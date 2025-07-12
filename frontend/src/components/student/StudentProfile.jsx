"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Phone, Calendar, MapPin, Hash, UserCheck, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import studentService from "../../api/services/student.service" // Đảm bảo đường dẫn đúng

const StudentProfile = () => {
  const [studentProfile, setStudentProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem("currentUser")) // Lấy currentUser từ localStorage

        if (!user?.id) {
          setError("Không tìm thấy thông tin người dùng.")
          setLoading(false)
          return
        }
        console.log("Fetching student profile for user ID:", user.id)
        const response = await studentService.getStudentProfile(user.id)
        console.log("Student Profile API Response:", response)

        if (response && response.data) {
          setStudentProfile(response.data) // Truy cập vào key 'data' lồng bên trong
        } else {
          setStudentProfile(null)
          setError("Không tìm thấy dữ liệu hồ sơ học sinh.")
        }
      } catch (err) {
        console.error("Error fetching student profile:", err)
        setError("Không thể tải hồ sơ học sinh: " + err.message)
        setStudentProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentProfile()
  }, [])

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

  const getInitials = (name) => {
    if (!name) return "N/A"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Đang tải hồ sơ học sinh...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <CardTitle className="text-red-500">Lỗi tải dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!studentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <CardTitle>Không có dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">Không tìm thấy hồ sơ học sinh.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Hồ sơ học sinh</h1>
              <p className="text-green-100">Thông tin chi tiết về {formatValue(studentProfile.fullName)}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-gray-50 to-green-50 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(studentProfile.fullName)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{formatValue(studentProfile.fullName)}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Hash className="w-4 h-4 mr-2" />
                  Mã học sinh: {formatValue(studentProfile.studentCode)}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <User className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Họ và tên</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(studentProfile.fullName)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <Calendar className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Ngày sinh</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(studentProfile.dob)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <User className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Giới tính</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(studentProfile.gender)}</p>
                  </div>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <GraduationCap className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Lớp</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(studentProfile.className)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <Phone className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(studentProfile.phoneNumber)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <MapPin className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(studentProfile.address)}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Parent Info */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-blue-500" />
                Thông tin phụ huynh
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Tên phụ huynh</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(studentProfile.parentName)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Hash className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">ID phụ huynh</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(studentProfile.parentID)}</p>
                  </div>
                </div>
              </div>
            </motion.div> */}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default StudentProfile
