import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, User, UserCheck, UserX, UserPlus, Activity, Calendar, Syringe, TrendingUp, CheckCircle, XCircle, Clock, ListChecks } from 'lucide-react';

import AuthService from '../../api/services/auth.service';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const [overview, setOverview] = React.useState(null);
  const [loadingOverview, setLoadingOverview] = React.useState(true);
  const [errorOverview, setErrorOverview] = React.useState(null);

  useEffect(() => {
    fetchOverview();
  }, []);

  const fetchOverview = async () => {
    try {
      setLoadingOverview(true);
      const response = await AuthService.getDashboardOverview();
      console.log("response", response);
      setOverview(response.data);
      setErrorOverview(null);
    } catch (err) {
      setErrorOverview('Không thể tải dữ liệu tổng quan dashboard.');
    } finally {
      setLoadingOverview(false);
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Chào buổi sáng';
    else if (hour < 18) greeting = 'Chào buổi chiều';
    else greeting = 'Chào buổi tối';
    return `${greeting}, ${user?.username || ''}!`;
  };

  // Tạo dữ liệu cho biểu đồ từ API response
  const getUserStatsData = () => {
    if (!overview?.userStats) return [];
    
    const { totalStudents, totalParents, totalNurses, totalAdmins } = overview.userStats;
    
    return [
      { name: 'Học sinh', value: totalStudents || 0, color: '#3B82F6' },
      { name: 'Phụ huynh', value: totalParents || 0, color: '#10B981' },
      { name: 'Y tế', value: totalNurses || 0, color: '#F59E0B' },
      { name: 'Admin', value: totalAdmins || 0, color: '#EF4444' },
    ].filter(item => item.value > 0);
  };

  const getHealthCampaignData = () => {
    if (!overview?.healthCampaignStats) return [];
    
    const { totalAgreed, totalRejected, totalPending, totalDone } = overview.healthCampaignStats;
    
    return [
      { name: 'Đã đồng ý', value: totalAgreed || 0, color: '#10B981' },
      { name: 'Đã từ chối', value: totalRejected || 0, color: '#EF4444' },
      { name: 'Chờ phản hồi', value: totalPending || 0, color: '#F59E0B' },
      { name: 'Đã hoàn thành', value: totalDone || 0, color: '#8B5CF6' },
    ].filter(item => item.value > 0);
  };

  const getVaccinationCampaignData = () => {
    if (!overview?.vaccinationCampaignStats) return [];
    
    const { totalAgreed, totalRejected, totalPending, totalDone } = overview.vaccinationCampaignStats;
    
    return [
      { name: 'Đã đồng ý', value: totalAgreed || 0, color: '#10B981' },
      { name: 'Đã từ chối', value: totalRejected || 0, color: '#EF4444' },
      { name: 'Chờ phản hồi', value: totalPending || 0, color: '#F59E0B' },
      { name: 'Đã hoàn thành', value: totalDone || 0, color: '#8B5CF6' },
    ].filter(item => item.value > 0);
  };

  const getHealthCampaignStatusData = () => {
    if (!overview?.healthCampaignStatusStats) return [];
    
    const { pending, approved, active, done, rejected } = overview.healthCampaignStatusStats;
    
    return [
      { name: 'Chờ duyệt', value: pending || 0, color: '#F59E0B' },
      { name: 'Đã duyệt', value: approved || 0, color: '#10B981' },
      { name: 'Đang diễn ra', value: active || 0, color: '#3B82F6' },
      { name: 'Đã xong', value: done || 0, color: '#8B5CF6' },
      { name: 'Đã từ chối', value: rejected || 0, color: '#EF4444' },
    ].filter(item => item.value > 0);
  };

  const getVaccinationCampaignStatusData = () => {
    if (!overview?.vaccinationCampaignStatusStats) return [];
    
    const { pending, approved, active, done, rejected } = overview.vaccinationCampaignStatusStats;
    
    return [
      { name: 'Chờ duyệt', value: pending || 0, color: '#F59E0B' },
      { name: 'Đã duyệt', value: approved || 0, color: '#10B981' },
      { name: 'Đang diễn ra', value: active || 0, color: '#3B82F6' },
      { name: 'Đã xong', value: done || 0, color: '#8B5CF6' },
      { name: 'Đã từ chối', value: rejected || 0, color: '#EF4444' },
    ].filter(item => item.value > 0);
  };

  const renderPieChart = (data, title, icon) => {
    if (!data || data.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {icon}
              <span>{title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-gray-500">
              Không có dữ liệu
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

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

      {/* Hiển thị loading hoặc lỗi tổng quan dashboard */}
      {loadingOverview && (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải dữ liệu tổng quan...</div>
        </div>
      )}
      
      {errorOverview && (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">{errorOverview}</div>
        </div>
      )}
      
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Biểu đồ phân bố người dùng */}
          {renderPieChart(
            getUserStatsData(), 
            'Phân bố người dùng',
            <Users className="w-5 h-5 text-blue-600" />
          )}

          {/* Biểu đồ chiến dịch sức khỏe */}
          {renderPieChart(
            getHealthCampaignData(), 
            'Chiến dịch sức khỏe',
            <Activity className="w-5 h-5 text-green-600" />
          )}

          {/* Biểu đồ chiến dịch tiêm chủng */}
          {renderPieChart(
            getVaccinationCampaignData(), 
            'Chiến dịch tiêm chủng',
            <Syringe className="w-5 h-5 text-purple-600" />
          )}

          {/* Biểu đồ trạng thái chiến dịch sức khỏe */}
          {renderPieChart(
            getHealthCampaignStatusData(), 
            'Trạng thái chiến dịch sức khỏe',
            <ListChecks className="w-5 h-5 text-yellow-600" />
          )}

          {/* Biểu đồ trạng thái chiến dịch tiêm chủng */}
          {renderPieChart(
            getVaccinationCampaignStatusData(), 
            'Trạng thái chiến dịch tiêm chủng',
            <ListChecks className="w-5 h-5 text-pink-600" />
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;