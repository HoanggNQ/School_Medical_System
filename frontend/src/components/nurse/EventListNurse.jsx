import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { medicalService } from '../../api/services/medical.service';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { useCallback } from 'react';

const statusMap = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Đang diễn ra', color: 'bg-green-100 text-green-800' },
  DONE: { label: 'Đã xong', color: 'bg-gray-400 text-white' },
  REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-800' },
};

const EventListNurse = () => {
  const { toast  } = useToast();
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setErroror] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ scheduleTime: '', reason: '' });
  const [creatingSchedule, setCreatingSchedule] = useState(false);
  const [selectedScheduleStudent, setSelectedScheduleStudent] = useState(null);
  const [consultationSchedules, setConsultationSchedules] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setErroror(null);
      try {
        const res = await medicalService.getHealthCheckResultsByCampaign(campaignId);
        setResults(res.data || []);
        // Lấy danh sách lịch tư vấn
        const consultRes = await medicalService.getConsultationSchedules(0, 1000); // lấy nhiều để đủ
        setConsultationSchedules(consultRes.data?.content || []);
      } catch (error) {
        setErroror(error?.message || 'Lỗi khi tải danh sách kết quả khám sức khỏe');
      } finally {
        setLoading(false);
      }
    };
    if (campaignId) fetchResults();
  }, [campaignId]);

  // Hàm kiểm tra đã tạo lịch tư vấn cho học sinh này chưa
  const hasConsultationSchedule = useCallback((studentId) => {
    return consultationSchedules.some(sch => sch.studentId === studentId);
  }, [consultationSchedules]);

  // Filtered data
  const filteredResults = results.filter(ev =>
    (ev.studentName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers
  const handleRowClick = (ev) => {
    setSelectedDetail(ev);
    setIsDetailModalOpen(true);
  };
  const handleCreateScheduleClick = (ev) => {
    setSelectedScheduleStudent(ev);
    setShowCreateScheduleModal(true);
  };
  const handleSubmitSchedule = async (e) => {
    e.preventDefault();
    if (!scheduleForm.scheduleTime || !scheduleForm.reason) {
      toast({ title: 'Lỗi', description: 'Vui lòng nhập đầy đủ thông tin.' });
      return;
    }
    setCreatingSchedule(true);
    try {
      const res = await medicalService.createConsultationSchedule({
        studentId: selectedScheduleStudent.studentId,
        resultId: selectedScheduleStudent.id,
        scheduleTime: scheduleForm.scheduleTime,
        reason: scheduleForm.reason,
      });
      toast({ title: 'Thành công', description: 'Đã tạo lịch tư vấn y tế.' });
      setShowCreateScheduleModal(false);
      setScheduleForm({ scheduleTime: '', reason: '' });
    } catch (error) {
      const errorMessage = error.customMessage || 
                           error.response?.data?.message || 
                           error.message || 
                           'Đã có lỗi xảy ra.';
      
      console.log("Lỗi chi tiết:", error);
      console.log("customMessage chi tiết  :", error.customMessage);

      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    
    } finally {
      setCreatingSchedule(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kết quả khám sức khỏe</h1>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Danh sách kết quả khám sức khỏe</CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Đang tải...</span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center p-4">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Người khám</TableHead>
                  <TableHead>Trạng thái sức khỏe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">Không có kết quả</TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map(ev => (
                    <TableRow key={ev.id} className="cursor-pointer" onClick={() => handleRowClick(ev)}>
                      <TableCell className="font-medium">{ev.id}</TableCell>
                      <TableCell>{ev.studentName}</TableCell>
                      <TableCell>{ev.checkedByName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ev.healthStatus === 'TỐT' ? 'bg-green-100 text-green-800' : ev.healthStatus === 'XẤU' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'}`}>{ev.healthStatus}</span>
                        {ev.healthStatus === 'XẤU' && (
                          hasConsultationSchedule(ev.studentId)
                            ? <span className="ml-2 text-green-600 font-semibold">Đã tạo lịch khám</span>
                            : <Button
                                size="sm"
                                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleCreateScheduleClick(ev);
                                }}
                              >
                                Tạo lịch khám
                              </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết kết quả khám sức khỏe</DialogTitle>
          </DialogHeader>
          {selectedDetail && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 py-2">
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">ID:</span></div>
              <div>{selectedDetail.id}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Tên học sinh:</span></div>
              <div>{selectedDetail.studentName}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Chiến dịch:</span></div>
              <div>{selectedDetail.campaignName}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Người khám:</span></div>
              <div>{selectedDetail.checkedByName}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Ngày khám:</span></div>
              <div>{selectedDetail.checkDate}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Chiều cao (cm):</span></div>
              <div>{selectedDetail.heightCm}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Cân nặng (kg):</span></div>
              <div>{selectedDetail.weightKg}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">BMI:</span></div>
              <div>{selectedDetail.bmi}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Thị lực trái:</span></div>
              <div>{selectedDetail.visionLeft}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Thị lực phải:</span></div>
              <div>{selectedDetail.visionRight}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Thính lực:</span></div>
              <div>{selectedDetail.hearing}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Răng miệng:</span></div>
              <div>{selectedDetail.dentalHealth}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Huyết áp:</span></div>
              <div>{selectedDetail.bloodPressure}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Mạch:</span></div>
              <div>{selectedDetail.pulse}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Nhiệt độ:</span></div>
              <div>{selectedDetail.temperature}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Ghi chú khác:</span></div>
              <div>{selectedDetail.otherNotes}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Khuyến nghị:</span></div>
              <div>{selectedDetail.recommendation}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Ghi chú theo dõi:</span></div>
              <div>{selectedDetail.followUpNotes}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Đánh giá tổng thể:</span></div>
              <div>{selectedDetail.overallHealthRating}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Năm học:</span></div>
              <div>{selectedDetail.academicYear}</div>
              <div className="flex items-center gap-2"><span className="font-semibold text-gray-700">Trạng thái sức khỏe:</span></div>
              <div>{selectedDetail.healthStatus}</div>
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showCreateScheduleModal} onOpenChange={setShowCreateScheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo lịch tư vấn y tế</DialogTitle>
          </DialogHeader>
          {selectedScheduleStudent && (
            <div className="mb-4 flex flex-col gap-1 px-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 min-w-[110px]">Student ID:</span>
                <span className="text-gray-700">{selectedScheduleStudent.studentId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 min-w-[110px]">Campaign ID:</span>
                <span className="text-gray-700">{selectedScheduleStudent.campaignId}</span>
              </div>
            </div>
          )}
          <form
            onSubmit={handleSubmitSchedule}
            className="space-y-4"
          >
            <div>
              <label className="block font-medium mb-1">Thời gian lịch khám</label>
              <input
                type="datetime-local"
                className="border rounded px-3 py-2 w-full"
                value={scheduleForm.scheduleTime}
                onChange={e => setScheduleForm(f => ({ ...f, scheduleTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Lý do</label>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={scheduleForm.reason}
                onChange={e => setScheduleForm(f => ({ ...f, reason: e.target.value }))}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setShowCreateScheduleModal(false)}>Đóng</Button>
              <Button type="submit" disabled={creatingSchedule}>{creatingSchedule ? 'Đang tạo...' : 'Tạo lịch khám'}</Button>
            </div>
          </form>
          
        </DialogContent>
      
      </Dialog>
    </motion.div>
  );
};

export default EventListNurse; 