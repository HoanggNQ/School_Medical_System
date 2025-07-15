
import { useEffect, useState } from "react"
import { medicalService } from "@/api/services/medical.service"
import { Button } from "@/components/ui/button"
import { AlertCircle, Stethoscope, Search, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {  useParams, useLocation } from "react-router-dom"

const HealthCheck = () => {
  const { toast } = useToast()
  const [studentsHealth, setStudentsHealth] = useState([])
  const [loadingHealth, setLoadingHealth] = useState(false)
  const [errorHealth, setErrorHealth] = useState(null)
  const [searchCampaignId, setSearchCampaignId] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    heightCm: '',
    weight: '',
    visionLeft: '',
    visionRight: '',
    hearing: '',
    dentalHealth: '',
    bloodPressure: '',
    pulse: '',
    temperature: '',
    otherNotes: '',
    recommendation: '',
    followUpRequired: false,
    followUpNotes: '',
    overallHealthRating: '',
    scheduleTime: '',
  })
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { campaignId } = useParams();
  const location = useLocation();
  
  const campaignStatus = location.state?.campaignStatus;

  console.log("campaignId",campaignId);
  console.log("location.state",location.state);
  console.log("location",location);
  


  useEffect(() => {
    if (!campaignId) {
      setStudentsHealth([])
      return
    }
    const fetchStudentsHealth = async () => {
      try {
        setLoadingHealth(true)
        setErrorHealth(null)
        // Lấy danh sách học sinh khám sức khỏe
        const res = await medicalService.getHealthCheckConsentsByCampaign(campaignId, page, size);
        console.log("res", res);
        setStudentsHealth(res.data?.healthCheckConsents || []);
        setTotalPages(res.data?.totalPages || (res.data?.totalElements ? Math.ceil(res.data.totalElements / size) : 1));
      } catch (err) {
        setErrorHealth("Không thể tải danh sách học sinh chuẩn bị khám sức khỏe.")
      } finally {
        setLoadingHealth(false)
      }
    }
    fetchStudentsHealth()
  }, [campaignId, page, size])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchCampaignId && !isNaN(Number(searchCampaignId))) {
      setCampaignId(Number(searchCampaignId))
    } else {
      setCampaignId("")
    }
  }

  const handleOpenDialog = (student) => {
    if (campaignStatus === 'PENDING') {
      toast({ title: 'Thông báo', description: 'Chiến dịch đang chờ duyệt. Không thể ghi nhận kết quả.' });
      return;
    }
    setSelectedStudent(student)
    setShowDialog(true)
    setFormData({
      heightCm: '',
      weight: '',
      visionLeft: '',
      visionRight: '',
      hearing: '',
      dentalHealth: '',
      bloodPressure: '',
      pulse: '',
      temperature: '',
      otherNotes: '',
      recommendation: '',
      followUpRequired: false,
      followUpNotes: '',
      overallHealthRating: '',
      scheduleTime: '',
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmitResult = async () => {
    if (!selectedStudent) return;
    try {
      const payload = {
        campaignId: Number(selectedStudent.campaignId),
        studentId: Number(selectedStudent.studentId),
        heightCm: Number(formData.heightCm),
        weight: Number(formData.weight),
        visionLeft: formData.visionLeft,
        visionRight: formData.visionRight,
        hearing: formData.hearing,
        dentalHealth: formData.dentalHealth,
        bloodPressure: formData.bloodPressure,
        pulse: Number(formData.pulse),
        temperature: Number(formData.temperature),
        otherNotes: formData.otherNotes,
        recommendation: formData.recommendation,
        followUpRequired: !!formData.followUpRequired,
        followUpNotes: formData.followUpNotes,
        overallHealthRating: formData.overallHealthRating,
        scheduleTime: formData.scheduleTime ? new Date(formData.scheduleTime).toISOString() : null,
      };
      console.log('payload gửi lên:', payload);
      const response = await medicalService.createHealthCheckResult(payload);
      console.log("response health check", response);
      toast({ title: 'Thành công', description: 'Đã ghi nhận kết quả khám sức khỏe.' });
      setShowDialog(false);
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể ghi nhận kết quả.' });
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Stethoscope className="h-6 w-6 text-blue-600"/>Danh sách học sinh chuẩn bị khám sức khỏe</h2>
        {/* <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Label htmlFor="search-campaign">Tìm kiếm chiến dịch</Label>
          <Input
            id="search-campaign"
            type="number"
            min={1}
            value={searchCampaignId}
            onChange={e => setSearchCampaignId(e.target.value)}
            className="w-32"
            placeholder="Nhập mã chiến dịch khám sức khỏe"
          />
          <Button type="submit" variant="outline" className="flex items-center gap-1"><Search className="h-4 w-4"/>Tìm kiếm</Button>
        </form> */}
      </div>
      {loadingHealth ? (
        <div className="flex items-center justify-center min-h-[120px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      ) : errorHealth ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{errorHealth}</span>
          </div>
        </div>
      ) : studentsHealth.length === 0 ? (
        <div className="text-center py-6">
          <Stethoscope className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Không có học sinh nào chuẩn bị khám sức khỏe.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <h3 className="text-xl font-bold mb-2">Chiến dịch {campaignId}</h3>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Id</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tên học sinh</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Lớp</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Chiến dịch</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Trạng thái</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ghi nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentsHealth.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-2 text-sm">{item.studentId}</td>
                  <td className="px-4 py-2 text-sm">{item.studentName}</td>
                  <td className="px-4 py-2 text-sm">{item.className}</td>
                  <td className="px-4 py-2 text-sm">{item.campaignId}</td>
                  <td className="px-4 py-2 text-sm">
                    {item.status === 'DONE' ? 'Đã khám' :
                     item.status === 'APPROVED' ? 'Đã đồng ý' :
                     item.status === 'PENDING' ? 'Chờ xác nhận' :
                     item.status === 'REJECTED' ? 'Từ chối' :
                     item.status || 'Không rõ'}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    {/* Chỉ hiển thị nút nếu campaignStatus là 'APPROVED' và học sinh có status là 'APPROVED' */}
                    {campaignStatus === 'APPROVED' && item.status === 'APPROVED' && (
                      <Dialog open={showDialog && selectedStudent?.id === item.id} onOpenChange={setShowDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleOpenDialog(item)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white shadow-md rounded-lg px-4 py-2 transition-colors duration-200"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Ghi nhận kết quả
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Ghi nhận kết quả khám sức khỏe</DialogTitle>
                          </DialogHeader>
                          <form className="space-y-3">
                            <div>
                              <Label>Tên học sinh</Label>
                              <div className="font-semibold">{item.studentName}</div>
                            </div>
                            {/* <div>
                              <Label>Mã học sinh</Label>
                              <div className="font-semibold">{item.studentId}</div>
                            </div>
                            <div>
                              <Label>Mã chiến dịch</Label>
                              <div className="font-semibold">{item.campaignId}</div>
                            </div> */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="heightCm">Chiều cao (cm)</Label>
                                <Input id="heightCm" name="heightCm" value={formData.heightCm} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="weight">Cân nặng (kg)</Label>
                                <Input id="weight" name="weight" value={formData.weight} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="visionLeft">Thị lực trái</Label>
                                <Input id="visionLeft" name="visionLeft" value={formData.visionLeft} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="visionRight">Thị lực phải</Label>
                                <Input id="visionRight" name="visionRight" value={formData.visionRight} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="hearing">Thính lực</Label>
                                <Input id="hearing" name="hearing" value={formData.hearing} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="dentalHealth">Răng miệng</Label>
                                <Input id="dentalHealth" name="dentalHealth" value={formData.dentalHealth} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="bloodPressure">Huyết áp</Label>
                                <Input id="bloodPressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="pulse">Mạch</Label>
                                <Input id="pulse" name="pulse" value={formData.pulse} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="temperature">Nhiệt độ</Label>
                                <Input id="temperature" name="temperature" value={formData.temperature} onChange={handleInputChange} />
                              </div>
                              <div>
                                <Label htmlFor="overallHealthRating">Đánh giá tổng thể</Label>
                                <Input id="overallHealthRating" name="overallHealthRating" value={formData.overallHealthRating} onChange={handleInputChange} />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="otherNotes">Ghi chú khác</Label>
                                <Textarea id="otherNotes" name="otherNotes" value={formData.otherNotes} onChange={handleInputChange} />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="recommendation">Khuyến nghị</Label>
                                <Input id="recommendation" name="recommendation" value={formData.recommendation} onChange={handleInputChange} />
                              </div>
                              <div className="flex items-center gap-2 md:col-span-2">
                                <input type="checkbox" id="followUpRequired" name="followUpRequired" checked={formData.followUpRequired} onChange={handleInputChange} />
                                <Label htmlFor="followUpRequired" className="mb-0">Cần theo dõi thêm</Label>
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="followUpNotes">Ghi chú theo dõi</Label>
                                <Textarea id="followUpNotes" name="followUpNotes" value={formData.followUpNotes} onChange={handleInputChange} />
                              </div>
                              <div className="md:col-span-2">
                                <Label htmlFor="scheduleTime">Thời gian lịch khám</Label>
                                <Input id="scheduleTime" name="scheduleTime" type="datetime-local" value={formData.scheduleTime} onChange={handleInputChange} />
                              </div>
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
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <span>Trang {page + 1} / {totalPages}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <label>
                Số dòng:
                <select
                  className="ml-2 border rounded px-2 py-1"
                  value={size}
                  onChange={e => { setSize(Number(e.target.value)); setPage(0); }}
                >
                  {[5, 10, 20, 50].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HealthCheck
