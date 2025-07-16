import { useEffect, useState } from "react"
import { medicalService } from "@/api/services/medical.service"
import { Button } from "@/components/ui/button"
import {
  AlertCircle, Stethoscope, Search, CheckCircle, ChevronLeft,
  ChevronRight, FileDown, FileUp, CalendarCheck2
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import fileService from '@/api/services/file.service'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const HealthCheck = () => {
  const { toast } = useToast()
  const [studentsHealth, setStudentsHealth] = useState([])
  const [loadingHealth, setLoadingHealth] = useState(false)
  const [errorHealth, setErrorHealth] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDialog, setShowDialog] = useState(false)
  const [formData, setFormData] = useState({
    heightCm: '', weightKg: '', visionLeft: '', visionRight: '', hearing: '',
    dentalHealth: '', bloodPressure: '', pulse: '', temperature: '',
    otherNotes: '', recommendation: '', followUpNotes: '', overallHealthRating: ''
  })

  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useState(null)
  const [viewResult, setViewResult] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [loadingResult, setLoadingResult] = useState(false);

  const { campaignId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const campaignStatus = location.state?.campaignStatus

  useEffect(() => {
    if (!campaignId) return
    const fetchStudentsHealth = async () => {
      try {
        setLoadingHealth(true)
        const res = await medicalService.getHealthCheckConsentsByCampaign(campaignId, page, size)
        setStudentsHealth(res.data?.healthCheckConsents || [])
        setTotalPages(res.data?.totalPages || 1)
      } catch {
        setErrorHealth("Không thể tải danh sách học sinh chuẩn bị khám sức khỏe.")
      } finally {
        setLoadingHealth(false)
      }
    }
    fetchStudentsHealth()
  }, [campaignId, page, size])

  const handleOpenDialog = (student) => {
    if (campaignStatus === 'PENDING') {
      toast({ title: 'Thông báo', description: 'Chiến dịch đang chờ duyệt. Không thể ghi nhận kết quả.' });
      return
    }
    setSelectedStudent(student)
    setShowDialog(true)
    setFormData({
      heightCm: '', weightKg: '', visionLeft: '', visionRight: '', hearing: '',
      dentalHealth: '', bloodPressure: '', pulse: '', temperature: '',
      otherNotes: '', recommendation: '', followUpNotes: '', overallHealthRating: ''
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitResult = async () => {
    if (!selectedStudent) return
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
        followUpNotes: formData.followUpNotes,
        overallHealthRating: formData.overallHealthRating
      }
      await medicalService.createHealthCheckResult(payload)
      toast({ title: 'Thành công', description: 'Đã ghi nhận kết quả khám sức khỏe.' })
      setShowDialog(false)
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể ghi nhận kết quả.' })
    }
  }

  const handleExport = async () => {
    try {
      const blob = await fileService.exportHealthCheckResult(campaignId)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `health_check_results_campaign_${campaignId}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      toast({ title: 'Thành công', description: 'Xuất file thành công.' })
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể xuất file.' })
    }
  }

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    try {
      await fileService.importHealthCheckResult(file)
      toast({ title: 'Thành công', description: 'Nhập file thành công.' })
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể nhập file.' })
    } finally {
      setImporting(false)
      e.target.value = ''
    }
  }

  const handleConfirmConsultation = async (consent) => {
    try {
      await medicalService.confirmConsultationSchedule(consent.studentId, consent.campaignId)
      toast({
        title: 'Thành công',
        description: `Đã xác nhận lịch tư vấn cho học sinh ${consent.studentName}.`
      })
  
      // Refetch danh sách học sinh sau khi xác nhận
      const res = await medicalService.getHealthCheckConsentsByCampaign(campaignId, page, size)
      setStudentsHealth(res.data?.healthCheckConsents || [])
  
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể xác nhận lịch tư vấn.' })
    }
  }

  // Hàm xem kết quả khám
  const handleViewResult = async (consent) => {
    setLoadingResult(true);
    setViewResult(true);
    setResultData(null);
    try {
      const res = await medicalService.getHealthCheckResult(consent.studentId, consent.resultId);
      setResultData(res.data?.data || null);
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể lấy kết quả khám.' });
      setResultData(null);
    } finally {
      setLoadingResult(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="rounded-xl shadow-md bg-white border border-blue-100">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
          <CardTitle className="text-blue-800 font-bold flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-blue-400" />
            Danh sách học sinh khám sức khỏe
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
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
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Chiến dịch {campaignId}</h3>
                <div className="flex gap-2">
                  <Button onClick={handleExport} className="bg-blue-600 text-white hover:bg-blue-700">
                    <FileDown className="w-4 h-4 mr-1" /> Export
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importing}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <FileUp className="w-4 h-4 mr-1" />
                    {importing ? "Đang nhập..." : "Import"}
                  </Button>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    ref={el => fileInputRef.current = el}
                    style={{ display: 'none' }}
                    onChange={handleImport}
                  />
                </div>
              </div>
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Tên học sinh</th>
                    <th className="px-4 py-2 text-left">Chiến dịch</th>
                    <th className="px-4 py-2 text-left">Trạng thái</th>
                    <th className="px-4 py-2 text-left">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsHealth.map((consent) => (
                    <tr key={consent.consentId} className={consent.status === 'DONE' ? 'bg-green-50' : ''}>
                      <td className="px-4 py-2">{consent.studentId}</td>
                      <td className="px-4 py-2">{consent.studentName}</td>
                      <td className="px-4 py-2">{consent.campaignId}</td>
                      <td className="px-4 py-2">
                        {consent.status === 'DONE' ? 'Đã khám'
                          : consent.status === 'APPROVED' ? 'Đã đồng ý'
                          : consent.status === 'PENDING' ? 'Chờ xác nhận'
                          : consent.status === 'REJECTED' ? 'Từ chối'
                          : consent.status}
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        {campaignStatus === 'APPROVED' && consent.status === 'APPROVED' && (
                          <Dialog open={showDialog && selectedStudent?.consentId === consent.consentId} onOpenChange={setShowDialog}>
                            <DialogTrigger asChild>
                              <Button onClick={() => handleOpenDialog(consent)} size="sm" className="bg-green-600 text-white hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" /> Ghi nhận
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl">
                              <DialogHeader>
                                <DialogTitle>Ghi nhận kết quả khám</DialogTitle>
                              </DialogHeader>
                              <form className="grid grid-cols-2 gap-3">
                                <div className="col-span-2"><Label>Tên học sinh: {consent.studentName}</Label></div>
                                {["heightCm", "weightKg", "visionLeft", "visionRight", "hearing", "dentalHealth", "bloodPressure", "pulse", "temperature", "overallHealthRating"]
                                  .map(field => (
                                    <div key={field}>
                                      <Label>{field}</Label>
                                      <Input name={field} value={formData[field]} onChange={handleInputChange} />
                                    </div>
                                  ))}
                                <div className="col-span-2">
                                  <Label>Ghi chú</Label>
                                  <Textarea name="otherNotes" value={formData.otherNotes} onChange={handleInputChange} />
                                </div>
                                <div className="col-span-2">
                                  <Label>Khuyến nghị</Label>
                                  <Input name="recommendation" value={formData.recommendation} onChange={handleInputChange} />
                                </div>
                                <div className="col-span-2">
                                  <Label>Theo dõi</Label>
                                  <Textarea name="followUpNotes" value={formData.followUpNotes} onChange={handleInputChange} />
                                </div>
                                <div className="col-span-2 flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setShowDialog(false)}>Hủy</Button>
                                  <Button onClick={handleSubmitResult}>Lưu</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        )}
                        {campaignStatus === 'APPROVED' && consent.status === 'DONEs' && (
                          <Dialog open={viewResult} onOpenChange={setViewResult}>
                            <DialogTrigger asChild>
                              <Button onClick={() => handleViewResult(consent)} size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                                Xem kết quả khám
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl">
                              <DialogHeader>
                                <DialogTitle>Kết quả khám sức khỏe</DialogTitle>
                              </DialogHeader>
                              {loadingResult ? (
                                <div className="flex items-center justify-center min-h-[120px]">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                  <span className="ml-2 text-gray-600">Đang tải...</span>
                                </div>
                              ) : resultData ? (
                                <form className="grid grid-cols-2 gap-3">
                                  <div className="col-span-2"><Label>Tên học sinh: {resultData.studentName}</Label></div>
                                  <div><Label>Chiến dịch</Label><Input value={resultData.campaignName || ''} disabled /></div>
                                  <div><Label>Năm học</Label><Input value={resultData.academicYear || ''} disabled /></div>
                                  <div><Label>Ngày khám</Label><Input value={resultData.checkDate || ''} disabled /></div>
                                  <div><Label>Người khám</Label><Input value={resultData.checkedByName || ''} disabled /></div>
                                  <div><Label>Chiều cao (cm)</Label><Input value={resultData.heightCm || ''} disabled /></div>
                                  <div><Label>Cân nặng (kg)</Label><Input value={resultData.weightKg || ''} disabled /></div>
                                  <div><Label>BMI</Label><Input value={resultData.bmi || ''} disabled /></div>
                                  <div><Label>Thị lực trái</Label><Input value={resultData.visionLeft || ''} disabled /></div>
                                  <div><Label>Thị lực phải</Label><Input value={resultData.visionRight || ''} disabled /></div>
                                  <div><Label>Thính lực</Label><Input value={resultData.hearing || ''} disabled /></div>
                                  <div><Label>Răng miệng</Label><Input value={resultData.dentalHealth || ''} disabled /></div>
                                  <div><Label>Huyết áp</Label><Input value={resultData.bloodPressure || ''} disabled /></div>
                                  <div><Label>Mạch</Label><Input value={resultData.pulse || ''} disabled /></div>
                                  <div><Label>Nhiệt độ</Label><Input value={resultData.temperature || ''} disabled /></div>
                                  <div className="col-span-2"><Label>Ghi chú</Label><Textarea value={resultData.otherNotes || ''} disabled /></div>
                                  <div className="col-span-2"><Label>Khuyến nghị</Label><Input value={resultData.recommendation || ''} disabled /></div>
                                  <div className="col-span-2"><Label>Theo dõi</Label><Textarea value={resultData.followUpNotes || ''} disabled /></div>
                                  <div><Label>Xếp loại sức khỏe</Label><Input value={resultData.overallHealthRating || ''} disabled /></div>
                                  <div><Label>Trạng thái</Label><Input value={resultData.healthStatus || ''} disabled /></div>
                                  <div className="col-span-2 flex justify-end gap-2 mt-2">
                                    <Button variant="outline" onClick={() => setViewResult(false)}>Đóng</Button>
                                  </div>
                                </form>
                              ) : (
                                <div className="text-center text-red-500 py-8">Không có dữ liệu kết quả khám.</div>
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
                        {campaignStatus === 'APPROVED' && consent.status === 'DONEs' && (
                          <Button onClick={() => handleConfirmConsultation(consent)} size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                            <CalendarCheck2 className="w-4 h-4 mr-1" /> Xác nhận tư vấn
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-between items-center mt-4">
                <span>Trang {page + 1} / {totalPages}</span>
                <div className="flex gap-2">
                  <Button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Trang trước</Button>
                  <Button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Trang sau</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HealthCheck
