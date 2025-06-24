import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MedicineForm = ({ initialData, onSubmit, onCancel, isEdit }) => {
  const [formData, setFormData] = useState({
    medicationName: '',
    category: '',
    dosageForm: '',
    prescriptionRequired: false,
    countryOfOrigin: '',
    description: '',
    medicationInformation: '',
    medicationImg: '',
    activeIngredient: '',
    manufacturer: '',
    ...initialData
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="medicationName">Tên thuốc *</Label>
            <Input
              id="medicationName"
              value={formData.medicationName}
              onChange={(e) => handleChange('medicationName', e.target.value)}
              placeholder="Nhập tên thuốc"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Phân loại *</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phân loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Giảm đau, hạ sốt">Giảm đau, hạ sốt</SelectItem>
                <SelectItem value="Kháng sinh">Kháng sinh</SelectItem>
                <SelectItem value="Vitamin">Vitamin</SelectItem>
                <SelectItem value="Giảm đau, chống viêm">Giảm đau, chống viêm</SelectItem>
                <SelectItem value="Thuốc dạ dày">Thuốc dạ dày</SelectItem>
                <SelectItem value="Thuốc ho">Thuốc ho</SelectItem>
                <SelectItem value="Thuốc ngoài da">Thuốc ngoài da</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dosageForm">Dạng bào chế *</Label>
            <Select value={formData.dosageForm} onValueChange={(value) => handleChange('dosageForm', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Chọn dạng bào chế" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viên">Viên</SelectItem>
                <SelectItem value="chai">Chai</SelectItem>
                <SelectItem value="tuýp">Tuýp</SelectItem>
                <SelectItem value="gói">Gói</SelectItem>
                <SelectItem value="hộp">Hộp</SelectItem>
                <SelectItem value="lọ">Lọ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="countryOfOrigin">Nước sản xuất *</Label>
            <Input
              id="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={(e) => handleChange('countryOfOrigin', e.target.value)}
              placeholder="Nhập nước sản xuất"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Nhà sản xuất *</Label>
            <Input
              id="manufacturer"
              value={formData.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
              placeholder="Nhập nhà sản xuất"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activeIngredient">Hoạt chất *</Label>
            <Input
              id="activeIngredient"
              value={formData.activeIngredient}
              onChange={(e) => handleChange('activeIngredient', e.target.value)}
              placeholder="Nhập hoạt chất"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prescriptionRequired">Yêu cầu đơn thuốc *</Label>
          <Select 
            value={formData.prescriptionRequired.toString()} 
            onValueChange={(value) => handleChange('prescriptionRequired', value === 'true')}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn yêu cầu đơn thuốc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Có</SelectItem>
              <SelectItem value="false">Không</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicationInformation">Thông tin thuốc *</Label>
          <textarea
            id="medicationInformation"
            value={formData.medicationInformation}
            onChange={(e) => handleChange('medicationInformation', e.target.value)}
            placeholder="Nhập thông tin chi tiết về thuốc"
            className="w-full p-2 border border-input rounded-md resize-none h-20 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Ghi chú</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Nhập ghi chú (tùy chọn)"
            className="w-full p-2 border border-input rounded-md resize-none h-20 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medicationImg">URL hình ảnh</Label>
          <Input
            id="medicationImg"
            value={formData.medicationImg}
            onChange={(e) => handleChange('medicationImg', e.target.value)}
            placeholder="Nhập URL hình ảnh thuốc"
            type="url"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="btn-primary"
        >
          {isEdit ? 'Cập nhật' : 'Thêm thuốc'}
        </Button>
      </div>
    </form>
  );
};

export default MedicineForm;