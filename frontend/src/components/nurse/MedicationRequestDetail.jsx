import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Pill, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import medicalService from '@/api/services/medical.service';

const MedicationRequestDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);

  useEffect(() => {
    fetchRequestDetail();
  }, [eventId]);

  const fetchRequestDetail = async () => {
    try {
      setLoading(true);
      const response = await medicalService.getMedicationRequestById(eventId);
      setRequest(response.data);
    } catch (err) {
      console.error('Error fetching request detail:', err);
      setError('Không thể tải chi tiết yêu cầu thuốc.');
      toast({
        title: 'Lỗi',
        description: 'Không thể tải chi tiết yêu cầu thuốc.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await medicalService.approveMedicationRequest(eventId);
      toast({
        title: 'Thành công',
        description: 'Yêu cầu thuốc đã được chấp nhận.',
      });
      fetchRequestDetail(); // Refresh data
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể chấp nhận yêu cầu thuốc.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    setProcessing(true);
    try {
      await medicalService.rejectMedicationRequest(eventId);
      toast({
        title: 'Thành công',
        description: 'Yêu cầu thuốc đã bị từ chối.',
      });
      fetchRequestDetail(); // Refresh data
    } catch (err) {
      toast({
        title: 'Lỗi',
        description: 'Không thể từ chối yêu cầu thuốc.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

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

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  const toggleDetails = () => {
    setExpandedDetails(!expandedDetails);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải chi tiết yêu cầu...</p>
          </div>
        </div>
      </div>
    );
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
    );
  }

  if (!request) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Pill className="h-20 w-20 text-gray-200 mb-4" />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy yêu cầu</h3>
          <p className="text-gray-500">Yêu cầu thuốc không tồn tại.</p>
        </div>
      </div>
    );
  }

  const medicationCount = Array.isArray(request.details) ? request.details.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chi tiết yêu cầu thuốc
            </h1>
            <p className="text-gray-600 mt-1">
              ID: {request.id} - {getStatusLabel(request.status)}
            </p>
          </div>
        </div>
        {/* <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 ${getStatusColor(getStatusLabel(request.status))}`}>
          {getStatusIcon(request.status)}
          <span>{getStatusLabel(request.status)}</span>
        </span> */}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
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
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(getStatusLabel(request.status))}`}>
                {getStatusLabel(request.status)}
              </span>
              {/* Thêm nút Chấp nhận và Từ chối nếu trạng thái là pending */}
              {request.status?.toLowerCase() === 'pending' && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    className="ml-2"
                    onClick={handleApprove}
                    disabled={processing}
                  >
                    Chấp nhận
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="ml-2"
                    onClick={handleReject}
                    disabled={processing}
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
                onClick={toggleDetails}
                className="flex items-center space-x-2"
              >
                {expandedDetails ? (
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
        {expandedDetails && medicationCount > 0 && (
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
    </motion.div>
  );
};

export default MedicationRequestDetail;