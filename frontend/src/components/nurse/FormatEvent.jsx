import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import medicalService from "@/api/services/medical.service";
import studentService from "@/api/services/student.service";

const EventForm = ({ initialData = {}, onCancel, isEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    eventType: "",
    description: "",
    location: "",
    studentId: "",
    studentName: "",
    followUpNotes: "",
    ...initialData,
  });

  const [studentOptions, setStudentOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...initialData,
      studentName: initialData?.student?.user?.fullName || "", // Nếu là edit
    }));
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.eventType.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.studentId.toString().trim()
    ) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền đầy đủ tất cả các trường thông tin.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(Number(formData.studentId)) || Number(formData.studentId) < 0) {
      toast({
        title: "Lỗi!",
        description: "Mã số học sinh không hợp lệ.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Lỗi!",
          description: "Bạn chưa đăng nhập!",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const payload = {
        eventType: formData.eventType,
        description: formData.description,
        location: formData.location,
        studentId: Number(formData.studentId),
        followUpNotes: formData.followUpNotes,
      };

      if (isEdit && initialData?.id) {
        const updatePayload = {
          studentId: Number(formData.studentId),
          status: formData.status || "PENDING",
          followUpNotes: formData.followUpNotes,
        };
        await medicalService.updateMedicalEvent(initialData.id, updatePayload);
        toast({
          title: "Thành công!",
          description: "Cập nhật sự kiện thành công.",
        });
        onSuccess?.();
        onCancel?.();
      } else {
        const response = await fetch("https://school-medical-system.onrender.com/api/v1/medical-event/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (response.ok && data?.code === "CREATE_SUCCESS") {
          toast({
            title: "Thành công!",
            description: "Tạo sự kiện thành công.",
          });
          onSuccess?.();
          onCancel?.();
        } else {
          toast({
            title: "Lỗi!",
            description: "Tạo thất bại: " + (data?.message || "Không rõ lỗi."),
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Lỗi!",
        description: "Lỗi khi gọi API: " + err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
      {isEdit ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="followUpNotes">Ghi chú theo dõi</Label>
            <Input
              id="followUpNotes"
              value={formData.followUpNotes}
              onChange={(e) => handleChange("followUpNotes", e.target.value)}
              placeholder="Nhập ghi chú theo dõi"
            />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventType">Tên sự kiện *</Label>
              <Input
                id="eventType"
                value={formData.eventType}
                onChange={(e) => handleChange("eventType", e.target.value)}
                placeholder="Nhập tên sự kiện"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Địa điểm *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="Nhập địa điểm"
                required
              />
            </div>
            <div className="space-y-2 relative col-span-2">
              <Label htmlFor="studentSearch">Học sinh *</Label>
              {!formData.studentId ? (
                <>
                  <Input
                    id="studentSearch"
                    value={formData.studentName || ""}
                    onChange={async (e) => {
                      const keyword = e.target.value;
                      handleChange("studentName", keyword);
                      handleChange("studentId", "");

                      if (keyword.length >= 2) {
                        try {
                          const results = await studentService.searchStudentsPaged(keyword);
                          setStudentOptions(results);
                        } catch (err) {
                          toast({
                            title: "Lỗi",
                            description: "Không thể tìm học sinh.",
                            variant: "destructive",
                          });
                        }
                      } else {
                        setStudentOptions([]);
                      }
                    }}
                    placeholder="Nhập tên, mã học sinh hoặc lớp"
                    required
                    autoComplete="off"
                  />

                  {studentOptions.length > 0 && (
                    <ul className="absolute z-10 bg-white border rounded w-full mt-1 shadow max-h-48 overflow-y-auto">
                      {studentOptions.map((s) => (
                        <li
                          key={s.studentId}
                          onClick={() => {
                            handleChange("studentId", s.studentId);
                            handleChange("studentName", s.fullName);
                            setStudentOptions([]);
                          }}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                     
                          {s.avatarUrl ? (
                            <img src={s.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                              {s.fullName?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{s.fullName}</div>
                            <div className="text-xs text-gray-500">
                              Lớp: {s.className} | Mã: {s.studentCode}
                            </div>
                            <div className="text-xs text-gray-400">
                              Phụ huynh: {s.parentName}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
                  <span className="font-medium">{formData.studentName}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => {
                      handleChange("studentId", "");
                      handleChange("studentName", "");
                    }}
                    title="Chọn lại học sinh"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Nhập mô tả"
              className="w-full p-2 border border-input rounded-md resize-none h-20 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="followUpNotes">Ghi chú theo dõi</Label>
            <Input
              id="followUpNotes"
              value={formData.followUpNotes}
              onChange={(e) => handleChange("followUpNotes", e.target.value)}
              placeholder="Nhập ghi chú theo dõi"
            />
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Hủy
        </Button>
        <Button type="submit" className="btn-primary" disabled={loading}>
          {isEdit ? "Cập nhật" : "Tạo sự kiện"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
