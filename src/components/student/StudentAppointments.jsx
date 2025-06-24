import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, CalendarDays, ListFilter, CheckCircle, Clock, UserX as UserMd, MessageSquare, AlertCircle } from 'lucide-react';
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

const mockAppointments = [
  {
    id: 'apt1',
    date: '2025-06-20',
    time: '10:00 AM',
    type: 'Khám sức khỏe định kỳ',
    doctor: 'BS. Nguyễn Thị Lan',
    status: 'Đã xác nhận',
    notes: 'Mang theo sổ khám bệnh cũ (nếu có).',
  },
  {
    id: 'apt2',
    date: '2025-06-28',
    time: '02:30 PM',
    type: 'Tư vấn dinh dưỡng',
    doctor: 'CN. Trần Văn Hùng',
    status: 'Chờ xác nhận',
    notes: 'Chuẩn bị các câu hỏi về chế độ ăn.',
  },
  {
    id: 'apt3',
    date: '2025-05-10',
    time: '09:00 AM',
    type: 'Kiểm tra mắt',
    doctor: 'BS. Lê Minh Anh',
    status: 'Đã hoàn thành',
    notes: 'Thị lực tốt, không cần đeo kính.',
  },
];

const StatusBadge = ({ status }) => {
  let icon;
  let colorClasses;

  switch (status) {
    case 'Đã hoàn thành':
      icon = <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-green-100 text-green-700';
      break;
    case 'Đã xác nhận':
      icon = <CheckCircle className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-blue-100 text-blue-700';
      break;
    case 'Chờ xác nhận':
      icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-yellow-100 text-yellow-700';
      break;
    case 'Đã hủy':
      icon = <AlertCircle className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-red-100 text-red-700';
      break;
    default:
      icon = <Clock className="w-3.5 h-3.5 mr-1.5" />;
      colorClasses = 'bg-gray-100 text-gray-700';
  }
  return <Badge variant="outline" className={`flex items-center text-xs ${colorClasses}`}>{icon}{status}</Badge>;
};


const StudentAppointments = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    const aptDate = new Date(`${apt.date} ${apt.time}`);
    const now = new Date();
    if (filter === 'upcoming') return aptDate >= now && apt.status !== 'Đã hoàn thành' && apt.status !== 'Đã hủy';
    if (filter === 'past') return aptDate < now || apt.status === 'Đã hoàn thành' || apt.status === 'Đã hủy';
    return true;
  }).sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
          <p className="text-gray-600 mt-2">Quản lý các cuộc hẹn khám sức khỏe và tư vấn.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bộ lọc sẽ sớm được hoàn thiện! 🚀" })}>
            <ListFilter className="w-4 h-4 mr-2" />
            Lọc ({filter})
          </Button>
          <Button className="btn-primary" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
            <CalendarPlus className="w-4 h-4 mr-2" />
            Đặt lịch hẹn mới
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
            Danh sách lịch hẹn
          </CardTitle>
          <CardDescription>
            Hiển thị các cuộc hẹn đã đặt, sắp diễn ra và đã hoàn thành.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày hẹn</TableHead>
                  <TableHead>Giờ</TableHead>
                  <TableHead>Loại hình</TableHead>
                  <TableHead className="hidden md:table-cell">Chuyên viên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>{new Date(apt.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{apt.time}</TableCell>
                    <TableCell className="font-medium">{apt.type}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <UserMd className="w-4 h-4 mr-1.5 text-gray-500" /> {apt.doctor}
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={apt.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: `Xem chi tiết lịch hẹn ${apt.type}` })}>
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="text-center py-12">
              <CalendarDays className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700">Không có lịch hẹn</h3>
              <p className="text-gray-500 mt-2">Hiện tại bạn không có lịch hẹn nào phù hợp với bộ lọc.</p>
              <Button className="mt-6 btn-primary" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
                Đặt lịch hẹn mới
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
       <Card className="bg-sky-50 border-sky-200">
        <CardHeader>
          <CardTitle className="text-sky-700 flex items-center text-lg">
            <MessageSquare className="w-5 h-5 mr-2" />
            Cần hỗ trợ?
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sky-600 text-sm">
          <p>Nếu bạn có bất kỳ câu hỏi nào về lịch hẹn hoặc cần thay đổi, vui lòng liên hệ với phòng y tế của trường.</p>
          <Button size="sm" variant="link" className="p-0 h-auto text-sky-700 hover:text-sky-800 font-semibold" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Thông tin liên hệ sẽ sớm được cập nhật! 🚀" })}>
            Thông tin liên hệ phòng y tế
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentAppointments;