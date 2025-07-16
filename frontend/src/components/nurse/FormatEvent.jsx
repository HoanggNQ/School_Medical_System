import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import medicalService from "@/api/services/medical.service";
import studentService from "@/api/services/student.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-screen-lg mx-auto w-full bg-white p-6 rounded-xl shadow-md border border-blue-100"
      style={{ overflow: "visible" }}
    >
      <Card className="rounded-xl shadow-md bg-white border border-blue-100">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100">
          <CardTitle className="text-blue-800 font-bold flex items-center gap-2">
            {/* Icon y tế */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" /></svg>
            Thông tin sự kiện y tế
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
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
                        placeholder="Nhập tên học sinh"
                        required
                        autoComplete="off"
                        className="rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                      />

                      {studentOptions.length > 0 && (
                        <ul className="absolute z-20 bg-white border border-blue-200 rounded-xl w-full mt-1 shadow-lg max-h-60 overflow-y-auto">
                          {studentOptions.map((s) => (
                            <li
                              key={s.studentId}
                              onClick={() => {
                                handleChange("studentId", s.studentId);
                                handleChange("studentName", s.fullName);
                                setStudentOptions([]);
                              }}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer transition"
                            >
                              {/* Avatar nếu có */}
                              {s.avatarUrl ? (
                                <img src={s.avatarUrl} alt="avatar" className="w-8 h-8 rounded-full border border-blue-200" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                                  {s.fullName?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-blue-900">{s.fullName}</div>
                                <div className="text-xs text-blue-500">
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
                      {studentOptions.length === 0 && formData.studentName.length >= 2 && (
                        <div className="absolute z-20 bg-white border border-blue-200 rounded-xl w-full mt-1 shadow-lg px-4 py-2 text-blue-500 text-sm">
                          Không tìm thấy học sinh phù hợp
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-2 bg-blue-50 rounded px-3 py-2 border border-blue-200">
                      <span className="font-medium text-blue-900">{formData.studentName}</span>
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
                  className="w-full p-2 border border-blue-200 rounded-lg resize-none h-20 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100"
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
                  className="rounded-lg border border-blue-200 focus:border-blue-400 focus:ring-blue-100"
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="rounded-full">
              Hủy
            </Button>
            <Button type="submit" className="btn-primary rounded-full bg-[#90CAF9] hover:bg-[#64b5f6] text-white font-semibold shadow" disabled={loading}>
              {isEdit ? "Cập nhật" : "Tạo sự kiện"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default EventForm;
