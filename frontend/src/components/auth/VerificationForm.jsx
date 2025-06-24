import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import AuthService from '../../api/services/auth.service';

const VerificationForm = ({ email, onSwitchToLogin }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ 6 số.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await AuthService.verifyEmail({
        email,
        otp: verificationCode
      });
      
      toast({
        title: "Xác thực thành công!",
        description: "Tài khoản của bạn đã được kích hoạt.",
      });
      
      onSwitchToLogin();
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi xác thực",
        description: error.message || "Mã xác thực không đúng. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    
    try {
      await AuthService.resendVerificationCode(email);
      toast({
        title: "Đã gửi lại mã",
        description: "Mã xác thực mới đã được gửi đến email của bạn.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi",
        description: "Không thể gửi lại mã. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full min-w-[28vw] max-w-md mx-auto glass-effect border-white/20">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-600 rounded-full flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold text-white">Xác thực Email</CardTitle>
          <CardDescription className="text-white/80">
            Vui lòng nhập mã xác thực 6 số đã được gửi đến {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center space-x-2">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-semibold bg-white/10 border-white/20 text-white"
                  required
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full btn-primary text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner mr-2" />
              ) : null}
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>

            <div className="text-center space-y-4">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-white/80 hover:text-white transition-colors"
              >
                {resendLoading ? 'Đang gửi lại...' : 'Gửi lại mã'}
              </button>

              <div className="text-white/60">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="flex items-center justify-center space-x-2 text-white hover:underline font-semibold mx-auto"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại đăng nhập</span>
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VerificationForm;
