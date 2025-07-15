import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Filter, AlertCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import medicalService from "@/api/services/medical.service";
import axios from "axios";

const PAGE_SIZE = 10;
const API_BASE_URL = "https://school-medical-system.onrender.com/api/v1";

const HealthDeclarationSearch = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const statusUpdateOptions = [
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Từ chối" },
  ];

  const statusOptions = [
    { value: "ALL", label: "Tất cả trạng thái" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Từ chối" },
    { value: "PENDING", label: "Chờ duyệt" },
  ];

  const getStatusColor = (statusLabel) => {
    switch (statusLabel?.toLowerCase()) {
      case 'chờ duyệt':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'đã duyệt':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'từ chối':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPROVED": return "Đã duyệt";
      case "REJECTED": return "Từ chối";
      case "PENDING": return "Chờ duyệt";
      default: return status || "";
    }
  };

  const handleUpdateStatus = async (id) => {
    if (!statusUpdate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn trạng thái mới.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await axios.patch(`${API_BASE_URL}/health-declarations/${id}/status?status=${statusUpdate}`);
      setUpdatingId(null);
      setStatusUpdate("");
      fetchData();
      toast({
        title: "Thành công",
        description: "Trạng thái đã được cập nhật.",
      });
    } catch (err) {
      toast({
        title: "Lỗi",
        description: "Cập nhật trạng thái thất bại!",
        variant: "destructive",
      });
    }
  };

  const fetchData = async (customPage) => {
    setLoading(true);
    try {
      const params = {
        page: typeof customPage === "number" ? customPage : page,
        size: PAGE_SIZE,
        sort: "declarationDate,DESC",
        ...(status !== "ALL" && { status }),
      };
      const res = await medicalService.getAllHealthDeclaration(params);
      console.log("API response:", res);
      setData(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setData([]);
      setTotalPages(1);
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách khai báo sức khỏe.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchData(0);
  };

  useEffect(() => {
    fetchData();
    
  }, [page]);

  useEffect(() => {
    setPage(0);
    fetchData(0);
    
  }, [status]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khai báo sức khỏe</h1>
          <p className="text-gray-600 mt-2">Quản lý và theo dõi các phiếu khai báo sức khỏe của học sinh</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Danh sách phiếu khai báo sức khỏe ({data.length} phiếu)</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={status} onValueChange={(value) => { setStatus(value); setPage(0); }}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead className="w-24">Mã học sinh</TableHead>
                  <TableHead className="w-32">Tên học sinh</TableHead>
                  <TableHead className="w-32">Người khai báo</TableHead>
                  <TableHead className="w-24">Trạng thái</TableHead>
                  <TableHead className="w-32">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-12 h-12 text-gray-300 mb-2" />
                        <p>Không có dữ liệu khai báo sức khỏe</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map(item => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.studentId ?? "N/A"}</TableCell>
                      <TableCell>{item.studentName ?? "N/A"}</TableCell>
                      <TableCell>{item.declaredByName ?? "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(getStatusLabel(item.status))}`}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog open={showDialog && selectedItem?.id === item.id} onOpenChange={setShowDialog}>
                            <DialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => { setSelectedItem(item); setShowDialog(true); }}
                                className="flex items-center space-x-1"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Chi tiết</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Chi tiết phiếu khai báo sức khỏe</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><b>Tên học sinh:</b> {item.studentName}</div>
                                <div><b>Tên người khai báo:</b> {item.declaredByName}</div>
                                <div><b>Mã học sinh:</b> {item.studentId}</div>
                                <div><b>Mã người khai báo:</b> {item.declaredById}</div>
                                <div><b>Năm học:</b> {item.academicYear}</div>
                                <div><b>Ngày khai báo:</b> {item.declarationDate}</div>
                                <div><b>Trạng thái:</b> {getStatusLabel(item.status)}</div>
                                <div><b>Chiều cao (cm):</b> {item.height}</div>
                                <div><b>Cân nặng (kg):</b> {item.weight}</div>
                                <div><b>Nhóm máu:</b> {item.bloodType}</div>
                                <div><b>Dị ứng:</b> {item.allergies}</div>
                                <div><b>Bệnh mãn tính:</b> {item.chronicDiseases}</div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          {updatingId === item.id ? (
                            <div className="flex items-center space-x-2">
                              <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusUpdateOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(item.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Xác nhận
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => { setUpdatingId(null); setStatusUpdate(""); }}
                              >
                                Hủy
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              onClick={() => { setUpdatingId(item.id); setStatusUpdate(""); }}
                            >
                              Cập nhật
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Trang {page + 1} / {totalPages} ({data.length} kết quả)
        </span>
        <div className="flex gap-2">
          <Button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            variant="outline"
          >
            Trang trước
          </Button>
          <Button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            variant="outline"
          >
            Trang sau
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthDeclarationSearch;
