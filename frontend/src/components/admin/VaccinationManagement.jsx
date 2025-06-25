
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const VaccinationManagement = () => {
  const [vaccinations, setVaccinations] = useState([
    {
      id: 1,
      vaccineName: 'Vắc xin COVID-19',
      date: '2024-06-15',
      time: '08:00',
      location: 'Phòng y tế trường',
      targetGroup: 'Học sinh lớp 10',
      capacity: 50,
      registered: 35,
      status: 'Scheduled'
    },
    {
      id: 2,
      vaccineName: 'Vắc xin Cúm mùa',
      date: '2024-06-20',
      time: '09:00',
      location: 'Hội trường A',
      targetGroup: 'Toàn trường',
      capacity: 200,
      registered: 156,
      status: 'Scheduled'
    },
    {
      id: 3,
      vaccineName: 'Vắc xin Viêm gan B',
      date: '2024-06-10',
      time: '14:00',
      location: 'Phòng y tế trường',
      targetGroup: 'Học sinh lớp 11',
      capacity: 60,
      registered: 60,
      status: 'Completed'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [formData, setFormData] = useState({
    vaccineName: '',
    date: '',
    time: '',
    location: '',
    targetGroup: '',
    capacity: '',
    description: ''
  });

  const filteredVaccinations = vaccinations.filter(vaccination =>
    vaccination.vaccineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vaccination.targetGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateVaccination = () => {
    const newVaccination = {
      id: vaccinations.length + 1,
      ...formData,
      capacity: parseInt(formData.capacity),
      registered: 0,
      status: 'Scheduled'
    };
    setVaccinations([...vaccinations, newVaccination]);
    setIsCreateModalOpen(false);
    setFormData({
      vaccineName: '',
      date: '',
      time: '',
      location: '',
      targetGroup: '',
      capacity: '',
      description: ''
    });
    toast({
      title: "Thành công!",
      description: "Lịch tiêm chủng mới đã được tạo.",
    });
  };

  const handleEditVaccination = () => {
    setVaccinations(vaccinations.map(vaccination =>
      vaccination.id === selectedVaccination.id
        ? { ...vaccination, ...formData, capacity: parseInt(formData.capacity) }
        : vaccination
    ));
    setIsEditModalOpen(false);
    setSelectedVaccination(null);
    setFormData({
      vaccineName: '',
      date: '',
      time: '',
      location: '',
      targetGroup: '',
      capacity: '',
      description: ''
    });
    toast({
      title: "Thành công!",
      description: "Lịch tiêm chủng đã được cập nhật.",
    });
  };

  const handleDeleteVaccination = (vaccinationId) => {
    setVaccinations(vaccinations.filter(vaccination => vaccination.id !== vaccinationId));
    toast({
      title: "Thành công!",
      description: "Lịch tiêm chủng đã được xóa.",
    });
  };

  const openEditModal = (vaccination) => {
    setSelectedVaccination(vaccination);
    setFormData({
      vaccineName: vaccination.vaccineName,
      date: vaccination.date,
      time: vaccination.time,
      location: vaccination.location,
      targetGroup: vaccination.targetGroup,
      capacity: vaccination.capacity.toString(),
      description: vaccination.description || ''
    });
    setIsEditModalOpen(true);
  };

  const VaccinationForm = ({ isEdit = false }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vaccineName">Tên vắc xin</Label>
          <Input
            id="vaccineName"
            value={formData.vaccineName}
            onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
            placeholder="Nhập tên vắc xin"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetGroup">Đối tượng</Label>
          <Select value={formData.targetGroup} onValueChange={(value) => setFormData({ ...formData, targetGroup: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn đối tượng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Học sinh lớp 10">Học sinh lớp 10</SelectItem>
              <SelectItem value="Học sinh lớp 11">Học sinh lớp 11</SelectItem>
              <SelectItem value="Học sinh lớp 12">Học sinh lớp 12</SelectItem>
              <SelectItem value="Toàn trường">Toàn trường</SelectItem>
              <SelectItem value="Giáo viên">Giáo viên</SelectItem>
              <SelectItem value="Nhân viên">Nhân viên</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Ngày tiêm</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time">Giờ tiêm</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="capacity">Sức chứa</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            placeholder="Số người tối đa"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Địa điểm</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Nhập địa điểm tiêm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Ghi chú</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Nhập ghi chú (tùy chọn)"
          className="w-full p-2 border border-gray-300 rounded-md resize-none h-20"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditModalOpen(false);
            } else {
              setIsCreateModalOpen(false);
            }
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={isEdit ? handleEditVaccination : handleCreateVaccination}
          className="btn-primary"
        >
          {isEdit ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </div>
  );

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
            <VaccinationForm />
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
                <TableHead>Vắc xin</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Địa điểm</TableHead>
                <TableHead>Đối tượng</TableHead>
                <TableHead>Đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVaccinations.map((vaccination) => (
                <TableRow key={vaccination.id}>
                  <TableCell className="font-medium">{vaccination.vaccineName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{vaccination.date}</span>
                      <Clock className="w-4 h-4 text-gray-500 ml-2" />
                      <span>{vaccination.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{vaccination.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{vaccination.targetGroup}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{vaccination.registered}</span>
                      <span className="text-gray-500">/{vaccination.capacity}</span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(vaccination.registered / vaccination.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vaccination.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      vaccination.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vaccination.status === 'Scheduled' ? 'Đã lên lịch' :
                       vaccination.status === 'Completed' ? 'Hoàn thành' : 'Đã hủy'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
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
          <VaccinationForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default VaccinationManagement;
