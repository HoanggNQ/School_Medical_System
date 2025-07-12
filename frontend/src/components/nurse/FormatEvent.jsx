import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import medicalService from "@/api/services/medical.service";

const EventForm = ({ initialData = {}, onCancel, isEdit, onSuccess }) => {
  const [formData, setFormData] = useState({
    eventType: "",
    description: "",
    location: "",
    studentId: "",
    followUpNotes: "",
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (
      !formData.eventType.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.studentId.toString().trim()
    ) {
      toast({
        title: "Lỗi!",
        description: "Vui lòng điền đầy đủ tất cả các trường thông tin.",
        variant: "destructive"
      });
      return;
    }
    if (isNaN(Number(formData.studentId)) || Number(formData.studentId) < 0) {
      toast({
        title: "Lỗi!",
        description: "Mã số học sinh phải là số không âm.",
        variant: "destructive"
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
          variant: "destructive"
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
      if (isEdit && initialData && initialData.id) {
        // Format payload đúng yêu cầu API
        const payload = {
          studentId: Number(formData.studentId),
          status: formData.status || "PENDING",
          followUpNotes: formData.followUpNotes,
          // Thêm các trường khác nếu cần
        };
        try {
          await medicalService.updateMedicalEvent(initialData.id, payload);
          toast({
            title: "Thành công!",
            description: "Thông tin sự kiện đã được cập nhật.",
          });
          if (onSuccess) onSuccess();
          if (onCancel) onCancel();
        } catch (err) {
          toast({
            title: "Lỗi!",
            description: "Cập nhật sự kiện thất bại: " + (err.message || "Unknown error"),
            variant: "destructive"
          });
        }
      } else {
        // Tạo mới sự kiện
        let response, data;
        try {
          response = await fetch("https://school-medical-system.onrender.com/api/v1/medical-event/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });
          data = await response.json();
        } catch (err) {
          toast({
            title: "Lỗi!",
            description: "Không thể kết nối tới máy chủ: " + err.message,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
        if (response.ok && data?.code === "CREATE_SUCCESS") {
          toast({
            title: "Thành công!",
            description: "Sự kiện mới đã được tạo thành công.",
          });
          if (onSuccess) onSuccess();
          if (onCancel) onCancel();
        } else {
          toast({
            title: "Lỗi!",
            description: "Tạo sự kiện thất bại: " + (data?.message || "Unknown error"),
            variant: "destructive"
          });
        }
      }
    } catch (err) {
      toast({
        title: "Lỗi!",
        description: "Lỗi khi gọi API: " + err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
      {isEdit ? (
        <>
          {/* Ẩn trường Trạng thái, chỉ hiển thị Ghi chú theo dõi */}
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
            <div className="space-y-2">
              <Label htmlFor="studentId">Mã học sinh *</Label>
              <Input
                id="studentId"
                type="number"
                value={formData.studentId}
                onChange={(e) => handleChange("studentId", e.target.value)}
                placeholder="Nhập mã học sinh"
                required
              />
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