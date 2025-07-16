import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import medicalService from "@/api/services/medical.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MedicineForm = ({ initialData, onSubmit, onCancel, isEdit }) => {
  const [formData, setFormData] = useState({
    medicationName: "",
    category: "",
    dosageForm: "",
    countryOfOrigin: "",
    description: "",
    medicationInformation: "",
    // activeIngredient: "",
    manufacturer: "",
    quantity: 0,
    exp: "",
    image: null,
    ...initialData,
  });

  const [imagePreview, setImagePreview] = useState(
    initialData.medicationImg || ""
  );

  const { toast } = useToast();

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
    setImagePreview(initialData.medicationImg || "");
  }, [initialData]);

  const handleChange = (field, value) => {
    if (field === "image") {
      setFormData((prev) => ({
        ...prev,
        image: value,
        medicationImg: value ? "" : prev.medicationImg,
      }));
      if (value) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(value);
      } else {
        setImagePreview(initialData.medicationImg || "");
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation: ngày hết hạn phải sau ngày hiện tại
    const today = new Date();
    const expDate = new Date(formData.exp);
    if (expDate <= today) {
      toast({
        title: "Lỗi!",
        description: "Ngày hết hạn phải sau ngày hiện tại.",
        variant: "destructive"
      });
      return;
    }
    const medication = {
      medicationName: formData.medicationName,
      category: formData.category,
      dosageForm: formData.dosageForm,
      countryOfOrigin: formData.countryOfOrigin,
      description: formData.description,
      medicationInformation: formData.medicationInformation,
      manufacturer: formData.manufacturer,
      quantity: formData.quantity,
      exp: formData.exp,
      image: formData.image // truyền file image lên luôn
    };
    if (onSubmit) onSubmit(medication);
  };
  

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-h-[100vh] overflow-y-auto overflow-x-hidden px-1">
      <Card className="rounded-xl shadow-md bg-white border border-blue-100">
        <CardHeader className="bg-[#E3F2FD] rounded-t-xl border-b border-blue-100 flex items-center gap-3 py-4 px-6">
          <span className="bg-blue-200 p-2 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" /></svg>
          </span>
          <span className="text-2xl font-bold text-blue-800">Thông tin thuốc</span>
        </CardHeader>
        <CardContent className="bg-white px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
            <div className="flex flex-col">
              <Label htmlFor="medicationName" className="mb-1 text-base font-medium text-gray-700">Tên thuốc *</Label>
              <Input
                id="medicationName"
                value={formData.medicationName}
                onChange={(e) => handleChange("medicationName", e.target.value)}
                placeholder="Nhập tên thuốc"
                required
                className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="category" className="mb-1 text-base font-medium text-gray-700">Phân loại *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                placeholder="Nhập phân loại"
                required
                className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="dosageForm" className="mb-1 text-base font-medium text-gray-700">Dạng bào chế *</Label>
              <Input
                id="dosageForm"
                value={formData.dosageForm}
                onChange={(e) => handleChange("dosageForm", e.target.value)}
                placeholder="Nhập dạng bào chế"
                required
                className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="quantity" className="mb-1 text-base font-medium text-gray-700">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number(e.target.value))}
                placeholder="Nhập số lượng"
                required
                className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="manufacturer" className="mb-1 text-base font-medium text-gray-700">Nhà sản xuất *</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleChange("manufacturer", e.target.value)}
                placeholder="Nhập nhà sản xuất"
                required
                className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="countryOfOrigin" className="mb-1 text-base font-medium text-gray-700">Nước sản xuất *</Label>
              <Input
                id="countryOfOrigin"
                value={formData.countryOfOrigin}
                onChange={(e) => handleChange("countryOfOrigin", e.target.value)}
                placeholder="Nhập nước sản xuất"
                required
                className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="exp" className="mb-1 text-base font-medium text-gray-700">Ngày hết hạn *</Label>
              <Input
                id="exp"
                type="date"
                value={formData.exp || ''}
                onChange={(e) => handleChange("exp", e.target.value)}
                required
                className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
              />
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <Label htmlFor="medicationInformation" className="mb-1 text-base font-medium text-gray-700">Thông tin sử dụng *</Label>
            <textarea
              id="medicationInformation"
              value={formData.medicationInformation}
              onChange={(e) => handleChange("medicationInformation", e.target.value)}
              placeholder="Nhập thông tin sử dụng"
              className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base resize-none"
              required
            />
          </div>
          <div className="flex flex-col mt-4">
            <Label htmlFor="description" className="mb-1 text-base font-medium text-gray-700">Mô tả *</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Nhập mô tả"
              className="w-full rounded-lg border border-blue-200 bg-white text-gray-900 px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base resize-none"
              required
            />
          </div>
          <div className="flex flex-col items-center mt-4">
            <Label htmlFor="imageFile" className="mb-1 text-base font-medium text-gray-700">Chọn ảnh từ máy tính</Label>
            <Input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                handleChange("image", file || null);
              }}
              className="cursor-pointer w-full border border-blue-200 rounded-lg bg-white text-gray-900 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition text-base"
            />
            {imagePreview && (
              <div className="mt-2 flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="max-w-xs max-h-40 object-contain rounded-md border border-blue-200"
                />
                {isEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        image: null,
                      }));
                      setImagePreview("");
                    }}
                  >
                    Xóa ảnh hiện tại
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-3 pt-4 mt-2 border-t">
        <Button type="button" variant="outline" onClick={onCancel} className="px-6 py-2 rounded-lg text-base">
          Hủy
        </Button>
        <Button type="submit" className="btn-primary px-6 py-2 rounded-lg text-base">
          {isEdit ? "Cập nhật" : "Thêm thuốc"}
        </Button>
      </div>
    </form>
  );
};

export default MedicineForm;