import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Calendar, Clock, MapPin, BadgeCheck, Info, Calendar as CalendarIcon, Package, Layers, User, ClipboardList, Bell, Stethoscope, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import CampaignForm from './CampaignForm';
import campaignService from '../../api/services/campain.service';

const CampaignManagement = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        targetGrade: 0,
        location: ''
    });

    const [loading, setLoading] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const statusOrder = {
        'APPROVED': 0, // Đang diễn ra
        'PENDING': 1,  // Chờ duyệt
        'DONE': 2      // Đã xong
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const response = await campaignService.getAllCampaigns();
            console.log(response);
            setCampaigns(response || []);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCampaigns = campaigns
        .filter(campaign =>
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (campaign.targetGrade + '').includes(searchTerm)
        )
        .sort((a, b) => {
            const orderA = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 99;
            const orderB = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 99;
            return orderA - orderB;
        });

    const handleCreateCampaign = async () => {
        setLoading(true);
        const targetGrades = String(formData.targetGrade || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      
        const newCampaign = {
          ...formData,
          targetGrade: targetGrades, 
        };
      
          try {
              if (!validate()) return;
              const response = await campaignService.createCampaign(newCampaign);
              console.log(response);
              fetchCampaigns();
              setIsCreateModalOpen(false);
              setFormData({
                  name: '',
                  description: '',
                  startDate: '',
                  endDate: '',
                  targetGrade: 0,
                  location: ''
              });
              toast({
                  title: 'Thành công!',
                  description: 'Chiến dịch mới đã được tạo.',
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
                  title: 'Tạo chiến dịch thất bại',
                  description: errorMsg,
              });
          } finally {
              setLoading(false);
          }
    };

    const handleEditCampaign = async () => {
        setLoading(true);
        
        const updatedCampaign = {
            ...formData,
            targetGrade: String(formData.targetGrade || '')
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
             
        };
        try {
            if (!validate()) return;
            const response = await campaignService.editCampaign(selectedCampaign.id, updatedCampaign);
            console.log(response);
            fetchCampaigns();
            setIsEditModalOpen(false);
            setSelectedCampaign(null);
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                targetGrade: 0,
                location: ''
            });
            toast({
                title: 'Thành công!',
                description: 'Chiến dịch đã được cập nhật.',
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
                title: 'Cập nhật chiến dịch thất bại',
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCampaign = async (campaignId) => {
        setLoading(true);
        try {
            await campaignService.deleteCampaign(campaignId);
            await fetchCampaigns();
            toast({
                title: 'Thành công!',
                description: 'Chiến dịch đã được xóa.',
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
                title: 'Xóa chiến dịch thất bại',
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStartCampaign = async (campaignId) => {
        setLoading(true);
        try {
            await campaignService.startCampaign(campaignId);
            fetchCampaigns();
            toast({ title: 'Chiến dịch đã bắt đầu!' });
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
                title: 'Bắt đầu chiến dịch thất bại',
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEndCampaign = async (campaignId) => {
        setLoading(true);
        try {
            await campaignService.endCampaign(campaignId);
            fetchCampaigns();
            toast({ title: 'Chiến dịch đã kết thúc!' });
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
                title: 'Kết thúc chiến dịch thất bại',
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemindCampaign = async (campaignId) => {
        setLoading(true);
        try {
            await campaignService.remindCampaign(campaignId);
            fetchCampaigns();
            toast({ title: 'Đã gửi nhắc nhở chiến dịch!' });
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
                title: 'Gửi nhắc nhở thất bại',
                description: errorMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (campaign) => {
        setSelectedCampaign(campaign);
        setFormData({
            name: campaign.name,
            description: campaign.description,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            targetGrade: Array.isArray(campaign.targetGrade) ? campaign.targetGrade.join(', ') : campaign.targetGrade,
            location: campaign.location
        });
        setIsEditModalOpen(true);
    };

    const validate = () => {
        const newErrors = {};
        const today = new Date();
        const minStartDate = new Date(today.setHours(0,0,0,0));
        minStartDate.setDate(minStartDate.getDate() + 30);

        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);

        const formatVNDate = (date) => {
            const d = new Date(date);
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        // Validate khối lớp chỉ cho phép 1-12, không rỗng, không NaN
        let gradeStr = typeof formData.targetGrade === 'string' ? formData.targetGrade : '';
        gradeStr = gradeStr.replace(/\s+/g, ''); // loại bỏ khoảng trắng
        const gradeArr = gradeStr.split(',').filter(Boolean);
        if (gradeArr.length === 0) {
            newErrors.targetGrade = "Vui lòng nhập khối lớp.";
        } else {
            const invalid = gradeArr.some(s => {
                const n = Number(s);
                return isNaN(n) || n < 1 || n > 12;
            });
            if (invalid) {
                newErrors.targetGrade = "Chỉ được nhập các số từ 1 đến 12, phân tách bằng dấu phẩy.";
            }
        }

        if (!formData.name || formData.name.trim() === "") {
            newErrors.name = "Vui lòng nhập tên chiến dịch.";
        }
        if (!formData.description || formData.description.trim() === "") {
            newErrors.description = "Vui lòng nhập mô tả.";
        }
        // if (!formData.targetGrade && formData.targetGrade !== 0) {
        //     newErrors.targetGrade = "Vui lòng nhập khối lớp.";
        // }
        if (!formData.location || formData.location.trim() === "") {
            newErrors.location = "Vui lòng nhập địa điểm tổ chức.";
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <span className="bg-blue-200 p-2 rounded-full">
                        <Syringe className="h-7 w-7 text-blue-700" />
                    </span>
                    <div>
                        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">Quản lý chiến dịch</h1>
                        <p className="text-blue-500 mt-2">Quản lý các chiến dịch tiêm chủng và sự kiện sức khỏe</p>
                    </div>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Tạo chiến dịch mới</DialogTitle>
                        </DialogHeader>
                       
                        <CampaignForm 
                              formData={formData}
                              setFormData={setFormData}
                              onCancel={() => setIsCreateModalOpen(false)}
                              onSubmit={handleCreateCampaign}
                              isEdit={false}
                              loading={loading}
                              errors={errors}
                        />
                      
                
                    </DialogContent>
                </Dialog>
                <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md rounded-lg px-4 py-2 transition">
                    <Plus className="w-5 h-5" />
                    Tạo chiến dịch
                </Button>
            </div>
            <Card className="bg-white/90 shadow border border-blue-100 rounded-xl">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <CardTitle>Danh sách chiến dịch</CardTitle>
                        <div className="relative w-full sm:w-80">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                            <Input
                                placeholder="Tìm kiếm chiến dịch..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                               className="pl-10 rounded-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
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
                                {/* <TableHead>Mô tả</TableHead> */}
                                <TableHead>Ngày bắt đầu</TableHead>
                                <TableHead>Ngày kết thúc</TableHead>
                                <TableHead>Địa điểm</TableHead>
                                {/* <TableHead>Thiết bị yêu cầu</TableHead> */}
                                <TableHead>Khối lớp</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead>Ngày tạo</TableHead>
                                {/* <TableHead>Người tạo (ID)</TableHead> */}
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampaigns.map((campaign) => (
                                <TableRow key={campaign.id} className="cursor-pointer hover:bg-blue-50 transition" onClick={() => { setSelectedDetail(campaign); setIsDetailModalOpen(true); }}>
                                    <TableCell className="font-medium">{campaign.id}</TableCell>
                                    <TableCell className="font-medium">{campaign.name}</TableCell>
                                    {/* <TableCell>{campaign.description}</TableCell> */}
                                    <TableCell>{campaign.startDate}</TableCell>
                                    <TableCell>{campaign.endDate}</TableCell>
                                    <TableCell>{campaign.location}</TableCell>
                                    {/* <TableCell>{campaign.requiredEquipment}</TableCell> */}
                                    <TableCell>{Array.isArray(campaign.targetGrade) ? (campaign.targetGrade.length === 0 ? 'Toàn trường' : campaign.targetGrade.join(', ')) : (campaign.targetGrade === 0 ? 'Toàn trường' : campaign.targetGrade)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1
                                            ${campaign.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            campaign.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            campaign.status === 'DONE' ? 'bg-blue-100 text-blue-800' :
                                            campaign.status === 'REJECTED' ? 'bg-gray-400 text-white' :
                                            'bg-gray-100 text-gray-800'}
                                        `}>
                                            <BadgeCheck className="h-3 w-3 text-blue-500" />
                                            {campaign.status === 'PENDING' ? 'Chờ diễn ra' :
                                                campaign.status === 'APPROVED' ? 'Đang diễn ra' :
                                                    campaign.status === 'DONE' ? 'Đã xong' :
                                                        campaign.status === 'REJECTED' ? 'Đã xóa' :
                                                        campaign.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{campaign.createdAt}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                            
                                            {(campaign.status === 'PENDING' || campaign.status === 'SCHEDULED') && (
                                                <Button size="icon" variant="outline" onClick={() => handleRemindCampaign(campaign.id)} disabled={loading} className="border-blue-200 hover:bg-blue-50">
                                                    <Bell className="w-4 h-4 text-blue-500" />
                                                </Button>
                                            )}
                                            {(campaign.status === 'PENDING' || campaign.status === 'SCHEDULED') && (
                                                <Button size="icon" variant="outline" onClick={() => openEditModal(campaign)} className="border-blue-200 hover:bg-blue-50">
                                                    <Edit className="w-4 h-4 text-blue-500" />
                                                </Button>
                                            )}
                                            {(campaign.status === 'PENDING' || campaign.status === 'SCHEDULED') && (
                                                <Button size="icon" variant="outline" onClick={() => handleDeleteCampaign(campaign.id)} className="border-blue-200 hover:bg-blue-50">
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            )}
                                            {(campaign.status === 'PENDING' || campaign.status === 'SCHEDULED') && (
                                                <Button size="sm" className="bg-green-500 text-white hover:bg-green-600 rounded-lg" onClick={() => handleStartCampaign(campaign.id)} disabled={loading}>
                                                    Bắt Đầu 
                                                </Button>
                                            )}
                                            {campaign.status === 'APPROVED' && (
                                                <Button size="sm" className="bg-red-500 text-white hover:bg-red-600 rounded-lg" onClick={() => handleEndCampaign(campaign.id)} disabled={loading}>
                                                    Kết Thúc 
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
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                
                        <DialogTitle>Chỉnh sửa chiến dịch</DialogTitle>
                    </DialogHeader>
                   
                    <CampaignForm 
                          formData={formData}
                          setFormData={setFormData}
                          onCancel={() => setIsEditModalOpen(false)}
                          onSubmit={handleEditCampaign}
                          isEdit={true}
                          loading={loading}
                          errors={errors}
                    />
                  
              
                </DialogContent>
            </Dialog>
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl">
                    <DialogHeader>
                        <DialogTitle className="text-blue-700 flex items-center gap-2"><Syringe className="h-5 w-5 text-blue-500" />Chi tiết chiến dịch</DialogTitle>
                    </DialogHeader>
                    {selectedDetail && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y- py-4">
                            <div className="flex items-center gap-1">
                                <Info className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-blue-700">Tên chiến dịch:</span>
                            </div>
                            <div className="truncate">{selectedDetail.name}</div>

                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-blue-700">Mô tả:</span>
                            </div>
                            <div className="break-words whitespace-pre-line">{selectedDetail.description}</div>

                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-blue-700">Ngày bắt đầu:</span>
                            </div>
                            <div>{selectedDetail.startDate}</div>

                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-blue-700">Ngày kết thúc:</span>
                            </div>
                            <div>{selectedDetail.endDate}</div>

                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-blue-700">Địa điểm:</span>
                            </div>
                            <div className="truncate">{selectedDetail.location}</div>

                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-blue-700">Khối lớp:</span>
                            </div>
                            <div>{Array.isArray(selectedDetail.targetGrade) ? (selectedDetail.targetGrade.length === 0 ? 'Toàn trường' : selectedDetail.targetGrade.join(', ')) : (selectedDetail.targetGrade === 0 ? 'Toàn trường' : selectedDetail.targetGrade)}</div>

                            <div className="flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                                <span className="font-semibold text-blue-700">Trạng thái:</span>
                            </div>
                            <div>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    selectedDetail.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    selectedDetail.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                    selectedDetail.status === 'DONE' ? 'bg-blue-100 text-blue-800' :
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
                                <span className="font-semibold text-blue-700">Ngày tạo:</span>
                            </div>
                            <div>{selectedDetail.createdAt}</div>

                            {selectedDetail.createdById && <>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span className="font-semibold text-blue-700">Người tạo (ID):</span>
                                </div>
                                <div>{selectedDetail.createdById}</div>
                            </>}
                        </div>
                    )}
                    <div className="flex justify-end mt-4">
                        <Button variant="outline" onClick={() => setIsDetailModalOpen(false)} className="border-blue-200 hover:bg-blue-50">Đóng</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default CampaignManagement; 