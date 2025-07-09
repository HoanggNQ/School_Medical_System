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
  const [searchInput, setSearchInput] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState('userId.asc');

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchTerm, sort]);

  const fetchUsers = async (page = 0) => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers({ page, sort, search: searchTerm });
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      setCurrentPage(response.data.currentPage || 0);
      setError(null);
      console.log("users", response);
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
        fullName: formData.fullName,
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

      const response = await UserService.createNurse(registrationData);
      
      console.log(response);
      console.log("registrationData",registrationData);


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
      username: user.email,
      password: '',
      confirmPassword: ''
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
            <CardTitle>Danh sách người dùng ({totalElements} người dùng)</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setSearchTerm(searchInput);
                      setCurrentPage(0);
                    }
                  }}
                  className="pl-10"
                />
              </div>
              <Select value={sort} onValueChange={(value) => { setSort(value); setCurrentPage(0); }}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="userId.asc">Mặc định (ID người dùng)</SelectItem>
                  <SelectItem value="fullname.asc">Tên người dùng (A-Z)</SelectItem>
                  <SelectItem value="fullname.desc">Tên người dùng (Z-A)</SelectItem>
                  <SelectItem value="email.asc">Email (A-Z)</SelectItem>
                  <SelectItem value="email.desc">Email (Z-A)</SelectItem>
                  <SelectItem value="roleName.asc">Vai trò (A-Z)</SelectItem>
                  <SelectItem value="roleName.desc">Vai trò (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="9" className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? 'Không tìm thấy người dùng nào phù hợp với từ khóa tìm kiếm'
                      : 'Không có người dùng nào'
                    }
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.userId} className="cursor-pointer" onClick={() => { setSelectedDetail(user); setIsDetailModalOpen(true); }}>
                    <TableCell className="font-medium">{user.userId || 'N/A'}</TableCell>
                    <TableCell>{user.fullName || 'N/A'}</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{user.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
                    <TableCell>{user.gender || 'N/A'}</TableCell>
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
                    <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {userStatus[user.status] || user.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button> */}
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-4">
        <span>
          Trang {currentPage + 1} / {totalPages} ({totalElements} kết quả)
        </span>
        <div className="flex gap-2">
          <Button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          >
            Trang trước
          </Button>
          <Button
            disabled={currentPage + 1 >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          >
            Trang sau
          </Button>
        </div>
      </div>

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

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">ID:</span>
              </div>
              <div>{selectedDetail.userId || 'N/A'}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Họ và tên:</span>
              </div>
              <div>{selectedDetail.fullName || 'N/A'}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Email:</span>
              </div>
              <div>{selectedDetail.email || 'N/A'}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Ngày sinh:</span>
              </div>
              <div>{selectedDetail.dob ? new Date(selectedDetail.dob).toLocaleDateString('vi-VN') : 'N/A'}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Giới tính:</span>
              </div>
              <div>{selectedDetail.gender || 'N/A'}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Vai trò:</span>
              </div>
              <div>{selectedDetail.roleName || 'N/A'}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Số điện thoại:</span>
              </div>
              <div>{selectedDetail.phoneNumber || 'N/A'}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Địa chỉ:</span>
              </div>
              <div>{selectedDetail.address || 'N/A'}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Trạng thái:</span>
              </div>
              <div>{userStatus[selectedDetail.status] || selectedDetail.status}</div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Avatar:</span>
              </div>
              <div>
                {selectedDetail.avatarUrl ? (
                  <img
                    src={selectedDetail.avatarUrl}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                ) : (
                  'Không có'
                )}
              </div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default UserManagement;
