import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { School, Stethoscope, Syringe, CalendarCheck, Bell, Users, ShieldCheck, Activity } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Stethoscope className="w-7 h-7 text-green-600" />, title: 'Khám sức khỏe', desc: 'Quản lý chiến dịch khám sức khỏe, ghi nhận kết quả, theo dõi sức khỏe học sinh.'
  },
  {
    icon: <Syringe className="w-7 h-7 text-purple-600" />, title: 'Tiêm chủng', desc: 'Theo dõi lịch sử tiêm chủng, quản lý chiến dịch tiêm chủng, nhắc lịch tiêm.'
  },
  {
    icon: <CalendarCheck className="w-7 h-7 text-blue-600" />, title: 'Lịch & Sự kiện', desc: 'Quản lý lịch khám, tiêm, sự kiện y tế, nhắc nhở tự động.'
  },
  {
    icon: <Bell className="w-7 h-7 text-orange-500" />, title: 'Thông báo', desc: 'Gửi thông báo nhanh đến phụ huynh, học sinh, y tế.'
  },
  {
    icon: <Users className="w-7 h-7 text-pink-500" />, title: 'Kết nối phụ huynh', desc: 'Phụ huynh theo dõi sức khỏe, nhận thông báo, khai báo y tế cho con.'
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-teal-600" />, title: 'Bảo mật & An toàn', desc: 'Bảo mật thông tin, phân quyền rõ ràng cho từng vai trò.'
  },
  {
    icon: <Activity className="w-7 h-7 text-yellow-500" />, title: 'Thống kê & Báo cáo', desc: 'Thống kê sức khỏe, tiêm chủng, xuất báo cáo nhanh chóng.'
  },
];

const HomePage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-2 py-8"
  >
    <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 items-stretch">
      {/* Card giới thiệu trường */}
      <Card className="flex-1 flex flex-col justify-center items-center bg-white/90 shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <School className="w-12 h-12 text-orange-500 mb-2" />
          <CardTitle className="text-3xl md:text-4xl font-bold text-orange-700 text-center">Trường Tiểu Học</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <img
            src="data:image/png;base64,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"
            alt="FPT High School"
            className="w-32 h-32 object-contain rounded-xl shadow bg-white p-2 mb-4"
          />
          <p className="text-lg text-gray-700 text-center mb-2">
            Môi trường học tập hiện đại, năng động, sáng tạo, hướng tới phát triển toàn diện cho học sinh.
          </p>
          <p className="text-gray-500 text-center mb-4">
            Sứ mệnh: "Kiến tạo thế hệ trẻ tự tin, bản lĩnh, hội nhập toàn cầu."
          </p>
          <div className="flex gap-4 mt-2">
            <Link to="/auth">
              <Button variant="default" size="lg">Đăng nhập</Button>
            </Link>
            {/* <Link to="/auth">
              <Button variant="outline" size="lg">Đăng ký</Button>
            </Link> */}
          </div>
        </CardContent>
      </Card>
      {/* Card giới thiệu app */}
      <Card className="flex-1 flex flex-col justify-center bg-white/90 shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <Stethoscope className="w-12 h-12 text-green-600 mb-2" />
          <CardTitle className="text-2xl md:text-3xl font-bold text-green-700 text-center">Hệ thống Quản lý Y tế Học đường</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 text-center mb-6">
            Ứng dụng giúp nhà trường, phụ huynh và học sinh dễ dàng theo dõi sức khỏe, tiêm chủng, sự kiện y tế, khai báo y tế, nhận thông báo nhanh chóng. Hỗ trợ quản lý toàn diện, bảo mật, tiện lợi.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-orange-50 transition">
                {f.icon}
                <div>
                  <div className="font-semibold text-gray-800">{f.title}</div>
                  <div className="text-sm text-gray-500">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    <div className="mt-10 text-center text-gray-400 text-sm">
      © {new Date().getFullYear()} Trường Tiểu Học. Hệ thống Quản lý Y tế Học đường.
    </div>
  </motion.div>
);

export default HomePage;