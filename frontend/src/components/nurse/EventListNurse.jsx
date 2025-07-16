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
  const [erroror, setErroror] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showCreateScheduleModal, setShowCreateScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ scheduleTime: '', reason: '' });
  const [creatingSchedule, setCreatingSchedule] = useState(false);
  const [selectedScheduleStudent, setSelectedScheduleStudent] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setErroror(null);
      try {
        const res = await medicalService.getHealthCheckResultsByCampaign(campaignId);
        setResults(res.data || []);
        console.log("res.data", res.data);

      } catch (error) {
        setErroror(error?.message || 'Lỗi khi tải danh sách kết quả khám sức khỏe');
        console.log("error.message", error?.message);
      } finally {
        setLoading(false);
      }
    };
    if (campaignId) fetchResults();
  }, [campaignId]);

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
      <Card className="rounded-xl shadow-md bg-white border border-blue-100">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-blue-800 font-bold flex items-center gap-2">
              {/* Icon y tế */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" /></svg>
              Danh sách kết quả khám sức khỏe
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
              <Input
                placeholder="Tìm kiếm theo tên học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-lg border border-blue-100 focus:border-blue-400 font-sans"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600 font-sans">Đang tải...</span>
            </div>
          ) : erroror ? (
            <div className="text-red-500 text-center p-4 font-sans">{erroror}</div>
          ) : (
            <Table className="border border-blue-100 rounded-xl overflow-hidden font-sans">
              <TableHeader className="bg-[#E3F2FD]">
                <TableRow>
                  <TableHead className="text-blue-700">ID</TableHead>
                  <TableHead className="text-blue-700">Học sinh</TableHead>
                  <TableHead className="text-blue-700">Người khám</TableHead>
                  <TableHead className="text-blue-700">Trạng thái sức khỏe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-blue-400">Không có kết quả</TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map(ev => (
                    <TableRow key={ev.id} className="cursor-pointer hover:bg-[#F5F5F5] transition" onClick={() => handleRowClick(ev)}>
                      <TableCell className="font-medium text-blue-900">{ev.id}</TableCell>
                      <TableCell className="text-blue-900">{ev.studentName}</TableCell>
                      <TableCell className="text-blue-900">{ev.checkedByName}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${ev.healthStatus === 'TỐT' ? 'bg-[#A5D6A7] text-green-800' : ev.healthStatus === 'XẤU' ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-800'}`}>{ev.healthStatus}</span>
                        {ev.healthStatus === 'XẤU' && (
                          <Button
                            size="sm"
                            className="ml-2 rounded-full bg-[#90CAF9] hover:bg-[#64b5f6] text-white font-semibold shadow"
                            onClick={e => {
                              e.stopPropagation();
                              handleCreateScheduleClick(ev);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
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
        <DialogContent className="max-w-3xl">
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
            <DialogTitle>
              <span className="flex items-center gap-2 text-blue-700">
                {/* Medical cross icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" />
                </svg>
                Tạo lịch tư vấn y tế
              </span>
            </DialogTitle>
          </DialogHeader>
          {selectedScheduleStudent && (
            <div className="mb-4 flex flex-col gap-2 px-1">
              <div className="flex items-center gap-2 bg-white rounded p-3 mb-1 border border-blue-300 shadow-sm">
                <span className="font-semibold text-blue-800 min-w-[120px]">Tên học sinh:</span>
                <span className="text-blue-900 font-medium">{selectedScheduleStudent.studentName}</span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded p-3 border border-blue-200 shadow-sm">
                <span className="font-semibold text-blue-800 min-w-[120px]">Tên chiến dịch:</span>
                <span className="text-blue-900 font-medium">{selectedScheduleStudent.campaignName}</span>
              </div>
              <div className="text-xs text-blue-500 mt-2 italic">
                Vui lòng nhập đầy đủ thông tin để đặt lịch tư vấn y tế cho học sinh.
              </div>
            </div>
          )}
          <form
            onSubmit={handleSubmitSchedule}
            className="space-y-4"
          >
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Thời gian lịch khám</label>
              <input
                type="datetime-local"
                className="border border-blue-300 rounded px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-blue-50 text-blue-900"
                value={scheduleForm.scheduleTime}
                onChange={e => setScheduleForm(f => ({ ...f, scheduleTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-blue-700">Lý do</label>
              <input
                type="text"
                className="border border-blue-300 rounded px-3 py-2 w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-blue-50 text-blue-900"
                value={scheduleForm.reason}
                onChange={e => setScheduleForm(f => ({ ...f, reason: e.target.value }))}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" className="border-blue-400 text-blue-700 hover:bg-blue-50" onClick={() => setShowCreateScheduleModal(false)}>Đóng</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={creatingSchedule}>{creatingSchedule ? 'Đang tạo...' : 'Tạo lịch khám'}</Button>
            </div>
          </form>
          
        </DialogContent>
      
      </Dialog>
    </motion.div>
  );
};

export default EventListNurse; 