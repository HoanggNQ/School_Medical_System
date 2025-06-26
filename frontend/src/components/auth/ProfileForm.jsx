import React, { useState, useEffect } from 'react';
import AuthService from '@/api/services/auth.service';
import UserService from '@/api/services/user.service';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';

const ProfileForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gender: '',
    address: '',
    roleName: '',
    status: ''
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await UserService.getProfile();
      const userData = response.data.data || response.data;
      console.log("userData",userData);
      
      // Format date for input field
      const formattedData = {
        fullName: userData.fullName || '',
        email: userData.email || userData.userName || '',
        phoneNumber: userData.phoneNumber || '',
        dob: userData.dob ? userData.dob.split('T')[0] : '',
        gender: userData.gender || '',
        address: userData.address || '',
        roleName: userData.roleName || '',
        status: userData.status || ''
      };
      
      setFormData(formattedData);
      setOriginalData(formattedData);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin hồ sơ.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for API (remove roleName and status as they shouldn't be updated)
      const updateData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address
      };

      await UserService.updateProfile(updateData);
      
      toast({
        title: 'Thành công',
        description: 'Cập nhật hồ sơ thành công.',
      });
      
      setIsEditing(false);
      setOriginalData(formData);
      
      // Update local storage user data
      const currentUser = AuthService.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updateData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật hồ sơ.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const getRoleBadgeVariant = (roleName) => {
    switch (roleName) {
      case 'ADMIN':
        return 'destructive';
      case 'SCHOOL_NURSE':
        return 'default';
      case 'PARENT':
        return 'secondary';
      case 'STUDENT':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'default';
      case 'VERIFY':
        return 'secondary';
      case 'INACTIVE':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getRoleDisplayName = (roleName) => {
    switch (roleName) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'SCHOOL_NURSE':
        return 'Y tá trường';
      case 'PARENT':
        return 'Phụ huynh';
      case 'STUDENT':
        return 'Học sinh';
      case 'MANAGER':
        return 'Quản lý';
      default:
        return roleName;
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'Hoạt động';
      case 'VERIFY':
        return 'Chưa xác thực';
      case 'INACTIVE':
        return 'Không hoạt động';
      default:
        return status;
    }
  };

  if (loading && !originalData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Hồ sơ cá nhân
        </CardTitle>
        <CardDescription>Xem và cập nhật thông tin cá nhân của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-only fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleName" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Vai trò
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant={getRoleBadgeVariant(formData.roleName)}>
                  {getRoleDisplayName(formData.roleName)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusBadgeVariant(formData.status)}>
                  {getStatusDisplayName(formData.status)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input 
                id="fullName" 
                type="text" 
                value={formData.fullName} 
                onChange={(e) => handleChange('fullName', e.target.value)}
                disabled={!isEditing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Số điện thoại
              </Label>
              <Input 
                id="phoneNumber" 
                type="tel" 
                value={formData.phoneNumber} 
                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Ngày sinh
              </Label>
              <Input 
                id="dob" 
                type="date" 
                value={formData.dob} 
                onChange={(e) => handleChange('dob', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value) => handleChange('gender', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Địa chỉ
            </Label>
            <Input 
              id="address" 
              type="text" 
              value={formData.address} 
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={!isEditing}
              placeholder="Nhập địa chỉ của bạn"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4">
            {!isEditing ? (
              <Button 
                type="button" 
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                Chỉnh sửa hồ sơ
              </Button>
            ) : (
              <>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  Hủy
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm; 