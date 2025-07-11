import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const classList = [
  { id: 5, className: 'Class 3A', grade: 3 },
  { id: 2, className: 'Class 1B', grade: 1 },
  { id: 1, className: 'Class 1A', grade: 1 },
  { id: 3, className: 'Class 2A', grade: 2 },
  { id: 6, className: 'Class 3B', grade: 3 },
  { id: 4, className: 'Class 2B', grade: 2 },
  { id: 7, className: 'Class 4A', grade: 4 },
  { id: 8, className: 'Class 4B', grade: 4 },
  { id: 9, className: 'Class 5A', grade: 5 },
  { id: 10, className: 'Class 5B', grade: 5 },
];

const StudentForm = ({ isEdit = false, formData, handleInputChange, onCancel, onSubmit }) => {
  return (
    <div className="space-y-6">
     
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="username">Tên đăng nhập</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="Nhập tên đăng nhập"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Nhập mật khẩu"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Nhập lại mật khẩu"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Nhập email"
          />
        </div>
      </div>

    
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Nhập họ và tên"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Ngày sinh</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            min="1900-01-01"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Giới tính</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
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
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Số điện thoại</Label>
          <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="classId">Lớp học</Label>
          <Select
            value={formData.classId ? String(formData.classId) : ''}
            onValueChange={(value) => handleInputChange('classId', Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn lớp học" />
            </SelectTrigger>
            <SelectContent>
              {classList.map((cls) => (
                <SelectItem key={cls.id} value={String(cls.id)}>
                  {cls.className} (Khối {cls.grade})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Thêm trường nhập parentId */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="parentId">Mã phụ huynh (parentId)</Label>
          <Input
            id="parentId"
            type="number"
            value={formData.parentId}
            onChange={(e) => handleInputChange('parentId', e.target.value)}
            placeholder="Nhập mã phụ huynh (nếu có)"
            min={0}
          />
        </div>
      </div>

      {/* Thông tin liên hệ khẩn cấp */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Người liên hệ khẩn cấp</Label>
          <Input
            id="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
            placeholder="Nhập tên người liên hệ khẩn cấp"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyContactPhone">SĐT liên hệ khẩn cấp</Label>
          <Input
            id="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
            placeholder="Nhập SĐT liên hệ khẩn cấp"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          onClick={onSubmit}
          className="btn-primary"
        >
          {isEdit ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </div>
  );
};

export default StudentForm;
