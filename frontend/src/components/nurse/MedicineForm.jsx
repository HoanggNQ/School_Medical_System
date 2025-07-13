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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="medicationName">Tên thuốc *</Label>
          <Input
            id="medicationName"
            value={formData.medicationName}
            onChange={(e) => handleChange("medicationName", e.target.value)}
            placeholder="Nhập tên thuốc"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Phân loại *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="Nhập phân loại"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dosageForm">Dạng bào chế *</Label>
          <Input
            id="dosageForm"
            value={formData.dosageForm}
            onChange={(e) => handleChange("dosageForm", e.target.value)}
            placeholder="Nhập dạng bào chế"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Số lượng *</Label>
          <Input
            id="quantity"
            type="number"
            min={0}
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", Number(e.target.value))}
            placeholder="Nhập số lượng"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manufacturer">Nhà sản xuất *</Label>
          <Input
            id="manufacturer"
            value={formData.manufacturer}
            onChange={(e) => handleChange("manufacturer", e.target.value)}
            placeholder="Nhập nhà sản xuất"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="countryOfOrigin">Nước sản xuất *</Label>
          <Input
            id="countryOfOrigin"
            value={formData.countryOfOrigin}
            onChange={(e) => handleChange("countryOfOrigin", e.target.value)}
            placeholder="Nhập nước sản xuất"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exp">Ngày hết hạn *</Label>
          <Input
            id="exp"
            type="date"
            value={formData.exp || ''}
            onChange={(e) => handleChange("exp", e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="medicationInformation">Thông tin sử dụng *</Label>
        <textarea
          id="medicationInformation"
          value={formData.medicationInformation}
          onChange={(e) => handleChange("medicationInformation", e.target.value)}
          placeholder="Nhập thông tin sử dụng"
          className="w-full p-2 border border-input rounded-md resize-none h-20 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
        />
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
      {/* <div className="space-y-2">
        <Label htmlFor="activeIngredient">Hoạt chất *</Label>
        <Input
          id="activeIngredient"
          value={formData.activeIngredient}
          onChange={(e) => handleChange("activeIngredient", e.target.value)}
          placeholder="Nhập hoạt chất"
          required
        />
      </div> */}
      <div className="space-y-2">
        <Label htmlFor="imageFile">Chọn ảnh từ máy tính</Label>
        <Input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            handleChange("image", file || null);
          }}
          className="cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="max-w-xs max-h-40 object-contain rounded-md"
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
      <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" className="btn-primary">
          {isEdit ? "Cập nhật" : "Thêm thuốc"}
        </Button>
      </div>
    </form>
  );
};

export default MedicineForm;
