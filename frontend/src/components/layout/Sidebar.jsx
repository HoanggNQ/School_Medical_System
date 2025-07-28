import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Pill, 
  BarChart3, 
  Settings, 
  Heart,
  FileText,
  Shield,
  UserCheck,
  Activity,
  FlameKindling,
  User,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getMenuItems = () => {
    const baseItems = [
     
    ];

    switch (user?.role) {
      case 'ADMIN':
        return [
          { type: 'section', label: 'Thống kê' },
         
          { type: 'item', id: 'dashboard', label: 'Tổng quan', icon: BarChart3, path: '/dashboard' },
          { type: 'item', id: 'show-campaigns', label: 'Thống kê chiến dịch', icon: ClipboardList, path: '/show-campaigns' },
          { type: 'section', label: 'Người dùng' },
          { type: 'item', id: 'users', label: 'Quản lý người dùng', icon: Users, path: '/users' },
          { type: 'item', id: 'students', label: 'Quản lý học sinh', icon: Users, path: '/students' },
          { type: 'section', label: 'Chiến dịch' },
          { type: 'item', id: 'vaccinations', label: 'Lịch tiêm chủng', icon: Calendar, path: '/vaccinations' },
          { type: 'item', id: 'campaigns', label: 'Lịch Sức Khỏe', icon: FlameKindling, path: '/campaigns' },
      
          { type: 'section', label: 'Bài viết' },
          { type: 'item', id: 'blogs', label: 'Quản lý bài viết', icon: BookOpen, path: '/blogs' },
        ];
      case 'MANAGER':
        return [
          { type: 'section', label: 'Thống kê' },
          { type: 'item', id: 'dashboard', label: 'Tổng quan', icon: BarChart3, path: '/dashboard' },
          { type: 'section', label: 'Người dùng' },
          { type: 'item', id: 'users', label: 'Quản lý người dùng', icon: Users, path: '/users' },
          { type: 'section', label: 'Chiến dịch' },
          { type: 'item', id: 'vaccinations', label: 'Lịch tiêm chủng', icon: Calendar, path: '/vaccinations' },
          { type: 'item', id: 'reports', label: 'Báo cáo', icon: FileText, path: '/reports' },
          { type: 'section', label: 'Bài viết' },
          { type: 'item', id: 'blogs', label: 'Quản lý bài viết', icon: BookOpen, path: '/blogs' },
        ];
      case 'SCHOOL_NURSE':
        return [
          { type: 'section', label: 'Tổng quan' },
          { type: 'item', id: 'dashboard-nurse', label: 'Tổng quan', icon: BarChart3, path: '/dashboard-nurse' },

          { type: 'section', label: 'Quản lý thuốc' },
          { type: 'item', id: 'medicines', label: 'Quản lý thuốc', icon: Pill, path: '/medicines' },
          { type: 'item', id: 'health-records', label: 'Yêu cầu thuốc', icon: Activity, path: '/health-records' },

          { type: 'section', label: 'Lịch và kết quả' },
          { type: 'item', id: 'watch-vaccination', label: 'Xem lịch tiêm chủng', icon: Calendar, path: '/watch-vaccination' },
          { type: 'item', id: 'campaigns', label: 'Lịch khám sức khỏe', icon: FlameKindling, path: '/campaigns-nurse' },
          { type: 'item', id: 'event', label: 'Sự kiện y tế', icon: ClipboardList, path: '/event' },
<<<<<<< HEAD
                    // { type: 'item', id: 'heath-result', label: 'Kết quả sức khỏe', icon: ClipboardList, path: '/heath-result' },
          // { type: 'item', id: 'vaccine-result', label: 'Kết quả tiêm chủng', icon: ClipboardList, path: '/vaccine-result' },
=======
          { type: 'item', id: 'consultation-schedules-nurse', label: 'Lịch tư vấn', icon: ClipboardList, path: '/consultation-schedules' },
>>>>>>> f792340263a9ca90517581dd166842cf3c2433a1
          { type: 'item', id: 'HealthDeclarationSearch', label: 'Phiếu sức khỏe', icon: ClipboardList, path: '/HealthDeclarationSearch' }
        ];
      case 'STUDENT':
        return [
          { type: 'section', label: 'Người dùng' },
          { type: 'item', id: 'health-profile', label: 'Hồ sơ sức khỏe', icon: Heart, path: '/health-profile' },
          { type: 'section', label: 'Chiến dịch' },
          { type: 'item', id: 'vaccination-history', label: 'Lịch sử tiêm chủng', icon: Shield, path: '/vaccination-history' },
          { type: 'section', label: 'Thống kê' },
          { type: 'item', id: 'appointments', label: 'Lịch hẹn', icon: Calendar, path: '/appointments' },
        ];
      case 'PARENT':
        return [
          ...baseItems,
          { id: 'children-health', label: 'Sức khỏe con em', icon: Heart, path: '/children-health' },
          { id: 'schedule', label: 'Sự kiện', icon: Calendar, path: '/schedule' },
          { id: 'notifications', label: 'Thông báo', icon: UserCheck, path: '/notifications' }
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleTabClick = (itemId, itemPath) => {
    setActiveTab(itemId);
    navigate(itemPath);
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white shadow-lg h-full flex flex-col"
    >
   

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => {
            if (item.type === 'section') {
              return (
                <div key={item.label} className="px-4 pt-4 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider select-none">
                  {item.label}
                </div>
              );
            }
            if (item.type === 'item' || !item.type) { // fallback for old items
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleTabClick(item.id, item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 sidebar-item ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            }
            return null;
          })}
        </div>
      </nav>

      {/* <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
<div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
            <p className={`text-xs px-2 py-1 rounded-full inline-block role-badge ${
              user?.role === 'Admin' ? 'bg-red-100 text-red-800' :
              user?.role === 'Manager' ? 'bg-purple-100 text-purple-800' :
              user?.role === 'SCHOOL_NURSE' ? 'bg-green-100 text-green-800' :
              user?.role === 'Student' ? 'bg-blue-100 text-blue-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {user?.role}
            </p>
          </div>
        </div>
      </div> */}
    </motion.div>
  );
};

export default Sidebar;