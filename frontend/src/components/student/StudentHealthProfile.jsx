import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Heart, Edit, ShieldCheck, AlertCircle, FileText, Briefcase as BriefcaseMedical, Droplets, Activity } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const mockStudentProfile = {
  id: 'student001',
  name: 'Nguyễn Văn Nam',
  dob: '2008-07-15',
  gender: 'Nam',
  class: '10A1',
  studentId: 'HS00123',
  address: '123 Đường ABC, Phường XYZ, Quận 1, TP. HCM',
  phone: '090xxxxxxx',
  email: 'nam.nguyen@example.com',
  fatherName: 'Nguyễn Văn Ba',
  fatherPhone: '091xxxxxxx',
  motherName: 'Trần Thị Tư',
  motherPhone: '098xxxxxxx',
  bloodGroup: 'O+',
  allergies: ['Hải sản', 'Bụi mịn'],
  chronicDiseases: ['Hen suyễn (nhẹ)'],
  emergencyContact: {
    name: 'Nguyễn Văn Ba (Bố)',
    phone: '091xxxxxxx',
    relationship: 'Bố',
  },
  insurance: {
    provider: 'Bảo Việt',
    policyNumber: 'BVHS123456789',
    expiryDate: '2025-12-31',
  },
  lastHealthCheck: '2025-03-10',
  notes: 'Cần mang theo ống hít Ventolin khi vận động mạnh.'
};

const InfoItem = ({ label, value, icon }) => (
  <div className="flex items-start py-2 border-b border-gray-100 last:border-b-0">
    {icon && <div className="w-6 h-6 mr-3 text-gray-500 flex-shrink-0">{icon}</div>}
    <div className="flex-1">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || 'Chưa cập nhật'}</p>
    </div>
  </div>
);

const StudentHealthProfile = () => {
  const [profile, setProfile] = useState(mockStudentProfile);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
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
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ sức khỏe của tôi</h1>
          <p className="text-gray-600 mt-2">Thông tin chi tiết về sức khỏe và tiền sử bệnh.</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Chức năng chỉnh sửa thông tin sẽ sớm được cập nhật! 🚀" })}>
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa thông tin
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>Mã học sinh: {profile.studentId}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <InfoItem label="Họ và tên" value={profile.name} />
            <InfoItem label="Ngày sinh" value={`${profile.dob} (${calculateAge(profile.dob)} tuổi)`} />
            <InfoItem label="Giới tính" value={profile.gender} />
            <InfoItem label="Lớp" value={profile.class} />
            <InfoItem label="Địa chỉ" value={profile.address} />
            <InfoItem label="Số điện thoại" value={profile.phone} />
            <InfoItem label="Email" value={profile.email} />
            <InfoItem label="Họ tên cha" value={profile.fatherName} />
            <InfoItem label="SĐT cha" value={profile.fatherPhone} />
            <InfoItem label="Họ tên mẹ" value={profile.motherName} />
            <InfoItem label="SĐT mẹ" value={profile.motherPhone} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                Thông tin y tế
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoItem label="Nhóm máu" value={profile.bloodGroup} icon={<Droplets size={18}/>} />
              <InfoItem label="Dị ứng" value={profile.allergies.join(', ') || 'Không có'} icon={<AlertCircle size={18}/>} />
              <InfoItem label="Bệnh mãn tính" value={profile.chronicDiseases.join(', ') || 'Không có'} icon={<BriefcaseMedical size={18}/>} />
              <InfoItem label="Lần khám gần nhất" value={profile.lastHealthCheck} icon={<Activity size={18}/>} />
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
                Bảo hiểm y tế
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoItem label="Nhà cung cấp" value={profile.insurance.provider} />
              <InfoItem label="Số hợp đồng" value={profile.insurance.policyNumber} />
              <InfoItem label="Ngày hết hạn" value={profile.insurance.expiryDate} />
              <Button size="sm" className="mt-3 w-full" variant="outline" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>Xem chi tiết BHYT</Button>
            </CardContent>
          </Card>
          
          <Card className="card-hover bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                Liên hệ khẩn cấp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoItem label="Người liên hệ" value={`${profile.emergencyContact.name} (${profile.emergencyContact.relationship})`} />
              <InfoItem label="Số điện thoại" value={profile.emergencyContact.phone} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="card-hover">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Ghi chú quan trọng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{profile.notes || 'Không có ghi chú nào.'}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentHealthProfile;