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
      className="bg-white/90 backdrop-blur shadow-md border-b border-gray-200 px-4 md:px-10 py-3 md:py-4 rounded-b-2xl sticky top-0 z-30"
    >
      <div className="flex items-center justify-between gap-2 md:gap-0">
        {/* Logo + Left Menu */}
        <div className="flex items-center gap-6 min-w-0">
          <div className="flex items-center cursor-pointer mr-2" onClick={() => navigate('/homepage')}>
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-md">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-500 via-blue-500 to-blue-700 bg-clip-text text-transparent tracking-wide drop-shadow">School Medical</span>
              <p className="text-xs text-gray-500 leading-none font-medium">Sức Khỏe Học Đường</p>
            </div>
          </div>
          {/* Left menu: Homepage, Blog */}
          <div className="flex items-center gap-4 md:gap-6">
            <span
              className="cursor-pointer text-gray-900 hover:text-blue-700 transition-colors duration-200 font-semibold text-base px-2 py-1 relative group"
              onClick={() => navigate('/homepage')}
            >
              Trang chủ
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full group-hover:w-full transition-all duration-300"></span>
            </span>
            <span
              className="cursor-pointer text-gray-900 hover:text-blue-700 transition-colors duration-200 font-semibold text-base px-2 py-1 relative group"
              onClick={() => navigate('/blog')}
            >
              Bài viết
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full group-hover:w-full transition-all duration-300"></span>
            </span>
          </div>
        </div>

        {/* Right: Dashboard + User */}
        <div className="flex items-center gap-4">
          {user && (
            <span
              className="cursor-pointer text-gray-900 hover:text-blue-700 transition-colors duration-200 font-semibold text-base px-2 py-1 relative group mr-2"
              onClick={() => navigate('/profile')}
            >
              Cá Nhân
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full group-hover:w-full transition-all duration-300"></span>
            </span>
          )}
          {/* User/Avatar */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-0 py-0 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 border-2 border-transparent hover:border-blue-400 transition"
                      id="menu-button"
                      aria-expanded={menuOpen}
                      aria-haspopup="true"
                      onClick={() => setMenuOpen((o) => !o)}
                    >
                      {user?.urlAvatar ? (
                        <img
                          src={user.urlAvatar}
                          alt="Avatar"
                          className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 hover:border-blue-400 transition"
                        />
                      ) : (
                        <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </button>
                  </div>
                  {/* Dropdown menu */}
                  {menuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 focus:outline-none animate-fadeIn" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                      <div className="py-2" role="none">
                        <button
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 rounded-xl"
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
                          className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 rounded-xl"
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
                          className="block w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 rounded-xl"
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
                className="px-5 py-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow hover:from-blue-600 hover:to-sky-500 transition-all text-base"
                onClick={() => navigate('/auth')}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;