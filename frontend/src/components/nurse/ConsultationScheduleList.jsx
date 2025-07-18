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
    <Card>
      <CardHeader>
        <CardTitle>Danh sách lịch tư vấn</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Học sinh</TableHead>
                  <TableHead>Phụ huynh</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">Không có lịch tư vấn</TableCell>
                  </TableRow>
                ) : (
                  data.map(item => (
                    <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/consultation-schedules/${item.id}`)}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.studentName}</TableCell>
                      <TableCell>{item.parentName}</TableCell>
                      <TableCell>{item.scheduleTime ? new Date(item.scheduleTime).toLocaleString() : ''}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{statusMap[item.status] || item.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Trước</Button>
              <span>Trang {page + 1} / {totalPages}</span>
              <Button variant="outline" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Sau</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultationScheduleList; 