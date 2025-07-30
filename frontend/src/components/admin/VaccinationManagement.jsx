import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin, Info, Calendar as CalendarIcon, Layers, ClipboardList, BadgeCheck, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

import VaccinationForm from './VaccinationForm';
import { useAuth } from '@/contexts/AuthContext';
import vaccinationService from '../../api/services/vaccination.service';
const VaccinationManagement = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    targetGrade: 0,
    notes: '',
    vaccineType: '',
    location: '',
    manufacturer: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [errors, setErrors] = useState({});

  const statusOrder = {
    'APPROVED': 0, // Đang diễn ra
    'PENDING': 1, // Chờ duyệt
    'DONE': 2    // Đã xong
  };

  const filteredVaccinations = vaccinations
    .filter(vaccination =>
      vaccination.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaccination.targetGrade + '').includes(searchTerm)
    )
    .sort((a, b) => {
      const orderA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 99;
      const orderB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 99;
      return orderA - orderB;
    });

  
  useEffect(() => {
    fetchVaccinations();
}, []);

const fetchVaccinations = async () => {
    try {
        setLoading(true);
        const response = await vaccinationService.getAllVaccinations();
        console.log(response);
        setVaccinations(response || []);
        setError(null);
    } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error('Error fetching users:', err);
    } finally {
        setLoading(false);
    }
};

