import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Bell, HelpCircle, Users2, ChevronDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockChildren = [
  { id: 'child1', name: 'Nguyễn Văn An', age: 8 },
  { id: 'child2', name: 'Trần Thị Bình', age: 10 },
];

const mockVaccinationSchedules = {
  child1: [
    { id: 'vac1', name: 'Sởi - Quai bị - Rubella (MMR) - Mũi 2', dueDate: '2025-07-15', status: 'Sắp đến hạn', notes: 'Tiêm nhắc lại' },
    { id: 'vac2', name: 'Viêm não Nhật Bản - Mũi 3', dueDate: '2025-09-01', status: 'Sắp đến hạn', notes: 'Tiêm nhắc lại' },
    { id: 'vac3', name: 'Uốn ván - Bạch hầu - Ho gà (Tdap)', dueDate: '2024-12-10', status: 'Đã hoàn thành', notes: '' },
  ],
  child2: [
    { id: 'vac4', name: 'Cúm mùa (hàng năm)', dueDate: '2025-10-01', status: 'Sắp đến hạn', notes: 'Tiêm định kỳ' },
    { id: 'vac5', name: 'HPV (Nữ) - Mũi 1', dueDate: '2025-08-20', status: 'Sắp đến hạn', notes: 'Vắc xin mới' },
    { id: 'vac6', name: 'Thủy đậu - Mũi 2', dueDate: '2024-11-05', status: 'Đã hoàn thành', notes: '' },
  ],
};

const StatusBadge = ({ status }) => {
  let icon;
  let colorClasses;

  switch (status) {
    case 'Đã hoàn thành':
      icon = <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-green-100 text-green-700';
      break;
    case 'Sắp đến hạn':
      icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-yellow-100 text-yellow-700';
      break;
    case 'Quá hạn':
      icon = <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-red-100 text-red-700';
      break;
    default:
      icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-gray-100 text-gray-700';
  }
  return <Badge variant="outline" className={`flex items-center text-xs ${colorClasses}`}>{icon}{status}</Badge>;
};

const ParentVaccinationSchedule = () => {
  const [selectedChildId, setSelectedChildId] = useState(mockChildren[0]?.id || '');
  const schedule = mockVaccinationSchedules[selectedChildId] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch tiêm chủng của con</h1>
          <p className="text-gray-600 mt-2">Theo dõi và quản lý lịch tiêm chủng cho các con.</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white">
              <Users2 className="w-4 h-4 mr-2 text-gray-500" />
              <SelectValue placeholder="Chọn con" />
            </SelectTrigger>
            <SelectContent>
              {mockChildren.map(child => (
                <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="btn-primary w-full sm:w-auto" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
            <Bell className="w-4 h-4 mr-2" />
            Nhắc nhở lịch tiêm
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarCheck className="w-5 h-5 mr-2 text-blue-600" />
            Lịch trình tiêm chủng cho {mockChildren.find(c => c.id === selectedChildId)?.name || ''}
          </CardTitle>
          <CardDescription>
            Hiển thị các mũi tiêm đã hoàn thành và sắp đến hạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {schedule.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên vắc-xin</TableHead>
                  <TableHead>Ngày dự kiến</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="hidden md:table-cell">Ghi chú</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((vaccine) => (
                  <TableRow key={vaccine.id}>
                    <TableCell className="font-medium">{vaccine.name}</TableCell>
                    <TableCell>{vaccine.dueDate}</TableCell>
                    <TableCell><StatusBadge status={vaccine.status} /></TableCell>
                    <TableCell className="hidden md:table-cell">{vaccine.notes || 'Không có'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: `Xem chi tiết ${vaccine.name}` })}>
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <CalendarCheck className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Không có lịch tiêm chủng</h3>
              <p className="text-gray-500 mt-2">Không tìm thấy lịch tiêm chủng cho {mockChildren.find(c => c.id === selectedChildId)?.name || 'bé được chọn'}.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center text-lg">
            <HelpCircle className="w-5 h-5 mr-2" />
            Thông tin hữu ích
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-600 text-sm space-y-1">
          <p>Luôn cập nhật lịch tiêm chủng của con bạn để đảm bảo sức khỏe tốt nhất. Nếu có thắc mắc, vui lòng liên hệ với y tá học đường.</p>
          <p>Việc tiêm chủng đầy đủ giúp bảo vệ con bạn và cộng đồng khỏi các bệnh truyền nhiễm nguy hiểm.</p>
          <Button size="sm" variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-800 font-semibold" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
            Tìm hiểu thêm về các loại vắc-xin
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParentVaccinationSchedule;