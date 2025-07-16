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
import EventForm from "./FormatEvent";

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
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Chuẩn hóa dữ liệu gửi lên API
      const payload = {
        eventType: formData.eventType,
        description: formData.description,
        location: formData.location,
        reportedById: formData.reportedById ? Number(formData.reportedById) : null,
        studentId: formData.studentId ? Number(formData.studentId) : null,
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

  // const filteredEvents = events.filter(event => {
  //   const matchesSearch = 
  //     event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     event.studentId.toString().includes(searchTerm)
    
  //   const matchesStatus = statusFilter === "all" || event.status === statusFilter

  //   return matchesSearch && matchesStatus
  // })

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

  const handleSubmitEventForm = async (formData) => {
    setLoading(true);
    try {
      // Lấy dữ liệu event từ FormData (nếu bạn dùng FormData như trong FormatEvent)
      let eventObj = formData;
      if (formData instanceof FormData) {
        eventObj = JSON.parse(formData.get("event"));
      }
      if (selectedEvent) {
        await medicalService.updateMedicalEvent(selectedEvent.id, eventObj);
        toast({
          title: "Thành công",
          description: "Đã cập nhật sự kiện y tế",
        });
      } else {
        await medicalService.createMedicalEvent(eventObj);
        toast({
          title: "Thành công",
          description: "Đã tạo sự kiện y tế mới",
        });
      }
      setShowForm(false);
      setSelectedEvent(null);
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

  return (
    <div className="container mx-auto p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
          {/* Icon y tế */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" /></svg>
          Quản lý sự kiện y tế
        </h1>
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
          className="flex items-center space-x-2 rounded-full bg-[#90CAF9] hover:bg-[#64b5f6] text-white font-semibold shadow"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo sự kiện mới</span>
        </Button>
      </div>

      {showForm ? (
        <EventForm
          initialData={selectedEvent}
          isEdit={!!selectedEvent}
          onSuccess={() => {
            fetchEvents(); // <-- Gọi lại API lấy danh sách mới
            setShowForm(false);
            setSelectedEvent(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setSelectedEvent(null);
          }}
        />
      ) : (
        <>
          <Card className="rounded-xl shadow-md bg-white border border-blue-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-blue-400" />
                <Input
                  placeholder="Tìm kiếm theo loại sự kiện, mô tả hoặc mã học sinh..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                  className="pl-10 rounded-lg border border-blue-100 focus:border-blue-400 font-sans"
                />
              </div>
            </div>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-blue-200" />
              <h3 className="mt-2 text-sm font-medium text-blue-800">Không tìm thấy sự kiện</h3>
              <p className="mt-1 text-sm text-blue-500">
                Không có sự kiện nào phù hợp với điều kiện tìm kiếm của bạn.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <Card key={event.id} className="rounded-xl shadow-md bg-white border border-blue-100 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-blue-900">{event.eventType}</h3>
                        <p className="text-sm text-blue-500">Mã HS: {event.studentId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold shadow ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <p className="text-sm text-blue-800 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center text-sm text-blue-500 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.eventDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex justify-between items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center space-x-2 rounded-full border-blue-400 text-blue-700 hover:bg-blue-50 font-sans">
                            <Eye className="h-4 w-4" />
                            <span>Chi tiết</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl w-full max-h-[80vh] overflow-y-auto bg-blue-50 border border-blue-300 rounded-lg shadow-lg">
                          <DialogHeader>
                            <DialogTitle className="text-blue-800">Chi tiết sự kiện</DialogTitle>
                          </DialogHeader>
                          <div className="flex flex-col gap-4 py-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-800 min-w-[140px]">Loại sự kiện:</span>
                              <span className="text-blue-900">{event.eventType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-800 min-w-[140px]">Mô tả:</span>
                              <span className="text-blue-900">{event.description}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-800 min-w-[140px]">Địa điểm:</span>
                              <span className="text-blue-900">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-800 min-w-[140px]">Thời gian:</span>
                              <span className="text-blue-900">{new Date(event.eventDate).toLocaleString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-800 min-w-[140px]">Trạng thái:</span>
                              <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                                event.status === 'PENDING' ? 'bg-blue-100 text-blue-700 border border-blue-300' :
                                event.status === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-300' :
                                event.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-300' :
                                event.status === 'DONE' ? 'bg-blue-200 text-blue-800 border border-blue-400' :
                                'bg-gray-100 text-gray-600 border border-gray-300'
                              }`}>
                                {event.status}
                              </span>
                            </div>
                            {event.followUpNotes && (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-blue-800 min-w-[140px]">Ghi chú theo dõi:</span>
                                <span className="text-blue-900">{event.followUpNotes}</span>
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
                          className="flex items-center space-x-2 rounded-full text-blue-700 hover:bg-blue-50 font-sans"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Sửa</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="flex items-center space-x-2 rounded-full font-sans"
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
                  className="rounded-full border-blue-400 text-blue-700 hover:bg-blue-50 font-sans"
                >
                  Trang trước
                </Button>
                <span className="text-blue-700 font-semibold font-sans">
                  Trang {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="rounded-full border-blue-400 text-blue-700 hover:bg-blue-50 font-sans"
                >
                  Trang sau
                </Button>
                <span className="ml-4 text-sm text-blue-500 font-sans">Tổng: {totalElements} sự kiện</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Event