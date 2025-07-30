
import { useEffect, useState } from "react"
import { medicalService } from "@/api/services/medical.service"
import { Button } from "@/components/ui/button"
import { AlertCircle, Stethoscope, Search, CheckCircle, ChevronLeft, ChevronRight, FileDown, FileUp } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import fileService from '@/api/services/file.service'

const HealthCheck = () => {
  const { toast } = useToast()
  const [studentsHealth, setStudentsHealth] = useState([])
  const [loadingHealth, setLoadingHealth] = useState(false)
  const [errororHealth, setErrorHealth] = useState(null)
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

    followUpNotes: '',
    overallHealthRating: '',

  })

  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [detailResult, setDetailResult] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const { campaignId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const campaignStatus = location.state?.campaignStatus;

  console.log("campaignId", campaignId);
  console.log("location.state", location.state);
  console.log("location", location);

  const handleViewDetail = async (consent) => {
    setSelectedStudent(consent);
    setShowDialog(true);
    setLoadingDetail(true);
    try {
      const res = await medicalService.getHealthCheckResultByConsentId(consent.consentId);
      setDetailResult(res.data.data); // <-- SỬA DÒNG NÀY
    } catch (err) {
      toast({ title: 'Lỗi', description: err?.message || 'Không thể lấy chi tiết kết quả.' });
      setDetailResult(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    if (!campaignId) {
      setStudentsHealth([])
      setCampaignName("");
      return
    }
    const fetchStudentsHealth = async () => {
      try {
        setLoadingHealth(true)
        setErrorHealth(null)

        const res = await medicalService.getHealthCheckConsentsByCampaign(campaignId, page, size);
        console.log("res", res);
        console.log("res", res);
        console.log("res", res);

        setStudentsHealth(res.data?.healthCheckConsents || []);
        setTotalPages(res.data?.totalPages || (res.data?.totalElements ? Math.ceil(res.data.totalElements / size) : 1));
        setCampaignName(res.data.healthCheckConsents[1].campaignName);

      } catch (error) {
        setErrorHealth("Không thể tải danh sách học sinh chuẩn bị khám sức khỏe.")
        setCampaignName("");
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
      followUpNotes: '',
      overallHealthRating: '',
    })
    setErrors({}); // Xóa lỗi khi mở dialog mới
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // Xóa lỗi khi người dùng nhập lại
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  const handleSubmitResult = async () => {
    if (!selectedStudent) return;

    const requiredFields = [
      'heightCm',
      'weightKg',
      'visionLeft',
      'visionRight',
      'hearing',
      'dentalHealth',
      'bloodPressure',
      'pulse',
      'temperature',
      'otherNotes',
      'recommendation',
      'followUpNotes',
      'overallHealthRating',
    ];

    const newErrors = {};

    // Kiểm tra rỗng
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Không được để trống.';
      }
    });

    // Kiểm tra numeric fields
    if (formData.heightCm && (Number(formData.heightCm) <= 0 || Number(formData.heightCm) > 250)) {
      newErrors.heightCm = 'Chiều cao phải từ 40 đến 250 cm.';
    }

    if (formData.weightKg && (Number(formData.weightKg) <= 0 || Number(formData.weightKg) > 200)) {
      newErrors.weightKg = 'Cân nặng phải từ 2 đến 200 kg.';
    }

    if (formData.pulse && (Number(formData.pulse) < 30 || Number(formData.pulse) > 200)) {
      newErrors.pulse = 'Mạch phải từ 30 đến 200 lần/phút.';
    }

    if (formData.temperature && (Number(formData.temperature) < 35 || Number(formData.temperature) > 42)) {
      newErrors.temperature = 'Nhiệt độ phải từ 35°C đến 42°C.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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
        overallHealthRating: formData.overallHealthRating,
      };

      const response = await medicalService.createHealthCheckResult(payload);
      toast({ title: 'Thành công', description: 'Đã ghi nhận kết quả khám sức khỏe.' });
      setShowDialog(false);
    } catch (error) {
      toast({ title: 'Lỗi', description: error?.message || 'Không thể ghi nhận kết quả.' });
    }
  };


  // Export handler
  const handleExport = async () => {
    try {
      const blob = await fileService.exportHealthCheckResult(campaignId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `health_check_results_campaign_${campaignId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({ title: 'Thành công', description: 'Xuất file thành công.' });
    } catch (error) {
      const errorMessage = error.customMessage ||
        error.response?.data?.message ||
        error.message ||
        'Đã có lỗi xảy ra.';

      console.log("Lỗi chi tiết:", error);
      console.log("customMessage chi tiết  :", error.customMessage);

      toast({
        title: 'Lỗi',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  // Import handler
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    try {
      await fileService.importHealthCheckResult(file);
      toast({ title: 'Thành công', description: 'Nhập file thành công.' });
    } catch (error) {
      let msg = error?.response?.data?.message || error?.message || 'Không thể nhập file.';
      toast({ title: 'Lỗi', description: msg });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Stethoscope className="h-6 w-6 text-blue-600" />Danh sách học sinh chuẩn bị khám sức khỏe</h2>
      </div>
      {loadingHealth ? (
        <div className="flex items-center justify-center min-h-[120px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <span className="ml-2 text-gray-600">Đang tải...</span>
        </div>
      ) : errororHealth ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{errororHealth}</span>
          </div>
        </div>
      ) : studentsHealth.length === 0 ? (
        <div className="text-center py-6">
          <Stethoscope className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">Không có học sinh nào chuẩn bị khám sức khỏe.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">

          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">{campaignName}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                onClick={handleExport}
                disabled={!campaignId}
                className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Export Excel
              </Button>
              <Button
                variant="default"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                disabled={importing}
              >
                <FileUp className="w-4 h-4" />
                {importing ? 'Đang nhập...' : 'Import Excel'}
              </Button>
              <input
                type="file"
                accept=".xlsx,.xls"
                ref={el => fileInputRef.current = el}
                style={{ display: 'none' }}
                onChange={handleImport}
              />
              {campaignId && (
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => navigate(`/consultation-schedules-nurse/${campaignId}`)}
                >
                  Xem lịch tư vấn
                </Button>
              )}
            </div>
          </div>

          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Id</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Tên học sinh</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Lớp</th>
                {/* <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Chiến dịch</th> */}
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Trạng thái</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Ghi nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {studentsHealth.map((consent) => (
                <tr key={consent.consentId}>
                  <td className="px-4 py-2 text-sm">{consent.consentId}</td>
                  <td className="px-4 py-2 text-sm">{consent.studentName}</td>
                  <td className="px-4 py-2 text-sm">{consent.className}</td>
                  {/* <td className="px-4 py-2 text-sm">{consent.campaignId}</td> */}
                  <td className="px-4 py-2 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
      ${consent.status === 'DONE' ? 'bg-green-100 text-green-800' :
                          consent.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            consent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              consent.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}
    `}
                    >
                      {consent.status === 'DONE' ? 'Đã khám' :
                        consent.status === 'APPROVED' ? 'Đã đồng ý' :
                          consent.status === 'PENDING' ? 'Chờ xác nhận' :
                            consent.status === 'REJECTED' ? 'Từ chối' :
                              consent.status || 'Không rõ'}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-sm flex gap-2">
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
                                <Input
                                  id="heightCm"
                                  name="heightCm"
                                  value={formData.heightCm}
                                  onChange={handleInputChange}
                                  placeholder="Nhập chiều cao (cm)"
                                  className={errors.heightCm ? "border-red-500" : ""}
                                />
                                {errors.heightCm && <p className="text-red-500 text-sm">{errors.heightCm}</p>}
                              </div>

                              <div>
                                <Label htmlFor="weightKg">Cân nặng (kg)</Label>
                                <Input
                                  id="weightKg"
                                  name="weightKg"
                                  value={formData.weightKg}
                                  onChange={handleInputChange}
                                  placeholder="Nhập cân nặng (kg)"
                                  className={errors.weightKg ? "border-red-500" : ""}
                                />
                                {errors.weightKg && <p className="text-red-500 text-sm">{errors.weightKg}</p>}
                              </div>

                              <div>
                                <Label htmlFor="visionLeft">Thị lực trái</Label>
                                <Input
                                  id="visionLeft"
                                  name="visionLeft"
                                  value={formData.visionLeft}
                                  onChange={handleInputChange}
                                  placeholder="VD: 10/10"
                                  className={errors.visionLeft ? "border-red-500" : ""}
                                />
                                {errors.visionLeft && <p className="text-red-500 text-sm">{errors.visionLeft}</p>}
                              </div>

                              <div>
                                <Label htmlFor="visionRight">Thị lực phải</Label>
                                <Input
                                  id="visionRight"
                                  name="visionRight"
                                  value={formData.visionRight}
                                  onChange={handleInputChange}
                                  placeholder="VD: 10/10"
                                  className={errors.visionRight ? "border-red-500" : ""}
                                />
                                {errors.visionRight && <p className="text-red-500 text-sm">{errors.visionRight}</p>}
                              </div>

                              <div>
                                <Label htmlFor="hearing">Thính lực</Label>
                                <Input
                                  id="hearing"
                                  name="hearing"
                                  value={formData.hearing}
                                  onChange={handleInputChange}
                                  placeholder="VD: Bình thường, nghe kém"
                                  className={errors.hearing ? "border-red-500" : ""}
                                />
                                {errors.hearing && <p className="text-red-500 text-sm">{errors.hearing}</p>}
                              </div>

                              <div>
                                <Label htmlFor="dentalHealth">Răng miệng</Label>
                                <Input
                                  id="dentalHealth"
                                  name="dentalHealth"
                                  value={formData.dentalHealth}
                                  onChange={handleInputChange}
                                  placeholder="VD: Không sâu răng, có mảng bám"
                                  className={errors.dentalHealth ? "border-red-500" : ""}
                                />
                                {errors.dentalHealth && <p className="text-red-500 text-sm">{errors.dentalHealth}</p>}
                              </div>

                              <div>
                                <Label htmlFor="bloodPressure">Huyết áp</Label>
                                <Input
                                  id="bloodPressure"
                                  name="bloodPressure"
                                  value={formData.bloodPressure}
                                  onChange={handleInputChange}
                                  placeholder="VD: 120/80"
                                  className={errors.bloodPressure ? "border-red-500" : ""}
                                />
                                {errors.bloodPressure && <p className="text-red-500 text-sm">{errors.bloodPressure}</p>}
                              </div>

                              <div>
                                <Label htmlFor="pulse">Mạch</Label>
                                <Input
                                  id="pulse"
                                  name="pulse"
                                  value={formData.pulse}
                                  onChange={handleInputChange}
                                  placeholder="VD: 75"
                                  className={errors.pulse ? "border-red-500" : ""}
                                />
                                {errors.pulse && <p className="text-red-500 text-sm">{errors.pulse}</p>}
                              </div>

                              <div>
                                <Label htmlFor="temperature">Nhiệt độ</Label>
                                <Input
                                  id="temperature"
                                  name="temperature"
                                  value={formData.temperature}
                                  onChange={handleInputChange}
                                  placeholder="VD: 36.5"
                                  className={errors.temperature ? "border-red-500" : ""}
                                />
                                {errors.temperature && <p className="text-red-500 text-sm">{errors.temperature}</p>}
                              </div>

                              <div>
                                <Label htmlFor="overallHealthRating">Đánh giá tổng thể</Label>
                                <Input
                                  id="overallHealthRating"
                                  name="overallHealthRating"
                                  value={formData.overallHealthRating}
                                  onChange={handleInputChange}
                                  placeholder="VD: Tốt, Trung bình"
                                  className={errors.overallHealthRating ? "border-red-500" : ""}
                                />
                                {errors.overallHealthRating && <p className="text-red-500 text-sm">{errors.overallHealthRating}</p>}
                              </div>

                              <div className="md:col-span-2">
                                <Label htmlFor="otherNotes">Ghi chú khác</Label>
                                <Textarea
                                  id="otherNotes"
                                  name="otherNotes"
                                  value={formData.otherNotes}
                                  onChange={handleInputChange}
                                  placeholder="Ghi chú thêm nếu có"
                                  className={errors.otherNotes ? "border-red-500" : ""}
                                />
                                {errors.otherNotes && <p className="text-red-500 text-sm">{errors.otherNotes}</p>}
                              </div>

                              <div className="md:col-span-2">
                                <Label htmlFor="recommendation">Khuyến nghị</Label>
                                <Input
                                  id="recommendation"
                                  name="recommendation"
                                  value={formData.recommendation}
                                  onChange={handleInputChange}
                                  placeholder="VD: Nên tái khám, theo dõi dinh dưỡng"
                                  className={errors.recommendation ? "border-red-500" : ""}
                                />
                                {errors.recommendation && <p className="text-red-500 text-sm">{errors.recommendation}</p>}
                              </div>

                              <div className="md:col-span-2">
                                <Label htmlFor="followUpNotes">Ghi chú theo dõi</Label>
                                <Textarea
                                  id="followUpNotes"
                                  name="followUpNotes"
                                  value={formData.followUpNotes}
                                  onChange={handleInputChange}
                                  placeholder="Thông tin theo dõi tiếp theo nếu có"
                                  className={errors.followUpNotes ? "border-red-500" : ""}
                                />
                                {errors.followUpNotes && <p className="text-red-500 text-sm">{errors.followUpNotes}</p>}
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <Button onClick={() => setShowDialog(false)} variant="outline" type="button">
                                Đóng
                              </Button>
                              <Button type="button" onClick={handleSubmitResult}>
                                Lưu kết quả
                              </Button>
                            </div>
                          </form>

                        </DialogContent>
                      </Dialog>
                    )}

                    {consent.status === 'DONE' && (
                      <Dialog open={showDialog && selectedStudent?.consentId === consent.consentId} onOpenChange={setShowDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetail(consent)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg px-4 py-2 transition-colors duration-200"
                          >
                            Xem chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Chi tiết kết quả khám sức khỏe</DialogTitle>
                          </DialogHeader>
                          {loadingDetail ? (
                            <div>Đang tải...</div>
                          ) : detailResult ? (
                            <div className="space-y-2">
                              <div><b>Tên học sinh:</b> {detailResult.studentName}</div>
                              <div><b>Chiều cao:</b> {detailResult.heightCm} cm</div>
                              <div><b>Cân nặng:</b> {detailResult.weightKg} kg</div>
                              <div><b>Thị lực trái:</b> {detailResult.visionLeft}</div>
                              <div><b>Thị lực phải:</b> {detailResult.visionRight}</div>
                              <div><b>Thính lực:</b> {detailResult.hearing}</div>
                              <div><b>Răng miệng:</b> {detailResult.dentalHealth}</div>
                              <div><b>Huyết áp:</b> {detailResult.bloodPressure}</div>
                              <div><b>Mạch:</b> {detailResult.pulse}</div>
                              <div><b>Nhiệt độ:</b> {detailResult.temperature}</div>
                              <div><b>Ghi chú khác:</b> {detailResult.otherNotes}</div>
                              <div><b>Khuyến nghị:</b> {detailResult.recommendation}</div>
                              <div><b>Ghi chú theo dõi:</b> {detailResult.followUpNotes}</div>
                              <div><b>Đánh giá tổng thể:</b> {detailResult.overallHealthRating}</div>
                            </div>
                          ) : (
                            <div>Không có dữ liệu chi tiết.</div>
                          )}
                          <div className="flex justify-end pt-2">
                            <Button onClick={() => setShowDialog(false)} variant="outline" type="button">Đóng</Button>
                          </div>
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