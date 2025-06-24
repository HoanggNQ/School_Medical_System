import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Activity, BarChart2, MessageSquare, ChevronDown, ChevronUp, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const mockChildrenData = [
  {
    id: 'child1',
    name: 'Nguyễn Văn An',
    age: 8,
    class: '3A',
    lastCheckup: '2025-05-15',
    overallStatus: 'Tốt',
    recentActivity: 'Khám sức khỏe định kỳ',
    allergies: ['Phấn hoa'],
    medications: [],
    height: '125 cm',
    weight: '25 kg',
    bmi: 16,
    bloodPressure: '90/60 mmHg',
    heartRate: '85 bpm',
  },
  {
    id: 'child2',
    name: 'Trần Thị Bình',
    age: 10,
    class: '5B',
    lastCheckup: '2025-04-20',
    overallStatus: 'Cần theo dõi',
    recentActivity: 'Sốt nhẹ, nghỉ học 1 ngày',
    allergies: ['Hải sản'],
    medications: ['Thuốc hạ sốt (khi cần)'],
    height: '135 cm',
    weight: '30 kg',
    bmi: 16.5,
    bloodPressure: '95/65 mmHg',
    heartRate: '90 bpm',
  },
];

const ChildDetails = ({ child }) => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-md mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div><span className="font-semibold">Tuổi:</span> {child.age}</div>
        <div><span className="font-semibold">Lớp:</span> {child.class}</div>
        <div><span className="font-semibold">Lần khám gần nhất:</span> {child.lastCheckup}</div>
        <div>
          <span className="font-semibold">Tình trạng chung:</span>
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${child.overallStatus === 'Tốt' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {child.overallStatus}
          </span>
        </div>
      </div>
      <div><span className="font-semibold">Hoạt động gần đây:</span> {child.recentActivity}</div>
      <div><span className="font-semibold">Dị ứng:</span> {child.allergies.join(', ') || 'Không có'}</div>
      <div><span className="font-semibold">Thuốc đang dùng:</span> {child.medications.join(', ') || 'Không có'}</div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-md flex items-center"><BarChart2 className="w-4 h-4 mr-2 text-green-600" />Chỉ số sức khỏe</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            <div><span className="font-semibold">Chiều cao:</span> {child.height}</div>
            <div><span className="font-semibold">Cân nặng:</span> {child.weight}</div>
            <div><span className="font-semibold">BMI:</span> {child.bmi}</div>
            <div><span className="font-semibold">Huyết áp:</span> {child.bloodPressure}</div>
            <div><span className="font-semibold">Nhịp tim:</span> {child.heartRate}</div>
          </div>
        </CardContent>
      </Card>
      <Button size="sm" variant="outline" className="w-full" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
        <FileText className="w-4 h-4 mr-2" /> Xem báo cáo chi tiết
      </Button>
    </div>
  );
};


const ParentChildrenHealth = () => {
  const [expandedChild, setExpandedChild] = useState(null);

  const toggleChildDetails = (childId) => {
    setExpandedChild(expandedChild === childId ? null : childId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sức khỏe con em</h1>
          <p className="text-gray-600 mt-2">Tổng quan về tình hình sức khỏe của các con.</p>
        </div>
         <Button variant="outline" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
          <MessageSquare className="w-4 h-4 mr-2" />
          Liên hệ y tá
        </Button>
      </div>

      {mockChildrenData.map((child) => (
        <Card key={child.id} className="card-hover overflow-hidden">
          <CardHeader className="cursor-pointer" onClick={() => toggleChildDetails(child.id)}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                <div>
                  <CardTitle>{child.name}</CardTitle>
                  <CardDescription>Lớp {child.class} - {child.age} tuổi</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                {expandedChild === child.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          {expandedChild === child.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent>
                <ChildDetails child={child} />
              </CardContent>
            </motion.div>
          )}
          <CardFooter className="bg-gray-50 p-3 text-xs text-gray-600">
            {child.overallStatus === 'Tốt' ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />}
            Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
          </CardFooter>
        </Card>
      ))}
      
      {mockChildrenData.length === 0 && (
         <Card>
          <CardContent className="text-center py-12">
            <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Chưa có thông tin con em</h3>
            <p className="text-gray-500 mt-2">Vui lòng liên hệ nhà trường để cập nhật thông tin.</p>
          </CardContent>
        </Card>
      )}

    </motion.div>
  );
};

export default ParentChildrenHealth;