"use client"

import { motion } from "framer-motion"
import { Syringe, Calendar, User, Shield, CheckCircle, AlertCircle, Clock } from "lucide-react"

const VaccinationHistory = ({ selectedStudent, vaccinationHistory, formatValue, formatDate, getStatusColor }) => {
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
