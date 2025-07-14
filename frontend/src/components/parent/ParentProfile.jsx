"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Mail, Phone, Calendar, MapPin, Shield, Hash, UserCheck } from "lucide-react"
import ParentService from "../../api/services/parent.service"

const ParentProfile = () => {
  const [students, setStudents] = useState([])
  const [parent, setParent] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [studentRes, parentRes] = await Promise.all([
          ParentService.getStudent(),
          ParentService.getParentProfile(),
        ])
        setStudents(studentRes.data)
        console.log("Students:", studentRes.data)

        setParent(parentRes.data)
        console.log("Parent:", parentRes.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  const getStatusBadge = (status) => {
    if (!status)
      return <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full">N/A</span>

    const isActive = status === "ACTIVE"
    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {status}
      </span>
    )
  }

  const getInitials = (name) => {
    if(parent.avartaUrl!=null) return <img src={parent.avartaUrl} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
    if (!name) return "N/A"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStudentInitials = (name) => {
    if(parent.avartaUrl!=null) return <img src={student.avartaUrl} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
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
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Thông tin Phụ huynh</h1>
              <p className="text-blue-100">Hệ thống quản lý sức khỏe học sinh</p>
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
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(parent.fullName)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{formatValue(parent.fullName)}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {formatValue(parent.email)}
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
                    <p className="text-lg font-semibold text-gray-900">{formatValue(parent.fullName)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <Phone className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Số điện thoại</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(parent.phoneNumber)}</p>
                  </div>
                </motion.div>

                {/* <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <Shield className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Vai trò</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {formatValue(parent.roleName)}
                    </span>
                  </div>
                </motion.div> */}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <Calendar className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Ngày sinh</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(parent.dob)}</p>
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
                  <Mail className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                    <p className="text-lg font-semibold text-gray-900 break-all">{formatValue(parent.email)}</p>
                  </div>
                </motion.div>

                {/* <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <UserCheck className="w-5 h-5 text-cyan-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Tên đăng nhập</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(parent.userName)}</p>
                  </div>
                </motion.div> */}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <MapPin className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Địa chỉ</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(parent.address)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <User className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Giới tính</p>
                    <p className="text-lg font-semibold text-gray-900">{formatValue(parent.gender)}</p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-8 pt-6 border-t border-gray-200"
            >
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Ngày tạo: {formatDate(parent.dateCreated)}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Cập nhật lần cuối: {formatDate(parent.updatedAt)}</span>
              </div>
            </div> */}
            </motion.div>
          </div>
        </motion.div>

        {/* Students Section - Detailed */}
        {students && students.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-500" />
                Danh sách học sinh ({students.length})
              </h3>

              <div className="grid gap-6">
                {students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Student Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                          {getStudentInitials(student.user?.fullName)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{formatValue(student.user?.fullName)}</h4>
                          <p className="text-sm text-gray-600">
                            Mã học sinh:{" "}
                            <span className="font-medium text-blue-600">{formatValue(student.studentCode)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">{getStatusBadge(student.user?.status)}</div>
                    </div>

                    {/* Student Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700 border-b pb-1">Thông tin cơ bản</h5>

                        <div className="flex items-center space-x-2 text-sm">
                          <User className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-600">Giới tính:</span>
                          <span className="font-medium">{formatValue(student.user?.gender)}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-orange-500" />
                          <span className="text-gray-600">Ngày sinh:</span>
                          <span className="font-medium">{formatDate(student.user?.dob)}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Hash className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-600">Lớp:</span>
                          <span className="font-medium">{formatValue(student.className.substring(6,8))}</span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-700 border-b pb-1">Thông tin liên hệ</h5>

                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">SĐT:</span>
                          <span className="font-medium">{formatValue(student.user?.phoneNumber)}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-xs break-all">{formatValue(student.user?.email)}</span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="w-4 h-4 text-pink-500" />
                          <span className="text-gray-600">Địa chỉ:</span>
                          <span className="font-medium">{formatValue(student.user?.address)}</span>
                        </div>

                        {/* <div className="flex items-center space-x-2 text-sm">
                          <UserCheck className="w-4 h-4 text-cyan-500" />
                          <span className="text-gray-600">Tên đăng nhập:</span>
                          <span className="font-medium">{formatValue(student.user?.userName)}</span>
                        </div> */}
                      </div>
                    </div>

                    {/* Timestamps */}
                    {/* <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Tạo: {formatDate(student.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Cập nhật: {formatDate(student.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>User tạo: {formatDate(student.user?.dateCreated)}</span>
                      </div>
                    </div>
                  </div> */}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ParentProfile
