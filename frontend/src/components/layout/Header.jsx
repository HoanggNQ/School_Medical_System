import React from 'react';
import { motion } from 'framer-motion';
import { Bell, User, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Đăng xuất thành công",
      description: "Hẹn gặp lại bạn!",
    });
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm border-b border-gray-200 px-6 py-4"
    >
      <div className="flex items-center justify-between">
 
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/homepage')}>
          <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gradient">HealthCare</span>
            <p className="text-xs text-gray-500 leading-none">Quản lý sức khỏe</p>
          </div>
        </div>

  
        <div className="flex-1 flex justify-center">
          <span
            className="cursor-pointer text-gray-900 hover:text-blue-700 transition-colors duration-300 font-medium relative group mx-2"
            onClick={() => navigate('/homepage')}
          >
            Homepage
          </span>
          <span
            className="cursor-pointer text-gray-900 hover:text-blue-700 transition-colors duration-300 font-medium relative group mx-2"
            onClick={() => navigate('/blog')}
          >
            Blog
          </span>
      
          {user && (
            <span
              className="cursor-pointer text-gray-900 hover:text-blue-700 transition-colors duration-300 font-medium relative group mx-2"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </span>
          )}
        </div>

    
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-0 py-0 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
                    id="menu-button"
                    aria-expanded={menuOpen}
                    aria-haspopup="true"
                    onClick={() => setMenuOpen((o) => !o)}
                  >
                    {user?.urlAvatar ? (
                      <img
                        src={user.urlAvatar}
                        alt="Avatar"
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                </div>
                {/* Dropdown menu */}
                {menuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                    <div className="py-1" role="none">
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={() => {
                          setMenuOpen(false);
                          navigate('/profile');
                        }}
                      >
                        Hồ sơ cá nhân
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={() => {
                          setMenuOpen(false);
                          navigate('/change-password');
                        }}
                      >
                        Thay đổi mật khẩu
                      </button>
                      <button
                        className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100"
                        role="menuitem"
                        tabIndex={-1}
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              className="px-4 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              onClick={() => navigate('/auth')}
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;