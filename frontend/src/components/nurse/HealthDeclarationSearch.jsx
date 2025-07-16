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
          <h1 className="text-3xl font-bold text-blue-800">Quản lý khai báo sức khỏe</h1>
          <p className="text-blue-600 mt-2">Quản lý và theo dõi các phiếu khai báo sức khỏe của học sinh</p>
        </div>
      </div>

      <Card className="rounded-xl shadow-md bg-white border border-blue-100">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="text-blue-800 font-bold flex items-center gap-2">
              {/* Icon y tế */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" /></svg>
              Danh sách phiếu khai báo sức khỏe ({data.length} phiếu)
            </CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={status} onValueChange={(value) => { setStatus(value); setPage(0); }}>
                <SelectTrigger className="w-48 border-blue-300 text-blue-800 rounded-lg font-sans">
                  <Filter className="w-4 h-4 mr-2 text-blue-600" />
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
        <CardContent className="bg-white">
          <div className="overflow-x-auto">
            <Table className="border border-blue-100 rounded-xl overflow-hidden font-sans">
              <TableHeader className="bg-[#E3F2FD]">
                <TableRow>
                  <TableHead className="w-16 text-blue-700">ID</TableHead>
                  <TableHead className="w-24 text-blue-700">Mã học sinh</TableHead>
                  <TableHead className="w-32 text-blue-700">Tên học sinh</TableHead>
                  <TableHead className="w-32 text-blue-700">Người khai báo</TableHead>
                  <TableHead className="w-24 text-blue-700">Trạng thái</TableHead>
                  <TableHead className="w-32 text-blue-700">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-blue-400">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="w-12 h-12 text-blue-200 mb-2" />
                        <p>Không có dữ liệu khai báo sức khỏe</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map(item => (
                    <TableRow key={item.id} className="hover:bg-[#F5F5F5] transition">
                      <TableCell className="font-medium text-blue-900">{item.id}</TableCell>
                      <TableCell className="text-blue-900">{item.studentId ?? "N/A"}</TableCell>
                      <TableCell className="text-blue-900">{item.studentName ?? "N/A"}</TableCell>
                      <TableCell className="text-blue-900">{item.declaredByName ?? "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={`border font-semibold px-2 py-1 rounded-full text-xs shadow ${
                          item.status === 'PENDING' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                          item.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-300' :
                          item.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-300' :
                          'bg-gray-100 text-gray-600 border-gray-300'
                        }`}>
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
                                className="flex items-center space-x-1 border-blue-400 text-blue-700 hover:bg-blue-50 rounded-full font-sans"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Chi tiết</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl w-full max-h-[80vh] overflow-y-auto bg-blue-50 border border-blue-200 rounded-lg shadow-lg">
                              <DialogHeader>
                                <DialogTitle className="text-blue-800">Chi tiết phiếu khai báo sức khỏe</DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col gap-4 py-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Tên học sinh:</span>
                                  <span className="text-blue-900">{item.studentName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Tên người khai báo:</span>
                                  <span className="text-blue-900">{item.declaredByName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Năm học:</span>
                                  <span className="text-blue-900">{item.academicYear}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Ngày khai báo:</span>
                                  <span className="text-blue-900">{item.declarationDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Trạng thái:</span>
                                  <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                                    item.status === 'PENDING' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                                    item.status === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-300' :
                                    item.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-300' :
                                    'bg-gray-100 text-gray-600 border border-gray-300'
                                  }`}>
                                    {getStatusLabel(item.status)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Chiều cao (cm):</span>
                                  <span className="text-blue-900">{item.height}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Cân nặng (kg):</span>
                                  <span className="text-blue-900">{item.weight}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Nhóm máu:</span>
                                  <span className="text-blue-900">{item.bloodType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Dị ứng:</span>
                                  <span className="text-blue-900">{item.allergies}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-blue-800 min-w-[140px]">Bệnh mãn tính:</span>
                                  <span className="text-blue-900">{item.chronicDiseases}</span>
                                </div>
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
                                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full font-sans"
                              >
                                Xác nhận
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-400 text-blue-700 hover:bg-blue-50 rounded-full font-sans"
                                onClick={() => { setUpdatingId(null); setStatusUpdate(""); }}
                              >
                                Hủy
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-full font-sans"
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
        <span className="text-sm text-blue-700 font-semibold">
          Trang {page + 1} / {totalPages} ({data.length} kết quả)
        </span>
        <div className="flex gap-2">
          <Button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            variant="outline"
            className="border-blue-400 text-blue-700 hover:bg-blue-50 rounded-full font-sans"
          >
            Trang trước
          </Button>
          <Button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            variant="outline"
            className="border-blue-400 text-blue-700 hover:bg-blue-50 rounded-full font-sans"
          >
            Trang sau
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default HealthDeclarationSearch;
