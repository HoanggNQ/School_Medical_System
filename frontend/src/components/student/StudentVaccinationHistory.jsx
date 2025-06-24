import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, CalendarCheck, Download, Filter, CheckCircle, Clock, AlertCircle, PlusCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockVaccinationHistory = [
  {
    id: 'vh1',
    vaccineName: 'Sởi - Quai bị - Rubella (MMR) - Mũi 1',
    dateAdministered: '2010-07-20',
    administeredBy: 'Trung tâm Y tế Dự phòng Quận 1',
    lotNumber: 'MMR123X',
    status: 'Đã hoàn thành',
    nextDueDate: '2025-07-15 (Mũi 2)',
  },
  {
    id: 'vh2',
    vaccineName: 'Viêm gan B - Mũi 3',
    dateAdministered: '2009-01-10',
    administeredBy: 'Bệnh viện Nhi Đồng 2',
    lotNumber: 'VGB567Y',
    status: 'Đã hoàn thành',
    nextDueDate: null,
  },
  {
    id: 'vh3',
    vaccineName: 'Uốn ván - Bạch hầu - Ho gà (Tdap)',
    dateAdministered: '2024-12-10',
    administeredBy: 'Phòng Y tế Trường THPT ABC',
    lotNumber: 'TDAP007Z',
    status: 'Đã hoàn thành',
    nextDueDate: 'Khoảng 10 năm sau',
  },
  {
    id: 'vh4',
    vaccineName: 'Cúm mùa (hàng năm)',
    dateAdministered: null,
    administeredBy: null,
    lotNumber: null,
    status: 'Sắp đến hạn',
    nextDueDate: '2025-10-01',
  },
   {
    id: 'vh5',
    vaccineName: 'Thủy đậu - Mũi 1',
    dateAdministered: '2012-05-15',
    administeredBy: 'Trung tâm Y tế Dự phòng Quận 1',
    lotNumber: 'TD001A',
    status: 'Đã hoàn thành',
    nextDueDate: '2024-11-05 (Mũi 2 - Đã hoàn thành)',
  },
];

const StatusBadge = ({ status }) => {
  let icon;
  let colorClasses;

  if (status.includes('Đã hoàn thành')) {
    icon = <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
    colorClasses = 'bg-green-100 text-green-700';
  } else if (status.includes('Sắp đến hạn')) {
    icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
    colorClasses = 'bg-yellow-100 text-yellow-700';
  } else if (status.includes('Quá hạn')) {
    icon = <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
    colorClasses = 'bg-red-100 text-red-700';
  } else {
    icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
    colorClasses = 'bg-gray-100 text-gray-700';
  }
  return <Badge variant="outline" className={`flex items-center text-xs ${colorClasses}`}>{icon}{status}</Badge>;
};


const StudentVaccinationHistory = () => {
  const [vaccinations, setVaccinations] = useState(mockVaccinationHistory);
  const [filterType, setFilterType] = useState('all'); // 'all', 'completed', 'upcoming'

  const filteredVaccinations = vaccinations.filter(v => {
    if (filterType === 'all') return true;
    if (filterType === 'completed') return v.status.includes('Đã hoàn thành');
    if (filterType === 'upcoming') return v.status.includes('Sắp đến hạn') || v.status.includes('Quá hạn');
    return true;
  }).sort((a,b) => {
    const dateA = a.dateAdministered ? new Date(a.dateAdministered) : new Date(a.nextDueDate || 0);
    const dateB = b.dateAdministered ? new Date(b.dateAdministered) : new Date(b.nextDueDate || 0);
    return dateB - dateA;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử tiêm chủng</h1>
          <p className="text-gray-600 mt-2">Tổng quan về các mũi vắc-xin đã tiêm và lịch trình.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
            <Filter className="w-4 h-4 mr-2" />
            Lọc ({filterType})
          </Button>
          <Button className="btn-primary" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
            <Download className="w-4 h-4 mr-2" />
            Tải xuống PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <CalendarCheck className="w-5 h-5 mr-2 text-blue-600" />
                Danh sách mũi tiêm
              </CardTitle>
              <CardDescription>
                Hiển thị thông tin chi tiết về các lần tiêm chủng của bạn.
              </CardDescription>
            </div>
             <Button variant="outline" size="sm" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Chức năng thêm mũi tiêm mới sẽ sớm được cập nhật! 🚀" })}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Thêm mũi tiêm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVaccinations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vắc-xin</TableHead>
                  <TableHead>Ngày tiêm</TableHead>
                  <TableHead className="hidden lg:table-cell">Nơi tiêm</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="hidden md:table-cell">Lịch nhắc lại</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVaccinations.map((vaccine) => (
                  <TableRow key={vaccine.id}>
                    <TableCell className="font-medium">{vaccine.vaccineName}</TableCell>
                    <TableCell>{vaccine.dateAdministered || 'Chưa tiêm'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{vaccine.administeredBy || 'N/A'}</TableCell>
                    <TableCell><StatusBadge status={vaccine.status} /></TableCell>
                    <TableCell className="hidden md:table-cell">{vaccine.nextDueDate || 'Không có'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Shield className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Không có dữ liệu tiêm chủng</h3>
              <p className="text-gray-500 mt-2">Lịch sử tiêm chủng của bạn hiện đang trống hoặc không khớp với bộ lọc.</p>
               <Button className="mt-6 btn-primary" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
                Cập nhật lịch sử tiêm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
       <Card className="bg-teal-50 border-teal-200">
        <CardHeader>
          <CardTitle className="text-teal-700 flex items-center text-lg">
            <Shield className="w-5 h-5 mr-2" />
            Vì sao tiêm chủng quan trọng?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-teal-600 text-sm">
          <p>Tiêm chủng là một trong những biện pháp phòng bệnh hiệu quả nhất, giúp cơ thể tạo ra kháng thể chống lại các bệnh truyền nhiễm nguy hiểm. Việc tiêm chủng đầy đủ và đúng lịch không chỉ bảo vệ sức khỏe cá nhân mà còn góp phần bảo vệ cộng đồng.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentVaccinationHistory;