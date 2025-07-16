
import { useEffect, useState } from "react"
import { medicalService } from "@/api/services/medical.service"
import { Button } from "@/components/ui/button"
import { AlertCircle, Stethoscope, Search, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {  useParams, useLocation, useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"

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
    weightKg: '',
    visionLeft: '',
    visionRight: '',
    hearing: '',
    dentalHealth: '',
    bloodPressure: '',
    pulse: '',
    temperature: '',
    otherNotes: '',
    recommendation: '',
    // followUpRequired: false,
    followUpNotes: '',
    overallHealthRating: '',
    // scheduleTime: '',
  })
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const { campaignId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Lấy trạng thái chiến dịch từ location.state nếu được truyền từ CampaignsNurse
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
      weightKg: '',
      visionLeft: '',
      visionRight: '',
      hearing: '',
      dentalHealth: '',
      bloodPressure: '',
      pulse: '',
      temperature: '',
      otherNotes: '',
      recommendation: '',
      // followUpRequired: false,
      followUpNotes: '',
      overallHealthRating: '',
      // scheduleTime: '',
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
        weightKg: Number(formData.weightKg),
        visionLeft: formData.visionLeft,
        visionRight: formData.visionRight,
        hearing: formData.hearing,
        dentalHealth: formData.dentalHealth,
        bloodPressure: formData.bloodPressure,
        pulse: Number(formData.pulse),
        temperature: Number(formData.temperature),
        otherNotes: formData.otherNotes,
        recommendation: formData.recommendation,
        // followUpRequired: !!formData.followUpRequired,
        followUpNotes: formData.followUpNotes,
        overallHealthRating: formData.overallHealthRating,
        // scheduleTime: formData.scheduleTime ? new Date(formData.scheduleTime).toISOString() : null,
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
      ) : (
        <div>
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <CardTitle>Danh sách học sinh chuẩn bị khám sức khỏe ({studentsHealth.length} học sinh)</CardTitle>
                {campaignId && (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => navigate(`/consultation-schedules-nurse/${campaignId}`)}
                  >
                    Xem lịch tư vấn
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Tên học sinh</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Chiến dịch</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ghi nhận</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsHealth.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        Không có học sinh nào chuẩn bị khám sức khỏe.
                      </TableCell>
                    </TableRow>
                  ) : (
                    studentsHealth.map((consent) => (
                      <TableRow key={consent.consentId}>
                        <TableCell>{consent.studentId}</TableCell>
                        <TableCell>{consent.studentName}</TableCell>
                        <TableCell>{consent.className}</TableCell>
                        <TableCell>{consent.campaignId}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            consent.status === 'DONE' ? 'bg-green-100 text-green-800' :
                            consent.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            consent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            consent.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {consent.status === 'DONE' ? 'Đã khám' :
                              consent.status === 'APPROVED' ? 'Đã đồng ý' :
                              consent.status === 'PENDING' ? 'Chờ xác nhận' :
                              consent.status === 'REJECTED' ? 'Từ chối' :
                              consent.status || 'Không rõ'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {campaignStatus === 'APPROVED' && consent.status === 'APPROVED' && (
                            <Dialog open={showDialog && selectedStudent?.consentId === consent.consentId} onOpenChange={setShowDialog}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleOpenDialog(consent)}
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
                                    <div className="font-semibold">{consent.studentName}</div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="heightCm">Chiều cao (cm)</Label>
                                      <Input id="heightCm" name="heightCm" value={formData.heightCm} onChange={handleInputChange} />
                                    </div>
                                    <div>
                                      <Label htmlFor="weightKg">Cân nặng (kg)</Label>
                                      <Input id="weightKg" name="weightKg" value={formData.weightKg} onChange={handleInputChange} />
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
                                    <div className="md:col-span-2">
                                      <Label htmlFor="followUpNotes">Ghi chú theo dõi</Label>
                                      <Textarea id="followUpNotes" name="followUpNotes" value={formData.followUpNotes} onChange={handleInputChange} />
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
              Trang {page + 1} / {totalPages} ({studentsHealth.length} học sinh)
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