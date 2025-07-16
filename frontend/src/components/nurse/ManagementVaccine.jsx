import { useEffect, useState } from "react"
import { medicalService } from "@/api/services/medical.service"
import { Button } from "@/components/ui/button"
import { AlertCircle, Syringe, Search } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useParams, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"

const ManagementVaccine = () => {
  const { toast } = useToast()
  const [studentsVaccine, setStudentsVaccine] = useState([])
  const [loadingVaccine, setLoadingVaccine] = useState(false)
  const [errorVaccine, setErrorVaccine] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    followUpRequired: false,
    nextDoseDate: '',
    expirationDate: '',
    injectionSite: '',
    lotNumber: '',
    vaccineName: '',
    vaccineBatch: '',
    followUpNotes: '',
    reactionNotes: '',
    scheduleTime: ''
  })
  const { campaignId } = useParams();
  const location = useLocation();
  const vaccinationStatus = location.state?.vaccinationStatus;
  console.log("campaignId",campaignId);
  console.log("location.state",location.state);
  console.log("location",location);
  console.log("vaccinationStatus",vaccinationStatus);

  

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10); // Số học sinh mỗi trang

  useEffect(() => {
    if (!campaignId) {
      setStudentsVaccine([]);
      return;
    }
    const fetchStudentsVaccine = async () => {
      try {
        setLoadingVaccine(true)
        setErrorVaccine(null)
        const res = await medicalService.getVaccinationConsentsByCampaign(campaignId);
        setStudentsVaccine(res.data || [])
        setPage(0); // Reset về trang đầu khi đổi chiến dịch
      } catch (err) {
        setErrorVaccine("Không thể tải danh sách học sinh chuẩn bị tiêm chủng.")
      } finally {
        setLoadingVaccine(false)
      }
    }
    fetchStudentsVaccine()
  }, [campaignId]);

  const handleOpenDialog = (student) => {
    if (vaccinationStatus === 'PENDING') {
      toast({ title: 'Thông báo', description: 'Chiến dịch đang chờ duyệt. Không thể ghi nhận kết quả.' });
      return;
    }
    setSelectedStudent(student)
    setShowDialog(true)
    setFormData({
      followUpRequired: false,
      nextDoseDate: '',
      expirationDate: '',
      injectionSite: '',
      lotNumber: '',
      vaccineName: '',
      vaccineBatch: '',
      followUpNotes: '',
      reactionNotes: '',
      scheduleTime: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // Gọi API tạo kết quả tiêm chủng
  const handleSubmitResult = async () => {
    if (!selectedStudent) return;
    try {
      const payload = {
        campaignId: Number(selectedStudent.campaignId),
        studentId: Number(selectedStudent.studentId),
        nextDoseDate: formData.nextDoseDate || null,
        injectionSite: formData.injectionSite,
        vaccineName: formData.vaccineName,
        followUpNotes: formData.followUpNotes,
        reactionNotes: formData.reactionNotes,
        scheduleTime: formData.scheduleTime ? new Date(formData.scheduleTime).toISOString() : null,
      };
      await medicalService.createVaccine(payload);
      toast({ title: 'Thành công', description: 'Đã ghi nhận kết quả tiêm chủng.' });
      setShowDialog(false);
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể ghi nhận kết quả.' });
    }
  }

  // Tính toán phân trang phía client
  const totalElements = studentsVaccine.length;
  const totalPages = Math.ceil(totalElements / size);
  const paginatedStudents = studentsVaccine.slice(page * size, (page + 1) * size);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Syringe className="h-6 w-6 text-green-600"/>Danh sách học sinh chuẩn bị tiêm chủng</h2>
        {/* Ẩn phần tìm kiếm chiến dịch */}
        {/*
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Label htmlFor="search-campaign">Tìm kiếm chiến dịch</Label>
          <Input
            id="search-campaign"
            type="number"
            min={1}
            value={searchCampaignId}
            onChange={e => setSearchCampaignId(e.target.value)}
            className="w-32"
            placeholder="Nhập mã chiến dịch"
          />
          <Button type="submit" variant="outline" className="flex items-center gap-1"><Search className="h-4 w-4"/>Tìm kiếm</Button>
        </form>
        */}
      </div>
      {loadingVaccine ? (
        <div className="flex items-center justify-center min-h-[120px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      ) : errorVaccine ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{errorVaccine}</span>
          </div>
        </div>
      ) : (
        <div>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle>Danh sách học sinh chuẩn bị tiêm chủng ({totalElements} học sinh)</CardTitle>
                {/* Nếu cần search/filter, thêm vào đây */}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Tên học sinh</TableHead>
                    <TableHead>Chiến dịch</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ghi nhận</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Không có học sinh nào chuẩn bị tiêm chủng.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedStudents.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.studentId}</TableCell>
                        <TableCell>{item.studentName}</TableCell>
                        <TableCell>{item.campaignId}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.consentStatus === 'DONE' ? 'bg-green-100 text-green-800' :
                            item.consentStatus === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            item.consentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            item.consentStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                    {item.consentStatus === 'DONE' ? 'Đã tiêm chủng' :
                     item.consentStatus === 'APPROVED' ? 'Đã đồng ý' :
                     item.consentStatus === 'PENDING' ? 'Chờ xác nhận' :
                     item.consentStatus === 'REJECTED' ? 'Từ chối' :
                     item.consentStatus || 'Không rõ'}
                          </span>
                        </TableCell>
                        <TableCell>
                    {item.consentStatus === 'APPROVED' && vaccinationStatus === 'APPROVED' && (
                      <Dialog open={showDialog && selectedStudent?.id === item.id} onOpenChange={setShowDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="success" onClick={() => handleOpenDialog(item)}>
                            Ghi kết quả sau tiêm
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md w-full max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Ghi nhận kết quả tiêm chủng</DialogTitle>
                          </DialogHeader>
                          <form className="space-y-3">
                            <div>
                              <Label>Tên học sinh</Label>
                              <div className="font-semibold">{item.studentName}</div>
                            </div>
                            <div>
                              <Label htmlFor="injectionSite">Vị trí tiêm</Label>
                              <Input id="injectionSite" name="injectionSite" value={formData.injectionSite} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="vaccineName">Tên vaccine</Label>
                              <Input id="vaccineName" name="vaccineName" value={formData.vaccineName} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="followUpNotes">Ghi chú theo dõi</Label>
                              <Textarea id="followUpNotes" name="followUpNotes" value={formData.followUpNotes} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="reactionNotes">Phản ứng sau tiêm</Label>
                              <Textarea id="reactionNotes" name="reactionNotes" value={formData.reactionNotes} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="scheduleTime">Thời gian lịch tiêm</Label>
                              <Input id="scheduleTime" name="scheduleTime" type="datetime-local" value={formData.scheduleTime} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                              <Button onClick={() => setShowDialog(false)} variant="outline" type="button">Đóng</Button>
                              <Button className="" type="button" onClick={handleSubmitResult}>Lưu kết quả</Button>
                            </div>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="flex justify-between items-center mt-4">
            <span>
              Trang {page + 1} / {totalPages} ({totalElements} học sinh)
            </span>
            <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
                disabled={page === 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
                disabled={page + 1 >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            >
              Trang sau
            </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagementVaccine
