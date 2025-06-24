
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Activity, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) greeting = 'Chào buổi sáng';
    else if (hour < 18) greeting = 'Chào buổi chiều';
    else greeting = 'Chào buổi tối';

    return `${greeting}, ${user?.username}!`;
  };

  const getRecentActivities = () => {
    switch (user?.role) {
      case 'Admin':
        return [
          { id: 1, action: 'Tạo tài khoản mới cho Nguyễn Văn A', time: '10 phút trước', type: 'user' },
          { id: 2, action: 'Cập nhật lịch tiêm chủng tháng 6', time: '1 giờ trước', type: 'vaccination' },
          { id: 3, action: 'Phê duyệt báo cáo sức khỏe', time: '2 giờ trước', type: 'report' },
          { id: 4, action: 'Thêm thuốc mới vào kho', time: '3 giờ trước', type: 'medicine' }
        ];
      case 'Manager':
        return [
          { id: 1, action: 'Duyệt đơn xin nghỉ phép', time: '30 phút trước', type: 'approval' },
          { id: 2, action: 'Cập nhật thông tin học sinh', time: '1 giờ trước', type: 'student' },
          { id: 3, action: 'Tạo báo cáo tuần', time: '2 giờ trước', type: 'report' }
        ];
      case 'SCHOOL_NURSE':
        return [
          { id: 1, action: 'Khám sức khỏe cho học sinh lớp 10A', time: '15 phút trước', type: 'checkup' },
          { id: 2, action: 'Cập nhật tồn kho thuốc', time: '45 phút trước', type: 'medicine' },
          { id: 3, action: 'Tiêm vắc xin cho 5 học sinh', time: '1 giờ trước', type: 'vaccination' }
        ];
      case 'Student':
        return [
          { id: 1, action: 'Hoàn thành bài tập thể dục', time: '2 giờ trước', type: 'exercise' },
          { id: 2, action: 'Cập nhật thông tin sức khỏe', time: '1 ngày trước', type: 'health' },
          { id: 3, action: 'Đăng ký lịch khám định kỳ', time: '2 ngày trước', type: 'appointment' }
        ];
      case 'Parent':
        return [
          { id: 1, action: 'Xem báo cáo sức khỏe con', time: '1 giờ trước', type: 'report' },
          { id: 2, action: 'Đăng ký lịch tiêm cho con', time: '1 ngày trước', type: 'vaccination' },
          { id: 3, action: 'Nhận thông báo từ trường', time: '2 ngày trước', type: 'notification' }
        ];
      default:
        return [];
    }
  };

  const getUpcomingEvents = () => {
    switch (user?.role) {
      case 'Admin':
      case 'Manager':
        return [
          { id: 1, title: 'Họp ban giám hiệu', date: '2024-06-15', time: '09:00' },
          { id: 2, title: 'Kiểm tra kho thuốc', date: '2024-06-16', time: '14:00' },
          { id: 3, title: 'Đào tạo nhân viên y tế', date: '2024-06-18', time: '08:30' }
        ];
      case 'School Nurse':
        return [
          { id: 1, title: 'Tiêm vắc xin lớp 11A', date: '2024-06-15', time: '10:00' },
          { id: 2, title: 'Khám sức khỏe định kỳ', date: '2024-06-17', time: '08:00' },
          { id: 3, title: 'Họp y tế trường', date: '2024-06-19', time: '15:00' }
        ];
      case 'Student':
        return [
          { id: 1, title: 'Khám sức khỏe định kỳ', date: '2024-06-20', time: '09:00' },
          { id: 2, title: 'Tiêm vắc xin cúm', date: '2024-06-25', time: '10:30' },
          { id: 3, title: 'Kiểm tra thị lực', date: '2024-06-28', time: '14:00' }
        ];
      case 'Parent':
        return [
          { id: 1, title: 'Họp phụ huynh', date: '2024-06-22', time: '18:00' },
          { id: 2, title: 'Tiêm vắc xin cho con', date: '2024-06-25', time: '10:30' },
          { id: 3, title: 'Khám sức khỏe con', date: '2024-06-30', time: '09:00' }
        ];
      default:
        return [];
    }
  };

  const recentActivities = getRecentActivities();
  const upcomingEvents = getUpcomingEvents();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900"
          >
            {getWelcomeMessage()}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mt-2"
          >
            Chào mừng bạn đến với hệ thống quản lý sức khỏe học sinh
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          className="text-right"
        >
          <p className="text-sm text-gray-500">Hôm nay</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </motion.div>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Hoạt động gần đây</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span>Lịch sắp tới</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('vi-VN')} - {event.time}
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="card-hover bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Users className="w-5 h-5" />
              <span>Thống kê người dùng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Học sinh:</span>
                <span className="font-semibold text-blue-900">1,234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Giáo viên:</span>
                <span className="font-semibold text-blue-900">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Phụ huynh:</span>
                <span className="font-semibold text-blue-900">856</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <TrendingUp className="w-5 h-5" />
              <span>Tỷ lệ tiêm chủng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-green-700">COVID-19</span>
                  <span className="text-sm font-semibold text-green-900">95%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-green-700">Cúm mùa</span>
                  <span className="text-sm font-semibold text-green-900">78%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Activity className="w-5 h-5" />
              <span>Sức khỏe tổng quan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Tốt:</span>
                <span className="font-semibold text-purple-900">89%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Trung bình:</span>
                <span className="font-semibold text-purple-900">8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-purple-700">Cần chú ý:</span>
                <span className="font-semibold text-purple-900">3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
