import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/api/services/auth.service';
import UserService from '@/api/services/user.service';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const ChangePasswordForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: user?.email || '',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.newPasswordConfirm) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu mới không khớp.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      await UserService.changePassword(formData);
      toast({
        title: 'Thành công',
        description: 'Đổi mật khẩu thành công.',
      });
      
      // Reset form
      setFormData({
        ...formData,
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
      
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Đã có lỗi xảy ra.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg rounded-xl border-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Lock className="w-6 h-6" />
            Đổi mật khẩu
          </CardTitle>
          <CardDescription className="text-base text-gray-500">
            Cập nhật mật khẩu của bạn để bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 font-medium">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                disabled 
                className="bg-gray-100 border border-gray-200 rounded-lg"
              />
            </div>

            {/* Old Password field */}
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="font-medium">Mật khẩu cũ</Label>
              <div className="relative">
                <Input 
                  id="oldPassword" 
                  type={showOldPassword ? "text" : "password"} 
                  value={formData.oldPassword} 
                  onChange={handleChange} 
                  required 
                  className="rounded-lg border border-gray-200 bg-white pr-10"
                  placeholder="Nhập mật khẩu cũ"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* New Password field */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="font-medium">Mật khẩu mới</Label>
              <div className="relative">
                <Input 
                  id="newPassword" 
                  type={showNewPassword ? "text" : "password"} 
                  value={formData.newPassword} 
                  onChange={handleChange} 
                  required 
                  className="rounded-lg border border-gray-200 bg-white pr-10"
                  placeholder="Nhập mật khẩu mới"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="newPasswordConfirm" className="font-medium">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input 
                  id="newPasswordConfirm" 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={formData.newPasswordConfirm} 
                  onChange={handleChange} 
                  required 
                  className="rounded-lg border border-gray-200 bg-white pr-10"
                  placeholder="Nhập lại mật khẩu mới"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full rounded-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-3 shadow"
              >
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordForm; 