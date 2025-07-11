import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar as CalendarIcon, Layers, ClipboardList, BadgeCheck, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import vaccinationService from '@/api/services/vaccination.service';
import ManagementVaccine from './ManagementVaccine';
import { useNavigate } from "react-router-dom";

const WatchVaccination = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const filteredVaccinations = vaccinations
    .filter(vaccination =>
      vaccination.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vaccination.targetGrade + '').includes(searchTerm)
    )
    .sort((a, b) => {
      // Thứ tự ưu tiên: ACTIVE > PENDING > DONE > REJECTED/khác
      const statusOrder = {
        'ACTIVE': 0,
        'PENDING': 1,
        'DONE': 2,
        'REJECTED': 3
      };
      const aOrder = statusOrder[a.status] !== undefined ? statusOrder[a.status] : 4;
      const bOrder = statusOrder[b.status] !== undefined ? statusOrder[b.status] : 4;
      return aOrder - bOrder;
    });

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
      setError('Failed to fetch vaccination campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900"> Lịch tiêm chủng</h1>
         
        </div>
        {/* Ẩn nút tạo lịch tiêm chủng nếu có */}
        {/* <Button className="btn-primary">Tạo lịch tiêm chủng</Button> */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Danh sách lịch tiêm chủng</CardTitle>
            {/* Ẩn ô tìm kiếm nếu muốn */}
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
                <TableHead>Trạng thái</TableHead>
                {/* Ẩn cột thao tác */}
                {/* <TableHead>Thao tác</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVaccinations.map((vaccination) => (
                <TableRow
                  key={vaccination.id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/management-vaccine/${vaccination.id}`)}
                >
                  <TableCell className="font-medium">{vaccination.name}</TableCell>
                  <TableCell>{vaccination.vaccineType}</TableCell>
                  <TableCell>{vaccination.startDate}</TableCell>
                  <TableCell>{vaccination.endDate}</TableCell>
                  <TableCell>{vaccination.targetGrade === 0 ? 'Toàn trường' : `Khối ${vaccination.targetGrade}`}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vaccination.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      vaccination.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      vaccination.status === 'DONE' ? 'bg-gray-400 text-white' :
                      vaccination.status === 'APPROVED' ? 'bg-red-100 text-red-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {vaccination.status === 'PENDING' ? 'Chờ duyệt' :
                        vaccination.status === 'ACTIVE' ? 'Đang diễn ra' :
                        vaccination.status === 'DONE' ? 'Đã xong' :
                        vaccination.status === 'APPROVED' ? 'Từ chối' :
                        vaccination.status}
                    </span>
                  </TableCell>
                  {/* Ẩn các ô thao tác nếu có */}
                  {/* <TableCell>...</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedCampaignId && (
        <div>
            <button 
            onClick={()=> setSelectedCampaignId(null)}
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
            >
                Quay laị danh sách
            </button>
            <ManagementVaccine campaignId={selectedCampaignId}/>
        </div>
      )}

     
    </motion.div>
  );
};

export default WatchVaccination;
