
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setSent(true);
      toast({
        title: "Email đã được gửi!",
        description: "Vui lòng kiểm tra email để đặt lại mật khẩu.",
      });
      setLoading(false);
    }, 1000);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full min-w-[22vw] max-w-md mx-auto glass-effect border-white/20">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-white">Email Đã Gửi</CardTitle>
            <CardDescription className="text-white/80">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="text-white/80 text-sm">
                  Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) để tìm email từ chúng tôi.
                  Liên kết đặt lại mật khẩu sẽ hết hạn sau 24 giờ.
                </p>
              </div>
              
              <Button
                onClick={() => setSent(false)}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Gửi lại email
              </Button>
              
              <button
                onClick={onSwitchToLogin}
                className="flex items-center justify-center w-full text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md mx-auto glass-effect border-white/20">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center"
          >
            <KeyRound className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-white">Quên Mật Khẩu</CardTitle>
          <CardDescription className="text-white/80">
            Nhập email để nhận hướng dẫn đặt lại mật khẩu
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

            <Button
              type="submit"
              className="w-full btn-primary text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner mr-2" />
              ) : null}
              {loading ? 'Đang gửi...' : 'Gửi Email Đặt Lại'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={onSwitchToLogin}
              className="flex items-center justify-center w-full text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại đăng nhập
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForgotPasswordForm;
