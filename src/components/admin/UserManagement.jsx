import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import UserService from '../../api/services/user.service';
import UserForm from './UserForm';
import AuthService from '../../api/services/auth.service';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gender: '',
    roleName: '',
    address: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();
      console.log(response);
      setUsers(response.data.data.users || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu phải có ít nhất 6 ký tự.",
        variant: "destructive"
      });
      return;
    }

    setLoadingCreate(true);

    try {
      // Create registration data without confirmPassword
      const registrationData = {
        fullname: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        roleName: formData.roleName,
        address: formData.address,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        dob: formData.dob
      };

      // Convert date to ISO string format
      if (registrationData.dob) {
        registrationData.dob = new Date(registrationData.dob).toISOString().split('T')[0];
      }

      const response = await AuthService.register(registrationData);
      console.log(response);

      toast({
        title: "Đăng ký thành công!",
        description: "Vui lòng kiểm tra email để xác thực tài khoản.",
      });

      setIsCreateModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '',
        dob: '',
        gender: '',
        roleName: '',
        address: '',
        username: '',
        password: '',
        confirmPassword: ''
      });
      fetchUsers(); 
    } catch (error) {
      console.error(error);
      toast({
        title: "Lỗi đăng ký",
        description: error.message || "Đăng ký thất bại. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleEditUser = async () => {
    try {
      const response = await UserService.updateUser(selectedUser.id, formData);
      if (response.data.success) {
        setUsers(users.map(user =>
          user.id === selectedUser.id ? response.data.data.user : user
        ));
        setIsEditModalOpen(false);
        setSelectedUser(null);
        setFormData({ fullName: '', email: '', phoneNumber: '', dob: '', gender: '', roleName: '', address: '', username: '', password: '', confirmPassword: '' });
        toast({
          title: "Thành công!",
          description: "Thông tin người dùng đã được cập nhật.",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể cập nhật thông tin người dùng.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await UserService.deleteUser({userId});
      console.log(response);
      if (response.data.isSuccess == true) {
        toast({
          title: "Thành công!",
          description: "Người dùng đã được xóa.",
          className: "bg-green-500 text-white"
        });
        fetchUsers();
      }
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: error.response?.data?.message || "Không thể xóa người dùng.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      dob: user.dob,
      gender: user.gender,
      roleName: user.roleName,
      address: user.address,
      username: user.userName,
      password: user.password,
      confirmPassword: user.password
    });
    setIsEditModalOpen(true);
  };

  const userStatus={
    ACTIVE: 'Hoạt động',
    VERIFY: 'Chưa xác thực',
    DELETED: 'Đã xóa'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-2">Quản lý tất cả người dùng trong hệ thống</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={(open) => setIsCreateModalOpen(open)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết để tạo người dùng mới trong hệ thống.
              </DialogDescription>
            </DialogHeader>
            <UserForm
              formData={formData}
              handleInputChange={handleInputChange}
              onCancel={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateUser}
            />
          </DialogContent>
        </Dialog>
        <Button className="btn-primary" onClick={() => setIsCreateModalOpen(true)} disabled={loadingCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Danh sách người dùng</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="STUDENT">Học sinh</SelectItem>
                  <SelectItem value="PARENT">Phụ huynh</SelectItem>
                  <SelectItem value="SCHOOL_NURSE">Y tá</SelectItem>
                  <SelectItem value="MANAGER">Quản lý</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.dob}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.roleName === 'ADMIN' ? 'bg-red-100 text-red-800' :
                      user.roleName === 'MANAGER' ? 'bg-purple-100 text-purple-800' :
                        user.roleName === 'SCHOOL_NURSE' ? 'bg-green-100 text-green-800' :
                          user.roleName === 'STUDENT' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                      }`}>
                      {user.roleName}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.phoneNumber && <span> {user.phoneNumber}</span>}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {userStatus[user.status]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.userId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin người dùng trong hệ thống.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            isEdit={true}
            formData={formData}
            handleInputChange={handleInputChange}
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditUser}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UserManagement;
