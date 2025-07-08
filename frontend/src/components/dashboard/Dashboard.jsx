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
      console.log("response",response);
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

  // Dữ liệu cho biểu đồ tròn
  const userStatsData = overview ? [
    { name: 'Học sinh', value: overview.userStats?.totalStudents || 0, color: '#3B82F6' },
    { name: 'Phụ huynh', value: overview.userStats?.totalParents || 0, color: '#10B981' },
    { name: 'Y tế', value: overview.userStats?.totalNurses || 0, color: '#F59E0B' },
    { name: 'Admin', value: overview.userStats?.totalAdmins || 0, color: '#EF4444' },
  ] : [];

  const healthCampaignData = overview ? [
    { name: 'Đã đồng ý', value: overview.healthCampaignStats?.totalAgreed || 0, color: '#10B981' },
    { name: 'Đã từ chối', value: overview.healthCampaignStats?.totalRejected || 0, color: '#EF4444' },
    { name: 'Chờ phản hồi', value: overview.healthCampaignStats?.totalPending || 0, color: '#F59E0B' },
    { name: 'Đã hoàn thành', value: overview.healthCampaignStats?.totalDone || 0, color: '#8B5CF6' },
  ] : [];

  const vaccinationCampaignData = overview ? [
    { name: 'Đã đồng ý', value: overview.vaccinationCampaignStats?.totalAgreed || 0, color: '#10B981' },
    { name: 'Đã từ chối', value: overview.vaccinationCampaignStats?.totalRejected || 0, color: '#EF4444' },
    { name: 'Chờ phản hồi', value: overview.vaccinationCampaignStats?.totalPending || 0, color: '#F59E0B' },
    { name: 'Đã hoàn thành', value: overview.vaccinationCampaignStats?.totalDone || 0, color: '#8B5CF6' },
  ] : [];

  const healthCampaignStatusData = overview ? [
    { name: 'Chờ duyệt', value: overview.healthCampaignStatusStats?.pending || 0, color: '#F59E0B' },
    { name: 'Đã duyệt', value: overview.healthCampaignStatusStats?.approved || 0, color: '#10B981' },
    { name: 'Đang diễn ra', value: overview.healthCampaignStatusStats?.active || 0, color: '#3B82F6' },
    { name: 'Đã xong', value: overview.healthCampaignStatusStats?.done || 0, color: '#8B5CF6' },
    { name: 'Đã từ chối', value: overview.healthCampaignStatusStats?.rejected || 0, color: '#EF4444' },
  ] : [];

  const vaccinationCampaignStatusData = overview ? [
    { name: 'Chờ duyệt', value: overview.vaccinationCampaignStatusStats?.pending || 0, color: '#F59E0B' },
    { name: 'Đã duyệt', value: overview.vaccinationCampaignStatusStats?.approved || 0, color: '#10B981' },
    { name: 'Đang diễn ra', value: overview.vaccinationCampaignStatusStats?.active || 0, color: '#3B82F6' },
    { name: 'Đã xong', value: overview.vaccinationCampaignStatusStats?.done || 0, color: '#8B5CF6' },
    { name: 'Đã từ chối', value: overview.vaccinationCampaignStatusStats?.rejected || 0, color: '#EF4444' },
  ] : [];

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
      {loadingOverview && <div>Đang tải dữ liệu tổng quan...</div>}
      {errorOverview && <div className="text-red-500">{errorOverview}</div>}
      {overview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Biểu đồ phân bố người dùng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Phân bố người dùng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userStatsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    // label={({ name, value }) => `${name}: ${value}`}
                  >
                    {userStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Biểu đồ chiến dịch sức khỏe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Chiến dịch sức khỏe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthCampaignData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    // label={({ name, value }) => `${name}: ${value}`}
                  >
                    {healthCampaignData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Biểu đồ chiến dịch tiêm chủng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Syringe className="w-5 h-5 text-purple-600" />
                <span>Chiến dịch tiêm chủng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vaccinationCampaignData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    // label={({ name, value }) => `${name}: ${value}`}
                  >
                    {vaccinationCampaignData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Biểu đồ trạng thái chiến dịch sức khỏe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ListChecks className="w-5 h-5 text-yellow-600" />
                <span>Trạng thái chiến dịch sức khỏe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthCampaignStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    // label={({ name, value }) => `${name}: ${value}`}
                  >
                    {healthCampaignStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Biểu đồ trạng thái chiến dịch tiêm chủng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ListChecks className="w-5 h-5 text-pink-600" />
                <span>Trạng thái chiến dịch tiêm chủng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vaccinationCampaignStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    // label={({ name, value }) => `${name}: ${value}`}
                  >
                    {vaccinationCampaignStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
