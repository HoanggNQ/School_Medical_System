import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import vaccinationService from '@/api/services/vaccination.service';

const WatchVaccination = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchVaccinations();
  }, []);

  const fetchVaccinations = async () => {
    try {
      setLoading(true);
      const response = await vaccinationService.getAllVaccinations();
      setVaccinations(response || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch vaccination campaigns.');
    } finally {
      setLoading(false);
    }
  };

  const filteredVaccinations = vaccinations
    .filter(v => 
      v.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (v.targetGrade + '').includes(searchTerm)
    )
    .sort((a, b) => {
      const statusOrder = {
        'APPROVED': 0,
        'PENDING': 1,
        'DONE': 2,
        'REJECTED': 3
      };
      return (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4);
    });

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING': return 'Chờ duyệt';
      case 'APPROVED': return 'Đang diễn ra';
      case 'DONE': return 'Đã xong';
      case 'REJECTED': return 'Từ chối';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-blue-100 text-blue-700 border border-blue-300';
      case 'APPROVED': return 'bg-green-100 text-green-700 border border-green-300';
      case 'DONE': return 'bg-blue-200 text-blue-800 border border-blue-400';
      case 'REJECTED': return 'bg-red-100 text-red-700 border border-red-300';
      default: return 'bg-gray-100 text-gray-600 border border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="bg-blue-100 p-2 rounded-full">
          <ClipboardList className="h-6 w-6 text-blue-600" />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Quản lý lịch tiêm chủng</h1>
          <p className="text-blue-600 text-sm">Theo dõi các chiến dịch tiêm chủng đã tạo</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-end">
        <Input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc khối..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-80 border-blue-300 rounded-lg"
        />
      </div>

      {/* Card Table */}
      <Card className="rounded-xl shadow-sm bg-white border border-blue-100">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
          <CardTitle className="text-blue-800 font-bold">
            Danh sách lịch tiêm chủng ({filteredVaccinations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white px-4">
          <div className="overflow-x-auto">
            <Table className="border border-blue-100 rounded-xl overflow-hidden font-sans min-w-full">
              <TableHeader className="bg-[#E3F2FD]">
                <TableRow>
                  <TableHead className="text-blue-700 font-medium">ID</TableHead>
                  <TableHead className="text-blue-700 font-medium">Tên chiến dịch</TableHead>
                  <TableHead className="text-blue-700 font-medium">Loại vắc xin</TableHead>
                  <TableHead className="text-blue-700 font-medium">Nhà sản xuất</TableHead>
                  <TableHead className="text-blue-700 font-medium">Ngày bắt đầu</TableHead>
                  <TableHead className="text-blue-700 font-medium">Ngày kết thúc</TableHead>
                  <TableHead className="text-blue-700 font-medium">Khối lớp</TableHead>
                  <TableHead className="text-blue-700 font-medium">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVaccinations.map(v => (
                  <TableRow
                    key={v.id}
                    className="hover:bg-blue-50 cursor-pointer transition"
                    onClick={() => navigate(`/management-vaccine/${v.id}`, { state: { vaccinationStatus: v.status } })}
                  >
                    <TableCell className="text-blue-900 font-medium">{v.id}</TableCell>
                    <TableCell className="text-blue-900 font-medium">{v.name}</TableCell>
                    <TableCell>{v.vaccineType}</TableCell>
                    <TableCell>{v.manufacturer}</TableCell>
                    <TableCell>{v.startDate}</TableCell>
                    <TableCell>{v.endDate}</TableCell>
                    <TableCell>{v.targetGrade === 0 ? 'Toàn trường' : `Khối ${v.targetGrade}`}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-2 py-1 text-xs font-semibold shadow ${getStatusClass(v.status)}`}>
                        {getStatusLabel(v.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WatchVaccination;
