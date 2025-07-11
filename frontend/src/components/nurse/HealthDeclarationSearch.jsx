import React, { useEffect, useState } from "react";
import medicalService from "@/api/services/medical.service";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from "axios";

const PAGE_SIZE = 10;
const API_BASE_URL = "https://school-medical-system.onrender.com/api/v1";

const HealthDeclarationSearch = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  // Đã bỏ ô tìm kiếm theo tên học sinh
  const [status, setStatus] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const statusUpdateOptions = [
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Từ chối" },
  ];

  const handleUpdateStatus = async (id) => {
    if (!statusUpdate) return;
    try {
      await axios.patch(`${API_BASE_URL}/health-declarations/${id}/status?status=${statusUpdate}`);
      setUpdatingId(null);
      setStatusUpdate("");
      fetchData();
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const statusOptions = [
    { value: "", label: "Tất cả" },
    { value: "APPROVED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Từ chối" },
    { value: "PENDING", label: "Chờ duyệt" },
  ];

  const statusVi = (status) => {
    switch (status) {
      case "APPROVED": return "Đã duyệt";
      case "REJECTED": return "Từ chối";
      case "PENDING": return "Chờ duyệt";
      default: return status || "";
    }
  };

  const fetchData = async (customPage) => {
    setLoading(true);
    try {
      const params = {
        page: typeof customPage === "number" ? customPage : page,
        size: PAGE_SIZE,
        sort: "declarationDate,DESC",
        // Đã bỏ param tìm kiếm theo tên học sinh
        status: status || undefined,
      };
      const res = await medicalService.getAllHealthDeclaration(params);
      console.log("API response:", res);
      setData(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setData([]);
      setTotalPages(1);
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
    // eslint-disable-next-line
  }, [page]);

  // Đảm bảo khi thay đổi studentName hoặc status, reset về page 0 và fetch lại dữ liệu
  useEffect(() => {
    setPage(0);
    fetchData(0);
    // eslint-disable-next-line
  }, [status]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Danh sách phiếu khai báo sức khỏe</h2>
      <form onSubmit={handleSearch} className="flex flex-wrap gap-2 mb-4 items-center">
        <select
          className="border rounded px-2 py-1"
          value={status}
          onChange={e => setStatus(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {/* <Button type="submit">Tìm kiếm</Button> */}
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border border-gray-200 bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-2 py-2 text-xs font-semibold text-gray-600 border-b">ID</th>
              <th className="w-20 px-2 py-2 text-xs font-semibold text-gray-600 border-b">Mã học sinh</th>
              <th className="w-32 px-2 py-2 text-xs font-semibold text-gray-600 border-b">Tên học sinh</th>
              <th className="w-32 px-2 py-2 text-xs font-semibold text-gray-600 border-b">Tên người khai báo</th>
              <th className="w-32 px-2 py-2 text-xs font-semibold text-gray-600 border-b">Chi tiết thông tin</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">Không có dữ liệu</td>
              </tr>
            ) : (
              data.map(item => (
                <tr key={item.id} className="even:bg-gray-50 hover:bg-blue-50">
                  <td className="px-2 py-2 text-center">{item.id}</td>
                  <td className="px-2 py-2 text-center">{item.studentId ?? ""}</td>
                  <td className="px-2 py-2">{item.studentName ?? ""}</td>
                  <td className="px-2 py-2">{item.declaredByName ?? ""}</td>
                  <td className="px-2 py-2 text-center">
                    <Dialog open={showDialog && selectedItem?.id === item.id} onOpenChange={setShowDialog}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => { setSelectedItem(item); setShowDialog(true); }}>
                          Xem chi tiết
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
                          <div><b>Trạng thái:</b> {statusVi(item.status)}</div>
                          <div><b>Chiều cao (cm):</b> {item.height}</div>
                          <div><b>Cân nặng (kg):</b> {item.weight}</div>
                          <div><b>Nhóm máu:</b> {item.bloodType}</div>
                          <div><b>Dị ứng:</b> {item.allergies}</div>
                          <div><b>Bệnh mãn tính:</b> {item.chronicDiseases}</div>
                          {/* Thêm các trường khác nếu muốn */}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="mt-2 flex flex-col items-center gap-2">
                      {updatingId === item.id ? (
                        <>
                          <select
                            className="border rounded px-2 py-1"
                            value={statusUpdate}
                            onChange={e => setStatusUpdate(e.target.value)}
                          >
                            <option value="">Chọn trạng thái</option>
                            {statusUpdateOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <Button size="sm" onClick={() => handleUpdateStatus(item.id)}>
                            Xác nhận
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { setUpdatingId(null); setStatusUpdate(""); }}>
                            Hủy
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => { setUpdatingId(item.id); setStatusUpdate(""); }}>
                          Đổi trạng thái
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <Button disabled={page === 0} onClick={() => setPage(page - 1)}>Trước</Button>
        <span>Trang {page + 1} / {totalPages}</span>
        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Sau</Button>
      </div>
    </div>
  );
};

export default HealthDeclarationSearch;
