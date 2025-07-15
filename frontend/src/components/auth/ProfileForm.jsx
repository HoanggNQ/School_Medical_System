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
import { User, Mail, Phone, MapPin, Calendar, Shield, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    status: '',
    avatarUrl: '',
    userId: null
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // const navigate = useNavigate();
  useEffect(() => {
    // const user = JSON.parse(localStorage.getItem('user'));
    // if(user.role === 'PARENT') {
    //   navigate('/parent-profile');
    // }
    // if(user.role === 'STUDENT') {
    //   navigate('/student-profile');
    // }
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
        status: userData.status || '',
        avatarUrl: userData.avatarUrl || '',
        userId: userData.userId || userData.id || null
      };
      
      setFormData(formattedData);
      setOriginalData(formattedData);
      setImagePreview(formattedData.avatarUrl || null);
      setSelectedImage(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Lỗi',
          description: 'Vui lòng chọn file ảnh hợp lệ.',
          variant: 'destructive',
        });
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Lỗi',
          description: 'Kích thước file không được vượt quá 5MB.',
          variant: 'destructive',
        });
        return;
      }
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(formData.avatarUrl || null);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    try {
      // Tạo FormData để gửi lên API
      const formDataToSend = new FormData();
      const userData = {
        id: formData.userId,
        name: formData.fullName,
        address: formData.address,
        gender: formData.gender,
        Dob: formData.dob,
        phoneNumber: formData.phoneNumber
      };
      formDataToSend.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
      if (selectedImage) {
        formDataToSend.append('file', selectedImage);
      }
      await UserService.updateProfile(formDataToSend);
      
      toast({
        title: 'Thành công',
        description: 'Cập nhật hồ sơ thành công.',
      });
      
      setIsEditing(false);
      // Fetch lại profile để cập nhật avatar mới
      await fetchProfile();
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
    setSelectedImage(null);
    setImagePreview(originalData.avatarUrl || null);
  };

  const handleEdit = () => {
    setIsEditing(true);
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
        <div className="space-y-6">
          {/* Avatar section */}
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Ảnh đại diện</Label>
            <div className="flex items-center gap-4">
              {(imagePreview || formData.avatarUrl) ? (
                <div className="relative">
                  <img
                    src={imagePreview || formData.avatarUrl}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  {isEditing && (imagePreview || selectedImage) && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={removeImage}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Avatar
                </div>
              )}
              {isEditing && (
                <Button
                  type="button"
                  onClick={() => document.getElementById('avatar-upload').click()}
                  className="ml-2"
                >
                  {imagePreview ? 'Thay đổi ảnh' : 'Tải lên ảnh'}
                </Button>
              )}
            </div>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={!isEditing}
            />
          </div>
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
                onClick={handleEdit}
                className="flex-1"
              >
                Chỉnh sửa hồ sơ
              </Button>
            ) : (
              <>
                <Button 
                  type="button"
                  onClick={handleSubmit}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileForm; 