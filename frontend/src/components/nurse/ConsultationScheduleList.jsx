import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicalService } from '@/api/services/medical.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

const statusMap = {
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đang diễn ra',
  DONE: 'Đã xong',
  REJECTED: 'Từ chối',
  DELETED: 'Đã xóa',
  ACTIVE: 'Đang hoạt động',
};

const ConsultationScheduleList = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await medicalService.getConsultationSchedules(page, 10);
        setData(res.data?.content || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        setError('Không thể tải danh sách lịch tư vấn');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <Card className="rounded-xl shadow-md bg-white border border-blue-100">
      <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
        <CardTitle className="text-blue-800 font-bold flex items-center gap-2">
          {/* Icon y tế */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" /></svg>
          Danh sách lịch tư vấn
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white">
        {loading ? (
          <div className="text-center py-8 text-blue-700 font-sans">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 font-sans">{error}</div>
        ) : (
          <>
            <Table className="border border-blue-100 rounded-xl overflow-hidden font-sans">
              <TableHeader className="bg-[#E3F2FD]">
                <TableRow>
                  <TableHead className="text-blue-700">ID</TableHead>
                  <TableHead className="text-blue-700">Học sinh</TableHead>
                  <TableHead className="text-blue-700">Phụ huynh</TableHead>
                  <TableHead className="text-blue-700">Thời gian</TableHead>
                  <TableHead className="text-blue-700">Lý do</TableHead>
                  <TableHead className="text-blue-700">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-blue-400">Không có lịch tư vấn</TableCell>
                  </TableRow>
                ) : (
                  data.map(item => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-[#F5F5F5] transition" onClick={() => navigate(`/consultation-schedules/${item.id}`)}>
                      <TableCell className="font-medium text-blue-900">{item.id}</TableCell>
                      <TableCell className="text-blue-900">{item.studentName}</TableCell>
                      <TableCell className="text-blue-900">{item.parentName}</TableCell>
                      <TableCell className="text-blue-800">{item.scheduleTime ? new Date(item.scheduleTime).toLocaleString() : ''}</TableCell>
                      <TableCell className="text-blue-800">{item.reason}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow 
                          ${item.status === 'PENDING' ? 'bg-blue-100 text-blue-700' :
                            item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                            item.status === 'DONE' ? 'bg-gray-200 text-gray-700' :
                            item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                            item.status === 'ACTIVE' ? 'bg-blue-200 text-blue-800' :
                            'bg-gray-100 text-gray-600'}
                        `}>
                          {statusMap[item.status] || item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" className="border-blue-400 text-blue-700 hover:bg-blue-50 rounded-full font-sans" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Trước</Button>
              <span className="text-blue-700 font-semibold font-sans">Trang {page + 1} / {totalPages}</span>
              <Button variant="outline" className="border-blue-400 text-blue-700 hover:bg-blue-50 rounded-full font-sans" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Sau</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationScheduleList; 