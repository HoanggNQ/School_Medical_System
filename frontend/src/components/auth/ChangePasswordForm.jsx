import React, { useState } from 'react';
import AuthService from '@/api/services/auth.service';
import UserService from '@/api/services/user.service';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ChangePasswordForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: AuthService.getCurrentUser()?.email || '',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });
  const [loading, setLoading] = useState(false);

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Đổi mật khẩu</CardTitle>
        <CardDescription>Cập nhật mật khẩu của bạn tại đây.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
            <Input id="oldPassword" type="password" value={formData.oldPassword} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input id="newPassword" type="password" value={formData.newPassword} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPasswordConfirm">Xác nhận mật khẩu mới</Label>
            <Input id="newPasswordConfirm" type="password" value={formData.newPasswordConfirm} onChange={handleChange} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm; 