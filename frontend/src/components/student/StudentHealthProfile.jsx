"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HeartPulse } from "lucide-react" // Chỉ giữ lại các icon cần thiết
import { Card, CardContent } from "@/components/ui/card"
import StudentOverallHealthProfile from "./StudentOverallHealthProfile" // Chỉ import component này

const StudentHealthProfile = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"))
    setCurrentUser(user)
    setLoadingUser(false)
  }, [])

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Đang tải thông tin người dùng...</span>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <CardContent>
            <p className="text-gray-700">Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</p>
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
              <HeartPulse className="w-8 h-8 text-white" /> {/* Icon phù hợp hơn cho hồ sơ sức khỏe */}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Hồ sơ sức khỏe của tôi</h1>
              <p className="text-green-100">Xem thông tin sức khỏe tổng quát của bạn</p>
            </div>
          </div>
        </motion.div>

        {/* Content Area - Directly render StudentOverallHealthProfile */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <StudentOverallHealthProfile selectedStudent={currentUser} />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default StudentHealthProfile
