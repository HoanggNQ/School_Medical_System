

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
  const campaignStatus = location.state?.campaignStatus;
  console.log("campaignId",campaignId);
  console.log("location.state",location.state);
  console.log("location",location);
  

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
      } catch (err) {
        setErrorVaccine("Không thể tải danh sách học sinh chuẩn bị tiêm chủng.")
      } finally {
        setLoadingVaccine(false)
      }
    }
    fetchStudentsVaccine()
  }, [campaignId]);

  const handleOpenDialog = (student) => {
    if (campaignStatus === 'PENDING') {
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
      ) : studentsVaccine.length === 0 ? (
        <div className="text-center py-6">
          <Syringe className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Không có học sinh nào chuẩn bị tiêm chủng.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-bold mb-2">Chiến dịch {campaignId}</h3>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">TÊN HỌC SINH</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">CHIẾN DỊCH</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">TRẠNG THÁI</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">GHI NHẬN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentsVaccine.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm">{item.studentId}</td>
                  <td className="px-4 py-2 text-sm">{item.studentName}</td>
                  <td className="px-4 py-2 text-sm">{item.campaignId}</td>
                  <td className="px-4 py-2 text-sm">
                    {item.consentStatus === 'DONE' ? 'Đã tiêm chủng' :
                     item.consentStatus === 'APPROVED' ? 'Đã đồng ý' :
                     item.consentStatus === 'PENDING' ? 'Chờ xác nhận' :
                     item.consentStatus === 'REJECTED' ? 'Từ chối' :
                     item.consentStatus || 'Không rõ'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {/* Chỉ hiển thị nút nếu consentStatus là 'APPROVED' và campaignStatus là 'ACTIVE' */}
                    {item.consentStatus === 'APPROVED' && campaignStatus === 'ACTIVE' && (
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
                            <div className="flex items-center gap-2">
                              <input type="checkbox" id="followUpRequired" name="followUpRequired" checked={formData.followUpRequired} onChange={handleInputChange} />
                              <Label htmlFor="followUpRequired" className="mb-0">Cần theo dõi thêm</Label>
                            </div>
                            <div>
                              <Label htmlFor="nextDoseDate">Ngày tiêm liều tiếp theo</Label>
                              <Input id="nextDoseDate" name="nextDoseDate" type="date" value={formData.nextDoseDate} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="expirationDate">Ngày hết hạn</Label>
                              <Input id="expirationDate" name="expirationDate" type="date" value={formData.expirationDate} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="injectionSite">Vị trí tiêm</Label>
                              <Input id="injectionSite" name="injectionSite" value={formData.injectionSite} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="lotNumber">Số lô</Label>
                              <Input id="lotNumber" name="lotNumber" value={formData.lotNumber} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="vaccineName">Tên vaccine</Label>
                              <Input id="vaccineName" name="vaccineName" value={formData.vaccineName} onChange={handleInputChange} className="w-full" />
                            </div>
                            <div>
                              <Label htmlFor="vaccineBatch">Số lô vaccine (vaccineBatch)</Label>
                              <Input id="vaccineBatch" name="vaccineBatch" value={formData.vaccineBatch} onChange={handleInputChange} className="w-full" />
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManagementVaccine
