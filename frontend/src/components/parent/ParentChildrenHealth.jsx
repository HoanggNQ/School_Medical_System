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
  const [activeTab, setActiveTab] = useState("health-records") // "health-records", "vaccination", or "send-medicine"
  const [healthRecords, setHealthRecords] = useState([])
  const [vaccinationHistory, setVaccinationHistory] = useState([])
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
          // Fetch health data for the first student
          await fetchHealthData(studentRes.data[0].id)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const fetchHealthData = async (studentId) => {
    try {
      // Fetch real health check data from API
      const studentHealthCheck = await ParentService.getStudentHealthCheck(studentId)
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

      // Keep mock data for vaccination history (unchanged)
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
      console.error("Error fetching health data:", error)
      setHealthRecords([])
      setVaccinationHistory([])
    }
  }

  const handleStudentChange = async (student) => {
    setSelectedStudent(student)
    await fetchHealthData(student.id)
  }

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
                  onClick={() => handleStudentChange(student)}
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
            {activeTab === "health-records" && (
              <HealthRecords
                selectedStudent={selectedStudent}
                healthRecords={healthRecords}
                formatValue={formatValue}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
              />
            )}

            {activeTab === "vaccination" && (
              <VaccinationHistory
                selectedStudent={selectedStudent}
                vaccinationHistory={vaccinationHistory}
                formatValue={formatValue}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
              />
            )}

            {activeTab === "send-medicine" && (
              <SendMedicine selectedStudent={selectedStudent} formatValue={formatValue} />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default StudentHealth
