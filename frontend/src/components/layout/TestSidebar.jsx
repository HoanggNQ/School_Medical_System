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
  Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TestSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const getAllMenuItems = () => {
    return [
      { id: 'dashboard', label: 'Tổng quan', icon: BarChart3, path: '/dashboard' },
      { id: 'users', label: 'Quản lý người dùng', icon: Users, path: '/users' },
      { id: 'vaccinations', label: 'Lịch tiêm chủng', icon: Calendar, path: '/vaccinations' },
      { id: 'reports', label: 'Báo cáo', icon: FileText, path: '/reports' },
      { id: 'settings', label: 'Cài đặt', icon: Settings, path: '/settings' },
      { id: 'medicines', label: 'Quản lý thuốc', icon: Pill, path: '/medicines' },
    //   { id: 'health-records', label: 'Hồ sơ sức khỏe', icon: Activity, path: '/health-records' },
      { id: 'health-profile', label: 'Hồ sơ sức khỏe', icon: Heart, path: '/health-profile' },
      { id: 'vaccination-history', label: 'Lịch sử tiêm chủng', icon: Shield, path: '/vaccination-history' },
      { id: 'appointments', label: 'Lịch hẹn', icon: Calendar, path: '/appointments' },
      { id: 'children-health', label: 'Sức khỏe con em', icon: Heart, path: '/children-health' },
      { id: 'vaccination-schedule', label: 'Lịch tiêm chủng', icon: Calendar, path: '/vaccination-schedule' },
      { id: 'notifications', label: 'Thông báo', icon: UserCheck, path: '/notifications' }
    ];
  };

  const menuItems = getAllMenuItems();

  const handleTabClick = (itemId, itemPath) => {
    setActiveTab(itemId);
    navigate(itemPath);
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-white shadow-lg h-full flex flex-col overflow-y-auto"
    >
      <div className="p-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gradient">Test Menu</span>
            <p className="text-xs text-gray-500">All Items</p>
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
    </motion.div>
  );
};

export default TestSidebar; 