
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import AuthService from '../../api/services/auth.service';

const LoginForm = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await AuthService.login({ email, password });
      console.log(response.data);
      login(response.data.data.user, response.data.data.accessToken);
      toast({
        title: "Đăng nhập thành công!",
        description: `Chào mừng quay trở lại.`,
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full min-w-[22vw] max-w-xl mx-auto glass-effect border-white/20">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-white">Đăng Nhập</CardTitle>
          <CardDescription className="text-white/80">
            Hệ thống quản lý sức khỏe học sinh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full btn-primary text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner mr-2" />
              ) : null}
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              onClick={onSwitchToForgotPassword}
              className="w-full text-center text-white/80 hover:text-white transition-colors"
            >
              Quên mật khẩu?
            </button>
            <div className="text-center text-white/60">
              Chưa có tài khoản?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-white hover:underline font-semibold"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>

          {/* <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <p className="text-white/80 text-sm mb-2 font-semibold">Tài khoản demo:</p>
            <div className="space-y-1 text-xs text-white/70">
              <div>Admin: admin@health.edu.vn / admin123</div>
              <div>Manager: manager@health.edu.vn / manager123</div>
              <div>Y tá: nurse@health.edu.vn / nurse123</div>
              <div>Học sinh: student@health.edu.vn / student123</div>
              <div>Phụ huynh: parent@health.edu.vn / parent123</div>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
