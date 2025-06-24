import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BellRing, MailCheck, Archive, Settings2, CalendarClock, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';


const mockNotifications = [
  {
    id: 1,
    title: "Nhắc lịch tiêm chủng cho bé Nguyễn Văn An",
    description: "Bé An có lịch tiêm nhắc lại Vắc-xin Sởi - Quai bị - Rubella vào ngày 20/06/2025.",
    date: "2025-06-12",
    type: "vaccine",
    read: false,
    childName: "Nguyễn Văn An",
  },
  {
    id: 2,
    title: "Kết quả khám sức khỏe định kỳ của bé Trần Thị Bình",
    description: "Bé Bình đã hoàn thành khám sức khỏe. Kết quả tổng quan tốt, cần bổ sung vitamin D.",
    date: "2025-06-10",
    type: "health_check",
    read: true,
    childName: "Trần Thị Bình",
  },
  {
    id: 3,
    title: "Thông báo nghỉ học đột xuất",
    description: "Do sự cố mất điện, toàn trường sẽ nghỉ học ngày 15/06/2025. Phụ huynh vui lòng theo dõi thông báo tiếp theo.",
    date: "2025-06-14",
    type: "school_notice",
    read: false,
  },
  {
    id: 4,
    title: "Cảnh báo dịch cúm mùa",
    description: "Hiện đang có dấu hiệu gia tăng các ca cúm mùa trong trường. Phụ huynh lưu ý các biện pháp phòng ngừa cho con em.",
    date: "2025-06-05",
    type: "alert",
    read: true,
  },
];

const NotificationItem = ({ notification, onToggleRead, onArchive }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case 'vaccine': return <CalendarClock className="w-5 h-5 text-blue-500" />;
      case 'health_check': return <Info className="w-5 h-5 text-green-500" />;
      case 'school_notice': return <BellRing className="w-5 h-5 text-gray-500" />;
      case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <BellRing className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card className={`transition-all duration-300 ${notification.read ? 'bg-gray-50 opacity-75' : 'bg-white hover:shadow-md'}`}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-1">{getIcon()}</div>
            <div>
              <CardTitle className="text-md">{notification.title}</CardTitle>
              <CardDescription className="text-xs text-gray-500">
                {new Date(notification.date).toLocaleDateString('vi-VN')}
                {notification.childName && ` - Cho bé: ${notification.childName}`}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {!notification.read && <Badge variant="destructive" className="text-xs">Mới</Badge>}
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-gray-700 mb-3">{notification.description}</p>
            <div className="flex gap-2">
              <Button size="sm" variant={notification.read ? "outline" : "default"} onClick={() => onToggleRead(notification.id)}>
                {notification.read ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => onArchive(notification.id)}>
                <Archive className="w-3 h-3 mr-1.5" /> Lưu trữ
              </Button>
            </div>
          </CardContent>
        </motion.div>
      )}
    </Card>
  );
};

const ParentNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const toggleReadStatus = (id) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: !n.read } : n
      )
    );
    toast({ title: "Cập nhật trạng thái thông báo thành công!" });
  };

  const archiveNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast({ title: "Thông báo đã được lưu trữ." });
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast({ title: "Tất cả thông báo đã được đánh dấu là đã đọc." });
  };

  const archiveAll = () => {
    setNotifications([]);
    toast({ title: "Tất cả thông báo đã được lưu trữ." });
  };


  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trung tâm thông báo</h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo mới.` : 'Không có thông báo mới.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <MailCheck className="w-4 h-4 mr-2" />
            Đánh dấu đã đọc ({unreadCount})
          </Button>
           <Button variant="outline" onClick={archiveAll} disabled={notifications.length === 0}>
            <Archive className="w-4 h-4 mr-2" />
            Lưu trữ tất cả
          </Button>
           <Button variant="ghost" size="icon" onClick={() => toast({ title: "🚧 Tính năng chưa được triển khai", description: "Bạn có thể yêu cầu tính năng này ở lần nhắc tiếp theo! 🚀" })}>
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onToggleRead={toggleReadStatus}
              onArchive={archiveNotification}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-16">
            <BellRing className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Không có thông báo nào</h3>
            <p className="text-gray-500 mt-2">Tất cả các thông báo sẽ được hiển thị ở đây.</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default ParentNotifications;