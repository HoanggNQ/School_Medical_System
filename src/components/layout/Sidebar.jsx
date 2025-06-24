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
  FlameKindling
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Tổng quan', icon: BarChart3, path: '/dashboard' }
    ];

    switch (user?.role) {
      case 'ADMIN':
        return [
          ...baseItems,
          { id: 'users', label: 'Quản lý người dùng', icon: Users, path: '/users' },
          { id: 'vaccinations', label: 'Lịch tiêm chủng', icon: Calendar, path: '/vaccinations' },
          { id: 'campaigns', label: 'Tạo chiến dịch', icon: FlameKindling, path: '/campaigns' },
          { id: 'reports', label: 'Báo cáo', icon: FileText, path: '/reports' },
          { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/settings' }
        ];
      case 'MANAGER':
        return [
          ...baseItems,
          { id: 'users', label: 'Quản lý người dùng', icon: Users, path: '/users' },
          { id: 'vaccinations', label: 'Lịch tiêm chủng', icon: Calendar, path: '/vaccinations' },
          { id: 'reports', label: 'Báo cáo', icon: FileText, path: '/reports' }
        ];
      case 'SCHOOL_NURSE':
        return [
          ...baseItems,
          { id: 'medicines', label: 'Quản lý thuốc', icon: Pill, path: '/medicines' },
          { id: 'health-records', label: 'Hồ sơ sức khỏe', icon: Activity, path: '/health-records' },
          { id: 'vaccinations', label: 'Lịch tiêm chủng', icon: Calendar, path: '/vaccinations' }
        ];
      case 'STUDENT':
        return [
          ...baseItems,
          { id: 'health-profile', label: 'Hồ sơ sức khỏe', icon: Heart, path: '/health-profile' },
          { id: 'vaccination-history', label: 'Lịch sử tiêm chủng', icon: Shield, path: '/vaccination-history' },
          { id: 'appointments', label: 'Lịch hẹn', icon: Calendar, path: '/appointments' }
        ];
      case 'PARENT':
        return [
          ...baseItems,
          { id: 'children-health', label: 'Sức khỏe con em', icon: Heart, path: '/children-health' },
          { id: 'vaccination-schedule', label: 'Lịch tiêm chủng', icon: Calendar, path: '/vaccination-schedule' },
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
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gradient">HealthCare</span>
            <p className="text-xs text-gray-500">Quản lý sức khỏe</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => {
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
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
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
      </div>
    </motion.div>
  );
};

export default Sidebar;