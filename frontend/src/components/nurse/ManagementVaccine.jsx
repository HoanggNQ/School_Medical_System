import { useEffect, useState, useRef } from "react"
import { useParams, useLocation } from "react-router-dom"
import { medicalService } from "@/api/services/medical.service"
import fileService from '@/api/services/file.service'
import { Button } from "@/components/ui/button"
import {
  Syringe, FileDown, FileUp
} from "lucide-react"
import {
  useToast
} from "@/components/ui/use-toast"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"

const StatusBadge = ({ status }) => {
  const map = {
    DONE: { text: "Đã tiêm chủng", color: "bg-green-100 text-green-700 border border-green-300" },
    APPROVED: { text: "Đã đồng ý", color: "bg-blue-100 text-blue-700 border border-blue-300" },
    PENDING: { text: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-700 border border-yellow-300" },
    REJECTED: { text: "Từ chối", color: "bg-red-100 text-red-700 border border-red-300" },
  };
  const { text, color } = map[status] || { text: status, color: "bg-gray-100 text-gray-600 border border-gray-300" };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>{text}</span>;
};

const ManagementVaccine = () => {
  const { toast } = useToast()
  const { campaignId } = useParams()
  const location = useLocation()
  const vaccinationStatus = location.state?.vaccinationStatus

  const [studentsVaccine, setStudentsVaccine] = useState([])
  const [loadingVaccine, setLoadingVaccine] = useState(false)
  const [errorVaccine, setErrorVaccine] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    injectionSite: '', vaccineName: '', followUpNotes: '', reactionNotes: '', scheduleTime: ''
  })
  const [viewMode, setViewMode] = useState(false);

  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const fileInputRef = useRef()
  const [importing, setImporting] = useState(false)

  useEffect(() => {
    if (!campaignId) return
    const fetchStudentsVaccine = async () => {
      try {
        setLoadingVaccine(true)
        const res = await medicalService.getVaccinationConsentsByCampaign(campaignId)
        setStudentsVaccine(res.data || [])
        setPage(0)
      } catch {
        setErrorVaccine("Không thể tải danh sách học sinh chuẩn bị tiêm chủng.")
      } finally {
        setLoadingVaccine(false)
      }
    }
    fetchStudentsVaccine()
  }, [campaignId])

  const handleOpenDialog = (student) => {
    if (vaccinationStatus === 'PENDING') {
      toast({ title: 'Thông báo', description: 'Chiến dịch đang chờ duyệt. Không thể ghi nhận kết quả.' });
      return;
    }
    setSelectedStudent(student);
    setShowDialog(true);
    setViewMode(false);
    setFormData({
      injectionSite: '', vaccineName: '', followUpNotes: '', reactionNotes: '', scheduleTime: ''
    });
  };

  // Hàm mở dialog xem kết quả
  const handleViewResult = (student) => {
    setSelectedStudent(student);
    setShowDialog(true);
    setViewMode(true);
    // Lấy dữ liệu tiêm chủng của học sinh (giả sử đã có trong student, nếu cần thì fetch thêm)
    setFormData({
      injectionSite: student.injectionSite || '',
      vaccineName: student.vaccineName || '',
      followUpNotes: student.followUpNotes || '',
      reactionNotes: student.reactionNotes || '',
      scheduleTime: student.scheduleTime || '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitResult = async () => {
    if (!selectedStudent) return
    try {
      await medicalService.createVaccine({
        campaignId: Number(selectedStudent.campaignId),
        studentId: Number(selectedStudent.studentId),
        nextDoseDate: null,
        injectionSite: formData.injectionSite,
        vaccineName: formData.vaccineName,
        followUpNotes: formData.followUpNotes,
        reactionNotes: formData.reactionNotes,
        scheduleTime: formData.scheduleTime ? new Date(formData.scheduleTime).toISOString() : null,
      })
      toast({ title: 'Thành công', description: 'Đã ghi nhận kết quả tiêm chủng.' })
      setShowDialog(false)
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể ghi nhận kết quả.' })
    }
  }

  const handleExport = async () => {
    try {
      const blob = await fileService.exportVaccinationRecord(campaignId)
      const url = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `vaccination_records_campaign_${campaignId}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      toast({ title: 'Thành công', description: 'Xuất file thành công.' })
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Không thể xuất file.'
      toast({ title: 'Lỗi', description: msg })
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    try {
      await fileService.importVaccinationRecord(file)
      toast({ title: 'Thành công', description: 'Nhập file thành công.' })
    } catch (err) {
      let msg = err?.response?.data?.message || err?.message || 'Không thể nhập file.'
      toast({ title: 'Lỗi', description: msg })
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  const totalElements = studentsVaccine.length;
  const totalPages = Math.ceil(totalElements / size);
  const paginatedStudents = studentsVaccine.slice(page * size, (page + 1) * size);

  return (
    <div className="p-6 font-sans">
      <Card className="rounded-xl shadow bg-white border border-blue-100">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
          <CardTitle className="text-blue-800 font-bold flex items-center gap-2">
            <Syringe className="h-6 w-6 text-blue-500" />
            Quản lý tiêm chủng
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Header + nút thao tác */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-blue-900">
                Danh sách học sinh - Chiến dịch <span className="text-blue-600 font-bold">{campaignId}</span>
              </h2>
              <p className="text-sm text-gray-600">Theo dõi và ghi nhận kết quả tiêm chủng</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} disabled={!campaignId} className="bg-blue-600 text-white hover:bg-blue-700">
                <FileDown className="h-4 w-4 mr-1" /> Xuất Excel
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <FileUp className="h-4 w-4 mr-1" /> {importing ? 'Đang nhập...' : 'Nhập Excel'}
              </Button>
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImport}
              />
            </div>
          </div>

          {/* Table */}
          {loadingVaccine ? (
            <div className="text-center text-gray-500 py-6">Đang tải dữ liệu...</div>
          ) : errorVaccine ? (
            <div className="text-red-600 bg-red-100 p-4 rounded-md">{errorVaccine}</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-blue-100">
                <table className="w-full text-sm">
                  <thead className="bg-[#E3F2FD] text-blue-800">
                    <tr>
                      <th className="text-left p-3">ID</th>
                      <th className="text-left p-3">Tên học sinh</th>
                      <th className="text-left p-3">Chiến dịch</th>
                      <th className="text-left p-3">Trạng thái</th>
                      <th className="text-left p-3">Ghi nhận</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {paginatedStudents.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50 transition">
                        <td className="p-3">{item.studentId}</td>
                        <td className="p-3 font-medium text-gray-800">{item.studentName}</td>
                        <td className="p-3">{item.campaignId}</td>
                        <td className="p-3"><StatusBadge status={item.consentStatus} /></td>
                        <td className="p-3">
                          {item.consentStatus === 'APPROVED' && vaccinationStatus === 'APPROVED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full font-sans"
                              onClick={() => handleOpenDialog(item)}
                            >
                              Ghi nhận
                            </Button>
                          )}
                          {item.consentStatus === 'DONE' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full font-sans"
                              onClick={() => handleViewResult(item)}
                            >
                              Xem kết quả
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-blue-700 font-semibold">
                  Trang {page + 1} / {totalPages} ({studentsVaccine.length} học sinh)
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{viewMode ? 'Kết quả tiêm chủng' : 'Ghi nhận kết quả tiêm chủng'}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label>Tên học sinh</Label>
              <div className="font-semibold">{selectedStudent?.studentName}</div>
            </div>
            <div>
              <Label>Vị trí tiêm</Label>
              <Input name="injectionSite" value={formData.injectionSite} onChange={handleInputChange} disabled={viewMode} />
            </div>
            <div>
              <Label>Tên vaccine</Label>
              <Input name="vaccineName" value={formData.vaccineName} onChange={handleInputChange} disabled={viewMode} />
            </div>
            <div>
              <Label>Ghi chú theo dõi</Label>
              <Textarea name="followUpNotes" value={formData.followUpNotes} onChange={handleInputChange} disabled={viewMode} />
            </div>
            <div>
              <Label>Phản ứng sau tiêm</Label>
              <Textarea name="reactionNotes" value={formData.reactionNotes} onChange={handleInputChange} disabled={viewMode} />
            </div>
            <div>
              <Label>Thời gian lịch tiêm</Label>
              <Input name="scheduleTime" type="datetime-local" value={formData.scheduleTime} onChange={handleInputChange} disabled={viewMode} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>Đóng</Button>
              {!viewMode && <Button type="button" onClick={handleSubmitResult}>Lưu</Button>}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagementVaccine;
