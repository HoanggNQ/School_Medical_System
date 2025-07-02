import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle, Calendar, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import MedicineForm from '@/components/nurse/MedicineForm';
import MedicineStats from '@/components/nurse/MedicineStats';
import medicalService from '@/api/services/medical.service';

const MedicineManagement = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [showApprovedDialog, setShowApprovedDialog] = useState(false);
  
  const initialFormData = {
    medicationName: '',
    category: '',
    dosageForm: '',
    prescriptionRequired: false,
    countryOfOrigin: '',
    description: '',
    medicationInformation: '',
    medicationImg: '',
    activeIngredient: '',
    manufacturer: '',
    quantity:0 
  };
  const [formData, setFormData] = useState(initialFormData);


  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await medicalService.getAllMedications({ page, size, sort: 'medicationName,ASC' });
      console.log('API response:', response);
      setMedicines(response.data?.content || []);
      setTotalPages(response.data?.totalPages || 0);
      setTotalElements(response.data?.totalElements || 0);
    } catch (error) {
      console.error('Error fetching medicines:', error, error?.response);
      setError(error.message || 'Failed to fetch medicines');
      setMedicines([]);
      toast({
        title: "Lỗi!",
        description: "Không thể tải danh sách thuốc. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  console.log("medicines tesst 11 ",medicines);

  const filteredMedicines = medicines.filter(medicine => {
    if (!medicine) return false;
    
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = (medicine.medicationName || '').toLowerCase().includes(searchLower);
    const manufacturerMatch = (medicine.manufacturer || '').toLowerCase().includes(searchLower);
    const categoryMatch = filterCategory === 'all' || medicine.category === filterCategory;
    
    return (nameMatch || manufacturerMatch) && categoryMatch;
  });

  const resetFormAndCloseModals = () => {
    setFormData(initialFormData);
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleCreateMedicine = async (newMedicineData) => {
    try {
      await medicalService.createMedication(newMedicineData);
      await fetchMedicines();
      resetFormAndCloseModals();
      toast({
        title: "Thành công!",
        description: "Thuốc mới đã được thêm vào kho.",
      });
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Không thể thêm thuốc mới. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const handleEditMedicine = async (updatedMedicineData) => {
    try {
      await medicalService.updateMedication(selectedMedicine.id, updatedMedicineData);
      await fetchMedicines();
      resetFormAndCloseModals();
      toast({
        title: "Thành công!",
        description: "Thông tin thuốc đã được cập nhật.",
      });
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Không thể cập nhật thông tin thuốc. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMedicine = async (medicineId) => {
    try {
      await medicalService.deleteMedication(medicineId);
      await fetchMedicines();
      toast({
        title: "Thành công!",
        description: "Thuốc đã được xóa khỏi kho.",
      });
    } catch (error) {
      toast({
        title: "Lỗi!",
        description: "Không thể xóa thuốc. Vui lòng thử lại sau.",
        variant: "destructive"
      });
    }
  };

  const openEditModal = (medicine) => {
    setSelectedMedicine(medicine);
    setFormData({
      medicationName: medicine.medicationName,
      category: medicine.category,
      dosageForm: medicine.dosageForm,
      prescriptionRequired: medicine.prescriptionRequired,
      countryOfOrigin: medicine.countryOfOrigin,
      description: medicine.description,
      medicationInformation: medicine.medicationInformation,
      medicationImg: medicine.medicationImg,
      activeIngredient: medicine.activeIngredient,
      manufacturer: medicine.manufacturer,
      quantity: medicine.quantity ?? 0
    });
    setIsEditModalOpen(true);
  };

  const fetchApprovedRequests = async () => {
    try {
      const response = await medicalService.getApprovedMedicationRequests();
      setApprovedRequests(response.data?.data || []);
      setShowApprovedDialog(true);
    } catch (error) {
      toast({
        title: 'Lỗi!',
        description: 'Không thể tải danh sách chấp nhận.',
        variant: 'destructive',
      });
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý thuốc</h1>
          <p className="text-gray-600 mt-2">Quản lý kho thuốc và vật tư y tế</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-50"
            onClick={fetchApprovedRequests}
          >
            <ListChecks className="w-4 h-4 mr-1" />
            Danh sách chấp nhận
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary" onClick={() => setFormData(initialFormData)}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm thuốc
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm thuốc mới</DialogTitle>
              </DialogHeader>
              <MedicineForm
                initialData={initialFormData}
                onSubmit={handleCreateMedicine}
                onCancel={() => setIsCreateModalOpen(false)}
                isEdit={false}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <MedicineStats medicines={medicines} />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Danh sách thuốc</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm thuốc..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Phân loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Thông thường">Thông thường</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 text-red-600">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <p>{error}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={fetchMedicines}
              >
                Thử lại
              </Button>
            </div>
          ) : filteredMedicines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Package className="w-8 h-8 mb-2" />
              <p>Không tìm thấy thuốc nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tên thuốc</TableHead>
                      <TableHead>Phân loại</TableHead>
                      <TableHead>Dạng bào chế</TableHead>
                      <TableHead>Yêu cầu đơn</TableHead>
                      <TableHead>Nước sản xuất</TableHead>
                      <TableHead>Ghi chú</TableHead>
                      <TableHead>Thông tin</TableHead>
                      {/* <TableHead>Hoạt chất</TableHead> */}
                      <TableHead>Nhà sản xuất</TableHead> 
                      <TableHead>Số lượng</TableHead> {/* Thêm cột số lượng */}
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMedicines.map((medicine) => (
                      <TableRow key={medicine.id}>
                        <TableCell>{medicine.id}</TableCell>
                        <TableCell className="font-medium">{medicine.medicationName || 'N/A'}</TableCell>
                        <TableCell>{medicine.category || 'N/A'}</TableCell>
                        <TableCell>{medicine.dosageForm || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            medicine.prescriptionRequired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {medicine.prescriptionRequired ? 'Có' : 'Không'}
                          </span>
                        </TableCell>
                        <TableCell>{medicine.countryOfOrigin || 'N/A'}</TableCell>
                        <TableCell>{medicine.description || 'N/A'}</TableCell>
                        <TableCell>{medicine.medicationInformation || 'N/A'}</TableCell>
                        {/* <TableCell>{medicine.activeIngredient || 'N/A'}</TableCell> */}
                        <TableCell>{medicine.manufacturer || 'N/A'}</TableCell>
                         <TableCell>{medicine.quantity ?? 0}</TableCell> {/* Hiển thị số lượng */}
                        <TableCell>
                          {medicine.createdAt
                            ? new Date(medicine.createdAt).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              })
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="mr-2" onClick={() => openEditModal(medicine)}>
                            Cập nhật
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteMedicine(medicine.id)}>
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="flex justify-center items-center mt-8 gap-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  Trang trước
                </Button>
                <span>
                  Trang {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                >
                  Trang sau
                </Button> */}
                <span className="ml-4 text-sm text-gray-500">Tổng: {totalElements} thuốc</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin thuốc</DialogTitle>
          </DialogHeader>
          {selectedMedicine && (
            <MedicineForm
              initialData={formData}
              onSubmit={handleEditMedicine}
              onCancel={() => setIsEditModalOpen(false)}
              isEdit={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showApprovedDialog} onOpenChange={setShowApprovedDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Danh sách yêu cầu thuốc đã chấp nhận</DialogTitle>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            {approvedRequests.length === 0 ? (
              <div className="text-gray-500">Không có yêu cầu nào được chấp nhận.</div>
            ) : (
              <table className="min-w-full text-sm border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">ID</th>
                    <th className="border px-2 py-1">Tên học sinh</th>
                    <th className="border px-2 py-1">Năm học</th>
                    <th className="border px-2 py-1">Ghi chú</th>
                    <th className="border px-2 py-1">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="border px-2 py-1">{req.id}</td>
                      <td className="border px-2 py-1">{req.studentName}</td>
                      <td className="border px-2 py-1">{req.academicYear}</td>
                      <td className="border px-2 py-1">{req.notes}</td>
                      <td className="border px-2 py-1">
                        <ul className="list-disc pl-4">
                          {req.details?.map((d, idx) => (
                            <li key={idx}>
                              {d.medicationName} - {d.dosage} - {d.frequency}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default MedicineManagement;