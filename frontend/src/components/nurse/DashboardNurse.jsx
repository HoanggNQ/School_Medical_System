import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, BadgeCheck, Info, Users, Activity, Syringe } from 'lucide-react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/vi';

import { useNavigate } from 'react-router-dom';
import AuthService from '../../api/services/auth.service';

// Set moment locale to Vietnamese
moment.locale('vi');
const localizer = momentLocalizer(moment);

const DashboardNurse = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await AuthService.getDashboardNurse();
     

     
      setEvents(response.data.data);
      console.log("(response.data.data",response.data.data);
     
      
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setEvents([]);
      setError('Không thể tải danh sách sự kiện y tế. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
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

  // Convert events to calendar events
  const calendarEvents = events.map(event => {
    const start = new Date(event.startDate);
    // Nếu endDate null hoặc không hợp lệ, dùng startDate luôn
    const end = event.endDate ? new Date(event.endDate) : start;
    return {
      id: event.eventId,
      title: event.name,
      start,
      end,
      resource: event,
      location: event.location,
      status: event.status,
      type: event.type,
      eventId: event.eventId
    };
  });

  // Custom event component
  const EventComponent = ({ event }) => (
    <div className="p-1">
      <div className="font-semibold text-sm text-black">{event.title}</div>
      <div className="text-xs text-gray-600">{event.location}</div>
      <div className={`text-xs px-1 py-0.5 rounded mt-1 inline-block
        ${event.type === 'VACCINATION' ? 'bg-blue-100 text-blue-800' :
          event.type === 'HEALTH_CHECK' ? 'bg-green-100 text-green-800' :
          event.type === 'MEDICATION-REQUEST' ? 'bg-purple-100 text-purple-800' :
          event.type === 'CONSULTATION' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'}
      `}>
        {event.type === 'VACCINATION' ? 'Tiêm chủng' :
          event.type === 'HEALTH_CHECK' ? 'Khám sức khỏe' :
          event.type === 'MEDICATION-REQUEST' ? 'Yêu cầu thuốc' :
          event.type === 'CONSULTATION' ? 'Lịch tư vấn' :
          event.type}
      </div>
    </div>
  );

  // Handle event click
  const handleEventClick = (event) => {
    if (event.type === 'VACCINATION') {
      navigate(`/management-vaccine/${event.eventId}`, { state: { vaccinationStatus: event.status } });
    } else if (event.type === 'HEALTH_CHECK') {
      navigate(`/health-check/${event.eventId}`, { state: { campaignStatus: event.status } });
    } else if (event.type === 'MEDICATION-REQUEST') {
      navigate(`/medication-requests/${event.eventId}`);
    } else if (event.type === 'CONSULTATION') {
      navigate(`/consultation-schedules/${event.eventId}`);
    } else {
   
      console.log('Event clicked:', event);
    }
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
      agenda: 'Lịch trình',
    };

    const viLabel = (() => {
      const label = toolbar.label;
      const monthMap = {
        'January': 'Tháng 1',
        'February': 'Tháng 2',
        'March': 'Tháng 3',
        'April': 'Tháng 4',
        'May': 'Tháng 5',
        'June': 'Tháng 6',
        'July': 'Tháng 7',
        'August': 'Tháng 8',
        'September': 'Tháng 9',
        'October': 'Tháng 10',
        'November': 'Tháng 11',
        'December': 'Tháng 12',
      };
      const match = label.match(/([A-Za-z]+) (\d{4})/);
      if (match) {
        const month = monthMap[match[1]] || match[1];
        const year = match[2];
        return `${month} năm ${year}`;
      }
      return label;
    })();

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
          {viLabel}
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold mb-2">Lỗi</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
            Quản lý lịch trình sự kiện y tế học sinh
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng sự kiện</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              Sự kiện y tế
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiêm chủng</CardTitle>
            <Syringe className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {events.filter(e => e.type === 'VACCINATION').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Chiến dịch tiêm vaccine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khám sức khỏe</CardTitle>
            <BadgeCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {events.filter(e => e.type === 'HEALTH_CHECK').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Khám sức khỏe định kỳ
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yêu cầu thuốc</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {events.filter(e => e.type === 'MEDICATION-REQUEST').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Yêu cầu thuốc từ phụ huynh
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lịch tư vấn</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {events.filter(e => e.type === 'CONSULTATION').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Lịch tư vấn 
            </p>
          </CardContent>
        </Card>
      </div>

   
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Lịch trình sự kiện y tế</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[1200px]">
            <BigCalendar
              localizer={localizer}
              events={calendarEvents}
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
                  event.type === 'VACCINATION' ? 'bg-blue-100 border-blue-300' :
                  event.type === 'HEALTH_CHECK' ? 'bg-green-100 border-green-300' :
                  event.type === 'MEDICATION-REQUEST' ? 'bg-purple-100 border-purple-300' :
                  event.type === 'CONSULTATION' ? 'bg-orange-100 border-orange-300' :
                  'bg-gray-100 border-gray-300'
                }`
              })}
              formats={{
                weekdayFormat: (date, culture, localizer) => {
                  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                  return weekdays[date.getDay()];
                }
              }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardNurse;
