"use client"

import { useEffect, useState } from "react"
import { medicalService } from "@/api/services/medical.service"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Eye, EyeOff, Pill, User, Calendar, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const PlaceholderPage = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedRequests, setExpandedRequests] = useState(new Set())
  const { toast } = useToast()
  const [processingId, setProcessingId] = useState(null)
  const [approvedRequests, setApprovedRequests] = useState([])
  const [rejectedRequests, setRejectedRequests] = useState([])
  const [showApproved, setShowApproved] = useState(false)
  const [showRejected, setShowRejected] = useState(false)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await medicalService.getAllMedicationRequest()
        console.log("API data", data)
        setRequests(data)
      } catch (err) {
        setError("Không thể tải danh sách yêu cầu thuốc.")
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const toggleRequestDetails = (requestId) => {
    const newExpanded = new Set(expandedRequests)
    if (newExpanded.has(requestId)) {
      newExpanded.delete(requestId)
    } else {
      newExpanded.add(requestId)
    }
    setExpandedRequests(newExpanded)
  }

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

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
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Chờ duyệt';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      default:
        return 'Chờ duyệt';
    }
  };

  const handleAccept = async (requestId) => {
    setProcessingId(requestId)
    try {
      await medicalService.approveMedicationRequest(requestId)
      toast({ title: "Thành công", description: "Yêu cầu đã được chấp nhận." })
      const data = await medicalService.getAllMedicationRequest()
      setRequests(data)
      
    } catch (err) {
      toast({ title: "Lỗi", description: err?.message || "Không thể chấp nhận yêu cầu." })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId) => {
    setProcessingId(requestId)
    try {
      await medicalService.rejectMedicationRequest(requestId)
      toast({ title: "Thành công", description: "Yêu cầu đã bị từ chối." })
      const res = await medicalService.getAllRejectedMedicationRequest();
      setRejectedRequests(res.data || []);
    } catch (err) {
      toast({ title: "Lỗi", description: err?.message || "Không thể từ chối yêu cầu." })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách yêu cầu...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card className="rounded-xl shadow-md bg-white border border-blue-100 mb-6">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
          <CardTitle className="text-blue-800 font-bold flex items-center gap-2">
            {/* Icon y tế */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" /></svg>
            Quản lý yêu cầu cấp phát thuốc
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách yêu cầu thuốc</h1>
            <p className="text-gray-600">Quản lý và theo dõi các yêu cầu thuốc từ phụ huynh</p>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              className={`rounded-full px-6 py-2 font-semibold shadow transition ${showApproved ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
              onClick={async () => {
                setShowApproved(true);
                setShowRejected(false);
                setLoading(true);
                try {
                  const res = await medicalService.getAllApprovedMedicationRequest();
                  setApprovedRequests(res.data || []);
                  console.log("API data appro", res.data)
                } catch (err) {
                  setError("Không thể tải danh sách đã chấp nhận.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Danh sách chấp nhận
            </Button>
            <Button
              className={`rounded-full px-6 py-2 font-semibold shadow transition ${showRejected ? 'bg-red-600 text-white' : 'bg-white text-red-600 border border-red-600 hover:bg-red-50'}`}
              onClick={async () => {
                setShowRejected(true);
                setShowApproved(false);
                setLoading(true);
                try {
                  const res = await medicalService.getAllRejectedMedicationRequest();
                  setRejectedRequests(res.data || []);
                } catch (err) {
                  setError("Không thể tải danh sách đã từ chối.");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Danh sách từ chối
            </Button>
            <Button
              className={`rounded-full px-6 py-2 font-semibold shadow transition ${(!showApproved && !showRejected) ? 'bg-yellow-500 text-white' : 'bg-white text-yellow-600 border border-yellow-500 hover:bg-yellow-50'}`}
              onClick={() => {
                setShowApproved(false);
                setShowRejected(false);
              }}
            >
              Danh sách chờ duyệt
            </Button>
          </div>

          {showRejected ? (
            rejectedRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <Pill className="h-20 w-20 text-gray-200 mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Không có yêu cầu bị từ chối nào</h3>
                <p className="text-gray-500">Chưa có yêu cầu thuốc nào bị từ chối.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {rejectedRequests.map((request) => {
                  const isExpanded = expandedRequests.has(request.id)
                  const medicationCount = Array.isArray(request.details) ? request.details.length : 0
                  return (
                    <div
                      key={request.id}
                      className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Header Card */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Pill className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Yêu cầu #{request.id}</h3>
                              <p className="text-sm text-gray-500">{medicationCount} loại thuốc</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(getStatusLabel(request.status))}`}
                            >
                              {getStatusLabel(request.status)}
                            </span>
                          </div>
                        </div>
                        {/* Basic Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Học sinh</p>
                              <p className="font-medium text-gray-900">
                                {request.studentName} (ID: {request.studentId})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Năm học</p>
                              <p className="font-medium text-gray-900">{request.academicYear}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                              <p className="font-medium text-gray-900">{request.requestDate}</p>
                            </div>
                          </div>
                        </div>
                        {/* Notes */}
                        {request.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Ghi chú:</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.notes}</p>
                          </div>
                        )}
                        {/* Toggle Button */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="text-sm text-gray-500">
                            {medicationCount > 0 ? `${medicationCount} loại thuốc được yêu cầu` : "Không có thuốc nào"}
                          </div>
                          {medicationCount > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleRequestDetails(request.id)}
                              className="flex items-center space-x-2"
                            >
                              {isExpanded ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  <span>Ẩn chi tiết</span>
                                  <ChevronUp className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  <span>Xem chi tiết</span>
                                  <ChevronDown className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      {/* Expandable Medication Details */}
                      {isExpanded && medicationCount > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50">
                          <div className="p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Pill className="h-5 w-5 mr-2 text-blue-600" />
                              Danh sách thuốc chi tiết
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Tên thuốc
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Liều lượng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Tần suất
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Số lượng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Từ ngày
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Đến ngày
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Phụ huynh cung cấp
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {request.details.map((med, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{med.medicationName}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.dosage}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.frequency}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.quantity}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.startDate}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.endDate}</td>
                                      <td className="px-4 py-3 text-sm">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            med.providedByParent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {med.providedByParent ? "Có" : "Không"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : showApproved ? (
            approvedRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <Pill className="h-20 w-20 text-gray-200 mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Không có yêu cầu đã chấp nhận nào</h3>
                <p className="text-gray-500">Chưa có yêu cầu thuốc nào được duyệt.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {approvedRequests.map((request) => {
                  const isExpanded = expandedRequests.has(request.id)
                  const medicationCount = Array.isArray(request.details) ? request.details.length : 0
                  return (
                    <div
                      key={request.id}
                      className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Header Card */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Pill className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Yêu cầu #{request.id}</h3>
                              <p className="text-sm text-gray-500">{medicationCount} loại thuốc</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(getStatusLabel(request.status))}`}
                            >
                              {getStatusLabel(request.status)}
                            </span>
                          </div>
                        </div>
                        {/* Basic Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Học sinh</p>
                              <p className="font-medium text-gray-900">
                                {request.studentName} (ID: {request.studentId})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Năm học</p>
                              <p className="font-medium text-gray-900">{request.academicYear}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                              <p className="font-medium text-gray-900">{request.requestDate}</p>
                            </div>
                          </div>
                        </div>
                        {/* Notes */}
                        {request.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Ghi chú:</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.notes}</p>
                          </div>
                        )}
                        {/* Toggle Button */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="text-sm text-gray-500">
                            {medicationCount > 0 ? `${medicationCount} loại thuốc được yêu cầu` : "Không có thuốc nào"}
                          </div>
                          {medicationCount > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleRequestDetails(request.id)}
                              className="flex items-center space-x-2"
                            >
                              {isExpanded ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  <span>Ẩn chi tiết</span>
                                  <ChevronUp className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  <span>Xem chi tiết</span>
                                  <ChevronDown className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      {/* Expandable Medication Details */}
                      {isExpanded && medicationCount > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50">
                          <div className="p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Pill className="h-5 w-5 mr-2 text-blue-600" />
                              Danh sách thuốc chi tiết
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Tên thuốc
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Liều lượng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Tần suất
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Số lượng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Từ ngày
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Đến ngày
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Phụ huynh cung cấp
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {request.details.map((med, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{med.medicationName}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.dosage}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.frequency}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.quantity}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.startDate}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.endDate}</td>
                                      <td className="px-4 py-3 text-sm">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            med.providedByParent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {med.providedByParent ? "Có" : "Không"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <Pill className="h-20 w-20 text-gray-200 mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Không có yêu cầu nào</h3>
                <p className="text-gray-500">Chưa có yêu cầu thuốc nào được gửi đến.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((request) => {
                  const isExpanded = expandedRequests.has(request.id)
                  const medicationCount = Array.isArray(request.details) ? request.details.length : 0

                  return (
                    <div
                      key={request.id}
                      className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      {/* Header Card */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Pill className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900">Yêu cầu #{request.id}</h3>
                              <p className="text-sm text-gray-500">{medicationCount} loại thuốc</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(getStatusLabel(request.status))}`}
                            >
                              {getStatusLabel(request.status)}
                            </span>
                            {/* Thêm nút Chấp nhận và Từ chối nếu trạng thái là pending */}
                            {request.status?.toLowerCase() === 'pending' && (
                              <>
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="ml-2"
                                  onClick={() => handleAccept(request.id)}
                                  disabled={processingId === request.id}
                                >
                                  Chấp nhận
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="ml-2"
                                  onClick={() => handleReject(request.id)}
                                  disabled={processingId === request.id}
                                >
                                  Từ chối
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Basic Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Học sinh</p>
                              <p className="font-medium text-gray-900">
                                {request.studentName} (ID: {request.studentId})
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Năm học</p>
                              <p className="font-medium text-gray-900">{request.academicYear}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-500">Ngày yêu cầu</p>
                              <p className="font-medium text-gray-900">{request.requestDate}</p>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {request.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Ghi chú:</p>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.notes}</p>
                          </div>
                        )}

                        {/* Toggle Button */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div className="text-sm text-gray-500">
                            {medicationCount > 0 ? `${medicationCount} loại thuốc được yêu cầu` : "Không có thuốc nào"}
                          </div>
                          {medicationCount > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleRequestDetails(request.id)}
                              className="flex items-center space-x-2"
                            >
                              {isExpanded ? (
                                <>
                                  <EyeOff className="h-4 w-4" />
                                  <span>Ẩn chi tiết</span>
                                  <ChevronUp className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  <Eye className="h-4 w-4" />
                                  <span>Xem chi tiết</span>
                                  <ChevronDown className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Medication Details */}
                      {isExpanded && medicationCount > 0 && (
                        <div className="border-t border-gray-100 bg-gray-50">
                          <div className="p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Pill className="h-5 w-5 mr-2 text-blue-600" />
                              Danh sách thuốc chi tiết
                            </h4>

                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Tên thuốc
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Liều lượng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Tần suất
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Số lượng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Từ ngày
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Đến ngày
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                      Phụ huynh cung cấp
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {request.details.map((med, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{med.medicationName}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.dosage}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.frequency}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.quantity}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.startDate}</td>
                                      <td className="px-4 py-3 text-sm text-gray-700">{med.endDate}</td>
                                      <td className="px-4 py-3 text-sm">
                                        <span
                                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            med.providedByParent ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {med.providedByParent ? "Có" : "Không"}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PlaceholderPage
