import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, Filter, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import UserService from '../../api/services/user.service';
import StudentForm from './StudentForm';



const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    gender: '',
    roleName: 'STUDENT',
    address: '',
    username: '',
    password: '',
    confirmPassword: '',
    classId: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    parentId: 0
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);
  const [sort, setSort] = useState('studentId.asc');

  useEffect(() => {
    fetchUsers(currentPage);
    console.log("Users",users);
  }, [currentPage, searchTerm, sort]);

  const fetchUsers = async (page = 0) => {
    try {
      setLoading(true);
      const response = await UserService.getAllStudentStudent({ page, sort, search: searchTerm });
      setUsers(response.data.students || []);
      setTotalPages(response.data.totalPages || 0);
      setTotalElements(response.data.totalElements || 0);
      setCurrentPage(response.data.currentPage || 0);
      setError(null);
      console.log("healthCheckConsents",response);
    } catch (err) {
      setError('Failed to fetch health check consents. Please try again later.');
      console.error('Error fetching health check consents:', err);
    } finally {
      setLoading(false);
    }
  };

  const students = users;

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
      // Chuẩn bị data đúng cấu trúc
      const data = {
        classId: Number(formData.classId) || 0,
        parentId: Number(formData.parentId) || 0,
        userRegister: {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          fullName: formData.fullName,
          address: formData.address,
          gender: formData.gender,
          dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : '',
          phoneNumber: formData.phoneNumber,
          roleName: 'STUDENT'
        },
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone
      };

  
      const response = await UserService.registerstudent(data);
      
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
        roleName: 'STUDENT',
        address: '',
        username: '',
        password: '',
        confirmPassword: '',
        classId: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        parentId: 0
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
      const response = await UserService.updateUser(selectedStudent.id, formData);
      if (response.data.success) {
        setUsers(users.map(user =>
          user.id === selectedStudent.id ? response.data.data.user : user
        ));
        setIsEditModalOpen(false);
        setSelectedStudent(null);
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

  const handleDeleteUser = async (studentId) => {
    try {
      const response = await UserService.deleteUser({studentId});
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

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      dob: student.dob,
      gender: student.gender,
      roleName: student.roleName,
      address: student.address,
      username: student.userName,
      password: student.password,
      confirmPassword: student.password
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý học sinh</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateClassModalOpen} onOpenChange={setIsCreateClassModalOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tạo lớp mới</DialogTitle>
                <DialogDescription>
                  (Chức năng tạo lớp - bạn có thể bổ sung form chi tiết sau)
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => setIsCreateClassModalOpen(false)}>Đóng</Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* <Button className="btn-secondary" onClick={() => setIsCreateClassModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo lớp
          </Button> */}
          <Dialog open={isCreateModalOpen} onOpenChange={(open) => setIsCreateModalOpen(open)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo người dùng mới</DialogTitle>
                <DialogDescription>
                  Điền thông tin chi tiết để tạo người dùng mới trong hệ thống.
                </DialogDescription>
              </DialogHeader>
              <StudentForm
                formData={formData}
                handleInputChange={handleInputChange}
                onCancel={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateUser}
              />
            </DialogContent>
          </Dialog>
          <Button className="btn-primary" onClick={() => setIsCreateModalOpen(true)} disabled={loadingCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm Học Sinh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Danh sách học sinh ({totalElements} học sinh)</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên học sinh..."
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
                  <SelectItem value="studentId.asc">Mặc định (ID học sinh)</SelectItem>
                  <SelectItem value="fullName.asc">Tên học sinh (A-Z)</SelectItem>
                  <SelectItem value="fullName.desc">Tên học sinh (Z-A)</SelectItem>
                  <SelectItem value="className.asc">Lớp (A-Z)</SelectItem>
                  <SelectItem value="className.desc">Lớp (Z-A)</SelectItem>
                  <SelectItem value="studentCode.asc">Mã học sinh (A-Z)</SelectItem>
                  <SelectItem value="studentCode.desc">Mã học sinh (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Mã học sinh</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Phụ huynh</TableHead>
                {/* <TableHead>Mã phụ huynh</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="8" className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? 'Không tìm thấy học sinh nào phù hợp với từ khóa tìm kiếm'
                      : 'Không có học sinh nào'}
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.studentId} className="cursor-pointer" onClick={() => { setSelectedDetail(student); setIsDetailModalOpen(true); }}>
                    <TableCell className="font-medium">{student.studentId || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{student.studentCode || 'N/A'}</TableCell>
                    <TableCell>{student.fullName || 'N/A'}</TableCell>
                    <TableCell>{student.className || 'N/A'}</TableCell>
                    <TableCell>{student.dob ? new Date(student.dob).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
                    <TableCell>{student.gender === 'MALE' ? 'Nam' : student.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</TableCell>
                    <TableCell>{student.phoneNumber || 'N/A'}</TableCell>
                    <TableCell>{student.parentName || 'N/A'}</TableCell>
                    {/* <TableCell>{student.parentID || 'N/A'}</TableCell> */}
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
          <StudentForm
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
            <DialogTitle>Chi tiết học sinh</DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="flex flex-col items-center mb-4">
              {selectedDetail.avatarUrl ? (
                <img src={selectedDetail.avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover border mb-2" />
              ) : (
                <UserCircle className="w-20 h-20 text-gray-300 bg-gray-100 rounded-full p-2 border mb-2" />
              )}
              <div className="text-lg font-bold text-orange-700">{selectedDetail.fullName}</div>
              {selectedDetail.studentCode && (
                <div className="text-gray-500 text-sm">Mã học sinh: <span className="font-semibold text-gray-700">{selectedDetail.studentCode}</span></div>
              )}
            </div>
          )}
          {selectedDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 py-2">
              {selectedDetail.fullName && (
                <>
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Họ và tên:</span></div>
                  <div>{selectedDetail.fullName}</div>
                </>
              )}
              {selectedDetail.className && (
                <>
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Lớp:</span></div>
                  <div>{selectedDetail.className}</div>
                </>
              )}
              {selectedDetail.dob && (
                <>
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Ngày sinh:</span></div>
                  <div>{new Date(selectedDetail.dob).toLocaleDateString('vi-VN')}</div>
                </>
              )}
              {selectedDetail.gender && (
                <>
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Giới tính:</span></div>
                  <div>{selectedDetail.gender === 'MALE' ? 'Nam' : selectedDetail.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</div>
                </>
              )}
              {selectedDetail.phoneNumber && (
                <>
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Số điện thoại:</span></div>
                  <div>{selectedDetail.phoneNumber}</div>
                </>
              )}
              {selectedDetail.address && (
                <>
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Địa chỉ:</span></div>
                  <div>{selectedDetail.address}</div>
                </>
              )}
              {selectedDetail.parentName && (
                <>
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Phụ huynh:</span></div>
                  <div>{selectedDetail.parentName}</div>
                </>
              )}
              {selectedDetail.parentID && (
                <>
                  <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Mã phụ huynh:</span></div>
                  <div>{selectedDetail.parentID}</div>
                </>
              )}
              {/* Thêm các trường khác nếu có dữ liệu */}
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

export default StudentManagement;
