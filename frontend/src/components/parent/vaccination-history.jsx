"use client"

import { motion } from "framer-motion"
import { Syringe, Calendar, User, Shield, CheckCircle, AlertCircle, Clock, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import ParentService from "../../api/services/parent.service"

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

  const getVaccinationStatusBadge = (reactionNotes, nextDoseDate) => {
    const now = new Date()
    const nextDose = nextDoseDate ? new Date(nextDoseDate) : null

    if (reactionNotes && reactionNotes !== "Không có phản ứng bất thường") {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 inline-block mr-1" /> Có phản ứng
        </span>
      )
    }

    if (nextDose && nextDose > now) {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 inline-block mr-1" /> Cần tiêm mũi tiếp theo
        </span>
      )
    }

    return (
      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 inline-block mr-1" /> Đã hoàn thành
      </span>
    )
  }

  useEffect(() => {
    const fetchVaccinationData = async () => {
      if (!selectedStudent?.id) return

      try {
        setLoading(true)
        const response = await ParentService.getStudentVaccination(selectedStudent.id)
        const vaccinationData = response.data || [] // Access the 'data' key
        console.log("Fetched vaccination data:", vaccinationData)
        setVaccinationHistory(vaccinationData)
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
                    <h4 className="text-lg font-semibold text-gray-900">{formatValue(vaccination.vaccineName)}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(vaccination.administrationDate)}
                    </p>
                  </div>
                </div>
                {/* {getVaccinationStatusBadge(vaccination.reactionNotes, vaccination.nextDoseDate)} */}
              </div>

              {/* Vaccination Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <span className="text-sm text-gray-600">Địa điểm:</span>
                      <span className="ml-2 font-medium">{formatValue(vaccination.injectionSite)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <span className="text-sm text-gray-600">Năm học:</span>
                      <span className="ml-2 font-medium">{formatValue(vaccination.academicYear)}</span>
                    </div>
                  </div>

                  {vaccination.followUpNotes && (
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="text-sm text-gray-600">Ghi chú theo dõi:</span>
                        <span className="ml-2 font-medium">{formatValue(vaccination.followUpNotes)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-600">Người thực hiện:</span>
                      <span className="ml-2 font-medium">{formatValue(vaccination.administrationByName)}</span>
                    </div>
                  </div>

                  {/* <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <div>
                      <span className="text-sm text-gray-600">Mũi tiếp theo:</span>
                      <span className="ml-2 font-medium">{formatDate(vaccination.nextDoseDate)}</span>
                    </div>
                  </div> */}

                  {/* Reaction Notes / Side Effects */}
                  <div className="flex items-center space-x-3">
                    {vaccination.reactionNotes === "Không có phản ứng bất thường" || !vaccination.reactionNotes ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Tác dụng phụ:</span>
                      <span className="ml-2 font-medium">{formatValue(vaccination.reactionNotes || "Không có")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Due Alert */}
              {vaccination.nextDoseDate && new Date(vaccination.nextDoseDate) > new Date() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      <strong>Lưu ý:</strong> Cần tiêm mũi tiếp theo vào ngày {formatDate(vaccination.nextDoseDate)}
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
