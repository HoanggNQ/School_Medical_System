import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin, Info, Calendar as CalendarIcon, Layers, ClipboardList, BadgeCheck } from 'lucide-react';
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
    vaccineType: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const filteredVaccinations = vaccinations.filter(vaccination =>
    vaccination.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vaccination.targetGrade + '').includes(searchTerm)
  );

  
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

  const handleCreateVaccination = async () => {
    const newVaccination = {
   
      ...formData,
      targetGrade: Number(formData.targetGrade),
      status: 'Scheduled'
    };
    const response = await vaccinationService.createVaccination(newVaccination, user.id);
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
      vaccineType: ''
    });
    toast({
      title: 'Thành công!',
      description: 'Lịch tiêm chủng mới đã được tạo.',
    });
  };

  const handleEditVaccination = async () => {
    const updatedVaccination = {
      ...formData,
      targetGrade: Number(formData.targetGrade)
    };
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
      vaccineType: ''
    });
    toast({
      title: 'Thành công!',
      description: 'Lịch tiêm chủng đã được cập nhật.',
    });
  };

  const handleDeleteVaccination = (vaccinationId) => {
    setVaccinations(vaccinations.filter(vaccination => vaccination.id !== vaccinationId));
    toast({
      title: "Thành công!",
      description: "Lịch tiêm chủng đã được xóa.",
    });
  };

  const handleStartVaccination = async (vaccinationId) => {
    setLoading(true);
    await vaccinationService.startVaccination(vaccinationId);
    fetchVaccinations();
    toast({ title: 'Chiến dịch tiêm chủng đã bắt đầu!' });
    setLoading(false);
  };

  const handleEndVaccination = async (vaccinationId) => {
    setLoading(true);
    await vaccinationService.endVaccination(vaccinationId);
    fetchVaccinations();
    toast({ title: 'Chiến dịch tiêm chủng đã kết thúc!' });
    setLoading(false);
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
      vaccineType: vaccination.vaccineType
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
                <TableHead>Tên chiến dịch</TableHead>
                <TableHead>Loại vắc xin</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Khối lớp</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
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
                  <TableCell className="font-medium">{vaccination.name}</TableCell>
                  <TableCell>{vaccination.vaccineType}</TableCell>
                  <TableCell>{vaccination.startDate}</TableCell>
                  <TableCell>{vaccination.endDate}</TableCell>
                  <TableCell>{vaccination.targetGrade === 0 ? 'Toàn trường' : `Khối ${vaccination.targetGrade}`}</TableCell>
                  <TableCell>{vaccination.notes}</TableCell>
                  <TableCell>{vaccination.description}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vaccination.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      vaccination.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      vaccination.status === 'DONE' ? 'bg-gray-400 text-white' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vaccination.status === 'PENDING' ? 'Chờ duyệt' :
                        vaccination.status === 'ACTIVE' ? 'Đang diễn ra' :
                        vaccination.status === 'DONE' ? 'Đã xong' :
                        vaccination.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {/* <div className="flex space-x-2"> */}
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(vaccination)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteVaccination(vaccination.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      {vaccination.status === 'PENDING' && (
                        <Button size="sm" className="bg-green-500 text-white hover:bg-green-600" onClick={() => handleStartVaccination(vaccination.id)} disabled={loading}>
                          Bắt đầu chiến dịch
                        </Button>
                      )}
                      {vaccination.status === 'ACTIVE' && (
                        <Button size="sm" className="bg-red-500 text-white hover:bg-red-600" onClick={() => handleEndVaccination(vaccination.id)} disabled={loading}>
                          Kết thúc chiến dịch
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
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Chi tiết chiến dịch tiêm chủng</DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 py-2">
              <div className="flex items-center gap-2">
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
              <div>{selectedDetail.targetGrade === 0 ? 'Toàn trường' : `Khối ${selectedDetail.targetGrade}`}</div>

              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Ghi chú:</span>
              </div>
              <div className="truncate">{selectedDetail.notes}</div>

              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Mô tả:</span>
              </div>
              <div className="truncate">{selectedDetail.description}</div>

              <div className="flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-gray-700">Trạng thái:</span>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  selectedDetail.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  selectedDetail.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  selectedDetail.status === 'DONE' ? 'bg-gray-400 text-white' :
                  'bg-red-100 text-gray-800'
                }`}>
                  {selectedDetail.status === 'PENDING' ? 'Chờ duyệt' :
                    selectedDetail.status === 'APPROVED' ? 'Đang diễn ra' :
                    selectedDetail.status === 'DONE' ? 'Đã xong' :
                    selectedDetail.status}
                </span>
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

export default VaccinationManagement;
