"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Syringe, Stethoscope, Pill } from "lucide-react"
import ParentService from "../../api/services/parent.service"
import HealthRecords from "./health-records"
import VaccinationHistory from "./vaccination-history"
import SendMedicine from "./send-medicine"

const StudentHealth = () => {
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [activeTab, setActiveTab] = useState("health-records")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const studentRes = await ParentService.getStudent()
        setStudents(studentRes.data)
        console.log("Fetched students:", studentRes.data)

        if (studentRes.data.length > 0) {
          setSelectedStudent(studentRes.data[0])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper functions for parent component only
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A"
    }
    return String(value)
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Sức khỏe con em</h1>
              <p className="text-green-100">Theo dõi sức khỏe và lịch tiêm chủng</p>
            </div>
          </div>
        </motion.div>

        {/* Student Selection */}
        {students.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn học sinh</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedStudent?.id === student.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {getInitials(student.user?.fullName)}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{formatValue(student.user?.fullName)}</p>
                      <p className="text-sm text-gray-600">{formatValue(student.studentCode)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("health-records")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "health-records"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5" />
                  <span>Giấy khám sức khỏe</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("vaccination")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "vaccination"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Syringe className="w-5 h-5" />
                  <span>Lịch sử tiêm vắc-xin</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("send-medicine")}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "send-medicine"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Pill className="w-5 h-5" />
                  <span>Gửi thuốc</span>
                </div>
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Content Area */}
        {selectedStudent && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab === "health-records" && <HealthRecords selectedStudent={selectedStudent} />}

            {activeTab === "vaccination" && <VaccinationHistory selectedStudent={selectedStudent} />}

            {activeTab === "send-medicine" && <SendMedicine selectedStudent={selectedStudent} />}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default StudentHealth
