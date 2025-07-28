import { useEffect, useState } from 'react';
import { medicalService } from '@/api/services/medical.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const statusMap = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Đang diễn ra', color: 'bg-green-100 text-green-800' },
  DONE: { label: 'Đã xong', color: 'bg-gray-400 text-white' },
  REJECTED: { label: 'Từ chối', color: 'bg-red-100 text-red-800' },
  DELETED: { label: 'Đã xóa', color: 'bg-gray-200 text-gray-700' },
  ACTIVE: { label: 'Đang hoạt động', color: 'bg-blue-100 text-blue-800' },
};

const ConsultationScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await medicalService.getConsultationScheduleById(id);
        setData(res.data);
      } catch (err) {
        setError('Không thể tải chi tiết lịch tư vấn');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <Card className="max-w-xl mx-auto mt-8 shadow-lg border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Chi tiết lịch tư vấn</CardTitle>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : data ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 min-w-[120px]">ID:</span>
              <span>{data.id}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 min-w-[120px]">Học sinh:</span>
              <span>{data.studentName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 min-w-[120px]">Phụ huynh:</span>
              <span>{data.parentName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 min-w-[120px]">Thời gian:</span>
              <span>{data.scheduleTime ? new Date(data.scheduleTime).toLocaleString() : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 min-w-[120px]">Lý do:</span>
              <span>{data.reason}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-700 min-w-[120px]">Trạng thái:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[data.status]?.color || 'bg-gray-200 text-gray-800'}`}>{statusMap[data.status]?.label || data.status}</span>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default ConsultationScheduleDetail; 