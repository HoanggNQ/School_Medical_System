import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  Calendar, 
  Syringe, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ListChecks,
  Stethoscope,
  Pill,
  Heart,
  AlertTriangle,
  Users,
  FileText
} from 'lucide-react';

import AuthService from '../../api/services/auth.service';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/vi';

// Set moment locale to Vietnamese
moment.locale('vi');
const localizer = momentLocalizer(moment);

const DashboardNurse1 = () => {
  const { user } = useAuth();
  const [overview, setOverview] = React.useState(null);
  const [loadingOverview, setLoadingOverview] = React.useState(true);
  const [errorOverview, setErrorOverview] = React.useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchOverview();
    fetchEvents();
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

  const fetchEvents = async () => {
    // Mock data for calendar events - replace with actual API call
    const mockEvents = [
      {
        id: 1,
        title: 'Khám sức khỏe lớp 10A1',
        start: new Date(2024, 0, 15, 8, 0),
        end: new Date(2024, 0, 15, 10, 0),
        type: 'health-check',
        location: 'Phòng y tế',
        status: 'scheduled'
      },
      {
        id: 2,
        title: 'Tiêm chủng lớp 9B2',
        start: new Date(2024, 0, 16, 14, 0),
        end: new Date(2024, 0, 16, 16, 0),
        type: 'vaccination',
        location: 'Phòng tiêm chủng',
        status: 'scheduled'
      },
      {
        id: 3,
        title: 'Phát thuốc học sinh',
        start: new Date(2024, 0, 17, 9, 0),
        end: new Date(2024, 0, 17, 11, 0),
        type: 'medication',
        location: 'Phòng y tế',
        status: 'scheduled'
      }
    ];
    setEvents(mockEvents);
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    if (hour < 12) greeting = 'Chào buổi sáng';
    else if (hour < 18) greeting = 'Chào buổi chiều';
    else greeting = 'Chào buổi tối';
    return `${greeting}, ${user?.username || ''}!`;
  };

  // Dữ liệu cho biểu đồ thống kê y tá
  const nurseStatsData = overview ? [
    { name: 'Học sinh đã khám', value: overview.userStats?.totalStudents || 0, color: '#3B82F6' },
    { name: 'Đang chờ khám', value: overview.healthCampaignStats?.totalPending || 0, color: '#F59E0B' },
    { name: 'Đã hoàn thành', value: overview.healthCampaignStats?.totalDone || 0, color: '#10B981' },
    { name: 'Cần theo dõi', value: overview.healthCampaignStats?.totalRejected || 0, color: '#EF4444' },
  ] : [];

  const medicationStatsData = overview ? [
    { name: 'Thuốc đã phát', value: overview.medicationStats?.totalIssued || 0, color: '#10B981' },
    { name: 'Đang chờ phát', value: overview.medicationStats?.totalPending || 0, color: '#F59E0B' },
    { name: 'Thuốc hết hạn', value: overview.medicationStats?.totalExpired || 0, color: '#EF4444' },
    { name: 'Cần bổ sung', value: overview.medicationStats?.totalLowStock || 0, color: '#8B5CF6' },
  ] : [];

  const vaccinationStatsData = overview ? [
    { name: 'Đã tiêm', value: overview.vaccinationCampaignStats?.totalDone || 0, color: '#10B981' },
    { name: 'Chờ tiêm', value: overview.vaccinationCampaignStats?.totalPending || 0, color: '#F59E0B' },
    { name: 'Từ chối', value: overview.vaccinationCampaignStats?.totalRejected || 0, color: '#EF4444' },
    { name: 'Đồng ý', value: overview.vaccinationCampaignStats?.totalAgreed || 0, color: '#3B82F6' },
  ] : [];

  // Dữ liệu cho biểu đồ cột - Thống kê theo tháng
  const monthlyStatsData = [
    { month: 'T1', healthChecks: 45, vaccinations: 32, medications: 28 },
    { month: 'T2', healthChecks: 52, vaccinations: 38, medications: 35 },
    { month: 'T3', healthChecks: 48, vaccinations: 41, medications: 42 },
    { month: 'T4', healthChecks: 61, vaccinations: 55, medications: 38 },
    { month: 'T5', healthChecks: 55, vaccinations: 48, medications: 45 },
    { month: 'T6', healthChecks: 67, vaccinations: 62, medications: 52 },
  ];

  // Custom event component for calendar
  const EventComponent = ({ event }) => (
    <div className="p-1">
      <div className="font-semibold text-sm">{event.title}</div>
      <div className="text-xs text-gray-600">{event.location}</div>
      <div className={`text-xs px-1 py-0.5 rounded mt-1 inline-block ${
        event.type === 'health-check' ? 'bg-blue-100 text-blue-800' :
        event.type === 'vaccination' ? 'bg-green-100 text-green-800' :
        event.type === 'medication' ? 'bg-purple-100 text-purple-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {event.type === 'health-check' ? 'Khám sức khỏe' :
         event.type === 'vaccination' ? 'Tiêm chủng' :
         event.type === 'medication' ? 'Phát thuốc' :
         event.type}
      </div>
    </div>
  );

  // Handle event click
  const handleEventClick = (event) => {
    console.log('Event clicked:', event);
    // Navigate to appropriate page based on event type
    // You can implement navigation logic here
  };

  // Custom toolbar component
  const CustomToolbar = (toolbar) => {
    const goToToday = () => {
      toolbar.onNavigate('TODAY');
    };

    const goToPrev = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const viewNames = {
      month: 'Tháng',
      week: 'Tuần',
      day: 'Ngày',
      agenda: 'Lịch trình'
    };

    return (
      <div className="flex justify-between items-center mb-4 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Hôm nay
          </button>
          <button
            onClick={goToPrev}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            ›
          </button>
        </div>
        
        <h2 className="text-xl font-semibold">
          {toolbar.label}
        </h2>
        
        <div className="flex space-x-1">
          {toolbar.views.map(view => (
            <button
              key={view}
              onClick={() => toolbar.onView(view)}
              className={`px-3 py-1 rounded ${
                toolbar.view === view
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {viewNames[view] || view}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Calendar messages in Vietnamese
  const messages = {
    allDay: 'Cả ngày',
    previous: 'Trước',
    next: 'Tiếp',
    today: 'Hôm nay',
    month: 'Tháng',
    week: 'Tuần',
    day: 'Ngày',
    agenda: 'Lịch trình',
    date: 'Ngày',
    time: 'Thời gian',
    event: 'Sự kiện',
    noEventsInRange: 'Không có sự kiện nào trong khoảng thời gian này.',
    showMore: total => `+ ${total} sự kiện khác`
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
            Dashboard quản lý y tế học đường
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
          {/* Biểu đồ thống kê khám sức khỏe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <span>Thống kê khám sức khỏe</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={nurseStatsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {nurseStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Biểu đồ thống kê thuốc */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-green-600" />
                <span>Thống kê thuốc</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={medicationStatsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {medicationStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Biểu đồ thống kê tiêm chủng */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Syringe className="w-5 h-5 text-purple-600" />
                <span>Thống kê tiêm chủng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={vaccinationStatsData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {vaccinationStatsData.map((entry, index) => (
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

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Lịch trình hoạt động</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px]">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
              messages={messages}
              components={{
                toolbar: CustomToolbar,
                event: EventComponent
              }}
              onSelectEvent={handleEventClick}
              eventPropGetter={(event) => ({
                className: `cursor-pointer ${
                  event.type === 'health-check' ? 'bg-blue-100 border-blue-300' :
                  event.type === 'vaccination' ? 'bg-green-100 border-green-300' :
                  event.type === 'medication' ? 'bg-purple-100 border-purple-300' :
                  'bg-gray-100 border-gray-300'
                }`
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Học sinh khám hôm nay</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900">18</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang chờ</p>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cần theo dõi</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Hoạt động gần đây */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-gray-600" />
            <span>Hoạt động gần đây</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Stethoscope className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Khám sức khỏe cho học sinh lớp 10A1</p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Syringe className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Tiêm chủng cho 15 học sinh</p>
                <p className="text-xs text-gray-500">4 giờ trước</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Pill className="w-4 h-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Phát thuốc cho 8 học sinh</p>
                <p className="text-xs text-gray-500">6 giờ trước</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardNurse1; 