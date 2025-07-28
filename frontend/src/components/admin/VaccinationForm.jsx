import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const VaccinationForm = ({ formData, setFormData, onCancel, onSubmit, isEdit = false, loading = false, errors = {} }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Tên chiến dịch tiêm</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nhập tên chiến dịch tiêm"
        />
        {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="vaccineType">Loại vắc xin</Label>
        <Input
          id="vaccineType"
          value={formData.vaccineType}
          onChange={(e) => setFormData({ ...formData, vaccineType: e.target.value })}
          placeholder="Nhập loại vắc xin"
        />
        {errors.vaccineType && <div className="text-red-500 text-sm">{errors.vaccineType}</div>}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="manufacturer">Nhà sản xuất</Label>
        <Input
          id="manufacturer"
          value={formData.manufacturer}
          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
          placeholder="Nhập tên nhà sản xuất"
        />
        {errors.manufacturer && <div className="text-red-500 text-sm">{errors.manufacturer}</div>}
      </div>
      <div></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startDate">Ngày bắt đầu(phải sau ngày hôm nay ít nhất 30 ngày)</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
        {errors.startDate && <div className="text-red-500 text-sm">{errors.startDate}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">Ngày kết thúc</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
        {errors.endDate && <div className="text-red-500 text-sm">{errors.endDate}</div>}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="targetGrade">Khối lớp</Label>
        <Input
          id="targetGrade"
          type="text"
          value={formData.targetGrade}
          onChange={e => {
            // Chỉ cho phép số, dấu phẩy, dấu cách
            const value = e.target.value.replace(/[^0-9, ]/g, '');
            setFormData({ ...formData, targetGrade: value });
          }}
          placeholder="6,7,8"
        />
        {errors.targetGrade && <div className="text-red-500 text-sm">{errors.targetGrade}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Ghi chú</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Nhập ghi chú (tùy chọn)"
        />
        {errors.notes && <div className="text-red-500 text-sm">{errors.notes}</div>}
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="location">Tên địa điểm tiêm</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Nhập tên quốc gia"
        />
        {errors.location && <div className="text-red-500 text-sm">{errors.location}</div>}
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="description">Mô tả</Label>
      <textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Nhập mô tả chiến dịch tiêm"
        className="w-full p-2 border border-gray-300 rounded-md resize-none h-20"
      />
      {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
    </div>
    <div className="flex justify-end space-x-2 pt-4">
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={loading}
      >
        Hủy
      </Button>
      <Button
        onClick={onSubmit}
        className="btn-primary"
        disabled={loading}
      >
        {isEdit ? 'Cập nhật' : 'Tạo mới'}
      </Button>
    </div>
  </div>
);

export default VaccinationForm;