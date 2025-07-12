"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Syringe,
  Calendar,
  User,
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Stethoscope,
  Shield,
} from "lucide-react"
import studentService from "../../api/services/student.service"

const StudentVaccinationHistory = () => {
  const [vaccinationRecords, setVaccinationRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchStudentVaccinationRecord = async () => {
      try {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem("currentUser"))
        setCurrentUser(user)

        const response = await studentService.getStudentVaccinationRecord(user.id)
        console.log("Student Vaccination Records:", response)

        if (response && response.data) {
          setVaccinationRecords(response.data)
        } else {
          setVaccinationRecords([])
        }
      } catch (error) {
        console.error("Error fetching vaccination records:", error)
        setError("Không thể tải lịch sử tiêm chủng")
        setVaccinationRecords([])
      } finally {
        setLoading(false)
      }
    }

    fetchStudentVaccinationRecord()
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

  const getVaccineIcon = (vaccineName) => {
    if (vaccineName?.toLowerCase().includes("covid")) {
      return <Shield className="w-6 h-6 text-blue-600" />
    } else if (vaccineName?.toLowerCase().includes("cúm")) {
      return <Stethoscope className="w-6 h-6 text-green-600" />
    }
    return <Syringe className="w-6 h-6 text-purple-600" />
  }

  const getVaccineColor = (vaccineName) => {
    if (vaccineName?.toLowerCase().includes("covid")) {
      return "bg-blue-50 border-blue-200 hover:bg-blue-100"
    } else if (vaccineName?.toLowerCase().includes("cúm")) {
      return "bg-green-50 border-green-200 hover:bg-green-100"
    }
    return "bg-purple-50 border-purple-200 hover:bg-purple-100"
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-gray-600">Đang tải lịch sử tiêm chủng...</span>
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Syringe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Lịch sử tiêm chủng</h2>
              <p className="text-purple-100">Theo dõi các mũi tiêm vaccine của {formatValue(currentUser?.fullName)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{vaccinationRecords.length}</div>
            <div className="text-sm text-purple-100">Tổng số mũi tiêm</div>
          </div>
        </div>
      </div>

      {/* Student Info Card */}
      {/* {currentUser && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
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
      )} */}

      {/* Vaccination Records */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Syringe className="w-6 h-6 mr-2 text-purple-500" />
            Hồ sơ tiêm chủng
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4" />
            <span>{vaccinationRecords.length} bản ghi</span>
          </div>
        </div> */}

        {vaccinationRecords.length === 0 ? (
          <div className="text-center py-12">
            <Syringe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch sử tiêm chủng</h4>
            <p className="text-gray-500">Thông tin tiêm chủng sẽ được cập nhật khi có vaccine mới</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vaccinationRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`border-2 rounded-lg p-6 hover:shadow-md transition-all duration-200 ${getVaccineColor(record.vaccineName)}`}
              >
                {/* Record Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getVaccineIcon(record.vaccineName)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{formatValue(record.vaccineName)}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Mũi tiêm #{record.id}</span>
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

                {/* Record Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Ngày tiêm</p>
                      <p className="font-medium text-gray-900">{formatDate(record.administrationDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Người thực hiện</p>
                      <p className="font-medium text-gray-900">{formatValue(record.administrationByName)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Vị trí tiêm</p>
                      <p className="font-medium text-gray-900">{formatValue(record.injectionSite)}</p>
                    </div>
                  </div>

                  {record.nextDoseDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Mũi tiếp theo</p>
                        <p className="font-medium text-gray-900">{formatDate(record.nextDoseDate)}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 md:col-span-2">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Học sinh</p>
                      <p className="font-medium text-gray-900">{formatValue(record.studentName)}</p>
                    </div>
                  </div>
                </div>

                {/* Follow-up Notes */}
                {record.followUpNotes && (
                  <div className="bg-white bg-opacity-60 p-4 rounded-lg mb-4">
                    <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Ghi chú theo dõi:
                    </h6>
                    <p className="text-sm text-gray-700 leading-relaxed">{record.followUpNotes}</p>
                  </div>
                )}

                {/* Reaction Notes */}
                {record.reactionNotes && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <h6 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Phản ứng sau tiêm:
                    </h6>
                    <p className="text-sm text-yellow-700 leading-relaxed">{record.reactionNotes}</p>
                  </div>
                )}

                {/* No reaction note */}
                {!record.reactionNotes && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-700 font-medium">Không có phản ứng bất thường</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      {vaccinationRecords.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê tiêm chủng</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">Tổng số mũi tiêm</p>
                  <p className="text-2xl font-bold text-blue-800">{vaccinationRecords.length}</p>
                </div>
                <Syringe className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Loại vaccine</p>
                  <p className="text-2xl font-bold text-green-800">
                    {new Set(vaccinationRecords.map((r) => r.vaccineName)).size}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">Năm học gần nhất</p>
                  <p className="text-lg font-bold text-purple-800">
                    {vaccinationRecords.length > 0
                      ? vaccinationRecords.sort(
                          (a, b) => new Date(b.administrationDate) - new Date(a.administrationDate),
                        )[0]?.academicYear || "N/A"
                      : "N/A"}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default StudentVaccinationHistory
