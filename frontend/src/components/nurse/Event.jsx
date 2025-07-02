"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, Search, Filter, Eye, Edit, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { medicalService } from "@/api/services/medical.service"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const Event = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formData, setFormData] = useState({
    eventType: "",
    description: "",
    location: "",
    reportedById: "",
    studentId: "",
    eventDate: "",
    status: "PENDING",
    followUpRequired: false,
    followUpNotes: ""
  })
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line
  }, [page, size, searchTerm, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = { search: searchTerm, page, size };
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const data = await medicalService.getAllMedicalEvents(params);
      setEvents(data.data?.medicalEvents || []);
      setTotalPages(data.data?.totalPages || 0);
      setTotalElements(data.data?.totalElements || 0);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách sự kiện",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Chuẩn hóa dữ liệu gửi lên API
      const payload = {
        eventType: formData.eventType,
        description: formData.description,
        location: formData.location,
        reportedById: formData.reportedById ? Number(formData.reportedById) : undefined,
        studentId: formData.studentId ? Number(formData.studentId) : undefined,
        eventDate: formData.eventDate,
        followUpRequired: formData.followUpRequired,
        followUpNotes: formData.followUpNotes
      };
      if (selectedEvent) {
        await medicalService.updateMedicalEvent(selectedEvent.id, payload)
        toast({
          title: "Thành công",
          description: "Đã cập nhật sự kiện y tế",
        })
      } else {
        await medicalService.createMedicalEvent(payload)
        toast({
          title: "Thành công",
          description: "Đã tạo sự kiện y tế mới",
        })
      }

      // Reset form and refresh list
      setFormData({
        eventType: "",
        description: "",
        location: "",
        reportedById: "",
        studentId: "",
        eventDate: "",
        status: "PENDING",
        followUpRequired: false,
        followUpNotes: ""
      })
      setSelectedEvent(null)
      setShowForm(false)
      fetchEvents()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event) => {
    setSelectedEvent(event)
    setFormData({
      eventType: event.eventType,
      description: event.description,
      location: event.location,
      reportedById: event.reportedById,
      studentId: event.studentId,
      eventDate: event.eventDate,
      status: event.status,
      followUpRequired: event.followUpRequired,
      followUpNotes: event.followUpNotes || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (eventId) => {
    setLoading(true);
    try {
      await medicalService.deleteMedicalEvent(eventId);
      toast({
        title: "Thành công",
        description: "Đã xoá sự kiện y tế",
      });
      fetchEvents();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

//   const filteredEvents = events.filter(event => {
//     const matchesSearch = 
//       event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.studentId.toString().includes(searchTerm)
    
//     const matchesStatus = statusFilter === "all" || event.status === statusFilter

//     return matchesSearch && matchesStatus
//   })

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800"
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "DONE":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const EventForm = () => (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="eventType">Tên sự kiện *</Label>
          <Input
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleInputChange}
            placeholder="Nhập tên sự kiện"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate">Ngày sự kiện *</Label>
          <Input
            id="eventDate"
            name="eventDate"
            type="datetime-local"
            value={formData.eventDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Địa điểm *</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Nhập địa điểm"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="studentId">Mã học sinh *</Label>
          <Input
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            placeholder="Nhập mã học sinh"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="reportedById">Người báo cáo *</Label>
          <Input
            id="reportedById"
            name="reportedById"
            value={formData.reportedById}
            onChange={handleInputChange}
            placeholder="Nhập mã người báo cáo"
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Mô tả *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Mô tả chi tiết về sự kiện..."
          rows={4}
          required
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="followUpRequired"
            name="followUpRequired"
            checked={formData.followUpRequired}
            onChange={handleInputChange}
            className="rounded border-gray-300"
          />
          <Label htmlFor="followUpRequired">Cần theo dõi thêm</Label>
        </div>
        {formData.followUpRequired && (
          <div className="space-y-2">
            <Label htmlFor="followUpNotes">Ghi chú theo dõi</Label>
            <Textarea
              id="followUpNotes"
              name="followUpNotes"
              value={formData.followUpNotes}
              onChange={handleInputChange}
              placeholder="Nhập các ghi chú cần theo dõi..."
              rows={3}
            />
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
        <Button type="button" variant="outline" onClick={() => {
          setShowForm(false);
          setSelectedEvent(null);
          setFormData({
            eventType: "",
            description: "",
            location: "",
            reportedById: "",
            studentId: "",
            eventDate: "",
            status: "PENDING",
            followUpRequired: false,
            followUpNotes: ""
          });
        }}>
          Hủy
        </Button>
        <Button type="submit" className="btn-primary">
          {selectedEvent ? "Cập nhật" : "Tạo sự kiện"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sự kiện y tế</h1>
        <Button
          onClick={() => {
            setShowForm(true);
            setSelectedEvent(null);
            setFormData({
              eventType: "",
              description: "",
              location: "",
              reportedById: "",
              studentId: "",
              eventDate: "",
              status: "PENDING",
              followUpRequired: false,
              followUpNotes: ""
            });
          }}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo sự kiện mới</span>
        </Button>
      </div>

      {showForm ? (
        <EventForm />
      ) : (
        <>
          <Card className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo loại sự kiện, mô tả hoặc mã học sinh..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                  className="rounded-md border border-gray-200 px-3 py-2"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="PENDING">Đang xử lý</option>
                  <option value="APPROVED">Đã duyệt</option>
                  <option value="REJECTED">Từ chối</option>
                  <option value="DONE">Hoàn thành</option>
                </select>
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy sự kiện</h3>
              <p className="mt-1 text-sm text-gray-500">
                Không có sự kiện nào phù hợp với điều kiện tìm kiếm của bạn.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{event.eventType}</h3>
                        <p className="text-sm text-gray-500">Mã HS: {event.studentId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.eventDate).toLocaleDateString('vi-VN')}
                    </div>

                    <div className="flex justify-between items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>Chi tiết</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Chi tiết sự kiện</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Loại sự kiện</Label>
                              <p className="mt-1">{event.eventType}</p>
                            </div>
                            <div>
                              <Label>Mô tả</Label>
                              <p className="mt-1">{event.description}</p>
                            </div>
                            <div>
                              <Label>Địa điểm</Label>
                              <p className="mt-1">{event.location}</p>
                            </div>
                            <div>
                              <Label>Thời gian</Label>
                              <p className="mt-1">{new Date(event.eventDate).toLocaleString('vi-VN')}</p>
                            </div>
                            {event.followUpRequired && (
                              <div>
                                <Label>Ghi chú theo dõi</Label>
                                <p className="mt-1">{event.followUpNotes}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          className="flex items-center space-x-2"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Sửa</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="flex items-center space-x-2"
                        >
                          <span>Xoá</span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {/* Pagination */}
              <div className="flex justify-center items-center mt-8 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                >
                  Trang trước
                </Button>
                <span>
                  Trang {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                >
                  Trang sau
                </Button>
                <span className="ml-4 text-sm text-gray-500">Tổng: {totalElements} sự kiện</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Event