const validate = () => {
    const newErrors = {};
    const today = new Date();
    const minStartDate = new Date(today.setHours(0,0,0,0));
    minStartDate.setDate(minStartDate.getDate() + 30);

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    // Định dạng ngày dd/mm/yyyy
    const formatVNDate = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    
    let gradeStr = typeof formData.targetGrade === 'string' ? formData.targetGrade : '';
    gradeStr = gradeStr.replace(/\s+/g, ''); 
    const gradeArr = gradeStr.split(',').filter(Boolean);
    if (gradeArr.length === 0) {
        newErrors.targetGrade = "Vui lòng nhập khối lớp.";
    } else {
        const invalid = gradeArr.some(s => {
            const n = Number(s);
            return isNaN(n) || n < 1 || n > 5;
        });
        if (invalid) {
            newErrors.targetGrade = "Chỉ được nhập các số từ 1 đến 5, phân tách bằng dấu phẩy.";
        }
    }

    if (!formData.name || formData.name.trim() === "") {
        newErrors.name = "Vui lòng nhập tên chiến dịch.";
    }
    if (!formData.description || formData.description.trim() === "") {
        newErrors.description = "Vui lòng nhập mô tả.";
    }
    if (!formData.notes || formData.notes.trim() === "") {
        newErrors.notes = "Vui lòng nhập ghi chú.";
    }
    if (!formData.vaccineType || formData.vaccineType.trim() === "") {
        newErrors.vaccineType = "Vui lòng nhập loại vắc xin.";
    }
    if (!formData.location || formData.location.trim() === "") {
        newErrors.location = "Vui lòng nhập Tên địa điểm tiêm.";
    }
    if (!formData.manufacturer || formData.manufacturer.trim() === "") {
        newErrors.manufacturer = "Vui lòng nhập tên nhà sản xuất.";
    }

    if (!formData.startDate) {
        newErrors.startDate = "Vui lòng chọn ngày bắt đầu.";
    } else if (startDate < minStartDate) {
        newErrors.startDate = `Ngày bắt đầu phải ít nhất sau ngày hôm nay 30 ngày, tức là từ ngày ${formatVNDate(minStartDate)} trở đi.`;
    }

    if (!formData.endDate) {
        newErrors.endDate = "Vui lòng chọn ngày kết thúc.";
    } else if (formData.startDate && endDate < startDate) {
        newErrors.endDate = "Ngày kết thúc không được trước ngày bắt đầu.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  const handleCreateVaccination = async () => {
    setLoading(true);
    const targetGrades = String(formData.targetGrade || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const newVaccination = {
      ...formData,
      targetGrade: targetGrades,
      status: 'Scheduled'
    };
    try {
        if (!validate()) return;
        const response = await vaccinationService.createVaccination(newVaccination);
        console.log(response);
        fetchVaccinations();
        setIsCreateModalOpen(false);
        setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            targetGrade: 0,
            notes: '',
            vaccineType: '',
            location: '',
            manufacturer: ''
        });
        toast({
            title: 'Thành công!',
            description: 'Lịch tiêm chủng mới đã được tạo.',
        });
    } catch (error) {
        console.error(error);
        let errorMsg = 'Đã xảy ra lỗi.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        } else if (error.message) {
            errorMsg = error.message;
        } else {
            errorMsg = error.toString();
        }
        toast({
            title: 'Tạo lịch tiêm chủng thất bại',
            description: errorMsg,
        });
    } finally {
        setLoading(false);
    }
};

  const handleEditVaccination = async () => {
    const updatedVaccination = {
      ...formData,
      targetGrade: String(formData.targetGrade || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    };
    try {
        if (!validate()) return;
        const response = await vaccinationService.editVaccination(selectedVaccination.id, updatedVaccination);
        console.log(response);
        fetchVaccinations();
        setIsEditModalOpen(false);
        setSelectedVaccination(null);
        setFormData({
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            targetGrade: 0,
            notes: '',
            vaccineType: '',
            location: '',
            manufacturer: ''
        });
        toast({
            title: 'Thành công!',
            description: 'Lịch tiêm chủng đã được cập nhật.',
        });
    } catch (error) {
        console.error(error);
        let errorMsg = 'Đã xảy ra lỗi.';
        if (error.response && error.response.data && error.response.data.message) {
            errorMsg = error.response.data.message;
        } else if (error.message) {
            errorMsg = error.message;
        } else {
            errorMsg = error.toString();
        }
        toast({
            title: 'Cập nhật lịch tiêm chủng thất bại',
            description: errorMsg,
        });
    }
};

  const handleDeleteVaccination = async (vaccinationId) => {
    setLoading(true);
    try {
      await vaccinationService.deleteVaccination(vaccinationId);
      setVaccinations(vaccinations.filter(vaccination => vaccination.id !== vaccinationId));
      toast({
        title: "Thành công!",
        description: "Lịch tiêm chủng đã được xóa.",
      });
    } catch (error) {
      let errorMsg = 'Đã xảy ra lỗi.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      } else {
        errorMsg = error.toString();
      }
      toast({
        title: 'Xóa lịch tiêm chủng thất bại',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartVaccination = async (vaccinationId) => {
    setLoading(true);
    try {
      await vaccinationService.startVaccination(vaccinationId);
      fetchVaccinations();
      toast({ title: 'Chiến dịch tiêm chủng đã bắt đầu!' });
    } catch (error) {
      let errorMsg = 'Đã xảy ra lỗi.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      } else {
        errorMsg = error.toString();
      }
      toast({
        title: 'Bắt đầu chiến dịch thất bại',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndVaccination = async (vaccinationId) => {
    setLoading(true);
    try {
      await vaccinationService.endVaccination(vaccinationId);
      fetchVaccinations();
      toast({ title: 'Chiến dịch tiêm chủng đã kết thúc!' });
    } catch (error) {
      let errorMsg = 'Đã xảy ra lỗi.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      } else {
        errorMsg = error.toString();
      }
      toast({
        title: 'Kết thúc chiến dịch thất bại',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemindVaccination = async (vaccinationId) => {
    setLoading(true);
    try {
      await vaccinationService.remindVaccination(vaccinationId);
      toast({ title: 'Đã gửi nhắc nhở lịch tiêm chủng!' });
    } catch (error) {
      let errorMsg = 'Đã xảy ra lỗi.';
      if (error.response && error.response.data && error.response.data.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      } else {
        errorMsg = error.toString();
      }
      toast({
        title: 'Gửi nhắc nhở thất bại',
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (vaccination) => {
    setSelectedVaccination(vaccination);
    setFormData({
      name: vaccination.name,
      description: vaccination.description,
      startDate: vaccination.startDate,
      endDate: vaccination.endDate,
      targetGrade: vaccination.targetGrade,
      notes: vaccination.notes,
      vaccineType: vaccination.vaccineType,
      location: vaccination.location,
      manufacturer: vaccination.manufacturer || ''
    });
    setIsEditModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lịch tiêm chủng</h1>
          <p className="text-gray-600 mt-2">Lập lịch và quản lý các đợt tiêm chủng</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Tạo lịch tiêm
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo lịch tiêm chủng mới</DialogTitle>
            </DialogHeader>
            <VaccinationForm
              formData={formData}
              setFormData={setFormData}
              onCancel={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateVaccination}
              isEdit={false}
              loading={loading}
              errors={errors}
            />
          
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Danh sách lịch tiêm chủng</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm lịch tiêm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên chiến dịch</TableHead>
                <TableHead>Loại vắc xin</TableHead>
                <TableHead>Nhà sản xuất</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Khối lớp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVaccinations.map((vaccination) => (
                <TableRow
                  key={vaccination.id}
                  className="cursor-pointer"
                  onClick={() => { setSelectedDetail(vaccination); setIsDetailModalOpen(true); }}
                >
                  <TableCell className="font-medium">{vaccination.id}</TableCell>
                  <TableCell className="font-medium">{vaccination.name}</TableCell>
                  <TableCell>{vaccination.vaccineType}</TableCell>
                  <TableCell>{vaccination.manufacturer}</TableCell>
                  <TableCell>{vaccination.startDate}</TableCell>
                  <TableCell>{vaccination.endDate}</TableCell>
                  <TableCell>{Array.isArray(vaccination.targetGrade) ? (vaccination.targetGrade.length === 0 ? 'Toàn trường' : vaccination.targetGrade.join(', ')) : (vaccination.targetGrade === 0 ? 'Toàn trường' : vaccination.targetGrade)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vaccination.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      vaccination.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      vaccination.status === 'DONE' ? 'bg-orange-500 text-white' :
                      vaccination.status === 'REJECTED' ? 'bg-gray-400 text-white' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vaccination.status === 'PENDING' ? 'Chờ diễn ra' :
                        vaccination.status === 'APPROVED' ? 'Đang diễn ra' :
                        vaccination.status === 'DONE' ? 'Đã xong' :
                        vaccination.status === 'REJECTED' ? 'Đã xóa' :
                        vaccination.status}
                    </span>
                  </TableCell>
                  <TableCell>{vaccination.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    {(vaccination.status === 'PENDING' || vaccination.status === 'SCHEDULED') && (
                        <Button size="icon" variant="outline" onClick={() => handleRemindVaccination(vaccination.id)} disabled={loading}>
                          <Bell className="w-4 h-4 text-blue-500" />
                        </Button>
                      )}
                      {vaccination.status === 'PENDING' && (
                        <Button size="icon" variant="outline" onClick={() => openEditModal(vaccination)}>
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                      )}
                      {vaccination.status === 'PENDING' && (
                        <Button size="icon" variant="outline" onClick={() => handleDeleteVaccination(vaccination.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                      

                      {vaccination.status === 'PENDING' && (
                        <Button size="sm" className="bg-green-500 text-white hover:bg-green-600" onClick={() => handleStartVaccination(vaccination.id)} disabled={loading}>
                          Bắt đầu 
                        </Button>
                      )}
                      {vaccination.status === 'APPROVED' && (
                        <Button size="sm" className="bg-red-500 text-white hover:bg-red-600" onClick={() => handleEndVaccination(vaccination.id)} disabled={loading}>
                          Kết thúc 
                        </Button>
                      )}
                     
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
            <DialogTitle>Chỉnh sửa lịch tiêm chủng</DialogTitle>
          </DialogHeader>
          <VaccinationForm
            formData={formData}
            setFormData={setFormData}
            onCancel={() => setIsEditModalOpen(false)}
            onSubmit={handleEditVaccination}
            isEdit={true}
            loading={loading}
            errors={errors}
          />
         
          {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
          {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
          {errors.targetGrade && <div className="text-red-500 text-sm">{errors.targetGrade}</div>}
          {errors.notes && <div className="text-red-500 text-sm">{errors.notes}</div>}
          {errors.vaccineType && <div className="text-red-500 text-sm">{errors.vaccineType}</div>}
          {errors.startDate && <div className="text-red-500 text-sm">{errors.startDate}</div>}
          {errors.endDate && <div className="text-red-500 text-sm">{errors.endDate}</div>}
          {errors.manufacturer && <div className="text-red-500 text-sm">{errors.manufacturer}</div>}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết lịch tiêm chủng</DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 py-4">
              <div className="flex items-center gap-1">
                <Info className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Tên chiến dịch:</span>
              </div>
              <div className="truncate">{selectedDetail.name}</div>

              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Loại vắc xin:</span>
              </div>
              <div className="truncate">{selectedDetail.vaccineType}</div>

              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Nhà sản xuất:</span>
              </div>
              <div className="truncate">{selectedDetail.manufacturer}</div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Ngày bắt đầu:</span>
              </div>
              <div>{selectedDetail.startDate}</div>

              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Ngày kết thúc:</span>
              </div>
              <div>{selectedDetail.endDate}</div>

              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Khối lớp:</span>
              </div>
              <div>{Array.isArray(selectedDetail.targetGrade) ? (selectedDetail.targetGrade.length === 0 ? 'Toàn trường' : selectedDetail.targetGrade.join(', ')) : (selectedDetail.targetGrade === 0 ? 'Toàn trường' : selectedDetail.targetGrade)}</div>

              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Ghi chú:</span>
              </div>
              <div className="whitespace-pre-line">{selectedDetail.notes}</div>

              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Mô tả:</span>
              </div>
              <div className="whitespace-pre-line">{selectedDetail.description}</div>

              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Trạng thái:</span>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedDetail.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  selectedDetail.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  selectedDetail.status === 'DONE' ? 'bg-orange-500 text-white' :
                  selectedDetail.status === 'REJECTED' ? 'bg-gray-400 text-white' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedDetail.status === 'PENDING' ? 'Chờ diễn ra' :
                    selectedDetail.status === 'APPROVED' ? 'Đang diễn ra' :
                    selectedDetail.status === 'DONE' ? 'Đã xong' :
                    selectedDetail.status === 'REJECTED' ? 'Đã xóa' :
                    selectedDetail.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Ngày tạo:</span>
              </div>
              <div>{selectedDetail.createdAt}</div>
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

export default VaccinationManagement;
