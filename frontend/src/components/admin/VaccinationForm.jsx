import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const VaccinationForm = ({ formData, setFormData, onCancel, onSubmit, isEdit = false, loading = false }) => (
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="vaccineType">Loại vắc xin</Label>
        <Input
          id="vaccineType"
          value={formData.vaccineType}
          onChange={(e) => setFormData({ ...formData, vaccineType: e.target.value })}
          placeholder="Nhập loại vắc xin"
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startDate">Ngày bắt đầu</Label>
        <Input
          id="startDate"
          type="date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">Ngày kết thúc</Label>
        <Input
          id="endDate"
          type="date"
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="targetGrade">Khối lớp</Label>
        <Input
          id="targetGrade"
          type="number"
          min={0}
          value={formData.targetGrade}
          onChange={(e) => setFormData({ ...formData, targetGrade: e.target.value })}
          placeholder="0 = toàn trường, 10, 11, ..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Ghi chú</Label>
        <Input
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Nhập ghi chú (tùy chọn)"
        />
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