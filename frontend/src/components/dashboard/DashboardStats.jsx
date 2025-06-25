
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Pill, Activity, TrendingUp, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const DashboardStats = () => {
  const { user } = useAuth();

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'Admin':
        return [
          { title: 'Tổng người dùng', value: '1,234', icon: Users, color: 'from-blue-500 to-blue-600', change: '+12%' },
          { title: 'Lịch tiêm hôm nay', value: '45', icon: Calendar, color: 'from-green-500 to-green-600', change: '+8%' },
          { title: 'Thuốc trong kho', value: '89', icon: Pill, color: 'from-purple-500 to-purple-600', change: '-3%' },
          { title: 'Báo cáo sức khỏe', value: '156', icon: Activity, color: 'from-orange-500 to-orange-600', change: '+15%' }
        ];
      case 'Manager':
        return [
          { title: 'Học sinh quản lý', value: '456', icon: Users, color: 'from-blue-500 to-blue-600', change: '+5%' },
          { title: 'Lịch tiêm tuần này', value: '23', icon: Calendar, color: 'from-green-500 to-green-600', change: '+12%' },
          { title: 'Báo cáo chờ duyệt', value: '12', icon: Activity, color: 'from-orange-500 to-orange-600', change: '+3%' },
          { title: 'Tỷ lệ hoàn thành', value: '94%', icon: TrendingUp, color: 'from-purple-500 to-purple-600', change: '+2%' }
        ];
      case 'School Nurse':
        return [
          { title: 'Bệnh nhân hôm nay', value: '18', icon: Users, color: 'from-blue-500 to-blue-600', change: '+6%' },
          { title: 'Thuốc cần bổ sung', value: '7', icon: Pill, color: 'from-red-500 to-red-600', change: '+2' },
          { title: 'Lịch tiêm tuần này', value: '34', icon: Calendar, color: 'from-green-500 to-green-600', change: '+8%' },
          { title: 'Khám sức khỏe', value: '67', icon: Heart, color: 'from-pink-500 to-pink-600', change: '+11%' }
        ];
      case 'Student':
        return [
          { title: 'Điểm sức khỏe', value: '85/100', icon: Heart, color: 'from-green-500 to-green-600', change: '+5' },
          { title: 'Lịch tiêm tiếp theo', value: '7 ngày', icon: Calendar, color: 'from-blue-500 to-blue-600', change: '' },
          { title: 'Hoạt động thể chất', value: '4/7 ngày', icon: Activity, color: 'from-purple-500 to-purple-600', change: '+1' },
          { title: 'Khám định kỳ', value: '2 tháng', icon: Users, color: 'from-orange-500 to-orange-600', change: '' }
        ];
      case 'Parent':
        return [
          { title: 'Con em theo dõi', value: '2', icon: Users, color: 'from-blue-500 to-blue-600', change: '' },
          { title: 'Lịch tiêm sắp tới', value: '1', icon: Calendar, color: 'from-green-500 to-green-600', change: '' },
          { title: 'Thông báo mới', value: '5', icon: Activity, color: 'from-orange-500 to-orange-600', change: '+2' },
          { title: 'Tình trạng sức khỏe', value: 'Tốt', icon: Heart, color: 'from-green-500 to-green-600', change: '' }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                {stat.change && (
                  <p className={`text-xs ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} từ tháng trước
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
